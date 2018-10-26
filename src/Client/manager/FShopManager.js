'use strict'

var SHOPUI = 
{
    TAB         :0,
    BG          :1,
    SCROLLVIEW  :2,
    SCROLLBAR   :3,

    CLOSEBTN    :4,
    SETBTN      :5,
    SELLBTN     :6,
}

var SHOPTABSTATE =
{
    MYINVEN : 0,
    SHOP    : 1,
}

var FShopManager = (function() 
{
    function FShopManager()
    {
        this.ui = 
        {
            wrapper : null,

            button : [],
        }

        this.currentShopTabState = null;
        this.currentObjData = null;
        this.changeObjectCallback = null;

        this.selectInfo = 
        {
            btnUI : null,

            objData : null,
        }

        this.init();
    }

    // init all func
    FShopManager.prototype.init = function()
    {        
        G.runnableMgr.add( this );        

        this.initUI();
    }

    // init ui
    FShopManager.prototype.initUI = function()
    {
        var self = this;

        this.ui.wrapper = GUI.createContainer();
        this.ui.wrapper.verticalAlignment = GUI.ALIGN_BOTTOM;
        this.ui.wrapper.isPointerBlocker = true;

        this.ui.button[SHOPUI.TAB] = [];

        var MYInvenTabBtn = GUI.CreateButton( "invenTabBtn", px(5), px(-265), px(138), px(74), SHOPUI_PATH+"s_t-1.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.button[SHOPUI.TAB].push( MYInvenTabBtn );
        this.ui.wrapper.addControl( MYInvenTabBtn );
        MYInvenTabBtn.onPointerUpObservable.add( function()
        {
            self.onClickMyInvenTab();
        });

        var ShopTabBtn = GUI.CreateButton( "ShopTabBtn", px(145), px(-265), px(138), px(74), SHOPUI_PATH+"s_t2.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.button[SHOPUI.TAB].push( ShopTabBtn );
        this.ui.wrapper.addControl( ShopTabBtn );
        ShopTabBtn.onPointerUpObservable.add( function()
        {
            self.onClickShopTab();
        });


        this.ui.button[SHOPUI.BG] = GUI.CreateImage( "ShopBG", px(0), px(0), 1, px(267), SHOPUI_PATH+"s_f5.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        this.ui.wrapper.addControl( this.ui.button[SHOPUI.BG] );

        this.ui.button[SHOPUI.SCROLLVIEW] = new GUI.createScrollView( this.ui.wrapper, "shopListView", px(0), px(15), px(720), px(260), 1.1, false, GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );

        this.ui.button[SHOPUI.SCROLLBAR] = new GUI.createScrollBar( this.ui.button[SHOPUI.SCROLLVIEW], "shopListBar", SHOPUI_PATH+"s_bar.png", SHOPUI_PATH+"empty.png",  
            px(0), px(-5), px(710), px(15), px(77), px(15), GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        this.ui.button[SHOPUI.SCROLLVIEW].linkScrollBar( this.ui.button[SHOPUI.SCROLLBAR] );

        var CloseBtn = GUI.CreateButton( "CloseBtn", px(5), px(-360), px(121), px(118), SHOPUI_PATH+"s_b1.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.button[SHOPUI.CLOSEBTN] = CloseBtn;
        this.ui.wrapper.addControl( CloseBtn );
        CloseBtn.onPointerUpObservable.add( function()
        {
            self.onClickCloseBtn();
        });

        var setBtn = GUI.CreateButton( "setBtn", px(-5), px(-360), px(121), px(118), SHOPUI_PATH+"s_b2.png", GUI.ALIGN_RIGHT, GUI.ALIGN_BOTTOM );
        this.ui.button[SHOPUI.SETBTN] = setBtn;
        this.ui.wrapper.addControl( setBtn );
        setBtn.onPointerUpObservable.add( function()
        {
            self.onClickSetBtn();
        });

        var sellBtn = GUI.CreateButton( "sellBtn", px(-131), px(-360), px(121), px(118), SHOPUI_PATH+"s_b3.png", GUI.ALIGN_RIGHT, GUI.ALIGN_BOTTOM );
        this.ui.button[SHOPUI.SELLBTN] = sellBtn;
        this.ui.wrapper.addControl( sellBtn );
        sellBtn.onPointerUpObservable.add( function()
        {
            self.onClickSellBtn();
        });
    }

    FShopManager.prototype.setChangeObjectCallback = function( in_callBackFunc )
    {
        this.changeObjectCallback = in_callBackFunc;
    }

    FShopManager.prototype.clearChangeObjectCallback = function()
    {
        this.changeObjectCallback = null;
    }

    FShopManager.prototype.onClickMyInvenTab = function()
    {
        if ( this.currentShopTabState == SHOPTABSTATE.MYINVEN )
            return;

        this.currentShopTabState = SHOPTABSTATE.MYINVEN;

        GUI.changeButtonImage( this.ui.button[SHOPUI.TAB][SHOPTABSTATE.MYINVEN], SHOPUI_PATH+"s_t.png" );
        GUI.changeButtonImage( this.ui.button[SHOPUI.TAB][SHOPTABSTATE.SHOP], SHOPUI_PATH+"s_t2.png" );
        
        this.ui.button[SHOPUI.SELLBTN].isVisible = true;
        this.clearSelectInfo();

        this.refreshListToMyItem();
    }

    FShopManager.prototype.onClickShopTab = function()
    {
        if ( this.currentShopTabState == SHOPTABSTATE.SHOP )
            return;

        this.currentShopTabState = SHOPTABSTATE.SHOP;

        GUI.changeButtonImage( this.ui.button[SHOPUI.TAB][SHOPTABSTATE.MYINVEN], SHOPUI_PATH+"s_t-1.png" );
        GUI.changeButtonImage( this.ui.button[SHOPUI.TAB][SHOPTABSTATE.SHOP], SHOPUI_PATH+"s_t2-1.png" );

        this.ui.button[SHOPUI.SELLBTN].isVisible = false;
        this.clearSelectInfo();

        this.refreshListToShopItem();
    }

    FShopManager.prototype.onClickCloseBtn = function()
    {
        if ( this.changeObjectCallback != null )
        {
            this.changeObjectCallback( -1 );
        }

        this.clearChangeObjectCallback();
        this.closeShopUI();
    }
    
    FShopManager.prototype.openAskPopupSell = function()
    {
        var self = this;
        
        FPopup.messageBox( "판매 확인", G.dataManager.getString( this.selectInfo.objData.OBJ_NM ) + "을(를) 판매하시겠습니까?", BTN_TYPE.YESNO, function( in_customData, in_result )
        {
            self.onReceiveSellPopupResult( in_result );
        });
    }

    FShopManager.prototype.onReceiveSellPopupResult = function( in_result )
    {
        var self = this;

        switch( in_result )
        {
        case MSGBOX_BTN_RESULT.CLICK_OK :
            {
                G.dataManager.getUsrMgr(DEF_IDENTITY_ME).sellInventory( self.selectInfo.objData.OBJ_ID );

                self.clearSelectInfo();
                self.refreshListToMyItem();
            }
            break;
        }
    }

    FShopManager.prototype.openAskPopupBuy = function()
    {
        var self = this;
        
        FPopup.messageBox( "구매 확인", G.dataManager.getString( this.selectInfo.objData.OBJ_NM ) + "을(를) 구매하시겠습니까?", BTN_TYPE.YESNO, function( in_customData, in_result )
        {
            self.onReceiveBuyPopupResult( in_result );
        });
    }

    FShopManager.prototype.onReceiveBuyPopupResult = function( in_result )
    {
        var self = this;

        switch( in_result )
        {
        case MSGBOX_BTN_RESULT.CLICK_OK :
            {
                G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushInventory( self.selectInfo.objData.OBJ_ID );

                self.selectInfo.btnUI.getChildByName("countText").text = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getItemCountInInventory( self.selectInfo.objData.OBJ_ID ).toString();

                self.openAskPopupSet();
            }
            break;
        }
    }

    FShopManager.prototype.openAskPopupSet = function()
    {
        var self = this;
        
        FPopup.messageBox( "교체 확인", "현재 오브젝트를 " + G.dataManager.getString( this.selectInfo.objData.OBJ_NM ) + "로 교체하시겠습니까?", BTN_TYPE.YESNO, function( in_customData, in_result )
        {
            self.onReceiveSetPopupResult( in_result );
        });
    }

    FShopManager.prototype.onReceiveSetPopupResult = function( in_result )
    {
        var self = this;

        switch( in_result )
        {
        case MSGBOX_BTN_RESULT.CLICK_OK :
            {
                if ( self.changeObjectCallback != null )
                {
                    self.changeObjectCallback( self.selectInfo.objData.OBJ_ID, true );

                    // 확정하고 UI 닫아줌
                    G.cameraManager.clearTarget();
                    self.clearChangeObjectCallback();
                    self.closeShopUI();
                }
            }
            break;
        }
    }

    FShopManager.prototype.onClickSellBtn = function()
    {
        if ( this.selectInfo.objData == null )
            return;

        this.openAskPopupSell();
    }

    FShopManager.prototype.onClickSetBtn = function()
    {
        if ( this.selectInfo.objData == null )
            return;

        switch( this.currentShopTabState )
        {
        case SHOPTABSTATE.SHOP : // 구매팝업
            {
                this.openAskPopupBuy();
            }
            break;

        case SHOPTABSTATE.MYINVEN : // 장착팝업 :
            {
                this.openAskPopupSet();
            }
            break;
        }
    }
    
    // open shopUI
    FShopManager.prototype.openShopUI = function( in_clickObjectData )
    {
        this.currentObjData = in_clickObjectData;

        G.guiMain.addControl( this.ui.wrapper );
        FPopup.openAnimation( this.ui.wrapper );

        this.currentShopTabState = SHOPTABSTATE.MYINVEN; // 내부에서 같은탭일때 처리 안하게 되어있어가지고 강제로세팅해주고 초기화한다.
        this.onClickShopTab();
    }

    // close shopUI
    FShopManager.prototype.closeShopUI = function()
    {
        G.guiMain.removeControl( this.ui.wrapper );
    }

    
    FShopManager.prototype.refreshListToMyItem = function()
    {
        this.ui.button[SHOPUI.SCROLLVIEW].clearItem();

        var myInvenCategoryItem = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getInventory( this.currentObjData.OBJ_CATE );

        for( var i = 0; i < myInvenCategoryItem.length; ++i )
        {
            var objData = G.dataManager.getOBJInfo(myInvenCategoryItem[i]);
            this.ui.button[SHOPUI.SCROLLVIEW].addItem( this.createObjectListitem( objData, true ) );
        }
    }

    FShopManager.prototype.refreshListToShopItem = function()
    {
        this.ui.button[SHOPUI.SCROLLVIEW].clearItem();

        var storeItemList = G.dataManager.getObjForCategory( this.currentObjData.OBJ_CATE );

        for( var i = 0; i < storeItemList.length; ++i )
        {
            var objData = G.dataManager.getOBJInfo(storeItemList[i]);
            this.ui.button[SHOPUI.SCROLLVIEW].addItem( this.createObjectListitem( objData, false ) );
        }
    }

    FShopManager.prototype.clearSelectInfo = function()
    {
        this.selectInfo.btnUI = null;
        this.selectInfo.objData = null;

        this.ui.button[ SHOPUI.SELLBTN ].alpha = 0.3;
        this.ui.button[ SHOPUI.SETBTN  ].alpha = 0.3;
    }

    FShopManager.prototype.onSelectListItem = function( in_objData, in_ui, in_isMyItem )
    {
        if ( this.selectInfo.btnUI != null )
        {
            GUI.changeButtonImage( this.selectInfo.btnUI, SHOPUI_PATH + "s_o.png" );
        }

        this.selectInfo.objData = in_objData;
        this.selectInfo.btnUI = in_ui;
        
        GUI.changeButtonImage( this.selectInfo.btnUI, SHOPUI_PATH + "s_o_select.png" );

        if ( this.changeObjectCallback != null )
        {
            this.changeObjectCallback( in_objData.OBJ_ID );
        }
        
        this.ui.button[ SHOPUI.SELLBTN ].alpha = 1;
        this.ui.button[ SHOPUI.SETBTN  ].alpha = 1;
    }

    // create object list each item ui
    FShopManager.prototype.createObjectListitem = function( in_data, in_isMyItem )
    {
        var self = this;

        var button = GUI.CreateButton( "invenTabBtn", px(0), px(0), px(164), px(188), SHOPUI_PATH+"s_o.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );

        var icon = GUI.CreateImage( "shopListItemIcon", px(0), px(-25), px(145), px(130), SHOPUI_PATH+"object_icon/"+in_data.OBJ_ID.toString()+".png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        button.addControl( icon );

        var text = GUI.CreateText( px(0), px(-10), G.dataManager.getString( in_data.OBJ_NM ), "Black", 20, GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        button.addControl( text );

        // var debugText = GUI.CreateText( px(0), px(-10), "Debug:"+in_data.OBJ_ID.toString(), "Black", 20, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        // button.addControl( debugText );

        if ( in_isMyItem )
        {
            var priceSymbol = GUI.CreateImage( "priceSymbol", px(8), px(-49), px(26), px(26), SHOPUI_PATH+"s_b3.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
            button.addControl( priceSymbol );
    
            var priceText = GUI.CreateText( px(40), px(-50), in_data.OBJ_ITEM_PRICE_SELL.toString(), "Gray", 20, GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
            button.addControl( priceText );
        }
        else
        {
            var priceSymbol = GUI.getSymbolImage( in_data.OBJ_ITEM_ID, px(26), px(26), px(8), px(-49), GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
            button.addControl( priceSymbol );
    
            var priceText = GUI.CreateText( px(40), px(-50), in_data.OBJ_ITEM_PRICE_BUY.toString(), "Gray", 20, GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
            button.addControl( priceText );

            var countText = GUI.CreateText( px(-75), px(10), G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getItemCountInInventory( in_data.OBJ_ID ).toString(), 
                "Black", 17, GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
            button.addControl( countText ); 
            countText.name = "countText";
    
            var countDescText = GUI.CreateText( px(-8), px(10), "개 보유중", "Gray", 15, GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
            button.addControl( countDescText ); 

            // button.onPointerUpObservable.add( function()
            // {
            //     G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushInventory( in_data.OBJ_ID );

            //     self.refreshListToShopItem();
            // });
        }

        button.onPointerUpObservable.add( function()
        {
            // if ( self.ui.button[SHOPUI.SCROLLVIEW].blockTouchForScrolling )
            //     return;

            self.onSelectListItem( in_data, button, in_isMyItem );
        });

        return button;
    }

    //
    // runnalbeManager
    //
    FShopManager.prototype.run = function()
    {
        if ( this.ui.button[SHOPUI.SCROLLVIEW] != null )
            this.ui.button[SHOPUI.SCROLLVIEW].procLoop();
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
                instance = new FShopManager();
                instance.constructor = null;
            }

            return instance;
        }
    };

    return FShopManager;
}());


