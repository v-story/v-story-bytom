

//생성자에다 변수를 선언할때 상속 받은 애들이 모두 공유 하는 현상이 있다.
//그래서 생성자에는 변수를 null값으로 선언만 하고,
//상속 받은 자식 클래스의 init 이나 초기화 함수에 배열이나 오브젝트로 형을 지정해서 사용해야 한다.


var __inherit = (function(){
    var F = function(){};
    return function( Child, Parent ){
      F.prototype = new Parent;
    //   F.prototype = Parent.prototype; 
      // 이경우는 Child에서 apply, call을 사용해 scope 바인딩을 해줘야 
      // 부모의 프로퍼티에 접근이 가능하다.
      Child.prototype = new F();
      Child.prototype.super = Parent.prototype;
    //   Child.prototype.super = function() {
    //       return Child.super;
    //   }
      Child.prototype.constructor = Child;
    }
})();

var FObject = (function () {

    function FObject() {

        this._refCount = 0;

        return this;
    }

    FObject.prototype.init = function () {
        this._refCount++;
    }

    FObject.prototype.destroy = function () {
        this._refCount--;
        if(this._refCount < 0 ) {
            console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
        }
    }

    FObject.prototype.isPhone = function() {
        return CommFunc.isPhone();
    }

    FObject.prototype.getRefCount = function() {
        return this._refCount;
    }

    return FObject;

}());


var FTransform = (function() {

    __inherit(FTransform, FObject);

    function FTransform() {
        /**
         * 게임 오브젝트의 이름
         */
        this._name = null;

        /**
         * 게임 오브젝트의 메쉬정보
         */
        this._mesh = null;
    }

    FTransform.prototype.init = function () {
        FObject.prototype.init.call(this);
    }

    FTransform.prototype.destroy = function () {
        FObject.prototype.destroy.call(this);

        if(this.getRefCount() == 0) {
            this.clearMesh();
        } else {
            Debug.Error("refCount : " + this.getRefCount());
        }
    }

    FTransform.prototype.clearMesh = function() {

        if(this._mesh == null) return;
        for(var i=0; i<this._mesh.length; i++) {
            G.scene.stopAnimation(this._mesh[i].skeleton);
            G.eventManager.clearMeshButton(this._mesh[i]);
            this._mesh[i].isVisible = false;
            this._mesh[i].dispose();
        }
        
        CommFunc.arrayRemoveAll(this._mesh);
        this._mesh = null;
    }

    FTransform.prototype.setName = function(name) {
        this._name = name;
    }

    FTransform.prototype.getName = function() {
        return this._name;
    }

    FTransform.prototype.setVisible = function(bVisible) {
        for(var i=0; i<this._mesh.length; i++) {
            this._mesh[i].isVisible = bVisible;
            this._mesh[i].isPickable = bVisible;
        }
    }

    FTransform.prototype.addMesh = function(mesh) {

        var self = this;
        if(this._mesh == null) this._mesh = new Array();

        if(Array.isArray(mesh)) {

            mesh.forEach(function(m){
                self._mesh.push(m);
            });
        
        } else {
            
            this._mesh.push(mesh);

        }
    }

    FTransform.prototype.getMesh = function() {

        return this._mesh;
    }

    FTransform.prototype.setMesh = function(mesh) {

        if(this._mesh) alert('메쉬가 이미 있어..');

        if(Array.isArray(mesh))
            this._mesh = mesh;
        else {
            this._mesh = new Array();
            this._mesh.push(mesh);
        }
    }

    FTransform.prototype.setPosition = function(position) {

        if(this._name == "catFood") {
            // console.log("fwefw");
        }

        for(var i=0; i<this._mesh.length; i++) {

            if(this._mesh[i].parent == null)
                this._mesh[i].position = new Vector3(position.x, position.y, position.z);
        }
    }

    FTransform.prototype.setPositionXZ = function(x,z) {

        for(var i=0; i<this._mesh.length; i++) {

            if(this._mesh[i].parent == null) {

                this._mesh[i].position = new Vector3(x, this._mesh[i].position.y, z);

            }
        }
    }

    FTransform.prototype.getPosition = function() {
        for(var i=0; i<this._mesh.length; i++) {

            if(this._mesh[i].parent == null)
                return this._mesh[i].position;
        }
    }
    
    FTransform.prototype.rotationAnimation = function(mesh, rotationQuaternion) {
        var frameRate = 1;
        var q = new BABYLON.Animation("rotation", "rotationQuaternion", frameRate, BABYLON.Animation.ANIMATIONTYPE_QUATERNION, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keyFramesA = []; 

        keyFramesA.push({
            frame: 0,
            value: mesh.rotationQuaternion
        });

        keyFramesA.push({
            frame: frameRate,
            value: rotationQuaternion
        });

        q.setKeys(keyFramesA);
        G.scene.beginDirectAnimation(mesh, [q], 0, frameRate, false, 10);
    }

    
    FTransform.prototype.setRotationQuaternion = function(rotation) {

        for(var i=0; i<this._mesh.length; i++) {
            if(this._mesh[i].parent == null)
                // this.rotationAnimation(this._mesh[i], rotation);
                this._mesh[i].rotationQuaternion = rotation;
        }
    }

    FTransform.prototype.getRotationQuaternion = function() {

        for(var i=0; i<this._mesh.length; i++) {
            if(this._mesh[i].parent == null)
                return this._mesh[i].rotationQuaternion;
        }
    }

    FTransform.prototype.setRotation = function(r) {

        for(var i=0; i<this._mesh.length; i++) {
            if(this._mesh[i].parent == null)
                this._mesh[i].rotation = new Vector3( r.x, r.y, r.z );
        }
    }

    FTransform.prototype.lookAt = function(r) {

        for(var i=0; i<this._mesh.length; i++) {
            this._mesh[i].lookAt(r);
        }
    }

    FTransform.prototype.ForwardRotation = function(from, to) {
        
        var relativePos = to.subtract(from);

        var rotation = CommFunc.QuaternionLookRotation(relativePos, Vector3.Up());
        this.setRotationQuaternion(rotation);

        // if(this.connected) {
        //     var data = {
        //         'Animation' : null,
        //         'Loop' : null,
        //         'Qrotation' : rotation,
        //     };

        //     if(this._preData != null) {
        //         if(this._preData['Qrotation'].x == rotation.x 
        //         && this._preData['Qrotation'].y == rotation.y
        //         && this._preData['Qrotation'].z == rotation.z
        //         && this._preData['Qrotation'].w == rotation.w ) {
        //             return;
        //         }
        //     }

        //     this._preData = data;
        //     var json = protocol.moveLocation(55555, data);
        //     ws.onRequest(json, this.moveLocationCB, this);
        // }
    }


    return FTransform;

}());

var FGameObject = (function () {

    __inherit(FGameObject, FTransform);

    function FGameObject() {
        
        /**
         * 게임 오브젝트의 아이디
         */
        this._objID = null;

        /**
         * 게임 오브젝트의 플레이어 키
         */
        this._pk = null;

        /**
         * 오브젝트를 터치했을 때를 알려주는 콜백
         */

        this._touchInfo      = null;
        this._bRegisterTouch = null;
        this.isHighLight     = null;

        /**
         * 게임 오브젝트의 속성정보
         */
        this._attribute = null;

        this._preData = null;

        this._tick = null;

        return this;
    }

    FGameObject.prototype.init = function () {
        FTransform.prototype.init.call(this);

        this._touchInfo = [];
        this._bRegisterTouch = false;
        this.isHighLight    = true;

        this._tick = 0;
    }

    FGameObject.prototype.run = function() {
        this._tick++;
    }

    FGameObject.prototype.resetTick = function() {
        this._tick = 0;
    }

    FGameObject.prototype.getTick = function() {
        return this._tick;
    }

    FGameObject.prototype.destroy = function () {
        FTransform.prototype.destroy.call(this);
    }

    FGameObject.prototype.enableHighLight = function(b) {

        if(b == false) this.setHighLight(false);
        
        this.isHighLight = b;
    }

    FGameObject.prototype.getMainMesh = function() {

        for(var i=0; i<this._mesh.length; i++) {
            if(this._mesh[i].parent == null)
                return this._mesh[i];
        }   
    }

    FGameObject.prototype.getMeshes = function() {
        if(Array.isArray(this._mesh))
            return this._mesh;

        return null;
    }

    FGameObject.prototype.getMesh = function() {

        if(Array.isArray(this._mesh))
            return this._mesh[0];

        return this._mesh;
    }

    FGameObject.prototype.setHighLight = function(on) {

        if(this.isHighLight == false) return;
        if(on == true && G.guiMain.isShowingPopup()) return;

        for(var i=0; i<this._mesh.length; i++) {

            if(on) G.highLightLayer.addMesh(this._mesh[i], BABYLON.Color3.White());
            else G.highLightLayer.removeMesh(this._mesh[i]);
        }
    }

    FGameObject.prototype.setObjID = function(objID) {
        this._objID = objID;
    }

    FGameObject.prototype.getObjID = function() {
        return this._objID;
    }

    FGameObject.prototype.setPk = function(pk) {
        this._pk = pk;
    }

    FGameObject.prototype.getPk = function() {
        return this._pk;
    }


    FGameObject.prototype.setAttribute = function(attribute) {
        this._attribute = attribute;
    }

    FGameObject.prototype.getAttribute = function() {
        return this._attribute;
    }



    FGameObject.prototype.setTouchEvent = function(lparam, pparam, callback) {

        var ti = {
            'lparam' : lparam,
            'pparam' : pparam,
            'callback' : callback
        };

        this._touchInfo.push(ti);
        if(this._bRegisterTouch == false) this._registerAction();
        this._bRegisterTouch = true;
    }

    FGameObject.prototype._registerAction = function() {

        if(this._mesh == null) return;

        var self = this;
        // var pointDown = false;
        for(var i=0; i<this._mesh.length; i++) {
            this._mesh[i].actionManager = new BABYLON.ActionManager(G.scene);
            this._mesh[i].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){	
                self.setHighLight(true);

                self._touchInfo.forEach(function(info) {
                    if(info.callback)
                        info.callback('OnPointerOverTrigger',info.lparam, info.pparam);
                });
                // console.log("OnPointerOverTrigger");
            }));

            this._mesh[i].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
                
                self.setHighLight(false);
                
                self._touchInfo.forEach(function(info) {
                    if(info.callback)
                        info.callback('OnPointerOutTrigger',info.lparam, info.pparam);
                });
                // console.log("OnPointerOutTrigger");
            }));

            // this._mesh[i].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, function(ev){

            //     pointDown = true;
            //     console.log("OnPickDownTrigger");

            // }));

            // this._mesh[i].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function(ev){

            //     if(ev.sourceEvent.button != 0) return;

            //     if(!pointDown) return;
            //     self._touchInfo.forEach(function(info) {
            //         if(info.callback)
            //             info.callback('OnPickUpTrigger',info.lparam, info.pparam);
            //     });

            //     pointDown = false;
            //     console.log("OnPickUpTrigger");
            // }));


            this._mesh[i].actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function(ev){

                if(ev.sourceEvent.button != 0) return;

                // if(!pointDown) return;
                self._touchInfo.forEach(function(info) {
                    if(info.callback)
                        info.callback('OnPickUpTrigger',info.lparam, info.pparam);
                });

                // pointDown = false;
                // console.log("OnPickTrigger");
            }));


        }
    }

    return FGameObject;

}());



var FBAnimation = (function () {

    function FBAnimation() {


        return this;
    }

    return FBAnimation;

}());




// var FAAA = (function () {

//     var counter = 0;

//     function FAAA() {

//         this.name = null;
//         counter += 1;

//         this.parts = [];
//         this.obj = [];
//         this.num = 555;
//     }

//     FAAA.prototype.init = function() {
//         console.log('init FAAA');

//         // this.parts = new Array();
//     }

//     FAAA.prototype.setName = function(name) {
//         this.name = name;
//     }

//     FAAA.prototype.pName = function() {
//         console.log(this.name);
//     }

//     FAAA.prototype.getCounter = function() {
//         return counter;
//     }

//     return FAAA;
// }());

// var fa = new FAAA('A');
// fa.pName();
// var fb = new FAAA('B');
// fb.pName();
// fa.pName();

// var fa = new FAAA();
// console.log(fa.getCounter());
// var fb = new FAAA();
// console.log(fb.getCounter());

// var FBBB = (function () {

//     __inherit(FBBB,FAAA);

//     function FBBB(name) {
//         this.setName(name);
//         // this.name = name;
        
//     }

//     FBBB.prototype.init = function() {

//         FAAA.prototype.init.call(this);

//         // this.parts = [];


//     }

//     return FBBB;
// }());

// var fa = new FBBB('a');
// fa.init();
// var fb = new FBBB('b');
// fb.init();
// var fc = new FBBB('c');
// fc.init();

// // fa.parts = [];
// fa.parts.push('111');
// fa.parts.push('222');
// fb.parts.push('333');
// fa.name = 'aaaa';
// fa.obj = {'a':999};





// var FCCCC = (function () {

//     __inherit(FCCC,FBBB);

//     function FCCC(name) {
//         // this.setName(name);
//         this.aaa = name;

//     }

//     FCCC.prototype.init = function() {
//         FBBB.prototype.init.call(this);

//         console.log('init FCCC');
//     }

//     FCCC.prototype.pName = function() {
//         this.super.pName.call(this);
//         console.log(this.aaa);
//     }

//     return FCCC;
// }());



//  var cc = new FCCCC('ccc');
//  cc.init();
// console.log(cc.aaa);
// console.log(cc.bbb);
// cc.pName();
// console.log(cc.ggg);
// // console.log(ggg);
// console.log(cc.getCounter());
