'use strict';

var testdrone = null;

var uiFlag = true;
var FDebug = (function () {
    
    function FDebug() {
        this.debugMode = true;
        this.userAlert = false;

        this.name = 'FDubg';
        this.isInfo = 0;
    }

    FDebug.prototype.receiveEvent = function() {
        G.eventManager.setEnableTouched(this.name, this);
    }

    FDebug.prototype.Log = function (msg) {
        if (this.debugMode == false)            return;
        if (typeof console == "undefined")      return;
        if(msg == null)                         return;
        // console.warn(msg);
        console.log(msg);
    };

    FDebug.prototype.Warn = function (msg) {
        if (this.debugMode == false)            return;
        if (typeof console == "undefined")      return;
        if(msg == null)                         return;

        console.warn(msg);
    };


    FDebug.prototype.Alert = function (msg) {
        if (this.debugMode == false)            return;
        if (typeof console == "undefined")      return;
        if(msg == null)                         return;

        console.error(msg);
        alert(msg);
    };
    

    FDebug.prototype.Error = function (msg) {
        if (this.debugMode == false)            return;
        if (typeof console == "undefined")      return;
        if(msg == null)                         return;
            
        console.error(msg);
        // alert(msg);
    };


    FDebug.prototype.UseDebugMode = function () {
        //        if (inputSystem.isKeyDown(KEYCODE_ESC) && inputSystem.isKeyDown(KEYCODE_SPACE)) {
        //            this.debugMode = !this.debugMode;
        //        }
    };

    FDebug.prototype.Update = function() {
        if(false == this.debugMode) return;
    }

    FDebug.prototype.drawDebug = function (msg, div) {
        if(G.engine == null) return;

        if(div == 0) d = "debugLabel1";
        else if(div == 1) d = "debugLabel2";
        else if(div == 2) d = "debugLabel3";
        else if(div == 3) d = "debugLabel4";

        var debugLabel = document.getElementById(d);

        if(debugLabel == null) return;
        debugLabel.innerHTML = msg;
    };

    FDebug.prototype.information = function() {
        if(false == this.debugMode) return;

        var div = ["fpsLabel","resolutionLabel"];

        for(var i=0; i<div.length; i++) {

            var css = "#"+div[i];
            
            if(!this.isInfo) {
                $(css).hide();
            } else {
                $(css).show();
            }
        }

        this.isInfo = 1 - this.isInfo;

    }

    FDebug.prototype.renderBox = function(size, position) {
        var box = BABYLON.MeshBuilder.CreateBox("Box", {'size':size}, G.scene);
        box.position = position;
    }

    FDebug.prototype.renderLine = function(start, end, color) {
        var mesh = BABYLON.Mesh.CreateLines("DrawGrid", [start, end], G.scene, false);
        mesh.color = color
    }
    



    FDebug.prototype.onKeyUp = function (evt) {

        //방정보를 초기화한다.
        // if(evt.key == 'r') {
        //     CommFunc.arrayRemoveAll(FMapManager.getInstance().RoomMap);
        //     var json = protocol.modRoomMap(0, 0, 0, FMapManager.getInstance().RoomMap);
        //     ws.onRequest(json, this.modRoomMapCB, self);
        // }
        if ( evt.key == '+' )
        {
            if(G.camera)
            {
                G.camera.fov += 0.1;

                G.camera.upperRadiusLimit = 999999;
            }

        }
        else if ( evt.key == '-' )
        {
            if(G.camera)
            {
                G.camera.fov -= 0.1;
                
                G.camera.upperRadiusLimit = 999999;
            }
        }

        if ( evt.key == 'R') // 스마일마크 연출 테스트용
        {
            var testRoomChangeUICallback = function( in_clickType, in_selectRoomInfo )
            {
                switch( in_clickType )
                {
                case ROOMSTORE_CALLBACK.SELECT :
                    {
                        console.log( "이 방 미리보기 클릭했대!(아이템 클릭)" + JSON.stringify( in_selectRoomInfo ) );
                    }
                    break;

                case ROOMSTORE_CALLBACK.CLOSE :
                    {
                        console.log( "방 바꾸기 취소하고 나간대!" + JSON.stringify( in_selectRoomInfo ) );
                    }
                    break;

                case ROOMSTORE_CALLBACK.APPLY :
                    {
                        console.log( "요걸로 바꾼대 확정이래!" + JSON.stringify( in_selectRoomInfo ) );
                    }
                    break;
                }

            }

            FRoomChangeUI.getInstance().openUI( testRoomChangeUICallback );
        }

        if ( evt.key == 'K') // 스마일마크 연출 테스트용
        {
            GUI.getSmileMarkEffect();
        }

        if ( evt.key == 'O' )
        {
            uiFlag = !uiFlag;
            FRoomUI.getInstance().setUIVisible( uiFlag );
        }

        if ( evt.key == 'Q') // 드론생성
        {
            testdrone = new FDrone( 160002, new Vector3( 0, 1, 0 ) );
        }   

        return; // 시연용. 주석을 풀면 K, L 디버그키만 작동합니다.
        

        if ( evt.key == 'L' ) // 접속, 접속종료 알림
        {
            GUI.alertEffect( undefined, true );
            //G.aiButlerManager.onreceiveMatchingComplete();
        }

        if(evt.key == 'p') {
            FImageControlManager.getInstance().setCropperData( "Assets/99_Images/avatar_background.png", "Assets/99_Images/upper_b.png" );
            FImageControlManager.getInstance().showCropper();
        }


        if ( evt.key == '0')
        {
            G.scene.debugLayer.show({
                newColors: {
                    backgroundColor: '#fff',
                    backgroundColorLighter: '#fff',
                    backgroundColorLighter2: '#fff',
                    backgroundColorLighter3: '#fff',
                }});
        }

        if ( evt.key == 'M' ) // 음소거
        {
            if ( G.soundManager.isMute() )
                G.soundManager.unMute();
            else
                G.soundManager.mute();
        }

        if ( evt.key == ':' )
        {
            //G.cameraManager.createSecondCamera();
        }

        if ( evt.key == 'E')
        {
            if ( this.targetData.mesh == null )
                G.cameraManager.setTarget( G.sceneMgr.getCurrentScene().friends[0] );
            else
                G.cameraManager.clearTarget();
        }

        if ( evt.key == 'C' )
        {
            G.chatManager.showDebugLayer( ( G.chatManager.debugLayer == null ) );
        }

        if ( evt.key == 't' )
        {
            // G.aiButlerManager.showSurveyUI();

            FInteractionMenu.getInstance().showMenu();
        }

        if ( evt.key == 'y' )
        {
            G.chatManager.openChatPopup();
        }

        if ( evt.key == 'n' )
        {
            var topNode = new UserNode(); topNode.setRevenue( 200000 );

            var midNode = new UserNode(); midNode.setRevenue( 200000 ); midNode.setParent( topNode );

            var child1_node1 = new UserNode(); child1_node1.setRevenue( 200000 ); child1_node1.setParent( midNode );
            var child1_node2 = new UserNode(); child1_node2.setRevenue( 200000 ); child1_node2.setParent( midNode );

            topNode.calcAllInfo( true );
            midNode.calcAllInfo( true );
            child1_node1.calcAllInfo( true );
            child1_node2.calcAllInfo( true );
        }


        // if(evt.key == 'a') {
        //     G.scene.lights[0].position.x += 1;
        // }
        // if(evt.key == 's') {
        //     G.scene.lights[0].position.y += 1;
        // }
        // if(evt.key == 'd') {
        //     G.scene.lights[0].position.z += 1;
        // }



    };

    FDebug.prototype.onKeyDown = function (evt) {

        /*
        if(evt.key == 'ArrowLeft') {
            G.scene.activeCamera.position.x--;
            Debug.Log('camera pos : ' + G.scene.activeCamera.position);
        }
        if(evt.key == 'ArrowRight') {
            G.scene.activeCamera.position.x++;
            Debug.Log('camera pos : ' + G.scene.activeCamera.position);
        }
        if(evt.key == 'ArrowUp') {
            G.scene.activeCamera.position.z++;
            Debug.Log('camera pos : ' + G.scene.activeCamera.position);
        }
        if(evt.key == 'ArrowDown') {
            G.scene.activeCamera.position.z--;
            Debug.Log('camera pos : ' + G.scene.activeCamera.position);
        }

        */
    };

    FDebug.prototype.modRoomMapCB = function(self, res) {

    }


    return FDebug;
}());
var Debug = new FDebug();
//# sourceMappingURL=FDebug.js.map









