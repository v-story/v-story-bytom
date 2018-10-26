'use strict';

var CAMERA_ANIFRAME = 120;
var CAMERA_MOVE_SENSITIVITY = 0.1;
var CAMERA_ZOOM_SENSITIVITY = 0.05;
var CAMERA_REVISION_HEIGHT = 18;

var FCameraManager = (function()
{
    function FCameraManager()
    {
        this.perspectiveType = {"FP":0,"TP":1,"Free":2};
        this.currentPerspective = this.perspectiveType.Free;

        this.FPTPTarget = null;
        this.keyMap = {};

        G.runnableMgr.add(this);

        this.targetZoom = 0;
        this.lastTarget = null;

        this.secondCamera = null;
        this.secondCameraTargetMesh = null;

        this.betaAni = null;


        // target
        this.targetData =
        {
            prevTargetPos : null,
            prevCameraPos : null,
            prevRadius : null,

            targetPos : null,
            targetRadius : null,

            animation : null,
            onAniEndFunc : null,
            playingAni : false,

            mesh : null,
        }

        this.currentInfo =
        {
            x : 0,
            y : 0,
            z : 0,
            radius : 0,
        }

        this.limitInfo = 
        {
            x : {min:0, max:0, default:0},
            z : {min:0, max:0, default:0},
            radius : {min:0, max:0, default:0},
            alpha : {min:0, max:0, default:0},
            beta : {min:0, max:0, default:0},
        }
    }

    FCameraManager.prototype.destroy = function() 
    {
        G.runnableMgr.remove(this);
    }

    /**
     * 
     * @param {Number} in_minX  // 카메라 최소X
     * @param {Number} in_maxX  // 카메라 최대X
     * @param {Number} in_minZ  // 카메라 최소Z
     * @param {Number} in_maxZ  // 카메라 최대Z
     * @param {Number} in_minRadius  // 최소 줌 수치 (이 값보다 가까워질 수 없음)
     * @param {Number} in_maxRadius  // 최대 줌 수치 (이 값보다 멀어질 수 없음)
     * @param {Number} in_alpha  // 카메라 좌우각
     * @param {Number} in_beta  // 카메라 상하각
     */
    FCameraManager.prototype.setCameraLimitInfo = function( in_minX, in_maxX, in_minZ, in_maxZ, in_minRadius, in_maxRadius, in_defaultRadius, in_alpha, in_beta )
    {
        this.limitInfo.x.min = in_minX;
        this.limitInfo.x.max = in_maxX;

        this.limitInfo.z.min = in_minZ;
        this.limitInfo.z.max = in_maxZ;

        this.limitInfo.radius.min = in_minRadius;
        this.limitInfo.radius.max = in_maxRadius;
        this.limitInfo.radius.default = in_defaultRadius;

        this.limitInfo.alpha.default = in_alpha;
        this.limitInfo.beta.default = in_beta;


        // direct camera set
        G.camera.alpha = in_alpha;
        G.camera.beta = in_beta;
        G.camera.radius = in_defaultRadius;
        G.camera.lowerRadiusLimit = in_minRadius;
        G.camera.upperRadiusLimit = in_maxRadius;
    
        G.camera.fov = 0.5;
    }

    FCameraManager.prototype.onEndMoveAnimation = function()
    {
        this.currentInfo.playingAni = false;
    }

    FCameraManager.prototype.createAnimation = function( in_targetX, in_targetY, in_targetZ, in_targetRadius, in_speed, in_onEndFunc )
    {
        var self = this;

        var frameRate = CAMERA_ANIFRAME;

        var moveAnimationX = new BABYLON.Animation( "moveAnimationX", "currentInfo.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var moveAnimationKeyX = [];
        moveAnimationKeyX.push( {frame:0, value:G.camera.target.x} );
        moveAnimationKeyX.push( {frame:frameRate, value:in_targetX} );
        moveAnimationX.setKeys(moveAnimationKeyX);
        CommFunc.useEasingFuncToAnimation(moveAnimationX);

        var moveAnimationY = new BABYLON.Animation( "moveAnimationY", "currentInfo.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var moveAnimationKeyY = [];
        moveAnimationKeyY.push( {frame:0, value:G.camera.target.y} );
        moveAnimationKeyY.push( {frame:frameRate, value:in_targetY} );
        moveAnimationY.setKeys(moveAnimationKeyY);
        CommFunc.useEasingFuncToAnimation(moveAnimationY);

        var moveAnimationZ = new BABYLON.Animation( "moveAnimationZ", "currentInfo.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var moveAnimationKeyZ = [];
        moveAnimationKeyZ.push( {frame:0, value:G.camera.target.z} );
        moveAnimationKeyZ.push( {frame:frameRate, value:in_targetZ} );
        moveAnimationZ.setKeys(moveAnimationKeyZ);
        CommFunc.useEasingFuncToAnimation(moveAnimationZ);

        var radiusAnimation = new BABYLON.Animation( "radiusAnimation", "currentInfo.radius", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var radiusAnimationKey = [];
        radiusAnimationKey.push( {frame:0, value:G.camera.radius} );
        radiusAnimationKey.push( {frame:frameRate, value:in_targetRadius} );
        radiusAnimation.setKeys(radiusAnimationKey);
        CommFunc.useEasingFuncToAnimation(radiusAnimation);

        this.currentInfo.playingAni = true;
        return G.scene.beginDirectAnimation( this, [ moveAnimationX, moveAnimationY, moveAnimationZ, radiusAnimation ], 0, frameRate, false, in_speed, function()
        {
            self.onEndMoveAnimation();

            if ( in_onEndFunc != undefined )
                in_onEndFunc();
        });
    }

    // 타겟으로 움직이고 끝나면 이동제한 초기화
    FCameraManager.prototype.goToTarget = function( in_targetPos, in_targetRadius, in_moveSpeed, in_onEndFunc )
    {
        this.updatePrevInfo();
        this.clearTarget();

        this.targetData.animation = this.createAnimation( in_targetPos.x, in_targetPos.y, in_targetPos.z, in_targetRadius, in_moveSpeed, in_onEndFunc );
    }

    
    // 타겟설정 전의 정보 세팅
    FCameraManager.prototype.updatePrevInfo = function()
    {
        this.targetData.prevCameraPos = new Vector3( G.camera.position.x, G.camera.position.y, G.camera.position.z );
        this.targetData.prevTargetPos = new Vector3( G.camera.target.x, G.camera.target.y, G.camera.target.z );
        
        this.targetData.prevRadius = G.camera.radius;
    }

    // 세팅했던 이전정보로 귀환하깅
    FCameraManager.prototype.goBackToPrevInfo = function()
    {
        this.clearTarget();
        
        this.goToTarget( this.targetData.prevTargetPos, this.targetData.prevRadius, 1 );
    }

    // 타겟 셋. 카메라는 타겟을 따라감. clearTarget 을 하기 전까진 이동 제한됨.
    FCameraManager.prototype.setTarget = function( in_target, in_targetRadius )
    {
        this.updatePrevInfo();
        this.clearTarget();

        this.targetData.targetRadius = G.camera.radius;
        if ( in_targetRadius != undefined )
            this.targetData.targetRadius = in_targetRadius;            

        this.targetData.mesh = in_target;
    }


    // 타겟 정보 클리어. 카메라 이동제한 초기화
    FCameraManager.prototype.clearTarget = function()
    {
        if ( this.targetData.animation != null )
            this.targetData.animation.stop();

        this.targetData.mesh = null;
        this.targetData.targetRadius = null;
    }

    FCameraManager.prototype.setFPTPTarget = function( in_target, in_revisionDegree, in_perspective, in_targetZoom )
    {
        this.currentPerspective = in_perspective;
        this.FPTPTarget = in_target;

        this.targetZoom = in_targetZoom;

        this.lastTarget = new Vector3( G.camera.target.x, G.camera.target.y, G.camera.target.z );
    }

    FCameraManager.prototype.clearFPTPTarget = function()
    {
        this.FPTPTarget = null;

        G.camera.setTarget( new Vector3( this.lastTarget.x, 0, this.lastTarget.z ) );
    }

    FCameraManager.prototype.run = function()
    {
        switch( this.currentPerspective )
        {
        case this.perspectiveType.FP :
        case this.perspectiveType.TP :
            {
                this.runFPTP();
            }
            break;
        }

        this.runCameraMoveAni();
        this.runFollowCameraProc();

        this.runCameraLimit();
    }

    FCameraManager.prototype.runCameraMoveAni = function()
    {
        if ( !this.currentInfo.playingAni )
            return;

        var beforePos = new Vector3( G.camera.target.x, G.camera.target.y, G.camera.target.z );
        G.camera.setTarget( new Vector3( this.currentInfo.x, this.currentInfo.y, this.currentInfo.z  ) );

        var moveDistance = new Vector3( beforePos.x - G.camera.target.x, beforePos.y - G.camera.target.y, beforePos.z - G.camera.target.z );
        G.camera.setPosition( new Vector3( G.camera.position.x - moveDistance.x, G.camera.position.y - moveDistance.y, G.camera.position.z - moveDistance.z ) );

        G.camera.radius = this.currentInfo.radius;
    }

    FCameraManager.prototype.runFollowCameraProc = function()
    {
        if ( this.targetData.mesh == null )
            return;

        if ( this.targetData.mesh.getMeshes() == null )
            return;

        var beforePos = new Vector3( G.camera.target.x, G.camera.target.y, G.camera.target.z );
        var nextTargetPoint = new Vector3( G.camera.target.x + ((this.targetData.mesh.getMainMesh().position.x - G.camera.target.x)*CAMERA_MOVE_SENSITIVITY),
                                            G.camera.target.y + ((this.targetData.mesh.getMainMesh().position.y+CAMERA_REVISION_HEIGHT - G.camera.target.y)*CAMERA_MOVE_SENSITIVITY),
                                            G.camera.target.z + ((this.targetData.mesh.getMainMesh().position.z - G.camera.target.z)*CAMERA_MOVE_SENSITIVITY) );


        G.camera.setTarget( nextTargetPoint );

        var moveDistance = new Vector3( beforePos.x - G.camera.target.x, beforePos.y - G.camera.target.y, beforePos.z - G.camera.target.z );
        G.camera.setPosition( new Vector3( G.camera.position.x - moveDistance.x, G.camera.position.y - moveDistance.y, G.camera.position.z - moveDistance.z ) );

        if ( this.targetData.targetRadius != null )
        {
            G.camera.radius += (this.targetData.targetRadius - G.camera.radius)*CAMERA_ZOOM_SENSITIVITY;
            
            if ( Math.abs( this.targetData.targetRadius - G.camera.radius ) < 10 )
                this.targetData.targetRadius = null;
        }
    }

    FCameraManager.prototype.runFPTP = function()
    {
        if ( null != this.FPTPTarget )
        {
            switch( this.currentPerspective )
            {
            case this.perspectiveType.FP :
                {

                }
                break;

            case this.perspectiveType.TP :
                {
                    G.camera.setTarget( new Vector3( this.FPTPTarget.position.x, this.FPTPTarget.position.y + 5, this.FPTPTarget.position.z ) );
                    //G.camera.setPosition( new Vector3(  Math.cos this.FPTPTarget. )

                    if ( G.camera.radius > this.targetZoom )
                        G.camera.radius = this.targetZoom;
                }
                break;

            }
        }
    }

    var testProc = 0;
    FCameraManager.prototype.runCameraLimit = function()
    {

        if ( G.camera )
        {
            // if ( (undefined != G.camera.position.x)&&(undefined != G.camera.position.z) )
            // {
            //     var x = CommFunc.minMax( -60, G.camera.position.x, 60 );
            //     var z = CommFunc.minMax( -60, G.camera.position.z, 60 );

            //     //G.camera.setPosition( new Vector3( 0, 0, 0 ) );

            //     var beforePos = new Vector3( G.camera.position.x, G.camera.position.y, G.camera.position.z );
            //     G.camera.setPosition( new Vector3( x, G.camera.position.y, z ) );

            //     var moveDistance = new Vector3( beforePos.x - G.camera.position.x, beforePos.y - G.camera.position.y, beforePos.z - G.camera.position.z );
            //     G.camera.setTarget( new Vector3( G.camera.target.x - moveDistance.x, G.camera.target.y - moveDistance.y, G.camera.target.z - moveDistance.z ) );
            // }

        
            if ( (undefined != G.camera.target.x)&&(undefined != G.camera.target.z) )
            {
                var x = CommFunc.minMax( this.limitInfo.x.min, G.camera.target.x, this.limitInfo.x.max );
                var z = CommFunc.minMax( this.limitInfo.z.min, G.camera.target.z, this.limitInfo.z.max );

                var beforePos = new Vector3( G.camera.target.x, G.camera.target.y, G.camera.target.z );
                G.camera.setTarget( new Vector3( x, G.camera.target.y, z ) );
        
                var moveDistance = new Vector3( beforePos.x - G.camera.target.x, beforePos.y - G.camera.target.y, beforePos.z - G.camera.target.z );
                G.camera.setPosition( new Vector3( G.camera.position.x - moveDistance.x, G.camera.position.y - moveDistance.y, G.camera.position.z - moveDistance.z ) );
            }

            // testProc += 0.01;
            // G.camera.fov = 1.5 + (0.9*Math.sin( testProc ));
        }
    }

    FCameraManager.prototype.setKeyboardInterface = function()
    {
        var self = this;
        // keyboard
        this.keyMap ={}; //object for multiple key presses
        G.scene.actionManager = new BABYLON.ActionManager(G.scene);
       
        G.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) 
        {								
              self.keyMap[evt.sourceEvent.key] = (evt.sourceEvent.type == "keydown");
              
        }));
          
        G.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt)
        {								
              self.keyMap[evt.sourceEvent.key] = (evt.sourceEvent.type == "keydown");
        }));
    }

    FCameraManager.prototype.setCameraBeta = function( in_targetBeta )
    {
        // ToRadians(55) -> ToRadians(35)

        if ( this.betaAni )
            this.betaAni.stop();

        var frameRate = 120;

        var betaAnimationX = new BABYLON.Animation( "betaAnimation", "beta", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE );
        var betaAnimationKeyX = [];
        betaAnimationKeyX.push( {frame:0, value: G.camera.beta} );
        betaAnimationKeyX.push( {frame:frameRate, value:in_targetBeta} );
        betaAnimationX.setKeys(betaAnimationKeyX);
        CommFunc.useEasingFuncToAnimation(betaAnimationX);

        this.betaAni = G.scene.beginDirectAnimation( G.camera, [betaAnimationX], 0, frameRate, false, 1.0 );
    }


    //
    // second camera
    //
    FCameraManager.prototype.createSecondCamera = function( in_pos, in_targetMesh, in_x, in_y, in_width, in_height )
    {
        this.destroySecondCamera();

        if ( G.scene.activeCameras.length == 0)
        {
            G.scene.activeCameras.push( G.camera );
        }

        this.secondCameraTargetMesh = in_targetMesh;
        this.secondCamera = new BABYLON.FreeCamera("GunSightCamera", new BABYLON.Vector3(0, 0, -50), G.scene);                //new BABYLON.ArcRotateCamera('ArcRotateCamera', 0,0,0, BABYLON.Vector3.Zero(), G.scene);
        
        this.secondCamera.viewport = new BABYLON.Viewport(0.25, 0.25, 0.5, 0.5);    
        this.secondCamera.layerMask = 0x20000000;    
        
		G.scene.activeCameras.push(this.secondCamera);
    }

    FCameraManager.prototype.destroySecondCamera = function()
    {        
        if ( null != this.secondCamera )
            this.secondCamera.dispose();

        this.secondCameraTargetMesh = null;
    }

    return FCameraManager;
}());