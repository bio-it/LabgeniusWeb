

var fam = true, hex = true, rox = true, cy5 = true;


var command;
var protocol;



// server config data setting and start loop
function init() {
    command = localStorage.command;

    log('command', command);
    if (command == 'edit') {
        protocol = JSON.parse(localStorage.protocol);
        setName(); // set protocol name
        setFilters(); // set protocol filters
        setProtocols(); // set protocol-text and magneto-text 
        changeImg();
    }

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

    log('ct-value', 'fam : ' + fam + ', hex : ' + hex + ', rox : ' + rox + ', cy5 : ' + cy5);
    changeImg();
}

function changeImg() {
    let element_fam = document.getElementById('fam-img');
    let element_hex = document.getElementById('hex-img');
    let element_rox = document.getElementById('rox-img');
    let element_cy5 = document.getElementById('cy5-img');

    if (fam) {
        element_fam.src = RES_URL + 'fam.bmp';
    } else {
        element_fam.src = RES_URL + 'off.bmp';
    }

    if (hex) {
        element_hex.src = RES_URL + 'hex.bmp';
    } else {
        element_hex.src = RES_URL + 'off.bmp';
    }

    if (rox) {
        element_rox.src = RES_URL + 'rox.bmp';
    } else {
        element_rox.src = RES_URL + 'off.bmp';
    }

    if (cy5) {
        element_cy5.src = RES_URL + 'cy5.bmp';
    } else {
        element_cy5.src = RES_URL + 'off.bmp';
    }
}


function setName() {
    let protocol_name = document.getElementById('protocol-name');
    protocol_name.value = protocol[PROTOCOL_NAME];
    protocol_name.disabled = true; 
}

function getFilters() {

    let fam_name = getValue('fam-name').trim();
    let hex_name = getValue('hex-name').trim();
    let rox_name = getValue('rox-name').trim();
    let cy5_name = getValue('cy5-name').trim();

    let fam_ct = getValue('fam-ct').trim();
    let hex_ct = getValue('hex-ct').trim();
    let rox_ct = getValue('rox-ct').trim();
    let cy5_ct = getValue('cy5-ct').trim();


    let filterHeaders = new Array();
    let filterNames = new Array();
    let filterCts = new Array();
    if (fam) {
        filterHeaders.push('FAM');
        filterNames.push(fam_name);
        filterCts.push(fam_ct);
        if (fam_name.length == 0 || fam_ct.length == 0) {
            alert('FAM name or ct value is empty');
            log('Error(code:10)','fam name or ct value is empty');
            return;
        }
    }
    if (hex) {
        filterHeaders.push('HEX');
        filterNames.push(hex_name);
        filterCts.push(hex_ct);
        
        if (hex_name.length == 0 || hex_ct.length == 0) {
            alert('HEX name or ct value is empty');
            log('Error(code:10)','hex name or ct value is empty');
            return;
        }
    }
    if (rox) {
        filterHeaders.push('ROX');
        filterNames.push(rox_name);
        filterCts.push(rox_ct);
        if (rox_name.length == 0 || rox_ct.length == 0) {
            alert('ROX name or ct value is empty');
            log('Error(code:10)','rox name or ct value is empty');
            return;
        }
    }
    if (cy5) {
        filterHeaders.push('CY5');
        filterNames.push(cy5_name);
        filterCts.push(cy5_ct);
        if (cy5_name.length == 0 || cy5_ct.length == 0) {
            alert('CY5 name or ct value is empty');
            log('Error(code:10)','cy5 name or ct value is empty');
            return;
        }
    }

    // setting text 
    return filterHeaders.join(', ') + '\r\n' + filterNames.join(', ') + '\r\n' + filterCts.join(', ');

}

function setFilters() {
    let filters = protocol[FILTERS].split(', ');
    let filterNames = protocol[FILTER_NAMES].split(', ');
    let filterCts = protocol[FILTER_CTS].split(', ');

    if (filters.length == filterNames.length && filterNames.length == filterCts.length) {
        fam = (filters.indexOf("FAM") !== -1);
        hex = (filters.indexOf("HEX") !== -1);
        rox = (filters.indexOf("ROX") !== -1);
        cy5 = (filters.indexOf("CY5") !== -1);
    
    
        if (fam) {
            let fam_name = filterNames.shift();
            let fam_ct = filterCts.shift();
            setValue('fam-name', fam_name);
            setValue('fam-ct', fam_ct);
        }
        if (hex) {
            let hex_name = filterNames.shift();
            let hex_ct = filterCts.shift();
            setValue('hex-name', hex_name);
            setValue('hex-ct', hex_ct);
        }
        if (rox) {
            let rox_name = filterNames.shift();
            let rox_ct = filterCts.shift();
            setValue('rox-name', rox_name);
            setValue('rox-ct', rox_ct);
        }
        if (cy5) {
            let cy5_name = filterNames.shift();
            let cy5_ct = filterCts.shift();
            setValue('cy5-name', cy5_name);
            setValue('cy5-ct', cy5_ct);
        }
    }
    else {
        alert('ERROR (not matched filter propertys)');
    }
}

function setProtocols() {
    let protocol_text = "";
    let magneto_text = JSON.parse(protocol[MAGNETO_TEXT]).join('\r\n');;
    let lines = new Array();

    for (line of JSON.parse(protocol[PROTOCOL_TEXT])) {
        let label = line['label'];
        let temp = Number(line['temp']).toFixed(0);
        let time = line['time'];

        if (label == 'SHOT') {
            lines.push(label);
        } else {
            lines.push([label, temp, time].join('\t'));
        }
    }
    protocol_text = lines.join('\r\n'); 
    setValue('protocol-text', protocol_text);
    setValue('magneto-text', magneto_text);
}


function saveEvent() {
    if (command == 'new') {
        newProtocol();
        log('save', 'new protocol save')
    } else if (command == 'edit') {
        editProtocol();
        log('save', 'edit protocol save')
    }
}

function newProtocol() {
    let protocol_name = getValue('protocol-name').toString();
    let filters = getFilters();
    let protocol_text = replaceAll(getValue('protocol-text').toString(), '\n', '\r\n');
    let magneto_text = replaceAll(getValue('magneto-text').toString(), '\n', '\r\n');
    let text = protocol_name + '\r\n' + filters + '\r\n' + protocol_text + '\r\n#\r\n' + magneto_text;
    if (protocol_name.length == 0) {
        alert('protocol name is required');
        return;
    }
    log('protocol data', text);
    $.ajax({
        url: SERVER_URL + "/api/pcr/protocol/new",
        datatype: "json",
        contentType: "text/plain",
        type: "post",
        data: text,
        success: function (data) {
            if (data.result == 'ok') {
                toSetupPage();
            }
            log('save protocol', JSON.stringify(data))
        },
        error: function (request, status, error) {
            let message = "code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error;
            log('new protocol save', message);
        }
    });

}

function editProtocol() {
    let protocol_idx = protocol[PROTOCOL_IDX];
    let filters = getFilters();
    let protocol_text = replaceAll(getValue('protocol-text').toString(), '\n', '\r\n');
    let magneto_text = replaceAll(getValue('magneto-text').toString(), '\n', '\r\n');
    let text = protocol_idx + '\r\n' + filters + '\r\n' + protocol_text + '\r\n#\r\n' + magneto_text;
    log('edit', 'edit protocol');

    // if (text != existing_text) {
    //     let result = confirm('Do you want to change?');
    //     if (!result) return; 
    // }
    $.ajax({
        url: SERVER_URL+ "/api/pcr/protocol/edit",
        datatype: "json",
        contentType: "text/plain",
        type: "post",
        data: text,
        success: function (data) {
            if (data.result == 'ok') {
                toSetupPage();
            }
            log('save protocol', JSON.stringify(data))

        },
        error: function (request, status, error) {
            let message = "code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error;
            log('edit protocol save', message);
        }
    });
}


