'use strict'

/* 5896, 36, 24, 130, 130 */
var getRandomTileInSpae = function( in_startTile, in_width, in_height, in_mapWidth, in_mapHeight )
{
    var xOf = CommFunc.random( in_width )+1;
    var yOf = (CommFunc.random( in_height )+1)*in_mapWidth;

    return in_startTile+xOf+yOf;
}

var FPackageShop = (function()
{
    function FPackageShop()
    {

        this.ui = 
        {
            wrapper : null,

            BG : null,

            topBannerListView : null,

            itemListView : null,
            itemListBar : null,

            closeBtn : null,
        }

        // init func
        this.init();
    }

    
    FPackageShop.prototype.init = function()
    {        
        G.runnableMgr.add( this );

        this.initUI();
    }

    FPackageShop.prototype.initUI = function()
    {
        var self = this;

        var scrollBtn = AIUI_PATH+"Ai_window/scroll_bar.png";
        var scrollBG = AIUI_PATH+"Ai_window/scroll_bg.png";

        this.ui.wrapper = FPopup.createPopupWrapper( "black", 0.75 );// GUI.createContainer();
        this.ui.wrapper.isPointerBlocker = true;

        this.ui.BG = GUI.CreateImage( "tonsangjumBG", px(0), px(0), px(720), px(1280), PACKAGE_PATH+"shop.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.ui.wrapper.addControl( this.ui.BG );

        this.ui.topBannerListView = new GUI.createScrollView( this.ui.wrapper, "topBannerListView", px(0), px(-350), px(680), px(360), 1.1, false, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );

        this.ui.itemListView = new GUI.createScrollView( this.ui.wrapper, "itemListview", px(5), px(220), px(680), px(760), 1.1, true, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.ui.itemListBar = new GUI.createScrollBar( this.ui.itemListView, "itemListBar",  scrollBtn, scrollBG, 
            px(320), px(230), px(17), px(700), px(17), px(85), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.ui.itemListView.linkScrollBar( this.ui.itemListBar );

        this.ui.closeBtn = GUI.CreateButton( "closeBtn", px(720/2-75/2), px(-1280/2+90/2), px(90), px(90), PACKAGE_PATH+"close.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.ui.wrapper.addControl( this.ui.closeBtn );

        this.ui.closeBtn.onPointerUpObservable.add( function()
        {
            self.closePopup();
        });
    }

    FPackageShop.prototype.createTopBannerItemUI = function( in_index )
    {
        var banner = GUI.CreateButton( "topBannerItem", px(0), px(0), px(645), px(343), PACKAGE_PATH+"topbanner"+ in_index.toString() +".png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );

        return banner;
    }

    FPackageShop.prototype.createPackageItemUI = function( in_index )
    {
        var item = GUI.CreateButton( "item", px(0), px(0), px(645*0.93), px(227*0.93), PACKAGE_PATH+"item"+in_index.toString()+".png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        
        var tag = null;
        var randomTagVal = CommFunc.random( 100 );
        if ( randomTagVal < 20 )
        {
            tag = GUI.CreateImage( "saleTag", px(280), px(0), px(84), px(88), PACKAGE_PATH+"saleTag.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
            GUI.alphaAnimation( tag, true, 1.2 );
            item.addControl( tag );
        }
        else if ( randomTagVal < 60 )
        {
            tag = GUI.CreateImage( "specialTag", px(280), px(0), px(79), px(103), PACKAGE_PATH+"specialTag.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
            GUI.alphaAnimation( tag, true, 1.2 );
            item.addControl( tag );
        }
        

        return item;
    }

    FPackageShop.prototype.setTestItem = function()
    {
        this.ui.topBannerListView.clearItem();
        this.ui.itemListView.clearItem();

        for (var i = 0; i < 3; ++i )
        {
            this.ui.topBannerListView.addItem( this.createTopBannerItemUI( i+1 ) );
        }

        for (var i = 0; i < 10; ++i )
        {
            this.ui.itemListView.addItem( this.createPackageItemUI( (i%3)+1 ) );
        }
    }

    FPackageShop.prototype.openPopup = function()
    {
        G.guiMain.addControl( this.ui.wrapper );
        FPopup.openAnimation( this.ui.wrapper );

        this.setTestItem();
    }

    FPackageShop.prototype.closePopup = function()
    {
        G.guiMain.removeControl( this.ui.wrapper );
    }
    

    //
    // run by runnableManager
    //
    FPackageShop.prototype.run = function()
    {
        if ( this.ui.topBannerListView != null )
            this.ui.topBannerListView.procLoop();

            
        if ( this.ui.itemListView != null )
            this.ui.itemListView.procLoop();
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
                instance = new FPackageShop();
                instance.constructor = null;
            }

            return instance;
        }
    };

    return FPackageShop;
}());