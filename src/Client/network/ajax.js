// ajaxPost호출
function postCall(param, domain) {
    var deferred = $.Deferred();
    var withCredentials = true;
    
    var DOMAIN = SERVER_DOMAIN + param.url;

    if(domain != null) DOMAIN = domain;

    $.ajax({
        type: "POST",
        cache: false,
        url: DOMAIN,
        data: {
            param: JSON.stringify(param.param)
        },
        xhrFields: {
            withCredentials: withCredentials
        },
        beforeSend: function () {
            // console.log(param)
            // console.log(JSON.stringify(param))
        }
    })
        .done(function (callback) {
            var rs = {
                param: param,
                callback: callback
            };
            deferred.resolve(rs);
        }).fail(function (err) {
            deferred.reject("프로토콜을 호출하지 못했습니다.");
        });

    return deferred.promise();
}

//fileUpload호출
function fileUpload(param, formData){
    var deferred = $.Deferred();
    console.log(SERVER_DOMAIN + param.url)
    $.ajax({
        type: "POST",
        cache:false,
        url: SERVER_DOMAIN + param.url,
        data: formData,

        dataType: "json",

        contentType: false,
        enctype: "multipart/form-data",
        xhrFields: {
            withCredentials: true
        },
        processData:false,
        beforeSend: function(){
            // console.log(param)
            // console.log(JSON.stringify(param))
        }
    })
    .done(function(callback){
        var rs = {
            param: param,
            callback: callback
        };
        deferred.resolve(rs);

        //콜백결과에따른액션
        // callAction(param, JSON.parse(callback));
        // deferred.resolve("프로토콜호출완료");
        // deferred.resolve(JSON.parse(callback));
    }).fail(function(err){
        deferred.reject("프로토콜을 호출하지 못했습니다.");
    });

    return deferred.promise();
}

// Json로딩
function loadJson(param){
    var deferred = $.Deferred();
    
    $.getJSON(
        param.url,
    ).done(function(callback){
        var rs = {
            param: param,
            callback: callback
        }
        console.log(callback)
        deferred.resolve(rs);
    }).fail(function(err){
        deferred.reject("JSON파일을 로드하지 못했습니다.");
    })

    return deferred.promise();
}