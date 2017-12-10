from flask import Flask
from werkzeug.contrib.fixers import ProxyFix

import subprocess
app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)

import faillog.views
from faillog.database import db_session

journal = subprocess.Popen(['./fetch_journal.sh', '5'])


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


def fix_werkzeug_logging():
    from werkzeug.serving import WSGIRequestHandler

    def address_string(self):
        forwarded_for = self.headers.get('X-Forwarded-For', '').split(',')
        if forwarded_for and forwarded_for[0]:
            return forwarded_for[0]
        else:
            return self.client_address[0]

    WSGIRequestHandler.address_string = address_string
