//value to insert into report

var outputCoachNumber;
var locationType;
var xPercentage=null;
var yPercentage=null;
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
var isPlatform;

//
//A function will use these to check validation against each field

//Train branch
var validCoachNumber;
var validSublocation;
var validFaultObject;
var validCondition;
var validOtherFault;
var validseatNumber;
var validTrainMapSelect;
var validOtherFaultDesc;

var validStationName;
var validPlatform;




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
    $('#otherFault').hide();

    $('#coachNumberInput').focus();



}

//show the station dropdown
function unhideStation(){

    isCoachFault = false;

    //show station
    $("#unhideStation").fadeIn("slow");
    $("#unhideCoach").hide();
    $('#stationBox').css('background-color','#D70428');
    $('#coachBox').css('background-color','lightgray');



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    displayStation(getStationPath,"stationList");

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    stationFilter();

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
    $('#otherFault').hide();


    $('#stationInput').focus();

    ///faultReportValidation();
}

function displayLocationType(path,disp_id){
    $.ajax({

        url: path,
        type: "POST",
        success: function(rt) {
            //console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array
            $('#'+disp_id).empty();

            $('#'+disp_id).append($('<p>Where is the Fault?</p>'));
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

        //$('#stationList').fadeIn('slow');

        $('#unhideSeatMap').hide();
        $('#unhideFaultDescriptionDropdown').hide();
        $('#unhideFaultCondition').hide();
        $('#otherFault').hide();
        $('#unhidePlatformNumber').hide();
        $('#nextButtonToCamera').hide();


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

    $("#stationList").on("click","li",function(){

        $('.selectedStation').removeClass('selectedStation');
        $(this).addClass('selectedStation');
        var text = $('#stationList').find("li.selectedStation").text();
        $('#stationInput').val(text);
        $('#stationList li').hide();

        $('#unhideSeatMap').fadeIn("slow");

        stationValue = $(this).attr("value");

        returnSubLocation(getSubLocation,locationType,'subLocationList');

        unhideSeatNumberRequest();

    });

    if(!stationValue){

        validStationName=false;
    }else{
        validStationName=true;
    }
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

                //$('#'+disp_id).html('<li class="list-group-item" value='+ val.stationname_id +'">'+ val.stationname +'</li>');

                $('#'+disp_id).fadeIn('slow').append('<li class="list-group-item" value="'+ val.station_id +'">'+ val.stationname +'</li>');

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
        //var regex = /^\d{5,6}$/;

        var output = returnCoachNumber(getCoachNumberPath,coachNumberInputValue);

        //!regex.test(coachNumberInputValue) || !coachNumberInputValue ||

        if( coachNumberInputValue != output){

            $('#coachNumberInput').css('border','1px solid #D70428');
            //$('#unhideSeatRequest').hide();
            $('#nextButtonToReport2').hide();
            $('#unhideSeatMap').hide();
            $('#unhideFaultDescriptionDropdown').hide();
            $('#unhideFaultCondition').hide();

            validCoachNumber=false;
            $('#nextButtonToCamera').hide();
            $('#unhideSeatRequest').hide();
            $('#unhideSeatNumber').hide();

            $('#otherFault').hide();

        }else{
            $('#coachNumberInput').css('border','1px solid lightgray');

            $('#seatNumberAvailable').css('background-color','#D70428');
            $('#seatNumberUnavailable').css('background-color','#D70428');



            //faultReportValidation();

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
    $('#otherFault').hide();
    $('#nextButtonToCamera').hide();
    $('#seatNumberInput').val('');

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

    $('#otherFault').hide();
    $('#nextButtonToCamera').hide();

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

            validseatNumber=false;

        }else{
            $('#seatNumberInput').css('border','1px solid lightgray');
            subLocationListValue= "4";

            getFaultObjects(getFaultObjectPath,subLocationListValue,'faultObjectDropdown');


            $('#unhideFaultDescriptionDropdown').fadeIn("slow");


            scrollToId("#unhideFaultDescriptionDropdown");

            unhideCondition();

            validseatNumber=true;
        }
    });
}

function platformValidation(){

    $("#platformNumberInput").on("keyup", function() {

        if(!$('#platformNumberInput').val()){

            $('#unhideFaultDescriptionDropdown').hide();
            $('#unhideFaultCondition').hide();

            $('#platformNumberInput').css('border','1px solid #D70428')

            validPlatform=false;

        }else{

            getFaultObjects(getFaultObjectPath,subLocationListValue,'faultObjectDropdown');

            $('#unhideFaultDescriptionDropdown').fadeIn('slow');

            $('#platformNumberInput').css('border','1px solid #ccc');

            $('#otherFault').hide();

            unhideCondition();

            validPlatform=true;

            scrollToId("#unhideFaultDescriptionDropdown");
        }
    });

}

//this function is not finished, tried to make sure the dropdown is selected

function unhideSeatNumberRequest(){

    $("#subLocationList").on("change",function () {

        subLocationListValue = $(this).find('option:selected').attr("value"); // get value (attribute) of "subLocationList"

        //$('#unhideFaultCondition').hide();
        $('#nextButtonToCamera').hide();

        if (subLocationListValue == 0){ // if the list was not selected

            $('#unhideFaultDescriptionDropdown').hide();
            $('#unhideFaultCondition').hide();

            $('#nextButtonToReport2').hide();
            $('#nextButtonToCamera').hide();

            validSublocation=false;

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
            $('#nextButtonToCamera').hide();
            $('#unhideSeatRequest').hide();
            $('#userLocateText').hide();
            $('#unhideFaultCondition').hide();

            $('#otherFaultInput').focus();
            $('#otherFault').fadeIn("slow");
            otherFaultDescValidation();

            isOtherFaultObject=true;
            isSeatAreaFault=false;
            validSublocation=true;
            isPlatform=false;



        }else if(subLocationListValue==4){ // if the list was 'seating area'
            getFaultObjects(getFaultObjectPath,subLocationListValue,'faultObjectDropdown');

            unhideOtherOption();
            getCoordinateFromMap();
            $('#unhideFaultDescriptionDropdown').hide();
            $('#otherFault').hide();
            $('#nextButtonToCamera').hide();
            $('#unhideFaultCondition').hide();

            isOtherFaultObject=false;
            isSeatAreaFault=true;
            validSublocation=true;
            isPlatform=false;

            $('#unhideSeatRequest').fadeIn('slow');

            ///////////////////////////////////////////////////////////////////////////////////////////////////////

            $('#unhideFaultDescriptionDropdown').hide();
            $('#unhidePlatformNumber').hide();

            $('#seatNumberAvailable').css('background-color','#D70428');
            $('#seatNumberUnavailable').css('background-color','#D70428');

            scrollToId("#unhideSeatRequest");

        }else if(subLocationListValue==3) { // this is platform option

            $('#unhidePlatformNumber').fadeIn('slow');
            $('#unhideFaultCondition').hide();
            $('#platformNumberInput').focus();

            $('#otherFault').hide();
            $('#unhideFaultDescriptionDropdown').hide();

            isPlatform=true;
            platformValidation();

            $('#nextButtonToCamera').hide();

            isSeatAreaFault=false;
            isOtherFaultObject=false;
            validSublocation=true;
            isPlatform=true;
            //scrollToId("#unhidePlatformNumber");


        }else { // when selected any other option
            getFaultObjects(getFaultObjectPath,subLocationListValue,'faultObjectDropdown');

            unhideCondition();

            $('#faultLocationPoint').hide();
            $('#otherFault').hide();

            isOtherFaultObject=false;
            isSeatAreaFault=false;
            validSublocation=true;
            isPlatform=false;

            $('#unhideSeatRequest').hide();
            $('#userLocateText').hide();
            //$('#unhideFaultDescriptionDropdown').fadeOut("slow");
            $('#unhideFaultDescriptionDropdown').fadeIn("slow");

            $('#unhideSeatNumber').hide();
            $('#trainMapContainer').hide();

            $('#unhidePlatformNumber').hide();
            $('#nextButtonToCamera').hide();


            scrollToId("#unhideFaultDescriptionDropdown");
        };
    });

}

function unhideCondition(){


    $("#faultObjectDropdown").change(function () {

        validFaultObject=false;

        faultListValue = $(this).find('option:selected').attr("value"); // get value (attribute) of "faultObjectDropdown"

        if(faultListValue==0){
            $('#unhideFaultCondition').hide();
            validFaultObject=false;

        }else if(faultListValue=="o"){

            getFaultCondition(getFaultConditiontPath,faultListValue,'faultConditionDropdown');

            $('#unhideFaultCondition').hide();
            $('#nextButtonToCamera').hide();

            isOtherFaultObject=true;
            validFaultObject=true;

            $('#otherFaultInput').focus();
            $('#otherFault').fadeIn("slow");
            otherFaultDescValidation();

            scrollToId("#otherFault");

        }

        /*else if(faultListValue==4){
            isOtherFaultObject=false;
            validFaultObject=true;
            $('#nextButtonToCamera').hide();

        }*/ else{
            getFaultCondition(getFaultConditiontPath,faultListValue,'faultConditionDropdown');

            $('#otherFault').hide();
            isOtherFaultObject=false;
            validFaultObject=true;
            $('#nextButtonToCamera').hide();

            $('#unhideFaultCondition').fadeIn("slow");

            conditionDropdownChanges();

            scrollToId("#unhideFaultCondition");
        }
    });


}

function conditionDropdownChanges(){

    $("#faultConditionDropdown").change(function () {

        conditionValue = $(this).find('option:selected').attr("value"); // get value (attribute) of "faultObjectDropdown"

        if(conditionValue==0){
            validCondition=false;

        }else if(conditionValue=="other"){

            validCondition=true;
            isOtherFaultObject=true;

            //$('#nextButtonToCamera').fadeIn("slow");
            $('#otherFaultInput').focus();
            $('#otherFault').fadeIn("slow");
            otherFaultDescValidation();

            $('#nextButtonToCamera').hide();
            scrollToId("#otherFault");

        }else{
            validCondition=true;
            isOtherFaultObject=false;

            $('#nextButtonToCamera').fadeIn("slow");
            $('#otherFault').hide();
        }

    });



}

function unhideOtherOption(){

    faultListValue = $('#faultObjectDropdown').find('option:selected').attr("value");

    conditionValue = $('#faultConditionDropdown').find('option:selected').attr("value");

    if(faultListValue==0){
        //$('#unhideFaultDescriptionDropdown').hide();

    } else if(faultListValue == "o"){
        $('#otherFault').fadeIn('slow');
        $('#unhideFaultCondition').hide();

    }else{
        $('#otherFault').hide();
    }

    if(conditionValue==0){
        //$('#unhideFaultConditionDropdown').hide();

    }else if(conditionValue=="other"){
        $('#otherFault').fadeIn('slow');
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

                        validCoachNumber=true;
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
            $('#'+disp_id).append($('<option value="0" disabled selected>Specify Location</option>'));

            $.each(json, function(i,val) {
                $('#'+disp_id).append($('<option value="'+ val.sublocation_id +'">'+ val.sublocation +'</option>'));
            })
            $('#'+disp_id).append($('<option value="others">Other</option>'));
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
            $('#'+disp_id).append($('<option value="0" disabled selected>Select Property</option>'));

            $.each(json, function(i,val) {

                $('#'+disp_id).append($('<option value="'+ val.fault_id +'">'+ val.faultreference +'</option>'));
            });

            $('#'+disp_id).append($('<option value="o">Other</option>'));
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

        validTrainMapSelect=true;

        $('#faultLocationPoint').show();

        if(subLocationListValue==0) {

            $('#unhideFaultCondition').hide();
            $('#otherFault').hide();

        }else if(subLocationListValue==4){


            $('#unhideFaultDescriptionDropdown').fadeIn('slow');
            unhideCondition();
            $('#otherFault').hide();

            scrollToId("#faultObjectDropdown");
        }

        if(isOtherFaultObject){

            $('#otherFault').fadeIn('slow');
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
            $('#'+disp_id).append($('<option value="0" disabled selected>Select Condition</option>'));
            $.each(json, function(i,val) {

                $('#'+disp_id).append($('<option value="'+ val.condition_id +'">'+ val.condition +'</option>'));

                console.log(val);
            });
            $('#'+disp_id).append($('<option value="other">Other</option>'));

        },
        error: function(){
            alert("error");
        }
    });

}

function otherFaultDescValidation(){

    $('#otherFaultInput').val("");

    $("#otherFaultInput").on("keyup", function() {

        $('#nextButtonToCamera').fadeIn('slow');

        var otherFaultInputValue = $('#otherFaultInput').val();

        if(!otherFaultInputValue){

            validOtherFaultDesc=false;

            $('#nextButtonToCamera').hide();

        }else{

            $('#nextButtonToCamera').fadeIn('slow');
            validOtherFaultDesc=true;
        }
    });
}

function scrollToId(id){

    $('html, body').animate({
        scrollTop: $(id).offset().top
    }, 1500);

}

function faultReportValidation(){

    $(document).ready(function() {

        if(isCoachFault){ // coach or train fault

            alert("isCoach");

            if(!isOtherFaultObject){ // the user has chosen other fault object

                alert("not other fault");

                if(isSeatAreaFault){ // the user has chosen a seat area

                    if(isSeatNumber){ // the user has chosen a seat number to select

                        if(validCoachNumber && validSublocation && validseatNumber && validFaultObject && validCondition ){

                            $('#nextButtonToCamera').fadeIn('slow');
                        }else{
                            $('#nextButtonToCamera').hide();
                        }
                    }else{

                        if(validCoachNumber && validSublocation && validTrainMapSelect && validFaultObject && validCondition){

                            $('#nextButtonToCamera').fadeIn('slow');
                        }else{
                            $('#nextButtonToCamera').hide();
                        }
                    }
                }else{

                    if(validCoachNumber && validSublocation && validFaultObject && validCondition){

                        $('#nextButtonToCamera').fadeIn('slow');

                    }else {

                        $('#nextButtonToCamera').hide();
                    }

                }

            }else{//user selected other fault object

                alert("is other fault");

                if(validCoachNumber && validSublocation && validOtherFaultDesc){
                    $('#nextButtonToCamera').fadeIn('slow');

                    alert(validOtherFault);
                    alert(validOtherFaultDesc);

                }else {
                    $('#nextButtonToCamera').hide();
                    alert(validOtherFault);
                    alert(validOtherFaultDesc);
                }
            }

        }else{


        };
    });



}


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

function emailValidation(){

    $("#staffEmailInput").on("keyup", function() {

        var email = $('#staffEmailInput').val();

        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

        if(!emailReg.test(email) || !email){

            $('#staffEmailInput').css('border','1px solid #D70428');
            $('#submitButton').hide();

        }else{

            $('#staffEmailInput').css('border','1px solid #ccc');
            $('#submitButton').fadeIn('slow');

        }

    });


}


