'use strict';

var TILE_TYPE = {};
TILE_TYPE.NORMAL    = 0;
TILE_TYPE.WALL      = 1;
TILE_TYPE.DOOR      = 2;
TILE_TYPE.ROAD      = 3;
TILE_TYPE.OBJECT    = 4;
TILE_TYPE.PORTAL    = 5;
TILE_TYPE.WATER     = 6;
TILE_TYPE.MAX       = 7;

var TILE_LAYER = {};
TILE_LAYER.UNDEF    = 0;
TILE_LAYER.FIRST    = 1;
TILE_LAYER.SECOND   = 2;
TILE_LAYER.THIRD    = 3;
TILE_LAYER.FORTH    = 4;
TILE_LAYER.FIFTH    = 5;

var TILELIST_TYPE = {};
TILELIST_TYPE.TILE_IDX   = 0;
TILELIST_TYPE.TILE_TYPE  = 1;
TILELIST_TYPE.TILE_LAYER = 2;
TILELIST_TYPE.TILE_DATA  = 3;


var ROOMTYPE_BEACH  = 90000;


var sWORLDINFO = (function() {
    
    function sWORLDINFO() {

        this.TILE_IDX   = -1; //이 인덱스를 기준으로 점유 타일이 결정된다. 이 인덱스로 가면 오브젝트가 있다.
        this.ROOM       = false;
        this.OBJECT     = false;
        this.WALL       = false;
        this.LAND       = true;
    }

    return sWORLDINFO;
}());


var NO_SEQ = 0;

var TILE_DIR_LEFT   = 1;
var TILE_DIR_TOP    = 2;
var TILE_DIR_RIGHT  = 4;
var TILE_DIR_BOTTOM = 8;

var TILE_DIR_DEL    = 16;

var TILE_POSSIBLE   = 33;
var TILE_IMPOSSIBLE = 44;

//월드맵에 대한 타일 속성 값
var TILE_NONE       = 0;
//var TILE_WALL_AREA  = 1;
// var TILE_OBJ_AREA   = 2;
// var TILE_ROOM_AREA  = 4;

var SUB_OBJID       = 5000;

var FMapManager = (function () {

    function FMapManager() {

        this.MapSequence = -1;

        this.TILE_SIZE      = 10;//좌표계로 2의 크기를 갖는다.
        this.tile_width     = null; //총 타일의 가로 갯수
        this.tile_height    = null; //총 타일의 세로 갯수

        this.start          = null;
        this.tile_len       = null;
        this.WorldMap       = null;

        this.initAvatarPos  = null;
        
        this.realStart      = null;
        this.realEnd        = null;

        this.loadCount      = null;
          
        //index. type, layer, data
        this.B_TILEDATA    = null;
        this.B_ROOMOBJ     = null;

        this.tileLayer0    = [];
        this.tileLayer1    = [];
    }

    FMapManager.prototype.createMapData = function(roomID, callback) {

        var self = this;
        
        this.B_TILEDATA    = null;
        this.B_ROOMOBJ     = null;

        this.loadData(roomID, function(){
            self.initialize();
            self.updateTileMap();

            if(callback) callback();
        });

    }

    FMapManager.prototype.getTileSize = function() {
        return this.TILE_SIZE;
    }

    FMapManager.prototype.initialize = function() {
        
        this.TILE_SIZE      = 10;
        this.tile_width     = this.B_ROOMOBJ.tileWidth;
        this.tile_height    = this.B_ROOMOBJ.tileHeight;

        // this.tile_width     = this.B_TILEDATA.tileCount[0];
        // this.tile_height    = this.B_TILEDATA.tileCount[1];

        this.initAvatarPos  = this.B_ROOMOBJ.startPos;

        this.realStart = this.B_ROOMOBJ.realStart;
        this.realEnd   = this.B_ROOMOBJ.realEnd;

        this.start = new Vector3(-(this.tile_width/2)*this.TILE_SIZE, 0, -(this.tile_height/2)*this.TILE_SIZE);
        this.tile_len = this.tile_width*this.tile_height;

        //맵 전체의 월드 정보 구조체
        this.WorldMap      = new Array(this.tile_width);
        for(var i=0; i<this.tile_width; i++) {
            this.WorldMap[i] = new Array(this.tile_height);
            for(var j=0; j<this.tile_height; j++) {
                this.WorldMap[i][j] = new sWORLDINFO();
            }
        }
    }

    FMapManager.prototype.destroy = function() {

        for(var i=0; i<this.tile_width; i++) {
            for(var j=0; j<this.tile_height; j++) {
                this.WorldMap[i][j] = null;
            }

            CommFunc.arrayRemoveAll(this.WorldMap[i]);
            this.WorldMap[i] = null;
        }

        CommFunc.arrayRemoveAll(this.WorldMap);
        this.WorldMap = null;

        this.B_TILEDATA    = null;
        this.B_ROOMOBJ     = null;

        CommFunc.arrayRemoveAll(this.tileLayer0);
        CommFunc.arrayRemoveAll(this.tileLayer1);
    }

    FMapManager.prototype.getAvatarStartPos = function() {
        return this.initAvatarPos;
    }

    FMapManager.prototype.getWorldMap = function() {
        return this.WorldMap;
    }

    // 타일 타입을 가져오는게 없길래 임시로 만들었습니다.
    FMapManager.prototype.getTileType = function(tileIdx)
    {
        if(tileIdx < 0 ) {
            alert('getTileType : tileIdx < 0');
            return;
        }
        if(this.B_TILEDATA.tileList[tileIdx][TILELIST_TYPE.TILE_IDX] != tileIdx) {
            alert("맵 데이타가 잘못됨");
            return;
        }


        return this.B_TILEDATA.tileList[tileIdx][TILELIST_TYPE.TILE_TYPE];
    }

    FMapManager.prototype.getTileLayer = function(tileIdx) {
        
        if(tileIdx < 0 ) {
            alert('getTileLayer : tileIdx < 0');
            return;
        }
        
        if(this.B_TILEDATA.tileList[tileIdx][TILELIST_TYPE.TILE_IDX] != tileIdx) {
            alert("맵 데이타가 잘못됨");
            return;
        }

        return this.B_TILEDATA.tileList[tileIdx][TILELIST_TYPE.TILE_LAYER];
    }

    FMapManager.prototype.getDestinationTileList = function(SRC_IDX, DST_IDX) {
        var currentLayer = this.getTileLayer(SRC_IDX);
        // var destination
    }

    FMapManager.prototype.getTileWidth = function() {
        return this.tile_width;
    }

    FMapManager.prototype.getTileHeight = function() {
        return this.tile_height;
    }

    
    //메쉬를 오브젝트맵 시퀀스로 찾는다.
    FMapManager.prototype.getMeshForSeq = function(obj_map_seq) {
        
        if(obj_map_seq <= 0) return;

        var len = this.ObjectMap.length;
        for(var i=0; i<len; i++) {

            if(this.ObjectMap[i].OBJ_MAP_SEQ == obj_map_seq) {

                return G.resManager.getMesh(this.ObjectMap[i].OBJ_ID, this.ObjectMap[i].MESH_NAME);
            }
        }
    }

    FMapManager.prototype.getNeighborTileIndex = function( in_myIndex, in_targetIndex, distance)
    {
        var myPos = 
        {
            x:in_myIndex%this.tile_width,
            y: parseInt( in_myIndex/this.tile_width )
        }

        var targetPos = 
        {
            x:in_targetIndex%this.tile_width,
            y: parseInt( in_targetIndex/this.tile_width )
        }

        var xConversion = myPos.x - targetPos.x;
        var yConversion = myPos.y - targetPos.y;

        if ( xConversion > yConversion )   
        {
            yConversion = yConversion/Math.abs(yConversion)*distance;
            xConversion = 0;
        }
        else
        {
            xConversion = xConversion/Math.abs(xConversion)*distance;
            yConversion = 0;
        }

        var result = in_targetIndex + xConversion + (yConversion*this.tile_width);
        return result;

        // 8방향 기준
        if ( xConversion != 0 )
            xConversion = xConversion/Math.abs(xConversion)*distance;
        
        if ( yConversion != 0 )
            yConversion = yConversion/Math.abs(yConversion)*distance;

        var result = in_targetIndex + xConversion + (yConversion*this.tile_width);
        return result;
    }

    FMapManager.prototype.loadData = function(roomID,callback) {
        
        var self = this;

        var url = 'Assets/98_data/' + roomID + '.zip';
        var map = roomID + '.map';
        var obj = roomID + '.obj';

        JSZipUtils.getBinaryContent(url, function(err, data) {
            if(err) {
                throw err; // or handle err
            }

            JSZip.loadAsync(data).then(function (dat) {

                self.loadCount = Object.keys(dat.files).length;

                dat.file(map).async("string").then(function (json) {
                    self.loadCount--;
                    self.B_TILEDATA = JSON.parse(json);
                    if(self.loadCount == 0) {
                        if(callback) callback();                    
                    }
    
                });

                dat.file(obj).async("string").then(function (json) {
                    self.loadCount--;
                    self.B_ROOMOBJ = JSON.parse(json);
                    if(self.loadCount == 0) {
                        if(callback) callback();                    
                    }
    
                });


            });
        });

    }

    FMapManager.prototype.getRoomObjMapData = function() {
        return this.B_ROOMOBJ;
    }

    FMapManager.prototype.checkTileIndexOverflow = function(index) {
        if(index < 0) return true;
        if(index >= this.tile_len) return true;

        return false;
    }

    FMapManager.prototype.applyObject = function(shopInstallType, callback, param) {

        this.callback = callback;
        this.param = param;

        if(0 != shopInstallType)
            this.wsSendAddObjectMap(this.EditingObject, shopInstallType);
        else
            this.wsSendModObjectMap(this.EditingObject, this.ObjBackup.TILE_IDX);
    }

    FMapManager.prototype.toInvenObj = function() {
        
        var index = this.EditingObject.TILE_IDX;
        this.wsSendDelObjectMap(this.EditingObject, this.ObjBackup.TILE_IDX);

        this.updateTileMap();
    }

    //오브젝트를 판매한다.
    FMapManager.prototype.saleObj = function() {

        this.wsSendSaleObjectMap(this.EditingObject, this.ObjBackup.TILE_IDX);
        this.updateTileMap();
    }

    FMapManager.prototype.wsSendSaleObjectMap = function(objMap, preIndex) {
        var json;

        json = protocol.saleObjectMap(objMap, preIndex);
        ws.onRequest(json, this.saleObjectMapCB, this);
    }

    FMapManager.prototype.saleObjectMapCB = function(res, self) {
        // 별로 할일이 없다.
    }


    //오브젝트를 인벤으로 보낸다.
    FMapManager.prototype.wsSendDelObjectMap = function(objMap, preIndex) {
        var json;

        json = protocol.delObjectMap(objMap, preIndex);
        ws.onRequest(json, this.delObjectMapCB, this);
    }

    FMapManager.prototype.delObjectMapCB = function(res, self) {
        // 별로 할일이 없다.
    }

    //오브젝트의 위치, 레이어, 방향을 수정한다.
    FMapManager.prototype.wsSendModObjectMap = function(objMap, preIndex) {
        var json;
        
        json = protocol.modObjectMap(objMap, preIndex);
        ws.onRequest(json, this.modObjectMapCB, this);
    }

    FMapManager.prototype.modObjectMapCB = function(res, self) {

        self.pushObjectMap(res.objMapSeq, res.tileIdx, res.cateId, res.objId, res.rotDir, res.layerIdx);
        self.clearEditingObject();

        self.updateTileMap();
        
        if(self.callback) self.callback(self.param);
    }

    //오브젝트를 생성한다.
    FMapManager.prototype.wsSendAddObjectMap = function(objMap, shopInstallType) {
        var json;
        
        json = protocol.addObjectMap(1, objMap, shopInstallType);
        ws.onRequest(json, this.addObjectMapCB, this);
    }


    FMapManager.prototype.addObjectMapCB = function(res, self) {

        var objRes = protocol.res_addObjectMap(res);
        var obj = self.findObjectMap(0/*objRes.OBJ_MAP_SEQ*/, objRes.TILE_IDX);

        if(obj != null) {
            obj.copy(objRes);
        } else {

            self.pushObjectMap(objRes.OBJ_MAP_SEQ, objRes.TILE_IDX, objRes.CATE_ID, objRes.OBJ_ID, objRes.ROT_DIR, objRes.LAYER_IDX);
        }

        // self.updateTileMap();

        if(self.callback) self.callback(self.param);
    }

    FMapManager.prototype.clearWallMapMesh = function(WALL) {

        if(WALL == null) return;
        if(WALL.WALL_PAPER_ID != TILE_NONE && WALL.FLOOR_ID != TILE_NONE) {

            for(var k = 0; k<WALL.WALLBASE_INFO.length; k++) {
    
                G.resManager.clearMesh(WALL.WALL_PAPER_ID,           WALL.WALL_INFO[k].mesh_name);
                G.resManager.clearMesh(WALL.WALL_PAPER_ID+SUB_OBJID, WALL.WALLBASE_INFO[k].mesh_name);
            }

            G.resManager.clearMesh(WALL.FLOOR_ID, WALL.MESH_FLOOR_NAME);
        }
    }

    //같은 타일에 벽정보가 있는지 확인
    FMapManager.prototype.checkWallMap = function(tile_index, bTempWall) {

        var WALL;
        
        if(!bTempWall) WALL = this.WallMap;
        else WALL = this.EditingWallMap;

        for(var i=0; i<WALL.length; i++) {
            if(WALL[i].TILE_IDX == tile_index) return WALL[i];
        }

        return null;
    }

    FMapManager.prototype.getComputedWallMapIndex = function(startIndex, endIndex) {
        
        var startI, endI;
        var arrIndex = [];

        var x1 = Math.floor(startIndex%this.tile_width);
        var y1 = Math.floor(startIndex/this.tile_width);
        var x2 = Math.floor(endIndex%this.tile_width);
        var y2 = Math.floor(endIndex/this.tile_width);
        
        if(x1 <= x2 && y1 <= y2) {
            //인덱스가 x, y 모두 증가
            startI = startIndex;
            endI = endIndex;
        }
        else if(x1 >= x2 && y1 >= y2) {
            //인덱스가 x, y 모두 감소
            startI = endIndex;
            endI = startIndex;
        }
        else if(x1 >= x2 && y1 <= y2) {
            //인덱스가 x증가, y 감소
            endI = x1 + y2 * this.tile_width;
            startI = x2 + y1 * this.tile_width;
        }
        else {
            startI = x1 + y2 * this.tile_width;
            endI = x2 + y1 * this.tile_width;
        }

        var xinc = Math.floor(endI % this.tile_width) - Math.floor(startI % this.tile_width);
        var yinc = Math.floor(endI / this.tile_width) - Math.floor(startI / this.tile_width);
        var index;
        for(var j=0; j<=yinc; j++) {
            for(var i=0; i<=xinc; i++) {
            
                index = startI + i + j * this.tile_width;
                arrIndex.push(index);
            }
        }

        return arrIndex;
    }

    //ObjectMap에서 타일인덱스와 시퀀스가 같은지 찾고 있으면 리턴
    FMapManager.prototype.findObjectMap = function(obj_map_seq, tile_index) {
        
        var len = this.ObjectMap.length;
        for(var i=0; i<len; i++) {
            if(obj_map_seq != 0) {
                if((this.ObjectMap[i].OBJ_MAP_SEQ == obj_map_seq) && (this.ObjectMap[i].TILE_IDX == tile_index)) {
                    return this.ObjectMap[i];
                }
            } else {
                if(this.ObjectMap[i].TILE_IDX == tile_index) {
                    return this.ObjectMap[i];
                }
            }
        }

        return null;
    }

    FMapManager.prototype.clearAllObjectMap = function() {
        CommFunc.arrayRemoveAll(this.ObjectMap);
    }

    FMapManager.prototype.clearObjectMap = function(obj_map_seq, tile_index) {

        var obj = this.findObjectMap(obj_map_seq, tile_index);
        CommFunc.arrayRemove(this.ObjectMap, obj);
    }

    FMapManager.prototype.createEditingObject = function(obj_map_seq, tile_index, categoryId, objID, dir, layer) {

        var stile = new sOBJECTINFO();
        stile.set(obj_map_seq, tile_index, dir, objID, layer, categoryId, CommFunc.nameGuid(objID));

        this.EditingObject = stile;
    }
    
    FMapManager.prototype.changePosEditingObject = function(tile_index, new_tile_index) {

        if(this.EditingObject.TILE_IDX === tile_index) {
            this.EditingObject.TILE_IDX = new_tile_index;
        }
    }

    FMapManager.prototype.changeLayerEditingObject = function(new_layer) {

        this.EditingObject.LAYER_IDX = new_layer;
    }
    
    FMapManager.prototype.changeDirEditingObject = function() {
        
        var new_dir;

        if(this.EditingObject.ROT_DIR != TILE_DIR_BOTTOM) {
            new_dir = this.EditingObject.ROT_DIR * 2;
        } else {
            new_dir = TILE_DIR_LEFT;
        }

        this.EditingObject.ROT_DIR = new_dir;
    }

    FMapManager.prototype.copyToEditingObjectMap = function(object) {

        if(object == null) {
            Debug.Error("copyToEditingObjectMap : 오브젝트가 널이다");
            return;
        } 

        this.EditingObject = object.clone();
        this.ObjBackup = object.clone();
        this.clearObjectMap(object.OBJ_MAP_SEQ, object.TILE_IDX);
        this.updateTileMap();
    }

    FMapManager.prototype.restoreEditingObject = function() {

        if(this.ObjBackup == null) return;

        this.pushObjectMap(this.ObjBackup.OBJ_MAP_SEQ, this.ObjBackup.TILE_IDX, this.ObjBackup.CATE_ID, this.ObjBackup.OBJ_ID, this.ObjBackup.ROT_DIR, this.ObjBackup.LAYER_IDX);
        this.clearEditingObject();
        // this.ObjBackup = null;
    }

    FMapManager.prototype.updateTileMap = function() {
        
        this.clearTileMap();

        var tileList = this.B_TILEDATA.tileList;
        for(var i=0; i<tileList.length; i++) {
            
            if(tileList[i][TILELIST_TYPE.TILE_TYPE] == TILE_TYPE.WALL) {

                if(tileList[i][TILELIST_TYPE.TILE_IDX] != i) {
                    alert("tile data Error at updateTileMap");
                    return;
                }

                var axis = this.getCoordinateAxis(i);
                if(this.WorldMap[axis.x][axis.y]) {
                    this.WorldMap[axis.x][axis.y].WALL = true;
                    this.WorldMap[axis.x][axis.y].LAND = false;
                }
            } else {

                if(tileList[i][TILELIST_TYPE.TILE_LAYER] < 20 ) {
                    this.tileLayer0.push(i);
                } else { 
                    this.tileLayer1.push(i);
                }
                
            }
        }
    }

    FMapManager.prototype.getRandomTileLayer0 = function() {
        return this.tileLayer0[CommFunc.random(this.tileLayer0.length)];
    }

    FMapManager.prototype.getRandomTileLayer1 = function() {
        return this.tileLayer1[CommFunc.random(this.tileLayer1.length)];
    }

    FMapManager.prototype.getIndexAxis = function(x, y) {

        return x + y * this.tile_width;
    }

    FMapManager.prototype.getCoordinateAxis = function(index) {

        // if(index > this.tile_width*this.tile_height) {
        //     Debug.Error('over tile index!!!!!(index = ' + index + ")");
        // }

        var i = Math.floor(index % this.tile_width);
        var j = Math.floor(index / this.tile_width);

        return new BABYLON.Vector2(i,j);
    }


    FMapManager.prototype.clearTileMap = function() {
        // CommFunc.arrayRemoveAll(this.walkable);
        for(var i=0; i<this.tile_len; i++) {

            var axis = this.getCoordinateAxis(i);

            this.WorldMap[axis.x][axis.y].TILE_IDX    = -1; 
            this.WorldMap[axis.x][axis.y].ROOM       = false;
            this.WorldMap[axis.x][axis.y].OBJECT     = false;
            this.WorldMap[axis.x][axis.y].WALL       = false;
            this.WorldMap[axis.x][axis.y].LAND       = true;
        }
    }


    FMapManager.prototype.isWall = function(index) {

        var wall = this.checkWallMap(index, false);

        if(wall && wall.WALL_PAPER_ID != TILE_NONE && wall.ROT_DIR != TILE_NONE) return true;

        return false;
    }

    FMapManager.prototype.isFloor = function(index) {
        
        var wall = this.checkWallMap(index, false);

        if(wall && wall.FLOOR_ID != TILE_NONE) return true;

        return false;
    }

    FMapManager.prototype.getTileLength = function() {
        
        return this.tile_len;
    }

    FMapManager.prototype.clearEditingObject = function() {
        if(this.EditingObject == null) return;
        G.resManager.clearMesh(this.EditingObject.OBJ_ID, this.EditingObject.MESH_NAME);

        this.EditingObject = null;
        this.ObjBackup = null;
    }

    // FMapManager.prototype.clearSetupFloor = function() {

    //     CommFunc.arrayRemoveAll(this.setupFloor);
    // }

    // FMapManager.prototype.clearExceptFloor = function() {
    //     CommFunc.arrayRemoveAll(this.exceptFloorIndex);
    // }


    FMapManager.prototype.getWorldToIndex = function(xpos, zpos) {

        var oxpos = xpos, ozpos = zpos;
        if(this.start.x < 0) oxpos -= this.start.x;
        else oxpos += this.start.x;

        //여기서 모두 return -1 이었으나 에러 방지를 위해 0으로 바꿨다.
        if(oxpos < 0) { 
            Debug.Error("oxpos < 0 : " + oxpos);
            return 0;
        }
        if(oxpos > this.tile_width * this.TILE_SIZE){
            Debug.Error("oxpos > this.tile_width * this.TILE_SIZE : " + oxpos);
            return 0;
        }

        if(this.start.z < 0) ozpos -= this.start.z;
        else ozpos += this.start.z;
        
        if(ozpos < 0) { 
            Debug.Error("ozpos < 0 : " + ozpos);
            return 0;
        }
        if(ozpos > this.tile_height * this.TILE_SIZE) {
            Debug.Error("ozpos > this.tile_height * this.TILE_SIZE : " + ozpos);
            return 0;
        }

        var x = Math.floor(oxpos / this.TILE_SIZE);
        var z = Math.floor(ozpos / this.TILE_SIZE);

        var rts = x + z * this.tile_width;

        return rts
    }

    //타일인덱스로 월드좌표로 변환
    FMapManager.prototype.getIndexToWorld = function(index) {
        
        var x = Math.floor(index % this.tile_width);
        var z = Math.floor(index / this.tile_width);

        // var anchor = new Vector3(1,0,1).add(this.start);
        var anchor = new Vector3(0,0,0).add(this.start);
        
        var position = new Vector3(this.TILE_SIZE*x, 0, this.TILE_SIZE*z).add(anchor);

        return position;
    }

    //화면 좌표로 타일 인덱스로 변환
    FMapManager.prototype.getTouchPointToTileIndex = function(screenX, screenY) {
        
        var self = this;

        var pickResult = G.scene.pick(screenX, screenY);
        if (pickResult.hit) {

            return self.getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z);
        }

        return -1;
    }


    //현재 화면의 가운데 타일의 인덱스를 계산해서 돌려준다.
    //현재는 그냥 원하는데로
    FMapManager.prototype.getCenterScreenIndex = function() {

        var width = window.innerWidth;
        var height = window.innerHeight;

        return this.getTouchPointToTileIndex(width/2, height/2);
        
    }

    FMapManager.prototype.addStartY = function() {

        //this.start.y == 60일때 2층
        //this.start.y == 120 일때 3층
        this.start.y += 1;
    }

    FMapManager.prototype.subStartY = function() {
        this.start.y -= 1;
    }

    FMapManager.prototype.clearStartY = function() {
        this.start.y = 0;
    }

    //
    // singleton pattern
    //
    var instance;
    return {
        getInstance : function()
        {
            if ( null == instance )
            {
                instance = new FMapManager();
                instance.constructor = null;
            }

            return instance;
        }
    };

}());

