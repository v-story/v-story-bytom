'use strict';

var BTN_TYPE = 
{
    OK : 1,
    YESNO : 2
}

var MSGBOX_BTN_RESULT = 
{
    CLICK_OK : 1,
    CLICK_CANCEL : 2,
}



var MSGBOX_UI_PATH = ASSET_URL+"97_gui_new/"+"18_commonPopup/"

var FFPopup = (function () {

    function FFPopup() {

        this.wrapMain = null;
        // this.queue = new bucket.queue();
    }

    /**
     * @description 팝업 뒤쪽의 검은 백그라운드를 만들어준다. 기본 크기가 화면의 2배라서 중앙 기준축 이외로 어태치했을경우 화면에서 안 보일 수 있다.
     * @param {String} in_color / 색
     * @param {Number} in_alpha / 투명값
     * @param {Number} in_size  / 사이즈. 기본은 2. 1로 주면 openAnimation 때 화면 전체를 채우지 못한다.
     */
    FFPopup.prototype.createPopupWrapper = function( in_color, in_alpha, in_size )
    {
        var size = (undefined==in_size)?5.0:in_size;

        var wrapper = new BABYLON.GUI.Rectangle();
        wrapper.thickness = 0;
        wrapper.width = px(window.innerWidth*size);
        wrapper.height = px(window.innerHeight*size);

        

        var backGroundCover = new BABYLON.GUI.Rectangle();
        backGroundCover.width = 2;
        backGroundCover.height = 2;
        backGroundCover.thickness = 0;
        backGroundCover.background = in_color;
        backGroundCover.alpha = in_alpha;
        wrapper.addControl( backGroundCover );

        return wrapper;
    }

    /**
     * UI에 커졌다 원래대로 돌아오는 확대효과 애니메이션을 적용합니다.
     * @param {GUI} in_popupWrapper         / 애니메이션을 적용할 대상 UI
     * @param {function} in_onEndAniFunc    / 애니메이션 종료 후 호출될 콜백. 디폴트는 undefined
     * @param {Number} in_startScale        / 시작 스케일. 디폴트는 0.5.
     * @param {Boolean} in_isLoop           / 루프 여부. 디폴트는 false
     * @param {Number} in_speed             / 속도. 디폴트는 4
     */
    FFPopup.prototype.openAnimation = function( in_popupWrapper, in_onEndAniFunc, in_startScale, in_isLoop, in_speed )
    {
        var startScale = (in_startScale==undefined)?0.5:in_startScale;

        var frameRate = 4;
        
        var scaleXAnimation = new BABYLON.Animation( "scale", "scaleX", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keyframeX = [];
        keyframeX.push({frame:0,value:startScale});
        keyframeX.push({frame:frameRate-2,value:1.1});
        keyframeX.push({frame:frameRate,value:1.0});
        scaleXAnimation.setKeys(keyframeX);

        var scaleYAnimation = new BABYLON.Animation( "scale", "scaleY", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keyframeY = [];
        keyframeY.push({frame:0,value:startScale});
        keyframeY.push({frame:frameRate-2,value:1.1});
        keyframeY.push({frame:frameRate,value:1.0});
        scaleYAnimation.setKeys(keyframeY);

        var isLoop = (in_isLoop==undefined)?false:in_isLoop;
        var speed = (in_speed==undefined)?4:in_speed;

        G.scene.beginDirectAnimation( in_popupWrapper, [scaleXAnimation, scaleYAnimation], 0, frameRate, isLoop, speed, function(){ 
            if ( undefined != in_onEndAniFunc )
                in_onEndAniFunc(); } );
    }

    FFPopup.prototype.messageBox = function(title, str, btn_type, callback, param) {
        var self = this;

        if(str == null) return;
        if(G.guiMain == null) return;
        if(self.wrapMain) {
            GUI.removeContainer(self.wrapMain);
        }

        self.wrapMain = GUI.createContainer('wrapMain');
        G.guiMain.addControl(self.wrapMain, GUI.LAYER.POPUP);
        self.wrapMain.isPointerBlocker = true;
        self.openAnimation( self.wrapMain, undefined, 1.0 );        
        
        var wrapper = self.createPopupWrapper( "black", 0.5 );
        self.wrapMain.addControl( wrapper );

        var img = GUI.CreateImage("back", px(0), px(0), px(582), px(370), MSGBOX_UI_PATH + "s_popup_bg.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
        wrapper.addControl(img);

        var titleText = GUI.CreateText( px(0), px(-145), title, "white", 22, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        wrapper.addControl( titleText );

        var noticeText = GUI.CreateAutoLineFeedText( px(0), px(-30), px(500), px(170), str, "white", 24, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        wrapper.addControl( noticeText );

        // yes no button
        if(btn_type == BTN_TYPE.YESNO) {
            var yesButton = GUI.CreateButton( "yes", px(-145), px(130), px(261), px(80), MSGBOX_UI_PATH + "s_yes_btn.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
            //yesButton.addControl(  GUI.CreateText( px(0), px(0), "예", "black", 17, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
            wrapper.addControl( yesButton );        
            yesButton.onPointerUpObservable.add( function ()
            {
                GUI.removeContainer(self.wrapMain);
                self.wrapMain = null;
                if(callback) callback(param, MSGBOX_BTN_RESULT.CLICK_OK);
                
            } );
    
            var noButton = GUI.CreateButton( "no", px(145), px(130), px(261), px(80), MSGBOX_UI_PATH + "s_no_btn.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
            //noButton.addControl(  GUI.CreateText( px(0), px(0), "아니오", "black", 17, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
            wrapper.addControl( noButton );
            noButton.onPointerUpObservable.add( function ()
            {
                GUI.removeContainer(self.wrapMain);
                self.wrapMain = null;
                if(callback) callback(param, MSGBOX_BTN_RESULT.CLICK_CANCEL);
            } );
        } else {
            var okButton = GUI.CreateButton( "ok", px(0), px(130), px(261), px(80), MSGBOX_UI_PATH + "s_yes_btn.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE);
            //okButton.addControl(  GUI.CreateText( px(0), px(0), "확인", "black", 17, GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );
            wrapper.addControl( okButton );        
            okButton.onPointerUpObservable.add( function ()
            {
                GUI.removeContainer(self.wrapMain);
                self.wrapMain = null;
                if(callback) callback(param, MSGBOX_BTN_RESULT.CLICK_OK);
            } );
        }
    }


    return FFPopup;

}());

var FPopup = new FFPopup();
