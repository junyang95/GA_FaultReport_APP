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
    } else {
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

            switch (page) {
                case 'case1':

                    break;
                case 'case2':

                    break;
                case 'logincheck':


                    if (json_array[0].authentication == 'success') {
                        setAllAlertsNone();
                        $('#resultFromSQL').empty();
                        $('#resultFromSQL').append(json_array[0].authentication);
                        $('#logInSuccess').css('display', 'block');

                        $("#loginSection").hide();
                        $("#viewFaultSection").show();

                        $('#viewFaultUserName').empty();
                        $('#viewFaultRoleType').empty();
                        $('#viewFaultUserName').append('Hello, ' + json_array[0].firstname + ' ' + json_array[0].lastname + ' (' + json_array[0].userEmail + ') - ' + json_array[0].roletype);

                        json_array.splice(0, 1); // remove the authentication info json

                        $('#viewFaultTableBody').empty();   // empty the original table
                        for (var i = 0; i< json_array.length; i++) {
                            let htmlFaultTable = "<tr><th>" + json_array[i].report_id + "</th><td>" + json_array[i].issuetype + "</td><td>" + json_array[i].fault + " is " + json_array[i].condition + "</td><td>" + json_array[i].faultstatus + "</td></tr>";
                            $('#viewFaultTableBody').append(htmlFaultTable);
                        }
                    } else if (json_array[0].authentication == 'fail') {
                        setAllAlertsNone();
                        $('#resultFromSQL').empty();
                        $('#resultFromSQL').append(json_array[0].authentication);
                        $('#logInError').css('display', 'block');
                    } else if (json_array[0].authentication == 'noUser') {
                        setAllAlertsNone();
                        $('#resultFromSQL').empty();
                        $('#resultFromSQL').append(json_array[0].authentication);
                        $('#logInNoUser').css('display', 'block');
                    }
                    $('#' + html_position_id).append('encryptedForm: ' + 'userEmail: ' + json.userEmail + 'userPsw: ' + json.firstname + 'keepLogin: ' + json.roletype);
                    break;
            }

        },
        error: function () {
            alert("error");
        }
    });
}
