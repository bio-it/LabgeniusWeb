// ReadProtocol Button Click Event
function ReadProtocol() {
    table = document.getElementById('tbody');

    table.innerHTML += DefaultProtocol();
}

//make Default Protocol
function DefaultProtocol() {
    actions = [
        [1, 95, 30, 0],
        [2, 95, 30, 0],
        [3, 55, 30, 0],
        [4, 72, 30, 0],
        ['GOTO', 2, 34, 0],
        [5, 72, 180, 0]
    ];
    result = "";
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

// Start Button Click Event
function start() {
    btnStart = document.getElementById('btnStart');
    btnStop = document.getElementById('btnStop');
    btnStart.disabled = 'disabled';
    btnStop.disabled = false;
    alert('Start');
}

//Stop Button Click Event
function stop() {
    btnStart = document.getElementById('btnStart');
    btnStop = document.getElementById('btnStop');
    btnStart.disabled = false;
    btnStop.disabled = 'disabled';
    alert('Stop');
}