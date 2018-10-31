'use strict';
//var EvtPoint = [onPointerDown, onPointerMove, onPointerUp];

var KEY = {'ENTER': 13, 'SHIFT': 16, 'CTRL': 17, 'ALT': 18, 'ESCAPE': 27, 'SPACEBAR': 32, 'PAGE_UP': 33, 'PAGE_DOWN': 34, 'END': 35, 'HOME': 36, 'ARROW_LEFT': 37, 'ARROW_UP': 38, 'ARROW_RIGHT': 39, 'ARROW_DOWN': 40 };

(function () {
	/* 0 - 9 */
	for (var i = 48; i <= 57; i++) {
        KEY['' + (i - 48)] = i;
	}
	/* A - Z */
	for (i = 65; i <= 90; i++) {
        KEY['' + String.fromCharCode(i)] = i;
	}
	/* NUM_PAD_0 - NUM_PAD_9 */
	for (i = 96; i <= 105; i++) {
        KEY['NUM_PAD_' + (i - 96)] = i;
	}
	/* F1 - F12 */
	for (i = 112; i <= 123; i++) {
        KEY['F' + (i - 112 + 1)] = i;
	}
})();

var sButtonEvent = function () {
    var mesh = null;
    var up = true;
    var callback = null;
    var parent = null;
    var pparam = null;
}


var FEventManager = (function () {
    function FEventManager() {
        this.eventArray = [];
        this.buttonEvent = [];
        this.currentMesh = null;
    }
    
    //터치 이벤트를 해당 클래스가 받을 수 있도록 설정
    //터치 이벤트를 받고자 하는 클래스에서 이 함수를 호출하면 이벤트가 전달된다.
    FEventManager.prototype.setEnableTouched = function (name, self, in_override) {
        var e = {
            'name' : name,
            'self' : self
        }

        for(var i=0; i<this.eventArray.length; i++) {
            if(this.eventArray[i].name == name) {
                if ( !in_override || undefined == in_override )
                    return;                
                else 
                    this.eventArray[i] = e;
            }
        }
        this.eventArray.push(e);
    };

    FEventManager.prototype.clearEnableTouched = function (name) {
        
        var index = -1;
        var k=0;
        this.eventArray.forEach(function(ar){
            if(ar.name == name) {
                index = k;
            }
            k++;
        });

        if(index != -1) {
            this.eventArray.splice(index, 1);
        }
    }

    FEventManager.prototype.initialize = function() {
        Debug.receiveEvent();
    }

    //버튼 또는 특정 매쉬가 눌렸는지 확인한다.
    //이벤트가 일어나는 매쉬와 버튼업에서 받을지 여부, 이벤트 발생 시 받을 콜백함수를 등록
    FEventManager.prototype.setMeshButton = function (mesh, up, callback, parent, pparam) {
        var event = new sButtonEvent();

        event.mesh = mesh;
        event.up = up;
        event.callback = callback;
        event.parent = parent;
        event.pparam = pparam;

        this.buttonEvent.push(event);
    }

    FEventManager.prototype.clearMeshButton = function (mesh) {

        var self = this;

        while(true) {
            var esc = true;

            for(var i=0; i<self.buttonEvent.length; i++) {

                if(self.buttonEvent[i].mesh == mesh) {
                    CommFunc.arrayRemove(self.buttonEvent, self.buttonEvent[i]);
                    esc = false;
                    break;
                }
            }

            if(esc) return;
        }
    }


    FEventManager.prototype.onPointerDown = function (evt) {
        if(!G.scene.activeCamera) return;
        //<-----------------------------------------------------------------------------
        //버튼 이벤트 코드
        if(this.buttonEvent.length) {
            // var pickInfo = G.scene.pick(G.scene.pointerX, G.scene.pointerY);
            //바빌론 버그로 scene.pointer는 사용하지 않기로..
            var pickInfo = G.scene.pick(evt.clientX, evt.clientY);

            if(pickInfo.hit) {
                
                if(pickInfo.pickedMesh.isVisible) {
                    var up = true;
                    for(var i=0; i<this.buttonEvent.length; i++) {
                        //Debug.Log(this.buttonEvent[i]);
                        if(!this.buttonEvent[i].up){
                            if(this.buttonEvent[i].mesh == pickInfo.pickedMesh && this.buttonEvent[i].callback){
                                this.buttonEvent[i].callback(this.buttonEvent[i].parent, this.buttonEvent[i].pparam);
                                up = false;
                            } 
                        }
                    }
                    if(up) this.currentMesh = pickInfo.pickedMesh;
                }
            }
        }
        //----------------------------------------------------------------------------->

        this.eventArray.forEach(function(value){
            if(value.self.onPointerDown) value.self.onPointerDown(evt);
        });
    }

    FEventManager.prototype.onPointerMove = function (evt) {

        if(!G.scene.activeCamera) return;

        this.eventArray.forEach(function(value){
            if(value.self.onPointerMove) value.self.onPointerMove(evt);
        });
        
        this.currentMesh = null;
    }

    FEventManager.prototype.onPointerGUp = function(evt) {

        if(!G.scene.activeCamera) return;

        this.eventArray.forEach(function(value){
            if(value.self.onPointerGUp) value.self.onPointerGUp(evt);
        });

    }

    FEventManager.prototype.onPointerUp = function (evt) {
        if(!G.scene.activeCamera) return;
        //<-----------------------------------------------------------------------------
        //버튼 이벤트 코드
        if(this.buttonEvent.length) {
            // var pickInfo = G.scene.pick(G.scene.pointerX, G.scene.pointerY);
            var pickInfo = G.scene.pick(evt.clientX, evt.clientY);
            //Debug.Log(pickInfo);
            if(pickInfo.hit) {

                if(pickInfo.pickedMesh.isVisible) {
                    //Debug.Log(this.currentMesh);
                    //Debug.Log(pickInfo.pickedMesh);
                    var upmesh = this.currentMesh == pickInfo.pickedMesh;

                    if(upmesh) {
                        for(var i=0; i<this.buttonEvent.length; i++) {
                            if(this.buttonEvent[i].mesh == pickInfo.pickedMesh && this.buttonEvent[i].up){
                                if(this.buttonEvent[i].callback) this.buttonEvent[i].callback(this.buttonEvent[i].parent, this.buttonEvent[i].pparam);
                            }
                        }
                    }
                }
            }
        }

        this.currentMesh = null;
        //----------------------------------------------------------------------------->

        this.eventArray.forEach(function(value){
            if(value.self.onPointerUp) value.self.onPointerUp(evt);
        });
    }

    FEventManager.prototype.onPointerWheel = function (evt) {
        this.eventArray.forEach(function(value){
            if(value.self.onPointerWheel) value.self.onPointerWheel(evt);
        });
    };


    FEventManager.prototype.onPointerLeave = function (evt) {
        this.eventArray.forEach(function(value){
            if(value.self.onPointerLeave) value.self.onPointerLeave(evt);
        });
    }


    FEventManager.prototype.onPointerDouble = function (evt) {
        this.eventArray.forEach(function(value){
            if(value.self.onPointerDouble) value.self.onPointerDouble(evt);
        });
    }

    
    FEventManager.prototype.onKeyUp = function (evt) {
        this.eventArray.forEach(function(value){
            if(value.self.onKeyUp) value.self.onKeyUp(evt);
        });
    };

    FEventManager.prototype.onKeyDown = function (evt) {
        this.eventArray.forEach(function(value){
            if(value.self.onKeyDown) value.self.onKeyDown(evt);
        });
    };

    FEventManager.prototype.onResize = function() {
        this.eventArray.forEach(function(value){
            if(value.self.onResize) value.self.onResize();
        });

        // 이벤트 리스너에게 onResize 함수를 모두 전달한 후에 새 값으로 업데이트합니다. 
        // 업데이트 이전 값은 각각 리스너에서 검사하여 얼마만큼 화면 사이즈가 변화했는지 알 수 있게 합니다.
        G.beforeScreenSize.width = window.innerWidth;
        G.beforeScreenSize.height = window.innerHeight;
    }

    return FEventManager;
}());