//proceed to fault report page
function toReportFault() {
    $("#homeSection").hide();
    $("#reportFaultFormSection").show();
    $('#navFooter').css('display', 'block');
}

//proceed to login page
function toViewFault() {
    $("#homeSection").hide();
    $("#loginSection").show();
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