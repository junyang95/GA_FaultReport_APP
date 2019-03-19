var coachNumberInputValue;
var outputCoachNumber;
var locationType;
var xPercentage;
var yPercentage;
var subLocationListValue;
var faultListValue;
var isSeatNumber;
var isOtherFaultObject;
var conditionValue;
var numberOfImage=1;

//put all the paths here, so it easily to change and add
const getStationPath = "http://localhost:8081/getStation";
const getTrainMap = "http://localhost:8081/getCoachMap";
const getFaultConditiontPath = "http://localhost:8081/getfaultCondition";
const getCoachNumberPath = "http://localhost:8081/getCoachNumber";
const getSubLocation = "http://localhost:8081/getSubLocation";
const getFaultObjectPath = "http://localhost:8081/getfaultObjects";

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
    locationType = $('#coachBox').attr("value");
    $('#nextButtonToReport2').hide();
    $('#unhideSeatRequest').hide();
    $('#seatNumberAvailable').css('background-color','#D70428');
    $('#seatNumberUnavailable').css('background-color','#D70428');
    otherFaultDescValidation();

}

//show the station dropdown
function unhideStation(){

    //show station
    $("#unhideStation").show();
    $("#unhideCoach").hide();
    $('#stationBox').css('background-color','#D70428');
    $('#coachBox').css('background-color','lightgray');
    stationFilter();
    displayStation(getStationPath,"stationList");
    locationType = $('#coachBox').attr("value");
    $('#nextButtonToReport2').hide();
    $('#coachNumberInput').val("");
}

function displayLocationType(path,disp_id){
    $.ajax({

        url: path,
        type: "POST",
        success: function(rt) {
            console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array
            $('#'+disp_id).empty();

            $('#'+disp_id).append($('<p><b>1.</b> Please identify the location of the fault</p>'));
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
                console.log(val);
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

        console.log("Coach Number Output: "+output+", INPUT: "+ coachNumberInputValue);

        if(!regex.test(coachNumberInputValue) || !coachNumberInputValue || coachNumberInputValue != output){

            $('#coachNumberInput').css('border','1px solid #D70428');
            $('#unhideSeatRequest').hide();
            $('#nextButtonToReport2').hide();

        }else{
            $('#coachNumberInput').css('border','1px solid lightgray');
            $('#unhideSeatRequest').show();
            $('#seatNumberAvailable').css('background-color','#D70428');
            $('#seatNumberUnavailable').css('background-color','#D70428');
        }

        returnCoachMap(getTrainMap,coachNumberInputValue,"trainMap");
    });
}

//this function shows the seat number
function unhideSeatNumber(){

    isSeatNumber=true;

    $('#unhideSeatNumber').show();
    $('#unhideSeatMap').hide();
    $('#seatNumberUnavailable').css('background-color','lightgray');
    $('#seatNumberAvailable').css('background-color','#D70428');
    $('#unhideFaultDescriptionDropdown').hide();
    $('#unhideFaultCondition').hide();

    $('#unhideCoach').hide();
    $('#locationType').hide();

    $('#faultReport1').hide();
    $('#faultReport2').show();

    $('#backButtonToHome').hide();
    $('#backButtonToReport1').show();
    $('#nextButtonToReport2').hide();
    $('#faultLocationPoint').hide();


}

//this function shows the trainMap
function unhideTrainMap(){

    isSeatNumber=false;

    $('#seatNumberInput').val("");

    $('#unhideSeatMap').show();
    $('#unhideSeatNumber').hide();
    $('#seatNumberUnavailable').css('background-color','#D70428');
    $('#seatNumberAvailable').css('background-color','lightgray');
    $('#unhideFaultDescriptionDropdown').hide();
    returnSubLocation(getSubLocation,locationType,'subLocationList');
    unhideFaultObject();
    $('#unhideFaultCondition').hide();

    $('#unhideCoach').hide();
    $('#locationType').hide();

    $('#faultReport1').hide();
    $('#faultReport2').show();

    $('#backButtonToHome').hide();
    $('#backButtonToReport1').show();
    $('#nextButtonToReport2').hide();
    $('#trainMap').hide();
    $('#userLocateText').hide();
    $('#faultLocationPoint').hide();
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
        }else{
            $('#seatNumberInput').css('border','1px solid lightgray');
            subLocationListValue= "4";

            //tmr fix here becuae it not getting the nunmber 4 properly
            getFaultObjects(getFaultObjectPath,subLocationListValue,'faultObjectDropdown');
            $('#unhideFaultDescriptionDropdown').show();
            $('#faultObjectDropdown').show();
            unhideFaultObject();
            unhideCondition();
        }
    });
}

//this function is not finished, tried to make sure the dropdown is selected

function unhideFaultObject(){

    $("#subLocationList").change(function () {

        subLocationListValue = $(this).find('option:selected').attr("value"); // get value (attribute) of "subLocationList"

        $('#faultLocationPoint').hide();//hide the coordinate pointer when option changes
        $('#unhideFaultCondition').hide();

        if (subLocationListValue == 0){ // if the list was not selected

            $('#unhideFaultDescriptionDropdown').hide();
            $('#unhideFaultCondition').hide();

        }else if(subLocationListValue=="others"){ // 4 is fault id for Seating area in coach
            $('#otherFaultInput').val("");
            $('#trainMap').show();

            unhideOtherOption();
            getCoordinateFromMap();
            $('#userLocateText').show();
            $('#unhideFaultDescriptionDropdown').hide();
            //$('#faultObjectDropdown').hide();
            unhideCondition();
            $('#unhideFaultCondition').hide();

            isOtherFaultObject=true;

        }else if(subLocationListValue==4){ // if the list was 'seating area'
            getFaultObjects(getFaultObjectPath,subLocationListValue,'faultObjectDropdown');
            $('#trainMap').show();
            unhideOtherOption();
            getCoordinateFromMap();
            $('#userLocateText').show();
            $('#unhideFaultDescriptionDropdown').hide();
            $('#otherFault').hide();
            unhideCondition();
            isOtherFaultObject=false;


        }else{ // when selected any other option
            getFaultObjects(getFaultObjectPath,subLocationListValue,'faultObjectDropdown');
            $('#unhideFaultDescriptionDropdown').show();
            $('#trainMap').hide();
            $('#faultLocationPoint').hide();
            $('#userLocateText').hide();
            $('#otherFault').hide();
            $('#faultObjectDropdown').show();
            unhideCondition();
            isOtherFaultObject=false;

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
            $('#otherFault').show();
            $('#unhideFaultCondition').hide();

            isOtherFaultObject=true;

        }else{
            getFaultCondition(getFaultConditiontPath,faultListValue,'faultConditionDropdown');
            $('#unhideFaultCondition').show();
            $('#otherFault').hide();
            conditionDropdownChanges();
            isOtherFaultObject=false;
        }

    });
}

function uploadImage(){

    $('#imgInp')[0];
}

function conditionDropdownChanges(){

    $("#faultConditionDropdown").change(function () {

        conditionValue = $(this).find('option:selected').attr("value"); // get value (attribute) of "faultObjectDropdown"

        if(conditionValue==0){


        }else if(conditionValue=="o"){


        }else{

            $('#nextButtonToCamera').show();
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
            console.log(rt); // returned data
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
            console.log(rt); // returned data
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

        }else if(subLocationListValue=="others"){

                //$('#otherFault').show();

        }else if(subLocationListValue==4){

            $('#unhideFaultDescriptionDropdown').show();
            $('#faultObjectDropdown').show();
            $('#otherFault').hide();

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
            console.log(rt); // returned data
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

function appendPhoto(){

    var max=3;

    if(numberOfImage<max){

        numberOfImage++;
            var html = `<div id="addPhoto${numberOfImage}" class="addPhoto">
 <p class="fas fa-times-circle" class="removeImage" onclick="removePhoto()"></p>
            <input type="file" id="file" style="display:none;" />
            <div  name="uploadButton[]" value="Upload" onclick="uploadImage()">
       
                <i class="fas fa-camera"></i>
                <p>Add a photo</p>
            </div>
        </div>`;
            $('#appendImage').append(html);
        }

    if(numberOfImage!=3){
        $('#addMorePhoto').show();

    }else{
        $('#addMorePhoto').hide();
    }
}

function removePhoto(){

    var min=1;

    $("#appendImage").on('click','.removeImage',function() {

        if (numberOfImage >= min) {


            numberOfImage--;

            $('#appendImage').parent('div').remove();

        }

    });

}


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imagePreview').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);

        $('#imagePreview').show();
        $('.addPhotoIcon').hide();
    }
}

