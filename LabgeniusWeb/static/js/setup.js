

var target_protocol = null;
var protocols = null;


// server config data setting and start loop
function init() {


    loadProtocol();
    localStorage.clear();
}



function loadProtocol() {
    $.ajax({
        url: SERVER_URL +  '/api/pcr/protocol/list',
        dataType: "json",
        type: "post",
        success: function (json) {
            let result = json.result;
            protocols = json.protocols;

            let innerHtml = ''
            if (protocols.length == 0) {
                innerHtml = `<li class="list-group-item" onclick="setTargetProtocol(this)">None</li>`;
            } else {
                for (let i = 0; i < protocols.length; i++) {
                    innerHtml = innerHtml + '\n'
                        + `<li id="protocol-${i}" class="list-group-item" onclick="setTargetProtocol(this)">` + protocols[i][PROTOCOL_NAME] + '</li>';
                }
            }


            let protocolList = document.getElementById('protocol-list');
            protocolList.innerHTML = innerHtml;
        },
        error: function (request, status, error) {
            let message = "code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error;
            log('protocol list', message);
        }
    });
}

function setTargetProtocol(element) {
    for (let i = 0; i < protocols.length; i++) {
        let temp = document.getElementById('protocol-' + i);
        temp.style.backgroundColor = "#FFF";
    }
    let protocol_name = element.innerHTML;
    if (target_protocol == null) {
        target_protocol = findByName(protocol_name);
        element.style.backgroundColor = "#00000040";
    } else {
        if (protocol_name == target_protocol[PROTOCOL_NAME]) {
            target_protocol = null;
        } else {
            target_protocol = findByName(protocol_name);
            element.style.backgroundColor = "#00000040";

        }
    }

}

// ADD Button Event
function addProtocol() {
    // to editor page
    localStorage.clear();
    localStorage.command = 'new';

    location.replace('http://' + location.host + '/editor/new');
}

// EDIT Button Event 
function editProtocol() {
    // check protocol selected
    if (target_protocol == null) {
        alert('No protocol selected.\n Please select a protocol first.')
    }
    

    // to editor page
    localStorage.clear();
    localStorage.command = 'edit';
    localStorage.protocol = JSON.stringify(target_protocol);
    location.replace('http://' + location.host + '/editor/' + target_protocol[PROTOCOL_NAME]);
}

// DELETE Button Event 
function deleteProtocol() {
    if (target_protocol == null) {
        alert('No protocol selected.\n Please select a protocol first.')
    }
    // send delete message to server
    if (confirm(`Do you want delete this protocol(${target_protocol[PROTOCOL_NAME]})?`)) {
        $.ajax({
            url: SERVER_URL + "/api/pcr/protocol/delete",
            datatype: "json",
            contentType: "text/plain",
            type: "post",
            data: target_protocol[PROTOCOL_IDX].toString(),
            success: function (data) {
                alert('deleted protocol - ' + target_protocol[PROTOCOL_NAME]);
                loadProtocol();
            },
            error: function (request, status, error) {
                let message = "code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error;
                log('protocol list', message);
            }
        });
    }
}

function findByName(name) {
    for (let i = 0; i < protocols.length; i++) {
        if (name == protocols[i][PROTOCOL_NAME]) {
            return protocols[i];
        }
    }
}




