
'use strict';

var UNDEF_VALUE = -1;

var ACCOUNTPK = -1;
var REGKEY = -1;
var SERVERINDEX = -1;
var OSTYPE = null;
// 로딩화면
var loaderViewer = null;
// SNS핸들링
var snsPannel = {};
// 프로필정보
var snsProfile = null;
// 공통함수
var snsCommonFunc = {};

var SERVER_DOMAIN = "";//"https://vsnsgame.onlinestory.co.kr";
var CLIENT_DOMAIN = "";//"//vsns.onlinestory.co.kr";
var WS_DOMAIN = "182.162.62.232:10501";//"vsnsnotify.onlinestory.co.kr";

// var SERVER_IP = "106.241.53.110";
//var CURIP = document.location.href;
//CURIP.split("://")[1].split(":")[0];// "182.162.62.232";

var REDIS_SERVER = "ws://182.162.62.232:33085/.json";//"wss://vsnsspot.onlinestory.co.kr/.json"
// var SERVER_PORT = "8585";

// var SERVER_HTTP = "http://"+SERVER_IP+":"+SERVER_PORT;

// 브랜드샵용임시계정번호
var CUSTOM_USER_SEQ = 227;
var BRAND_POST_ARR = [595, 596];
var BRAND_POST_TEXT = new Array();
BRAND_POST_TEXT[595] = [
    [
        {
            pc_left: "110px",
            phone_left: "34vw",
            pc_top: "145px",
            phone_top: "45vw",
            text: "아이폰 케이스<br/>15,000원 / 스마일 150개",
            name: "아이폰 케이스",
            price: 15000,
            smile: 150,
            url: "http://m.naver.com"
        },
        {
            pc_left: "135px",
            phone_left: "52vw",
            pc_top: "305px",
            phone_top: "96vw",
            text: "검정 패딩<br/>36,800원 / 스마일 365개",
            name: "검정 패딩",
            price: 36800,
            smile: 365,
            url: "http://m.nate.com"
        }
    ]
]
BRAND_POST_TEXT[596] = [
    [
        {
            pc_left: "50px",
            phone_left: "24vw",
            pc_top: "145px",
            phone_top: "45vw",
            text: "연두잠바<br/>15,000원 / 스마일 150개",
            name: "연두잠바",
            price: 15000,
            smile: 150,
            url: "http://m.naver.com"
        },
        {
            pc_left: "160px",
            phone_left: "74vw",
            pc_top: "205px",
            phone_top: "65vw",
            text: "화이트 월남 치마<br/>15,000원 / 스마일 150개",
            name: "화이트 월남 치마",
            price: 15000,
            smile: 150,
            url: "http://m.naver.com"
        }
    ],
    [
        {
            pc_left: "80px",
            phone_left: "14vw",
            pc_top: "145px",
            phone_top: "35vw",
            text: "흰색 누드 원피스<br/>15,000원 / 스마일 150개",
            name: "흰색 누드 원피스",
            price: 15000,
            smile: 150,
            url: "http://m.naver.com"
        },
        {
            pc_left: "165px",
            phone_left: "50vw",
            pc_top: "95px",
            phone_top: "31vw",
            text: "핑크 립스틱<br/>36,800원 / 스마일 365개",
            name: "핑크 립스틱",
            price: 36800,
            smile: 365,
            url: "http://m.nate.com"
        }
    ]
]

var SERVICE_VISION  = "aws";//"azure"; //"aws"

var VISION_SERVER = "http://172.27.40.16:3000/" + SERVICE_VISION;


var setAutoURLInfo = function()
{
    if( -1 != document.URL.toString().indexOf( "vsns.onlinestory" ) )
    {
        WS_DOMAIN = "wss://vsnsnotify.onlinestory.co.kr";
        REDIS_SERVER = "wss://vsnsspot.onlinestory.co.kr/.json"
        
        SERVER_DOMAIN = "https://vsnsgame.onlinestory.co.kr";
        CLIENT_DOMAIN = "//vsns.onlinestory.co.kr";
    }
    else if ( -1 != document.URL.toString().indexOf( "182.162.62.232" ) )
    {        
        WS_DOMAIN = "ws://182.162.62.232:10501";//"vsnsnotify.onlinestory.co.kr";
        REDIS_SERVER = "ws://182.162.62.232:33085/.json";//"wss://vsnsspot.onlinestory.co.kr/.json"
        
        SERVER_DOMAIN = "";//"https://vsnsgame.onlinestory.co.kr";
        CLIENT_DOMAIN = "";//"//vsns.onlinestory.co.kr";
    }

}();


var PROFILE_PATH = CLIENT_DOMAIN + "/fileupload/myprofile/";
var CUSTOMTEXTURE_PATH = CLIENT_DOMAIN + "/fileupload/avatar/";
var ASSET_URL = "Assets/";

var GlobalDefines = (function () {
    function GlobalDefines() {

        this.canvas         = null;
        this.engine         = null;
        this.scene          = null;
        this.camera         = null;
        this.dataManager    = null;
        this.assetsManager  = null;
        // this.guisystem      = null;
        this.eventManager   = null;
        this.resManager     = null;
        this.runnableMgr    = null;
        this.scriptManager  = null;
        this.soundManager   = null;
        this.chatManager    = null;
        // this.tileManager    = null;
        this.aiButlerManager= null;
        // this.objectManager  = null;
        this.highLightLayer = null;
        this.sceneMgr       = null;

        // this.resourceScene  = null;

        //G.scene이 바뀔때마다 새로 생성해줘야 한다.
        this.guiMain        = null;
        // this.animationMgr   = null;
        this.loading        = null;

        this.startButtonClickTime = 0;
        this.currentLoadingMesh = 0;
        this.myroomLoadedTime = 0;

        this.beforeScreenSize = { "width":0, "height":0 };
    }
    GlobalDefines.prototype.Log = function () {

        if (typeof console == "undefined")
            return;
        
        //console.log();
    };

    return GlobalDefines;
}());
var G = new GlobalDefines();

// SNS글로벌변수
var GlovalVars = (function(){
    function GlovalVars(){
        this.gamename = null;
        this.xhrFields = null;
        this.loadPageCnt = null;
        this.popupLength = null;
    }

    // 게임명설정하기
    GlovalVars.prototype.setVars = function(){
        this.gamename = "Visual SNS";
        this.xhrFields = false;
        this.loadPageCnt = 18;
        this.popupLength = 0;
    }

    // 게임명불러오기
    GlovalVars.prototype.getGameNm = function(){
        return this.gamename;
    }

    // ajax세션여부불러오기
    GlovalVars.prototype.getXhrFields = function(){
        return this.xhrFields;
    }

    // 한페이지당로딩갯수불러오기
    GlovalVars.prototype.getLoadPageCnt = function(){
        return this.loadPageCnt;
    }

    // 현재열려있는팝업수불러오기
    GlovalVars.prototype.getPopupLength = function(){
        return this.popupLength;
    }

    return GlovalVars;
}());

var snsGloval = new GlovalVars();
snsGloval.setVars();




var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();







var INTERIAL_CAMERA_RADIUS = 50;
var MIN_CAMERA_RADIUS = 70;//120;
var MAX_CAMERA_RADIUS_OF_CHARACTOR = 200;
var MAX_CAMERA_RADIUS_OF_VEHICLE = 250;

var MAX_CAMERA_RADIUS_OF_ROOM_CHARACTOR = 120;
var MAX_CAMERA_RADIUS_OF_ROAD_CHARACTOR = 170;

var MAP_HEIGHT = 0.1;
var OBJ_HEIGHT = [0.1, 20.1, 80.1, 140.1];
var CHR_HEIGHT = 0.1;

var pre_ff_performance = null;
var ff_performance = {}
ff_performance.OS = null;
ff_performance.videocard = null;
ff_performance.webglversion = null;
ff_performance.resolution = null;
ff_performance.firstpageload = null;
ff_performance.drawcall = null;
ff_performance.activepolygon = null;
ff_performance.activeobject = null;
ff_performance.myhomeloadingtime = null;
ff_performance.mindelay = null;
ff_performance.maxdelay = null;
ff_performance.netdelay = null;
ff_performance.fps = null;

ff_performance.pk = null;
ff_performance.nickname = null;
ff_performance.cameraA = null;
ff_performance.cameraB = null;
ff_performance.cameraR = null;
ff_performance.cameraPos = null;
ff_performance.cameraTar = null;
ff_performance.scene = null;





// var FAAA = (function(){

//     function FAAA(){ return this; }

//     FAAA.prototype.a = function() {
//         console.log('FAAA.a');
//     }

//     return FAAA;
// }());


// var FBBB = (function(){

//     function FBBB(){ return this; }

//     // FBBB.prototype.a = function() {
//     //     console.log('FBBB.a');
//     // }

//     FBBB.prototype.b = function() {
//         console.log('FBBB.b');
//     }

//     return FBBB;
// }());


// var FCCC = (function(){

//     __inherit(FCCC,FBBB);

//     function FCCC(){ return this; }

//     // FCCC.prototype.a = function() {
//     //     console.log('FCCC.a');
//     // }

//     FCCC.prototype.test = function() {
//         this.a();
//         this.b();
//     }

//     return FCCC;
// }());

// var ccc = new FCCC();
// ccc.test();
//<------------------------------------------------------------------------------------------------------------

/*
// IUser 인터페이스
var IUser = (function(){
    
    var iUser = function(){
        
        // 자기 자신의 객체 생성을 막기 위한 추가 소스
        if (this.constructor === iUser){
            throw new Error('정의된 인터페이스는 자기 자신의 객체를 가질 수 없습니다.');
        }
        else{
            return this;
        }
    };

    var prototype_members = { 
        // 메서드
        getId: function(){
        },
        setId: function(){
        }
    };
    
    for (var n in prototype_members) iUser.prototype[n] = prototype_members[n];
    
    return iUser;
    
})();


// IBoard 인터페이스
var IBoard = (function(){
    
    var iBoard = function(){
        
        // 자기 자신의 객체 생성을 막기 위한 추가 소스
        if (this.constructor === iBoard){
            throw new Error('정의된 인터페이스는 자기 자신의 객체를 가질 수 없습니다.');
        }
        else{
            return this;
        }    
    }

    var prototype_members = { 
        // 메서드
        getBoard: function(){
        },
        setBoard: function(){
        }    
    };
    
    for (var n in prototype_members) iBoard.prototype[n] = prototype_members[n];
    
    
    return iBoard;
    
})();                


// User Entitie
var UserEntitie = new (function(){
    
    var userEntitie = function(){
        this.id = '';
        return this;    
    }
            
   return userEntitie;
            
}())();
  
        
        
        // 정의된 인터페이스(IUser) 메소드들을 상속받은 일반 클래스(User1)에서 구현한다.
var User1 = interfaceInherit(IUser, {
    // Repository
    getId: function(){
        return UserEntitie.id + '의 아이디 입니다.';
    },
    setId: function(id){
        UserEntitie.id = id;
        return this;
    }
});

// 정의된 인터페이스(IUser, IBoard) 메소드들을 다중 상속([IUser, IBoard]받은 일반 클래스(User2)에서 구현한다.
var User2 = interfaceInherit([IUser, IBoard], {
    // Repository
    getId: function(){
        return UserEntitie.id + '의 아이디랑꼐!!!!';
    },
    setId: function(id){
        UserEntitie.id = id;
        return this;
    },
    getBoard: function(){
        return this;
    },
    setBoard: function(){
        return this;
    }
});                

// 인터페이스 상속(다중) 및 구현
function interfaceInherit(_interfaces, opt){
    
    var o = {};
    
    // 인터페이스 메서드 카운트
    var interfaceMethodCount = 0;                    
    // 일반클래스(구현클래스)의 인터페이스 메서드 구현 카운트
    var classMethodCount = 0;
    
    _interfaces = _interfaces.length ? _interfaces : [_interfaces];
    
    for (var i = 0, length = _interfaces.length; i < length; i++){
        
        var _interface = _interfaces[i];
    
        var F = function(){};
        
        for (var n in _interface.prototype){
            F.prototype[n] = _interface.prototype[n];
        }
    
        var $F = _interface.call(new F());
        
        for (var n in $F){
            // 인터페이스에 정의된 함수만 구현 가능하다.
            if (Object.hasOwnProperty.call(opt, n)){
                
                o[n] = opt[n];
                
                classMethodCount++;
            }
            
            interfaceMethodCount++;
        }
        
        if (interfaceMethodCount !== classMethodCount){
            // 일반 클래스(구현 클래스)에 정의된 인터페이스 메서드의 구현 메서드가 없을떄..
            throw new Error('상속된 인터페이스 메서드가 구현(모두)되지 않았습니다.');
            return {};
        }                  
    }
    
    return o;
}

alert(User1.setId('xanione').getId());
alert(User2.setId('yanione').setBoard().getBoard().getId());
*/
