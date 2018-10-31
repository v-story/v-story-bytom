

function anonLog() {

    // Configure the credentials provider to use your identity pool
    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:4c5af7b8-28c3-4b86-a1a6-28dd17474c1c', 
    });
    
    // Make the call to obtain credentials
    AWS.config.credentials.get(function () {
            // Credentials will be available when this function is called.
        var accessKeyId = AWS.config.credentials.accessKeyId;
        var secretAccessKey = AWS.config.credentials.secretAccessKey;
        var sessionToken = AWS.config.credentials.sessionToken;
    });
}


function detectFaces(imageData) {

    AWS.region = "us-east-1";
    var rekognition = new AWS.Rekognition();
    var params = {
        Image: {
            Bytes: imageData
        },
        Attributes: [
            'ALL',
        ]
    };

    rekognition.detectFaces(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
        
            // show each face and build out estimated age table
            for (var i = 0; i < data.FaceDetails.length; i++) {

                data.FaceDetails[i].AgeRange.Low;
                data.FaceDetails[i].AgeRange.High;

            }
        }
  });
}



function faceCameraCallback( in_event ) {

    var loadingImage = loadImage(in_event.target.files[0], function(newImg){

// //        var img = document.createElement('img');
// //        img.setAttribute("src", newImg);
//         // img.setAttribute("width", "304");
//         // img.setAttribute("height", "228");
//         // img.setAttribute("style", "position:fixed; left:0; top:0; right:0; bottom:0; width:100%; height:100%; object-fit:cover; z-index:9999;");
        newImg.style = "position:fixed; left:0; top:0; right:0; bottom:0; width:100%; height:100%; object-fit:cover; z-index:9999;";
        document.body.appendChild(newImg);

    }, {orientation:true});
// return;

    var files = in_event.target.files,
        file;
    if (files && files.length > 0) {
        file = files[0];
    }

    if ( files.length == 0 )
    {
        alert( "picture error!" );
        return;
    }
    
    alert( "take picture!!" );
    sendImageForDetectFaces(file);

    // Load base64 encoded image 
    var reader = new FileReader();
    reader.onload = (function (theFile) {
        return function (e) {

            var img = document.createElement('img');
            var image = null;
            // img.src = e.target.result;
            img.setAttribute("src", e.target.result);
            // img.setAttribute("width", "304");
            // img.setAttribute("height", "228");
            img.setAttribute("style", "position:fixed; left:0; top:0; right:0; bottom:0; width:100%; height:100%; object-fit:cover; z-index:9999;");
            document.body.appendChild(img);






            // var jpg = true;
            // try {
            //     image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);

            // } catch (e) {
            //     jpg = false;
            // }
            // if (jpg == false) {
            //     try {
            //         image = atob(e.target.result.split("data:image/png;base64,")[1]);
            //     } catch (e) {
            //         alert("Not an image file Rekognition can process");
            //         return;
            //     }
            // }
            // //unencode image bytes for Rekognition DetectFaces API 
            // var length = image.length;
            // var imageBytes = new ArrayBuffer(length);
            // var ua = new Uint8Array(imageBytes);
            // for (var i = 0; i < length; i++) {
            //     ua[i] = image.charCodeAt(i);
            // }
            //Call Rekognition  
            // anonLog();
            // detectFaces(imageBytes);
            
        };
    })(file);
    reader.readAsDataURL(file);
};



function sendImageForDetectFaces(imageData) {

    var formData = new FormData();
    var formParam = 
    {
        url : VISION_SERVER,
        param : null,
    }

    formData.append( "file", imageData );  // formData 에 파일데이터 추가
    formData.append( "param", ACCOUNTPK);

    $.ajax({
        type: "POST",
        cache:false,
        url: VISION_SERVER,
        data: formData,

        dataType: "json",

        contentType: false,
        enctype: "multipart/form-data",
        xhrFields: {
            withCredentials: false
        },
        processData:false,
        beforeSend: function(){
            // console.log(param)
            // console.log(JSON.stringify(param))
        }
    })
    .done(function(callback){
        console.log(callback);
    }).fail(function(err){
        console.log(err);
    });
 
    
}