# app.py

from flask import Flask, render_template, url_for, make_response
import json


app = Flask(__name__)

# default route
# main page
@app.route('/')
def main():
    return render_template('./main.html')

# setup page
@app.route('/setup')
def setup():
    return render_template('./setup.html')

# editor page
@app.route('/editor/<name>')
def editer(name):
    return render_template('./editor.html')

# main
if __name__ == '__main__':
    app.run(debug=True, host='210.115.229.101', port=80)
 