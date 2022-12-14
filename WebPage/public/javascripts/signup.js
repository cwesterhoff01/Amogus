// public/javasciprts/signup.js
//create account using email and username
function signup() {
    $("#errors").empty();
    // data validation
    if ($('#email').val() === "") {
        window.alert("invalid email!");
        return;
    }
    if ($('#password').val() === "") {
        window.alert("invalid password");
        return;
    }

    let txdata = {
        email: $('#email').val(),
        password: $('#password').val()
    };

    $.ajax({
        url: '/account/signUp',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
        
    })
    .done(function (data, textStatus, jqXHR) {
        $('#rxData').html(JSON.stringify(data, null, 2));
        if (data.success) {
            // after 1 second, move to "login.html"
            setTimeout(function(){
                window.location = "login.html";
            }, 1000);
        }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 404) {
            $('#rxData').html("Server could not be reached!!!");    
        }
        else if(jqXHR.status == 400){
            $("#errors").append(`<li>Invalid email or password</li>`);
        }
        else $('#rxData').html(JSON.stringify(jqXHR, null, 2));
    });
}


//add event listener
$(function () {
    $('#btnSignUp').click(signup);
    
});