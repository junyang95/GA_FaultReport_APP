//us-east-2
//eu-west-1
var albumBucketName = 'reportimage';
var bucketRegion = 'us-east-2';
var IdentityPoolId = 'us-east-2:a6420e4e-b574-42b3-89ad-844df48b8c65';

AWS.config.region = bucketRegion; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId,
});

var s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    params: {Bucket: albumBucketName}
});


function addPhoto(albumName,id) {


    var files = document.getElementById(id).files;
    alert("File: "+ files);

    if (!files.length) {
        return alert('Please choose a file to upload first.');
    }
    var file = files[0];
    var fileName = file.name;

    alert("FileName: "+fileName);
    var albumPhotosKey = encodeURIComponent(albumName) + '//';
    alert("FalbumPhotosKey: "+albumPhotosKey);
    var photoKey = albumPhotosKey + fileName;

    alert("photoKey: "+photoKey);
    s3.upload({
        Bucket: S3_BUCKET,
        Expires: 60,
        Key: photoKey,
        Body: file,
        ACL: 'public-read'
    }, function(err, data) {
        if (err) {
            return alert('There was an error uploading your photo: ', err.message);
        }
        alert('Successfully uploaded photo.');

    });
}
