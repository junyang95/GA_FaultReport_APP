function setObject(keyword, value) {
    window.localStorage.setItem(keyword, JSON.stringify(value));
}

function getObject(keyword) {
    var item_from_localStorage = window.localStorage.getItem(keyword);
    return item_from_localStorage && JSON.parse(item_from_localStorage);
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function isEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function pswCheck(password) {
    if (password.length >= 8 && password.length <= 20) {
        return true;
    } else {
        return false;
    }
}

function saveLogInForm() {
    var logInFormData = {};
    logInFormData.userEmail = $('#userEmail').val();
    logInFormData.userPsw = $('#userPsw').val();
    logInFormData.keepLogin = $('#keepLogin').is(':checked');
    setObject('logInFormData', logInFormData);
}

function submitLogInForm() {

    saveLogInForm();
    var logInFormData = getObject('logInFormData');

    //$('#loginSubmitButton').css('background-color', 'lightgray');

    //$('#logInError').css('display', 'block');

    if (!isEmail(logInFormData.userEmail)) {
        //problem - pop up
        $('#emailCheck').css('display', 'block');
    } else {
        $('#emailCheck').css('display', 'none');
    }

    if (isEmpty(logInFormData.userEmail)) {
        //problem - pop up
        $('#emailEmptyCheck').css('display', 'block');
    } else {
        $('#emailEmptyCheck').css('display', 'none');
    }

    if (!pswCheck(logInFormData.userPsw)) {
        $('#passwordCheck').css('display', 'block');
    } else {
        $('#passwordCheck').css('display', 'none');
    }

    // check everything before submit
    if (isEmail(logInFormData.userEmail) == true && isEmpty(logInFormData.userEmail) == false && pswCheck(logInFormData.userPsw) == true) {
        $('#unencryptedForm').empty();
        $('#unencryptedForm').append('unencryptedForm: ' + 'userEmail: ' + logInFormData.userEmail + 'userPsw: ' + logInFormData.userPsw + 'keepLogin: ' + logInFormData.keepLogin);

        PostAjax('http://localhost:8081/logincheck', logInFormData, 'encryptedForm', 'login');
    }else {
        $('#unencryptedForm').append('some problem with the form');
    }

}


function PostAjax(http_node_server_path, data, html_position_id, page) {
    var json = JSON.stringify(data); // convert the parameters to a JSON data string

    $.ajax({
        url: http_node_server_path,
        type: "POST",
        data: json,
        success: function (Response_StringJSONtext) {
            console.log(Response_StringJSONtext);
            var Response_JavaScriptObject = JSON.parse(Response_StringJSONtext);

            $('#' + html_position_id).empty(); //empty the area before display
            $('#select_identifier').empty();    //将选取是哪个developer的选取盒清空

            switch (page) {
                case 'case1':

                    break;
                case 'case2':

                    break;
                case 'login':
                    $.each(Response_JavaScriptObject, function (i, val) {
                        $('#' + html_position_id).append('encryptedForm: ' + 'userEmail: ' + val.userEmail + 'userPsw: ' + val.userPsw + 'keepLogin: ' + val.keepLogin);
                    });
                    break;
            }

        },
        error: function () {
            alert("error");
        }
    });
}
