from faillog import app
from flask import render_template
import re
import json

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api')
def api():
    with open('./sshd.json', 'r') as f: 
        addresses = set()
        out = []
        for line in f:
            print(line)
            data = json.loads(line)
            #if re.search(r'\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b', data['MESSAGE']):
                #and not re.search(r'^(?:10|127|172\.(?:1[6-9]|2[0-9]|3[01])|192\.168)\..*', data['MESSAGE']):
            out.append(data['MESSAGE'])
        return ''.join(out)
