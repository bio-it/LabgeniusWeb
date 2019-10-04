let protocols = null;
let text = null;
let name = null;
let check_data = null;

// host url
let host = 'http://210.115.227.78:6009';

function initialized() {
    text = document.getElementById('text');
    name = document.getElementById('name');

    $.ajax({
        url: host + "/api/pcr/protocol/list",
        datatype: "json",
        type: "post",
        success: function (data) {

            if (data.result == 'ok') {
                protocols = data.protocols;
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        }

    });
}

function checkProtocol() {
    let data = {result: null, reason: null};

    for (let i = 0; i < protocols.length; i++) {
        if (name.value == protocols[i][1]) {
            data.result = 'fail';
            data.reason = 'already exist same protocol name';
            return data;
        }
    }

    $.ajax({
        url: host + "/api/pcr/protocol/check",
        datatype: "json",
        contentType: "text/plain",
        type: "post",
        data: replaceAll(text.value.toString(), '\n', '\r\n'),
        success: function (data) {
            console.log(data);

        },
        error: function (data) {
            console.log("result : " + data.result + ", reason : " + data.reason);
            alert("result : " + data.result + ", reason : " + data.reason);
        }
    });
}

function newProtocol() {
    protocolCheck();
    $.ajax({
        url: host + "/api/pcr/protocol/new",
        datatype: "json",
        contentType: "text/plain",
        type: "post",
        data: name.value + '\r\n' + replaceAll(text.value.toString(), '\n', '\r\n'),
        success: function (data) {
            console.log(text.value.toString());
            alert(data.result);
            location.href='/protocols';
        },
        error: function (data) {
            console.log("result : " + data.result + ", reason : " + data.reason);
            alert("result : " + data.result + ", reason : " + data.reason);
        }
    });
}




function replaceAll(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
}
window.onpageshow = function (event) {
    if (event.persisted)
        window.location.reload();
}
