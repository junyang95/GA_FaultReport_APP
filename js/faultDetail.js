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

    $('#d_coordinateCanvas').empty();
    $('#d_mapCanvas').empty();
}


$(document).ready(function () {
    //jQuery click not working for dynamically created items [duplicate], the ID must be the static part;
    //https://api.jquery.com/on/#on-events-selector-data-handler
    //event handler  for static element
    $('#viewFaultSection').on('click', 'tbody > tr', function (event) {
        //clear all text file in original fault detail page.
        setAllddNone();

        var report_id =  $(this).find('th').text();
        var data = {
            report_id: report_id
        };
        PostAjax('http://localhost:8081/detail', data, 'statusFaultDetail', 'detail');
    });

});