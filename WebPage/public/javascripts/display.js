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

        let heartData = [];
        let oxygenData = [];

        //get todays date and 7 days ago date
        var date = new Date();
        var date1 = new Date(date.getTime() - (7 * 24 * 60 *60 * 1000));
       

        //Getting the device name from text box then clearing
        const device_name = $('#device_name').val();

        //loop through all data from past 7 days find max, min and avg
        var myData = JSON.parse(data.param);

        //loooooooooooooop through myData and see if device name matches
        for (let i = 0; i < myData.length; ++i) {
            if(myData[i].deviceName == device_name) {
                 device = myData[i];
                break;
            }
        }
        //console.log("date = ", date.getTime());
        //console.log("date1 = ", date1.getTime());
        for (let i = 0; i < device.data.length; i++){
            //Getting device data time recorded
            let deviceDate = new Date(device.data[i].time);
            //See if data was taken in past seven days
            console.log("deviceDate = ", deviceDate.getTime());
            if(deviceDate.getTime() > date1.getTime()) {
                //console.log("adding information to arrays!");
                heartData.push(device.data[i].heartRate);
                oxygenData.push(device.data[i].spo2);
            }

        }
        //console.log(heartData);
        //console.log(oxygenData);

        //display that data (max, min, average)
        let maxHeart = heartData[0];
        let minHeart = heartData[0];
        let tHeart = 0;
        let maxOx = oxygenData[0];
        let minOx = oxygenData[0];
        let tOx = 0;

        for(let i = 0; i < heartData.length; i++){
            //find min and maxes
            if(heartData[i] > maxHeart){
                maxHeart = heartData[i];
            }
            if(heartData[i] < minHeart){
                minHeart = heartData[i];
            }
            if(oxygenData[i] > maxOx){
                maxOx = oxygenData[i];
            }
            if(oxygenData[i] < minOx){
                minOx = oxygenData[i];
            }
            tHeart = tHeart + heartData[i];
            tOx = tOx + oxygenData[i];
        }
        let avgHeart = tHeart / heartData.length;
        let avgOx = tOx / oxygenData.length;

        //Put data onto html page
        //damn we are great coders!
        var li = document.createElement("li");
        li.append(document.createTextNode("Max HeartRate = " + maxHeart));
        $("#week").append(li);
        var li = document.createElement("li");
        li.append(document.createTextNode("Min HeartRate = " + minHeart));
        $("#week").append(li);
        var li = document.createElement("li");
        li.append(document.createTextNode("Average HeartRate = " + avgHeart));
        $("#week").append(li);
        var li = document.createElement("li");
        li.append(document.createTextNode("Max Oxygen Saturation = " + maxOx));
        $("#week").append(li);
        var li = document.createElement("li");
        li.append(document.createTextNode("Min Oxygen Saturation = " + minOx));
        $("#week").append(li);
        var li = document.createElement("li");
        li.append(document.createTextNode("Average Oxygen Saturation = " + avgOx));
        $("#week").append(li);
        
        //Make it so when click button again do keep adding

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
        let timeData = [];
        let device = null;
        const device_name = $('#device_name').val();
        //month-day
        let dates = date.split("-");
        
        let day = parseInt(dates[1]);
        let month = parseInt(dates[0]);
        console.log("day = ", day);
        console.log("month = ", month); 

        var myData = JSON.parse(data.param);
        //loooooooooooooop through myData and see if device name matches
        for (let i = 0; i < myData.length; ++i) {
            if(myData[i].deviceName == device_name) {
                 device = myData[i];
                break;
            }
        }
        
        for (let i = 0; i < device.data.length; i++){
            //check if time is on same day
                //if time on same day log data
                //else dont care
            let deviceDate = new Date(device.data[i].time);
            console.log("device day = ", deviceDate.getDate());
            console.log("device month = ", deviceDate.getMonth() + 1);
            if(deviceDate.getDate() == day && (deviceDate.getMonth() + 1) == month) {
                heartData.push(device.data[i].heartRate);
                oxygenData.push(device.data[i].spo2);
                timeData.push(deviceDate.getTime());
                console.log("Adding information to the array");
            }

        }
        console.log(heartData);
        console.log(oxygenData);

        //Put all data into 2 graph (heart rate, blood oxygen)
            //horizontal axis: time of day
            //vertical axis: measurement
            //min and max values displayed
        var ctx = $("#line-heartcanvas");

        var dataHeart = {
            labels: timeData,
            datasets: [
                {
                    label: "Heartrate Chart",
                    data: heartData,
                    backgroundColor: "red",
                    borderColor: "pink",
                    fill: false,
                    lineTension: 0,
                    pointRadius: 5
                }
            ]
        };
    
        var chart = new Chart(ctx, {
            type: "line",
            data: dataHeart,
            options: {}
        });
        
        var ctx = $("#line-oxygencanvas");

        var dataOx = {
            labels: timeData,
            datasets: [
                {
                    label: "Oxygen Chart",
                    data: oxygenData,
                    backgroundColor: "blue",
                    borderColor: "lightblue",
                    fill: false,
                    lineTension: 0,
                    pointRadius: 5
                }
            ]
        };
    
        var chart = new Chart(ctx, {
            type: "line",
            data: dataOx,
            options: {}
        });
            
    }).fail(function(data, textStatus, jqXHR) {
        console.log("failure has occurred call the police for help!");
    });
}

