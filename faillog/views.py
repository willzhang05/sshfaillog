from flask import render_template
from faillog import app
from faillog.database import db_session
from faillog.models import Address
import re
import json
import requests

API_URL = 'http://geoip.nekudo.com/api/'


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api')
def api():

    addresses = []
    out = dict()
    with open('./sshd.json', 'r') as f: 
        for line in f:
            data = json.loads(line)
            found = re.findall(r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', data['MESSAGE'])
            if found:
                addresses.append(''.join(found))
    for ip in addresses:
        result = Address.query.filter(Address.ip == ip)
        if result.count() != 0:
            out[ip] = result.first().data
        else:
            r = requests.get(API_URL + ip)
            if r.status_code == 200:
                response = r.json()
                out[ip] = response
                a = Address(ip, response)
                db_session.add(a)
                db_session.commit()
                print(ip, response)
    return str(out)
