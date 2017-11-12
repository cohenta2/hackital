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
    return render_template('index.html', subreddits = top100_subreddits, active="index")


@application.route('/map/')
def build_map():
     return render_template('map.html',data = json.dumps(top100_subreddits), random="test")

if __name__ == '__main__':

   application.run(debug = True)
