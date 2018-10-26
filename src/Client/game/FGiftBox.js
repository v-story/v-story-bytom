'use strict';

var FGiftBox = (function () {
    function FGiftBox(name, worldPos, callback, parent, pparam, onLoadEndFunc) {

        this.name  = name;
        this.guid  = CommFunc.nameGuid('giftBox');

        this.mesh  = null;

        this.callback = callback;
        this.parent = parent;
        this.param = pparam;

        this.position = worldPos;

        this.onLoadEndFunc = onLoadEndFunc;

        this.init();
    }

    FGiftBox.prototype.init = function() {

        var self = this;

        // G.resManager.getLoadMesh("giftbox", this.guid, null, null, function(newMesh, lparam, pparam){
            
        //     self.mesh = newMesh;
        //     self.mesh.position = self.position;
        //     self.mesh.isVisible = true;
        //     self.renderGiftboxBubble();

        //     G.eventManager.setMeshButton(self.mesh, false, self.callback, self.parent, self.param);
        // });

        Loader.Mesh("Assets/49_giftbox/", "giftbox.babylon", "giftbox", 0,  null, function (newMeshes, particleSystems, skeletons, key, param) {
            self.mesh = newMeshes[0];
            self.mesh.position = self.position;
            self.mesh.isVisible = true;
            self.renderGiftboxBubble();

            G.eventManager.setMeshButton(self.mesh, false, self.callback, self.parent, self.param);

            if ( self.onLoadEndFunc != undefined )
                self.onLoadEndFunc();
        });




    }
    
    FGiftBox.prototype.getMainMesh = function()
    {
        return this.mesh;
    }

    FGiftBox.prototype.renderGiftboxBubble = function() {
        
        if(this.param == null) return;

        var self = this;
        

        var sObj = G.dataManager.getUsrMgr(DEF_IDENTITY_ME).getShareObject();
        var list = sObj.list[this.param];
        var url = null;

        //1:이미지,2:동영상,3:유튜브링크
        if(list.fileType == 1) {
            url = sObj.imgPath + list.url;
        } else if(list.fileType == 2) {
            url = sObj.vdoThumbnailPath + list.url;
        } else if(list.fileType == 3) {
            url = sObj.imgPath + list.url;
        } else {
            Debug.Error('File Type Error!!!!');
        }

        /*
        var thumb_back = GUI.CreateImage('thumb_back', px(0), px(0), px(70), px(70), ASSET_URL+"97_gui_new/09_starcontents/btn_thumb_back.png");
        G.guiMain.addControl(thumb_back, GUI.LAYER.BACKGROUND);
        thumb_back.linkWithMesh(this.mesh);
        thumb_back.linkOffsetY = -80;

        var thumb = GUI.CreateButton("thumb", px(0), px(0), px(60), px(60), url, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        G.guiMain.addControl(thumb, GUI.LAYER.BACKGROUND);
        thumb.linkWithMesh(this.mesh);
        thumb.linkOffsetY = -80; 
        thumb.onPointerUpObservable.add(function() {
            if(self.callback) self.callback(self.parent, self.param);
        });

        var el = GUI.CreateEllipse('ellipse', 0,0,"5px", "5px", "Black", "Red", 4);
        el.linkOffsetY = 0;
        G.guiMain.addControl(el, GUI.LAYER.BACKGROUND);
        el.linkWithMesh(this.mesh);

        var line = GUI.CreateLine('line',0, 0, 0, 25, 2, "white");
        line.linkOffsetY = -5;
        G.guiMain.addControl(line, GUI.LAYER.BACKGROUND);
        line.linkWithMesh(this.mesh);
        line.connectedControl = thumb_back;
        */

        var self = this;
        var ratio = 0.5;

        var wrapper = GUI.createContainer();
        wrapper.width = px( 202 * ratio );
        wrapper.height = px( 782 * ratio );

        var iconBG = GUI.CreateButton( "iconBG", px( 0 ), px( 0 ), px(202 * ratio), px(377 * ratio),
        GUI.DEFAULT_IMAGE_PATH_NEW+"22_giftbox/gift_1.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        wrapper.addControl( iconBG );


        var thumbNail = GUI.CreateImage( "thumbNail", px( 0 ), px( 20 ), px(188 * ratio*0.95), px(188 * ratio*0.95),
                url, GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        iconBG.addControl( thumbNail );

        var roundCover = GUI.CreateImage( "roundCover", px( 0 ), px( 0 ), px(202 * ratio), px(225 * ratio),
            GUI.DEFAULT_IMAGE_PATH_NEW+"22_giftbox/roundcover.png", GUI.ALIGN_CENTER, GUI.ALIGN_TOP );
        iconBG.addControl( roundCover );
        roundCover.zIndex = 5;

        
        G.guiMain.addControl( wrapper );
        wrapper.linkWithMesh( this.mesh );

        iconBG.onPointerUpObservable.add( function()
        {
            if( self.callback != null )
            {
                self.callback( self.parent, self.param );
            }
        });

        FPopup.openAnimation( wrapper, undefined, 1.0, true, 1 );
    }


    FGiftBox.prototype.destroy = function() {

        // this.gui.dispose();
        G.eventManager.clearMeshButton(this.mesh);

        if ( this.mesh != null)
            this.mesh.dispose();

        G.resManager.clearMesh("giftbox", this.guid);
    }


    FGiftBox.prototype.run = function(){


    }


    return FGiftBox;

}());

