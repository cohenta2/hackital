function searchSubs() {
    // Declare variables 
    var input, filter, tbody, tr, td, i;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    tr = document.getElementsByClassName("accordion-toggle");
    
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        subredditName = tr[i].getAttribute('id');
        if (subredditName.toUpperCase().indexOf(filter) > -1) {
            document.getElementById(subredditName).style.display = "";
            document.getElementById(subredditName + '-secondary').style.display = "";
        } else {
            document.getElementById(subredditName).style.display = "none";
            document.getElementById(subredditName + '-secondary').style.display = "none";
        }
    }
}

function clearSearch() {
    var search = document.getElementById("search");
    search.value = "";
    searchSubs();
    var collapsables = document.getElementsByClassName("collapse");
    collapsables[0].collapse('hide');
    for (i = 0; i < collapsables.length; i++) {
        collapsables[i].collapse('hide');
    }
}