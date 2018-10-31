'use strict';

var SPOT_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "16_interaction/spot/";

var SPOT_DATA = 
{
    SPOT_TYPE :
    {
        UNDEFINED : -1,
        BEACH     : 0,
        RESTORANT : 1,
        CAFE      : 2,
    },

    SPOT_STATE :
    {
        LOCKED : 0,
        OPEN   : 1,
        FIX    : 2,
    },

    LIST_DATA : (function ()
    {
        function LIST_DATA()
        {
            this.name = undefined;
            this.type = undefined;

            this.bgImageURL = undefined;
            this.postImage = [];

            this.limitPersonCount = undefined;
        }
        
        LIST_DATA.prototype.setInfo = function( in_name, in_type, in_state, in_bgImageURL, in_postImage, in_limitPersionCount )
        {
            this.name = in_name;
            this.type = in_type;
            this.state = in_state

            this.bgImageURL = in_bgImageURL;
            this.postImage = in_postImage;

            this.limitPersonCount = in_limitPersionCount;

            return this;
        }

        return LIST_DATA;
    }()),
}

// 테스트용
var debugSpotList = 
[
    (new SPOT_DATA.LIST_DATA()).setInfo( "여행가기 좋은 해변가",       SPOT_DATA.SPOT_TYPE.BEACH, SPOT_DATA.SPOT_STATE.OPEN, SPOT_PATH+"spot_beach.png", [], 120 ),
    (new SPOT_DATA.LIST_DATA()).setInfo( "오늘 나랑 놀자 클럽",   SPOT_DATA.SPOT_TYPE.RESTORANT, SPOT_DATA.SPOT_STATE.FIX, SPOT_PATH+"spot_club.png", [], 80 ),
    (new SPOT_DATA.LIST_DATA()).setInfo( "잠간의 여유 카페",         SPOT_DATA.SPOT_TYPE.CAFE, SPOT_DATA.SPOT_STATE.LOCKED, SPOT_PATH+"spot_coffee.png", [], 20 ),
    (new SPOT_DATA.LIST_DATA()).setInfo( "맛집 먹방",     SPOT_DATA.SPOT_TYPE.RESTORANT, SPOT_DATA.SPOT_STATE.LOCKED, SPOT_PATH+"spot_restaurant.png", [], 50 ),
    (new SPOT_DATA.LIST_DATA()).setInfo( "고기 한점에 캬~",       SPOT_DATA.SPOT_TYPE.BEACH, SPOT_DATA.SPOT_STATE.FIX, SPOT_PATH+"spot_meat.png", [], 2000 ),
    (new SPOT_DATA.LIST_DATA()).setInfo( "좋아하는 스포츠",   SPOT_DATA.SPOT_TYPE.CAFE, SPOT_DATA.SPOT_STATE.FIX, SPOT_PATH+"spot_sports.png", [], 50 ),
    (new SPOT_DATA.LIST_DATA()).setInfo( "라운지 바",   SPOT_DATA.SPOT_TYPE.RESTORANT, SPOT_DATA.SPOT_STATE.FIX, SPOT_PATH+"spot_bar.png", [], 20 ),
    (new SPOT_DATA.LIST_DATA()).setInfo( "플레이 게임 PC방",   SPOT_DATA.SPOT_TYPE.BEACH, SPOT_DATA.SPOT_STATE.FIX, SPOT_PATH+"spot_pc.png", [], 20 ),
    (new SPOT_DATA.LIST_DATA()).setInfo( "데일리 트레이닝",   SPOT_DATA.SPOT_TYPE.CAFE, SPOT_DATA.SPOT_STATE.FIX, SPOT_PATH+"spot_gym.png", [], 40 ),
]

var FSocialSpot = (function()
{
    function FSocialSpot()
    {
        this.ui = 
        {
            wrapper : null,
            
            previewBG : null,
            postListView : null,

            spotListView : null,
            spotListBar : null,

            closeBtn : null,

            lastSelectBG : null,
        }

        //
        // init
        //
        this.init();
    }

    FSocialSpot.prototype.init = function()
    {        
        G.runnableMgr.add(this);

        this.initUI();
    }

    FSocialSpot.prototype.initUI = function()
    {
        var self = this;

        this.ui.wrapper = FPopup.createPopupWrapper( "black", 0.75 );// GUI.createContainer();
        this.ui.wrapper.isPointerBlocker = true;

        this.ui.bg = GUI.CreateImage( "bg", px(0), px(0), px(686), px(1019), SPOT_PATH+"S_board_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.ui.wrapper.addControl( this.ui.bg );

        //var titleText = GUI.CreateText( px(0), px(-215), "만남의 광장", "White", 20, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        //this.ui.wrapper.addControl( titleText );

        
        var scrollBtn = AIUI_PATH+"Ai_window/scroll_bar.png";
        var scrollBG = AIUI_PATH+"Ai_window/scroll_bg.png";

        this.ui.spotListView = new GUI.createScrollView( this.ui.wrapper, "spotListView", px(-25), px(180), px(600), px(600), 1.1, true, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.ui.spotListBar = new GUI.createScrollBar( this.ui.spotListView, "spotListBar",  scrollBtn, scrollBG, 
            px(300), px(180), px(17), px(550), px(17), px(85), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.ui.spotListView.linkScrollBar( this.ui.spotListBar );

        this.ui.previewBG = GUI.CreateImage( "ui_preview", px(0), px(-290), px(678), px(275), SPOT_PATH+"spot_beach.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.ui.wrapper.addControl( this.ui.previewBG );
        
        this.ui.postListView = new GUI.createScrollView( this.ui.wrapper, "postListview", px(0), px(-280), px(650), px(250), 1.1, false, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );

        var tape = GUI.CreateImage( "ui_tape", px(-292), px(-300), px(100), px(104), SPOT_PATH+"spot_tape.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.ui.wrapper.addControl( tape );

        var closeButton = GUI.CreateButton( "ui_closeBtn", px(300), px(-500), px(97), px(96), AIUI_PATH+"Ai_window/A_x_btn_idle.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.ui.wrapper.addControl( closeButton );
        this.ui.closeBtn = closeButton;
        this.ui.closeBtn.onPointerUpObservable.add( function()
        {
            self.closeSocialSpotListPopup();
        } );
    }

    FSocialSpot.prototype.getIconPath = function( in_spotType )
    {
        var iconPath = SPOT_PATH;
        switch( in_spotType )
        {
        case SPOT_DATA.SPOT_TYPE.BEACH :
            {
                iconPath += "S_s2_icon.png";
            }
            break;
        
        case SPOT_DATA.SPOT_TYPE.RESTORANT :
            {
                iconPath += "S_s1_icon.png";
            }
            break;
            
        case SPOT_DATA.SPOT_TYPE.CAFE :
            {
                iconPath += "S_s3_icon.png";
            }
            break;
        }

        return iconPath;
    }

    FSocialSpot.prototype.createSpotListFromData = function( in_spotInfoList )
    {
        this.ui.spotListView.clearItem();

        for ( var i = 0; i < in_spotInfoList.length; ++i )
        {
            this.addSpotList( in_spotInfoList[i], (i==0) );
        }
    }

    FSocialSpot.prototype.addSpotList = function( in_spotInfo, in_isSelect )
    {
        var self = this;

        var wrapper = GUI.createContainer();
        wrapper.width = GUI.getResolutionCorrection( px( 562 ) );
        wrapper.height = GUI.getResolutionCorrection( px( 148 ) );

        var bg = GUI.CreateImage( "item_bg", px(0), px(0), 1, 1, SPOT_PATH+"S_youlist_btn_idle.png", GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        wrapper.addControl( bg );

        var iconPath = GUI.CreateImage( "item_icon", px(20), px(0), px(132), px(132), this.getIconPath( in_spotInfo.type ), GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        wrapper.addControl( iconPath );

        var limitPersonStr = " ("+CommFunc.randomMinMax( 0, in_spotInfo.limitPersonCount ) + "/"+in_spotInfo.limitPersonCount+")";
        var text = GUI.CreateText( px(190), px(-15), in_spotInfo.name, "Black", 26, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        wrapper.addControl( text );

        var limitText = GUI.CreateText( px(200), px(15), "현재인원:" + limitPersonStr, "Gray", 20, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        wrapper.addControl( limitText );

        var clickArea = GUI.CreateButton( "item_clickArea", px(0), px(0), px(400), px(148), GUI.DEFAULT_IMAGE_PATH_NEW+"empty.png", GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        wrapper.addControl( clickArea );
        clickArea.onPointerUpObservable.add( function()
        {
            if ( self.ui.spotListView.blockTouchForScrolling )
                return;

            if ( self.ui.lastSelectBG != null )
            {
                GUI.changeImage( self.ui.lastSelectBG, SPOT_PATH+"S_youlist_btn_idle.png" );
            }

            GUI.changeImage( bg, SPOT_PATH+"S_youlist_btn_select.png" );
            GUI.changeImage( self.ui.previewBG, in_spotInfo.bgImageURL );

            self.requestPostPreviewImg( in_spotInfo.name );

            self.ui.lastSelectBG = bg;
        });

        if ( in_isSelect )
            clickArea.onPointerUpObservable.notifyObservers(clickArea, -1, clickArea, clickArea);

        
        var enterBtn = GUI.CreateButton( "item_icon", px(-15), px(0), px(104), px(104), SPOT_PATH+"S_enter_btn_idle.png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        wrapper.addControl( enterBtn );

        if ( in_spotInfo.state != SPOT_DATA.SPOT_STATE.OPEN )
        {
            enterBtn.alpha = 0.3;
            enterBtn.isHitTestVisible = false;
        }

        enterBtn.onPointerUpObservable.add( function()
        {
            if ( self.ui.spotListView.blockTouchForScrolling )
                return;

            self.closeSocialSpotListPopup();
        
            G.sceneMgr.addScene('SCENE_BEACH', new FSceneBeach());
            G.sceneMgr.changeScene('SCENE_BEACH', true); 
        });

        this.ui.spotListView.addItem( wrapper );
    }

    FSocialSpot.prototype.requestPostPreviewImg = function( in_targetSocialSpotName )
    {
        var self = this;

        self.ui.postListView.clearItem();

        // 자 이것은 테스트용 코드이다
        // SNS 포스트 정상적으로 요청할거면 flagForDebug = true 를 false로 바꿉시다.
        var flagForDebug = false;
        var debugImgPath = null;
        if ( flagForDebug )
        {
                
            switch( in_targetSocialSpotName )
            {
            case "여행가기 좋은 해변가" :
                debugImgPath = SPOT_PATH+"spot_beach.png";
                break;

            case "오늘 나랑 놀자 클럽" :
                debugImgPath = SPOT_PATH+"spot_club.png";
                break;

            case "잠간의 여유 카페" :
                debugImgPath = SPOT_PATH+"spot_coffee.png";
                break;

            case "맛집 먹방" :
                debugImgPath = SPOT_PATH+"spot_restaurant.png";
                break;

            case "고기 한점에 캬~" :
                debugImgPath = SPOT_PATH+"spot_meat.png";
                break;

            case "좋아하는 스포츠" :
                debugImgPath = SPOT_PATH+"spot_sports.png";
                break;
            }

            self.createPostListFromData( [
                debugImgPath,debugImgPath,debugImgPath,debugImgPath,debugImgPath,debugImgPath,debugImgPath
            ] );

            return;
        }

        if ( in_targetSocialSpotName == "여행가기 좋은 해변가" )
        {
            G.dataManager.dataChannel.getHttpAdInfo("해변", self, function(in_self, list){
                self.createPostListFromData(list);
            });
        }
        else if( in_targetSocialSpotName == "오늘 나랑 놀자 클럽" )
        {            
            G.dataManager.dataChannel.getHttpAdInfo("클럽", self, function(in_self, list){
                self.createPostListFromData(list);
            });
        }
    }


    FSocialSpot.prototype.createPostListFromData = function( in_postImgList )
    {
        this.ui.postListView.clearItem();

        for ( var i = 0; i < in_postImgList.length; ++i )
        {
            this.addPostList( in_postImgList[i] );
        }
    }

    FSocialSpot.prototype.addPostList = function( in_postImgUrl )
    {
        var postOutline = GUI.CreateButton( "postOutLine", px(0), px(0), px(180), px(200), SPOT_PATH+"/ai_photo.png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );

        var post = GUI.CreateImage( "post", px(0), px(10), px(178), px(178), in_postImgUrl, GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        postOutline.addControl( post );

        this.ui.postListView.addItem( postOutline );
    }

    FSocialSpot.prototype.openSocialSpotListPopup = function(This)
    {
        this.closeSocialSpotListPopup();

        FPopup.openAnimation( this.ui.wrapper );
        G.guiMain.addControl( this.ui.wrapper, GUI.LAYER.POPUP );

        this.createSpotListFromData( debugSpotList );
    }

    FSocialSpot.prototype.closeSocialSpotListPopup = function()
    {
        G.guiMain.removeControl( this.ui.wrapper );
    }

    FSocialSpot.prototype.run = function()
    {
        if ( this.ui.spotListView != null )
            this.ui.spotListView.procLoop();

        if ( this.ui.postListView != null )
            this.ui.postListView.procLoop();
    }


    //
    // singleton
    // 
    var instance;
    return {
        getInstance: function(){
            if (instance == null) {
                instance = new FSocialSpot();
                // Hide the constructor so the returned objected can't be new'd...
                instance.constructor = null;
            }
            return instance;
        }
   };
}());