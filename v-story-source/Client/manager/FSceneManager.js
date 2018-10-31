'use strict';

var LOS = {
    NONE : 0,
    MYAVATAR : 1,
    SNSFRIEND : 2,
    SUGGESTFRIEND : 3,
    OWNERAVATAR : 4,


    NET_SNSFRIEND : 100,
    NET_SUGGESTFRIEND : 101,
    NET_GETOBJECTMAP : 102,
    NET_GETMYSTAR : 103,
    NET_GETSTAR : 104,
    NET_GETSHAREOBJ : 105
}

var FSceneManager = (function () {
    
    function FSceneManager() {

        this.currentScene = null;
        this.reservedScene = null;
        this.cleanup = false;
        this.arrayScene = [];//new buckets.LinkedList();

        G.runnableMgr.add(this);
    }
    FSceneManager.prototype.init = function () {

        if(this.currentScene == null) {
            this.currentScene = this.reservedScene;
            this.reservedScene = null;
            this.currentScene.scene.init();
        }
    };

    FSceneManager.prototype.destroy = function () {

        if(this.currentScene) {
            this.currentScene.scene.destroy();

            if(this.cleanup) {
                this.removeScene(this.currentScene);
                this.cleanup = false;
            }
            this.currentScene = null;
        }
    };

    FSceneManager.prototype.revisionIdealWidthUI = function()
    {
        var ratio =  window.innerHeight / window.innerWidth;
        
        if ( ratio > 1.7 )
        {
            if ( G.guiMain )
                G.guiMain.setIdealWidth( 720 );
            return;
        }

        if ( G.guiMain )
        {
            G.guiMain.setIdealWidth( 720 + ( 720* Math.max(0, (1.7-ratio)) ) );
        }
    }

    FSceneManager.prototype.run = function () {

        if (this.reservedScene != null && Loader.refCount == 0) {
            this.destroy();
            this.init();
        }

        if(this.currentScene) this.currentScene.scene.run();




        this.revisionIdealWidthUI();

        var popupFlag = false;
        if ( G.guiMain != null )
            popupFlag = G.guiMain.isShowingPopup();

        /// debug
        var cameraInfoStr = "X : " + G.camera.target.x +
                            "\nZ : " + G.camera.target.z + 
                            "\nAlpha(좌우각)\t: " + ToDegrees( G.camera.alpha ) +
                            "\nBeta(상하각)\t: " + ToDegrees( G.camera.beta ) +
                            "\nDistance(줌)\t: " + G.camera.radius + 
                            "\nisShowingPopup: " + popupFlag + 
                            "\nFOV : + " + G.camera.fov;

        FRoomUI.getInstance().ui.button[ ROOMBUTTON.DEBUGCAMERA ].text = cameraInfoStr;

        

        if ( G.guiMain )
            GUI.generateRandomSmileMark();
    };

    FSceneManager.prototype.isEnabledDragDropScene = function() {
        if(this.currentScene.name != 'SCENE_ROOM') return false;

        return true;
    }

    FSceneManager.prototype.getCurrentScene = function() {
         return this.currentScene.scene;
    }

    FSceneManager.prototype.getCurrentSceneName = function() {
        return this.currentScene.name;
    }

    FSceneManager.prototype.changeScene = function(sName, cleanup) {

        var self = this;
        var error = true;

        this.arrayScene.forEach(function(elem){
            if(elem.name == sName) {

                self.reservedScene = elem;
                self.cleanup = cleanup;
                error = false;
                return;
            }
        });

        if(error)
            Debug.Error('first, you add scene..not found scene');
    }

    FSceneManager.prototype.addScene = function(sName, pScene) {
        var scene = {
            name  : sName,
            scene : pScene
        };

        this.arrayScene.push(scene);
    }

    FSceneManager.prototype.removeScene = function(pScene) {

        var self = this;
        this.arrayScene.forEach(function(elem){
            
            if(elem === pScene) {

                // self.arrayScene.remove();

                CommFunc.arrayRemove(self.arrayScene, elem);

                return;
            }
        });
    }

    return FSceneManager;

}());



//<------------------------------------------------------------------------------------------------------------


var FScene = (function () {

    __inherit(FScene, FGameObject);

    function FScene() {

        return this;
    }

    FScene.prototype.init = function () {
        FGameObject.prototype.init.call(this);

        if(G.guiMain) G.guiMain.dispose();
        G.guiMain = new GUI.createMainGUI(this.name+'_ADVANCEDDYNAMICTEXTURE');
    }

    FScene.prototype.destroy = function () {
        FGameObject.prototype.destroy.call(this);

        G.camera.inputs.clear(); 
        G.camera.dispose();
    }

    //친구 집으로 가기
    FScene.prototype.goMyFriend = function(bDirect) {

        var pk = G.dataManager.getFriendPk();

        if(bDirect) {
            G.sceneMgr.addScene('SCENE_MYFRIENDROOM', new FSceneFriendRoom(pk));
            G.sceneMgr.changeScene('SCENE_MYFRIENDROOM', true);
        } else {
            // G.sceneMgr.addScene('SCENE_ROOM', new FSceneRoom(false));
            // G.sceneMgr.changeScene('SCENE_ROOM', true);
            // G.sceneMgr.addScene('SCENE_MYROOM', new FSceneMyRoom());
            // G.sceneMgr.changeScene('SCENE_MYROOM', true);

            G.sceneMgr.addScene('SCENE_MYFRIENDROOM', new FSceneFriendRoom(pk));
            G.sceneMgr.changeScene('SCENE_MYFRIENDROOM', true);
        }
    }

    FScene.prototype.getSceneNameToString = function(count)
    {
        var name = G.sceneMgr.getCurrentSceneName();

        var resultString = "";
        switch( name )
        {
            case 'SCENE_MYROOM' : resultString = "내 집";  break;
            case 'SCENE_BEACH' : resultString = "해변가 스팟"; break;
            case 'SCENE_MYFRIENDROOM' : resultString = "친구네 집";  break;
        }

        
        resultString += " (" + count + ")";

        return resultString;
    }


    return FScene;

}());

//<------------------------------------------------------------------------------------------------------------

var ROOMWRAPPER =
{
    BOTTOM : 0,
    RIGHT  : 1,
    TOP    : 2,
    PROFILE: 3,
    RIGHTTOP:4,

    MAX    : 5,
}

var ROOMBUTTON =
{
    PROFILE   : 0,
    PINKSMILE : 1,
    SMILE     : 2,
    SETTING   : 3,

    ANDROID : 4,
    STARCON : 5,

    SQ_CREATE   : 6,
    SQ_CONSUME  : 7,
    SQ_SHARE    : 8,

    AVATAR  : 9,
    STORE   : 10,
    SNS     : 11,
    CHAT    : 12,
    SPOT    : 13,

    FULLSCREEN : 14,

    SHARE   : 15,

    PACKAGE : 16,

    HIDEUI  : 17,
    CAMERA  : 18,

    MAX     : 19,

    DEBUGCAMERA : 20,
}

// fullscreen logic
var renderingZone = document.getElementById("renderCanvas");
var isFullScreen = false;

document.addEventListener("fullscreenchange", onFullScreenChange, false);
document.addEventListener("mozfullscreenchange", onFullScreenChange, false);
document.addEventListener("webkitfullscreenchange", onFullScreenChange, false);
document.addEventListener("msfullscreenchange", onFullScreenChange, false);

function onFullScreenChange()
{
    if (document.fullscreen !== undefined) {
        isFullScreen = document.fullscreen;
    } else if (document.mozFullScreen !== undefined) {
        isFullScreen = document.mozFullScreen;
    } else if (document.webkitIsFullScreen !== undefined) {
        isFullScreen = document.webkitIsFullScreen;
    } else if (document.msIsFullScreen !== undefined) {
        isFullScreen = document.msIsFullScreen;
    }
}

var launchBabylonFullscreen = function ( in_fullScreen ) 
{
    isFullScreen = in_fullScreen
    if (!isFullScreen) {
        BABYLON.Tools.RequestFullscreen(renderingZone);
    }
    else {
        BABYLON.Tools.ExitFullscreen();
    }
};

var launchJSFullScreen = function()
{
    $(document).fullScreen((!document.mozFullScreen && !document.webkitIsFullScreen));
}

var FRoomUI = (function()
{
    function FRoomUI()
    {
        this.ui = 
        {
            wrapper : null,

            button : [],

            isHided : false,
        }

        this.cameraBetaSwitchInfo = [ 55, 65, 75 ];
        this.cameraBetaOffset = 0;
        

        // init 

        this.preloadUI();
        //this.preloadResolutionUi();
    }

    FRoomUI.prototype.setAlpha = function( in_alpha )
    {
        for ( var i = 0; i < ROOMBUTTON.MAX; ++i )
        {
            this.ui.button[i].alpha = in_alpha;
        }
    }

    FRoomUI.prototype.preloadResolutionUi = function()
    {
        var self = this;

        for ( var i = 0; i < ROOMBUTTON.MAX; ++i )
            this.ui.button[i] = null;

        this.ui.wrapper = [];

        for ( var i = 0; i < ROOMWRAPPER.MAX; ++i )
            this.ui.wrapper.push( GUI.createContainer("mainUIWrapper_" + i.toString()) );


        // Profile ==========================================================================================================================
        var setContainerInfo = function( in_target, in_left, in_top, in_width, in_height, in_alignW, in_alignH )
        {
            in_target.left = in_left;
            in_target.top = in_top;

            in_target.width = in_width;
            in_target.height = in_height;

            in_target.horizontalAlignment = in_alignW;
            in_target.verticalAlignment = in_alignH;
        }

        this.ui.button[ ROOMBUTTON.PROFILE ] = GUI.CreateCircleButton(GUI.ButtonName.mainProfile, px(5), px(5), px(66), px(66), ASSET_URL+"97_gui_new/00_main/resolution/m_profile_icon.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP, true, "white", false);
        this.ui.button[ ROOMBUTTON.PROFILE ].onPointerUpObservable.add(function(){
    
            snsBtnOpen('타임라인');
    
        });
        
        
        // android survey
        this.ui.button[ ROOMBUTTON.ANDROID ] = GUI.CreateButton(GUI.ButtonName.mainQuest, px(3), px(75), px(72), px(79), ASSET_URL+"97_gui_new/00_main/resolution/m_helper_btn.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP);
        this.ui.button[ ROOMBUTTON.ANDROID ].onPointerUpObservable.add(function()
        {
            G.aiButlerManager.showSurveyUI();

            snsBtnClose();
        });

        // starContent
        this.ui.button[ ROOMBUTTON.STARCON ] = GUI.CreateButton(GUI.ButtonName.mainStarContents, px(8), px(220), px(56), px(55), ASSET_URL+"97_gui_new/00_main/resolution/m_statc_btn.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP);
        this.ui.button[ ROOMBUTTON.STARCON ].onPointerUpObservable.add( function()
        {            
            //FExchangePopup.getInstance().openPopup();
            // test
            FBytomExchange.getInstance().openPopup();
        });

        // package
        this.ui.button[ ROOMBUTTON.PACKAGE ] = GUI.CreateButton(GUI.ButtonName.mainStarContents, px(8), px(157), px(57), px(60), ASSET_URL+"97_gui_new/00_main/resolution/m_room_btn.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP);
        this.ui.button[ ROOMBUTTON.PACKAGE ].onPointerUpObservable.add( function()
        {            
            // FPackageShop.getInstance().openPopup();
            G.sceneMgr.addScene('SCENE_ROOMSTORE', new FSceneRoomStore());
            G.sceneMgr.changeScene('SCENE_ROOMSTORE', true);
        });

        // attach profilewrapper
        setContainerInfo( this.ui.wrapper[ ROOMWRAPPER.PROFILE ], 0, 0, px(150), px(120+100+70+100+100), GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        this.ui.wrapper[ ROOMWRAPPER.PROFILE ].addControl( this.ui.button[ ROOMBUTTON.STARCON ] );
        this.ui.wrapper[ ROOMWRAPPER.PROFILE ].addControl( this.ui.button[ ROOMBUTTON.ANDROID ] );
        this.ui.wrapper[ ROOMWRAPPER.PROFILE ].addControl( this.ui.button[ ROOMBUTTON.PROFILE ] );
        this.ui.wrapper[ ROOMWRAPPER.PROFILE ].addControl( this.ui.button[ ROOMBUTTON.PACKAGE ] );


        // smile ==========================================================================================================================

        this.ui.button[ ROOMBUTTON.SMILE ] = GUI.CreateButton(GUI.ButtonName.mainStar, px(-5), px(5), px(122), px(39), ASSET_URL+"97_gui_new/00_main/resolution/m_ysmile_info.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP);
        
        var smileText = GUI.CreateText(px(-10), px(10), "Init", "White", 16, GUI.ALIGN_RIGHT, GUI.ALIGN_TOP);
        this.ui.button[ ROOMBUTTON.SMILE ].addControl( smileText );
        smileText.name = GUI.ButtonName.mainStar;

        // pink smile
        
        this.ui.button[ ROOMBUTTON.PINKSMILE ] = GUI.CreateButton(GUI.ButtonName.mainStar, px(-5), px(45), px(120), px(43), ASSET_URL+"97_gui_new/00_main/resolution/m_psmile_info.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP);
        
        var pinkSmileText = GUI.CreateText(px(-10), px(10), CommFunc.random( 50000 ).toString(), "White", 16, GUI.ALIGN_RIGHT, GUI.ALIGN_TOP);
        this.ui.button[ ROOMBUTTON.PINKSMILE ].addControl( pinkSmileText );
        
        // attach topwrapper
        setContainerInfo( this.ui.wrapper[ ROOMWRAPPER.TOP ], 0, 0, 1, px(150), GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        this.ui.wrapper[ ROOMWRAPPER.TOP ].addControl( this.ui.button[ ROOMBUTTON.PINKSMILE ] );
        this.ui.wrapper[ ROOMWRAPPER.TOP ].addControl( this.ui.button[ ROOMBUTTON.SMILE ] );


        // topright =======================================================================================================================

        // setting
        this.ui.button[ ROOMBUTTON.SETTING ] = GUI.CreateButton(GUI.ButtonName.mainSetting, px(-12), px(90), px(40), px(40), ASSET_URL+"97_gui_new/00_main/resolution/m_option_ibtn.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP);
        this.ui.button[ ROOMBUTTON.SETTING ].onPointerUpObservable.add(function()
        {
            Debug.information();

            if ( self.ui.button[ ROOMBUTTON.DEBUGCAMERA ].parent == null )
                self.ui.wrapper.addControl( self.ui.button[ ROOMBUTTON.DEBUGCAMERA ] );
            else
                self.ui.wrapper.removeControl( self.ui.button[ ROOMBUTTON.DEBUGCAMERA ] );
        });

        // fullScreen
        this.ui.button[ ROOMBUTTON.FULLSCREEN ] = GUI.CreateButton( "fullscreenBtn", px(-65), px(90), px(40), px(40), ASSET_URL+"97_gui_new/00_main/resolution/btn_full.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        this.ui.button[ ROOMBUTTON.FULLSCREEN ].onPointerUpObservable.add( function()
        {
            launchJSFullScreen();
        });

        // hideui
        this.ui.button[ ROOMBUTTON.HIDEUI ] = GUI.CreateButton( "hideuiBtn", px(-65), px(90), px(40), px(40), ASSET_URL+"97_gui_new/00_main/resolution/btn_full.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        this.ui.button[ ROOMBUTTON.HIDEUI ].onPointerUpObservable.add( function()
        {
            launchJSFullScreen();
        });

        // camera
        this.ui.button[ ROOMBUTTON.CAMERA ] = GUI.CreateButton( "cameraBtn", px(-65), px(90), px(40), px(40), ASSET_URL+"97_gui_new/00_main/resolution/btn_full.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        this.ui.button[ ROOMBUTTON.CAMERA ].onPointerUpObservable.add( function()
        {
            launchJSFullScreen();
        });

        // attach toprightwrapper
        setContainerInfo( this.ui.wrapper[ ROOMWRAPPER.RIGHTTOP ], 0, 0, px(100), px(400), GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        this.ui.wrapper[ ROOMWRAPPER.RIGHTTOP ].addControl( this.ui.button[ ROOMBUTTON.FULLSCREEN ] );
        this.ui.wrapper[ ROOMWRAPPER.RIGHTTOP ].addControl( this.ui.button[ ROOMBUTTON.SETTING ] );



        /// right ==========================================================================================================================

        this.ui.button[ ROOMBUTTON.SQ_CREATE ] = GUI.CreateCircleButton(GUI.ButtonName.mainSocialCreate, px(-8), px(-80), px(66), px(66), ASSET_URL+"97_gui_new/00_main/resolution/m_profile_icon.png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE, true, "white", false);

        this.ui.button[ ROOMBUTTON.SQ_CONSUME ] = GUI.CreateCircleButton(GUI.ButtonName.mainSocialConsume, px(-8), px(0), px(66), px(66), ASSET_URL+"97_gui_new/00_main/resolution/m_profile_icon.png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE, true, "white", false);

        this.ui.button[ ROOMBUTTON.SQ_SHARE ] = GUI.CreateCircleButton(GUI.ButtonName.mainSocialShare, px(-8), px(80), px(66), px(66), ASSET_URL+"97_gui_new/00_main/resolution/m_profile_icon.png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE, true, "white", false);
        
        // attach rightwrapper
        setContainerInfo( this.ui.wrapper[ ROOMWRAPPER.RIGHT ], 0, 0, px(100), px(300), GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        this.ui.wrapper[ ROOMWRAPPER.RIGHT ].addControl( this.ui.button[ ROOMBUTTON.SQ_CREATE ] );
        this.ui.wrapper[ ROOMWRAPPER.RIGHT ].addControl( this.ui.button[ ROOMBUTTON.SQ_CONSUME ] );
        this.ui.wrapper[ ROOMWRAPPER.RIGHT ].addControl( this.ui.button[ ROOMBUTTON.SQ_SHARE ] );


        /// bottom ==========================================================================================================================
        
        this.ui.button[ ROOMBUTTON.AVATAR ] = GUI.CreateButton(GUI.ButtonName.mainAvatar, px(-143), px(-5), px(69), px(69), ASSET_URL+"97_gui_new/00_main/resolution/m_ava_btn.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM);

        this.ui.button[ ROOMBUTTON.STORE ] = GUI.CreateButton(GUI.ButtonName.mainShop, px(-71), px(-5), px(69), px(69), ASSET_URL+"97_gui_new/00_main/resolution/m_home_btn.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM);

        this.ui.button[ ROOMBUTTON.SNS ] = GUI.CreateButton(GUI.ButtonName.mainGame, px(0), px(-5), px(69), px(69), ASSET_URL+"97_gui_new/00_main/resolution/m_sns_btn_idle.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM);
        this.ui.button[ ROOMBUTTON.SNS ].onPointerUpObservable.add(function() 
        {
            snsCommonFunc.snsView(0);
        });

        this.ui.button[ ROOMBUTTON.CHAT ] = GUI.CreateButton(GUI.ButtonName.mainGame, px(71), px(-5), px(69), px(69), ASSET_URL+"97_gui_new/00_main/resolution/m_chat_btn.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM);
        this.ui.button[ ROOMBUTTON.CHAT ].onPointerUpObservable.add(function() 
        {
            var getSceneNameToString = function()
            {
                var name = G.sceneMgr.getCurrentSceneName();
        
                var resultString = "";
                switch( name )
                {
                    case 'SCENE_MYROOM' : resultString = "내 집";  break;
                    case 'SCENE_BEACH' : resultString = "해변가 스팟"; break;
                    case 'SCENE_MYFRIENDROOM' : resultString = "친구네 집";  break;
                }
        
                
                resultString += " (" + 1 + ")";
        
                return resultString;
            }

            snsCommonFunc.snsView(17, getSceneNameToString() );/*채팅장소 chat (유저수)*/
        });

        this.ui.button[ ROOMBUTTON.SPOT ] = GUI.CreateButton(GUI.ButtonName.mainGame, px(143), px(-5), px(69), px(69), ASSET_URL+"97_gui_new/00_main/resolution/m_spot_btn.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM);
        this.ui.button[ ROOMBUTTON.SPOT ].onPointerUpObservable.add(function() 
        {            
            FSocialSpot.getInstance().openSocialSpotListPopup();

        });

        this.ui.button[ ROOMBUTTON.SHARE ] = GUI.CreateButton(GUI.ButtonName.mainGame, px(290), px(-165), px(109), px(109), ASSET_URL+"97_gui_new/00_main/sharebtn.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM);
        this.ui.button[ ROOMBUTTON.SHARE ].onPointerUpObservable.add(function() 
        {            
            snsCommonFunc.snsView(15);
        });
        this.ui.button[ ROOMBUTTON.SHARE ].isVisible = false;

        // attach bottomwrapper
        setContainerInfo( this.ui.wrapper[ ROOMWRAPPER.BOTTOM ], 0, 0, 1, px(80), GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        this.ui.wrapper[ ROOMWRAPPER.BOTTOM ].addControl( this.ui.button[ ROOMBUTTON.AVATAR ] );
        this.ui.wrapper[ ROOMWRAPPER.BOTTOM ].addControl( this.ui.button[ ROOMBUTTON.STORE ] );
        this.ui.wrapper[ ROOMWRAPPER.BOTTOM ].addControl( this.ui.button[ ROOMBUTTON.SNS ] );
        this.ui.wrapper[ ROOMWRAPPER.BOTTOM ].addControl( this.ui.button[ ROOMBUTTON.CHAT ] );
        this.ui.wrapper[ ROOMWRAPPER.BOTTOM ].addControl( this.ui.button[ ROOMBUTTON.SPOT ] );
        this.ui.wrapper[ ROOMWRAPPER.BOTTOM ].addControl( this.ui.button[ ROOMBUTTON.SHARE ] );


        /// debug
        var cameraInfoStr = "X : " + G.camera.target.x +
                            "\nZ : " + G.camera.target.z + 
                            "\nAlpha(좌우각)\t: " + G.camera.alpha +
                            "\nBeta(상하각)\t: " + G.camera.beta +
                            "\nDistance(줌)\t: " + G.camera.radius;
                            
        this.ui.button[ ROOMBUTTON.DEBUGCAMERA ] = GUI.CreateAutoLineFeedText( px(0), px(300), px(500), px(500), cameraInfoStr, "Black", 24, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        //this.ui.wrapper.addControl( this.ui.button[ ROOMBUTTON.DEBUGCAMERA ] );
    }

    FRoomUI.prototype.preloadUI = function()
    {
        var self = this;

        for ( var i = 0; i < ROOMBUTTON.MAX; ++i )
            this.ui.button[i] = null;

        // ui wrapper 분할
        //this.ui.wrapper = GUI.createContainer("mainUIWrapper");

        this.ui.wrapper = [];

        for ( var i = 0; i < ROOMWRAPPER.MAX; ++i )
            this.ui.wrapper.push( GUI.createContainer("mainUIWrapper_" + i.toString()) );


        // Profile ==========================================================================================================================
        var setContainerInfo = function( in_target, in_left, in_top, in_width, in_height, in_alignW, in_alignH )
        {
            in_target.left = in_left;
            in_target.top = in_top;

            in_target.width = in_width;
            in_target.height = in_height;

            in_target.horizontalAlignment = in_alignW;
            in_target.verticalAlignment = in_alignH;
        }

        this.ui.button[ ROOMBUTTON.PROFILE ] = GUI.CreateCircleButton(GUI.ButtonName.mainProfile, px(20), px(20), px(121), px(121), ASSET_URL+"97_gui_new/00_main/m_profile_icon.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP, true, "white", false);
        this.ui.button[ ROOMBUTTON.PROFILE ].onPointerUpObservable.add(function(){
    
            snsBtnOpen('타임라인');
    
        });
        
        
        // android survey
        this.ui.button[ ROOMBUTTON.ANDROID ] = GUI.CreateButton(GUI.ButtonName.mainQuest, px(20), px(150+15), px(121), px(122), ASSET_URL+"97_gui_new/00_main/btn_butler.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP);
        this.ui.button[ ROOMBUTTON.ANDROID ].onPointerUpObservable.add(function()
        {
            G.aiButlerManager.showSurveyUI();

            snsBtnClose();
        });

        // package
        this.ui.button[ ROOMBUTTON.PACKAGE ] = GUI.CreateButton(GUI.ButtonName.mainStarContents, px(33), px(280+20), px(94), px(97), ASSET_URL+"97_gui_new/00_main/room_button.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP);
        this.ui.button[ ROOMBUTTON.PACKAGE ].onPointerUpObservable.add( function()
        {            
            // FPackageShop.getInstance().openPopup();
            G.sceneMgr.addScene('SCENE_ROOMSTORE', new FSceneRoomStore());
            G.sceneMgr.changeScene('SCENE_ROOMSTORE', true);
        });

        // starContent
        this.ui.button[ ROOMBUTTON.STARCON ] = GUI.CreateButton(GUI.ButtonName.mainStarContents, px(33), px(380+25), px(87), px(87), ASSET_URL+"97_gui_new/00_main/btn_star_content.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP);
        this.ui.button[ ROOMBUTTON.STARCON ].onPointerUpObservable.add( function()
        {            
            // FExchangePopup.getInstance().openPopup();
            // test            
            FBytomExchange.getInstance().openPopup();
        });

        // attach profilewrapper
        setContainerInfo( this.ui.wrapper[ ROOMWRAPPER.PROFILE ], px(-250), 0, px(150), px(120+100+70+100+100), GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        this.ui.wrapper[ ROOMWRAPPER.PROFILE ].addControl( this.ui.button[ ROOMBUTTON.STARCON ] );
        this.ui.wrapper[ ROOMWRAPPER.PROFILE ].addControl( this.ui.button[ ROOMBUTTON.ANDROID ] );
        this.ui.wrapper[ ROOMWRAPPER.PROFILE ].addControl( this.ui.button[ ROOMBUTTON.PROFILE ] );
        this.ui.wrapper[ ROOMWRAPPER.PROFILE ].addControl( this.ui.button[ ROOMBUTTON.PACKAGE ] );


        // smile ==========================================================================================================================

        this.ui.button[ ROOMBUTTON.SMILE ] = GUI.CreateButton(GUI.ButtonName.mainStar, px(-90), px(10), px(215), px(71), ASSET_URL+"97_gui_new/00_main/m_smile_info.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP);
        
        var smileText = GUI.CreateText(px(-30), px(23), "Init", "#2d3742", 28, GUI.ALIGN_RIGHT, GUI.ALIGN_TOP);
        this.ui.button[ ROOMBUTTON.SMILE ].addControl( smileText );
        smileText.name = GUI.ButtonName.mainStar;

        // pink smile
        
        this.ui.button[ ROOMBUTTON.PINKSMILE ] = GUI.CreateButton(GUI.ButtonName.mainStar, px(-320), px(10), px(250), px(77), ASSET_URL+"97_gui_new/00_main/m_psmile_info.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP);
        
        var pinkSmileText = GUI.CreateText(px(-30), px(23), CommFunc.random( 50000 ).toString(), "#2d3742", 28, GUI.ALIGN_RIGHT, GUI.ALIGN_TOP);
        this.ui.button[ ROOMBUTTON.PINKSMILE ].addControl( pinkSmileText );

        
        // attach topwrapper
        setContainerInfo( this.ui.wrapper[ ROOMWRAPPER.TOP ], 0, px(-150), 1, px(80), GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        this.ui.wrapper[ ROOMWRAPPER.TOP ].addControl( this.ui.button[ ROOMBUTTON.PINKSMILE ] );
        this.ui.wrapper[ ROOMWRAPPER.TOP ].addControl( this.ui.button[ ROOMBUTTON.SMILE ] );


        // topright =======================================================================================================================

        // setting
        this.ui.button[ ROOMBUTTON.SETTING ] = GUI.CreateButton(GUI.ButtonName.mainSetting, px(-12), px(18), px(61), px(62), ASSET_URL+"97_gui_new/00_main/option.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP);
        this.ui.button[ ROOMBUTTON.SETTING ].onPointerUpObservable.add(function()
        {
            Debug.information();

            // if ( self.ui.button[ ROOMBUTTON.DEBUGCAMERA ].parent == null )
            //     self.ui.wrapper.addControl( self.ui.button[ ROOMBUTTON.DEBUGCAMERA ] );
            // else
            //     self.ui.wrapper.removeControl( self.ui.button[ ROOMBUTTON.DEBUGCAMERA ] );
        });

        // fullScreen
        this.ui.button[ ROOMBUTTON.FULLSCREEN ] = GUI.CreateButton( "fullscreenBtn", px(-12), px(100), px(61), px(61), ASSET_URL+"97_gui_new/00_main/btn_full.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        this.ui.button[ ROOMBUTTON.FULLSCREEN ].onPointerUpObservable.add( function()
        {
            launchJSFullScreen();
        });

        // camera
        this.ui.button[ ROOMBUTTON.CAMERA ] = GUI.CreateButton( "cameraBtn", px(-12), px(180), px(61), px(61), ASSET_URL+"97_gui_new/00_main/btn_view.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        this.ui.button[ ROOMBUTTON.CAMERA ].onPointerUpObservable.add( function()
        {
            G.cameraManager.setCameraBeta( ToRadians( self.cameraBetaSwitchInfo[ ++self.cameraBetaOffset % self.cameraBetaSwitchInfo.length ] ) );
        });

        // hideui
        this.ui.button[ ROOMBUTTON.HIDEUI ] = GUI.CreateButton( "hideuiBtn", px(-12), px(250), px(61), px(61), ASSET_URL+"97_gui_new/00_main/btn_hide.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        this.ui.button[ ROOMBUTTON.HIDEUI ].onPointerUpObservable.add( function()
        {
            if ( self.ui.isHided )
                GUI.showMainUI();
            else
                GUI.hideMainUI();

            self.ui.isHided = !self.ui.isHided;
        });

        
        // attach topwrapper
        setContainerInfo( this.ui.wrapper[ ROOMWRAPPER.RIGHTTOP ], 0, px(-245), px(100), px(350), GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        this.ui.wrapper[ ROOMWRAPPER.RIGHTTOP ].addControl( this.ui.button[ ROOMBUTTON.FULLSCREEN ] );
        this.ui.wrapper[ ROOMWRAPPER.RIGHTTOP ].addControl( this.ui.button[ ROOMBUTTON.SETTING ] );
        this.ui.wrapper[ ROOMWRAPPER.RIGHTTOP ].addControl( this.ui.button[ ROOMBUTTON.HIDEUI ] );
        this.ui.wrapper[ ROOMWRAPPER.RIGHTTOP ].addControl( this.ui.button[ ROOMBUTTON.CAMERA ] );



        /// right ==========================================================================================================================

        this.ui.button[ ROOMBUTTON.SQ_CREATE ] = GUI.CreateCircleButton(GUI.ButtonName.mainSocialCreate, px(-20), px(-150), px(121), px(121), ASSET_URL+"97_gui_new/00_main/m_profile_icon.png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE, true, "white", false);

        this.ui.button[ ROOMBUTTON.SQ_CONSUME ] = GUI.CreateCircleButton(GUI.ButtonName.mainSocialConsume, px(-20), px(0), px(121), px(121), ASSET_URL+"97_gui_new/00_main/m_profile_icon.png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE, true, "white", false);

        this.ui.button[ ROOMBUTTON.SQ_SHARE ] = GUI.CreateCircleButton(GUI.ButtonName.mainSocialShare, px(-20), px(150), px(121), px(121), ASSET_URL+"97_gui_new/00_main/m_profile_icon.png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE, true, "white", false);
        
        // attach rightwrapper
        setContainerInfo( this.ui.wrapper[ ROOMWRAPPER.RIGHT ], px(250), 0, px(150), px(450), GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        this.ui.wrapper[ ROOMWRAPPER.RIGHT ].addControl( this.ui.button[ ROOMBUTTON.SQ_CREATE ] );
        this.ui.wrapper[ ROOMWRAPPER.RIGHT ].addControl( this.ui.button[ ROOMBUTTON.SQ_CONSUME ] );
        this.ui.wrapper[ ROOMWRAPPER.RIGHT ].addControl( this.ui.button[ ROOMBUTTON.SQ_SHARE ] );


        /// bottom ==========================================================================================================================
        
        this.ui.button[ ROOMBUTTON.AVATAR ] = GUI.CreateButton(GUI.ButtonName.mainAvatar, px(-275), px(-20), px(121), px(121), ASSET_URL+"97_gui_new/00_main/m_ava_btn_idle.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM);

        this.ui.button[ ROOMBUTTON.STORE ] = GUI.CreateButton(GUI.ButtonName.mainShop, px(-140), px(-20), px(121), px(121), ASSET_URL+"97_gui_new/00_main/btn_store.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM);

        this.ui.button[ ROOMBUTTON.SNS ] = GUI.CreateButton(GUI.ButtonName.mainGame, px(0), px(-20), px(125), px(125), ASSET_URL+"97_gui_new/00_main/m_sns_btn_idle.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM);
        this.ui.button[ ROOMBUTTON.SNS ].onPointerUpObservable.add(function() 
        {
            snsCommonFunc.snsView(0);
        });

        this.ui.button[ ROOMBUTTON.CHAT ] = GUI.CreateButton(GUI.ButtonName.mainGame, px(140), px(-20), px(121), px(121), ASSET_URL+"97_gui_new/00_main/m_chat_btn_idle.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM);
        this.ui.button[ ROOMBUTTON.CHAT ].onPointerUpObservable.add(function() 
        {
            var getSceneNameToString = function()
            {
                var name = G.sceneMgr.getCurrentSceneName();
        
                var resultString = "";
                switch( name )
                {
                    case 'SCENE_MYROOM' : resultString = "내 집";  break;
                    case 'SCENE_BEACH' : resultString = "해변가 스팟"; break;
                    case 'SCENE_MYFRIENDROOM' : resultString = "친구네 집";  break;
                }
        
                
                resultString += " (" + 1 + ")";
        
                return resultString;
            }

            snsCommonFunc.snsView(17, getSceneNameToString() );/*채팅장소 chat (유저수)*/
        });

        this.ui.button[ ROOMBUTTON.SPOT ] = GUI.CreateButton(GUI.ButtonName.mainGame, px(275), px(-20), px(121), px(121), ASSET_URL+"97_gui_new/00_main/m_spot_btn_idle.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM);
        this.ui.button[ ROOMBUTTON.SPOT ].onPointerUpObservable.add(function() 
        {            
            FSocialSpot.getInstance().openSocialSpotListPopup();

        });

        this.ui.button[ ROOMBUTTON.SHARE ] = GUI.CreateButton(GUI.ButtonName.mainGame, px(275), px(-165), px(109), px(109), ASSET_URL+"97_gui_new/00_main/sharebtn.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM);
        this.ui.button[ ROOMBUTTON.SHARE ].onPointerUpObservable.add(function() 
        {            
            snsCommonFunc.snsView(15);
        });
        this.ui.button[ ROOMBUTTON.SHARE ].isVisible = false;

        // attach bottomwrapper
        setContainerInfo( this.ui.wrapper[ ROOMWRAPPER.BOTTOM ], 0, px(200), 1, px(300), GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        this.ui.wrapper[ ROOMWRAPPER.BOTTOM ].addControl( this.ui.button[ ROOMBUTTON.AVATAR ] );
        this.ui.wrapper[ ROOMWRAPPER.BOTTOM ].addControl( this.ui.button[ ROOMBUTTON.STORE ] );
        this.ui.wrapper[ ROOMWRAPPER.BOTTOM ].addControl( this.ui.button[ ROOMBUTTON.SNS ] );
        this.ui.wrapper[ ROOMWRAPPER.BOTTOM ].addControl( this.ui.button[ ROOMBUTTON.CHAT ] );
        this.ui.wrapper[ ROOMWRAPPER.BOTTOM ].addControl( this.ui.button[ ROOMBUTTON.SPOT ] );
        this.ui.wrapper[ ROOMWRAPPER.BOTTOM ].addControl( this.ui.button[ ROOMBUTTON.SHARE ] );


        /// debug
        var cameraInfoStr = "X : " + G.camera.target.x +
                            "\nZ : " + G.camera.target.z + 
                            "\nAlpha(좌우각)\t: " + G.camera.alpha +
                            "\nBeta(상하각)\t: " + G.camera.beta +
                            "\nDistance(줌)\t: " + G.camera.radius;
                            
        this.ui.button[ ROOMBUTTON.DEBUGCAMERA ] = GUI.CreateAutoLineFeedText( px(0), px(300), px(500), px(500), cameraInfoStr, "Black", 24, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        //this.ui.wrapper.addControl( this.ui.button[ ROOMBUTTON.DEBUGCAMERA ] );

        //FPopup.openAnimation( this.ui.wrapper, undefined, 1, true, 1 );
    }

    

    FRoomUI.prototype.setUIVisible = function( in_uiVisible )
    {
        for ( var i = 0; i < ROOMWRAPPER.MAX; ++i )
        {
            if ( in_uiVisible && (this.ui.wrapper[i].parent == null) )
                G.guiMain.addControl( this.ui.wrapper[i], GUI.LAYER.MAIN );
            else 
                G.guiMain.removeControl( this.ui.wrapper[i] );
        }
    }

    FRoomUI.prototype.setProfileImage = function( in_profileImageURL )
    {
        var self = this;
        // change profile button image
        GUI.changeButtonImage( this.ui.button[ ROOMBUTTON.PROFILE ].getChildByName( "inner" ).getChildByName( GUI.ButtonName.mainProfile ), 
            CLIENT_DOMAIN + "/fileupload/myprofile/profile_default.png" );
        setTimeout( function()
        {
            GUI.changeButtonImage( self.ui.button[ ROOMBUTTON.PROFILE ].getChildByName( "inner" ).getChildByName( GUI.ButtonName.mainProfile ), in_profileImageURL );            
        }, 500 );
    }

    FRoomUI.prototype.setSQImage = function( in_imageURLList )
    {
        GUI.changeButtonImage( this.ui.button[ ROOMBUTTON.SQ_CREATE ].getChildByName( "inner" ).getChildByName( GUI.ButtonName.mainSocialCreate ), 
            in_imageURLList[0] );
        
        GUI.changeButtonImage( this.ui.button[ ROOMBUTTON.SQ_CONSUME ].getChildByName( "inner" ).getChildByName( GUI.ButtonName.mainSocialConsume ), 
            in_imageURLList[1] );

        GUI.changeButtonImage( this.ui.button[ ROOMBUTTON.SQ_SHARE ].getChildByName( "inner" ).getChildByName( GUI.ButtonName.mainSocialShare ), 
            in_imageURLList[2] );
    }

    FRoomUI.prototype.changeButtonImage = function( in_changeButtonIndex, in_changeImageURL )
    {
        switch( in_changeButtonIndex )
        {
        case ROOMBUTTON.SQ_CREATE :        
                GUI.changeButtonImage( this.ui.button[ in_changeButtonIndex ].getChildByName( "inner" ).getChildByName( GUI.ButtonName.mainSocialCreate ), 
                    in_changeImageURL );
                break;
        case ROOMBUTTON.SQ_CONSUME :
                GUI.changeButtonImage( this.ui.button[ in_changeButtonIndex ].getChildByName( "inner" ).getChildByName( GUI.ButtonName.mainSocialConsume ), 
                        in_changeImageURL );
                break;
        case ROOMBUTTON.SQ_SHARE :
            {
                GUI.changeButtonImage( this.ui.button[ in_changeButtonIndex ].getChildByName( "inner" ).getChildByName( GUI.ButtonName.mainSocialShare ), 
                    in_changeImageURL );
            }
            break;

        default :
            {
                GUI.changeButtonImage( this.ui.button[ in_changeButtonIndex ], in_changeImageURL );
            }
            break;

        }
    }

    FRoomUI.prototype.setSmileMarkCount = function( in_smileMarkCount )
    {
        // set smileMark Count text 

        this.ui.button[ ROOMBUTTON.SMILE ].getChildByName( GUI.ButtonName.mainStar ).text = in_smileMarkCount;
    }

    FRoomUI.prototype.applyUIButtonOpt = function( in_infoList/*[ [ btnIndex, visible, callback ], [ btnIndex, visible, callback ], ... ]*/)
    {
        for ( var i = 0; i < in_infoList.length; ++i )
        {
            this.applyButtonInfo( in_infoList[i][0], in_infoList[i][1], in_infoList[i][2] );
        }
    }

    FRoomUI.prototype.applyButtonInfo = function( in_buttonIndex, in_visible, in_callback )
    {
        this.ui.button[ in_buttonIndex ].isVisible = in_visible;

        this.ui.button[ in_buttonIndex ].onPointerUpObservable.clear();
        this.ui.button[ in_buttonIndex ].onPointerUpObservable.add( function()
        {
            if ( in_callback != null)
                in_callback();
        });
    }

    FRoomUI.prototype.refreshSQAlertIcon = function()
    {
        var self = this;

        if ( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).canGetRewardSocialQuest( SQtype.PRODUCE ) )
        {
            var beforeSQCreateAlert = self.ui.wrapper[ROOMWRAPPER.RIGHT].getChildByName( GUI.ButtonName.mainSocialCreate+"alert" );
            if ( beforeSQCreateAlert != null )
                self.ui.wrapper[ROOMWRAPPER.RIGHT].removeControl( beforeSQCreateAlert );

            var producealert = GUI.CreateImage( GUI.ButtonName.mainSocialCreate+"alert", px(-5), px(-150-35), px(65), px(65), SOCIAL_QUEST_UI_PATH+"alert.png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE);
            self.ui.wrapper[ROOMWRAPPER.RIGHT].addControl( producealert );
            FPopup.openAnimation( producealert, undefined, 1.0, true, 2 );
            
            self.ui.button[ ROOMBUTTON.SQ_CREATE ].onPointerUpObservable.add( function(){ 
                self.ui.wrapper[ROOMWRAPPER.RIGHT].removeControl( producealert );
            } );
        }

        if ( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).canGetRewardSocialQuest( SQtype.CONSUME ) )
        {            
            var beforeSQConsumeAlert = self.ui.wrapper[ROOMWRAPPER.RIGHT].getChildByName( GUI.ButtonName.mainSocialConsume+"alert" );
            if ( beforeSQConsumeAlert != null )
                self.ui.wrapper[ROOMWRAPPER.RIGHT].removeControl( beforeSQConsumeAlert );

            var consumealert = GUI.CreateImage( GUI.ButtonName.mainSocialConsume+"alert", px(-5), px(-35), px(65), px(65), SOCIAL_QUEST_UI_PATH+"alert.png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE);
            this.ui.wrapper[ROOMWRAPPER.RIGHT].addControl( consumealert );
            FPopup.openAnimation( consumealert, undefined, 1.0, true, 2 );
            
            this.ui.button[ ROOMBUTTON.SQ_CONSUME ].onPointerUpObservable.add( function(){ 
                self.ui.wrapper[ROOMWRAPPER.RIGHT].removeControl( consumealert );
            } );
        }

        if ( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).canGetRewardSocialQuest( SQtype.SHARE ) )
        {
            var beforeSQShareAlert = self.ui.wrapper[ROOMWRAPPER.RIGHT].getChildByName( GUI.ButtonName.mainSocialShare+"alert" );
            if ( beforeSQShareAlert != null )
                self.ui.wrapper[ROOMWRAPPER.RIGHT].removeControl( beforeSQShareAlert );

            var sharealert = GUI.CreateImage( GUI.ButtonName.mainSocialShare+"alert", px(-5), px(150-35), px(65), px(65), SOCIAL_QUEST_UI_PATH+"alert.png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE);
            this.ui.wrapper[ROOMWRAPPER.RIGHT].addControl( sharealert );
            FPopup.openAnimation( sharealert, undefined, 1.0, true, 2 );
            
            this.ui.button[ ROOMBUTTON.SQ_SHARE ].onPointerUpObservable.add( function(){ 
                self.ui.wrapper[ROOMWRAPPER.RIGHT].removeControl( sharealert );
            } );
        }
    }

    FRoomUI.prototype.clearSQAlertIcon = function()
    {
        var alertProduce = this.ui.wrapper[ROOMWRAPPER.RIGHT].getChildByName( GUI.ButtonName.mainSocialCreate+"alert" );
        if ( alertProduce )
            this.ui.wrapper[ROOMWRAPPER.RIGHT].removeControl( alertProduce );
            
        var alertConsume = this.ui.wrapper[ROOMWRAPPER.RIGHT].getChildByName( GUI.ButtonName.mainSocialConsume+"alert" );
        if ( alertConsume )
            this.ui.wrapper[ROOMWRAPPER.RIGHT].removeControl( alertConsume );

        var alertShare = this.ui.wrapper[ROOMWRAPPER.RIGHT].getChildByName( GUI.ButtonName.mainSocialShare+"alert" );
        if ( alertShare )
            this.ui.wrapper[ROOMWRAPPER.RIGHT].removeControl( alertShare );
    }



    //
    // singleton pattern
    //
    var instance;
    return {
        getInstance : function()
        {
            if ( null == instance )
            {
                instance = new FRoomUI();
                instance.constructor = null;
            }

            return instance;
        }
    };
}());


var FRoom = (function () {

    __inherit(FRoom, FScene);

    function FRoom() {

        var self = this;
        
        this.preBeta = null;
        this.preRadius = 0;
        this.topCamera = 0;

        this.objMgr = null;

        this.myAvatar = null;
        this.myPet    = null;
        this.android  = null;

        this.myCamera = null;

        return self;
    }
 
    FRoom.prototype.init = function () {
        FScene.prototype.init.call(this);
    }

    FRoom.prototype.destroy = function () {

        if(this.objMgr) this.objMgr.dispose();

        this.detachCamera();

        if(this.android) this.android.destroy();
        this.android = null;

        if(this.myAvatar) this.myAvatar.destroy();
        this.myAvatar = null;
        
        if(this.myPet) this.myPet.destroy();
        this.myPet = null;

        FScene.prototype.destroy.call(this);
    }

    FRoom.prototype.setLight = function() {

        var light = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, -4, -3), G.scene);
        light.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
        light.specular = new BABYLON.Color3(0.4, 0.4, 0.4);
        light.position = new BABYLON.Color3(0, 0, 0);
        light.intensity = 1.0;
    
        var light = new BABYLON.HemisphericLight("Hemispheric", new BABYLON.Vector3(0, 2, 0), G.scene);
        light.intensity = 1.8;
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.specular = new BABYLON.Color3(0.3, 0.3, 0.3);

        var light = new BABYLON.HemisphericLight("Hemispheric", new BABYLON.Vector3(0, -2, 0), G.scene);
        light.intensity = 0.8;
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.specular = new BABYLON.Color3(0.0, 0.0, 0.0);

    }
    
    FRoom.prototype.initCameraLimit = function() {
        G.camera.lowerBetaLimit = 0.1;
        G.camera.upperBetaLimit = (Math.PI / 2) * 0.99;
        G.camera.lowerRadiusLimit = 15;
        G.camera.upperRadiusLimit = 970;//300;
    }

    FRoom.prototype.loadRoomMesh = function(roomID, backID, callback) {

        if(backID != null) {
            G.resManager.getLoadGroupMesh(backID, this, null, function(newMeshes, particleSystems, skeletons, self, pparam){
                self.addMesh(newMeshes);
                self.setVisible(true);
            });
        }

        if(roomID != null) {
            G.resManager.getLoadGroupMesh(roomID, this, null, function(newMeshes, particleSystems, skeletons, self, pparam){
                self.addMesh(newMeshes);
                self.setVisible(true);
                // self.loadRoomObjects(roomType);
                if(callback) callback();
            });
        }
    }

    FRoom.prototype.initSceneCamera = function() {

        G.scene.clearColor = new BABYLON.Color3(1,1,1);

        if(!this.isPhone) {
            G.camera = new BABYLON.ArcRotateCamera(this.getName() + '_ArcCamera', ToRadians(270), ToRadians(70), 970, BABYLON.Vector3.Zero(), G.scene);
            // G.camera.setTarget(new BABYLON.Vector3(-1,0,-21));
            // G.camera.setPosition(new BABYLON.Vector3(-1,27,-90));
        } else {
            G.camera = new BABYLON.ArcRotateCamera(this.getName() + '_ArcCamera', 0, 0, 900, BABYLON.Vector3.Zero(), G.scene);
            // G.camera.setPosition(new BABYLON.Vector3(17,40,-93));
            // G.camera.setTarget(new BABYLON.Vector3(-12,0,-10));
        }


        G.scene.activeCamera = G.camera;

        G.camera.minZ = 1;
        G.camera.maxZ = 5000;//400;
        

        G.camera.inputs.clear();  // Remove all previous inputs

        this.myCamera = new FMyArcRotateCameraPointersInput(1,0,1,0.3);
        G.camera.inputs.add( this.myCamera );

        this.attachCamera();
        // G.eventManager.setEnableTouched("myRoomArcCamera", this.myCamera);


        window.addEventListener("contextmenu", function (evt){	evt.preventDefault();});
        G.camera.attachControl(G.canvas, true); 



        this.initCameraLimit();
        this.setLight();
    }

    FRoom.prototype.detachCamera = function() {

        if(this.myCamera == null) {
            console.log('FSceneMyRoom.prototype.detachCamera : myCamera == null');
            return;
        }

        G.camera.detachControl(G.canvas);
        G.eventManager.clearEnableTouched(this.getName() + "ArcCamera");
    }

    FRoom.prototype.attachCamera = function() {

        if(this.myCamera == null) {
            console.log('FSceneMyRoom.prototype.attachCamera : myCamera == null');
            return;
        }

        G.eventManager.setEnableTouched(this.getName() + "ArcCamera", this.myCamera);
        G.camera.attachControl(G.canvas, true); 
    }

    FRoom.prototype.loadRoomObjects = function(roomType) {

        // this.objMgr = new FObjectMgr('FSceneMyRoomObject', roomType);
        // this.objMgr.createRoomObject();
        // this.objMgr.render();
    }

    FRoom.prototype.loadBackground = function() {

        this.background = new BABYLON.Layer("fore0", ASSET_URL+"99_Images/background.png", G.scene);
    }

    FRoom.prototype.run = function() {
        if(this.objMgr != null) this.objMgr.run();        
    }

    FRoom.prototype.createMyAvatar = function(pos, callback) {

        var self = this;

        this.myAvatar = new FRoomCharactor(1,'mychar');

        var cd = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).avatarCd;
        var avatarInfo = G.resManager.getAvatarCode(cd);

        this.myAvatar.setProfile(G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getUrl(), null);
        this.myAvatar.setPk(G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getAccountPk());
        this.myAvatar.setTileIndex(pos);
        this.myAvatar.createAvatar(avatarInfo, function() {
            if(self.myAvatar) self.myAvatar.initRoomCharactor(true);
            if(callback) callback();
        });
    }

    FRoom.prototype.createAndroid = function(callback) {

        var self = this;
        var pos = FMapManager.getInstance().getAvatarStartPos() + FMapManager.getInstance().getTileWidth()*(-10);

        this.android = new FRoomCharactor(0,'android');
        this.android.setJustWalk(true);
        this.android.setTileIndex(pos);
        this.android.createPet(OBJ_ANDROID, function(){
            if(self.android) self.android.initRoomCharactor(false);
            if(self.android) self.android.equipAlphaGo(false, false, self.myAvatar);
            if(callback) callback();
        });
    
    }

    FRoom.prototype.createPet = function(callback) {

        var self = this;
        var pos = FMapManager.getInstance().getAvatarStartPos() + FMapManager.getInstance().getTileWidth()*(-10);

        this.myPet = new FRoomCharactor(0,'myPet');
        this.myPet.setJustWalk(true);
        this.myPet.setTileIndex(pos);
        this.myPet.createPet(OBJ_CAT, function(){
            if(self.myPet) self.myPet.initRoomCharactor(false);
            if(self.myPet) self.myPet.equipAlphaGo(false, false, self.myAvatar);
            if(callback) callback();
        });
    }


    FRoom.prototype.getMyAvatar = function() {
        return this.myAvatar;
    }


    FRoom.prototype.SetCameraTopView = function() {

        this.topCamera = 1 - this.topCamera;

        if(this.topCamera) {

            this.animationTopCamera(this.topCamera);
        }
        else {

            this.animationTopCamera(this.topCamera);

            this.initCameraLimit();
        }
    }

    FRoom.prototype.animationTopCamera = function(bTop) {
        var frameRate = 1;

        var beta = new BABYLON.Animation("beta", "beta", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keyFramesB = []; 
        
        keyFramesB.push({
            frame: 0,
            value: G.camera.beta
        });
    
        keyFramesB.push({
            frame: frameRate,
            value: 0
        });
    
        keyFramesB.push({
            frame: frameRate * 2,
            value: G.camera.beta
        });

        keyFramesB.push({
            frame: frameRate * 3,
            value: this.preBeta
        });

        beta.setKeys(keyFramesB);

        if(bTop) {
            this.preBeta = G.camera.beta;
            G.scene.beginDirectAnimation(G.camera, [beta], 0, frameRate, false);
        }
        else {
            G.scene.beginDirectAnimation(G.camera, [beta], frameRate*2, frameRate*3, false);
        }
            
    }

    FRoom.prototype.animationRadius = function(b) {

        if(b) {
            if(G.camera.radius <= INTERIAL_CAMERA_RADIUS) return;
            this.preRadius = G.camera.radius;
        } else {

        }
        

        var frameRate = 1;

        var radius = new BABYLON.Animation("radius", "radius", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keyFramesB = []; 
        
        keyFramesB.push({
            frame: 0,
            value: G.camera.radius
        });
    
        keyFramesB.push({
            frame: frameRate,
            value: INTERIAL_CAMERA_RADIUS
        });
    
        keyFramesB.push({
            frame: frameRate * 2,
            value: G.camera.radius
        });

        keyFramesB.push({
            frame: frameRate * 3,
            value: this.preRadius
        });

        radius.setKeys(keyFramesB);

        if(b)
            G.scene.beginDirectAnimation(G.camera, [radius], 0, frameRate, false);
        else
            G.scene.beginDirectAnimation(G.camera, [radius], frameRate*2, frameRate*3, false);
    }

    FRoom.prototype.animationRotationCamera = function() {

        // G.camera.setPosition(new Vector3(G.camera.position.x+1, G.camera.position.y, G.camera.position.z));
        // console.log(G.camera.target);


        var frameRate = 1;
        var alpha = new BABYLON.Animation("alpha", "alpha", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keyFramesA = []; 

        keyFramesA.push({
            frame: 0,
            value: G.camera.alpha
        });

        keyFramesA.push({
            frame: frameRate,
            value: G.camera.alpha + ToRadians(90)
        });

        alpha.setKeys(keyFramesA);
        G.scene.beginDirectAnimation(G.camera, [alpha], 0, frameRate, false);
    }

    FRoom.prototype.renderMyProfile = function(wrapGui) {
        var myProfile = GUI.CreateCircleButton(GUI.ButtonName.mainProfile, px(20), px(20), px(110), px(110), G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getUrl(), GUI.ALIGN_LEFT, GUI.ALIGN_TOP, true, "white", false);
        myProfile.onPointerUpObservable.add(function(){
    
            snsBtnOpen('타임라인');
    
        });
        wrapGui.addControl(myProfile);
    
        return myProfile;
    }


    FRoom.prototype.onKeyUp = function (evt) {

        if(evt.code == 'ArrowUp') {
            var mgr = FMapManager.getInstance();
            mgr.addStartY();

            this.clearGrid();
            this.drawGrid();
        }
    }

    FRoom.prototype.onKeyDown = function(evt) {

        if(evt.code == 'ArrowDown') {

            var mgr = FMapManager.getInstance();
            mgr.subStartY();

            this.clearGrid();
            this.drawGrid();
        }
    }
    
    FRoom.prototype.drawGrid = function() {
        var mgr = FMapManager.getInstance();
        var start = mgr.start;
        var endx = start.x + mgr.tile_width*mgr.TILE_SIZE;
        var endz = start.z + mgr.tile_height*mgr.TILE_SIZE;
        // CommRender.DrawGridLine(start.x, endx, start.z, endz, 0.1, mgr.TILE_SIZE);

        CommRender.DrawGridLine(start.x, endx, start.z, endz, mgr.start.y+0.1, mgr.TILE_SIZE,new Color3(0.0,1.0,0.0));
    }


    FRoom.prototype.drawRealTileGrid = function() {
        
        var mgr = FMapManager.getInstance();

        // var width = e.x - s.x;
        // var height = e.y - s.y;

        // var endx = start.x + width*mgr.TILE_SIZE;
        // var endz = start.z + height*mgr.TILE_SIZE;

        // var rstart = new Vector3(-(width/2)*mgr.TILE_SIZE, 0, -(height/2)*mgr.TILE_SIZE);

        var pos1 = FMapManager.getInstance().getIndexToWorld(mgr.realStart);
        var pos2 = FMapManager.getInstance().getIndexToWorld(mgr.realEnd);

        var spos = new Vector3(pos1.x, mgr.start.y+1.0, pos1.z);
        var epos = new Vector3(pos2.x, mgr.start.y+1.0, pos1.z)
        CommRender.DrawLine(spos, epos, new Color3(1.0,0.0,0.0));

        var spos = new Vector3(pos2.x, mgr.start.y+1.0, pos1.z);
        var epos = new Vector3(pos2.x, mgr.start.y+1.0, pos2.z)
        CommRender.DrawLine(spos, epos, new Color3(1.0,0.0,0.0));

        var spos = new Vector3(pos2.x, mgr.start.y+1.0, pos2.z);
        var epos = new Vector3(pos1.x, mgr.start.y+1.0, pos2.z)
        CommRender.DrawLine(spos, epos, new Color3(1.0,0.0,0.0));

        var spos = new Vector3(pos1.x, mgr.start.y+1.0, pos2.z);
        var epos = new Vector3(pos1.x, mgr.start.y+1.0, pos1.z)
        CommRender.DrawLine(spos, epos, new Color3(1.0,0.0,0.0));
        // CommRender.DrawGridLine(start.x+rstart.x, endx, start.z+rstart.z, endz, mgr.start.y+0.2, mgr.TILE_SIZE,new Color3(1.0,0.0,0.0));
    }

    

    FRoom.prototype.clearGrid = function() {
        CommRender.ClearGridLine();
    }


    FRoom.prototype.renderAdScreenVideo = function(url, name) {

        if(!url) return;

        var screen = G.scene.getMeshByName(name);

        if(!screen) return;
        this.textureDispose(name);

        var mat = new BABYLON.StandardMaterial("mat", G.scene);
        var videoTexture = new BABYLON.VideoTexture("video", [url], G.scene, false, false, true);

        this.videoTexture[name] = videoTexture;

        if(videoTexture) {
            videoTexture.video.muted = true;
            videoTexture.video.autoplay = true;
            mat.diffuseTexture = videoTexture;
            mat.diffuseTexture.uScale = 1.0;
            mat.diffuseTexture.vScale = 1.0;
            screen.material = mat;

            screen.actionManager = new BABYLON.ActionManager(G.scene);
            screen.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                // videoTexture.video.play();
                //맥도날드
                //pk = 202;
                if(name == "theme_01_screen_03") snsCommonFunc.snsView(8,202);
                else if(name == "theme_01_screen_01") snsCommonFunc.snsView(8,203);
            }));
        }
    }


    FRoom.prototype.getAdInfo = function(hashTag, This, callback) {

        var option = { 'param' : {'tag_nm' : hashTag},
                       'url' : '/funfactory-1.0/getTagSeq'
        }

        var self = this;
        postCall(option)
        // 작업완료
        .then(function(rs){

            var res = rs.callback;

            if(res.result == 1) {
                return;
            }

            var option = {'param' : {'accountpk': ACCOUNTPK, 'page': 1, 'rows': 6, 'tag_seq': res.TAG_SEQ},
            'url' : '/funfactory-1.0/listTagPopularPost'
            };
            postCall(option)
            // 작업완료
            .then(function(rs){

                var res = rs.callback;

                if(res.result == 1) {
                    
                    return;
                }
                setInfo(hashTag, res, false);
                if(callback) callback(This);
            })
            // 에러
            .catch(function(err){
                alert(err);
                
            })
        })
        // 에러
        .catch(function(err){
            alert(err);
        })
        
        function setInfo (hashTag, res, isThumb) {

            // var array = null;

            // if(self.advertise[hashTag]) {
                // array = self.advertise[hashTag];
            // } else {

            // }

            for(var i=0; i<res.rows.length; i++) {
                var row = res.rows[i];
                var type = row.FILE_TYPE;
    
                //1:이미지,2:동영상,3:유튜브링크
                if(type == 1) {
    
                    // if(!isThumb) {
                    //     var obj = {
                    //         'type': type,
                    //         'url' : res.img_dir_nm + row.FILE_NM,
                    //         'pk'  : row.ACCOUNTPK,
                    //         'seq' : row.POST_SEQ
                    //     };
        
                    //     self.advertise[hashTag] = obj; 
                    // } else {
                    //     self.advertise[hashTag] = (res.img_dir_nm + row.FILE_NM);
                    // }

    
                } else if(type == 2) {
    
                    if(!isThumb) {
                        var obj = {
                            'type': type,
                            'url' : res.vdo_dir_nm + row.FILE_NM,
                            'pk'  : row.ACCOUNTPK,
                            'seq' : row.POST_SEQ
                        };
        
                        self.advertise[hashTag] = obj;
                    } else {

                        var url = res.vdo_dir_nm + row.FILE_NM;

                        url = CommFunc.getThumbUrl(url);
                        self.advertise[hashTag] = url;
                    }

                } else if(type == 3) {
    
                } else {
                    Alert('File Type Error!!!!');
                }
            }
        }
    }


    return FRoom;

}());


//# sourceMappingURL=FSceneManager.js.map