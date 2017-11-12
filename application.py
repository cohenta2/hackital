from flask import Flask, render_template
from urllib import request
import collections
import numpy as np
import json

response = request.urlopen("https://api.reddit.com/subreddits/popular/?limit=100")
subreddits_json = json.loads(response.read().decode())
top100_subreddits= []
for x in subreddits_json['data']['children']:
    keys = x['data']
    subreddit = {}
    subreddit['name'] = keys['display_name_prefixed']
    subreddit['subs'] = keys['subscribers']
    subreddit['desc'] = keys['public_description']
    subreddit['img'] = keys['icon_img']
    top100_subreddits.append(subreddit)
application = Flask(__name__)
application.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

@application.route('/')
def index():
    return render_template('index.html', subreddits = top100_subreddits, random="test")

if __name__ == '__main__':
   application.run(debug = True)

@application.route('/my-subreddits/')
def mySubReddits():
    return render_template('my-subreddits.html', subreddits = top100_subreddits)

@application.route('/map')
def map():
    columns = np.arange(10)
    result = collections.defaultdict(list)

    for d in top100_subreddits:
        result[d['name']].append(d)

    result_list = result.values()
    return render_template('map.html',columns=columns, subreddits = top100_subreddits, random="test")
