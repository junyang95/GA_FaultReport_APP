function setAllAlertsNone() {
    $('#emailCheck').css('display', 'none');
    $('#emailEmptyCheck').css('display', 'none');
    $('#passwordCheck').css('display', 'none');
    $('#logInError').css('display', 'none');
    $('#logInNoUser').css('display', 'none');
    $('#logInSuccess').css('display', 'none');
}

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

function isGAEmail(email) {
    var re = /\S+@\S+\.+co+\.+uk+/;
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

    if (!isGAEmail(logInFormData.userEmail)) {
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
    if (isGAEmail(logInFormData.userEmail) == true && isEmpty(logInFormData.userEmail) == false && pswCheck(logInFormData.userPsw) == true) {
        $('#unencryptedForm').empty();
        $('#unencryptedForm').append('unencryptedForm: ' + 'userEmail: ' + logInFormData.userEmail + 'userPsw: ' + logInFormData.userPsw + 'keepLogin: ' + logInFormData.keepLogin);

        PostAjax('http://localhost:8081/logincheck', logInFormData, 'encryptedForm', 'logincheck');
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
        success: function (json_str_new) {
            var json_array = JSON.parse(json_str_new);

            $('#' + html_position_id).empty(); //empty the area before display
            $('#select_identifier').empty();    //将选取是哪个developer的选取盒清空

            switch (page) {
                case 'case1':

                    break;
                case 'case2':

                    break;
                case 'logincheck':
                    $.each(json_array, function (i, json) {
                        if(json.authentication == 'success'){
                            setAllAlertsNone();
                            $('#resultFromSQL').empty();
                            $('#resultFromSQL').append(json.authentication);
                            $('#logInSuccess').css('display', 'block');
                        }else if(json.authentication == 'fail'){
                            setAllAlertsNone();
                            $('#resultFromSQL').empty();
                            $('#resultFromSQL').append(json.authentication);
                            $('#logInError').css('display', 'block');
                        }else if(json.authentication == 'noUser'){
                            setAllAlertsNone();
                            $('#resultFromSQL').empty();
                            $('#resultFromSQL').append(json.authentication);
                            $('#logInNoUser').css('display', 'block');
                        }
                        console.log(i);
                        $('#' + html_position_id).append('encryptedForm: ' + 'userEmail: ' + json.userEmail + 'userPsw: ' + json.firstname + 'keepLogin: ' + json.roletype);
                    });
                    break;
            }

        },
        error: function () {
            alert("error");
        }
    });
}
