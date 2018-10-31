'use strict';




var FSceneBrandRoom = (function () {

    __inherit(FSceneBrandRoom, FRoom);

    function FSceneBrandRoom() {

        var self = this;

        this.setName(CommFunc.nameGuid('FSceneBrandRoom'));
        G.eventManager.setEnableTouched(this.getName(), this);

        this.loadAvatarState    = null;
        this.netState           = null;
        this.donePreloadAvatar  = null;


        showTip();

        return self;
    }

    FSceneBrandRoom.prototype.init = function () {

        FRoom.prototype.init.call(this);

        this.loadBackground();


        this.goMyRoom();

        this.initSceneCamera();

        GUI.initLevelOfAlphaUI();
        G.guiMain.setAlpha( 0 );

        // 카메라 값 세팅
        G.cameraManager.setCameraLimitInfo( -550, 300, -250, 450, 160, 2000, 470, ToRadians(-45), ToRadians(55) );  

        snsCommonFunc.chatTitleLender(this.getSceneNameToString(1));
    };


    FSceneBrandRoom.prototype.destroy = function () {


        FRoom.prototype.destroy.call(this);        
    };

    
    FSceneBrandRoom.prototype.goMyRoom = function() {

        var self = this;

        var roomID = 104001;
        // var backID = "home_ground_01";

        // FMapManager.getInstance().createMapData(roomID, function() {

            self.preloadAvatar();
            
        // });

        this.loadRoomMesh(roomID, null, function(){
            
            FMapManager.getInstance().clearAllObjectMap();
            G.resManager.clearAllMesh();

         });
    }


    FSceneBrandRoom.prototype.preloadAvatar = function() {

        G.resManager.loadBaseAvatar(this, function(self){

            self.donePreloadAvatar = true;
            // self.loadAvatarState = LOS.MYAVATAR;
        });
    }

    FSceneBrandRoom.prototype.netProcess = function() {

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

    FSceneBrandRoom.prototype.avatarProcess = function() {

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


    return FSceneBrandRoom;

}());