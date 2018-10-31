
'use strict';

var Vector2 = BABYLON.Vector2;
var Vector3 = BABYLON.Vector3;
var Color3 = BABYLON.Color3;
var ToRadians = BABYLON.Tools.ToRadians; //ToRadians=function(e){return e*Math.PI/180}
var ToDegrees = BABYLON.Tools.ToDegrees; //ToDegrees=function(e){return 180*e/Math.PI}


//<------------------------------------------------------------------------------------------------------
//<------------------------------------------------------------------------------------------------------
//<------------------------------------------------------------------------------------------------------

function snsBtnOpen(pageName) {

    switch(pageName) {
        case '타임라인':
        case '검색메인':
        case '게시글쓰기':
        case '피드':
        case '마이페이지':
            snsCommonFunc.snsView(0,null);
            break;

        default:
            alert('snsBtnOpen 페이지 네임이 잘못됨');
            break;
    }
}

function snsBtnClose() {
    snsPannel = {};
    $(".snsWrap").remove();
}





//<------------------------------------------------------------------------------------------------------
//<------------------------------------------------------------------------------------------------------
//<------------------------------------------------------------------------------------------------------
//<------------------------------------------------------------------------------------------------------

var CommFunc = {}

CommFunc.getYouTubeThumbNailImg = function( in_contentsStr )
{
    return ETCUI_PATH + "youtubeTemp.png"; 
    // return "https://i.ytimg.com/vi/" + in_contentsStr + "/hqdefault.jpg"; // CORS 문제로 일단 비활성화
}

CommFunc.loadJavaScript = function(url, success, fail) {
    // var loader = document.createElement("script");
    // loader.setAttribute("src", url);
    // document.getElementsByTagName("head")[0].appendChild(loader);
    BABYLON.Tools.LoadScript(url, success, fail);
}

CommFunc.max = function(a, b) {
	return (((a) > (b)) ? (a) : (b));
}

CommFunc.min = function(a, b) {
	return (((a) < (b)) ? (a) : (b));
}

CommFunc.minMax = function(min, val, max) {
	var temp = this.min(max, val);
	temp = this.max(min, temp);
	return temp;
}


CommFunc.random = function(max) {
    return Math.floor(Math.random() * max);
}
CommFunc.randomMinMax = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

CommFunc.clone = function(obj) {
    if (obj === null || typeof(obj) !== 'object')
    return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr];
      }
    }
    return copy;
}

CommFunc.changeExt = function(url) {

    var len = url.length;
    var sExt = url.substring(len  - 3, len);

    return url.replace(sExt, "png");
}

CommFunc.getThumbUrl = function(video_url) {

    var len = video_url.length;
    var sExt = video_url.substring(len  - 3, len);
    
    video_url = video_url.replace(sExt, "png");
    video_url = video_url.replace('share/video', 'share/video/thumbnail');

    return video_url;
}


CommFunc.numberWithCommas = function(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }
        
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

// Array.prototype.remove = function(from, to) {
// 	var rest = this.slice((to || from) + 1 || this.length);
// 	this.length = from < 0 ? this.length + from : from;
// 	return this.push.apply(this, rest);
// };

// Array.prototype.removeAll = function() {
//     var rest = this.slice(this.length);
//     this.length = 0;
//     return this.push.apply(this, rest);
// };

//Array.prototype으로 정의를 하면 babylon 엔진에서 에러가 발생한다.
//babylon 엔진 속 ssao, Array를 사용하는 부분에서...49366라인..
//그래서 그냥 함수로 변경한다.
CommFunc.arrayRemoveAll = function(array) {
    
    if(!array) return;

    var rest = array.slice(array.length);

    array.length = 0;

    return array.push.apply(array, rest);

};


CommFunc.toK = function(num) {
    var str;

    if(num >= 1000000) {
        var n1 = Math.floor(num / 1000000);
        var n2 = Math.floor(Math.floor(num % 1000000) / 100000);

        return n1.toString()+'.'+n2.toString() + 'M';

    } else if(num >= 10000) {

        var n1 = Math.floor(num / 1000);
        var n2 = Math.floor(Math.floor(num % 1000) / 100);

        return n1.toString()+'.'+n2.toString() + 'K';
    }

    return num.toString();
}

//배열의 첫번째 요소 삭제
//array.shift();
//배열의 마지막 요소 삭제
//array.pop();

//배열에서 원소 제거
CommFunc.arrayRemove = function(array, removeValue) {
    
    if(!array) return;
    
    array.splice(array.indexOf(removeValue),1); 
}

CommFunc.arrayMove = function (array, old_index, new_index) {

    if(!array) return;

    if (new_index >= array.length) {
        var k = new_index - array.length;
        while ((k--) + 1) {
            array.push(undefined);
        }
    }
    array.splice(new_index, 0, array.splice(old_index, 1)[0]);
    return this;
};


CommFunc.arrayRotate = function(array, reverse){

    if(!array) return;

    if(reverse)
        array.unshift(array.pop())
    else
        array.push(array.shift())
    return array;
} 

CommFunc.meshesDispose = function() {
    for(var i=0; i<G.scene.meshes.length; i++) {
        G.scene.meshes[i].dispose();
    }
}

CommFunc.removeLight = function() {

    if(!G.scene) return;
    if(!G.scene.lights) return;

    var length = G.scene.lights.length;
    for(var i=length-1; i>=0; i--) {
        // G.scene.removeLight(G.scene.lights[i]);
        G.scene.lights[i].dispose();
    }
}

// CommFunc.detachCamera = function() {

//     if(!G.scene) return;
//     if(!G.camera) return;
    
//     G.scene.removeCamera(G.camera);
//     G.camera.detachControl(G.canvas);
//     G.camera.inputs.clear(); 
//     G.camera.dispose();
// }

CommFunc.useEasingFuncToAnimation = function( in_targetAnimation, in_easingFunc, in_easingMode )
{
    // easing
    var easingFunc = (undefined == in_easingFunc) ? new BABYLON.QuadraticEase() : in_easingFunc;
    var easingMode = (undefined == in_easingMode) ? BABYLON.EasingFunction.EASINGMODE_EASEINOUT : in_easingMode;
    easingFunc.setEasingMode( easingMode );
    in_targetAnimation.setEasingFunction(easingFunc);
}



CommFunc.MoveTowards = function(current, target, maxDelta)
{
    if(target == null) return;
    if(current == null) return;

    var a = target.subtract(current);
    var magnitude = Math.sqrt(a.x*a.x + a.y*a.y + a.z*a.z);

    if (magnitude <= maxDelta || magnitude == 0) {
          return target;
    }

    current.x = current.x + a.x / magnitude * maxDelta;
    current.y = current.y + a.y / magnitude * maxDelta;
    current.z = current.z + a.z / magnitude * maxDelta;

    return current;
}

CommFunc.QuaternionLookRotation = function(forward, up) {
    
    forward.normalize();

    var vector = forward.normalize();
    var vector1 = Vector3.Cross(up, vector);
    var vector2 = vector1.normalize();
    var vector3 = Vector3.Cross(vector, vector2);

    var m00 = vector2.x;
    var m01 = vector2.y;
    var m02 = vector2.z;
    var m10 = vector3.x;
    var m11 = vector3.y;
    var m12 = vector3.z;
    var m20 = vector.x;
    var m21 = vector.y;
    var m22 = vector.z;

    var num8 = (m00 + m11) + m22;
    var quaternion = new BABYLON.Quaternion(0,0,0,0);
    if (num8 > 0)
    {
        var num = Math.sqrt(num8 + 1);
        quaternion.w = num * 0.5;
        num = 0.5 / num;
        quaternion.x = (m12 - m21) * num;
        quaternion.y = (m20 - m02) * num;
        quaternion.z = (m01 - m10) * num;
        return quaternion;
    }
    if ((m00 >= m11) && (m00 >= m22))
    {
        var num7 = Math.sqrt(((1 + m00) - m11) - m22);
        var num4 = 0.5 / num7;
        quaternion.x = 0.5 * num7;
        quaternion.y = (m01 + m10) * num4;
        quaternion.z = (m02 + m20) * num4;
        quaternion.w = (m12 - m21) * num4;
        return quaternion;
    }
    if (m11 > m22)
    {
        var num6 = Math.sqrt(((1 + m11) - m00) - m22);
        var num3 = 0.5 / num6;
        quaternion.x = (m10+ m01) * num3;
        quaternion.y = 0.5 * num6;
        quaternion.z = (m21 + m12) * num3;
        quaternion.w = (m20 - m02) * num3;
        return quaternion; 
    }
    var num5 = Math.sqrt(((1 + m22) - m00) - m11);
    var num2 = 0.5 / num5;
    quaternion.x = (m20 + m02) * num2;
    quaternion.y = (m21 + m12) * num2;
    quaternion.z = 0.5 * num5;
    quaternion.w = (m01 - m10) * num2;
    return quaternion;
}


//배열에서 새로운 원소 삽입
// animals.splice(animals.lastIndexOf("cat"),1,"monkey");


//------------------------------------------------------------------------------------------------------------------>
CommFunc.worldToScreen = function(position) {
    // var worldMatrix = mesh.getWorldMatrix();
    // var transformMatrix = scene.getTransformMatrix();
    // var position = mesh.position;
    // var viewport = scene.activeCamera.viewport;
    // var coordinates = BABYLON.Vector3.Project(position, worldMatrix, transformMatrix, viewport);
    
    // return coordinates;

    var coordinate = BABYLON.Vector3.Project(position, 
        BABYLON.Matrix.Identity(), 
        G.scene.getTransformMatrix(), 
        G.scene.activeCamera.viewport.toGlobal(G.scene.getEngine().getRenderWidth(), G.scene.getEngine().getRenderHeight()));

    return coordinate;
}

//------------------------------------------------------------------------------------------------------------------>
CommFunc.nameGuid = function(name) {
    return name.toString() + '-' +  this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
}

CommFunc.guid = function() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
}
  
CommFunc.s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}


CommFunc.checkSupportedOSType = function() {
    OSTYPE = "Unknown OS";
    
    // if (navigator.appVersion.indexOf("Win") != -1)      OSTYPE = "Windows";
    // else if (navigator.appVersion.indexOf("Mac") != -1)      OSTYPE = "MacOS";
    // else if (navigator.appVersion.indexOf("X11") != -1)      OSTYPE = "UNIX";
    // else if (navigator.appVersion.indexOf("Linux") != -1) {
    //         OSTYPE = "Linux";
    //         $("#renderCanvas").attr("touch-action","none");
    // }
    // else if (navigator.appVersion.indexOf("Android") != -1) {
    //     OSTYPE = "Android";
    //     $("#renderCanvas").attr("touch-action","none");
    // }

    // var str = "Your OS: " + OSTYPE;
    
    // console.log(str);


    var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'];


    if (macosPlatforms.indexOf(platform) !== -1) {
        OSTYPE = 'Mac OS';
        $("#renderCanvas").attr("touch-action","none");
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        OSTYPE = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        OSTYPE = 'Windows';
    } else if (/Android/.test(userAgent)) {
        OSTYPE = 'Android';
        $("#renderCanvas").attr("touch-action","none");
    } else if (!OSTYPE && /Linux/.test(platform)) {
        OSTYPE = 'Linux';
    }

    var str = "Your OS: " + OSTYPE;
    console.log(str);

}

CommFunc.checkSupportedWebGl = function() {
    const gl = document.createElement("canvas").getContext("webgl");

    if(gl) {

        const ext = gl.getExtension("WEBGL_debug_renderer_info");

        console.log(gl.getParameter(gl.VERSION));
        console.log(gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
        console.log(gl.getParameter(gl.VENDOR));

        // if the extension exists, find out the info.
        if (ext) {
            console.log(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL));
            console.log(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
        }
    } else {
        alert("webgl is not supported!!");
        return false;
    }

    return true;
}

CommFunc.isPhone = function() {

    // return true;

    if(OSTYPE == 'Android' || OSTYPE == 'iOS') return true;

    return false;
}

CommFunc.isIPhone = function() {
    if(OSTYPE == 'iOS') return true;

    return false;
}

CommFunc.isAndroid = function() {
    if(OSTYPE == 'Android') return true;

    return false;
}

CommFunc.isVertical = function() {
    
    if(window.innerWidth > window.innerHeight) return false;

    return true;
}

CommFunc.checkSupportedWebSocket = function() {
    if(!window.WebSocket) {
         alert("websocket is not supported");
         return false;
    }
    return true;
}

var sceneInst = null;

CommFunc.createSceneInstrumentaion = function(scene) {

    sceneInst = new BABYLON.SceneInstrumentation(scene);
}

CommFunc.drawSceneInstrumentaion = function() {

    return;

    if(!sceneInst) return;

    var label =  document.getElementById("debugLabel1");
    label.innerHTML = "Draw Calls = " + sceneInst.drawCallsCounter.current;

    label =  document.getElementById("debugLabel2");
    label.innerHTML = "Active Polygon = " + (G.scene.getActiveIndices() / 3).toString();

    label =  document.getElementById("debugLabel3");
    label.innerHTML = "Active Object = " + G.scene.getActiveMeshes().length.toString();


    ff_performance.drawcall = sceneInst.drawCallsCounter.current;
	ff_performance.activepolygon = (G.scene.getActiveIndices() / 3).toString();
	ff_performance.activeobject = G.scene.getActiveMeshes().length.toString();
    // label =  document.getElementById("debugLabel8");
    // label.innerHTML = Loader.text;

    //GUI.information(Loader.text);
}

/*카메라찍기*/
CommFunc.htmlInputCamera = null;
CommFunc.onPictureCallback = null;
/**
 * 
 * @param {Function} in_callback // 사진찍은 데이터 통으로 넘겨줍니다. Function( in_event ) in_event.target.files 으로 접근가능
 * 사용중인곳은 FSceneAvatar::renderButton() 에서 확인하실 수 있어요
 */
CommFunc.takePicture = function( in_callback )
{
    if ( CommFunc.htmlInputCamera == null )
    {
        CommFunc.htmlInputCamera = $("#testCameraLinkHtml");
        CommFunc.htmlInputCamera.on("change", function( in_event )
        {
            if ( CommFunc.onPictureCallback != null )
                CommFunc.onPictureCallback( in_event );

            CommFunc.onPictureCallback = null;
        });
    }

    CommFunc.onPictureCallback = in_callback;
    CommFunc.htmlInputCamera.trigger("click");
}



/*
function get_version_of_IE () { 

	 var word; 

	 var agent = navigator.userAgent.toLowerCase(); 

	 // IE old version ( IE 10 or Lower ) 
	 if ( navigator.appName == "Microsoft Internet Explorer" ) word = "msie "; 

	 // IE 11 
	 else if ( agent.search( "trident" ) > -1 ) word = "trident/.*rv:"; 

	 // Microsoft Edge  
	 else if ( agent.search( "edge/" ) > -1 ) word = "edge/"; 

	 // 그외, IE가 아니라면 ( If it's not IE or Edge )  
	 else return -1; 

	 var reg = new RegExp( word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})" ); 

	 if (  reg.exec( agent ) != null  ) return parseFloat( RegExp.$1 + RegExp.$2 ); 

	 return -1; 
} 

function checkVersion () { 

	 var verNumber = get_version_of_IE(); 

	 demo1.innerHTML = verNumber; 

	 if ( verNumber == -1 ){ 
		demo2.innerHTML = "인터넷 익스플로러가 아닌, 다른 브라우저를 사용중이십니다."; 
	 } 
	 else { 
		 demo2.innerHTML = "인터넷 익스플로러 또는 엣지 브라우저를 사용중이십니다."; 
	 } 
} 


*/

/** @description Navigation Timing 요소에 대한 설명
 * navigationStart              새로운 문서 로드를 위해 이전 문서를 언로드하라는 프롬프트 실행이 끝난 직후 시간을 반환합니다.
 * unloadEventStart             이전 문서를 언로드하기 시작한 시간을 반환합니다.
 * unloadEventEnd               이전 문서를 언로드 완료한 시간을 반환합니다.
 * redirectStart                만약 리다이렉션이 있다면 리다이렉션 정보를 가져오기 시작한 시간을 반환합니다.
 * redirectEnd                  만약 리다이렉션이 있다면 마지막 리다이렉션 정보의 마지막 바이트를 수신한 시간을 반환합니다. 
 * fetchStart                   GET등의 방식으로 새로운 리소스를 가져오기 위해 캐시 데이터를 검사하기 직전 시간을 반환합니다.
 * domainLookupStart            현재 문서의 도메인 검색을 시작한 시간을 반환합니다.
 * domainLookupEnd              현재 문서의 도메인 검색이 완료된 시간을 반환합니다. 만약 이미 캐시 데이터에 도메인 데이터가 있다면 이 정보는 캐시 데이터에서 도메인정보를 검색/완료하는 시간을 반환합니다.
 * connectStart                 서버에서 문서를 검색하기 위해 연결을 설정하기 시작한 시간을 반환합니다.
 * connectEnd                   서버에서 문서를 검색하기 위한 연결 설정이 완료된 시간을 반환합니다.
 * secureConnectionStart        만약 현재 페이지가 HTTPS를 사용할 경우 보안 연결을 위해 핸드쉐이크 프로세스(?)가 시작되기 직전 시간을 반환합니다.
 * requestStart                 문서 요청을 시작하기 직전 시간을 반환합니다. 만약 요청이 실패하고 새로운 요청을 전송하면 새 요청을 시작하기 직전 시간이 반환됩니다.
 * responseStart                문서 요청에 대한 응답의 첫 바이트를 수신한 시간을 반환합니다.
 * responseEnd                  문서 요청에 대한 응답의 마지막 바이트를 수신한 직후 시간을 반환합니다. 만약 연결이 닫힐 경우 해당 시간을 반환합니다.
 * domLoading                   현재 문서 상태가 '로딩 중' 으로 바뀌기 직전 시간을 반환합니다.
 * domInteractive               현재 문서 상태가 '상호작용 중' 으로 바뀌기 직전 시간을 반환합니다.
 * domContentLoadedEventStart   DOMContentLoaded 이벤트 ( 이 이벤트는 html과 javascript 가 로드되었을때 발생하는 이벤트이다) 가 시작되기 직전 시간을 반환합니다.
 * domContentLoadedEventEnd     DOMContentLoaded 이벤트 ( 이 이벤트는 html과 javascript 가 로드되었을때 발생하는 이벤트이다) 가 완료된 시간을 반환합니다.
 * domComplete                  현재 문서 상태가 '완료' 로 바뀌기 직전 시간을 반환합니다.
 * loadEventStart               LoadEvent ( 이 이벤트는 html과 javascript 와 더불어 모든 페이지 리소스가 로드되었을때 발생하는 이벤트이다) 가 시작되기 직전 시간을 반환합니다.
 * loadEventEnd                 LoadEvent ( 이 이벤트는 html과 javascript 와 더불어 모든 페이지 리소스가 로드되었을때 발생하는 이벤트이다) 가 완료된 시간을 반환합니다.
 */

//  var starLoad = 0;

var performance_ntime;
        
var performance_total;
var performance_redirect;
var performance_cache;
var performance_dnslookup;
var performance_connect;
var performance_request;
var performance_response;
var performance_dom;
var performance_load;
var performance_pageEnd;
var performance_networkDelay;

CommFunc.testTime = function() {
    setTimeout(function() {
        performance_ntime = performance.timing;
        
        performance_total = performance_ntime.loadEventEnd - performance_ntime.navigationStart; //전체 소요시간
        performance_redirect = performance_ntime.redirectEnd - performance_ntime.redirectStart; // 동일 origin에서의 redirect 시간
        performance_cache = performance_ntime.domainLookupStart - performance_ntime.fetchStart; // cache 시간
        performance_dnslookup = performance_ntime.domainLookupEnd - performance_ntime.domainLookupStart; //DNS Lookup 시간
        performance_connect = performance_ntime.connectEnd - performance_ntime.connectStart; // 웹서버 연결 시간
        performance_request = performance_ntime.responseStart - performance_ntime.requestStart; // 요청 소요 시간
        performance_response = performance_ntime.responseEnd - performance_ntime.responseStart; // 응답 데이터를 모두 받은 시간
        performance_dom = performance_ntime.domComplete - performance_ntime.domLoading; // DOM객체 생성 시간 *******************
        performance_load = performance_ntime.loadEventEnd - performance_ntime.loadEventStart; // 브라우저의 Load 이벤트 실행시간
        performance_pageEnd = performance_ntime.loadEventEnd - performance_ntime.responseEnd; //  서버에서 페이지를 받고 페이지를 로드하는데 걸린 시간
        performance_networkDelay = performance_ntime.responseEnd - performance_ntime.fetchStart; //  네트워크 지연 시간
        
        ff_performance.firstpageload = performance_total;

        console.log("total : " + performance_total + "ms  >>>>>>>  전체 소요시간");
        console.log("redirect : " + performance_redirect + "ms  >>>>>>>   동일 origin에서의 redirect 시간");
        console.log("cache : " + performance_cache + "ms   >>>>>>>  cache 시간");
        console.log("dnslookup : " + performance_dnslookup + "ms  >>>>>>>  DNS Lookup 시간");
        console.log("connect : " + performance_connect + "ms  >>>>>>>  웹서버 연결 시간");
        console.log("request : " + performance_request + "ms  >>>>>>>  요청 소요 시간");
        console.log("response : " + performance_response + "ms  >>>>>>>  첫 응답으로 부터 응답 데이터를 모두 받은 시간");
        console.log("dom : " + performance_dom + "ms  >>>>>>>  DOM객체 로드 완료 시간");
        console.log("load : " + performance_load + "ms  >>>>>>>  브라우저의 Load 이벤트 실행시간");
        console.log("pageEnd : " + performance_pageEnd + "ms  >>>>>>>  서버에서 페이지를 받고 페이지를 로드하는데 걸린 시간");
        console.log("networkDelay : " + performance_networkDelay + "ms  >>>>>>>  네트워크 지연 시간");
    }, 500); //30초 뒤 수행
}


CommFunc.toAscii = function(bin) {
    return bin.replace(/\s*[01]{8}\s*/g, function(bin) {
    return String.fromCharCode(parseInt(bin, 2))
    })
}
CommFunc.toBinary = function(str, spaceSeparatedOctets) {
    return str.replace(/[\s\S]/g, function(str) {
    str = CommFunc.zeroPad(str.charCodeAt().toString(2));
    return !1 == spaceSeparatedOctets ? str : str + " "
    })
}

CommFunc.zeroPad = function(num) {
    return "00000000".slice(String(num).length) + num
}


//<-------------------------------------------------------------------------------------------------------------
BABYLON.Vector3.prototype.mux = function(rhs) {
    this.x *= rhs;
    this.y *= rhs;
    this.z *= rhs;
}




//<-------------------------------------------------------------------------------------------------------------
Math.clamp = function (value, min, max) {
    
    if (value < min) {
        return min;
    }
    else if (value > max) {
        return max;
    }

    return value;
};
    
Math.lerp = function (value1, value2, amount) {
    amount = amount < 0 ? 0 : amount;
    amount = amount > 1 ? 1 : amount;
    return value1 + (value2 - value1) * amount;
};

//<-------------------------------------------------------------------------------------------------------------

function px(num) {
    num = parseInt(num);
    return num.toString() + "px";
}


//<--------------------------------------------------------------------------------------------------------------
String.prototype.repeat = function(n) {
    var sRet = "";
    for (var i = 0; i < n; i++) sRet += this;

    return sRet;
}

String.prototype.format = function() {

    var args = arguments;
    var idx = 0;

    return this.replace(/%(-?)([0-9]*\.?[0-9]*)([s|f|d|x|X|o])/g, function(all, sign, format, type) {

        var arg;
        var prefix = format.charAt(0);

        format = format.split(/\./);

        format[0] = parseInt(format[0], 10) || 0;
        format[1] = format[1] === undefined ? NaN : parseInt(format[1], 10) || 0;

        if (type == 's') {
            arg = isNaN(format[1]) ? args[idx] : args[idx].substr(0, format[1]);
        } else {

            if (type == 'f') {
                arg = (format[1] === 0 ? parseInt(args[idx], 10) : parseFloat(args[idx])).toString();
                if (!isNaN(format[1])) arg = arg.replace(RegExp('(\\.[0-9]{' + format[1] + '})[0-9]*'), '$1');
            } else if (type == 'd') {
                arg = parseInt(args[idx], 10).toString();
            } else if (type == 'x') {
                arg = parseInt(args[idx], 10).toString(16).toLowerCase();
            } else if (type == 'X') {
                arg = parseInt(args[idx], 10).toString(16).toUpperCase();
            } else if (type == 'o') {
                arg = parseInt(args[idx], 10).toString(8);
            }

            if (prefix == '0')  arg = '0'.repeat(format[0] - arg.length) + arg;

        }

        if (sign == '-') {
            arg += ' '.repeat(format[0] - arg.length);
        } else {
            arg = ' '.repeat(format[0] - arg.length) + arg;
        }

        idx++;
        return arg;

      }).replace(/%%/g, '%');
}


String.prototype.hashCode = function() {
  
    var self = this, range = Array(this.length);
    for(var i = 0; i < this.length; i++) {
        range[i] = i;
    }
    
    return Array.prototype.map.call(range, function(i) {
        return self.charCodeAt(i).toString(16);
    }).join('');
}










//------------------------------------------------------------------------------------------------------------------>
function updateGUIPos(advancedDynamicTexture, pos, relative) {
    
    var children = advancedDynamicTexture._rootContainer.children;//('ring');
    var x, y;
    for(var i=0; i<children.length; i++) {
        x = parseInt(children[i].left);
        y = parseInt(children[i].top);

        if(relative) {
            x += pos.x;
            y += pos.y;
        }
        else {
            x = pos.x;
            y = pos.y;
        }

        children[i].left = px(x);
        children[i].top = px(y);
    }
}


CommFunc.pngEncode = function(input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                  keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
}

//------------------------------------------------------------------------------------------------------------------>
var Base64 = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = Base64._utf8_encode(input);
 
        while (i < input.length) {
 
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
 
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
 
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
 
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
        }
 
        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
 
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
        while (i < input.length) {
 
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
 
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
 
            output = output + String.fromCharCode(chr1);
 
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
 
        }
 
        output = Base64._utf8_decode(output);
 
        return output;
 
    },
 
    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    },
 
    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c, c1, c2, c3;

        c = c1 = c2 = c3 = 0;
 
        while ( i < utftext.length ) {
 
            c = utftext.charCodeAt(i);
 
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
 
        }
 
        return string;
    }
}

/*
// 인코딩, 디코딩 예제
alert(Base64.encode("안녕하세요")); // 인코딩되어 7JWI64WV7ZWY7IS47JqU 출력됨
alert(Base64.decode("7JWI64WV7ZWY7IS47JqU")); // 디코딩되어 안녕하세요 출력됨
*/


//Chrome 50부터 Geolocation API는 보안 컨텍스트(HTTPS)에서만 작동합니다. 사이트가 비보안 출처(예: HTTP)에서 호스팅되는 경우 사용자 위치 요청은 작동하지 않습니다.
function getLocation() {

    var geo_options = {
        enableHighAccuracy: true,
        maximumAge        : 30000,
        timeout           : 27000
    };

    var output = document.getElementById("debugLabel8");

    if (!navigator.geolocation){
        output.innerHTML = "<p>사용자의 브라우저는 지오로케이션을 지원하지 않습니다.</p>";
        return;
    }

    function locationSuccess(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;

        output.innerHTML = '<p>위도 : ' + latitude + '° <br>경도 : ' + longitude + '°</p>';

        var img = new Image();
        img.src = "http://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

        output.appendChild(img);
    };

    function locationError(error) {
        output.innerHTML = "사용자의 위치를 찾을 수 없습니다.";

        var errorTypes = {
        0 : "무슨 에러냥~",
        1 : "허용 안눌렀음",
        2 : "위치가 안잡힘",
        3 : "응답시간 지남"
        };
        var errorMsg = errorTypes[error.code];
        console.log(errorMsg)
    };

    output.innerHTML = "<p>Locating…</p>";

    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, geo_options);
}

function gettingJSON(){

    var flickerAPI = "http://api.openweathermap.org/data/2.5/weather?q=Seoul&APPID=aba71f0bf2b2ed13d1f780ca52af635f";

    //안된다..!!
    $.getJSON(flickerAPI, function(json) {
        console.log(JSON.stringify(json));
    });

}



var convertBase = function () {

    function convertBase(baseFrom, baseTo) {
        return function (num) {
            return parseInt(num, baseFrom).toString(baseTo);

        };
    }

    // binary to decimal
    convertBase.bin2dec = convertBase(2, 10);

    // binary to hexadecimal
    convertBase.bin2hex = convertBase(2, 16);

    // decimal to binary
    convertBase.dec2bin = convertBase(10, 2);

    // decimal to hexadecimal
    convertBase.dec2hex = convertBase(10, 16);

    // hexadecimal to binary
    convertBase.hex2bin = convertBase(16, 2);

    // hexadecimal to decimal
    convertBase.hex2dec = convertBase(16, 10);

    return convertBase;
}();

// console.log(convertBase.bin2dec('111')); // '7'
// console.log(convertBase.dec2hex('42')); // '2a'
// console.log(convertBase.hex2bin('f8')); // '11111000'
// console.log(convertBase.dec2bin('22')); // '10110'



var clickify = function (button, url) {
    button.pointerEventObservable.add(function (d, s) {
        window.open(url);
    }, BABYLON.PrimitivePointerInfo.PointerUp);
};



$('#teller').remove();
var teller = document.createElement('div');
teller.style.position = 'absolute';
teller.style.bottom = '10%';
teller.style.right = '5px';
teller.style.zIndex = '9999';
teller.style.background = '#399';
teller.style.color = '#FFF';
teller.style.padding = '20px';
teller.style.fontSize = '24px';
teller.innerHTML = 'Awaiting input...';

teller.setAttribute("id", "teller");
document.body.appendChild(teller)
var tell = function(m){ teller.innerHTML = m || 'nothing to tell'; $('#teller').show();} 
$('#teller').hide();

//tell('Animation Started');
