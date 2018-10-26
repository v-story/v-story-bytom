'use strict';
// var dictObject = {}
// dictObject['banana'] = '바나나';
// delete dictObject['elephant']; // 삭제 (제대로 삭제 되면 true, 아니면 false)

// Dictionary 출력 
// for (var key in dictObject) { console.log("key : " + key +", value : " + dictObject[key]); }

// 모든 key를 가져오는 방법 
// Object.keys(dictObject); // ["banana", "hong", "monkey"]

// Dictionary 길이 구하는 방법 
// Object.keys(dictObject).length; // 3

// key를 체크하는 방법 
// "moneky" in dictObject // true 
// "elephant" in dictObject // false

// key의 마지막 값 가져오는 방법 
// var lastKey = Object.keys(dictObject)[Object.keys(dictObject).length - 1]

var sInstanceMesh = function() {
    var meshParent = null;
    var meshInstance = null;
};


// var sGroupMesh = function() {
//     var meshParent = [];
//     var meshInstance = null;
// }

// var nameOfWall      = "WallMesh";
// var nameOfFloor     = "FloorMesh";
var nameOfFloorRed  = "prop_Flo_red";
var nameOfFloorBlue = "prop_Flo_Blue";
// var nameOfWallExt   = "WallMeshExt";

var AVATAR_UPPER    = ["","850000","800000"];
var AVATAR_LOWER    = ["","851000","801000"];
var AVATAR_HAIR     = ["","852000","802000"];
var AVATAR_HEAD     = ["","853000","803000"];
var AVATAR_CAP      = ["","854000","804000"];
var AVATAR_ACC      = ["","855000","805000"];
var AVATAR_EYEBROW  = ["","856000","806000"];
var AVATAR_EYE      = ["","857000","807000"];
var AVATAR_MOUSE    = ["","858000","808000"];

var AVATAR_BODY     = ["","boy_body","girl_body"];

var PARTS_NAME = ["",["body",850000,851000,852000,853000,854000,855000,856000,857000,858000,859000],["body",800000,801000,802000,803000,804000,805000,806000,807000,808000,809000]];
var PARTS_BODY     = 0;
var PARTS_UPPER    = 1;
var PARTS_LOWER    = 2;
var PARTS_HAIR     = 3;
var PARTS_HEAD     = 4;
var PARTS_CAP      = 5;
var PARTS_ACC      = 6;
var PARTS_EYEBROW  = 7;
var PARTS_EYE      = 8;
var PARTS_MOUSE    = 9;
var PARTS_END      = 10;

var FResourceManager = (function () {

    function FResourceManager() {

        this.MESH = {};

        //로딩이 완료되었다면 여기에 키로 저장된다.
        this.dicLoadedMap = {};
        this.dicLoadingMap = {};

        this.avatarLoaded = {};
        
        this.meshBodyArray      = {};
        this.meshUpperArray     = {};
        this.meshLowerArray     = {};
        this.meshHairArray      = {};
        this.meshHeadArray      = {};
        this.meshCapArray       = {};
        this.meshAccArray       = {};
        this.meshEyebrowArray   = {};
        this.meshMouseArray     = {};
        this.meshEyeArray       = {};

        if(CommFunc.isIPhone())
            this.fullLoading = true;
        else 
            this.fullLoading = false;
    }
 

    FResourceManager.prototype.isFullLoad = function() {
        return this.fullLoading;
    }

    FResourceManager.prototype.destroy = function() {

        G.scene.dispose();
    }

    

    FResourceManager.prototype.addMesh = function(nameParent, mesh) {

        if(this.MESH[nameParent] != null) return;

        var m = new sInstanceMesh();
        m.meshParent = mesh;
        m.meshInstance = new Array();

        this.MESH[nameParent] = m;
    }

    FResourceManager.prototype.getBoundingBox = function(mesh) {
        var vectorsWorld = mesh.getBoundingInfo().boundingBox.vectorsWorld; 
        var boundingbox = new Vector3(vectorsWorld[1].x - vectorsWorld[0].x, vectorsWorld[1].y - vectorsWorld[0].y, vectorsWorld[1].z - vectorsWorld[0].z);
        return boundingbox;
    }


    //이미 로딩되어있을 때 호출해야 한다.
    FResourceManager.prototype.getMesh = function(nameParent, nameClone) {
        
        var parentMesh = this.MESH[nameParent];

        if(parentMesh == null) {
            Debug.Error('FResourceManager.prototype.getMesh Error : ' + nameParent);
            return null;
        } 

        var len = parentMesh.meshInstance.length;
        for(var i=0; i<len; i++) {
            if(parentMesh.meshInstance[i].name == nameClone) return parentMesh.meshInstance[i];
        }
        for(var i=0; i<len; i++) {
            if(parentMesh.meshInstance[i].name == "none") {
                parentMesh.meshInstance[i].name = nameClone;
                return parentMesh.meshInstance[i];
            } 
        }

        var mesh = parentMesh.meshParent.createInstance(nameClone);
        // mesh.receiveShadows = true;
        parentMesh.meshInstance.push(mesh);
        return mesh;
    }

    FResourceManager.prototype.clearMesh = function(nameParent, nameClone) {
        
        var parentMesh = this.MESH[nameParent];

        if(parentMesh == null) return null;

        var len = parentMesh.meshInstance.length;
        for(var i=0; i<len; i++) {
            if(parentMesh.meshInstance[i].name == nameClone || nameClone == null) {
                parentMesh.meshInstance[i].name = 'none';
                parentMesh.meshInstance[i].rotation = new Vector3(0,0,0);
                parentMesh.meshInstance[i].rotationQuaternion = null;
                parentMesh.meshInstance[i].isVisible = false;
                if(nameClone != null) return;
            }
        }
    }

    FResourceManager.prototype.disposeMesh = function(nameParent, nameClone) {

        var parentMesh = this.MESH[nameParent];

        if(parentMesh == null) return null;

        var len = parentMesh.meshInstance.length;
        for(var i=0; i<len; i++) {
            if(parentMesh.meshInstance[i].name == nameClone || nameClone == null) {
                parentMesh.meshInstance[i].dispose();
            }
        }

        parentMesh.meshParent.dispose();
        delete this.MESH[nameParent];

        var url = this.getResourceUrl(nameParent);
        var key = url.folder + url.file;
        delete this.dicLoadedMap[key];
        delete this.dicLoadingMap[key];
    }

    FResourceManager.prototype.clearAllMesh = function() {
        
        var count = 0;
        var length = Object.keys(this.MESH).length;

        for(var i=0; i<length; i++) {

            var key = (Object.keys(this.MESH))[i];
            var parentMesh = this.MESH[key];

            for(var j=0; j<parentMesh.meshInstance.length; j++) {
                parentMesh.meshInstance[j].name = 'none';
                parentMesh.meshInstance[j].isVisible = false;
                count++;
            }
        }

        Debug.Log('clearAllMesh Count = ' + count);
    }

    //objID에 따라서 로딩해야할 리소스를 결정한다.
    FResourceManager.prototype.getResourceUrl = function(objID) {

        var startObjIndex = 110000;
        var endObjIndex = 400000;

        if( startObjIndex <= objID && objID < endObjIndex) { 
    
            return { 'folder' : 'Assets/03_object/', 'file' : objID.toString() + '.babylon' }
        }
        else if(objID == nameOfFloorRed || objID == nameOfFloorBlue) {
            return { 'folder' : 'Assets/27_floor/', 'file' : '27_floor.babylon' }
        }
        //캐릭터
        else if(objID == 'girl_animation') {
            return { 'folder' : 'Assets/51_female/', 'file' : 'girl_animation.babylon' }
        } else if(objID == 'boy_animation') {
            return { 'folder' : 'Assets/50_male/', 'file' : 'boy_animation.babylon' }
        } else if(OBJ_MALE<=objID && objID<OBJ_MAX_HUNMAN) {
            if(objID < OBJ_FEMALE) {
                var file = objID.toString()+'.babylon';
                return { 'folder' : 'Assets/50_male/', 'file' : file };
            } else if(objID < OBJ_ANDROID) {
                var file = objID.toString()+'.babylon';
                return { 'folder' : 'Assets/51_female/', 'file' : file };
            } else if(objID < OBJ_CAR) {
                return { 'folder' : 'Assets/52_robo/', 'file' : '520000.babylon' };
            } else if(objID < OBJ_CAT) {
                return { 'folder' : 'Assets/53_car/', 'file' : objID+".babylon" };
            } else if(objID < 550000) {
                return { 'folder' : 'Assets/54_pet/', 'file' : '540000.babylon' };
            }
        }
        // else if("510000_b" == objID) {
        //     return { 'folder' : 'Assets/51_female/', 'file' : '510000_b.babylon' };
        // }
        // else if("510000_f" == objID) {
        //     return { 'folder' : 'Assets/51_female/', 'file' : '510000_f.babylon' };
        // }
        // else if("510000_h" == objID) {
        //     return { 'folder' : 'Assets/51_female/', 'file' : '510000_h.babylon' };
        // }                
        else if("giftbox" == objID) {
            return { 'folder' : 'Assets/49_giftbox/', 'file' : 'giftbox.babylon' }
        } 
        else if(objID.toString().indexOf("home_ground") != -1) {
            return { 'folder' : 'Assets/00_ground/' , 'file' : objID+".babylon" };
        }
        else if(100000 <= objID && objID < 104000) {
            return { 'folder' : 'Assets/04_objectroom/' , 'file' : objID+".babylon" };
        } 
        else if(104000 <= objID && objID <105000) {
            return { 'folder' : 'Assets/06_brand/' , 'file' : objID+".babylon" };
        }
        else if(90000 == objID) {
            return { 'folder' : 'Assets/05_spotsea/' , 'file' : objID+".babylon" };
        }
        else if( "spot_beach" == objID) {
            return { 'folder' : 'Assets/05_spotsea/', 'file' : 'spot_beach.babylon' }
        } else {
            Debug.Alert('리소스가 없음 : objID = ' + objID);
        }

        return null;
    }


    FResourceManager.prototype.createMesh = function(nameParent, nameClone, lparam, pparam, callback) {
        
        var parentMesh = this.MESH[nameParent];

        if(parentMesh == null) {
            Debug.Error('FResourceManager.prototype.getMesh Error');
            if(callback) callback(null);
            return;
        } 

        var len = parentMesh.meshInstance.length;
        //기존에 있다.
        for(var i=0; i<len; i++) {
            if(parentMesh.meshInstance[i].name == nameClone) {
                if(callback) {
                    callback(parentMesh.meshInstance[i], lparam, pparam);
                }
                return;
            }
        }
        //비어 있는 것을 해당 메쉬로 만들어서 보낸다.
        for(var i=0; i<len; i++) {
            if(parentMesh.meshInstance[i].name == "none") {
                parentMesh.meshInstance[i].name = nameClone;
                if(callback) {
                     callback(parentMesh.meshInstance[i], lparam, pparam);
                }
                return;
            } 
        }
        //새로 만들어서 보낸다.
        var mesh = parentMesh.meshParent.createInstance(nameClone);
        // mesh.receiveShadows = true;
        parentMesh.meshInstance.push(mesh);
        if(callback) callback(mesh, lparam, pparam);
    }

    FResourceManager.prototype.updateLoadingMap = function(key, nameParent, nameClone, lparam, pparam, callback) {
        
        var obj = {
            'nameParent': nameParent,
            'nameClone' : nameClone,
            'callback'  : callback,
            'lparam'    : lparam,
            'pparam'    : pparam
        }

        if(this.dicLoadingMap[key] != null) {

            var array  = this.dicLoadingMap[key];
            array.push(obj);
            // Object.values(this.dicLoadingMap[nameParent]).push(obj);

        } else {

            var children = new Array();

            children.push(obj);
            this.dicLoadingMap[key] = children;
        }
    }


    //하나의 babylon파일안에 여러개의 메쉬가 있지만
    //그 메쉬들은 각각의 메쉬로 취급된다.
    FResourceManager.prototype.getLoadMesh = function(nameParent, nameClone, lparam, pparam, callback) {
        
        var self = this;
        var parentMesh = self.MESH[nameParent];

        if(parentMesh == null) {

            var callLoad = true;
            var url = self.getResourceUrl(nameParent);
            var key = url.folder + url.file;

            //로딩중일때라면 다시 Loader.Mesh를 호출하지 않고
            if(self.dicLoadingMap[key] != null) {
                callLoad = false;
            }

            //로딩중일때 로딩후에 가야할 콜백을 등록한다.
            self.updateLoadingMap(key, nameParent, nameClone, lparam, pparam, callback);

            if(callLoad) {
                Loader.Mesh(url.folder, url.file, key, 0,  null, function (newMeshes, particleSystems, skeletons, key, param) {
                    
                    for(var i=0; i<newMeshes.length; i++){
                        var mesh = newMeshes[i];
                        // mesh.position = new Vector3(0,0,0);
                        // mesh.rotation = new Vector3(0,0,0);
                        mesh.isVisible = false;
                        self.addMesh(mesh.name, mesh);
                    }

                    self.dicLoadedMap[key] = true;
                    
                    if(self.dicLoadingMap[key] != null) {
                
                        var array  = self.dicLoadingMap[key];
    
                        array.forEach(function(data){
                            self.createMesh(data.nameParent, data.nameClone, data.lparam, data.pparam, data.callback);
                        });
    
                        //object 지우기
                        // delete self.dicLoadingMap[key];
                    }
                });
            }

            return;
        } 

        self.createMesh(nameParent, nameClone, lparam, pparam, callback);
    }

    FResourceManager.prototype.getLoadGroupMesh = function(nameParent, lparam, pparam, callback) {
            
        var url = this.getResourceUrl(nameParent);

        Loader.Mesh(url.folder, url.file, lparam, pparam, null, function (newMeshes, particleSystems, skeletons, lparam, pparam) {
            
            for(var i=0; i<newMeshes.length; i++){

                // newMeshes[i].position = new Vector3(0,0,0);
                // newMeshes[i].rotation = new Vector3(0,0,0);
                newMeshes[i].isVisible = false;
            }
            
            if(callback) callback(newMeshes, particleSystems, skeletons, lparam, pparam);
        });
    }

    //<------------------------------------------------------------------------------------------------------------

    FResourceManager.prototype.makeAvatarCode = function(avatarInfo) {

       var convertNumberTwoString = function( in_number )
       {
           var resultStr = "";
           
           if(in_number<10)
               resultStr+="0";
           resultStr+=in_number.toString();
   
           return resultStr;
       }
       var newAvatarInfoStr = "";
    
       newAvatarInfoStr += /*"01";*/convertNumberTwoString( avatarInfo['gender'] );
       newAvatarInfoStr += convertNumberTwoString( avatarInfo['upper'] );
       newAvatarInfoStr += convertNumberTwoString( avatarInfo['lower'] );
       newAvatarInfoStr += convertNumberTwoString( avatarInfo['hair'] );
       newAvatarInfoStr += convertNumberTwoString( avatarInfo['head'] );
       newAvatarInfoStr += convertNumberTwoString( avatarInfo['cap'] );
       newAvatarInfoStr += convertNumberTwoString( avatarInfo['acc'] );
       newAvatarInfoStr += convertNumberTwoString( avatarInfo['eyebrow'] );
       newAvatarInfoStr += convertNumberTwoString( avatarInfo['eye'] );
       newAvatarInfoStr += convertNumberTwoString( avatarInfo['mouse'] );

       return newAvatarInfoStr;
    }

    FResourceManager.prototype.getAvatarCode = function(avatarCode) {

       if(avatarCode == 0) {
            return { 'gender' : G.dataManager.getUsrMgr(0).gender,
                    'upper'  : 1,
                    'lower'  : 1,
                    'hair'   : 1,
                    'head'   : 1,
                    'cap'    : 1,
                    'acc'    : 1,
                    'eyebrow': 1,
                    'eye'    : 1,
                    'mouse'  : 1
            };
        }

        var partsParseOrder = 
        [
            ["gender", null],
            ["upper", null],
            ["lower", null],
            ["hair", null],
            ["head", null],
            ["cap", null],
            ["acc", null],
            ["eyebrow", null],
            ["eye", null],
            ["mouse", null],
        ];

        for ( var i = 0; i < partsParseOrder.length; ++i )
        {
            partsParseOrder[i][1] = 1;//parseInt( avatarCode.substr(i*2, 2) );
        }

        return { 'gender' : partsParseOrder[0][1],
                 'upper'  : partsParseOrder[1][1],
                 'lower'  : partsParseOrder[2][1],
                 'hair'   : partsParseOrder[3][1],
                 'head'   : partsParseOrder[4][1],
                 'cap'    : partsParseOrder[5][1],
                 'acc'    : 0,//partsParseOrder[6][1],
                 'eyebrow': partsParseOrder[7][1],
                 'eye'    : partsParseOrder[8][1],
                 'mouse'  : partsParseOrder[9][1]
        };
    }

    //<-----------------------------------------------------------------------------------------------------------
    //<-----------------------------------------------------------------------------------------------------------
    //<-----------------------------------------------------------------------------------------------------------
    //<-----------------------------------------------------------------------------------------------------------
    //<-----------------------------------------------------------------------------------------------------------
    //<-----------------------------------------------------------------------------------------------------------
    //<-----------------------------------------------------------------------------------------------------------
    FResourceManager.prototype.loadBaseAvatar = function(This, callback) {

        if(this.isFullLoad()) {
            if(callback) callback(This);
            return;
        }

        G.resManager._loadAvatar('girl_animation', this, function(self){

            G.resManager._loadAvatar('boy_animation', self, function(self){

                if(callback) callback(This);
            });
            
        });

    }

    FResourceManager.prototype.makeCloneMeshes = function(meshes) {

        if(meshes == null) {
            alert('mesh is null');
            return null;
        }

        var newMeshes = new Array();
        if(Array.isArray(meshes)) {
            newMeshes = meshes;
        } else {
            newMeshes.push(meshes);
        }

        for(var i=0; i<newMeshes.length; i++) {
            var newCloneMeshes = [];
            var clone = this.cloneAvatar(newMeshes[i]);
    
            if(clone == null) {
                alert('clone mesh is null');
                return null;
            }
            newCloneMeshes.push(clone);
        }
        
        return newCloneMeshes;
    }

    FResourceManager.prototype.loadPartsAvatar = function(location, file, key, gender, param, callback) {
        
        var self = this;

        // var arrayKey = file.replace('.babylon', '');
        var meshes = this._getMeshArray(gender,key);

        if(meshes != null) {

            var newCloneMeshes = this.makeCloneMeshes(meshes);

            if(callback) callback(param, newCloneMeshes, key);
            return;
        }

        Loader.Mesh(location, file, key, param,  null, function (newMeshes, particleSystems, skeletons, key, This) {
            
            self._setAvatarMeshArray(gender,newMeshes);

            var meshes = self._getMeshArray(gender,key);

            if(meshes == null) {

                alert('_getMeshArray meshes is null');
                return;
            }

            var newCloneMeshes = self.makeCloneMeshes(meshes);
            if(callback) callback(This, newCloneMeshes, key);
        });
    }



    FResourceManager.prototype._loadAvatar = function(objID, This, callback) {

        var name = objID.toString();
        var gender = -1;

        if(name == 'girl_animation') gender = 2;
        else if(name == 'boy_animation') gender = 1;

        if(this.avatarLoaded[name]) {
            if(callback) callback(This);
            return;
        }
        this.avatarLoaded[name] = true;
        Debug.Error('Total Mesh loaded');
        this.getLoadGroupMesh(objID, this, This, function(newMeshes, particleSystems, skeletons, self, pparam){

            self._setAvatarMeshArray(gender,newMeshes);

            if(callback) callback(pparam);
        });
    }

    FResourceManager.prototype._loadSingleAvatar = function(objID, This, callback) {

        var name = objID.toString();

        this.getLoadGroupMesh(objID, this, This, function(newMeshes, particleSystems, skeletons, self, pparam){
            if(callback) callback(newMeshes, pparam);
        });
    }

    FResourceManager.prototype._setAvatarMeshArray = function(gender,newMeshes) {

        for(var i=0; i<newMeshes.length; i++) {
            var mesh = newMeshes[i];
            // mesh.computeBonesUsingShaders = false; //Falling back to CPU skinning for body_body_down_2
            // G.scene.stopAnimation(mesh);
            mesh.isVisible = false;
            // mesh.position = new Vector3(0,-1000,0);
            mesh.position = new Vector3(0,300,0);
            mesh.isPickable = true;

            if(mesh.name.includes(PARTS_NAME[gender][PARTS_BODY])) {
                this.meshBodyArray[mesh.name] = mesh;
            } else {

                var name = Number(mesh.name);

                if(PARTS_NAME[gender][PARTS_UPPER] <= name && name < PARTS_NAME[gender][PARTS_LOWER]) {
                    this.meshUpperArray[mesh.name] = mesh;
                } else if(PARTS_NAME[gender][PARTS_LOWER] <= name && name < PARTS_NAME[gender][PARTS_HAIR]) {
                    this.meshLowerArray[mesh.name] = mesh;
                } else if(PARTS_NAME[gender][PARTS_HAIR] <= name && name < PARTS_NAME[gender][PARTS_HEAD]) {
                    this.meshHairArray[mesh.name] = mesh;
                } else if(PARTS_NAME[gender][PARTS_HEAD] <= name && name < PARTS_NAME[gender][PARTS_CAP]) {
                    this.meshHeadArray[mesh.name] = mesh;
                } else if(PARTS_NAME[gender][PARTS_CAP] <= name && name < PARTS_NAME[gender][PARTS_ACC]) {
                    this.meshCapArray[mesh.name] = mesh;
                } else if(PARTS_NAME[gender][PARTS_ACC] <= name && name < PARTS_NAME[gender][PARTS_EYEBROW]) {
                    this.meshAccArray[mesh.name] = mesh;
                } else if(PARTS_NAME[gender][PARTS_EYEBROW] <= name && name < PARTS_NAME[gender][PARTS_EYE]) {
                    this.meshEyebrowArray[mesh.name] = mesh;
                } else if(PARTS_NAME[gender][PARTS_EYE] <= name && name < PARTS_NAME[gender][PARTS_MOUSE]) {
                    this.meshEyeArray[mesh.name] = mesh;
                } else if(PARTS_NAME[gender][PARTS_MOUSE] <= name && name < PARTS_NAME[gender][PARTS_END]) {
                    this.meshMouseArray[mesh.name] = mesh;
                }
            } 
        }
    }

    FResourceManager.prototype.getParts = function(gender,name) {
        if(PARTS_NAME[gender][PARTS_UPPER] <= name && name < PARTS_NAME[gender][PARTS_LOWER]) {
            return PARTS_UPPER;
        } else if(PARTS_NAME[gender][PARTS_LOWER] <= name && name < PARTS_NAME[gender][PARTS_HAIR]) {
            return PARTS_LOWER;
        } else if(PARTS_NAME[gender][PARTS_HAIR] <= name && name < PARTS_NAME[gender][PARTS_HEAD]) {
            return PARTS_HAIR;
        } else if(PARTS_NAME[gender][PARTS_HEAD] <= name && name < PARTS_NAME[gender][PARTS_CAP]) {
            return PARTS_HEAD;
        } else if(PARTS_NAME[gender][PARTS_CAP] <= name && name < PARTS_NAME[gender][PARTS_ACC]) {
            return PARTS_CAP;
        } else if(PARTS_NAME[gender][PARTS_ACC] <= name && name < PARTS_NAME[gender][PARTS_EYEBROW]) {
            return PARTS_ACC;
        } else if(PARTS_NAME[gender][PARTS_EYEBROW] <= name && name < PARTS_NAME[gender][PARTS_EYE]) {
            return PARTS_EYEBROW;
        } else if(PARTS_NAME[gender][PARTS_EYE] <= name && name < PARTS_NAME[gender][PARTS_MOUSE]) {
            return PARTS_EYE;
        } else if(PARTS_NAME[gender][PARTS_MOUSE] <= name && name < PARTS_NAME[gender][PARTS_END]) {
            return PARTS_MOUSE;
        }

        return null;
    }

    FResourceManager.prototype._getMeshArray = function(gender,name) {

        if(PARTS_NAME[gender][PARTS_UPPER] <= name && name < PARTS_NAME[gender][PARTS_LOWER]) {
            return this.meshUpperArray[name];
        } else if(PARTS_NAME[gender][PARTS_LOWER] <= name && name < PARTS_NAME[gender][PARTS_HAIR]) {
            return this.meshLowerArray[name];
        } else if(PARTS_NAME[gender][PARTS_HAIR] <= name && name < PARTS_NAME[gender][PARTS_HEAD]) {
            return this.meshHairArray[name];
        } else if(PARTS_NAME[gender][PARTS_HEAD] <= name && name < PARTS_NAME[gender][PARTS_CAP]) {
            return this.meshHeadArray[name];
        } else if(PARTS_NAME[gender][PARTS_CAP] <= name && name < PARTS_NAME[gender][PARTS_ACC]) {
            return this.meshCapArray[name];
        } else if(PARTS_NAME[gender][PARTS_ACC] <= name && name < PARTS_NAME[gender][PARTS_EYEBROW]) {
            return this.meshAccArray[name];
        } else if(PARTS_NAME[gender][PARTS_EYEBROW] <= name && name < PARTS_NAME[gender][PARTS_EYE]) {
            return this.meshEyebrowArray[name];
        } else if(PARTS_NAME[gender][PARTS_EYE] <= name && name < PARTS_NAME[gender][PARTS_MOUSE]) {
            return this.meshEyeArray[name];
        } else if(PARTS_NAME[gender][PARTS_MOUSE] <= name && name < PARTS_NAME[gender][PARTS_END]) {
            return this.meshMouseArray[name];
        }

        return null;
    }


    FResourceManager.prototype.cloneAvatar = function(mesh) {

        if(!mesh) return null;

        // G.scene.stopAnimation(mesh);
        // CommFunc.arrayRemoveAll(mesh.skeleton._animatables);

        var newMesh = mesh.clone(mesh.name, null, false);

        newMesh.position = new Vector3(0,0,0);
        newMesh.rotation = new Vector3(0,0,0);
        newMesh.rotationQuaternion = null;
        newMesh.skeleton = mesh.skeleton.clone();
        newMesh.skeleton.id = "clone " + mesh.skeleton.id;
        newMesh.skeleton.name = "clone " + mesh.skeleton.name;
        newMesh.skeleton._animatables = [];//mesh.skeleton._animatables.slice();

        // newMesh.computeBonesUsingShaders = false;
        G.scene.stopAnimation(newMesh);

        return newMesh;
    }

    FResourceManager.prototype.getAvatarMesh = function(avatarInfo) {

        /*
        var info = {
            'gender' : 0,
            'upper'  : 0,
            'lower'  : 0,
            'hair'   : 0,
            'head'   : 0,
            'eyebrow': 0,
            'cap'    : 0,
            'acc'    : 0
        }
        */

        var mesh = [];

        var gender = avatarInfo.gender;

        var keyBody    = AVATAR_BODY[gender];
        var keyUpper   = Number(AVATAR_UPPER[gender]) + avatarInfo.upper - 1;
        var keyLower   = Number(AVATAR_LOWER[gender]) + avatarInfo.lower - 1;
        var keyHair    = Number(AVATAR_HAIR[gender]) + avatarInfo.hair - 1;
        var keyHead    = Number(AVATAR_HEAD[gender]) + avatarInfo.head - 1;
        var keyCap     = Number(AVATAR_CAP[gender]) + avatarInfo.cap - 1;
        var keyAcc     = Number(AVATAR_ACC[gender]) + avatarInfo.acc - 1;
        var keyEyebrow = Number(AVATAR_EYEBROW[gender]) + avatarInfo.eyebrow - 1;
        var keyEye     = Number(AVATAR_EYE[gender]) + avatarInfo.eye - 1;
        var keyMouse   = Number(AVATAR_MOUSE[gender]) + avatarInfo.mouse - 1;


        var body     = this.cloneAvatar(this.meshBodyArray[keyBody]); 
        var upper    = this.cloneAvatar(this.meshUpperArray[keyUpper]);
        var lower    = this.cloneAvatar(this.meshLowerArray[keyLower]);
        var hair     = this.cloneAvatar(this.meshHairArray[keyHair]);
        var head     = this.cloneAvatar(this.meshHeadArray[keyHead]);
        var acc      = this.cloneAvatar(this.meshAccArray[keyAcc]);
        var cap      = this.cloneAvatar(this.meshCapArray[keyCap]);
        var eyebrow  = this.cloneAvatar(this.meshEyebrowArray[keyEyebrow]);
        var eye      = this.cloneAvatar(this.meshEyeArray[keyEye]);
        var mouse    = this.cloneAvatar(this.meshMouseArray[keyMouse]);

        if(body) mesh.push(body);

        if(upper) mesh.push(upper);

        if(lower) mesh.push(lower);

        if(hair) mesh.push(hair);

        if(head) mesh.push(head);

        if(cap) mesh.push(cap);

        if(acc) mesh.push(acc);

        if(eyebrow) mesh.push(eyebrow);

        if(eye) mesh.push(eye);

        if(mouse) mesh.push(mouse);

        return mesh;
    }


    /**
     * @description 파일을 특정 url 에 업로드하는 기능이라고 합니다. 저도 잘 모르는 상태에서 작성함. 문제있으면 고쳐주세요.
     * @param {*} in_url  // 올릴 url
     * @param {*} in_file  // 올릴 파일데이터
     * @param {*} in_param  // 필요한 param. {} 로 묶어서 전달
     */
    FResourceManager.prototype.createFormData = function( in_url, in_file, in_param )
    {
        var formData = new FormData();

        var formParam = 
        {
            url : in_url,
            param : in_param,
        }

        formData.append( "file", in_file );  // formData 에 파일데이터 추가
        formData.append( "param", JSON.stringify( formParam.param ) );

        fileUpload( formParam, formData ).then( function(rs)
        {
            return snsCommonFunc.msgProtocal(rs);            
        })
        .then( function(rs)
        {
            console.log( "커스텀 아바타 텍스쳐 등록 완료" );
        })
        .catch( function(err)
        {
            snsCommonFunc.alertMsg(err);
        });
    }

    FResourceManager.prototype.getCustomClothTexutureURL = function( in_pk, in_parts, in_mapping )
    {
        return CUSTOMTEXTURE_PATH+in_pk.toString() + "_898812221_" + in_parts.toString() + "_" + in_mapping.toString() + ".png";
    }

    /**
     * @description pk, 바꿀 파츠 를 넣으면 자동으로 커스텀용인지 체크한 뒤, 텍스쳐를 입혀주는 기능입니다. 나중엔 파츠별로 나눌 예정
     * @param {*} in_pk 
     * @param {*} in_parts 
     * @param {*} in_meshName 
     * @param {*} in_gender 
     */
    FResourceManager.prototype.checkAttachCustomClothTexture = function( in_pk, in_parts, in_mesh, in_gender )
    {
        var isCustomMesh = false;
        if ( in_gender == 1 )
        {
            switch( in_mesh.name )
            {
            case "850007" :
            case "851005" :
                isCustomMesh = true;
                break;
            }
        }
        else if ( in_gender == 2 )
        {
            switch( in_mesh.name )
            {
            case "800005" :
            case "801005" :
                isCustomMesh = true;
                break;
            }
        }

        if ( !isCustomMesh )
            return;

        // 일단 앞뒤 텍스쳐를 등록했는지 확인한다.
        var textureURL = this.getCustomClothTexutureURL( in_pk, in_parts, TEXTURE_CUSTOM_TYPE.BOTH );
        $.get( textureURL )
        .done(function() 
        { 
            console.log( in_pk.toString()+"이 업로드한 양쪽매핑 파일 발견. 입히겠습니다." );

            if ( in_mesh.material.subMaterials )
            {
                for ( var i = 0; i < in_mesh.material.subMaterials.length; ++i )
                {
                    FBabylon.changeMaterialTexture( in_mesh.material.subMaterials[i], textureURL );
                }
            }       
            else
                FBabylon.changeMaterialTexture( in_mesh.material, textureURL );

        }).fail(function() {
            console.log( in_pk.toString()+"가 업로드한 양쪽매핑 파일 없음" );

            // 앞뒤가 없다면 앞, 뒤 따로 텍스쳐를 가지고 온다.

            for ( var i = TEXTURE_CUSTOM_TYPE.FRONT; i <= TEXTURE_CUSTOM_TYPE.BACK; ++i )
            {
                var textureURL = this.getCustomClothTexutureURL( in_pk, in_parts, i );
                $.get( textureURL )
                .done(function() 
                { 
                    console.log( in_pk.toString()+"이 업로드한 단일매핑 파일 발견. 입히겠습니다." );
        
                    if ( in_mesh.material.subMaterials )
                    {
                        FBabylon.changeMaterialTexture( in_mesh.material.subMaterials[i], textureURL );
                    }       
                    else
                        FBabylon.changeMaterialTexture( in_mesh.material, textureURL );
                });
            }
        });
    }

    return FResourceManager;

}());


    