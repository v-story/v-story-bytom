'use strict'

var INTERACTION_PATH = GUI.DEFAULT_IMAGE_PATH_NEW + "16_interaction/interaction/"

// var INTERACTION_DATA = 
// {
//     RES_DATA :
//     {
//         id_1 : "interaction_icon2.png",                     // 인사하기
//         id_2 : "interaction_icon2.png",                    // 대화하기
//         id_3 : "interaction_icon2.png",                    // 알아가기
//         id_4 : "interaction_icon2.png",                    // 칭찬하기
//         id_5 : "interaction_icon2.png",                    // 하루에 대해 이야기하기
//         id_6 : "interaction_icon2.png",                    // 농담하기
//         id_7 : "interaction_icon2.png",                    // 악수하기
//         id_8 : "interaction_icon2.png",                    // 재미있게 해주기
//         id_9 : "interaction_icon2.png",                    // 어깨 인사
//         id_10 : "interaction_icon3.png",                    // 친밀하게 대화하기
//         id_11 : "interaction_icon2.png",                    // 주먹인사
//         id_12 : "interaction_icon4.png",                    // 하이파이브
//         id_13 : "interaction_icon2.png",                    // 장난치기
//         id_14 : "interaction_icon2.png",                    // 깊은 대화 나누기
//         id_15 : "interaction_icon2.png",                    // 손잡기
//         id_16 : "interaction_icon2.png",                    // 볼에 뽀뽀하기
//         id_17 : "interaction_icon2.png",                    // 손등에 키스하기
//         id_18 : "interaction_icon5.png",                    // 딥 키스하기
//         id_19 : "interaction_icon2.png",                    // 팔짱끼기        

//         max : 20
//     }
// }

var FInteractionMenu = (function()
{
    function FInteractionMenu()
    {
        this.ui = 
        {
            wrapper : null,

            BG : null,
            profileIcon : null,
            
            targetText : null,
            stateText : null,

            barwrapper : null,
            bar : null,

            infoButton : null,
            whisperButton : null,
            actButtonList : [],
        }

        this.targetInfo = null;
        this.activeActionList = null;
        this.onClickActionBtnCallback = null;

        //
        // init
        //
        this.initUI();
    }

    FInteractionMenu.prototype.initUI = function()
    {
        var self = this;

        this.ui.wrapper = GUI.createContainer();
        this.ui.wrapper.isPointerBlocker = true;
        this.ui.wrapper.width = GUI.getResolutionCorrection( px(200) );
        this.ui.wrapper.height = GUI.getResolutionCorrection( px(200) );
        this.ui.wrapper.verticalAlignment = GUI.ALIGN_TOP;        

        this.ui.BG = GUI.CreateImage( "bg", px(0), px(10), px(196), px(54), INTERACTION_PATH+"interaction_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        this.ui.wrapper.addControl( this.ui.BG );

        this.ui.profileIcon = GUI.CreateCircleButton( "icon", px(-71), px(11), px(52), px(52), "../fileupload/myprofile/profile_default.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP, false, "white" );
        this.ui.wrapper.addControl( this.ui.profileIcon );

        this.ui.targetText = GUI.CreateText( px(0), px(25), "Init TargetText", "Black", 12, GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        this.ui.wrapper.addControl( this.ui.targetText );

        this.ui.stateText = GUI.CreateText( px(-10), px(27), "State", "Navy", 9, GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        this.ui.wrapper.addControl( this.ui.stateText );

        this.ui.barwrapper = GUI.createContainer();
        this.ui.barwrapper.width = GUI.getResolutionCorrection( px(0) );
        this.ui.barwrapper.height = GUI.getResolutionCorrection( px(8) );
        this.ui.barwrapper.left = GUI.getResolutionCorrection( px(61) );
        this.ui.barwrapper.top = GUI.getResolutionCorrection( px(42) );
        this.ui.barwrapper.horizontalAlignment = GUI.ALIGN_LEFT;
        this.ui.barwrapper.verticalAlignment = GUI.ALIGN_TOP;        

        this.ui.bar = GUI.CreateImage( "bar", px(0), px(0), px(128), px(8), INTERACTION_PATH+"interaction_bar.png", GUI.ALIGN_LEFT, GUI.ALIGN_MIDDLE );
        this.ui.barwrapper.addControl( this.ui.bar );
        
        this.ui.wrapper.addControl( this.ui.barwrapper );

        this.ui.infoButton = GUI.CreateButton( "icon", px(-40), px(60), px(25), px(25), INTERACTION_PATH+"interaction_icon2.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        this.ui.wrapper.addControl( this.ui.infoButton );
        this.ui.infoButton.onPointerUpObservable.add( function()
        {
            if ( self.targetInfo != null )
            snsCommonFunc.openMypage(self.targetInfo.user.pk);
        })

        this.ui.whisperButton = GUI.CreateButton( "whisperButton", px(-10), px(60), px(25), px(25), INTERACTION_PATH+"interaction_icon1.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        this.ui.wrapper.addControl( this.ui.whisperButton );
        this.ui.whisperButton.onPointerUpObservable.add( function()
        {
            if ( self.targetInfo != null )
                self.onClickWhisperButton();
        })

        var act_id = G.dataManager.getAct();
        for ( var i = 1; i < act_id.length; ++i )
        {            
            this.ui.actButtonList.push( GUI.CreateButton( i.toString(), px(0), px(60), px(25), px(25), INTERACTION_PATH+act_id[i].act_icon, GUI.ALIGN_CENTER, GUI.ALIGN_TOP ) );
        }
    }

    // FInteractionMenu.prototype.getResourcePathFromActID = function( in_id )
    // {
    //     return INTERACTION_DATA.RES_DATA[ "id_"+in_id ];
    // }

    FInteractionMenu.prototype.onClickWhisperButton = function()
    {
        G.chatManager.openChatPopup();
        G.chatManager.forceSetWhisperMode( this.targetInfo.user.id );
    }

    FInteractionMenu.prototype.onInteractionLevelUpEffect = function( in_targetMesh, in_newGrade )
    {
        
    }

    FInteractionMenu.prototype.changeExpBarPercent = function( in_ratio, in_isLevelUp, in_onEndAniFunc, in_newLevelText )
    {        
        var self = this;

        var originWidth = GUI.getResolutionCorrection( 128, false );
        var targetWith = originWidth*in_ratio;
        var finishAniFunc = function()
        {
            if ( in_isLevelUp )
            {
                self.ui.stateText.text = in_newLevelText;
                self.ui.barwrapper.width = px(0);
                self.changeExpBarPercent( in_ratio, false, in_onEndAniFunc );  
            }

            if ( in_onEndAniFunc != undefined )
                in_onEndAniFunc();
        }

        var barAni = new BABYLON.Animation( "barAni", "width", 120, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var key = [];
        key.push({frame:0, value: parseInt( this.ui.barwrapper.width )});
        if ( in_isLevelUp )
        {
            key.push({frame:120, value: originWidth});
        }
        else
            key.push({frame:120, value: targetWith});
            
        barAni.setKeys( key );
        
        CommFunc.useEasingFuncToAnimation( barAni );
        
        var ani = G.scene.beginDirectAnimation( this.ui.barwrapper, [barAni], 0, 120, false, 1, function()
        {
            finishAniFunc();
        } );
    }

    FInteractionMenu.prototype.showMenu = function( in_targetInfo, in_activeActionList, in_onClickActionBtnCallback )
    {
        this.closeInteractionMenu();

        this.onClickActionBtnCallback = in_onClickActionBtnCallback;
        this.setTargetInfo( in_targetInfo );
        this.setActiveActionList( in_activeActionList );

        G.guiMain.addControl( this.ui.wrapper );
        FPopup.openAnimation( this.ui.wrapper );

    }

    FInteractionMenu.prototype.setTargetInfo = function( in_targetInfo )
    {
        this.targetInfo = in_targetInfo;

        GUI.changeButtonImage( this.ui.profileIcon.getChildByName( "icon" ), PROFILE_PATH+in_targetInfo.user.profile );
        this.ui.targetText.text = in_targetInfo.user.id; 

        var myGender = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).gender;
        var yourGender = in_targetInfo.user.gender;

        this.ui.stateText.text = G.dataManager.getInteractionGradeName(myGender, yourGender, in_targetInfo.info.level);

        
        var user = G.dataManager.dataChannel.getUserInfo(in_targetInfo.info.accountPk);

        var myGender = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).gender;
        var yourGender = user.gender;

        var maxExp = G.dataManager.getInteractionMaxExp( myGender, yourGender, in_targetInfo.info.level );

        this.ui.barwrapper.width = px(GUI.getResolutionCorrection( 128, false )*(in_targetInfo.info.exp / maxExp));
    }

    FInteractionMenu.prototype.getActionButtonFromActID = function( in_id )
    {
        for ( var i = 0; i < this.ui.actButtonList.length; ++i )
        {
            if ( this.ui.actButtonList[i].name == in_id.toString() )
                return this.ui.actButtonList[i];
        }
    }

    FInteractionMenu.prototype.setActiveActionList = function( in_activeActionList )
    {        
        var self = this;

        this.activeActionList = [];

        in_activeActionList.forEach( function( in_iter )
        {
            self.activeActionList.push( in_iter );
        });

        for ( var i = 0; i < this.ui.actButtonList.length; ++i )
        {
            this.ui.wrapper.removeControl( this.ui.actButtonList[i] );

            this.ui.actButtonList[i].onPointerUpObservable.clear();
        }
        
        var procEachActionButton = function( in_id, in_order )
        {
            var button = self.ui.actButtonList[i];
            var posX = 2+in_order;

            button.onPointerUpObservable.add( function ()
            {
                self.onClickActionBtnCallback( Number(button.name) );
            });

            button.left = GUI.getResolutionCorrection( px( -40 + (30*(posX)) ));

            self.ui.wrapper.addControl( button );
        }

        var order = 0;
        for ( var i = 0; i < in_activeActionList.length; ++i )
        {
            procEachActionButton( in_activeActionList[i], order++ );
        }
    }

    FInteractionMenu.prototype.closeInteractionMenu = function()
    {
        G.guiMain.removeControl( this.ui.wrapper );
    }

    FInteractionMenu.prototype.showActionReceiveIcon = function( in_receiveActionID, in_targetMesh, in_onClickCallBack )
    {
        var wrapper = GUI.createContainer();
        wrapper.isPointerBlocker = true;
        wrapper.width = GUI.getResolutionCorrection( px(40) );
        wrapper.height = GUI.getResolutionCorrection( px(40) );        

        // var text = GUI.CreateText( px(0), px(0), "감정표현 요청", "Navy", 8, GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        // wrapper.addControl( text );
        var act_id = G.dataManager.getAct();
        var button = GUI.CreateButton( "button", px(0), px(-10), px(26), px(26), INTERACTION_PATH+act_id[in_receiveActionID].act_icon, GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        wrapper.addControl( button );

        var cover = GUI.CreateImage( "cover", px(1), px(0), px(26), px(26), INTERACTION_PATH+"cover_"+act_id[in_receiveActionID].act_icon, GUI.ALIGN_LEFT, GUI.ALIGN_CENTER );
        button.addControl( cover );
        cover.alpha = 0.35;

        var decreaseAni = new BABYLON.Animation( "decreaseAni", "width", 120, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var key = [];
        key.push({frame:0, value: GUI.getResolutionCorrection( 0, false )});
        key.push({frame:120, value: GUI.getResolutionCorrection( 23, false )});
        decreaseAni.setKeys( key );

        button.onPointerUpObservable.add( function()
        {
            in_onClickCallBack();

            G.guiMain.removeControl( wrapper );

            ani.stop();
        });
        
        G.guiMain.addControl( wrapper );
        wrapper.linkWithMesh( in_targetMesh );
        wrapper.linkOffsetY = -120;

        FPopup.openAnimation( wrapper );
        
        FPopup.openAnimation( button, undefined, 1.0, true, 1.5 );
        
        var ani = G.scene.beginDirectAnimation( cover, [decreaseAni], 0, 120, false, 0.1, function()
        {
            G.guiMain.removeControl( wrapper );

            wrapper.dispose();
            wrapper = null;
        } );
    }

    FInteractionMenu.prototype.showActionRequestIcon = function( in_targetMesh )
    {
        var wrapper = GUI.createContainer();
        wrapper.isPointerBlocker = true;
        wrapper.width = GUI.getResolutionCorrection( px(40) );
        wrapper.height = GUI.getResolutionCorrection( px(40) );        

        // var text = GUI.CreateText( px(0), px(0), "감정표현 요청", "Navy", 8, GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        // wrapper.addControl( text );
        var act_id = G.dataManager.getAct();
        var button = GUI.CreateButton( "button", px(0), px(-10), px(30), px(30), INTERACTION_PATH+"btn_inter.png", GUI.ALIGN_CENTER, GUI.ALIGN_BOTTOM );
        wrapper.addControl( button );

        var cover = GUI.CreateImage( "cover", px(1), px(0), px(30), px(30), INTERACTION_PATH+"btn_inter_shadow.png", GUI.ALIGN_LEFT, GUI.ALIGN_CENTER );
        button.addControl( cover );
        cover.alpha = 0.35;

        var decreaseAni = new BABYLON.Animation( "decreaseAni", "width", 120, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var key = [];
        key.push({frame:0, value: GUI.getResolutionCorrection( 0, false )});
        key.push({frame:120, value: GUI.getResolutionCorrection( 23, false )});
        decreaseAni.setKeys( key );

        button.onPointerUpObservable.add( function()
        {
            G.guiMain.removeControl( wrapper );

            ani.stop();
        });
        
        G.guiMain.addControl( wrapper );
        wrapper.linkWithMesh( in_targetMesh );
        wrapper.linkOffsetY = -100;

        FPopup.openAnimation( wrapper );
        
        FPopup.openAnimation( button, undefined, 1.0, true, 1.5 );
        
        var ani = G.scene.beginDirectAnimation( cover, [decreaseAni], 0, 120, false, 0.1, function()
        {
            G.guiMain.removeControl( wrapper );

            wrapper.dispose();
            wrapper = null;
        } );
    }

    var instance;
    return {
        getInstance: function(){
            if (instance == null) {
                instance = new FInteractionMenu();
                // Hide the constructor so the returned objected can't be new'd...
                instance.constructor = null;
            }
            return instance;
        }
   }; 
}());