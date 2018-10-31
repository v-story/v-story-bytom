'use strict'

var BYTOM_SCREEN_TYPE =
{
    PROFILE         : 0,
    BTM_TO_SMILE    : 1,
    SMILE_TO_BTM    : 2,
    EXCHANGE_LIST   : 3,

    MAX             : 4,
}

var FBytomExchange = (function ()
{
    function FBytomExchange()
    {
        this.m_ui =
        {
            wrapper : null,
            closeBtn : null,
            bg : null,
            title : null,

            loading : null,
            
            tabBtn : [],
            screenWrapper : [],

            profileArea :
            {
                bg : null,

                profile : null,

                id : null,
                gender : null,
                intro : null,
                
                btmAccID : null,
                smileBalance : null,
                bytomBalance : null,

                cancelBtn : null,
                viewListBtn : null,
            },

            btmToSmileArea :
            {
                bg : null,

                needBtm : null,
                haveBtm : null,

                buySmile : null,
                haveSmile : null,

                limitGas : null,
                needGas : null,
                
                cancelBtn : null,
                exchangeBtn : null,

                inputDummy : null,
            },

            smileToBtmArea : 
            {
                bg : null,
                
                useSmile : null,
                haveSmile : null,

                buyBtm : null,
                haveBtm : null,

                limitGas : null,
                needGas : null,
                
                cancelBtn : null,
                exchangeBtn : null,
                
                inputDummy : null,
            },

            exchangeListArea : 
            {
                emptyWarning : null,

                listView : null,
                listBar : null,
            },

            sliderPopup :
            {
                warpper : null,
            }
        }

        // init func
        this.init();
    }

    FBytomExchange.prototype.init = function()
    {
        G.runnableMgr.add( this );

        this.initUI();
    }

    FBytomExchange.prototype.initUI = function()
    {
        var self = this;

        this.m_ui.wrapper = FPopup.createPopupWrapper( "black", 0.75 );
        this.m_ui.wrapper.isPointerBlocker = true;

        this.m_ui.bg = GUI.CreateImage( "bg", px(0), px(0), px(644), px(766), BTM_PATH+"Btm_popup1_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.m_ui.wrapper.addControl( this.m_ui.bg );

        this.m_ui.loading = GUI.CreateImage( "loadgin", px(0), px(35), px(150), px(150), ASSET_URL+"99_Images/loading.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );

        //
        // profile wrapper
        //
        var profileWrapper = GUI.createContainer();
        profileWrapper.width = px(644);
        profileWrapper.height = px(766);
        this.m_ui.wrapper.addControl( profileWrapper );

        this.m_ui.profileArea.bg = GUI.CreateImage( "profilebg", px(0), px(35), px(593), px(508), BTM_PATH+"Btm_profile_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        profileWrapper.addControl( this.m_ui.profileArea.bg );

        this.m_ui.profileArea.profile = GUI.CreateCircleButton('myprofile', px(-155), px(-110), px(130), px(130), G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getUrl(), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE, false );
        profileWrapper.addControl( this.m_ui.profileArea.profile );
        
        this.m_ui.profileArea.id = GUI.CreateText( px(160), px(-178), "프로필아이디", "Black", 23, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        profileWrapper.addControl( this.m_ui.profileArea.id );
        
        this.m_ui.profileArea.gender = GUI.CreateText( px(160), px(-132), "프로필성별", "Black", 23, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        profileWrapper.addControl( this.m_ui.profileArea.gender );
        
        this.m_ui.profileArea.intro = GUI.CreateText( px(135), px(-50), "프로필소개말", "Black", 23, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        profileWrapper.addControl( this.m_ui.profileArea.intro );
        this.m_ui.profileArea.intro.onPointerUpObservable.add( function()
        {
            console.log("나를 클릭했어?!");
        });

        
        this.m_ui.profileArea.btmAccID = GUI.CreateText( px(-75), px(80), "바이텀아이디", "Black", 23, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        profileWrapper.addControl( this.m_ui.profileArea.btmAccID );
        
        this.m_ui.profileArea.smileBalance = GUI.CreateText( px(-75), px(155), "스마일잔액 100,000", "Black", 23, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        profileWrapper.addControl( this.m_ui.profileArea.smileBalance );
        
        this.m_ui.profileArea.bytomBalance = GUI.CreateText( px(-75), px(225), "바이텀잔액 100,000", "Black", 23, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        profileWrapper.addControl( this.m_ui.profileArea.bytomBalance );

        this.m_ui.profileArea.cancelBtn = GUI.CreateButton( "profileCancelBtn", px(-155), px(330), px(298), px(67), BTM_PATH+"Btm_btn1.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        profileWrapper.addControl( this.m_ui.profileArea.cancelBtn );
        this.m_ui.profileArea.cancelBtn.onPointerUpObservable.add( function()
        {
            self.onClickCloseBtn();
        });

        this.m_ui.profileArea.viewListBtn = GUI.CreateButton( "profileviewListBtn", px(155), px(330), px(298), px(67), BTM_PATH+"Btm_btn3.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        profileWrapper.addControl( this.m_ui.profileArea.viewListBtn );
        this.m_ui.profileArea.viewListBtn.onPointerUpObservable.add( function()
        {
            self.onClickTabBtn( BYTOM_SCREEN_TYPE.EXCHANGE_LIST );
        });


        this.m_ui.screenWrapper.push( profileWrapper );


        //
        // btm to smile
        //
        var btmToSmileWrapper = GUI.createContainer();
        btmToSmileWrapper.width = px(644);
        btmToSmileWrapper.height = px(766);
        this.m_ui.wrapper.addControl( btmToSmileWrapper );
        
        this.m_ui.btmToSmileArea.bg = GUI.CreateImage( "btmToSmileBG", px(0), px(35), px(595), px(507), BTM_PATH+"Btm_change1_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        btmToSmileWrapper.addControl( this.m_ui.btmToSmileArea.bg );

        this.m_ui.btmToSmileArea.needBtm = GUI.CreateText( px(-360), px(26), "필요BTM(자동계산)", "Black", 20, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        btmToSmileWrapper.addControl( this.m_ui.btmToSmileArea.needBtm );

        this.m_ui.btmToSmileArea.haveBtm = GUI.CreateText( px(-360), px(74), "보유BTM", "Black", 20, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        btmToSmileWrapper.addControl( this.m_ui.btmToSmileArea.haveBtm );

        this.m_ui.btmToSmileArea.haveSmile = GUI.CreateText( px(-50), px(74), "보유스마일", "Black", 20, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        btmToSmileWrapper.addControl( this.m_ui.btmToSmileArea.haveSmile );

        this.m_ui.btmToSmileArea.limitGas = GUI.CreateText( px(-75), px(194), "1~10까지 비용을 정할 수 있습니다.", "White", 23, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        btmToSmileWrapper.addControl( this.m_ui.btmToSmileArea.limitGas );
        

        this.m_ui.btmToSmileArea.cancelBtn = GUI.CreateButton( "cancelBtn", px(-155), px(330), px(298), px(67), BTM_PATH+"Btm_btn1.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.m_ui.btmToSmileArea.cancelBtn.onPointerUpObservable.add( function()
        {
            self.onClickCloseBtn();
        });
        btmToSmileWrapper.addControl( this.m_ui.btmToSmileArea.cancelBtn );

        this.m_ui.btmToSmileArea.exchangeBtn = GUI.CreateButton( "exchangeBtn", px(155), px(330), px(298), px(67), BTM_PATH+"Btm_btn2.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        btmToSmileWrapper.addControl( this.m_ui.btmToSmileArea.exchangeBtn );
        this.m_ui.btmToSmileArea.exchangeBtn.onPointerUpObservable.add( function()
        {
            self.onclickBtmToSmileExchange();
        });

        
        // this.m_ui.btmToSmileArea.buySmile = GUI.CreateText( px(-50), px(26), "(입력해 주세요) 0", "Yellow", 20, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        this.m_ui.btmToSmileArea.buySmile = GUI.createInputText( "inputText",
        px(-50),
        px(26),
        px(150),
        px(37),
        "(입력해 주세요) 0",
        "Yellow",
        20,
        GUI.ALIGN_RIGHT,
        GUI.ALIGN_MIDDLE );

        btmToSmileWrapper.addControl( this.m_ui.btmToSmileArea.buySmile );
        GUI.alphaAnimation( this.m_ui.btmToSmileArea.buySmile, true, 1 );   
        this.m_ui.btmToSmileArea.buySmile.onBlurObservable.add( function()
        {
            self.setBtmToSmileScreen( self.m_ui.btmToSmileArea.buySmile.text, self.m_ui.btmToSmileArea.needGas.text );
        });


        
        // this.m_ui.btmToSmileArea.needGas = GUI.CreateText( px(-75), px(244), "1", "Yellow", 23, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        this.m_ui.btmToSmileArea.needGas = GUI.createInputText( "inputText",
        px(-75),
        px(244),
        px(80),
        px(37),
        "(입력해 주세요) 0",
        "Yellow",
        20,
        GUI.ALIGN_RIGHT,
        GUI.ALIGN_MIDDLE );

        btmToSmileWrapper.addControl( this.m_ui.btmToSmileArea.needGas );
        GUI.alphaAnimation( this.m_ui.btmToSmileArea.needGas, true, 1 );
        this.m_ui.btmToSmileArea.needGas.onBlurObservable.add( function()
        {
            self.setBtmToSmileScreen( self.m_ui.btmToSmileArea.buySmile.text, self.m_ui.btmToSmileArea.needGas.text );
        });


        // this.m_ui.btmToSmileArea.inputDummy = GUI.CreateButton( "inputDummy", px(-50), px(26), px(250), px(30), GUI.DEFAULT_IMAGE_PATH_NEW+"empty.png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        // this.m_ui.btmToSmileArea.inputDummy.onPointerUpObservable.add( function()
        // {
        //     console.log("더미클릭 ! 슬라이드바 슈캍슈캉");
        // });        
        // btmToSmileWrapper.addControl( this.m_ui.btmToSmileArea.inputDummy );

        this.m_ui.screenWrapper.push( btmToSmileWrapper );

        //
        // smile to btm
        //
        var smileToBtmWrapper = GUI.createContainer();
        smileToBtmWrapper.width = px(644);
        smileToBtmWrapper.height = px(766);
        this.m_ui.wrapper.addControl( smileToBtmWrapper );
        
        this.m_ui.smileToBtmArea.bg = GUI.CreateImage( "smileToBtmBG", px(0), px(35), px(595), px(507), BTM_PATH+"Btm_change2_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        smileToBtmWrapper.addControl( this.m_ui.smileToBtmArea.bg );

        this.m_ui.smileToBtmArea.haveSmile = GUI.CreateText( px(-360), px(74), "보유스마일", "Black", 20, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        smileToBtmWrapper.addControl( this.m_ui.smileToBtmArea.haveSmile );

        this.m_ui.smileToBtmArea.buyBtm = GUI.CreateText( px(-50), px(26), "환전BTM(자동계산)", "Black", 20, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        smileToBtmWrapper.addControl( this.m_ui.smileToBtmArea.buyBtm );

        this.m_ui.smileToBtmArea.haveBtm = GUI.CreateText( px(-50), px(74), "보유BTM", "Black", 20, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        smileToBtmWrapper.addControl( this.m_ui.smileToBtmArea.haveBtm );

        this.m_ui.smileToBtmArea.limitGas = GUI.CreateText( px(-75), px(194), "1~10까지 비용을 정할 수 있습니다.", "White", 23, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        smileToBtmWrapper.addControl( this.m_ui.smileToBtmArea.limitGas );

        this.m_ui.smileToBtmArea.cancelBtn = GUI.CreateButton( "cancelBtn", px(-155), px(330), px(298), px(67), BTM_PATH+"Btm_btn1.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.m_ui.smileToBtmArea.cancelBtn.onPointerUpObservable.add( function()
        {
            self.onClickCloseBtn();
        });
        smileToBtmWrapper.addControl( this.m_ui.smileToBtmArea.cancelBtn );

        this.m_ui.smileToBtmArea.exchangeBtn = GUI.CreateButton( "exchangeBtn", px(155), px(330), px(298), px(67), BTM_PATH+"Btm_btn2.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        smileToBtmWrapper.addControl( this.m_ui.smileToBtmArea.exchangeBtn );
        this.m_ui.smileToBtmArea.exchangeBtn.onPointerUpObservable.add( function()
        {
            self.onclickSmileToBtmExchange();
        });
        
        
        // this.m_ui.smileToBtmArea.useSmile = GUI.CreateText( px(-360), px(26), "(입력해 주세요) 0", "Yellow", 20, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        this.m_ui.smileToBtmArea.useSmile = GUI.createInputText( "inputText",
        px(-360),
        px(26),
        px(150),
        px(37),
        "(입력해 주세요) 0",
        "Yellow",
        20,
        GUI.ALIGN_RIGHT,
        GUI.ALIGN_MIDDLE );
        smileToBtmWrapper.addControl( this.m_ui.smileToBtmArea.useSmile );
        GUI.alphaAnimation( this.m_ui.smileToBtmArea.useSmile, true, 1 );

        this.m_ui.smileToBtmArea.useSmile.onBlurObservable.add( function()
        {
            self.setSmileToBtmScreen( self.m_ui.smileToBtmArea.useSmile.text, self.m_ui.smileToBtmArea.needGas.text );
        });

        

        // this.m_ui.smileToBtmArea.needGas = GUI.CreateText( px(-75), px(244), "1", "Yellow", 23, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        this.m_ui.smileToBtmArea.needGas = GUI.createInputText( "inputText",
        px(-75),
        px(244),
        px(80),
        px(37),
        "1",
        "Yellow",
        23,
        GUI.ALIGN_RIGHT,
        GUI.ALIGN_MIDDLE );
        smileToBtmWrapper.addControl( this.m_ui.smileToBtmArea.useSmile );
        GUI.alphaAnimation( this.m_ui.smileToBtmArea.useSmile, true, 1 );
        smileToBtmWrapper.addControl( this.m_ui.smileToBtmArea.needGas );
        GUI.alphaAnimation( this.m_ui.smileToBtmArea.needGas, true, 1 );

        this.m_ui.smileToBtmArea.needGas.onBlurObservable.add( function()
        {
            self.setSmileToBtmScreen( self.m_ui.smileToBtmArea.useSmile.text, self.m_ui.smileToBtmArea.needGas.text );
        });

        // this.m_ui.smileToBtmArea.inputDummy = GUI.CreateButton( "inputDummy", px(-360), px(26), px(250), px(30), GUI.DEFAULT_IMAGE_PATH_NEW+"empty.png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        // this.m_ui.smileToBtmArea.inputDummy.onPointerUpObservable.add( function()
        // {
        //     console.log("더미클릭 ! 슬라이드바 슈캍슈캉");
        // });        
        // smileToBtmWrapper.addControl( this.m_ui.smileToBtmArea.inputDummy );

        this.m_ui.screenWrapper.push( smileToBtmWrapper );

        //
        // exchange list
        //
        var exchangeListWrapper = GUI.createContainer();
        exchangeListWrapper.width = px(644);
        exchangeListWrapper.height = px(766);
        this.m_ui.wrapper.addControl( exchangeListWrapper );

        this.m_ui.exchangeListArea.emptyWarning = GUI.CreateImage( "emptyWarning", px(1), px(-10), px(527), px(312), BTM_PATH+"warningemptylist.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        exchangeListWrapper.addControl( this.m_ui.exchangeListArea.emptyWarning );
        this.m_ui.exchangeListArea.isVisible = false;

        var scrollBtn = AIUI_PATH+"Ai_window/scroll_bar.png";
        var scrollBG = AIUI_PATH+"Ai_window/scroll_bg.png";

        this.m_ui.exchangeListArea.listView = new GUI.createScrollView( exchangeListWrapper, "itemListview", px(-10), px(73), px(644), px(560), 1.1, true, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.m_ui.exchangeListArea.listBar = new GUI.createScrollBar( this.m_ui.exchangeListArea.listView, "itemListBar",  scrollBtn, scrollBG, 
            px(305), px(70), px(12), px(540), px(12), px(85), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.m_ui.exchangeListArea.listView.linkScrollBar( this.m_ui.exchangeListArea.listBar );

        
        this.m_ui.screenWrapper.push( exchangeListWrapper );


        //
        // tabBtn
        //
        var tabBtnInfo = [ 
            { "img" : "Btm_tab1", "x" : -265, "width" : 87 },
            { "img" : "Btm_tab2", "x" : -115, "width" : 190 },
            { "img" : "Btm_tab3", "x" :  85, "width" : 190 },
            { "img" : "Btm_tab4", "x" :  250, "width" : 117 },
        ];
        var createTabBtn = function( in_i )
        {
            var btn = GUI.CreateButton( tabBtnInfo[in_i].img, px( tabBtnInfo[in_i].x ), px( -250 ), px(tabBtnInfo[in_i].width), px(46), BTM_PATH+tabBtnInfo[in_i].img+".png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            btn.onPointerUpObservable.add( function()
            {
                self.onClickTabBtn( in_i );
            });
            return btn;
        }
        
        for ( var i = 0; i < BYTOM_SCREEN_TYPE.MAX; ++i )
        {
            var btn = createTabBtn( i );
            this.m_ui.tabBtn.push( btn );
            this.m_ui.wrapper.addControl( btn );
        }

        this.onClickTabBtn( BYTOM_SCREEN_TYPE.PROFILE );

        

        this.m_ui.closeBtn = GUI.CreateButton( "closeBtn", px(644/2-75/3), px((-766/2)+74/3), px(75), px(74), BTM_PATH+"close.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.m_ui.wrapper.addControl( this.m_ui.closeBtn );
        this.m_ui.closeBtn.onPointerUpObservable.add( function()
        {
            self.onClickCloseBtn();
        });
    }

    FBytomExchange.prototype.setProfileInfo = function( in_profileImage, in_id, in_gender, in_intro )
    {
        GUI.changeButtonImage( this.m_ui.profileArea.profile.getChildByName( "myprofile" ), in_profileImage );

        this.m_ui.profileArea.id.text = in_id;
        this.m_ui.profileArea.intro.text = in_intro;

        var genderString;
        if ( 1 == parseInt( in_gender ) )
            genderString = "남성";
        else if ( 2 == parseInt( in_gender ) )
            genderString = "여성";

        this.m_ui.profileArea.gender.text = genderString;
    }   

    FBytomExchange.prototype.setBTMInfo = function( in_BTMId, in_smileBalance, in_bytomBalance )
    {
        this.m_ui.profileArea.btmAccID.text = in_BTMId;

        this.m_ui.profileArea.smileBalance.text = in_smileBalance.toString();
        this.m_ui.profileArea.bytomBalance.text = in_bytomBalance.toString();

        this.m_ui.btmToSmileArea.haveSmile.text = in_smileBalance.toString();
        this.m_ui.btmToSmileArea.haveBtm.text = in_bytomBalance.toString();
        
        this.m_ui.smileToBtmArea.haveSmile.text = in_smileBalance.toString();
        this.m_ui.smileToBtmArea.haveBtm.text = in_bytomBalance.toString();
    }

    FBytomExchange.prototype.onClickCloseBtn = function()
    {
        this.closePopup();
    }

    FBytomExchange.prototype.onClickTabBtn = function( in_screenType )
    {
        var self = this;
        for ( var i = BYTOM_SCREEN_TYPE.PROFILE; i < BYTOM_SCREEN_TYPE.MAX; ++i )
        {
            var isTabOn = (in_screenType==i);

            var changeImageName = isTabOn?"-1":"";
            GUI.changeButtonImage( self.m_ui.tabBtn[i], BTM_PATH+self.m_ui.tabBtn[i].name+changeImageName+".png" );

            self.m_ui.screenWrapper[i].isVisible = isTabOn;
        }

        switch( in_screenType )
        {
        case BYTOM_SCREEN_TYPE.PROFILE :
            {
                self.showLoading();
                protocol.getBtmUserInfo( function( in_res )
                {
                    self.setProfileInfo( 
                        PROFILE_PATH + in_res.PROF_PIC_NM, 
                        in_res.ACCOUNTID,
                        in_res.GENDER,
                        in_res.INTRODUCE );

                    self.setBTMInfo(
                        in_res.BTM_ACCOUNT_ID,
                        in_res.SMILE,
                        in_res.BTM );
                    
                    self.hideLoading();
                } );
            }
            break;

        case BYTOM_SCREEN_TYPE.BTM_TO_SMILE :  
            {
                this.setBtmToSmileScreen( 0, 1 );
            }
            break;

        case BYTOM_SCREEN_TYPE.SMILE_TO_BTM :
            {
                this.setSmileToBtmScreen( 0, 1 );
            }
            break;

        case BYTOM_SCREEN_TYPE.EXCHANGE_LIST :
            {
                self.exchangeListClear();
                
                self.m_ui.exchangeListArea.emptyWarning.isVisible = false;
                self.showLoading();
                protocol.listTransaction( function( in_res )
                {
                    console.log( in_res );

                    if ( in_res.rows == undefined || in_res.rows.length == 0 )
                    {
                        self.m_ui.exchangeListArea.emptyWarning.isVisible = true;
                    }
                    else
                    {
                        for ( var i = 0; i < in_res.rows.length; ++i )
                        {
                            var info = in_res.rows[i];
                            self.m_ui.exchangeListArea.listView.addItem( self.addExchangeListItem( info.TX_ID, info.STATE, info.SMILE, info.TOAMOUNT ) );
                        }
                    }
                    
                    self.hideLoading();
                });
            }
            break;
        }
    }

    FBytomExchange.prototype.openPopup = function()
    {
        G.guiMain.addControl( this.m_ui.wrapper, GUI.LAYER.POPUP );

        FPopup.openAnimation( this.m_ui.wrapper );

        this.onClickTabBtn( BYTOM_SCREEN_TYPE.PROFILE );
    }

    FBytomExchange.prototype.closePopup = function()
    {
        G.guiMain.removeControl( this.m_ui.wrapper );
    }

    FBytomExchange.prototype.showLoading = function()
    {
        for ( var i = BYTOM_SCREEN_TYPE.PROFILE; i < BYTOM_SCREEN_TYPE.MAX; ++i )
        {
            this.m_ui.wrapper.removeControl( this.m_ui.screenWrapper[i] );
        }
        for ( var i = BYTOM_SCREEN_TYPE.PROFILE; i < BYTOM_SCREEN_TYPE.MAX; ++i )
        {
            this.m_ui.wrapper.removeControl( this.m_ui.tabBtn[i] );
        }

        this.m_ui.wrapper.addControl( this.m_ui.loading );
    }

    FBytomExchange.prototype.hideLoading = function()
    {
        for ( var i = BYTOM_SCREEN_TYPE.PROFILE; i < BYTOM_SCREEN_TYPE.MAX; ++i )
        {
            this.m_ui.wrapper.addControl( this.m_ui.screenWrapper[i] );
        }
        for ( var i = BYTOM_SCREEN_TYPE.PROFILE; i < BYTOM_SCREEN_TYPE.MAX; ++i )
        {
            this.m_ui.wrapper.addControl( this.m_ui.tabBtn[i] );
        }
        
        this.m_ui.wrapper.removeControl( this.m_ui.closeBtn );
        this.m_ui.wrapper.addControl( this.m_ui.closeBtn );

        
        this.m_ui.wrapper.removeControl( this.m_ui.loading );
    }

    FBytomExchange.prototype.exchangeEffect = function()
    {
        var imageNm = ["gold_b", "btm_icon"];
        for ( var i = 0; i < 20; ++i )
        {
            setTimeout( function()
            {
                GUI.createParticle( GUI.DEFAULT_IMAGE_PATH_NEW+"03_symbol/"+imageNm[CommFunc.random(2)]+".png", 20, CommFunc.randomMinMax( 0, 800 )-400, CommFunc.randomMinMax( 0, 1200 )-600, 40 );
            }, 100*i );
        }
    }

    //
    // btmToSmile
    //
    FBytomExchange.prototype.getNeedBtm = function( in_getSmile, in_gas )
    {
        if ( isNaN(in_getSmile) || isNaN(in_gas) )
            return 0;

        var bytomToSmile = 1;

        return (in_getSmile*bytomToSmile)+in_gas;
    }

    FBytomExchange.prototype.setBtmToSmileScreen = function( in_inputSmile, in_gas )
    {
        in_inputSmile = parseInt( in_inputSmile );
        in_gas = parseInt( in_gas );

        this.m_ui.btmToSmileArea.buySmile.text = in_inputSmile.toString();

        this.m_ui.btmToSmileArea.needGas.text = in_gas.toString();

        this.m_ui.btmToSmileArea.needBtm.text = this.getNeedBtm( in_inputSmile, in_gas ).toString();

        this.checkBtmToSmileValue();
    }

    FBytomExchange.prototype.checkBtmToSmileValue = function()
    {
        var passString =
        [
            "환전 신청 가능",
            "0은 초기값이양",
            "구매할 스마일 갯수가 양수가 아님. 더러운 값을 넣지 마세용",
            "스마일을 얻기 위해 필요한 BTM 이 보유량을 초과함",
            "까스는 1부터 10가지만 넣으세용",
        ]

        var passState = 0;

        var buySmileCount = parseInt( this.m_ui.btmToSmileArea.buySmile.text );
        var needGasCount = parseInt( this.m_ui.btmToSmileArea.needGas.text );
        var needBTMCount = parseInt( this.m_ui.btmToSmileArea.needBtm.text );
        var myBTMCount = parseInt( this.m_ui.btmToSmileArea.haveBtm.text );

        if ( 0 == buySmileCount )
        {
            passState = 1;
        }
        else if ( (passState == 0) && (isNaN( buySmileCount ) || buySmileCount <= 0) )
        {
            passState = 2;
        }
        else if ( (passState == 0) && myBTMCount < needBTMCount )
        {
            passState = 3;
        }
        else if ( (passState == 0) && (needGasCount <= 0 || needGasCount > 10) )
        {
            passState = 4;
        }        

        if ( passState != 0 )
        {
            this.m_ui.btmToSmileArea.exchangeBtn.alpha = 0.5;
            this.m_ui.btmToSmileArea.exchangeBtn.isHitTestVisible = false;

            if ( passState > 1 )
                FPopup.messageBox( "BTM -> Smile", passString[passState] );
        }
        else
        {
            this.m_ui.btmToSmileArea.exchangeBtn.alpha = 1;
            this.m_ui.btmToSmileArea.exchangeBtn.isHitTestVisible = true;
        }
    }

    FBytomExchange.prototype.onclickBtmToSmileExchange = function()
    {
        var self = this;

        self.showLoading();

        var buySmileCount = parseInt( this.m_ui.btmToSmileArea.buySmile.text );
        var needBTMCount = parseInt( this.m_ui.btmToSmileArea.needBtm.text );
        var needGasCount = parseInt( this.m_ui.btmToSmileArea.needGas.text );

        protocol.btmToSmileTransaction( buySmileCount, needGasCount, function( in_res )
        {
            self.hideLoading();
            self.closePopup();
            self.exchangeEffect();
            FPopup.messageBox( "BTM -> Smile 환전신청", (needBTMCount-needGasCount).toString()+"BTM 과 "+ needGasCount+"수수료를 사용해\n "+buySmileCount.toString()+" 스마일마크 로 환전을 신청했습니다. \n\n처리가 완료되면 알림을 보내드려요" );
        });
    }


    //
    // smileToBtm
    //
    FBytomExchange.prototype.getBytomResult_FromSmile = function( in_useSmile, in_gas )
    {
        if ( isNaN(in_useSmile) || isNaN(in_gas) )
            return 0;

        var smileToBytom = 1;

        return (in_useSmile*smileToBytom)-in_gas;
    }

    FBytomExchange.prototype.setSmileToBtmScreen = function( in_useSmile, in_gas )
    {
        in_useSmile = parseInt( in_useSmile );
        in_gas = parseInt( in_gas );

        this.m_ui.smileToBtmArea.useSmile.text = in_useSmile.toString();

        this.m_ui.smileToBtmArea.needGas.text = in_gas.toString();
        
        this.m_ui.smileToBtmArea.buyBtm.text = this.getBytomResult_FromSmile( in_useSmile, in_gas ).toString();

        this.checkSmileToBtmValue();
    }

    FBytomExchange.prototype.checkSmileToBtmValue = function()
    {
        var passString =
        [
            "환전 신청 가능",
            "0은 초기값이양",
            "사용할 스마일 갯수가 양수가 아님. 더러운 값을 넣지 마세용",
            "사용하려고 하는 스마일 갯수가 보유량을 초과함",
            "까스는 1부터 10가지만 넣으세용",
        ]

        var passState = 0;

        var useSmileCount = parseInt( this.m_ui.smileToBtmArea.useSmile.text );
        var needGasCount = parseInt( this.m_ui.smileToBtmArea.needGas.text );
        var resultBtm = parseInt( this.m_ui.smileToBtmArea.buyBtm.text );
        var mySmileCount = parseInt( this.m_ui.smileToBtmArea.haveSmile.text );
        
        if ( 0 == useSmileCount )
        {
            passState = 1;
        }
        else if ( (passState == 0) && (isNaN( useSmileCount ) || useSmileCount <= 0) )
        {
            passState = 2;
        }
        else if ( (passState == 0) && mySmileCount < useSmileCount )
        {
            passState = 3;
        }
        else if ( (passState == 0) && (needGasCount <= 0 || needGasCount > 10) )
        {
            passState = 4;
        }        

        if ( passState != 0 )
        {
            this.m_ui.smileToBtmArea.exchangeBtn.alpha = 0.5;
            this.m_ui.smileToBtmArea.exchangeBtn.isHitTestVisible = false;

            if ( passState > 1 )
                FPopup.messageBox( "Smile -> BTM", passString[passState] );            
        }
        else 
        {
            this.m_ui.smileToBtmArea.exchangeBtn.alpha = 1;
            this.m_ui.smileToBtmArea.exchangeBtn.isHitTestVisible = true;
        }
    }

    FBytomExchange.prototype.onclickSmileToBtmExchange = function()
    {
        var self = this;

        var useSmileCount = parseInt( this.m_ui.smileToBtmArea.useSmile.text );
        var needGasCount = parseInt( this.m_ui.smileToBtmArea.needGas.text );
        var resultBtm = parseInt( this.m_ui.smileToBtmArea.buyBtm.text );

        protocol.smileToBtmTransaction( useSmileCount, needGasCount, function( in_res )
        {
            self.hideLoading();
            self.closePopup();
            self.exchangeEffect();
            FPopup.messageBox( "Smile -> Btm 환전신청", useSmileCount.toString()+"스마일마크  ("+ needGasCount+"수수료)를 사용해\n "+resultBtm.toString()+" BTM 으로 환전을 신청했습니다. \n\n처리가 완료되면 알림을 보내드려요" );
        });
    }

    //
    // exchange list
    //

    FBytomExchange.prototype.exchangeListClear = function()
    {
        this.m_ui.exchangeListArea.listView.clearItem();
    }
    
    FBytomExchange.prototype.addExchangeListItem = function( in_exchangeID, in_result, in_smile, in_btm )
    {
        var stateImage = ["Btm_verification3", "Btm_verification1", "Btm_verification2"];

        var listItem = GUI.CreateButton( "in_exchangeID", px(0), px(0), px(596), px(126), BTM_PATH+"Btm_list1.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        
        var id = in_exchangeID;
        if ( id.length > 25 )
        id = in_exchangeID.substring(0, 25)+"...";

        var id = GUI.CreateText( px(-160), px(-29), id, "Black", 23, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        listItem.addControl( id );

        var resultImg = GUI.CreateImage( "result", px(-15), px(-30), px(98), px(41), BTM_PATH+stateImage[in_result]+".png", GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        listItem.addControl( resultImg );

        var smile = GUI.CreateText( px(-360), px(34), in_smile.toString(), "Gray", 23, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        if ( in_smile.toString().indexOf("-") != -1 )
            smile.color = "red";
        listItem.addControl( smile );
        
        var smile = GUI.CreateText( px(-30), px(34), in_btm.toString(), "Gray", 23, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        listItem.addControl( smile );

        listItem.onPointerUpObservable.add( function()
        {
            window.prompt("Copy to clipboard: Ctrl+C, Enter", in_exchangeID);
        });

        return listItem;
    }

    
    //
    // run by runnableManager
    //
    FBytomExchange.prototype.run = function()
    {
        if ( this.m_ui.loading )
        {
            this.m_ui.loading.rotation += 0.1;
        }

        if ( this.m_ui.exchangeListArea.listView != null )
            this.m_ui.exchangeListArea.listView.procLoop();
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
                instance = new FBytomExchange();
                instance.constructor = null;
            }

            return instance;
        }
    };

    return FBytomExchange;
}());