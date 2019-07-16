# routes.py

from flask import Flask, redirect, render_template, request, url_for

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('./index.html', serial_number="MyPCR000005", chamber="25.2℃", lid_heater="25.2℃", total_time="00:00:00")

if __name__ == '__main__':
	app.run(host='0.0.0.0', debug=True)


