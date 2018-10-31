'use strict';

var GUI = {}

GUI.ALIGN_RIGHT  = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
GUI.ALIGN_LEFT   = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
GUI.ALIGN_TOP    = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
GUI.ALIGN_BOTTOM = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
GUI.ALIGN_CENTER = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
GUI.ALIGN_MIDDLE = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

// 스크립트 제어 때문에 버튼 이름을 미리 정의해둔뒤에 써야할거같습니다. (나중에 새로운 버튼이 필요하면 추가 작성한다.)
GUI.ButtonName = {};
GUI.ButtonName.mainProfile = "btnMainProfile";
GUI.ButtonName.mainRuby = "btnMainRuby";
GUI.ButtonName.mainCoin = "btnMainCoin";
GUI.ButtonName.mainStar = "btnMainStar";

GUI.ButtonName.mainMail = "btnMainMail";
GUI.ButtonName.mainSetting = "btnMainSetting";

GUI.ButtonName.mainSocialCreate = "btnMainSocialCreate";
GUI.ButtonName.mainSocialConsume = "btnMainSocialConsume";
GUI.ButtonName.mainSocialShare = "btnMainSocialShare";

GUI.ButtonName.mainSNS = "btnMainSNS";

GUI.ButtonName.mainTown = "btnMainTown";
GUI.ButtonName.mainRotate = "btnMainRotate";
GUI.ButtonName.mainTopView = "btnMainTopView";
GUI.ButtonName.mainGame = "btnMainGame";
GUI.ButtonName.fullScreen = "btnMainFullScreen";

GUI.ButtonName.mainShop = "btnMainShop";
GUI.ButtonName.mainQuest = "btnMainQuest";
GUI.ButtonName.mainStarContents = "btnMainStarContents";
GUI.ButtonName.mainAvatar = "btnMainAvatar";

// font size pre setting
GUI.FontSize = 
{
    TINY    : 14,
    SMALL   : 18,
    MIDDLE  : 22,
    BIG     : 26,
    VBIG    : 32,
}

// gui path
GUI.DEFAULT_IMAGE_PATH_NEW = ASSET_URL+"97_gui_new/"
GUI.DEFAULT_IMAGE_SCROLLBAR_BG = GUI.DEFAULT_IMAGE_PATH_NEW + "scroll_bg.png";
GUI.DEFAULT_IMAGE_SCROLLBAR_BUTTON = GUI.DEFAULT_IMAGE_PATH_NEW + "scroll_bar.png";

var MAINUI_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "00_main/";
var SHOPUI_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "01_shop/";
var AVATAR_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "12_avatar/";

var CHATUI_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "16_interaction/chat/";
var SPOTUI_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "19_spot/";
var ETCUI_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "21_ETC/";
var EXCHANGEUI_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "20_exchange/";
var PACKAGE_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "23_package/";
var PETUI_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "24_pet/";
var PLAYERUI_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "25_player/";
var ROOMSTOREUI_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "26_roomstore/";
var BTM_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "27_btmexchange/";


GUI.LAYER = 
{
    BACKGROUND  : -1,
    MAIN        : 0,
    EFFECT      : 1,
    POPUP       : 2,
    TOP_EFFECT  : 3,
}

GUI.waitingSizeableFunc = [];
GUI.addWatingSizeableFunc = function( in_func )
{
    GUI.waitingSizeableFunc.push( in_func );
}


// 안씁니다. 엔진에서 제공해주는 AutoResize 기능 적용할예정
/*
GUI.createMainGUI = function( in_name )
{
    var self = this;

    this.mainTexture = null;
    this.containers = [];

    this.init = function()
    {
        var makeContaier = function( in_x, in_y, in_width, in_height, in_alignW, in_alignH )
        {
            var container = GUI.createContainer();
            container.left = in_x;
            container.top = in_y;
            container.width = in_width;
            container.height = in_height;
            container.horizontalAlignment = in_alignW;
            container.verticalAlignment = in_alignH;

            return container;
        }

        self.mainTexture = GUI.createPanel(in_name);     
    }

    this.addControl = function( in_target, in_layerOrder )
    {
        var targetLayer = in_layerOrder;
        if ( in_layerOrder == undefined )
            targetLayer = GUI.LAYER.MAIN;

        in_target.zIndex = targetLayer;
        self.mainTexture.addControl( in_target );
    }

    this.onResize = function()
    {
        var self = this;

        GUI.waitingSizeableFunc.forEach( function(in_iter)
        {
            if ( in_iter != null)
                in_iter();
        });
    }

    this.addResizeable = function( in_resizeFunc )
    {
        GUI.waitingSizeableFunc.push( in_resizeFunc );
    }

    this.removeControl = function( in_target )
    {
        self.mainTexture.removeControl( in_target );
    }

    this.dispose = function()
    {
        if ( G.guiMain == null )
            return;

        G.chatManager.hideChatPrevUI();
        G.chatManager.closeChatPopup();

        G.aiButlerManager.hideSurveyUI();

        // FSocialSpot.getInstance().closeSocialSpotListPopup();

        this.mainTexture.dispose();
    }

    self.init();
};
*/

var GUI_HIDE_DEFAULT_TIMEOUT = 60*5;

// 레이어 기능때문에 비슷하게 몇개 만듭니다.
GUI.createMainGUI = function( in_name )
{
    var self = this;

    this.popupCount = 0;
    this.mainTexture = null;
    this.idealWidth = 0;

    this.useAutoDisappear = false;

    this.idleHidedOffset = GUI_HIDE_DEFAULT_TIMEOUT*2;
    this.idleHided = false;

    this.loadingSplash = null;
    this.popupMask = null;

    this.init = function()
    {        
        var mainTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(in_name, true);    
        mainTexture.idealWidth = 720;
        this.mainTexture = mainTexture;

        this.idealWidth = mainTexture.idealWidth;
        
        if ( this.useAutoDisappear )
        {
            G.runnableMgr.add( this );
            G.eventManager.setEnableTouched("GUI_MAIN", this);
        }

        return mainTexture;
    }

    this.setIdealWidth = function( in_idealWidth )
    {
        //return;

        this.mainTexture.idealWidth = in_idealWidth;
        this.idealWidth = in_idealWidth;
    }

    this.addControl = function( in_target, in_layerOrder )
    {
        var targetLayer = in_layerOrder;
        if ( in_layerOrder == undefined )
            targetLayer = GUI.LAYER.MAIN;

        in_target.zIndex = targetLayer;
        self.mainTexture.addControl( in_target );

        if ( in_layerOrder == GUI.LAYER.POPUP )
            this.popupCount++;
    }

    this.onResize = function()
    {
    }

    this.removeControl = function( in_target )
    {
        if ( in_target == null )
            return;

        self.mainTexture.removeControl( in_target );

        
        if ( in_target.zIndex == GUI.LAYER.POPUP )
            this.popupCount--;
    }

    this.dispose = function()
    {
        if ( G.guiMain == null )
            return;

        G.chatManager.hideChatPrevUI();
        G.chatManager.closeChatPopup();

        G.aiButlerManager.hideSurveyUI();

        this.mainTexture.dispose();

        if ( this.useAutoDisappear )
        {
            G.runnableMgr.remove(this);
            G.eventManager.clearEnableTouched("GUI_MAIN");
        }
    }

    this.isShowingPopup = function()
    {
        return (this.popupCount > 0);
    }

    this.getChildByName = function( in_name )
    {
        return this.mainTexture.getChildByName( in_name );
    }

    this.setAlpha = function( in_alpha )
    {
        FRoomUI.getInstance().setAlpha( in_alpha );
        FRoomUI.getInstance().ui.wrapper.alpha = in_alpha;

        for ( var i = 0; i < this.mainTexture._linkedControls.length; ++i )
        {
            this.mainTexture._linkedControls[i].alpha = in_alpha;
        }

        var visible = true;
        if ( in_alpha == 0 )
            visible = false;

        FRoomUI.getInstance().ui.wrapper.isVisible = visible;

        for ( var i = 0; i < this.mainTexture._linkedControls.length; ++i )
        {
            this.mainTexture._linkedControls[i].isVisible = visible;
        }
    }

    // idle hide
    this.run = function()
    {
        if ( !this.useAutoDisappear )
            return;

        this.idleHidedOffset--;

        if ( this.idleHidedOffset < 0 )
        {
            if ( !this.idleHide )
                this.idleHide();

            this.setAlpha( Math.max( 0, (100+this.idleHidedOffset)*0.01 ) );
        }
    }

    this.initIdleTimeOut = function()
    {
        if ( !this.useAutoDisappear )
            return;

        this.idleHidedOffset = GUI_HIDE_DEFAULT_TIMEOUT;

        //if ( this.idleHided )
            this.idleShow();
    }

    this.idleHide = function()
    {
        this.idleHided = true;
    }

    this.idleShow = function()
    {
        this.idleHided = false;
        this.setAlpha(1);
    }

    this.onPointerDown = function()
    {
        this.initIdleTimeOut();
    }

    this.showLoadingSplash = function()
    {
        if ( this.loadingSplash )
        {
            this.loadingSplash.dispose();
            this.loadingSplash = null;
        }

        this.loadingSplash = new BABYLON.Layer( "loadingSplash", 
        GUI.DEFAULT_IMAGE_PATH_NEW+"21_ETC/tip"+ (CommFunc.random(2)+1).toString() +".png", G.scene );
    }

    this.hideLoadingSplash = function()
    {
        if ( this.loadingSplash )
        {
            this.loadingSplash.dispose();
            this.loadingSplash = null;
        }
    }

    this.showPopupMasking = function()
    {   
        if ( this.popupMask == null )
        {
            this.popupMask = GUI.CreateImage( "popupMasking", px(0), px(-20), px(720), px(1280), ROOMSTOREUI_PATH+"room_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        }

        this.addControl( this.popupMask, GUI.LAYER.BACKGROUND );
    }

    this.hidePopupMasking = function()
    {
        this.removeControl( this.popupMask );
    }

    self.init();
};


/**
 * @description 해상도가 일정 수준 이상일때 UI 크기를 가변적으로 늘려준다. 
 * 픽셀이 아닌 화면비(0.0~1.0)로 설정된 값에는 영향을 주지 않지만 in_ignoreRatio 인자를 이용하여 컨버팅 가능하게 할 수 있다.
 * @param {*} in_value 컨버팅할 값
 * @param {*} in_ignoreNotPixel 픽셀값이 아닐 떄 무시할 여부 default 는 true이다
 */
GUI.ignoreResolutionCorrectionFlag = false;
GUI.getResolutionCorrection = function( in_value, in_ignoreNotPixel )
{
    return in_value;

    if ( GUI.ignoreResolutionCorrectionFlag )
        return in_value;

    var isPx = (-1 != in_value.toString().indexOf("px"));

    if ( in_ignoreNotPixel == undefined )
        in_ignoreNotPixel = true;

    if ( !isPx && in_ignoreNotPixel )
        return in_value;

    var value = parseInt( in_value.toString().replace("px", "") );

    var width = window.innerWidth;
    var height = window.innerHeight;

    value = value * GUI.getResolutionCorrectionRatio( width, height );

    if ( isPx )
        value = px(value);

    return value;
}

GUI.getResolutionCorrectionRatio = function( in_width, in_height )
{
    return 1.0;

    var ResolutionCorrection = [
        { "name" : "2UD"        , "resolution" : {"width":600, "height":300},  "correction" : 0.7},
        { "name" : "UD"         , "resolution" : {"width":800, "height":480},  "correction" : 0.75},
        { "name" : "D"          , "resolution" : {"width":960, "height":600},  "correction" : 0.8},
        { "name" : "HD"         , "resolution" : {"width":1024, "height":720},  "correction" : 0.85},
        { "name" : "HD2"        , "resolution" : {"width":1200, "height":860},  "correction" : 0.9},
        { "name" : "HD3"        , "resolution" : {"width":1280, "height":960},  "correction" : 1.0},
        { "name" : "FHD"        , "resolution" : {"width":1920, "height":1080}, "correction" : 1.5},
        { "name" : "QHD"        , "resolution" : {"width":2560, "height":1440}, "correction" : 2.0},
        { "name" : "UHD"        , "resolution" : {"width":3840, "height":2160}, "correction" : 2.5},
        { "name" : "Over"       , "resolution" : {"width":99999, "height":99999}, "correction" : 2.5}
    ];

    for ( var i = 0; i < ResolutionCorrection.length; ++i )
    {
        if (/* in_width < ResolutionCorrection[i].resolution.width || */in_height < ResolutionCorrection[i].resolution.height )
        {
            return ResolutionCorrection[i].correction;
        }
    }

    return 1.0;
}

GUI.procResize = function( in_ui, in_curRatio )
{
    return in_curRatio;

    var curRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );
    if ( in_curRatio == curRatio )
        return in_curRatio;
    
    var getOriginalGeometry = function( in_curVal, in_curRatio )
    {
        var isPx = (-1 != in_curVal.toString().indexOf("px"));

        if ( !isPx )
            return in_curVal;

        var number = parseInt( in_curVal );
        var result = px( number/in_curRatio );
        return result;
    }

    if ( BABYLON.GUI.Button.prototype.isPrototypeOf( in_ui )        ||
         BABYLON.GUI.Container.prototype.isPrototypeOf( in_ui )     ||
         BABYLON.GUI.Image.prototype.isPrototypeOf( in_ui )         ||
         BABYLON.GUI.Ellipse.prototype.isPrototypeOf( in_ui )       ||
         BABYLON.GUI.StackPanel.prototype.isPrototypeOf( in_ui ) )
    {
        var originalGeometry = 
        {
            x       : getOriginalGeometry( in_ui.left, in_curRatio ),
            y       : getOriginalGeometry( in_ui.top, in_curRatio ),
            width   : getOriginalGeometry( in_ui.width, in_curRatio ),
            height  : getOriginalGeometry( in_ui.height, in_curRatio )
        }

        in_ui.left   = GUI.getResolutionCorrection( originalGeometry.x );
        in_ui.top    = GUI.getResolutionCorrection( originalGeometry.y );
        in_ui.width  = GUI.getResolutionCorrection( originalGeometry.width );
        in_ui.height = GUI.getResolutionCorrection( originalGeometry.height ); 
    }
    else if ( BABYLON.GUI.TextBlock.prototype.isPrototypeOf( in_ui ) ||
              BABYLON.GUI.InputText.prototype.isPrototypeOf( in_ui ) )
    {
        var originalGeometry = 
        {
            x       : getOriginalGeometry( in_ui.left, in_curRatio ),
            y       : getOriginalGeometry( in_ui.top, in_curRatio ),
            width   : getOriginalGeometry( in_ui.width, in_curRatio ),
            height  : getOriginalGeometry( in_ui.height, in_curRatio ),
            fontSize   : getOriginalGeometry( in_ui.fontSize, in_curRatio ),
        }


        in_ui.left   = GUI.getResolutionCorrection( originalGeometry.x );
        in_ui.top    = GUI.getResolutionCorrection( originalGeometry.y );
        in_ui.top    = GUI.getResolutionCorrection( originalGeometry.y );
        in_ui.width  = GUI.getResolutionCorrection( originalGeometry.width );
        in_ui.fontSize    = GUI.getResolutionCorrection( parseInt( originalGeometry.fontSize ), false );
    }

    return curRatio;
}

/**
 * @description 기본적으로 UI 에는 getResolutionCorrection 의 영향을 받습니다. 
 * 하지만 특정 ui 는 이 기능을 적용받으면 안 되는데, 이때 사용합니다. 
 * 이 함수 부터 ignoreResolutionCorrectionEnd 가 호출되기 전 까지의 코드 블록에서 호출한 UI 는 getResolutionCorrection 기능을 적용받지 않습니다.
 * 
 * 사용 예시
 * GUI.ignoreResolutionCorrectionStart();
 * {
 *      GUI.CreateImage(....);
 *      GUI.CreateButton(.....);
 *      GUI.CreateText(....);
 * }
 * GUI.ignoreResolutionCorrectionEnd();
 */
GUI.ignoreResolutionCorrectionStart = function()
{
    GUI.ignoreResolutionCorrectionFlag = true;
}

/**
 * @description ignoreResolutionCorrectionStart() 와 동일한 기능을 수행합니다.
 */
GUI.ignoreResolutionCorrectionEnd = function()
{
    GUI.ignoreResolutionCorrectionFlag = false;
}


//패널(AdvancedDynamicTexture) 전체의 콘트롤이 보이거나 보이지 않게
GUI.isVisible = function(panel, bVisible) {
    panel._rootContainer.isVisible = bVisible;
}

//패널(AdvancedDynamicTexture) 전체의 콘트롤의 터치가 동작하거나 못하게
GUI.isHit = function(panel, bHit) {
    panel._rootContainer.isHitTestVisible = bHit;
}

//패널(AdvancedDynamicTexture)속 특정 컨트롤의 터치가 동작하거나 못하게 - 동작하지 않음..
GUI.isHitControl = function(panel, ctr_name, bHit) {
    var len = panel._rootContainer.children.length;

    for(var i=0; i<len; i++) {
        if(panel._rootContainer.children[i].name === ctr_name) {
            panel._rootContainer.children[i].isHitTestVisible = bHit;
        }
    }
}


GUI.createPanel = function(name, in_isForeGround) {
    return BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(name, in_isForeGround);
}

GUI.createPanelMesh = function(mesh) {
    return BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(mesh);
}

GUI.createContainer = function() {

    // var wrapper = new BABYLON.GUI.Rectangle();
    // wrapper.thickness = 2;
    // wrapper.color = "Red";

    // return wrapper;
    
    var container = new BABYLON.GUI.Container();

    // var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    // container.onAfterDrawObservable.add( function()
    // {
    //     lastSizeRatio = GUI.procResize( container, lastSizeRatio );
    // });

    var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    
        GUI.addWatingSizeableFunc(function()
        {
            lastSizeRatio = GUI.procResize( container, lastSizeRatio );
        });
    

    return container;
}

//이 함수 호출 후 컨테이너에 널을 넣어줘야 한다.
GUI.removeContainer = function(container) {
    if(G.guiMain == null) return;
    if(container == null) return;

    G.guiMain.removeControl(container);
    container.dispose();
    container = null; //이 값이 안들어간다..
}

GUI.createInputText = function( name, in_x, in_y, in_width, in_height, in_text, in_color, in_fonstSize, in_alignW, in_alignH )
{
    var inputText = new BABYLON.GUI.InputText();
    inputText.left = GUI.getResolutionCorrection( in_x );
    inputText.top = GUI.getResolutionCorrection( in_y );
    inputText.width = GUI.getResolutionCorrection( in_width );
    inputText.height = GUI.getResolutionCorrection( in_height );
    inputText.text = in_text;
    inputText.color = in_color;
    inputText.fontSize = GUI.getResolutionCorrection( in_fonstSize, false );
    inputText.thickness = 0;
    inputText.background = 0;
    inputText.focusedBackground = 0;
    inputText.horizontalAlignment = in_alignW;
    inputText.verticalAlignment = in_alignH;

    // var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    // inputText.onAfterDrawObservable.add( function()
    // {
    //     lastSizeRatio = GUI.procResize( inputText, lastSizeRatio );
    // });

    var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    
        GUI.addWatingSizeableFunc(function()
        {
            lastSizeRatio = GUI.procResize( inputText, lastSizeRatio );
        });
    

    return inputText;
}

GUI.createButtonTxt = function(name, btn_txt, x, y, w, h, align_w, align_h) {

    var button = BABYLON.GUI.Button.CreateSimpleButton(name, btn_txt);

    button.left   = GUI.getResolutionCorrection( x );
    button.top    = GUI.getResolutionCorrection( y );
    button.width  = GUI.getResolutionCorrection( w );
    button.height = GUI.getResolutionCorrection( h );
    button.color = "white";
    button.cornerRadius = 20;
    button.background = "green";

    if(align_w == undefined) align_w = GUI.ALIGN_CENTER;
    if(align_h == undefined) align_h = GUI.ALIGN_MIDDLE;

    button.horizontalAlignment = align_w;
    button.verticalAlignment = align_h;

    return button;
}

GUI.CreateButton = function(name, x, y, w, h, url, align_w, align_h) {
    
    var button = BABYLON.GUI.Button.CreateImageOnlyButton(name, url);
    
    button.left   = GUI.getResolutionCorrection( x );
    button.top    = GUI.getResolutionCorrection( y );
    button.width  = GUI.getResolutionCorrection( w );
    button.height = GUI.getResolutionCorrection( h );
    button.thickness = 0;
    // button.color = "white";
    // button.background = "green";
    button.horizontalAlignment = align_w;
    button.verticalAlignment = align_h;

    button.onPointerUpObservable.add( function () 
    {
        if ( G.guiMain )
            G.guiMain.initIdleTimeOut();
            
        // G.scriptManager.onReceiveTrigger_Button( name );
    });

    button.onPointerUpObservable.add( function(){
        G.soundManager.playEffectSound( "EFFECT_ButtonClick.ogg" );
    });

    // var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    // button.onAfterDrawObservable.add( function()
    // {
    //     lastSizeRatio = GUI.procResize( button, lastSizeRatio );
    // });

    var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    
        GUI.addWatingSizeableFunc(function()
        {
            lastSizeRatio = GUI.procResize( button, lastSizeRatio );
        });
    

    return button;
}

/**
 * @description 사각형 이미지를 원형 버튼으로 만듭니다
 * 외부 원형 더미를 하나 만들고 버튼을 넣기 때문에 만든거.getChildByName(name) 으로 가져와야 실제 내부 버튼을 가져올 수 있음. 
 * in_useOutLineEffect 가 true 일때는 getChildByName("inner").getChildByName(name)으로 가져와야 실제 버튼을 가져온다.
 * @param {String} name                 / 버튼 이름
 * @param {Number} x                    / x좌표
 * @param {Number} y                    / y좌표
 * @param {Number} w                    / 너비
 * @param {Number} h                    / 높이
 * @param {String} url                  / 이미지주소
 * @param {Align} align_w               / 가로정렬축
 * @param {Align} align_h               / 상하정렬축
 * @param {Boolean} in_useOutlineEffect / 아웃라인 사용여부. default : false
 * @param {String} in_outLineColor      / 아웃라인 색. default : green
 * @param {Boolean} in_useAlphaAni      / 알파애니메이션 사용여부 default : true
 */
GUI.CreateCircleButton = function(name, x, y, w, h, url, align_w, align_h, in_useOutlineEffect, in_outLineColor, in_useAlphaAni)
{
    var ellipseWrapper = new BABYLON.GUI.Ellipse();
    ellipseWrapper.left =   GUI.getResolutionCorrection( x );
    ellipseWrapper.top =    GUI.getResolutionCorrection( y );
    ellipseWrapper.width =  GUI.getResolutionCorrection( w );
    ellipseWrapper.height = GUI.getResolutionCorrection( h );
    ellipseWrapper.thickness = 0;
    // 기획서처럼 테두리를 초록색으로 하려했는데 테두리를 만들면 안쪽이 스케일애니메이션 먹었을때 사각형으로 보여서 냅둔다. 커서 올려도 초록색으로 이펙트 떠서 냅둠.
    //ellipseWrapper.background = "green"; 
    ellipseWrapper.horizontalAlignment = align_w;
    ellipseWrapper.verticalAlignment = align_h;
    ellipseWrapper.name = name;

    var innerButton = GUI.CreateButton( name, 0, 0, 1, 1, url, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
    //눌렀을때 이너버튼 테두리가 보이는 문제가 있다. 스케일좀 키워서 해결한다.
    innerButton.scaleX = 1.1;
    innerButton.scaleY = 1.1;

    if ( in_useOutlineEffect )
    {
        var aniEllipseWrapper = new BABYLON.GUI.Ellipse();
        ellipseWrapper.addControl(aniEllipseWrapper);

        if ( in_useAlphaAni )
            GUI.alphaAnimation( aniEllipseWrapper, true, 2.5 ); 

        var color = (undefined == in_outLineColor) ? "Green" : in_outLineColor;
        aniEllipseWrapper.background = color;

        var ellipseInnerWrapper = new BABYLON.GUI.Ellipse();
        ellipseInnerWrapper.left = px( parseInt(w)*0.015 );
        ellipseInnerWrapper.top = px( parseInt(h)*0.015 );
        ellipseInnerWrapper.width = 0.9;
        ellipseInnerWrapper.height = 0.9;
        ellipseInnerWrapper.name = "inner";

        ellipseWrapper.addControl( ellipseInnerWrapper );
        ellipseInnerWrapper.addControl( innerButton );

        ellipseWrapper.scaleX = 1.1;
        ellipseWrapper.scaleY = 1.1;
    }
    else
        ellipseWrapper.addControl( innerButton );

    innerButton.onPointerUpObservable.add( function(){
        G.soundManager.playEffectSound( "EFFECT_ButtonClick.ogg" );
    });

    // var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    // ellipseWrapper.onAfterDrawObservable.add( function()
    // {
    //     lastSizeRatio = GUI.procResize( ellipseWrapper, lastSizeRatio );
    // });

    var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    
        GUI.addWatingSizeableFunc(function()
        {
            lastSizeRatio = GUI.procResize( ellipseWrapper, lastSizeRatio );
        });
    

    return ellipseWrapper;
}

GUI.CreateImage = function(name, x, y, w, h, url, align_w, align_h) {
    
    var image = new BABYLON.GUI.Image(name, url);
    
    image.left      = GUI.getResolutionCorrection( x );
    image.top       = GUI.getResolutionCorrection( y );
    image.width     = GUI.getResolutionCorrection( w );
    image.height    = GUI.getResolutionCorrection( h );
    image.horizontalAlignment = align_w;
    image.verticalAlignment = align_h;

    // var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    // image.onAfterDrawObservable.add( function()
    // {
    //     lastSizeRatio = GUI.procResize( image, lastSizeRatio );
    // });

    var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    
        GUI.addWatingSizeableFunc(function()
        {
            lastSizeRatio = GUI.procResize( image, lastSizeRatio );
        });
    

    return image;
}


//GUI.CreateRectangle("0px","0px","40px", "40px", "Orange", "green", 4, 20);
GUI.CreateRectangle = function(x, y, w, h, foreColor, backColor, thickness, cornerRadius, align_w, align_h) {
    
    var rect = new BABYLON.GUI.Rectangle();
    
    rect.left =     GUI.getResolutionCorrection( x );
    rect.top =      GUI.getResolutionCorrection( y );
    rect.width =    GUI.getResolutionCorrection( w );
    rect.height =   GUI.getResolutionCorrection( h );
    rect.cornerRadius = cornerRadius;
    rect.color = foreColor;
    rect.thickness = 4;
    rect.background = backColor;  //"#000000"
    rect.horizontalAlignment = align_w;
    rect.verticalAlignment = align_h;
    

    // var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    // rect.onAfterDrawObservable.add( function()
    // {
    //     lastSizeRatio = GUI.procResize( rect, lastSizeRatio );
    // });

    var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    
        GUI.addWatingSizeableFunc(function()
        {
            lastSizeRatio = GUI.procResize( rect, lastSizeRatio );
        });
    

    return rect;
}

GUI.CreateClipArea = function( in_x, in_y, in_width, in_height, in_alignW, in_alignH )
{
    var rect = new BABYLON.GUI.Rectangle();

    rect.left =     GUI.getResolutionCorrection( in_x );
    rect.top =      GUI.getResolutionCorrection( in_y );
    rect.width =    GUI.getResolutionCorrection( in_width );
    rect.height =   GUI.getResolutionCorrection( in_height );
    rect.cornerRadius = 0;
    rect.thickness = 0;
    rect.horizontalAlignment = in_alignW;
    rect.verticalAlignment = in_alignH;

    // var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    // rect.onAfterDrawObservable.add( function()
    // {
    //     lastSizeRatio = GUI.procResize( rect, lastSizeRatio );
    // });

    var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    
        GUI.addWatingSizeableFunc(function()
        {
            lastSizeRatio = GUI.procResize( rect, lastSizeRatio );
        });
    

    return rect;
};


GUI.CreateEllipse = function(name, x, y, w, h, foreColor, backColor, thickness, align_w, align_h) {
    var ellipse = new BABYLON.GUI.Ellipse();

    ellipse.name = name;
    ellipse.left =      GUI.getResolutionCorrection( x ); 
    ellipse.top =       GUI.getResolutionCorrection( y ); 
    ellipse.width =     GUI.getResolutionCorrection( w ); 
    ellipse.height =    GUI.getResolutionCorrection( h ); 
    ellipse.color = foreColor;
    ellipse.thickness = thickness;
    ellipse.background = backColor;
    // ellipse.paddingTop = "20px";
    // ellipse.paddingBottom = "20px";
    ellipse.horizontalAlignment = align_w;
    ellipse.verticalAlignment = align_h;

    // var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    // ellipse.onAfterDrawObservable.add( function()
    // {
    //     lastSizeRatio = GUI.procResize( ellipse, lastSizeRatio );
    // });

    var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    
        GUI.addWatingSizeableFunc(function()
        {
            lastSizeRatio = GUI.procResize( ellipse, lastSizeRatio );
        });
    

    return ellipse; 
}



GUI.CreateLine = function(name, x1, y1, x2, y2, thickness, foreColor) {
    
    var line = new BABYLON.GUI.Line();
    line.name = name;
    line.x1 = x1;
    line.y1 = y1;
    line.x2 = x2;
    line.y2 = y2;
    line.lineWidth = thickness;
    line.color = foreColor;

    return line;
}


GUI.CreateLineDash = function(x1, y1, x2, y2, thickness, foreColor, dash1, dash2) {

    var line = new BABYLON.GUI.Line();
    line.x1 = x1;
    line.y1 = y1;
    line.x2 = x2;
    line.y2 = y2;
    line.lineWidth = thickness;
    line.dash = [dash1, dash2];
    line.color = foreColor;

    return line;    
}

//시작 연결
//line.linkWithMesh(sphere);

//끝연결 
//line.connectedControl = rect1;  


//GUI.CreateText("0px", "0px", "hello", "black");
GUI.CreateText = function(x, y, text, foreColor, fontsize, align_w, align_h) {
    
    if(text == null) return null;

    var label = new BABYLON.GUI.TextBlock();
    
    label.left =    GUI.getResolutionCorrection( x );
    label.top =     GUI.getResolutionCorrection( y );
    label.text = text;
    label.color = foreColor;
    // label.height = "20px";
    label.fontSize = GUI.getResolutionCorrection( fontsize, false );
    label.textHorizontalAlignment = align_w;
    label.textVerticalAlignment = align_h;
    label.fontStyle = "bold";

    // var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    // label.onAfterDrawObservable.add( function()
    // {
    //     lastSizeRatio = GUI.procResize( label, lastSizeRatio );
    // });

    var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    
        GUI.addWatingSizeableFunc(function()
        {
            lastSizeRatio = GUI.procResize( label, lastSizeRatio );
        });
    

    return label;
}

GUI.CreateMultiLineText = function( in_x, in_y, in_text, in_fontColor, in_fontSize, in_alignW, in_alignH )
{
    var wrapper = this.CreateClipArea( in_x, in_y, 1, 1, in_alignW, in_alignH );
    var splitStr = in_text.split("\n");
    for ( var i = 0; i < splitStr.length; ++i )
    {
        var text = GUI.CreateText( 0, px(parseInt(in_fontSize)*i + 3), splitStr[i], in_fontColor, in_fontSize, in_alignW, GUI.ALIGN_TOP );
        wrapper.addControl( text );
    }

    return wrapper;
};

/**
 * @description 지정된 영역에 맞춰 자동으로 개행되는 텍스트 UI 입니다.
 * @param {Number} in_x 
 * @param {Number} in_y 
 * @param {Number} in_width 
 * @param {Number} in_height 
 * @param {String} in_string 
 * @param {String} in_color 
 * @param {Number} in_fontSize 
 * @param {Align} align_w 
 * @param {Align} align_h 
 */
GUI.CreateAutoLineFeedText = function( in_x, in_y, in_width, in_height, in_string, in_color, in_fontSize, align_w, align_h)
{
    var TextBox = GUI.CreateText( in_x, in_y, in_string, in_color, in_fontSize, align_w, align_h );
    TextBox.width =     GUI.getResolutionCorrection( in_width );
    TextBox.height =    GUI.getResolutionCorrection( in_height );
    TextBox.textWrapping = true;
    
    return TextBox;
}

//
// scrollView : provide stackpanel consist of child stackpanel. child stackpanel move to [in_isVertical] direction into parent stackpanel space. 
//
GUI.createScrollView = function CreateScrollView( in_parent, in_name, in_x, in_y, in_width, in_height, in_distanceRatio, in_isVertical, in_alignW, in_alignH )
{
    var self = this;

    this.name = in_name;
    this.isOriginalVertical = in_isVertical;

    this.mainPanel = new BABYLON.GUI.StackPanel();
    this.mainPanel.left = GUI.getResolutionCorrection( in_x );
    this.mainPanel.top = GUI.getResolutionCorrection( in_y );
    this.mainPanel.width = GUI.getResolutionCorrection( in_width );
    this.mainPanel.height = GUI.getResolutionCorrection( in_height );
    this.mainPanel.isVertical = !in_isVertical;
    
    this.mainPanel.horizontalAlignment = in_alignW;
    this.mainPanel.verticalAlignment = in_alignH;

    var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    
        GUI.addWatingSizeableFunc(function()
        {
            lastSizeRatio = GUI.procResize( self.mainPanel, lastSizeRatio );
        });
    

    this.parent = in_parent;
    in_parent.addControl( this.mainPanel );

    this.itemList = [];

    this.subPanel = [];
    this.totalItemCount = 0;
    this.maxSubPanelCount = 0;

    this.scrollStartPos = 0;
    this.scrollMaxOffset = 0;
    this.scrollCurrentOffset = 0;

    this.distanceRatio = in_distanceRatio;

    this.scrollTouchPosStart = undefined;
    this.scrollTouchPosBeforeLast = [0,0];
    this.isScrollTouching = false;
    this.isScrollFling = false;
    this.flingVelocity = 0;

    this.blockTouchForScrolling = false;
    this.startCoord = 0;
    
    G.eventManager.setEnableTouched("scrollView:"+in_parent.name+":"+in_name, this, true);
    this.wheelOffset = 0;
    this.useWheelMove = true;

    this.resizeIdealWidthRatio = 1;

    this.init = function()
    {
        for ( var i = 0; i < this.subPanel.length; ++i )
        {
            this.mainPanel.removeControl(this.subPanel[i]);
        }

        this.itemList = [];

        this.subPanel = [];
        this.totalItemCount = 0;
        this.maxSubPanelCount = 0;
    
        this.scrollStartPos = 0;
        this.scrollMaxOffset = 0;
        this.scrollCurrentOffset = 0;
    
        this.distanceRatio = in_distanceRatio;
    
        this.scrollTouchPosStart = undefined;
        this.scrollTouchPosBeforeLast = [0,0];
        this.isScrollTouching = false;
        this.isScrollFling = false;
        this.flingVelocity = 0;
    
        this.blockTouchForScrolling = false;

        this.wheelOffset = 0;
    };


    this.setUseMouseWhell = function( in_useMouseWheel )
    {
        this.useWheelMove = in_useMouseWheel;
    }

    this.onPointerWheel = function( in_event )
    {
        if ( !this.useWheelMove )
            return;

        if( !this.mainPanel.isVisible )
            return;

        this.wheelOffset += in_event.wheelDelta;
        //this.moveFocus( Math.max( 0, Math.min( this.scrollMaxOffset, this.scrollCurrentOffset-in_event.wheelDelta ) ) );
    }

    this.createSubPanel = function( in_alignW, in_alignH )
    {
        var stackPanel = new BABYLON.GUI.StackPanel();
        this.subPanel.push( stackPanel );
        stackPanel.isVertical = this.isOriginalVertical;
        stackPanel.horizontalAlignment = in_alignW;
        stackPanel.verticalAlignment = in_alignH;

        this.mainPanel.addControl( stackPanel );

        this.addScrollTouchModule( stackPanel );

        // var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );
        // stackPanel.onAfterDrawObservable.add( function()
        // {
        //     lastSizeRatio = GUI.procResize( stackPanel, lastSizeRatio );
        // });

        var lastSizeRatio = GUI.getResolutionCorrectionRatio( window.innerWidth, window.innerHeight );    
    
        GUI.addWatingSizeableFunc(function()
        {
            lastSizeRatio = GUI.procResize( stackPanel, lastSizeRatio );
        });
    
    };

    //
    // item resize for item distance
    //
    this.resizeItem = function( in_item )
    {
        var originSize = [parseInt(in_item.width), parseInt(in_item.height)];
        in_item.width = parseInt(in_item.width) * this.distanceRatio + "px";
        in_item.height = parseInt(in_item.height) * this.distanceRatio + "px";
        in_item.scaleX = originSize[0]/parseInt(in_item.width);
        in_item.scaleY = originSize[1]/parseInt(in_item.height);
    };

    //
    // fling
    //

    // init fling
    this.initFling = function ()
    {
        this.isScrollFling = false;
        this.flingVelocity = 0;
    };

    // revise currentOffset bitween min and max offset.
    this.reviseScrollOffset = function()
    {
        this.scrollCurrentOffset = Math.min( this.scrollMaxOffset, Math.max( 0, this.scrollCurrentOffset ) );
    };

    // scroll fling proc
    this.procScrollFling = function()
    {
        if ( !this.isScrollFling )
            return;

        if ( 0 < this.flingVelocity )
            this.flingVelocity-=0.5;
        else
            this.flingVelocity+=0.5;

        this.scrollCurrentOffset += this.flingVelocity;
        this.reviseScrollOffset();
        
        if ( 0 == Math.floor( this.flingVelocity ) )
        {
            this.flingVelocity = 0;
            this.isScrollFling = false;
        }
    };

    this.moveFocusToStart = function( in_onEndFunc )
    {
        this.moveFocus( 0, in_onEndFunc );
    }

    this.moveFocusToEnd = function( in_onEndFunc )
    {
        var self = this;
        setTimeout( function(){ self.moveFocus( self.scrollMaxOffset, in_onEndFunc ); }, 100 );
    }

    this.moveFocus = function( in_targetOffset, in_onEndFunc )
    {
        var frameRate = 120;
        var focusAnimation = new BABYLON.Animation( "focusAnimation", "scrollCurrentOffset", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var focusAnimationKey = [];
        focusAnimationKey.push( { frame:0, value:this.scrollCurrentOffset } );
        focusAnimationKey.push( { frame:frameRate, value:in_targetOffset } );
        focusAnimation.setKeys( focusAnimationKey );

        CommFunc.useEasingFuncToAnimation( focusAnimation );

        G.scene.beginDirectAnimation( this, [focusAnimation], 0, frameRate, false, 1.0 );
    }

    //
    // vertical
    //

    // calculate max horizontal item count from first item's width. - vertical
    this.subPanelInit_vertical = function( in_item )
    {
        var ratio = (window.innerWidth / G.guiMain.idealWidth);

        this.maxSubPanelCount = Math.floor( Math.max( 1, parseInt(in_width)*ratio / (parseInt(in_item.width)*ratio) ) );

        // if ( parseInt(this.mainPanel.width) < parseInt(in_item.width) )
        //     Debug.Error( "생성한 스크롤뷰 영역보다 큰 아이템이 들어왔습니다. 원래라면 에러겠지만 고쳐놨습니다 ㅏㅎ핫" );

        for ( var i = 0; i < this.maxSubPanelCount; ++i )
        {
            this.createSubPanel( GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        }
    };

    // add item to subPanel each correct index. stacked from left to right and down side in this case - vertical
    this.addItemToSubPanel_vertical = function( in_item )
    {
        this.resizeItem( in_item );

        var subPanelIndex = this.totalItemCount%this.maxSubPanelCount;

        var totalHeight = 0;
        for ( var i = 0; i < this.itemList.length; ++i )
        {
            if ( (i % this.maxSubPanelCount) != subPanelIndex )
                continue;

            totalHeight += parseInt( this.itemList[i].height );
        }

        if(this.subPanel[ subPanelIndex ]) {
            this.subPanel[ subPanelIndex ].addControl( in_item );

            //this.subPanel[ subPanelIndex ].height = (Math.floor( this.totalItemCount/this.maxSubPanelCount )+1) * parseInt( in_item.height ) + "px"; // 가변아이템 들어올때 패널 높이맞추기
            this.subPanel[ subPanelIndex ].height = px( totalHeight );
    
            this.subPanel[ subPanelIndex ].width = in_item.width;
        } else {
            this.subPanel[ subPanelIndex ] = this.subPanel[ subPanelIndex ];
        }
    };

    // adjust sub panel position when completed add item. regulate to math each sub panel's center of height - vertical
    this.adjustPosition_vertical = function()
    {
        for ( var i = 0; i < this.maxSubPanelCount; ++i )
        {    
            this.subPanel[i].height = this.subPanel[0].height;            
            this.subPanel[i].width = this.subPanel[0].width;
            this.subPanel[i].top = 0; // parseInt(this.subPanel[i].height)/2 - parseInt(this.mainPanel.height)/2 + "px";
        }

        this.scrollStartPos = 0;// parseInt( this.subPanel[0].top );
        this.scrollMaxOffset = Math.max( parseInt( this.subPanel[0].height ) - parseInt( this.mainPanel.height ), 0 );
    };

    // calculate position from touch and flip. call from procLoop when each game loop - vertical
    this.procOffsetPosition_vertical = function()
    {
        for ( var i = 0; i < this.maxSubPanelCount; ++i )
        {
            this.subPanel[i].top = this.scrollStartPos - (this.scrollCurrentOffset/this.resizeIdealWidthRatio) + "px";
        }
    };

    // event for touch scroll start. - vertical
    this.startTouchScroll_vertical = function ( in_coordination )
    {
        self.initFling();
        self.isScrollTouching = true;
        self.scrollTouchPosStart = in_coordination.y + self.scrollCurrentOffset;
        self.scrollTouchPosBeforeLast = [in_coordination.y, in_coordination.y];
        self.startCoord = in_coordination.y;
    };

    // event for touching scroll move. - vertical
    this.moveTouchScroll_vertical = function ( in_coordination )
    {
        if ( !self.isScrollTouching )
            return;
        
        self.scrollCurrentOffset = (self.scrollTouchPosStart - in_coordination.y);

        if ( Math.abs( self.startCoord - in_coordination.y ) > 20 )
            self.blockTouchForScrolling = true;

        self.reviseScrollOffset();

        if ( in_coordination.y != self.scrollTouchPosBeforeLast[1] )
        {
            self.scrollTouchPosBeforeLast[0] = self.scrollTouchPosBeforeLast[1];
            self.scrollTouchPosBeforeLast[1] = in_coordination.y;
        }
    };

    // event for release touch scroll end. - vertical
    this.releaseTouchScroll_vertical = function ( in_coordination )
    {
        self.isScrollTouching = false;

        if ( 1 < Math.abs( self.scrollTouchPosBeforeLast[0] - in_coordination.y ) )
        {
            self.isScrollFling = true;
            self.flingVelocity = self.scrollTouchPosBeforeLast[0] - in_coordination.y;
        }
    };    

    //
    // horizontal
    //
    // calculate max vertical item count from first item's height. - horizontal
    this.subPanelInit_horizontal = function( in_item )
    {
        var ratio = (window.innerWidth / G.guiMain.idealWidth);

        this.maxSubPanelCount = Math.floor( Math.max( 1, parseInt(in_height)*ratio / (parseInt(in_item.height)*ratio) ) );
        
        // if ( parseInt(this.mainPanel.height) < parseInt(in_item.height) )
        //     Debug.Error( "생성한 스크롤뷰 영역보다 큰 아이템이 들어왔습니다. 원래라면 에러겠지만 고쳐놨습니다 ㅏㅎ핫" );

        for ( var i = 0; i < this.maxSubPanelCount; ++i )
        {
            this.createSubPanel( GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        }
    };

    // add item to subPanel each correct index. stacked from top to bottom and right side in this case - horizontal
    this.addItemToSubPanel_horizontal = function( in_item )
    {
        this.resizeItem( in_item );

        var subPanelIndex = this.totalItemCount%this.maxSubPanelCount;

        var totalWidth = 0;
        for ( var i = 0; i < this.itemList.length; ++i )
        {
            if ( (i % this.maxSubPanelCount) != subPanelIndex )
                continue;

            totalWidth += parseInt( this.itemList[i].width );
        }

        if(this.subPanel[ subPanelIndex ]) {
            this.subPanel[ subPanelIndex ].addControl( in_item );

            //this.subPanel[ subPanelIndex ].width = (Math.floor( this.totalItemCount/this.maxSubPanelCount )+1) * parseInt( in_item.width ) + "px"; // 가변아이템 들어올때 패널 높이맞추기
            this.subPanel[ subPanelIndex ].width = px( totalWidth );    
            this.subPanel[ subPanelIndex ].height = in_item.height;
        } else {
            this.subPanel[ subPanelIndex ] = this.subPanel[ subPanelIndex ];
        }

        return;


        this.resizeItem( in_item );

        this.subPanel[ this.totalItemCount%this.maxSubPanelCount ].addControl( in_item );
        this.subPanel[ this.totalItemCount%this.maxSubPanelCount ].width = (Math.floor( this.totalItemCount/this.maxSubPanelCount )+1) * parseInt( in_item.width ) + "px";

        this.subPanel[ this.totalItemCount%this.maxSubPanelCount ].height = in_item.height;
    };

    // adjust sub panel position when completed add item. regulate to math each sub panel's center of width - horizontal
    this.adjustPosition_horizontal = function()
    {
        for ( var i = 0; i < this.maxSubPanelCount; ++i )
        {
            this.subPanel[i].height = this.subPanel[0].height;
            this.subPanel[i].width = this.subPanel[0].width;
            this.subPanel[i].left = 0; // parseInt(this.subPanel[i].width)/2 - parseInt(this.mainPanel.width)/2 + "px";
        }

        this.scrollStartPos = 0; // parseInt( this.subPanel[0].left );
        this.scrollMaxOffset = Math.max( parseInt( this.subPanel[0].width ) - parseInt( this.mainPanel.width ), 0 );
    };

    // calculate position from touch and flip. call from procLoop when each game loop - horizontal
    this.procOffsetPosition_horizontal = function()
    {        
        //this.scrollCurrentOffset = Math.min( this.scrollCurrentOffset + 1, this.scrollMaxOffset ) ;
        for ( var i = 0; i < this.maxSubPanelCount; ++i )
        {
            this.subPanel[i].left = this.scrollStartPos - (this.scrollCurrentOffset/this.resizeIdealWidthRatio) + "px";
        }
    };

    // event for touch scroll start. - horizontal
    this.startTouchScroll_horizontal = function ( in_coordination )
    {
        self.initFling();
        self.isScrollTouching = true;
        self.scrollTouchPosStart = in_coordination.x + self.scrollCurrentOffset;
        self.scrollTouchPosBeforeLast = [in_coordination.x, in_coordination.x];
        self.startCoord = in_coordination.x;
    };

    // event for touching scroll move. - horizontal
    this.moveTouchScroll_horizontal = function ( in_coordination )
    {
        if ( !self.isScrollTouching )
            return;
        
        self.scrollCurrentOffset = (self.scrollTouchPosStart - in_coordination.x);

        if ( Math.abs( self.startCoord - in_coordination.x ) > 20 )
            self.blockTouchForScrolling = true;

        self.reviseScrollOffset();

        if ( in_coordination.x != self.scrollTouchPosBeforeLast[1] )
        {
            self.scrollTouchPosBeforeLast[0] = self.scrollTouchPosBeforeLast[1];
            self.scrollTouchPosBeforeLast[1] = in_coordination.x;
        }
    };

    // event for release touch scroll end. - horizontal
    this.releaseTouchScroll_horizontal = function ( in_coordination )
    {
        self.isScrollTouching = false;

        if ( 1 < Math.abs( self.scrollTouchPosBeforeLast[0] - in_coordination.x ) )
        {
            self.isScrollFling = true;
            self.flingVelocity = self.scrollTouchPosBeforeLast[0] - in_coordination.x;
        }
    }; 
    
    //
    // scroll touch module
    //
    this.addScrollTouchModule = function( in_item )
    {
        if ( this.isOriginalVertical )
        {            
            in_item.onPointerMoveObservable.add( this.moveTouchScroll_vertical );
            in_item.onPointerDownObservable.add( this.startTouchScroll_vertical );
            in_item.onPointerUpObservable.add( this.releaseTouchScroll_vertical );
        }
        else
        {
            in_item.onPointerMoveObservable.add( this.moveTouchScroll_horizontal );
            in_item.onPointerDownObservable.add( this.startTouchScroll_horizontal );
            in_item.onPointerUpObservable.add( this.releaseTouchScroll_horizontal );
        }
    }

    this.addScrollTouchModule( this.mainPanel );

    //
    // add item
    // 
    this.addItem = function( in_item )
    {
        this.itemList.push( in_item );

        if ( this.isOriginalVertical )
        {
            if ( 0 == this.maxSubPanelCount )
                this.subPanelInit_vertical( in_item );

            this.addItemToSubPanel_vertical( in_item );
            this.adjustPosition_vertical();

            this.addScrollTouchModule( in_item );
        }
        else
        {
            if ( 0 == this.maxSubPanelCount )
                this.subPanelInit_horizontal( in_item );
                
            this.addItemToSubPanel_horizontal( in_item );
            this.adjustPosition_horizontal();
            
            this.addScrollTouchModule( in_item );
        }
        
        this.totalItemCount++;

        this.resizeIdealWidthRatio = -1;

        // // 아이템 하나 들어올떄마다 리사이즈 하나씩 불러보자
        // this.resizeIdealWidthRatio = -1;
        // this.resizeIdealWidthProc();
        // this.resizeIdealWidthRatio = -1;
    };

    //
    // clear item
    //
    this.clearItem = function()
    {
        this.init();
    };

    // mouse whell
    this.procMouseWheelOffset = function()
    {               
        this.scrollCurrentOffset -= this.wheelOffset / 10;

        if ( Math.abs( this.wheelOffset ) > 5 )
            this.wheelOffset += this.wheelOffset*-1 / 10;
        else
            this.wheelOffset = 0;

        this.scrollCurrentOffset = Math.max( 0, Math.min( this.scrollMaxOffset, this.scrollCurrentOffset) );
    }


    // call each gameloop for proc
    this.procLoop = function()
    {
        if ( 0 >= this.maxSubPanelCount )
            return;

        if ( this.isOriginalVertical )
            this.procOffsetPosition_vertical();
        else
            this.procOffsetPosition_horizontal();
            
        this.procScrollFling();

        this.procMouseWheelOffset();

        if ( !this.isScrollTouching ) 
            this.blockTouchForScrolling = false;

        this.procScrollBar();
        
        this.resizeIdealWidthProc();
    };

    //
    // Auto-Resize 기능이 Panel 기능에 안먹어서 수동으로 리사이징 해줘야 한다
    //
    this.resizeIdealWidthProc = function()
    {
        if ( G.guiMain.idealWidth == 0 )
            return;

        var ratio = (window.innerWidth / G.guiMain.idealWidth);

            
        this.mainPanel.width = px( parseInt( in_width ) * ratio );
        this.mainPanel.height = px( parseInt( in_height ) * ratio );

        if ( this.resizeIdealWidthRatio == ratio )
           return;

        var subPanelIndex = this.totalItemCount%this.maxSubPanelCount;
        var totalHeight = 0;
        var maxWidth = 0;
        for ( var i = 0; i < this.itemList.length; ++i )
        {
            if ( (i % this.maxSubPanelCount) != subPanelIndex )
                continue;

            if ( this.isOriginalVertical )
            {
                totalHeight += parseInt( this.itemList[i].height );
                maxWidth = Math.max( maxWidth, parseInt( this.itemList[i].width ) );
            }
            else
            {
                totalHeight = Math.max( totalHeight, parseInt( this.itemList[i].height ) );
                maxWidth += parseInt( this.itemList[i].width ); 
            }
        }

        for ( var i = 0; i < this.subPanel.length; ++i )
        {
            this.subPanel[i].width = px( parseInt( maxWidth )/* * ratio */);
            this.subPanel[i].height = px( parseInt( totalHeight )/* * ratio */);
        }

        if ( this.isOriginalVertical )
            this.adjustPosition_vertical();
        else
            this.adjustPosition_horizontal();

        this.resizeIdealWidthRatio = ratio;

        // 엔진에서 subpanel.top = curoffset 공식에서 대입 후 ResizeRatio를 먹이는바람에 화면비율대로 maxoffset에 도달하지 못하는 경우가 있는데 이걸 해결했다 난 천잰가봐 
    }

    //
    // scroll bar
    //
    this.linkedScrollBar = null;

    this.linkScrollBar = function( in_scrollBar )
    {
        this.unlinkScrollBar();

        this.linkedScrollBar = in_scrollBar;
        this.parent.addControl( this.linkedScrollBar.wrapper );
    };

    this.unlinkScrollBar = function()
    {
        if ( null == this.linkedScrollBar )
            return;
        
        this.parent.removeControl( this.linkedScrollBar.wrapper );
        this.linkedScrollBar = null;
    };

    this.procScrollBar = function()
    {
        if ( null == this.linkedScrollBar )
            return;

        this.linkedScrollBar.proc();
    };
}

//
// scrollbar : provide button move above bar bg. work with [in_targetScrollView].mainPanel. 
//
GUI.createScrollBar = function CreateScrollView( in_targetScrollView, in_name, in_buttonImgUrl, in_bgImgUrl, in_x, in_y, in_width, in_height, in_buttonWidth, in_buttonHeight, in_alignW, in_alignH )
{
    this.targetScrollView = in_targetScrollView;
    this.wrapper = GUI.CreateButton( in_name + "_wrapper", in_x , in_y, 
        Math.max( parseInt( in_width ), parseInt(in_buttonWidth) ) + 1 + "px", Math.max( parseInt(in_height), parseInt(in_buttonHeight) ) + 1 + "px", 
        GUI.DEFAULT_IMAGE_PATH_NEW+"empty.png", in_alignW, in_alignH );
    this.bgImage = GUI.CreateButton( in_name + "_bg", 0, 0, in_width, in_height, in_bgImgUrl, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
    this.button = GUI.CreateButton( in_name + "_btn", 0, 0, in_buttonWidth, in_buttonHeight, in_buttonImgUrl, GUI.ALIGN_LEFT, GUI.ALIGN_TOP );

    this.wrapper.addControl( this.bgImage );
    this.wrapper.addControl( this.button );

    this.originalPos = [GUI.getResolutionCorrection( in_x ), GUI.getResolutionCorrection( in_y )];
    
    this.proc = function ()
    {
        if ( this.targetScrollView.scrollMaxOffset < 10 )
        {
            this.button.isVisible = false;
            return;
        }
        else
        {
            this.button.isVisible = true;
        }

        var posRatio = this.targetScrollView.scrollCurrentOffset/this.targetScrollView.scrollMaxOffset;

        //this.wrapper.left = this.originalPos[0];
        //this.wrapper.top = this.originalPos[1];

        if ( this.targetScrollView.isOriginalVertical )
            this.button.top = (parseInt( in_height ) - parseInt( in_buttonHeight )) * posRatio + "px";
        else
            this.button.left = (parseInt( in_width ) - parseInt( in_buttonWidth )) * posRatio + "px";
    }
};

/**
 * 기본 재화 이미지를 가져옵니다.
 * @param {Number} in_goodType  /상품id
 * @param {Number} in_width     /너비
 * @param {Number} in_height    /높이
 * @param {Number} in_x         /위치x
 * @param {Number} in_y         /위치x
 */
GUI.getSymbolImage = function( in_goodType /*from FUserDataManager.js*/, in_width, in_height, in_x, in_y, in_alignW, in_alignH )
{
    var path = ASSET_URL+"97_gui_new/03_symbol/";
    switch( parseInt( in_goodType ) )
    {
    case GOODS_TYPE_STAR :
        {
            path += "star";
        }
        break;

    case GOODS_TYPE_GOLD :
        {
            path += "gold";
        }
        break;

    case GOODS_TYPE_RUBY :
        {
            path += "ruby";
        }
        break;

    case GOODS_TYPE_COIN :
        {
            path += "gold";
        }
        break;

    case GOODS_TYPE_EXP :
        {
            path += "xp";
            in_height = px(parseInt(in_height)*0.7);
        }
        break;

    default :
        {
            path += "gold";
        }
        break;
    }

    if ( in_width > 20 )
        path+="_b.png";
    else
        path+="_s.png";

    var alignW = (in_alignW!=undefined)?in_alignW : GUI.ALIGN_CENTER;
    var alignH = (in_alignH!=undefined)?in_alignH : GUI.ALIGN_MIDDLE;

    var resultImage = GUI.CreateImage("symbol", in_x, in_y, in_width, in_height, path, alignW, alignH);
    return resultImage;
}

/**
 * 재화를 시작위치부터 목표위치까지 일정 갯수를 보내는 연출입니다.
 * @param {Number} in_goodType          /상품 id
 * @param {Number} in_goodCount         /상품 갯수
 * @param {Array[2]} in_effectStartPos  /이펙트 시작위치
 * @param {Array[2]} in_effectEndPos    /이펙트 목표위치
 * @param {Function} in_onEndFunc       /연출 완료 시 콜백
 */
GUI.goodsGetEffect = function( in_goodType, in_goodCount, in_effectStartPos, in_effectEndPos, in_onEndFunc )
{
    // create symbol
    var path = ASSET_URL+"97_gui_new/03_symbol/";
    switch( in_goodType )
    {    
        case GOODS_TYPE_STAR :
            {
                path += "star_s.png";
            }
            break;
    
        case GOODS_TYPE_GOLD :
            {
                path += "gold_b.png";
            }
            break;
    
        case GOODS_TYPE_RUBY :
            {
                path += "ruby_b.png";
            }
            break;
    
        case GOODS_TYPE_COIN :
            {
                path += "gold_b.png";
            }
            break;
    
        case GOODS_TYPE_EXP :
            {
                path += "xp_b.png";
            }
            break;
    
        default :
            {
                path += "gold_b.png";
            }
            break;        
    }

    // count calc
    var count = Math.min( 20, Math.max( 1,in_goodCount/20 ) );
    var frameRate = 120;
    var randEasingMode = [BABYLON.EasingFunction.EASINGMODE_EASEIN, BABYLON.EasingFunction.EASINGMODE_EASEOUT, BABYLON.EasingFunction.EASINGMODE_EASEINOUT ];
    var speed = CommFunc.randomMinMax( 50, 150 ) / 100;

    for ( var i = 0; i < count; ++i )
    {
        var createEffectAni = function()
        {
            var easeMode = randEasingMode[ CommFunc.random( 2 ) ];

            GUI.ignoreResolutionCorrectionStart();
            {
                var goodsSymbol = GUI.CreateImage( "effectSymbol", in_effectStartPos[0], in_effectStartPos[1], px(40), px(40), path, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
                G.guiMain.addControl( goodsSymbol, GUI.LAYER.TOP_EFFECT );
            }
            GUI.ignoreResolutionCorrectionEnd();
            goodsSymbol.width = px(55);
            goodsSymbol.height = px(55);

            var center = [ (parseInt(in_effectEndPos[0]) - parseInt(goodsSymbol.left)), (parseInt(in_effectEndPos[1]) - parseInt(goodsSymbol.top)) ]
    
            var moveAnimationX = new BABYLON.Animation( "effectmoveX", "left", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var moveAnimationKeyX = [];
            moveAnimationKeyX.push( {frame:0, value: parseInt(in_effectStartPos[0])} );
            //moveAnimationKeyX.push( {frame:frameRate/2, value:center[0]+(Math.random()*25)})
            moveAnimationKeyX.push( {frame:frameRate, value:parseInt(in_effectEndPos[0])} );
            moveAnimationX.setKeys(moveAnimationKeyX);
            CommFunc.useEasingFuncToAnimation(moveAnimationX, undefined, easeMode);
    
            var moveAnimationY = new BABYLON.Animation( "effectmoveY", "top", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var moveAnimationKeyY = [];
            moveAnimationKeyY.push( {frame:0, value:parseInt(in_effectStartPos[1])} );
            //moveAnimationKeyY.push( {frame:frameRate/2, value:center[1]+(Math.random()*25)})
            moveAnimationKeyY.push( {frame:frameRate, value:parseInt(in_effectEndPos[1])} );
            moveAnimationY.setKeys(moveAnimationKeyY);    
            CommFunc.useEasingFuncToAnimation(moveAnimationY, undefined, easeMode);

            
            var rotateAnimation = new BABYLON.Animation( "rotate", "rotation", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var rotateAnimationKey = [];
            rotateAnimationKey.push( {frame:0, value: ToRadians(CommFunc.random(360)) } );
            rotateAnimationKey.push( {frame:frameRate, value: 0 } );
            rotateAnimation.setKeys(rotateAnimationKey);    

            var alphaAnimation = new BABYLON.Animation( "alpha", "alpha", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var alphaAnimationKey = [];
            alphaAnimationKey.push( {frame:0, value: 1 } );
            alphaAnimationKey.push( {frame:frameRate-20, value: 1 } );
            alphaAnimationKey.push( {frame:frameRate, value: 0 } );
            alphaAnimation.setKeys(alphaAnimationKey); 
    
            G.scene.beginDirectAnimation( goodsSymbol, [moveAnimationX, moveAnimationY, rotateAnimation, alphaAnimation], 0, frameRate, false, speed, function()
            {
                G.guiMain.removeControl( goodsSymbol );
            } );
        }

        setTimeout( createEffectAni, i*100 );
    }
}

/**
 * 파티클이 잠깐 퍼져나가는 연출입니다.
 * @param {Vector3} in_position : 기준 위치
 * @param {String} in_imageUrl : 파티클 이미지. 기본 poof_b.png
 * @param {Number} in_lifeTime : 재생 지속시간. 기본 0.5
 */
GUI.installEffect = function( in_position, in_imageUrl, in_lifeTime, in_scale, in_height, in_particleScale )
{
    var imageURL = (undefined==in_imageUrl)?"poof_b.png":in_imageUrl;

    var particleFountain = BABYLON.Mesh.CreateBox("particleFountain", .1, G.scene);
    particleFountain.position = in_position;
    particleFountain.isVisible = false;

    var particleSystem = new BABYLON.ParticleSystem("particles", 100, G.scene);
    particleSystem.particleTexture = new BABYLON.Texture(ASSET_URL+"99_Images/"+imageURL, G.scene);

    var height = (undefined==in_height)?0:in_height; 
    var scale = (undefined==in_scale)?2:in_scale;
    particleSystem.emitter = particleFountain;
    particleSystem.minEmitBox = new BABYLON.Vector3(-scale, height, -scale);
    particleSystem.maxEmitBox = new BABYLON.Vector3(scale, height, scale);

    var paticleScale = (in_particleScale == undefined)?1:in_particleScale;
    particleSystem.minSize = 0.8 * 5 * paticleScale;
    particleSystem.maxSize = 1.7 * 5 * paticleScale;
    
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;
    
    particleSystem.emitRate = 100;
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);    
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    
    var lifeTime = 0.5;
    if ( undefined != in_lifeTime )
        lifeTime = in_lifeTime;

    particleSystem.targetStopDuration = lifeTime;
    
    particleSystem.direction1 = new BABYLON.Vector3(1,0.4,1);
    particleSystem.direction2 = new BABYLON.Vector3(-1, 0.4, -1);
    
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;
    
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.035;
    
    particleSystem.start();
}

/**
 * 버튼UI 의 이미지를 교체합니다.
 * @param {GUI.button} in_button / 교체할 이미지버튼
 * @param {String} in_changeURL / 교체할 이미지의 URL
 */
GUI.changeButtonImage = function( in_button, in_changeURL )
{
    var buttonIcon = in_button.getChildByName(in_button.name+"_icon");
    GUI.changeImage( buttonIcon, in_changeURL );
}

/**
 * 이미지UI 의 이미지를 교체합니다.
 * @param {GUI.Image} in_image 
 * @param {String} in_changeURL 
 */
GUI.changeImage = function( in_image, in_changeURL)
{
    in_image.source = in_changeURL;
}


 /**
  * @description 메쉬를 떨어뜨리는 이펙트입니다.
  * @param {Mesh} in_mesh               / 효과를 줄 메쉬
  * @param {Number} in_startHeight      / 떨어지는 시작높이
  * @param {Boolean} in_usedirt         / 먼지 사용여부. 디폴트 true
  * @param {Number} in_bounceCount      / 튕기는 횟수. 디폴트1
  * @param {Number} in_bouncePower      / 무게. 높을수록 적게튀어오름. 디폴트8
  * @param {Number} in_speed            / 애니메이션 속도. 디폴트1.5
  * @param {String} in_dirtImage        / 먼지 이미지
  */
GUI.dropEffect = function( in_mesh, in_startHeight, in_usedirt, in_bounceCount, in_bouncePower, in_speed, in_dirtImage, in_useAlpha )
{
    var endHeight = in_mesh.position.y;
    var startHeight = (undefined == in_startHeight) ? 5 : in_startHeight;

    var frameRate = 120;
    var dropAni = new BABYLON.Animation( "dropAni", "position.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
    var dropAniKey = [];
    dropAniKey.push( {frame:0, value:startHeight});
    dropAniKey.push( {frame:frameRate, value:endHeight});
    dropAni.setKeys( dropAniKey );
    
    var boundCount = (undefined==in_bounceCount)?1:in_bounceCount;
    var boundPower = (undefined==in_bouncePower)?8:in_bouncePower;
    var easingFunction = new BABYLON.BounceEase(boundCount,boundPower);
    CommFunc.useEasingFuncToAnimation( dropAni, easingFunction, BABYLON.EasingFunction.EASINGMODE_EASEOUT );


    if ( (undefined==in_usedirt)||in_usedirt )
    {
        var dirtUrl = (undefined==in_dirtImage)?"dirt.png":in_dirtImage;
        var dirtEvent = new BABYLON.AnimationEvent( frameRate*0.8, function(){ GUI.installEffect( in_mesh.position, dirtUrl, 1 ) } );
        dropAni.addEvent( dirtEvent );
    }


    var alphaAni = new BABYLON.Animation( "alphaAni", "material.alpha", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
    var alphaAniKey = [];
    alphaAniKey.push( {frame:0, value:0});
    alphaAniKey.push( {frame:frameRate, value:1});
    alphaAni.setKeys( alphaAniKey );

    var speed = (undefined==in_speed)?1.5:in_speed;

    var playList = [];
    playList.push(dropAni);
    if ( in_useAlpha )
        playList.push(alphaAni);

    return G.scene.beginDirectAnimation( in_mesh, playList, 0, frameRate, false, speed );
}

/**
 * 재화 감소 이펙트입니다.
 * @param {GUI} in_parent           / 연출될 부모UI
 * @param {Number} in_goodsType     / 재화 인덱스
 * @param {Number} in_quantity      / 차감 갯수
 * @param {Number} in_x             / 위치x
 * @param {Number} in_y             / 위치y
 * @param {Number} in_width         / 너비
 * @param {Number} in_height        / 높이
 * @param {Number} in_fontSize      / 차감갯수 텍스트 폰트사이즈
 * @param {Function} in_onEndfunc   / 연출 종료시 콜백함수
 */
GUI.decreaseMoneyEffect = function( in_parent, in_goodsType, in_quantity, in_x, in_y, in_width, in_height, in_fontSize, in_onEndfunc )
{
    var targetUI = in_parent;
    var wrapper = GUI.CreateClipArea( in_x, in_y, in_width, in_height, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
    var fontSize = (undefined==in_fontSize)?12:in_fontSize;

    var symbolSize = Math.min(parseInt(in_width),parseInt(in_height));
    var goodsUI = GUI.getSymbolImage( in_goodsType, px(symbolSize), px(symbolSize), 0, 0, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
    wrapper.addControl( goodsUI );

    var decreaseText = GUI.CreateText( 0, 0, (-in_quantity).toString(), "Red", in_fontSize, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
    wrapper.addControl( decreaseText );

    targetUI.addControl( wrapper );

    var frameRate = 120;
    var decreaseAni = new BABYLON.Animation( "decreaseAni", "top", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
    var decreaseAniKey = [];
    decreaseAniKey.push( {frame:0, value: GUI.getResolutionCorrection( parseInt(in_y), false ) });
    decreaseAniKey.push( {frame:frameRate, value: GUI.getResolutionCorrection( parseInt(in_y)-30, false ) });
    decreaseAni.setKeys( decreaseAniKey );

    var alphaAni = new BABYLON.Animation( "alphaAni", "alpha", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
    var alphaAniKey = [];
    alphaAniKey.push( {frame:0, value:1});
    alphaAniKey.push( {frame:frameRate, value:0});
    alphaAni.setKeys( alphaAniKey );
    
    G.scene.beginDirectAnimation( wrapper, [decreaseAni,alphaAni], 0, frameRate, false, 1.0, function()
    {
        targetUI.removeControl(wrapper);

        if ( in_onEndfunc != undefined) 
            in_onEndfunc();
    } );

    return wrapper;
}

GUI.CURRENT_TEXTBALLOON_COUNT = 0; // 한번에 보여지는 말풍선의 갯수를 제한하려고 일단 만들었는데 안쓴다.
/**
 * 랜덤 지속시간과 갱신시간을 가진 말풍선을 생성하여 메쉬에 어태치합니다.
 * @param {Mesh} in_targetMesh              / 말풍선 타겟 메쉬. 일반적으로 친구 메쉬에 붙여준다
 * @param {String} in_intro                 / 말풍선 내용. 일반적으로 친구의 인트로 스트링을 넣어준다
 * @param {GUI} in_alreadyCreatedTxtBalloon / 재귀 함수라서 넣어주지 않으면 됩니다. 한번 생성해주고 그 뒤에 호출할때만 넣는 값임.
 */
GUI.createRandomTextBalloon = function( in_targetMesh, in_intro, in_alreadyCreatedTxtBalloon )
{
    if ( in_targetMesh == null )
        return undefined;
        
    if( in_intro == null )
        return undefined;

    var textBalloonBG = null;
    if ( undefined == in_alreadyCreatedTxtBalloon )
    {
        var width = 206/2;
        var height = 110/2;
        textBalloonBG = GUI.CreateButton( "txtballoonBG", px(0), px(0), px(width), px(height), MAINUI_PATH + "textballoon.png", GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE )
        
        G.guiMain.addControl(textBalloonBG, GUI.LAYER.BACKGROUND);
        textBalloonBG.linkWithMesh(in_targetMesh);
        textBalloonBG.linkOffsetX = 105;
        textBalloonBG.linkOffsetY = -60; 

        var text = GUI.CreateAutoLineFeedText( px(0), px(-5), px(width-30), px(height-10), in_intro, "Black", 20, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        textBalloonBG.addControl( text );
        textBalloonBG.isHitTestVisible = false;
    }
    else
        textBalloonBG = in_alreadyCreatedTxtBalloon;


    textBalloonBG.isVisible = false;

    var continueSec = CommFunc.randomMinMax( 2000, 4000 ); // 1~4초
    var renewSec = continueSec+CommFunc.randomMinMax( 5000, 20000); // 5~20초

    var apearPopup = function( in_continueSec )
    {
        textBalloonBG.isVisible = true;
        FPopup.openAnimation( textBalloonBG, undefined, 0.4 );
        setTimeout( function()
        {
            GUI.createRandomTextBalloon( in_targetMesh, in_intro, textBalloonBG )
        }, in_continueSec );
    }

    setTimeout( function()
    {
        apearPopup( continueSec );
    }, renewSec );

    return textBalloonBG;
}

GUI.textBalloonBG = null;
GUI.textBalloonId = null;

GUI.createTextBalloon = function( mesh, text ) {
    
    if ( mesh == null ) return;
    if( text == null ) return;

    var self = this;

    if(this.textBalloonId) clearTimeout(this.textBallonId);
    if(this.textBalloonBG) this.textBalloonBG.dispose();

    GUI.ignoreResolutionCorrectionStart();

    var width = 206/2;
    var height = 110/2;
    this.textBalloonBG = GUI.CreateButton( "txtballoonBG", px(0), px(0), px(width), px(height), MAINUI_PATH + "textballoon.png", GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE )
    
    G.guiMain.addControl(this.textBalloonBG, GUI.LAYER.BACKGROUND);
    this.textBalloonBG.linkWithMesh(mesh);
    this.textBalloonBG.linkOffsetX = 105;
    this.textBalloonBG.linkOffsetY = -60; 

    var text = GUI.CreateAutoLineFeedText( px(0), px(-5), px(width-30), px(height-10), text, "Black", 20, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
    this.textBalloonBG.addControl( text );
    this.textBalloonBG.isHitTestVisible = false;

    this.textBalloonBG.isVisible = true;
    FPopup.openAnimation( this.textBalloonBG, undefined, 0.4 );

    this.textBallonId = setTimeout( function() {

        self.textBalloonBG.dispose();
        self.textBalloonId = null;

    }, 3000 );

    GUI.ignoreResolutionCorrectionEnd();
}


/**
 * @description 알파애니메이션을 빠르게 만들어드립니다.
 * @param {GUI} in_targetUI         / 애니메이션 타겟 UI 
 * @param {Boolean} in_isLoop       / 루프 여부
 * @param {Number} in_speed         / 빠르기
 * @param {Function} onEndAniFunc   / 애니메이션 끝나면 호출될 콜백함수
 */
GUI.alphaAnimation = function( in_targetUI, in_isLoop, in_speed, onEndAniFunc )
{
    var frameRate = 120;
    var alphaAnimation = new BABYLON.Animation( "alpha", "alpha", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var keyframeAlpha = [];
    keyframeAlpha.push({frame:0,value:0});
    keyframeAlpha.push({frame:frameRate,value:1.0});
    keyframeAlpha.push({frame:frameRate*2,value:0});
    alphaAnimation.setKeys(keyframeAlpha);

    G.scene.beginDirectAnimation( in_targetUI, [alphaAnimation], 0, in_isLoop?frameRate*2:frameRate, in_isLoop, in_speed, onEndAniFunc );
}


        
GUI.levelOfAlphaUI = [];
/**
 * @description 카메라와의 거리에 따라 UI에 투명값과 오프셋을 조절해주는 함수
 */
GUI.initLevelOfAlphaUI = function()
{
    GUI.levelOfAlphaUI = [];
}
/**
 * @description 적용할 UI를 추가한다.
 * @param {GUI} in_alphaui      /대상 UI
 * @param {Number} in_offsetui  /원래 오프셋
 */
GUI.addLevelOfAlphaUI = function( in_alphaui, in_offsetui )
{
    var originOffset = (in_offsetui==undefined)?undefined:in_offsetui.linkOffsetY;
    GUI.levelOfAlphaUI.push( { "alphaui": in_alphaui, "offsetui" : in_offsetui, "originalOffset":originOffset });
}

GUI.removeLevelOfAlphaUI = function( in_alphaui, in_offsetui )
{
    // var originOffset = (in_offsetui==undefined)?undefined:in_offsetui.linkOffsetY;
    // GUI.levelOfAlphaUI.push( { "alphaui": in_alphaui, "offsetui" : in_offsetui, "originalOffset":originOffset });
}

/**
 * @description Loop 에서 돌아간다
 */
GUI.procLevelOfAlphaUI = function()
{
    this.levelOfAlphaUI.forEach( function(in_iter)
    {
        if ( in_iter.alphaui != undefined )
        {
            //var distance = BABYLON.Vector3.Distance( in_iter.mesh.position, G.camera.position );
            var distance = G.camera.radius;

            var sectionDistance = 500;//50;
            var thresholdDistance = MIN_CAMERA_RADIUS-sectionDistance;
            var alpha = CommFunc.minMax( 0, ((sectionDistance-distance)+thresholdDistance) / sectionDistance ,1 );

            in_iter.alphaui.alpha = 1;//alpha;

            if ( in_iter.alphaui.isHitTestVisible && 0.2 > alpha )
            {
                in_iter.alphaui.isHitTestVisible = false;
            }
            else if ( !in_iter.alphaui.isHitTestVisible && 0.2 <= alpha )
            {
                in_iter.alphaui.isHitTestVisible = true;
            }
        }

        if ( in_iter.offsetui != undefined )
        {                
            var conversionOffset = parseInt(in_iter.originalOffset) * CommFunc.minMax( 0, (ToDegrees(G.camera.beta)-50)/450 ,1 );
            in_iter.offsetui.linkOffsetY = conversionOffset;
        }
    });
}

GUI.generateRandomSmileMark = function()
{
    return;

    if ( CommFunc.random(1000) < 5 )
        GUI.getSmileMarkEffect();
}

var smileEffectCount = 0;

/**
 * @description 스마일마크 받았을때 연출 이펙트
 * @param {"image":string, "nick":string} in_data 
 */
GUI.getSmileMarkEffect = function( in_data )
{
    // 스마일마크 연출도 해상도보정을 받지 않는다.
    GUI.ignoreResolutionCorrectionStart()
    {

        var lineFeedDistance = 200;
        var maxSmileEffectCount = parseInt( window.innerHeight*0.8/lineFeedDistance ) + 1;
        var lineFeedPos = [];
        for ( var i = 0 ; i < maxSmileEffectCount; ++i )
        {
            lineFeedPos.push( (lineFeedDistance*i)-(lineFeedDistance/2*(maxSmileEffectCount-1)) );
        }

        var RES_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "11_smilemark/Ani/";
        
        /*var wrapper = GUI.CreateClipArea( px((CommFunc.random(window.innerWidth*0.2)-window.innerWidth/2)*0.8), px((CommFunc.random(window.innerHeight)-window.innerHeight/2)*0.5), px(420), px(420), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        G.guiMain.addControl( wrapper );*/ // All Random

        var wrapper = GUI.CreateClipArea( px(-window.innerWidth/2 + 80) , lineFeedPos[smileEffectCount%maxSmileEffectCount], px(420), px(420), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        wrapper.left = px(-window.innerWidth/2 + 80);
        G.guiMain.addControl( wrapper, GUI.LAYER.TOP_EFFECT ); // standard line

        var bg = GUI.CreateImage( "bg", 0, 0, px(420), px(420), RES_PATH+"bgEffect.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        wrapper.addControl( bg );
        
        var frameRate = 200;
        var rotateAnimation = new BABYLON.Animation( "rotate", "rotation", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var rotateAnimationKey = [];
        rotateAnimationKey.push( {frame:0, value: 0 } );
        rotateAnimationKey.push( {frame:frameRate, value: ToRadians(360) } );
        rotateAnimation.setKeys(rotateAnimationKey); 
        G.scene.beginDirectAnimation( bg, [rotateAnimation], 0, frameRate, true, 0.4 ); 
        
        var ribbon = GUI.CreateImage( "ribbon", 0, px(60), px(275), px(62), RES_PATH+"ribbon.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        wrapper.addControl( ribbon );
        
        var smile = GUI.CreateImage( "smile", 0, 0, px(125), px(126), RES_PATH+"smile.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        wrapper.addControl( smile );

        var smileframeRate = 60;
        var scaleXAni = new BABYLON.Animation( "scaleX", "scaleX", smileframeRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var scaleXAniKey = [];
        scaleXAniKey.push( {frame:0, value: 1.5 } );
        scaleXAniKey.push( {frame:smileframeRate*0.4, value: 0.8 } );
        scaleXAniKey.push( {frame:smileframeRate*0.75, value: 1.25 } );
        scaleXAniKey.push( {frame:smileframeRate, value: 1 } );
        scaleXAni.setKeys(scaleXAniKey); 

        var scaleYAni = new BABYLON.Animation( "scaleY", "scaleY", smileframeRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var scaleYAniKey = [];
        scaleYAniKey.push( {frame:0, value: 0.5 } );
        scaleYAniKey.push( {frame:smileframeRate*0.4, value: 1.3 } );
        scaleYAniKey.push( {frame:smileframeRate*0.75, value: 0.75 } );
        scaleYAniKey.push( {frame:smileframeRate, value: 1 } );
        scaleYAni.setKeys(scaleYAniKey); 
        G.scene.beginDirectAnimation( smile, [scaleXAni, scaleYAni], 0, smileframeRate, false, 3 ); 

        var tempImageList = [
            {"img":CLIENT_DOMAIN + "/fileupload/myprofile/profile_1_1500269762578.png", "nick":"KINGMooSung" },
            {"img":CLIENT_DOMAIN + "/fileupload/myprofile/profile_1_1500269762577.png", "nick":"ChulSoo" },
            {"img":CLIENT_DOMAIN + "/fileupload/myprofile/profile_1_1500269762576.png", "nick":"YoungSoo" },
            {"img":CLIENT_DOMAIN + "/fileupload/myprofile/profile_1_1500269762579.png", "nick":"Prisoner503" },
            {"img":CLIENT_DOMAIN + "/fileupload/myprofile/profile_138_1514267837593.png", "nick":"2MegaByte" }
        ];
        
        var tempData = in_data;
        if ( undefined == tempData )
        tempData = tempImageList[CommFunc.random( tempImageList.length )];

        var profileImage = GUI.CreateCircleButton( "profile", 0, 0, px(110), px(110), tempData.img, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        profileImage.scaleX = 0;
        profileImage.scaleY = 0;
        wrapper.addControl( profileImage );
        setTimeout( function()
        {
            FPopup.openAnimation( profileImage );
        }, 450);
        
        var thankstxt = GUI.CreateImage( "thankstxt", 0, px(100), px(190), px(68), RES_PATH+"thankstxt.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        wrapper.addControl( thankstxt );

        var nickTxt = GUI.CreateText( 0, px(85), tempData.nick, "White", 15, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        wrapper.addControl( nickTxt );

        FPopup.openAnimation( thankstxt );
        FPopup.openAnimation( ribbon, function()
        {
            setTimeout( function(){ 
                G.guiMain.removeControl( wrapper); wrapper = null; 

                G.dataManager.getUsrMgr(DEF_IDENTITY_ME).goods.SMILE_FREE += 10;
                FRoomUI.getInstance().setSmileMarkCount( CommFunc.numberWithCommas(G.dataManager.getUsrMgr(DEF_IDENTITY_ME).goods.SMILE_FREE) );
                FPopup.openAnimation( FRoomUI.getInstance().ui.button[ ROOMBUTTON.SMILE ], undefined, 1, false, 8 );
            }, 2000 );
        });

    }
    GUI.ignoreResolutionCorrectionEnd();


    // particle
    var createSmileParticle = function()
    {
        
        // 스마일마크 연출도 해상도보정을 받지 않는다.
        GUI.ignoreResolutionCorrectionStart();
        {

            var smileParticle = GUI.CreateImage( "part", px(-window.innerWidth/2 + 80), lineFeedPos[smileEffectCount%maxSmileEffectCount], px(24), px(24), RES_PATH+"mark_smile.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            smileParticle.left = px(-window.innerWidth/2 + 80);
            var radians = ToRadians( CommFunc.random( 360 ) );
            var stopoverPos = new Vector2( parseInt( px(-window.innerWidth/2 + 80) ) + Math.cos( radians )*CommFunc.randomMinMax(150, 250),
            parseInt( wrapper.top ) + Math.sin( radians )*CommFunc.randomMinMax(150, 250) );

            G.guiMain.addControl( smileParticle, GUI.LAYER.TOP_EFFECT );
            
        }
        GUI.ignoreResolutionCorrectionEnd();

            var partFR = 120;
            var partXAni = new BABYLON.Animation( "x", "left", partFR, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var partXAniKey = [];
            partXAniKey.push( {frame:0, value: parseInt( px(-window.innerWidth/2 + 80) ) } );
            partXAniKey.push( {frame:partFR, value: stopoverPos.x } );
            partXAniKey.push( {frame:partFR*2, value: GUI.getResolutionCorrection( 260, false )  } );
            partXAni.setKeys(partXAniKey); 
            CommFunc.useEasingFuncToAnimation(partXAni, undefined, BABYLON.EasingFunction.EASINGMODE_EASEOUT);
            var partYAni = new BABYLON.Animation( "x", "top", partFR, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var partYAniKey = [];
            partYAniKey.push( {frame:0, value: parseInt( lineFeedPos[smileEffectCount%maxSmileEffectCount] ) } );
            partYAniKey.push( {frame:partFR, value: stopoverPos.y } );
            partYAniKey.push( {frame:partFR*2, value: GUI.getResolutionCorrection( -600, false ) } );
            partYAni.setKeys(partYAniKey); 
            CommFunc.useEasingFuncToAnimation(partYAni, undefined, BABYLON.EasingFunction.EASINGMODE_EASEOUT);
            var partAlphaAni = new BABYLON.Animation( "a", "alpha", partFR, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var partAlphaAniKey = [];
            partAlphaAniKey.push( {frame:0, value: 0 } );
            partAlphaAniKey.push( {frame:partFR, value:1 } );
            partAlphaAniKey.push( {frame:partFR*2, value:0 } );
            partAlphaAni.setKeys(partAlphaAniKey); 
            G.scene.beginDirectAnimation( smileParticle, [partXAni, partYAni, partAlphaAni], 0, partFR*2, false, CommFunc.randomMinMax(80, 120)/100, function()
            {
                G.guiMain.removeControl( smileParticle );
                smileParticle = null;
            } ); 
    }

    for ( var i = 0; i < 15; ++i )
    {
        createSmileParticle();
    }
    
    G.soundManager.playEffectSound( "EFFECT_SmileMark.ogg" );

    smileEffectCount++;
}

GUI.createParticle = function( in_imagePath, in_particleCount, in_x, in_y, in_size )
{
    //edited hunbums
    if(!G.guiMain) return;

    var createParticlePart = function()
    {
        var size = in_size;
        if ( size == undefined )
            size = 35;

        var particlePart = GUI.CreateImage( "part", in_x, in_y, px(size), px(size), in_imagePath, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        var radians = ToRadians( CommFunc.random( 360 ) );
        var stopoverPos = new Vector2( parseInt( in_x ) + Math.cos( radians )*CommFunc.randomMinMax(150, 250),
        parseInt( in_y ) + Math.sin( radians )*CommFunc.randomMinMax(150, 250) );
    
        G.guiMain.addControl( particlePart, GUI.LAYER.EFFECT );
    
        var partFR = 120;
        var partXAni = new BABYLON.Animation( "x", "left", partFR, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var partXAniKey = [];
        partXAniKey.push( {frame:0, value: parseInt( in_x ) } );
        partXAniKey.push( {frame:partFR, value: stopoverPos.x } );
        partXAni.setKeys(partXAniKey); 
        CommFunc.useEasingFuncToAnimation(partXAni, undefined, BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        var partYAni = new BABYLON.Animation( "x", "top", partFR, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var partYAniKey = [];
        partYAniKey.push( {frame:0, value: parseInt( in_y ) } );
        partYAniKey.push( {frame:partFR, value: stopoverPos.y } );
        partYAni.setKeys(partYAniKey); 
        CommFunc.useEasingFuncToAnimation(partYAni, undefined, BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        var partAlphaAni = new BABYLON.Animation( "a", "alpha", partFR, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var partAlphaAniKey = [];
        partAlphaAniKey.push( {frame:0, value: 0 } );
        partAlphaAniKey.push( {frame:90, value: 1 } );
        partAlphaAniKey.push( {frame:partFR, value:0 } );
        partAlphaAni.setKeys(partAlphaAniKey); 
        G.scene.beginDirectAnimation( particlePart, [partXAni, partYAni, partAlphaAni], 0, partFR, false, CommFunc.randomMinMax(80, 120)/100, function()
        {
            G.guiMain.removeControl( particlePart );
            particlePart = null;
        } ); 
    }

    for ( var i = 0; i < in_particleCount; ++i )
    {
        createParticlePart();
    }
    
    
    G.soundManager.playEffectSound( "EFFECT_SmileMark.ogg" );
}

GUI.alertList = [];
GUI.maxAlertCount = 4;
/**
 * 
 * @param {img:string, str:string} in_data 
 */
GUI.alertEffect = function( in_data, in_isNewUI, in_onClickCallback )
{
    //edited hunbums
    if(!G.guiMain) return;

    GUI.maxAlertCount = 2;
    var startpos = -275;
    // 접속/접속종료 연출도 해상도보정을 받지 않는다.
    GUI.ignoreResolutionCorrectionStart()
    {
        var pullAlert = function( in_alert, in_targetIndex )
        {
            var frameRate = 120;
            var upperAni = new BABYLON.Animation( "upper", "top", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var upperKey = [];
            upperKey.push( {frame:0, value:parseInt(in_alert.top)*(G.guiMain.idealWidth/window.innerWidth)} );
            upperKey.push( {frame:frameRate, value:GUI.getResolutionCorrection(startpos-(((143)+10)*in_targetIndex), false)} );
            upperAni.setKeys(upperKey);    
            CommFunc.useEasingFuncToAnimation(upperAni, undefined, BABYLON.EasingFunction.EASINGMODE_EASEOUT);

            G.scene.beginDirectAnimation( in_alert, [upperAni], 0, frameRate, false, 2 );
        }

        if ( GUI.alertList.length >= GUI.maxAlertCount )
        {
            G.guiMain.removeControl( GUI.alertList[ GUI.alertList.length - GUI.maxAlertCount ] );
        }

        for ( var i = 0; i < GUI.alertList.length; ++i )
        {
            pullAlert( GUI.alertList[i], GUI.alertList.length-i );
        }        

        var tempDataList = [
            {"img":"http://vsns.onlinestory.co.kr/fileupload/myprofile/default.png", "str":"Devsoo 님이 접속하셨습니다" },
            {"img":"http://vsns.onlinestory.co.kr/fileupload/myprofile/default.png", "str":"Kuug's 님이 접속종료하셨습니다" },
            {"img":"http://vsns.onlinestory.co.kr/fileupload/myprofile/default.png", "str":"티라노사우르스 님이 접속하셨습니다" },
            {"img":"http://vsns.onlinestory.co.kr/fileupload/myprofile/default.png", "str":"SaraPho 님이 접속종료하셨습니다" },
            {"img":"http://vsns.onlinestory.co.kr/fileupload/myprofile/default.png", "str":"캐리건 님이 접속하셨습니다" }
        ];
        
        var tempData = tempDataList[CommFunc.random( tempDataList.length )];
        var data = in_data;
        if ( undefined == data )
            data = tempData;
        else if ( undefined == data.img )
            data.img = tempData.img;
        else if ( undefined == data.str )
            data.str = tempData.str;

        if ( in_isNewUI )
        {
            var BG = GUI.CreateButton( "newBG", px(-30), px(startpos), px(502), px(143), ETCUI_PATH+"notice.png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
            G.guiMain.addControl( BG );
            
            var icon = GUI.CreateCircleButton( "BG", px(8*2), px(2*2), px(62*2), px(62*2), data.img, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
            BG.addControl( icon );

            var text = GUI.CreateAutoLineFeedText( px(40*2), px(0), px(160*2), px(60*2), data.str, "black", 10*2, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
            BG.addControl( text );

            BG.onPointerUpObservable.add( function()
            {
                if ( in_onClickCallback != undefined )
                    in_onClickCallback();
            });
            
            FPopup.openAnimation( BG );
            GUI.alertList.push( BG );

            setTimeout( function()
            {
                if ( BG != null )
                {
                    G.guiMain.removeControl( BG );
                    BG = null;
                    GUI.alertList.shift();
                }
            }, 7000 );
        }
        else if ( (in_isNewUI == undefined) || (in_isNewUI == false))
        {
            var Path = GUI.DEFAULT_IMAGE_PATH_NEW + "14_alert/";

            var BG = GUI.CreateButton( "BG", px(-30), px(startpos), px(261), px(72), Path+"alert_bg.png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
            G.guiMain.addControl( BG );

            var icon = GUI.CreateCircleButton( "BG", px(3), px(3), px(55), px(55), data.img, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE, true, "gray" );
            BG.addControl( icon );

            var text = GUI.CreateAutoLineFeedText( px(30), px(0), px(190), px(30), data.str, "black", 13, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
            BG.addControl( text );
            
            BG.onPointerUpObservable.add( function()
            {
                if ( in_onClickCallback != undefined )
                    in_onClickCallback();
            });

            FPopup.openAnimation( BG );
            GUI.alertList.push( BG );

            setTimeout( function()
            {
                if ( BG != null )
                {
                    G.guiMain.removeControl( BG );
                    BG = null;
                    GUI.alertList.shift();
                }
            }, 5000 );
        }        
    }
    GUI.ignoreResolutionCorrectionEnd();
}


GUI.infoList = [];
GUI.maxInfoListCount = 5;
/**
 * 
 * @param {str:string} in_data 
 */
GUI.information = function( in_data )
{
    if(!G.guiMain) return;
    if(!in_data) return;
    var pullAlert = function( in_alert, in_targetIndex )
    {
        var frameRate = 120;
        var upperAni = new BABYLON.Animation( "upper", "top", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var upperKey = [];
        upperKey.push( {frame:0, value:parseInt(in_alert.top)} );
        upperKey.push( {frame:frameRate, value:-0-(30*in_targetIndex)} );
        upperAni.setKeys(upperKey);    
        CommFunc.useEasingFuncToAnimation(upperAni, undefined, BABYLON.EasingFunction.EASINGMODE_EASEOUT);

        G.scene.beginDirectAnimation( in_alert, [upperAni], 0, frameRate, false, 2 );
    }

    if ( GUI.infoList.length >= GUI.maxInfoListCount )
    {
        G.guiMain.removeControl( GUI.infoList[ GUI.infoList.length - GUI.maxInfoListCount ] );
    }

    for ( var i = 0; i < GUI.infoList.length; ++i )
    {
        pullAlert( GUI.infoList[i], GUI.infoList.length-i );
    }


    var text = GUI.CreateText( px(30), px(0), in_data, "white", 14, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
    G.guiMain.addControl( text );

    GUI.infoList.push( text );

    setTimeout( function()
    {
        if ( text != null )
        {
            G.guiMain.removeControl( text );
            text = null;
            GUI.infoList.shift();
        }
    }, 5000 );
}

/**
 * @description 스마일마켓 상품구매 인게임 팝업
 * @param {String} in_imgUrl        상품 썸네일
 * @param {String} in_name          
 * @param {Number} in_smilePrice    
 */
GUI.openSmilePurchasePopup = function( in_imgUrl, in_name, in_smilePrice, in_fromUrl )
{
    var SMILEPATH = GUI.DEFAULT_IMAGE_PATH_NEW+"15_smilePurchase/";

    var wrapper = GUI.CreateClipArea( 0, 0, 1, 1, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
    G.guiMain.addControl( wrapper, GUI.LAYER.POPUP );

    var BG = GUI.CreateImage( "BG", 0, 0, px(368), px(335), SMILEPATH + "bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
    wrapper.addControl( BG );

    var titleText = GUI.CreateText( 0, px(-140), "스마일마켓 상품 구매" ,"black", 16, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
    wrapper.addControl( titleText );

    var goodsImage = GUI.CreateImage( "BG", 0, px(-28), px(100), px(100), in_imgUrl, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
    wrapper.addControl( goodsImage );

    var nameText = GUI.CreateText( 0, px(38), in_name ,"black", 16, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
    wrapper.addControl( nameText );
    
    var priceText = GUI.CreateText( 0, px(60), "가격 : "+ in_smilePrice +"스마일마크" ,"black", 14, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
    wrapper.addControl( priceText );
    
    var curSmileMarkCount = GUI.CreateText( 0, px(78), "보유중인 스마일마크 : " + G.dataManager.getUsrMgr(DEF_IDENTITY_ME).goods.SMILE_FREE ,"black", 14, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
    wrapper.addControl( curSmileMarkCount );

    var close = GUI.CreateButton( "closeBtn", px(160), px(-140), px(33), px(33), SMILEPATH+"pop_cancel.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
    wrapper.addControl( close );
    close.onPointerUpObservable.add( function()
    {
        G.guiMain.removeControl( wrapper );
        
        G.sceneMgr.getCurrentScene().inAdvertiseCB( G.sceneMgr.getCurrentScene(), 3 );
    });

    var accept = GUI.CreateButton( "closeBtn", px(0), px(130), px(130), px(45), SMILEPATH+"btn_default.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
    wrapper.addControl( accept );
    var btnText = GUI.CreateText( 0, px(-2), "구매하기" ,"black", 16, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
    accept.addControl( btnText );
    accept.onPointerUpObservable.add( function()
    {
        G.dataManager.getUsrMgr(DEF_IDENTITY_ME).requestUseSmileMark( in_smilePrice );
    });

    FPopup.openAnimation( wrapper );
}

/**
 * @description 메쉬 위치에 파티클을 뿌려줍니다!
 * @param {*} in_mesh           파티클 뿌릴 메쉬!
 * @param {*} in_direction      파티클 뿌릴 방향!
 * @param {*} in_angleWidth     파티클 방향 너비보정치. 180 하면 전방향으로 퍼짐
 * @param {*} in_offsetX        메쉬 오프셋x
 * @param {*} in_offsetY        메쉬 오프셋y
 * @param {*} in_spreadMin      파티클 최소 진행거리
 * @param {*} in_spreadMax      파티클 최대 진행거리
 * @param {*} in_imageList      이미지 리스트
 * @param {*} in_particleCount  파티클 갯수
 * @param {*} in_frame          프레임 카운트
 * @param {*} in_speedMin       파티클 진행 속도 최소
 * @param {*} in_speedMax       파티클 진행 속도 최대
 * @param {*} in_onEndfunc      애니메이션 끝나면 콜백
 */
GUI.particleEffectToMesh = function( in_mesh, in_direction, in_angleWidth, in_offsetX, in_offsetY, in_spreadMin, in_spreadMax, in_imageList, in_particleCount, in_frame, in_speedMin, in_speedMax, in_onEndfunc )
{
    // particle
    var meshPos = CommFunc.worldToScreen( new BABYLON.Vector3( in_mesh.position.x, in_mesh.position.y, in_mesh.position.z ) );

    meshPos.x = ((meshPos.x + in_offsetX) - parseInt( window.innerWidth )/2);
    meshPos.y = ((meshPos.y + in_offsetY) - parseInt( window.innerHeight)/2);

    var createParticleEffect = function()
    {
        var heartParticle = GUI.CreateImage( "part", px(meshPos.x), px(meshPos.y), px(30), px(30), in_imageList[ CommFunc.random( in_imageList.length) ], GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        var radians = ToRadians( CommFunc.randomMinMax( in_direction-in_angleWidth, in_direction+in_angleWidth ) );
        var stopoverPos = new Vector2( meshPos.x + Math.cos( radians )*CommFunc.randomMinMax( GUI.getResolutionCorrection(in_spreadMin), GUI.getResolutionCorrection(in_spreadMax) ),
        meshPos.y + Math.sin( radians )*CommFunc.randomMinMax(GUI.getResolutionCorrection(in_spreadMin), GUI.getResolutionCorrection(in_spreadMax)) );

        G.guiMain.addControl( heartParticle, GUI.LAYER.TOP_EFFECT );           
        

        var partFR = in_frame;
        var partXAni = new BABYLON.Animation( "x", "left", partFR, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var partXAniKey = [];
        partXAniKey.push( {frame:0, value: parseInt( heartParticle.left ) } );
        partXAniKey.push( {frame:partFR*2, value: stopoverPos.x } );
        partXAni.setKeys(partXAniKey); 
        CommFunc.useEasingFuncToAnimation(partXAni, undefined, BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        var partYAni = new BABYLON.Animation( "x", "top", partFR, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var partYAniKey = [];
        partYAniKey.push( {frame:0, value: parseInt( heartParticle.top ) } );
        partYAniKey.push( {frame:partFR*2, value: stopoverPos.y } );
        partYAni.setKeys(partYAniKey); 
        CommFunc.useEasingFuncToAnimation(partYAni, undefined, BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        var partAlphaAni = new BABYLON.Animation( "a", "alpha", partFR, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var partAlphaAniKey = [];
        partAlphaAniKey.push( {frame:0, value: 0 } );
        partAlphaAniKey.push( {frame:partFR, value:1 } );
        partAlphaAniKey.push( {frame:partFR*2, value:0 } );
        partAlphaAni.setKeys(partAlphaAniKey); 
        G.scene.beginDirectAnimation( heartParticle, [partXAni, partYAni, partAlphaAni], 0, partFR*2, false, CommFunc.randomMinMax(in_speedMin*100, in_speedMax*100)/100, function()
        {
            G.guiMain.removeControl( heartParticle );
            heartParticle = null;

            if ( in_onEndfunc )
                in_onEndfunc();
        } ); 
    }

    GUI.ignoreResolutionCorrectionStart()
    {
        for ( var i = 0; i < in_particleCount; ++i )
        {
            createParticleEffect();
        }
    }
    GUI.ignoreResolutionCorrectionEnd()
}

GUI.moveUIAnimation = function( in_targetUI, in_startPosX, in_endPosX, in_startPosY, in_endPosY, in_speed, in_onEndFunc )
{
    var correctionRatio = G.guiMain.idealWidth / window.innerWidth;
    var frameRate = 120;

    if ( in_startPosX == undefined )
        in_startPosX = parseInt( in_targetUI.left ) * correctionRatio;

    if ( in_endPosX == undefined )
        in_endPosX = parseInt( in_targetUI.left ) * correctionRatio;

    if ( in_startPosY == undefined )
        in_startPosY = parseInt( in_targetUI.top ) * correctionRatio;

    if ( in_endPosY == undefined )
        in_endPosY = parseInt( in_targetUI.top ) * correctionRatio;


    var moveAnimationX = new BABYLON.Animation( "moveUIAnimationX", "left", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
    var moveAnimationKeyX = [];
    moveAnimationKeyX.push( {frame:0, value: parseInt(in_startPosX)} );
    moveAnimationKeyX.push( {frame:frameRate, value:parseInt(in_endPosX)} );
    moveAnimationX.setKeys(moveAnimationKeyX);
    CommFunc.useEasingFuncToAnimation(moveAnimationX);

    var moveAnimationY = new BABYLON.Animation( "moveUIAnimationY", "top", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
    var moveAnimationKeyY = [];
    moveAnimationKeyY.push( {frame:0, value:parseInt(in_startPosY)} );
    moveAnimationKeyY.push( {frame:frameRate, value:parseInt(in_endPosY)} );
    moveAnimationY.setKeys(moveAnimationKeyY);    
    CommFunc.useEasingFuncToAnimation(moveAnimationY);

    G.scene.beginDirectAnimation( in_targetUI, [moveAnimationX, moveAnimationY], 0, frameRate, false, in_speed, function()
    {
        if ( in_onEndFunc != undefined )
            in_onEndFunc();
    } );
}

GUI.showMainUI = function()
{
    GUI.moveUIAnimation( FRoomUI.getInstance().ui.wrapper[ ROOMWRAPPER.BOTTOM ], undefined, undefined, px(200), px(0), 1.0, undefined );

    GUI.moveUIAnimation( FRoomUI.getInstance().ui.wrapper[ ROOMWRAPPER.RIGHT ], px(250), px(0), undefined, undefined, 1.0, undefined );

    GUI.moveUIAnimation( FRoomUI.getInstance().ui.wrapper[ ROOMWRAPPER.PROFILE ], px(-250), px(0), undefined, undefined, 1.0, undefined );

    GUI.moveUIAnimation( FRoomUI.getInstance().ui.wrapper[ ROOMWRAPPER.TOP ], undefined, undefined, px(-150), px(0), 1.0, undefined );

    GUI.moveUIAnimation( FRoomUI.getInstance().ui.wrapper[ ROOMWRAPPER.RIGHTTOP ], undefined, undefined, px(-245),  px(0), 1.0, undefined );
}

GUI.hideMainUI = function()
{
    GUI.moveUIAnimation( FRoomUI.getInstance().ui.wrapper[ ROOMWRAPPER.BOTTOM ], undefined, undefined, undefined, px(200), 1.0, undefined );

    GUI.moveUIAnimation( FRoomUI.getInstance().ui.wrapper[ ROOMWRAPPER.RIGHT ], undefined, px(250), undefined, undefined, 1.0, undefined );

    GUI.moveUIAnimation( FRoomUI.getInstance().ui.wrapper[ ROOMWRAPPER.PROFILE ], undefined, px(-250), undefined, undefined, 1.0, undefined );

    GUI.moveUIAnimation( FRoomUI.getInstance().ui.wrapper[ ROOMWRAPPER.TOP ], undefined, undefined, undefined, px(-150), 1.0, undefined );

    GUI.moveUIAnimation( FRoomUI.getInstance().ui.wrapper[ ROOMWRAPPER.RIGHTTOP ], undefined, undefined, undefined,  px(-245), 1.0, undefined );
}