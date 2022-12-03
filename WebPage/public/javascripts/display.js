function registerDevice() {
    const email = $("#email").val();
    const deviceId = $("#deviceId").val();
    const deviceToken = $("#deviceToken").val();

    $.ajax({
        url: '/devices/device',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            email: email,
            deviceId: deviceId,
            deviceToken: deviceToken
        }),
        dataType: 'json'
    });
}

$(function () {
    $('#registerDevice').click(registerDevice);
});