
const submitFormPath = "http://localhost:8081/submitForm";

function submitReport(){ //this function submits the report

    var otherValue = $('#otherFaultInput').val()||null;
    var seatNumberValue = $('#seatNumberInput').val()||null;
    var additionalInformation = $('#additionInformation').val()||null;
    var email = $('#staffEmailInput').val();
    var imageSource = $('#imgInp')[0].files[0]||null;


    //alert(imageSource)
    //$('#imgInp').val().lastIndexOf("\\") + 1;
    //var imageSource = $('#imgInp').val().substr(imageNameIndex);
    var platformValue = $('#platformNumberInput').val()||null;


    console.log();
    //if option value is other which is == null

    if(faultListValue=="o"||subLocationListValue=="others"||conditionValue=="other"){

        faultListValue==null;
        subLocationListValue==null;
        conditionValue=null;
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
        reportData.image = imageSource;
        reportData.faultStatus = 1;
        reportData.staff_id = null;

        var reportObject = JSON.stringify(reportData);



        //console.log(reportData);

    submitForm(submitFormPath,reportObject);

    getFileFromId("imgInp");





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

function getFileFromId(id){

    document.getElementById(id).onchange = () => {
        const files = document.getElementById(id).files;
        const file = files[0];
        if(file == null){
            return alert('No file selected.');
        }
        getSignedRequest(file);
    };
}

function getSignedRequest(file){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4){
            if(xhr.status === 200){
                const response = JSON.parse(xhr.responseText);
                uploadFile(file, response.signedRequest, response.url);

                aler('got signed request');
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