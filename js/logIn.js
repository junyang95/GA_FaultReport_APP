

function setObject(keyword, value) {
    window.localStorage.setItem(keyword, JSON.stringify(value));
}

function getObject(keyword) {
    var item_from_localStorage = window.localStorage.getItem(keyword);
    return item_from_localStorage && JSON.parse(item_from_localStorage);
}

function submitLogInForm() {
    $('#loginSubmitButton').css('background-color', 'lightgray');
    var logInFormData = {};
    logInFormData.userEmail = $('#userEmail').val();
    logInFormData.userPsw = $('#userPsw').val();
    logInFormData.keepLogin = $('#keepLogin').val();

    setObject('logInFormData', logInFormData);


    $('#unencryptedForm').append(logInFormData.userEmail + logInFormData.userPsw + logInFormData.keepLogin);

}

