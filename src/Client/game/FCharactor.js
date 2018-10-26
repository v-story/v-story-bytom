'use strict';

var SKELETON = {}

SKELETON.IDLE           = 11001;
SKELETON.WALK           = 11002;
SKELETON.RUN            = 11003;
SKELETON.CHANGE_HAIR    = 11004;
SKELETON.CHANGE_UPPER   = 11005;
SKELETON.CHANGE_LOWER   = 11006;
SKELETON.HELLO          = 11007;
SKELETON.ANGLY          = 11008;
SKELETON.SAD            = 11009;
SKELETON.SIT_CHAIR      = 11010;
SKELETON.WAIT_CHAIR     = 11011;
SKELETON.RISE_CHAIR     = 11012;
SKELETON.SIT_BED        = 11013;
SKELETON.WAIT_BED       = 11014;
SKELETON.RISE_BED       = 11015;
SKELETON.SIT_CHAIR2     = 11016;
SKELETON.WAIT_CHAIR2    = 11017;
SKELETON.RISE_CHAIR2    = 11018;
SKELETON.FEEDING        = 11019;
SKELETON.PAT            = 11020;
SKELETON.HIFIVE         = 11021;
SKELETON.HUG            = 11022;
SKELETON.LAUGH          = 11023;
SKELETON.DEFECATION     = 11024;
SKELETON.CARWASH        = 11025;
SKELETON.BATH           = 11026;

var ACTION = {}

ACTION.MOVE             = 10000;
ACTION.ROTATION         = 10001;
ACTION.MOVE_WORLD       = 10002;
ACTION.QUATERNION       = 10003;
ACTION.LOOKCAMERA       = 10004;
ACTION.CANCEL           = 20000;
ACTION.SETTIMER         = 20010;
ACTION.TAKEOFFCLOTHES   = 20020;
ACTION.TAKEONCLOTHES    = 20021;

var CSTATE = {}
CSTATE.IDLE         = 1;
CSTATE.INTERACTION  = 2;
//<----------------------------------------------------------------------------------------------------------------
var food = null
var FCharactor = (function () {

    __inherit(FCharactor,FGameObject);

    function FCharactor(name) {

        this.setName(name);

        this.avatarInfo         = null;

        this.currentAction      = null;
        this.currentLoop        = null;

        this.reservedActionList = null;

        this.changeParts        = null;

        this.connected          = null;

        this.SRC_IDX            = null;
        this.DST_IDX            = null;
        this.astarPath          = null;
        this.startTime          = null;
        this.reservedDstIndex   = null;

        this.position           = null;
        this.nextPosition       = null;
        this.pathIndex          = null;

        this.threshold          = null;
        this.speed              = null;

        this.justWalk           = null;

        this.pause              = null;
        this.moveWorld          = null;

        this.WALK_SPEED         = null;
        this.RUN_SPEED          = null;
    
        this.startTimer         = null;
        this.endTimer           = null;

        this.dontMove           = null;

        this.animObservable     = null;
        this.mechanim           = null;

        this.lowerVisible       = null;
        this.upperVisible       = null;
    }
    
    // overloading
    FCharactor.prototype.getMainMesh = function()
    {
        return this.getMeshPart(PARTS_HAIR);
    }

    FCharactor.prototype.takeOffClothes = function() {
        var mesh = this.getMeshPart(PARTS_LOWER);
        this.lowerVisible = mesh.isVisible;
        mesh.isVisible = false;

        mesh = this.getMeshPart(PARTS_UPPER);
        this.upperVisible = mesh.isVisible;
        mesh.isVisible = false;
    }
    
    FCharactor.prototype.takeOnClothes = function() {
        var mesh = this.getMeshPart(PARTS_LOWER);
        mesh.isVisible = this.lowerVisible;

        mesh = this.getMeshPart(PARTS_UPPER);
        mesh.isVisible = this.upperVisible;
    }


    FCharactor.prototype.setMovingSpeed = function(walk, run) {
        this.WALK_SPEED = walk;
        this.RUN_SPEED = run;

        this.speed = this.WALK_SPEED;
    }

    FCharactor.prototype.createAvatar = function(avatarInfo, callback) {
        
        var info = null;

        if(G.resManager.isFullLoad()) {
            info =  { 'gender' : avatarInfo.gender,
                        'upper'  : 0,
                        'lower'  : 0,
                        'hair'   : 0,
                        'head'   : 0, //얼굴형은 없기 때문에 여기가 1이어야 함..
                        'cap'    : 0,
                        'acc'    : 0,
                        'eyebrow': 0,
                        'eye'    : 0,
                        'mouse'  : 0
            };

        } else {
            info =  { 'gender' : avatarInfo.gender,
                        'upper'  : 1,
                        'lower'  : 1,
                        'hair'   : 1,
                        'head'   : 1,
                        'cap'    : 1,
                        'acc'    : 1,
                        'eyebrow': 1,
                        'eye'    : 1,
                        'mouse'  : 1,                        
            };
        }


        this.init();
        this.setAvatarInfo(info);
        this.initCharactorMesh();
        this.setAnimationObservable();
        this.setLoadedAvatar(avatarInfo, function(){

            if(callback) callback();

        });
        
    }

    FCharactor.prototype.createPet = function(objID, callback) {

        this.init();
        this.setObjID(objID);
        this.setMovingSpeed(15,60);
        this.setInsideWalk(true);
        G.resManager._loadSingleAvatar(objID, this, function(newMeshes, self){

            self.setMesh(newMeshes);
            self.setVisible(true);
            if(callback) callback();
        });
    }


    FCharactor.prototype.setAvatarInfo = function(avatarInfo) {
        this.avatarInfo = avatarInfo;
        // this.setObjIDForGender(avatarInfo.gender);
    }

    FCharactor.prototype.getAvatarInfo = function(parts) {

        if(parts == null) return this.avatarInfo;

        switch(parts) {
            case PARTS_UPPER:    return this.avatarInfo.upper;
            case PARTS_HAIR:     return this.avatarInfo.hair;
            case PARTS_LOWER:    return this.avatarInfo.lower;
            case PARTS_HEAD:     return this.avatarInfo.head;
            case PARTS_CAP:      return this.avatarInfo.cap;
            case PARTS_ACC:      return this.avatarInfo.acc;
            case PARTS_EYEBROW:  return this.avatarInfo.eyebrow;
            case PARTS_EYE:      return this.avatarInfo.eye;
            case PARTS_MOUSE:    return this.avatarInfo.mouse;
        }

        return null;
    }

    FCharactor.prototype.setConnected = function(b) {
        this.connected = b;
    }

    FCharactor.prototype.init = function() {
        
        FGameObject.prototype.init.call(this);

        this.currentAction      = -1;
        this.currentLoop        = -1;
        this.reservedActionList = [];
        this.changeParts        = [];
        this.connected          = false;
        this.DST_IDX            = 30;
        this.startTime          = 0;
        this.reservedDstIndex   = -1;
        this.pathIndex          = 0;
        this.threshold          = 0.25;
        this.WALK_SPEED         = 20;
        this.RUN_SPEED          = 70;
        this.speed              = this.WALK_SPEED;

        this.moveWorld          = false;
        this.dontMove           = false;

        this.animObservable     = new FAnimationObservable();
        this.mechanim           = [];
    }

    FCharactor.prototype.destroy = function() {

        this.setConnected(false);
        this.stopAnimation();
        this.removeMechanim();

        this.animObservable.destroy();

        this.avatarInfo         = null;
        this.currentAction      = null;
        this.currentLoop        = null;
        this.reservedActionList = null;
        this.changeParts        = null;
        this.connected          = null;
        this.SRC_IDX            = null;
        this.DST_IDX            = null;
        this.astarPath          = null;
        this.startTime          = null;
        this.reservedDstIndex   = null;
        this.position           = null;
        this.nextPosition       = null;
        this.pathIndex          = null;
        this.threshold          = null;
        this.speed              = null;
        this.justWalk           = null;
        this.pause              = null;
        this.moveWorld          = null;
        this.WALK_SPEED         = null;
        this.RUN_SPEED          = null;
        this.startTimer         = null;
        this.endTimer           = null;
        this.dontMove           = null;
        this.animObservable     = null;
        this.mechanim           = null;
        this.lowerVisible       = null;
        this.upperVisible       = null;

        FGameObject.prototype.destroy.call(this);
    }

    FCharactor.prototype.setObjIDForGender = function(gender) {
        if(gender == 1) {
            this.setObjID(OBJ_MALE);
        }
        else if(gender == 2) {
            this.setObjID(OBJ_FEMALE);
        } else {
            Debug.Error('no avatar');
        }
    }

    FCharactor.prototype.isCurrentAction = function(action) {
        if(this.currentAction == action) return true;

        return false;
    }

    FCharactor.prototype.getCurrentAction = function() {
        return this.currentAction;
    }

    //이미 로딩되어 있는 아바타 메쉬를 가져온다.
    FCharactor.prototype.setLoadedAvatar = function(avatarInfo, callback) {

        // var info = {
        //     'gender' : 0,
        //     'upper'  : 0,
        //     'lower'  : 0,
        //     'hair'   : 0,
        //     'head'   : 0,
        //     'eyebrow': 0,
        //     'cap'    : 0,
        //     'acc'    : 0
        // }

        this.setObjIDForGender(avatarInfo.gender);

        if(G.resManager.isFullLoad()) {

            var name = null;
            if(avatarInfo.gender == 2) name = 'girl_animation';
            else name = 'boy_animation';

            G.resManager.getLoadGroupMesh(name, this, null, function(newMeshes, particleSystems, skeletons, self, pparam){

                self.setMesh(newMeshes);
                // self.setVisible(true);
    
                self.addChangeParts(PARTS_UPPER,    avatarInfo.upper);
                self.addChangeParts(PARTS_HAIR,     avatarInfo.hair);
                self.addChangeParts(PARTS_LOWER,    avatarInfo.lower);
                self.addChangeParts(PARTS_HEAD,     avatarInfo.head);
                self.addChangeParts(PARTS_CAP,      avatarInfo.cap);
                self.addChangeParts(PARTS_ACC,      avatarInfo.acc);
                self.addChangeParts(PARTS_EYEBROW,  avatarInfo.eyebrow);
                self.addChangeParts(PARTS_EYE,      avatarInfo.eye);
                self.addChangeParts(PARTS_MOUSE,    avatarInfo.mouse);

                self.excuteChangeParts(self, function(self){
        
                    self.avatarInfo = avatarInfo;
                    self.setVisible(true);
                    if(callback) callback();
        
                });            
            });
    
        } else {
            this.setObjIDForGender(avatarInfo.gender);

            this.addChangeParts(PARTS_UPPER,    avatarInfo.upper);
            this.addChangeParts(PARTS_HAIR,     avatarInfo.hair);
            this.addChangeParts(PARTS_LOWER,    avatarInfo.lower);
            this.addChangeParts(PARTS_HEAD,     avatarInfo.head);
            this.addChangeParts(PARTS_CAP,      avatarInfo.cap);
            this.addChangeParts(PARTS_ACC,      avatarInfo.acc);
            this.addChangeParts(PARTS_EYEBROW,  avatarInfo.eyebrow);
            this.addChangeParts(PARTS_EYE,      avatarInfo.eye);
            this.addChangeParts(PARTS_MOUSE,    avatarInfo.mouse);

            this.excuteChangeParts(this, function(self){

                self.avatarInfo = avatarInfo;
                
                if(callback) callback();

            });
        }
    }



    FCharactor.prototype._setPartsMesh = function(gender, dmeshes, partsName) {

        if(dmeshes.length > 1) {
            alert('mesh length must be 1');
            return;
        }

        var dmesh = dmeshes[0];
        var smesh = this.getMeshes();

        for(var i=0; i<smesh.length; i++) {

            var sParts = G.resManager.getParts(gender,smesh[i].name);
            var dParts = G.resManager.getParts(gender,partsName);

            if(sParts == null || dParts == null) continue;
            if(sParts == dParts) {

                var ok = false;
                for(var j=0; j<smesh[i].skeleton.bones.length; j++) {

                    if(dmesh.skeleton.bones.length != smesh[i].skeleton.bones.length) {
                    
                         Debug.Alert(partsName + ': bone length is difference');
                        return;
                    
                    } else {

                        for(var k=0; k<smesh[i].skeleton.bones.length; k++) {
                            if(dmesh.skeleton.bones[j].name == smesh[i].skeleton.bones[k].name) {
                                dmesh.skeleton.bones[j].animations = smesh[i].skeleton.bones[k].animations;
                                ok = true;
                                break;
                            }
                        }
                        if(!ok) {
                            Debug.Alert('no search bone!!!');
                        }
                    }
                }



                dmesh.position = smesh[i].position;
                dmesh.rotation = smesh[i].rotation;
                dmesh.rotationQuaternion = smesh[i].rotationQuaternion;
                smesh[i].dispose();
                smesh[i] = dmesh;
                smesh[i].isVisible = true;

                G.resManager.checkAttachCustomClothTexture( this.getPk(), dParts, dmesh, gender );
                return;
            }
        }
    }




    FCharactor.prototype.addChangeParts = function(parts, index) {

        var info = 0;
        switch(parts) {
            case PARTS_UPPER:    info = this.avatarInfo.upper;      break;
            case PARTS_HAIR:     info = this.avatarInfo.hair;       break;
            case PARTS_LOWER:    info = this.avatarInfo.lower;      break;
            case PARTS_HEAD:     info = this.avatarInfo.head;       break;
            case PARTS_CAP:      info = this.avatarInfo.cap;        break;
            case PARTS_ACC:      info = this.avatarInfo.acc;        break;
            case PARTS_EYEBROW:  info = this.avatarInfo.eyebrow;    break;
            case PARTS_EYE:      info = this.avatarInfo.eye;        break;
            case PARTS_MOUSE:    info = this.avatarInfo.mouse;      break;
        }

        if(info == index) return;

        this.changeParts.push({'parts':parts,'index':index});
    }

    FCharactor.prototype.excuteChangeParts = function(param, callback) {

        var self = this;
        var count = 0;

        if(this.changeParts.length == 0) {
            if(callback) callback(param);
            return;
        }

        this.changeParts.forEach(function(cp){

            self._changeParts(cp.parts, cp.index, function(){

                count++;

                if(self.changeParts.length == count) {

                    CommFunc.arrayRemoveAll(self.changeParts);
                    if(callback) callback(param);
                }
            });
        });
    }

    FCharactor.prototype._takeOnOffParts = function(parts, onOff) {
        var mesh = this.getMeshPart(parts);

        mesh.isVisible = onOff;
    }




    FCharactor.prototype._changeParts = function(parts, index, callback) {

        var location = null;
        var file = null;
        var key = null;

        var gender = this.avatarInfo.gender;

        if(gender == 1) location = 'Assets/50_male/';
        else if(gender == 2) location = 'Assets/51_female/';
        else { 
            alert('FCharactor.prototype.changeParts ==> Error gender');
        }

        if(index <= 0) {

            if(PARTS_BODY == parts) {
                return;
            } else if(PARTS_UPPER == parts) {
                this.avatarInfo.upper = 0;
            } else if(PARTS_LOWER == parts) {
                this.avatarInfo.lower = 0;
            } else if(PARTS_HAIR == parts) {
                this.avatarInfo.hair = 0;
            } else if(PARTS_HEAD == parts) {
                this.avatarInfo.head = 0;
            } else if(PARTS_ACC == parts) {
                this.avatarInfo.acc = 0;
            } else if(PARTS_CAP == parts) {
                this.avatarInfo.cap = 0;
            } else if(PARTS_EYEBROW == parts) {
                this.avatarInfo.eyebrow = 0;
            } else if(PARTS_EYE == parts) {
                this.avatarInfo.eye = 0;
            } else if(PARTS_MOUSE == parts) {
                this.avatarInfo.mouse = 0;
            } else {
                alert('FCharactor.prototype.changeParts ==> Error Parts');
                return;
            }

            this._takeOnOffParts(parts, false);
            if(callback) callback();
            return;

        } else {

            if(PARTS_BODY == parts) {
                return;
            } else if(PARTS_UPPER == parts) {
                if(this.avatarInfo.upper == index) return;
                key = Number(AVATAR_UPPER[gender]) + index - 1;
                this.avatarInfo.upper = index;
            } else if(PARTS_LOWER == parts) {
                if(this.avatarInfo.lower == index) return;
                key = Number(AVATAR_LOWER[gender]) + index - 1;
                this.avatarInfo.lower = index;
            } else if(PARTS_HAIR == parts) {
                if(this.avatarInfo.hair == index) return;
                key = Number(AVATAR_HAIR[gender]) + index - 1;
                this.avatarInfo.hair = index;
            } else if(PARTS_HEAD == parts) {
                if(this.avatarInfo.head == index) return;
                key = Number(AVATAR_HEAD[gender]) + index - 1;
                this.avatarInfo.head = index;
            } else if(PARTS_ACC == parts) {
                if(this.avatarInfo.acc == index) return;
                key = Number(AVATAR_ACC[gender]) + index - 1;
                this.avatarInfo.acc = index;
            } else if(PARTS_CAP == parts) {
                if(this.avatarInfo.cap == index) return;
                key = Number(AVATAR_CAP[gender]) + index - 1;
                this.avatarInfo.cap = index;
            } else if(PARTS_EYEBROW == parts) {
                if(this.avatarInfo.eyebrow == index) return;
                key = Number(AVATAR_EYEBROW[gender]) + index - 1;
                this.avatarInfo.eyebrow = index;
            } else if(PARTS_EYE == parts) {
                if(this.avatarInfo.eye == index) return;
                key = Number(AVATAR_EYE[gender]) + index - 1;
                this.avatarInfo.eye = index;
            } else if(PARTS_MOUSE == parts) {
                if(this.avatarInfo.mouse == index) return;
                key = Number(AVATAR_MOUSE[gender]) + index - 1;
                this.avatarInfo.mouse = index;
            } else {
                alert('FCharactor.prototype.changeParts ==> Error Parts');
                return;
            }
            
            file = key + '.babylon';
    
            if(G.resManager.isFullLoad()) {
                Loader.Mesh(location, file, key, this,  null, function (newMeshes, particleSystems, skeletons, key, This) {
    
                    This._setPartsMesh(gender,newMeshes, key);
                    if(callback) callback();
        
                });
            } else {
                G.resManager.loadPartsAvatar(location, file, key, gender, this, function (This,newMeshes, key) {
    
                    This._setPartsMesh(gender,newMeshes, key);
                    if(callback) callback();
                });
        
            }
        }
    }

    FCharactor.prototype.getMeshPart = function(partsIndex) {

       /*
        var PARTS_BODY     = 0;
        var PARTS_UPPER    = 1;
        var PARTS_LOWER    = 2;
        var PARTS_HAIR     = 3;
        var PARTS_HEAD     = 4;
        var PARTS_CAP      = 5;
        var PARTS_ACC      = 6;
        var PARTS_EYEBROW  = 7;
        var PARTS_MOUSE    = 8;
        var PARTS_EYE      = 9;
        var PARTS_END      = 10;
       */
 
        var meshes = this.getMeshes();
        return meshes[partsIndex];
    }

    FCharactor.prototype.initCharactorMesh = function() {

        if(G.resManager.isFullLoad()) return;

        var mesh = G.resManager.getAvatarMesh(this.avatarInfo);

        this.setMesh(mesh);
        this.setVisible(true);
    }

    //예약된 애니메이션이 있으면 실행한다.
    FCharactor.prototype._checkReservedActionList = function() {

        //다음 애니메이션이 있으면 연결해라
        if(!this.reservedActionList.length) {
            //예약된 행동이 없다면 기본 애니메이션
            this.startAnimation(SKELETON.IDLE, true, true);
            this.startTime = 0;
            this.setIdleState();
            return;
        }

        var mesh = this.getMeshes();

        var esc = false;
        while(!esc) {

            if(this.reservedActionList.length == 0) break;

            var reserved = this.reservedActionList[0];
            if(reserved.callback) reserved.callback(reserved.param);
    

            if( ACTION.MOVE == reserved.state ) {

                this.beginMove(reserved.data);
                esc = true;
            
            } else if( ACTION.MOVE_WORLD == reserved.state ) {

                this.beginMoveWorld(reserved.data);
                esc = true;

            } else if( ACTION.ROTATION == reserved.state ) {

                this.ForwardRotation( reserved.data, mesh[0].position);
                esc = false;

            } else if( ACTION.QUATERNION == reserved.state ) {
                this.setRotationQuaternion(reserved.data);
                esc = false;
            
            } else if( ACTION.LOOKCAMERA == reserved.state) {
                
                this.cameraLook();
                esc = false;

            } else if( ACTION.CANCEL == reserved.state) {

                this.cancelAction();
                this.startAnimation(SKELETON.IDLE, true, true);
                this.setIdleState();
                esc = false;

            } else if( ACTION.TAKEONCLOTHES == reserved.state) {
                this.takeOnClothes();
                esc = false;

                if(this.reservedActionList.length == 1) {
                    this.startAnimation(SKELETON.IDLE, true, true);
                    this.startTime = 0;
                    this.setIdleState();
                }

            } else {

                this.startAnimation(reserved.state, reserved.data, false);

                if(this.reservedActionList.length > 1) {
                    if(ACTION.SETTIMER == this.reservedActionList[1].state) {
                        this.startTimer = (new Date()).getTime();
                        this.endTimer = this.reservedActionList[1].data;
                        this.reservedActionList.shift();
                    } else if(ACTION.TAKEOFFCLOTHES == this.reservedActionList[1].state) {
                        this.takeOffClothes();
                        this.reservedActionList.shift();
                    }
                }

                esc = true;
            }

            if(this.connected) {
                var data = {
                    'Animation' : reserved.state,
                    'Loop' : reserved.data,
                    'Qrotation' : null,
                };
    
                var json = protocol.moveLocation(55555, data);
                ws.onRequest(json, this.moveLocationCB, this);
            }
    
            //배열의 첫번째 요소 삭제
            this.reservedActionList.shift();

            if(esc) break;
            // else {
            //     if(this.reservedActionList.length == 0) break;
            //     else
            //         reserved = this.reservedActionList[0];
    
            // }
        }

        // return;
    }

    FCharactor.prototype.startAnimationParts = function(state, loop, speedRatio, parts) {

        var self = this;
        var mesh = this.getMeshPart(parts);
        if(!mesh) return;
        if(mesh.skeleton == null) return;
        // this.finish = false;
        // console.log('애니 시작(' + from + ',' + to + ')');
        var frame = this.getFrameAnimation(state, this.getObjID());

        G.scene.beginAnimation(mesh.skeleton, frame.from, frame.to, loop, speedRatio, null);
    }

    FCharactor.prototype.removeMechanim = function() {

        for(var i=0; i<this.mechanim.length; i++) {
            this.mechanim[i].onAnimationEnd = null;
        }

        CommFunc.arrayRemoveAll(this.mechanim);

    }

    FCharactor.prototype._beginAnimation = function(state, loop, speedRatio) {

        var self = this;
        var mesh = this.getMeshes();
        if(!mesh) return;
        // this.finish = false;
        // console.log('애니 시작(' + from + ',' + to + ')');
        var frame = this.getFrameAnimation(state, this.getObjID());
        var from  = frame.from;
        var to    = frame.to;

        var count = 0;

        this.removeMechanim();

        for(var i=0; i<mesh.length; i++) {

            if (mesh[i].skeleton == null)
                continue;

            var anim = G.scene.beginAnimation(mesh[i].skeleton, from, to, loop, speedRatio, function () {

                count++;
                if ( count < mesh.length)
                    return;

                //애니메이션이 끝났다면            
                if(self.currentAction == SKELETON.IDLE || self.currentAction == SKELETON.WALK || self.currentAction == SKELETON.RUN) return;

                var frame = self.getFrameAnimation(self.currentAction, self.getObjID());
                
                if(from == frame.from && to == frame.to) {

                    self._checkReservedActionList();
                }
            });

            this.mechanim.push(anim);
            if(i == 0) {
                this.animObservable.setCurrentAnimation(anim, state);
            }
        }
    }

    FCharactor.prototype.stopAnimation = function() {

        var mesh = this.getMeshes();
        if(!mesh) return;
        
        for(var i=0; i<mesh.length; i++) {
            G.scene.stopAnimation(mesh[i]);
        }
    }

    FCharactor.prototype.reservedAction = function(state, data, param, callback) {
     
        var aniState = {
            'state'     : state,
            'data'      : data,
            'callback'  : callback,
            'param'     : param
        };

        this.reservedActionList.push(aniState);

        if(this.startTime == 0 && this.currentAction == SKELETON.IDLE) {
            this._checkReservedActionList();
        }

    }

    FCharactor.prototype.getFrameAnimation = function(actionID, objID) {

        var from = 0, to = 0;
        var act = G.dataManager.getFrameAnimation(objID, actionID);

        if(act == null) {
            alert("getFrameAnimation is null");
            return;
        }

        from = act.OBJ_ACTN_KIND_START;
        to   = act.OBJ_ACTN_KIND_END;

        // if(actionID == SKELETON.FEEDING) {
        //     console.log("SKELETON.FEEDING : " + from + ", " + to);
        // }

        return {'from':from, 'to':to};
    }

    FCharactor.prototype.startAnimation = function(state, loop, check) {

        //check가 true이면 현재 플레이중인 애니메이션과 같은지 검사한다.
        //같다면 다시 시작하지 않는다.
        if(check && (this.currentAction == state && this.currentLoop == loop)) return;

        var repeat = true;
        if(loop != null)
            repeat = loop;

        this.currentLoop     = loop;
        this.currentAction   = state;

        // var frame = this.getFrameAnimation(state, this.getObjID());
        this._beginAnimation(state, repeat, 1.0);
    }

    FCharactor.prototype.startMove = function(DST_IDX) {

        if(this.dontMove) return;

        CommFunc.arrayRemoveAll(this.reservedActionList);

        if(this.currentAction == SKELETON.WAIT_CHAIR) {
            this.startAnimation(SKELETON.RISE_CHAIR, false, true);
            this.reservedAction(ACTION.MOVE, DST_IDX, null, null);
        } else if(this.currentAction == SKELETON.WAIT_BED) {
            this.startAnimation(SKELETON.RISE_BED, false, true);
            this.reservedAction(ACTION.MOVE, DST_IDX, null, null);
        } else if(this.currentAction == SKELETON.IDLE) {

            this.startTime = 0;
            return this.beginMove(DST_IDX);

        } else {

            return this.beginMove(DST_IDX);
        }
    }

    FCharactor.prototype.beginMove = function(DST_IDX) {

        if(this.startTime == 0) {

            if(!this.findAStarPath(DST_IDX)) {
                this.reservedActionList.shift();
                this._stopMove();
                return false;
            }

            this.reservedDstIndex = -1;
            this.startAnimation(SKELETON.WALK, true, true);

            // if(this.connected) {
            //     var json = protocol.moveLocation(DST_IDX);
            //     ws.onRequest(json, this.moveLocationCB, this);
            // }

        } else {

            if(!this.checkAStarPath(DST_IDX)) return false;

            this.reservedDstIndex = DST_IDX;
        }

        return true;
    }

    FCharactor.prototype.beginMoveWorld = function(pos) {
        
        this.moveWorld = true;

        this.startAnimation(SKELETON.WALK, true, true);

        this.nextPosition = pos;
        this.startTime = (new Date()).getTime();
    }


    FCharactor.prototype.getPositionIndex = function(index) {

        var size = FMapManager.getInstance().TILE_SIZE / 2;

        return FMapManager.getInstance().getIndexToWorld(index).add(new Vector3(size,0,size));
    }

    FCharactor.prototype.changeWalkToRun = function() {

        if(this.pathIndex < 1) return;

        if(this.currentAction == SKELETON.WALK && !this.justWalk) {

            if(this.astarPath.length - this.pathIndex > 3) {
                this.startAnimation(SKELETON.RUN, true, true);
                this.speed = this.RUN_SPEED;
            }

        } else if(this.currentAction == SKELETON.RUN) {
             
            if(this.astarPath.length - this.pathIndex < 1) {
                this.startAnimation(SKELETON.WALK, true, true);
                this.speed = this.WALK_SPEED;
            }
        }
    }

    FCharactor.prototype.setJustWalk = function(b) {
        this.justWalk = b;
    }

    FCharactor.prototype.checkAStarPath = function(DST_IDX) {

        var world = FMapManager.getInstance().getWorldMap();
        var start = FMapManager.getInstance().getCoordinateAxis(this.SRC_IDX);
        var end   = FMapManager.getInstance().getCoordinateAxis(DST_IDX);
        var pathStart = [start.x, start.y];
        var pathEnd = [end.x, end.y];

        if(world == null) return false;

        var astarPath = findPath(world,pathStart,pathEnd);

        if(astarPath.length > 1) return true;

        return false;
    }

    FCharactor.prototype.findAStarPath = function(DST_IDX) {

        this.DST_IDX = DST_IDX;

        var world = FMapManager.getInstance().getWorldMap();
        var start = FMapManager.getInstance().getCoordinateAxis(this.SRC_IDX);
        var end   = FMapManager.getInstance().getCoordinateAxis(this.DST_IDX);
        var pathStart = [start.x, start.y];
        var pathEnd = [end.x, end.y];

        if(world == null) return false;

        this.astarPath = findPath(world,pathStart,pathEnd);
        this.pathIndex = 0;
        if(this.astarPath.length > 1) {

            //this.astarPath 첫번째 인자는 현재 위치 SRC_IDX
            var index = FMapManager.getInstance().getIndexAxis(this.astarPath[this.pathIndex][0], this.astarPath[this.pathIndex][1]);
            this.position = this.getPositionIndex(index);

            //두번째는 다음 위치
            this.pathIndex++;
            index = FMapManager.getInstance().getIndexAxis(this.astarPath[this.pathIndex][0], this.astarPath[this.pathIndex][1]);
            this.nextPosition = this.getPositionIndex(index);
            this.pathIndex++;
            this.startTime = (new Date()).getTime();

            this.ForwardRotation(this.nextPosition, this.position);

            if(this.connected) {
                var json = protocol.moveLocation(DST_IDX);
                ws.onRequest(json, this.moveLocationCB, this);
            }

            return true;
        }

        return false;
    }

    FCharactor.prototype.adjustPosition = function(position) {

        if(position == null) {
            alert("adjustPosition postion is null");
        }

        var index = FMapManager.getInstance().getWorldToIndex(position.x, position.z);
        var layer = FMapManager.getInstance().getTileLayer(index);

        return new Vector3(position.x, layer+0.1, position.z);
    }

    FCharactor.prototype.addAnimEvent = function(This, frame, callback) {
        if(!this.animObservable) return;

        this.animObservable.addAnimEvent(This, frame, callback);
    }

    FCharactor.prototype.run = function(){

        
        if(this.animObservable) {

            this.animObservable.run();
        }
            

        if(this.alphago) this.alphago.run();

        if(this.startTimer) {
            var curTime = (new Date()).getTime();

            if(curTime - this.startTimer >= this.endTimer) {
                this.startTimer = 0;
                this.endTimer = 0;
                this._checkReservedActionList();
                return;
            }
        }

        if(this.moveWorld == true) {

            var curTime = (new Date()).getTime();
            var deltaTime = (curTime-this.startTime)/1000.0;

            // Debug.Log("move world : "+this.position+","+this.nextPosition);
            this.position = CommFunc.MoveTowards(this.position, this.nextPosition, deltaTime * 50);//this.speed);

            this.setPosition(this.adjustPosition(this.position));

            this.startTime = curTime;

            if(Vector3.Distance(this.position, this.nextPosition) <= this.threshold) {

                this._stopMove();
                return;
            }

            var nextPosition = new Vector3(this.nextPosition.x, 0, this.nextPosition.z);
            var position = new Vector3(this.position.x, 0, this.position.z);
            this.ForwardRotation(nextPosition,position);

        } else {

            if(this.startTime == 0) return;
            if(this.astarPath && this.astarPath.length == 0) return;
            if(this.pathIndex == 0) {
    
                this._stopMove();
                return;
            }
            if(this.pause) return;
    
            var curTime = (new Date()).getTime();
            var deltaTime = (curTime-this.startTime)/1000.0;
    
            this.changeWalkToRun();

            // Debug.Log("move : "+this.position+","+this.nextPosition);
            this.position = CommFunc.MoveTowards(this.position, this.nextPosition, deltaTime * this.speed);
            this.setPosition(this.adjustPosition(this.position));
            this.startTime = curTime;
    
            if(Vector3.Distance(this.position, this.nextPosition) <= this.threshold) {
    
                if(this.astarPath.length < this.pathIndex) {
                    Debug.Error('Error');
                    return;
                }
    
                this.SRC_IDX = FMapManager.getInstance().getIndexAxis(this.astarPath[this.pathIndex-1][0], this.astarPath[this.pathIndex-1][1]);
    
                if(this.reservedDstIndex != -1) {
                    if(!this.findAStarPath(this.reservedDstIndex)) {
                        this._stopMove();
                    }
                    this.reservedDstIndex = -1;
                    return;
                }
    
                if(this.astarPath.length == this.pathIndex) {
    
                    this._stopMove();
                    return;
                }
    
                var index = FMapManager.getInstance().getIndexAxis(this.astarPath[this.pathIndex][0], this.astarPath[this.pathIndex][1]);
                this.nextPosition = this.getPositionIndex(index);
                this.pathIndex++;
                this.ForwardRotation(this.nextPosition, this.position);
            }
        }

    }

    FCharactor.prototype._stopMove = function() {
        CommFunc.arrayRemoveAll(this.astarPath);
        this.startTime = 0;
        this.moveWorld = false;
        this._checkReservedActionList();
    }

    FCharactor.prototype._forceStop = function() {
        CommFunc.arrayRemoveAll(this.astarPath);
        this.startTime = 0;
        this.moveWorld = false;
        CommFunc.arrayRemoveAll(this.reservedActionList);
    }
    

    
    FCharactor.prototype.setAnimationObservable = function(objID) {
        
        // this.animObservable.addAnimEvent(this, SKELETON.IDLE, 20, this.idleEventCallback);
        // this.animObservable.addAnimEvent(this, SKELETON.RUN, 180, this.runEventCallback);
        this.animObservable.addAnimEvent(this, SKELETON.FEEDING, 1400, this.feedEventCallback);
        this.animObservable.addAnimEvent(this, SKELETON.BATH, 2920, this.bathEventCallback);
    }

    FCharactor.prototype.idleEventCallback = function(self, state, frame) {

        if(state == SKELETON.IDLE && frame == 20) {
            console.log("ok idle callback");
        }

    }

    FCharactor.prototype.runEventCallback = function(self, state, frame) {

        if(state == SKELETON.RUN && frame == 180) {
            console.log("ok run callback");
        }

    }

    FCharactor.prototype.feedEventCallback = function(self, state, frame) {

        if(!(state == SKELETON.FEEDING && frame == 1400)) return;
        
        // console.log("ok feed callback");
        
        food = new FCatFood();
        food.create(self.getPosition(), self.getRotationQuaternion());
    }

    FCharactor.prototype.setIdleState = function() {
        this.state = CSTATE.IDLE;
    }

    return FCharactor;

}());



var FRoomCharactor = (function () {

    __inherit(FRoomCharactor,FCharactor);

    function FRoomCharactor(identity, name) {

        this.setName(name);

        this.intro      = null;
        this.imgUrl     = null;

        this.alphago    = null;
        this.steward    = null;
        this.pet        = null;

        this.thumb      = null;
        this.inside     = null;

        this.follow     = null;
        this.identity   = identity; //0없음, 1은 나, 2는 친구집의 주인장
        this.state      = null;
    }

    FRoomCharactor.prototype.init = function() {

        FCharactor.prototype.init.call(this);

        this.steward    = false;
        this.pet        = false;
        this.state      = CSTATE.IDLE;
    }

    FRoomCharactor.prototype.setProfile = function(url, intro) {
        this.imgUrl = url;
        this.intro = intro;
    }

    FRoomCharactor.prototype.setTileIndex = function(tileIdx) {
        this.SRC_IDX = tileIdx;
    }

    FRoomCharactor.prototype.setInsideWalk = function(b) {
        this.inside = b;
    }

    FRoomCharactor.prototype.getInsideWalk = function() {
        return this.inside;
    }

    FRoomCharactor.prototype.equipAlphaGo = function(steward, pet, ownerBody) {

        this.steward    = steward;
        this.pet        = pet;
        this.follow     = ownerBody;
        this.alphago    = new FAlphaGo(this,steward,pet);
    }

    FRoomCharactor.prototype.isIdleState = function() {
        if(this.state == CSTATE.IDLE) return true;

        return false;
    }



    FRoomCharactor.prototype.setInteractionState = function() {
        this.state = CSTATE.INTERACTION;
    }


    FRoomCharactor.prototype.isRelax = function() {
        if((this.startTime == 0) && (this.currentAction == SKELETON.IDLE) && (this.isIdleState())) return true;
    
        return false;
    }

    FRoomCharactor.prototype.isAnotherRelax = function() {
        if((this.currentAction == SKELETON.WAIT_CHAIR)
            || (this.currentAction == SKELETON.WAIT_BED)
            || (this.currentAction == SKELETON.WAIT_CHAIR2)) return true;

        return false;            
    }

    FRoomCharactor.prototype.isInterationing = function() {
        if((this.currentAction == SKELETON.SIT_CHAIR)
            || (this.currentAction == SKELETON.SIT_BED)
            || (this.currentAction == SKELETON.SIT_CHAIR2)
            || (this.currentAction == SKELETON.WAIT_CHAIR)
            || (this.currentAction == SKELETON.WAIT_BED)
            || (this.currentAction == SKELETON.WAIT_CHAIR2) ) return true;

        return false;            
    }

    FRoomCharactor.prototype.setRelax = function() {
        this.startTime = 0; 
    }

    FRoomCharactor.prototype.getPositionTile = function() {
        return this.SRC_IDX;
    }

    FRoomCharactor.prototype.initRoomCharactor = function(bubble) {

        var position = this.getPositionIndex(this.SRC_IDX);
        
        this.setPosition(this.adjustPosition(position));
        this.startAnimation(SKELETON.IDLE, true, true);
        this.setIdleState();
        G.runnableMgr.add(this);
    
        this.setTouchEvent(this, null, this.recvTouchedEvent);

        if(bubble)
            this.renderFriendBubble(this.identity,this.imgUrl,this.intro, this.touch_lparam, this.touch_pparam, this.touch_callback);
    }

    FRoomCharactor.prototype.setPause = function(b) {

        if(this.pause == b) return;

        this.pause = b;

        if(b) {
            this._forceStop();
            this.cameraLook();
            this.startAnimation(this.getPauseMotion(), true, true);
        } else {
            this._stopMove();
        }
    }

    FRoomCharactor.prototype.getPauseMotion = function() {
        var objID = this.getObjID();
        if(objID == OBJ_MALE || objID == OBJ_FEMALE) {
            return SKELETON.LAUGH;
        } else {
            return SKELETON.PAT;
        }
    }

    FRoomCharactor.prototype.recvTouchedEvent = function(e, lparam, pparam) {

        var self = lparam;

        if(!(self.currentAction == SKELETON.IDLE 
            || self.currentAction == SKELETON.WALK 
            || self.currentAction == SKELETON.RUN)) {

            return;
        }

        if(e == 'OnPointerOverTrigger') {

            // self.pause = true;

        } else if(e == 'OnPointerOutTrigger') {

            // self.pause = false;


        } else if(e == 'OnPickUpTrigger') {

            // var objID = self.getObjID();
            // if(objID == 540000) {

            //     self.alphago.touch();

            // }
        }
    }

    FRoomCharactor.prototype.isEnableTouch = function() {

        if(!(this.currentAction == SKELETON.SIT_BED
            || this.currentAction == SKELETON.WAIT_BED 
            || this.currentAction == SKELETON.RISE_BED
            || this.currentAction == SKELETON.SIT_CHAIR
            || this.currentAction == SKELETON.WAIT_CHAIR
            || this.currentAction == SKELETON.RISE_CHAIR
            || this.currentAction == SKELETON.SIT_CHAIR2
            || this.currentAction == SKELETON.WAIT_CHAIR2
            || this.currentAction == SKELETON.WAIT_CHAIR2)) return true;

        return false;
    }

    FRoomCharactor.prototype.setDontMove = function(b) {
        this.dontMove = b;
    }

    FRoomCharactor.prototype.touch = function(owner, state) {
        
        var self = this;
        var ownIdx = owner.getPositionTile();
        var srcIdx = this.getPositionTile();
        var dst    = null;

        if(this.alphago) this.alphago.setRelaxTime(999);
        
        if(this.getObjID() == OBJ_CAT) {
    
            dst = FMapManager.getInstance().getNeighborTileIndex(srcIdx,ownIdx,3);
            this.startMove(dst);
            this.setJustWalk(false);
    
            this.reservedAction(state, false, null, function(){
                self.setJustWalk(true);
                self.oppLook(owner);
                owner.catInteraction(self, state);
            });

        } else {
    
            dst = FMapManager.getInstance().getNeighborTileIndex(srcIdx,ownIdx, 6);
            this.startMove(dst);
            this.setJustWalk(false);
    
            this.reservedAction(state, false, null, function(){
                self.setJustWalk(true);
                self.oppLook(owner);
                owner.friendIntercation(self);
            });
        }
        
        this.reservedAction(ACTION.CANCEL, false, null, null);
        this.setDontMove(true);
        owner.setDontMove(true);
        this.oppLook(owner);
    }

    FRoomCharactor.prototype.oppLook = function(opp) {
        var oppIdx = opp.getPositionTile();
        var srcIdx = this.getPositionTile();

        var spos = this.getPositionIndex(oppIdx);
        var dpos = this.getPositionIndex(srcIdx);

        opp.ForwardRotation(dpos,spos);
    }

    FRoomCharactor.prototype.cameraLook = function() {
        var srcIdx = this.getPositionTile();
        var dpos = this.getPositionIndex(srcIdx);

        var spos = new Vector3(G.camera.position.x, 0, G.camera.position.z);

        this.ForwardRotation(spos, dpos);
    }


    FRoomCharactor.prototype.catInteraction = function(opp, state) {
        this.startAnimation(state, false, true);
        this.reservedAction(ACTION.CANCEL, false, null, null);

        this.oppLook(opp);
    }

    FRoomCharactor.prototype.friendIntercation = function(opp) {
        this.startAnimation(SKELETON.HIFIVE, false, true);
        this.reservedAction(ACTION.CANCEL, false, null, null);

        this.oppLook(opp);
    }

    FRoomCharactor.prototype.cancelAction = function() {

        if(this.alphago) this.alphago.setRelaxTime(0);
        this.setDontMove(false);
    }

    FRoomCharactor.prototype.destroy = function() {

        if(this.thumb) {
            G.guiMain.removeControl(this.thumb);
        }

        if(this.alphago) {
            this.alphago.destroy();
            this.alphago = null;
        }

        G.runnableMgr.remove(this);

        FCharactor.prototype.destroy.call(this);        
    }


    FRoomCharactor.prototype.requestInteractionObject = function(objID, tileIdx1, tileIdx2, rotation, actnKind) {

        if(!this.isInteractionPossible()) return;

        //눕기
        if(actnKind == SKELETON.SIT_BED) {

            this.startMove(tileIdx1);
            this.reservedAction(ACTION.MOVE_WORLD, tileIdx2, null, null);
            this.reservedAction(ACTION.QUATERNION, rotation, null, null);
            this.reservedAction(SKELETON.SIT_BED,  false, null, null);
            this.reservedAction(SKELETON.WAIT_BED, true, null, null);

        //앉기 
        } else if(actnKind == SKELETON.SIT_CHAIR) {

            this.startMove(tileIdx1);
            this.reservedAction(ACTION.MOVE_WORLD, tileIdx2, null, null);
            this.reservedAction(ACTION.QUATERNION, rotation, null, null);
            this.reservedAction(SKELETON.SIT_CHAIR,  false, null, null);
            this.reservedAction(SKELETON.WAIT_CHAIR, true, null, null);

        } else if(actnKind == SKELETON.SIT_CHAIR2) {

            this.startMove(tileIdx1);
            this.reservedAction(ACTION.MOVE_WORLD, tileIdx2, null, null);
            this.reservedAction(ACTION.QUATERNION, rotation, null, null);
            this.reservedAction(SKELETON.SIT_CHAIR2,  false, null, null);
            this.reservedAction(SKELETON.WAIT_CHAIR2, true, null, null);
        
        } else if(actnKind == SKELETON.DEFECATION) {

            this.startMove(tileIdx1);
            this.reservedAction(ACTION.MOVE_WORLD, tileIdx2, null, null);
            this.reservedAction(ACTION.QUATERNION, rotation, null, null);
            this.reservedAction(SKELETON.DEFECATION,  false, null, null);

        } else if(actnKind == SKELETON.CARWASH) {
            this.startMove(tileIdx1);
            this.reservedAction(ACTION.MOVE_WORLD, tileIdx2, null, null);
            this.reservedAction(ACTION.QUATERNION, rotation, null, null);
            this.reservedAction(SKELETON.CARWASH,  false, null, null);

        } else if(actnKind == SKELETON.BATH) {
            this.startMove(tileIdx1);
            this.reservedAction(ACTION.MOVE_WORLD, tileIdx2, null, null);
            this.reservedAction(ACTION.QUATERNION, rotation, null, null);
            this.reservedAction(SKELETON.BATH,  false, null, null);
            this.reservedAction(ACTION.TAKEOFFCLOTHES, null, null, null);
            this.reservedAction(ACTION.TAKEONCLOTHES, null, null, null);
        }
    }

    FRoomCharactor.prototype.endInteractionObject = function(actnKind) {

        if(!this.isInteractionPossible()) return;

        //눕기
        if(actnKind == SKELETON.SIT_BED) {
            this.reservedAction(ACTION.SETTIMER, 3000, null, null);
            this.reservedAction(SKELETON.RISE_BED, false, null, null);

        //앉기 
        } else if(actnKind == SKELETON.SIT_CHAIR) {

            this.reservedAction(ACTION.SETTIMER, 3000, null, null);
            this.reservedAction(SKELETON.RISE_CHAIR, false, null, null);

        } else if(actnKind == SKELETON.SIT_CHAIR2) {

            this.reservedAction(ACTION.SETTIMER, 3000, null, null);
            this.reservedAction(SKELETON.RISE_CHAIR2, false, null, null);
        }
    }

    FRoomCharactor.prototype.isInteractionPossible = function() {
        return true;
    }

    FRoomCharactor.prototype.startAction = function(ani, loop) {
        this.startAnimation(ani, loop, true);
    }

    FRoomCharactor.prototype.moveLocationCB = function(res, self) {
        Debug.Log('server => move ok');
    }

    FRoomCharactor.prototype.randomAnimation = function() {

        var objID = this.getObjID();
        if(objID == OBJ_MALE || objID == OBJ_FEMALE) {

        var rnd = CommFunc.random(300);

        if(rnd < 100) this.startAnimation(SKELETON.LAUGH, false, null, null);
        else if(rnd < 200) this.startAnimation(SKELETON.ANGLY, false, null, null);
        else if(rnd < 300) this.startAnimation(SKELETON.SAD, false, null, null);

        } else {
            this.startAnimation(SKELETON.IDLE, true, null, null);
            this.setIdleState();
        }
    }

    FRoomCharactor.prototype.randomInteraction = function() {

        var objID = this.getObjID();
        if(objID == OBJ_MALE || objID == OBJ_FEMALE) {

            if((this.currentAction == SKELETON.WAIT_CHAIR) 
                || (this.currentAction == SKELETON.WAIT_BED)
                || (this.currentAction == SKELETON.WAIT_CHAIR2)) return;

            var list = FObjectManager.getInstance().getObjectActionList();
            if(list.length == 0 ) {
                console.error("FObjectManager.getInstance().getObjectActionList() == 0");
                this.startAnimation(SKELETON.IDLE, true, null, null);
                this.setIdleState();
                return;                
            }
            var rnd = CommFunc.random(list.length);
            var obj = list[rnd];

            var actionList = G.dataManager.getActnKind( obj.OBJ_ACTN_ID );
            if(!actionList) {
                Debug.Alert("Error Action List");
                return;
            }

            var action = [];
            for ( var i = 0; i < 5; ++i ) {
                var actionKind = actionList[ "OBJ_ACTN_KIND_"+(i+1).toString() ];
                if ( actionKind != 0 ) {
                    action.push(actionKind);
                }
            }

            rnd = CommFunc.random(action.length);
            this.setInteractionData(obj, action[rnd]);
        } else {
            this.startAnimation(SKELETON.IDLE, true, null, null);
            this.setIdleState();
        }
        
    }

    FRoomCharactor.prototype.setInteractionData = function(obj, kind) {

        var position1 = obj.getInteractionPositionTileIndex(1);
        var position2 = obj.getInteractionPositionTileIndex(2);
    
        if(position1 == null || position2 == null) {
            position1 = position1;
        }

        var tileIdx   = FMapManager.getInstance().getWorldToIndex(position1.x, position1.z);
        var rotation  = obj.getInteractionLookRotation();
        this.requestInteractionObject(obj.OBJ_ID, tileIdx, position2, rotation, kind);
        this.endInteractionObject(kind);

        this.setInteractionState();
    }


    FRoomCharactor.prototype.moveInteraction = function(DST_IDX, arrayAction) {

        var self = this;

        if(this.startTime == 0) {
            var rts = this.findAStarPath(DST_IDX);

            if(!rts) return rts;

            this.reservedDstIndex = -1;
            this.startAnimation(SKELETON.RUN, true, true);

            arrayAction.forEach( function(element) {
                self.reservedAction(element['state'], element['loop'], element['param'], element['callback']);    
            });

        } else {
            this.reservedDstIndex = DST_IDX;
        }

        return true;
    }


    FRoomCharactor.prototype.changeBubbleUrl = function(imgUrl) {
        // GUI.changeButtonImage( this.thumb, imgUrl );

        var self = this;
        GUI.changeButtonImage( this.thumb.getChildByName( "inner" ).getChildByName( "thumb" ), CLIENT_DOMAIN + "/fileupload/myprofile/profile_default.png" );
        setTimeout( function()
        {
            GUI.changeButtonImage( self.thumb.getChildByName( "inner" ).getChildByName( "thumb" ), imgUrl );            
        }, 500 );
    }


    FRoomCharactor.prototype.renderTextBalloon = function(text) {
        
        if(!text) return;

        var mesh = this.getMesh();

        GUI.createTextBalloon( mesh, text);
    }

    // overloading
    FRoomCharactor.prototype.getMainMesh = function()
    {
        var headMesh = this.getMeshPart(PARTS_HAIR);

        if ( headMesh == null )
            headMesh = this.getMeshes()[0];

        return headMesh;
    }

    FRoomCharactor.prototype.renderFriendBubble = function(identity,imgUrl,intro, lparam, pparam, callback) {

        var self = this;

        if(imgUrl) {
            //G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getSocialFriend(this.param)
            var mesh = this.getMeshPart(PARTS_HAIR);
            var frame = false, color = 0;

            if(identity == 1) {
                frame = true;
                color = 'yellow';
            } else if(identity == 2) {
                frame = true;
                color = 'red';
            }

            // 추천친구 아바타 위의 ui는 해상도보정의 영향을 받지 않는다.
            GUI.ignoreResolutionCorrectionStart();
            {
                if(this.thumb) {
                    G.guiMain.removeControl(this.thumb);
                    this.thumb.dispose();
                }

                this.thumb = GUI.createContainer();
                this.thumb.width = px(80);
                this.thumb.height = px(300);

                var icon = GUI.CreateCircleButton("thumb", px(0), px(10), px(65), px(65), imgUrl, GUI.ALIGN_CENTER, GUI.ALIGN_TOP, frame, color);
                this.thumb.addControl( icon );
                G.guiMain.addControl(this.thumb, GUI.LAYER.BACKGROUND);
                this.thumb.linkWithMesh(mesh);

                var button = icon.getChildByName("thumb");
                if ( frame )
                {
                    button = icon.getChildByName("inner").getChildByName("thumb");
                }
                button.onPointerUpObservable.add(function() {
                    // if(self.callback) self.callback(self.parent, self.param);
                    if(callback) callback(lparam, pparam);
                });

                // var randomText = ["제가 LA에 있었을때는 붕어빵이 너무 먹고 싶었습니다 그래서 김치붕어빵을 먹고 으악 배아펑",
                //                     "Hello!",
                //                     "Merry christmas De Santa never give gift who crying baby",
                //                     "김치붕어빵은 끔찍한 혼종이다",
                //                     "પ નુલુંગ લસશ",
                //                     "繁白道理 在美李習尼多"];

                var textballoon = GUI.createRandomTextBalloon( mesh, intro);//randomText[CommFunc.random( randomText.length)] );
                if ( undefined != textballoon )
                    GUI.addLevelOfAlphaUI( textballoon );


                //GUI.addLevelOfAlphaUI( icon.getChildByName("thumb"), icon );
            }
            GUI.ignoreResolutionCorrectionEnd();



            // // 추천친구 아바타 위의 ui는 해상도보정의 영향을 받지 않는다.
            // GUI.ignoreResolutionCorrectionStart();
            // {
            //     var thumb = GUI.CreateCircleButton("thumb", px(0), px(0), px(40), px(40), imgUrl, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE, frame, color);
            //     G.guiMain.addControl(thumb);
            //     thumb.linkWithMesh(mesh);
            //     thumb.linkOffsetY = -60; 
            //     var button = thumb.getChildByName("thumb");
            //     if ( frame )
            //     {
            //         button = thumb.getChildByName("inner").getChildByName("thumb");
            //     }
            //     button.onPointerUpObservable.add(function() {
            //         // if(self.callback) self.callback(self.parent, self.param);
            //         if(callback) callback(lparam, pparam);
            //     });

            //     // var randomText = ["제가 LA에 있었을때는 붕어빵이 너무 먹고 싶었습니다 그래서 김치붕어빵을 먹고 으악 배아펑",
            //     //                     "Hello!",
            //     //                     "Merry christmas De Santa never give gift who crying baby",
            //     //                     "김치붕어빵은 끔찍한 혼종이다",
            //     //                     "પ નુલુંગ લસશ",
            //     //                     "繁白道理 在美李習尼多"];

            //     var textballoon = GUI.createRandomTextBalloon( mesh, intro);//randomText[CommFunc.random( randomText.length)] );
            //     if ( undefined != textballoon )
            //         GUI.addLevelOfAlphaUI( textballoon );


            //     GUI.addLevelOfAlphaUI( thumb.getChildByName("thumb"), thumb );
            // }
            // GUI.ignoreResolutionCorrectionEnd();

        }

    }

    return FRoomCharactor;

}());





var FAnimationObservable = (function () {

    function FAnimationObservable() {
        this.animEvent = [];

        this.currentAnim = null;
        this.currentState = null;
        this.preCurrentFrame = -1;
    }


    FAnimationObservable.prototype.addAnimEvent = function(This, state, frame, callback) {

        var e = {
            'state'     : state,
            'self'      : This,
            'frame'     : frame,
            'callback'  : callback
        };

        this.animEvent.push(e);
    }

    FAnimationObservable.prototype.setCurrentAnimation = function(currentAnim, state) {
        this.currentAnim = currentAnim;
        this.currentState = state;
    }

    FAnimationObservable.prototype.removeAnimEvent = function() {
        CommFunc.arrayRemoveAll(this.animEvent);
    }

    FAnimationObservable.prototype.destroy = function() {
        this.removeAnimEvent();
        this.animEvent = null;
    }

    FAnimationObservable.prototype.run = function() {
        
        if(this.animEvent.length == 0) return;

        var currentFrame = Math.floor(this.currentAnim.getAnimations()[0].currentFrame);

        if(this.preCurrentFrame == currentFrame) return;
        this.preCurrentFrame = currentFrame;
        for(var i=0; i<this.animEvent.length; i++) {

            if((currentFrame == this.animEvent[i].frame) && (this.currentState == this.animEvent[i].state)) {
                   if(this.animEvent[i].callback) this.animEvent[i].callback(this.animEvent[i].self, this.animEvent[i].state, this.animEvent[i].frame);
            }
        }
    }


    return FAnimationObservable;

}());




var FCatFood = (function () {

    __inherit(FCatFood,FGameObject);

    function FCatFood() {

    }

    FCatFood.prototype.create = function(position, quaternion) {
        this.init();
        this.setName("catFood");

        var self = this;
        Loader.Mesh("Assets/60_gameobject/", "pet_bowl.babylon", "pet_bowl", this,  null, function (newMeshes, particleSystems, skeletons, key, This) {
    
            // newMeshes[0].scaling = new Vector3(5, 5, 5);
            self.setMesh(newMeshes);
            self.setVisible(true);
            // self.setPosition(position);
            // var pos = new Vector3(0, 100, 0);
            self.setPosition(self.adjustPosition(position));
            self.setRotationQuaternion(quaternion);

            G.scene.beginAnimation(newMeshes[1], 0, 180, false, 1, function () {
            // 	console.log("animation end");
                self.destroy();
            });
            
            
        });
    }


    FCatFood.prototype.init = function() {
        FGameObject.prototype.init.call(this);
    }

    FCatFood.prototype.destroy = function() {

        FGameObject.prototype.destroy.call(this);
    }

    FCatFood.prototype.adjustPosition = function(position) {

        if(position == null) {
            alert("adjustPosition postion is null");
        }

        var index = FMapManager.getInstance().getWorldToIndex(position.x, position.z);
        var layer = FMapManager.getInstance().getTileLayer(index);

        return new Vector3(position.x, layer+0.1, position.z);
    }


    return FCatFood;

}());

    



