from flask import Flask
import subprocess
app = Flask(__name__)

#DATABASE = './faillog.db'

import faillog.views
journal = subprocess.Popen(['./fetch_journal.sh'])

