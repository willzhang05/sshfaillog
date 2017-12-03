from flask import Flask

import subprocess
app = Flask(__name__)

import faillog.views
from faillog.database import db_session

journal = subprocess.Popen(['./fetch_journal.sh', '5'])


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()
