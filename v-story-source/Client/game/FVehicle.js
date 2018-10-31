'use strict';

var PathDataHighway = [];
PathDataHighway.push([{pos:new Vector3(454,0,1804), cuv : 0},{pos:new Vector3(454,0,-948), cuv : 0}]);
PathDataHighway.push([{pos:new Vector3(534,0,-948), cuv : 0},{pos:new Vector3(534,0,1804), cuv : 0}]);

var FVehicle = (function () {
    
    __inherit(FVehicle,FGameObject);

    function FVehicle(name, objID) {

        this.setName(name);


        this.objID          = objID;

        this.points         = null;
        this.track          = null;

        this.threshold      = null;
        this.speed          = null;
        this.curvedPoints   = null;
        this.path3d         = null;
        this.normals        = null;
        this.startRotation  = null;

        this.threadID       = null;
        this.tick           = null;
        this.start          = null;
    }

    FVehicle.prototype.destroy = function () {

        this.start = false;
        this.points = null;
        G.runnableMgr.remove(this);

        FGameObject.prototype.destroy.call(this);
    }

    FVehicle.prototype.createVehicle = function(points) {

        this.points = points;
        this.init();
    }

    FVehicle.prototype.init = function() {
        
        FGameObject.prototype.init.call(this);

        var self            = this;
        this.threshold      = 0.25;
        this.curvedPoints   = 30;
        this.track          = [];
        this.tick           = 0;
        
        G.resManager._loadSingleAvatar(this.objID, this, function(newMeshes, self){

            self.setMesh(newMeshes);
            self.setVisible(true);
            self.setPosition(self.points[0].pos);
            self.initPath();
            G.runnableMgr.add(self);
        });
    }

    FVehicle.prototype.initPath = function() {

        this.speed = 2.5;
        this.makePath();
        
        this.start = true;
        
        // this.renderFriendBubble();
        // this.FPath.render();
    }

    FVehicle.prototype.run = function(){

        if(!this.start) return;

        this.setPositionXZ(this.track[this.tick].x, this.track[this.tick].z);
        this.ForwardRotation(this.track[this.tick], this.track[this.tick+1]);

        var n       = this.track.length;
        this.tick = (this.tick + 1) % (n-1);	//continuous looping  
        
        if(this.tick == 0) {
            // this.body.rotationQuaternion = this.startRotation.clone();
            this.setRotationQuaternion(this.startRotation.clone());
        }
    }

    FVehicle.prototype.makePath = function() {

        for(var i=0; i<this.points.length-1; i++) {

            if(this.points[i].cuv != 1) {
                var newPoints = this.linePath(this.points[i].pos, this.points[i+1].pos);
                if(newPoints) this.track = this.track.concat(newPoints); //배열 합치기
            } else if(this.points[i].cuv == 1) {

                var newPoints = this.curvePath(this.points[i].pos, this.points[i+1].pos, this.points[i+2].pos);
                if(newPoints) this.track = this.track.concat(newPoints); //배열 합치기

                i++; //베이지어 곡선은 점이 3개 필요함..하나는 컨트롤용으로 
            }
        }

        this.ForwardRotation(this.track[0], this.track[1]);

        this.startRotation = this.getRotationQuaternion();
        //
        this.setPosition(this.track[0].clone());
    }

    FVehicle.prototype.linePath = function(start, end) {

        var points = [];
        var position = start.clone();
        points.push(position.clone());

        while(true) {

            if(Vector3.Distance(position, end) <= this.threshold) {
              
                return points;
            }
    
            position = CommFunc.MoveTowards(position, end, this.speed);
            points.push(position.clone());
        }
    }

    FVehicle.prototype.curvePath = function(start, control, end) {

        var points = [];
        var position = start.clone();
        points.push(position.clone());

        var bezier2 = BABYLON.Curve3.CreateQuadraticBezier(start, control, end, this.curvedPoints);

        return bezier2.getPoints();
    }

    return FVehicle;
}());
