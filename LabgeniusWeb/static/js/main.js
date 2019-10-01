let result = null;

// Button Box elements
let btn_read;
let btn_start;
let btn_stop;

// table body
let table;

// Status Box elements
let serial_number;
let temperature;
let elapsed_time;
let remaining_time;

// Colors
let lightBlue = "#3e91b5";
let white = "#ffffff";

// Blink
let blink = false;

// host url
let host = 'http://210.115.227.78:6009';

// Initialized elements
function initialized() {

    btn_read = document.getElementById('btn-read');
    btn_start = document.getElementById('btn-start');
    btn_stop = document.getElementById('btn-stop');

    temperature = document.getElementById('temperature');
    elapsed_time = document.getElementById('elapsed-time');
    remaining_time = document.getElementById('remaining-time');
    table = document.getElementById('table-contents');

}

// load
function load() {
    //interval : 1000ms
    setInterval(function () {
        console.log('host : ' + host);
        $.ajax({
            url: host + "/api/pcr/status",
            dataType: "json",
            type: "post",
            success: function (json) {
                result = json.result;
                data = json.data;
                if (result == "ok") {
                    //table body
                    table.innerHTML = loadTable();
                    // checkStatusBox();
                    if (running) {
                        btn_start.disabled = 'disabled';
                        btn_stop.disabled = false;
                    } else {
                        btn_start.disabled = false;
                        btn_stop.disabled = 'disabled';
                    }
                    temperature.innerHTML = data.temperature + '℃';
                    elapsed_time.innerHTML = data.elapsedTime == "" ? toHHMMSS(0) : elapsedTime;
                    remaining_time.innerHTML = toHHMMSS(Number(data.remainingTotalSec));
                    checkActionNumber();

                    if (remainingTotalSec == 0)
                        alert('pcr end');
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
        url: host + "/api/pcr/start",
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
        url: host + "/api/pcr/stop",
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
function loadTable() {
    var table = "";
    for (var i = 0; i < totalActionNumber; i++) {
        table += '<tr id="protocol-' + i + '">';
        if (protocols[i].label == 'SHOT') {
            table += '<th>' + protocols[i].label + '</th>';
            for (var j = 0; j < 3; j++) table += '<th></th>';
            continue;
        }
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
        if (remainingGotoCount == -1)
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

