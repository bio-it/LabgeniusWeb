var proto = null;
var protocols = null;
var proto_idx = null;
var existing_text = null;

// host url 
var host = 'http://210.115.227.78:6009';

function initialized() {


    $.ajax({
        url: host + "/api/pcr/protocol/list",
        datatype: "json",
        type: "post",
        success: function (data) {
            if (data.result == 'ok') {
                protocols = data.protocols;
                let name = document.location.href.split('/')[5];
                console.log(document.location.href.split('/'));
                for (let i = 0; i < protocols.length; i++) {

                    if (protocols[i][1] == name) {
                        proto = protocols[i];
                        loadProtocol();
                        break;
                    }
                }

            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        }

    });
}

function loadProtocol() {
    existing_text = "";
    let text = document.getElementById('text');
    let data = JSON.parse(proto[4]);
    proto_idx = proto[0] + "\r\n";
    existing_text += proto[2] + "\r\n";
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        if (item["label"] == "SHOT") {
            existing_text += item["label"] + "\r\n";
            continue;
        }
        if (i == data.length - 1)
        existing_text += item["label"] + "\t" + item["temp"] + "\t" + item["time"];
        else
        existing_text += item["label"] + "\t" + item["temp"] + "\t" + item["time"] + "\r\n";

    }
    text.value = replaceAll(existing_text, '.0', '');
}

function editProtocol() {
    let text = document.getElementById('text').value.toString();
    if (text != existing_text) {
        let result = confirm('Do you want to change?');
        if (!result) return; 
    }
    $.ajax({
        url: host + "/api/pcr/protocol/edit",
        datatype: "json",
        contentType: "text/plain",
        type: "post",
        data: replaceAll(proto_idx + text, '\n', '\r\n'),
        success: function (data) {
            if (data.result == 'ok') {
                location.href = '/protocols';
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
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