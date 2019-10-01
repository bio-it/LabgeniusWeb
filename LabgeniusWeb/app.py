# app.py

from flask import Flask, render_template, url_for

app = Flask(__name__)

# default status
serial_number = "PCR000001"
temperature = "25.2℃"
elapsed_time = "00:00:00"
remaining_time = "00:00:00"


# default route
# action table
@app.route('/')
def main():
    return render_template('./main.html', serial_number=serial_number, temperature=temperature,
                           elapsed_time=elapsed_time, remaining_time=remaining_time)


# protocol list
@app.route('/protocols')
def protocols():
    return render_template('./protocols.html')


@app.route('/protocols/edit/<name>')
def edit(name):
    return render_template('./edit.html', name=name)

@app.route('/protocols/new')
def new():
    return render_template('./new.html')


# main
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
