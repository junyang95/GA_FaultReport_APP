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

function conertTimestamp(timestamp) {
    var dateObject = new Date(timestamp.replace(' ', 'T'));
    var date = dateObject.getFullYear() + "-" + (dateObject.getMonth() + 1) + "-" + dateObject.getDate();
    return date;
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
                case 'filter':
                    for (var i = 0; i < json_array.length; i++) {
                        let htmlFaultTable = "<tr><th>" + json_array[i].report_id + "</th><td>" + conertTimestamp(json_array[i].timestamp) + "</td><td>" + json_array[i].condition + " " + json_array[i].faultreference + " in " + json_array[i].sublocation + " on " + json_array[i].locationtype + "</td><td>" + json_array[i].faultstatus + "</td></tr>";
                        $('#viewFaultTableBody').append(htmlFaultTable);
                    }
                    break;
                case 'detail':
                    $('#viewFaultSection').hide();
                    $('#faultDetailSection').show();
                    for (var i = 0; i < json_array.length; i++) {
                        if (json_array[i].locationtype == 'Train'){
                            $('#t_coachnumber').show();
                            $('#d_coachnumber').show();

                            $('#t_seatno').show();
                            $('#d_seatno').show();

                            $('#t_stationname').hide();
                            $('#d_stationname').hide();

                            $('#t_platformnumber').hide();
                            $('#d_platformnumber').hide();

                            $('#d_coordinateCanvas').show();
                            $('#d_mapCanvas').show();
                        }else if(json_array[i].locationtype == 'Station'){
                            $('#t_coachnumber').hide();
                            $('#d_coachnumber').hide();

                            $('#t_seatno').hide();
                            $('#d_seatno').hide();

                            $('#t_stationname').show();
                            $('#d_stationname').show();

                            $('#t_platformnumber').show();
                            $('#d_platformnumber').show();

                            $('#d_coordinateCanvas').hide();
                            $('#d_mapCanvas').hide();
                        }

                        $('#d_faultstatus').append(json_array[i].faultstatus);

                        $('#d_report_id').append(json_array[i].report_id);
                        $('#d_timestamp').append(conertTimestamp(json_array[i].timestamp));
                        $('#d_description').append(json_array[i].condition + " " + json_array[i].faultreference + " in " + json_array[i].sublocation + " on " + json_array[i].locationtype);
                        $('#d_faultdescription').append(json_array[i].faultadditionalinfo);
                        $('#d_staff_id').append(json_array[i].staff_id);
                        $('#d_name').append(json_array[i].firstname + ' ' + json_array[i].lastname);
                        $('#d_roletype').append(json_array[i].roletype);
                        $('#d_email').append(json_array[i].email);

                        $('#d_locationtype').append(json_array[i].locationtype);
                        $('#d_coachnumber').append(json_array[i].coachnumber);
                        $('#d_seatno').append(json_array[i].seatno);
                        $('#d_stationname').append(json_array[i].stationname);
                        $('#d_platformnumber').append(json_array[i].platformnumber);

                        //still have not been implemented
                        //>>>>>>json_array[i].othervalue;

                        //still got bug on the map.
                        $('#d_mapCanvas').append('<img id="trainMapStyle1" style="width:100%" src="image/trainMap/'+ json_array[i].mapsource +'">');

                        //$('#d_coordinateCanvas').append();
                    }

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
                        $('#viewFaultUserName').append('Hello, ' + json_array[0].firstname + ' ' + json_array[0].lastname + '!');

                        json_array.splice(0, 1); // remove the authentication info json

                        $('#viewFaultTableBody').empty();   // empty the original table
                        for (var i = 0; i < json_array.length; i++) {
                            let htmlFaultTable = "<tr><th>" + json_array[i].report_id + "</th><td>" + conertTimestamp(json_array[i].timestamp) + "</td><td>" + json_array[i].condition + " " + json_array[i].faultreference + " in " + json_array[i].sublocation + " on " + json_array[i].locationtype + "</td><td>" + json_array[i].faultstatus + "</td></tr>";
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
