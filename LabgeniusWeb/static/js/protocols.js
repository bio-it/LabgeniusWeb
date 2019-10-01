let result = null;
let current_proto = null;
let current_index = -1;
let protocols = null;
let host = 'http://210.115.227.78:6009';


// Colors
let lightBlue = "#3e91b5";
let white = "#ffffff";

function protocol_edit() {
    if (current_proto != null) {
        console.log(current_proto.innerText);
        location.href = "protocols/edit/" + current_proto.innerText.toString();
    }
}

function protocol_new() {
    location.href = "protocols/new";
}

function protocol_delete() {
    if (current_proto != null) {
        $.ajax({
            url: host + "/api/pcr/protocol/delete",
            datatype: "json",
            contentType: "text/plain",
            type: "post",
            data: get(current_proto)[0].toString(),
            success: function (data) {
                alert(data.result);
                initialized();
            },
            error: function (request, status, error) {
                console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            }
        });
    }

}


function select_protocol() {
    $.ajax({
        url: host + "/api/pcr/protocol/select",
        datatype: "json",
        contentType: "text/plain",
        type: "post",
        data: get(current_proto)[0].toString(),
        success: function (data) {
            alert(data.result);
            history.back();
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        }
    });
}


function initialized() {
    $.ajax({
        url: host + "/api/pcr/protocol/list",
        datatype: "json",
        type: "post",
        success: function (data) {

            if (data.result == 'ok') {
                protocols = data.protocols;
                document.getElementById('tbody').innerHTML = load_table(data.protocols);
                set_protocols(data.protocols);
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        }

    });
}

function load_table(protocols) {
    let table = "";
    for (let i = 0; i < protocols.length; i++) {
        table += '<tr id="protocol-' + (i + 1) + '">';
        table += '<th>' + protocols[i][1] + '</th>';
        table += '</tr>';

    }

    return table;
}

function set_protocols(protocols) {
    for (let i = 1; i <= protocols.length; i++) {
        let proto = document.getElementById('protocol-' + i);
        proto.addEventListener('click', focus);
        proto.addEventListener('dblclick', select_protocol);
    }
}

function focus() {
    let target_proto = event.currentTarget;
    if (current_proto == null) {
        current_proto = target_proto;
        target_proto.style.backgroundColor = lightBlue;

    } else {
        current_proto.style.backgroundColor = white;
        target_proto.style.backgroundColor = lightBlue;
        current_proto = target_proto;
    }
}




function get(proto) {
    for (let i = 0; i < protocols.length; i++) {
        if (proto.innerText == protocols[i][1]) {
            console.log(protocols[i][0]);
            return protocols[i];
        }
    }
}

window.onpageshow = function (event) {
    if (event.persisted)
        window.location.reload();
}