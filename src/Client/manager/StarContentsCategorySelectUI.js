//
// Startcontents catergory select UI
//
var STARCON_SELECT_UI =
{
    BG          : 0,
    SCROLLVIEW  : 1,
    SCROLLBAR   : 2,

    CLOSEBTN    : 3,
    OKBTN       : 4,

    BALLOON     : 5,
}

var StarContentsCategorySelectUI = (function()
{
    function StarContentsCategorySelectUI()
    {

        this.ui = 
        {
            wrapper : null,

            uiList : []
        };
        
        this.selectInfo = 
        {
            btnUI : null,

            categoryIndex : null,
        }


        this.touchRoomObject = null;


        this.init();
    }

    StarContentsCategorySelectUI.prototype.init = function()
    {
        G.runnableMgr.add( this );

        this.initUI();
    }

    StarContentsCategorySelectUI.prototype.initUI = function()
    {
        var self = this;

        this.ui.wrapper = GUI.createContainer();
        this.ui.wrapper.verticalAlignment = GUI.ALIGN_BOTTOM;
        this.ui.wrapper.isPointerBlocker = true;
        
        this.ui.uiList[STARCON_SELECT_UI.BG] = GUI.CreateImage( "ShopBG", px(0), px(0), 1, px(267), SHOPUI_PATH+"s_f5.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        this.ui.wrapper.addControl( this.ui.uiList[STARCON_SELECT_UI.BG] );

        this.ui.uiList[STARCON_SELECT_UI.SCROLLVIEW] = new GUI.createScrollView( this.ui.wrapper, "shopListView", px(0), px(15), px(720), px(260), 1.1, false, GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        this.ui.uiList[STARCON_SELECT_UI.SCROLLBAR] = new GUI.createScrollBar( this.ui.uiList[STARCON_SELECT_UI.SCROLLVIEW], "shopListBar", SHOPUI_PATH+"s_bar.png", SHOPUI_PATH+"empty.png",  
            px(0), px(-5), px(710), px(15), px(77), px(15), GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        this.ui.uiList[STARCON_SELECT_UI.SCROLLVIEW].linkScrollBar( this.ui.uiList[STARCON_SELECT_UI.SCROLLBAR] );

        var CloseBtn = GUI.CreateButton( "CloseBtn", px(5), px(-360), px(121), px(118), SHOPUI_PATH+"star_no.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.uiList[STARCON_SELECT_UI.CLOSEBTN] = CloseBtn;
        this.ui.wrapper.addControl( CloseBtn );
        CloseBtn.onPointerUpObservable.add( function()
        {
            self.onClickCloseBtn();
        });

        var okBtn = GUI.CreateButton( "okBtn", px(-5), px(-360), px(121), px(118), SHOPUI_PATH+"star_ok.png", GUI.ALIGN_RIGHT, GUI.ALIGN_BOTTOM );
        this.ui.uiList[STARCON_SELECT_UI.OKBTN] = okBtn;
        this.ui.wrapper.addControl( okBtn );
        okBtn.onPointerUpObservable.add( function()
        {
            self.onClickOkBtn();
        });
        

        var balloonImg = GUI.CreateButton( "balloonImg", px(0), px(-240), px(377), px(140), SHOPUI_PATH+"star_word.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        this.ui.uiList[STARCON_SELECT_UI.BALLOON] = balloonImg;
        this.ui.wrapper.addControl( balloonImg );
        GUI.alphaAnimation( balloonImg, true, 1 );
    }

    StarContentsCategorySelectUI.prototype.closeUI = function()
    {        
        G.guiMain.removeControl( this.ui.wrapper );
    }

    StarContentsCategorySelectUI.prototype.clearSelectInfo = function()
    {
        this.selectInfo.btnUI = null;
        this.selectInfo.categoryIndex = null;
        
        this.ui.uiList[ STARCON_SELECT_UI.OKBTN ].alpha = 0.3;
    }
    
    StarContentsCategorySelectUI.prototype.openCategoryList = function( in_touchRoomObject )
    {
        this.clearSelectInfo();
        
        this.touchRoomObject = in_touchRoomObject;
        this.refreshCategoryList();

        G.guiMain.addControl( this.ui.wrapper );
        FPopup.openAnimation( this.ui.wrapper );
    }

    StarContentsCategorySelectUI.prototype.onClickCloseBtn = function()
    {
        this.closeUI();

        this.clearSelectInfo();
    }

    StarContentsCategorySelectUI.prototype.onClickOkBtn = function()
    {   
        if ( this.selectInfo.categoryIndex == null )
            return;

        snsCommonFunc.snsView( 15 );
        snsCommonFunc.setStarContentSequence(this.selectStarContentSequence, this);
    }

    StarContentsCategorySelectUI.prototype.selectStarContentSequence = function(self, postSeq) {
        
//       scene.dropPick(x,y, postSeq);

        //서버통신
        self.postStarContents(postSeq);
        self.onClickCloseBtn();
    }


    StarContentsCategorySelectUI.prototype.postStarContents = function(postSeq) {

        var self = this;
        var regTag = [this.selectInfo.categoryIndex];            
        var regStarPostSeq = [postSeq];
        var cd = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getStarContCD();
        var option = {
            'param' : {
                'serverIndex': SERVERINDEX,
                'accountPk': ACCOUNTPK,
                'star_cont_cd': cd,
                'star_cont_nm': G.dataManager.getInterestDataName(this.selectInfo.categoryIndex),
                'arr_star_cont_tag': regTag,
                'obj_map_seq': this.touchRoomObject.getSeq(),
                'arr_post_seq': regStarPostSeq
            },
            'url' : '/funfactory-1.0/regStarContents'
        };

        postCall(option)
        // 콜백에러체크
        .then(function(rs){
            return snsCommonFunc.msgProtocal(rs);
        })
        .then(function(rs){
            // sns 닫고
            //스타콘텐츠 그리기
            var sc = new sStarContent();
            var info = rs.callback;

            sc.STARCONTSEQ    = info.STAR_CONT_SEQ;
            sc.STARCONTCD     = info.STAR_CONT_CD;
            sc.REPRSTIMGNM    = info.REPRST_IMG_NM;
            sc.FILETYPE       = info.FILE_TYPE;
            sc.OBJMAPSEQ      = info.OBJ_MAP_SEQ;
            sc.POSTCNT        = info.POST_CNT;

            G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushStarContent(info.STAR_CONT_SEQ,
                                                        info.STAR_CONT_CD,
                                                        info.REPRST_IMG_NM,
                                                        info.FILE_TYPE,
                                                        info.OBJ_MAP_SEQ,
                                                        info.POST_CNT);

            G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushMyStarContent(info.STAR_CONT_SEQ,
                                                        info.STAR_CONT_CD,
                                                        info.REPRST_IMG_NM,
                                                        info.FILE_TYPE, info.POST_CNT, 0);

            var contentsInfo = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getStarContentInfo();

            self.touchRoomObject.setStarContentUrl(contentsInfo.URL,contentsInfo.IMG_PATH,contentsInfo.VDO_PATH,contentsInfo.VDO_THUMBNAILPATH);
            self.touchRoomObject.setStarContentInfo(sc);
            self.touchRoomObject.setStarContentsUI();

            FPopup.messageBox("성공", "스타콘텐츠를 생성하였습니다.", BTN_TYPE.OK);
            self.closeUI();
        })
         // 에러
        .catch(function(err){
            snsCommonFunc.alertMsg(err);

            // 로더비활성화
            loaderViewer.hide();
        });
    }

    StarContentsCategorySelectUI.prototype.refreshCategoryList = function()
    {
        this.ui.uiList[ STARCON_SELECT_UI.SCROLLVIEW ].clearItem();

        for ( var i = 0; i < 21; ++i )
        {
            this.ui.uiList[ STARCON_SELECT_UI.SCROLLVIEW ].addItem( this.createCategoryListItem( i+1 ) );
        }
    }

    StarContentsCategorySelectUI.prototype.createCategoryListItem = function( in_index )
    {
        var self = this;

        var button = GUI.CreateButton( "invenTabBtn", px(0), px(0), px(164), px(188), SHOPUI_PATH+"starcon_category_icon/" + in_index.toString() +".png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );

        var selectCover = GUI.CreateImage( "selectCover", px(0), px(0), 1, 1, SHOPUI_PATH+"starcon_category_icon/selectCover.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        button.addControl( selectCover );
        selectCover.isVisible = false;

        var debugText = GUI.CreateText( px(0), px(-10), "Debug:"+in_index.toString(), "Black", 20, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        // button.addControl( debugText );

        if ( G.dataManager.getUsrMgr( DEF_IDENTITY_ME ).isRegStarCd( in_index ) ) // 이미 등록된것
        {
            button.alpha = 0.5;
            button.onPointerUpObservable.add( function()
            {
                if ( self.ui.uiList[ STARCON_SELECT_UI.SCROLLVIEW ].blockTouchForScrolling )
                    return;

                FPopup.messageBox( "알림!", "해당 스타컨텐츠 카테고리는 이미 등록한 카테고리입니다.\n\n다른 카테고리를 선택해 주세요~", BTN_TYPE.OK );
            });
        }
        else
        {
            button.onPointerUpObservable.add( function()
            {
                if ( self.ui.uiList[ STARCON_SELECT_UI.SCROLLVIEW ].blockTouchForScrolling )
                    return;
                    
                self.onSelectListItem( in_index, button );
            });
        }

        return button;
    }

    StarContentsCategorySelectUI.prototype.onSelectListItem = function( in_index, in_ui )
    {
        if ( this.selectInfo.btnUI != null )
        {
            this.selectInfo.btnUI.getChildByName("selectCover").isVisible = false;
        }        
        in_ui.getChildByName("selectCover").isVisible = true;

        this.selectInfo.categoryIndex = in_index;
        this.selectInfo.btnUI = in_ui;

        this.ui.uiList[ STARCON_SELECT_UI.OKBTN ].alpha = 1;
    }

    StarContentsCategorySelectUI.prototype.run = function()
    {
        if ( this.ui.uiList[STARCON_SELECT_UI.SCROLLVIEW] != null )
            this.ui.uiList[STARCON_SELECT_UI.SCROLLVIEW].procLoop();
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
                instance = new StarContentsCategorySelectUI();
                instance.constructor = null;
            }

            return instance;
        }
    };

    return StarContentsCategorySelectUI;
}());

