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

function isNotEmail(email) {
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


function submitLogInForm() {
    $('#loginSubmitButton').css('background-color', 'lightgray');


    //$('#logInError').css('display', 'block');

    var logInFormData = {};
    logInFormData.userEmail = $('#userEmail').val();
    logInFormData.userPsw = $('#userPsw').val();
    logInFormData.keepLogin = $('#keepLogin').is(':checked');


    setObject('logInFormData', logInFormData);

    if (!isNotEmail(logInFormData.userEmail)) {
        $('#emailCheck').css('display', 'block');
    } else {
        $('#emailCheck').css('display', 'none');
    }

    if (isEmpty(logInFormData.userEmail)) {
        $('#emailEmptyCheck').css('display', 'block');
    } else {
        $('#emailEmptyCheck').css('display', 'none');
    }

    if (!pswCheck(logInFormData.userPsw)) {
        $('#passwordCheck').css('display', 'block');
    } else {
        $('#passwordCheck').css('display', 'none');
    }

    $('#unencryptedForm').append(logInFormData.userEmail + logInFormData.userPsw + logInFormData.keepLogin);
    postLoginForm("encryptedForm");
}

function postLoginForm(html_position_id) {
    saveUDIDs();
    var storedData = getObject('ArrayData');
    PostAjax('http://localhost:8081/insert_udid', storedData, html_position_id, 'insert_udid');
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
                case 'insert_sql':
                    //var avaliableroomcontent = "";
                    $.each(Response_JavaScriptObject, function (i, val) {
                        console.log(val);
                        $('#' + html_position_id).append(JSON.stringify(val) + "<br/>");
                        //avaliableroomcontent = "<tr><td>" + val.r_no + "" + val.r_class + "<br /></td></tr>" + avaliableroomcontent;
                    })
                    //$('#' + html_position_id).append(avaliableroomcontent);
                    break;
            }

        },
        error: function () {
            alert("error");
        }
    });
}
