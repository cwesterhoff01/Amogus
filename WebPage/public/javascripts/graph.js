$(function () {
    $('#fetchData').click(fetchDevice);
    
});

function fetchDevice() {
    $.ajax({
        url: '/devices/device',
        method: 'GET',
        contentType: 'application/json',
        headers: {'x-auth': localStorage.getItem("token")},
        dataType: 'json'
    }).done(function(data, textStats, jqXHR) {
        var myData = JSON.parse(data.param);
        var lastDevice = myData.length - 1;
        var lastData = myData[lastDevice].data.length - 1;

        
        if(lastData >= 1){
            console.log(myData[lastDevice].data[lastData]);
        }
        else{
            console.log("No data found");
        }
        //window.alert(`Success: ${data.responseJSON['msg']}`);
    }).fail(function(data, textStatus, jqXHR) {
        //window.alert(`Error: ${data.responseJSON['msg']}`);
        console.log("fail");
    });
}