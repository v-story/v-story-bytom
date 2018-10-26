'use strict';

var gooraRekognitionTick = null;

var RETRUN_TO_NONE = 0;
var RETURN_TO_MYROOM = 1;
var RETURN_TO_BEACH = 10;

// function decal(name, mesh, position, url) {

//     var decalMaterial = new BABYLON.StandardMaterial("decalMat", G.scene);
//     decalMaterial.diffuseTexture = new BABYLON.Texture(url, G.scene);
//     decalMaterial.diffuseTexture.hasAlpha = true;
//     decalMaterial.zOffset = -1;
//     var decalSize = new BABYLON.Vector3(10, 10, 10);
//     var point1 = new BABYLON.Vector3(-18.13389,28.103452,-8.2552238);
//     var newDecal1 = BABYLON.Mesh.CreateDecal("decal1", mesh, position, new BABYLON.Vector3(0,0,1), decalSize);
//     newDecal1.material = decalMaterial;

// }

//500000
var TEXTURE_CUSTOM_TYPE =
{
    BOTH : 0,
    FRONT : 1,
    BACK : 2,
};

var FSceneAvatar = (function () {

    __inherit(FSceneAvatar, FScene);

    function FSceneAvatar(bUpdate, returnScene) {

        this.wrapContents = null;
        this.mainScrollView = null;

        this.setName('avatar');
        G.eventManager.setEnableTouched(this.name, this);

        this.selectedInterest = [];
        this.maxCount = 5;

        this.avatar = null;

        this.cacheSoloPointer;
        this.angularSensibilityX = 100.0; //회전 민감도

        this.cameraArrivePos = new BABYLON.Vector3(0, 0, -100);
        this.isCameraMove = null;
        this.cameraPosIndex = 0;

        this.aniOrder = 0;

        this.skybox = null;

        this.bUpdate = bUpdate;
        this.returnScene = returnScene;

        this.backBtn = null;
        this.nextBtn = null;

        this.startTime = null;

        this.textureCustomPopup = 
        {
            wrapper : null,

            bg : null,
            bothBtn : null,
            frontBtn : null,
            backBtn : null,

            curParts : null,

            closeBtn : null,
        }

        this.currentSelectedParts = null;

        this.customTextureClothBtn = null;
        this.faceCapterBtn = null;

        this.lastTakeFacePicture = null;
    }

    FSceneAvatar.prototype.init = function() {

        FScene.prototype.init.call(this);

        var self = this;

        G.engine.displayLoadingUI();

        CommFunc.createSceneInstrumentaion(G.scene);

        G.camera.inputs.clear(); 
        G.camera = new BABYLON.ArcRotateCamera('Camera', 0,0, 21, BABYLON.Vector3.Zero(), G.scene);
        
        G.camera.setPosition( this.cameraArrivePos );
        
        G.camera.inputs.remove(G.camera.inputs.attached.pointers);
        G.camera.inputs.remove(G.camera.inputs.attached.mousewheel);

        G.camera.attachControl(G.canvas,true);

        // CommRender.showAxis(G.scene, 50);

        var light = new BABYLON.HemisphericLight("Hemispheric_avatar", new BABYLON.Vector3(0, 1, 0), G.scene);
        light.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
        light.specular = new BABYLON.Color3(0.2, 0.2, 0.2);
        light.groundColor = new BABYLON.Color3(0.5, 0.5, 0.4);
        light.intensity = 1.0;
    
        light = new BABYLON.DirectionalLight("Dir0_avatar", new BABYLON.Vector3(-4, -4, 4), G.scene);
        light.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
        light.specular = new BABYLON.Color3(0.2, 0.2, 0.2);
        light.position = new BABYLON.Color3(0, 0, 0);
        light.intensity = 0.8;
    
        light = new BABYLON.DirectionalLight("Dir1_avatar", new BABYLON.Vector3(4, -4, 4), G.scene);
        light.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
        light.specular = new BABYLON.Color3(0.2, 0.2, 0.2);
        light.position = new BABYLON.Color3(0, 0, 0);
        light.intensity = 0.8;
    
        light = new BABYLON.DirectionalLight("Dir2_avatar", new BABYLON.Vector3(0, -4, -4), G.scene);
        light.diffuse = new BABYLON.Color3(0.8, 0.8, 0.8);
        light.specular = new BABYLON.Color3(0.2, 0.2, 0.2);
        light.position = new BABYLON.Color3(0, 0, 0);
        light.intensity = 0.8;
    
        G.scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);

        this.initBackground();
        // CommRender.showAxis(G.scene, 50);
        // //아바타를 미리 로딩
        // var objID = null;
        // if(this.gender == 1) objID = 500000;
        // else if(this.gender == 2) objID = 510000;
        // G.resManager.loadResAvatar(objID, self, function(self){

        //     self.preloadAvatar();

        // });

        this.loadTextureCustomPopup();

        G.resManager.loadBaseAvatar(self, function(self){

            self.initAvatar();
            self.renderButton();
            G.engine.hideLoadingUI();

        });
    }

    FSceneAvatar.prototype.destroy = function() {
        
        FScene.prototype.destroy.call(this);

        G.eventManager.clearEnableTouched(this.name);
        this.closePopup();
        G.camera.inputs.clear(); 
        G.camera.dispose();

        // CommFunc.detachCamera();
        CommFunc.removeLight();

        // G.resManager.clearScene();
        // G.resManager.clearChildren();

        this.skybox.dispose();
        this.avatar.clearMesh();
        this.avatar.destroy();

        G.runnableMgr.remove(this);
    }

	FSceneAvatar.prototype.initAvatar = function() {

        var self = this;
        var cd = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).avatarCd;

        var avatarInfo = G.resManager.getAvatarCode(cd);
        if(cd == 0) {

            var gender = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).gender;
            avatarInfo.gender = gender;

            G.dataManager.getUsrMgr(DEF_IDENTITY_ME).avatarCd = G.resManager.makeAvatarCode(avatarInfo);
        }

        this.avatar = new FCharactor('AvatarScene');
        this.avatar.setPk( G.dataManager.getUsrMgr(DEF_IDENTITY_ME).accountPk );
        this.avatar.createAvatar(avatarInfo, function(){

            G.runnableMgr.add(self);
            // self.avatar.setTouchEvent( self, self.avatar, self.touchAvatar );
            // self.startTime = new Date().getTime();
            self.avatar.setPosition(new Vector3(G.camera.position.x, -13.5, 0));
            self.avatar.startAnimation(SKELETON.IDLE, true);
        });
    }

    FSceneAvatar.prototype.touchAvatar = function(e, lparam, pparam) {

        var self = lparam;

        if(e != 'OnPickUpTrigger') return;

        if(!self.avatar.isCurrentAction(SKELETON.IDLE)) return;
        
        if(self.aniOrder == 0) self.avatar.startAnimation(SKELETON.LAUGH, false, true);
        else if(self.aniOrder == 1) self.avatar.startAnimation(SKELETON.ANGLY, false, true);
        else if(self.aniOrder == 2) self.avatar.startAnimation(SKELETON.SAD, false, true);

        var n = 4;
        self.aniOrder = (self.aniOrder + 1) % (n-1);
    }

    FSceneAvatar.prototype.changeAvatarParts = function( in_changeParts, in_chagneAvatarID )
    {
        var self = this;

        this.avatar.addChangeParts( in_changeParts, in_chagneAvatarID );

        this.avatar.excuteChangeParts(self, function(This){
            // This.avatar.startAnimation(SKELETON.IDLE, true, false);
            This.setAnimation(in_changeParts);
        });
    }

    FSceneAvatar.prototype.setAnimation = function(parts) {

        // if(this.avatar.getCurrentAction() != SKELETON.IDLE) { 
        //     this.avatar.removeMechanim();
        //     this.avatar.startAnimation(SKELETON.IDLE, true, false);
        // }

        this.avatar.removeMechanim();

        if(parts == PARTS_UPPER) {
            this.avatar.startAnimation(SKELETON.CHANGE_UPPER, false, false);
        } else if(parts == PARTS_LOWER) {
            this.avatar.startAnimation(SKELETON.CHANGE_LOWER, false, false);
        } else if(parts == PARTS_HAIR) {
            this.avatar.startAnimation(SKELETON.CHANGE_HAIR, false, false);
        } else {
            this.avatar.startAnimation(SKELETON.IDLE, true, false);
        }

    }


    FSceneAvatar.prototype.onClickCameraBtn = function()
    {
        var self = this;
        self.zoomCamera( self.cameraPosIndex+1 );
    }

    FSceneAvatar.prototype.zoomCamera = function( in_order )
    {

        var cameraPos = [ {"pos":new BABYLON.Vector3( 0, 0, -70 )},
                          {"pos":new BABYLON.Vector3( 0, 13, -40 )},
                          {"pos":new BABYLON.Vector3( 0, -8, -50 )},
                          {"pos":new BABYLON.Vector3( 0, 0, -120 )}];

        var self = this;
        

        if ( self.isCameraMove != null )
            return;
        
        var startPos = G.camera.position;
        
        self.cameraPosIndex = in_order;
        if ( in_order >= cameraPos.length ) 
            self.cameraPosIndex = 0;

        var targetPos = cameraPos[ self.cameraPosIndex ].pos;

        var frameRate = 120;
        var moveAnimation = new BABYLON.Animation( "movePos", "cameraArrivePos", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var moveAnimationKey = [];
        moveAnimationKey.push( {frame:0, value:startPos});                
        moveAnimationKey.push( {frame:frameRate, value:targetPos});
        moveAnimation.setKeys( moveAnimationKey );
        CommFunc.useEasingFuncToAnimation(moveAnimation);

        self.isCameraMove = G.scene.beginDirectAnimation( self, [moveAnimation], 0, frameRate, false, 1, function()
        {
            self.isCameraMove = null;
            G.camera.setPosition( new BABYLON.Vector3( targetPos.x, targetPos.y, targetPos.z ) );
        } );
    }

    FSceneAvatar.prototype.changeTextureFromCamera = function( in_parts )
    {

    }

    FSceneAvatar.prototype.renderButton = function() 
    {
        if(G.guiMain) 
            G.guiMain.dispose();

        G.guiMain = new GUI.createMainGUI('ADVANCEDDYNAMICTEXTURE');

        var self = this;

        self.closePopup();

        this.wrapContents = GUI.createContainer();
        G.guiMain.addControl(this.wrapContents);

        var zoomBtn = GUI.CreateButton( "zoomBtn", px(-10), px(10), px(97), px(94), ASSET_URL+"97_gui_new/12_avatar/zoom.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        this.wrapContents.addControl(zoomBtn);
        zoomBtn.onPointerUpObservable.add( function()
        {            
            GUI.changeButtonImage( zoomBtn, ASSET_URL+"97_gui_new/12_avatar/zoom.png" );

            self.onClickCameraBtn();            
        });
        zoomBtn.onPointerDownObservable.add( function()
        {
            GUI.changeButtonImage( zoomBtn, ASSET_URL+"97_gui_new/12_avatar/zoom_on.png" );
        });          

        // 카메라 찍기 테스트
        var htmlCameraLink = $("#testCameraLinkHtml");
        var cameraTestBtn = GUI.CreateButton( "cameraTestBtn", px(-10), px(120), px(97), px(94), ASSET_URL+"97_gui_new/12_avatar/photo_customizing.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        this.wrapContents.addControl(cameraTestBtn);
        cameraTestBtn.onPointerUpObservable.add( function()
        {            
            self.openTextureCustomPopup();
        });     
        this.customTextureClothBtn = cameraTestBtn;

        var faceTestBtn = GUI.CreateButton( "faceTestBtn", px(-10), px(120), px(97), px(94), ASSET_URL+"97_gui_new/12_avatar/icon_sample.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        this.wrapContents.addControl(faceTestBtn);
        faceTestBtn.onPointerUpObservable.add( function()
        {      
            gooraRekognitionTick = new Date().getTime(); 
            CommFunc.takePicture( function( in_event )
            {
                self.onTakePictureTestDebug( in_event );
            });
        });
        this.faceCapterBtn = faceTestBtn;
        this.faceCapterBtn.isVisible = false;

        // 여기서부터 윤영수의 실험실 코드 시작==============================================================================

        var lastTakeCircleBtn = GUI.CreateCircleButton('lastTakeCircleBtn', px(25), px(25), px(250), px(250), G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getUrl(), GUI.ALIGN_LEFT, GUI.ALIGN_TOP, false );
        this.wrapContents.addControl(lastTakeCircleBtn);
        lastTakeCircleBtn.isVisible = false;
        this.lastTakeFacePicture = lastTakeCircleBtn;

        var offsetGuideImg = GUI.CreateImage( "offsetGuideImg", px(-10), px(230), px(97), px(94), ASSET_URL+"97_gui_new/12_avatar/offsetmove.png", GUI.ALIGN_LEFT, GUI.ALIGN_TOP );
        this.wrapContents.addControl( offsetGuideImg );
        offsetGuideImg.isVisible = false;
        var offsetGuidLine = new BABYLON.GUI.Line();
        this.wrapContents.addControl( offsetGuidLine );
        offsetGuidLine.color = "white";
        offsetGuidLine.lineWidth = 5;
        offsetGuidLine.dash = [10, 10];
        offsetGuidLine.isVisible = false;

        var editMode = false;
        var offsetMoveBtn = GUI.CreateButton( "offsetMoveBtn", px(-10), px(230), px(97), px(94), ASSET_URL+"97_gui_new/12_avatar/offsetmove.png", GUI.ALIGN_RIGHT, GUI.ALIGN_TOP );
        this.wrapContents.addControl(offsetMoveBtn);
        offsetMoveBtn.onPointerDownObservable.add( function()
        {
            editMode = true;
            GUI.changeButtonImage( offsetMoveBtn, AVATAR_PATH+"moveArea.png" );
            offsetGuideImg.isVisible = true;
          //  offsetGuidLine.isVisible = true;


            offsetMoveBtn.width = px(400);
            offsetMoveBtn.height = px(400);
        });

        offsetMoveBtn.onPointerMoveObservable.add( function( in_coordination )
        {
            if ( !editMode )
                return;

            var ratio = G.guiMain.idealWidth / window.innerWidth;
            offsetGuideImg.left = px( in_coordination.x * ratio - 97/2 );
            offsetGuideImg.top = px( in_coordination.y * ratio - 94/2 ); 

            offsetGuidLine.x1 = -200;
            offsetGuidLine.y1 = 200;
            offsetGuidLine.x2 = in_coordination.x*ratio;
            offsetGuidLine.x2 = in_coordination.y*ratio;


            self.controlFaceElementsOffset( -((in_coordination.x*ratio) / (400)-0.25), ((in_coordination.y*ratio) / (400)) );
        });

        offsetMoveBtn.onPointerUpObservable.add( function()
        {
            editMode = false;

            GUI.changeButtonImage( offsetMoveBtn, AVATAR_PATH+"offsetmove.png" );
            offsetGuideImg.isVisible = false;
           // offsetGuidLine.isVisible = false;

            offsetMoveBtn.width = px(97);
            offsetMoveBtn.height = px(94);
        });


        // 이건 미친 코드이다
        var faceElementsVerticalSlider = new BABYLON.GUI.Slider();
        faceElementsVerticalSlider.name = "faceElementsVerticalSlider";
        faceElementsVerticalSlider.minimum = -0.5;
        faceElementsVerticalSlider.maximum = 0.5;
        faceElementsVerticalSlider.width = "200px";
        faceElementsVerticalSlider.height = "20px";
        faceElementsVerticalSlider.top = "20px";
        faceElementsVerticalSlider.left = "20px";
        faceElementsVerticalSlider.horizontalAlignment = GUI.ALIGN_LEFT;
        faceElementsVerticalSlider.verticalAlignment = GUI.ALIGN_TOP;
        faceElementsVerticalSlider.color = "red";
        faceElementsVerticalSlider.displayThumb = true;
        faceElementsVerticalSlider.value = 0;
        faceElementsVerticalSlider.onValueChangedObservable.add(function(value) {
            self.controlFaceElementsOffset( -faceElementsVerticalSlider.value, -faceElementsHorizontalSlider.value );
        });
        this.wrapContents.addControl(faceElementsVerticalSlider);

        var faceElementsHorizontalSlider = new BABYLON.GUI.Slider();
        faceElementsHorizontalSlider.name = "faceElementsHorizontalSlider";
        faceElementsHorizontalSlider.minimum = -0.5;
        faceElementsHorizontalSlider.maximum = 0.5;
        faceElementsHorizontalSlider.width = "200px";
        faceElementsHorizontalSlider.height = "20px";
        faceElementsHorizontalSlider.top = "150px";
        faceElementsHorizontalSlider.left = "-80px";
        faceElementsHorizontalSlider.horizontalAlignment = GUI.ALIGN_LEFT;
        faceElementsHorizontalSlider.verticalAlignment = GUI.ALIGN_TOP;
        faceElementsHorizontalSlider.color = "red";
        faceElementsHorizontalSlider.displayThumb = true;
        faceElementsHorizontalSlider.value = 0;
        faceElementsHorizontalSlider.rotation = ToRadians(-90);
        faceElementsHorizontalSlider.onValueChangedObservable.add(function(value) {
            self.controlFaceElementsOffset( -faceElementsVerticalSlider.value, -faceElementsHorizontalSlider.value );
        });
        this.wrapContents.addControl(faceElementsHorizontalSlider);

        // 여기까지 윤영수의 실험실 코드 끝==============================================================================


        // new avatar ui
        var cd = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).avatarCd;
        var avatarInfo = G.resManager.getAvatarCode(cd);
        FAvatarCustomUI.getInstance().setDefaultAvatarInfo(avatarInfo);

        FAvatarCustomUI.getInstance().setNotifyCallback( function( in_showTab )
            {
                switch( in_showTab )
                {
                case AC_UI.SHOWPARTS_CLOTH :
                    {
                        // if ( self.cameraPosIndex != 0 )
                            // self.zoomCamera( 0 );

                            
                        self.customTextureClothBtn.isVisible = true;
                        self.faceCapterBtn.isVisible = false;
                    }
                    break;

                case AC_UI.SHOWPARTS_FACE :
                    {
                        // if ( self.cameraPosIndex != 1 )
                            // self.zoomCamera( 1 );

                        self.customTextureClothBtn.isVisible = false;
                        self.faceCapterBtn.isVisible = true;
                    }
                    break;
                }

            }, function( in_curSelectPartsCategory)
            {
                self.currentSelectedParts = in_curSelectPartsCategory;
            }, function( in_changeParts, in_changeAvatarID, in_selectName ) 
            {
                self.textureCustomPopup.curParts = in_changeParts;

                switch( in_changeParts )
                {
                case PARTS_MOUSE :
                case PARTS_EYEBROW :
                case PARTS_EYE :
                    {
                        self.changeFaceElements( in_changeParts, in_selectName );
                    }
                    break;

                default :
                    {
                        self.changeAvatarParts( in_changeParts, in_changeAvatarID ) 
                    }
                    break;
                }
            }, function( in_selectInfoList ){
                //ok
                self.onClickApplyBtnByAvatarUI( in_selectInfoList );
                
            }, function(){
                //reset

            }, function(){ self.onClickCloseBtnByAvatarUI(); } );

        FAvatarCustomUI.getInstance().openUI( true );
    }

    FSceneAvatar.prototype.loadTextureCustomPopup = function()
    {
        var self = this;
        
        this.textureCustomPopup.ui = GUI.createContainer();

        this.textureCustomPopup.bg = GUI.CreateImage("bg", px(0), px(-50), px(593), px(394), AVATAR_PATH + "Photo_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        this.textureCustomPopup.ui.addControl( this.textureCustomPopup.bg );

        this.textureCustomPopup.bothBtn = GUI.CreateButton("bothBtn", px(-190), px(0), px(168), px(193), AVATAR_PATH + "Photo_ico1.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        this.textureCustomPopup.ui.addControl( this.textureCustomPopup.bothBtn );
        this.textureCustomPopup.bothBtn.onPointerUpObservable.add( function()
        {
            self.onClickTextureCustomBtn( TEXTURE_CUSTOM_TYPE.BOTH );
        });

        this.textureCustomPopup.frontBtn = GUI.CreateButton("frontBtn", px(0), px(0), px(168), px(193), AVATAR_PATH + "Photo_ico2.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        this.textureCustomPopup.ui.addControl( this.textureCustomPopup.frontBtn );
        this.textureCustomPopup.frontBtn.onPointerUpObservable.add( function()
        {
            self.onClickTextureCustomBtn( TEXTURE_CUSTOM_TYPE.FRONT );
        });

        this.textureCustomPopup.backBtn = GUI.CreateButton("backBtn", px(190), px(0), px(168), px(193), AVATAR_PATH + "Photo_ico3.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        this.textureCustomPopup.ui.addControl( this.textureCustomPopup.backBtn );
        this.textureCustomPopup.backBtn.onPointerUpObservable.add( function()
        {
            self.onClickTextureCustomBtn( TEXTURE_CUSTOM_TYPE.BACK );
        });

        this.textureCustomPopup.closeBtn = GUI.CreateButton("closeBtn", px(280), px(-230), px(97), px(96), AVATAR_PATH + "x.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        this.textureCustomPopup.ui.addControl( this.textureCustomPopup.closeBtn );
        this.textureCustomPopup.closeBtn.onPointerUpObservable.add( function()
        {
            self.closeTextureCustomPopup();
        });
    }

    FSceneAvatar.prototype.openTextureCustomPopup = function()
    {
        G.guiMain.addControl( this.textureCustomPopup.ui );

        FPopup.openAnimation( this.textureCustomPopup.ui );
    }

    FSceneAvatar.prototype.closeTextureCustomPopup = function()
    {
        G.guiMain.removeControl( this.textureCustomPopup.ui );
    }

    FSceneAvatar.prototype.getTextureCustomCoverImgName = function( in_textureCustomType, in_parts )
    {
        var resultString = "upper";

        switch( in_parts )
        {
        case PARTS_UPPER :
            {
                resultString = "upper";
            }
            break;

        case PARTS_LOWER :
            {
                resultString = "lower"
            }
            break;
        }

        switch( in_textureCustomType )
        {
        case TEXTURE_CUSTOM_TYPE.BOTH :
        case TEXTURE_CUSTOM_TYPE.FRONT :
            {
                resultString += "_f.png";
            }
            break;

        case TEXTURE_CUSTOM_TYPE.BACK :
            {
                resultString += "_b.png";
            }
        }

        return resultString;
    }

    FSceneAvatar.prototype.onClickTextureCustomBtn = function( in_textureCustomType )
    {
        var self = this;
        var coverName = this.getTextureCustomCoverImgName( in_textureCustomType, self.textureCustomPopup.curParts );
        
        // Cropper 에서 이미지조절하고 최종데이터 받는곳
        var applyImgTexture = function( in_imgUrl, in_blob )
        {
            // 이미지업로드
            var uploadParam =
            {   
                "accountPk":G.dataManager.getUsrMgr(0).accountPk,
                "parts":self.textureCustomPopup.curParts,
                "mapping":in_textureCustomType,
                "file":G.dataManager.getUsrMgr(0).accountPk.toString()+"_"+"898812221."+in_blob.type.substring(in_blob.type.lastIndexOf('/')+1, in_blob.type.length).toLowerCase(),
            }
            
            var imgFile = new File([in_blob], uploadParam.file);
            G.resManager.createFormData( "/funfactory-1.0/updateAvatar", imgFile, uploadParam );


            alert( "applyImgTexture!! parts:" + self.textureCustomPopup.curParts.toString() );
            var targetPartsMesh = self.avatar.getMeshPart( self.textureCustomPopup.curParts );

                if ( targetPartsMesh.material.subMaterials )
                {
                    switch( in_textureCustomType )
                    {
                    case TEXTURE_CUSTOM_TYPE.BOTH :
                        {
                            for ( var i = 0; i < targetPartsMesh.material.subMaterials.length; ++i )
                            {
                                FBabylon.changeMaterialTexture( targetPartsMesh.material.subMaterials[i], in_imgUrl );
                            }
                        }
                        break;

                    case TEXTURE_CUSTOM_TYPE.FRONT :
                    case TEXTURE_CUSTOM_TYPE.BACK :
                        {
                            FBabylon.changeMaterialTexture( targetPartsMesh.material.subMaterials[in_textureCustomType-1], in_imgUrl );
                        }
                        break;
                    }                   
                }
                else
                    FBabylon.changeMaterialTexture( targetPartsMesh.material, in_imgUrl );
        }        

        // 카메라 찍고난뒤 받는곳
        var pictureCallback = function( in_event )
        {
            var files = in_event.target.files,
                file;
            if (files && files.length > 0) {
                file = files[0];
            }

            if ( files.length == 0 )
            {
                alert( "picture error!" );
                return;
            }

            try {
                // Create ObjectURL
                var imgURL = window.URL.createObjectURL(file);

                FImageControlManager.getInstance().setCropperData( imgURL, "Assets/99_Images/cropper/"+coverName, applyImgTexture );
                FImageControlManager.getInstance().showCropper();

                return;
                // Revoke ObjectURL
                //URL.revokeObjectURL(imgURL);
            }
            catch (e) 
            {
                // Fallback if createObjectURL is not supported
                var fileReader = new FileReader();
                fileReader.onload = function (event) {
                    //showPicture.src = event.target.result;
                    alert( event.target.result );
                };
                fileReader.readAsDataURL(file);                
            }
        };
        
        this.closeTextureCustomPopup();
        CommFunc.takePicture( pictureCallback );
    }

    FSceneAvatar.prototype.onClickApplyBtnByAvatarUI = function( in_selectInfoList )
    {
        var cd = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).avatarCd;
        var avatarInfo = G.resManager.getAvatarCode(cd);

        var info = in_selectInfoList;
        info.gender = avatarInfo.gender;

        if(!this.bUpdate)
            this.renderInterest( info );
        else {
            this.wsUpdateAvatar( info );
        }

        console.log( JSON.stringify( in_selectInfoList ) );
    }

    FSceneAvatar.prototype.onClickCloseBtnByAvatarUI = function()
    {
        // 씬을 닫아주세요.!
    }
    

    FSceneAvatar.prototype.initBackground = function() {

        //name, imgUrl, scene, isBackground, color
        //this.background = new BABYLON.Layer("fore0", ASSET_URL+"99_Images/avatar_background.png", G.scene);

        var gender = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).gender;

        this.skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:100.0}, G.scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", G.scene);
        skyboxMaterial.backFaceCulling = false;

        if ( gender == Gender.Male )
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(AVATAR_PATH + "skybox/boy/avatar_bg_boy", G.scene);
        else
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(AVATAR_PATH + "skybox/girl/avatar_bg_girl", G.scene);

        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        this.skybox.material = skyboxMaterial;
        this.skybox.position.z = -52;

        this.skybox.scaling = new BABYLON.Vector3( 1.5, 3, 5 );
    }

    FSceneAvatar.prototype.run = function(){
        
        FScene.prototype.run.call(this);
        
        var self = this;
        if ( null != self.mainScrollView )
            self.mainScrollView.procLoop();

        if ( this.isCameraMove != null )
        {
            var beforePos = new Vector3( G.camera.position.x, G.camera.position.y, G.camera.position.z );
            G.camera.setPosition( new Vector3( this.cameraArrivePos.x, this.cameraArrivePos.y, this.cameraArrivePos.z ) );

            var moveDistance = new Vector3( beforePos.x - G.camera.position.x, beforePos.y - G.camera.position.y, beforePos.z - G.camera.position.z );
            G.camera.setTarget( new Vector3( G.camera.target.x - moveDistance.x, G.camera.target.y - moveDistance.y, G.camera.target.z - moveDistance.z ) )
        }

        // CommFunc.drawSceneInstrumentaion();

        // if(this.startTime) {

        //     var curTime = (new Date()).getTime();

        //     if(curTime - this.startTime > 200) {
        //         this.avatar.setPosition(new Vector3(G.camera.position.x, -13.5, 0));
        //         this.avatar.startAnimation(SKELETON.IDLE, true);
        //         this.startTime = 0;
        //     }
        // }

        

        // var ebMesh = this.avatar.getMeshPart( PARTS_EYEBROW );
        // ebMesh.material.diffuseTexture.uOffset += CommFunc.randomMinMax(-100,100)*0.0001;
        // ebMesh.material.diffuseTexture.vOffset += CommFunc.randomMinMax(-100,100)*0.0001;
        
        // var eyeMesh = this.avatar.getMeshPart( PARTS_EYE );
        // eyeMesh.material.diffuseTexture.uOffset += CommFunc.randomMinMax(-100,100)*0.0001;
        // eyeMesh.material.diffuseTexture.vOffset += CommFunc.randomMinMax(-100,100)*0.0001;
        
        // var mouseMesh = this.avatar.getMeshPart( PARTS_MOUSE );
        // mouseMesh.material.diffuseTexture.uOffset += CommFunc.randomMinMax(-100,100)*0.0001;
        // mouseMesh.material.diffuseTexture.vOffset += CommFunc.randomMinMax(-100,100)*0.0001;

    }


    //관심분야 선택
    FSceneAvatar.prototype.renderInterest = function( in_avatarInfo ) {
        
        var conversionRatio = 1.8;

        var self = this;

        self.closePopup();

        this.wrapContents = FPopup.createPopupWrapper( "black", 0.75 );
        G.guiMain.addControl(this.wrapContents, GUI.LAYER.POPUP);
        this.wrapContents.isPointerBlocker = true;
        
        var img = GUI.CreateImage("back", px(0), px(0), px(366*conversionRatio), px(335*conversionRatio), ASSET_URL+"97_gui_new/10_interest/bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        this.wrapContents.addControl(img);

        var text = GUI.CreateText( px(0), px(-140*conversionRatio), "관심 분야 선택", "White", 18*conversionRatio, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);
        

        var text = GUI.CreateText( px(0), px(120*conversionRatio), "회원님에 맞는 환경과 추천 및 소셜퀘스트 등의 \n서비스를 이용 할 수 있습니다.", "Black", 12*conversionRatio, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);
        
        text = GUI.CreateText( px(0), px(140*conversionRatio), "(개인 프로필 설정 화면에서 언제든지 수정이 가능합니다.)", "Red", 10*conversionRatio, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(text);

        // 현재선택한 분야 
        

        var selectCountText = GUI.CreateText( px(150*conversionRatio), px(-100*conversionRatio), this.selectedInterest.length.toString()+"/"+this.maxCount.toString(), "Black", 14*conversionRatio, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl( selectCountText );

        var BTNRESULT = {};
        BTNRESULT.NONE = 0;
        BTNRESULT.ADDED = 1;
        BTNRESULT.REMOVED = 2;
        var onTouchIntersetButton = function( in_touchButtonIndex )
        {
            var result = BTNRESULT.NONE;
            var findIndex = self.selectedInterest.indexOf(in_touchButtonIndex)
            if ( -1 == findIndex )
            {
                if ( self.selectedInterest.length < self.maxCount )
                {    
                    self.selectedInterest.push( in_touchButtonIndex );
                    result = BTNRESULT.ADDED;
                }
            }
            else
            {
                self.selectedInterest.splice( findIndex, 1 );
                result = BTNRESULT.REMOVED;
            }

            selectCountText.text = self.selectedInterest.length.toString()+"/"+self.maxCount.toString();
            return result;
        }


        // 스크롤뷰
        var mainScrollView = new GUI.createScrollView( this.wrapContents, "scrollView", px(-3*conversionRatio), px(6*conversionRatio), px(322*conversionRatio), px(165*conversionRatio), 1.1, true, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        var scrollBar = new GUI.createScrollBar( mainScrollView, "scrollBar",  GUI.DEFAULT_IMAGE_SCROLLBAR_BUTTON, GUI.DEFAULT_IMAGE_SCROLLBAR_BG, px(163*conversionRatio), px(6*conversionRatio), px(3*conversionRatio), px(165*conversionRatio), px(6*conversionRatio), px(20*conversionRatio), GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        mainScrollView.linkScrollBar( scrollBar );
        this.mainScrollView = mainScrollView;

        var normal = GUI.CreateButton( "normal", px(-140*conversionRatio), px(-100*conversionRatio), px(54*conversionRatio), px(22*conversionRatio), ASSET_URL+"97_gui_new/10_interest/btn_normal.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(normal);
        normal.onPointerUpObservable.add( function()
        {

        });

        var feel = GUI.CreateButton( "feel", px(-85*conversionRatio), px(-100*conversionRatio), px(54*conversionRatio), px(22*conversionRatio), ASSET_URL+"97_gui_new/10_interest/btn_feel.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.wrapContents.addControl(feel);
        feel.onPointerUpObservable.add( function()
        {

        });

        // 스크롤뷰에 버튼 추가하기
        var createInterestButton = function ( in_index )
        {
            var imageSource = ASSET_URL+"97_gui_new/10_interest/" + Math.min( 20, (i+1) ).toString() + ".png";
            var btn = GUI.CreateButton( in_index.toString(), px(0), px(0), px(42*conversionRatio*1.75), px(48*conversionRatio*1.75), imageSource, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            mainScrollView.addItem(btn);

            btn.onPointerUpObservable.add( function() 
            {   
                if ( self.mainScrollView.blockTouchForScrolling )
                    return;

                switch( onTouchIntersetButton( parseInt( btn.name ) ) )
                {
                    case BTNRESULT.ADDED : btn.alpha = 0.5; break;
                    case BTNRESULT.REMOVED :  btn.alpha = 1.0; break;
                }
            });
            
        }
        for(var i=0; i<40; i++)
        {
            createInterestButton( i );
        }

        var back = GUI.CreateButton( "avatarsceneBackBtn", px(10), px(-10), px(44*conversionRatio), px(44*conversionRatio), ASSET_URL+"97_gui_new/btn_back2.png", GUI.ALIGN_LEFT, GUI.ALIGN_BOTTOM );
        G.guiMain.addControl(back, GUI.LAYER.POPUP);
        back.onPointerUpObservable.add( function()
        {
            self.selectedInterest = [];
            self.renderButton();
        });
        this.backBtn = back;


        var next = GUI.CreateButton( "avatarsceneNextBtn", px(-10), px(-10), px(44*conversionRatio), px(44*conversionRatio), ASSET_URL+"97_gui_new/btn_next.png", GUI.ALIGN_RIGHT, GUI.ALIGN_BOTTOM );
        G.guiMain.addControl(next, GUI.LAYER.POPUP);
        next.onPointerUpObservable.add( function()
        {
            if(self.selectedInterest.length < self.maxCount) return;

            FPopup.messageBox("이대로 진행하겠습니까?", "선택한 아바타 정보와 관심정보로 설정한 후 VStory 에 접속합니다.", BTN_TYPE.YESNO, function( in_customData, in_result )
            {
                switch( in_result )
                {
                case MSGBOX_BTN_RESULT.CLICK_OK :
                    {
                        self.wsCreateAvatar( in_avatarInfo );
                    }
                    break;
                }
            } );
        });       
        this.nextBtn = next;
        
        FPopup.openAnimation( this.wrapContents, undefined, 1.0 );
        G.soundManager.playPopupOpenSound();
    }

    FSceneAvatar.prototype.closePopup = function()
    {
        if ( this.backBtn != null )
            G.guiMain.removeControl( this.backBtn );
            
        if ( this.nextBtn != null )
            G.guiMain.removeControl( this.nextBtn );

        GUI.removeContainer(this.wrapContents);
        this.wrapContents = null;
    };

    FSceneAvatar.prototype.wsUpdateAvatar = function(info) {
        var json;

        var avatarCD = G.resManager.makeAvatarCode(info);

        json = protocol.updateAvatar(avatarCD);
        ws.onRequest(json, this.updateAvatarCB, this);
    }

    FSceneAvatar.prototype.updateAvatarCB = function(res, self) {

        protocol.res_updateAvatar(res);

        if(self.returnScene == RETURN_TO_MYROOM) {

            G.sceneMgr.addScene('SCENE_MYROOM', new FSceneMyRoom());
            G.sceneMgr.changeScene('SCENE_MYROOM', true);

            // G.sceneMgr.addScene('SCENE_ROOM', new FSceneRoom(true));
            // G.sceneMgr.changeScene('SCENE_ROOM', true);

        } else if(self.returnScene == RETURN_TO_BEACH) {

            G.sceneMgr.addScene('SCENE_BEACH', new FSceneBeach());
            G.sceneMgr.changeScene('SCENE_BEACH', true);            
        }
    }


    FSceneAvatar.prototype.wsCreateAvatar = function(info) {

        var json;

        //관심분야는 1부터
        //나중에 바꿔야 한다.
        for(var i=0; i<this.selectedInterest.length; i++) {
            this.selectedInterest[i] += 1;
        }

        var avatarCD = G.resManager.makeAvatarCode(info);

        json = protocol.createAvatar(avatarCD, this.selectedInterest);
        ws.onRequest(json, this.createAvatarCB, this);
    }

    FSceneAvatar.prototype.createAvatarCB = function(res, self) {

        protocol.res_createAvatar(res);

        // G.sceneMgr.addScene('SCENE_ROOM', new FSceneRoom(true));
        // G.sceneMgr.changeScene('SCENE_ROOM', true);

        G.sceneMgr.addScene('SCENE_MYROOM', new FSceneMyRoom());
        G.sceneMgr.changeScene('SCENE_MYROOM', true);
    }
    


    FSceneAvatar.prototype.onPointerDown = function(evt) {
        if (evt.button !== 0) {
            return;
        }
        this.cacheSoloPointer = { x: evt.clientX, y: evt.clientY, pointerId: evt.pointerId, type: evt.pointerType };
    }


    FSceneAvatar.prototype.onPointerUp = function(evt) {
        if (evt.button !== 0) {
            return;
        }

        this.cacheSoloPointer = null;
    }

    FSceneAvatar.prototype.onPointerMove = function(evt) {

        // if (evt.button !== 0) {
        //     return;
        // }


        if(this.cacheSoloPointer == null) return;
        var offsetX = evt.clientX - this.cacheSoloPointer.x;
        var offsetY = evt.clientY - this.cacheSoloPointer.y;

        var inertialAlphaOffset = -1 * (offsetX / this.angularSensibilityX);

        // console.log("inertialAlphaOffset = " + inertialAlphaOffset);

        this.avatar.setRotation(new Vector3(0, this.avatar.getMainMesh().rotation.y + inertialAlphaOffset,0));

        this.cacheSoloPointer.x = evt.clientX;
        this.cacheSoloPointer.y = evt.clientY;

    }

    FSceneAvatar.prototype.viewFace = function()
    {

    }

    FSceneAvatar.prototype.viewUIMode = function()
    {

    }

    FSceneAvatar.prototype.viewFullMode = function()
    {

    }

    FSceneAvatar.prototype.onResize = function()
    {
    }

    FSceneAvatar.prototype.changeFaceElements = function( in_faceElementsParts, in_textureName )
    {
        var targetMesh = this.avatar.getMeshPart( in_faceElementsParts );
        FBabylon.changeMaterialTexture( targetMesh.material, AVATAR_PATH+"icon/"+in_textureName+".png" );
        targetMesh.material.diffuseTexture.hasAlpha = true;
    }

    FSceneAvatar.prototype.controlFaceElementsOffset = function( in_uOffset, in_vOffset )
    {   
        if ( this.currentSelectedParts == null )
            return; 

        var targeMesh = this.avatar.getMeshPart( this.currentSelectedParts );

        if ( targeMesh.material.subMaterials )
        {
            for ( var i = 0; i < targeMesh.material.subMaterials.length; ++i )
            {
                targeMesh.material.subMaterials[i].diffuseTexture.uOffset = in_uOffset;
                targeMesh.material.subMaterials[i].diffuseTexture.vOffset = in_vOffset;   
            }
        }
        else
        {
            targeMesh.material.diffuseTexture.uOffset = in_uOffset;
            targeMesh.material.diffuseTexture.vOffset = in_vOffset;
        }        
    }

    FSceneAvatar.prototype.onTakePictureTestDebug = function( in_event )
    {
        var self = this;

        var files = in_event.target.files,
            file;
        if (files && files.length > 0) {
            file = files[0];
        }

        if ( files.length == 0 )
        {
            alert( "picture error!" );
            return;
        }

        try 
        {
            // Create ObjectURL
            var imgURL = window.URL.createObjectURL(file);

            GUI.changeButtonImage( self.lastTakeFacePicture.getChildByName("lastTakeCircleBtn"), imgURL );
            self.lastTakeFacePicture.isVisible = true;

            var takeTime = new Date().getTime() - gooraRekognitionTick;
            if( takeTime < 5000 )
            {
                console.log( takeTime.toString() + " 실장님껄로 얼굴인식!" );
            }
            else if ( takeTime < 10000 )
            {
                console.log( takeTime.toString() + " 이사님껄로 얽루인식!" );  
            }
            else
            {
                console.log( takeTime.toString() + " 얼굴을 인식을 못하겠어!!!!1" );
            }

        }
        catch (e) 
        {
            // Fallback if createObjectURL is not supported
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                //showPicture.src = event.target.result;
                alert( event.target.result );
            };
            fileReader.readAsDataURL(file);                
        }
    }


    return FSceneAvatar;

}());