#!/usr/bin/Rscript

library(kohonen)
library(stringr)
library(text2vec)
library(tidyverse)

# Import data -------------------------------------------------------------
data("movie_review")

# reddit_comments <- read_rds("reddit_comments.rds")
banned_subreddits <- read_lines("banned_subreddits")

reddit_comments <- bind_rows(movie_review[1:700, ], movie_review[1:700, ]) %>% 
  select(subreddit = id, text = review) %>% 
  group_by(subreddit) %>% 
  summarize_at("text", paste, collapse = " ") %>% 
  mutate(bad_subreddit = if_else(
    1:nrow(.) %in% sample(1:nrow(.), 50), "bad", "good"
  ))

# Create vocabulary -------------------------------------------------------
prep_fun <- . %>% 
  str_to_lower() %>%
  str_replace_all(c("[^[:alpha:]]" = " ", "\\s+" = " "))

reddit_comments <- reddit_comments %>% 
  mutate_at("text", prep_fun)

it <- itoken(reddit_comments$text, progressbar = FALSE)
v  <- create_vocabulary(it) %>% 
  prune_vocabulary(doc_proportion_max = 0.1, term_count_min = 5)

vectorizer <- vocab_vectorizer(v)

# Create LSI features -----------------------------------------------------
dtm   <- create_dtm(it, vectorizer)
tfidf <- TfIdf$new()
lsa   <- LSA$new(n_topics = 10)

doc_embeddings <- dtm %>% 
  fit_transform(tfidf) %>% 
  fit_transform(lsa)

# Train Document Map ------------------------------------------------------
batchsom <- function(x, xdim, ydim) {
  grid_ <- partial(somgrid, topo = "hexagonal", neighbourhood.fct = "gaussian")
  som_  <- partial(som, mode = "batch", dist.fcts = "euclidean", rlen = 500)
  
  som_(
    x,
    grid = grid_(xdim = xdim, ydim = ydim),
    init = som::som.init(x, xdim = xdim, ydim = ydim),
    radius = c(max(c(xdim, ydim)) * 0.2, max(c(xdim, ydim)) * 0.05)
  ) %>% 
    getCodes() %>% 
    som_(
      x,
      grid = grid_(xdim = xdim, ydim = ydim),
      init = .,
      radius = c(max(c(xdim, ydim)) * 0.05, max(c(xdim, ydim)) * 0.05) 
    )
}

document_map <- batchsom(doc_embeddings, 35, 20)

# Calculate score ---------------------------------------------------------
lsq <- doc_embeddings %>% 
  apply(1, function(x) pracma::lsqnonneg(t(document_map[["codes"]][[1]]), x)$x) %>% 
  as_tibble() %>% 
  as.matrix() %>% 
  t() %>% 
  as_tibble() %>% 
  add_column(
    subreddit     = reddit_comments$subreddit, 
    bad_subreddit = reddit_comments$bad_subreddit
  )

good_subreddits <- filter(lsq, bad_subreddit == "good") %>% 
  select(starts_with("V")) %>% 
  as.matrix()

bad_subreddits <- filter(lsq, bad_subreddit == "bad") %>% 
  select(starts_with("V")) %>% 
  as.matrix()

scores <- vector("double", nrow(good_subreddits))
comp   <- vector("double", nrow(bad_subreddits))

for (i in seq_len(nrow(good_subreddits))) {
  for (j in seq_len(nrow(bad_subreddits))) {
    comp[[j]] <- sim2(
      good_subreddits[i, , drop = FALSE], 
      bad_subreddits[j, , drop = FALSE], 
      method = "cosine"
    )
  }
  scores[[i]] <- mean(comp, na.rm = TRUE)
}

star_rating <- ((scores - min(scores)) / (max(scores) - min(scores))) * 5

# Create output file ------------------------------------------------------
reddit_comments$rating[reddit_comments$bad_subreddit]           <- 5 
reddit_comments$rating[reddit_comments$bad_subreddit == "good"] <- star_rating

outfile <- reddit_comments %>% 
  add_column(neuron = document_map$unit.classif) %>% 
  arrange(neuron) %>% 
  select(-neuron, -bad_subreddit, -text) %>% 
  mutate_at("rating", round, digits = 2)

jsonlite::stream_out(outfile, file("document_map.json"), verbose = FALSE)
