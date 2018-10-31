'use strict';

var OBJMGR_STATE = {}

OBJMGR_STATE.INIT              = 0;
OBJMGR_STATE.EDIT_MODE         = 1;
OBJMGR_STATE.CREATE_MODE       = 2; //상점에서 새롭게 아이템 구매 후 설치
OBJMGR_STATE.INVEN_INSTALL     = 3; //인벤에서 새롭게 아이템 설치

OBJMGR_STATE.CREATE_SETUP      = 1;
OBJMGR_STATE.EDIT_SETUP        = 0;

OBJMGR_STATE.SETUP_COMPLETED   = 100;
OBJMGR_STATE.SETUP_CANCEL      = 101;


var DEFAULT_OBJ_DIR            = TILE_DIR_LEFT

var TSET_SET_URL_FROM_OBJ_NAME = function( in_objIndex )
{
    var linkURLStr = null;

    switch( in_objIndex )
    {
        case 360001 : linkURLStr = "http://www.vw.com/"; break;
        case 360002 : linkURLStr = "https://www.lamborghini.com/en-en"; break;

    default :
        {
            if ( 110001 <= parseInt( in_objIndex ) && 350002 >= parseInt( in_objIndex ) ) 
            {
                // 액자에 url 걸면 다이렉트스타컨텐츠 안보여서 예외처리할거임.
                if( 390001 <= in_objIndex && in_objIndex <= 390006 )
                    return linkURLStr;

                if ( (parseInt( in_objIndex ) % 2) == 0)
                    linkURLStr = "https://www.ikea.com/";
            }
        }
        break;
    }

    return linkURLStr;
}

var FRoomObject = (function () {

    __inherit(FRoomObject, FGameObject);

    function FRoomObject(name, who) {

        this.setName(name);

        this.OBJ_MAP_SEQ = null;

        this.TILE_IDX    = null;
        this.ROT_DIR     = null;
        this.OBJ_ID      = null;
        this.CATE_ID     = null;
        // this.MESH_NAME   = null;

        this.loaded      = null;

        this.objTileInfo = null;
        this.OBJ_ACTN_ID          = null;
        this.centerPosition       = null;

        // this.starContentInfo      = null;
        this.STARCONTSEQ          = null;
        this.URL                  = null;
        this.IMG_PATH             = null;
        this.VDO_PATH             = null;
        this.VDO_THUMBNAILPATH    = null;

        this.who                  = who;

        this.starconUI = 
        {
            wrapper : null,

            thumbNail : null,
            postCountText : null,
        }

        this.linkURL = null;
    }

    FRoomObject.prototype.setLinkURL = function( in_linkURL )
    {
        this.linkURL = in_linkURL;
    }

    FRoomObject.prototype.isExistLinkURL = function()
    {
        return (this.linkURL!=null);
    }

    FRoomObject.prototype.getLinkUrl = function()
    {
        return this.linkURL;
    }

    FRoomObject.prototype.setStarContentInfo = function(info) {
        this.STARCONTSEQ = info.STARCONTSEQ;
    }

    FRoomObject.prototype.setStarContentUrl = function(URL, IMG_PATH, VDO_PATH, VDO_THUMBNAILPATH) {
        this.URL = URL;
        this.IMG_PATH = IMG_PATH;
        this.VDO_PATH = VDO_PATH;
        this.VDO_THUMBNAILPATH = VDO_THUMBNAILPATH;
    }

    FRoomObject.prototype.loadStarContentsUI = function()
    {
        var self = this;
        var ratio = 0.5;

        this.starconUI.wrapper = GUI.createContainer();
        this.starconUI.wrapper.width = px( 202 * ratio );
        this.starconUI.wrapper.height = px( 782 * ratio );

        var iconBG = GUI.CreateButton( "iconBG", px( 0 ), px( 0 ), px(202 * ratio), px(391 * ratio),
            SHOPUI_PATH+"star_view.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        this.starconUI.wrapper.addControl( iconBG );

        iconBG.onPointerUpObservable.add(function(){

            snsCommonFunc.openStarContents(self.STARCONTSEQ);
            
        });


        var thumbNail = GUI.CreateImage( "thumbNail", px( 0 ), px( 7 ), px(188 * ratio*0.95), px(188 * ratio*0.95),
            SHOPUI_PATH+"btn_make_contents.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        iconBG.addControl( thumbNail );
        this.starconUI.thumbNail = thumbNail;

        var roundCover = GUI.CreateImage( "roundCover", px( 0 ), px( 4 * ratio ), px(194 * ratio), px(194 * ratio),
            SHOPUI_PATH+"starcontentsIconRoundCover.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        iconBG.addControl( roundCover );
    }

    FRoomObject.prototype.setStarContentsUI = function()
    {
        if(!this.STARCONTSEQ) return;
        if ( this.starconUI.wrapper == null )
            this.loadStarContentsUI();

        if( 390001 <= this.getObjID() && this.getObjID() <= 390006 ) {
            this.setStarContentsFrame();            
        } else {

            var sc = G.dataManager.getUsrMgr(this.who).getStarContentForSeq(this.STARCONTSEQ);

            var in_thumbnail = null;
            //1:이미지,2:동영상,3:유튜브링크
            if(sc.FILETYPE == 1) {
                in_thumbnail = this.URL + this.IMG_PATH + sc.REPRSTIMGNM;
            } else if(sc.FILETYPE == 2) {
    
                var file = sc.REPRSTIMGNM.replace(".mp4", ".png");
    
                in_thumbnail = this.URL + this.VDO_PATH + 'thumbnail/'+ file;
            } else if(sc.FILETYPE == 3) {
                // in_thumbnail = this.URL + this.IMG_PATH + sc.REPRSTIMGNM;
                in_thumbnail = CommFunc.getYouTubeThumbNailImg( sc.REPRSTIMGNM );
            } else {
                Debug.Error('File Type Error!!!!');
            }            
    
            this.showStartContentsUI();
    
            if ( window.location.href == "http://127.0.0.1/")
                GUI.changeImage( this.starconUI.thumbNail, SHOPUI_PATH+"btn_make_contents.png" );
            else
                GUI.changeImage( this.starconUI.thumbNail, in_thumbnail );
    
        }
    }

    FRoomObject.prototype.setStarContentsFrame = function() {
        var sc  = G.dataManager.getUsrMgr(this.who).getStarContentForSeq(this.STARCONTSEQ);
        var url = null;
        if(sc.FILETYPE == 1) {
            url = this.URL + this.IMG_PATH + sc.REPRSTIMGNM;
        } else if(sc.FILETYPE == 2) {

            var file = sc.REPRSTIMGNM.replace(".mp4", ".png");
            url = this.URL + this.VDO_PATH + 'thumbnail/'+ file;

        } else if(sc.FILETYPE == 3) {
            // in_thumbnail = this.URL + this.IMG_PATH + sc.REPRSTIMGNM;
            url = CommFunc.getYouTubeThumbNailImg( sc.REPRSTIMGNM );
        } else {
            Debug.Error('File Type Error!!!!');
        }   
        

        var mesh = this.getMainMesh();

        if(mesh.material) {

            if(mesh.material.diffuseTexture) mesh.material.diffuseTexture.dispose();

            mesh.material.dispose();
        }
    
        mesh.isVisible = true;
        var xmlhttp = new XMLHttpRequest();
        var materialBox = new BABYLON.StandardMaterial("starFrame"+this.getObjID(), G.scene);
        xmlhttp.onreadystatechange = function () {

            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var buffer = xmlhttp.response;
                var bytes = new Uint8Array(buffer);
                var tex = new BABYLON.Texture(xmlhttp.responseURL, G.scene, false, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, "data:image/png;base64," + CommFunc.pngEncode(bytes), true);
                materialBox.diffuseTexture = tex;
                materialBox.diffuseTexture.uScale = -3.0;
                materialBox.diffuseTexture.vScale = 3.0;
                materialBox.diffuseTexture.uOffset = 0.25;
                materialBox.diffuseTexture.vOffset = 0.5;
                materialBox.diffuseTexture.invertZ = true;
            }
        };
        xmlhttp.responseType = "arraybuffer";
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

        console.log(url);

        mesh.material = materialBox;




        // FBabylon.changeTexture(mesh, in_thumbnail);
    }



    FRoomObject.prototype.showStartContentsUI = function()
    {
        if(!this.STARCONTSEQ) return;

        if ( !this.isStarContents() ) return;

        if( 390001 <= this.getObjID() && this.getObjID() <= 390006 ) return;
        
        G.guiMain.addControl( this.starconUI.wrapper, GUI.LAYER.BACKGROUND );
        this.starconUI.wrapper.linkWithMesh( this.getMainMesh() );
    }


    FRoomObject.prototype.hideStarContentsUI = function()
    {
        G.guiMain.removeControl( this.starconUI.wrapper );
    }

    FRoomObject.prototype.init = function() {

        FGameObject.prototype.init.call(this);
    }

    FRoomObject.prototype.getObjectInfo = function() {

        var info = {
            'OBJ_MAP_SEQ' 	: this.OBJ_MAP_SEQ,
            'SECTOR_IDX'	: 1,
            'CATE_ID'		: this.CATE_ID,
            'OBJ_ID'		: this.OBJ_ID,
            'TILE_IDX'		: this.TILE_IDX,
            'ROT_DIR'		: this.ROT_DIR,
            'LAYER_IDX'		: 0,
            'WHO'           : this.who
        }

        return info;
    }

    FRoomObject.prototype.createObject = function(obj_map_seq, objID, tile_index, categoryId, rot_dir, eff) {

        var self = this;

        this.init();
        this.setObjID(objID);

        this.OBJ_MAP_SEQ = obj_map_seq;
        this.TILE_IDX    = tile_index;
        this.ROT_DIR     = rot_dir;
        this.OBJ_ID      = objID;
        this.CATE_ID     = categoryId;

        this.objTileInfo = this.getObjectTileInfo();
        this.OBJ_ACTN_ID = G.dataManager.getOBJInfo(this.OBJ_ID).OBJ_ACTN_ID;
        G.resManager.getLoadGroupMesh(this.OBJ_ID, this.objTileInfo, null, function(newMeshes, particleSystems, skeletons, lparam, pparam){

            var layer = FMapManager.getInstance().getTileLayer(self.TILE_IDX);

            self.setMesh(newMeshes);
            self.setPosition(new Vector3(lparam.position.x, layer+0.1, lparam.position.z));
            self.setRotation(new Vector3(lparam.rotation.x, lparam.rotation.y, lparam.rotation.z));
            self.checkCenterPosition();
            self.setVisible(true);
            self.sendWorldInfomation();
            self.setTouchEvent(self,null,self.recvTouchedEvent);
            self.setStarContentsUI();
            self.loaded = true;

            // if(eff) {
            //     for(var i=0; i<newMeshes.length; i++) {
            //         if(newMeshes[i].parent == null) {
            //             GUI.dropEffect( newMeshes[i], layer + 50, true, 3, 3, 2, "flare.png" );
            //         }
            //     }
            // }

            // Debug.renderBox(10,self.centerPosition);
            // GUI.installEffect( new Vector3(self.centerPosition.x, layer+0.1, self.centerPosition.z), "flare.png", 1.0, 20, layer );

            //self.setStarContentsUI( SHOPUI_PATH + "s_f3.png" ); // 테스트용 스타컨텐츠 썸네일
        });


        // TEST FOR URL LINK / TODO:DELETE 
        this.setLinkURL( TSET_SET_URL_FROM_OBJ_NAME( objID ) );
    }

    FRoomObject.prototype.getSeq = function() {
        return this.OBJ_MAP_SEQ;
    }

    //override
    // FRoomObject.prototype.setMesh = function(mesh) {

    //     FGameObject.prototype.setMesh.call(this, mesh);

    //     var meshes = this.getMeshes();

    //     var objID  = this.getObjID();
    //     var name1   = objID + '_P1';
    //     var name2   = objID + '_P2';

    //     var parent  = null;
    //     var child1  = null;
    //     var child2  = null;
    //     for(var i=0; i<meshes.length; i++) {
    //         if(meshes[i].name == name1) child1 = i;
    //         else if(meshes[i].name == name2) child2 = i;
    //         else parent = i;
    //     }

    //     if(parent != null && child1 != null && child2 != null) {
    //      //   meshes[child1].parent = meshes[parent];
    //      //   meshes[child2].parent = meshes[parent];

    //         // this.setParent(meshes[parent]);
    //     }
    // }


    FRoomObject.prototype.init = function() {
        
        //To do..
        this.loaded      = false;

        FGameObject.prototype.init.call(this);
    }

    FRoomObject.prototype.destroy = function() {

        //To do..
        this.OBJ_MAP_SEQ = null;
        this.TILE_IDX    = null;
        this.ROT_DIR     = null;
        this.OBJ_ID      = null;
        this.CATE_ID     = null;
        this.loaded      = null;

        FGameObject.prototype.destroy.call(this);
    }

    FRoomObject.prototype.isLoaded = function() {
        return this.loaded;
    }

    FRoomObject.prototype.getObjectTileInfo = function() {

        if(this.OBJ_ID == TILE_NONE) {
            return null;
        } 

        var mapMgr = FMapManager.getInstance();
        var tile_width = mapMgr.getTileWidth();
        // var tile_height = mapMgr.getTileHeight();

        var objInfo = G.dataManager.getOBJInfo(this.OBJ_ID);
        
        if(objInfo == null) return null;

        var size_x = objInfo.OBJ_SIZE_X;
        // var size_y = objInfo.OBJ_SIZE_Z;
        var size_z = objInfo.OBJ_SIZE_Y;

        var position = mapMgr.getIndexToWorld(this.TILE_IDX);//.add(size);
        var rotation;

        var long, short;
        if(size_x > size_z) { long = size_x; short = size_z; } 
        else {                long = size_z; short = size_x; }

        if(this.ROT_DIR & TILE_DIR_LEFT){
            rotation = new Vector3(0, 0, 0);
        } else if(this.ROT_DIR & TILE_DIR_TOP) {
            rotation = new Vector3(0,ToRadians(90),0);
            if(size_x != size_z) {

                position = mapMgr.getIndexToWorld(this.TILE_IDX + tile_width*short);

            } else {
                position = mapMgr.getIndexToWorld(this.TILE_IDX + tile_width*size_x);
            }
            
        } else if(this.ROT_DIR & TILE_DIR_RIGHT) {
            rotation = new Vector3(0, ToRadians(180), 0);

            if(size_x != size_z) {

                position = mapMgr.getIndexToWorld(this.TILE_IDX + tile_width*long + short);

            } else {
                
                position = mapMgr.getIndexToWorld(this.TILE_IDX + tile_width*size_x + size_x);
            }

        } else if(this.ROT_DIR & TILE_DIR_BOTTOM) {
            rotation = new Vector3(0,ToRadians(270),0);
            if(size_x != size_z) {
                position = mapMgr.getIndexToWorld(this.TILE_IDX + long);
            } else {
                
                position = mapMgr.getIndexToWorld(this.TILE_IDX + size_x);

            }
        }

        var tileInfo = {
            'position' : position,
            'rotation' : rotation
        };

        return tileInfo;  
    }

    //tile_index 기준으로 사이즈 만큼 점유하고 있는 타일의 인덱스를 돌려준다.
    FRoomObject.prototype.getOccupationTile = function() {

        var objInfo = G.dataManager.getOBJInfo(this.OBJ_ID);

        var size_x = objInfo.OBJ_SIZE_X;
        var size_z = objInfo.OBJ_SIZE_Y;


        //크기가 2보다는 커야 하고 홀수라면 -부터 시작한다.
        var xi, zi, xm, zm;

        var xi = 0;
        var zi = 0;

        if(this.ROT_DIR == TILE_DIR_LEFT || this.ROT_DIR == TILE_DIR_RIGHT) {
            xi = 0;
            zi = 0;
            xm = size_x-1;
            zm = size_z-1;
        } else if(this.ROT_DIR == TILE_DIR_TOP || this.ROT_DIR == TILE_DIR_BOTTOM) {
            xi = 0;
            zi = 0;
            xm = size_z-1;
            zm = size_x-1;
        }

        //xi, zi가 타일 범위 밖인지 검사해야 한다.!!!!
        //지금은 바쁘니..나중에
        var arrIndex = [];
        for(var j=zi; j<=zm; j++) {
            for(var i=xi; i<=xm; i++) {
            
                var index = this.TILE_IDX + i + j * FMapManager.getInstance().tile_width;

                arrIndex.push(index);
            }
        }

        return arrIndex;
    }

    FRoomObject.prototype.getCenterPosition = function() {
        return this.centerPosition;
    }

    FRoomObject.prototype.checkCenterPosition = function() {

        var objInfo = G.dataManager.getOBJInfo(this.OBJ_ID);

        var size_x = objInfo.OBJ_SIZE_X;
        var size_z = objInfo.OBJ_SIZE_Y;
        var tile_size = FMapManager.getInstance().getTileSize();

        var width = size_x * tile_size;
        var height = size_z * tile_size;

        var position = this.getPosition();

        var revisionPos = new Vector2( width/2, height/2 );

        if(this.ROT_DIR == TILE_DIR_LEFT) {
        } else if(this.ROT_DIR == TILE_DIR_TOP) {
            revisionPos.x = height/2;
            revisionPos.y = -width/2;
        } else if(this.ROT_DIR == TILE_DIR_RIGHT) {
            revisionPos.x *= -1;
            revisionPos.y *= -1;
        } else if(this.ROT_DIR == TILE_DIR_BOTTOM) {
            revisionPos.x = -height/2;
            revisionPos.y = width/2;
        }

        this.centerPosition = new Vector3(position.x + revisionPos.x, position.y+10, position.z + revisionPos.y);
    }

    //스타컨텐츠가 등록되어 있는 오브젝트인지 확인
    FRoomObject.prototype.isStarContents = function() {
        var info = G.dataManager.getUsrMgr(this.who).getStarContentInfo();
        var sc = info.SC;

        for(var i=0; i<sc.length; i++) {
            if(sc[i].OBJMAPSEQ == this.OBJ_MAP_SEQ) {
                return true;
            }
        }

        return false;
    }

    //스타콘텐츠 정보 가져오기
    FRoomObject.prototype.getStarContents = function() {
        var info = G.dataManager.getUsrMgr(this.who).getStarContentInfo();
        var sc = info.SC;

        for(var i=0; i<sc.length; i++) {
            if(sc[i].OBJMAPSEQ == this.OBJ_MAP_SEQ) {
                return sc[i];
            }
        }

        return null;
    }

    FRoomObject.prototype.addStarContents = function() {

        var starContentInfo = G.dataManager.getUsrMgr(this.who).getStarContentForSeq(this.STARCONTSEQ);

        if(starContentInfo.POSTCNT < 1) { 
            alert("starcontent post have to non zero");
            return;
        }

        // this.starContentInfo.POSTCNT++;
    }

    FRoomObject.prototype.delStarContents = function(seq, fileType, path, url) {
        
        var starContentInfo = G.dataManager.getUsrMgr(this.who).getStarContentForSeq(this.STARCONTSEQ);

        if(starContentInfo.POSTCNT == 0) { 
            alert("starcontent post is already 0");
            return;
        }

        G.dataManager.getUsrMgr(this.who).delStarContent(seq, fileType, path, url);
        // this.starContentInfo.POSTCNT--;

        if(starContentInfo.POSTCNT == 0) {
            this.hideStarContentsUI();
            this.STARCONTSEQ = null;
        } else {
            if(starContentInfo.FILETYPE != fileType || starContentInfo.REPRSTIMGNM != url) {
                this.setStarContentsUI();
            }
        }
    }

    FRoomObject.prototype.sendWorldInfomation = function() {

        var worldMap = FMapManager.getInstance().getWorldMap();
        var arrIndex = this.getOccupationTile(this.OBJ_ID, this.TILE_IDX, this.ROT_DIR);

        for(var k=0; k<arrIndex.length; k++) {

            var axis = FMapManager.getInstance().getCoordinateAxis(arrIndex[k]);
    
            if(worldMap[axis.x][axis.y]) {
                // if(worldMap[axis.x][axis.y].OBJECT) {
                //     Debug.Error("오브젝트 타일이 중첩되어 있다. : " + this.ObjectMap[i].OBJ_ID);
                // }
                if(arrIndex[k] == this.TILE_IDX) worldMap[axis.x][axis.y].TILE_IDX = this.TILE_IDX;

                worldMap[axis.x][axis.y].OBJECT = true;
                if(this.isWalkableObject()) {
                    worldMap[axis.x][axis.y].LAND = true;
                } 
                else worldMap[axis.x][axis.y].LAND = false;
            } 
        }
    }

    FRoomObject.prototype.isWalkableObject = function() {

        return false;
    }


    FRoomObject.prototype.recvTouchedEvent = function(e, lparam, pparam) {

        var self = lparam;

        

        if(e == 'OnPointerOverTrigger') {

            

        } else if(e == 'OnPointerOutTrigger') {



        } else if(e == 'OnPickUpTrigger') {

            console.log("recvTouchedEvent, OnPickUpTrigger ");

            if(DEF_IDENTITY_NONE == self.who) return;

            FObjectTouchUI.getInstance().setInteractionSelectCallback( function( in_selectedActionKind )
            {
                //상호작용이 없는 가구라면 근처까지 간다.
                if(this.OBJ_ACTN_ID == 0) { 
                
                    //상호작용이 없는 가구라면 근처까지 간다.
                    return;

                } else { 

                    /*
                    var actn = G.dataManager.getActnKind(this.OBJ_ACTN_ID);

                    //OBJ_ACTN_KIND 값이 배열이므로 UI에서 그려주고 선택하게 만든다음
                    //아래 함수를 호출한다.
                    var kind = [actn.OBJ_ACTN_KIND_1,actn.OBJ_ACTN_KIND_2,actn.OBJ_ACTN_KIND_3,actn.OBJ_ACTN_KIND_4,actn.OBJ_ACTN_KIND_5];
                    self.requestInteraction(kind[0]);
                    */

                    self.requestInteraction( in_selectedActionKind );
                }
            });

            FObjectTouchUI.getInstance().setChangeObjectCallback( function( in_selectedChangeObjIndex, confirm )
            {
                // console.log("잘받았쪄용 오브젝트아이디 이걸로 바꾼대!!:"+in_selectedChangeObjIndex.toString() );

                var preview = true;
                if(confirm) preview = false;

                if(in_selectedChangeObjIndex != -1) {
                    self.setVisible(false);
                    FObjectManager.getInstance().createEditRoomObject(preview, 0, in_selectedChangeObjIndex, self.TILE_IDX, self.CATE_ID, self.ROT_DIR, self.getName());
                    
                }
                else {
                    self.setVisible(true);
                    FObjectManager.getInstance().cancelEditRoomObject();
                }
                
            } );

            FObjectTouchUI.getInstance().openUI( self, G.dataManager.getOBJInfo(self.OBJ_ID) );            
        }
    }


    FRoomObject.prototype.requestInteraction = function(kind) {

        var myAvatar = G.sceneMgr.getCurrentScene().getMyAvatar();
        if(myAvatar == null) return;

        var position1 = this.getInteractionPositionTileIndex(1);
        var position2 = this.getInteractionPositionTileIndex(2);

        var tileIdx   = FMapManager.getInstance().getWorldToIndex(position1.x, position1.z);
        var rotation  = this.getInteractionLookRotation();
        myAvatar.requestInteractionObject(this.OBJ_ID, tileIdx, position2, rotation, kind);
        
        G.cameraManager.setTarget( myAvatar );
    }

    FRoomObject.prototype.getInteractionPositionTileIndex = function(num) {
        
        var meshes = this.getMeshes();
        var objID  = this.getObjID();
        var name   = null;
        
        if(num == 1) name = objID + '_P2';
        else name = objID + '_P1';

        if(!meshes) {
            alert('meshes null');
            return;
        }
        for(var i=0; i<meshes.length; i++) {
            if(meshes[i].name == name) { 

                return meshes[i].absolutePosition;
            }
        }

        return -1;
    }

    FRoomObject.prototype.getInteractionLookRotation = function() {
        var meshes = this.getMeshes();
        var objID  = this.getObjID();
        var name   = objID + '_P1';

        for(var i=0; i<meshes.length; i++) {
            if(meshes[i].name == name) { 

                // Debug.renderBox(10.0, meshes[i].absolutePosition);

                var pos = meshes[i].absolutePosition;
                var rot = meshes[i].rotation;

                //맥스의 핼퍼 기즈모가 이상하다..지금은 도가다로 맞췄다.
                // var x = Math.cos(rot.y-ToRadians(90)) * (-50);
                // var z = Math.sin(rot.y-ToRadians(90)) * (-50);

                var x = Math.cos(rot.y) * 50;
                var z = Math.sin(rot.y) * 50;

                var from = new Vector3(pos.x + x, pos.y, pos.z + z);

                // Debug.renderBox(10.0, from);

                // var start, end;

                //x
                // start = new Vector3(pos.x, pos.y, pos.z);
                // end = from;
                // Debug.renderLine(start, end, new Color3(1.0,0.0,0.0));

                var relativePos = pos.subtract(from);
                var rotation = CommFunc.QuaternionLookRotation(relativePos, Vector3.Up());

                return rotation;
            }
        }

        return -1;

    }

    return FRoomObject;

}());



var FObjectManager = (function () {
    
    function FObjectManager(name) {

       
        var self = this;
        this.name = 'FObjectManager';

        this.roomObjectList         = null;
        this.editRoomObject         = null;
        this.editRoomObjectCallback = null;
        this.originObject           = null;

        this.roomObjectActionList   = null;

        this.init();
    }

    FObjectManager.prototype.init = function() {
        this.roomObjectList = new Array();
        this.roomObjectActionList = new Array();
    }

 
    FObjectManager.prototype.createRoomObject = function(obj, who) {

        /*
        	'OBJ_MAP_SEQ' 	: 1,
			'SECTOR_IDX'	: 1,
			'CATE_ID'		: 0,
			'OBJ_ID'		: d[0],
			'TILE_IDX'		: d[1],
			'ROT_DIR'		: 1,
			'LAYER_IDX'		: 0,
        */
        var roomObj = new FRoomObject(CommFunc.nameGuid(obj.OBJ_ID.toString()), who);
        //star contents
        var scInfo = G.dataManager.getUsrMgr(who).getStarContentInfo();
        for(var i=0; i<scInfo.SC.length; i++) {
            if(scInfo.SC[i].OBJMAPSEQ == obj.OBJ_MAP_SEQ) {
                roomObj.setStarContentInfo(scInfo.SC[i]);
                roomObj.setStarContentUrl(scInfo.URL, scInfo.IMG_PATH, scInfo.VDO_PATH, scInfo.VDO_THUMBNAILPATH);
                break;
            }
        }

        roomObj.createObject(obj.OBJ_MAP_SEQ, obj.OBJ_ID, obj.TILE_IDX, obj.CATE_ID, obj.ROT_DIR, false);
        this.roomObjectList.push(roomObj);

        this.who = who;
    }

    FObjectManager.prototype.createEditRoomObject = function(preview, OBJ_MAP_SEQ, OBJ_ID, TILE_IDX, CATE_ID, ROT_DIR, name) {

        if(this.editRoomObject != null) this.cancelEditRoomObject();

        //오브젝트 변경 미리 보기 상태
        if(preview) {
            this.editRoomObject = new FRoomObject(CommFunc.nameGuid(OBJ_ID.toString()));
            this.editRoomObject.createObject(OBJ_MAP_SEQ, OBJ_ID, TILE_IDX, CATE_ID, ROT_DIR, true);
        } else {
            var objInfo = null;
            //오브젝트 변경 확정
            for(var i=0; i<this.roomObjectList.length; i++) {
                if(this.roomObjectList[i].getName() == name) {
            
                    objInfo = this.roomObjectList[i].getObjectInfo();
                    objInfo.OBJ_ID = OBJ_ID;
                    objInfo.TILE_IDX = TILE_IDX;
                    objInfo.CATE_ID = CATE_ID;
                    objInfo.ROT_DIR = ROT_DIR;
                    
                    this.roomObjectList[i].hideStarContentsUI();
                    this.roomObjectList[i].destroy();
                    CommFunc.arrayRemove(this.roomObjectList, this.roomObjectList[i]);

                    break;
                }
            }

            this.createRoomObject(objInfo, objInfo.who);

            // var roomObj = new FRoomObject(CommFunc.nameGuid(OBJ_ID.toString()));
            // roomObj.createObject(OBJ_MAP_SEQ, OBJ_ID, TILE_IDX, CATE_ID, ROT_DIR, false);
            // this.roomObjectList.push(roomObj);

            this.updateActionObjectList();
        }
    }

    FObjectManager.prototype.cancelEditRoomObject = function() {

        if(this.editRoomObject) {
            this.editRoomObject.destroy();
            this.editRoomObject = null;
        }

    }

    FObjectManager.prototype.isDoneRender = function() {

        for(var i=0; i<this.roomObjectList.length; i++) {
            if(!this.roomObjectList[i].isLoaded()) {
                return false;
            }
        }
        
        return true;
    }

    FObjectManager.prototype.clearObject = function() {
        for(var i=0; i<this.roomObjectList.length; i++) {
            this.roomObjectList[i].destroy();
            this.roomObjectList[i] = null;            
        }

        CommFunc.arrayRemoveAll(this.roomObjectList);

    }

    FObjectManager.prototype.destroy = function() {
        
        this.clearObject();

        this.editRoomObject = null;
        this.editRoomObjectCallback = null;
        this.originObject   = null;

        CommFunc.arrayRemoveAll(this.roomObjectActionList);
    }

    FObjectManager.prototype.run = function() {

    }

    FObjectManager.prototype.updateActionObjectList = function() {

        var obj = null, actionList = null;
        CommFunc.arrayRemoveAll(this.roomObjectActionList);
        for(var i=0; i<this.roomObjectList.length; i++) {
         
            obj = this.roomObjectList[i];
            actionList = G.dataManager.getActnKind( obj.OBJ_ACTN_ID );
            if(actionList) {
                this.roomObjectActionList.push(obj);
            }
        }
    }

    FObjectManager.prototype.getObjectActionList = function() {
        return this.roomObjectActionList;
    }

    //<============================================================================================================================

    // FObjectManager.prototype.startMoveEditObject = function(coordinates) {
    //     var self = this;

    //     self.bMovingUI = true;
    //     if(G.camera.inputs.attached.pointers) G.camera.inputs.attached.pointers.disableMoveCamera();

    //     //---------------------------------------------------------------
    //     self.preIndex = self.currentTileIndex;
        

    //     var wPos = FMapManager.getInstance().getIndexToWorld(self.currentTileIndex);
    //     var screenPos = CommFunc.worldToScreen(wPos)

    //     console.log(coordinates);

    //     self.startPosition = new BABYLON.Vector2(screenPos.x, screenPos.y);
    //     self.startUiPosition = new BABYLON.Vector2(coordinates.x, coordinates.y);
    // }

    // FObjectManager.prototype.getTouchTileIndex = function(clientX, clientY) {

    //     //warning!! 해상도가 달라지면 mousedown 이벤트시에 G.scene.pointer의 값이 실제 화면의 좌표와 다르게 들어온다.
    //     //mousemove시에는 맞게 들어온다...바빌론 버그로 추정된다..그래서 window에서 보내주는 clientX로 대체했다.
    //     // console.log(G.scene.pointerX + ", " + G.scene.pointerY);
    //     // console.log(clientX + ", " +clientY);
    //     var pickResult = G.scene.pick(clientX, clientY);
    //     if (pickResult.hit) {

    //         if(this.mode == OBJMGR_STATE.EDIT_MODE) {
                
    //             var pickedObject = FObjectManager.getInstance().getObjectMapForMesh(pickResult.pickedMesh);
    //             var editObj = FMapManager.getInstance().getEditingObject();
    //             if(editObj == null && pickedObject != null) {
    //                 this.currentTileIndex = pickedObject.TILE_IDX;
    //                 // var pos = FMapManager.getInstance().getIndexToWorld(this.currentTileIndex);
    //                 FMapManager.getInstance().copyToEditingObjectMap(pickedObject);
    //                 this.objID = pickedObject.OBJ_ID;
    //                 this.render();
    
    //                 return this.currentTileIndex;
    //             }
    //         }

    //         var editMesh = this.getEditObjectMesh();
    //         if(this.bMovingUI != true && pickResult.pickedMesh == editMesh) {
    //             var coordinates = new Vector2(clientX, clientY);
    //             this.startMoveEditObject(coordinates);
    //         }

    //         return FMapManager.getInstance().getWorldToIndex(pickResult.pickedPoint.x, pickResult.pickedPoint.z);
    //     }

    //     return -1;
    // }

    FObjectManager.prototype.onPointerDown = function(evt) {
        if (evt.button !== 0) {
            return;
        }

        // this.preIndex = this.getTouchTileIndex(evt.clientX, evt.clientY);
        // console.log(this.preIndex);
    }

    FObjectManager.prototype.onPointerMove = function(evt) {

    }
    

    FObjectManager.prototype.onPointerUp = function(evt) {
        if (evt.button !== 0) {
            return;
        }

        this.bMovingUI = false;
    }

    FObjectManager.prototype.onPointerLeave = function(evt) {
        if (evt.button !== 0) {
            return;
        }

        this.bMovingUI = false;
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
                instance = new FObjectManager();
                instance.constructor = null;
            }

            return instance;
        }
    };

}());











