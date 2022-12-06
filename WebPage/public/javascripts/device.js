function registerDevice() {
    const email = $("#email").val();
    const deviceId = $("#deviceId").val();
    const deviceName = $("#deviceName").val();
    const deviceToken = $("#deviceToken").val();
    
    $.ajax({
        url: '/devices/device',
        method: 'POST',
        contentType: 'application/json',
        headers: {'x-auth': localStorage.getItem("token")},
        data: JSON.stringify({
            deviceId: deviceId,
            deviceName: deviceName,
            deviceToken: deviceToken
        }),
        dataType: 'json'
    }).done(function(data, textStats, jqXHR) {
        
        var li = document.createElement("li");
        li.id = deviceName;
        //THANKS TIM!!!!!!!!!
        li.appendChild(document.createTextNode(deviceName));
        $("#yourDevices").appendChild(li);
        //Clear all text boxes
        document.getElementById('deviceId').value = '';
        document.getElementById('deviceName').value = '';
        document.getElementById('deviceToken').value = '';
        window.alert(`Success: ${data.responseJSON['msg']}`);
    }).fail(function(data, textStatus, jqXHR) {
        window.alert(`Error: ${data.responseJSON['msg']}`);
    });
}

function deleteDevice() {
    const email = $("#email").val();
    const deviceName = $("#deviceNameDelete").val();

    $.ajax({
        url: '/devices/device',
        method: 'DELETE',
        headers: {'x-auth': localStorage.getItem("token")},
        contentType: 'application/json',
        data: JSON.stringify({
            deviceName: deviceName
        }),
        dataType: 'json'
    }).done(function(data, textStats, jqXHR) {
        document.getElementById(deviceName).remove();
        //Clear all text boxes
        document.getElementById('deviceId').value = '';
        document.getElementById('deviceName').value = '';
        document.getElementById('deviceToken').value = '';
        window.alert(`Success: ${data.responseJSON['msg']}`);
    }).fail(function(data, textStatus, jqXHR) {
        window.alert(`Error: ${data.responseJSON['msg']}`);
    });
}

$(function () {
    $('#registerDevice').click(registerDevice);
    
});

$(function () {
    $('#deleteDevice').click(deleteDevice);
});

$(function () {
    $('#fetchDevice').click(fetchDevice);
    
});

function fetchDevice() {
    let deviceList = [];
    $("#yourDevices").empty();
    $.ajax({
        url: '/devices/device',
        method: 'GET',
        contentType: 'application/json',
        headers: {'x-auth': localStorage.getItem("token")},
        dataType: 'json'
    }).done(function(data, textStats, jqXHR) {
        var myData = JSON.parse(data.param);
        //console.log("data:", myData.deviceNam);
        for (let i = 0; i < myData.length; i++) {
            var li = document.createElement("li");
            li.id = myData[i].deviceName;
            //THANKS TIM!!!!!!!!!
            li.append(document.createTextNode(myData[i].deviceName));
            $("#yourDevices").append(li);
        }
        //window.alert(`Success: ${data.responseJSON['msg']}`);
        
    }).fail(function(data, textStatus, jqXHR) {
        window.alert(`Error: ${data.responseJSON['msg']}`);
    });
}