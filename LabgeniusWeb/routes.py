# routes.py

from flask import Flask, render_template

app = Flask(__name__)

# Status
serial_number = "MyPCR000005"
chamber = "25.2℃"
lid_heater = "25.2℃"
total_time = "00:00:00"


# default route
# Action Table View
@app.route('/')
def main():
    return render_template('./main.html', serial_number=serial_number, chamber=chamber, lid_heater=lid_heater,
                           total_time=total_time)


# Protocol List View 수정중
@app.route('/protocols')
def protocols():
    return None


# main function
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
