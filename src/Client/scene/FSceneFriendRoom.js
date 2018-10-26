'use strict';


var FSceneFriendRoom = (function () {

    __inherit(FSceneFriendRoom, FRoom);

    function FSceneFriendRoom(name) {
        var self = this;
        // self.state = 0;

        this.setName(CommFunc.nameGuid(name.toString() + '-FSceneFriendRoom'));
        G.eventManager.setEnableTouched(this.getName(), this);
 
        // this.ALPHA          = 130*Math.PI/180; //2.2;
        // this.ROTATION_ALPHA = 180*Math.PI/180;
        // this.QUATER_BETA    = 45*Math.PI/180;//0.90;

        // this.startingPoint;
        // this.background = null;

        // this.preState = -1;
        // this.light = null;

        this.topCamera = 0;
        this.rotationCamera = 0;

        this.wrapBtn = null;
        this.wrapBtnSocial = null;
        this.wrapTopInfo = null;
        this.wrapContents = null;

        this.giftbox = [];

        this.scPanel = null;
        this.scThread = null;

        this.android = null;
        this.myAvatar = null;
        this.yourAvatar = null;
        this.myPet = null;

        this.friends = [];
        this.car = [];
        this.road = [];

        this.postSeq = null;
        this.giftTile = null;

        // this.roomMesh = null;
        // this.wallMesh = null;
        // this.roofMesh = null;

        this.startIndex = -1;
        this.sx = -1;
        this.sy = -1;

        this.loadAvatarState = null;
        this.netState = null;
        this.startTime = null;
        // this.myCamera = null;

        // this.testWallDirectionMesh = 
        // {
        //     "front":null,
        //     "left":null,
        //     "right":null,
        //     "back":null,
        // }

        this.advertise          = null;
        this.videoTexture       = null;

        this.nameScreen         = ["theme_01_screen_01", "theme_01_screen_02", "theme_01_screen_03"];

        showTip();

        return self;
    }

    FSceneFriendRoom.prototype.init = function () {

        FRoom.prototype.init.call(this);

        this.loadAvatarState = LOS.NONE;
        this.videoTexture = [];
        this.advertise    = {};

        this.loadBackground();

        //화면 전체 UI를 담고 있을 것이다.
        // if(G.guiMain) G.guiMain.dispose();
        // G.guiMain = new GUI.createMainGUI('ADVANCEDDYNAMICTEXTURE');

        this.goMyRoom();

        this.initSceneCamera();
        
        GUI.initLevelOfAlphaUI();
        
        // 카메라 값 세팅
        // G.cameraManager.setCameraLimitInfo( -270, 170, -270, 410, 160, 700, 470, ToRadians(-45), ToRadians(55) );
        G.cameraManager.setCameraLimitInfo( -550, 300, -250, 450, 160, 2000, 470, ToRadians(-45), ToRadians(55) );

        snsCommonFunc.chatTitleLender(this.getSceneNameToString(1));

        showTip();
    };


    FSceneFriendRoom.prototype.destroy = function () {

        G.cameraManager.clearTarget();

        G.eventManager.clearEnableTouched(this.getName());
        this.clearStartContents();
        
        FRoomUI.getInstance().setUIVisible( false );

        if(this.android) this.android.destroy();
        this.android = null;

        if(this.myAvatar) this.myAvatar.destroy();
        this.myAvatar = null;

        if(this.myPet) this.myPet.destroy();
        this.myPet = null;

        if(this.yourAvatar) this.yourAvatar.destroy();
        this.yourAvatar = null;

        this.car.forEach(function(car){
            car.destroy();
        });

        this.friends.forEach(function(friend){
            friend.destroy();
        });

        this.giftbox.forEach(function(box){
            box.destroy();
        });

        CommFunc.arrayRemoveAll(this.car);
        CommFunc.arrayRemoveAll(this.friends);

        CommFunc.arrayRemoveAll(this.road);
        CommFunc.arrayRemoveAll(this.giftbox);

        GUI.removeContainer(self.wrapBtn);          self.wrapBtn = null;
        GUI.removeContainer(self.wrapBtnSocial);    self.wrapBtnSocial = null;
        GUI.removeContainer(self.wrapTopInfo);      self.wrapTopInfo = null;
        G.guiMain.dispose();

        
        G.scene.removeCamera(G.camera);
        G.camera.detachControl(G.canvas);
        G.camera.inputs.clear(); 
        G.camera.dispose();

        CommFunc.removeLight();

        G.eventManager.clearEnableTouched("friendRoomArcCamera");

        G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).setVisitPurposeForShare(false);
        G.dataManager.getUsrMgr(DEF_IDENTITY_ME).clearShareObject();

        // G.scene.meshes.forEach(function(mesh){
        //     mesh.dispose();
        // });

        // this.roomMesh.dispose();
        // this.wallMesh.dispose();
        // this.roofMesh.dispose();

        // G.resManager.clearChildren();
        FMapManager.getInstance().destroy();
        FObjectManager.getInstance().destroy();

        G.soundManager.stopSound();

        this.textureDispose(this.nameScreen[0]);
        this.textureDispose(this.nameScreen[1]);
        this.textureDispose(this.nameScreen[2]);

        FRoom.prototype.destroy.call(this);
    };


    FSceneFriendRoom.prototype.run = function () {

        FRoom.prototype.run.call(this);

        this.netProcess();
        this.avatarProcess();
        
        GUI.procLevelOfAlphaUI();

        if ( !this.bRenderStarCon && null != this.objMgr && this.objMgr.isDoneRender())            
            this.renderStartContents();      


        // CommFunc.drawSceneInstrumentaion();

        return 0;
    };

    FSceneFriendRoom.prototype.netProcess = function() {
        
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
            case LOS.NET_GETSTAR:
                {
                    this.wsSendGetStarContents();
                }
                break;
        }

        this.netState = LOS.NONE;
    }

    FSceneFriendRoom.prototype.avatarProcess = function() {

        if(this.loadAvatarState == LOS.NONE) return;

        switch(this.loadAvatarState) {
            case LOS.OWNERAVATAR:
                {
                    this.initOwnerAvatar();
                    // this.initMyAvatar();
                }
                break;
            case LOS.MYAVATAR: 
                {
                    this.initMyAvatar();
                }
                break;
            case LOS.SNSFRIEND:
                {
                    if(!this.startTime) return;
                    var curTime = (new Date()).getTime();

                    if(curTime - this.startTime > 10000) {
                        this.initSNSFriend();
                        // this.setUIOption();

                        // this.loadAvatarState = LOS.NONE;
                    }
                }
                break;
            case LOS.SUGGESTFRIEND:
                {
                    if(!this.startTime) return;
                    var curTime = (new Date()).getTime();

                    if(curTime - this.startTime > 10000) {
                        this.initSUGGESTFriend();
                        this.loadAvatarState = LOS.NONE;
                        this.startTime = null;
                    }
                }
                break;
        }
        
    }


    FSceneFriendRoom.prototype.setUIOption = function()
    {
        var self = this;

        var returnToHomeFunc = function()
        {
            G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).setAccountPk(-1);
            G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).setVisitPurposeForShare(false);
            G.sceneMgr.addScene('SCENE_MYROOM', new FSceneMyRoom(true));
            G.sceneMgr.changeScene('SCENE_MYROOM', true);
        }
        
        FRoomUI.getInstance().setProfileImage( G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getUrl() );

        FRoomUI.getInstance().setSmileMarkCount( CommFunc.numberWithCommas(G.dataManager.getUsrMgr(DEF_IDENTITY_ME).goods.SMILE_FREE) );

        FRoomUI.getInstance().changeButtonImage( ROOMBUTTON.STORE, ASSET_URL+"97_gui_new/00_main/m_home_btn_idle.png" );

        FRoomUI.getInstance().setSQImage([
            G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getSQInfoPath(SQtype.PRODUCE),
            G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getSQInfoPath(SQtype.CONSUME),
            G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getSQInfoPath(SQtype.SHARE)
        ]);

        FRoomUI.getInstance().applyUIButtonOpt([
            [ ROOMBUTTON.PROFILE, true, function(){ snsCommonFunc.snsView(8, G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getAccountPk() ); } ],

            [ ROOMBUTTON.SQ_CREATE, true, null ],
            [ ROOMBUTTON.SQ_CONSUME, true, null ],
            [ ROOMBUTTON.SQ_SHARE, true, null ],

            [ ROOMBUTTON.STORE, true, returnToHomeFunc ],
            [ ROOMBUTTON.AVATAR, true, self.goAvatarRoom ],

            [ ROOMBUTTON.SMILE, false, null ],
            [ ROOMBUTTON.PINKSMILE, false, null ],
            
            [ ROOMBUTTON.SHARE, G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getVisitPurposeForShare(), function(){ self.onClickSocialQuestShareBtn(); }]
        ]);

        FRoomUI.getInstance().clearSQAlertIcon();
    }

    
    FSceneFriendRoom.prototype.goAvatarRoom = function() {
        G.dataManager.setCameraInformation(G.scene.activeCamera.position, 
                                           G.scene.activeCamera.alpha, 
                                           G.scene.activeCamera.beta, 
                                           G.scene.activeCamera.radius,
                                           G.scene.activeCamera.target);
                                           
        G.sceneMgr.addScene('SCENE_AVATAR', new FSceneAvatar(true, RETURN_TO_MYROOM));
        G.sceneMgr.changeScene('SCENE_AVATAR', true);
    }

    FSceneFriendRoom.prototype.onClickSocialQuestShareBtn = function()
    {
        var self = this;
        snsCommonFunc.setSQShareSequence( function( in_param, in_postSeq )
        {
            self.onSelectSQSharePost( in_postSeq );
        }, null );

        snsCommonFunc.snsView(15);
    }

    FSceneFriendRoom.prototype.onSelectSQSharePost = function( in_postSeq )
    {
        this.dropPick( window.innerWidth/2 , window.innerHeight/2, in_postSeq );
    }



    FSceneFriendRoom.prototype.onPointerDown = function(evt) {
        if (evt.button !== 0) {
            return;
        }        

        if(this.videoTexture[this.nameScreen[0]]) this.videoTexture[this.nameScreen[0]].video.play();
        if(this.videoTexture[this.nameScreen[1]]) this.videoTexture[this.nameScreen[1]].video.play();
        if(this.videoTexture[this.nameScreen[2]]) this.videoTexture[this.nameScreen[2]].video.play();



        if ( FObjectTouchUI.getInstance().getReadyToAutoClose() )
            FObjectTouchUI.getInstance().onClickMainCloseBtn();

        if ( FPetTouchUI.getInstance().getReadyToAutoClose() )
            FPetTouchUI.getInstance().onClickmainCloseBtn();
        
        if ( FPlayerTouchUI.getInstance().getReadyToAutoClose() )
            FPlayerTouchUI.getInstance().onClickmainCloseBtn();

        // var pickResult = G.scene.pick(evt.clientX, evt.clientY);

        // if (pickResult.hit) {

        //     this.startIndex = FMapManager.getInstance().getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z);

        //     this.sx = evt.clientX;
        //     this.sy = evt.clientY;
        // }

        
        G.cameraManager.clearTarget();
    }

    FSceneFriendRoom.prototype.onPointerGUp = function(evt) {
        if (evt.button !== 0) {
            return;
        }

    }

    FSceneFriendRoom.prototype.onPointerUp = function(evt) {
        if (evt.button !== 0) {
            return;
        }

        if ( FObjectTouchUI.getInstance().getReadyToAutoClose() )
        FObjectTouchUI.getInstance().closeUI();

        // var pickResult = G.scene.pick(evt.clientX, evt.clientY);

        // if(Math.abs(this.sx - evt.clientX) > 10 || Math.abs(this.sy - evt.clientY) > 10 ) {
        //     this.startIndex = -1;
        //     this.sx = this.sy = -1;
        //     return;
        // }

        // if (pickResult.hit) {
        //     var endIndex = FMapManager.getInstance().getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z);

        //     if(this.startIndex == endIndex) {
        //         if(this.myAvatar) 
        //         {
        //             if ( this.myAvatar.startMove(this.startIndex) )
        //                 G.cameraManager.setTarget( this.myAvatar ); // 실제 움직일때만 얘가 호출되어야 함
        //         }

        //         if ( -1 != FMapManager.getInstance().getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z) )
        //             CommRender.createPointerEffect(pickResult.pickedPoint.x, pickResult.pickedPoint.z);
        //     }
            
        //     if ( FObjectTouchUI.getInstance().getReadyToAutoClose() )
        //         FObjectTouchUI.getInstance().closeUI();
        // }
 
    }

    FSceneFriendRoom.prototype.onPointerMove = function(evt) {
        
        if (evt.button !== 0) {
            return;
        }

    }
   
    FSceneFriendRoom.prototype.onPointerDouble = function(evt) {
        
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

    FSceneFriendRoom.prototype.onResize = function() {
        // Debug.Log("onResize");
    }

    FSceneFriendRoom.prototype.isPickableMesh = function(mesh) {

        if( ((mesh.metadata != null) && ((mesh.metadata.layerName == "Ground") || (mesh.metadata.layerName == "Default")) )
             || (mesh.name == "skyBox")) {
                return true;
        }
        return false; 
    }

   //<------------------------------------------------------------------------------------------------------------------
    //친구 집으로 가기
    FSceneFriendRoom.prototype.goMyRoom = function() {
        
        FMapManager.getInstance().clearAllObjectMap();
        G.resManager.clearAllMesh();

        var self = this;
        var json = protocol.getRoomMapFriend(G.dataManager.getFriendPk());
        ws.onRequest(json, self.goMyFriendCB, self);
    }

    FSceneFriendRoom.prototype.goMyFriendCB = function(res, self) {

        protocol.res_getRoomMapFriend(res);

        var roomID = 100000 + G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).roomType;
        // var backID = null;//"home_ground_01";

        FMapManager.getInstance().createMapData(roomID, function() {

            self.preloadAvatar();
            
        });

        self.loadRoomMesh(roomID, null, function(){
            
            // self.netState = LOS.NET_SNSFRIEND;
            FMapManager.getInstance().clearAllObjectMap();
            G.resManager.clearAllMesh();

            self.netState = LOS.NET_SNSFRIEND;
            // self.loadAvatarState = LOS.MYAVATAR;

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

    FSceneFriendRoom.prototype.wsSendGetStarContents = function() {

        var json = protocol.getStarContentsFriend(G.dataManager.getFriendPk());
        ws.onRequest(json, this.getStarContentsCB, this);

    }

    FSceneFriendRoom.prototype.getStarContentsCB = function(res, self) {
        protocol.res_getStarContentsFriend(res);

        self.netState = LOS.NET_GETOBJECTMAP;
    }

    FSceneFriendRoom.prototype.wsSendGetObjectMap = function() {

        var json = protocol.getObjectMapFriend(G.dataManager.getFriendPk());
        ws.onRequest(json, this.getObjectMapCB, this);
    }

    FSceneFriendRoom.prototype.getObjectMapCB = function(res, self) {

        protocol.res_getObjectMapFriend(res);

        // self.setUIOption();

        // self.loadAvatarState = LOS.SNSFRIEND;
    }

    FSceneFriendRoom.prototype.wsSendSNSQuestLoad = function() {

        var json = protocol.getSNSQuestFriend(G.dataManager.getFriendPk());
        ws.onRequest(json, this.getSNSQuestCB, this);
    }

    FSceneFriendRoom.prototype.getSNSQuestCB = function(res, self) {
        protocol.res_getSNSQuestFriend(res);

        self.netState = LOS.NET_SUGGESTFRIEND;

        self.setUIOption();
        GUI.showMainUI();
        FRoomUI.getInstance().setUIVisible( true );
    }


    FSceneFriendRoom.prototype.wsSendSuggestFriend = function(){

        var json = protocol.getSuggestFriendVisit(G.dataManager.getFriendPk());
        ws.onRequest(json, this.suggestFriendCB, this);
    }


    FSceneFriendRoom.prototype.suggestFriendCB = function(res, self) {

        protocol.res_getSuggestFriendVisit(res);

        self.netState = LOS.NET_GETSTAR;
    }

    //<------------------------------------------------------------------------------------------------------------------

    FSceneFriendRoom.prototype.preloadAvatar = function() {

        G.resManager.loadBaseAvatar(this, function(self){
            // self.initCharactor();
            self.loadAvatarState = LOS.OWNERAVATAR;
        });

    }

    FSceneFriendRoom.prototype.initOwnerAvatar = function() {
        
        var self = this;
        //친구집 주인장
        this.yourAvatar = new FRoomCharactor(1,'mychar');

        var cd = G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).avatarCd;
        var avatarInfo = G.resManager.getAvatarCode(cd);

        // this.yourAvatar.equipAlphaGo(false, false);
        this.yourAvatar.setProfile(G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getUrl(), null);
        this.yourAvatar.setTileIndex(FMapManager.getInstance().getAvatarStartPos());
        this.yourAvatar.setJustWalk(true);
        this.yourAvatar.setInsideWalk(true);
        this.yourAvatar.setPk(G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getAccountPk());
        this.loadAvatarState = LOS.NONE;
        this.yourAvatar.createAvatar(avatarInfo, function() {
            self.yourAvatar.initRoomCharactor(true);
            self.yourAvatar.setTouchEvent( self, self.yourAvatar, self.onClickFriend );
            self.loadAvatarState = LOS.MYAVATAR;
        });
    }

    FSceneFriendRoom.prototype.initMyAvatar = function() {

        var self = this;
        var pos = FMapManager.getInstance().getAvatarStartPos() - FMapManager.getInstance().getTileWidth()*3 ;
        
        this.loadAvatarState = LOS.NONE;
        this.createMyAvatar(pos, function(){
            G.cameraManager.setTarget( self.myAvatar ); 
            G.guiMain.setAlpha( 1 ); //아바타 로딩 다 되면 UI 보여준다

            self.sayHello();
            self.startTime = (new Date()).getTime();
            self.loadAvatarState = LOS.SNSFRIEND;

            hideTip();
        });

    }

    FSceneFriendRoom.prototype.sayHello = function() {
        if(!this.myAvatar || !this.yourAvatar) return;

        var self = this;

        this.myAvatar.oppLook(this.yourAvatar);
        this.yourAvatar.oppLook(this.myAvatar);

        setTimeout(function(){
            self.myAvatar.startAnimation( getRandomHelloAni(), false, true );
            self.yourAvatar.startAnimation( getRandomHelloAni(), false, true );
            self.yourAvatar.equipAlphaGo(false, false);

        }, 500);

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

    FSceneFriendRoom.prototype.initSNSFriend = function() {

        var self = this;
        var friendLen = 3;
        var applyFriend = function( i )
        {
            var cd = G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getSocialFriend(i).TEAM_AVATARCD;
            var avatarInfo = G.resManager.getAvatarCode(cd);

            if(cd) {
                var friend = new FRoomCharactor(0,'sns'+i);
                var pos = FMapManager.getInstance().getAvatarStartPos() - FMapManager.getInstance().getTileWidth()*10 - i*3;

                friend.setProfile(G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getSQInfoPath(i), G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getSQInfoIntro(i));
                //friend.setTileIndex(FMapManager.getInstance().getAvatarStartPos() - i);
                friend.setTileIndex(pos); 
                friend.setJustWalk(true);
                friend.setInsideWalk(true);
                friend.setPk(G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getSocialFriend(i).TEAM_ACCOUNTPK);
                friend.createAvatar(avatarInfo, function(){
                    friend.initRoomCharactor(true);
                    friend.setTouchEvent(self, friend, self.onClickFriend);
                    self.friends.push(friend);

                    if(friendLen == self.friends.length) {

                        self.friends.forEach(function(friend){
                            friend.equipAlphaGo(false, false);
                        });

                        self.startTime = (new Date()).getTime();
                        self.loadAvatarState = LOS.SUGGESTFRIEND;
                    }
                });
            }
        }

        this.loadAvatarState = LOS.NONE;
        //소셜친구 3명
        for(var i=0; i<friendLen; i++) {

            applyFriend(i);
        }
        

    }

    FSceneFriendRoom.prototype.onClickPlayerUICallBack = function( in_callBackType, in_callBackValue, in_clickedFriend )
    {
        switch( in_callBackType )
        {
            // 플레이어 상호작용 버튼 누름
        case PLAYERUI_CALLBACK_TYPE.INTERACTION :
            {
                // 하이파이브
                if ( in_callBackValue == PLAYERUI_TEST_INTERACTION.HIGHFIVE )
                {
                    in_clickedFriend.touch(this.myAvatar);
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

    FSceneFriendRoom.prototype.onClickFriend = function(e, lparam, pparam)
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


    FSceneFriendRoom.prototype.initSUGGESTFriend = function() {
        var self = this;
        var suggest = G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getSuggestFriend();

        var applySuggestFriend = function(i) {
            var cd = suggest[i].AVATACD;
            var avatarInfo = G.resManager.getAvatarCode(cd);

            var imgUrl = suggest[i].IMG_PATH + suggest[i].IMG_URL;

            if(cd) {
                var friend = new FRoomCharactor(0,'outside'+i);
                
                friend.equipAlphaGo(false, false);
                friend.setProfile(imgUrl, suggest[i].INTRO);
                friend.setTileIndex(getRandomTileToBehindHome());
                friend.setPk(suggest[i].ACCOUNTPK);
                friend.setJustWalk(true);
                friend.setInsideWalk(false);
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
    }


    FSceneFriendRoom.prototype.initCharactor = function() {
        
        var self = this;

        // this.createMyAvatar(FMapManager.getInstance().getAvatarStartPos(), function(){
        //     G.cameraManager.setTarget( self.myAvatar ); 
        // });

        // //친구집 주인장
        // var owner = new FRoomCharactor(1,'mychar');

        // var cd = G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).avatarCd;
        // var avatarInfo = G.resManager.getAvatarCode(cd);

        // owner.equipAlphaGo(false, false);
        // owner.setProfile(G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getUrl(), null);
        // owner.setTileIndex(FMapManager.getInstance().getAvatarStartPos());
        // owner.setJustWalk(true);
        // owner.setInsideWalk(true);
        // owner.createAvatar(avatarInfo, function() {
        //     owner.initRoomCharactor(true);
        //     self.friends.push(owner);
        // });


        
        //옥외추천
        // var suggest = G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getSuggestFriend();

        // var applySuggestFriend = function(i) {
        //     var cd = suggest[i].AVATACD;
        //     var avatarInfo = G.resManager.getAvatarCode(cd);

        //     var imgUrl = suggest[i].IMG_PATH + suggest[i].IMG_URL;

        //     if(cd) {
        //         var friend = new FRoomCharactor(0,'outside'+i);
                
        //         friend.equipAlphaGo(false, false);
        //         friend.setProfile(imgUrl, suggest[i].INTRO);
        //         friend.setTileIndex(FMapManager.getInstance().getAvatarStartPos() - i);
        //         friend.setJustWalk(true);
        //         friend.setInsideWalk(false);
        //         friend.createAvatar(avatarInfo, function(){
        //             friend.initRoomCharactor(true);
        //             self.friends.push(friend);
        //         });
        //     }
        // }

        // for(var i=0; i<3; i++) {

        //     if(i>=suggest.length ) break;

        //     applySuggestFriend(i);
        // }
    }


    FSceneFriendRoom.prototype.initVehicles = function() {

        var mesh;

        var suggest = G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getSuggestFriend();
        // suggestfriend.length;

        var k = 0;
        for(var i=10; i<15; i++) {

            if(i>=suggest.length ) break;
            if(k>=PathDataStreet.length) break;

            var carName = 530000 + k;
            var imgUrl = suggest[i].IMG_PATH + suggest[i].IMG_URL;
            var vehicle = new FVehicle(CommFunc.nameGuid(carName.toString()), carName, PathDataStreet[k], imgUrl, suggest[i].INTRO, this.touchoutfriend, this, i);
            vehicle.setOthers(this.car);
            this.car.push(vehicle);
            k++;
        }
    }

    //<------------------------------------------------------------------------------------------------------------------
    FSceneFriendRoom.prototype.dropPick = function(x, y, param){
        
        var self = this;

        this.postSeq = Number(param);
        this.giftTile = CommFunc.randomMinMax( 20, 30 );// FMapManager.getInstance().getTouchPointToTileIndex(x,y);

        this.wsAddShareObj();
        
        G.soundManager.playEffectSound("EFFECT_Object.ogg");
    }

    FSceneFriendRoom.prototype.touchfriend = function(self,type) {
        
        // var suggestfriend = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSuggestFriend();
                
        // self.wsGetSuggestFriendInfo(suggestfriend[type].ACCOUNTPK);
        // self.renderViewContents(type);
    }

    FSceneFriendRoom.prototype.addGiftBoxInMap = function() {
        var name = CommFunc.nameGuid('giftbox');
        var worldPos = FMapManager.getInstance().getIndexToWorld(this.giftTile);
        var box = new FGiftBox(name, worldPos, this.touchfriend, this, this.giftbox.length, function()
        {
            G.cameraManager.goToTarget( box.mesh.position, G.camera.radius, 1 );
        } );
        this.giftbox.push(box);

        
        FRoomUI.getInstance().applyUIButtonOpt([
            [ ROOMBUTTON.SHARE, false, null ]
        ]);
    }

    FSceneFriendRoom.prototype.wsAddShareObj = function() {
        var json;
        
        json = protocol.addShareObj(G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getAccountPk(), this.giftTile, this.postSeq, 3600, Base64.encode("선물입니다."));
        ws.onRequest(json, this.addShareObjCB, this);
    }

    FSceneFriendRoom.prototype.addShareObjCB = function(res, self) {
        
        protocol.res_addShareObj(res);

        self.addGiftBoxInMap();
    }

    FSceneFriendRoom.prototype.touchoutfriend = function(self,type) {
        
        var suggestfriend = G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getSuggestFriend();
                
        self.wsGetSuggestFriendInfo(suggestfriend[type].ACCOUNTPK);
    }

    FSceneFriendRoom.prototype.wsGetSuggestFriendInfo = function(pk) {

        var json;
        
        json = protocol.getSuggestFriendInfo(pk);
        ws.onRequest(json, this.getSuggestFriendInfoCB, this);
    }

    FSceneFriendRoom.prototype.getSuggestFriendInfoCB = function(res, self){

        protocol.res_getSuggestFriendInfo(res, 1);

        self.renderViewContents(G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getSuggestFriendDetail(res.friendAccountPk));
    }

    FSceneFriendRoom.prototype.closePopup = function()
    {
        GUI.removeContainer(this.wrapContents);
        this.wrapContents = null;
        G.camera.attachControl(G.canvas, true); 
    };

    FSceneFriendRoom.prototype.renderViewContents = function(friend) {

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


        //간이사진1
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



    //<--------------------------------------------------------------------------------------------------------------
    FSceneFriendRoom.prototype.clearStartContents = function() {
        if(this.scPanel) {
            this.scPanel.dispose();
            this.scPanel = null;
        }        
    }

    FSceneFriendRoom.prototype.updateStartContents = function() {
        this.bRenderStarCon = false;

        // this.scThread = setTimeout(setTimeoutFriendStarContents, 1000);
    }

    // setTimeoutFriendStarContents = function() {
    //     var scene = G.sceneMgr.getCurrentScene();

    //     scene.renderStartContents();
    // }    

    FSceneFriendRoom.prototype.renderStartContents = function() {

        // if(this.bRenderStarCon) return;

        // if(this.scPanel) {
        //     this.scPanel.dispose();
        // }
        
        // this.scPanel = G.guiMain;//GUI.createPanel('friendStarContents');

        var info = G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getStarContentInfo();

        this.bRenderStarCon = CommRender.renderStartContents(G.guiMain, info);
        // if(this.bRenderStarCon) clearTimeout(this.scThread);
        // else this.scThread = setTimeout(setTimeoutFriendStarContents, 1000);              
        
        // 이곳에 친구 집 첫방문시 토크박스 연출을 넣자.
        // G.scriptManager.openFriendIntroTalk( G.dataManager.getFriendPk() );
    }

    //<------------------------------------------------------------------------------------------------------------------
    //친구 집으로 가기
    FSceneFriendRoom.prototype.goMyFriend = function() {
        
        this.clearStartContents();

        var pk = G.dataManager.getFriendPk();

        G.sceneMgr.addScene('SCENE_MYFRIENDROOM', new FSceneFriendRoom(pk));
        G.sceneMgr.changeScene('SCENE_MYFRIENDROOM', true);
    }

    FSceneFriendRoom.prototype.textureDispose = function(name) {

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


    return FSceneFriendRoom;

}());









