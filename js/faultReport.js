
//show the coach number
function unhideCoach(){

    //show coach
    $("#unhideCoach").show();
    $("#unhideStation").hide();
    $('#stationBox').css('background-color','lightgray');
    $('#coachBox').css('background-color','#D70428');
    $('#stationInput').val("");
    coachNumberValidation(); //this function validate the coach number
}

//show the station dropdown
function unhideStation(){

    //show station
    $("#unhideStation").show();
    $("#unhideCoach").hide();
    $('#stationBox').css('background-color','#D70428');
    $('#coachBox').css('background-color','lightgray');

    stationFilter();
    //displayStation("http://localhost:8081/getStation","stationList");


}

//this function is to filter the station name
function stationFilter(){

    //get station name from database
    //displayStation("http://localhost:8081/getStation","stationList");

    $("#stationInput").on("keyup", function() {

        var value = $(this).val().toLowerCase();
        $("#stationList li").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    var stationInputValue = $('#stationInput').val();
    var regex = /^[0-9]{4,6}$/;
    var text = $("li.selectedStation").val();

    //when have time fix this here

    if (!regex.test(stationInputValue) || !stationInputValue || !text) {

        $('#unhideStationNameFilter').hide();

    }else{

        $('#unhideStationNameFilter').show();
    }

    //this function allows to select station from dropdown

    stationDropdownSelect();
}

//click function to select the station from filter
function stationDropdownSelect(){

    //have a look where to move this may to station filter

    $("#stationList").find("li").click(function(){

        $('.selectedStation').removeClass('selectedStation');
        $(this).addClass('selectedStation');
        var text = $('#stationList').find("li.selectedStation").text();
        $('#stationInput').val(text);
        $('#stationList li').hide();
        //$('#issueTypeDropdown').show();
        $('#unhideStationNameFilter').show();
        displayIssueType("http://localhost:8081/getIssueType","issueTypeDropdown");
    });
}

//this function get issueType from database using AJAX
function displayIssueType(path,disp_id){

    $.ajax({
        url: path,
        type: "POST",
        //data: json,
        success: function(rt) {
            console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array

            $('#'+disp_id).empty();
            $('#'+disp_id).append($('<option disabled selected value>Select an issue type</option>'));
            $.each(json, function(i,val) {

                //here append the dropdown items to the dropdown
                    $('#'+disp_id).append($('<option>', {
                        value: val.roletype_id,
                        text: val.roletype
                    }));
            })
        },
        error: function(){
            alert("error");
        }
    });
}

//this function get stationName from database using AJAX
function displayStation(path,disp_id){

    $.ajax({
        url: path,
        type: "POST",
        //data: json,
        success: function(rt) {
            console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array
            $('#'+disp_id).empty();
            $.each(json, function(i,val) {
                $('#'+disp_id).append('<li class="list-group-item" value='+ val.stationname_id +'">'+ val.stationname +'</li>');
                //$('#'+disp_id).append('<li class="list-group-item" value="'+ val.stationname_id +'">'+ val.stationname +'</li>');
            })
        },
        error: function(){
            alert("error");
        }
    });
}

//this function validate the coach number
function coachNumberValidation(){

    $("#coachNumberInput").on("keyup", function() {

        var coachNumberInputValue = $('#coachNumberInput').val();
        var regex = /\d{6}/;

        if(!regex.test(coachNumberInputValue)||!coachNumberInputValue ){

            $('#coachNumberInput').css('border','1px solid red');
            $('#unhideSeatRequest').hide();

        }else{
            $('#coachNumberInput').css('border','1px solid lightgray');

            $('#unhideSeatRequest').show();


        }
    });
}

//this function shows the seat number
function unhideSeatNumber(){

    $('#unhideSeatNumber').show();


}


