var result = null;
var data;
var runTimer;
// Button Box elements
var btn_read;
var btn_start;
var btn_stop;

// table body
var table;

// Status Box elements
var serial_number;
var temperature;
var elapsed_time;
var remaining_time;

// Colors
var lightBlue = "#3e91b5";
var white = "#ffffff";

// Blink
var blink = false;

// host url
var host = 'http://210.115.227.78:6009';

// Initialized elements
function initialized() {

    btn_read = document.getElementById('btn-read');
    btn_start = document.getElementById('btn-start');
    btn_stop = document.getElementById('btn-stop');

    temperature = document.getElementById('temperature');
    elapsed_time = document.getElementById('elapsed-time');
    remaining_time = document.getElementById('remaining-time');
    table = document.getElementById('table-contents');

    loadJson();
    if (data.running) onRunning();
}

// load json data
function loadJson() {
    $.ajax({
        url: host + "/api/pcr/status",
        dataType: "json",
        type: "post",
        success: function (json) {
            result = json.result;
            data = json.data;
            if (result == "ok") {
                //table body
                table.innerHTML = makeTable(data.protocols, data.totalActionNumber);

                temperature.innerHTML = data.temperature + '℃';
                elapsed_time.innerHTML = data.elapsedTime == "" ? toHHMMSS(0) : elapsedTime;
                remaining_time.innerHTML = toHHMMSS(Number(data.remainingTotalSec));
                checkActionNumber(data.currentActionNumber);
                // checkStatusBox();
                if (remainingTotalSec <= 0)
                    alert('pcr end');

                if (data.running) {
                    btn_start.disabled = 'disabled';
                    btn_stop.disabled = false;

                } else {
                    btn_start.disabled = false;
                    btn_stop.disabled = 'disabled';
                }


            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

        }
    });


}

function onRunning() {
    //if running interval : 500ms else interval : 10s
    let interval = data.running ? 500 : 10000;
    runTimer = setInterval(loadJson());

    
}


// Start protocols
function start() {
    $.ajax({
        url: host + "/api/pcr/start",
        dataType: "json",
        type: "post",
        success: function () {
            console.log('start pcr');
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            if (running) alert('already running!!');
        }
    });
}

// Stop protocols
function stop() {
    $.ajax({
        url: host + "/api/pcr/stop",
        dataType: "json",
        type: "post",
        success: function () {
            console.log('stop pcr');
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        }
    });
}

// Read Protocols
function read() {
    if (running) {
        alert('is running')
        return;
    }
    location.href = "protocols";
}

// Make html in able body
function makeTable(protocols, totalActionNumber) {
    let table_contents = "";
    for (var i = 0; i < totalActionNumber; i++) {
        table_contents += '<tr id="protocol-' + i + '">';
        if (protocols[i].label == 'SHOT') {
            table_contents += '<th>' + protocols[i].label + '</th>';
            for (var j = 0; j < 3; j++) table_contents += '<th></th>';
            continue;
        }
        table_contents += '<th>' + protocols[i].label + '</th>';
        table_contents += '<th>' + protocols[i].temp + '</th>';
        table_contents += '<th>' + protocols[i].time + '</th>';
        table_contents += checkGoto(protocols[i], i);
        table_contents += '</tr>';
    }
    return table_contents;
}

function checkGoto(protocol, currentNumber) {
    if (protocol.label == 'GOTO') {
        if (remainingGotoCount == -1)
            return '<th>' + protocol.time + '</th>';
        return '<th>' + remainingGotoCount + '</th>';
    } else if (currentActionNumber == currentNumber)
        return '<th>' + remainingSec + '</th>';
    else
        return '<th></th>';
}

function checkActionNumber(actionNumber) {
    if (actionNumber != -1) {
        let currentAction = document.getElementById('protocol-' + actionNumber);
        if (blink) currentAction.style.backgroundColor = lightBlue;
        else currentAction.style.backgroundColor = white;
        blink = !blink;
    }
}

function toHHMMSS(time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time - (hours * 3600)) / 60);
    let seconds = time - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}

