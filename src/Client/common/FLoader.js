'use strict';

var Loader = {};

Loader.PickableList = [];

Loader.refCount = 0;

Loader.setPickable = function(name) {
    Loader.PickableList = name;
}

Loader.pushPickable = function(name) {
    Loader.PickableList.push(name);
}

Loader.clearPickable = function() {
    CommFunc.arrayRemoveAll(Loader.PickableList);
}

// Loader.Scene = function(location, name, debugview, callback, self) {
    
// //    BABYLON.SceneLoader.ForceFullSceneLoadingForIncremental = true; //이건 뭔지 아직 모른다.

//     G.engine.resize();
//     var dlCount = 0;
//     var scene_name = name;
    
//     BABYLON.SceneLoader.Load(location, name, G.engine, function (newScene) {
//         // G.scene.dispose();
//         G.scene = newScene;

//         Debug.Log(scene_name + "서버에서 불러오기 완료");
//         G.scene.meshes.forEach(function(mesh){
//             mesh.freezeWorldMatrix();
//             if(mesh.material) {
//                 // mesh.material.freeze();
//                 // mesh.convertToUnIndexedMesh();
//                 mesh.material.backFaceCulling = true;
//             }

//             if(mesh.name != "ir_myroom") {
//                 mesh.isPickable = false;
//             }

//             Loader.PickableList.forEach(function(name){
//                 if(mesh.name != name) {
//                     mesh.isPickable = true;
//                 }
//             });
            
//         });
//         // G.scene.freezeActiveMeshes();
//         // G.scene.freezeMaterials();
//         G.scene.autoClear = false; // Color buffer
//         G.scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously

//         Loader.text = name+" 로딩 완료";
//         drawInformation(Loader.text);
//         G.scene.executeWhenReady(function () {
//             G.assetsManager = new BABYLON.AssetsManager(G.scene);
//             G.canvas.style.opacity = 1;
//             if (G.scene.activeCamera) {
//                 G.scene.activeCamera.attachControl(G.canvas, true); //마지막인자가 false 마우스 클릭 이벤트가 발생하지 않는다..
//             }
//             else{
//                 //여기는 아직 테스트 안되어 있음
//                 // var campos = G.scene.activeCamera.position;
//                 // var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, campos, G.scene);
//                 // G.scene.activeCamera = camera;
//                 // G.scene.activeCamera.attachControl(G.canvas, true);
//             }

//             if (debugview)
//                 G.scene.debugLayer.show();
//             if (callback)
//                 callback(self);

                            
//         });
//     }, function (evt) {
//         if (evt.lengthComputable) {
//             // G.engine.loadingUIText = "Loading, please wait..." + (evt.loaded * 100 / evt.total).toFixed() + "%";
//             G.engine.loadingUIText = "콘텐츠 다운로드 중입니다..." + (evt.loaded * 100 / evt.total).toFixed() + "%";
//         }
//         else {
//             dlCount = evt.loaded / (1024 * 1024);
//             G.engine.loadingUIText = "콘텐츠 다운로드 중입니다..." + Math.floor(dlCount * 100.0) / 100.0 + " MB already loaded.";
//             // G.engine.loadingUIText = "Loading, please wait..." + Math.floor(dlCount * 100.0) / 100.0 + " MB already loaded.";
//         }
//     });
//     G.canvas.style.opacity = 0;
// }



// Loader.Mesh = function(location, name, callback) {
//     BABYLON.SceneLoader.ImportMesh("", location, name, G.scene, function (newMeshes, particleSystems, skeletons) {
//         //engine.hideLoadingUI();
//         // newMeshes[0].position = new BABYLON.Vector3(0,0,0);
//         // newMeshes[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
//         if (callback)
//             callback(newMeshes);
//     }, function () {
//         //engine.displayLoadingUI();
//     });
// }
Loader.READY = 1;
Loader.LOADING = 2;

Loader.procTimerId = null;
Loader.queue = new buckets.Queue();
Loader.procTimerId = null;
Loader.state = Loader.READY;
Loader.text = null;
Loader.Thread = function(self) {
    
    if(Loader.state != Loader.READY) return;
    if(0 == this.queue.size()) {

        if(this.procTimerId) {
             clearInterval(this.procTimerId);
             this.procTimerId = null;
        }
        G.engine.hideLoadingUI();
        return;
    }
    
    var req = this.queue.dequeue();

    // console.log(req.location+ req.name+"로딩시작");
    Loader.text = req.location+ req.name+"로딩 시작";
    Loader.state = Loader.LOADING;
    BABYLON.SceneLoader.ImportMesh("", req.location, req.name, req.scene, function (newMeshes, particleSystems, skeletons) {

        for(var i=0; i<newMeshes.length; i++){
            newMeshes[i].isVisible = false;
        }
        
        if (req.callback)
            req.callback(newMeshes, particleSystems, skeletons, req.lparam, req.pparam);

        Loader.text = req.location+ req.name+"로딩 완료";
        Loader.state = Loader.READY;

        // drawInformation(Loader.text);

    }, function ( in_event ) {
        
        Loader.text = req.location+ req.name+"로딩 중" + "(" + in_event.loaded.toString() + "/" + in_event.total.toString() + ") ...."
         + parseInt( (in_event.loaded/in_event.total)*100 ) + "%";
        drawInformation(Loader.text);
    });
}



Loader.Mesh = function(location, name, lparam, pparam, activeScene, callback) {

    var scene = null;

    if(activeScene != null) {
        scene = activeScene;
    } else {
        scene = G.scene;
    }

    // var reqfunc = {
    //     'location'  : location,
    //     'name'      : name,
    //     'lparam'    : lparam,
    //     'pparam'    : pparam,
    //     'callback'  : callback,
    //     'scene'     : scene
    // };

    // var self = this;
    // this.queue.add(reqfunc);

    // if(this.procTimerId == null) {
    //     this.procTimerId = setInterval(function(){
    //         Loader.Thread(self)
    //     }, 10);
    // }

    Loader.refCount++;
    console.log("Loader.refCount = " + Loader.refCount);
    
    BABYLON.SceneLoader.ImportMesh("", location, name, scene, function (newMeshes, particleSystems, skeletons) {

        for(var i=0; i<newMeshes.length; i++){
            newMeshes[i].isVisible = false;
        }

        if (callback)
            callback(newMeshes, particleSystems, skeletons, lparam, pparam);

        Loader.text = location+ name+"로딩 완료";
        Loader.state = Loader.READY;

        Loader.refCount--;
        console.log("Loader.refCount = " + Loader.refCount);
        // drawInformation(Loader.text);

    }, function ( in_event ) {
        
        Loader.text = location+ name+"로딩 중" + "(" + in_event.loaded.toString() + "/" + in_event.total.toString() + ") ...."
         + parseInt( (in_event.loaded/in_event.total)*100 ) + "%";
        // drawInformation(Loader.text);
    });


}




// Loader.ImportMesh = function(meshName, location, name, lparam, pparam, callback) {
//     BABYLON.SceneLoader.ImportMesh(meshName, location, name, G.scene, function (newMeshes, particleSystems, skeletons) {
//         //engine.hideLoadingUI();
//         // newMeshes[0].position = new BABYLON.Vector3(0,0,0);
//         // newMeshes[0].scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);

//         ////Auto-LOD 해봤는데 이상하다.
//         // newMeshes.forEach( function( in_iter)
//         // {
//         //     if ( in_iter.subMeshes != undefined )
//         //     {
//         //         in_iter.simplify([{ quality: 0.9, distance: 25 }, { quality: 0.3, distance: 50 }], 
//         //         false, BABYLON.SimplificationType.QUADRATIC, function() {
//         //                 console.log( "LOD finisehd, let's have a beer!");
//         //         });
//         //     }
//         // });

//         for(var i=0; i<newMeshes.length; i++){
//             newMeshes[i].isVisible = false;
//         }

//         if (callback)
//             callback(newMeshes, particleSystems, skeletons, lparam, pparam);
//     }, function () {
//         //engine.displayLoadingUI();
//     });
// }













Loader.File = function(url, callback) {

    BABYLON.Tools.LoadFile(url, callback);
}


Loader.JsonAsync = function (url, callback) {

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    var that = this;
    xmlhttp.onreadystatechange = function () {
        if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // jsonObject = JSON.parse(xmlhttp.responseText);
            // callback(that.CreateMeshesFromJSON(jsonObject));
            callback(xmlhttp.responseText);
        }
    };
    xmlhttp.send(null);
};

/*
var palm = loader.addMeshTask('palm', "", "/static/game/g6/", "tree.babylon");
palm.onSuccess = function (task) {
        var p = task.loadedMeshes[0];
        p.position   = new BABYLON.Vector3(25, -2, 25);
        var p1 = p.clone('p1');
        p1.position = new BABYLON.Vector3(10, -2, 20);
        var p2 = p.clone('p2');
        p2.position = new BABYLON.Vector3(15, -2, 30);
};

*/


/*
        loadFile(ASSET_URL+"99_data/Sheet1.data", function(data){
        
            console.log(data);

            var jdataview = new jDataView(data, 0, data.length, true);

            var typeSet = {
                RFID : 'int16',
                type : 'int8',
                name : 'string'
            };

            var fd = Loader.BinaryData(jdataview, typeSet);
        });
*/

/*
Loader.BinaryData = function(jdataview, typeSet) {
    
    var DATA = new Array();

    var length = jdataview.getInt16(); //total length
    var key;
    var value;
    var strlen;
    for(var i=0; i<length; i++) {

        var len = Object.keys(typeSet).length;
        var column = {};
        for(var j=0; j<len; j++) {

            key = Object.keys(typeSet)[j];
            value = Object.values(typeSet)[j];
            switch(value) {
                case "int8":
                    data = jdataview.getInt8();
                    eval('column.'+key+'='+data);
                    break
                case "int16":
                    data = jdataview.getInt16();
                    eval('column.'+key+'='+data);
                    break;
                case "string":
                    strlen = jdataview.getInt32();
                    data = jdataview.getString(strlen);
                    eval('column.'+key+'= "'+data+'"');
                    break;
                //아래 데이타형 계속 추가..                    
            }
        }

        DATA.push(column);
    }

    return DATA;
}
 */

