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

function tableSelection(ID_TableBody) {
    var currentRow = $("tbody#" + ID_TableBody + " > tr").closest('tr');

    var id = currentRow.find('th').text();
    alert(id);
}

$(document).ready(function () {
    console.log('jy111111');
    let htmlFaultTable = "<tr><th>" + '1' + "</th><td>" +'2' + "</td><td>" + '3' + "</td><td>" + '4' + "</td></tr>";
    $('#viewFaultTableBody').append(htmlFaultTable);
    console.log('jy222222');



    $('#viewFaultTable > tbody').on('click', 'tr', function (event) {
        console.log('jy22222222');
        console.log($(this).text());
    });

    $('#viewFaultTable > tbody').on('click', 'tr', function (event) {
        console.log('jy33333333');
        console.log($(this).text());
    });

});