var coachNumberInputValue;
var outputCoachNumber;
//put all the paths here, so it easily to change and add
const getIssueTypePath = "http://localhost:8081/getIssueType";
const getStationPath = "http://localhost:8081/getStation";
const getTrainMap = "http://localhost:8081/getCoachMap";
const getFaultObjectPath = "";
const getFaultConditiontPath = "";
const getCoachNumberPath = "http://localhost:8081/getCoachNumber";


//show the coach number
function unhideCoach(){

    //show coach
    $("#unhideCoach").show();
    $("#unhideStation").hide();
    $('#stationBox').css('background-color','lightgray');
    $('#coachBox').css('background-color','#D70428');
    $('#stationInput').val("");

    coachNumberValidation(); //this function validate the coach number
    seatNumberValidation();
}

//show the station dropdown
function unhideStation(){

    //show station
    $("#unhideStation").show();
    $("#unhideCoach").hide();
    $('#stationBox').css('background-color','#D70428');
    $('#coachBox').css('background-color','lightgray');

    stationFilter();
    displayStation("http://localhost:8081/getStation","stationList");


}

function displayLocationType(path,disp_id){
    $.ajax({

        url: path,
        type: "POST",
        success: function(rt) {

            console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array
            $('#'+disp_id).empty();
            $.each(json, function(i,val) {

                console.log(val);

                $('#'+disp_id).append($('<p class="redBox" id="'+val.html_id+'" value="'+val.locationType_id+'" onclick="'+ val.onclickFunction +'"><i class="'+val.icon+'"></i>'+val.locationtype+'</p>'));
            })
        },
        error: function(){
            alert("error");
        }
    });

}

//this function is to filter the station name
function stationFilter(){

    //get station name from database

    //displayStation(getStationPath,"stationList");

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

        $('#unhideStationLocation').hide();

    }else{

        $('#unhideStationLocation').show();
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
        $('#unhideStationLocation').show();

    });
}

//this function get issueType from database using AJAX
function displayIssueType(path,disp_id){

    // fix this tmr morning because this is not working

    $.ajax({
        url: path,
        type: "POST",
        //data: json,
        success: function(rt) {
            console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array

            $('#'+disp_id).empty();
            $('#'+disp_id).append($('<option value="0" disabled selected>Select an issue type</option>'));
            $.each(json, function(i,val) {

                //here append the dropdown items to the dropdown
                    $('#'+disp_id).append($('<option>', {
                        value: val.issuetype_id,
                        text: val.issuetype
                    }));
            })
        },
        error: function(){
            alert("error");
        }
    });
}

//this function need to fix by displaying the station from database instead of frontend
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

        coachNumberInputValue = $('#coachNumberInput').val();
        var regex = /^\d{5,6}$/;

        var output = returnCoachNumber(getCoachNumberPath,coachNumberInputValue);

        console.log("Coach Number Output: "+output+", INPUT: "+ coachNumberInputValue);

        if(!regex.test(coachNumberInputValue) || !coachNumberInputValue || coachNumberInputValue != output){

            $('#coachNumberInput').css('border','1px solid #D70428');
            $('#unhideSeatRequest').hide();

        }else{
            $('#coachNumberInput').css('border','1px solid lightgray');
            $('#unhideSeatRequest').show();
        }

        returnCoachMap(getTrainMap,coachNumberInputValue,"trainMap");
    });
}

//this function shows the seat number
function unhideSeatNumber(){

    $('#unhideSeatNumber').show();
    $('#unhideSeatMap').hide();
    $('#seatNumberUnavailable').css('background-color','lightgray');
    $('#seatNumberAvailable').css('background-color','#D70428');
    $('#unhideFaultDescriptionDropdown').hide();
}

//this function shows the trainMap
function unhideTrainMap(){

    $('#unhideSeatMap').show();
    $('#unhideSeatNumber').hide();
    $('#seatNumberUnavailable').css('background-color','#D70428');
    $('#seatNumberAvailable').css('background-color','lightgray');
    $('#unhideFaultDescriptionDropdown').hide();
}

//this function validate the coach number
function seatNumberValidation(){

    $("#seatNumberInput").on("keyup", function() {

        var coachNumberInputValue = $('#seatNumberInput').val();
        var regex = /\d{2}/;

        if(!regex.test(coachNumberInputValue)||!coachNumberInputValue ){

            $('#seatNumberInput').css('border','1px solid #D70428');
            $('#unhideFaultDescriptionDropdown').hide();

        }else{
            $('#seatNumberInput').css('border','1px solid lightgray');
            displayIssueType(getIssueTypePath,"issueTypeDropdown");
            $('#unhideFaultDescriptionDropdown').show();
            unhideFaultObject();
        }
    });
}

//this function is not finished, tried to make sure the dropdown is selected

function unhideFaultObject(){

    var index = $("select #issueTypeDropdown").val();


    if (index == 0){

        $('#unhideFaultObject').hide();

    }else{

        $('#unhideFaultObject').show();
    }
}

function returnCoachNumber(path,coachNumberInput){

    $.ajax({
        url: path,
        type: "POST",
        data: coachNumberInput,
        success: function(rt) {
            console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array
            outputCoachNumber=null;
                $.each(json, function(i,val) {

                    outputCoachNumber = val.coachnumber;

                    //console.log("From ajax: OUTPUT "+outputCoachNumber+" INPUT: "+coachNumberInputValue);

                    if(outputCoachNumber==coachNumberInputValue){

                        $('#coachNumberInput').css('border','1px solid lightgray');
                        $('#unhideSeatRequest').show();
                    }
            })
        },
        error: function(){
            alert("error");
        }
    });
    return outputCoachNumber;
}

function returnCoachMap(path,coachNumberInput,disp_id){

    $.ajax({
        url: path,
        type: "POST",
        data: coachNumberInput,
        success: function(rt) {
            console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array
            $.each(json, function(i,val) {

                $('#'+disp_id).html('<img class="trainMap" src="image/trainMap/'+ val.mapsource +'">');
            })
        },
        error: function(){
            alert("error");
        }
    });
    return outputCoachNumber;
}


