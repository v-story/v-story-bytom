'use strict';

var SOCIALQ = {}

SOCIALQ.IS_STATE_INIT              = 0;
SOCIALQ.IS_STATE_MAIN              = 1;
SOCIALQ.IS_FIRST_OPEN              = [ true, true, true ];
SOCIALQ.IS_FIRST_VISIT             = true;

SOCIALQ.SNS_CALLBACK = function( in_successFlag )
{
    if ( !in_successFlag )
    {
        console.log("SNS에서 퀘스트 실패");
        return;
    }

    if ( null != G.sceneMgr.getCurrentScene().FSocialQuest )
    {
        if ( null != G.sceneMgr.getCurrentScene().FSocialQuest.snsCallbackFunc )
        {
            G.sceneMgr.getCurrentScene().FSocialQuest.snsCallbackFunc();
            G.sceneMgr.getCurrentScene().FSocialQuest.snsCallbackFunc = null;
        }
    }
}

SOCIALQ.SNS_LIKE_CALLBACK = function( in_questID, in_friendAccount )
{
    console.log("socialQuest like Callback receiveed!"+in_questID +" , "+in_friendAccount);
}

var SOCIAL_QUEST_UI_PATH = ASSET_URL+"97_gui_new/02_social/";
var VERTICAL_PATH = SOCIAL_QUEST_UI_PATH+"Vertical/"
var SOCIAL_QUEST_UI_NEW = GUI.DEFAULT_IMAGE_PATH_NEW + "/02_social/"

var FSocialQuest = (function () {

    function FSocialQuest(questKind,btnCallback, param) {

        var self = this;

        // this.state = ISHOP.IS_STATE_WALL_INIT;
        this.questType = { UNDEFIND : -1, PRODUCE : 0, CONSUME : 1, SHARE : 2 };
        
        // this.panelMain = null;
        this.wrapMain = null;

        this.mainButtonScrollView = null;
        this.btnCallback = btnCallback;
        this.btnParam = param;       

        this.questKind = this.questType.UNDEFIND;

        this.animation = null;

        this.snsCallbackFunc = null;
    };

    FSocialQuest.prototype.closePopup = function(state)
    {
        GUI.removeContainer(this.wrapMain);
        this.wrapMain = null;

        if(state) 
            if(this.btnCallback) this.btnCallback(this.btnParam);
    };

    FSocialQuest.prototype.openPopup = function( in_questKind )
    {
        var self = this;
        //생산,소비,공유의 종류 => 0, 1, 2
        this.questKind = in_questKind;
        // this.reservedState(ISHOP.IS_STATE_MAIN);

        var procFunc = null;
        var scriptName = null;
        var scriptFriendData = null;

        var questPacketData = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getQuestInfo( in_questKind );
        
        var scriptEndCallback = function()
        {
            procFunc( self );
            SOCIALQ.IS_FIRST_OPEN[ in_questKind ] = false;
        }

        switch(this.questKind) 
        {
        case this.questType.PRODUCE :
            {
                procFunc = this.openSQProducePopup;
                scriptName = "SQ_talk_produce.json";
            }
            break;

        case this.questType.CONSUME :
            {
                procFunc = this.openSQConsumePopup;
                scriptName = "SQ_talk_consume.json";
            }
            break;                
            
        case this.questType.SHARE :
            {
                procFunc = this.openSQSharePopup;
                scriptName = "SQ_talk_share.json";
            }
            break;                
        }        
        
        if ( SOCIALQ.IS_FIRST_OPEN[ in_questKind ] )
        {            
            scriptFriendData = {
                "pk":questPacketData.TEAM_ACCOUNTPK, 
                "age":questPacketData.TEAM_AGE, 
                "intro":questPacketData.TEAM_INTRO, 
                "interest":questPacketData.INTEREST, 
                "startcon":questPacketData.STARCONTTAG ,
                "url":G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQInfoPath(this.questKind)
            };

            // G.scriptManager.setSocialQuestFriend( scriptFriendData );
            // G.scriptManager.playScript( scriptName, 0, scriptEndCallback );
            scriptEndCallback();
        }
        else
            procFunc( self );
    };

    FSocialQuest.prototype.render = function() {

    };



    FSocialQuest.prototype.onPointerDown = function(evt) {
        if (evt.button !== 0) {
            return;
        }
        
    }

    FSocialQuest.prototype.onPointerMove = function(evt) {

    }
    

    FSocialQuest.prototype.onPointerUp = function(evt) {
        if (evt.button !== 0) {
            return;
        }

    }

    FSocialQuest.prototype.openSQSNS = function( in_friendAccountPK, in_questID, in_questType )
    {
        var condType;
        switch( in_questType )
        {
            case this.questType.UNDEFIND :  condType = 0; break;
            case this.questType.PRODUCE :   condType = 1; break;
            case this.questType.CONSUME :   condType = 2; break;
            case this.questType.SHARE :     condType = 3; break;
        }
        //socialQuestOpen( { "friendAccountPK":in_friendAccountPK, "questId":in_questID, "condType":condType } );

        var param = 
        {
            "friendAccountPK":in_friendAccountPK, "questId":in_questID, "condType":condType
        }

        snsCommonFunc.socialQuestSnsStart(param);
    }
    
    FSocialQuest.prototype.createTopButtonBackground = function( in_targetUI, in_currentSelectedSQType, in_yPos )
    {
        var self = this;

        var SQProduceBackButton = GUI.CreateButton( "SQProduceBackButton", px(-214), px(in_yPos), px(203), px(70), SOCIAL_QUEST_UI_NEW+"s_pop1-1_tab.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        SQProduceBackButton.addControl( GUI.CreateText( px(0), px(0), "생산", "Gray", 26, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
        SQProduceBackButton.onPointerUpObservable.add( function()
        {
            self.closePopup( 0 );
            
            var linkBtn = FRoomUI.getInstance().ui.button[ ROOMBUTTON.SQ_CREATE ];
            linkBtn.onPointerUpObservable.notifyObservers(linkBtn, -1, linkBtn, linkBtn);
        });

        var SQConsumeBackButton = GUI.CreateButton( "SQConsumeBackButton", px(-3), px(in_yPos), px(203), px(70), SOCIAL_QUEST_UI_NEW+"s_pop2-1_tab.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        SQConsumeBackButton.addControl( GUI.CreateText( px(0), px(0), "소비", "Gray", 26, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
        SQConsumeBackButton.onPointerUpObservable.add( function()
        {
            self.closePopup( 0 );

            var linkBtn = FRoomUI.getInstance().ui.button[ ROOMBUTTON.SQ_CONSUME ];
            linkBtn.onPointerUpObservable.notifyObservers(linkBtn, -1, linkBtn, linkBtn);
        });

        var SQShareBackButton = GUI.CreateButton( "SQShareBackButton", px(205), px(in_yPos), px(203), px(70), SOCIAL_QUEST_UI_NEW+"s_pop3-1_tab.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        SQShareBackButton.addControl( GUI.CreateText( px(0), px(0), "공유", "Gray", 26, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
        SQShareBackButton.onPointerUpObservable.add( function()
        {
            self.closePopup( 0 );
            
            var linkBtn = FRoomUI.getInstance().ui.button[ ROOMBUTTON.SQ_SHARE ];
            linkBtn.onPointerUpObservable.notifyObservers(linkBtn, -1, linkBtn, linkBtn);
        });

        switch( in_currentSelectedSQType )
        {
        case SQtype.PRODUCE :
            {
                in_targetUI.addControl( SQConsumeBackButton );
                in_targetUI.addControl( SQShareBackButton );
            }
            break;

        case SQtype.CONSUME :
            {
                in_targetUI.addControl( SQProduceBackButton );
                in_targetUI.addControl( SQShareBackButton );
            }
            break;

        case SQtype.SHARE :
            {
                in_targetUI.addControl( SQProduceBackButton );
                in_targetUI.addControl( SQConsumeBackButton );
            }
            break;
        }
    }
 
    FSocialQuest.prototype.openSQProducePopup_Vertical = function( in_self )
    {
        
        var self = this;
        if ( in_self != undefined )
            self = in_self;

        var isForceOpenVisit = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).socialQuestList.OPEN;
        var questPacketInfo = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getQuestInfo( self.questType.PRODUCE );
        var socialQuestData = G.dataManager.getSocialQuestData( questPacketInfo.QUEST_ID );
        
        self.closePopup(0);

        self.wrapMain = FPopup.createPopupWrapper( "black", 0.5 );
        G.guiMain.addControl(self.wrapMain, GUI.LAYER.POPUP);
        // popup background
        var img = GUI.CreateImage("back", px(0), px(0), px(686), px(933), SOCIAL_QUEST_UI_NEW+"s_board_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        self.wrapMain.addControl(img);        

        var subBottomBG = GUI.CreateImage("subBottomBG", px(0), px(270), px(641), px(316), SOCIAL_QUEST_UI_NEW+"s_under.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        self.wrapMain.addControl(subBottomBG);

        var subBG = GUI.CreateImage("subBG", px(0), px(-140), px(641), px(510), SOCIAL_QUEST_UI_NEW+"s_pop1st_tab.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        self.wrapMain.addControl(subBG);

        // title
        var titleText = GUI.CreateText( px(0), px(-420), "⊙  소셜 라이프  ⊙", "Black", 26, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        self.wrapMain.addControl(titleText);

        // my info
        var myNameText = GUI.CreateText( px(-160), px(-60), G.dataManager.getUsrMgr(DEF_IDENTITY_ME).nickname, "Black", 26, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        self.wrapMain.addControl(myNameText);

        var myIcon = GUI.CreateCircleButton( "myIcon", px(-160), px(-170), px(121), px(121), G.dataManager.getUsrMgr(DEF_IDENTITY_ME).url, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE, true, "white", false );
        self.wrapMain.addControl(myIcon);

        // matching friend info                
        var friendNameText = GUI.CreateText( px(145), px(-57), "*******", "Black", 26, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        self.wrapMain.addControl(friendNameText);

        var friendIcon = GUI.CreateCircleButton( "friendIcon", px(150), px(-170), px(121), px(121), G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQInfoPath(0), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE, true, "white", false );
        self.wrapMain.addControl(friendIcon);
        
        // reward text
        var rewardText = GUI.CreateText( px(-138), px(123), "완료보상", "Gray", 22, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        self.wrapMain.addControl(rewardText);

        // 바로방문
        var directVisitButton = GUI.CreateButton( "directVisitButton", px(145), px(50), px(268), px(69), SOCIAL_QUEST_UI_NEW+"cost2_btn.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        self.wrapMain.addControl( directVisitButton );
        var directVisitText = GUI.CreateText( px(-75), px(0), "바로방문", "Gray", 20, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        directVisitButton.addControl( directVisitText );
        var directVisitPriceText = GUI.CreateText( px(70), px(0), "loading", "Black", 22, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        directVisitButton.addControl( directVisitPriceText );

        var setVisitButtonUI = function( in_isOpen )
        {
            if ( in_isOpen )
            {
                directVisitText.text = "방문하기";
                directVisitText.left = px(0);
                directVisitPriceText.isVisible = false;
            }
            else
            {
                directVisitText.text = "바로방문";
                directVisitText.left = px(-75 );
                directVisitPriceText.isVisible = true;
                
            }
        };        

        directVisitButton.onPointerUpObservable.add ( function ()
        {
            if ( questPacketInfo.QUEST_CLEARCNT == 3 || isForceOpenVisit == 1 ) // 바로방문 가능
            {
                G.dataManager.setFriendInfo(questPacketInfo.TEAM_ACCOUNTPK, questPacketInfo.TEAM_AVATARCD, G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQInfoPath(0));
                G.sceneMgr.getCurrentScene().goMyFriend(false);
            }
            else // 불가능. 오픈해야함
            {
                var effectDelayFunc = function()                
                {
                    var onReceiveforceOpenVisit = function()
                    {
                        isForceOpenVisit = 1;
                        setVisitButtonUI(true);
                    }

                    var json = protocol.produceSocialQuestDirectVisit();
                    ws.onRequest(json, onReceiveforceOpenVisit, self);
                }

                GUI.decreaseMoneyEffect( self.wrapMain, GOODS_TYPE_GOLD, parseInt( directVisitPriceText.text ), px(140), px(-10), px(120), px(35), 12, effectDelayFunc );
            }
        });
        
        var rewardUI = [];
        // left
        var leftBG = GUI.CreateButton("rewardLeftBG",px(-110),px(122),px(100),px(25),SOCIAL_QUEST_UI_PATH+"rewardBG.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        var leftSymbol = GUI.getSymbolImage( GOODS_TYPE_GOLD, px(22), px(22), px(-35), px(0), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        leftSymbol.name = "symbol";
        leftBG.addControl( leftSymbol );
        var leftText = GUI.CreateText( px(20), px(0), "loading", "white", 14, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        leftText.name = "text";
        leftBG.isHitTestVisible = false;
        leftBG.addControl( leftText );
        self.wrapMain.addControl( leftBG );
        
        // middle
        var midBG = GUI.CreateButton("rewardMidBG",px(0),px(122),px(100),px(25),SOCIAL_QUEST_UI_PATH+"rewardBG.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        var midSymbol = GUI.getSymbolImage( GOODS_TYPE_GOLD, px(22), px(22), px(-35), px(0), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        midSymbol.name = "symbol";
        midBG.addControl( midSymbol );
        var midText = GUI.CreateText( px(20), px(0), "loading", "white", 14, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        midText.name = "text";
        midBG.isHitTestVisible = false;
        midBG.addControl( midText );
        self.wrapMain.addControl( midBG );
    
        // right
        var rightBG = GUI.CreateButton("rewardRightBG",px(110),px(122),px(100),px(25),SOCIAL_QUEST_UI_PATH+"rewardBG.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        var rightSymbol = GUI.getSymbolImage( GOODS_TYPE_GOLD, px(22), px(22), px(-35), px(0), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        rightSymbol.name = "symbol";
        rightBG.addControl( rightSymbol );
        var rightText = GUI.CreateText( px(20), px(0), "loading", "white", 14, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        rightText.name = "text";
        rightBG.isHitTestVisible = false;
        rightBG.addControl( rightText );
        self.wrapMain.addControl( rightBG );

        rewardUI.push( {"ui":rightBG, "goods":GOODS_TYPE_GOLD} );
        rewardUI.push( {"ui":midBG, "goods":GOODS_TYPE_GOLD} );
        rewardUI.push( {"ui":leftBG, "goods":GOODS_TYPE_GOLD} );

        // gauge animation
        var barIncreaseAni = function ( in_gauge, in_value )
        {
            var body = in_gauge.getChildByName("barBody");
            var top = in_gauge.getChildByName("barTop");

            var targetValue = 38*0.6*in_value;

            var frameRate = 120;
            var heightAnimation = new BABYLON.Animation( "heightAni", "height", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var heightAnimationKey = [];
            heightAnimationKey.push( {frame:0, value: parseInt( body.height )} );    
            heightAnimationKey.push( {frame:frameRate, value:GUI.getResolutionCorrection( targetValue, false )} );
            heightAnimation.setKeys(heightAnimationKey);    
            CommFunc.useEasingFuncToAnimation(heightAnimation);

            
            var topAnimation = new BABYLON.Animation( "topAni", "top", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var topAnimationKey = [];
            topAnimationKey.push( {frame:0, value: parseInt( top.top )} );    
            topAnimationKey.push( {frame:frameRate, value:GUI.getResolutionCorrection( -10-targetValue, false )} );
            topAnimation.setKeys(topAnimationKey);
            CommFunc.useEasingFuncToAnimation(topAnimation);
    
            G.scene.beginDirectAnimation( body, [heightAnimation], 0, frameRate, false, 1.0 );
            G.scene.beginDirectAnimation( top, [topAnimation], 0, frameRate, false, 1.0 );
        }

        // left gauge
        var leftGaugeWrapper = GUI.createContainer('leftGauge');
        self.wrapMain.addControl( leftGaugeWrapper );
        var leftGaugeBG = GUI.CreateImage( "leftGaugeBG", px(-250), px(20), px(45), px(150), VERTICAL_PATH+"img_gaugeBG.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        leftGaugeWrapper.addControl( leftGaugeBG );
        // bar
        var leftbarBottom = GUI.CreateImage( "barBottom", px(0), px(-2), px(30), px(14), SOCIAL_QUEST_UI_PATH+"bigbar_edge.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        leftbarBottom.rotation = ToRadians(180);
        var leftbarBody = GUI.CreateImage( "barBody", px(0), px(-12), px(30), px(0),SOCIAL_QUEST_UI_PATH+"bigbar_body.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        var leftbarTop = GUI.CreateImage( "barTop", px(0), px(-10), px(30), px(14),SOCIAL_QUEST_UI_PATH+"bigbar_edge.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        var leftbarWrapper = GUI.CreateClipArea( px(-250), px(20), px(30), px(140), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        leftbarWrapper.addControl(leftbarBottom);
        leftbarWrapper.addControl(leftbarBody);
        leftbarWrapper.addControl(leftbarTop);
        leftGaugeWrapper.addControl( leftbarWrapper );
        // star
        var leftbarBGStar  = GUI.CreateImage( "barStar", px(-250), px(-30), px(55), px(55), SOCIAL_QUEST_UI_PATH+"barBG_star.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        leftGaugeWrapper.addControl( leftbarBGStar );

        leftGaugeWrapper.left = GUI.getResolutionCorrection( px( 30 ) );
        leftGaugeWrapper.top = GUI.getResolutionCorrection( px( 35 ) );
        leftGaugeWrapper.scaleX = 0.60;
        leftGaugeWrapper.scaleY = 0.60;

        barIncreaseAni( leftbarWrapper, questPacketInfo.QUEST_CLEARCNT );
        

        // right gauge
        var rightGaugeWrapper = GUI.createContainer('rightGauge');
        self.wrapMain.addControl( rightGaugeWrapper );  
        var rightGaugeBG = GUI.CreateImage( "rightGaugeBG", px(250), px(20), px(45), px(150), VERTICAL_PATH+"img_gaugeBG.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        rightGaugeWrapper.addControl( rightGaugeBG );       
        // bar
        var rightbarBottom = GUI.CreateImage( "barBottom", px(0), px(-2), px(30), px(14), SOCIAL_QUEST_UI_PATH+"bigbar_edge.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        rightbarBottom.rotation = ToRadians(180);
        var rightbarBody = GUI.CreateImage( "barBody", px(0), px(-12), px(30), px(0),SOCIAL_QUEST_UI_PATH+"bigbar_body.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        var rightbarTop = GUI.CreateImage( "barTop", px(0), px(-10), px(30), px(14),SOCIAL_QUEST_UI_PATH+"bigbar_edge.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        var rightbarWrapper = GUI.CreateClipArea( px(250), px(20), px(30), px(140), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        rightbarWrapper.addControl(rightbarBottom);
        rightbarWrapper.addControl(rightbarBody);
        rightbarWrapper.addControl(rightbarTop);
        rightGaugeWrapper.addControl( rightbarWrapper );
        // star
        var rightBarStar  = GUI.CreateImage( "barStar", px(250), px(-30), px(55), px(55), SOCIAL_QUEST_UI_PATH+"barBG_star.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        rightGaugeWrapper.addControl( rightBarStar );
        
        rightGaugeWrapper.left = GUI.getResolutionCorrection( px( -30 ) );
        rightGaugeWrapper.top = GUI.getResolutionCorrection( px( 35 ) );
        rightGaugeWrapper.scaleX = 0.60;
        rightGaugeWrapper.scaleY = 0.60;

        barIncreaseAni( rightbarWrapper, questPacketInfo.TEAM_QUEST_STEP );
        
        // close button
        var closeButton = GUI.CreateButton( "closeButton", px(155), px(-170), px(32), px(32), SOCIAL_QUEST_UI_PATH+"pop_cancel.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        self.wrapMain.addControl(closeButton);
        closeButton.onPointerUpObservable.add( function()
        {
            self.closePopup(1);
        });

        // process button        
        var questSTEP = { "Ready":0, "CanGetReward":2 };
        var buttonStateText = ["시작하기", "보상받기", "보상수령완료", "선행 퀘스트 필요"];
        var currentButtonState = 0;
        var acceptButton = GUI.CreateButton( "acceptButton", px(0), px(180), px(192), px(52), VERTICAL_PATH+"btn_accpet.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        self.wrapMain.addControl(acceptButton);
        var acceptButtonText = GUI.CreateText( px(0), px(-2), buttonStateText[currentButtonState], "Black", 18, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        acceptButton.addControl( acceptButtonText );
        acceptButton.onPointerUpObservable.add( function()
        {
            // 헷갈려하면안됩니다영수님!!
            if ( questPacketInfo.QUEST_STEP == questSTEP.Ready ) // 이 분기는 "시작하기" 그러니까 눌러서 SNS 글쓰기 페이지로 가는 로직이다
            {
                
                self.closePopup(1);

                self.snsCallbackFunc = function()
                {
                    questPacketInfo.QUEST_STEP = questSTEP.CanGetReward;  // 이것이 포인터 개념이면 usrmgr 의 데이터도 바뀔것이다.
                    acceptButtonText.text = buttonStateText[ questSTEP.CanGetReward-1 ]; // 완료하기가 되어야한다.

                    setTimeout( function(){
                        G.sceneMgr.getCurrentScene().wsSendSNSQuestLoad()
                    }, 1000 );
                }

                // TODO:SNS를 띄워준다. 근데 또 여기서 생산퀘스트에는 부속으로 생산,소비,공유가 있는데 SNS쪽에도 그거 다 맞게 세팅해서 보내줘야한다.할렐루야
                self.openSQSNS( questPacketInfo.TEAM_ACCOUNTPK, currentViewQuest.data.SEQ, currentViewQuest.page );
                                
                if ( currentViewQuest.page != self.questType.PRODUCE )
                {                    
                    if ( currentViewQuest.page == self.questType.SHARE )
                        G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).setVisitPurposeForShare(true);

                    G.dataManager.setFriendInfo(questPacketInfo.TEAM_ACCOUNTPK, questPacketInfo.TEAM_AVATARCD, G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQInfoPath(0));
                    G.sceneMgr.getCurrentScene().goMyFriend(false);
                }
            }
            else if ( questPacketInfo.QUEST_STEP == questSTEP.CanGetReward ) // 이 분기는 "완료하기" 그러니까 SNS글쓰기를 완료하고 보상받기 버튼을 누르는 로직이다.
            {
                var receiveProtocolFunc = function()
                {
                    claerQuest( currentViewQuest.page );
                    //questPacketInfo.QUEST_CLEARCNT++; // 이건 서버에서 증가된 값을 보내 준다.
                }

                // 이건 콜백받았을때 띄워준다.
                var json = protocol.updateSNSQuest(questPacketInfo.QUEST_ID, questPacketInfo.TEAM_ACCOUNTPK);
                ws.onRequest(json, self.updateSNSQuestCB, [self, receiveProtocolFunc]);
            }
        });

        // 현재 포커싱한 퀘스트의 정보 세팅
        var currentViewQuest = {"page":questPacketInfo.QUEST_CLEARCNT, "data":socialQuestData };
        var setFocusQuestData = function( in_pageIndex )
        {        
            // 포커스한 퀘스트 보상으로 UI 갱신
            var focusSQRewardData = G.dataManager.getSocialQuestData( (parseInt( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getQuestInfo( self.questType.PRODUCE ).QUEST_ID / 100 ) * 100) + (in_pageIndex+1) );

            // 보상 - 갯수가 0 초과인것만 보여준다고 한다.
            rewardUI.forEach( function(iter){ iter.ui.isVisible = false; });

            var activeRewardCount = 0;
            for ( var i = 0; i < 4; ++i )
            {
                if ( 0 == focusSQRewardData["RWD_ITEM_CNT"+(i+1).toString()] )
                    continue;
                
                rewardUI[activeRewardCount].ui.isVisible = true;
                rewardUI[activeRewardCount].ui.removeControl( rewardUI[activeRewardCount].ui.getChildByName("symbol") );
                var newSymbol = GUI.getSymbolImage( focusSQRewardData["RWD_ITEM_ID"+(i+1).toString()], px(22), px(22), px(-35), px(0), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
                newSymbol.name = "symbol";
                rewardUI[activeRewardCount].ui.addControl(newSymbol);
                rewardUI[activeRewardCount].ui.getChildByName("text").text = focusSQRewardData["RWD_ITEM_CNT"+(i+1).toString()].toString();
                rewardUI[activeRewardCount].goods = focusSQRewardData["RWD_ITEM_ID"+(i+1).toString()];

                activeRewardCount++;
            }

            // 바로방문 비용
            directVisitPriceText.text = focusSQRewardData.OPEN_ITEM_CNT.toString();

            setVisitButtonUI( questPacketInfo.QUEST_CLEARCNT == 3 || isForceOpenVisit == 1 );

            // 지금 진행해야할 퀘스트 다음 퀘스트를 보고있으면 시작하기 버튼 비활성화
            if ( 3 == questPacketInfo.QUEST_CLEARCNT )
            {
                acceptButton.isVisible = false;
            }
            else if ( questPacketInfo.QUEST_CLEARCNT > in_pageIndex )
            {
                acceptButton.isVisible = true;
                acceptButton.alpha = 0.5;
                acceptButton.isHitTestVisible = false;
                acceptButtonText.text = buttonStateText[ 2 ];
                acceptButtonText.color = "red";
            }
            else if ( questPacketInfo.QUEST_CLEARCNT == in_pageIndex ) // 현재 진행해야 할 포커스 데이터 (완료하기, 시작하기를 구분해주자.)
            {
                acceptButton.isVisible = true;
                acceptButton.alpha = 1;
                acceptButton.isHitTestVisible = true;
                if ( questPacketInfo.QUEST_STEP == questSTEP.Ready )
                {
                    acceptButtonText.text = buttonStateText[ 0 ];
                }
                else
                {
                    //FPopup.openAnimation( acceptButton, undefined, undefined, true, 1 );
                    acceptButtonText.text = buttonStateText[ 1 ];
                }
                acceptButtonText.color = "black";
            }
            else
            {
                acceptButton.isVisible = true;
                acceptButton.alpha = 0.5;
                acceptButton.isHitTestVisible = false;
                acceptButtonText.text = buttonStateText[ 3 ];
                acceptButtonText.color = "red";
            }

            currentViewQuest.page = in_pageIndex;
            currentViewQuest.data = focusSQRewardData;
        }

        // 초기 세팅
        setFocusQuestData( Math.min( 2, questPacketInfo.QUEST_CLEARCNT ) );

        // 이것은 완료-보상받기 했을때 호출하면 된다.
        var claerQuest = function ( in_curPage )
        {   
            var clearMark = GUI.CreateImage( "clearMark", px(150), px(44), px(60), px(60), SOCIAL_QUEST_UI_PATH+"mark_ok.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            self.wrapMain.addControl( clearMark );

            var frameRate = 120;
            
            var scaleXAnimation = new BABYLON.Animation( "scalex", "scaleX", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            var keyframeX = [];
            keyframeX.push({frame:0,value:2.5});
            keyframeX.push({frame:frameRate-20,value:0.75});
            keyframeX.push({frame:frameRate,value:1.0});
            scaleXAnimation.setKeys(keyframeX);
            CommFunc.useEasingFuncToAnimation(scaleXAnimation);

            var scaleYAnimation = new BABYLON.Animation( "scaley", "scaleY", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            var keyframeY = [];
            keyframeY.push({frame:0,value:2.5});
            keyframeY.push({frame:frameRate-20,value:0.75});
            keyframeY.push({frame:frameRate,value:1.0});
            scaleYAnimation.setKeys(keyframeY);
            CommFunc.useEasingFuncToAnimation(scaleYAnimation);
            
            var rotateAnimation = new BABYLON.Animation( "rotation", "rotation", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            var keyframeRot = [];
            keyframeRot.push({frame:0,value:ToRadians(0)});
            keyframeRot.push({frame:frameRate-20,value:ToRadians(-30)});
            keyframeRot.push({frame:frameRate,value:ToRadians(-15)});
            rotateAnimation.setKeys(keyframeRot);
            
            FPopup.openAnimation( self.wrapMain, undefined, 1 );
            G.soundManager.playQuestClearSound();
    
            G.scene.beginDirectAnimation( clearMark, [scaleXAnimation, scaleYAnimation, rotateAnimation], 0, frameRate, false, 3, function()
            { 
                var ratio = (window.innerWidth / G.guiMain.idealWidth);
                self.wrapMain.removeControl( self.wrapMain.getChildByName("clearMark") );

                for ( var i = 0; i < rewardUI.length; ++i )
                {
                    if ( rewardUI[i].ui.isVisible )
                    {
                        var targetUI = self.getInvenGoodsUI( rewardUI[i].goods );
                        GUI.goodsGetEffect( rewardUI[i].goods, 100, [ px(parseInt(rewardUI[i].ui.left)/ratio), px(parseInt(rewardUI[i].ui.top)/ratio)], self.getPosInvenGoods(targetUI), undefined );
                    }
                }

                setFocusQuestData( Math.min( 2, in_curPage+1 ) );                
            } );

            barIncreaseAni( leftbarWrapper, currentViewQuest.page+1 );
        }
        
        FPopup.openAnimation( self.wrapMain );
        G.soundManager.playPopupOpenSound();
        
        // var viewDirection = Vector3.Cross( G.camera.target, G.camera.position ).normalize();
        // GUI.installEffect( new BABYLON.Vector3( G.camera.position.x, G.camera.position.y - 5, G.camera.position.z ), "poof_b.png", 1.0, 10 );         
    }

    FSocialQuest.prototype.openSQProducePopup_Horizontal = function( in_self )
    {
        
        var self = this;
        if ( in_self != undefined )
            self = in_self;

        var isForceOpenVisit = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).socialQuestList.OPEN;
        var questPacketInfo = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getQuestInfo( self.questType.PRODUCE );
        var socialQuestData = G.dataManager.getSocialQuestData( questPacketInfo.QUEST_ID );
        
        self.closePopup(0);

        self.wrapMain = FPopup.createPopupWrapper( "black", 0.75 );
        G.guiMain.addControl(self.wrapMain, GUI.LAYER.POPUP);
        self.wrapMain.isPointerBlocker = true;

        // popup background
        var img = GUI.CreateImage("back", px(0), px(0), px(686), px(933), SOCIAL_QUEST_UI_NEW+"s_board_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        self.wrapMain.addControl(img);    

        var subBottomBG = GUI.CreateImage("subBottomBG", px(0), px(270), px(641), px(316), SOCIAL_QUEST_UI_NEW+"s_under.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        self.wrapMain.addControl(subBottomBG);

        var subBG = GUI.CreateImage("subBG", px(0), px(-140), px(641), px(510), SOCIAL_QUEST_UI_NEW+"s_pop1st_tab.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        self.wrapMain.addControl(subBG);

        // title
        var titleText = GUI.CreateText( px(0), px(-425), "⊙  소셜 라이프  ⊙", "Black", 26, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        self.wrapMain.addControl(titleText);        
        
        // my info
        var myNameText = GUI.CreateText( px(-160), px(-60), G.dataManager.getUsrMgr(DEF_IDENTITY_ME).nickname, "Black", 26, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        self.wrapMain.addControl(myNameText);

        var myIcon = GUI.CreateCircleButton( "myIcon", px(-160), px(-170), px(121), px(121), G.dataManager.getUsrMgr(DEF_IDENTITY_ME).url, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE, true, "white", false );
        self.wrapMain.addControl(myIcon);

        // matching friend info                
        var friendNameText = GUI.CreateText( px(145), px(-57), "*******", "Black", 26, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        self.wrapMain.addControl(friendNameText);

        var friendIcon = GUI.CreateCircleButton( "friendIcon", px(150), px(-170), px(121), px(121), G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQInfoPath(0), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE, true, "white", false );
        self.wrapMain.addControl(friendIcon);   
        
        // reward text
        var rewradTopPos = 200;

        var rewardBG = GUI.CreateImage( "rewardBG",px(0),px(rewradTopPos),px(590),px(143),SOCIAL_QUEST_UI_NEW+"s_reward1_bg.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        this.wrapMain.addControl( rewardBG );

        var rewardText = GUI.CreateText( px(-200), px(rewradTopPos-5), "완료 보상", "Gray", 24, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(rewardText);

        var rewardUI = [];
        // left
        var leftBG = GUI.CreateButton("rewardLeftBG",px(-100),px(rewradTopPos),px(140),px(55),SOCIAL_QUEST_UI_NEW+"s_id_bg.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        var leftSymbol = GUI.getSymbolImage( GOODS_TYPE_GOLD, px(50), px(50), px(-40), px(0), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        leftSymbol.name = "symbol";
        leftBG.addControl( leftSymbol );
        var leftText = GUI.CreateText( px(-20), px(0), "loading", "Black", 20, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        leftText.name = "text";
        leftBG.isHitTestVisible = false;
        leftBG.addControl( leftText );
        this.wrapMain.addControl( leftBG );
        
        // middle
        var midBG = GUI.CreateButton("rewardMidBG",px(50),px(rewradTopPos),px(140),px(55),SOCIAL_QUEST_UI_NEW+"s_id_bg.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        var midSymbol = GUI.getSymbolImage( GOODS_TYPE_GOLD, px(50), px(50), px(-40), px(0), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        midSymbol.name = "symbol";
        midBG.addControl( midSymbol );
        var midText = GUI.CreateText( px(-20), px(0), "loading", "Black", 20, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        midText.name = "text";
        midBG.isHitTestVisible = false;
        midBG.addControl( midText );
        this.wrapMain.addControl( midBG );
    
        // right
        var rightBG = GUI.CreateButton("rewardRightBG",px(200),px(rewradTopPos),px(140),px(55),SOCIAL_QUEST_UI_NEW+"s_id_bg.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        var rightSymbol = GUI.getSymbolImage( GOODS_TYPE_GOLD, px(50), px(50), px(-40), px(0), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        rightSymbol.name = "symbol";
        rightBG.addControl( rightSymbol );
        var rightText = GUI.CreateText( px(-20), px(0), "loading", "Black", 20, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        rightText.name = "text";
        rightBG.isHitTestVisible = false;
        rightBG.addControl( rightText );
        this.wrapMain.addControl( rightBG );

        rewardUI.push( {ui:rightBG, goods:undefined} );
        rewardUI.push( {ui:midBG, goods:undefined} );
        rewardUI.push( {ui:leftBG, goods:undefined} );      

        // gauge
        var gaugeXPos = 150;
        var gaugeYPos = -6;
        var gaugeWidth = 184;
        var gaugeHeight = 20;

        // left gauge
        var leftGaugeWrapper = GUI.createContainer( "leftGaugeWrapper" );
        leftGaugeWrapper.left = px(-gaugeXPos);
        leftGaugeWrapper.top = px(gaugeYPos);
        leftGaugeWrapper.width = px(gaugeWidth);
        leftGaugeWrapper.height = px(gaugeHeight);
        self.wrapMain.addControl( leftGaugeWrapper );

        var leftGaugeWrapperInner = GUI.createContainer( "leftGaugeWrapperInner" );
        leftGaugeWrapperInner.width = px(50);
        leftGaugeWrapperInner.horizontalAlignment = GUI.ALIGN_LEFT;
        leftGaugeWrapper.addControl( leftGaugeWrapperInner );
        
        var leftgaugeBar = GUI.CreateImage( "gaugeBar", px(0), px(0), px(gaugeWidth), px(gaugeHeight), SOCIAL_QUEST_UI_NEW+"s_bar1_pro.png", GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        leftGaugeWrapperInner.addControl(leftgaugeBar);

        // left gauge reward icon
        var leftGaugeRewardIcon = GUI.CreateImage( "leftGaugeRewardIcon", px(-gaugeXPos+gaugeWidth*0.5), px(gaugeYPos), px(33), px(33), SOCIAL_QUEST_UI_NEW+"ruby_icon.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        self.wrapMain.addControl(leftGaugeRewardIcon);

        // right gauge
        var rightGaugeWrapper = GUI.createContainer( "rightGaugeWrapper" );
        rightGaugeWrapper.left = px(gaugeXPos-4);
        rightGaugeWrapper.top = px(gaugeYPos);
        rightGaugeWrapper.width = px(gaugeWidth);
        rightGaugeWrapper.height = px(gaugeHeight);
        self.wrapMain.addControl( rightGaugeWrapper );

        var rightGaugeWrapperInner = GUI.createContainer( "rightGaugeWrapperInner" );
        rightGaugeWrapperInner.width = px(100);
        rightGaugeWrapperInner.horizontalAlignment = GUI.ALIGN_LEFT;
        rightGaugeWrapper.addControl( rightGaugeWrapperInner );
        
        var rightgaugeBar = GUI.CreateImage( "gaugeBar", px(0), px(0), px(gaugeWidth), px(gaugeHeight), SOCIAL_QUEST_UI_NEW+"s_bar1_pro.png", GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        rightGaugeWrapperInner.addControl(rightgaugeBar);
        
        // gauge animation
        var barIncreaseAni = function ( in_innerWrapper, in_value )
        {
            var targetValue = 10 + ((gaugeWidth-10) / 3) * in_value;

            var frameRate = 120;
            var widthAnimation = new BABYLON.Animation( "widthAnimation", "width", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var widthAnimationKey = [];
            widthAnimationKey.push( {frame:0, value: parseInt( in_innerWrapper.width )} );    
            widthAnimationKey.push( {frame:frameRate, value:targetValue} );
            widthAnimation.setKeys(widthAnimationKey);    
            CommFunc.useEasingFuncToAnimation(widthAnimation);
    
            G.scene.beginDirectAnimation( in_innerWrapper, [widthAnimation], 0, frameRate, false, 1.0 );
        }

        // // left gauge
        // var leftGaugeWrapper = GUI.createContainer('leftGauge');
        // self.wrapMain.addControl( leftGaugeWrapper );
        // var leftGaugeBG = GUI.CreateImage( "leftGaugeBG", px(-250), px(20), px(40), px(150), SOCIAL_QUEST_UI_PATH+"img_gaugeBG.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        // leftGaugeWrapper.addControl( leftGaugeBG );
        // var leftGaugeTextBg = GUI.CreateImage( "textBg", px(-253), px(120), px(50), px(25), SOCIAL_QUEST_UI_PATH+"img_guage_textbg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        // leftGaugeWrapper.addControl( leftGaugeTextBg );
        // var leftGaugeText = GUI.CreateText( px(-253), px(120), questPacketInfo.QUEST_CLEARCNT.toString() + "/3", "Black", 16, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        // leftGaugeText.name = "text";
        // leftGaugeWrapper.addControl( leftGaugeText );
        // // bar
        // var leftbarBottom = GUI.CreateImage( "barBottom", px(0), px(-2), px(30), px(14), SOCIAL_QUEST_UI_PATH+"bigbar_edge.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        // leftbarBottom.rotation = ToRadians(180);
        // var leftbarBody = GUI.CreateImage( "barBody", px(0), px(-12), px(30), px(0),SOCIAL_QUEST_UI_PATH+"bigbar_body.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        // var leftbarTop = GUI.CreateImage( "barTop", px(0), px(-10), px(30), px(14),SOCIAL_QUEST_UI_PATH+"bigbar_edge.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        // var leftbarWrapper = GUI.CreateClipArea( px(-250), px(20), px(30), px(140), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        // leftbarWrapper.addControl(leftbarBottom);
        // leftbarWrapper.addControl(leftbarBody);
        // leftbarWrapper.addControl(leftbarTop);
        // leftGaugeWrapper.addControl( leftbarWrapper );
        // // star
        // var leftbarBGStar  = GUI.CreateImage( "barStar", px(-250), px(-52), px(40), px(40), SOCIAL_QUEST_UI_PATH+"barBG_star.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        // leftGaugeWrapper.addControl( leftbarBGStar );

        barIncreaseAni( leftGaugeWrapperInner, questPacketInfo.QUEST_CLEARCNT );
        

        // // right gauge
        // var rightGaugeWrapper = GUI.createContainer('rightGauge');
        // var rightGaugeBG = GUI.CreateImage( "rightGaugeBG", px(250), px(20), px(40), px(150), SOCIAL_QUEST_UI_PATH+"img_gaugeBG.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        // rightGaugeWrapper.addControl( rightGaugeBG );       
        // var rightGaugeTextBg = GUI.CreateImage( "textBg", px(253), px(120), px(50), px(25), SOCIAL_QUEST_UI_PATH+"img_guage_textbg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        // rightGaugeWrapper.addControl( rightGaugeTextBg );
        // self.wrapMain.addControl( rightGaugeWrapper );
        // var rightGaugeText = GUI.CreateText( px(253), px(120),  questPacketInfo.TEAM_QUEST_STEP.toString() + "/3", "Black", 16, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        // rightGaugeText.name = "text";
        // rightGaugeWrapper.addControl( rightGaugeText );        
        // // bar
        // var rightbarBottom = GUI.CreateImage( "barBottom", px(0), px(-2), px(30), px(14), SOCIAL_QUEST_UI_PATH+"bigbar_edge.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        // rightbarBottom.rotation = ToRadians(180);
        // var rightbarBody = GUI.CreateImage( "barBody", px(0), px(-12), px(30), px(0),SOCIAL_QUEST_UI_PATH+"bigbar_body.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        // var rightbarTop = GUI.CreateImage( "barTop", px(0), px(-10), px(30), px(14),SOCIAL_QUEST_UI_PATH+"bigbar_edge.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        // var rightbarWrapper = GUI.CreateClipArea( px(250), px(20), px(30), px(140), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        // rightbarWrapper.addControl(rightbarBottom);
        // rightbarWrapper.addControl(rightbarBody);
        // rightbarWrapper.addControl(rightbarTop);
        // rightGaugeWrapper.addControl( rightbarWrapper );
        // // star
        // var rightBarStar  = GUI.CreateImage( "barStar", px(250), px(-52), px(40), px(40), SOCIAL_QUEST_UI_PATH+"barBG_star.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        // rightGaugeWrapper.addControl( rightBarStar );

        barIncreaseAni( rightGaugeWrapperInner, questPacketInfo.TEAM_QUEST_STEP );
        

        // 바로방문
        var directVisitButton = GUI.CreateButton( "directVisitButton", px(150), px(50), px(150), px(50), SOCIAL_QUEST_UI_NEW+"empty_btn.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        self.wrapMain.addControl( directVisitButton );
        var directVisitText = GUI.CreateText( px(-33), px(0), "바로방문", "Black", GUI.FontSize.TINY, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        directVisitButton.addControl( directVisitText );
        var directVisitPriceSymbol = GUI.getSymbolImage( GOODS_TYPE_GOLD, px(28), px(28), px(17), px(1), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        directVisitButton.addControl( directVisitPriceSymbol );
        var directVisitPriceText = GUI.CreateText( px(45), px(0), "loading", "Black", GUI.FontSize.TINY, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        directVisitButton.addControl( directVisitPriceText );

        var setVisitButtonUI = function( in_isOpen )
        {
            if ( in_isOpen )
            {
                directVisitText.text = "방문하기";
                directVisitText.left = px(0);
                directVisitPriceSymbol.isVisible = false;
                directVisitPriceText.isVisible = false;
                directVisitText.fontSize = GUI.FontSize.BIG;
            }
            else
            {
                directVisitText.text = "바로방문";
                directVisitText.left = px(-33 );
                directVisitPriceSymbol.isVisible = true;
                directVisitPriceText.isVisible = true;
                directVisitText.fontSize = GUI.FontSize.TINY;
                
            }
        };        

        directVisitButton.onPointerUpObservable.add ( function ()
        {
            if ( questPacketInfo.QUEST_CLEARCNT == 3 || isForceOpenVisit == 1 ) // 바로방문 가능
            {
                G.dataManager.setFriendInfo(questPacketInfo.TEAM_ACCOUNTPK, questPacketInfo.TEAM_AVATARCD, G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQInfoPath(0));
                G.sceneMgr.getCurrentScene().goMyFriend(false);
            }
            else // 불가능. 오픈해야함
            {
                var effectDelayFunc = function()                
                {
                    var onReceiveforceOpenVisit = function()
                    {
                        isForceOpenVisit = 1;
                        setVisitButtonUI(true);
                    }

                    var json = protocol.produceSocialQuestDirectVisit();
                    ws.onRequest(json, onReceiveforceOpenVisit, self);
                }

                GUI.decreaseMoneyEffect( self.wrapMain, GOODS_TYPE_GOLD, parseInt( directVisitPriceText.text ), px(140), px(50), px(120), px(35), 12, effectDelayFunc );
            }
        });
        
        // close button
        var closeButton = GUI.CreateButton( "closeButton", px(300), px(-470), px(97), px(96), AIUI_PATH+"Ai_window/A_x_btn_idle.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(closeButton);
        closeButton.onPointerUpObservable.add( function()
        {
            self.closePopup(1);
        });

        
        // topButtonTab
        self.createTopButtonBackground( this.wrapMain, SQtype.PRODUCE ,-357 );


        // 퀘스트설명
        // quest desc
        var buttonInfoText = G.dataManager.getSocialQuestDataText( (parseInt( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getQuestInfo( self.questType.PRODUCE ).QUEST_ID / 100 ) * 100) + ( Math.min(3, questPacketInfo.QUEST_CLEARCNT+1) ) ).TEXT.replace(/MYID/g, G.dataManager.getUsrMgr(DEF_IDENTITY_ME).nickname);
        
        var focusIcon = GUI.CreateImage( "focusIcon", px(-230), px(350), px(69), px(69), SOCIAL_QUEST_UI_NEW+"s_notice_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(focusIcon);

        var focusButton = GUI.CreateButton( "focusButton", px(50), px(350), px(466), px(96), SOCIAL_QUEST_UI_NEW+"s_tb_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(focusButton);
        focusButton.isHitTestVisible = false;

        // text attach to button
        var questDescText = GUI.CreateAutoLineFeedText( px(30), px(0), px(450), px(90), buttonInfoText, "Black", GUI.FontSize.SMALL, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        focusButton.addControl( questDescText );


        var beforeTouchPos = NaN;
        var buttonOffset = 0;
        var originalWidth = 410;
        var clipArea = GUI.CreateClipArea( px(0), px(400), px(410), px(70), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        var buttonWrapper = GUI.CreateClipArea( px(0), px(0), px(2400), px(70), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        var focusButton = [];

        var goPageAnimation = function( in_page )
        {            
            // var frameRate = 4;
            // var targetValue = -(in_page* GUI.getResolutionCorrection( originalWidth, false ));
            // // 자동포커스 애니메이션
            // var pickingAni = new BABYLON.Animation( "picking", "left", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            // var keyFrames = [];
            // keyFrames.push({frame:0,value: parseInt(buttonWrapper.left)});
            // keyFrames.push({frame:frameRate,value:targetValue});
            // pickingAni.setKeys(keyFrames);

            // CommFunc.useEasingFuncToAnimation( pickingAni );

            // self.animation = G.scene.beginDirectAnimation( buttonWrapper, [pickingAni], 0, frameRate, false, 3 );

            questDescText.text = G.dataManager.getSocialQuestDataText( (parseInt( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getQuestInfo( self.questType.PRODUCE ).QUEST_ID / 100 ) * 100) + (in_page+1) ).TEXT.replace(/MYID/g, G.dataManager.getUsrMgr(DEF_IDENTITY_ME).nickname);
        }
        for ( var i = 0; i < 3; ++i )
        {
            // each button
            focusButton[i] = GUI.CreateButton( "focusButton", px(0+(i*410)-buttonOffset), px(0), px(410), px(65), SOCIAL_QUEST_UI_PATH+"btn_socialquest_produce.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            buttonWrapper.addControl(focusButton[i]);

            // text attach to button
            var descText = G.dataManager.getSocialQuestDataText( (parseInt( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getQuestInfo( self.questType.PRODUCE ).QUEST_ID / 100 ) * 100) + (i+1) ).TEXT.replace(/MYID/g, G.dataManager.getUsrMgr(DEF_IDENTITY_ME).nickname);
            focusButton[i].addControl( GUI.CreateAutoLineFeedText( px(50), px(0), px(310), px(65), descText, "white", GUI.FontSize.SMALL, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE ) );

            if ( questPacketInfo.QUEST_CLEARCNT > i )
            {
                var clearMark = GUI.CreateImage( "clearMark"+i.toString(), px(150), px(0), px(60), px(60), SOCIAL_QUEST_UI_PATH+"mark_ok.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
                clearMark.rotation = ToRadians( -15 );
                focusButton[i].addControl( clearMark );
            }
            
            focusButton[i].onPointerDownObservable.add( function( in_coordination )
            {
                if ( null != self.animation )
                    self.animation.stop();

                beforeTouchPos = in_coordination.x;
            });

            focusButton[i].onPointerMoveObservable.add( function( in_coordination )
            {

                // if ( isNaN( beforeTouchPos ) )
                //     return;

                // buttonWrapper.left = px( parseInt( buttonWrapper.left ) - (beforeTouchPos - in_coordination.x) );

                // if ( GUI.getResolutionCorrection( -(originalWidth*2) - 20, false )  > parseInt( buttonWrapper.left ) )
                //     buttonWrapper.left = GUI.getResolutionCorrection( px(-(originalWidth*2) - 20));

                // if ( 10 < parseInt( buttonWrapper.left) )
                //     buttonWrapper.left = px(10);

                // beforeTouchPos = in_coordination.x;
            });

            focusButton[i].onPointerUpObservable.add( function()
            {
                claerQuest(0);
                return;

                beforeTouchPos = NaN;
                var targetPage =  CommFunc.random( 3 );
                setFocusQuestData( targetPage );

                // for ( var i = 0; i < 3; ++i )
                // {
                //     if ( -GUI.getResolutionCorrection( originalWidth, false )*(i+1)+GUI.getResolutionCorrection( 200, false) < parseInt( buttonWrapper.left ) &&
                //      parseInt( buttonWrapper.left ) < -(GUI.getResolutionCorrection( originalWidth, false )*i)+GUI.getResolutionCorrection( 200, false ) )
                //     {    
                //         targetPage = i;            
                //         setFocusQuestData(i);
                //     }
                // }
            });
        }        
        clipArea.addControl( buttonWrapper );
        //self.wrapMain.addControl(clipArea);

        // process button        
        var questSTEP = { "Ready":0, "CanGetReward":2 };
        var buttonStateText = ["진행하기", "보상받기", "보상수령완료", "선행 퀘스트 필요"];
        var currentButtonState = 0;

        var acceptButton = GUI.CreateButton( "acceptButton", px(0), px(550), px(203), px(70), SOCIAL_QUEST_UI_NEW+"start_btn.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(acceptButton);
        
        var acceptButtonText = GUI.CreateText( px(0), px(0), "진행하기", "Black", GUI.FontSize.VBIG, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        acceptButton.addControl( acceptButtonText );

        acceptButton.addControl( acceptButtonText );
        acceptButton.onPointerUpObservable.add( function()
        {
            // 헷갈려하면안됩니다영수님!!
            if ( questPacketInfo.QUEST_STEP == questSTEP.Ready ) // 이 분기는 "시작하기" 그러니까 눌러서 SNS 글쓰기 페이지로 가는 로직이다
            {
                
                self.closePopup(1);

                self.snsCallbackFunc = function()
                {
                    questPacketInfo.QUEST_STEP = questSTEP.CanGetReward;  // 이것이 포인터 개념이면 usrmgr 의 데이터도 바뀔것이다.
                    acceptButtonText.text = buttonStateText[ questSTEP.CanGetReward-1 ]; // 완료하기가 되어야한다.

                    setTimeout( function(){
                        G.sceneMgr.getCurrentScene().wsSendSNSQuestLoad()
                    }, 1000 );
                }

                // TODO:SNS를 띄워준다. 근데 또 여기서 생산퀘스트에는 부속으로 생산,소비,공유가 있는데 SNS쪽에도 그거 다 맞게 세팅해서 보내줘야한다.할렐루야
                self.openSQSNS( questPacketInfo.TEAM_ACCOUNTPK, currentViewQuest.data.SEQ, currentViewQuest.page );
                                
                if ( currentViewQuest.page != self.questType.PRODUCE )
                {                    
                    if ( currentViewQuest.page == self.questType.SHARE )
                        G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).setVisitPurposeForShare(true);

                    G.dataManager.setFriendInfo(questPacketInfo.TEAM_ACCOUNTPK, questPacketInfo.TEAM_AVATARCD, G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQInfoPath(0));
                    G.sceneMgr.getCurrentScene().goMyFriend(false);
                }
            }
            else if ( questPacketInfo.QUEST_STEP == questSTEP.CanGetReward ) // 이 분기는 "완료하기" 그러니까 SNS글쓰기를 완료하고 보상받기 버튼을 누르는 로직이다.
            {
                var receiveProtocolFunc = function()
                {
                    claerQuest( currentViewQuest.page );
                    //questPacketInfo.QUEST_CLEARCNT++; // 이건 서버에서 증가된 값을 보내 준다.
                }

                // 이건 콜백받았을때 띄워준다.
                var json = protocol.updateSNSQuest(questPacketInfo.QUEST_ID, questPacketInfo.TEAM_ACCOUNTPK);
                ws.onRequest(json, self.updateSNSQuestCB, [self, receiveProtocolFunc]);
            }
        });

        // 현재 포커싱한 퀘스트의 정보 세팅
        var currentViewQuest = {"page":questPacketInfo.QUEST_CLEARCNT, "data":socialQuestData };
        var setFocusQuestData = function( in_pageIndex )
        {
            goPageAnimation( in_pageIndex );     
            // 포커스한 퀘스트 보상으로 UI 갱신
            var focusSQRewardData = G.dataManager.getSocialQuestData( (parseInt( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getQuestInfo( self.questType.PRODUCE ).QUEST_ID / 100 ) * 100) + (in_pageIndex+1) );

            // 보상 - 갯수가 0 초과인것만 보여준다고 한다.
            rewardUI.forEach( function(iter){ iter.ui.isVisible = false; });

            var activeRewardCount = 0;
            for ( var i = 0; i < 4; ++i )
            {
                if ( 0 == socialQuestData["RWD_ITEM_CNT"+(i+1).toString()] )
                    continue;
                
                rewardUI[activeRewardCount].ui.isVisible = true;
                rewardUI[activeRewardCount].ui.removeControl( rewardUI[activeRewardCount].ui.getChildByName("symbol") );
                rewardUI[activeRewardCount].goods = socialQuestData["RWD_ITEM_ID"+(i+1)];
                var newSymbol = GUI.getSymbolImage( rewardUI[activeRewardCount].goods.toString(), px(50), px(50), px(-40), px(0), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
                newSymbol.name = "symbol";
                rewardUI[activeRewardCount].ui.addControl(newSymbol);
                rewardUI[activeRewardCount].ui.getChildByName("text").text = "x " + socialQuestData["RWD_ITEM_CNT"+(i+1).toString()].toString();

                activeRewardCount++;
            }

            // 바로방문 비용
            directVisitButton.removeControl( directVisitPriceSymbol );
            directVisitPriceSymbol = null;
            directVisitPriceSymbol =  GUI.getSymbolImage( focusSQRewardData.OPEN_ITEM_ID, px(28), px(28), px(14), px(1), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            directVisitButton.addControl( directVisitPriceSymbol );
            directVisitPriceText.text = focusSQRewardData.OPEN_ITEM_CNT.toString();

            setVisitButtonUI( questPacketInfo.QUEST_CLEARCNT == 3 || isForceOpenVisit == 1 );

            // 지금 진행해야할 퀘스트 다음 퀘스트를 보고있으면 시작하기 버튼 비활성화
            if ( 3 == questPacketInfo.QUEST_CLEARCNT )
            {
                acceptButton.isVisible = false;
            }
            else if ( questPacketInfo.QUEST_CLEARCNT > in_pageIndex )
            {
                acceptButton.isVisible = true;
                acceptButton.alpha = 0.5;
                acceptButton.isHitTestVisible = false;
                acceptButtonText.text = buttonStateText[ 2 ];
                acceptButtonText.color = "red";
            }
            else if ( questPacketInfo.QUEST_CLEARCNT == in_pageIndex ) // 현재 진행해야 할 포커스 데이터 (완료하기, 시작하기를 구분해주자.)
            {
                acceptButton.isVisible = true;
                acceptButton.alpha = 1;
                acceptButton.isHitTestVisible = true;
                if ( questPacketInfo.QUEST_STEP == questSTEP.Ready )
                {
                    acceptButtonText.text = buttonStateText[ 0 ];
                }
                else
                {
                    //FPopup.openAnimation( acceptButton, undefined, undefined, true, 1 );
                    acceptButtonText.text = buttonStateText[ 1 ];
                }
                acceptButtonText.color = "black";
            }
            else
            {
                acceptButton.isVisible = true;
                acceptButton.alpha = 0.5;
                acceptButton.isHitTestVisible = false;
                acceptButtonText.text = buttonStateText[ 3 ];
                acceptButtonText.color = "red";
            }

            currentViewQuest.page = in_pageIndex;
            currentViewQuest.data = focusSQRewardData;
        }

        // 초기 세팅
        setFocusQuestData( Math.min( 2, questPacketInfo.QUEST_CLEARCNT ) );

        // 이것은 완료-보상받기 했을때 호출하면 된다.
        var claerQuest = function ( in_curPage )
        {   
            var clearMark = GUI.CreateImage( "clearMark", px(-200), px(rewradTopPos-5), px(120), px(120), SOCIAL_QUEST_UI_PATH+"mark_ok.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            self.wrapMain.addControl( clearMark );

            var frameRate = 120;
            
            var scaleXAnimation = new BABYLON.Animation( "scalex", "scaleX", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            var keyframeX = [];
            keyframeX.push({frame:0,value:2.5});
            keyframeX.push({frame:frameRate-20,value:0.75});
            keyframeX.push({frame:frameRate,value:1.0});
            scaleXAnimation.setKeys(keyframeX);
            CommFunc.useEasingFuncToAnimation(scaleXAnimation);

            var scaleYAnimation = new BABYLON.Animation( "scaley", "scaleY", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            var keyframeY = [];
            keyframeY.push({frame:0,value:2.5});
            keyframeY.push({frame:frameRate-20,value:0.75});
            keyframeY.push({frame:frameRate,value:1.0});
            scaleYAnimation.setKeys(keyframeY);
            CommFunc.useEasingFuncToAnimation(scaleYAnimation);
            
            var rotateAnimation = new BABYLON.Animation( "rotation", "rotation", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
            var keyframeRot = [];
            keyframeRot.push({frame:0,value:ToRadians(0)});
            keyframeRot.push({frame:frameRate-20,value:ToRadians(-30)});
            keyframeRot.push({frame:frameRate,value:ToRadians(-15)});
            rotateAnimation.setKeys(keyframeRot);
            
            FPopup.openAnimation( self.wrapMain, undefined, 1 );
            G.soundManager.playQuestClearSound();
    
            G.scene.beginDirectAnimation( clearMark, [scaleXAnimation, scaleYAnimation, rotateAnimation], 0, frameRate, false, 3, function()
            { 
                var clearMark = GUI.CreateImage( "clearMark"+currentViewQuest.page.toString(), px(150), px(0), px(60), px(60), SOCIAL_QUEST_UI_PATH+"mark_ok.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
                clearMark.rotation = ToRadians( -15 );
                focusButton[currentViewQuest.page].addControl( clearMark );

                var ratio = (window.innerWidth / G.guiMain.idealWidth);
                self.wrapMain.removeControl( self.wrapMain.getChildByName("clearMark") );

                for ( var i = 0; i < rewardUI.length; ++i )
                {
                    if ( rewardUI[i].ui.isVisible )
                    {
                        var targetUI = self.getInvenGoodsUI( rewardUI[i].goods );
                        GUI.goodsGetEffect( rewardUI[i].goods, 100, [ px(parseInt(rewardUI[i].ui.left)/ratio), px(parseInt(rewardUI[i].ui.top)/ratio)], self.getPosInvenGoods(targetUI), undefined );
                    }
                }

                setFocusQuestData( Math.min( 2, in_curPage+1 ) );                
            } );

            barIncreaseAni( leftGaugeWrapperInner, currentViewQuest.page+1 );
        }
        
        FPopup.openAnimation( self.wrapMain );
        G.soundManager.playPopupOpenSound();
        
        // var viewDirection = Vector3.Cross( G.camera.target, G.camera.position ).normalize();
        // GUI.installEffect( new BABYLON.Vector3( G.camera.position.x, G.camera.position.y - 5, G.camera.position.z ), "poof_b.png", 1.0, 10 );         
    }


    // TODO : change or add interface after cofirm dataManager
    FSocialQuest.prototype.openSQProducePopup = function( in_self ) 
    {

        var ISVERTICAL = (window.innerWidth < window.innerHeight);

        // if ( ISVERTICAL )
        //     in_self.openSQProducePopup_Vertical( in_self );
        // else
            in_self.openSQProducePopup_Horizontal( in_self );        
    };

    // goods effect targetPos
    FSocialQuest.prototype.getInvenGoodsUI = function( in_goodsType )
    {
        var uiName = GUI.ButtonName.mainProfile;
        switch( in_goodsType )
        {
        case GOODS_TYPE_STAR :
            {
                uiName = GUI.ButtonName.mainStar;
            }
            break;
    
        case GOODS_TYPE_GOLD :
            {
                uiName = GUI.ButtonName.mainCoin;
            }
            break;
    
        case GOODS_TYPE_RUBY :
            {
                uiName = GUI.ButtonName.mainRuby;
            }
            break;
    
        case GOODS_TYPE_COIN :
            {
                uiName = GUI.ButtonName.mainCoin;
            }
            break;
    
        case GOODS_TYPE_EXP :
            {
                uiName = GUI.ButtonName.mainProfile;
            }
            break;
    
        default :
            {
                uiName = GUI.ButtonName.mainProfile;
            }
            break;
        }

        return FRoomUI.getInstance().ui.button[ ROOMBUTTON.PROFILE ]; //G.sceneMgr.getCurrentScene().wrapTopInfo.getChildByName( uiName );
    }

    // calc effect endpos
    FSocialQuest.prototype.getPosInvenGoods = function( in_targetUI )
    {
        // var x = in_targetUI.left;
        // switch( in_targetUI.horizontalAlignment )
        // {
        // case GUI.ALIGN_LEFT : x = px(-( window.innerWidth/2 - (parseInt( in_targetUI.left )+18))); break;
        // case GUI.ALIGN_RIGHT : x = px( (window.innerWidth/2 + (parseInt( in_targetUI.left )-73)) ); break;
        // }

        // var y = in_targetUI.top;
        // switch( in_targetUI.verticalAlignment )
        // {
        // case GUI.ALIGN_TOP : y = px(-(window.innerHeight/2 - (parseInt( in_targetUI.top )+16))); break;
        // case GUI.ALIGN_BOTTOM : y = px((window.innerHeight/2 + (parseInt( in_targetUI.top )+16))); break;
        // }

        // return [x,y];

        var ratio = (window.innerWidth / G.guiMain.idealWidth);
        return [ px((-window.innerWidth/2+60)/ratio), px((-window.innerHeight/2+60)/ratio) ];
    }

    FSocialQuest.prototype.openSQConsumePopup = function( in_self ) 
    {
        var self = this;
        if ( in_self != undefined )
            self = in_self;

        self.openSQConsumeSharePopup( self.questType.CONSUME );
    };

    FSocialQuest.prototype.openSQSharePopup = function( in_self ) 
    {
        var self = this;
        if ( in_self != undefined )
            self = in_self;

        self.openSQConsumeSharePopup( self.questType.SHARE );
    };
    

    FSocialQuest.prototype.openShareMessagePopup = function()
    {
        var self = this;
        
        this.closePopup(0);

        this.wrapMain = FPopup.createPopupWrapper( "black", 0.5 );
        G.guiMain.addControl(this.wrapMain, GUI.LAYER.POPUP);
        
        // popup background
        var img = GUI.CreateImage("back", px(0), px(-10), px(299), px(312), SOCIAL_QUEST_UI_PATH+"popup_socialquest_sharemessage.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        this.wrapMain.addControl(img);
        
        // title
        var titleText = GUI.CreateText( px(0), px(-150), "메시지", "Black", 16, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(titleText);
        
        // inputtext text
        var inputtextText = GUI.CreateText( px(0), px(-50), "텍스트를 입력하세요", "gray", 20, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(inputtextText);
        
        // processTime text
        var processTimeText = GUI.CreateText( px(0), px(30), "00h   00m   00s", "white", 24, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(processTimeText);

        // share button
        var shareButton = GUI.CreateButton( "shareButton", px(0), px(95), px(180), px(45), SOCIAL_QUEST_UI_PATH+"btn_accpet.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(shareButton);
        var acceptButtonText = GUI.CreateText( px(0), px(0), "공유하기", "Black", 16, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        shareButton.addControl( acceptButtonText );
        
        // close button
        var closeButton = GUI.CreateButton( "closeButton", px(110), px(-150), px(45), px(45), SOCIAL_QUEST_UI_PATH+"pop_cancel.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(closeButton);
        closeButton.onPointerUpObservable.add( function()
        {
            self.closePopup(1);
        });
        
        FPopup.openAnimation( this.wrapMain );
        G.soundManager.playPopupOpenSound();
    };

    
    // TODO : change or add interface after cofirm dataManager
    FSocialQuest.prototype.openSQConsumeSharePopup = function( in_questKind )
    {
        var questPacketInfo = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getQuestInfo( in_questKind );
        var socialQuestData = G.dataManager.getSocialQuestData( questPacketInfo.QUEST_ID );
        var subInfo = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getQuestSubInfo();

        var self = this;
        
        this.closePopup(0);

        this.wrapMain = FPopup.createPopupWrapper( "black", 0.5 );
        G.guiMain.addControl(this.wrapMain, GUI.LAYER.POPUP);
        this.wrapMain.isPointerBlocker = true;
        
        // popup background
        var img = GUI.CreateButton("back", px(0), px(0), px(686), px(933), SOCIAL_QUEST_UI_NEW+"s_board_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        img.isHitTestVisible = false;
        this.wrapMain.addControl(img);
        

        var subBottomBG = GUI.CreateImage("subBottomBG", px(0), px(270), px(641), px(316), SOCIAL_QUEST_UI_NEW+"s_under.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        self.wrapMain.addControl(subBottomBG);

        var tabImgURL = "";
        switch( in_questKind )
        {
            case this.questType.CONSUME : tabImgURL = "s_pop2nd_tab.png"; break;
            case this.questType.SHARE   : tabImgURL = "s_pop3rd_tab.png"; break;
        }

        var subBG = GUI.CreateImage("subBG", px(0), px(-140), px(641), px(510), SOCIAL_QUEST_UI_NEW + tabImgURL, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        self.wrapMain.addControl(subBG);

        
        // title
        var titleText = GUI.CreateText( px(0), px(-425), "⊙  소셜 라이프  ⊙", "Black", 26, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        self.wrapMain.addControl(titleText);

        // socialQuest gaugeBar
        var gaugeStartPos = 75;
        var gaugeTopPost = 260;
        var gaugeWidth = 404;
        var gaugeText = GUI.CreateText( px(-220), px(gaugeTopPost-3), "퀘스트", "Gray", 20, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(gaugeText);

        var gaugeBG = GUI.CreateImage( "gaugeBG", px(gaugeStartPos), px(gaugeTopPost), px(gaugeWidth), px(19), SOCIAL_QUEST_UI_NEW+"s_longbar_pro.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        self.wrapMain.addControl(gaugeBG);

        var gaugeBarWrapper = GUI.createContainer( "gaugeBarWraaper" );
        gaugeBarWrapper.isPointerBlocker = true;
        gaugeBarWrapper.left = px(gaugeStartPos);
        gaugeBarWrapper.top = (gaugeTopPost);
        gaugeBarWrapper.width = px(gaugeWidth);
        gaugeBarWrapper.height = px(22);
        gaugeBarWrapper.horizontalAlignment = GUI.ALIGN_CENTER;
        gaugeBarWrapper.verticalAlignment = GUI.ALIGN_MIDDLE;   
        self.wrapMain.addControl( gaugeBarWrapper );

        var gaugeBarWraaperInner = GUI.createContainer( "gaugeBarWraaperInner" );
        gaugeBarWraaperInner.width = px(10);
        gaugeBarWraaperInner.horizontalAlignment = GUI.ALIGN_LEFT;
        gaugeBarWrapper.addControl( gaugeBarWraaperInner );



        var gaugeBar = GUI.CreateImage( "gaugeBar", px(0), px(0), px(gaugeWidth), px(22), SOCIAL_QUEST_UI_NEW+"s_longbar1_pro.png", GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        gaugeBarWraaperInner.addControl(gaugeBar);

        var startGaugeAni = function( in_count )
        {
            var targetValue = 10 + ((gaugeWidth-10) / 6) * in_count;

            var frameRate = 120;
            var widthAnimation = new BABYLON.Animation( "widthAnimation", "width", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var widthAnimationKey = [];
            widthAnimationKey.push( {frame:0, value: parseInt( gaugeBarWraaperInner.width )} );    
            widthAnimationKey.push( {frame:frameRate, value:targetValue} );
            widthAnimation.setKeys(widthAnimationKey);    
            CommFunc.useEasingFuncToAnimation(widthAnimation);
    
            G.scene.beginDirectAnimation( gaugeBarWraaperInner, [widthAnimation], 0, frameRate, false, 1.0 );

            gaugeText.text = "퀘스트(" + in_count.toString() + "/" + subInfo.length.toString() + ")";
        }
        
        // reward text
        var rewradTopPos = 180;

        var rewardBG = GUI.CreateImage( "rewardBG",px(0),px(rewradTopPos),px(590),px(89),SOCIAL_QUEST_UI_NEW+"s_reward2_bg.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        this.wrapMain.addControl( rewardBG );

        var rewardText = GUI.CreateText( px(-235), px(rewradTopPos-5), "완료 보상", "Gray", GUI.FontSize.MIDDLE, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(rewardText);

        var rewardUI = [];
        // left
        var leftBG = GUI.CreateButton("rewardLeftBG",px(-100),px(rewradTopPos),px(140),px(55),SOCIAL_QUEST_UI_NEW+"s_id_bg.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        var leftSymbol = GUI.getSymbolImage( GOODS_TYPE_GOLD, px(50), px(50), px(-40), px(0), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        leftSymbol.name = "symbol";
        leftBG.addControl( leftSymbol );
        var leftText = GUI.CreateText( px(-10), px(0), "loading", "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        leftText.name = "text";
        leftBG.isHitTestVisible = false;
        leftBG.addControl( leftText );
        this.wrapMain.addControl( leftBG );
        
        // middle
        var midBG = GUI.CreateButton("rewardMidBG",px(50),px(rewradTopPos),px(140),px(55),SOCIAL_QUEST_UI_NEW+"s_id_bg.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        var midSymbol = GUI.getSymbolImage( GOODS_TYPE_GOLD, px(50), px(50), px(-40), px(0), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        midSymbol.name = "symbol";
        midBG.addControl( midSymbol );
        var midText = GUI.CreateText( px(-10), px(0), "loading", "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        midText.name = "text";
        midBG.isHitTestVisible = false;
        midBG.addControl( midText );
        this.wrapMain.addControl( midBG );
    
        // right
        var rightBG = GUI.CreateButton("rewardRightBG",px(200),px(rewradTopPos),px(140),px(55),SOCIAL_QUEST_UI_NEW+"s_id_bg.png",GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        var rightSymbol = GUI.getSymbolImage( GOODS_TYPE_GOLD, px(50), px(50), px(-40), px(0), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        rightSymbol.name = "symbol";
        rightBG.addControl( rightSymbol );
        var rightText = GUI.CreateText( px(-10), px(0), "loading", "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        rightText.name = "text";
        rightBG.isHitTestVisible = false;
        rightBG.addControl( rightText );
        this.wrapMain.addControl( rightBG );

        rewardUI.push( {ui:rightBG, goods:undefined} );
        rewardUI.push( {ui:midBG, goods:undefined} );
        rewardUI.push( {ui:leftBG, goods:undefined} );      
        
        var activeRewardCount = 0;
        for ( var i = 0; i < 4; ++i )
        {
            if ( 0 == socialQuestData["RWD_ITEM_CNT"+(i+1).toString()] )
                continue;
            
            rewardUI[activeRewardCount].ui.isVisible = true;
            rewardUI[activeRewardCount].ui.removeControl( rewardUI[activeRewardCount].ui.getChildByName("symbol") );
            rewardUI[activeRewardCount].goods = socialQuestData["RWD_ITEM_ID"+(i+1)];
            var newSymbol = GUI.getSymbolImage( rewardUI[activeRewardCount].goods.toString(), px(50), px(50), px(-40), px(0), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            newSymbol.name = "symbol";
            rewardUI[activeRewardCount].ui.addControl(newSymbol);
            rewardUI[activeRewardCount].ui.getChildByName("text").text = "x " + socialQuestData["RWD_ITEM_CNT"+(i+1).toString()].toString();

            activeRewardCount++;
        }
        
        // init friend - 이거원래 재화타입별로 아이콘 바뀌어야하는데 걍 골드로 일단 고정
        var initFriendButton = GUI.CreateButton( "initFriendButton", px(0), px(550), px(268), px(69), SOCIAL_QUEST_UI_NEW+"cost2_btn.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(initFriendButton);
        
        var directVisitText = GUI.CreateText( px(-75), px(0), "초기화", "Black", GUI.FontSize.VBIG, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        initFriendButton.addControl( directVisitText );

        var initFriendText = GUI.CreateText( px(70), px(2), socialQuestData.RESET_ITEM_CNT.toString(), "White", GUI.FontSize.VBIG, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        initFriendButton.addControl( initFriendText );

        initFriendButton.onPointerUpObservable.add( function ()
        {
            var efffectDelayFunc = function()
            {
                var onResponseFriendInit = function()
                {
                    refreshNewInfo( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getQuestSubInfo() );                            
                }
    
                var json = protocol.resetSNSQuestSub( questPacketInfo.QUEST_ID );
                ws.onRequest(json, self.resetSNSQuestSubCB, [self,onResponseFriendInit]);
            }

            GUI.decreaseMoneyEffect( self.wrapMain, GOODS_TYPE_GOLD, socialQuestData.RESET_ITEM_CNT, px(15), px(550), px(170), px(69), 22, efffectDelayFunc );
        });

        if(subInfo.length != 6) {
            Debug.Error('소셜퀘스트 추천친구는 6명이어야 합니다.');
            //return;
        }
        
        // matching friend info

        var friendQuestStep = {};
        friendQuestStep.NOTOPEN = 0;
        friendQuestStep.OPEN = 1;
        friendQuestStep.CONDITION = 2;
        friendQuestStep.CLEAR = 3;
        
        var buttonList = [];
        var createFriendButton = function ( in_subData, in_index )
        {
            var left = (in_index%3-1) * 205; 
            var top = 220 * parseInt( in_index / 3 ) - 240;

            var friendQuestData = G.dataManager.getSocialQuestData( in_subData.QUEST_ID );
            var friendIcon = GUI.CreateCircleButton( "friendIcon", px(left), px(top), px(100), px(100), G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQSubInfoPath(in_index), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE, true, "white", false );
            var friendButton = GUI.CreateButton( "friendButton", px(left), px(top+90), px(150), px(50), SOCIAL_QUEST_UI_NEW+"empty_btn.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            
            var open = ["열기","시작하기","보상받기","방문하기"];

            switch( in_subData.QUEST_STEP )
            {
            case friendQuestStep.NOTOPEN :
                {                            
                    friendButton.addControl( GUI.CreateText( px(-40), px(1), open[in_subData.QUEST_STEP], "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
                       
                    friendButton.addControl( GUI.CreateText( px(42), px(0), friendQuestData.OPEN_ITEM_CNT.toString(), "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
                    
                    friendButton.addControl( GUI.getSymbolImage( friendQuestData.OPEN_ITEM_ID, px(35), px(35), px(0), px(0), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );

                    var cover = new BABYLON.GUI.Ellipse();
                    cover.width =  px(110);
                    cover.height = px(110);
                    cover.background = "black";
                    cover.alpha = 0.8;
                    cover.name = "cover";

                    friendIcon.addControl( cover );

                    friendButton.onPointerUpObservable.add( function () 
                    {
                        var delayEffectfunc = function()
                        {
                            var onResponseDirectOpen = function()
                            {
                                refreshNewInfo( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getQuestSubInfo() );                            
                            }
    
                            var json = protocol.updateSNSQuestSub( in_subData.QUEST_ID, in_subData.ACCOUNTPK, 1 );
                            ws.onRequest( json, self.updateSNSQuestSubCB, [self, onResponseDirectOpen] );
                        }

                        GUI.decreaseMoneyEffect( self.wrapMain, friendQuestData.OPEN_ITEM_ID, friendQuestData.OPEN_ITEM_CNT, px(left+40), px(top+90), px(130), px(30), 16, delayEffectfunc );
                    });
                }
                break;

            case friendQuestStep.OPEN :
                {
                    friendButton.addControl( GUI.CreateText( px(0), px(0), open[in_subData.QUEST_STEP], "Black", GUI.FontSize.BIG, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );

                    friendButton.onPointerUpObservable.add( function () 
                    {
                        self.snsCallbackFunc = function()
                        {
                            subInfo[in_index].QUEST_STEP = friendQuestStep.CONDITION;
                            refreshNewInfo( subInfo );subInfo[in_index].QUEST_STEP = friendQuestStep.CONDITION;
                            refreshNewInfo( subInfo );
                        }

                        // TODO:SNS를 띄워준다.                        
                        self.openSQSNS( in_subData.ACCOUNTPK, in_subData.QUEST_ID, in_questKind );    
                        
                        if ( in_questKind == self.questType.SHARE )
                            G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).setVisitPurposeForShare(true);
                        
                        G.dataManager.setFriendInfo(in_subData.ACCOUNTPK, in_subData.AVATARCD, G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQSubInfoPath(in_index));
                        G.sceneMgr.getCurrentScene().goMyFriend(false);
                    });
                }
                break;

            case friendQuestStep.CONDITION :
                {
                    friendButton.addControl( GUI.CreateText( px(0), px(0), open[in_subData.QUEST_STEP], "Black", GUI.FontSize.BIG, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );

                    friendButton.onPointerUpObservable.add( function () 
                    {
                        var onReceiveResponseFunc = function()
                        {
                            for ( var i = 0; i < rewardUI.length; ++i )
                            {
                                if ( rewardUI[i].ui.isVisible )
                                {
                                    var targetUI = self.getInvenGoodsUI( rewardUI[i].goods );
                                    GUI.goodsGetEffect( rewardUI[i].goods, 100, [rewardUI[i].ui.left, rewardUI[i].ui.top], self.getPosInvenGoods(targetUI), undefined );
                                }
                            }

                            subInfo[in_index].QUEST_STEP = friendQuestStep.CLEAR;
                            questPacketInfo.QUEST_CLEARCNT++;
                            refreshNewInfo( subInfo );

                            FPopup.openAnimation( self.wrapMain, undefined, 1 );
                            G.soundManager.playQuestClearSound();
                        }

                        var json = protocol.updateSNSQuestSub( in_subData.QUEST_ID, in_subData.ACCOUNTPK, 3 );
                        ws.onRequest( json, self.updateSNSQuestSubCB, [self, onReceiveResponseFunc] );
                    });
                }
                break;

            case friendQuestStep.CLEAR :
                {
                    friendButton.alpha = 1;
                    friendButton.addControl( GUI.CreateText( px(0), px(0), open[in_subData.QUEST_STEP], "Black", GUI.FontSize.BIG, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );


                    friendButton.onPointerUpObservable.add( function () 
                    {                        
                        // 친구집을 방문할 수 있게 해준다.
                        if ( in_questKind == self.questType.SHARE )
                            G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).setVisitPurposeForShare(true);
                    
                        G.dataManager.setFriendInfo(in_subData.ACCOUNTPK, in_subData.AVATARCD, G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQSubInfoPath(in_index));
                        G.sceneMgr.getCurrentScene().goMyFriend(false);                        
                    });
                }
                break;

            }

            self.wrapMain.addControl( friendIcon );
            self.wrapMain.addControl( friendButton );

            buttonList.push( friendIcon );
            buttonList.push( friendButton );
        }
        
        var refreshNewInfo = function ( in_subInfo )
        {
            buttonList.forEach( function ( iter ) { self.wrapMain.removeControl( iter );} );
            buttonList = [];

            var changeImageFlag = false;

            var openCount = 0;
            var clearCount = 0;
            for ( var i = 0; i < in_subInfo.length; ++i )
            {
                createFriendButton( in_subInfo[i], i );
    
                if ( in_subInfo[i].QUEST_STEP != friendQuestStep.NOTOPEN )
                    openCount++;
                
                if ( in_subInfo[i].QUEST_STEP == friendQuestStep.CLEAR )
                    clearCount++;

                if ( !changeImageFlag )
                {
                    if ( in_subInfo[i].QUEST_STEP == friendQuestStep.OPEN )
                    {
                        if ( G.sceneMgr.getCurrentScene().changeSQFriendImage != undefined )
                        {
                            G.sceneMgr.getCurrentScene().changeSQFriendImage( in_questKind, G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQSubInfoPath(i) );
                        }
                        changeImageFlag = true;
                    }
                }
            }

            clearCount = questPacketInfo.QUEST_CLEARCNT; // 서버에서 완료한 퀘스트 갯수를 보내주는것으로 변경되었다.
            
            startGaugeAni( clearCount );
        }
        refreshNewInfo( subInfo );


        // quest desc
        var buttonInfoText = G.dataManager.getSocialQuestDataText( socialQuestData.SEQ ).TEXT.replace(/MYID/g, G.dataManager.getUsrMgr(DEF_IDENTITY_ME).nickname);
        
        var focusIcon = GUI.CreateImage( "focusIcon", px(-230), px(350), px(69), px(69), SOCIAL_QUEST_UI_NEW+"s_notice_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(focusIcon);

        var focusButton = GUI.CreateButton( "focusButton", px(50), px(350), px(466), px(96), SOCIAL_QUEST_UI_NEW+"s_tb_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(focusButton);
        focusButton.isHitTestVisible = false;

        // text attach to button
        focusButton.addControl( GUI.CreateAutoLineFeedText( px(30), px(0), px(450), px(90), buttonInfoText, "Black", GUI.FontSize.SMALL, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE ) );
        
        // close button
        var closeButton = GUI.CreateButton( "closeButton", px(300), px(-470), px(97), px(96), AIUI_PATH+"Ai_window/A_x_btn_idle.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapMain.addControl(closeButton);
        closeButton.onPointerUpObservable.add( function()
        {
            self.closePopup(1);
        });

        
        // topButtonTab
        self.createTopButtonBackground( this.wrapMain, in_questKind ,-357 );

        FPopup.openAnimation( this.wrapMain );
        G.soundManager.playPopupOpenSound();
    };


    FSocialQuest.prototype.updateSNSQuestSubCB = function(res, self) 
    {
        protocol.res_updateSNSQuestSub(res);

        self[1]();
    }


    FSocialQuest.prototype.resetSNSQuestSubCB = function(res, self) {
        protocol.res_resetSNSQuestSub(res);

        self[1]();
    }

    FSocialQuest.prototype.updateSNSQuestCB = function(res, self) {
        protocol.res_updateSNSQuest(res);
        
        self[1]();
    }

    FSocialQuest.prototype.run = function()
    {
        var self = this;

    };

    return FSocialQuest;
    
}());