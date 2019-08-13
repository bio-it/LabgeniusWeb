# routes.py

from flask import Flask, render_template

app = Flask(__name__)

# Status
serial_number = "PCR000001"
chamber = "25.2℃"
lid_heater = "25.2℃"
total_time = "00:00:00"


# default route
# Action Table
@app.route('/')
def main():
    return render_template('./main.html', serial_number=serial_number, lid_heater=lid_heater)

# Protocol List
@app.route('/protocols')
def protocols():
    return render_template('./protocols.html')


# main
if __name__ == '__main__':
    app.run(debug=True)
