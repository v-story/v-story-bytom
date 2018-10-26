'use strict'

var testRoomInfo = function( in_roomIndex, in_roomName, in_roomPrice, in_roomImg )
{
    this.index = in_roomIndex;
    this.name = in_roomName;
    this.price = in_roomPrice;
    this.img = in_roomImg;
}

var testRoomList = [];
testRoomList.push( new testRoomInfo( 1, "러스틱 하우스 ", 100, "room_o_icon1.png" ) );
testRoomList.push( new testRoomInfo( 2, "라젠타 하우스", 500, "room_o_icon2.png" ) );
testRoomList.push( new testRoomInfo( 3, "베이직 하우스", 1200, "room_o_icon3.png" ) );
testRoomList.push( new testRoomInfo( 4, "클래식 하우스", 3000, "room_o_icon4.png" ) );
testRoomList.push( new testRoomInfo( 5, "시크릿 하우스", 7500, "room_o_icon5.png" ) );
testRoomList.push( new testRoomInfo( 6, "바우 하우스", 20000, "room_o_icon6.png" ) );
testRoomList.push( new testRoomInfo( 7, "추가예정 주택1", 20000, "room_o_icon6.png" ) );
testRoomList.push( new testRoomInfo( 8, "추가예정 주택2", 20000, "room_o_icon6.png" ) );
testRoomList.push( new testRoomInfo( 9, "추가예정 주택3", 20000, "room_o_icon6.png" ) );
testRoomList.push( new testRoomInfo( 10,"추가예정 주택4", 20000, "room_o_icon6.png" ) );
testRoomList.push( new testRoomInfo( 11,"추가예정 주택5", 20000, "room_o_icon6.png" ) );

var getRoomShopItemInfo = function( in_index )
{
    for ( var i = 0;  i < testRoomList.length; ++i )
    {
        if ( testRoomList[i].index == in_index )
        {
            return testRoomList[i];
        }
    }

    return null;
}

var ROOMSTORETAB = 
{
    INVEN : 0,
    SHOP : 1,
}

var ROOMSTORE_CALLBACK = 
{
    SELECT : 0,

    CLOSE : 1,
    APPLY : 2,
}

var FRoomChangeUI = (function()
{
    function FRoomChangeUI()
    {
        this.ui = 
        {
            wrapper : null,

            BG : null,

            invenTab : null,
            shopTab : null,

            roomListView : null,

            closeBtn : null,
            okBtn : null,
        }

        this.currentTab = null;
        this.currentSelectedRoomInfo = null;
        this.callbackFunc = null;

        this.init();
    }

    FRoomChangeUI.prototype.init = function()
    {
        G.runnableMgr.add( this );

        this.initUI();
    }

    FRoomChangeUI.prototype.initUI = function()
    {
        var self = this;

        this.ui.wrapper = GUI.createContainer();
        this.ui.wrapper.height = px(500);
        this.ui.wrapper.verticalAlignment = GUI.ALIGN_BOTTOM;
        this.ui.wrapper.isPointerBlocker = true;

        this.invenTab = GUI.CreateButton( "invenTabBtn", px(5), px(-265), px(138), px(74), ROOMSTOREUI_PATH+"room_tab0.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.wrapper.addControl( this.invenTab );
        this.invenTab.onPointerUpObservable.add( function()
        {
            self.onClickMyInvenTab();
        });

        this.ui.shopTab = GUI.CreateButton( "ShopTabBtn", px(145), px(-265), px(138), px(74), ROOMSTOREUI_PATH+"room_tab2.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.wrapper.addControl( this.ui.shopTab );
        this.ui.shopTab.onPointerUpObservable.add( function()
        {
            self.onClickShopTab();
        });

        this.ui.BG = GUI.CreateImage( "roomstoreBG", px(0), px(0), 1, px(267), ROOMSTOREUI_PATH+"bottombg.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        this.ui.wrapper.addControl( this.ui.BG );

        this.ui.roomListView = new GUI.createScrollView( this.ui.wrapper, "shopListView", px(0), px(15), px(720), px(260), 1.1, false, GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        this.ui.roomListView.setUseMouseWhell( false );

        var scrollBar = new GUI.createScrollBar( this.ui.roomListView, "shopListBar", SHOPUI_PATH+"s_bar.png", SHOPUI_PATH+"empty.png",  
            px(0), px(-5), px(710), px(15), px(77), px(15), GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        this.ui.roomListView.linkScrollBar( scrollBar );


        this.ui.closeBtn = GUI.CreateButton( "closeBtn", px(15), px(-360), px(121), px(118), ROOMSTOREUI_PATH+"star_no.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.wrapper.addControl( this.ui.closeBtn );
        this.ui.closeBtn.onPointerUpObservable.add( function()
        {
            self.onClickCloseBtn();
        });

        this.ui.okBtn = GUI.CreateButton( "okBtn", px(-15), px(-360), px(121), px(118), ROOMSTOREUI_PATH+"star_ok.png", GUI.ALIGN_RIGHT, GUI.ALIGN_BOTTOM );
        this.ui.wrapper.addControl( this.ui.okBtn );
        this.ui.okBtn.onPointerUpObservable.add( function()
        {
            self.onClickSetBtn();
        });
    }
    
    FRoomChangeUI.prototype.onClickMyInvenTab = function()
    {
        this.changeTab( ROOMSTORETAB.INVEN );
    }

    FRoomChangeUI.prototype.onClickShopTab = function()
    {
        this.changeTab( ROOMSTORETAB.SHOP );
    }

    FRoomChangeUI.prototype.onClickCloseBtn = function()
    {
        this.notifyMsgToCallback( ROOMSTORE_CALLBACK.CLOSE, this.currentSelectedRoomInfo );

        this.closeUI();
    }

    FRoomChangeUI.prototype.onClickSetBtn = function()
    {
        this.notifyMsgToCallback( ROOMSTORE_CALLBACK.APPLY, this.currentSelectedRoomInfo );
        
        this.closeUI();
    }

    FRoomChangeUI.prototype.createRoomItemUI = function( in_roomIndex )
    {
        var self = this;

        var roomShopItemInfo = getRoomShopItemInfo( in_roomIndex );

        var btn = GUI.CreateButton( "roomBtn"+in_roomIndex.toString(), px(0), px(0), px(164), px(188), ROOMSTOREUI_PATH+"room_o.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );

        var img = GUI.CreateImage( "roomImg"+in_roomIndex.toString(), px(0), px(10), px(151), px(138), ROOMSTOREUI_PATH+roomShopItemInfo.img, GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        btn.addControl( img );

        var name = GUI.CreateText( px(0), px(-10), roomShopItemInfo.name, "Black", 20, GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        btn.addControl( name );

        btn.onPointerUpObservable.add( function()
        {
            if ( self.ui.roomListView.blockTouchForScrolling )
                return;

            self.onSelectRoomShopItem( roomShopItemInfo );
        });

        return btn;
    }

    FRoomChangeUI.prototype.onSelectRoomShopItem = function( in_selectRoomInfo )
    {
        this.currentSelectedRoomInfo = in_selectRoomInfo;
        this.notifyMsgToCallback( ROOMSTORE_CALLBACK.SELECT, this.currentSelectedRoomInfo );
    }

    /**
     * @description 클릭하면 등록했던 콜백한테 타입과, 선택한 룸정보를 줌
     * @param {*} in_type  // 클릭 타입. ROOMSTORE_CALLBACK 으로 온다.
     * @param {*} in_info  // 선택했던 룸 아이템 정보. 선택하지 않았거나 에러일 경우 null 날아올 가능성 있음.
     */
    FRoomChangeUI.prototype.notifyMsgToCallback = function( in_type, in_info )
    {
        this.callbackFunc( in_type, in_info );
    }

    FRoomChangeUI.prototype.openUI = function( in_clickCallBack )
    {
        G.guiMain.showPopupMasking();

        G.guiMain.addControl( this.ui.wrapper );

        this.callbackFunc = in_clickCallBack;

        this.changeTab( ROOMSTORETAB.INVEN );
    }

    FRoomChangeUI.prototype.closeUI = function()
    {
        G.guiMain.removeControl( this.ui.wrapper );

        G.guiMain.hidePopupMasking();
    }

    FRoomChangeUI.prototype.changeTab = function( in_tab )
    {
        this.currentTab = in_tab;

        switch( this.currentTab )
        {
            case ROOMSTORETAB.INVEN :    this.openInven(); break;
            case ROOMSTORETAB.SHOP :     this.openShop();  break;
        }
    }

    FRoomChangeUI.prototype.openInven = function()
    {
        this.refreshItemList();
    }

    FRoomChangeUI.prototype.openShop = function()
    {
        FPopup.messageBox( "이런!", "상점은 준비중이에요!\n\n모든 방들은 다 가지고 있을 테니 보관함을 확인해 주세요.", BTN_TYPE.YES );
    }

    FRoomChangeUI.prototype.refreshItemList = function()
    {
        this.ui.roomListView.clearItem();

        for ( var i = 0; i < testRoomList.length; ++i )
        {
            this.ui.roomListView.addItem( this.createRoomItemUI( i+1 ) );
        }
    }

    //
    // run by runnableManager
    //
    FRoomChangeUI.prototype.run = function()
    {
        if ( this.ui.roomListView != null )
            this.ui.roomListView.procLoop();
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
                instance = new FRoomChangeUI();
                instance.constructor = null;
            }

            return instance;
        }
    };


    return FRoomChangeUI;
}());