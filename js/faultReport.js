function unhideCoach(){ //show the coach number

    $("#coach").show();
    $("#station").hide();
    $('#stationBox').css('background-color','lightgray');
    $('#coachBox').css('background-color','#D70428');
}

function unhideStation(){ //show the station dropdown

    $("#station").show();
    $("#coach").hide();
    $('#stationBox').css('background-color','#D70428');
    $('#coachBox').css('background-color','lightgray');

    stationFilter();

    //this function allows to select station from dropdown

    $("#stationList").find("a li").click(function(){
        $('.selectedLi').removeClass('selectedLi');
        $(this).addClass('selectedLi');

        var text = $('#stationList').find("a li.selectedLi").text();
        $('#stationInput').val(text);
        $('#stationList li').hide();
        $('#issueTypeDropdown').show();
        //alert("selected Value:"+text);

    });

}

function stationFilter(){   //this function is to filter the station name

    $("#stationInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#stationList li").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });

        /*if($('#stationInput').val() == ""){

            $('#issueTypeDropdown').hide();
        }*/



    });

    var stationInputValue = $('#stationInput').val();
    var regex = /^[0-9]{4,6}$/;

    var text = $("a li.selectedLi").val();

    //when have time fix this here

    if (!regex.test(stationInputValue) || !stationInputValue || !text) {

        $('#issueTypeDropdown').hide();
    }
}




