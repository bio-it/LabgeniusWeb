// Status
let status = null
let result = null
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
function onLoad() {
    //interval : 1000ms
    let timer = setInterval(function () {
        $.ajax({
            url: "http://210.115.227.99:6009/api/pcr/status",
            dataType: "json",
            type: "post",
            success: function (data) {
                status = data;
                result = status.result;
                if (result === "ok") {
                    // load status
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
                    tbody.innerHTML = makeTable();
                    // checkStatusBox();
                    if (running) {
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
    }, 500);

}

// Start protocols
function start() {
    /*
    btnStart = document.getElementById('btnStart');
    btnStop = document.getElementById('btnStop');
    btnStart.disabled = 'disabled';
    btnStop.disabled = false;
    alert('Start');
    */

    $.ajax({
        url: "http://210.115.227.99:6009/api/pcr/start",
        dataType: "json",
        type: "post",
        success: function () {
            console.log('success');
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            if (running) alert('pcr already running!!');
        }
    });
}

//Stop protocols
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
            if (!running) alert('pcr already stop!!');
        }
    });
}

// Make html in able body
function makeTable() {
    var html = "";
    for (var i = 0; i < totalActionNumber; i++) {
        html += '<tr>';
        html += '<th>' + protocols[i].label + '</th>';
        html += '<th>' + protocols[i].temp + '</th>';
        html += '<th>' + protocols[i].time + '</th>';
        html += (currentActionNumber === i) ? '<th>' + remainingSec + '</th>' : '<th></th>';
        html += '</tr>';
    }
    return html;
}

//
// // Status Box check
// function checkStatusBox() {
//
//     chamber.innerHTML = temperature;
//     lid_heater.innerHTML = temperature;
//     total_time.innerHTML = new Date().format("HH:mm:ss");
//
// }
//
