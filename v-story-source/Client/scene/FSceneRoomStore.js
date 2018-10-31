'use strict';


var FSceneRoomStore = (function () {

    __inherit(FSceneRoomStore, FRoom);

    function FSceneRoomStore() {

        this.setName('FSceneRoomStore');

        G.eventManager.setEnableTouched(this.getName(), this);
 
        // this.roomType = null;

        showTip();

        return this;
    }

    FSceneRoomStore.prototype.init = function () {

        FRoom.prototype.init.call(this);
        
        this.initSceneCamera();
        G.cameraManager.setCameraLimitInfo( -270, 170, -270, 410, 160, 700, 470, ToRadians(-45), ToRadians(55) );

        var roomType = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).roomType;
        this.setRoom(roomType);
    };


    FSceneRoomStore.prototype.destroy = function () {
        G.cameraManager.clearTarget();

        FRoom.prototype.destroy.call(this);

        G.eventManager.clearEnableTouched(this.getName());
        G.scene.removeCamera(G.camera);
        G.camera.detachControl(G.canvas);
        G.eventManager.clearEnableTouched(this.getName());
        G.camera.inputs.clear(); 
        G.camera.dispose();

        CommFunc.removeLight();

        FMapManager.getInstance().destroy();
        FObjectManager.getInstance().destroy();
    };


    //<------------------------------------------------------------------------------------------------------------------
    FSceneRoomStore.prototype.setRoom = function(type) {

        var self = this;
        var roomID = 100000 + type;

        var testCameraInfo = [
            [],
            [ -270, 170, -270, 410, 160, 2000, 800, ToRadians(-45), ToRadians(55) ],
            [ -270, 170, -270, 410, 160, 2000, 800, ToRadians(-45), ToRadians(55) ],
            [ -270, 170, -270, 410, 160, 2000, 1400, ToRadians(-45), ToRadians(55) ],
            [ -270, 170, -270, 410, 160, 2000, 1400, ToRadians(-45), ToRadians(55) ],
            [ -270, 170, -270, 410, 160, 2000, 2000, ToRadians(-45), ToRadians(55) ],
            [ -270, 170, -270, 410, 160, 2000, 2000, ToRadians(-45), ToRadians(55) ],
        ]

        fadeOutScreen(function(){
            
            G.cameraManager.setCameraLimitInfo( 
                testCameraInfo[type][0], 
                testCameraInfo[type][1], 
                testCameraInfo[type][2], 
                testCameraInfo[type][3], 
                testCameraInfo[type][4], 
                testCameraInfo[type][5],
                testCameraInfo[type][6],
                testCameraInfo[type][7],
                testCameraInfo[type][8] );

            self.clearMesh();
            FObjectManager.getInstance().clearObject();
            FMapManager.getInstance().createMapData(roomID, function() {
    
                self.loadRoomMesh(roomID, null, function(){
                
                    self.openMenu();
                    self.renderObject();
                    fadeInScreen();
                    hideTip();
                });
                
            });
    
        });
    }

    FSceneRoomStore.prototype.renderObject = function() {

        var objMap = FMapManager.getInstance().getRoomObjMapData().obj_map;
        var k = 0;

        objMap.forEach(function(d){
            var obj = {
                'OBJ_MAP_SEQ' 	: k++,
                'SECTOR_IDX'	: 1,
                'CATE_ID'		: 1,
                'OBJ_ID'		: d[0],
                'TILE_IDX'		: d[1],
                'ROT_DIR'		: d[2],
                'LAYER_IDX'		: 1,
            };

            FObjectManager.getInstance().createRoomObject(obj, DEF_IDENTITY_NONE);
        });
    }

    FSceneRoomStore.prototype.openMenu = function() {
        var self = this;

        var testRoomChangeUICallback = function( in_clickType, in_selectRoomInfo )
        {
            switch( in_clickType )
            {
            case ROOMSTORE_CALLBACK.SELECT :
                {
                    var index = in_selectRoomInfo["index"];

                    if(index > 6) return;
                    self.setRoom(index);
                    // console.log( "??Î∞?ÎØ∏Î¶¨Î≥¥Í∏∞ ?¥Î¶≠?àÎ?!(?ÑÏù¥???¥Î¶≠)" + JSON.stringify( in_selectRoomInfo ) );
                }
                break;

            case ROOMSTORE_CALLBACK.CLOSE :
                {
                    G.sceneMgr.addScene('SCENE_MYROOM', new FSceneMyRoom());
                    G.sceneMgr.changeScene('SCENE_MYROOM', true);
                    // console.log( "Î∞?Î∞îÍæ∏Í∏?Ï∑®ÏÜå?òÍ≥† ?òÍ∞Ñ?Ä!" + JSON.stringify( in_selectRoomInfo ) );
                }
                break;

            case ROOMSTORE_CALLBACK.APPLY :
                {
                    G.sceneMgr.addScene('SCENE_MYROOM', new FSceneMyRoom());
                    G.sceneMgr.changeScene('SCENE_MYROOM', true);
                    // console.log( "?îÍ±∏Î°?Î∞îÍæº?Ä ?ïÏ†ï?¥Îûò!" + JSON.stringify( in_selectRoomInfo ) );
                }
                break;
            }

        }

        FRoomChangeUI.getInstance().openUI( testRoomChangeUICallback );
    }

    //<------------------------------------------------------------------------------------------------------------------

    FSceneRoomStore.prototype.run = function () {

        FRoom.prototype.run.call(this);


        return 0;
    };
    



    FSceneRoomStore.prototype.onPointerDown = function(evt) {

        var self = this;

        if (evt.button !== 0) {
            return;
        }


    }

    FSceneRoomStore.prototype.onPointerGUp = function(evt) {
        if (evt.button !== 0) {
            return;
        }

    }


    FSceneRoomStore.prototype.onPointerUp = function(evt) {
        if (evt.button !== 0) {
            return;
        }

        // this.roomType = this.roomType%6 + 1;
        // this.setRoom(this.roomType);
    }

    FSceneRoomStore.prototype.onPointerMove = function(evt) {
        
        if (evt.button !== 0) {
            return;
        }

    }

    FSceneRoomStore.prototype.onPointerDouble = function(evt) {

    }

    FSceneRoomStore.prototype.onPointerLeave = function(evt) {

    }
   

    FSceneRoomStore.prototype.onResize = function() {

    }



    return FSceneRoomStore;

}());