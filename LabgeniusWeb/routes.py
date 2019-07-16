# routes.py

from flask import Flask, redirect, render_template, request, url_for

app = Flask(__name__)

@app.route('/')
def index():
	proto=default_protocol()

	return render_template('./index.html', serial_number="MyPCR000005", chamber="25.2℃", lid_heater="25.2℃", **locals())


def default_protocol():
	proto = [
	[1, 95, 30, 0],
	[2, 95, 30, 0],
	[3, 55, 30, 0],
	[4, 72, 30, 0],
	['GOTO', 2, 34, 0],
	[5, 72, 180, 0]
	]
	return proto


if __name__ == '__main__':
	app.run(host='0.0.0.0', debug=True)


