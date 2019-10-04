// Values
var result = null;
var current_proto = null;
var current_index = -1;
var protocols = null;

// host url 
var host = 'http://210.115.227.78:6009';


// Colors
var lightBlue = "#3e91b5";
var white = "#ffffff";

// redirection to protocols\edit<name>
function editProtocol() {
    if (current_proto != null) {
        location.href = "protocols/edit/" + current_proto.innerText.toString();
    }
}

// redirection to protocols\new
function createProtocol() {
    location.href = "protocols/new";
}


// delete current focusing protocol 
// post data is plain text
function deleteProtocol() {
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


// select protocol and redirection to main
// post data is plain text
function selectProtocol() {
    $.ajax({
        url: host + "/api/pcr/protocol/select",
        datatype: "json",
        contentType: "text/plain",
        type: "post",
        data: get(current_proto)[0].toString(),
        success: function (data) {
            alert('select protocol : ' + current_proto[1].toString());
            history.back();
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        }
    });
}

// initialize current page
function initialized() {
    $.ajax({
        url: host + "/api/pcr/protocol/list",
        datatype: "json",
        type: "post",
        success: function (data) {

            if (data.result == 'ok') {
                protocols = data.protocols;                                             // get protocol list
                document.getElementById('tbody').innerHTML = loadTable(data.protocols); // setting current page
                setProtocol(data.protocols);                                            // set click event listener
            }
        },
        error: function (request, status, error) {
            console.log("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
        }

    });
}

// return table-contents html
function loadTable(protos) {
    let table_contents = "";
    for (let i = 0; i < protos.length; i++) {
        // table_contents += '<tr id="protocol-' + (i + 1) + '">';
        table_contents += `<tr id="protocol-${i+1}">`;
        // table_contents += '<th>' + protos[i][1] + '</th>';
        table_contents += `<th>${protos[i][1]}</th>`;
        table_contents += '</tr>';

    }

    return table_contents;
}

// set click event listener
function setProtocol(protos) {
    for (let i = 1; i <= protos.length; i++) {
        let proto = document.getElementById('protocol-' + i);
        proto.addEventListener('click', focus);
        proto.addEventListener('dblclick', selectProtocol);
    }
}

// set current protocol and change focussing protocol color  
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