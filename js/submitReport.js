
const submitFormPath = "http://localhost:8081/submitForm";

const uploadImagePath = "http://localhost:8081/uploadImage";

function submitReport(){ //this function submits the report

    var otherValue = $('#otherFaultInput').val()||null;
    var seatNumberValue = $('#seatNumberInput').val()||null;
    var additionalInformation = $('#additionInformation').val()||null;
    var email = $('#staffEmailInput').val();
    var imageSource = $('#imgInp')[0].files[0];

    var platformValue = $('#platformNumberInput').val()||null;

    //if option value is other which is == null

    if(faultListValue=="o"||subLocationListValue=="others"||conditionValue=="other"){

        faultListValue==null;
        subLocationListValue==null;
        conditionValue=null;
    }

    if(!imageSource){
        imageSource==null;
    }

    //coach value for insert

        var reportData = {}; //need to stringfy before send it
        reportData.locationType = parseInt(locationType);
        reportData.coachNumber = outputCoachNumber;
        reportData.station = parseInt(stationValue);
        reportData.sublocation = parseInt(subLocationListValue);
        reportData.fault = parseInt(faultListValue);
        reportData.condition = parseInt(conditionValue);
        reportData.otherValue = otherValue;
        reportData.seatNumber = parseInt(seatNumberValue);
        reportData.xCoordinate = parseFloat(xPercentage);
        reportData.yCoordinate = parseFloat(yPercentage);
        reportData.platformNumber = platformValue;
        reportData.additionInformation = additionalInformation;
        reportData.email = email;
        reportData.image = imageSource.name;
        reportData.faultStatus = 1;
        reportData.staff_id = null;

        var reportObject = JSON.stringify(reportData);

        alert(reportObject);

    submitForm(submitFormPath,reportObject);

    alert("You have Successfully Reported a Fault. Thank You!");

}




function submitForm(path,reportData){

    $.ajax({
        url: path,
        type: "POST",
        data: reportData,
        error: function(){
            alert("error");
        }
    });


}


//AWS upload to bucket in progress

function uploadImage(path,imageObject){



    $.ajax({
        url: path,
        type: "POST",
        data:imageObject,
        error: function(){
            alert("error");
        }
    });
}

function getSignedRequest(file){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                const response = JSON.parse(xhr.responseText);
                uploadFile(file, response.signedRequest, response.url);
            }
            else{
                alert('Could not get signed URL.');
            }
        }
    };
    xhr.send();
}

function uploadFile(file, signedRequest, url){
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                document.getElementById('preview').src = url;
                document.getElementById('avatar-url').value = url;
            }
            else{
                alert('Could not upload file.');
            }
        }
    };
    xhr.send(file);
}