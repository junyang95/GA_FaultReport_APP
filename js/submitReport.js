function submitReport(){ //this function submits the report

    var otherValue = $('#otherFaultInput').val();
    var seatNumberValue = $('#seatNumberInput').val();
    var mapPinValue = xPercentage+","+yPercentage;
    var additionalInformation = $('#additionInformation').val();
    var email = $('#staffEmailInput').val();
    var imageNameIndex = $('#imgInp').val().lastIndexOf("\\") + 1;
    var imageSource = $('#imgInp').val().substr(imageNameIndex);
    var platformValue = $('#platformNumberInput').val();


    if(isCoachFault){ //coach value for insert

        var reportData = {};
        reportData.locationType = locationType;
        reportData.coachNumber = outputCoachNumber;
        reportData.sublocation = subLocationListValue;
        reportData.fault = faultListValue;
        reportData.condition = conditionValue;
        reportData.otherValue = otherValue;
        reportData.seatNumber = seatNumberValue;
        reportData.mapLocation = mapPinValue;
        reportData.additionInformation = additionalInformation;
        reportData.email = email;
        reportData.image = imageSource;

        console.log(reportData);

    }else{ // station value for insert

        var reportData = {};
        reportData.locationType = locationType;
        reportData.station = stationValue;
        reportData.sublocation = subLocationListValue;
        reportData.fault = faultListValue;
        reportData.condition = conditionValue;
        reportData.otherValue = otherValue;
        reportData.platformNumber = platformValue;
        reportData.additionInformation = additionalInformation;
        reportData.email = email;
        reportData.image = imageSource;

        console.log(reportData)
    }














}