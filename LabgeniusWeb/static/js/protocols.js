let result = null;
let protocols = null;



function protocol_edit() {
    console.log("protocol edit");

}

function protocol_new() {
    console.log("protocol new");
}

function protocol_delete() {
    console.log("protocol delete");
}

function initialized() {
    $.ajax({
        url: "http://210.115.227.99:6009/api/pcr/protocol/list",
        datatype: "json",
        type:"post",
        success: function(data) {
            result = data.result;
            protocols = data.protocols;

        }
    })
}

function load_table() {

}

function click_item() {
    alert("click");
}