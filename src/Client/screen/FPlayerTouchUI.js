'use strict'

//
// player Touch UI
//
var PLAYERUI_MAINBTN = 
{
    INFOPOPUP        : 0,
    GOTO_INTERACTION : 1,
    CLOSE            : 2,
}

var PLAYERUI_INTERACTIONBTN = 
{
    HIGHFIVE    : 0,
    ETC_1       : 1,
    BACK        : 2,
}

var PLAYERUI_CALLBACK_TYPE =
{
    CLOSE        : 0,

    INTERACTION  : 1,

    VIEWSNS      : 2,
}

var PLAYERUI_TEST_INTERACTION = 
{
    HIGHFIVE : 1,
    ETC_1    : 2,
    ETC_2    : 3,
}

var FPlayerTouchUI = (function()
{
    function FPlayerTouchUI()
    {
        this.ui = 
        {
            mainWrapper : null,
            mainButton : [],

            interactionWrapper : null,
            interactionButton : [],

            topInfoWrapper : null,
        }

        this.playerInfo = 
        {
            player : null,
            touchCallback : null
        }

        this.useInteraction = true;
        this.readyToAutoClose = false;


        //
        // init func
        //
        this.init();
    }
    
    FPlayerTouchUI.prototype.getReadyToAutoClose = function()
    {
        return this.readyToAutoClose;
    }

    FPlayerTouchUI.prototype.init = function()
    {
        this.initUI();
    }

    FPlayerTouchUI.prototype.initUI = function()
    {
        var self = this;

        //
        // main
        //
        var mainWrapper = GUI.createContainer();
        mainWrapper.width = px(400);
        mainWrapper.height = px(400);
        this.ui.mainWrapper = mainWrapper;

        this.ui.mainWrapper.addControl( GUI.CreateImage( "RingBG", px(0), px(0), px(299), px(299), SHOPUI_PATH+"s_c.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
        
        var viewInfoPopupBtn = GUI.CreateButton( "viewInfoPopupBtn", px( Math.sin(ToRadians(180))*150 ), px( Math.cos(ToRadians(180))*150 ), px(94), px(94),
            PLAYERUI_PATH+"player_info.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        mainWrapper.addControl( viewInfoPopupBtn );
        viewInfoPopupBtn.onPointerUpObservable.add( function(){ self.onClickviewInfoPopupBtn() } );
        this.ui.mainButton.push( viewInfoPopupBtn );

        var mainGoToInteractionBtn = GUI.CreateButton( "mainGoToInteractionBtn", px( Math.sin(ToRadians(120))*150 ), px( Math.cos(ToRadians(120))*150 ), px(94), px(94),
            PLAYERUI_PATH+"s_i4.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        mainWrapper.addControl( mainGoToInteractionBtn );
        mainGoToInteractionBtn.onPointerUpObservable.add( function(){ self.onClickMainGotoInteractionBtn() } );
        this.ui.mainButton.push( mainGoToInteractionBtn );

        var mainCloseBtn = GUI.CreateButton( "mainCloseBtn", px( Math.sin(ToRadians(315))*150 ), px( Math.cos(ToRadians(315))*150 ), px(94), px(94),
            PLAYERUI_PATH+"s_x.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        mainWrapper.addControl( mainCloseBtn );
        mainCloseBtn.onPointerUpObservable.add( function(){ self.onClickmainCloseBtn() } );
        this.ui.mainButton.push( mainCloseBtn );

        //
        // interaction
        //
        var interactionWrapper = GUI.createContainer();
        interactionWrapper.width = px(400);
        interactionWrapper.height = px(400);
        this.ui.interactionWrapper = interactionWrapper;

        this.ui.interactionWrapper.addControl( GUI.CreateImage( "RingBG", px(0), px(0), px(299), px(299), SHOPUI_PATH+"s_c.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
        
        var interactionTouchBtn = GUI.CreateButton( "interactionTouchBtn", px( Math.sin(ToRadians(180))*150 ), px( Math.cos(ToRadians(180))*150 ), px(94), px(94),
            PLAYERUI_PATH+"player_play.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        interactionWrapper.addControl( interactionTouchBtn );
        interactionTouchBtn.onPointerUpObservable.add( function(){ self.onClickinteractionTouchBtn() } );
        this.ui.interactionButton.push( interactionTouchBtn );

        var interactionFeedBtn = GUI.CreateButton( "interactionFeedBtn", px( Math.sin(ToRadians(120))*150 ), px( Math.cos(ToRadians(120))*150 ), px(94), px(94),
            PLAYERUI_PATH+"player_food.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        interactionWrapper.addControl( interactionFeedBtn );
        interactionFeedBtn.onPointerUpObservable.add( function(){ self.onClickinteractionFeedBtn() } );
        this.ui.interactionButton.push( interactionFeedBtn );

        var interactionBackBtn = GUI.CreateButton( "interactionBackBtn", px( Math.sin(ToRadians(315))*150 ), px( Math.cos(ToRadians(315))*150 ), px(94), px(94),
            PLAYERUI_PATH+"s_back.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        interactionWrapper.addControl( interactionBackBtn );
        interactionBackBtn.onPointerUpObservable.add( function(){ self.onClickinteractionBackBtn() } );
        this.ui.interactionButton.push( interactionBackBtn );


        //
        // topInfo
        //
        var topInfoWrapper = GUI.createContainer();
        topInfoWrapper.width = px(430);
        topInfoWrapper.height = px(160);
        topInfoWrapper.top = px(90);
        topInfoWrapper.verticalAlignment = GUI.ALIGN_TOP;
        topInfoWrapper.isPointerBlocker = true;
        this.ui.topInfoWrapper = topInfoWrapper;

        var topInfoBG = GUI.CreateImage( "topInfoBG", px(0), px(0), px(423), px(152), PLAYERUI_PATH+"player_top.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        topInfoWrapper.addControl( topInfoBG );

        var playerIcon = GUI.CreateCircleButton( "topInfoIcon", px(-134), px(15), px(121), px(120), PLAYERUI_PATH+"cat_profile.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        topInfoWrapper.addControl( playerIcon );

        var playerName = GUI.CreateText( px(8), px(42), "귀욤냥냥이", "White", 20, GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        playerName.name = "playerName";
        topInfoWrapper.addControl( playerName );

        var playerGrade = GUI.CreateText( px(130), px(45), "아는 사이", "Gray", 18, GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        playerGrade.name = "playerGrade";
        topInfoWrapper.addControl( playerGrade );
    }

    FPlayerTouchUI.prototype.refreshInfo = function()
    {
        var friend = this.playerInfo.player;
        GUI.changeButtonImage( this.ui.topInfoWrapper.getChildByName("topInfoIcon").getChildByName("topInfoIcon"), friend.imgUrl );

        this.ui.topInfoWrapper.getChildByName("playerName").text = friend.getName();
        this.ui.topInfoWrapper.getChildByName("playerGrade").text = "친한 사이";

        this.ui.mainButton[ PLAYERUI_MAINBTN.GOTO_INTERACTION ].isVisible = this.useInteraction;

    }

    FPlayerTouchUI.prototype.setplayerInfo = function( in_player, in_uiClickCallback, in_useInteraction )
    {
        if ( this.playerInfo.player != null )
            this.playerInfo.player.setPause(false);
            
        this.playerInfo.player = in_player;
        this.playerInfo.touchCallback = in_uiClickCallback;
        this.useInteraction = true; // in_useInteraction; // 상호작용 항상 가능하대

        this.refreshInfo();
    }
    
    FPlayerTouchUI.prototype.clearplayerInfo = function()
    {
        this.playerInfo.player = null;
        this.playerInfo.touchCallback = null;
    }

    FPlayerTouchUI.prototype.openTopInfo = function()
    {
        G.guiMain.addControl( this.ui.topInfoWrapper, GUI.LAYER.POPUP );
        FPopup.openAnimation( this.ui.topInfoWrapper );
    }

    FPlayerTouchUI.prototype.closeTopInfo = function()
    {
        G.guiMain.removeControl( this.ui.topInfoWrapper );
    }

    FPlayerTouchUI.prototype.openUI = function()
    {   
        if(!this.playerInfo.player.isEnableTouch()) return;

        FObjectTouchUI.getInstance().closeUI();
        FPetTouchUI.getInstance().closeUI();
        FPetTouchUI.getInstance().closeTopInfo();

        var self = this;

        this.closeUI();

        this.openMainUI();
        this.openTopInfo();
        
        // auto close after timeout
        this.readyToAutoClose = false;
        setTimeout( function(){ self.readyToAutoClose = true }, 1000 );

        this.playerInfo.player.setPause(true);
    }

    FPlayerTouchUI.prototype.closeUI = function()
    {
        G.guiMain.removeControl( this.ui.mainWrapper );
        G.guiMain.removeControl( this.ui.interactionWrapper );
    }

    FPlayerTouchUI.prototype.openMainUI = function()
    {
        this.closeUI();

        G.guiMain.addControl( this.ui.mainWrapper, GUI.LAYER.BACKGROUND );
        FPopup.openAnimation( this.ui.mainWrapper );

        this.ui.mainWrapper.linkWithMesh( this.playerInfo.player.getMeshPart( PARTS_HEAD ) );
    }

    FPlayerTouchUI.prototype.openInteractionUI = function()
    {
        this.onClickmainCloseBtn();

        G.guiMain.addControl( this.ui.interactionWrapper, GUI.LAYER.BACKGROUND );
        FPopup.openAnimation( this.ui.interactionWrapper );
        
        this.ui.interactionWrapper.linkWithMesh( this.playerInfo.player.getMeshPart( PARTS_HEAD ) );
    }

    FPlayerTouchUI.prototype.notifyCallback = function( in_callbackType, in_callbackValue )
    {
        if ( this.playerInfo.touchCallback != null )
            this.playerInfo.touchCallback( in_callbackType, in_callbackValue, this.playerInfo.player );
    }

    //
    // mainBtn click
    // 
    FPlayerTouchUI.prototype.onClickviewInfoPopupBtn = function()
    {
        this.closeUI();
        this.closeTopInfo();

        this.notifyCallback( PLAYERUI_CALLBACK_TYPE.VIEWSNS );
        
        if ( this.playerInfo.player != null )
            this.playerInfo.player.setPause(false);
    }

    FPlayerTouchUI.prototype.onClickMainGotoInteractionBtn = function()
    {
        this.openInteractionUI();
    }

    FPlayerTouchUI.prototype.onClickmainCloseBtn = function()
    {
        this.closeUI();
        this.closeTopInfo();

        this.notifyCallback( PLAYERUI_CALLBACK_TYPE.CLOSE );
        

        if ( this.playerInfo.player != null )
            this.playerInfo.player.setPause(false);
    }

    //
    // interaction Click
    //
    FPlayerTouchUI.prototype.onClickinteractionTouchBtn = function()
    {
        this.notifyCallback( PLAYERUI_CALLBACK_TYPE.INTERACTION, PLAYERUI_TEST_INTERACTION.HIGHFIVE );   
        
        this.onClickmainCloseBtn();
    }

    FPlayerTouchUI.prototype.onClickinteractionFeedBtn = function()
    {
        this.notifyCallback( PLAYERUI_CALLBACK_TYPE.INTERACTION, PLAYERUI_TEST_INTERACTION.FEED );        
        
        this.onClickmainCloseBtn();
    }

    FPlayerTouchUI.prototype.onClickinteractionBackBtn = function()
    {
        this.openMainUI();        
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
                instance = new FPlayerTouchUI();
                instance.constructor = null;
            }

            return instance;
        }
    };

    return FPlayerTouchUI;
}());