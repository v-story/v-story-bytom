'use strict';


var CHAT_DATA = 
{
    TYPE : 
    {
        ALL     : 0,
        NORMAL  : 1,
        SPOT    : 2,
        WHISPER : 3,
        SPOTUSER: 4,
        IGNORE  : 5,
        SYSTEM  : 6
    },

    TYPESTRING : ["전체", "월드", "스팟", "귓속말", "스팟유저", "차단"]
}

var FChatManager = (function() 
{
    function FChatManager()
    {
        this.debugLayer = null;

        this.dialog = [];

        this.ui = 
        {
            wrapper : null,
            BG : null,

            closeBtn : null,

            topButton :
            {
                bg:null,

                button : [ null, null, null, null, null, null ]
            },

            listView : null,
            inputText : null,
            sendButton : null,

            sendTypeBtn : null,
            sendTypeBtnExpand : [null, null, null, null],

            macroBtn : null,

            channelBtn : null,
            channelBtnExpand : [],

            currentChannelText : null,        
            
            whisperTargetText : null,
        }

        this.prevUI =
        {
            wrapper : null,
            BG : null,
            listView : null,
        }

        this.showing = false;

        this.currentViewFilterType = CHAT_DATA.TYPE.ALL;
        this.currentSendFilterType = CHAT_DATA.TYPE.ALL;

        this.defaultText = "여기에 메시지를 입력해 주세요";
        this.currentWhisperTarget = undefined;
        //
        // init
        //
        this.init();
    }

    //월드
    //G.chatManager.sendMessage('안녕!@#$%', null, true);
    //채널
    //G.chatManager.sendMessage('채널채팅!@#$%', null, false);
    //속삭임
    //G.chatManager.sendMessage('악마의 속삭임!@#$%', 13, false);
    FChatManager.prototype.sendMessage = function(text, pk, bWorld) {

        if(pk != null && pk > 0) {

            if(bWorld == true) alert('not whisper in World');

            var json = protocol.sendWhisper(Base64.encode(text), pk);
            ws.onRequest(json, self.sendMessageCB, this);

        } else {

            var json = protocol.sendMessage(Base64.encode(text), bWorld);
            ws.onRequest(json, self.sendMessageCB, this);

        }
    }

    FChatManager.prototype.sendMessageCB = function(res, self) {
        Debug.Log('send chat => ' + res);
    }

    //레디스로 부터 채팅 메시지 받는 곳
    FChatManager.prototype.onRecvMessage = function(json, bWorld) {

        var fromId = null;
        var fromPk = null;
        var toId = null;
        var toPk = null;
        var world = 0;

        if(bWorld) {
            world = 1;
            fromPk = json.accountPk;
            fromId = json.accountId;

            Debug.Log('world ' + fromId +' => ' + Base64.decode(json.chatMsg));
        } else if(opcode['ChatChannel'] == json.opcode 
            || opcode['ChatWorld'] == json.opcode ) {
        
            fromPk = json.accountPk;
            fromId = json.accountId;

            Debug.Log('channel ' + fromId + ' => ' + Base64.decode(json.chatMsg));

        }  else if(opcode['Whisper'] == json.opcode ) {

            fromPk = json.fromAccountPk;
            fromId = json.fromAccountId;

            toPk = json.toAccountPk;
            toId = json.toAccountId;

            Debug.Log('whisper to ' + toId +' => ' + Base64.decode(json.chatMsg));
        } else {
            alert('Error from Chat opcode');
        }
        
        
        var text = {
            'world' : world,        // false 일시 스팟에서 오는것이다
            'pk' : fromPk,  // 보낸사람 pk
            'id' : fromId,  // 보낸사람
            'toPk' : toPk,          // null 이 아니면 해당대상에게 귓속말
            'toId' : toId,         // null 이 아니면 해당대상에게 귓속말
            'msg' : Base64.decode(json.chatMsg)
        };

        this.dialog.push(text);
        
        this.onReceiveChatData( text );
    }

    FChatManager.prototype.addSystemMessage = function(msg) {

        var text = {
            'world' : 2,        // false 일시 스팟에서 오는것이다
            'pk' : null,  // 보낸사람 pk
            'id' : null,  // 보낸사람
            'toPk' : null,          // null 이 아니면 해당대상에게 귓속말
            'toId' : null,         // null 이 아니면 해당대상에게 귓속말
            'msg' : msg
        };

        this.dialog.push(text);
        
        this.onReceiveChatData( text );
    }

    //모든 채팅 내용 가져오기
    FChatManager.prototype.getAllMessage = function() {
        return this.dialog;
    }

    FChatManager.prototype.getWorldMessage = function() {
        var text = [];

        this.dialog.forEach(function(dlg){
            if(dlg.world == 1) text.push(dlg);
        });

        return text;        
    }

    //스팟 메시지 가져오기
    FChatManager.prototype.getSpotMessage = function() {

        var text = [];

        this.dialog.forEach(function(dlg){
            if(dlg.world == 0) text.push(dlg);
        });

        return text;
    }

    //속삭임 메시지 가져오기
    FChatManager.prototype.getWhisperMessage = function() {

        var text = [];

        this.dialog.forEach(function(dlg){
            if(dlg.toPk != null) text.push(dlg);
        });

        return text;

    }

    FChatManager.prototype.init = function()
    {
        G.runnableMgr.add(this);

        this.initUI();
        this.initPrevUI();

        this.selectViewFilterType( CHAT_DATA.TYPE.ALL );
        this.selectSendFilterType( CHAT_DATA.TYPE.NORMAL );

        snsCommonFunc.setChatCallback(this.inputChat, this);
    }

    FChatManager.prototype.inputChat = function(self, text) {
        self.onClickSendChatButton(text);
    }

    // 채팅 보내기 눌렀을때 호출되는 함수. 보낼 채팅 필터에 따라 파싱해서 네트워크에 전달한다.
    FChatManager.prototype.onClickSendChatButton = function(text)
    {   
        if(text.length == 0
            || text == "" 
            || text == this.defaultText) return;

        switch( this.currentSendFilterType )
        {
        case CHAT_DATA.TYPE.NORMAL :
            {
                G.chatManager.sendMessage(text, null, true );

                text = this.defaultText;
            }
            break;

        case CHAT_DATA.TYPE.SPOT :
            {
                G.chatManager.sendMessage(text, null, false );

                text = this.defaultText;
            }
            break;

        case CHAT_DATA.TYPE.WHISPER : 
            {
                if ( this.currentWhisperTarget == null )
                {
                    this.currentWhisperTarget =text;
                    text = "["+this.currentWhisperTarget+"]에게 보낼 귓속말을 입력하세요.";
                    this.ui.whisperTargetText.text = "[귓속말]"+this.currentWhisperTarget;
                    GUI.changeButtonImage( this.ui.sendButton, CHATUI_PATH+"Chat_send.png" );
                }
                else
                {
                    var pk = G.dataManager.dataChannel.getPk(this.currentWhisperTarget);
                    G.chatManager.sendMessage(this.ui.inputText.text, pk, false);     

                    text = this.defaultText;
                }   
            }
            break;
        }     
    }

    // 보낼 채팅타입 설정하기
    FChatManager.prototype.selectSendFilterType = function( in_selectType )
    {
        this.currentSendFilterType = in_selectType;

        var resourceName = ["Chat_btn_all.png", "Chat_btn_nor.png", "Chat_btn_spot.png", "Chat_btn_ear.png"];
        GUI.changeButtonImage( this.ui.sendTypeBtn, CHATUI_PATH+resourceName[in_selectType] );

        for ( var i = CHAT_DATA.TYPE.NORMAL; i <= CHAT_DATA.TYPE.WHISPER; ++i )
        {
            if ( i == in_selectType )
                GUI.changeButtonImage( this.ui.sendTypeBtnExpand[i], CHATUI_PATH+"Chat_btn_up1.png" );
            else
                GUI.changeButtonImage( this.ui.sendTypeBtnExpand[i], CHATUI_PATH+"Chat_btn_up2.png" );
        }

        this.ui.inputText.color = this.getColorFromChatType( this.currentSendFilterType );

        this.currentWhisperTarget = null;
        this.ui.whisperTargetText.text = "";
        if ( this.currentSendFilterType == CHAT_DATA.TYPE.WHISPER )
        {
            this.ui.inputText.text = "귓속말할 아이디를 입력하세요";
            GUI.changeButtonImage( this.ui.sendButton, CHATUI_PATH+"Chat_input.png" );
        }
        else
        {
            this.ui.inputText.text = this.defaultText;
            GUI.changeButtonImage( this.ui.sendButton, CHATUI_PATH+"Chat_send.png" );
        }
    }

    FChatManager.prototype.onReceiveChatData = function( in_chatData )
    {        
        this.addChatMessageUI( in_chatData, true );
        // this.addChatMessagePrevUI( in_chatData, true );

        // snsCommonFunc.chatLender(direction, name, profileImg, text)

        console.log(in_chatData);
    }


    /**
     * @description 리스트뷰에 채팅 하나 추가하기
     * @param {Object} in_chatData  // onRecvMessage 에서 받아서 구성한 텍스트데이터
     * @param {Boolean} in_focus    // 추가하고 포커싱할건지
     */
    FChatManager.prototype.addChatMessageUI = function( in_chatData, in_focus, in_callback )
    {
        var self = this;

        var passFlag = false;

        if ( this.getChatTypeFromChatData( in_chatData ) == CHAT_DATA.TYPE.WHISPER ) // 일단 귓속말이면 내가 볼수있는지 아닌지 확인한다.
        {
            if ( in_chatData.id == G.dataManager.getUsrMgr(DEF_IDENTITY_ME).nickname ||
                 in_chatData.toId == G.dataManager.getUsrMgr(DEF_IDENTITY_ME).nickname )
                passFlag = true;
        }
        else if ( this.currentViewFilterType == CHAT_DATA.TYPE.ALL )
            passFlag = true;
        else if ( this.currentViewFilterType == CHAT_DATA.TYPE.SPOT ) // 스팟일때는 스팟&귓속말이 다 보이도록 한다.
        {
            if ( this.getChatTypeFromChatData( in_chatData ) == CHAT_DATA.TYPE.SPOT ||
                 this.getChatTypeFromChatData( in_chatData ) == CHAT_DATA.TYPE.WHISPER )
                 passFlag = true;
        }
        else if ( this.currentViewFilterType == this.getChatTypeFromChatData( in_chatData ) )
            passFlag = true;

        if ( !passFlag )
        {
            if ( in_callback != undefined )
                in_callback();
            return; //현재 필터에 걸렸습니다.
        }

        var direction = null;
        var url = PROFILE_PATH + G.dataManager.dataChannel.getProfileUrl(in_chatData.pk);

        if ( url == "//vsns.onlinestory.co.kr/fileupload/myprofile/null" )
        {
            var animalList = [ "cat_profile.png", "dog_profile.png" ];

            if ( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).accountPk == in_chatData.pk )
                url = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getUrl();
            else
                url = PETUI_PATH + animalList[ CommFunc.random(2) ];
        }

        if(in_chatData.pk == ACCOUNTPK) {
            direction = 1;
        }
        else {
            direction = 0;
        }

        snsCommonFunc.chatLender(direction, in_chatData.id, url, in_chatData.msg);

        // var addChatText = this.createChatUIFromChatData( in_chatData, 275, 50, 16 )

        // this.calculateMultiLineTextUILineCount( addChatText, function( in_lineCount )
        // {
        //     addChatText.height = px( in_lineCount* GUI.getResolutionCorrection(16,false) + GUI.getResolutionCorrection(5,false) );
        //     self.ui.listView.addItem( addChatText );

        //     if ( in_focus )
        //         self.ui.listView.moveFocusToEnd();

        //     if ( in_callback != undefined )
        //         in_callback();
        // });
    }


    // onRecvMessage 에서 받아서 구성한 텍스트데이터 CHAT_DATA.TYPE 으로 변환시켜준다.
    FChatManager.prototype.getChatTypeFromChatData = function( in_chatData )
    {
        var chatType = CHAT_DATA.TYPE.NORMAL;

        if ( in_chatData.toPk != null )
        {
            chatType = CHAT_DATA.TYPE.WHISPER;
        }
        else if ( in_chatData.world == 0 )
        {
            chatType = CHAT_DATA.TYPE.SPOT;
        } 
        else if(in_chatData.world == 2) 
        {
            chatType = CHAT_DATA.TYPE.SYSTEM;
        }

        return chatType;
    }

    /**
     * @description 채팅 데이터를 받아서 리스트에 들어갈 채팅UI 구성해주는 함수
     * @param {Object} in_chatData // onRecvMessage 에서 받아서 구성한 텍스트데이터
     */
    FChatManager.prototype.createChatUIFromChatData = function( in_chatData, in_width, in_height, in_fontSize )
    {
        var color = "White";
        var chatType = this.getChatTypeFromChatData( in_chatData );
        var color = this.getColorFromChatType( chatType );

        var typeText    = null;
        var idText = null;
        if(chatType != CHAT_DATA.TYPE.SYSTEM) {
            typeText    = "["+ CHAT_DATA.TYPESTRING[chatType] +"] ";
            idText      = in_chatData.id + " : ";
        }
        
        var expandText  = (in_chatData.toPk != null) ? ("(" + in_chatData.toId + "에게 귓속말)") : "";
        
        var text = null;
        
        if(typeText)
            text = typeText + idText + expandText + in_chatData.msg;
        else
            text = expandText + in_chatData.msg;

        return text;

        // var textUI = GUI.CreateAutoLineFeedText( px(0), px(0), px(in_width), px(in_height), text, color, in_fontSize, GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        // return textUI;
    }

    // UI 관련부분 시작 //<------------------------------------------------------------------------------------------------------------>//
    
    /**
     * @description 이것은 GUI.createAutoFeedMulti어쩌구 텍스트를 넣으면 줄 수를 계산해주는 함수이다.
     * @param {GUI.CreateAutoLineFeedText} in_textUI    // 계산이 필요한 UI
     * @param {function} in_onEndCalcFunc               // 계산끝나면 줄 갯수가 넘어오는 함수
     */
    FChatManager.prototype.calculateMultiLineTextUILineCount = function( in_textUI, in_onEndCalcFunc )
    {
        var self = this;
        
        var originPos = [in_textUI.top, in_textUI.left];
        in_textUI.top = px(999999);
        in_textUI.left = px(999999);

        in_textUI.onAfterDrawObservable.add( function()
        {
            in_textUI.onAfterDrawObservable.clear();
            G.guiMain.removeControl( in_textUI );

            in_textUI.top = originPos[0];
            in_textUI.left = originPos[1];

            in_onEndCalcFunc( in_textUI._lines.length );
        });

        G.guiMain.addControl( in_textUI );
    }

    // <----여기서부터 미니채팅창 시작

    FChatManager.prototype.initPrevUI = function()
    {
        this.prevUI.wrapper = GUI.createContainer();
        this.prevUI.wrapper.width = GUI.getResolutionCorrection( px(310) );
        this.prevUI.wrapper.height = GUI.getResolutionCorrection( px(110) );
        this.prevUI.wrapper.verticalAlignment = GUI.ALIGN_BOTTOM;        
        this.prevUI.wrapper.isPointerBlocker = true;

        this.prevUI.BG = GUI.CreateImage( "prevUIBG", px(0), px(0), px(300), px(100), CHATUI_PATH+"chatPrev_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.prevUI.BG.alpha = 0.5;
        this.prevUI.wrapper.addControl( this.prevUI.BG );

        this.prevUI.listView = new GUI.createScrollView( this.prevUI.wrapper, "prevListView", px(0), px(0), px(300), px(95), 1.1, true, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );        
    }

    FChatManager.prototype.clearPrevChatListUI = function()
    {
        this.prevUI.listView.clearItem();
    }

    FChatManager.prototype.applyChatdataToPrevListUI = function( in_chatDataList )
    {
        var self = this;

        this.clearPrevChatListUI();

        var addNextChatPrevMessageUI = function( in_index )
        {
            self.addChatMessagePrevUI( in_chatDataList[ in_index ], ( in_index == (in_chatDataList.length-1)), function()
            {
                if ( in_index+1 < in_chatDataList.length )
                {
                    addNextChatPrevMessageUI( in_index+1 );
                }
            })
        }

        if ( in_chatDataList.length > 0 )
                addNextChatPrevMessageUI( 0 );


        // for ( var i = 0; i < in_chatDataList.length; ++i )
        // {
        //     this.addChatMessagePrevUI( in_chatDataList[i], ( i == (in_chatDataList.length-1)) );
        // }
    }

    FChatManager.prototype.addChatMessagePrevUI = function( in_chatData, in_focus, in_callback )
    {
        var self = this;

        var addChatText = this.createChatUIFromChatData( in_chatData, 275, 10, 12 );

        this.calculateMultiLineTextUILineCount( addChatText, function( in_lineCount )
        {
            addChatText.height = px( in_lineCount* GUI.getResolutionCorrection(12, false) + GUI.getResolutionCorrection(3,false) );
            self.prevUI.listView.addItem( addChatText );

            if ( in_focus )       
                self.prevUI.listView.moveFocusToEnd();

            if ( in_callback != undefined )
                in_callback();
        });
    }

    FChatManager.prototype.refreshChatPrevUI = function()
    {
        this.applyChatdataToPrevListUI( this.getAllMessage() );
    }

    FChatManager.prototype.showChatPrevUI = function()
    {
        if(CommFunc.isPhone())
            return;

        this.hideChatPrevUI();
        G.guiMain.addControl( this.prevUI.wrapper, GUI.LAYER.POPUP );
    }

    FChatManager.prototype.hideChatPrevUI = function()
    {
        G.guiMain.removeControl( this.prevUI.wrapper );
    }

    // <----여기까지가 미니채팅창 끝

    
    FChatManager.prototype.initUI = function()
    {
        var uiSizeRatio = 720 / 310;

        var self = this;
        
        this.ui.wrapper = GUI.createContainer();
        //this.ui.wrapper.width = GUI.getResolutionCorrection( px(320) );
        this.ui.wrapper.horizontalAlignment = GUI.ALIGN_LEFT;
        this.ui.wrapper.isPointerBlocker = true;

        this.ui.BG = GUI.CreateImage( "BG", px(0), px(0), px(uiSizeRatio*310)/*px(310)*/, /*px(500)*/1, CHATUI_PATH+"Chat_bg.png", GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        this.ui.wrapper.addControl( this.ui.BG);

        this.ui.whisperTargetText = GUI.CreateText( px(5), px(-83), "", "Violet", uiSizeRatio*9, GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.wrapper.addControl( this.ui.whisperTargetText );
        
        this.ui.topButton.bg = GUI.CreateImage( "topButton_BG", px(5), px(10), px(uiSizeRatio*270), px(uiSizeRatio*30), CHATUI_PATH+"Chat_upper_empty.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        this.ui.wrapper.addControl( this.ui.topButton.bg );        

        var fitTargetHeight = window.innerHeight-GUI.getResolutionCorrection( 150, false );
        var fitResultHeight = GUI.getResolutionCorrection( fitTargetHeight, false );
        var ratio = fitTargetHeight/fitResultHeight;
        this.ui.listView = new GUI.createScrollView( this.ui.wrapper, "listView", px(3), px(-20), px(uiSizeRatio*300), px(uiSizeRatio*fitTargetHeight*ratio), 1.1, true, GUI.ALIGN_LEFT, GUI.ALIGN_CENTER );

        var buttonSize = [ 41, 38, 39, 43, 49, 39 ];
        var offset = 11;

        var createTopButton = function(i)
        {            
            self.ui.topButton.button[ i ] = GUI.CreateButton( "chatTypeButton", px(offset), px(10), px(uiSizeRatio*buttonSize[i]), px(uiSizeRatio*30), CHATUI_PATH+"Chat_btn_"+(i+1)+"_off.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
            self.ui.wrapper.addControl( self.ui.topButton.button[i] );

            offset += uiSizeRatio*buttonSize[i]+uiSizeRatio*2;

            self.ui.topButton.button[i].onPointerUpObservable.add( function()
            {
                self.selectViewFilterType(i);   
            });
        }
        
        for ( var i = 0; i <= CHAT_DATA.TYPE.IGNORE; ++i )
        {
            createTopButton(i);
        }

        this.ui.closeBtn = GUI.CreateButton( "chat_closeBtn", px(uiSizeRatio*276), px(uiSizeRatio*10), px(uiSizeRatio*30), px(uiSizeRatio*30), CHATUI_PATH+"Chat_x.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        this.ui.wrapper.addControl( this.ui.closeBtn );
        this.ui.closeBtn.onPointerUpObservable.add( function()
        {
            self.closeChatPopup();
        } );

        
        var inputBG = GUI.CreateImage( "inputBG", px(uiSizeRatio*5), px(uiSizeRatio*-50), px(uiSizeRatio*225), px(uiSizeRatio*31), CHATUI_PATH+"Chat_word.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.wrapper.addControl( inputBG );

        this.ui.inputText = GUI.createInputText( "uiInputText",
        px(uiSizeRatio*5),
        px(uiSizeRatio*-52),
        px(uiSizeRatio*225),
        px(uiSizeRatio*30),
        this.defaultText,
        "White",
        uiSizeRatio*15,
        GUI.ALIGN_LEFT,
        GUI.ALIGN_BOTTOM );

        this.ui.inputText.onFocusObservable.add ( function()
        {
            if ( self.ui.inputText.text == self.defaultText )
                self.ui.inputText.text = "";
            else if ( self.currentSendFilterType == CHAT_DATA.TYPE.WHISPER )
                self.ui.inputText.text = "";
        });

        this.ui.inputText.onBlurObservable.add ( function()
        {
            
        });

        this.ui.wrapper.addControl( this.ui.inputText );
        

        this.ui.sendButton = GUI.CreateButton( "sendButton", px(uiSizeRatio*235), px(uiSizeRatio*-50), px(uiSizeRatio*69), px(uiSizeRatio*31), CHATUI_PATH+"Chat_send.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.wrapper.addControl( this.ui.sendButton );
        this.ui.sendButton.onPointerUpObservable.add( function()
        {
            self.onClickSendChatButton();
            
        });


        this.ui.sendTypeBtn = GUI.CreateButton( "sendTypeBtn", px(uiSizeRatio*5), px(uiSizeRatio*-10), px(uiSizeRatio*97), px(uiSizeRatio*31), CHATUI_PATH+"Chat_btn_all.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.wrapper.addControl( this.ui.sendTypeBtn );
        this.ui.sendTypeBtn.onPointerUpObservable.add( function()
        {
            if ( self.ui.sendTypeBtnExpand[1].isVisible )
                self.hideSendFilterButtonExpand();
            else
                self.showSendFilterButtonExpand();
        });

        var createSendTypeExpandButton = function(i)
        {
            self.ui.sendTypeBtnExpand[i] = GUI.CreateButton( "sendTypeBtnExpand"+i, px(uiSizeRatio*5), px(-45 -(uiSizeRatio*35*(i-1))), px(uiSizeRatio*97), px(uiSizeRatio*31), CHATUI_PATH+"Chat_btn_up2.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
            self.ui.sendTypeBtnExpand[i].addControl( GUI.CreateText( px(0), px(0), CHAT_DATA.TYPESTRING[i], "WHITE", 13, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );

            self.ui.sendTypeBtnExpand[i].onPointerUpObservable.add( function()
            {
                self.selectSendFilterType( i );
                self.hideSendFilterButtonExpand();
            });

            self.ui.wrapper.addControl( self.ui.sendTypeBtnExpand[i] );
        }

        for ( var i = CHAT_DATA.TYPE.NORMAL; i <= CHAT_DATA.TYPE.WHISPER; ++i )
        {
            createSendTypeExpandButton(i);
        }
        this.hideSendFilterButtonExpand();

        this.ui.macroBtn = GUI.CreateButton( "macroBtn", px(uiSizeRatio*205), px(uiSizeRatio*-10), px(uiSizeRatio*97), px(uiSizeRatio*31), CHATUI_PATH+"Chat_btn_m.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.wrapper.addControl( this.ui.macroBtn );

        // this.ui.currentChannelText = GUI.CreateText( px(115), px(-20), "현재 채널:월드", "WHITE", 12, GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        // this.ui.wrapper.addControl( this.ui.currentChannelText );

        // 채널선택 버튼 비활성화
        /*
        this.ui.channelBtn = GUI.CreateButton( "channelBtn", px(209), px(-10), px(97), px(31), CHATUI_PATH+"Chat_btn_channel.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        this.ui.wrapper.addControl( this.ui.channelBtn );
        */
    }

    // 열려있는지
    FChatManager.prototype.isOpened = function()
    {
        return this.showing;
    }

    // 채팅 UI 열기
    FChatManager.prototype.openChatPopup = function()
    {
        this.closeChatPopup();
        
        this.ui.wrapper.height = 1;

        this.ui.wrapper.removeControl( this.ui.listView.mainPanel );
        var fitTargetHeight = window.innerHeight-GUI.getResolutionCorrection( 150, false );
        var fitResultHeight = GUI.getResolutionCorrection( fitTargetHeight, false );
        var ratio = fitTargetHeight/fitResultHeight;
        this.ui.listView = new GUI.createScrollView( this.ui.wrapper, "listView", px(3), px(-20), px(300), px(fitTargetHeight*ratio), 1.1, true, GUI.ALIGN_LEFT, GUI.ALIGN_CENTER );

        G.guiMain.addControl( this.ui.wrapper, GUI.LAYER.POPUP );
        FPopup.openAnimation( this.ui.wrapper );

        this.showing = true;
    }

    // 채팅 UI 닫기
    FChatManager.prototype.closeChatPopup = function()
    {
        G.guiMain.removeControl( this.ui.wrapper );

        this.showing = false;
    }

    // 표시할 채팅타입 설정하기
    FChatManager.prototype.selectViewFilterType = function( in_selectType )
    {
        this.currentViewFilterType = in_selectType;

        for ( var i = 0; i <= CHAT_DATA.TYPE.IGNORE; ++i )
        {
            if ( i == in_selectType )
                GUI.changeButtonImage( this.ui.topButton.button[i], CHATUI_PATH+"Chat_btn_"+(i+1)+"_on.png" );
            else
                GUI.changeButtonImage( this.ui.topButton.button[i], CHATUI_PATH+"Chat_btn_"+(i+1)+"_off.png" );
        }

        if ( in_selectType < CHAT_DATA.TYPE.SPOTUSER )
        {
            if ( in_selectType != CHAT_DATA.TYPE.ALL &&
                in_selectType != CHAT_DATA.TYPE.SPOTUSER &&
                in_selectType != CHAT_DATA.TYPE.IGNORE )
                this.selectSendFilterType( in_selectType );             

            var text = null;
            if( in_selectType== CHAT_DATA.TYPE.ALL) {
                text = this.getAllMessage();
            } else if(in_selectType == CHAT_DATA.TYPE.NORMAL) {
                text = this.getWorldMessage();
            } else if(in_selectType == CHAT_DATA.TYPE.SPOT) {
                text = this.getSpotMessage();
            } else if(in_selectType == CHAT_DATA.TYPE.WHISPER) {
                text = this.getWhisperMessage();
            }
            
            this.applyChatdataToListUI(text);
        }
        else
        {
            if(in_selectType == CHAT_DATA.TYPE.SPOTUSER)
                this.refreshSpotUserUI();
        }
    }

    
    // 보낼 채팅타입 확장 버튼들 열기
    FChatManager.prototype.showSendFilterButtonExpand = function()
    {
        for ( var i = CHAT_DATA.TYPE.NORMAL; i <= CHAT_DATA.TYPE.WHISPER; ++i )
        {
            FPopup.openAnimation( this.ui.sendTypeBtnExpand[i] );
            this.ui.sendTypeBtnExpand[i].isVisible = true;
        }
    }

    // 보낼 채팅타입 확장 버튼들 닫기
    FChatManager.prototype.hideSendFilterButtonExpand = function()
    {
        for ( var i = CHAT_DATA.TYPE.NORMAL; i <= CHAT_DATA.TYPE.WHISPER; ++i )
            this.ui.sendTypeBtnExpand[i].isVisible = false;
    }

    // 채팅 리스트뷰 채팅들 지우기
    FChatManager.prototype.clearChatMessageUI = function()
    {
        this.ui.listView.clearItem();
    }


    /**
     * @description 한번에 여러 채팅들 추가하기 ( 위쪽 보기 필터 눌렀을때 해당 필터에 해당하는 채팅들을 불러와서 표시할때 사용 )
     * @param {Array} in_chatDataList // onRecvMessage 에서 받아서 구성한 텍스트데이터 배열
     */
    FChatManager.prototype.applyChatdataToListUI = function( in_chatDataList )
    {
        var self = this;

        this.clearChatMessageUI();

        var addNextChatMessageUI = function( in_index )
        {
            self.addChatMessageUI( in_chatDataList[ in_index ], ( in_index == (in_chatDataList.length-1)), function()
            {
                if ( in_index+1 < in_chatDataList.length )
                {
                    addNextChatMessageUI( in_index+1 );
                }
            })
        }

        if ( in_chatDataList.length > 0 )
            addNextChatMessageUI( 0 );

        // for ( var i = 0; i < in_chatDataList.length; ++i )
        // {
        //     this.addChatMessageUI( in_chatDataList[i], ( i == (in_chatDataList.length-1)) );
        // }
    }

    FChatManager.prototype.getColorFromChatType = function( in_chatType )
    {
        var color = "White";

        switch( in_chatType )
        {
        case CHAT_DATA.TYPE.NORMAL :
            {
                color = "White";
            }
            break;

        case CHAT_DATA.TYPE.SPOT :
            {
                color = "SkyBlue";
            }
            break;

        case CHAT_DATA.TYPE.WHISPER : 
            {
                color = "Violet";
            }
            break;

        case CHAT_DATA.TYPE.SYSTEM:
            {
                color = 'Orange';
            }
            break;
        }

        return color;
    }



    // 강제 귓속말 세팅하기
    FChatManager.prototype.forceSetWhisperMode = function( in_toID )
    {
        this.selectSendFilterType( CHAT_DATA.TYPE.WHISPER );
        this.ui.inputText.text = in_toID;
        this.onClickSendChatButton();
    }





    // 입장, 사람들어왔을떄, 사람나갔을떄 등등 이거 불러준다
    FChatManager.prototype.refreshSpotUserUI = function()
    {
        if ( this.currentViewFilterType != CHAT_DATA.TYPE.SPOTUSER )
            return;

        var users = G.dataManager.dataChannel.getUsers();  
        this.createSpotUserListUI( users );
    }

    // 스팟 회원 리스트 받아서 ui구성
    FChatManager.prototype.createSpotUserListUI = function( in_spotUserList )
    {
        this.clearChatMessageUI();
        for ( var i = 0; i < in_spotUserList.length; ++i )
        {
            this.ui.listView.addItem( this.makeSpotUserUI( in_spotUserList[i] ) );
        }
    }

    // 스팟 회원 각각 정보 받아서 리스트 아이템 구성
    FChatManager.prototype.makeSpotUserUI = function( in_spotUser )
    {
        var wrapper = GUI.createContainer();
        wrapper.width = GUI.getResolutionCorrection( px(300) );
        wrapper.height = GUI.getResolutionCorrection( px(63) );
        
        var bg = GUI.CreateImage( "bg", px(0), px(0), px(298), px(62), CHATUI_PATH + "Chat_findperson.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        wrapper.addControl( bg );

        var idText = GUI.CreateText( px(75), px(-2), in_spotUser.id, "Black", 13, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        wrapper.addControl( idText );

        var ignoreButton = GUI.CreateButton( "ignoreButton", px(240), px(-2), px(40), px(40), CHATUI_PATH + "Chat_on.png", GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        wrapper.addControl( ignoreButton );
        var changed = false;
        ignoreButton.onPointerUpObservable.add( function()
        {
            if ( changed )
                GUI.changeButtonImage( ignoreButton, CHATUI_PATH + "Chat_on.png" );
            else
                GUI.changeButtonImage( ignoreButton, CHATUI_PATH + "Chat_off.png" );

            changed = !changed;
        });

        var profile = GUI.CreateCircleButton( "profile", px(10), px(0), px(50), px(50), PROFILE_PATH + in_spotUser.profile, GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE, true, "white" );
        wrapper.addControl( profile );
        profile.onPointerUpObservable.add( function()
        {
            snsCommonFunc.openMypage(in_spotUser.pk);
        });

        return wrapper;
    }

    // UI 관련부분 끝 //<------------------------------------------------------------------------------------------------------------>//


    
    // call from runnableManager
    FChatManager.prototype.run = function()
    {
        // if ( this.ui.listView != null )
        //     this.ui.listView.procLoop();

        // if ( this.prevUI.listView != null )
        //     this.prevUI.listView.procLoop();
    }

    return FChatManager;
}());