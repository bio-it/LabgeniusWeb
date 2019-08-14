//
// Field
//

// Status
let status = null;
let result = null;
let running = false;
let temperature = 20;
let remainingSec = 0;
let remainingTotalSec = 90;
let remainingGotoCount = -1;
let currentActionNumber = -1;
let totalActionNumber = 6;
let elapsedTime = "";
let protocols = null;
let reason = "";

// Button Box elements
let btn_read;
let btn_start;
let btn_stop;


// Status Box elements
let serial_number;
let chamber;
let lid_heater;
let total_time;

// Colors
let lightBlue = "#3e91b5";
let white = "#ffffff";


// Blink
let blink = false;

// Initialized elements
function initialized() {

    btn_read = document.getElementById('btn-read');
    btn_start = document.getElementById('btn-start');
    btn_stop = document.getElementById('btn-stop');

    chamber = document.getElementById('chamber');
    lid_heater = document.getElementById('lid-heater');
    total_time = document.getElementById('total-time');

}

// Load Status
function load() {
    //interval : 1000ms
    setInterval(function () {
        $.ajax({
            url: "http://210.115.227.99:6009/api/pcr/status",
            dataType: "json",
            type: "post",
            success: function (data) {
                status = data;
                result = status.result;
                if (result == "ok") {
                    // set status
                    running = status.data.running;
                    temperature = status.data.temperature;
                    remainingSec = status.data.remainingSec;
                    remainingTotalSec = status.data.remainingTotalSec;
                    remainingGotoCount = status.data.remainingGotoCount;
                    currentActionNumber = status.data.currentActionNumber;
                    totalActionNumber = status.data.totalActionNumber;
                    elapsedTime = status.data.elapsedTime;
                    protocols = status.data.protocols;

                    let tbody = document.getElementById('tbody'); //table body
                    tbody.innerHTML = load_table();
                    // checkStatusBox();
                    if (running) {
                        btn_start.disabled = 'disabled';
                        btn_stop.disabled = false;
                    } else {
                        btn_start.disabled = false;
                        btn_stop.disabled = 'disabled';
                    }
                    chamber.innerHTML = temperature + '℃';
                    total_time.innerHTML = toHHMMSS(remainingTotalSec);
                    checkActionNumber();
                }
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);

            }
        });
    }, 500);

}


// Start protocols
function start() {
    $.ajax({
        url: "http://210.115.227.99:6009/api/pcr/start",
        dataType: "json",
        type: "post",
        success: function () {
            console.log('success');
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
        url: "http://210.115.227.99:6009/api/pcr/stop",
        dataType: "json",
        type: "post",
        success: function () {
            console.log('success');
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
function load_table() {
    var table = "";
    for (var i = 0; i < totalActionNumber; i++) {
        table += '<tr id="protocol-' + i + '">';
        table += '<th>' + protocols[i].label + '</th>';
        table += '<th>' + protocols[i].temp + '</th>';
        table += '<th>' + protocols[i].time + '</th>';
        table += checkGoto(protocols[i], i);
        table += '</tr>';
    }
    return table;
}

function checkGoto(protocol, currentNumber) {
    if (protocol.label == 'GOTO') {
        if (remainingGotoCount == -1 && remainingGotoCount != 0)
            return '<th>' + protocol.time + '</th>';
        return '<th>' + remainingGotoCount + '</th>';
    } else if (currentActionNumber == currentNumber)
        return '<th>' + remainingSec + '</th>';
    else
        return '<th></th>';
}

function checkActionNumber() {
    if (currentActionNumber != -1) {
        let currentAction = document.getElementById('protocol-' + currentActionNumber);
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

