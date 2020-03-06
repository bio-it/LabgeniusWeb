var server; //Server IP and Port


var protocols;  
var totalSec = 0;
var currentProtocolName;

var isUpdateUI = true;

var fam = true;
var hex = true;
var rox = true;
var cy5 = true;

var fam_enabled;
var hex_enabled;
var rox_enabled;
var cy5_enabled;


// server config data setting and start loop
function init() {
    setInterval(pcrStatus, 500);
}

// clicked start or stop button 
function operationEvent() {
    let value = getHtml('operation-button');
    if (value == 'Start') {
        pcrStart();
    } else {
        pcrStop();
    }
}


// pcr start 
function pcrStart() {
    $.ajax({
        url: SERVER_URL + "/api/pcr/start",
        dataType: "json",
        type: "post",
        success: function () {
            log("pcr operation", "pcr start");
            document.getElementById('protocol-list').disabled = true;
            totalSec = 0;
        },
        error: function (request, status, error) {
            let message = "code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error;
            log("pcr operation", message);
            if (data.running) alert('already running!!');
        }
    });
}


// pcr stop 
function pcrStop() {
    $.ajax({
        url: SERVER_URL + "/api/pcr/stop",
        dataType: "json",
        type: "post",
        success: function () {
            log("pcr operation", "pcr stop");
            document.getElementById('protocol-list').disabled = false;;

        },
        error: function (request, status, error) {
            let message = "code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error;
            log("pcr operation", message);
        }
    });
}


// pcr status
function pcrStatus() {
    let jsonData;
    $.ajax({
        url: SERVER_URL + "/api/pcr/status",
        dataType: "json",
        type: "post",

        success: function (json) {
            let result = json.result;
            if (result == 'ok') {
                let data = json.data;
                if (isUpdateUI) { // init UI 
                    isUpdateUI = false;
                    currentProtocolName = data.protocolName;
                    setHtml('serialnumber', data.serialNumber.length == 0 ? 'undefined' : data.serialNumber);
                    setProtocols();
                    setFilters(data.filters, data.filterNames, data.filterCts);
                    setResultTable(data.filterNames);
                } else { // update status
                    pcrIsRunning(data.running);
                    setHtml('temperture-status', parseFloat(data.temperature).toFixed(1) + '℃');
                    setHtml('progress-status', data.state == 0 ? 'idle' : 'running');
                }
            } else {
                log('pcr status', 'failed get pcr status');
            }
        },
        error: function (request, status, error) {
            let message = "code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error;
            log('pcr status', message);
        }
    });



}



function filterEvent(element) {

    if (element.id == 'fam-img') {
        fam = !fam;
    } else if (element.id == 'hex-img') {
        hex = !hex;
    } else if (element.id == 'rox-img') {
        rox = !rox;
    } else if (element.id == 'cy5-img') {
        cy5 = !cy5;
    }

    changeImg();
}


function changeImg() {
    let element_fam = document.getElementById('fam-img');
    let element_hex = document.getElementById('hex-img');
    let element_rox = document.getElementById('rox-img');
    let element_cy5 = document.getElementById('cy5-img');

    if (fam && fam_enabled) {
        element_fam.src = RES_URL + 'fam.bmp';
    } else {
        element_fam.src = RES_URL + 'off.bmp';
    }

    if (hex && hex_enabled) {
        element_hex.src = RES_URL + 'hex.bmp';
    } else {
        element_hex.src = RES_URL + 'off.bmp';
    }

    if (rox && rox_enabled) {
        element_rox.src = RES_URL + 'rox.bmp';
    } else {
        element_rox.src = RES_URL + 'off.bmp';
    }

    if (cy5 && cy5_enabled) {
        element_cy5.src = RES_URL + 'cy5.bmp';
    } else {
        element_cy5.src = RES_URL + 'off.bmp';
    }
}



// http request, method : post (using ajax), get protocol list 
function setProtocols() {
    $.ajax({
        url: SERVER_URL + '/api/pcr/protocol/list',
        dataType: "json",
        type: "post",
        success: function (json) {
            let result = json.result;
            protocols = json.protocols;

            let innerHtml = ''
            if (protocols.length == 0) { // when protocol list is empty
                setDefaultProtocol();
                setProtocols();
                return;
            } else {
                for (i in protocols) {
                    if (currentProtocolName == protocols[i][PROTOCOL_NAME]) {
                        innerHtml = innerHtml + '\n'
                            + '<option selected>' + protocols[i][PROTOCOL_NAME] + '</option>';
                    } else {
                        innerHtml = innerHtml + '\n'
                            + '<option>' + protocols[i][PROTOCOL_NAME] + '</option>';
                    }

                }
            }

            let protocolList = document.getElementById('protocol-list');
            protocolList.addEventListener('change', selectProtocol);
            protocolList.innerHTML = innerHtml;
        },
        error: function (request, status, error) {
            let message = "code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error;
            log('protocol list', message);
        }
    });
}

// 
function selectProtocol() {
    let protocolList = document.getElementById('protocol-list');
    let selectedIndex = protocolList.selectedIndex;
    log('test', typeof (selectedIndex) == typeof (undefined))
    if (typeof (selectedIndex) == typeof (undefined)) {
        log('test', 'test');
        for (i in protocols) {
            if (currentProtocolName == protocols[i][PROTOCOL_NAME]) {
                selectedIndex = i;
                break;
            }
        }
    }

    $.ajax({
        url: SERVER_URL + "/api/pcr/protocol/select",
        datatype: "json",
        contentType: "text/plain",
        type: "post",
        data: protocols[selectedIndex][PROTOCOL_IDX].toString(),
        success: function (data) {
            if (data.result == 'ok') {
                log('select protocol name', protocols[selectedIndex][PROTOCOL_NAME]);
                isUpdateUI = true;
            }

        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        }
    });


}

// check pcr is running and change button text
function pcrIsRunning(isRunning) {
    if (isRunning) {
        setHtml('operation-button', "Stop")
    } else {
        setHtml('operation-button', "Start")
    }

}

function setFilters(filters, filterNames, filterCts) {

    let filterList = filters.split(', ');
    let filterNameList = filterNames.split(', ');
    let filterCtsList = filterCts.split(', ');

    if (filterList.length == filterNameList.length && filterNameList.length == filterCtsList.length) {
        fam_enabled = (filterList.indexOf("FAM") !== -1);
        hex_enabled = (filterList.indexOf("HEX") !== -1);
        rox_enabled = (filterList.indexOf("ROX") !== -1);
        cy5_enabled = (filterList.indexOf("CY5") !== -1);


        if (fam_enabled) {
            let fam_name = filterNameList.shift();
            let fam_ct = filterCtsList.shift();
            let img = document.getElementById('fam-img');
            img.src = RES_URL + 'fam.bmp';
            setHtml('fam-ct', fam_ct);
        } else {
            let img = document.getElementById('fam-img');
            img.src = RES_URL + 'off.bmp';
            setHtml('fam-ct', '');
            img.disabled = true;
        }
        if (hex_enabled) {
            let hex_name = filterNameList.shift();
            let hex_ct = filterCtsList.shift();
            let img = document.getElementById('hex-img');
            img.src = RES_URL + 'hex.bmp';
            setHtml('hex-ct', hex_ct);
        } else {

            let img = document.getElementById('hex-img');
            img.src = RES_URL + 'off.bmp';
            setHtml('hex-ct', '');
            img.disabled = true;
        }
        if (rox_enabled) {
            let rox_name = filterNameList.shift();
            let rox_ct = filterCtsList.shift();
            let img = document.getElementById('rox-img');
            img.src = RES_URL + 'rox.bmp';
            setHtml('rox-ct', rox_ct);
        } else {
            let img = document.getElementById('rox-img');
            img.src = RES_URL + 'off.bmp';
            setHtml('rox-ct', '');
            img.disabled = true;
        }
        if (cy5_enabled) {
            let cy5_name = filterNameList.shift();
            let cy5_ct = filterCtsList.shift();
            let img = document.getElementById('cy5-img');
            img.src = RES_URL + 'cy5.bmp';
            setHtml('cy5-ct', cy5_ct);
        } else {
            let img = document.getElementById('cy5-img');
            img.src = RES_URL + 'off.bmp';
            setHtml('cy5-ct', '');
            img.disabled = true;
        }


    }
    else {
        alert('ERROR (not matched filter propertys)');
    }

}

function setResultTable(filterNames, results) {
    let filterNameList = filterNames.split(', ');
    for (i in filterNameList) {
        setHtml('target-' + i, filterNameList[i]);
    }
    if (typeof (results) != "undefined") {
        for (i in filterNameList) {
            setHtml('result-' + i, results[i]);
        }
    }
}


// not using 
// function updateProgress(remainingTotalSec) {
//     let persent;
//     if (totalSec == 0) {
//         persent = 0;
//     } else {
//         persent = Number((totalSec - remainingTotalSec) / totalSec).toFixed(2);
//         persent = (persent * 100).toFixed(0);
//     }
//     log('update progress', persent + '%');
//     log('update progress', 'total : ' + totalSec + ', remain : ' + remainingTotalSec);
//     let progressBar = document.getElementById('progress-bar');
//     let remainingPersent = document.getElementById('remaining-time');
//     progressBar.style.width = persent + '%';
//     remainingPersent.innerHTML = persent + '%';
// }


