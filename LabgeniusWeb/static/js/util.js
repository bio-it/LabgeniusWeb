var RES_URL = "http://" + location.host + "/static/res/";
var SERVER_URL;
// create Default Protocol
function setDefaultProtocol() {

    let name = "Default Protocol";
    let filter = "FAM";
    let filter_name = "CT";
    let filter_ct = "38.0";
    let protocol = ["1\t95\t10", "2\t95\t5", "3\t55\t5", "4\t72\t5", "GOTO\t2\t4", "5\t72\t5"].join('\r\n');
    let magneto = "ready"
    let text = name + '\r\n' + filter + '\r\n' + filter_name + '\r\n' + filter_ct + '\r\n' + protocol + '\r\n#\r\n' + magneto;
    $.ajax({
        url: "http://" + server + "/api/pcr/protocol/new",
        datatype: "json",
        contentType: "text/plain",
        type: "post",
        data: text,
        success: function (data) {
            let result = data.result;
            if (result == 'ok') {
                log('Default Protocol', 'add Default Protocol successed');
                return;
            } else {
                log('Default Protocol', 'add Default Protocol failed');
            }
        },
        error: function (request, status, error) {
            let message = "code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error;
            log('new protocol save', message);
        }
    });
}

// set in innerhtml (find by element id)
function setHtml(id, html) {
    let element = document.getElementById(id.toString());
    element.innerHTML = html;
}

// get in innerhtml (find by element id)
function getHtml(id) {
    let element = document.getElementById(id.toString());
    return element.innerHTML;
}

// set in html value (find by element id)
function setValue(id, value) {
    let element = document.getElementById(id.toString());
    element.value = value;
}

// get in html value (find by element id)
function getValue(id) {
    let element = document.getElementById(id.toString());
    return element.value;
}

// time format
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

// redirect page(setup page)


// console log (time - tag - message)
function log(tag, message) {
    let date = new Date();
    let time = date.getFullYear() + ' ' + (date.getMonth() + 1) + ' '
        + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':'
        + date.getSeconds();
    console.log(time + ' - ' + tag + ' : ' + message);
}

// goto main page
function toMainPage() {
    location.replace('http://' + location.host);
}

// goto setup page
function toSetupPage() {
    location.replace("http://" + location.host + "/setup");
}

// replace all keyword 
function replaceAll(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
}

// load config file from local host
function loadConfig() {
    $.ajax({
        type: "get",
        url: 'http://' + location.host + '/static/config.json',
        datatype: "json",
        async: false,
        success: function (data) {
            SERVER_URL = "http://" + data.ip_address + ":" + data.port;
        }
    })
}

// console log (time - tag : message)
function log(tag, message) {
    let date = new Date();
    let time = date.getFullYear() + ' ' + (date.getMonth() + 1) + ' '
        + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':'
        + date.getSeconds();
    console.log(time + ' - ' + tag + ' : ' + message);
}


