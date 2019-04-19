

//Loading all the components here (all html files in component folder)
//it uses AJAX to load (.load()) the external html files in
$(document).ready(function () {

    //Pages (Section)
    $('#homeSectionComponent').load("component/page/homeSection.html");
    $('#reportFaultFormSection').load("component/page/faultReport.html");
    $('#loginSection').load("component/page/logIn.html");
    $('#viewFaultSection').load("component/page/viewFault.html");
    $('#faultDetailSection').load("component/page/faultDetail.html");

    //Components
    $('#navFooter').load("component/component/navFooter.html");
    $('#navbarComponent').load("component/component/navbar.html"); //dk if component/component is a good name for it

});