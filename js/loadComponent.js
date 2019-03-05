

//Loading all the components here (all html files in component folder)
//it uses AJAX to load (.load()) the external html files in
$(document).ready(function () {
    $('#navbarComponent').load("component/component/navbar.html"); //dk if component/component is a good name for it
    $('#homeSectionComponent').load("component/page/homeSection.html");
    $('#navFooter').load("component/component/navFooter.html");
});