
const getLocationType = "http://localhost:8081/getLocationType";

//proceed to fault report page
  function toReportFault(){ 
    $("#homeSection").hide();
    $("#reportFaultFormSection").fadeIn("slow");
    $('#navFooter').css('display','block');
    $("#viewFaultSection").hide();
    displayLocationType(getLocationType,"locationType");

    $('#faultReport1').show(); //show the first nav footer
      //$('#nextButtonToReport2').hide();

}

//proceed to login page
function toViewFault() {
    $("#homeSection").hide();
    $("#loginSection").show();
    $("#viewFaultSection").hide();
    $('#navFooter').css('display', 'block');
}

// function to hide the footer in the homepage
function hideHomeSectionFooter() {
    $("#homeSectionFooterHide").hide();
    $('#circleButtonDown').hide();
    $('#circleButtonUp').show();
    $('#homeSectionFooter').css('background-color', '#6a717b');
}

//function to unhide the footer in the homepage
function unhideHomeSectionFooter() {
    $("#homeSectionFooterHide").show();
    $('#circleButtonDown').show();
    $('#circleButtonUp').hide();
    $('#homeSectionFooter').css('background-color', 'white');
}

function backToHomeSectionFromFaultReport(){

    $("#homeSection").fadeIn("slow");
    $("#reportFaultFormSection").fadeOut("slow");
    $("#viewFaultSection").hide();
    $('#navFooter').hide();
    $('#faultReport2').hide();

}

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
            //$('#unhideSeatMap').hide();
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

        //////here to remove some dropdowns


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
        $('#unhideStation').fadeIn('slow');
        $('#unhideCoach').hide();
    }

    if(isPlatform){

        $('#unhidePlatformNumber').fadeIn('slow');
    }else{
        $('#unhidePlatformNumber').hide();
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
      $('#unhideSeatRequest').hide();
      $('#trainMapContainer').hide();
      $('#userLocateText').hide();
      $('#locationType').hide();
      $('#unhideCoach').hide();
      $('#unhideStation').hide();
      $('#unhidePlatformNumber').hide();
      $('#nextButtonToCamera').hide();

    emailValidation();


    $("#imgInp").change(function(){

        var ext = $('#imgInp').val().split('.').pop().toLowerCase();
        if($.inArray(ext, ['gif','png','jpg','jpeg','JPG','PNG','GIF','JPEG']) == -1) {
            alert('Invalid File Type');
        }else{
            readURL(this);
            $('#additionInformation').focus();
            //scrollToId('#additionInformation');

        }

    });
}