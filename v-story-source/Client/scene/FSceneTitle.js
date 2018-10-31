

var FSceneTitle = (function () {

    function FSceneTitle() {
        var self = this;
        
        this.state = 0;
        this.loadBaseAvatar = false;

        this.name = 'FSceneTitle';
        G.eventManager.setEnableTouched(this.name, this);

        this.panel = null;

        this.playButton = null;

        Debug.information();

        return self;
    }

    FSceneTitle.prototype.init = function () {

        var self = this;
        // G.scene = new BABYLON.Scene(G.engine);
        // // G.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, 0), G.scene);
        G.camera = new BABYLON.ArcRotateCamera('ArcRotateCamera', 0,0,0, BABYLON.Vector3.Zero(), G.scene);
        
        // // This targets the camera to scene origin
        G.camera.setTarget(new BABYLON.Vector3(0,0,0));
        // // This attaches the camera to the canvas
        G.camera.attachControl(G.canvas, true);

        CommFunc.testTime();

        // G.camera.alpha = ToRadians(270);
        // G.camera.beta = ToRadians(90);      //y에서 0,0,0을 바라보는 각이 0도임
        // G.camera.radius = 5;

        // var light = new BABYLON.HemisphericLight("Hemispheric", new BABYLON.Vector3(1, 2, 1), G.scene);
        // light.intensity = 0.5;
        // light.diffuse = new BABYLON.Color3(1, 1, 1);
        // light.specular = new BABYLON.Color3(0, 0, 0);

        // G.scene.ambientColor = new BABYLON.Color3(0.4, 0.4, 0.3);

        // this.render();

        this.renderTitle();

        G.resManager.loadBaseAvatar(this, function(self){
            // self.initCharactor();
            self.loadBaseAvatar = true;
        });

        this.loadScript(function(){
            // self.wsSendGetRoomMap();
            // self.wsSendSNSQuestLoad();
            // self.wsSendSuggestFriend();

            // self.makePlayButton();
            self.state = 1;
        });

        G.soundManager.preloadSound();
        G.soundManager.playBGMSound("BGM_bgm.ogg");

        // startDelayTime();
    };

    FSceneTitle.prototype.destroy = function () {

        G.eventManager.clearEnableTouched(this.name);

        // this.panel.dispose();

        G.camera.inputs.clear(); 
        G.camera.dispose();

        hideTip();

        // 로그인완료인지
        localStorage.setItem("viewMode", 1);
    }

    FSceneTitle.prototype.run = function () {
        

        if(this.state && this.loadBaseAvatar && G.dataManager.isInitDataMgr()) {

            if(0 == G.dataManager.getUsrMgr(DEF_IDENTITY_ME).avatarCd)
            {
                    G.sceneMgr.addScene('SCENE_AVATAR', new FSceneAvatar(false, RETRUN_TO_NONE));
                    G.sceneMgr.changeScene('SCENE_AVATAR', true);
            }
            else {

                G.sceneMgr.addScene('SCENE_MYROOM', new FSceneMyRoom());
                G.sceneMgr.changeScene('SCENE_MYROOM', true);

                // G.sceneMgr.addScene('SCENE_BRANDROOM', new FSceneBrandRoom());
                // G.sceneMgr.changeScene('SCENE_BRANDROOM', true);
            }
            
        }

        

        return 0;
    }

    FSceneTitle.prototype.renderTitle = function() {

        showTip();
    }


    FSceneTitle.prototype.loadScript = function(done_cb) {
        
        // CommFunc.loadJavaScript("js/src/screen/FInteriorShop.js");
        CommFunc.loadJavaScript("js/src/screen/FSocialQuest.js");
        CommFunc.loadJavaScript("js/src/screen/FSocialSpot.js");
        CommFunc.loadJavaScript("js/src/screen/FInteractionMenu.js");
        CommFunc.loadJavaScript("js/src/scene/FSceneBeach.js");
        
        CommFunc.loadJavaScript("js/src/scene/FSceneFriendRoom.js");
        CommFunc.loadJavaScript("js/src/game/FCharactor.js");
        CommFunc.loadJavaScript("js/src/scene/FSceneAvatar.js");
        CommFunc.loadJavaScript("js/src/game/FGiftBox.js");
        CommFunc.loadJavaScript("js/src/game/FAlphaGo.js");
        CommFunc.loadJavaScript("js/src/manager/FShopManager.js");
        CommFunc.loadJavaScript("js/src/manager/FObjectTouchUI.js");
        CommFunc.loadJavaScript("js/src/manager/StarContentsCategorySelectUI.js");
        CommFunc.loadJavaScript("js/src/manager/FAvatarCustomUI.js");
        CommFunc.loadJavaScript("js/src/manager/FExchangePopup.js");
        CommFunc.loadJavaScript("js/src/screen/FPackageShop.js");
        CommFunc.loadJavaScript("js/src/screen/FPetTouchUI.js");
        CommFunc.loadJavaScript("js/src/screen/FPlayerTouchUI.js");
        CommFunc.loadJavaScript("js/src/manager/FRoomChangeUI.js");
        CommFunc.loadJavaScript("js/src/common/FRekognition.js");
        CommFunc.loadJavaScript("js/src/screen/FBytomExchange.js");
        // CommFunc.loadJavaScript("js/lib/load-image.all.min.js");

        CommFunc.loadJavaScript("js/src/game/FVehicle.js");
        CommFunc.loadJavaScript("js/src/manager/UserNode.js");
        CommFunc.loadJavaScript("js/src/game/FDrone.js");
        CommFunc.loadJavaScript("js/src/scene/FSceneRoomStore.js");
        CommFunc.loadJavaScript("js/src/scene/FSceneBrandRoom.js");
        CommFunc.loadJavaScript("js/src/scene/FSceneMyRoom.js", 
            function(){
                done_cb();
            }, 
            
            function(){
                callback("load error : FSceneMyRoom.js", false);
            }
        );

    }
  

    FSceneTitle.prototype.renderCheckPing = function() {

        this.panel = new GUI.createMainGUI("panelTopInfo");
        G.guiMain = this.panel;
    }


    FSceneTitle.prototype.onPointerDown = function(evt) {
        if (evt.button !== 0) {
            return;
        }
    }

    FSceneTitle.prototype.onPointerUp = function(evt) {
        if (evt.button !== 0) {
            return;
        }
    }

    FSceneTitle.prototype.onPointerMove = function(evt) {
        
        // if (evt.button !== 0) {
        //     return;
        // }


    }

    FSceneTitle.prototype.onResize = function() {
        this.renderTitle();

        // if(this.playButton) {
        //     this.playButton.width = GUI.getResolutionCorrection( px(292*0.75) );
        //     this.playButton.height = GUI.getResolutionCorrection( px(102*0.75) );
        // }
    }

    return FSceneTitle;

}());



