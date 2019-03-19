
const getLocationType = "http://localhost:8081/getLocationType";

//proceed to fault report page
  function toReportFault(){ 
    $("#homeSection").hide();
    $("#reportFaultFormSection").show(); 
    $('#navFooter').css('display','block');
    displayLocationType(getLocationType,"locationType");

    $('#faultReport1').show(); //show the first nav footer
      //$('#nextButtonToReport2').hide();
}

//proceed to login page
   function toViewFault(){ 
    $("#homeSection").hide();
    $("#loginSection").show(); 
    $('#navFooter').css('display','block');
}

// function to hide the footer in the homepage
function hideHomeSectionFooter(){ 
    $("#homeSectionFooterHide").hide();
    $('#circleButtonDown').hide();
    $('#circleButtonUp').show();
    $('#homeSectionFooter').css('background-color','#6a717b');
}

//function to unhide the footer in the homepage
function unhideHomeSectionFooter(){ 
  $("#homeSectionFooterHide").show();
  $('#circleButtonDown').show();
  $('#circleButtonUp').hide();
  $('#homeSectionFooter').css('background-color','white');   
}

function backToHomeSectionFromFaultReport(){

    $("#homeSection").show();
    $("#reportFaultFormSection").hide();
    $('#navFooter').hide();

    $('#faultReport2').hide();

}

function toFaultReport2(){

      //hide location, coach number, seat number?

    $('#faultReport2').show();
    $('#faultReport1').hide();

    $('#locationType').hide();
    $('#unhideCoach').hide();


    //$('#unhideSeatRequest').hide();

    if(isSeatNumber){
        $('#unhideSeatNumber').show();

    }else{
        $('#unhideSeatMap').show();
    }

    if(isOtherFaultObject){
        $('#otherFault').show();

        $('#faultConditionDropdown').hide();
        $('#unhideFaultCondition').hide();
        $('#unhideFaultDescriptionDropdown').show();
       // $('#faultObjectDropdown').show();

        //$('#unhideFaultDescriptionDropdown').hide();
    }else{

        $('#otherFault').hide();
        $('#unhideFaultDescriptionDropdown').show();
        $('#unhideFaultCondition').show();
        $('#faultConditionDropdown').show();

    }
    $('#backButtonToHome').hide();
    $('#backButtonToReport1').show();
    $('#nextButtonToReport2').hide();
    $('#nextButtonToCamera').show();



    //dont use this unless it's really not working
    //$('#unhideFaultDescriptionDropdown').hide();
    //$('#unhideFaultCondition').hide();


}

function backToReport1(){

    $('#faultReport1').show();
    $('#locationType').show();
    $('#unhideCoach').show();
    $('#unhideSeatNumber').hide();
    $('#unhideSeatMap').hide();
    $('#unhideFaultDescriptionDropdown').hide();
    $('#otherFault').hide();
    $('#unhideFaultCondition').hide();
    $('#backButtonToHome').show();
    $('#backButtonToReport1').hide();
    $('#nextButtonToReport2').show();
    $('#nextButtonToCamera').hide();
    $('#cameraSection').hide();
}

function backToReport2(){

      $('#cameraSection').hide();
      $('#nextButtonToReport2').hide();
      $('#backButtonToHome').hide();

    $('#backButtonToReport2').hide();
    $('#submitButton').hide();

    $('#backButtonToReport1').show();
    $('#nextButtonToCamera').show();

    if(isSeatNumber){
        $('#unhideSeatNumber').show();

    }else{
        $('#unhideSeatMap').show();
    }

    if(isOtherFaultObject){
        $('#otherFault').show();

        $('#faultConditionDropdown').hide();
        $('#unhideFaultCondition').hide();
        $('#unhideFaultDescriptionDropdown').show();
        // $('#faultObjectDropdown').show();

        //$('#unhideFaultDescriptionDropdown').hide();
    }else{

        $('#otherFault').hide();
        $('#unhideFaultDescriptionDropdown').show();
        $('#unhideFaultCondition').show();
        $('#faultConditionDropdown').show();

    }
    $('#backButtonToHome').hide();
    $('#backButtonToReport1').show();
    $('#nextButtonToReport2').hide();
    $('#nextButtonToCamera').show();

}

function toCamera(){

      $('#cameraSection').show();
      $('#unhideSeatMap').hide();
      $('#unhideFaultDescriptionDropdown').hide();
      $('#unhideFaultCondition').hide();
      $('#otherFault').hide();
      $('#unhideSeatNumber').hide();

      $('#backButtonToReport1').hide();
      $('#nextButtonToCamera').hide();

      $('#backButtonToReport2').show();
      $('#submitButton').show();

    $("#imgInp").change(function(){
        readURL(this);
    });
}