// public/javasciprts/login.js
//login function
function login() {
    let txdata = {
        email: $('#email').val(),
        password: $('#password').val()
    };

    $.ajax({
        url: '/account/logIn',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(txdata),
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) {
        localStorage.setItem("token", data.token);
        window.location.replace("display.html");
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        $('#rxData').html(JSON.stringify(jqXHR, null, 2));
    });
}
//setup listener
$(function () {
    $('#btnLogIn').click(login);
});