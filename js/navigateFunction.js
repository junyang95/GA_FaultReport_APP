
const getLocationType = "http://localhost:8081/getLocationType";

//proceed to fault report page
  function toReportFault(){ 
    $("#homeSection").hide();
    $("#reportFaultFormSection").fadeIn("slow");
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

    $("#homeSection").fadeIn("slow");
    $("#reportFaultFormSection").fadeOut("slow");
    $('#navFooter').hide();

    $('#faultReport2').hide();

}

/*function toFaultReport2(){

      //hide location, coach number, seat number?

    $('#faultReport2').show();
    $('#faultReport1').hide();

    $('#locationType').hide();
    $('#unhideCoach').hide();

    $('#unhideSeatMap').hide();


    if(isSeatNumber){

        $('#unhideSeatMap').hide();
        $('#unhideSeatNumber').show();
        $('#trainMapContainer').hide();
        $('#userLocateText').hide();

    }else{

        $('#unhideSeatNumber').hide();
        $('#unhideSeatNumber').hide();
        $('#userLocateText').show();

    }

    if(isOtherFaultObject){
        $('#otherFault').show();

        $('#faultConditionDropdown').hide();
        $('#unhideFaultCondition').hide();
        $('#unhideFaultDescriptionDropdown').show();

    }else{

        $('#otherFault').hide();
        //$('#unhideFaultDescriptionDropdown').show();
        //$('#unhideFaultCondition').show();
       // $('#faultConditionDropdown').show();
    }

    $('#backButtonToHome').hide();
    $('#backButtonToReport1').show();
    $('#nextButtonToReport2').hide();
    //$('#nextButtonToCamera').show();


    if(!isSeatAreaFault){
        $('#unhideSeatRequest').hide();
        $('#unhideFaultDescriptionDropdown').show();

    }else{
        $('#unhideSeatRequest').show();
    }


    //$('#unhideFaultDescriptionDropdown').show();
    $('#userLocateText').hide();
}

function backToReport1(){

    $('#faultReport1').show();
    $('#locationType').show();
    $('#unhideCoach').show();
    $('#unhideSeatNumber').hide();

    $('#unhideFaultDescriptionDropdown').hide();
    $('#otherFault').hide();
    $('#unhideFaultCondition').hide();
    $('#backButtonToHome').show();
    $('#backButtonToReport1').hide();
    $('#nextButtonToReport2').show();
    $('#nextButtonToCamera').hide();
    $('#cameraSection').hide();

    $('#unhideSeatMap').show();

    $('#unhideSeatRequest').hide();
    $('#trainMapContainer').hide();
    $('#userLocateText').hide();

}*/

function backToReport2(){

    $('#cameraSection').hide();
    $('#submitButton').hide();
    $('#backButtonToHome').fadeIn('slow');
    $('#backButtonToReport2').hide();
    $('#nextButtonToCamera').fadeIn('slow');
    $('#nextButtonToReport2').hide();
    $('#locationType').fadeIn('slow');
    $('#unhideSeatMap').fadeIn('slow');


    if(isSeatAreaFault){
        $('#unhideSeatRequest').fadeIn('slow');

        if(isSeatNumber){
            $('#unhideSeatNumber').fadeIn('slow');
            $('#unhideSeatMap').hide();
            $('#trainMapContainer').hide();
            $('#userLocateText').hide();

        }else{

            $('#unhideSeatNumber').hide();
            $('#userLocateText').fadeIn('slow');
            $('#trainMapContainer').fadeIn('slow');

        }

    }else{
        $('#unhideSeatRequest').hide();
    }


    if(isOtherFaultObject){
        $('#otherFault').fadeIn('slow');

        $('#faultConditionDropdown').hide();
        $('#unhideFaultCondition').hide();
        $('#unhideFaultDescriptionDropdown').fadeIn('slow');

    }else{

        $('#otherFault').hide();
        $('#unhideFaultDescriptionDropdown').fadeIn('slow');
        $('#unhideFaultCondition').fadeIn('slow');
        $('#faultConditionDropdown').fadeIn('slow');

    }

    if(isCoachFault){

        $('#unhideCoach').fadeIn('slow');
        $('#unhideStation').hide();
    }else{
        $('#unhideCoach').fadeIn('slow');
        $('#unhideStation').hide();

    }
}



function toCamera(){

      $('#cameraSection').fadeIn("slow");
      $('#unhideSeatMap').hide();
      $('#unhideFaultDescriptionDropdown').hide();
      $('#unhideFaultCondition').hide();
      $('#otherFault').hide();
      $('#unhideSeatNumber').hide();

      $('#backButtonToReport1').hide();
      $('#nextButtonToCamera').hide();
      $('#backButtonToHome').hide();

      $('#backButtonToReport2').show();
      $('#submitButton').show();
      $('#unhideSeatRequest').hide();
      $('#trainMapContainer').hide();
      $('#userLocateText').hide();

      $('#locationType').hide();
      $('#unhideCoach').hide();
      $('#unhideStation').hide();



    $("#imgInp").change(function(){
        readURL(this);
    });
}