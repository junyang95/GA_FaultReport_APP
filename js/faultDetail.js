function setAllddNone() {
    $('#d_faultstatus').empty();
    $('#d_report_id').empty();
    $('#d_timestamp').empty();
    $('#d_description').empty();
    $('#d_faultdescription').empty();
    $('#d_staff_id').empty();
    $('#d_name').empty();
    $('#d_roletype').empty();
    $('#d_email').empty();

    $('#d_locationtype').empty();
    $('#d_coachnumber').empty();
    $('#d_seatno').empty();
    $('#d_stationname').empty();
    $('#d_platformnumber').empty();

    /////$('#d_coordinateCanvas').empty();
    $('#d_mapCanvas').empty();

    $('#localImage').empty();
}

function backToViewFault() {
    //show the view fault section, and hide the detail page
    $("#viewFaultSection").show();
    $("#faultDetailSection").hide();

    //show the back home button, and hide the buttons on fault details page
    $("#backButtonToViewFault").hide();
    $("#nextButtonToHome").hide();

    $("#backButtonToHome").show();

    //hide the logInSuccess info
    $('#logInSuccess').hide();
    //try to refresh the page maybe? update in fault detail page it also refresh the original table
    //also refresh the original filter
    var logInFormData = getObject('logInFormData');
    PostAjax('http://localhost:8081/logincheck', logInFormData, 'encryptedForm', 'logincheck');

    //remove the highlight on previous filter
    $("#statusListGroup >li.active").removeClass("active");
    $("#locationListGroup >li.active").removeClass("active");
    $("#sortByListGroup >li.active").removeClass("active");
}


function backToHomeSectionFromViewFault() {
    $("#homeSection").show();
    $("#reportFaultFormSection").hide();
    $("#loginSection").hide();
    $("#viewFaultSection").hide();
    $("#faultDetailSection").hide();
    $('#navFooter').hide();
    $('#faultDetail').hide();
}


$(document).ready(function () {
    //jQuery click not working for dynamically created items [duplicate], the ID must be the static part;
    //https://api.jquery.com/on/#on-events-selector-data-handler
    //event handler  for static element
    $('#viewFaultSection').on('click', 'tbody > tr', function (event) {
        //clear all text file in original fault detail page.
        setAllddNone();

        var report_id = $(this).find('th').text();
        var data = {
            report_id: report_id
        };
        PostAjax('http://localhost:8081/detail', data, 'statusFaultDetail', 'detail');
    });


    $('#faultDetailSection').on('click', 'a.dropdown-item', function (event) {
        //clear the original current fault status
        $('#d_faultstatus').empty();

        var update_faultstatus = $(this).text();
        var report_id = $('#d_report_id').text();

        var data = {
            report_id: report_id,
            update_faultstatus: update_faultstatus
        };

        PostAjax('http://localhost:8081/updatestatus', data, 'd_faultstatus', 'updatestatus');
    });

});