//value to insert into report

var outputCoachNumber;
var locationType;
var xPercentage;
var yPercentage;
var subLocationListValue;
var faultListValue;
var conditionValue;
var stationValue;


// variables for storing purpose
var coachNumberInputValue;
var isSeatNumber;
var isOtherFaultObject;
var numberOfImage=1;
var isSeatAreaFault;
var isCoachFault;


//put all the paths here, so it easily to change and add
const getStationPath = "http://localhost:8081/getStation";
const getTrainMap = "http://localhost:8081/getCoachMap";
const getFaultConditiontPath = "http://localhost:8081/getfaultCondition";
const getCoachNumberPath = "http://localhost:8081/getCoachNumber";
const getSubLocation = "http://localhost:8081/getSubLocation";
const getFaultObjectPath = "http://localhost:8081/getfaultObjects";

//show the coach number
function unhideCoach(){

    isCoachFault = true;

    //show coach
    $("#unhideCoach").fadeIn("slow");
    $("#unhideStation").hide();
    $('#stationBox').css('background-color','lightgray');
    $('#coachBox').css('background-color','#D70428');
    $('#stationInput').val("");

    coachNumberValidation(); //this function validate the coach number
    seatNumberValidation();
    otherFaultDescValidation();

    locationType = $('#coachBox').attr("value");

    $('#nextButtonToReport2').hide();
    $('#seatNumberAvailable').css('background-color','#D70428');
    $('#seatNumberUnavailable').css('background-color','#D70428');
    $('#unhideSeatMap').hide();
    $('#unhideSeatRequest').hide();
    $('#trainMapContainer').hide();
    $('#unhideFaultDescriptionDropdown').hide();
    $('#unhideFaultCondition').hide();
    $('#unhideSeatNumber').hide();
    $('#userLocateText').hide();
    $('#unhidePlatformNumber').hide();


}

//show the station dropdown
function unhideStation(){

    isCoachFault = false;

    //show station
    $("#unhideStation").fadeIn("slow");
    $("#unhideCoach").hide();
    $('#stationBox').css('background-color','#D70428');
    $('#coachBox').css('background-color','lightgray');
    stationFilter();
    //displayStation(getStationPath,"stationList");
    locationType = $('#stationBox').attr("value");
    $('#nextButtonToReport2').hide();
    $('#coachNumberInput').val("");
    $('#unhideSeatMap').hide();
    $('#unhideSeatRequest').hide();
    $('#trainMapContainer').hide();
    $('#unhideFaultDescriptionDropdown').hide();
    $('#unhideFaultCondition').hide();
    $('#unhideSeatNumber').hide();
    $('#userLocateText').hide();
    $('#unhidePlatformNumber').hide();


}

function displayLocationType(path,disp_id){
    $.ajax({

        url: path,
        type: "POST",
        success: function(rt) {
            //console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array
            $('#'+disp_id).empty();

            $('#'+disp_id).append($('<p>Please identify the location of the fault</p>'));
            $.each(json, function(i,val) {

                $('#'+disp_id).append($('<p class="redBox" id="'+val.html_id+'" value="'+val.locationtype_id+'" onclick="'+ val.onclickfunction +'"><i class="'+val.icon+'"></i>'+val.locationtype+'</p>'));
            })
        },
        error: function(){
            alert("error");
        }
    });

}

//this function is to filter the station name
function stationFilter(){

    $("#stationInput").on("keyup", function() {

        var value = $(this).val().toLowerCase();
        $("#stationList li").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });


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
        //$('#unhideStationLocation').show();

        $('#unhideSeatMap').fadeIn("slow");

        stationValue = $(this).attr("value");

        returnSubLocation(getSubLocation,locationType,'subLocationList');

        unhideSeatNumberRequest();

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
            //console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array
            $('#'+disp_id).empty();
            $.each(json, function(i,val) {
                //console.log(val);
                $('#'+disp_id).html('<li class="list-group-item" value='+ val.stationname_id +'">'+ val.stationname +'</li>');
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

        //console.log("Coach Number Output: "+output+", INPUT: "+ coachNumberInputValue);

        if(!regex.test(coachNumberInputValue) || !coachNumberInputValue || coachNumberInputValue != output){

            $('#coachNumberInput').css('border','1px solid #D70428');
            //$('#unhideSeatRequest').hide();
            $('#nextButtonToReport2').hide();
            $('#unhideSeatMap').hide();
            $('#unhideFaultDescriptionDropdown').hide();
            $('#unhideFaultCondition').hide();

        }else{
            $('#coachNumberInput').css('border','1px solid lightgray');
            //$('#unhideSeatRequest').show();
            //$('#unhideSeatMap').show();
            $('#seatNumberAvailable').css('background-color','#D70428');
            $('#seatNumberUnavailable').css('background-color','#D70428');

        }




    });
}

//this function shows the seat number
function unhideSeatNumber(){

    isSeatNumber=true;

    $('#unhideSeatNumber').fadeIn("slow");
    $('#seatNumberUnavailable').css('background-color','lightgray');
    $('#seatNumberAvailable').css('background-color','#D70428');

    $('#trainMapContainer').hide();
    $('#unhideFaultDescriptionDropdown').hide();
    $('#unhideFaultCondition').hide();
    $('#userLocateText').hide();
    $('#unhideFaultCondition').hide();
    $('#unhideFaultDescriptionDropdown').hide();

    scrollToId("#unhideSeatNumber");
}

//this function shows the trainMap
function unhideTrainMap(){

    isSeatNumber=false;

    $('#seatNumberInput').val("");

    $('#unhideSeatNumber').hide();
    $('#seatNumberUnavailable').css('background-color','#D70428');
    $('#seatNumberAvailable').css('background-color','lightgray');

    $('#userLocateText').fadeIn("slow");
    $('#trainMapContainer').fadeIn("slow");
    $('#faultLocationPoint').hide();


    $('#unhideFaultDescriptionDropdown').hide();
    $('#unhideFaultCondition').hide();


    //this scroll the page to an ID
    scrollToId("#userLocateText");


}

//this function validate the coach number
function seatNumberValidation(){

    $("#seatNumberInput").on("keyup", function() {

        var seatNumberInput = $('#seatNumberInput').val();
        var regex = /\d{1,2}/;

        if(!regex.test(seatNumberInput)||!seatNumberInput ){

            $('#seatNumberInput').css('border','1px solid #D70428');
            $('#unhideFaultDescriptionDropdown').hide();
            $('#unhideFaultCondition').hide();
            $('#nextButtonToCamera').hide();
        }else{
            $('#seatNumberInput').css('border','1px solid lightgray');
            subLocationListValue= "4";

            getFaultObjects(getFaultObjectPath,subLocationListValue,'faultObjectDropdown');


            $('#unhideFaultDescriptionDropdown').fadeIn("slow");


            scrollToId("#unhideFaultDescriptionDropdown");

            unhideCondition();
        }
    });
}

function platformValidation(){

    $("#platformNumberInput").on("keyup", function() {

        if(!$('#platformNumberInput').val()){

            $('#unhideFaultDescriptionDropdown').hide();

            $('#nextButtonToCamera').hide();

            $('#platformNumberInput').css('border','1px solid #D70428');

        }else{




            $('#unhideFaultDescriptionDropdown').fadeIn('slow');

            $('#platformNumberInput').css('border','1px solid #ccc');

            scrollToId("#unhideFaultDescriptionDropdown");

        }
    });

}

//this function is not finished, tried to make sure the dropdown is selected

function unhideSeatNumberRequest(){

    $("#subLocationList").on("change",function () {

        subLocationListValue = $(this).find('option:selected').attr("value"); // get value (attribute) of "subLocationList"

        $('#unhideFaultCondition').hide();

        if (subLocationListValue == 0){ // if the list was not selected

            $('#unhideFaultDescriptionDropdown').hide();
            $('#unhideFaultCondition').hide();

            $('#nextButtonToReport2').hide();

        }else if(subLocationListValue=="others"){ // 4 is fault id for Seating area in coach
            $('#otherFaultInput').val("");

            unhideOtherOption();
            getCoordinateFromMap();
            $('#unhideFaultDescriptionDropdown').hide();
            unhideCondition();
            $('#unhideFaultCondition').hide();

            $('#unhideSeatNumber').hide();
            $('#trainMapContainer').hide();
            $('#otherFault').fadeIn('slow');
            $('#unhidePlatformNumber').hide();

            isOtherFaultObject=true;
            isSeatAreaFault=false;

        }else if(subLocationListValue==4){ // if the list was 'seating area'
            getFaultObjects(getFaultObjectPath,subLocationListValue,'faultObjectDropdown');

            unhideOtherOption();
            getCoordinateFromMap();
            $('#unhideFaultDescriptionDropdown').hide();
            $('#otherFault').hide();

            isOtherFaultObject=false;
            isSeatAreaFault=true;

            $('#unhideSeatRequest').fadeIn('slow');

            ///////////////////////////////////////////////////////////////////////////////////////////////////////

            $('#unhideFaultDescriptionDropdown').hide();
            $('#unhidePlatformNumber').hide();

            $('#seatNumberAvailable').css('background-color','#D70428');
            $('#seatNumberUnavailable').css('background-color','#D70428');

            scrollToId("#unhideSeatRequest");

        }else if(subLocationListValue==3) {

            $('#unhidePlatformNumber').fadeIn('slow');
            $('#unhideFaultDescriptionDropdown').hide();
            $('#otherFault').hide();
            platformValidation();

            getFaultObjects(getFaultObjectPath,subLocationListValue,'faultObjectDropdown');

        }else { // when selected any other option
            getFaultObjects(getFaultObjectPath,subLocationListValue,'faultObjectDropdown');

            unhideCondition();

            $('#faultLocationPoint').hide();
            $('#otherFault').hide();


            isOtherFaultObject=false;
            isSeatAreaFault=false;

            $('#unhideSeatRequest').hide();
            $('#userLocateText').hide();
            //$('#unhideFaultDescriptionDropdown').fadeOut("slow");
            $('#unhideFaultDescriptionDropdown').fadeIn("slow");

            $('#unhideSeatNumber').hide();
            $('#trainMapContainer').hide();

            $('#unhidePlatformNumber').hide();



            scrollToId("#unhideFaultDescriptionDropdown");

        };
    });

}

function unhideCondition(){

    $("#faultObjectDropdown").change(function () {

        faultListValue = $(this).find('option:selected').attr("value"); // get value (attribute) of "faultObjectDropdown"

        if(faultListValue==0){
            $('#unhideFaultCondition').hide();

        }else if(faultListValue=="o"){

            getFaultCondition(getFaultConditiontPath,faultListValue,'faultConditionDropdown');
            //$('#unhideFaultCondition').show();
            $('#otherFault').fadeIn("slow");
            $('#unhideFaultCondition').hide();
            //$('#unhideSeatNumber').hide();
            //$('#trainMapContainer').hide();

            isOtherFaultObject=true;

            scrollToId("#otherFault");

        }else if(faultListValue==4){
            isOtherFaultObject=false;


        }else{
            getFaultCondition(getFaultConditiontPath,faultListValue,'faultConditionDropdown');

            $('#otherFault').hide();
            isOtherFaultObject=false;
            $('#unhideFaultCondition').fadeIn("slow");
            //conditionDropdownChanges();

            scrollToId("#unhideFaultCondition");
        }
    });


}

function conditionDropdownChanges(){

    $("#faultConditionDropdown").change(function () {

        conditionValue = $(this).find('option:selected').attr("value"); // get value (attribute) of "faultObjectDropdown"

        if(conditionValue==0){


        }else if(conditionValue=="o"){


        }else{

            $('#nextButtonToCamera').fadeIn("slow");
        }

    });



}

function unhideOtherOption(){

    faultListValue = $('#faultObjectDropdown').find('option:selected').attr("value");

    //alert(faultObject);

    if(faultListValue==0){
        $('#unhideFaultDescriptionDropdown').hide();

    } else if(faultListValue == "o"){
        $('#otherFault').show();
        $('#unhideFaultCondition').hide();

    }else{
        $('#otherFault').hide();
    }
}

function returnCoachNumber(path,coachNumberInput){

    $.ajax({
        url: path,
        type: "POST",
        data: coachNumberInput,
        success: function(rt) {
            //console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array
            outputCoachNumber=null;
                $.each(json, function(i,val) {

                    outputCoachNumber = val.coachnumber;

                    //console.log("From ajax: OUTPUT "+outputCoachNumber+" INPUT: "+coachNumberInputValue);

                    if(outputCoachNumber==coachNumberInputValue){

                        $('#coachNumberInput').css('border','1px solid lightgray');
                        //$('#unhideSeatRequest').show();
                        $('#unhideSeatMap').fadeIn("slow");

                        returnSubLocation(getSubLocation,locationType,'subLocationList');

                        returnCoachMap(getTrainMap,coachNumberInputValue,"trainMap");

                        unhideSeatNumberRequest();
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
            //console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array

            $('#'+disp_id).empty();
            //$('#'+disp_id).append('<p class="smallFont">Click on the map to location the fault</p>');


            $.each(json, function(i,val) {
                $('#'+disp_id).append('<img id="trainMapStyle" src="image/trainMap/'+ val.mapsource +'">');

            });
        },
        error: function(){
            alert("error");
        }
    });

}

function returnSubLocation(path,locationType,disp_id){

    $.ajax({
        url: path,
        type: "POST",
        data: locationType,
        success: function(rt) {
            //console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array
            $('#'+disp_id).empty();
            $('#'+disp_id).append($('<option value="0" disabled selected>Select a sub location</option>'));

            $.each(json, function(i,val) {
                $('#'+disp_id).append($('<option value="'+ val.sublocation_id +'">'+ val.sublocation +'</option>'));
            })
            $('#'+disp_id).append($('<option value="others">Others</option>'));
        },
        error: function(){
            alert("error");
        }
    });
}

function getFaultObjects(path,subLocation,disp_id){

    $.ajax({
        url: path,
        type: "POST",
        data: subLocation,
        success: function(rt) {
            //console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array
            $('#'+disp_id).empty();
            $('#'+disp_id).append($('<option value="0" disabled selected>Select the fault</option>'));

            $.each(json, function(i,val) {

                $('#'+disp_id).append($('<option value="'+ val.fault_id +'">'+ val.faultreference +'</option>'));
            });

            $('#'+disp_id).append($('<option value="o">Others</option>'));
        },
        error: function(){
            alert("error");
        }
    });

}

// this function puts the coordinates into % so different screen size will still give the same position

function getCoordinateFromMap(){

    $("#trainMap").click(function(e) {
        var offset = $(this).offset();
        xPercentage = ((e.pageX - offset.left)/parseInt($(this).css("width")))*100;
        yPercentage = ((e.pageY - offset.top)/parseInt($(this).css("height")))*100;
        $('#faultLocationPoint').css({"top":yPercentage+'%'});
        $('#faultLocationPoint').css({'left':xPercentage+'%'});

        $('#faultLocationPoint').show();
        if(subLocationListValue==0) {

            $('#unhideFaultCondition').hide();
            $('#otherFault').hide();

        }else if(subLocationListValue==4){

            $('#unhideFaultDescriptionDropdown').show();
            $('#faultObjectDropdown').show();
            $('#otherFault').hide();

            scrollToId("#faultObjectDropdown");
        }

        if(isOtherFaultObject){

            $('#otherFault').show();
        }else{
            $('#otherFault').hide();
        }
    });
}

function getFaultCondition(path,faultListValue,disp_id){
    $.ajax({
        url: path,
        type: "POST",
        data: faultListValue,
        success: function(rt) {
            //console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array
            $('#'+disp_id).empty();
            $('#'+disp_id).append($('<option value="0" disabled selected>Select the condition</option>'));
            $.each(json, function(i,val) {

                $('#'+disp_id).append($('<option value="'+ val.condition_id +'">'+ val.condition +'</option>'));
            });
            $('#'+disp_id).append($('<option value="other">Others</option>'));
        },
        error: function(){
            alert("error");
        }
    });

}

function otherFaultDescValidation(){

    $("#otherFaultInput").on("keyup", function() {

        var otherFaultInputValue = $('#otherFaultInput').val();

        if(!otherFaultInputValue){

            $('#nextButtonToCamera').hide();
        }else{

            $('#nextButtonToCamera').show();
        }


    });
}

function scrollToId(id){

    $('html, body').animate({
        scrollTop: $(id).offset().top
    }, 1500);
}

/*function faultReportValidation(){

    if(isCoachFault){

     ;

        if(!coachNumberInput&&!$('#subLocationList').attr("value"),){


        }

    }else{


    }

}*/




/*function appendPhoto(){

    var max=3;

    if(numberOfImage<max){

        numberOfImage++;
            var html = `<div id="addPhoto${numberOfImage}" class="addPhoto">
        <label for="imgInp${numberOfImage}" class="addPhotoIcon">
            <i class="fas fa-camera"></i>
            <p>Add a photo</p>
        </label>
            <label for="imgInp${numberOfImage}" id="replaceImageButton"><img   src="#" id="imagePreview" /><i class="fas fa-exchange-alt"></i> Replace Image</label>
        <input id="imgInp${numberOfImage}" type="file"/>
        </div>`;
            $('#appendImage').append(html);
        }

    if(numberOfImage!=3){
        $('#addMorePhoto').show();

    }else{
        $('#addMorePhoto').hide();
    }
}*/

/*function removePhoto(){

    var min=1;

    $("#appendImage").on('click','.removeImage',function() {

        if (numberOfImage >= min) {

            numberOfImage--;

            $('#appendImage').parent('div').remove();

        }
    });

}*/


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imagePreview').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);

        $('#imagePreview').show();
        $('.addPhotoIcon').hide();
        $('#replaceImageButton').show();
        $('#removeImage').show();
    }
}

function removeImage(){
    $("#imgInp").val("");

    $('#removeImage').hide();
    $('.addPhotoIcon').show();
    $('#imagePreview').hide();
    $('#replaceImageButton').hide();
}

function uploadImage(){

    $('#imgInp')[0];
}

