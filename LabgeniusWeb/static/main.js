function ReadProtocol(){
	var table = document.getElementById('tbody');

	table.innerHTML += DefaultProtocol();
}

function DefaultProtocol () {
	var actions = [
	[1, 95, 30, 0],
	[2, 95, 30, 0],
	[3, 55, 30, 0],
	[4, 72, 30, 0],
	['GOTO', 2, 34, 0],
	[5, 72, 180, 0]
	];
	let result = "";
	for (let action of actions) {
		result += '<tr>';
		result += '<th>' + action[0] + '</th>';
		result += '<th>' + action[1] + '</th>';
		result += '<th>' + action[2] + '</th>';
		result += '<th>' + action[3] + '</th>';
		result += '</tr>';
	}

	return result;

}

function start() {
	var btnStart = document.getElementById('btnStart');
	var btnStop = document.getElementById('btnStop');
	btnStart.disabled = 'disabled';
	btnStop.disabled = false;
	alert('Start');
}

function stop() {
	var btnStart = document.getElementById('btnStart');
	var btnStop = document.getElementById('btnStop');
	btnStart.disabled = false;
	btnStop.disabled = 'disabled';
	alert('Stop');
}