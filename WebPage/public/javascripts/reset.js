// Check whether passwords are valid
function validatePasswords() {
    let password = $("#password").val();
    let confirmPassword = $("#passwordConfirm").val();
    // Valid password has 1 uppercase letter, 1 lowercase letter, 1 number, one special character, and
    // is at least 10 characters long.
    const upperRegex = /[A-Z]/;
    const lowerRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialRegex = /[_!@#$%^&]/;

    // Check if valid using the regexes and add errors accordingly
    let valid = true;
    if(!upperRegex.test(password)) {
        addError("Password needs at least 1 uppercase character");
        valid = false;
    }
    if(!lowerRegex.test(password)) {
        addError("Password needs at least 1 lowercase character");
        valid = false;
    }
    if(!numberRegex.test(password)) {
        addError("Password needs at least 1 number");
        valid = false;
    }
    if(!specialRegex.test(password)) {
        addError("Password needs at least 1 special character: !@#$%^&");
        valid = false;
    }
    if(!password || password.length < 10) {
        addError("Password needs to be at least 10 characters long");
        valid = false;
    }
    if(password !== confirmPassword) {
        addError("Password and confirm password do not match");
        valid = false;
    }
    return valid;
}

// Clears all errors in the dialog
function clearErrors() {
    $("#errors").empty();
}

// Adds an error to list of errors
function addError(error) {
    $("#errors").append(`<li>${error}</li>`);
}

// Validates the passwords
function validate() {
    clearErrors();
    return validatePasswords();
}

// Resets the password using the backend
function reset() {
    clearErrors();
    if(validate()) {
        $.ajax({
            url: '/account/reset',
            method: 'PUT',
            headers: {'x-auth': localStorage.getItem("token")},
            contentType: 'application/json',
            data: JSON.stringify({password: $("#password").val()}),
            dataType: 'json'
        }).done(function(data, textStatus, jqXHR) {
            // Successful reset
            window.alert("Password reset successfully!");
            window.location.href = "login.html";
        }).fail(function(data, textStatus, jqXHR) {
            // Display failure message
            addError(data.responseJSON['message']);
        });
    }
    else {
        // Password failed validation
        window.alert("Please enter a valid new password.");
    }
}

// Setup event listeners
function setupListeners() {
    $("#password, #passwordConfirm").on("input", validate);
    $("input").keydown(function(ev){
        if(ev.keyCode == 13) // If enter pressed
            reset();
    });
    $("input[type=button]").click(reset);
}

// Clear errors, show initial validation errors, and setup listeners.
$(function() {
    clearErrors();
    validate();
    setupListeners();
});