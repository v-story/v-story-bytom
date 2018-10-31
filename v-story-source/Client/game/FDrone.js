'use strict';

var FDrone = (function () 
{    
    function FDrone(in_objID, in_position)
    {
        this.velocity = {"forward":0.05, "backward":0.05, "left":0.05, "right":0.05, "turnLeft":0.05, "turnRight":0.05, "hoverUp":0.01, "hoverDown":0.01};
        this.MaxVelocity = {"forward":1, "backward":1, "left":1, "right":1, "turnLeft":1, "turnRight":1, "hoverUp":0.5, "hoverDown":0.5};
        this.droneMesh = null;
        this.accelerator = new Vector3(0,0,0);
        this.steering = 0;
        this.isFPSMode = false;
        this.keyMap = {};

        var self = this;
        // load mesha
        G.resManager.getLoadMesh(in_objID, in_objID, self, null, function(newMesh, lparam, pparam)
        {
            newMesh.position = in_position;            

            GUI.dropEffect( newMesh );
            GUI.installEffect( newMesh.position );
            self.droneMesh = newMesh;

            self.setFPSMode( true );
        });
    }

    FDrone.prototype.destroy = function () 
    {
        this.isFPSMode = false;
    }    

    

    FDrone.prototype.setFPSMode = function( in_isFPSMode )
    {
        var self = this;

        if ( in_isFPSMode )
        {            
            // keyboard
            this.keyMap ={}; //object for multiple key presses
            G.scene.actionManager = new BABYLON.ActionManager(G.scene);
           
            G.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) 
            {								
                  self.keyMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
                  
            }));
              
            G.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt)
            {								
                  self.keyMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
            }));


            this.isFPSMode = true;    
            G.runnableMgr.add(this);

            //G.camera.inputs.remove(G.camera.inputs.attached.pointers);
            G.camera.inputs.remove(G.camera.inputs.attached.mousewheel);

            G.camera.setPosition( new Vector3( this.droneMesh.position.x, this.droneMesh.position.y, this.droneMesh.position.z ) );
            G.camera.setTarget( new Vector3( this.droneMesh.position.x, this.droneMesh.position.y, this.droneMesh.position.z + 10 ) );
        }
        else
        {
            this.isFPSMode = false;
            G.runnableMgr.remove(this);
        }
    }

    FDrone.prototype.run = function()
    {
        if ( this.isFPSMode )
        {
            if(this.keyMap['w']) 
            {
                testdrone.hoverUp();
            }
            if(this.keyMap['a']) 
            {
                testdrone.turnLeft();
            }
            if(this.keyMap['s'])
            {
                testdrone.hoverDown();
            }
            if(this.keyMap['d']) 
            {
                testdrone.turnRight();
            }

            
            if(this.keyMap['ArrowLeft']) 
            {
                testdrone.moveLeft();
            }
            if(this.keyMap['ArrowRight']) 
            {
                testdrone.moveRight();
            }
            if(this.keyMap['ArrowUp'])
            {
                testdrone.moveForward();
            }
            if(this.keyMap['ArrowDown']) 
            {
                testdrone.moveBackward();
            }

            this.accelerator.x += (0-this.accelerator.x)/50;
            this.accelerator.z += (0-this.accelerator.z)/50;
            this.accelerator.y += (0-this.accelerator.y)/50;

            this.droneMesh.position = new Vector3(  this.droneMesh.position.x+this.accelerator.x,
                                                    this.droneMesh.position.y+this.accelerator.y,
                                                    this.droneMesh.position.z+this.accelerator.z );

            

            this.steering += (0-this.steering)/50;

            if ( this.droneMesh.rotation.x )

            this.droneMesh.rotation.x += (0-(this.droneMesh.rotation.x))/20;
            this.droneMesh.rotation.z += (0-(this.droneMesh.rotation.z))/20;
            this.droneMesh.rotation.y = this.droneMesh.rotation.y + ToRadians( this.steering ); 


            var beforePos = new Vector3( G.camera.target.x, G.camera.target.y, G.camera.target.z );
            G.camera.setTarget( new Vector3( this.droneMesh.position.x, this.droneMesh.position.y, this.droneMesh.position.z ) );

            var moveDistance = new Vector3( beforePos.x - G.camera.target.x, beforePos.y - G.camera.target.y, beforePos.z - G.camera.target.z );
            G.camera.setPosition( new Vector3( G.camera.position.x - moveDistance.x, G.camera.position.y - moveDistance.y, G.camera.position.z - moveDistance.z ) );
            G.camera.alpha = ToRadians(270)-this.droneMesh.rotation.y;
        }
    }

    FDrone.prototype.hoverUp = function()
    {
        if ( this.accelerator.y < this.MaxVelocity.hoverUp )
            this.accelerator.y += this.velocity.hoverUp;
    }

    FDrone.prototype.hoverDown = function()
    {
        if ( this.accelerator.y > -this.MaxVelocity.hoverDown )
            this.accelerator.y -= this.velocity.hoverDown;
    }

    FDrone.prototype.turnLeft = function()
    {
        if ( this.steering > -this.MaxVelocity.turnLeft )
            this.steering -= this.velocity.turnLeft;
    }
    
    FDrone.prototype.turnRight = function()
    {
        if ( this.steering < this.MaxVelocity.turnRight )
            this.steering += this.velocity.turnRight;
    }

    FDrone.prototype.moveForward = function()
    {
        var distance = Vector3.Distance(Vector3.Zero(), new Vector3(this.accelerator.x,0,this.accelerator.z));
        this.droneMesh.rotation.x += ToRadians( distance );
        if ( this.droneMesh.rotation.x > ToRadians( 30 ) )   
            this.droneMesh.rotation.x = ToRadians( 30 );

        if ( distance > this.MaxVelocity.forward )
            return;

        this.accelerator.x += Math.sin( this.droneMesh.rotation.y )*(this.velocity.forward);
        this.accelerator.z += Math.cos( this.droneMesh.rotation.y )*(this.velocity.forward);
    }

    FDrone.prototype.moveBackward = function()
    {        
        var distance = Vector3.Distance(Vector3.Zero(), new Vector3(this.accelerator.x,0,this.accelerator.z));
        this.droneMesh.rotation.x -= ToRadians( distance );
        if ( this.droneMesh.rotation.x < ToRadians( -30 ) )   
            this.droneMesh.rotation.x = ToRadians( -30 );

        if ( distance > this.MaxVelocity.backward )
            return;            

        this.accelerator.x += Math.sin( this.droneMesh.rotation.y )*-this.velocity.backward;
        this.accelerator.z += Math.cos( this.droneMesh.rotation.y )*-this.velocity.backward;
    }

    FDrone.prototype.moveLeft = function()
    {         
        var distance = Vector3.Distance(Vector3.Zero(), new Vector3(this.accelerator.x,0,this.accelerator.z));
        this.droneMesh.rotation.z += ToRadians( distance );
        if ( this.droneMesh.rotation.z > ToRadians( 30 ) )   
            this.droneMesh.rotation.z = ToRadians( 30 );

        if ( distance > this.MaxVelocity.left )
            return;

        this.accelerator.x += Math.sin( this.droneMesh.rotation.y + ToRadians(-90) )*this.velocity.left;
        this.accelerator.z += Math.cos( this.droneMesh.rotation.y + ToRadians(-90) )*this.velocity.left;
    }

    FDrone.prototype.moveRight = function()
    {        
        
        var distance = Vector3.Distance(Vector3.Zero(), new Vector3(this.accelerator.x,0,this.accelerator.z));
        this.droneMesh.rotation.z -= ToRadians( distance );
        if ( this.droneMesh.rotation.z < ToRadians( -30 ) )   
            this.droneMesh.rotation.z = ToRadians( -30 );

        if ( distance > this.MaxVelocity.right )
            return;

        this.accelerator.x += Math.sin( this.droneMesh.rotation.y + ToRadians(90) )*(this.velocity.right);
        this.accelerator.z += Math.cos( this.droneMesh.rotation.y + ToRadians(90) )*(this.velocity.right);
    }

    return FDrone;
}());
    
    
        