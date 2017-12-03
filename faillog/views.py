from faillog import app
from flask import render_template
import re
import json

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api')
def api():
    out = []
    with open('./sshd.json', 'r') as f: 
        addresses = set()

        for line in f:
            data = json.loads(line)
            found = re.findall(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', data['MESSAGE'])
            if found:
                out.append('<span style="display:inline-block; width:100%;">' + str(found[0]) + '</span>')
            #out.append('<span style="display:inline-block; width:100%;">' + data['MESSAGE'] + '</span>')
    return ''.join(out)
