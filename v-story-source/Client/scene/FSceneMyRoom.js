'use strict';


// var apps = [{id:34,name:'My App',another:'thing'},{id:37,name:'My New App',another:'things'}];

// // get index of object with id:37
// var removeIndex = apps.map(function(item) { return item.id; }).indexOf(37);

// // remove object
// apps.splice(removeIndex, 1);


// $('form').submit(function(e){
//     e.preventDefault();
//     alert($('#m').val());
// });


// var MYROOM_FIRSTVISIT = true;


var postString = null;
//<---------------------------------------------------------------------------------------------------------------------
var createGusetKey = function(postObject) {

    postString = postObject;

    var json;
        
    json = protocol.createGuestKey(postObject['POST_SEQ']);
    ws.onRequest(json, createGusetKeyCB, this);

    // alert(postObject);
}

var createGusetKeyCB = function(res, self) {
    
    // alert('callback');

    createGusetCallback(res, postString);
}


//SNS에서 친구집에 가기 눌렀을 때 콜백
var goFriendFromSNS = function(accountPk, url, avatarCd) {
    G.dataManager.setFriendInfo(accountPk, avatarCd, url);

    if(G.sceneMgr.getCurrentScene().name != 'FSceneBeach') {
        
        G.sceneMgr.getCurrentScene().goMyFriend(true);

    } else {

        G.sceneMgr.getCurrentScene().goMyFriend(false);
    }
}

// //프로필 수정했다면 여기로 콜백
// var changeProfileFromSNS = function(url) {

//     G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setUrl(url);

//     var name = G.sceneMgr.getCurrentSceneName();
//     if(name != 'SCENE_MYROOM') return;

//     var scene = G.sceneMgr.getCurrentScene();
//     scene.changeProfileUrl(url);
//     scene.changeMyAvatar(url);
// }


var SQtype = {
    UNDEFIND : -1,
    PRODUCE : 0, 
    CONSUME : 1, 
    SHARE : 2 
};




var FSceneMyRoom = (function () {

    __inherit(FSceneMyRoom, FRoom);

    function FSceneMyRoom() {

        var self = this;

        this.setName(CommFunc.nameGuid('FSceneMyRoom'));
        G.eventManager.setEnableTouched(this.getName(), this);
 
        // this.ALPHA          = 130*Math.PI/180; //2.2;
        // this.ROTATION_ALPHA = 180*Math.PI/180;
        // this.QUATER_BETA    = 45*Math.PI/180;//0.90;

        this.sx = -1;
        this.sy = -1;

        this.preState = -1;

        this.FSocialQuest = null;

        this.wrapBtn        = null;
        this.wrapTopInfo    = null;
        this.wrapBtnSocial  = null;
        this.wrapContents   = null;
        
        this.mainScrollView = null;

        this.myPet          = null;

        this.friends        = null;
        this.car            = null;

        this.giftbox = [];


        this.bRenderStarCon = false;
        this.bNewMakeStarCon = false;

        this.scThread = null;
        this.initLoad = false;

        this.loadAvatarState = null;
        this.netState = null;

        this.lensEffect = null;


        this.beInitLoaded = false;

        // this.myCamera = null;
        this.myProfile = null;
        
        this.donePreloadAvatar      = null;

        this.loadAndroidId      = null;
        this.loadPetId          = null;
        this.snsFriendId        = null;
        this.suggestFriendId    = null;
        this.startSuggest       = null;

        this.advertise          = null;
        this.videoTexture       = null;

        this.nameScreen         = ["theme_01_screen_01", "theme_01_screen_02", "theme_01_screen_03"];

        showTip();

        return self;
    }

    FSceneMyRoom.prototype.init = function () {

        FRoom.prototype.init.call(this);
        
        this.loadAvatarState = LOS.NONE;
        this.videoTexture = [];
        this.advertise    = {};
        // CommFunc.createSceneInstrumentaion(G.scene);

        this.loadBackground();
        //화면 전체 UI를 담고 있을 것이다.
        // if(G.guiMain) G.guiMain.dispose();
        // G.guiMain = new GUI.createMainGUI('ADVANCEDDYNAMICTEXTURE');

        // G.loading.displayLoading();

        this.goMyRoom();

        this.initSceneCamera();
        
        GUI.initLevelOfAlphaUI();
        G.guiMain.setAlpha( 0 );


        // AI 관련데이터 요청
        //G.aiButlerManager.requestMatchingInfoTodayQuestList();

        // 카메라 값 세팅
        G.cameraManager.setCameraLimitInfo( -550, 300, -250, 450, 160, 2000, 470, ToRadians(-45), ToRadians(55) );  

        // snsCommonFunc.setStarContentSequence(this.selectStarContentSequence, this);
        snsCommonFunc.chatTitleLender(this.getSceneNameToString(1));

        showTip();
    };


    FSceneMyRoom.prototype.destroy = function () {
        G.cameraManager.clearTarget();

        clearTimeout(this.loadAndroidId);
        clearTimeout(this.loadPetId);
        clearTimeout(this.snsFriendId);
        clearTimeout(this.suggestFriendId);
        clearTimeout(this.startSuggest);

        this.loadAndroidId      = null;
        this.loadPetId          = null;
        this.snsFriendId        = null;
        this.suggestFriendId    = null;
        this.startSuggest       = null;

        if(this.car != null) {
            this.car.forEach(function(car){
                car.destroy();
            });
        }
        this.car = null;


        if(this.friends != null) {
            this.friends.forEach(function(friend){
                friend.destroy();
            });
        }
        this.friends = null;


        if(this.giftbox != null) {
            this.giftbox.forEach(function(box){
                box.destroy();
            });
        }
        this.giftbox = null;


        
        FRoomUI.getInstance().setUIVisible( false );
        
        CommFunc.arrayRemoveAll(this.car);
        CommFunc.arrayRemoveAll(this.friends);

        CommFunc.arrayRemoveAll(this.giftbox);

        CommRender.clearStarContents(G.guiMain);

        GUI.removeContainer(self.wrapBtn);          self.wrapBtn = null;
        GUI.removeContainer(self.wrapBtnSocial);    self.wrapBtnSocial = null;
        GUI.removeContainer(self.wrapTopInfo);      self.wrapTopInfo = null;
        G.guiMain.dispose();

        G.scene.removeCamera(G.camera);
        G.camera.detachControl(G.canvas);
        G.eventManager.clearEnableTouched(this.getName());
        G.camera.inputs.clear(); 
        G.camera.dispose();

        CommFunc.removeLight();

        FMapManager.getInstance().destroy();
        FObjectManager.getInstance().destroy();

        G.soundManager.stopSound();


        this.clearGrid();


        this.textureDispose(this.nameScreen[0]);
        this.textureDispose(this.nameScreen[1]);
        this.textureDispose(this.nameScreen[2]);

        FRoom.prototype.destroy.call(this);        
    };


    //<------------------------------------------------------------------------------------------------------------------
    //나의 집으로 가기
    FSceneMyRoom.prototype.goMyRoom = function() {

        var self = this;

        var roomID = 100000 + G.dataManager.getUsrMgr(DEF_IDENTITY_ME).roomType;
        // var backID = "home_ground_01";

        FMapManager.getInstance().createMapData(roomID, function() {

            self.preloadAvatar();
            
        });

        this.loadRoomMesh(roomID, null, function(){

            
            FMapManager.getInstance().clearAllObjectMap();
            G.resManager.clearAllMesh();

            self.netState = LOS.NET_SNSFRIEND;
            //self.loadAvatarState = LOS.MYAVATAR;

            self.getAdInfo("맥도날드", self, function(self){
                self.renderAdScreenVideo(self.advertise["맥도날드"].url, self.nameScreen[2]);

                self.getAdInfo("dior", self, function(self){
                    self.renderAdScreenVideo(self.advertise["dior"].url, self.nameScreen[1]);

                    self.getAdInfo("nike", self, function(self){
                        self.renderAdScreenVideo(self.advertise["nike"].url, self.nameScreen[0]);
                        // self.renderAdScreenVideo("/fileupload/share/video/78_1536909214170_1.mp4", self.nameScreen[0]);
                    });
                });
         

            });
         });
    }

    FSceneMyRoom.prototype.wsSendGetObjectMap = function() {
        var json;
        
        json = protocol.getObjectMap(1);
        ws.onRequest(json, this.getObjectMapCB, this);
    }

    FSceneMyRoom.prototype.getObjectMapCB = function(res, self) {
        
        protocol.res_getObjectMap(res);

        self.netState = LOS.NET_GETSHAREOBJ;
    }


    FSceneMyRoom.prototype.wsSendSuggestFriend = function(){

        var json;

        json = protocol.getSuggestFriend();
        ws.onRequest(json, this.suggestFriendCB, this);
    }


    FSceneMyRoom.prototype.suggestFriendCB = function(res, self) {

        protocol.res_getSuggestFriend(res);

        self.netState = LOS.NET_GETMYSTAR;
    }

    FSceneMyRoom.prototype.wsSendGetStarContents = function() {
        
        var json;

        json = protocol.getStarContents();
        ws.onRequest(json, this.getStarContentsCB, this);
    }

    FSceneMyRoom.prototype.getStarContentsCB = function(res, self) {
        
        protocol.res_getStarContents(res);

        self.updateStartContents();

        self.netState = LOS.NET_GETOBJECTMAP;
    }

    FSceneMyRoom.prototype.wsGetMyStarContents = function() {

        var json;

        json = protocol.getMyStarContents();
        ws.onRequest(json, this.getMyStarContentsCB, this);
    }

    FSceneMyRoom.prototype.getMyStarContentsCB = function(res, self) {

        protocol.res_getMyStarContents(res);

        self.netState = LOS.NET_GETSTAR;
    }

    FSceneMyRoom.prototype.wsSendSNSQuestLoad = function() {
        
        var json;
        json = protocol.getSNSQuest();
        ws.onRequest(json, this.getSNSQuestCB, this);
    }
    
    FSceneMyRoom.prototype.getSNSQuestCB = function(res, self) {
        
        protocol.res_getSNSQuest(res);

        self.netState = LOS.NET_SUGGESTFRIEND;

        //
        // self.wsGetShareObjList();
        self.setUIOption();
    }


    FSceneMyRoom.prototype.wsGetShareObjList = function() {
        
        var json;

        json = protocol.getShareObjList();
        ws.onRequest(json, this.getShareObjListCB, this);
    }

    
    FSceneMyRoom.prototype.preloadAvatar = function() {

        G.resManager.loadBaseAvatar(this, function(self){

            self.donePreloadAvatar = true;
            // self.loadAvatarState = LOS.MYAVATAR;
        });
    }

    
    FSceneMyRoom.prototype.getShareObjListCB = function(res, self) {
        
        protocol.res_getShareObjList(res);

        if(!self.initLoad) {

            // self.loadRoomMesh(G.dataManager.getUsrMgr(DEF_IDENTITY_ME).roomType);

            self.InitGiftBox();
            self.initVehicles();
            self.refreshUIDirection();


            self.initLoad = true;
            
            self.loadAvatarState = LOS.MYAVATAR;
            // self.loadAvatarState = LOS.SNSFRIEND;
            // self.drawGrid();
            // self.drawRealTileGrid();

            G.soundManager.preloadSound();

            if ( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).accountPk == 5 )
                G.soundManager.playBGMSound("5_bgm1.ogg");
            else if( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).accountPk == 56 )
                G.soundManager.playBGMSound("56_bgm.ogg");
            else
                G.soundManager.playBGMSound("BGM_bgm.ogg");

            // if ( MYROOM_FIRSTVISIT )
            // {            
            //     if ( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).progressState < 1 )
            //     {
            //         // 임시 - 스크립트안나오게
            //         setTimeout( function()
            //         {
            //             G.scriptManager.playScript( "300000.json", 0 );
            //         }, 1500);
            //     }

            //     MYROOM_FIRSTVISIT = false;
            // }


        }

        self.onResize();
    }


    //<------------------------------------------------------------------------------------------------------------------

    FSceneMyRoom.prototype.run = function () {

        FRoom.prototype.run.call(this);

        this.netProcess();
        this.avatarProcess();

        // if ( null != this.FInteriorShop )
        //     this.FInteriorShop.run();
        
        if ( null != this.FSocialQuest )
            this.FSocialQuest.run();

        if ( null != this.mainScrollView )
            this.mainScrollView.procLoop();
        
        GUI.procLevelOfAlphaUI();

        // if(!this.beInitLoaded && null != this.objMgr && this.objMgr.isDoneRender()) {
        //     // var now = new Date().getTime();
        //     // var loadingTime = now - starLoad;

        //     // drawLoadingTime(loadingTime);
        //     // drawInformation("로딩 완료");
        //     this.beInitLoaded = true;

        //     // startFpsRecord();

        //     // $("#loading").hide();

        //     this.setUIOption();
        // }


        return 0;
    };

    FSceneMyRoom.prototype.netProcess = function() {

        if(this.netState == LOS.NONE) return;

        switch(this.netState) {
            case LOS.NET_SNSFRIEND:
                {
                    this.wsSendSNSQuestLoad();
                }
                break;
            case LOS.NET_SUGGESTFRIEND:
                {
                    this.wsSendSuggestFriend();
                }
                break;
            case LOS.NET_GETOBJECTMAP:
                {
                    this.wsSendGetObjectMap();
                }
                break;
            case LOS.NET_GETMYSTAR:
                {
                    this.wsGetMyStarContents();
                }
                break;
            case LOS.NET_GETSTAR:
                {
                    this.wsSendGetStarContents();
                }
                break;
            case LOS.NET_GETSHAREOBJ:
                {   
                    this.wsGetShareObjList();
                }
                break;
        }

        this.netState = LOS.NONE;
    }

    FSceneMyRoom.prototype.avatarProcess = function() {

        if(this.loadAvatarState == LOS.NONE) return;

        var state = this.loadAvatarState;
        this.loadAvatarState = LOS.NONE;

        switch(state) {
            case LOS.MYAVATAR: 
                {
                    if(!this.donePreloadAvatar) return;
                    
                    this.initMyAvatar();
                }
                break;
            case LOS.SNSFRIEND:
                {
                    this.initSNSFriend();
                    // this.setUIOption();
    
                    GUI.showMainUI();
                    FRoomUI.getInstance().setUIVisible( true );
                }
                break;
            case LOS.SUGGESTFRIEND:
                {
                    this.initSUGGESTFriend();
                }
                break;
        }

        
    }

    FSceneMyRoom.prototype.changeSQFriendImage = function( in_questKind, in_profileImagePath )
    {  
        var buttonName = null;

        switch( in_questKind )
        {
            case SQtype.PRODUCE : buttonName = ROOMBUTTON.SQ_CREATE; break;
            case SQtype.CONSUME : buttonName = ROOMBUTTON.SQ_CONSUME; break;
            case SQtype.SHARE : buttonName = ROOMBUTTON.SQ_SHARE;   break;
        }

        FRoomUI.getInstance().changeButtonImage( buttonName, in_profileImagePath );
    }

    // FSceneMyRoom.prototype.changeProfileUrl = function(imgUrl) {
    //     // GUI.changeButtonImage( this.thumb, imgUrl );

    //     var self = this;
    //     GUI.changeButtonImage( this.myProfile.getChildByName( "inner" ).getChildByName( GUI.ButtonName.mainProfile ), CLIENT_DOMAIN + "/fileupload/myprofile/profile_default.png" );
    //     setTimeout( function()
    //     {
    //         GUI.changeButtonImage( self.myProfile.getChildByName( "inner" ).getChildByName( GUI.ButtonName.mainProfile ), imgUrl );            
    //     }, 500 );
    // }


    FSceneMyRoom.prototype.goAvatarRoom = function() {
        G.dataManager.setCameraInformation(G.scene.activeCamera.position, 
                                           G.scene.activeCamera.alpha, 
                                           G.scene.activeCamera.beta, 
                                           G.scene.activeCamera.radius,
                                           G.scene.activeCamera.target);
        G.sceneMgr.addScene('SCENE_AVATAR', new FSceneAvatar(true, RETURN_TO_MYROOM));
        G.sceneMgr.changeScene('SCENE_AVATAR', true);
    }

    FSceneMyRoom.prototype.openPackageShopPopup = function()
    {
        FPackageShop.getInstance().openPopup();
    }

    FSceneMyRoom.prototype.setUIOption = function()
    {
        var self = this;

        var SQCreateFunc = function()
        {
            // snsBtnClose();
            self.goSocialQuest(SQtype.PRODUCE);
        }

        var SQConsumeFunc = function()
        {            
            // snsBtnClose();
            var sq = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getQuestInfo(SQtype.CONSUME);
            var json = protocol.getSNSQuestSub(sq.QUEST_ID);
            ws.onRequest(json, self.getSNSQuestSubCB1, self);
        }

        var SQShareFunc = function()
        {
            // snsBtnClose();
            var sq = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getQuestInfo(SQtype.SHARE);
            var json = protocol.getSNSQuestSub(sq.QUEST_ID);
            ws.onRequest(json, self.getSNSQuestSubCB2, self);    
        }

        var shopBtnFunc = function()
        {
            self.openPackageShopPopup();
            return; // 옛날상점 안들어갈거임

            // if(self.FInteriorShop == null) 
            // { 
            //     self.FInteriorShop = new FInteriorShop(self.InteriorShopBtnCallback, self);
            // }

            // self.FInteriorShop.changeState(ISHOP.IS_STATE_MAIN);
            // self.SetCameraTopView(true);
            // self.animationRadius(true);

            // GUI.removeContainer(self.wrapBtnSocial);    self.wrapBtnSocial = null;
            // GUI.removeContainer(self.wrapTopInfo);      self.wrapTopInfo = null;
            
            // self.detachCamera();

            // CommRender.clearStarContents(G.guiMain);
            // self.setVisibleCharactor(false);
        }
        
        FRoomUI.getInstance().setProfileImage( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getUrl() );

        FRoomUI.getInstance().setSmileMarkCount( CommFunc.numberWithCommas(G.dataManager.getUsrMgr(DEF_IDENTITY_ME).goods.SMILE_FREE) );

        FRoomUI.getInstance().setSQImage([
            G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQInfoPath(SQtype.PRODUCE),
            G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQInfoPath(SQtype.CONSUME),
            G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQInfoPath(SQtype.SHARE)
        ]);
        
        FRoomUI.getInstance().changeButtonImage( ROOMBUTTON.STORE, ASSET_URL+"97_gui_new/00_main/btn_store.png" );

        FRoomUI.getInstance().applyUIButtonOpt([
            [ ROOMBUTTON.PROFILE, true, function(){ snsBtnOpen('타임라인') } ],

            [ ROOMBUTTON.SQ_CREATE, true, SQCreateFunc ],
            [ ROOMBUTTON.SQ_CONSUME, true, SQConsumeFunc ],
            [ ROOMBUTTON.SQ_SHARE, true, SQShareFunc ],

            [ ROOMBUTTON.STORE, true ,shopBtnFunc ],
            [ ROOMBUTTON.AVATAR, true, self.goAvatarRoom ],

            [ ROOMBUTTON.SMILE, true, null ],
            [ ROOMBUTTON.PINKSMILE, true, null ],

            [ ROOMBUTTON.SHARE, false, function(){ snsCommonFunc.snsView(15); } ]
        ]);

        FRoomUI.getInstance().refreshSQAlertIcon();
    }

    

    FSceneMyRoom.prototype.getSNSQuestSubCB1 = function(res, self){
        protocol.res_getSNSQuestSub(res);
        self.goSocialQuest(1);
    }

    FSceneMyRoom.prototype.getSNSQuestSubCB2 = function(res, self){
        protocol.res_getSNSQuestSub(res);
        self.goSocialQuest(2);        
    }

    FSceneMyRoom.prototype.goSocialQuest = function(quest) {
        if ( null == this.FSocialQuest )
            this.FSocialQuest = new FSocialQuest(quest, this.SocialQuestBtnCallback, this);

        // G.eventManager.clearEnableTouched(this.getName());
        // if(G.camera.inputs.attached.pointers) G.camera.inputs.attached.pointers.disableMoveCamera();
        this.detachCamera();
        this.FSocialQuest.openPopup( quest );

        //카메라 움직임등..기타 설정등이 필요함...
    }



    FSceneMyRoom.prototype.isEarth = function(mesh) {

        return true;

        // if(mesh.name == 'myroom_road' || (mesh.name.indexOf('under_floor') >= 0)) {
        //         return true;
        // }
        // return false;
    }


    FSceneMyRoom.prototype.onClickPetUICallBack = function( in_callBackType, in_callBackValue )
    {
        switch( in_callBackType )
        {
        case PETUI_CALLBACK_TYPE.CLOSE : 
            {
                // 닫기 누름
            }
            break;

        case PETUI_CALLBACK_TYPE.INTERACTION :
            {
                if ( in_callBackValue == PETUI_TEST_INTERACTION.TOUCH )
                {
                    // 상호작용 터치 버튼 눌렀다.
                    this.myPet.touch(this.myAvatar, SKELETON.PAT);
                    G.cameraManager.setTarget( this.myPet, 200 );
                }
                else if ( in_callBackValue == PETUI_TEST_INTERACTION.FEED )
                {
                    // 상호작용 먹이주기 버튼 눌렀다.
                    this.myPet.touch(this.myAvatar, SKELETON.FEEDING);

                    G.cameraManager.setTarget( this.myPet, 200 );
                }
            }
            break;

        case PETUI_CALLBACK_TYPE.OPENINFOPOPUP :
            {
                // 인포팝업 누름
            }
            break;
        }
    }

    FSceneMyRoom.prototype.onClickPlayerUICallBack = function( in_callBackType, in_callBackValue, in_clickedFriend )
    {
        switch( in_callBackType )
        {
            // 플레이어 상호작용 버튼 누름
        case PLAYERUI_CALLBACK_TYPE.INTERACTION :
            {
                // 하이파이브
                if ( in_callBackValue == PLAYERUI_TEST_INTERACTION.HIGHFIVE )
                {
                    in_clickedFriend.touch(this.myAvatar, SKELETON.HIFIVE);
                    G.cameraManager.setTarget( in_clickedFriend );                    
                }
                else // 딴거
                {

                }
            }
            break;

        case PLAYERUI_CALLBACK_TYPE.VIEWSNS :
            {
                snsCommonFunc.snsView(8,in_clickedFriend.getPk());
            }
            break;
        }
    }

    FSceneMyRoom.prototype.onClickFriend = function(e, lparam, pparam)
    {
        var self = lparam;
        var friend = pparam;

        if(e != 'OnPickUpTrigger') return;

//         friend.touch(self.myAvatar);
//         G.cameraManager.setTarget( friend, 200 );

// return;

        console.log( "니가날찍어!?" + friend.getName() );

        FPlayerTouchUI.getInstance().setplayerInfo( friend, function( in_callBackType, in_callBackValue, in_clickedFriend )
        {
            self.onClickPlayerUICallBack( in_callBackType, in_callBackValue, in_clickedFriend );
        } );

        FPlayerTouchUI.getInstance().openUI();
        // friend.setPause(true);

        G.cameraManager.setTarget( friend, 350 );
    }




    FSceneMyRoom.prototype.onPointerDown = function(evt) {

        // protocol.getBtmUserInfo();
        // protocol.smileToBtmTransaction(1, 1);
        // protocol.listTransaction();

        var self = this;

        if (evt.button !== 0) {
            return;
        }

        
        if(this.videoTexture[this.nameScreen[0]]) this.videoTexture[this.nameScreen[0]].video.play();
        if(this.videoTexture[this.nameScreen[1]]) this.videoTexture[this.nameScreen[1]].video.play();
        if(this.videoTexture[this.nameScreen[2]]) this.videoTexture[this.nameScreen[2]].video.play();


        G.cameraManager.clearTarget();

        var pickResult = G.scene.pick(evt.clientX, evt.clientY);

        if (pickResult.hit) {
            // var pickedObject = FObjectManager.getInstance().getObjectMapForMesh(pickResult.pickedMesh);

            // if(pickedObject != null) return;

            if(pickResult.pickedMesh.name == "cat") {
                G.cameraManager.setTarget( this.myPet, 200 );

                FPetTouchUI.getInstance().setPetInfo( this.myPet, function( in_callbackType, in_callBackValue ){ self.onClickPetUICallBack(in_callbackType, in_callBackValue); }, false );
                FPetTouchUI.getInstance().openUI();
                

            } else {

                // for ( var i = 0; i < this.friends.length; ++i )
                // {
                //     var friend = this.friends[i];
                //     var finded = false;

                //     for ( var j = PARTS_BODY; j < PARTS_END; ++j )
                //     {
                //         if ( friend.getMeshPart(j) == pickResult.pickedMesh )
                //         {
                //             self.onClickFriend( friend );
                //             finded = true;
                //             break;
                //         }
                //     }

                //     if ( finded )
                //         break;
                // }
                // this.startIndex = FMapManager.getInstance().getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z);
                // this.sx = evt.clientX;
                // this.sy = evt.clientY;
            }


            


            // console.log('World position = ' + pickResult.pickedPoint);
            // console.log('World index = ' + this.startIndex);
            // console.log('{pos:new Vector3('+ Math.floor(pickResult.pickedPoint.x)+','+0+','+Math.floor(pickResult.pickedPoint.z)+'), cuv : 0}');
            console.log("tileindex : " + FMapManager.getInstance().getWorldToIndex( pickResult.pickedPoint.x, pickResult.pickedPoint.z ));
            // console.log('screen position = ' +evt.clientX +', ' +evt.clientY);
            // GUI.zetEffect(pickResult.pickedPoint);

            var ratio = window.innerWidth/G.guiMain.idealWidth;
            console.log("ui 디버깅용 좌표 : " + ((evt.clientX/window.innerWidth)*720 - 350).toString() +', ' + ((evt.clientY/window.innerHeight)*1280 - 640).toString() );
        }

  
        // var decalSize = new BABYLON.Vector3(10, 10, 10);
        
        // /**************************CREATE DECAL*************************************************/
        // var decal = BABYLON.MeshBuilder.CreateDecal("decal", cat, {position: pickResult.pickedPoint, normal: pickResult.getNormal(true), size: decalSize});
        // decal.material = decalMaterial;
        /***************************************************************************************/	     
    }

    FSceneMyRoom.prototype.onPointerGUp = function(evt) {
        if (evt.button !== 0) {
            return;
        }

    }


    FSceneMyRoom.prototype.onPointerUp = function(evt) {
        if (evt.button !== 0) {
            return;
        }

        if ( FObjectTouchUI.getInstance().getReadyToAutoClose() )
            FObjectTouchUI.getInstance().onClickMainCloseBtn();

        if ( FPetTouchUI.getInstance().getReadyToAutoClose() )
            FPetTouchUI.getInstance().onClickmainCloseBtn();
        
        if ( FPlayerTouchUI.getInstance().getReadyToAutoClose() )
            FPlayerTouchUI.getInstance().onClickmainCloseBtn();

// return;
//         if(!this.FInteriorShop && this.startIndex != -1) {

//             var pickResult = G.scene.pick(evt.clientX, evt.clientY);
            
//             if(Math.abs(this.sx - evt.clientX) > 10 || Math.abs(this.sy - evt.clientY) > 10 ) {
//                 this.startIndex = -1;
//                 this.sx = this.sy = -1;
//                 return;
//             }

//             if (pickResult.hit) {

//                 var endIndex = FMapManager.getInstance().getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z);

//                 if(this.startIndex == endIndex) 
//                 {
//                     if(this.myAvatar) 
//                     {
//                         if ( this.myAvatar.startMove(this.startIndex) )
//                             G.cameraManager.setTarget( this.myAvatar ); // 실제 움직일때만 얘가 호출되어야 함
//                     }
            
//                     if ( -1 != FMapManager.getInstance().getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z) )
//                         CommRender.createPointerEffect(pickResult.pickedPoint.x, pickResult.pickedPoint.z, pickResult.pickedPoint.y);
//                 }

//                 if ( FObjectTouchUI.getInstance().getReadyToAutoClose() )
//                     FObjectTouchUI.getInstance().closeUI();
//             }
//         } 


    }

    FSceneMyRoom.prototype.onPointerMove = function(evt) {
        
        if (evt.button !== 0) {
            return;
        }

        // if(G.scene.activeCamera == null) return;

        // var pickResult = G.scene.pick(evt.clientX, evt.clientY);
        // if (pickResult.hit) {
        //     // var pickedObject = FMapManager.getInstance().getObjectMapForMesh(pickResult.pickedMesh);
        //     var endIndex = FMapManager.getInstance().getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z);

        //     if(this.startIndex != endIndex) {
        //         this.startIndex = -1;
        //     }
        // }

        // if(Math.abs(this.sx - evt.clientX) > 10 || Math.abs(this.sy - evt.clientY) > 10 ) {
        //     this.startIndex = -1;
        // }

        // console.log("move");
    }

    FSceneMyRoom.prototype.onPointerDouble = function(evt) {

        var pickResult = G.scene.pick(evt.clientX, evt.clientY);
        
        if (pickResult.hit) {

            var startIndex = FMapManager.getInstance().getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z);

            if(this.myAvatar) 
            {
                if ( this.myAvatar.startMove(startIndex) )
                    G.cameraManager.setTarget( this.myAvatar ); // 실제 움직일때만 얘가 호출되어야 함
            }
    
            if ( -1 != FMapManager.getInstance().getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z) )
                CommRender.createPointerEffect(pickResult.pickedPoint.x, pickResult.pickedPoint.z, pickResult.pickedPoint.y);
        
        }
    }

    FSceneMyRoom.prototype.onPointerLeave = function(evt) {
        // console.log('leaveleaveleaveleaveleaveleaveleaveleave');
    }
   

    FSceneMyRoom.prototype.onResize = function() {

        if(!this.initLoad) return;
        if(!this.beInitLoaded) return;

        this.refreshUIDirection();
        this.screenOrientationCameraZoomCorrection( window.innerWidth, window.innerHeight );
    }

    /**
     * @description 세로모드 할때 카메라 줌땡겨주는 함수
     */
    FSceneMyRoom.prototype.screenOrientationCameraZoomCorrection = function( in_newWidth, in_newHeight )
    {
        var changeValue = in_newWidth - G.beforeScreenSize.width;

        if ( changeValue < 0 )
            G.camera.radius -= changeValue*0.05;
    }

    /**
     * @description UI 가로/세로 모드 전환 감지 함수
     */
    FSceneMyRoom.prototype.refreshUIDirection = function()
    {
        return; // 안씀. 세로모드만 있음.

        if ( window.innerWidth > window.innerHeight )
            this.repositionUIHorizontalMode();
        else
            this.repositionUIVerticalMode();
    }

    /**
     * @description UI 가로모드 세팅 함수
     */
    FSceneMyRoom.prototype.repositionUIHorizontalMode = function()
    {
        this.wrapTopInfo.height = GUI.getResolutionCorrection( px(100) );

        // top
        var rubyUI = this.wrapTopInfo.getChildByName(GUI.ButtonName.mainRuby);
        rubyUI.top = GUI.getResolutionCorrection( px(10) );
        rubyUI.left = GUI.getResolutionCorrection( px(90) );

        
        var goldUI = this.wrapTopInfo.getChildByName(GUI.ButtonName.mainCoin);
        goldUI.top = GUI.getResolutionCorrection( px(10) );
        goldUI.left = GUI.getResolutionCorrection( px(215) );
        
        var starUI = this.wrapTopInfo.getChildByName(GUI.ButtonName.mainStar);
        starUI.horizontalAlignment = GUI.ALIGN_RIGHT;
        starUI.top = GUI.getResolutionCorrection( px(10) );
        starUI.left = GUI.getResolutionCorrection( px(-100) );
    }

    /**
     * @description UI 세로모드 세팅 함수
     */
    FSceneMyRoom.prototype.repositionUIVerticalMode = function()
    {
        this.wrapTopInfo.height = GUI.getResolutionCorrection( px(300) );

        // top
        var rubyUI = this.wrapTopInfo.getChildByName(GUI.ButtonName.mainRuby);
        rubyUI.top = GUI.getResolutionCorrection( px(100) );
        rubyUI.left = GUI.getResolutionCorrection( px(5) );

        
        var goldUI = this.wrapTopInfo.getChildByName(GUI.ButtonName.mainCoin);
        goldUI.top = GUI.getResolutionCorrection( px(140) );
        goldUI.left = GUI.getResolutionCorrection( px(5) );
        
        var starUI = this.wrapTopInfo.getChildByName(GUI.ButtonName.mainStar);
        starUI.horizontalAlignment = GUI.ALIGN_LEFT;
        starUI.top = GUI.getResolutionCorrection( px(180 ));
        starUI.left = GUI.getResolutionCorrection( px(5) );
    }   

    FSceneMyRoom.prototype.isPickableMesh = function(mesh) {

        if( ((mesh.metadata != null) && ((mesh.metadata.layerName == "Ground") || (mesh.metadata.layerName == "Default")) )
             || (mesh.name == "skyBox")
             || (mesh.name == undefined)
             || (mesh.name && (-1 != mesh.name.indexOf("ir_room_")))) {
                return true;
        }
        return false; 
    }



    /**
     * @description                 / 소셜퀘스트 타입에 따라서 친구모델을 가지고온다.
     * @param {String} in_name      / 이름
     * @param {Number} in_questType / 소셜퀘스트 타입 0-생산, 1-소비, 2-공유
     * @param {Number} in_tileIndex / 위치 타일인덱스
     * @param {Function} in_callback/ 콜백
     * @param {?} in_parent         / ?
     * @param {?} in_pparam         / ?
     * @param {?} in_gui            / ?
     */
    FSceneMyRoom.prototype.getSocialFriendCharacter = function( in_name, in_questType, in_tileIndex, in_callback, in_parent, in_pparam, in_gui )
    {
        return (new FRoomCharactor(0, 'scp', -1, G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSocialFriend(in_questType).TEAM_AVATARCD, 
        G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQInfoPath(in_questType), 
        null,
        in_tileIndex, in_callback, in_parent, in_pparam, in_gui ));
    }

    FSceneMyRoom.prototype.setVisibleCharactor = function(b) {
        if(this.myAvatar) this.myAvatar.setVisible(b);
        if(this.android) this.android.setVisible(b);
        if(this.myPet) this.myPet.setVisible(b);
        if(this.car) {
            this.car.forEach(function(car){
                car.destroy();
            });
        }

        if(this.friends) {
            this.friends.forEach(function(friend){
                friend.setVisible(b);
            });
        }

    }

    FSceneMyRoom.prototype.changeMyAvatar = function(url) {
        this.myAvatar.changeBubbleUrl(url);
    }

    FSceneMyRoom.prototype.initMyAvatar = function() {

        var self = this;

        this.createMyAvatar(FMapManager.getInstance().getAvatarStartPos(), function(){
            G.cameraManager.setTarget( self.myAvatar ); 
            G.guiMain.setAlpha( 1 ); //아바타 로딩 다 되면 UI 보여준다

            self.loadAvatarState = LOS.SNSFRIEND;
            hideTip();
        });

    }

    // 벽뒤 랜덤인덱스
    var getRandomTileToBehindHome = function()
    {
        var startIndex = 0;
        var resultTile = 0;

        var width = FMapManager.getInstance().getTileWidth();
        var height = FMapManager.getInstance().getTileHeight();
        if( CommFunc.random(100) < 50 )
        {
            // 왼쪽 모서리
            startIndex = 0 + width * parseInt(height*0.3);
            startIndex += width*CommFunc.random( parseInt( height*0.6) );

            // 끝타일이 못가는곳일수 있으니 방지
            for( var i = 0; i < 20; ++i )
            {
                if ( FMapManager.getInstance().getTileType( ++startIndex ) == TILE_TYPE.NORMAL )
                    break;
            }
        }
        else
        {
            // 오른쪽 모서리
            startIndex = width*(height-1) + CommFunc.random( parseInt( width*0.6) );

            // 끝타일이 못가는곳일수 있으니 방지
            for( var i = 0; i < 20; ++i )
            {
                startIndex = startIndex-(width*i);
                if ( FMapManager.getInstance().getTileType( startIndex ) == TILE_TYPE.NORMAL )
                    break;
            }
        }

        return startIndex;
    }

    var getRandomHelloAni = function()
    {
        var actionList = [SKELETON.LAUGH, SKELETON.ANGLY, SKELETON.SAD];

        return actionList[0];// CommFunc.random( actionList.length+1 ) ];
    }

    FSceneMyRoom.prototype.setHelloMotion = function() {
     
        var self = this;
        
        if(this.myAvatar == null) {
            alert("setHelloMotion : this.myAvatar == null");
            return;
        }

        if(this.friends == null) {
            alert("setHelloMotion : this.friends == null");
            return;
        }

        this.myAvatar.startAnimation( getRandomHelloAni(), false, true );
        this.myAvatar.reservedAction(ACTION.MOVE, this.myAvatar.getPositionTile()+FMapManager.getInstance().getTileWidth()*10, null, null);
        this.myAvatar.reservedAction(ACTION.LOOKCAMERA,0, null, null);
        this.myAvatar.reservedAction(SKELETON.IDLE,true, null, null);     
        this.friends.forEach(function(friend){
            self.myAvatar.oppLook( friend );
            friend.startAnimation(getRandomHelloAni(), false, true);
            friend.equipAlphaGo(false, false);
        });
    }

    FSceneMyRoom.prototype.initSNSFriend = function() {

        // var self = this;
        // this.loadPetId = setTimeout(function(){
        //     self.createPet(null);
        // }, 1000);

        // return;

        var self = this;
        var friendLen = 3;

        this.friends = new Array();
        var applyFriend = function( i )
        {
            var cd = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSocialFriend(i).TEAM_AVATARCD;
            var avatarInfo = G.resManager.getAvatarCode(cd);

            if(cd) {
                var friend = new FRoomCharactor(0,'sns'+i);
                
                friend.setProfile(G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQInfoPath(i), G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSQInfoIntro(i));
                //friend.setTileIndex(FMapManager.getInstance().getAvatarStartPos() - i);
                friend.setTileIndex( FMapManager.getInstance().getAvatarStartPos() - FMapManager.getInstance().getTileWidth()*4 + (i*3) ); // 내 앞에 소셜퀘스트 세명이 서있게 해달랍니다.
                friend.setJustWalk(true);
                friend.setInsideWalk(true);
                friend.setPk(G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSocialFriend(i).TEAM_ACCOUNTPK);
                friend.createAvatar(avatarInfo, function(){
                    friend.initRoomCharactor(true);
                    friend.setTouchEvent(self, friend, self.onClickFriend);
                    self.friends.push(friend);

                    if ( friendLen == self.friends.length) {
                        
                        self.setHelloMotion();

                        self.startSuggest = setTimeout( function(){

                            self.loadAvatarState = LOS.SUGGESTFRIEND;

                        }, 2000 );
                    }
                });
            }
        }

        //소셜친구 3명
        for(var i=0; i<friendLen; i++) {

            applyFriend(i);
        }

    }

    FSceneMyRoom.prototype.initSUGGESTFriend = function() {
// return;
        var self = this;

        this.loadAndroidId = setTimeout(function(){
            self.createAndroid(null);
        }, 5000);

        this.loadPetId = setTimeout(function(){
            self.createPet(null);
        }, 10000);

        this.suggestFriendId = setTimeout(function(){
            //옥외추천
            var suggest = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSuggestFriend();

            var applySuggestFriend = function( i )
            {
                var cd = suggest[i].AVATACD;
                var avatarInfo = G.resManager.getAvatarCode(cd);

                var imgUrl = suggest[i].IMG_PATH + suggest[i].IMG_URL;

                if(cd) {
                    var friend = new FRoomCharactor(0,'outside'+i);
                    
                    friend.equipAlphaGo(false, false);
                    friend.setProfile(imgUrl, suggest[i].INTRO);
                    //friend.setTileIndex(FMapManager.getInstance().getAvatarStartPos() - i);
                    friend.setTileIndex( getRandomTileToBehindHome() ); // 강부장님이 벽 뒤에서 즉시생성되는게 어떨까 해서 일단 수정해놓았습니다.

                    friend.setJustWalk(true);
                    friend.setInsideWalk(false);
                    friend.setPk(suggest[i].ACCOUNTPK);
                    friend.createAvatar(avatarInfo, function(){
                        friend.initRoomCharactor(true);
                        friend.setTouchEvent(self, friend, self.onClickFriend);
                        self.friends.push(friend);
                    });
                }
            }

            for(var i=0; i<3; i++) {

                if(i>=suggest.length ) break;

                applySuggestFriend(i);
            }
        }, 15000);

    }


    FSceneMyRoom.prototype.SocialQuestBtnCallback = function(self, shopIndex, lparam) {
        // G.camera.attachControl(G.canvas, true);
        self.attachCamera();
        // G.eventManager.setEnableTouched(self.getName(),self); 
    }

    //오브젝트 생성, 배치 클래스로부터 리턴 받는 곳
    // FSceneMyRoom.prototype.ObjectMgrCallback = function(self, lparam) {
    //     self.clearGrid();
    //     self.FInteriorShop.changeState(ISHOP.IS_STATE_MAIN);
    //     G.eventManager.setEnableTouched(self.name,self);
    //     self.detachCamera();
    // }

    //<------------------------------------------------------------------------------------------------------------------

    //<--------------------------------------------------------------------------------------------------------------------------------------
    
    FSceneMyRoom.prototype.renderViewContents = function(friend) {

        var self = this;

        self.closePopup();

        this.wrapContents = FPopup.createPopupWrapper( "black", 0.5 );
        G.guiMain.addControl(this.wrapContents, GUI.LAYER.POPUP);

        var img = GUI.CreateImage("back", px(0), px(0), px(303), px(313), ASSET_URL+"97_gui_new/08_contents/contents_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        this.wrapContents.addControl(img);

        //추천친구ID
        var text = GUI.CreateText( px(-100), px(-120), friend.NICKNAME, "Black", 14, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);

        //사진
        var btn = GUI.CreateCircleButton('friend_pic', px(-10), px(-95), px(60), px(60), friend.IMG_URL, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE, true, "white", false);
        this.wrapContents.addControl(btn);

        //숫자들
        text = GUI.CreateText( px(40), px(-110), CommFunc.toK(friend.PICCNT), "white", 16, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);
        text = GUI.CreateText( px(40), px(-80), "사진", "white", 10, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);

        text = GUI.CreateText( px(80), px(-110), CommFunc.toK(friend.MOVCNT), "white", 16, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);
        text = GUI.CreateText( px(80), px(-80), "동영상", "white", 10, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);

        text = GUI.CreateText( px(120), px(-110), CommFunc.toK(friend.PALCNT), "white", 16, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);
        text = GUI.CreateText( px(120), px(-80), "팔로워", "white", 10, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);

        //추천친구 소개

        //friend.INTRO = "[박찬호/JTBC 해설위원 : (구체적으로 어떤 얘길 하나요?) 마이크 피아자 선수가 가끔 올라와요. 그럼 한국말을 가르쳐줬거든요. \"괜찮아?\" 그래요, 그럼 저는 영어로 \"굿(Good)!\" 이렇게 합니다.]";
        text = GUI.CreateAutoLineFeedText( px(50), px(-15), px(180), px(77), friend.INTRO, "white", 14, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);

        var imageName = "avatar_profile_01.png";
        if ( 2 == G.resManager.getAvatarCode( friend.AVATACD ).gender )
            imageName = "avatar_profile_02.png";
        var avatarImg = GUI.CreateImage( "avatar", px(-100), px(-40), px(69*0.7), px(182*0.7), ASSET_URL+"97_gui_new/02_social/"+imageName, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl( avatarImg );

        var url;
        //간이사진1
        if(friend.SEMIIMG1) {

            //1:이미지,2:동영상,3:유튜브링크
            if(friend.SEMIIMGTYPE1 == 1) {
                url = friend.IMG_PATH + friend.SEMIIMG1;
            } else if(friend.SEMIIMGTYPE1 == 2) {
                
                url = friend.VDO_PATH + friend.SEMIIMG1;

            } else if(friend.SEMIIMGTYPE1 == 3) {
                url = friend.IMG_PATH + friend.SEMIIMG1;
            } else {
                Debug.Error('File Type Error!!!!');
            }

            img = GUI.CreateImage("back", px(-62), px(69), px(48), px(48), url, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
            this.wrapContents.addControl(img);
        }

        
        //간이사진2
        if(friend.SEMIIMG2) {

            //1:이미지,2:동영상,3:유튜브링크
            if(friend.SEMIIMGTYPE2 == 1) {
                url = friend.IMG_PATH + friend.SEMIIMG2;
            } else if(friend.SEMIIMGTYPE2 == 2) {
                
                url = friend.VDO_PATH + friend.SEMIIMG2;

            } else if(friend.SEMIIMGTYPE2 == 3) {
                url = friend.IMG_PATH + friend.SEMIIMG2;
            } else {
                Debug.Error('File Type Error!!!!');
            }

            img = GUI.CreateImage("back", px(0), px(69), px(48), px(48), url, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
            this.wrapContents.addControl(img);
        }

        //간이사진3        
        if(friend.SEMIIMG3) {

            //1:이미지,2:동영상,3:유튜브링크
            if(friend.SEMIIMGTYPE3 == 1) {
                url = friend.IMG_PATH + friend.SEMIIMG3;
            } else if(friend.SEMIIMGTYPE3 == 2) {
                
                url = friend.VDO_PATH + friend.SEMIIMG3;

            } else if(friend.SEMIIMGTYPE3 == 3) {
                url = friend.IMG_PATH + friend.SEMIIMG3;
            } else {
                Debug.Error('File Type Error!!!!');
            }

            img = GUI.CreateImage("back", px(62), px(69), px(48), px(48), url, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
            this.wrapContents.addControl(img);
        }
        

        var closeButton = GUI.CreateButton( "closeButton", px(139), px(-143), px(25), px(25), GUI.DEFAULT_IMAGE_PATH_NEW+"pop_cancel.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(closeButton);
        closeButton.onPointerUpObservable.add( function()
        {
            self.closePopup();
        });


        var view = GUI.CreateButton( "view", px(0), px(130), px(231), px(29), ASSET_URL+"97_gui_new/08_contents/btn_view.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(view);
        view.onPointerUpObservable.add( function()
        {
            self.closePopup();
            //스타컨텐츠시퀀스
            if(friend.STARCONTSEQ)
            snsCommonFunc.openStarContents(friend.STARCONTSEQ);
            else {
                FPopup.messageBox('오류', '등록된 스타 콘텐츠가 없습니다.', BTN_TYPE.OK, function(self, param){
            
                }, this);                
            }
        });

    }


    FSceneMyRoom.prototype.wsGetSuggestFriendInfo = function(pk) {

        var json;
        
        json = protocol.getSuggestFriendInfo(pk);
        ws.onRequest(json, this.getSuggestFriendInfoCB, this);
    }

    FSceneMyRoom.prototype.getSuggestFriendInfoCB = function(res, self){

        protocol.res_getSuggestFriendInfo(res, 0);

        self.renderViewContents(G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSuggestFriendDetail(res.friendAccountPk));
    }



    FSceneMyRoom.prototype.closePopup = function()
    {
        GUI.removeContainer(this.wrapContents);
        this.wrapContents = null;
        // G.camera.attachControl(G.canvas, true); 
        this.attachCamera();
    };



    //<--------------------------------------------------------------------------------------------------------------

    FSceneMyRoom.prototype.updateStartContents = function() {
        this.bRenderStarCon = false;

        // this.scThread = setTimeout(setTimeoutStarContents, 1000);
   
    }


    FSceneMyRoom.prototype.InitGiftBox = function() {
        
        var sObj = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getShareObject();

        var name = CommFunc.nameGuid('giftbox');

        for(var i=0; i<sObj.list.length; i++) {

            var worldPos = FMapManager.getInstance().getIndexToWorld(sObj.list[i].tile);
            var box = new FGiftBox(name, worldPos, this.touchGift, this, i );
            this.giftbox.push(box);
        }
    }


    FSceneMyRoom.prototype.touchGift = function(self,type) {
        
        var sObj = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getShareObject();
        
        var json;
        
        json = protocol.getShareObjInfo(sObj.list[type].seq);
        ws.onRequest(json, self.getShareObjInfoCB, self);    
    }

    FSceneMyRoom.prototype.getShareObjInfoCB = function(res, self) {
        protocol.res_getShareObjInfo(res);

        // self.renderShareViewContents(res.data[0][0]);

        

        var obj = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getShareObject();
        var objInfo;

        for(var i=0; i<obj.list.length; i++) {
            if(obj.list[i].seq == res.data[0][0]) {
                objInfo = obj.list[i];
                break;
            }
        }
        
        //공유 콘텐츠 보기
        snsCommonFunc.snsView(4, objInfo.postSeq)
    }


    FSceneMyRoom.prototype.renderShareViewContents = function(seq) {
        
        var self = this;

        self.closePopup();

        var obj = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getShareObject();
        var objInfo;

        for(var i=0; i<obj.list.length; i++) {
            if(obj.list[i].seq == seq) {
                objInfo = obj.list[i];
                break;
            }
        }


        this.wrapContents = FPopup.createPopupWrapper( "black", 0.5 );
        G.guiMain.addControl(this.wrapContents, GUI.LAYER.POPUP);

        var img = GUI.CreateImage("back", px(0), px(0), px(303), px(243), ASSET_URL+"97_gui_new/08_contents/share_contents_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        this.wrapContents.addControl(img);

        //추천친구ID
        var text = GUI.CreateText( px(-100), px(-85), objInfo.accountID, "Black", 14, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);

        //사진
        var btn = GUI.CreateCircleButton('friend_pic', px(-10), px(-65), px(60), px(60), objInfo.imgUrl, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        this.wrapContents.addControl(btn);

        //숫자들
        text = GUI.CreateText( px(40), px(-60), CommFunc.toK(objInfo.aCnt), "white", 16, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);
        text = GUI.CreateText( px(40), px(-80), "콘텐츠", "white", 10, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);

        text = GUI.CreateText( px(80), px(-60), CommFunc.toK(objInfo.bCnt), "white", 16, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);
        text = GUI.CreateText( px(80), px(-80), "팔로워", "white", 10, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);

        text = GUI.CreateText( px(120), px(-60), CommFunc.toK(objInfo.cCnt), "white", 16, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);
        text = GUI.CreateText( px(120), px(-80), "팔로잉", "white", 10, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);

        //추천친구 소개
        text = GUI.CreateText( px(50), px(0), objInfo.msg, "white", 10, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);


        var imageName = "avatar_profile_01.png";
        if ( 2 == G.resManager.getAvatarCode( objInfo.avataCD ).gender )
            imageName = "avatar_profile_02.png";
        var avatarImg = GUI.CreateImage( "avatar", px(-100), px(-10), px(69*0.7), px(182*0.7), ASSET_URL+"97_gui_new/02_social/"+imageName, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl( avatarImg );

        var closeButton = GUI.CreateButton( "closeButton", px(139), px(-108), px(25), px(25), GUI.DEFAULT_IMAGE_PATH_NEW+"pop_cancel.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(closeButton);
        closeButton.onPointerUpObservable.add( function()
        {
            self.closePopup();
        });


        var view = GUI.CreateButton( "view", px(0), px(90), px(231), px(29), ASSET_URL+"97_gui_new/08_contents/btn_share_view.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(view);
        view.onPointerUpObservable.add( function()
        {
            //공유 콘텐츠 보기
            viewBigPost(objInfo.postSeq);
        });        

    }

    FSceneMyRoom.prototype.openSmileExchangePopup = function()
    {
        var readyPopup = function openReadyPopup()
        {
            var wrapper = FPopup.createPopupWrapper( "black", 0.5 );
            G.guiMain.addControl( wrapper, GUI.LAYER.POPUP );
            wrapper.isPointerBlocker = true;

            wrapper.scaleX = 1.75;
            wrapper.scaleY = 1.75;

            var BGRect = new BABYLON.GUI.Rectangle();
            wrapper.addControl( BGRect );
            BGRect.width = GUI.getResolutionCorrection( px(365) );
            BGRect.height = GUI.getResolutionCorrection( px(261) );
            BGRect.thickness = 0;
            
            BGRect.scaleX = 1.75;
            BGRect.scaleY = 1.75;

            var BG = GUI.CreateImage( "smileExchangeReadyBG", px(0), px(0), px(365), px(261), GUI.DEFAULT_IMAGE_PATH_NEW+"11_smilemark/smilemark_exchangeReady.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
            BGRect.addControl( BG );

            var canExchangeSmile = GUI.CreateText( px(-38), px(-70), "18,181,181 개", "Blue", 18, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
            BGRect.addControl( canExchangeSmile );

            var gotExchangeSmile = GUI.CreateText( px(-38), px(-20), "22,222,218,181,181 개", "lightGray", 16, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
            BGRect.addControl( gotExchangeSmile );

            var alreadyExchangeSmile = GUI.CreateText( px(-38), px(17), "444,444,181 개", "lightGray", 16, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
            BGRect.addControl( alreadyExchangeSmile );

            var closeButton = GUI.CreateButton( "closeBtn", px(-7), px(7), px(25), px(25), GUI.DEFAULT_IMAGE_PATH_NEW+"pop_cancel.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
            BGRect.addControl( closeButton );
            closeButton.onPointerUpObservable.add( function()
            {
                G.guiMain.removeControl( wrapper );
            });

            var acceptButton = GUI.CreateButton( "acceptBtn", px(0), px(105), px(230), px(28), GUI.DEFAULT_IMAGE_PATH_NEW+"11_smilemark/smilemark_exchange_btn.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            BGRect.addControl( acceptButton );
            acceptButton.onPointerUpObservable.add( function()
            {
                G.guiMain.removeControl( wrapper );
                openExchangePopup();
            });

            FPopup.openAnimation( wrapper );

            return wrapper;
        }();

        var openExchangePopup = function()
        {
            G.guiMain.removeControl( readyPopup );

            var wrapper = FPopup.createPopupWrapper( "black", 0.5 );
            G.guiMain.addControl( wrapper, GUI.LAYER.POPUP );            

            var BGRect = new BABYLON.GUI.Rectangle();
            wrapper.addControl( BGRect );
            BGRect.width = GUI.getResolutionCorrection( px(365) );
            BGRect.height = GUI.getResolutionCorrection( px(261) );
            BGRect.thickness = 0;
            BGRect.scaleX = 1.75;
            BGRect.scaleY = 1.75;

            var BG = GUI.CreateImage( "smileExchangeReadyBG", px(0), px(0), px(365), px(261), GUI.DEFAULT_IMAGE_PATH_NEW+"11_smilemark/smilemark_exchange.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
            BGRect.addControl( BG );

            var canExchangeSmile = GUI.CreateText( px(-38), px(-70), "18,181,181 개", "Blue", 16, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
            BGRect.addControl( canExchangeSmile );

            var accumulateExchangeSmile = GUI.CreateText( px(-38), px(-35), "22,222,218,181,181 개", "White", 16, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
            BGRect.addControl( accumulateExchangeSmile );
            
            var guideText = GUI.CreateText( px(0), px(15), "환전 신청할 스마일마크 갯수를 입력해주세요", "Blue", 12, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            BGRect.addControl( guideText );
            GUI.alphaAnimation( guideText, true, 1 );

            var getPrice = GUI.CreateText( px(-48), px(65), "0", "Blue", 14, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
            BGRect.addControl( getPrice );

            var input = GUI.createInputText( "inputText",
                px(0),
                px(15),
                px(250),
                px(25),
                "",
                "Blue",
                12,
                GUI.ALIGN_CENTER,
                GUI.ALIGN_MIDDLE );
            BGRect.addControl( input );

            input.onFocusObservable.add ( function()
            {
                guideText.isVisible = false;
            });

            input.onBlurObservable.add ( function()
            {
                if ( input.text.length <= 0 )
                    guideText.isVisible = true;
            });

            input.onTextChangedObservable.add ( function()
            {
                if ( isNaN( input.text ) || (input.text == "") )
                {
                    getPrice.text = "바르게 입력해 주세요";
                    getPrice.color = "Red";
                    getPrice.fontSize = GUI.getResolutionCorrection( 13, false );
                    acceptButton.alpha = 0.5;
                    acceptButton.isHitTestVisible = false;
                }
                else if ( parseInt( input.text ) < 1000 )
                {   
                    getPrice.text = "1000개 이상부터 가능합니다";
                    getPrice.color = "Red";
                    getPrice.fontSize = GUI.getResolutionCorrection( 13, false );
                    acceptButton.alpha = 0.5;
                    acceptButton.isHitTestVisible = false;
                }
                else
                {
                    getPrice.text = CommFunc.numberWithCommas( (parseInt( input.text ) * 60).toString() );
                    getPrice.color = "Blue";
                    getPrice.fontSize = GUI.getResolutionCorrection( 16, false );
                    acceptButton.alpha = 1;
                    acceptButton.isHitTestVisible = true;
                }
            });

            var closeButton = GUI.CreateButton( "closeBtn", px(-7), px(7), px(25), px(25), GUI.DEFAULT_IMAGE_PATH_NEW+"pop_cancel.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
            BGRect.addControl( closeButton );
            closeButton.onPointerUpObservable.add( function()
            {
                G.guiMain.removeControl( wrapper );
            });

            var acceptButton = GUI.CreateButton( "acceptBtn", px(0), px(105), px(230), px(28), GUI.DEFAULT_IMAGE_PATH_NEW+"11_smilemark/smilemark_exchange_btn.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            BGRect.addControl( acceptButton );
            acceptButton.alpha = 0.5;
            acceptButton.isHitTestVisible = false;
            acceptButton.onPointerUpObservable.add( function()
            {
                G.guiMain.removeControl( wrapper );
                openFinishPopup();
            });

            FPopup.openAnimation( wrapper );

            return wrapper;
        }

        var openFinishPopup = function()
        {
            for ( var i = 0; i < 8; ++i )
            {
                setTimeout( function()
                {
                    GUI.createParticle( GUI.DEFAULT_IMAGE_PATH_NEW+"03_symbol/gold_b.png", 20, CommFunc.randomMinMax( 0, 800 )-400, CommFunc.randomMinMax( 0, 500 )-250 );
                }, 300*i );
            }

            var wrapper = FPopup.createPopupWrapper( "black", 0.5 );
            G.guiMain.addControl( wrapper, GUI.LAYER.POPUP );

            var BGRect = new BABYLON.GUI.Rectangle();
            wrapper.addControl( BGRect );
            BGRect.width = GUI.getResolutionCorrection( px(365) );
            BGRect.height = GUI.getResolutionCorrection( px(261) );
            BGRect.thickness = 0;
            BGRect.scaleX = 1.75;
            BGRect.scaleY = 1.75;

            var BG = GUI.CreateImage( "smileExchangeReadyBG", px(0), px(0), px(365), px(261), GUI.DEFAULT_IMAGE_PATH_NEW+"11_smilemark/smilemark_exchangeFinish.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
            BGRect.addControl( BG );

            var closeButton = GUI.CreateButton( "closeBtn", px(-7), px(7), px(25), px(25), GUI.DEFAULT_IMAGE_PATH_NEW+"pop_cancel.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
            BGRect.addControl( closeButton );
            closeButton.onPointerUpObservable.add( function()
            {
                G.guiMain.removeControl( wrapper );
            });

            var acceptButton = GUI.CreateButton( "acceptBtn", px(0), px(105), px(107), px(29), GUI.DEFAULT_IMAGE_PATH_NEW+"11_smilemark/smilemark_exchange_accept.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            BGRect.addControl( acceptButton );
            acceptButton.onPointerUpObservable.add( function()
            {
                G.guiMain.removeControl( wrapper );
            });

            FPopup.openAnimation( wrapper );

            G.soundManager.playEffectSound( "EFFECT_SmileMarkExchange.ogg" );            

            return wrapper;
        };
    }

    FSceneMyRoom.prototype.initVehicles = function() {

        var mesh;

        var suggest = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSuggestFriend();
        // suggestfriend.length;

        this.car = new Array();

        var k = 0;
        for(var i=0; i<2; i++) {

            if(i>=suggest.length ) break;

            var carName = 530000 + k;
            var imgUrl = suggest[i].IMG_PATH + suggest[i].IMG_URL;
            var vehicle = new FVehicle(CommFunc.nameGuid(carName.toString()), carName);
            vehicle.createVehicle(PathDataHighway[i]);
            // vehicle.setOthers(this.car);
            this.car.push(vehicle);
            k++;
        }
    }

    FSceneMyRoom.prototype.textureDispose = function(name) {

        var screen = G.scene.getMeshByName(name);

        if(!screen) return;
        if(screen.material) {

            if(screen.material.diffuseTexture) {
                screen.material.diffuseTexture.dispose();
                screen.material.diffuseTexture = null;
            }

            screen.material.dispose();
            screen.material = null;
            if(this.videoTexture[name]) {
                this.videoTexture[name].dispose();
                this.videoTexture[name] = null;
            }
        }

        if(screen.actionManager) { 
            screen.actionManager.dispose();
            screen.actionManager = null;
        }
    }

    return FSceneMyRoom;

}());


