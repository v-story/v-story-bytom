//createjs.Tween.get(camera).to({ alpha: Math.PI, radius: 20 }, 1000);

'use strict';

var FFBabylon = (function () {
    function FFBabylon() {
        this.ssao = null;

        //shadow
        this.shadowGenerator = null;
        this.shadowLight = null;

        //highLightLayer
        this.highLightLayer = null;

        this.highLightMesh = [];
    }

    FFBabylon.prototype.initBabylon = function () {
        BABYLON.Engine.ShadersRepository = ASSET_URL + "80_shaders/";
    };

    //hightLayer
    FFBabylon.prototype.createHighLightLayer = function() {
        
        if(this.highLightLayer) this.highLightLayer.dispose();

        this.highLightLayer = new BABYLON.HighlightLayer("hl", G.scene);
    }


    FFBabylon.prototype.addHighlightMesh = function(mesh, color3) {
        
        if(this.highLightLayer == null) { 

            Debug.Error('addHighlightMesh : 하이라이트 레이어를 먼저 생성해 주길 바래요');
            return;
        }

        for(var i=0; i<this.highLightMesh.length; i++) {
            if(this.highLightMesh[i] == mesh) return;
        }

        this.highLightMesh.push(mesh);
        this.highLightLayer.addMesh(mesh, color3); //BABYLON.Color3.Green()
    }

    FFBabylon.prototype.removeHighlightMesh = function(mesh) {

        if(this.highLightLayer == null) {
            Debug.Error('removeHighlightMesh : 하이라이트 레이어를 먼저 생성해 주길 바래요');
            return;
        }

        this.highLightLayer.removeMesh(mesh);
        for(var i=0; i<this.highLightMesh.length; i++) {
            if(this.highLightMesh[i] == mesh) {
                CommFunc.arrayRemove(this.highLightMesh, mesh);
                return;
            }
        }
    }

    FFBabylon.prototype.destroyShadow = function() {
        this.shadowLight = null;
        this.shadowGenerator.dispose();
        this.shadowGenerator = null;
    }

    //shadow
    FFBabylon.prototype.createShadow = function(light) {
        if(light == null) {
            Debug.Error('FFBabylon.prototype.initShadow : light is null');
            return;
        }

        if (light.getTypeID() === BABYLON.Light.LIGHTTYPEID_HEMISPHERICLIGHT) {
            Debug.Error('HEMISPHERICLIGHT is not to be shadow light!!');
            return;
        }

        this.shadowLight = light;
        this.shadowGenerator = new BABYLON.ShadowGenerator(2048, light);

        // this.shadowGenerator.useBlurExponentialShadowMap = true;
        // this.shadowGenerator.useKernelBlur = true;
        // this.shadowGenerator.blurKernel = 64;
        
        // this.shadowGenerator.useBlurCloseExponentialShadowMap = true;
        // // light.shadowMinZ = 5    
        // // light.shadowMaxZ = 10
        
        // this.shadowGenerator.usePoissonSampling = true;
        // this.shadowGenerator.useVarianceShadowMap = true;
    }

    FFBabylon.prototype.setShadowScene = function(onlyReceiveShadowFunction) {
        
        if(this.shadowGenerator == null) return;
        
        for(var i=0; i<G.scene.meshes.length; i++) {

            if(onlyReceiveShadowFunction(G.scene.meshes[i])) {
                G.scene.meshes[i].receiveShadows = true;     
            } else {
                this.shadowGenerator.getShadowMap().renderList.push(G.scene.meshes[i]);
                G.scene.meshes[i].freezeWorldMatrix();
                G.scene.meshes[i].receiveShadows = true; 
            }
        }
    }

    FFBabylon.prototype.pushShadeowList = function(mesh) {
        if(this.shadowGenerator == null) return;

        mesh.receiveShadows = true;
        this.shadowGenerator.getShadowMap().renderList.push(mesh);
    }

    //shader
    FFBabylon.prototype.setShader = function(mesh) {
        var shader = new BABYLON.ShaderMaterial("gradient", G.scene, "gradient", {});
        shader.setFloat("offset", 200);
        shader.setColor3("topColor", BABYLON.Color3.FromInts(0,119,255));
        shader.setColor3("bottomColor", BABYLON.Color3.FromInts(240,240, 255));
        shader.backFaceCulling = false;
        mesh.material = shader;
    }


    //ssao
    FFBabylon.prototype.createSSAO = function(name){
        
        var ssaoRatio = {
            ssaoRatio: 0.5, // Ratio of the SSAO post-process, in a lower resolution
            combineRatio: 1.0 // Ratio of the combine post-process (combines the SSAO and the scene)
        };

        this.ssao = new BABYLON.SSAORenderingPipeline(name, G.scene, ssaoRatio);
        this.ssao.fallOff = 0.000001;
        this.ssao.area = 1;
        this.ssao.radius = 0.0001;
        this.ssao.totalStrength = 1.0;
        this.ssao.base = 0.5;

        // Attach camera to the SSAO render pipeline
        G.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(name, G.camera);
    }

    FFBabylon.prototype.enableSSAO = function(name) {

        if(null == this.ssao) return;
        
        G.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(name, G.camera);
        G.scene.postProcessRenderPipelineManager.enableEffectInPipeline(name, this.ssao.SSAOCombineRenderEffect, G.camera);
    }

    FFBabylon.prototype.disableSSAO = function(name) {
        G.scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(name, G.camera);
        //this.ssao.dispose();
    }

    FFBabylon.prototype.createReflectionMaterial = function(name) {
        var reflectionMaterial = new BABYLON.StandardMaterial(name, G.scene);
        reflectionMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirror", 1024, G.scene, true);
        // reflectionMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1.0, 0, 0);
        reflectionMaterial.reflectionTexture.level = 0.2;
        reflectionMaterial.alpha = 0.9;
        reflectionMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        //reflectionMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        return reflectionMaterial;
    }


    FFBabylon.prototype.changeTexture = function(mesh, textureName) {

        if(mesh.material.diffuseTexture) mesh.material.diffuseTexture.dispose();
        mesh.material.diffuseTexture  = new BABYLON.Texture(textureName, G.scene);
    } 

    FFBabylon.prototype.changeSceneTexture = function(texture) {    
        var allMeshChange = false;    
        var i = 0;    
        while(!allMeshChange){        
            if(G.scene.meshes[i].material.diffuseTexture) G.scene.meshes[i].material.diffuseTexture.dispose();        
            G.scene.meshes[i].material.diffuseTexture = new BABYLON.Texture(texture, G.scene);        
            allMeshChange = i == G.scene.meshes.length - 1;        
            i++;    
        }              
    }
    

    FFBabylon.prototype.changeMaterialTexture = function( in_material, in_changeTextureURL )
    {
        if(in_material.diffuseTexture) 
            in_material.diffuseTexture.dispose();

        in_material.diffuseTexture  = new BABYLON.Texture(in_changeTextureURL, G.scene);
    }


    return FFBabylon;
}());
var FBabylon = new FFBabylon();



