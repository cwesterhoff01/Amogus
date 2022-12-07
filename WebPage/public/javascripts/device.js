//add device to user
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
        li.append(document.createTextNode(deviceName));
        $("#yourDevices").append(li);
        //Clear all text boxes
        document.getElementById('deviceId').value = '';
        document.getElementById('deviceName').value = '';
        document.getElementById('deviceToken').value = '';
        window.alert(`Success: ${data.responseJSON['msg']}`);
    }).fail(function(data, textStatus, jqXHR) {
        window.alert(`Error: ${data.responseJSON['msg']}`);
    });
}

//delete device from user
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
        document.getElementById('deviceNameDelete').value = '';
        window.alert(`Success: ${data.responseJSON['msg']}`);
    }).fail(function(data, textStatus, jqXHR) {
        window.alert(`Error: ${data.responseJSON['msg']}`);
    });
}

//add listener
$(function () {
    $('#registerDevice').click(registerDevice);
    
});

//add listener
$(function () {
    $('#deleteDevice').click(deleteDevice);
});

//fetch all devices attached to user
function fetchDevice() {
    $("#yourDevices").empty();
    $.ajax({
        url: '/devices/device',
        method: 'GET',
        contentType: 'application/json',
        headers: {'x-auth': localStorage.getItem("token")},
        dataType: 'json'
    }).done(function(data, textStats, jqXHR) {
        var myData = JSON.parse(data.param);
        for (let i = 0; i < myData.length; i++) {
            var li = document.createElement("li");
            li.id = myData[i].deviceName;
            //THANKS TIM!!!!!!!!!
            li.append(document.createTextNode(myData[i].deviceName));
            $("#yourDevices").append(li);
        }
        
    }).fail(function(data, textStatus, jqXHR) {
        window.alert(`Error: ${data.responseJSON['msg']}`);
    });
}