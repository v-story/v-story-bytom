'use strict'

//
// Pet Touch UI
//
var PETUI_MAINBTN = 
{
    INFOPOPUP        : 0,
    GOTO_INTERACTION : 1,
    CLOSE            : 2,
}

var PETUI_INTERACTIONBTN = 
{
    TOUCHBTN    : 0,
    FEEDBTN     : 1,
    BACK        : 2,
}

var PETUI_INFOPOPUPBTN = 
{
    CLOSE       : 0,
    VIEWPOST    : 1,
}

var PETUI_CALLBACK_TYPE =
{
    CLOSE        : 0,

    INTERACTION  : 1,
    OPENINFOPOPUP: 2,
}

var PETUI_TEST_INTERACTION = 
{
    TOUCH : 1,
    FEED  : 2,
}

var FPetTouchUI = (function()
{
    function FPetTouchUI()
    {
        this.ui = 
        {
            mainWrapper : null,
            mainButton : [],

            interactionWrapper : null,
            interactionButton : [],

            infoPopupWrapper : null,
            infoPopupButton : [],

            topInfoWrapper : null,
        }

        this.petInfo = 
        {
            pet : null,
            touchCallback : null
        }
        
        this.readyToAutoClose = false;



        //
        // init func
        //
        this.init();
    }
    
    FPetTouchUI.prototype.getReadyToAutoClose = function()
    {
        return this.readyToAutoClose;
    }

    FPetTouchUI.prototype.init = function()
    {
        this.initUI();
    }

    FPetTouchUI.prototype.initUI = function()
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
            PETUI_PATH+"pet_info.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        mainWrapper.addControl( viewInfoPopupBtn );
        viewInfoPopupBtn.onPointerUpObservable.add( function(){ self.onClickviewInfoPopupBtn() } );
        this.ui.mainButton.push( viewInfoPopupBtn );

        var mainGoToInteractionBtn = GUI.CreateButton( "mainGoToInteractionBtn", px( Math.sin(ToRadians(120))*150 ), px( Math.cos(ToRadians(120))*150 ), px(94), px(94),
            PETUI_PATH+"s_i4.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        mainWrapper.addControl( mainGoToInteractionBtn );
        mainGoToInteractionBtn.onPointerUpObservable.add( function(){ self.onClickMainGotoInteractionBtn() } );
        this.ui.mainButton.push( mainGoToInteractionBtn );

        var mainCloseBtn = GUI.CreateButton( "mainCloseBtn", px( Math.sin(ToRadians(315))*150 ), px( Math.cos(ToRadians(315))*150 ), px(94), px(94),
            PETUI_PATH+"s_x.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
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
            PETUI_PATH+"pet_play.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        interactionWrapper.addControl( interactionTouchBtn );
        interactionTouchBtn.onPointerUpObservable.add( function(){ self.onClickinteractionTouchBtn() } );
        this.ui.interactionButton.push( interactionTouchBtn );

        var interactionFeedBtn = GUI.CreateButton( "interactionFeedBtn", px( Math.sin(ToRadians(120))*150 ), px( Math.cos(ToRadians(120))*150 ), px(94), px(94),
            PETUI_PATH+"pet_food.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        interactionWrapper.addControl( interactionFeedBtn );
        interactionFeedBtn.onPointerUpObservable.add( function(){ self.onClickinteractionFeedBtn() } );
        this.ui.interactionButton.push( interactionFeedBtn );

        var interactionBackBtn = GUI.CreateButton( "interactionBackBtn", px( Math.sin(ToRadians(315))*150 ), px( Math.cos(ToRadians(315))*150 ), px(94), px(94),
            PETUI_PATH+"s_back.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        interactionWrapper.addControl( interactionBackBtn );
        interactionBackBtn.onPointerUpObservable.add( function(){ self.onClickinteractionBackBtn() } );
        this.ui.interactionButton.push( interactionBackBtn );


        //
        // infoPopup
        //
        this.ui.infoPopupWrapper = FPopup.createPopupWrapper( "black", 0.75 );// GUI.createContainer();
        this.ui.infoPopupWrapper.isPointerBlocker = true;

        var petInfoPopupBG = GUI.CreateImage( "petInfoPopupBG", px(0), px(0), px(583), px(529), PETUI_PATH+"pet_info_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.ui.infoPopupWrapper.addControl( petInfoPopupBG );

        var infoPopupCloseBtn = GUI.CreateButton( "infoPopupCloseBtn", px(275), px(-245), px(75), px(74), PETUI_PATH+"close.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.ui.infoPopupWrapper.addControl( infoPopupCloseBtn );
        infoPopupCloseBtn.onPointerUpObservable.add( function()
        {
            self.onClickInfoPopupCloseBtn();
        });


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

        var topInfoBG = GUI.CreateImage( "topInfoBG", px(0), px(0), px(423), px(152), PETUI_PATH+"pet_top.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        topInfoWrapper.addControl( topInfoBG );

        var petIcon = GUI.CreateButton( "topInfoIcon", px(-140), px(15), px(121), px(120), PETUI_PATH+"cat_profile.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        topInfoWrapper.addControl( petIcon );

        var petName = GUI.CreateText( px(8), px(39), "귀욤냥냥이", "White", 20, GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        topInfoWrapper.addControl( petName );

        var petGrade = GUI.CreateText( px(130), px(42), "Rank 4", "Gray", 18, GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        topInfoWrapper.addControl( petGrade );
    }

    FPetTouchUI.prototype.setPetInfo = function( in_pet, in_uiClickCallback )
    {
        this.petInfo.pet = in_pet;
        this.petInfo.touchCallback = in_uiClickCallback;
        
        this.petInfo.pet.setPause(true);
    }
    
    FPetTouchUI.prototype.clearPetInfo = function()
    {
        this.petInfo.pet = null;
        this.petInfo.touchCallback = null;
    }

    FPetTouchUI.prototype.openTopInfo = function()
    {
        G.guiMain.addControl( this.ui.topInfoWrapper, GUI.LAYER.POPUP );
        FPopup.openAnimation( this.ui.topInfoWrapper );
    }

    FPetTouchUI.prototype.closeTopInfo = function()
    {
        G.guiMain.removeControl( this.ui.topInfoWrapper );
    }

    FPetTouchUI.prototype.openUI = function()
    {
        FObjectTouchUI.getInstance().closeUI();
        FPlayerTouchUI.getInstance().closeUI();
        FPlayerTouchUI.getInstance().closeTopInfo();

        var self = this;

        this.openMainUI();
        this.openTopInfo();
        
        // auto close after timeout
        this.readyToAutoClose = false;
        setTimeout( function(){ self.readyToAutoClose = true }, 1000 );
    }

    FPetTouchUI.prototype.closeUI = function()
    {
        G.guiMain.removeControl( this.ui.mainWrapper );
        G.guiMain.removeControl( this.ui.interactionWrapper );
    }

    FPetTouchUI.prototype.openMainUI = function()
    {
        this.closeUI();

        G.guiMain.addControl( this.ui.mainWrapper, GUI.LAYER.BACKGROUND );
        FPopup.openAnimation( this.ui.mainWrapper );

        this.ui.mainWrapper.linkWithMesh( this.petInfo.pet.getMainMesh() );
    }

    FPetTouchUI.prototype.openInteractionUI = function()
    {
        this.closeUI();

        G.guiMain.addControl( this.ui.interactionWrapper, GUI.LAYER.BACKGROUND );
        FPopup.openAnimation( this.ui.interactionWrapper );
        
        this.ui.interactionWrapper.linkWithMesh( this.petInfo.pet.getMainMesh() );
    }

    FPetTouchUI.prototype.openInfoPopup = function()
    {
        this.closeUI();
        
        G.guiMain.addControl( this.ui.infoPopupWrapper, GUI.LAYER.POPUP );
        FPopup.openAnimation( this.ui.infoPopupWrapper );
    }

    FPetTouchUI.prototype.closeInfoPopup = function()
    {
        G.guiMain.removeControl( this.ui.infoPopupWrapper );
    }

    FPetTouchUI.prototype.notifyCallback = function( in_callbackType, in_callbackValue )
    {
        if ( this.petInfo.touchCallback != null )
            this.petInfo.touchCallback( in_callbackType, in_callbackValue );
    }

    //
    // mainBtn click
    // 
    FPetTouchUI.prototype.onClickviewInfoPopupBtn = function()
    {
        this.onClickmainCloseBtn();

        this.openInfoPopup();

        this.notifyCallback( PETUI_CALLBACK_TYPE.OPENINFOPOPUP );
    }

    FPetTouchUI.prototype.onClickMainGotoInteractionBtn = function()
    {
        this.openInteractionUI();
    }

    FPetTouchUI.prototype.onClickmainCloseBtn = function()
    {
        this.closeUI();
        this.closeTopInfo();

        this.notifyCallback( PETUI_CALLBACK_TYPE.CLOSE );

        
        if ( this.petInfo.pet != null )
            this.petInfo.pet.setPause(false);
    }

    //
    // interaction Click
    //
    FPetTouchUI.prototype.onClickinteractionTouchBtn = function()
    {
        this.onClickmainCloseBtn();

        this.notifyCallback( PETUI_CALLBACK_TYPE.INTERACTION, PETUI_TEST_INTERACTION.TOUCH );   
    }

    FPetTouchUI.prototype.onClickinteractionFeedBtn = function()
    {
        this.onClickmainCloseBtn();

        this.notifyCallback( PETUI_CALLBACK_TYPE.INTERACTION, PETUI_TEST_INTERACTION.FEED );       
    }

    FPetTouchUI.prototype.onClickinteractionBackBtn = function()
    {
        this.openMainUI();        
    }


    //
    // infoPopup click
    //
    FPetTouchUI.prototype.onClickInfoPopupCloseBtn = function()
    {
        this.closeInfoPopup();
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
                instance = new FPetTouchUI();
                instance.constructor = null;
            }

            return instance;
        }
    };

    return FPetTouchUI;
}());