'use strict'

var AIUI_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "16_interaction/"

// 설문 데이터 팩
var SURVEY_DATA = 
{   
    /* 설문지 진행상태 */
    SURVEY_STATE :
    {
        UNDEFINED   : -1,
        NEW         : 0,
        PROGRESSING : 1,
        MATCHING    : 2,
        MATCHED     : 3,
        GOTREWARD   : 4,
        GAVESCORE   : 5,
    },

    /* 질문 성향 (음식..연애 등등) */
    QUESTION_TENDENCY :
    {
        UNDEF   : 0,
        LOVE    : 1,
        MOVIE   : 2,
        FOOD    : 3,
        FASHION : 4,
    },
    QUESTION_TENDENCY_STR : ["오류", "연애", "영화", "음식", "패션"],
    QUESTION_TENDENCY_STR_TOKOR : 
    {
        "none" : "오류",
        "love" : "연애",
        "movie" : "영화",
        "food" : "음식",
        "fashion" : "패션",
    },

    /* 질문  타입 (진행용, 완료용 등등) */
    QUESTION_TYPE :
    {
        PASS    : 1,
        SELECT  : 2,
        LAST    : 3,

        RESULT  : 4,
        END     : 5,
        REWARD  : 6,

        WAIT    : 7,
    },

    /* 보고있는 리스트 타입 */
    VIEW_TYPE :
    {
        PREVIEW     : 0,
        DETAIL      : 1,
        HIGHSCORE   : 2
    },
    
    /* 관심회원 타입 */
    HIGHSCORE_TYPE :
    {
        BOTH : 0,
        GET  : 1,
        GIVE : 2,
    },
    
    /* UI 소팅용 타입 */
    UISORT_TYPE :
    {
        SURVEY : 0,
        QUEST  : 1,
        MATCHING : 2
    },


    LIST_PREVIEW_DATA : (function ()
    {
        /**
         * @description 설문 미리보기용 데이터
         */
        function LIST_PREVIEW_DATA()
        {            
            this.ICON = undefined;
            this.ID = undefined;
            this.TIME = undefined;

            this.SEQ = undefined;
            this.FILENAME = undefined;
            this.STATE = SURVEY_DATA.SURVEY_STATE.UNDEFINED;

            this.PREVQUESTION = undefined;
            this.PREVTEXT = undefined;

            this.LIMITTIME = undefined;

            this.TABLEDATA = undefined;
            this.DETAILINFO = undefined;
        }

        return LIST_PREVIEW_DATA;
    }()),

    LIST_DETAIL_DATA : (function ()
    {
        /**
         * @description 설문 상세 데이터
         */
        function LIST_DETAIL_DATA()
        {
            this.SEQ = undefined;
            this.STATE = SURVEY_DATA.SURVEY_STATE.UNDEFINED;

            this.ANSWERLIST = [];
            this.MATCHINGINFO = undefined;
        }

        return LIST_DETAIL_DATA;
    }()),

    MATCHING_USER_DETAIL_INFO : (function ()
    {
        /**
         * @description 매칭상대
         */
        function MATCHING_USER_DETAIL_INFO()
        {
            this.SEQ = undefined;
            this.PK = undefined;
            this.ID = undefined;

            this.SELECTREWARD = undefined;
            
            this.MYSCORE = undefined;   // 해당 매칭상대가 나한테 준 점수
            this.SCORE = undefined;     // 해당 매칭상대가 나한테 받은점수
            
            this.SURVEYSEQ = undefined;

            this.IMGURL = undefined;
            this.POSTPREV = [];
            this.POSTSEQ = undefined;
            
            this.LIMITTIME = undefined;
        }

        return MATCHING_USER_DETAIL_INFO;
    }()),
}

var QUEST_DATA = 
{
    QEUST_STATE :
    {
        UNDEF       : 0,
        PROGRESS    : 1,
        COMPLETE    : 2,
        GOTREWARD   : 3
    },

    QUEST_TYPE :
    {
        UNDEF       : 0,
        VISIT_SPOT  : 1,
        VISIT_FRIEND: 2,
        INSTALL     : 3,
    },

    TODAY_QUEST : (function()
    {
        function TODAY_QUEST()
        {
            this.INDEX = undefined;
            this.STATE = QUEST_DATA.QEUST_STATE.UNDEF;

            this.COUNT = undefined;
            this.LIMITTIME = undefined;

            this.TABLEDATA = undefined;
        }

        return TODAY_QUEST;
    }())
}

var FButlerAIManager = (function()
{
    function FButlerAIManager()
    {
        this.butlerMesh = null;

        this.butlerAlretType = 
        {
            ALERT   : 0,
            SURVEY  : 1,
            EVENT   : 2,
            SCHEDULE: 3,
            TODO    : 4,
            MAX     : 5,
        }

        //
        // ui
        //
        this.butlerAlretUI =
        {
            wrapper : null,
            ui : [ null, null, null, null, null ],
        }    
        
        this.surveyUI = 
        {
            wrapper : null,

            bg              : null,
            titleText       : null,
            closeBtn        : null,
            interestListBtn : null,
            giftSymbol      : null,
            backBtn         : null,

            listView : null,
            listBar  : null,

            detailView : null,
            detailBar  : null,

            highScoreView : null,
            highScoreBar  : null,

            subScrollView : null,
        }
        

        //
        // data
        //
        this.currentSelectSurveyPrevData = null;
        this.currentSelectSurveyTableData = null;
        this.currentSelectSurveyQuestionIndex = null;
        this.currentSelectMatchingInfo = null;

        this.surveyPrevDataList = [];
        this.matchingInfoDataList = [];

        // for test dummydata
        this.testQuestTableData = [];
        this.todayQuestDataList = [];

        // ui order
        this.uiorder = 
        {
            survey : [],
            
        }

        // init func
        this.init();        
    }

    // 생성자 초기화
    FButlerAIManager.prototype.init = function()
    {     
        G.runnableMgr.add(this);

        this.initSurveyUI();
        this.initTestQuestTableData();
    }

    // 집사 메쉬선택하기
    FButlerAIManager.prototype.setButlerMesh = function( in_mesh )
    {

    }

    // 집사 머리위 UI 초기화
    FButlerAIManager.prototype.initButlerAlertUI = function()
    {

    }    

    // 집사 설문 UI 초기화
    FButlerAIManager.prototype.initSurveyUI = function()
    {
        var self = this;

        this.surveyUI.wrapper = FPopup.createPopupWrapper( "black", 0.75 );// GUI.createContainer();
        this.surveyUI.wrapper.isPointerBlocker = true;
        
        var BG = GUI.CreateImage( "surveyUI_wrapper", px(0), px(0), px(686), px(1019), AIUI_PATH+"Ai_window/A_notice_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.surveyUI.wrapper.addControl( BG );
        this.surveyUI.bg = BG;

        this.surveyUI.titleText = GUI.CreateText( px(0), px(-470), "로드 중", "Black", GUI.FontSize.VBIG, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.surveyUI.wrapper.addControl( this.surveyUI.titleText );

        var interestListBtn = GUI.CreateButton( "surveyUI_interListBtn", px(-180), px(570), px(268), px(83), AIUI_PATH+"Ai_window/A_heart_btn_idle.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.surveyUI.wrapper.addControl( interestListBtn );
        this.surveyUI.interestListBtn = interestListBtn;
        this.surveyUI.interestListBtn.onPointerUpObservable.add( function()
        {
            self.onClickHighScoreMatchingButton();
        });

        this.surveyUI.backBtn = GUI.CreateButton( "surveyUI_tempBackBtn", px(180), px(570), px(268), px(83), AIUI_PATH+"Ai_window/A_back_btn_idle.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.surveyUI.wrapper.addControl( this.surveyUI.backBtn );
        this.surveyUI.backBtn.addControl( GUI.CreateText( px(35), px(0), "처음으로", "Black", 27, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
        this.surveyUI.backBtn.onPointerUpObservable.add( function()
        {
            self.requestMatchingInfoTodayQuestList();
        } );

        var giftSymbol = GUI.CreateButton( "serveyUI_giftSymbol", px(230), px(-400), px(82), px(49), AIUI_PATH+"Ai_window/btn_gift.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.surveyUI.wrapper.addControl( giftSymbol );
        this.surveyUI.giftSymbol = giftSymbol;        

        var closeButton = GUI.CreateButton( "surveyUI_closeBtn", px(300), px(-500), px(97), px(96), AIUI_PATH+"Ai_window/A_x_btn_idle.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.surveyUI.wrapper.addControl( closeButton );
        this.surveyUI.closeBtn = closeButton;
        this.surveyUI.closeBtn.onPointerUpObservable.add( function()
        {
            self.hideSurveyUI();
        } );

        var scrollBtn = AIUI_PATH+"Ai_window/scroll_bar.png";
        var scrollBG = AIUI_PATH+"Ai_window/scroll_bg.png";

        this.surveyUI.listView = new GUI.createScrollView( this.surveyUI.wrapper, "listView", px(-12), px(60), px(650), px(850), 1.1, true, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.surveyUI.listBar = new GUI.createScrollBar( this.surveyUI.listView, "listBar",  scrollBtn, scrollBG, 
            px(300), px(60), px(17), px(800), px(17), px(85), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.surveyUI.listView.linkScrollBar( this.surveyUI.listBar );
        
        
        this.surveyUI.detailView = new GUI.createScrollView( this.surveyUI.wrapper, "detailView", px(-12), px(60), px(650), px(850), 1.1, true, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.surveyUI.detailBar = new GUI.createScrollBar( this.surveyUI.detailView, "detailBar",  scrollBtn, scrollBG, 
            px(300), px(60), px(17), px(800), px(17), px(85), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.surveyUI.detailView.linkScrollBar( this.surveyUI.detailBar );

        this.surveyUI.highScoreView = new GUI.createScrollView( this.surveyUI.wrapper, "highScoreView", px(-12), px(60), px(650), px(850), 1.1, true, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.surveyUI.highScoreBar = new GUI.createScrollBar( this.surveyUI.highScoreView, "highScoreBar",  scrollBtn, scrollBG, 
            px(300), px(60), px(17), px(800), px(17), px(85), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.surveyUI.highScoreView.linkScrollBar( this.surveyUI.highScoreBar );

        this.setViewType( SURVEY_DATA.VIEW_TYPE.PREVIEW );
    }

    FButlerAIManager.prototype.showSurveyUI = function()
    {   
        this.hideSurveyUI(); 

        G.guiMain.addControl( this.surveyUI.wrapper, GUI.LAYER.POPUP );
        FPopup.openAnimation( this.surveyUI.wrapper );
        
        this.setViewType( SURVEY_DATA.VIEW_TYPE.PREVIEW );

        this.requestMatchingInfoTodayQuestList();
    }

    FButlerAIManager.prototype.requestMatchingInfoTodayQuestList = function()
    {
        var self = this;

        var json = protocol.getAllInteractionList();
        ws.onRequest( json, function(in_res, in_self)
        {
            protocol.res_getAllInteractionList( in_res );

            self.requsetSurveyPrevList();
        }, this);
    }

    FButlerAIManager.prototype.requsetSurveyPrevList = function()
    {
        var self = this;        

        var json = protocol.getSurveyList();
        ws.onRequest( json, function(in_res, in_self)
        {
            self.surveyUI.listView.clearItem();            
            self.setViewType( SURVEY_DATA.VIEW_TYPE.PREVIEW );
            protocol.res_getSurveyList(in_res);

            self.checkAndroidAlert();
        }, this);
    }

    FButlerAIManager.prototype.hideSurveyUI = function()
    {
        G.guiMain.removeControl( this.surveyUI.wrapper );
    }

    /**
     * @description 어떤 리스트를 보여줄것인지 세팅한다.
     * @param {SURVEY_DATA.VIEW_TYPE} in_viewType   // 뷰타입
     * @param {String} in_titleText                 // 타이틀에 보일 텍스트. undefined 이면 기본설정 텍스트가 보인다.
     */
    FButlerAIManager.prototype.setViewType = function( in_viewType, in_titleText )
    {
        this.showListView(false);
        this.showDetailView(false);
        this.showHighScoreView(false);

        switch( in_viewType )
        {
        case SURVEY_DATA.VIEW_TYPE.PREVIEW :
            {
                this.showListView( true );
                this.surveyUI.backBtn.isVisible = false;
                this.surveyUI.backBtn.left = px(0);
                this.surveyUI.interestListBtn.isVisible = true;
                this.surveyUI.interestListBtn.left = px(0);
                this.surveyUI.titleText.text = "대화 리스트";
            }
            break;

        case SURVEY_DATA.VIEW_TYPE.DETAIL :
            {
                this.showDetailView( true );
                this.surveyUI.backBtn.isVisible = true;
                this.surveyUI.backBtn.left = px(0);
                this.surveyUI.interestListBtn.isVisible = false;
                this.surveyUI.interestListBtn.left = px(-180);
                this.surveyUI.titleText.text = "집사와 대화";
            }
            break;

        case SURVEY_DATA.VIEW_TYPE.HIGHSCORE :
            {
                this.showHighScoreView( true );
                this.surveyUI.backBtn.isVisible = true;
                this.surveyUI.backBtn.left = px(0);
                this.surveyUI.interestListBtn.isVisible = false;
                this.surveyUI.interestListBtn.left = px(-180);
                this.surveyUI.titleText.text = "관심회원 리스트";
            }
            break;
        }

        if ( in_titleText != undefined )
            this.surveyUI.titleText.text = in_titleText;
    }

    FButlerAIManager.prototype.showListView = function( in_show )
    {
        if ( in_show )
        {
            this.surveyUI.listView.linkScrollBar( this.surveyUI.listBar );
            this.surveyUI.wrapper.addControl( this.surveyUI.listView.mainPanel );
        }
        else
        {
            this.surveyUI.listView.unlinkScrollBar();
            this.surveyUI.wrapper.removeControl( this.surveyUI.listView.mainPanel );
        }
    }

    FButlerAIManager.prototype.showDetailView = function( in_show )
    {
        if ( in_show )
        {
            this.surveyUI.detailView.linkScrollBar( this.surveyUI.detailBar );
            this.surveyUI.wrapper.addControl( this.surveyUI.detailView.mainPanel );    
        }
        else
        {
            this.surveyUI.detailView.unlinkScrollBar();
            this.surveyUI.wrapper.removeControl( this.surveyUI.detailView.mainPanel );    
        }

    }

    FButlerAIManager.prototype.showHighScoreView = function( in_show )
    {
        if ( in_show )
        {
            this.surveyUI.highScoreView.linkScrollBar( this.surveyUI.highScoreBar );
            this.surveyUI.wrapper.addControl( this.surveyUI.highScoreView.mainPanel );    
        }
        else
        {
            this.surveyUI.highScoreView.unlinkScrollBar();
            this.surveyUI.wrapper.removeControl( this.surveyUI.highScoreView.mainPanel );   
        }
    }

    // #으로 구분하는 이미지답변 파싱용
    FButlerAIManager.prototype.parsePictureStr = function( in_string )
    {        
        var arSplitUrl   = in_string.split("#");
        var nArLength     = arSplitUrl.length;
    
        var arFileName         = arSplitUrl[nArLength-1];   
        var path = "";
        for ( var i = 0; i < nArLength-1; ++i)
        {
            path+=arSplitUrl[i];
        }
    
        var result = { text:path, picture:arFileName };
        return result;
    }

    // 파일명 파싱용
    FButlerAIManager.prototype.parseSurveyFileName = function( in_fileName )
    {
        var arSplitUrl   = in_fileName.split("_"); 
    
        var result = { date:arSplitUrl[0], count:arSplitUrl[1], tendency:arSplitUrl[2], hour:arSplitUrl[3].substr(0,2), minite:arSplitUrl[3].substr(2,2) };
        return result;
    }

    // 각 설문 미리보기 UI 만들기
    FButlerAIManager.prototype.createSurveyListItemUI = function( in_surveyPrevData )
    {
        var self = this;

        var surveyPreviewListUI = GUI.CreateButton( "serveyPreviewListUI", px(0), px(0), px(562), px(147), AIUI_PATH+"Ai_window/A_text_btn_idle.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );

        var icon = GUI.CreateCircleButton( "icon", px(-220), px(0), px(145), px(145), in_surveyPrevData.ICON, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );

        surveyPreviewListUI.addControl( icon );

        var name = GUI.CreateText( px(190), px(-45), in_surveyPrevData.ID, "Black", GUI.FontSize.VBIG, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        surveyPreviewListUI.addControl( name );

        var time = GUI.CreateText( px(-40), px(70), in_surveyPrevData.TIME, "Gray", GUI.FontSize.SMALL, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        surveyPreviewListUI.addControl( time );

        var text = GUI.CreateAutoLineFeedText( px(70), px(20), px(380), px(130), in_surveyPrevData.PREVTEXT, "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        surveyPreviewListUI.addControl( text );

        // 새로 시작된 설문이거나 매치가 되었는데 아직 점수를 안줬을경우 뜬다
        if ( in_surveyPrevData.STATE == SURVEY_DATA.SURVEY_STATE.NEW || in_surveyPrevData.STATE == SURVEY_DATA.SURVEY_STATE.MATCHED )
        {
            var alert = this.getCreateAlertIcon( "!", px(-260), px(-45), px(40), px(40), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            surveyPreviewListUI.addControl( alert );

            GUI.changeButtonImage( surveyPreviewListUI, AIUI_PATH+"Ai_window/A_text1_btn_idle.png" );
        }

        // 미리보기 리스트를 누르면 해당 설문의 상세페이지 뷰로 넘어간다.
        surveyPreviewListUI.onPointerUpObservable.add( function()
        {
            if ( self.surveyUI.listView.blockTouchForScrolling )
                return;

            self.onClickSurveyRequestDetailInfo( in_surveyPrevData );
            
        });
        
        this.surveyUI.listView.addItem( surveyPreviewListUI );

        return surveyPreviewListUI;
    }

    // 설문 상세보기 UI 구성하기 (일반적으로 미리보기 UI 눌렀을떄 사용)
    FButlerAIManager.prototype.onClickSurveyRequestDetailInfo = function( in_surveyPrevData )
    {
        var self = this;
        
        var json = protocol.getSurveyDetail( in_surveyPrevData.SEQ );
        ws.onRequest( json, function(in_res, in_self)
        {
            self.setViewType( SURVEY_DATA.VIEW_TYPE.DETAIL );
            self.surveyUI.detailView.clearItem();

            self.surveyUI.detailView.clearItem();
            protocol.res_getSurveyDetail( in_res );
                
            self.currentSelectSurveyPrevData = in_surveyPrevData;
            self.currentSelectSurveyTableData = in_surveyPrevData.TABLEDATA;
            self.currentSelectSurveyQuestionIndex = in_surveyPrevData.TABLEDATA[0].index;
            self.currentSelectMatchingInfo = in_surveyPrevData.DETAILINFO.MATCHINGINFO;

            self.makeUIfromSurveyDetailInfo( self.getSurveyDetailData( in_surveyPrevData.SEQ ) );
        }, self );
    }

    // 설문 상세정보를 받아서 설문 UI 구성하기
    FButlerAIManager.prototype.makeUIfromSurveyDetailInfo = function( in_surveyDetailInfo )
    {
        var self = this;

        switch( in_surveyDetailInfo.STATE )
        {
        case SURVEY_DATA.SURVEY_STATE.NEW :
            {
                self.addQuestionAnswerUI( self.currentSelectSurveyPrevData.TABLEDATA[0] );
            }
            break;

        case SURVEY_DATA.SURVEY_STATE.PROGRESSING :
        case SURVEY_DATA.SURVEY_STATE.MATCHING     :
        case SURVEY_DATA.SURVEY_STATE.MATCHED     :
        case SURVEY_DATA.SURVEY_STATE.GOTREWARD   :
        case SURVEY_DATA.SURVEY_STATE.GAVESCORE   :
            {
                // 답변했던 질문들 UI 에 추가해주고
                for ( var i = 0; i < in_surveyDetailInfo.ANSWERLIST.length; ++i )
                {
                    var questionData = self.getQuestionDataFromTable( self.currentSelectSurveyTableData, in_surveyDetailInfo.ANSWERLIST[i].question );
                    self.addQuestionAnswerUI( questionData, in_surveyDetailInfo.ANSWERLIST[i].answer );

                    // 마지막 저장된 질문이고 링크된 다음 질문이 있을때 다음질문 까지 UI에 추가해준다.
                    if ( i == in_surveyDetailInfo.ANSWERLIST.length-1 )
                    {
                        var lastAnswerLinkIndex = questionData[ "answer" + in_surveyDetailInfo.ANSWERLIST[i].answer + "_link" ];                        
                        if ( (questionData.type != SURVEY_DATA.QUESTION_TYPE.LAST) && ((lastAnswerLinkIndex != 0) && (lastAnswerLinkIndex != null)) )
                        {
                            self.addQuestionAnswerUI( self.getQuestionDataFromTable( self.currentSelectSurveyTableData, lastAnswerLinkIndex ) );
                        }
                    }
                }

                if ( in_surveyDetailInfo.STATE >= SURVEY_DATA.SURVEY_STATE.MATCHED )
                {
                    self.createMatchingUserUI( in_surveyDetailInfo.MATCHINGINFO, in_surveyDetailInfo.MATCHINGINFO.SCORE );
                    // 매칭까지 됐다면 별점 줬는지 확인해서 UI 에 추가해준다.
                    if ( in_surveyDetailInfo.MATCHINGINFO.SCORE != 0 )
                    {
                        // 별점까지 줬다면 리워드 받았는지 확인해서 UI 에 추가해준다
                        if ( in_surveyDetailInfo.SELECTREWARD != 0 )
                        {
                            self.addQuestionAnswerUI( self.getRewardTableData( self.currentSelectSurveyTableData ), in_surveyDetailInfo.SELECTREWARD );

                            // 방문하기 해주자
                            self.addQuestionAnswerUI( self.getLastInviteTableData( self.currentSelectSurveyTableData) );
                        }
                        else
                        {
                            self.addQuestionAnswerUI( self.getRewardTableData( self.currentSelectSurveyTableData ) );
                        }
                    }                       
                }
                else if ( in_surveyDetailInfo.STATE == SURVEY_DATA.SURVEY_STATE.MATCHING ) // 마지막 질답문일때 기다리는중인지 매칭결과있는지 확인해서 UI 추가시켜주기
                {
                    self.createMatchingWaitUI();
                }
                    
                setTimeout( function(){
                    self.surveyUI.detailView.moveFocusToEnd();
                }, 300 );
            }
            break;
        }
    }

    // 선택지 파싱하고 이미지, 텍스트 구분해서 UI 만들어준다.
    FButlerAIManager.prototype.addQuestionAnswerUI = function( in_questData, in_answered )
    {
        if ( in_questData.answer1.split('#').length > 1 )
            this.createQuestPictureAnswerUI( in_questData, in_answered );
        else
            this.createQuestAnswerUI( in_questData, in_answered );
    }

    // 답변 클릭했을때 처리부. 여기서 질문타입에 대한 파싱을 해줍니다.
    FButlerAIManager.prototype.onClickAnswerButton = function( in_answerText, in_answerTextUI, in_answerButtonUI, in_currentQuestionData, in_nextQuestionData, in_answerIndex )
    {
        var self = this;

        switch( in_currentQuestionData.type )
        {
        case SURVEY_DATA.QUESTION_TYPE.PASS     :
        case SURVEY_DATA.QUESTION_TYPE.SELECT   :
        case SURVEY_DATA.QUESTION_TYPE.LAST     :
            {
                var json = protocol.surveyAnswer( self.currentSelectSurveyPrevData.SEQ, in_currentQuestionData.index, in_answerIndex );
                ws.onRequest( json, function( in_res, in_self )
                {
                    protocol.res_surveyAnswer( in_res );
                    
                    in_answerTextUI.text = in_answerText;
                    in_answerButtonUI.width = px((Math.max( in_answerText.length, 0 ) * GUI.FontSize.MIDDLE) + parseInt(in_answerButtonUI.width));
                    in_answerButtonUI.isVisible = true;
                    FPopup.openAnimation( in_answerButtonUI );

                    if ( in_nextQuestionData != undefined )
                    {   
                        self.addQuestionAnswerUI( in_nextQuestionData );
                        self.surveyUI.detailView.moveFocusToEnd();
                    }
                    else if ( in_currentQuestionData.type == SURVEY_DATA.QUESTION_TYPE.LAST )
                    {
                        self.onAnswerLastQuestion( self.currentSelectSurveyPrevData.SEQ );
                    }

                }, self );
            }
            break;

        case SURVEY_DATA.QUESTION_TYPE.REWARD :
            {
                var json = protocol.getSurveyReward( self.currentSelectSurveyPrevData.SEQ, in_answerIndex );
                ws.onRequest( json, function( in_res, in_self )
                {
                    protocol.res_getSurveyReward( in_res );
                    
                    in_answerTextUI.text = in_answerText;
                    in_answerButtonUI.width = px((Math.max( in_answerText.length, 0 ) * GUI.FontSize.MIDDLE) + parseInt(in_answerButtonUI.width));
                    in_answerButtonUI.isVisible = true;
                    FPopup.openAnimation( in_answerButtonUI );

                    self.addQuestionAnswerUI( in_nextQuestionData );
                    self.surveyUI.detailView.moveFocusToEnd();
                }, self );
            }
            break;

        case SURVEY_DATA.QUESTION_TYPE.END :
            {
                this.goMyFriend();
            }
            break;
        }        
    }


    //친구 집으로 가기
    FButlerAIManager.prototype.setFriendInfo = function ( in_friendAccountPK )
    {
        var json;
        json = protocol.getTarUserInfo( in_friendAccountPK );
        ws.onRequest( json, this.receiveFriendInfo, this );
    }

    FButlerAIManager.prototype.receiveFriendInfo = function ( in_response, in_self )
    {
        var url = PROFILE_PATH + in_response.httpUrl;

        G.dataManager.setFriendInfo(in_self.currentSelectMatchingInfo.PK, in_response.avatarCd, url);

        var name = G.sceneMgr.getCurrentSceneName();
        if(name == 'SCENE_MYROOM') {
    
            G.sceneMgr.addScene('SCENE_MYFRIENDROOM', new FSceneFriendRoom(in_response.accountPk));
            G.sceneMgr.changeScene('SCENE_MYFRIENDROOM', true);
        
        } else if(name == 'SCENE_BEACH') {
    
            G.sceneMgr.addScene('SCENE_ROOM', new FSceneRoom(false));
            G.sceneMgr.changeScene('SCENE_ROOM', true);

        } else if(name == 'SCENE_MYFRIENDROOM') {
    
            G.sceneMgr.addScene('SCENE_MYFRIENDROOM', new FSceneFriendRoom(in_response.accountPk));
            G.sceneMgr.changeScene('SCENE_MYFRIENDROOM', true);
        
        }
    }


    FButlerAIManager.prototype.goMyFriend = function() {

        // this.clearStartContents();

        var pk = this.currentSelectMatchingInfo.PK;

        this.setFriendInfo(pk);
    }

    // 마지막 질문에 답변했을때
    FButlerAIManager.prototype.onAnswerLastQuestion = function( in_surveySeq )
    {
        var self = this;

        var json = protocol.completeSurvey( in_surveySeq );
        ws.onRequest( json, function( in_res, in_self )
        {
            protocol.res_completeSurvey( in_res );

            var surveyDetailInfo = self.getSurveyDetailData( in_res.PSeq );

            if ( surveyDetailInfo.STATE == SURVEY_DATA.SURVEY_STATE.MATCHING )
            {
                self.createMatchingWaitUI();
                self.surveyUI.detailView.moveFocusToEnd();
            }
            else if ( surveyDetailInfo.STATE == SURVEY_DATA.SURVEY_STATE.MATCHED )
            {
                self.createMatchingUserUI( surveyDetailInfo.MATCHINGINFO );
                self.surveyUI.detailView.moveFocusToEnd();
            }

        }, this );
    }

    // 매칭 상대에게 별점 주었을때
    FButlerAIManager.prototype.onGiveScoreToMatching = function( in_surveySeq, in_score )
    {
        var self = this;

        var json = protocol.evaluationMatching( in_surveySeq, in_score );
        ws.onRequest( json, function( in_res, in_self )
        {
            protocol.res_evaluationMatching( in_res );

            self.createQuestAnswerUI( self.getRewardTableData( self.currentSelectSurveyTableData ) );

            self.surveyUI.detailView.moveFocusToEnd();
        }, this );
    }

    // 보상 질문 데이터 테이블에서 가져오기
    FButlerAIManager.prototype.getRewardTableData = function( in_tableData )
    {
        for ( var i = 0; i < in_tableData.length; ++i )
        {
            if ( in_tableData[i].type == SURVEY_DATA.QUESTION_TYPE.REWARD )
                return in_tableData[i];
        }

        return undefined;
    }

    // 매칭완료 후 점수 질문데이터 테이블에서 가져오기
    FButlerAIManager.prototype.getMatchingGiveScoreTableData = function( in_tableData )
    {
        for ( var i = 0; i < in_tableData.length; ++i )
        {
            if ( in_tableData[i].type == SURVEY_DATA.QUESTION_TYPE.RESULT )
                return in_tableData[i];
        }

        return undefined;
    }

    // 완료용 테이블데이터 가져오기
    FButlerAIManager.prototype.getLastInviteTableData = function( in_tableData )
    {
        for ( var i = 0; i < in_tableData.length; ++i )
        {
            if ( in_tableData[i].type == SURVEY_DATA.QUESTION_TYPE.END )
                return in_tableData[i];
        }

        return undefined;
    }

    // 매칭된 상대 UI 만들기
    FButlerAIManager.prototype.createMatchingUserUI = function( in_matchingInfo, in_gaveScore )
    {
        if ( in_gaveScore == undefined )
            in_gaveScore = 0;

        var self = this;

        var answerOffset = 0;
        
        var wrapper = GUI.createContainer();
        wrapper.width = GUI.getResolutionCorrection( px( 620 ) );
        wrapper.height = GUI.getResolutionCorrection( px( 230 ) );
        
        // 점선
        var lineImg = GUI.CreateImage( "line", px(0), px(0), px(620), px(2), AIUI_PATH+"Ai_window/ai_line.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        wrapper.addControl( lineImg );


        // 스타콘텐츠 스크롤 영역
        var scrollView = new GUI.createScrollView( wrapper, "listView", px(0), px(0), px(620), px(220), 1.1, false, GUI.ALIGN_LEFT, GUI.ALIGN_TOP );

        var createPostImg = function( in_imgURL )
        {
            var postWrapper = GUI.CreateButton( "postWrapper", px(0), px(0), px(210), px(197), AIUI_PATH+"Ai_window/A_guest_bg.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
            var postImg = GUI.CreateImage( "postImg", px(0), px(8), px(209), px(196), in_imgURL, GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
            //postWrapper.addControl( GUI.CreateText( px(0), px(-8), "자세히 보기", "Black", 18, GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM ) );
            postWrapper.addControl( postImg );

            postWrapper.addControl( GUI.CreateImage( "magnifier", px(-15), px(-15), px(40), px(40), AIUI_PATH+"Ai_window/A_view_btn.png", GUI.ALIGN_RIGHT, GUI.ALIGN_BOTTOM ) );

            postWrapper.onPointerUpObservable.add( function ()
            {
                if ( self.surveyUI.subScrollView.blockTouchForScrolling )
                    return;

                // 포스트 눌렀을떄
                if ( in_matchingInfo.POSTSEQ == 0 )
                {
                    snsCommonFunc.openMypage(in_matchingInfo.PK);
                }
                else
                {
                    snsCommonFunc.openStarContents(in_matchingInfo.POSTSEQ);
                }
            });
            
            scrollView.addItem( postWrapper );
        }
        for ( var i = 0; i < 3; ++i )
        {
            if ( in_matchingInfo.POSTPREV[i] == "" )
                break;

            var imgURL = /*in_matchingInfo.IMGURL + */in_matchingInfo.POSTPREV[i]; // 서버에서 풀패스 주는걸로 변경
            createPostImg( imgURL );
        }
        this.surveyUI.subScrollView = scrollView;
        answerOffset += 200 + 30;
        

        // 아이콘        
        var icon = GUI.CreateImage( "icon", px(0), px(answerOffset), px(121), px(121), AIUI_PATH+"Ai_window/A_ai1_icon.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        wrapper.addControl( icon );

        // 묻기 말풍선
        var matchingQuestion = this.getMatchingGiveScoreTableData( self.currentSelectSurveyTableData );

        var iconOffset = 150;
        var questionBG = GUI.CreateButton( "questionBG", px(iconOffset), px(answerOffset), px(432), px(132), AIUI_PATH+"Ai_window/A_word0_bg.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        questionBG.isHitTestVisible = false;
        questionBG.addControl( GUI.CreateAutoLineFeedText( px(0), px(0), px(400), px(120), matchingQuestion.text, "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
        wrapper.addControl( questionBG );
        answerOffset += (121 + 50);
        wrapper.height = px( parseInt( wrapper.height ) + GUI.getResolutionCorrection( 120, false) );

        // 별 선택지
        var starUIList = [];
        
        var starSelectEffect = function( in_selectStar )
        {
            for ( var j = 0; j < starUIList.length; ++j )
            {
                starUIList[j].isHitTestVisible = false;
                if ( (j+1) != in_selectStar )
                    starUIList[j].alpha = 0.3;
            }
        }

        var createStarUI = function(i)
        {
            var starUI = GUI.CreateButton( "star"+(i+1), px(25 + ((i-1)*110)), px(answerOffset), px(99), px(53), AIUI_PATH+"Ai_window/A_star"+i+"_btn.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
            starUIList.push( starUI );
            starUI.onPointerUpObservable.add( function()
            {
                if ( self.surveyUI.detailView.blockTouchForScrolling )
                    return;

                starSelectEffect(i);

                if ( in_matchingInfo.MYSCORE > 0 ) // 상대방이 내한테 점수를 줬을경우, 추천회원 리스트에서 클릭한걸로 본다.
                {
                    self.onGiveScoreToHighScoreMatching( in_matchingInfo.SEQ, i );
                }
                else
                {
                    self.onGiveScoreToMatching( in_matchingInfo.SURVEYSEQ, i );
                }
            });

            wrapper.addControl( starUI );
        }
        for ( var i = 1; i <= 5; ++i )
        {
            createStarUI(i);
        }
        wrapper.height = px( parseInt( wrapper.height ) + GUI.getResolutionCorrection( 70, false) );

        if ( 0 != in_gaveScore )
        {
            starSelectEffect( in_gaveScore );
        }

        this.surveyUI.detailView.addItem( wrapper );
    }

    // 대기중 질문데이터 테이블에서 가져오기
    FButlerAIManager.prototype.getWaitTableData = function( in_tableData )
    {
        for ( var i = 0; i < in_tableData.length; ++i )
        {
            if ( in_tableData[i].type == SURVEY_DATA.QUESTION_TYPE.WAIT )
                return in_tableData[i];
        }

        return undefined;
    }

    FButlerAIManager.prototype.touchBlockUI = function( in_ui )
    {
        for ( var i = 0; i < in_ui.children.length; ++i )
        {
            in_ui.children[i].isHitTestVisible = false;
        }
    }

    // 매칭 대기중이라는 UI 만들기
    FButlerAIManager.prototype.createMatchingWaitUI = function()
    {
        var self = this;
        
        var wrapper = GUI.createContainer();
        wrapper.width = GUI.getResolutionCorrection( px( 620 ) );
        wrapper.height = GUI.getResolutionCorrection( px( 130 ) );
        

        // 점선
        var lineImg = GUI.CreateImage( "line", px(0), px(0), px(620), px(2), AIUI_PATH+"Ai_window/ai_line.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        wrapper.addControl( lineImg );

        // 아이콘        
        var icon = GUI.CreateImage( "icon", px(0), px(20), px(121), px(121), AIUI_PATH+"Ai_window/A_ai1_icon.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        wrapper.addControl( icon );

        // 묻기 말풍선
        var waitQuestion = this.getWaitTableData( self.currentSelectSurveyTableData );

        var iconOffset = 150;
        var questionBG = GUI.CreateButton( "questionBG", px(iconOffset), px(10), px(432), px(132), AIUI_PATH+"Ai_window/A_word0_bg.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        questionBG.isHitTestVisible = false;
        questionBG.addControl( GUI.CreateAutoLineFeedText( px(0), px(0), px(400), px(120), waitQuestion.text, "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
        wrapper.addControl( questionBG );
        
        this.surveyUI.detailView.addItem( wrapper );
    }

    // 질문-답변 UI 하나 만들기 ( 리스트 UI 에 넣는다)
    /**
     * 
     * @param {*} in_questionData             // UI 만들 질문 데이터
     * @param {Number} in_answered            // 선택했던 답변이 있다면 그 답변을 ui에 추가시켜주고 선택을 막는다.
     */
    FButlerAIManager.prototype.createQuestAnswerUI = function( in_questionData, in_answered /*없으면 undefined*/ )
    {
        var self = this;
        
        var wrapper = GUI.createContainer();
        wrapper.width = GUI.getResolutionCorrection( px( 620 ) );
        wrapper.height = GUI.getResolutionCorrection( px( 130 ) );

        // 점선
        var lineImg = GUI.CreateImage( "line", px(0), px(0), px(620), px(2), AIUI_PATH+"Ai_window/ai_line.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        wrapper.addControl( lineImg );

        // 아이콘        
        var icon = GUI.CreateImage( "icon", px(0), px(20), px(121), px(121), AIUI_PATH+"Ai_window/A_ai1_icon.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        wrapper.addControl( icon );

        // 묻기 말풍선
        var iconOffset = 150;
        var questionBG = GUI.CreateButton( "questionBG", px(iconOffset), px(20), px(432), px(132), AIUI_PATH+"Ai_window/A_word1_bg.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        questionBG.isHitTestVisible = false;
        questionBG.addControl( GUI.CreateAutoLineFeedText( px(10), px(0), px(400), px(120), in_questionData.text, "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
        wrapper.addControl( questionBG );


        var answerOffset = parseInt( 121 + 25 );

        var createAnswerButton = function( i )
        {
            var resultIsLastButton = false;

            var indexName = "answer"+i.toString();
            var nextIndexName = "answer"+(i+1).toString();

            var answerButton = null;
            var nextQuestionData = self.getQuestionDataFromTable( self.currentSelectSurveyTableData, in_questionData["answer"+i+"_link"] );
            

            // 마지막 선택지임
            if ( (in_questionData[nextIndexName] == 0) || (in_questionData[nextIndexName] == null) )
            {
                answerButton = GUI.CreateButton( indexName, px(iconOffset+25), px(answerOffset), px(408), px(86), AIUI_PATH+"Ai_window/A_word3_bg.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
                answerButton.addControl( GUI.CreateText( px(0), px(0), in_questionData[indexName], "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
                answerOffset += parseInt( 86 );

                wrapper.addControl( answerButton );
                wrapper.height = px(parseInt( wrapper.height ) + parseInt( answerButton.height ));
                
                resultIsLastButton = true;
            }
            else // 중간선택지임
            {                
                answerButton = GUI.CreateButton( indexName, px(iconOffset+25), px(answerOffset), px(408), px(90), AIUI_PATH+"Ai_window/A_word2_bg.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
                answerButton.addControl( GUI.CreateText( px(0), px(0), in_questionData[indexName], "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
                answerOffset += parseInt( 90 );

                wrapper.addControl( answerButton );
                wrapper.height = px(parseInt( wrapper.height ) + parseInt( answerButton.height ));
            }

            // 선택지 눌렀을떄
            answerButton.onPointerUpObservable.add( function()
            {
                if ( self.surveyUI.detailView.blockTouchForScrolling )
                    return;

                self.onClickAnswerButton( in_questionData[indexName], answerText, answerBG, in_questionData, nextQuestionData, i );
                self.touchBlockUI( wrapper );
            });

            return resultIsLastButton;
        }

        // 선택지
        for ( var i = 1; i < 4; ++i )
        {
            if ( createAnswerButton( i ) )
                break;
        }

        // 답변 말풍선
        var answerBG = GUI.CreateButton( "answerBG", px(-30), px(answerOffset+10), px(172), px(80), AIUI_PATH+"Ai_window/A_answer_bg.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        var answerText = GUI.CreateText( px(0), px(0), "원하는 답 선택", "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );

        if ( undefined == in_answered )
        {
            answerBG.isVisible = false;
        }
        else
        {
            answerText.text = in_questionData[ "answer"+in_answered ];
            answerBG.width = px(GUI.getResolutionCorrection(Math.max( answerText.text.length, 0 ) * GUI.getResolutionCorrection(GUI.FontSize.MIDDLE,false), false) + parseInt(answerText.width));
            self.touchBlockUI( wrapper );
        }

        answerBG.addControl( answerText );
        wrapper.addControl( answerBG );
        wrapper.height = px(parseInt( wrapper.height ) + parseInt( answerBG.height ) + GUI.getResolutionCorrection(10,false) );

        this.surveyUI.detailView.addItem( wrapper );
    }

    // 질문-사진답변 UI 하나 만들기 ( 리스트 UI 에 넣는다 )
    FButlerAIManager.prototype.createQuestPictureAnswerUI = function( in_questionData, in_answered )
    {
        var self = this;
        
        var wrapper = GUI.createContainer();
        wrapper.width = GUI.getResolutionCorrection( px( 620 ) );
        wrapper.height = GUI.getResolutionCorrection( px( 130 ) );
        
        // 점선
        var lineImg = GUI.CreateImage( "line", px(0), px(0), px(620), px(2), AIUI_PATH+"Ai_window/ai_line.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        wrapper.addControl( lineImg );

        // 아이콘        
        var icon = GUI.CreateImage( "icon", px(0), px(20), px(121), px(121), AIUI_PATH+"Ai_window/A_ai1_icon.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        wrapper.addControl( icon );

        // 묻기 말풍선
        var iconOffset = 150;
        var questionBG = GUI.CreateButton( "questionBG", px(iconOffset), px(20), px(432), px(132), AIUI_PATH+"Ai_window/A_word0_bg.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        questionBG.isHitTestVisible = false;
        questionBG.addControl( GUI.CreateAutoLineFeedText( px(10), px(0), px(400), px(120), in_questionData.text, "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
        wrapper.addControl( questionBG );


        var answerOffset = parseInt( 121 + 25 );

        var createImgAnswerButton = function( i )
        {
            var indexName = "answer"+i.toString();
            var parsedStr = self.parsePictureStr( in_questionData[indexName] );
            var nextQuestionData = self.getQuestionDataFromTable( self.currentSelectSurveyTableData, in_questionData["answer"+i+"_link"] );

            var pictureOutLine = GUI.CreateButton( "pictureOutLine", px(30+((i-1)*280)), px(answerOffset+20), px(264), px(316), AIUI_PATH+"Ai_window/A_movie_bg.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
            pictureOutLine.addControl( GUI.CreateText( px(0), px(-8), parsedStr.text, "Black", 16, GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM ) );
            wrapper.addControl( pictureOutLine );

            var picture = GUI.CreateImage( "picture", px(0), px(15), px(230), px(260), AIUI_PATH+"picture/"+parsedStr.picture, GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
            pictureOutLine.addControl( picture );
            
            if ( 2==i )
            {                        
                answerOffset += 316 + GUI.getResolutionCorrection( 45, false );
                wrapper.height = px( parseInt( wrapper.height ) + parseInt( pictureOutLine.height ) + GUI.getResolutionCorrection( 45, false ) );
            }

            // 선택지 눌렀을떄
            pictureOutLine.onPointerUpObservable.add( function()
            {
                if ( self.surveyUI.detailView.blockTouchForScrolling )
                    return;
                    
                self.onClickAnswerButton( parsedStr.text, answerText, answerBG, in_questionData, nextQuestionData, i );
                self.touchBlockUI( wrapper );
            });
        }

        // 사진용 선택지는 최대 2개입니다
        for ( var i = 1; i <= 2; ++i )
        {
            createImgAnswerButton(i);
        }   

        // 답변 말풍선
        var answerBG = GUI.CreateButton( "answerBG", px(-30), px(answerOffset+10), px(172), px(80), AIUI_PATH+"Ai_window/A_answer_bg.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        var answerText = GUI.CreateText( px(0), px(0), "원하는 답 선택", "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        
        if ( undefined == in_answered )
        {
            answerBG.isVisible = false;
        }
        else
        {
            answerText.text = self.parsePictureStr( in_questionData[ "answer"+in_answered ] ).text;
            answerBG.width = px(GUI.getResolutionCorrection(Math.max( answerText.text.length, 0 ) * GUI.getResolutionCorrection(GUI.FontSize.MIDDLE,false), false) + parseInt(answerText.width));
            self.touchBlockUI( wrapper );
        }

        wrapper.height = px(parseInt( wrapper.height ) + parseInt( answerBG.height ));
        answerBG.addControl( answerText );
        wrapper.addControl( answerBG );

        this.surveyUI.detailView.addItem( wrapper );
    }

    // 평점 (알림, 서로평점높은 유저들확인) UI 초기화
    FButlerAIManager.prototype.initScoreUI = function()
    {

    }

    // 서로 평점높게준 유저 확인창 UI 가져오기
    FButlerAIManager.prototype.getHighScoreMatchUI = function()
    {

    }
    
    // call from runnableManager
    FButlerAIManager.prototype.run = function()
    {
        if ( this.surveyUI.listView != null )
            this.surveyUI.listView.procLoop();
            
        if ( this.surveyUI.detailView != null )
            this.surveyUI.detailView.procLoop();

        if ( this.surveyUI.subScrollView != null )
            this.surveyUI.subScrollView.procLoop();

        if ( this.surveyUI.highScoreView != null )
            this.surveyUI.highScoreView.procLoop();
    }

    // 설문 미리보기 데이터 초기화
    FButlerAIManager.prototype.initSurveyPrevList = function()
    {
        this.surveyPrevDataList = [];
    }

    // 설문 테이블데이터에서 질문인덱스로 질문하나 가져오기
    FButlerAIManager.prototype.getQuestionDataFromTable = function( in_targetTable, in_index )
    {
        for ( var i = 0; i< in_targetTable.length; ++i )
        {
            if ( in_targetTable[i].index == in_index )
                return in_targetTable[i];
        }

        return undefined;
    }

    // 설문 미리보기 데이터 추가. 있으면 알아서 업데이트한다.
    FButlerAIManager.prototype.addUpdateSurveyPrevDataList = function( in_surveyPrevData )
    {
        var self = this;

        var searchData = this.getSurveyPrevData( in_surveyPrevData.SEQ );

        var fileNameParsed = this.parseSurveyFileName( in_surveyPrevData.FILENAME );
        in_surveyPrevData.ID = "매칭 소개팅 : "+ SURVEY_DATA.QUESTION_TENDENCY_STR_TOKOR[ fileNameParsed.tendency ];
        in_surveyPrevData.TIME =  fileNameParsed.hour + ":" + fileNameParsed.minite;

        if ( undefined == searchData )
        {
            this.surveyPrevDataList.push( in_surveyPrevData );
            searchData = in_surveyPrevData;
        }
        else
        {	
            searchData.FILENAME		= in_surveyPrevData.FILENAME;		
            searchData.STATE    	= in_surveyPrevData.STATE;    	
            searchData.PREVQUESTION = in_surveyPrevData.PREVQUESTION; 
            searchData.PREVTEXT 	= in_surveyPrevData.PREVTEXT; 	
            searchData.LIMITTIME	= in_surveyPrevData.LIMITTIME;
            searchData.TIME         = in_surveyPrevData.TIME;
        }
        
        G.dataManager.loadSurveyTable( in_surveyPrevData.FILENAME, function( in_surveyTableData )
        {            
            switch( in_surveyPrevData.STATE )
            {
            case SURVEY_DATA.SURVEY_STATE.NEW :
                {
                    searchData.PREVTEXT = in_surveyTableData[0].text;             
                }
                break;

            case SURVEY_DATA.SURVEY_STATE.PROGRESSING :
                {
                    if ( 0 == in_surveyPrevData.PREVTEXT ) // 질문만있고 답변이없을떄 (근데 이런상황은 없을거같다)
                    { 
                        searchData.PREVTEXT = self.getQuestionDataFromTable( in_surveyTableData, in_surveyPrevData.PREVQUESTION ).text;
                    }
                    else
                    {
                        var data = self.getQuestionDataFromTable( in_surveyTableData, in_surveyPrevData.PREVQUESTION );
                        var nextQuestionIndex = data["answer" + searchData.PREVTEXT + "_link"];
                        
                        if ( (data.type != SURVEY_DATA.QUESTION_TYPE.LAST) && ((nextQuestionIndex != 0) && (nextQuestionIndex != undefined)) )
                            searchData.PREVTEXT = self.getQuestionDataFromTable( in_surveyTableData, nextQuestionIndex ).text;
                        else
                            searchData.PREVTEXT = self.getQuestionDataFromTable( in_surveyTableData, in_surveyPrevData.PREVQUESTION )[("answer" + in_surveyPrevData.PREVTEXT)];
                    }                
                }
                break;

            case SURVEY_DATA.SURVEY_STATE.MATCHING    :
                {
                    searchData.PREVTEXT = self.getWaitTableData( in_surveyTableData ).text;
                }
                break;

            case SURVEY_DATA.SURVEY_STATE.MATCHED     :
                {
                    searchData.PREVTEXT = self.getMatchingGiveScoreTableData( in_surveyTableData ).text;
                }
                break;;

            case SURVEY_DATA.SURVEY_STATE.GOTREWARD   :
                {
                    searchData.PREVTEXT = self.getRewardTableData( in_surveyTableData ).text;
                }
                break;

            case SURVEY_DATA.SURVEY_STATE.GAVESCORE   :
                {
                    searchData.PREVTEXT = self.getLastInviteTableData( in_surveyTableData ).text;
                }
                break;
            }

            searchData.TABLEDATA = in_surveyTableData;
            self.createSurveyListItemUI( searchData );
        });
    }

    // 설문 미리보기 데이터 검색
    FButlerAIManager.prototype.getSurveyPrevData = function( in_surveySeq )
    {
        for ( var i = 0; i < this.surveyPrevDataList.length; ++i )
        {
            if ( this.surveyPrevDataList[i].SEQ == in_surveySeq )
                return this.surveyPrevDataList[i];
        }

        return undefined;
    }


    // 설문 상세 데이터 추가. 있으면 알아서 업데이트한다.
    FButlerAIManager.prototype.addUpdateSurveyDetailData = function( in_serveyDetailData )
    {
        var searchData = this.getSurveyPrevData( in_serveyDetailData.SEQ );

        if ( undefined == searchData )
        {
            var tempPrevData = new SURVEY_DATA.LIST_PREVIEW_DATA();
            tempPrevData.SEQ = in_serveyDetailData.SEQ;
            tempPrevData.DETAILINFO = in_serveyDetailData;

            this.addUpdateSurveyPrevDataList( tempPrevData );
        }
        else
        {
            searchData.DETAILINFO = in_serveyDetailData;
        }
    }

    FButlerAIManager.prototype.getSurveyDetailData = function( in_surveySeq )
    {
        for ( var i = 0; i < this.surveyPrevDataList.length; ++i )
        {
            if ( this.surveyPrevDataList[i].SEQ == in_surveySeq )
                return this.surveyPrevDataList[i].DETAILINFO;
        }

        return undefined;
    }

    // 패킷 형식을 파싱하여 매칭 정보로 변환시켜준다
    FButlerAIManager.prototype.convertMatchingInfoFromProtocol = function( in_matchingInfoProtocol )
    {
        // if ( in_matchingInfoProtocol.PSAccountPk == 0 )
        //     return undefined;

        var matchingInfo = new SURVEY_DATA.MATCHING_USER_DETAIL_INFO();

        matchingInfo.SEQ             = in_matchingInfoProtocol.PSSeq;
        matchingInfo.PK              = in_matchingInfoProtocol.PSAccountPk;
        matchingInfo.ID              = in_matchingInfoProtocol.PSAccountID;

        matchingInfo.MYSCORE         = in_matchingInfoProtocol.PSMyScore;
        matchingInfo.SCORE           = in_matchingInfoProtocol.PSTarScore;

        matchingInfo.SURVEYSEQ       = in_matchingInfoProtocol.PSeq;

        matchingInfo.IMGURL          = in_matchingInfoProtocol.PSImgPath;
        matchingInfo.POSTPREV        = [ in_matchingInfoProtocol.PSSemiImg1, in_matchingInfoProtocol.PSSemiImg2, in_matchingInfoProtocol.PSSemiImg3 ];
        matchingInfo.POSTSEQ         = in_matchingInfoProtocol.PSStarContSeq;

        matchingInfo.LIMITTIME       = in_matchingInfoProtocol.PSETime;

        return matchingInfo;
    }

    // 높은 점수 주거나 받은 매칭상대 리스트 초기화
    FButlerAIManager.prototype.initMatchingList = function()
    {
        this.matchingInfoDataList = [];
    }

    // 높은 점수 주거나 받은 매칭상대 리스트 추가. 있으면 알아서 업데이트한다.
    FButlerAIManager.prototype.addUpdateMatchingList = function( in_matchingData )
    {
        var searchData = this.getMatchingData( in_matchingData.SEQ );

        // undefined 인 것은 갱신하지 않는다. 패킷에서 부분적으로만 들어오는 것들이 있기때문
        if ( undefined == searchData )
        {
            for ( var i = 0; i < this.matchingInfoDataList.length; ++i )
            {
                if ( (this.matchingInfoDataList[i].ID == in_matchingData.ID) && (this.matchingInfoDataList[i].SURVEYSEQ == in_matchingData.SURVEYSEQ) )
                {
                    searchData = this.matchingInfoDataList[i];
                    break;
                }
            }

            if ( undefined == searchData )
            {
                this.matchingInfoDataList.push( in_matchingData );
                return this.matchingInfoDataList[ this.matchingInfoDataList.length-1 ];
            }
        }
        
        if ( undefined != searchData)
        {
            if ( in_matchingData.PK != undefined )
                searchData.PK = in_matchingData.PK;
                
            if ( in_matchingData.ID != undefined )
                searchData.ID = in_matchingData.ID;
            
            if ( in_matchingData.MYSCORE != undefined )
                searchData.MYSCORE = in_matchingData.MYSCORE;
                
            if ( in_matchingData.SCORE != undefined )
                searchData.SCORE = in_matchingData.SCORE;
            
            if ( in_matchingData.SURVEYSEQ != undefined )
                searchData.SURVEYSEQ = in_matchingData.SURVEYSEQ;
                
            if ( in_matchingData.IMGURL != undefined )
                searchData.IMGURL = in_matchingData.IMGURL;
            
            if ( in_matchingData.POSTPREV != undefined )
                searchData.POSTPREV = in_matchingData.POSTPREV;
                
            if ( in_matchingData.POSTSEQ != undefined )
                searchData.POSTSEQ = in_matchingData.POSTSEQ;
            
            if ( in_matchingData.LIMITTIME != undefined )
                searchData.LIMITTIME = in_matchingData.LIMITTIME;

            return searchData;
        }
    }

    // 높은 점수 주거나 받은 매칭상대 리스트 검색
    FButlerAIManager.prototype.getMatchingData = function( in_matchingSEQ )
    {
        for ( var i = 0; i < this.matchingInfoDataList.length; ++i )
        {
            if ( this.matchingInfoDataList[i].SEQ == in_matchingSEQ )
                return this.matchingInfoDataList[i];
        }

        return undefined;
    }

    // 매칭 대기중인데 매칭 완료되었다고 메시지 왔을때 비동기 알림
    FButlerAIManager.prototype.onreceiveMatchingComplete = function( in_res )
    {
        var tendency = SURVEY_DATA.QUESTION_TENDENCY_STR[ in_res.PSTendency ];
        var data = 
        {
            img : AIUI_PATH+"Ai_window/A_ai1_icon.png", //매칭완료는 안드로이드가 알려주는걸로 한다.
            str : "주인님! " + tendency + " 성향파악에서 주인님과 취향이 비슷한 분이 나타났어요!"
        }
        
        GUI.alertEffect( data, true, function()
        {
            self.showSurveyUI();
        } );
    }

    // 높은 점수를 받았거나 서로 주고받은경우 비동기 알림
    FButlerAIManager.prototype.onreceiveMatchingHignScoreGet = function( in_res )
    {
        var self = this;

        var tendency = SURVEY_DATA.QUESTION_TENDENCY_STR[ in_res.PSTendency ];

        var text = " 성향파악에서 높은 호감도를 보냈습니다."
        if ( in_res.PSTarScore > 3 )
            text = " 성향파악에서 서로 높은 호감도를 주고받았습니다."

        var data = 
        {
            img : in_res.PSImgPath + in_res.PSImgUrl,
            str : tendency + text
        }
        
        GUI.alertEffect( data, true, function()
        {
            self.showSurveyUI(); // 매칭 친구 시퀀스 오면 상세보기쪽으로 바로 링크가능. 일단 미리보기로 해둠.
        } );
    }
    
    // 높은 점수 받은 사람들 UI 만들기
    FButlerAIManager.prototype.createHighScoreViewUI = function()
    {
        this.surveyUI.highScoreView.clearItem();

        var highScoreList = [ [],[],[] ];

        for ( var i = 0; i < this.matchingInfoDataList.length; ++i )
        {
            var matchingInfo = this.matchingInfoDataList[i];

            if ( matchingInfo.MYSCORE >= 4 && matchingInfo.SCORE >= 4 )
                highScoreList[ SURVEY_DATA.HIGHSCORE_TYPE.BOTH ].push( matchingInfo );
            else if ( matchingInfo.MYSCORE >= 4 )
                highScoreList[ SURVEY_DATA.HIGHSCORE_TYPE.GET ].push( matchingInfo );
            else if ( matchingInfo.SCORE >= 4 )
                highScoreList[ SURVEY_DATA.HIGHSCORE_TYPE.GIVE ].push( matchingInfo );
        }

        if ( highScoreList[ SURVEY_DATA.HIGHSCORE_TYPE.BOTH ].length +
             highScoreList[ SURVEY_DATA.HIGHSCORE_TYPE.GET  ].length +
             highScoreList[ SURVEY_DATA.HIGHSCORE_TYPE.GIVE ].length <= 0 )
        {            
            FPopup.messageBox("", "아직 관심을 표현한 친구가 없네요.\n\nSNS 에서 포스트를 작성해 \n스타콘텐츠를 등록하고,\n설문조사를 완료해 친구를 추천받고 호감을 주고받아 보세요!",BTN_TYPE.OK);
            this.requestMatchingInfoTodayQuestList();      
            return;
        }

        for ( var i = 0; i < highScoreList.length; ++i )
        {
            if ( highScoreList[i].length == 0 )
            {          
                continue;
            }

            this.createHighScoreViewItemFromType( highScoreList[i], i );
        }
    }

    // 높은 점수 받은 사람들 UI 에 들어갈 각 타입별 탭 UI 만들기
    FButlerAIManager.prototype.createHighScoreViewItemFromType = function( in_matchingInfoList, in_highScoreType )
    {
        var self = this;

        var headUIImagePath = "";
        var headUIText = "";

        switch( in_highScoreType )
        {
        case SURVEY_DATA.HIGHSCORE_TYPE.BOTH :
            {
                headUIImagePath = AIUI_PATH+"Ai_window/ai_interest_title.png";
                headUIText = "서로 관심있는 친구";
            }
            break;

        case SURVEY_DATA.HIGHSCORE_TYPE.GET :
            {
                headUIImagePath = AIUI_PATH+"Ai_window/ai_interest_title2.png";
                headUIText = "나에게 관심있는 친구";
            }
            break;

        case SURVEY_DATA.HIGHSCORE_TYPE.GIVE :
            {
                headUIImagePath = AIUI_PATH+"Ai_window/ai_interest_title3.png";
                headUIText = "내가 관심있는 친구";
            }
            break;
        }

        var yOffset = 0;

        var increaseWrapperHeight = function( in_height )
        {
            yOffset += in_height;
            wrapper.height = px( parseInt( wrapper.height ) + GUI.getResolutionCorrection( in_height, false ) );
        }

        var wrapper = GUI.createContainer();
        wrapper.width = GUI.getResolutionCorrection( px(620) );
        wrapper.height = GUI.getResolutionCorrection( px(50) );

        var headLineUI = GUI.CreateImage( "headLine_"+in_highScoreType, px(0), px(0), px(591), px(42), AIUI_PATH+"Ai_window/A_title_bg.png" /*headUIImagePath*/, GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        wrapper.addControl( headLineUI );
        wrapper.addControl( GUI.CreateText( px(50), px(10), headUIText, "Black", 20, GUI.ALIGN_LEFT, GUI.ALIGN_TOP ) );
        increaseWrapperHeight( 50 );

        // var bg = GUI.CreateImage( "bg", px(0), px(yOffset), px(350), px(10), AIUI_PATH+"Ai_window/ai_bg2.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        // wrapper.addControl( bg );
        // increaseWrapperHeight( 10 );

        var createHighScoreItemUI = function(i, in_matchingInfo)
        {
            if ( (i != 0) && ((i%3)==0) )
                increaseWrapperHeight( 200 );

            var itemBG = GUI.CreateButton( "itemBG"+i, px( 0 + (i%3)*200 ), px(yOffset), px(180), px(183), AIUI_PATH+"Ai_window/A_guest2_bg.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
            wrapper.addControl( itemBG );

            var icon = GUI.CreateCircleButton( "itemImg", px(0), px(-8), px(110), px(110), in_matchingInfo.IMGURL, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE, true, "skyblue" );
            itemBG.addControl( icon );

            var ddayText = GUI.CreateText( px(-15), px(10), "D-" + parseInt(in_matchingInfo.LIMITTIME / 86400).toString(), "Black", 13, GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
            itemBG.addControl( ddayText );

            var idText = GUI.CreateText( px(0), px(70), in_matchingInfo.ID, "Black", 22, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            itemBG.addControl( idText );

            itemBG.onPointerUpObservable.add( function()
            {
                if ( self.surveyUI.highScoreView.blockTouchForScrolling )
                    return;

                self.requestHighScoreMatchingDetailForUI( in_matchingInfo.SEQ );
            })
        }

        wrapper.height = px( parseInt( wrapper.height ) + GUI.getResolutionCorrection(110,false) );
        for ( var i = 0; i < in_matchingInfoList.length; ++i )
        {
            createHighScoreItemUI(i, in_matchingInfoList[i] );
        }

        //bg.height = px( parseInt( wrapper.height ) - GUI.getResolutionCorrection(25,false) );

        this.surveyUI.highScoreView.addItem( wrapper );
    }

    // 위쪽 관심회원리스트 버튼 눌렀을떄
    FButlerAIManager.prototype.onClickHighScoreMatchingButton = function()
    {
        var self = this;

        var json = protocol.getAllInteractionList();
        ws.onRequest( json, function( in_res, in_self )
        {
            protocol.res_getAllInteractionList( in_res );
            
            self.setViewType( SURVEY_DATA.VIEW_TYPE.HIGHSCORE );

            self.createHighScoreViewUI();
        }, this );
    }

    // 나한테 높은점수 준사람한테 나도 점수 줬을경우
    FButlerAIManager.prototype.onGiveScoreToHighScoreMatching = function( in_matchingSEQ, in_score )
    {
        var self = this;

        var json = protocol.evaluationSuggestMatching( in_matchingSEQ, in_score );
        ws.onRequest( json, function( in_res, in_self )
        {
            protocol.res_evaluationSuggestMatching( in_res );

            self.getMatchingData( in_matchingSEQ ).SCORE = in_score;

            self.requestHighScoreMatchingDetailForUI( in_matchingSEQ );
        }, this );

    }

    // 상호 호감 표시 UI 를 위해서 추천친구 상세정보 요청
    FButlerAIManager.prototype.requestHighScoreMatchingDetailForUI = function( in_matchingSEQ )
    {
        var self = this;

        var json = protocol.getMatchingDetailInfo( in_matchingSEQ );
        ws.onRequest( json, function( in_res, in_self )
        {
            protocol.res_getMatchingDetailInfo( in_res );

            self.surveyUI.detailView.clearItem();
            self.setViewType( SURVEY_DATA.VIEW_TYPE.DETAIL, "관심회원 보기" );

            self.createHighScoreMatcingDetailUI( self.getMatchingData( in_matchingSEQ ) );
        }, this );
    }

    // 상호 호감 친구 상세보기 UI 구성
    FButlerAIManager.prototype.createHighScoreMatcingDetailUI = function( in_matchingInfo )
    {
        var self = this;

        self.currentSelectSurveyPrevData = self.surveyPrevDataList[0];
        self.currentSelectSurveyTableData = self.currentSelectSurveyPrevData.TABLEDATA;
        self.currentSelectMatchingInfo = in_matchingInfo;

        var headText = "";
        var inviteText = ""

        if ( in_matchingInfo.MYSCORE >= 4 && in_matchingInfo.SCORE >= 4 )
        {
            headText = "두 분다 서로에게 호감을 표시했어요! 상대의 홈에 방문하여 관심을 표현해보세요!";
            inviteText = "헉! 둘 다 서로에게 호감이 있네요? "+in_matchingInfo.ID+"님의 집에 방문해보는건 어떠신가요?"
        }
        else if ( in_matchingInfo.MYSCORE >= 4 )
        {
            headText = "상대가 나에게 높은 호감을 보였어요! \n상대에게도 호감을 표현해 보세요";
        }
        else if ( in_matchingInfo.SCORE >= 4 )
        {
            headText = "상대에게 높은 호감을 보냈어요! \n상대방도 확인 후 호감을 표현할 거에요";
        }
        
        var wrapper = GUI.createContainer();
        wrapper.width = GUI.getResolutionCorrection( px(620) );
        wrapper.height = GUI.getResolutionCorrection( px(300) );

        var startBGPos = 50;
        var noticeBar = GUI.CreateImage( "noticebar", px(0), px(0), px(591), px(42), AIUI_PATH+"Ai_window/A_title2_bg.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        wrapper.addControl( noticeBar );
        var bg = GUI.CreateButton( "bg", px(0), px(startBGPos), px(591), px(268), AIUI_PATH+"Ai_window/A_like_bg.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        wrapper.addControl( bg );
        bg.isHitTestVisible = false;
        
        var headTextUI =  GUI.CreateAutoLineFeedText( px(0), px(-100), px(400), px(55), headText, "White", GUI.FontSize.MIDDLE, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        bg.addControl( headTextUI );

        var myIcon = GUI.CreateCircleButton( "myIcon", px(-140), px(5), px(120), px(120), G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getUrl(), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE, false, "white" );
        bg.addControl( myIcon );
        var myText = GUI.CreateText( px(-145), px(94), G.dataManager.getUsrMgr(DEF_IDENTITY_ME).nickname, "Black", 20, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        bg.addControl( myText );

        var matchingIcon = GUI.CreateCircleButton( "matchingIcon", px(134), px(5), px(120), px(120), in_matchingInfo.IMGURL, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE, false, "white" );
        bg.addControl( matchingIcon );
        var matchingText = GUI.CreateText( px(137), px(94), in_matchingInfo.ID, "Black", 20, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        bg.addControl( matchingText );

        self.surveyUI.detailView.addItem( wrapper );

        self.createMatchingUserUI( in_matchingInfo, ((in_matchingInfo.SCORE>0) ? in_matchingInfo.SCORE : 0) );
        if ( in_matchingInfo.SCORE > 0 )
        {
            var lastQuestionData = this.getLastInviteTableData( self.currentSelectSurveyTableData );
            self.createQuestAnswerUI( lastQuestionData );
        }


        if ( in_matchingInfo.SCORE >= 4 )
        {
            self.createHeartEffect( bg, 360, -140, 5 );
            FPopup.openAnimation( myIcon, undefined, 1.0, true, 1 );
        }

        if ( in_matchingInfo.MYSCORE >= 4 )
        {
            self.createHeartEffect( bg, 180, 134, 5 );        
            FPopup.openAnimation( matchingIcon, undefined, 1.0, true, 1 );
        }
        
        setTimeout( function(){
            self.surveyUI.detailView.moveFocusToEnd();
        }, 300 );
    }

    // 나한테 점수 많이준사람 미리보기 리스트에 추가
    FButlerAIManager.prototype.createGiveMeHighScoreUserPrevUI = function( in_matchingInfo )
    {
        var self = this;

        var giveHighScoreUserPrevUI = GUI.CreateButton( "giveHighScoreUserPrevUI", px(0), px(0), px(562), px(147), AIUI_PATH+"Ai_window/A_text_btn_idle.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );

        var icon = GUI.CreateCircleButton( "matchingIcon", px(-220), px(0), px(145), px(145), in_matchingInfo.IMGURL, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        giveHighScoreUserPrevUI.addControl( icon );

        var name = GUI.CreateText( px(190), px(-45), in_matchingInfo.ID, "Black", GUI.FontSize.VBIG, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        giveHighScoreUserPrevUI.addControl( name );

        var time = GUI.CreateText( px(-17), px(-28), "D-"+parseInt(in_matchingInfo.LIMITTIME/86400), "Black", 13, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        //giveHighScoreUserPrevUI.addControl( time );

        var myNick = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).nickname;
        var youngupText = 
        [
            /*"잘 맞을 것 같아서 높은 호감도를 드렸어요! 저도 좋은 점수 받았으면 좋겠어요~",
            "스타컨텐츠가 너무 마음에 들어요! 제 포스팅 구경하시고 저도 평가해 주세요!",
            "집사랑 대화하다가 잘 맞을 것 같다면서 추천해 줬어요! "+myNick+"님 생각은 어떠신가요?",
            myNick+"!!!!!! 난 너가 맘에 든다아ㅏ아아ㅏ아!!!!!",
            "너의 취향과 나의 취향이 일치하니 이 어찌 천생연분이 아닐 수 있단 말인가",*/
            "주인님의 스타컨텐츠에 호감을 표현한 회원님이 있습니다. 확인해 보세요."
        ]

        var text = GUI.CreateAutoLineFeedText( px(70), px(20), px(380), px(130), youngupText[ CommFunc.random(youngupText.length) ], "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        giveHighScoreUserPrevUI.addControl( text );

        // 누르면 해당 매칭상대의 상세정보를 불러온다. 점수평가가 나와야겠지 쟤만 나한테 점수 줬으니까
        giveHighScoreUserPrevUI.onPointerUpObservable.add( function()
        {
            if ( self.surveyUI.listView.blockTouchForScrolling )
                return;
                
            self.requestHighScoreMatchingDetailForUI( in_matchingInfo.SEQ );
        });

        // 쟤가 나 좋아한다 했는데 아직 내가 점수 안준 경우에 알람이 뜬다.
        if ( in_matchingInfo.SCORE == 0 )
        {
            var alert = this.getCreateAlertIcon( "!", px(-260), px(-45), px(40), px(40), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            giveHighScoreUserPrevUI.addControl( alert );
        }
        
        this.surveyUI.listView.addItem( giveHighScoreUserPrevUI );

        return giveHighScoreUserPrevUI;
    }
    

    // <----------------------------------오늘의 퀘스트 시작

    FButlerAIManager.prototype.initTestQuestTableData = function()
    {
        var createTestQuestTableData = function( in_index, in_title, in_text, in_maxCount, in_checkType, in_checkTypeValue, in_reward1, in_reward1Count, in_reward2, in_reward2Count )
        {
            var result = { "index":in_index , "title":in_title, "text":in_text , "maxCount":in_maxCount , "checkType":in_checkType , "checkTypeValue":in_checkTypeValue, 
            "reward1":in_reward1, "reward1Count":in_reward1Count, "reward2":in_reward2, "reward2Count":in_reward2Count };

            return result;
        }

        this.testQuestTableData =
        [
            createTestQuestTableData( 1, "TODO : 해변 스팟 방문하기", "해변 스팟에 사람들도 만나고 여유로운 생활을 즐겨보세요~해변에 놀러가기",  1, QUEST_DATA.QUEST_TYPE.VISIT_SPOT, "해변", 1001, 1, 1002, 1 ),
            createTestQuestTableData( 2, "TODO : 방문하기" , "다른 사람 집에 방문해 보세요~ ",                                      10, QUEST_DATA.QUEST_TYPE.VISIT_FRIEND, 0, 1001, 1, 1002, 1 ),
            createTestQuestTableData( 3, "TODO : 침대 설치하기" , "편안하게 휴식을 취할 만한 '고급 침대' 하나를 설치해보세요!",             1, QUEST_DATA.QUEST_TYPE.INSTALL, 12003, 1001, 1, 1002, 1 )
        ];
    }

    FButlerAIManager.prototype.getQusetTableData = function( in_index )
    {
        for ( var i = 0; i < this.testQuestTableData.length; ++i )
        {
            if ( this.testQuestTableData[i].index == in_index )
                return this.testQuestTableData[i];
        }

        return undefined;
    }

    FButlerAIManager.prototype.getTodayQuestData = function( in_questIndex )
    {
        for ( var i = 0; i < this.todayQuestDataList.length; ++i )
        {
            if ( this.todayQuestDataList[i].INDEX == in_questIndex )
                return this.todayQuestDataList[i];
        }

        return undefined;
    }

    FButlerAIManager.prototype.addUpdateTodayQuestData = function( in_todayQuestData )
    {
        var searchData = this.getTodayQuestData( in_todayQuestData.INDEX );

        if ( searchData == undefined )
            this.todayQuestDataList.push( in_todayQuestData );
        else
        {
            searchData.STATE = in_todayQuestData.STATE;
            searchData.COUNT = in_todayQuestData.COUNT;
            searchData.LIMITTIME = in_todayQuestData.LIMITTIME;
        }
    }

    // 오늘의 퀘스트 진행중인 리스트 만들기
    FButlerAIManager.prototype.createTodayQuestPrevListItemUI = function( in_todayQuestData )
    {
        var self = this;

        var todayQuestPrevUI = GUI.CreateButton( "todayQuestPrevUI", px(0), px(0), px(562), px(147), AIUI_PATH+"Ai_window/A_text_btn_idle.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );

        var icon = GUI.CreateImage( "icon", px(-220), px(0), px(145), px(145), AIUI_PATH+"Ai_window/A_ai1_icon.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        todayQuestPrevUI.addControl( icon );

        var name = GUI.CreateText( px(190), px(-40), in_todayQuestData.TABLEDATA.title, "Black", GUI.FontSize.VBIG, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        todayQuestPrevUI.addControl( name );

        var time = GUI.CreateText( px(-17), px(-25), "D-"+parseInt(in_todayQuestData.LIMITTIME/86400), "Black", 13, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        // todayQuestPrevUI.addControl( time );

        var text = GUI.CreateAutoLineFeedText( px(70), px(20), px(380), px(130), in_todayQuestData.TABLEDATA.text, "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        todayQuestPrevUI.addControl( text );

        
        todayQuestPrevUI.onPointerUpObservable.add( function()
        {
            if ( self.surveyUI.listView.blockTouchForScrolling )
                return;

            self.onClickQuestView( in_todayQuestData );
        });

        // 퀘스트는 완료했는데 아직 보상을 안받은 경우에만 알람이 뜬다.
        if ( in_todayQuestData.STATE == QUEST_DATA.QEUST_STATE.COMPLETE )
        {
            var alert = this.getCreateAlertIcon( "!", px(-260), px(-45), px(40), px(40), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            todayQuestPrevUI.addControl( alert );
            
            GUI.changeButtonImage( todayQuestPrevUI, AIUI_PATH+"Ai_window/A_text1_btn_idle.png" );
        }
        
        this.surveyUI.listView.addItem( todayQuestPrevUI );

        return todayQuestPrevUI;
    }

    FButlerAIManager.prototype.onClickQuestView = function( in_todayQuestData )
    {
        var self = this;

        self.surveyUI.detailView.clearItem();
        self.setViewType( SURVEY_DATA.VIEW_TYPE.DETAIL );
        self.makeDetailUIfromTodayQuestData( in_todayQuestData );
    }

    // 오늘의 퀘스트 리스트 눌러서 진행상태 상세보기 UI
    FButlerAIManager.prototype.makeDetailUIfromTodayQuestData = function( in_todayQuestData )
    {
        var self = this;
        
        var wrapper = GUI.createContainer();
        wrapper.width = GUI.getResolutionCorrection( px( 620 ) );
        wrapper.height = GUI.getResolutionCorrection( px( 130 ) );

        // 점선
        var lineImg = GUI.CreateImage( "line", px(0), px(0), px(620), px(2), AIUI_PATH+"Ai_window/ai_line.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        wrapper.addControl( lineImg );

        // 아이콘        
        var icon = GUI.CreateImage( "icon", px(0), px(20), px(121), px(121), AIUI_PATH+"Ai_window/A_ai1_icon.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        wrapper.addControl( icon );

        // 묻기 말풍선
        var iconOffset = 150;
        var questionBG = GUI.CreateButton( "questionBG", px(iconOffset), px(20), px(432), px(132), AIUI_PATH+"Ai_window/A_word0_bg.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        questionBG.isHitTestVisible = false;
        questionBG.addControl( GUI.CreateAutoLineFeedText( px(10), px(0), px(400), px(120), 
            in_todayQuestData.TABLEDATA.text + " (" + in_todayQuestData.COUNT + "/" + in_todayQuestData.TABLEDATA.maxCount +")" , "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
        wrapper.addControl( questionBG );

        // 답변 말풍선
        var text = "로딩 중";
        switch( in_todayQuestData.STATE )
        {
        case QUEST_DATA.QEUST_STATE.PROGRESS : text = "할 일을 진행 중입니다."; break;
        case QUEST_DATA.QEUST_STATE.COMPLETE : text = "보상 받기"; break;
        case QUEST_DATA.QEUST_STATE.GOTREWARD : text = "보상을 받았습니다."; break;
        }

        var answerBG = GUI.CreateButton( "answerBG", px(-30), px(121+25+20), px(172), px(80), AIUI_PATH+"Ai_window/A_answer_bg.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        var answerText = GUI.CreateText( px(0), px(0), text, "Black", GUI.FontSize.MIDDLE, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        answerBG.width = px(GUI.getResolutionCorrection(Math.max( answerText.text.length, 0 ) * GUI.getResolutionCorrection(GUI.FontSize.MIDDLE,false), false) + parseInt(answerText.width));

        wrapper.height = px(parseInt( wrapper.height ) + parseInt( answerBG.height ) + 121 + 25 );
        answerBG.addControl( answerText );
        wrapper.addControl( answerBG );
        
        this.surveyUI.detailView.addItem( wrapper );
    }

    // 퀘스트 변경 비동기 알림
    FButlerAIManager.prototype.onreceiveDailyQuestUpdate = function( in_res )
    {
        var self = this;

        if ( in_res.DQState != QUEST_DATA.QEUST_STATE.COMPLETE )
            return;

        var questData = this.getTodayQuestData( in_res.DQIdx );

        var text = questData.TABLEDATA.title + " (" + in_res.DQCnt +"/"+ questData.TABLEDATA.maxCount +")";

        var data = 
        {
            img : AIUI_PATH+"Ai_window/ai_icon1.png",
            str : text
        }

        setTimeout( function()
        {
            GUI.alertEffect( data, true, function()
            {
                self.showSurveyUI();

                setTimeout( function()
                {
                    self.onClickQuestView( questData );
                }, 500);
            } );
        }, 2000 );
    }

    // <----------------------------------오늘의 퀘스트 끝

    
    // <----------------------------------알람 관련 (안드로이드 머리, 리스트 new표시 등등) 로직 시작

    // 가지고 있는 데이터를 검사해서 아직 진행하지 않은 게 있으면 안드로이드 알람한테 전달하는 함수이다.
    FButlerAIManager.prototype.checkAndroidAlert = function()
    {
        if ( G.sceneMgr.getCurrentScene().android == undefined )
            return;

        return; // 안드로이드가 ㅂ뀌어서 다시 작업 한번 해 줘야 한다.

        var self = this;
        var android = G.sceneMgr.getCurrentScene().android;
        android.clearNotice();

        // 어차피 다 검사하기때문에 시작할때 밀린 안드로이드 알림데이터를 삭제해야한다. 근데 인터페이스 아직 없어서 냅둠.
        // 안드로이드 입장에서는 가지고 있는 알림 리스트를 다 소진했을때 이거 한번 더 불러주면 된다.

        for ( var i = 0; i < this.surveyPrevDataList.length; ++i )
        {
            if ( this.surveyPrevDataList[i].STATE == SURVEY_DATA.SURVEY_STATE.NEW )
            {
                if ( this.surveyPrevDataList[i].TABLEDATA == undefined )
                    continue;
                    
                android.addNotice( AI_NOTICE.SURVEY, this.surveyPrevDataList[i].PREVTEXT, this, 0, function()
                {
                    self.showSurveyUI();
                } );
            }
        }

        for ( var i = 0; i < this.matchingInfoDataList.length; ++i )
        {
            if ( this.matchingInfoDataList[i].SCORE == 0 && this.matchingInfoDataList[i].MYSCORE > 0 )
            {
                android.addNotice( AI_NOTICE.HEART, this.matchingInfoDataList[i].ID + "님께서 높은 호감도를 표현했습니다", this, 0, function()
                {
                    self.showSurveyUI();
                } );
            }
        }

        for ( var i = 0; i < this.todayQuestDataList.length; ++i )
        {
            if ( this.todayQuestDataList[i].STATE == QUEST_DATA.QEUST_STATE.PROGRESS )
            {
                android.addNotice( AI_NOTICE.TODO, this.todayQuestDataList[i].TABLEDATA.text, this, 0, function()
                {
                    self.showSurveyUI();
                } );
            }
        }
    }

    // 빨간색 단추 빤짝빤짝
    FButlerAIManager.prototype.getCreateAlertIcon = function( in_value, in_left, in_top, in_width, in_height, in_alignW, in_alignH )
    {
        var alertUI = GUI.CreateButton( "alertUI", in_left, in_top, in_width, in_height, AIUI_PATH+"Ai_window/ai_red.png", in_alignW, in_alignH );

        alertUI.addControl( GUI.CreateText( px(0), px(0), in_value, "WHITE", 28, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );

        FPopup.openAnimation( alertUI, undefined, 1.0, true, 2 );

        return alertUI;
    }

    // 하트 슝슝 이펙트
    FButlerAIManager.prototype.createHeartEffect = function( in_targetUI, in_direction, in_startX, in_startY )
    {
        // particle
        var createHeartEffectPart = function()
        {

            var heartParticle = GUI.CreateImage( "part", px(in_startX), px(in_startY), px(44), px(44), AIUI_PATH+"Ai_window/heart.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            var radians = ToRadians( CommFunc.randomMinMax( in_direction-10, in_direction+10 ) );
            var stopoverPos = new Vector2( in_startX + Math.cos( radians )*CommFunc.randomMinMax(150, 300),
            in_startY + Math.sin( radians )*CommFunc.randomMinMax(150, 300) );

            in_targetUI.addControl( heartParticle );
                
            

            var partFR = 120;
            var partXAni = new BABYLON.Animation( "x", "left", partFR, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var partXAniKey = [];
            partXAniKey.push( {frame:0, value: parseInt( heartParticle.left ) } );
            partXAniKey.push( {frame:partFR*2, value: stopoverPos.x } );
            partXAni.setKeys(partXAniKey); 
            CommFunc.useEasingFuncToAnimation(partXAni, undefined, BABYLON.EasingFunction.EASINGMODE_EASEOUT);
            var partYAni = new BABYLON.Animation( "x", "top", partFR, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var partYAniKey = [];
            partYAniKey.push( {frame:0, value: parseInt( heartParticle.top ) } );
            partYAniKey.push( {frame:partFR*2, value: stopoverPos.y } );
            partYAni.setKeys(partYAniKey); 
            CommFunc.useEasingFuncToAnimation(partYAni, undefined, BABYLON.EasingFunction.EASINGMODE_EASEOUT);
            var partAlphaAni = new BABYLON.Animation( "a", "alpha", partFR, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var partAlphaAniKey = [];
            partAlphaAniKey.push( {frame:0, value: 0 } );
            partAlphaAniKey.push( {frame:partFR, value:1 } );
            partAlphaAniKey.push( {frame:partFR*2, value:0 } );
            partAlphaAni.setKeys(partAlphaAniKey); 
            G.scene.beginDirectAnimation( heartParticle, [partXAni, partYAni, partAlphaAni], 0, partFR*2, true, CommFunc.randomMinMax(80, 120)/100, function()
            {
                //in_targetUI.removeControl( heartParticle );
                //heartParticle = null;
            } ); 
        }

        for ( var i = 0; i < 10; ++i )
        {
            createHeartEffectPart();
        }
    }

    // <----------------------------------알람 관련 (안드로이드 머리, 리스트 new표시 등등) 로직 끝

    return FButlerAIManager;

}());