var result = null;
var data = null;
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

    isRunning();
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
            console.log('data-success :' + data);
            if (result == "ok") {
                //table body
                table.innerHTML = makeTable(data.protocols, data.totalActionNumber);

                temperature.innerHTML = data.temperature + '℃';
                elapsed_time.innerHTML = data.elapsedTime == "" ? toHHMMSS(0) : data.elapsedTime;
                remaining_time.innerHTML = toHHMMSS(Number(data.remainingTotalSec));
                checkActionNumber(data.currentActionNumber);
                // checkStatusBox();
                if (data.remainingTotalSec <= 0)
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

function isRunning() {
    console.log('data : ' + data);
    //if running interval : 500ms
    if (data == null) {
        loadJson();
        console.log(data);
        setTimeout(isRunning, 5000);
    } else {
        console.log('data : ' + data);
        let interval = 500;
        runTimer = setInterval(loadJson, interval);
    }


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
            if (data.running) alert('already running!!');
        }
    });
}

// Stop protocols
function stop() {

    clearInterval(runTimer);

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
    if (data.running) {
        alert('is running')
        return;
    }
    location.href = "protocols";
}

// Make html in able body
function makeTable(protos, totalActionNumber) {
    let table_contents = "";
    for (var i = 0; i < totalActionNumber; i++) {
        table_contents += '<tr id="protocol-' + i + '">';
        if (protos[i].label == 'SHOT') {
            table_contents += '<th>' + protos[i].label + '</th>';
            for (var j = 0; j < 3; j++) table_contents += '<th></th>';
            continue;
        }
        table_contents += '<th>' + protos[i].label + '</th>';
        table_contents += '<th>' + protos[i].temp + '</th>';
        table_contents += '<th>' + protos[i].time + '</th>';
        table_contents += checkGoto(protos[i], i);
        table_contents += '</tr>';
    }
    return table_contents;
}

function checkGoto(proto, currentNumber) {
    let currentActionNumber =data.currentActionNumber;
    let remainingGotoCount = data.remainingGotoCount;
    let remainingSec = data.remainingSec;

    if (proto.label == 'GOTO') {
        if (remainingGotoCount == -1)
            return '<th>' + proto.time + '</th>';
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

