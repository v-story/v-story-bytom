'use strict';

var CommRender = {};

//<------------------------------------------------------------------------------------------------------------------------------------------------------------
//웹에서 이미지 받아서 텍스쳐로 사용하기
// var box = BABYLON.Mesh.CreateBox("box", 10.0, G.scene);
// box.position.y = 20;
// // box.scaling.y = 5.0;

// var xmlhttp = new XMLHttpRequest();
// var url = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getUrl();//ASSET_URL+"00_ground/ir_inground.png";
// var materialBox = new BABYLON.StandardMaterial("textureBox", G.scene);
// xmlhttp.onreadystatechange = function () {
//     console.log("xmlhttp", xmlhttp.readyState, xmlhttp.status)
//     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//         var buffer = xmlhttp.response;
//         var bytes = new Uint8Array(buffer);
//         var tex = new BABYLON.Texture("data:grass", G.scene, false, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE, null, null, "data:image/png;base64," + CommFunc.pngEncode(bytes), true);
//         materialBox.diffuseTexture = tex;
//         materialBox.diffuseTexture.uScale = 1.0;//Repeat 5 times on the Vertical Axes
//         materialBox.diffuseTexture.vScale = 1.0;//Repeat 5 times on the Horizontal Axes	
//     }
// };
// xmlhttp.responseType = "arraybuffer";
// xmlhttp.open("GET", url, true);
// xmlhttp.send();

// box.material = materialBox;


//<------------------------------------------------------------------------------------------------------------------------------------------------------------
// //test
// FBabylon.changeTexture(G.scene.getMeshByName('ir_mytown_apple_ad'), G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getUrl());




CommRender.mesh = [];
CommRender.regStarContents = [];
CommRender.DrawGridLine = function(startx, endx, startz, endz, yPos, tile, color) {
    
    var end = endx;

    for(var i=startx; i<=end; i+=tile) {

        //x
        var start1 = new BABYLON.Vector3(i, yPos, startz);
        var end1 = new BABYLON.Vector3(i, yPos, endz);
        var meshX1 = BABYLON.Mesh.CreateLines("DrawGrid", [start1, end1], G.scene, false);
        meshX1.color = color

        CommRender.mesh.push(meshX1);
    }

    end = endz;
    for(var i=startz; i<=end; i+=tile) {
        //z
        var start2 = new BABYLON.Vector3(startx, yPos, i);
        var end2 = new BABYLON.Vector3(endx, yPos, i);
        var meshX2 = BABYLON.Mesh.CreateLines("DrawGrid", [start2, end2], G.scene, false);
        meshX2.color = color

        CommRender.mesh.push(meshX2);
    };
}

CommRender.DrawLine = function(start, end, color) {
    var mesh = BABYLON.Mesh.CreateLines("DrawGrid", [start, end], G.scene, false);
    mesh.color = color

    CommRender.mesh.push(mesh);
}

CommRender.ClearGridLine = function() {
    
    for(var i=0; i<CommRender.mesh.length; i++) {
        CommRender.mesh[i].dispose();
    }
    
    CommFunc.arrayRemoveAll(CommRender.mesh);
    // CommRender.mesh.removeAll();
}

CommRender.referenceGrid = function(min, max, width, scene) {
    
    for(var i=min; i<max; i+=width) {

        //x
        var meshX = BABYLON.Mesh.CreateLines("referenceGrid", [
            new BABYLON.Vector3(i, 0, -max),
            new BABYLON.Vector3(i, 0, max)],
                scene, false);
        if(i != 0)              
            meshX.color = new Color3(0.7,0.7,0.7);
        else 
            meshX.color = new Color3(1.0,0.0,0.0);
        
        //z
        var meshX = BABYLON.Mesh.CreateLines("referenceGrid", [
            new BABYLON.Vector3(-max, 0, i),
            new BABYLON.Vector3(max, 0, i)],
                scene, false);

        if(i != 0)                           
            meshX.color = new Color3(0.7,0.7,0.7);
        else 
            meshX.color = new Color3(0.0,1.0,0.0);

        //y
        var meshX = BABYLON.Mesh.CreateLines("referenceGrid", [
            new BABYLON.Vector3(0, -max, i),
            new BABYLON.Vector3(0, max, i)],
                scene, false);

        if(i != 0)                           
            meshX.color = new Color3(0.7,0.7,0.7);
        else 
            meshX.color = new Color3(0.0,0.0,1.0);            
    };

}






CommRender.showLight = function(light, scene) {
    
    var sphere = CommRender.createSphere("showLight", 2, scene);
    var mat = CommRender.createMaterial("showLightMat", new BABYLON.Color3(1.0, 0.0, 0.0), scene);
    var position;
    var light_direction;
    if (light.getTypeID() === BABYLON.Light.LIGHTTYPEID_HEMISPHERICLIGHT) {
        position = new Vector3(0,0,0);
        light_direction = light.direction;
    } else {
        position = light.position;
        light_direction = light.getShadowDirection();
    }

    sphere.position = position;
    sphere.material = mat;
    var size = 20;
    var pos = position;
    var direction = light_direction;
    var dir = BABYLON.Mesh.CreateLines("dir", [
        pos,
        new BABYLON.Vector3(pos.x + direction.x * size, pos.y + direction.y * size, pos.z + direction.z * size)
    ], scene);
    dir.color = new BABYLON.Color3(1, 0, 0);
}


CommRender.showAxis = function(scene, size) {
    var axisX = BABYLON.Mesh.CreateLines("axisX", [
        BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10, scene);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
    ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10, scene);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
    ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10, scene);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};

function makeTextPlane(text, color, size, scene) {
    var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color, "transparent", true);
    var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
    plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
    plane.material.backFaceCulling = false;
    plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
    plane.material.diffuseTexture = dynamicTexture;
    return plane;
};


CommRender.showObject = function(object) {
    var box = createBox("showObject", 1);
    box.position = object.position;
}
CommRender.createBox = function(name, size, scene) {
    return BABYLON.Mesh.CreateBox(name, size, scene);
}
CommRender.createSphere = function(name, size, scene) {
    return BABYLON.Mesh.CreateSphere(name, 16.0, size, scene);
}
CommRender.createMaterial = function(name, color, scene) {
    var material = new BABYLON.StandardMaterial(name, scene);
    material.diffuseColor = color;
    return material;
}

CommRender.createPointerEffect = function(x, z, y) {
    var pointerEffect = BABYLON.MeshBuilder.CreateCylinder( "pointer", {"height":10, "diameterTop":10, "diameterBottom":1, "tessellation":4}, G.scene );
    pointerEffect.position.x = x;
    pointerEffect.position.y = y + 10;
    pointerEffect.position.z = z;

    var myMaterial = new BABYLON.StandardMaterial("myMaterial", G.scene);            
    myMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
    myMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
    myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
    myMaterial.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
    
    pointerEffect.material = myMaterial;

    var position = new BABYLON.Vector3( pointerEffect.position.x, 1, pointerEffect.position.z );
    GUI.installEffect( position, "flare.png", 0.2, 5, y );
    GUI.dropEffect( pointerEffect, y + 20, false, 3, 3, 2, "flare.png" );

    setTimeout( function(){ pointerEffect.dispose(); }, 1000 );
}


CommRender.clearStarContents = function(parent) {
    if(CommRender.regStarContents.length && parent.rootContainer && parent.rootContainer.children.length) {
        
        CommRender.regStarContents.forEach(function(star){

            var removeIndex = parent.rootContainer.children.map(function(item) { return item.name; }).indexOf(star);
            // remove object
            if(removeIndex >= 0) parent.rootContainer.children.splice(removeIndex, 1);

        });

        CommFunc.arrayRemoveAll(CommRender.regStarContents);
    }
}

CommRender.renderStartContents = function(parent, info) {
    
    if(!parent) return;

    CommRender.clearStarContents(parent);

    var mesh;
    for(var i=0; i<info.SC.length; i++) {

        mesh = FMapManager.getInstance().getMeshForSeq(info.SC[i].OBJMAPSEQ);
        if(mesh == null) {
            return false;
            
        } else {
            this.drawStarContents(parent, mesh, info, info.SC[i])
        }
    }

    return true;
}
    
CommRender.drawStarContents = function(parent, mesh, info, sc) {

    if(sc.POSTCNT <= 0) return;

    var name = [
        CommFunc.guid(),
        CommFunc.guid(),
        CommFunc.guid(),
        CommFunc.guid(),
        CommFunc.guid()
    ];

    // 스타콘텐츠는 해상도보정의 영향을 받지 않는다.
    GUI.ignoreResolutionCorrectionStart();
    {

        var thumb_back = GUI.CreateImage(name[0], px(0), px(0), px(70), px(70), ASSET_URL + "97_gui_new/09_starcontents/btn_thumb_back_y.png");
        parent.addControl(thumb_back);
        CommRender.regStarContents.push(name[0]);
        thumb_back.linkWithMesh(mesh);
        thumb_back.linkOffsetY = -80;

        var url;
        //1:이미지,2:동영상,3:유튜브링크
        if(sc.FILETYPE == 1) {
            url = info.IMG_PATH + sc.REPRSTIMGNM;
        } else if(sc.FILETYPE == 2) {
            
            url = info.VDO_PATH + 'thumbnail/'+ sc.REPRSTIMGNM;

            // url = info.IMG_PATH + sc.REPRSTIMGNM;

        } else if(sc.FILETYPE == 3) {
            url = info.IMG_PATH + sc.REPRSTIMGNM;
        } else {
            Debug.Error('File Type Error!!!!');
        }

        var thumb = GUI.CreateButton(name[1], px(0), px(0), px(60), px(60), url, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        parent.addControl(thumb);
        CommRender.regStarContents.push(name[1]);
        thumb.linkWithMesh(mesh);
        thumb.linkOffsetY = -80; 
        thumb.onPointerUpObservable.add(function() {

            snsCommonFunc.openStarContents(sc.STARCONTSEQ);

        });

        var e = GUI.CreateEllipse(name[2],px(0),px(0),px(30),px(30), "Red", "Orange", 2);
        parent.addControl(e);
        CommRender.regStarContents.push(name[2]);
        e.linkWithMesh(mesh);
        e.linkOffsetX = 35;
        e.linkOffsetY = -110; 

        var num = GUI.CreateText(px(0),px(0),sc.POSTCNT.toString(), "black",14, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        e.addControl(num);


        var el = GUI.CreateEllipse(name[3],px(0),px(0),px(5),px(5), "Red", "Red", 4);
        parent.addControl(el);
        CommRender.regStarContents.push(name[3]);
        el.linkWithMesh(mesh);

        var line = GUI.CreateLine(name[4],px(0),px(0),px(0),px(25), 2, "white");
        line.linkOffsetY = -5;
        parent.addControl(line);
        CommRender.regStarContents.push(name[4]);
        line.linkWithMesh(mesh);
        line.connectedControl = thumb_back;
    }
    GUI.ignoreResolutionCorrectionEnd();

    GUI.addLevelOfAlphaUI(thumb_back);
    GUI.addLevelOfAlphaUI(thumb);
    GUI.addLevelOfAlphaUI(e);
    GUI.addLevelOfAlphaUI(num);
    GUI.addLevelOfAlphaUI(el);
    GUI.addLevelOfAlphaUI(line);
}


var FMyLoadingScreen = (function () {
    function FMyLoadingScreen() {
        
        this.loadingUIText = null;
        this.wrapper = null;
    }

    FMyLoadingScreen.prototype.displayLoading = function(){
 
        // this._loadingDiv=document.createElement("div"),
		// this._loadingDiv.id="babylonjsLoadingDiv",
		// this._loadingDiv.style.opacity="0",
		// this._loadingDiv.style.transition="opacity 1.5s ease",
		// this._loadingDiv.style.pointerEvents="none",
		// this._loadingTextDiv=document.createElement("div"),
		// this._loadingTextDiv.style.position="absolute",
		// this._loadingTextDiv.style.left="0",
		// this._loadingTextDiv.style.top="50%",
		// this._loadingTextDiv.style.marginTop="80px",
		// this._loadingTextDiv.style.width="100%",
		// this._loadingTextDiv.style.height="20px",
		// this._loadingTextDiv.style.fontFamily="Arial",
		// this._loadingTextDiv.style.fontSize="14px",
		// this._loadingTextDiv.style.color="white",
		// this._loadingTextDiv.style.textAlign="center",
		// this._loadingTextDiv.innerHTML="Loading",
		// this._loadingDiv.appendChild(this._loadingTextDiv);
        
        // if(G.guiMain == null) return;

        // var size = 5.0;

        // this.wrapper = new BABYLON.GUI.Rectangle();
        // this.wrapper.thickness = 0;
        // this.wrapper.width = px(window.innerWidth*size);
        // this.wrapper.height = px(window.innerHeight*size);

        // var backGroundCover = new BABYLON.GUI.Rectangle();
        // backGroundCover.width = 2;
        // backGroundCover.height = 2;
        // backGroundCover.thickness = 0;
        // backGroundCover.background = '#000000';
        // backGroundCover.alpha = 0.5;
        // this.wrapper.addControl( backGroundCover );

        // G.guiMain.addControl(this.wrapper);

        // var loadingImg = GUI.CreateImage( 'loading', px(0), px(0), px(100), px(100), 'Assets/99_Images/loading.png', GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        // this.wrapper.addControl( loadingImg );
    }

    FMyLoadingScreen.prototype.hideLoading = function(){

        if(G.guiMain == null) return;
        if(this.wrapper == null) return;

        G.guiMain.removeControl(this.wrapper);
    }

    FMyLoadingScreen.prototype.displayLoadingUI = function() {
        
    };

    FMyLoadingScreen.prototype.displayLoadingUI = function() {
        
    };

    FMyLoadingScreen.prototype.hideLoadingUI = function() {
        
    };

    FMyLoadingScreen.prototype.destroy = function() {

    }

    FMyLoadingScreen.prototype.run = function () {

    }


    return FMyLoadingScreen;

}());


function MyLoadingScreen( /* variables needed, for example:*/ text) {
    //init the loader
    this.loadingUIText = text;
    this.div = null;
}

MyLoadingScreen.prototype.displayLoadingUI = function() {
    // alert(this.loadingUIText);

    // $("#loading").hide();

    // $("#loading").show();

    $("#fadeScreen").show();
    // $("#BJSLoader").show();

};

MyLoadingScreen.prototype.hideLoadingUI = function() {
    // alert("Loaded!");

    // $("#loading").hide();

    $("#fadeScreen").hide();

    // $("#BJSLoader").hide();
};


function sysInfo(msg) {

    var div = document.getElementById("vsns_info");

    if(div == null) return;
    div.innerHTML = msg;

    $("#vsns_info").show();

    setTimeout(function(){

        $("#vsns_info").hide();

    }, 3000);


}



