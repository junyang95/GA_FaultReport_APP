//show the coach number


function unhideCoach(){

    //show coach
    $("#unhideCoach").show();
    $("#unhideStation").hide();
    $('#stationBox').css('background-color','lightgray');
    $('#coachBox').css('background-color','#D70428');

    coaachNumberValidation(); //this function validate the coach number

}

//show the station dropdown

function unhideStation(){

    //show station
    $("#unhideStation").show();
    $("#unhideCoach").hide();
    $('#stationBox').css('background-color','#D70428');
    $('#coachBox').css('background-color','lightgray');

    stationFilter();

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
    var text = $("a li.selectedLi").val();

    //when have time fix this here

    if (!regex.test(stationInputValue) || !stationInputValue || !text) {

        $('#issueTypeDropdown').hide();
    }

    //this function allows to select station from dropdown

    stationDropdownSelect();
}

function stationDropdownSelect(){

    $("#stationList").find("a li").click(function(){
        $('.selectedLi').removeClass('selectedLi');
        $(this).addClass('selectedLi');

        var text = $('#stationList').find("a li.selectedLi").text();
        $('#stationInput').val(text);
        $('#stationList li').hide();
        $('#issueTypeDropdown').show();
        displayIssueType("http://localhost:8081/getIssueType","issueTypeDropdown");
        //alert("selected Value:"+text);

    });

}

function displayIssueType(path,disp_id){

    $.ajax({
        url: path,
        type: "POST",
        //data: json,
        success: function(rt) {
            console.log(rt); // returned data
            var json = JSON.parse(rt); // the returned data will be an array

            $('#'+disp_id).empty();

            $.each(json, function(i,val) {

                console.log(val); //return first object
                console.log(json); // returns all objects

                var issueType = JSON.stringify(json);

                //$('#'+disp_id).append(issueType + "<br/>");
                $('#'+disp_id).append($('<option>', {
                    value: issueType,
                    text: issueType
                }));
            })
        },
        error: function(){
            alert("error");
        }
    });
}

function coaachNumberValidation(){

    $("#coachNumberInput").on("keyup", function() {

        var coachNumberInputValue = $('#coachNumberInput').val();
        //var regex = /\d\d\d\d\d\d/;
        var regex = /\d{6}/;

        if(!regex.test(coachNumberInputValue)||!coachNumberInputValue ){

            $('#coachNumberInput').css('border','1px solid red');

            $('#unhideSeatRequest').hide();

        }else{
            $('#coachNumberInput').css('border','1px solid lightgray');

            $('#unhideSeatRequest').show();


        }
    });
}



