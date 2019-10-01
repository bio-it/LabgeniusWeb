let proto = null;
let protocols = null;
let host = 'http://210.115.227.78:6009';

function initialized() {


    $.ajax({
        url: host + "/api/pcr/protocol/list",
        datatype: "json",
        type: "post",
        success: function (data) {

            if (data.result == 'ok') {
                protocols = data.protocols;
                let name = document.location.href.split('/')[5];
                for (let i = 0; i < protocols.length; i++) {

                    if (protocols[i][1] == name) {
                        proto = protocols[i];
                        load_protocol();
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

function load_protocol() {
    let value = "";
    let text = document.getElementById('text');
    let data = JSON.parse(proto[4]);
    value += proto[0] + "\r\n";
    value += proto[2] + "\r\n";
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        if (item["label"] == "SHOT") {
            value += item["label"] + "\r\n";
            continue;
        }
        if (i == data.length - 1)
            value += item["label"] + "\t" + item["temp"] + "\t" + item["time"];
        else
            value += item["label"] + "\t" + item["temp"] + "\t" + item["time"] + "\r\n";

    }
    text.value = replaceAll(value, '.0', '');
}

function protocol_edit() {
    let text = document.getElementById('text');
    $.ajax({
        url: "http://210.115.227.99:6009/api/pcr/protocol/edit",
        datatype: "json",
        contentType: "text/plain",
        type: "post",
        data: replaceAll(text.value.toString(), '\n', '\r\n'),
        success: function (data) {
            if (data.result == 'ok') {
                history.back();
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