function filterSelection(ID_listGroup, ID_listGroupItem) {
    $("#" + ID_listGroup + ">li.active").removeClass("active");
    $('#' + ID_listGroupItem).addClass('active');

    let status = $('ul#statusListGroup').find('li.active').attr('value');
    let location = $('ul#locationListGroup').find('li.active').attr('value');
    let sortby = $('ul#sortByListGroup').find('li.active').attr('value');

    var data = {
        status: status,
        location: location,
        sortby: sortby
    };

    console.log(data);

    PostAjax('http://localhost:8081/filter', data, 'viewFaultTableBody', 'filter');
}

$(document).ready(function () {
    //jQuery click not working for dynamically created items [duplicate], the ID must be the static part;
    //https://api.jquery.com/on/#on-events-selector-data-handler
    //event handler  for static element
    $('#viewFaultSection').on('click', 'tbody > tr', function (event) {
        var report_id =  $(this).find('th').text();
    });

});