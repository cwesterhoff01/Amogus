//sign out
$(function (){
    $('#signOut').click(logout);

    $.ajax({
        url: '/account/status',
        method: 'GET',
        headers: { 'x-auth' : window.localStorage.getItem("token") },
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
        $('#rxData').html(JSON.stringify(data, null, 2));
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        window.location.replace("display.html");
    });
});

//logout
function logout() {
    localStorage.removeItem("token");
    window.location.replace("index.html");
}
//setup listener 
$(function () {
    $('#getWeekly').click(getWeekly);
});
//Graphing stuff i guess
function getWeekly() {
    $.ajax({
        url: '/devices/device',
        method: 'GET',
        contentType: 'application/json',
        headers: {'x-auth': localStorage.getItem("token")},
        dataType: 'json'
    }).done(function(data, textStats, jqXHR) {

        //get todays date
        const date = new Date();
        let day = date.getDate();
        console.log(day);
        //Getting the device name from text box then clearing
        const device_name = $('#device_name').val(); 
        //loop through all data from past 7 days find max, min and avg
        var myData = JSON.parse(data.param);
        //loooooooooooooop through myData and see if device name matches
        for (let i = 0; i < myData.length; ++i) {
            if(myData[i].deviceName == device_name) {
                const device = myData[i];
                break;
            }
        }
        for (let i = 0; i < device.data.length; i++){
            //device.data[i].heartRate
            //device.data[i].spo2
            //check if time in last seven daya
                //if time on same day log data (check for max, min, and add to ongoing total)
                //else dont care
        }
        //display that data
    }).fail(function(data, textStatus, jqXHR) {
        console.log("failure has occurred call the police for help!");
    });
}
//add listener
$(function () {
    $('#getDaily').click(getDaily);
});
//Graphing stuff i guess
function getDaily() {
    $.ajax({
        url: '/devices/device',
        method: 'GET',
        contentType: 'application/json',
        headers: {'x-auth': localStorage.getItem("token")},
        dataType: 'json'
    }).done(function(data, textStats, jqXHR) {
        //Get the target day from the text box
        const date = $('#day').val();
        
        //Find blood oxygen and heart rate data values from database
        let heartData = [];
        let oxygenData = [];
        let device = null;
        const device_name = $('#device_name').val();
        var myData = JSON.parse(data.param);
        //loooooooooooooop through myData and see if device name matches
        for (let i = 0; i < myData.length; ++i) {
            if(myData[i].deviceName == device_name) {
                 device = myData[i];
                break;
            }
        }
        for (let i = 0; i < device.data.length; i++){
            
            //device.data[i].heartRate
            //device.data[i].spo2
            //check if time is on same day
                //if time on same day log data
                //else dont care
            let deviceDate = new Date(device.data[i].date);
            console.log(deviceDate);
            
         
        }
        //Put all data into 2 graph (heart rate, blood oxygen)
            //horizontal axis: time of day
            //vertical axis: measurement
            //min and max values displayed
    }).fail(function(data, textStatus, jqXHR) {
        console.log("failure has occurred call the police for help!");
    });
}