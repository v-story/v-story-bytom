'use strict';

var FSceneBeach = (function () {

    __inherit(FSceneBeach, FRoom);

    var INTERSTATE_NONE = 0;
    var INTERSTATE_INFO = 1;

    var INTERSTATE_REQUEST      = 2;
    var INTERSTATE_REQUEST_N    = 3;
    var INTERSTATE_ACCEPT       = 4;
    var INTERSTATE_ACCEPT_N     = 5;
    var INTERSTATE_ENTER        = 6;
    var INTERSTATE_EXIT         = 7;

    function FSceneBeach() {

        this.setName('FSceneBeach');

        // this.myCamera           = null;
        this.sx                 = null;
        this.sy                 = null;
        this.preState           = null;
        this.wrapBtn            = null;
        this.wrapBtnChannel     = null;
        this.wrapTopInfo        = null;

        // this.beLoaded           = null;
        this.skybox             = null;

  
        this.adBestCount        = null;
        this.adRecentCount      = null;

        this.btnChannel         = null;
        this.btnChannelExpand   = null;
        this.currentChannel     = null;
        // this.materialBox1 = null;

        this.videoBuffer        = null;
        
        this.videoTexture       = null;

        this.hashTag            = null;

        /*이벤트 중복 방지용*/
        this.preEvt             = null; 

        this.interState         = null;

        // 카메라 애니메이션용
        this.cameraAni          = null;
        this.friends = [];

        showTip();

        return this;
    }

    FSceneBeach.prototype.init = function () {

        FRoom.prototype.init.call(this);

        var self = this;

        G.eventManager.setEnableTouched(this.name, this);
       
        this.sx = -1;
        this.sy = -1;
        this.preState = -1;

        // this.beLoaded = false;
        this.adBestCount = 0;
        this.adRecentCount = 0;

        this.btnChannelExpand = [];
        this.currentChannel = -1;
        this.videoBuffer = [];
        
        this.videoTexture = new Array(2);
        this.hashTag = "해변";

        this.interState = INTERSTATE_NONE;

        // 카메라 애니메이션용
        this.cameraAni = 
        {
            ani : null,

            myChar : null,
            targetChar : null,

            pos :
            {
                x : 0, 
                y : 0,
                z : 0,
            }
        }

        var roomID = ROOMTYPE_BEACH;
        var backID = null;

        FMapManager.getInstance().createMapData(ROOMTYPE_BEACH);
        this.loadRoomMesh(roomID, backID, function(){

            // if(G.guiMain) G.guiMain.dispose();
            // G.guiMain = new GUI.createMainGUI('BEACH_ADVANCEDDYNAMICTEXTURE');

            self.setUIOption();
            
            // self.drawGrid();
    
            self.enterChannel();
            self.procAdScreen();
            // CommRender.showAxis(G.scene, 50);
    
            self.setSkybox();
            self.initSceneCamera();

            GUI.showMainUI();
            FRoomUI.getInstance().setUIVisible( true );
            G.cameraManager.setCameraLimitInfo( -270*3.5, 170*3.5, -270*3.5, 410*3.5, 160, 700, 470, ToRadians(270), ToRadians(70) );  
    
            // G.chatManager.showChatPrevUI();
            // G.chatManager.selectViewFilterType( CHAT_DATA.TYPE.SPOT );
            // G.chatManager.selectSendFilterType( CHAT_DATA.TYPE.SPOT );
        });

        this.screenIntervalId = setInterval(function(){
            self.procAdScreen();

        }, 600000);

        G.soundManager.mute();

    };



    FSceneBeach.prototype.destroy = function () {
        G.cameraManager.clearTarget();
        FRoomUI.getInstance().setUIVisible( false );

        FRoom.prototype.destroy.call(this);
        
        var json = protocol.exitChannel();
        ws.onRequest(json, null, this);
        ws_channel.stopApollo13();

        G.eventManager.clearEnableTouched(this.name);

        this.friends.forEach(function(friend){
            friend.destroy();
        });

        //G.resManager 없애야 한다.
        GUI.removeContainer(self.wrapBtn);          self.wrapBtn = null;
        GUI.removeContainer(self.wrapTopInfo);      self.wrapTopInfo = null;
        GUI.removeContainer(self.wrapBtnChannel);   self.wrapBtnChannel = null;

        G.guiMain.dispose();
        G.dataManager.dataChannel.destroy();

        // CommFunc.detachCamera();
        CommFunc.removeLight();

        // G.resManager.clearScene();
        // G.resManager.clearChildren();

        this.skybox.dispose();

        clearInterval(this.screenIntervalId);

        G.soundManager.stopSound();

        for(var i=0; i<this.videoTexture.length; i++) {
            if(this.videoTexture[i]) this.videoTexture[i].dispose();
        }

        this.destroyAdScreenPic();
        this.destroyAdScreenVideo();


        this.clearGrid();
    };


    FSceneBeach.prototype.enterChannel = function() {
        var json;
        
        json = protocol.enterChannel(CHANNEL_ID);
        ws.onRequest(json, this.enterChannelCB, this);
    }

    FSceneBeach.prototype.enterChannelCB = function(res, self) {
        
        protocol.res_enterChannel(res);

        //박종훈부장님이 이렇게 하라고 함..
        setTimeout(function(){
            var channelName = G.dataManager.dataChannel.channelName;
            ws_channel.lanunchApollo13(channelName, self, self.redisCallback);
    
            self.initCharactor();
            self.renderInfo(channelName);
        }, 1000);
    }

    FSceneBeach.prototype.changeChannel = function (channelIndex) {

        var json;
        
        json = protocol.changeChannel(CHANNEL_ID, channelIndex);
        ws.onRequest(json, this.changeChannelCB, this);
    }

    FSceneBeach.prototype.changeChannelCB = function(res, self) {

        protocol.res_changeChannel(res);

        ws_channel.stopApollo13();

        var channelName = G.dataManager.dataChannel.channelName;
        ws_channel.lanunchApollo13(channelName, self, self.redisCallback);

        self.initCharactor();
        self.renderInfo(channelName);
    }



    FSceneBeach.prototype.setSkybox = function() {
        
        this.skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:20480.0}, G.scene);
        
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", G.scene);
        
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(ASSET_URL+"70_skybox/TropicalSunnyDay", G.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        this.skybox.material = skyboxMaterial;
        this.skybox.position.y = 0;

        // var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 2048, 2048, 16, G.scene, false);
        // var water = new BABYLON.WaterMaterial("water", G.scene, new BABYLON.Vector2(512, 512));
        // water.backFaceCulling = true;
        // water.bumpTexture = new BABYLON.Texture(ASSET_URL+"98_skybox/waterbump.png", G.scene);
        // water.windForce = -10;
        // water.waveHeight = 0.1;
        // water.bumpHeight = 0.1;
        // water.windDirection = new BABYLON.Vector2(1, 1);
        // water.waterColor = new BABYLON.Color3(0, 0, 221 / 255);
        // water.colorBlendFactor = 0.0;
        // water.addToRenderList(skybox);
        // waterMesh.material = water;
        // waterMesh.position.y = -1;
    }


    FSceneBeach.prototype.enterAvatar = function(user) {
        
        var self = this;
        
        // G.resManager.clearAvatarIndex();
        // G.resManager.pushAvatarCode(user.avatar);

        // G.resManager.excutePreloadAvatar(this, function(self){

        //     self.createAvatar(user);

        // });
        

        G.resManager.loadBaseAvatar(this, function(self){
            self.createAvatar(user);
        });



        G.chatManager.refreshSpotUserUI();

        snsCommonFunc.chatTitleLender(this.getSceneNameToString(G.dataManager.dataChannel.getUsersCount()));
    }

    FSceneBeach.prototype.exitAvatar = function(pk) {

        if(FInteractionMenu.getInstance().targetInfo) {
            if ( FInteractionMenu.getInstance().targetInfo.user.pk == pk ) {
                FInteractionMenu.getInstance().closeInteractionMenu();
                this.interState = INTERSTATE_NONE;
                this.interactionStatusInit();
                this.clearInteractionCameraAni();
            }
        }

        G.dataManager.dataChannel.removeUser(pk);

        G.chatManager.refreshSpotUserUI();


        snsCommonFunc.chatTitleLender(this.getSceneNameToString(G.dataManager.dataChannel.getUsersCount()));
    }


    FSceneBeach.prototype.interactionStatusInit = function() {

        var json = protocol.channelInteractiveStatusInit();
        ws.onRequest(json, this.channelInteractiveStatusInitCB, this);
    }


    FSceneBeach.prototype.channelInteractiveStatusInitCB = function(res, self) {

    }


    //<------------------------------------------------------------------------------------------------------------------

    FSceneBeach.prototype.redisCallback = function(self, json) {

        // if(!self.beLoaded) alert('oh my god!!!!!');

        //누군가가 채널에 들어옴
        if(opcode['EnterChannel'] == json.opcode) {

            if(json.accountPk == ACCOUNTPK) return;

            var user = {
                'pk' : json.accountPk,
                'id' : json.accountId,
                'avatar' : json.avatarCd,
                'gender' : json.gender,
                'profile' : json.profileImg,
                'tileIdx' : json.tileIdx,
                'serverIndex' : json.serverIndex,
                'avatarObj' : null
            }
    
            G.dataManager.dataChannel.addUser(user);

            self.enterAvatar(user);
            self.addSystemMessage(INTERSTATE_ENTER, user, null);
            console.log('enter channel => ' + json.accountId);

        } else if(opcode['ExitChannel'] == json.opcode) {
            console.log('exit => ' + json.accountPk);

            var user = G.dataManager.dataChannel.getUserInfo(json.accountPk);
            //누군가가 채널을 떠났다.
            self.exitAvatar(json.accountPk);

            self.addSystemMessage(INTERSTATE_EXIT, user, null);
        
        } else if(opcode['MoveLocation'] == json.opcode) {

            if(json.accountPk != ACCOUNTPK) {
                var avatar = G.dataManager.dataChannel.getUserAvatar(json.accountPk);

                if(avatar) {
         
                    if(json.tileIdx != 55555) {
                        avatar.startMove(json.tileIdx);
                    }
                    else {
    
                        var data = JSON.parse(json.stringData);
    
                        if(data.Animation != null) {
    
                            avatar.startAction(data.Animation, data.Loop);
    
                        } else if(data.Qrotation != null) {
    
                            // avatar.setRotationQuaternion(data.Qrotation);
                        }
                    }
                }
    
                console.log('move => ' + json.accountPk + '(' + json.tileIdx+')');
            }

        } else if(opcode['ChatChannel'] == json.opcode 
                || opcode['ChatWorld'] == json.opcode ) {

            var avatar = G.dataManager.dataChannel.getUserAvatar(json.accountPk);

            // var text = {
            //     'world' : world,        // false 일시 스팟에서 오는것이다
            //     'pk' : json.accountPk,  // 보낸사람 pk
            //     'id' : json.accountId,             // 보낸사람
            //     'toPk' : toPk,          // null 이 아니면 해당대상에게 귓속말
            //     'toId' : toWho,         // null 이 아니면 해당대상에게 귓속말
            //     'msg' : Base64.decode(json.chatMsg)
            // };

            avatar.renderTextBalloon(Base64.decode(json.chatMsg));

        } else if(opcode['Whisper'] == json.opcode ) {

            var avatar = G.dataManager.dataChannel.getUserAvatar(json.fromAccountPk);

            // var text = {
            //     'world' : world,        // false 일시 스팟에서 오는것이다
            //     'pk' : json.accountPk,  // 보낸사람 pk
            //     'id' : json.accountId,             // 보낸사람
            //     'toPk' : toPk,          // null 이 아니면 해당대상에게 귓속말
            //     'toId' : toWho,         // null 이 아니면 해당대상에게 귓속말
            //     'msg' : Base64.decode(json.chatMsg)
            // };

            avatar.renderTextBalloon(Base64.decode(json.chatMsg));
        }
    }


    
    FSceneBeach.prototype.run = function () {
        
        this.procCameraAni();


        // 타일범위를 테스트 해 보자
        // if ( !this.beLoaded )
        //     return;

        // if ( CommFunc.random(100) < 10 )
        // {
        //     var pos = FMapManager.getInstance().getIndexToWorld( getRandomTileInSpae( 5896, 36, 24, 130, 130 ) );

        //     var xOf = CommFunc.random( 36 )+1;
        //     var yOf = (CommFunc.random( 24 )+1)*130;

        //     var indexOF = 5896+xOf+yOf;

        //     pos = FMapManager.getInstance().getIndexToWorld( indexOF );

        //     Debug.renderBox( 2.0, new Vector3( pos.x, 30, pos.z ) );
        // }

        return 0;
    };


//     FSceneBeach.prototype.initDefaultScene = function() {
        
//         // var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:128.0}, G.scene);
//         // var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", G.scene);
//         // skyboxMaterial.backFaceCulling = false;
//         // skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(ASSET_URL+"1_myroom/skybox/sunny", G.scene);
//         // skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
//         // skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
//         // skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
//         // skyboxMaterial.disableLighting = true;
//         // skybox.material = skyboxMaterial;

//         G.scene.clearColor = new BABYLON.Color3(1,1,1);


//         if(!this.isPhone) {
//             G.camera = new BABYLON.ArcRotateCamera('beachArcCamera', ToRadians(286), ToRadians(73), 50, BABYLON.Vector3.Zero(), G.scene);
//             G.camera.setTarget(new BABYLON.Vector3(-35,0,-51));
//             G.camera.setPosition(new BABYLON.Vector3(-20,15,-97));
//         } else {
//             G.camera = new BABYLON.ArcRotateCamera('beachArcCamera', 0, 0, 90, BABYLON.Vector3.Zero(), G.scene);
//             G.camera.setPosition(new BABYLON.Vector3(-40,20,-123));
//             G.camera.setTarget(new BABYLON.Vector3(-40,0,-28));
//         }


//         // G.camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', 0, 0, 0, BABYLON.Vector3.Zero(), G.scene);

//         // G.camera = new BABYLON.FreeCamera('ArcRotateCamera', new BABYLON.Vector3(0,0,-10), G.scene);
//         // G.camera.viewport = new BABYLON.Viewport(0, 0, 1.0, 1.0);

//         G.scene.activeCamera = G.camera;
// /*
//         G.camera.viewport = new BABYLON.Viewport(0, 0, 1.0, 1.0);
//         var camera = new BABYLON.ArcRotateCamera('myRoomArcCamera', ToRadians(270), ToRadians(35), 40, BABYLON.Vector3.Zero(), G.scene);
//         camera.viewport = new BABYLON.Viewport(0.2, 0.2, 0.2, 0.2);

//         G.scene.activeCameras.push(G.camera);
//         G.scene.activeCameras.push(camera);
//         */
//         G.camera.minZ = 1;
//         G.camera.maxZ = 25000;//400;
        

//         // G.camera.alpha  = ToRadians(270);//4.7 ;//1.566; 180*e/Math.PI
//         // G.camera.beta   = 1.24;//1.106;
//         // G.camera.radius = 97; //60일때 타일 계산(FMapManager.prototype.getWorldToIndex)에서 인덱스 12와 18의 경계에서..오류가 발생한다..왜???


//         // G.camera.alpha = this.ALPHA;
//         // G.camera.beta = this.QUATER_BETA;
//         // G.camera.radius = 50;

//         // G.camera.beta = ToRadians(10);

//         //G.camera.alpha  = ToRadians(0);//1.566;
//         //G.camera.beta   = ToRadians(35);//1.106;
//         //G.camera.radius = 40; //60일때 타일 계산(FMapManager.prototype.getWorldToIndex)에서 인덱스 12와 18의 경계에서..오류가 발생한다..왜???

//         // G.engine.isPointerLock = true;


//         G.camera.inputs.clear();  // Remove all previous inputs

//         this.myCamera = new FMyArcRotateCameraPointersInput(1,0,1,0.3);
//         G.camera.inputs.add( this.myCamera );

//         G.eventManager.clearEnableTouched("sceneBeachArcCamera");
//         G.eventManager.setEnableTouched("sceneBeachArcCamera", this.myCamera);
//         // G.eventManager.setEnableTouched("myRoomArcCamera", this.myCamera);



//         window.addEventListener("contextmenu", function (evt){	evt.preventDefault();});
//         G.camera.attachControl(G.canvas, true); 

//         //카메라 위치 저장했던 곳으로 이동!!
//         // var pre = G.dataManager.getPreCameraInfo();

//         // if(pre) {
//         //     G.camera.setPosition(pre.pos);
//         //     G.camera.alpha = pre.a;
//         //     G.camera.beta =  pre.b;
//         //     G.camera.radius =  pre.r;
//         //     G.camera.setTarget(pre.target);

//         //     G.dataManager.setCameraInformation(null, 0, 0, 0, null);
//         // }

//         this.initCameraLimit();
//         G.engine.hideLoadingUI();
//     }


    // FSceneBeach.prototype.initCameraLimit = function() {
    //     G.camera.lowerBetaLimit = 0.1;
    //     G.camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    //     G.camera.lowerRadiusLimit = 15;
    //     G.camera.upperRadiusLimit = 1000;
    // }

    FSceneBeach.prototype.procAdScreen = function() {

        this.destroyAdScreenPic();
        this.destroyAdScreenVideo();

        var advertise = G.dataManager.dataChannel.getAdInfo(this.hashTag);

        if(!advertise) return;

        if(advertise.adBest.length) {

            this.renderAdScreen(advertise, this.adBestCount, 1);

            var n = advertise.adBest.length;
            this.adBestCount = (this.adBestCount + 1) % n;
        }


        if(advertise.adRecent.length) {

            this.renderAdScreen(advertise, this.adRecentCount, 2);

            var n = advertise.adRecent.length;
            this.adRecentCount = (this.adRecentCount + 1) % n;
        }

    }


    FSceneBeach.prototype.renderAdScreen = function(advertise, count, number) {

        var array = null;

        if( 1 == number ) array = advertise.adBest;
        else if( 2 == number ) array = advertise.adRecent;
        
        if(!array || !array.length) return;

        if(array[count].type == 1) this.renderAdScreenPic(array[count].url, number);
        else if(array[count].type == 2) this.renderAdScreenVideo(array[count].url, number);
    }


    FSceneBeach.prototype.destroyAdScreenPic = function() {

        var name = ['spot_beach_screen_1','spot_beach_screen_2'];

        for(var i=0; i<name.length; i++) {

            var screen = G.scene.getMeshByName(name[i]);

            if(screen) {
    
                if(screen.material) {
    
                    if(screen.material.diffuseTexture) screen.material.diffuseTexture.dispose();
                    screen.material.dispose();
                }
            }
        }
    }

    FSceneBeach.prototype.renderAdScreenPic = function(url, number) {

        if(!url) return;
        if(!(number == 1 || number == 2)) return;

        var name, textureName;

        if(number == 1) name = 'spot_01_screen_1';
        else if(number == 2) name = 'spot_01_screen_2';

        textureName = "texture" + name;
        // url = "//i.ytimg.com/vi/Rdqmn6lWhSs/hqdefault.jpg";
        var screen = G.scene.getMeshByName(name);

        if(screen) {

            if(screen.material) {

                if(screen.material.diffuseTexture) screen.material.diffuseTexture.dispose();

                screen.material.dispose();
            }
        
            screen.isVisible = true;
            var xmlhttp = new XMLHttpRequest();
            var materialBox = new BABYLON.StandardMaterial(textureName, G.scene);
            xmlhttp.onreadystatechange = function () {
                // console.log("xmlhttp", xmlhttp.readyState, xmlhttp.status)
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var buffer = xmlhttp.response;
                    var bytes = new Uint8Array(buffer);
                    var tex = new BABYLON.Texture("data:grass", G.scene, false, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, "data:image/png;base64," + CommFunc.pngEncode(bytes), true);
                    materialBox.diffuseTexture = tex;
                    materialBox.diffuseTexture.uScale = 1.0;
                    materialBox.diffuseTexture.vScale = -1.0;
                }
            };
            xmlhttp.responseType = "arraybuffer";
            xmlhttp.open("GET", url, true);
            xmlhttp.send();

            screen.material = materialBox;

            if(screen.actionManager) { 
                screen.actionManager.dispose();
                screen.actionManager = null;
            }

            screen.actionManager = new BABYLON.ActionManager(G.scene);
            screen.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {

                snsCommonFunc.snsView(14,"해변");

            }));


        }
    }

    FSceneBeach.prototype.destroyAdScreenVideo = function() {

        var name = ['spot_01_screen_1','spot_01_screen_2'];

        for(var i=0; i<name.length; i++) {

            var screen = G.scene.getMeshByName(name[i]);

            if(screen) {
    
                if(screen.material) {
    
                    if(screen.material.diffuseTexture) screen.material.diffuseTexture.dispose();
                    screen.material.dispose();
                    if(this.videoTexture[i]) this.videoTexture[i].dispose();
                }
    
                if(screen.actionManager) screen.actionManager.dispose();
            }
        }
    }

    FSceneBeach.prototype.renderAdScreenVideo = function(url, number) {

        if(!url) return;
        if(!(number == 1 || number == 2)) return;

        var name;

        if(number == 1) name = 'spot_01_screen_1';
        else if(number == 2) name = 'spot_01_screen_2';

        var screen = G.scene.getMeshByName(name);

        if(screen) {

            if(screen.material) {

                if(screen.material.diffuseTexture) {
                    screen.material.diffuseTexture.dispose();
                    screen.material.diffuseTexture = null;
                }
    
                screen.material.dispose();
                screen.material = null;
                if(this.videoTexture[number-1]) {
                    this.videoTexture[number-1].dispose();
                    this.videoTexture[number-1] = null;
                }
            }

            var mat = new BABYLON.StandardMaterial("mat", G.scene);
            var videoTexture = new BABYLON.VideoTexture("video", [url], G.scene, false, false, true);

            this.videoTexture[number-1] = videoTexture;

            if(videoTexture) {
                videoTexture.video.muted = true;

                mat.diffuseTexture = videoTexture;
                mat.diffuseTexture.uScale = 1.0;
                mat.diffuseTexture.vScale = 1.0;
                screen.material = mat;
    
                //모바일에서는 자동 재생 되지 않으므로
                //클릭 시 실행 되도록 해야 한다.
                if(screen.actionManager) { 
                    screen.actionManager.dispose();
                    screen.actionManager = null;
                }

                screen.actionManager = new BABYLON.ActionManager(G.scene);
                screen.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function () {
                    videoTexture.video.play();

                    snsCommonFunc.snsView(14,"#해변");

                }));
    
            }


        }
    }



    FSceneBeach.prototype.onPointerDown = function(evt) {
        if (evt.button !== 0) {
            return;
        }

        if ( this.btnChannelExpand[1] && this.btnChannelExpand[1].isVisible ) {
            this.hideChannelButtonExpand();
            return;
        }

        if(this.interState == INTERSTATE_INFO) {
            FInteractionMenu.getInstance().closeInteractionMenu();
            this.interState = INTERSTATE_NONE;

            this.clearInteractionCameraAni();
        }

        // var pickResult = G.scene.pick(evt.clientX, evt.clientY);
        // // var pickedObject;
        // if (pickResult.hit) {
        //     // pickedObject = FObjectManager.getInstance().getObjectMapForMesh(pickResult.pickedMesh);
        //     //this.startIndex = FMapManager.getInstance().getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z);

        //     // this.sx = evt.clientX;
        //     // this.sy = evt.clientY;

        //     console.log('World position = ' + pickResult.pickedPoint);
        //     console.log('World index = ' + this.startIndex);
        //     console.log('{pos:new Vector3('+ Math.floor(pickResult.pickedPoint.x)+','+0+','+Math.floor(pickResult.pickedPoint.z)+'), cuv : 0}');
        //     console.log('screen position = ' +evt.clientX +', ' +evt.clientY);
        // }
        
        G.cameraManager.clearTarget();

        

        //인테리어 샵이 열려있을 때 오브젝트 클릭하면 이동, 편집 되는 기능
        //이벤트 중첩으로 막아둔다.
        // if(this.FInteriorShop) {

        //     if (pickResult.hit) {

        //         var editObj = FMapManager.getInstance().getEditingObject();
        //         if(editObj == null && pickedObject != null) {
    
        //             this.FObjectMgr.directChangeEditMode(this.ObjectMgrCallback, this, pickedObject.OBJ_ID, pickedObject.TILE_IDX, pickedObject);
        //             this.FInteriorShop.dispose();
        //             this.drawGrid();

        //             return;
        //         }
        //     }
        // }





        // var decalSize = new BABYLON.Vector3(10, 10, 10);
        
        // /**************************CREATE DECAL*************************************************/
        // var decal = BABYLON.MeshBuilder.CreateDecal("decal", cat, {position: pickResult.pickedPoint, normal: pickResult.getNormal(true), size: decalSize});
        // decal.material = decalMaterial;
        /***************************************************************************************/	       
    }


    FSceneBeach.prototype.onPointerUp = function(evt) {
        if (evt.button !== 0) {
            return;
        }        

        if ( FObjectTouchUI.getInstance().getReadyToAutoClose() )
            FObjectTouchUI.getInstance().onClickMainCloseBtn();

        if ( FPetTouchUI.getInstance().getReadyToAutoClose() )
            FPetTouchUI.getInstance().onClickmainCloseBtn();
        
        if ( FPlayerTouchUI.getInstance().getReadyToAutoClose() )
            FPlayerTouchUI.getInstance().onClickmainCloseBtn();

        if(this.preEvt && (this.preEvt == evt)) return;
        this.preEvt = evt;

        // if(this.startIndex != -1) {

        //     var pickResult = G.scene.pick(evt.clientX, evt.clientY);
            
        //     if(Math.abs(this.sx - evt.clientX) > 10 || Math.abs(this.sy - evt.clientY) > 10 ) {
        //         this.startIndex = -1;
        //         this.sx = this.sy = -1;
        //         return;
        //     }

        //     if (pickResult.hit) {

        //         var endIndex = FMapManager.getInstance().getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z);

        //         if(pickResult 
        //             && pickResult.pickedMesh 
        //             && pickResult.pickedMesh.name
        //             && pickResult.pickedMesh.name.indexOf('spot_01_ground') != -1) {

        //             if(this.startIndex == endIndex) {
        //                 var myAvatar = G.dataManager.dataChannel.getMyAvatar();
        //                 if(myAvatar) {

        //                     if ( myAvatar.startMove(this.startIndex) )
        //                         G.cameraManager.setTarget( myAvatar ); // 실제 움직일때만 얘가 호출되어야 함
        //                 }
                            
                
        //                 if ( -1 != FMapManager.getInstance().getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z) )
        //                     CommRender.createPointerEffect(pickResult.pickedPoint.x, pickResult.pickedPoint.z);
        //             }

        //         } else {
        //             console.log(pickResult.pickedMesh.name);
        //         }
        //     }
        // }
    }

    FSceneBeach.prototype.onPointerDouble = function(evt) {
        
        var pickResult = G.scene.pick(evt.clientX, evt.clientY);
        
        if (pickResult.hit) {

            var startIndex = FMapManager.getInstance().getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z);
            var myAvatar = G.dataManager.dataChannel.getMyAvatar();

            if(myAvatar) 
            {
                if (myAvatar.startMove(startIndex) )
                    G.cameraManager.setTarget(myAvatar); // 실제 움직일때만 얘가 호출되어야 함
            }
    
            if ( -1 != FMapManager.getInstance().getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z) )
                CommRender.createPointerEffect(pickResult.pickedPoint.x, pickResult.pickedPoint.z, pickResult.pickedPoint.y);
        
        }
    }

    FSceneBeach.prototype.renderInfo = function(msg) {

        var self = this;

        var num = Number(msg.split("FunFactory_")[1])-10000;
        
        this.currentChannel = num-1;

        if(self.wrapBtnChannel) {
            GUI.removeContainer(self.wrapBtnChannel);
            self.wrapBtnChannel.dispose();
            self.wrapBtnChannel = null;
        }

        CommFunc.arrayRemoveAll(self.btnChannelExpand);

        self.wrapBtnChannel = GUI.createContainer('wrapBtnChannel');
        self.wrapBtnChannel.verticalAlignment = GUI.ALIGN_TOP;
        self.wrapBtnChannel.horizontalAlignment = GUI.ALIGN_RIGHT;
        self.wrapBtnChannel.left = px(-100)
        self.wrapBtnChannel.width = GUI.getResolutionCorrection( px(400) );
        self.wrapBtnChannel.height = GUI.getResolutionCorrection( px(70) );
        G.guiMain.addControl(self.wrapBtnChannel, GUI.LAYER.MAIN );

        var url = SPOTUI_PATH+"spot_cha1.png";

        this.btnChannel = GUI.CreateButton( "btnChannel", px(0), px(20), px(372), px(52), url, GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        this.btnChannel.addControl( GUI.CreateText( px(0), px(0), num.toString()+"번 채널", "White", 20, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
        this.wrapBtnChannel.addControl( this.btnChannel );
        this.btnChannel.onPointerUpObservable.add( function() {
            if ( self.btnChannelExpand[1].isVisible )
                self.hideChannelButtonExpand();
            else
                self.showChannelButtonExpand();
        });

        var createSendTypeExpandButton = function(i)
        {
            var btn = GUI.CreateButton( "ChannelBtn"+i, px(0), px(90 + (60*i)), px(372), px(52), SPOTUI_PATH+"spot_cha2.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
            self.btnChannelExpand.push(btn);

            self.btnChannelExpand[i].addControl( GUI.CreateText( px(0), px(0), (i+1)+"번 채널", "Yellow", 20, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );

            self.btnChannelExpand[i].onPointerUpObservable.add( function()
            {
                if(self.currentChannel != i) {

                    G.cameraManager.clearTarget();
                    G.chatManager.closeChatPopup();
                    self.changeChannel(i+1);
                }
                    

                self.hideChannelButtonExpand();
            });

            self.wrapBtnChannel.addControl( self.btnChannelExpand[i] );
        }

        for ( var i = 0; i < 10; i++ ) {
            createSendTypeExpandButton(i);
        }

        this.hideChannelButtonExpand();

        // var div = document.getElementById("vsns_info");

        // if(div == null) return;
        // div.innerHTML = msg;

        // $("#vsns_info").show();
    }

    
    FSceneBeach.prototype.showChannelButtonExpand = function()
    {
        this.wrapBtnChannel.height = GUI.getResolutionCorrection( px(700) );
        for ( var i = 0; i < 10; i++ )
        {
            FPopup.openAnimation( this.btnChannelExpand[i] );
            this.btnChannelExpand[i].isVisible = true;
        }
    }

    
    FSceneBeach.prototype.hideChannelButtonExpand = function()
    {
        this.wrapBtnChannel.height = GUI.getResolutionCorrection( px(70) );
        for ( var i = 0; i < 10; i++ )
            this.btnChannelExpand[i].isVisible = false;
    }


    FSceneBeach.prototype.onPointerMove = function(evt) {
        
        if (evt.button !== 0) {
            return;
        }

        // var pickResult = G.scene.pick(evt.clientX, evt.clientY); 
        
        // if(pickResult 
        //     && pickResult.pickedMesh 
        //     && pickResult.pickedMesh.name
        //     && pickResult.pickedMesh.name.indexOf('spot_beach_chair') != -1) {
        //     console.log(pickResult.pickedMesh.name);
        // }


    }

    FSceneBeach.prototype.onPointerLeave = function(evt) {
        // console.log('leaveleaveleaveleaveleaveleaveleaveleave');
    }
   

    // FSceneBeach.prototype.moveLocationCB = function(res, self) {
    //     Debug.Log('server => move ok');
    // }


    // FSceneBeach.prototype.drawGrid = function() {
    //     var mgr = FMapManager.getInstance();
    //     var start = mgr.start;
    //     var endx = start.x + mgr.tile_width*mgr.TILE_SIZE;
    //     var endz = start.z + mgr.tile_height*mgr.TILE_SIZE;
    //     // CommRender.DrawGridLine(start.x, endx, start.z, endz, 0.1, mgr.TILE_SIZE);

    //     CommRender.DrawGridLine(start.x, endx, start.z, endz, mgr.start.y+0.1, mgr.TILE_SIZE,new Color3(0.0,1.0,0.0));
    // }

    // FSceneBeach.prototype.clearGrid = function() {
    //     CommRender.ClearGridLine();
    // }


    FSceneBeach.prototype.onResize = function() {
    }


    FSceneBeach.prototype.initCharactor = function() {

        var self = this;
        var users = G.dataManager.dataChannel.getUsers();

        users.forEach(function(user){
            
            self.createAvatar(user);

        });

        this.initSuggestFriend();

        // self.beLoaded = true;

        var myAvatar = G.dataManager.dataChannel.getMyAvatar();
        myAvatar.setConnected(true);
        
        G.cameraManager.setTarget( myAvatar ); 

        hideTip();
    }


    FSceneBeach.prototype.initSuggestFriend = function() {
        //옥외추천
        var self = this;
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
                friend.setTileIndex(/*FMapManager.getInstance().getAvatarStartPos() - i*/ getRandomTileInSpae( 5896, 36, 24, 130, 130 ) );
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

        for(var i=0; i<15; i++) {

            if(i>=suggest.length ) break;

            applySuggestFriend(i);
        }
    }

    FSceneBeach.prototype.createAvatar = function(user) {

        var self = this;
        var avatar = new FRoomCharactor(0, user.id);

        var cd = user.avatar;
        var avatarInfo = G.resManager.getAvatarCode(cd);

        avatar.setProfile(PROFILE_PATH + user.profile, null);
        avatar.setTileIndex(user.tileIdx);
        avatar.setPk(user.pk);
        avatar.createAvatar(avatarInfo, function() {
            G.dataManager.dataChannel.setAvatarObj(user, avatar);
            avatar.initRoomCharactor(true);
            avatar.setTouchEvent(self, avatar, self.onClickFriend);
        });

    }

    FSceneBeach.prototype.onClickPlayerUICallBack = function( in_callBackType, in_callBackValue, in_clickedFriend )
    {
        switch( in_callBackType )
        {
            // 플레이어 상호작용 버튼 누름
        case PLAYERUI_CALLBACK_TYPE.INTERACTION :
            {
                // 하이파이브
                if ( in_callBackValue == PLAYERUI_TEST_INTERACTION.HIGHFIVE )
                {
                    in_clickedFriend.touch( G.dataManager.dataChannel.getMyAvatar() );
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

    FSceneBeach.prototype.onClickFriend = function(e, lparam, pparam)
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


    FSceneBeach.prototype.touchfriend = function(self,type) {

        var pk = type;

        //나를 클릭했으면 리턴
        if(pk == G.dataManager.getUsrMgr(DEF_IDENTITY_ME).accountPk) return;

        var json = protocol.getChannelInteractionInfo(pk);
        ws.onRequest(json, self.getChannelInteractionInfoCB, self);
    }

    FSceneBeach.prototype.getChannelInteractionInfoCB = function(res, self) {
        protocol.res_getChannelInteractionInfo(res);

        //여기 정보를 바탕으로 GUI 그린다.
        self.renderTargetInfo();
    }

    //영수
    FSceneBeach.prototype.renderTargetInfo = function() {

        
        /*
        var info = {
            'accountPk' : res.accountPk,
            'exp' : res.interactiveExp,
            'level' : res.interactiveLevel
        };

        var user = {
			'pk' : res.data[i][0],
			'id' : res.data[i][1],
			'avatar' : res.data[i][2],
			'gender' : res.data[i][3],
			'profile' : res.data[i][4],
			'tileIdx' : res.data[i][5],
			'serverIndex' : res.data[i][6],
			'avatarObj' : null
		}

        */
        var self = this;
        var interInfo = G.dataManager.dataChannel.getInteractionInfo();

        var user = G.dataManager.dataChannel.getUserInfo(interInfo.info.accountPk);
        if(user == null) {
            alert('채널안에 있는 유저들 중에서 찾을 수가 없네요..');
            return;
        }

        this.interState = INTERSTATE_INFO;

        //가능한 행동 리스트
        var actList = G.dataManager.getInteractionActList(G.dataManager.getUsrMgr(DEF_IDENTITY_ME).gender, user.gender, interInfo.info.level);

        FInteractionMenu.getInstance().showMenu( interInfo, actList, function( in_clickActionID )
        {
            //상호작용 버튼 눌렀을 때
            var actionId = in_clickActionID;

            var json = protocol.reqChannelInteraction(user.pk, user.gender, user.serverIndex, actionId)
            ws.onRequest(json, self.reqChannelInteractionCB, this);

            self.addSystemMessage(INTERSTATE_REQUEST,null,actionId);
            self.lookAt(user.avatarObj);
        } );        
    }

    FSceneBeach.prototype.lookAt = function(avatar) {

        var myAvatar = G.dataManager.dataChannel.getMyAvatar();        

        myAvatar.ForwardRotation(avatar.getPosition(), myAvatar.getPosition());
    }


    FSceneBeach.prototype.addSystemMessage = function(state, user, actionId) {

        if(user == null) {
            var interInfo = G.dataManager.dataChannel.getInteractionInfo();
            var user = G.dataManager.dataChannel.getUserInfo(interInfo.info.accountPk);
            var actionName = G.dataManager.getInteractionActName(actionId);
        }

        var msg = null;

        if(INTERSTATE_REQUEST == state) {
            
            msg = "[" + G.dataManager.getUsrMgr(DEF_IDENTITY_ME).nickname + "]님이 " + actionName + "을(를) 신청하였습니다.";
            G.chatManager.addSystemMessage(msg);

        } else if(INTERSTATE_REQUEST_N == state) {

            msg = "[" + user.id + "]님이 " + actionName + "을(를) 신청하였습니다.";
            G.chatManager.addSystemMessage(msg);            

        } else if(INTERSTATE_ACCEPT == state) {

            msg = "[" + G.dataManager.getUsrMgr(DEF_IDENTITY_ME).nickname + "]님이 " + actionName + "을(를) 수락하였습니다.";
            G.chatManager.addSystemMessage(msg);

        } else if(INTERSTATE_ACCEPT_N == state) {

            msg = "[" + user.id + "]님이 " + actionName + "을(를) 수락하였습니다.";
            G.chatManager.addSystemMessage(msg);
        
        } else if(INTERSTATE_ENTER == state) {

            msg = "[" + user.id + "]님이 " + "입장하였습니다.";
            G.chatManager.addSystemMessage(msg);

        } else if(INTERSTATE_EXIT == state) {

            msg = "[" + user.id + "]님이 " + "퇴장하였습니다.";
            G.chatManager.addSystemMessage(msg);

        }
    }


    FSceneBeach.prototype.reqChannelInteractionCB = function(res, self) {

        console.log(res);
        protocol.res_reqChannelInteraction(res);

        FInteractionMenu.getInstance().showActionReceiveIcon( res.interactiveId, G.dataManager.dataChannel.getMyAvatar().base.meshAvatar[0] );

        // this.interState = INTERSTATE_REQ;
    }

    FSceneBeach.prototype.requestInteractionFromFriend = function() {

        console.log('상호 작용 요청 도착');
        //영수
        //요청 수락 버튼!!!!

        /*
        var info = {
            'fromAccountId' : res.fromAccountId,
            'fromAccountPk' : res.fromAccountPk,
            'fromInteractiveSeq' : res.fromInteractiveSeq,
            'fromProfilePicNm' : res.fromProfilePicNm,
            'interactiveId' : res.interactiveId,
            'interactiveSeq' : res.interactiveSeq,
            'limitTime' : res.limitTime,
        };
*/

        var self = this;
        var interInfo = G.dataManager.dataChannel.getInteractionInfo();        
        var user = G.dataManager.dataChannel.getUserInfo( interInfo.user.pk );
        var req = G.dataManager.dataChannel.getRequestInteraction();

        self.lookAt(user.avatarObj);

        this.addSystemMessage(INTERSTATE_REQUEST_N,null,req.interactiveId);
        FInteractionMenu.getInstance().showActionReceiveIcon( req.interactiveId, G.dataManager.dataChannel.getUserAvatar(interInfo.user.pk).base.meshAvatar[0], function()
        {
            // 수락버튼 누르면 동작해야 하는 코드 삽입.
            self.acceptRequestInteraction();
            self.addSystemMessage(INTERSTATE_ACCEPT,null,req.interactiveId);
            var actList = G.dataManager.getInteractionActList(G.dataManager.getUsrMgr(DEF_IDENTITY_ME).gender, user.gender, interInfo.info.level);
            self.interState = INTERSTATE_INFO;
            FInteractionMenu.getInstance().showMenu( interInfo, actList, function( in_clickActionID )
            {
                //상호작용 버튼 눌렀을 때
                var actionId = in_clickActionID;

                var json = protocol.reqChannelInteraction(user.pk, user.gender, user.serverIndex, actionId)
                ws.onRequest(json, self.reqChannelInteractionCB, this);
                // self.interState = INTERSTATE_REQ;
            });
            
            // 요청 수락하면 카메라애니메이션
            self.setInteractionCameraAni( G.dataManager.dataChannel.getMyAvatar().base.meshAvatar[0],
            G.dataManager.dataChannel.getUserAvatar(interInfo.user.pk).base.meshAvatar[0] );
        } );
    }

    FSceneBeach.prototype.acceptRequestInteraction = function() {

        var info = G.dataManager.dataChannel.getRequestInteraction();
        var actionId = info.interactiveId;
        var pk = info.fromAccountPk;
        var user = G.dataManager.dataChannel.getUserInfo(pk);

        if(user == null) {
            alert('채널안에 있는 유저들 중에서 찾을 수가 없네요..');
            return;
        }

        var json = protocol.AcceptChannelInteraction (pk, user.serverIndex, actionId);
        ws.onRequest(json, this.acceptChannelInteractionCB, this);

        var myAvatar = G.dataManager.dataChannel.getMyAvatar();
    }

    FSceneBeach.prototype.acceptChannelInteractionCB = function(res, self) {

    }


    FSceneBeach.prototype.acceptInteractionFromFriend = function() {
        console.log('상호 작용 수락 도착');

        /*
	var info = {

		"interactiveId" : res.interactiveId,
		"interactiveSeq" : res.interactiveSeq,
		"toAccountId" : res.toAccountId,
		"toAccountPk" : res.toAccountPk,
		"toInteractiveSeq" : res.toInteractiveSeq,
		"toProfilePicNm" : res.toProfilePicNm
	}	
        */

        var acceptInfo = G.dataManager.dataChannel.getAcceptInteraction();
        var avatar = G.dataManager.dataChannel.getUserAvatar(acceptInfo.toAccountPk);
        var dstTileIdx = avatar.getPositionTile();

        var myAvatar = G.dataManager.dataChannel.getMyAvatar();
        var srcTileIdx = myAvatar.getPositionTile();

        this.addSystemMessage(INTERSTATE_ACCEPT_N,null,acceptInfo.interactiveId);

        if(myAvatar) {

            var idx = this.getNeighborTileIndex(srcTileIdx, dstTileIdx);

            var arrayAction = [];
            var behavior;

            if(acceptInfo.interactiveId == 1) behavior = SKELETON.HAND;
            else if(acceptInfo.interactiveId == 2) behavior = SKELETON.ANGRY;
            else if(acceptInfo.interactiveId == 3) behavior = SKELETON.HELLO;

            var act = {
                'state' : behavior,
                'loop' : false,
                'callback' : this.moveInteractionCB,
                'param' : this
            }

            arrayAction.push(act);

            var rts = myAvatar.moveInteraction(idx, arrayAction);

            if(rts) {
                var json = protocol.moveLocation(idx);
                ws.onRequest(json, this.moveLocationCB, this);
            }
        }

        this.setInteractionCameraAni( G.dataManager.dataChannel.getMyAvatar().base.meshAvatar[0],
        avatar.meshAvatar[0] );
    }

    FSceneBeach.prototype.moveInteractionCB = function(self) {
        
        //상호작용 모션하기 바로 직접이다.
/*
	var info = {

		"interactiveId" : res.interactiveId,
		"interactiveSeq" : res.interactiveSeq,
		"toAccountId" : res.toAccountId,
		"toAccountPk" : res.toAccountPk,
		"toInteractiveSeq" : res.toInteractiveSeq,
		"toProfilePicNm" : res.toProfilePicNm
	}
*/

        var acceptInfo = G.dataManager.dataChannel.getAcceptInteraction();
        var user = G.dataManager.dataChannel.getUserInfo(acceptInfo.toAccountPk);

        var json = protocol.ActChannelInteraction(acceptInfo.toAccountPk, user.gender, acceptInfo.toInteractiveSeq, user.serverIndex, acceptInfo.interactiveId);
        ws.onRequest(json, self.actChannelInteractionCB, self);
    }

    //영수 게이지 및 레벨 표시.. 내가 상대방에게 요청하고 상대방이 수락한 뒤 상호작용 완료되었을때.
    FSceneBeach.prototype.actChannelInteractionCB = function(res, self) {

        var interInfo = G.dataManager.dataChannel.getInteractionInfo();
        var user = G.dataManager.dataChannel.getUserInfo(interInfo.info.accountPk);

        var myGender = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).gender;
        var yourGender = user.gender;

        var maxExp = G.dataManager.getInteractionMaxExp(myGender, yourGender, res.interactiveLevel);
        // res.interactiveExp;
        // res.interactiveLevel;

        var myGender = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).gender;
        var yourGender = interInfo.user.gender;

        FInteractionMenu.getInstance().changeExpBarPercent( res.interactiveExp / maxExp, (res.interactiveLevel > interInfo.info.level), 
        undefined, G.dataManager.getInteractionGradeName(myGender, yourGender, res.interactiveLevel) );

        var myAvatar = G.dataManager.dataChannel.getMyAvatar();

        GUI.particleEffectToMesh( myAvatar.getMesh(), 270, 30, 0, -60, 80, 200, [INTERACTION_PATH+"ef_add.png", INTERACTION_PATH+"ef_smile.png"],
            15, 120, 0.8, 1.5 );

        GUI.particleEffectToMesh( user.avatarObj.base.getMesh(), 270, 30, 0, -60, 80, 200, [INTERACTION_PATH+"ef_add.png", INTERACTION_PATH+"ef_smile.png"],
                                    15, 120, 0.8, 1.5 );                
    }

    //영수 게이지 및 레벨 표시..내가 상대에게 요청받고 내가 수락한 뒤 상호작용 완료되었을때.
    FSceneBeach.prototype.actInteractionFromFriend = function(interactiveExp, interactiveLevel) {      

        var interInfo = G.dataManager.dataChannel.getInteractionInfo();
        var user = G.dataManager.dataChannel.getUserInfo(interInfo.info.accountPk);

        var myGender = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).gender;
        var yourGender = user.gender;

        var maxExp = G.dataManager.getInteractionMaxExp(myGender, yourGender, interactiveLevel);

        FInteractionMenu.getInstance().changeExpBarPercent( interactiveExp / maxExp, (interactiveLevel > interInfo.info.level),
        undefined,  G.dataManager.getInteractionGradeName(myGender, yourGender, interactiveLevel) );

        var myAvatar = G.dataManager.dataChannel.getMyAvatar();
        GUI.particleEffectToMesh( myAvatar.getMesh(), 270, 30, 0, -60, 80, 200, [INTERACTION_PATH+"ef_add.png", INTERACTION_PATH+"ef_smile.png"],
            15, 120, 0.8, 1.5 );

            
        GUI.particleEffectToMesh( user.avatarObj.base.getMesh(), 270, 30, 0, -60, 80, 200, [INTERACTION_PATH+"ef_add.png", INTERACTION_PATH+"ef_smile.png"],
                                          15, 120, 0.8, 1.5 );                
    }


    FSceneBeach.prototype.getNeighborTileIndex = function( in_myIndex, in_targetIndex)
    {
        var mapWidth = FMapManager.getInstance().getTileWidth();

        var myPos = 
        {
            x:in_myIndex%mapWidth,
            y: parseInt( in_myIndex/mapWidth )
        }

        var targetPos = 
        {
            x:in_targetIndex%mapWidth,
            y: parseInt( in_targetIndex/mapWidth )
        }

        var xConversion = myPos.x - targetPos.x;
        if ( xConversion != 0 )
            xConversion = xConversion/Math.abs(xConversion);
        
        var yConversion = myPos.y - targetPos.y;
        if ( yConversion != 0 )
            yConversion = yConversion/Math.abs(yConversion);

        var result = in_targetIndex + xConversion + (yConversion*mapWidth);
        return result;
    }


    FSceneBeach.prototype.goAvatarRoom = function() {
        G.dataManager.setCameraInformation(G.scene.activeCamera.position, 
                                           G.scene.activeCamera.alpha, 
                                           G.scene.activeCamera.beta, 
                                           G.scene.activeCamera.radius,
                                           G.scene.activeCamera.target);
                                           
        G.sceneMgr.addScene('SCENE_AVATAR', new FSceneAvatar(true, RETURN_TO_BEACH));
        G.sceneMgr.changeScene('SCENE_AVATAR', true);
    }
    
    var getAngle = function(in_p1, in_p2) 
    {
        var x = in_p2.x - in_p1.x;
        var y = in_p2.z - in_p1.z;

        var ang = BABYLON.Tools.ToDegrees(Math.atan2(y, x));
        return ang;
    }

    FSceneBeach.prototype.setInteractionCameraAni = function( in_myAvatarMesh, in_targetAvatarMesh )
    {
        var self = this;

        this.cameraAni.myChar = in_myAvatarMesh;
        this.cameraAni.targetChar = in_targetAvatarMesh;

        var cameraDistance = 10;

        var angle = getAngle( in_myAvatarMesh.position, in_targetAvatarMesh.position );
        var cameraPos = new Vector3( in_myAvatarMesh.position.x + cameraDistance * Math.cos( ToRadians(angle+200) ), 5, in_myAvatarMesh.position.z + cameraDistance * Math.sin( ToRadians(angle+200) ) );

        // 카메라 타겟을 걸어오는 애로 세팅하고
        G.camera.setTarget( new Vector3( this.cameraAni.targetChar.position.x, this.cameraAni.targetChar.position.y, this.cameraAni.targetChar.position.z ) );

        // 카메라를 맞는 위치로 옮기고
        var craeteCameraMoveAni = function(in_targetPos)
        {
            var frameRate = 120;
            var moveAnimationX = new BABYLON.Animation( "moveCameraX", "cameraAni.pos.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var moveAnimationKeyX = [];
            moveAnimationKeyX.push( {frame:0, value:G.camera.position.x} );
            
            moveAnimationKeyX.push( {frame:frameRate, value:in_targetPos.x} );
            moveAnimationX.setKeys(moveAnimationKeyX);

            CommFunc.useEasingFuncToAnimation(moveAnimationX);
    
            var moveAnimationY = new BABYLON.Animation( "moveCameraY", "cameraAni.pos.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var moveAnimationKeyY = [];
            moveAnimationKeyY.push( {frame:0, value:G.camera.position.y} );
            
            moveAnimationKeyY.push( {frame:frameRate, value:in_targetPos.y} );
            moveAnimationY.setKeys(moveAnimationKeyY);
    
            CommFunc.useEasingFuncToAnimation(moveAnimationY);

            var moveAnimationZ = new BABYLON.Animation( "moveCameraZ", "cameraAni.pos.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
            var moveAnimationKeyZ = [];
            moveAnimationKeyZ.push( {frame:0, value:G.camera.position.z} );
            
            moveAnimationKeyZ.push( {frame:frameRate, value:in_targetPos.z} );
            moveAnimationZ.setKeys(moveAnimationKeyZ);
    
            CommFunc.useEasingFuncToAnimation(moveAnimationZ);

            self.cameraAni.ani = G.scene.beginDirectAnimation( self, [moveAnimationX, moveAnimationY, moveAnimationZ], 0, frameRate, false, 1,
            function()
            {
                self.cameraAni.ani = null;
            } );
        }        

        craeteCameraMoveAni( cameraPos );


        // 
    }

    FSceneBeach.prototype.clearInteractionCameraAni = function()
    {
        this.cameraAni.myChar = null;
        this.cameraAni.targetChar = null;

        this.cameraAni.ani = null;
    }

    FSceneBeach.prototype.procCameraAni = function()
    {
        if ( this.cameraAni.targetChar != null )
        {
            G.camera.setTarget( new Vector3( this.cameraAni.targetChar.position.x, this.cameraAni.targetChar.position.y, this.cameraAni.targetChar.position.z ) );

            if ( this.cameraAni.ani == null )
            {
                var cameraDistance = 10;
                var addAngle = (Math.max(0, 15 - Vector3.Distance( this.cameraAni.targetChar.position, this.cameraAni.myChar.position ) )/15) * 70;
                var angle = getAngle( this.cameraAni.myChar.position, this.cameraAni.targetChar.position );
                G.camera.setPosition( new Vector3( this.cameraAni.myChar.position.x + cameraDistance * Math.cos( ToRadians(angle+200+addAngle) ), 5, this.cameraAni.myChar.position.z + cameraDistance * Math.sin( ToRadians(angle+200+addAngle) ) ) );
            }
        }

        if ( this.cameraAni.ani == null )
            return;

        G.camera.setPosition( new Vector3( this.cameraAni.pos.x, this.cameraAni.pos.y, this.cameraAni.pos.z ) );
    }

    


    //
    // ui option
    //
    FSceneBeach.prototype.setUIOption = function()
    {
        var self = this;

        var returnToHomeFunc = function()
        {
            G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).setAccountPk(-1);
            G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).setVisitPurposeForShare(false);
            G.sceneMgr.addScene('SCENE_MYROOM', new FSceneMyRoom(true));
            G.sceneMgr.changeScene('SCENE_MYROOM', true);
        }

        FRoomUI.getInstance().changeButtonImage( ROOMBUTTON.STORE, ASSET_URL+"97_gui_new/00_main/m_home_btn_idle.png" );
        
        FRoomUI.getInstance().setProfileImage( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getUrl() );

        FRoomUI.getInstance().applyUIButtonOpt([
            [ ROOMBUTTON.PROFILE, true, function(){ snsBtnOpen('타임라인') } ],

            [ ROOMBUTTON.SQ_CREATE, false, null ],
            [ ROOMBUTTON.SQ_CONSUME, false, null ],
            [ ROOMBUTTON.SQ_SHARE, false, null ],

            [ ROOMBUTTON.STORE, true, returnToHomeFunc ],
            [ ROOMBUTTON.AVATAR, true, self.goAvatarRoom ],

            [ ROOMBUTTON.SMILE, false, null ],
            [ ROOMBUTTON.PINKSMILE, false, null ],

            [ ROOMBUTTON.SHARE, false, null]
        ]);

        FRoomUI.getInstance().clearSQAlertIcon();
    }


    return FSceneBeach;

}());