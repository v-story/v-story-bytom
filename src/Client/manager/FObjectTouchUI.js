'use strict'

//
// Obejct Touch UI
//

var OBJECTTOUCHUI_TYPE = 
{
    MAIN                : 0,
    INTERACTION         : 1,
    STARCONTENTS        : 2,
}

var OBJECTTOUCHUI_MAINBTN =
{
    GOTO_INTERACTION    : 0,
    GOTO_SHOP           : 1,
    GOTO_STARCONTENTS   : 2,
    GOTO_LINKURL        : 3,
    GOTO_DIRECTSC       : 4,
    CLOSE               : 5,
}

var OBJECTTOUCHUI_INTERACTIONBTN =
{
    INTERACTION         : 0,
    BACK                : 1,
}

var OBJECTTOUCHUI_STARCONBTN =
{
    ADD                 : 0,
    DELETE              : 1,
    BACK                : 2,
}

var FObjectTouchUI = (function()
{
    function FObjectTouchUI()
    {
        this.pointerBlockWrapper = null;
        this.ui = [];

        this.uiType = null;
        
        this.objData = 
        {
            mesh : null,

            tableData : null,
            actionList : null,

            interactionSelectCallback : null,
            changeObjectCallback : null,
        }

        this.readyToAutoClose = false;

        // init func
        this.initUI();
    }

    FObjectTouchUI.prototype.getReadyToAutoClose = function()
    {
        return this.readyToAutoClose;
    }

    FObjectTouchUI.prototype.setObjData = function( in_objMesh, in_objTableData )
    {
        var self = this;

        this.objData.mesh = in_objMesh;

        this.objData.tableData = in_objTableData;

        this.objData.actionList = [];

        if ( in_objTableData.OBJ_ACTN_ID != 0 )
        {
            var actionList = G.dataManager.getActnKind( in_objTableData.OBJ_ACTN_ID );
            for ( var i = 0; i < 5; ++i )
            {
                var actionKind = actionList[ "OBJ_ACTN_KIND_"+(i+1).toString() ];
                
                if ( actionKind != 0 )
                    this.objData.actionList.push( actionKind );
            }
        }

        var createInteractionBtn = function( in_index, in_angle )
        {
            var interactionBtn = GUI.CreateButton( "closeBtn", px( Math.sin(ToRadians(in_angle))*150 ), px( Math.cos(ToRadians(in_angle))*150 ), px(94), px(94),
            SHOPUI_PATH+"/object_interaction_icon/" + self.objData.actionList[in_index].toString() + ".png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
            interactionBtn.onPointerUpObservable.add(function()
            {
                self.objData.interactionSelectCallback( self.objData.actionList[in_index] );
                self.readyToChangeUI(); 
            });

            return interactionBtn;
        }

        for ( var i = 0; i < this.ui[OBJECTTOUCHUI_TYPE.INTERACTION].button[OBJECTTOUCHUI_INTERACTIONBTN.INTERACTION].length; ++i )
        {
            this.ui[OBJECTTOUCHUI_TYPE.INTERACTION].wrapper.removeControl( this.ui[OBJECTTOUCHUI_TYPE.INTERACTION].button[OBJECTTOUCHUI_INTERACTIONBTN.INTERACTION][i] );
        }
        this.ui[OBJECTTOUCHUI_TYPE.INTERACTION].button[OBJECTTOUCHUI_INTERACTIONBTN.INTERACTION] = [];

        var distance = 60;
        var startPos = 120 - (distance*(this.objData.actionList.length-1))/2;
        for ( var i = 0; i < this.objData.actionList.length; ++i )
        {
            var btn = createInteractionBtn( i, startPos+(distance*i) );
            this.ui[OBJECTTOUCHUI_TYPE.INTERACTION].button[OBJECTTOUCHUI_INTERACTIONBTN.INTERACTION].push( btn );

            this.ui[OBJECTTOUCHUI_TYPE.INTERACTION].wrapper.addControl( btn );
        }



        // starcontents remove button state
        var isAlreadySetStarconObject = this.objData.mesh.isStarContents();
        this.ui[OBJECTTOUCHUI_TYPE.STARCONTENTS].button[OBJECTTOUCHUI_STARCONBTN.DELETE].alpha = isAlreadySetStarconObject? 1.0 : 0.3 ;

        this.checkVisibleLinkUrlBtn();
        this.checkVisibleDirectViewStarContenst();
    }

    FObjectTouchUI.prototype.checkVisibleLinkUrlBtn = function()
    {
        // link url button state
        this.ui[OBJECTTOUCHUI_TYPE.MAIN].button[OBJECTTOUCHUI_MAINBTN.GOTO_LINKURL].isVisible = this.objData.mesh.isExistLinkURL();
    }

    FObjectTouchUI.prototype.checkVisibleDirectViewStarContenst = function()
    {
        var isHasStarContents = (this.objData.mesh.isStarContents());

        var isFrameObejct = ( 390001 <= this.objData.mesh.getObjID() && this.objData.mesh.getObjID() <= 390006 );

        this.ui[OBJECTTOUCHUI_TYPE.MAIN].button[OBJECTTOUCHUI_MAINBTN.GOTO_DIRECTSC].isVisible = ( isHasStarContents && isFrameObejct );
    }

    FObjectTouchUI.prototype.clearObjData = function()
    {
        this.objData.tableData = null;
        this.objData.actionList = null;
        this.objData.interactionSelectCallback = null;
        this.objData.changeObjectCallback = null;
    }

    /**
     * 
     * @param {function(Number)} in_callBackFunc // OBJ_ACTN_KIND_0~5 중에서 선택한 하나가 인자값으로 들어오는 콜백
     */
    FObjectTouchUI.prototype.setInteractionSelectCallback = function( in_callBackFunc )
    {
        this.objData.interactionSelectCallback = in_callBackFunc;
    }

    FObjectTouchUI.prototype.setChangeObjectCallback = function( in_callBackFunc )
    {
        this.objData.changeObjectCallback = in_callBackFunc;
    }

    FObjectTouchUI.prototype.initUI = function()
    {   
        var self = this;         

        // pointerBlock
        this.pointerBlockWrapper = GUI.createContainer();
        this.pointerBlockWrapper.width = px(400);
        this.pointerBlockWrapper.height = px(450);
        this.pointerBlockWrapper.isPointerBlocker = true;

        // type - main
        this.ui.push( { wrapper : null, button : [] } );
        
        var mainWrapper = GUI.createContainer();
        mainWrapper.width = px(400);
        mainWrapper.height = px(450);
        this.ui[OBJECTTOUCHUI_TYPE.MAIN].wrapper = mainWrapper;

        mainWrapper.addControl( GUI.CreateImage( "RingBG", px(0), px(0), px(299), px(299), SHOPUI_PATH+"s_c.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );

        var mainGoToInteractionBtn = GUI.CreateButton( "mainGoToInteractionBtn", px( Math.sin(ToRadians(120))*150 ), px( Math.cos(ToRadians(120))*150 ), px(94), px(94),
            SHOPUI_PATH+"s_i4.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        mainWrapper.addControl( mainGoToInteractionBtn );
        mainGoToInteractionBtn.onPointerUpObservable.add( function(){ self.onClickMainGotoInteractionBtn() } );
        this.ui[OBJECTTOUCHUI_TYPE.MAIN].button.push( mainGoToInteractionBtn );

        var mainGoToShopBtn = GUI.CreateButton( "mainGoToShopBtn", px( Math.sin(ToRadians(35))*150 ), px( Math.cos(ToRadians(35))*150 ), px(94), px(94),
            SHOPUI_PATH+"star_change.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        mainWrapper.addControl( mainGoToShopBtn );
        mainGoToShopBtn.onPointerUpObservable.add( function(){ self.onClickMainGotoShopBtn() } );
        this.ui[OBJECTTOUCHUI_TYPE.MAIN].button.push( mainGoToShopBtn );

        var mainGoToStartContentsBtn = GUI.CreateButton( "mainGoToStartContentsBtn", px( Math.sin(ToRadians(180))*150 ), px( Math.cos(ToRadians(180))*150 ), px(94), px(94),
            SHOPUI_PATH+"star_star.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        mainWrapper.addControl( mainGoToStartContentsBtn );
        mainGoToStartContentsBtn.onPointerUpObservable.add( function(){ self.onClickmainGoToStartContentsBtn() } );
        this.ui[OBJECTTOUCHUI_TYPE.MAIN].button.push( mainGoToStartContentsBtn );

        var mainGoToLinkURLBtn = GUI.CreateButton( "mainGoToLinkURLBtn", px( Math.sin(ToRadians(240))*150 ), px( Math.cos(ToRadians(240))*150 ), px(94), px(94),
            SHOPUI_PATH+"s_www.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        mainWrapper.addControl( mainGoToLinkURLBtn );
        mainGoToLinkURLBtn.onPointerUpObservable.add( function(){ self.onClickmainGoToLinkURLBtn() } );
        this.ui[OBJECTTOUCHUI_TYPE.MAIN].button.push( mainGoToLinkURLBtn );

        var mainDirectViewStarContentsBtn = GUI.CreateButton( "mainDirectViewStarContentsBtn", px( Math.sin(ToRadians(240))*150 ), px( Math.cos(ToRadians(240))*150 ), px(94), px(94),
            SHOPUI_PATH+"a_magnifier.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        mainWrapper.addControl( mainDirectViewStarContentsBtn );
        mainDirectViewStarContentsBtn.onPointerUpObservable.add( function(){ self.onClickmainDirectViewStarContentsBtn() } );
        this.ui[OBJECTTOUCHUI_TYPE.MAIN].button.push( mainDirectViewStarContentsBtn );
        

        var closeBtn = GUI.CreateButton( "closeBtn", px( Math.sin(ToRadians(315))*150 ), px( Math.cos(ToRadians(315))*150 ), px(87), px(85),
            SHOPUI_PATH+"s_x.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        mainWrapper.addControl( closeBtn );
        closeBtn.onPointerUpObservable.add( function()
        { 
            //G.cameraManager.goBackToPrevInfo(); // 좀 이상해서 주석처리함
            self.onClickMainCloseBtn();
        } );
        this.ui[OBJECTTOUCHUI_TYPE.MAIN].button.push( closeBtn );
        
        


        // type - interaction      
        this.ui.push( { wrapper : null, button : [] } );
        
        var interactionWrapper = GUI.createContainer();
        interactionWrapper.width = px(400);
        interactionWrapper.height = px(450);
        this.ui[OBJECTTOUCHUI_TYPE.INTERACTION].wrapper = interactionWrapper;

        interactionWrapper.addControl( GUI.CreateImage( "RingBG", px(0), px(0), px(299), px(299), SHOPUI_PATH+"s_c.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );

        this.ui[OBJECTTOUCHUI_TYPE.INTERACTION].button.push( [] );

        var interactionBackBtn = GUI.CreateButton( "interactionBackBtn", px( Math.sin(ToRadians(315))*150 ), px( Math.cos(ToRadians(315))*150 ), px(87), px(85),
            SHOPUI_PATH+"s_back.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        interactionWrapper.addControl( interactionBackBtn );
        interactionBackBtn.onPointerUpObservable.add( function(){ self.onClickInteractionBackBtn() } );
        this.ui[OBJECTTOUCHUI_TYPE.INTERACTION].button.push( interactionBackBtn );





        // type - starcontents
        this.ui.push( {wrapper : null, button : [] } );

        var starcontentsWrapper = GUI.createContainer();
        starcontentsWrapper.width = px(400);
        starcontentsWrapper.height = px(450);
        this.ui[OBJECTTOUCHUI_TYPE.STARCONTENTS].wrapper = starcontentsWrapper;

        starcontentsWrapper.addControl( GUI.CreateImage( "RingBG", px(0), px(0), px(299), px(299), SHOPUI_PATH+"s_c.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE ) );

        var starContentsAddBtn = GUI.CreateButton( "starContentsAddBtn", px( Math.sin(ToRadians(180))*150 ), px( Math.cos(ToRadians(180))*150 ), px(87), px(85),
        SHOPUI_PATH+"star_plus.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        starcontentsWrapper.addControl( starContentsAddBtn );
        starContentsAddBtn.onPointerUpObservable.add( function(){ self.onClickstarContentsAddBtn() } );
        this.ui[OBJECTTOUCHUI_TYPE.STARCONTENTS].button.push( starContentsAddBtn );

        var starContentsDeleteBtn = GUI.CreateButton( "starContentsDeleteBtn", px( Math.sin(ToRadians(90))*150 ), px( Math.cos(ToRadians(90))*150 ), px(87), px(85),
            SHOPUI_PATH+"star_minus.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        starcontentsWrapper.addControl( starContentsDeleteBtn );
        starContentsDeleteBtn.onPointerUpObservable.add( function(){ self.onClickstarContentsDeleteBtn() } );
        this.ui[OBJECTTOUCHUI_TYPE.STARCONTENTS].button.push( starContentsDeleteBtn );

        var starContentsBackBtn = GUI.CreateButton( "starContentsBackBtn", px( Math.sin(ToRadians(315))*150 ), px( Math.cos(ToRadians(315))*150 ), px(87), px(85),
            SHOPUI_PATH+"s_back.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        starcontentsWrapper.addControl( starContentsBackBtn );
        starContentsBackBtn.onPointerUpObservable.add( function(){ self.onClickstarContentsBackBtn() } );
        this.ui[OBJECTTOUCHUI_TYPE.STARCONTENTS].button.push( starContentsBackBtn );
    }

    FObjectTouchUI.prototype.setUIDisableFromSceneType = function()
    {
        if ( G.sceneMgr.currentScene.name == 'SCENE_MYFRIENDROOM' )
        {
            this.ui[OBJECTTOUCHUI_TYPE.MAIN].button[OBJECTTOUCHUI_MAINBTN.GOTO_STARCONTENTS].isVisible = false;
            this.ui[OBJECTTOUCHUI_TYPE.MAIN].button[OBJECTTOUCHUI_MAINBTN.GOTO_SHOP].isVisible = false;
        }
        else
        {
            this.ui[OBJECTTOUCHUI_TYPE.MAIN].button[OBJECTTOUCHUI_MAINBTN.GOTO_STARCONTENTS].isVisible = true;
            this.ui[OBJECTTOUCHUI_TYPE.MAIN].button[OBJECTTOUCHUI_MAINBTN.GOTO_SHOP].isVisible = true;
        }
    }

    FObjectTouchUI.prototype.openUI = function( in_targetMesh, in_data )
    {           
        FPetTouchUI.getInstance().closeUI();
        FPetTouchUI.getInstance().closeTopInfo();
        FPlayerTouchUI.getInstance().closeUI();     
        FPlayerTouchUI.getInstance().closeTopInfo();

        var self = this;

        this.setUIDisableFromSceneType();

        this.setObjData( in_targetMesh, in_data );

        this.openMainUI();

        this.objData.mesh.hideStarContentsUI();

        // auto close after timeout
        this.readyToAutoClose = false;
        setTimeout( function(){ self.readyToAutoClose = true }, 1000 );

        // 클릭한오브젝트로 카메라 이동시켜주는 로직을 넣재요
        G.cameraManager.goToTarget( this.objData.mesh.centerPosition, 350, 1 );

    }

    FObjectTouchUI.prototype.closeUI = function()
    {
        var self = this;
        this.readyToChangeUI();

        if ( OSTYPE == 'iOS' )
            setTimeout( function(){ G.guiMain.removeControl( self.pointerBlockWrapper ); }, 500 );
        else
            G.guiMain.removeControl( self.pointerBlockWrapper );
    }

    FObjectTouchUI.prototype.readyToChangeUI = function()
    {
        this.pointerBlockWrapper.removeControl( this.ui[OBJECTTOUCHUI_TYPE.MAIN].wrapper );
        this.pointerBlockWrapper.removeControl( this.ui[OBJECTTOUCHUI_TYPE.INTERACTION].wrapper );
        this.pointerBlockWrapper.removeControl( this.ui[OBJECTTOUCHUI_TYPE.STARCONTENTS].wrapper );
    }

    FObjectTouchUI.prototype.openMainUI = function()
    {
        G.guiMain.addControl( this.pointerBlockWrapper, GUI.LAYER.BACKGROUND );
        this.readyToChangeUI();

        this.uiType = OBJECTTOUCHUI_TYPE.MAIN;

        this.pointerBlockWrapper.addControl( this.ui[OBJECTTOUCHUI_TYPE.MAIN].wrapper );
        FPopup.openAnimation( this.ui[OBJECTTOUCHUI_TYPE.MAIN].wrapper );
        this.pointerBlockWrapper.linkWithMesh( this.objData.mesh.getMainMesh() );
    }

    FObjectTouchUI.prototype.openInteractionUI = function()
    {
        G.guiMain.addControl( this.pointerBlockWrapper, GUI.LAYER.BACKGROUND );
        this.readyToChangeUI();

        this.uiType = OBJECTTOUCHUI_TYPE.INTERACTION;
        
        this.pointerBlockWrapper.addControl( this.ui[OBJECTTOUCHUI_TYPE.INTERACTION].wrapper );
        FPopup.openAnimation( this.ui[OBJECTTOUCHUI_TYPE.INTERACTION].wrapper );
        this.pointerBlockWrapper.linkWithMesh( this.objData.mesh.getMainMesh() );
    }

    FObjectTouchUI.prototype.openStartContentsUI = function()
    {
        G.guiMain.addControl( this.pointerBlockWrapper, GUI.LAYER.BACKGROUND );
        this.readyToChangeUI();

        this.uiType = OBJECTTOUCHUI_TYPE.STARCONTENTS;

        this.pointerBlockWrapper.addControl( this.ui[OBJECTTOUCHUI_TYPE.STARCONTENTS].wrapper );
        FPopup.openAnimation( this.ui[OBJECTTOUCHUI_TYPE.STARCONTENTS].wrapper );
        this.pointerBlockWrapper.linkWithMesh( this.objData.mesh.getMainMesh() );
    }


    //
    // main ui click
    // 
    FObjectTouchUI.prototype.onClickMainGotoInteractionBtn = function()
    {
        this.openInteractionUI();
    }

    FObjectTouchUI.prototype.onClickMainGotoShopBtn = function()
    {        
        G.cameraManager.goToTarget( this.objData.mesh.centerPosition, 350, 1 );

        FShopManager.getInstance().setChangeObjectCallback( this.objData.changeObjectCallback );
        FShopManager.getInstance().openShopUI( this.objData.tableData );
        this.onClickMainCloseBtn();
    }

    FObjectTouchUI.prototype.onClickmainGoToStartContentsBtn = function()
    {
        this.openStartContentsUI();
    }

    FObjectTouchUI.prototype.onClickmainGoToLinkURLBtn = function()
    {
        window.open( this.objData.mesh.getLinkUrl(), "VSNS-LINK PAGE" );
        this.onClickMainCloseBtn();
    }

    FObjectTouchUI.prototype.onClickmainDirectViewStarContentsBtn = function()
    {
        if ( this.objData.mesh.isStarContents() )
            snsCommonFunc.openStarContents( this.objData.mesh.STARCONTSEQ );

        this.onClickMainCloseBtn();
    }

    FObjectTouchUI.prototype.onClickMainCloseBtn = function()
    {
        this.objData.mesh.showStartContentsUI(); // instead of // this.objData.mesh.setStarContentsUI();
        snsCommonFunc.setStarContentSequence(null, null);
        this.closeUI();
    }

    //
    // interaction ui click
    //
    FObjectTouchUI.prototype.onClickInteractionBtn = function()
    {

    }

    FObjectTouchUI.prototype.onClickInteractionBackBtn = function()
    {
        this.openMainUI();
    }

    //
    // startcontents ui lick
    //
    FObjectTouchUI.prototype.onClickstarContentsAddBtn = function()
    {
        //snsCommonFunc.snsView( 15 );

        if ( this.objData.mesh.isStarContents() )
        {
            //추가
            snsCommonFunc.snsView(15);
            snsCommonFunc.setStarContentSequence(this.addStarContentsSequence, this);
        }
        else {
            //생성
            StarContentsCategorySelectUI.getInstance().openCategoryList( this.objData.mesh );
        }
        
        this.objData.mesh.setStarContentsUI();
        this.closeUI();
    }

    //스타콘텐츠 삭제
    FObjectTouchUI.prototype.onClickstarContentsDeleteBtn = function()
    {
        if ( this.objData.mesh.isStarContents() ) {

            //삭제
            var sc = this.objData.mesh.getStarContents();

            snsCommonFunc.snsView( 16, sc.STARCONTSEQ );
            snsCommonFunc.setStarContentSequence(this.delStarContentsSequence, this);
        }
            

    }

    FObjectTouchUI.prototype.addStarContentsSequence = function(self, postSeq) {
        
        //서버통신
        self.addStarContents(postSeq);
    }


    FObjectTouchUI.prototype.delStarContentsSequence = function(self, postSeq) {
        
        //서버통신
        self.delStarContents(postSeq);
    }




    FObjectTouchUI.prototype.addStarContents = function(postSeq) {

        var sc = this.objData.mesh.getStarContents();

        var self = this;
        var arrSeq = [];

        arrSeq.push(postSeq);
        var option = {
            'param': {
                'serverIndex':SERVERINDEX,
                'accountPk':ACCOUNTPK,
                'star_cont_seq':sc.STARCONTSEQ,
                'star_cont_cd':sc.STARCONTCD,
                'obj_map_seq':sc.OBJMAPSEQ,
                'arr_post_seq':arrSeq
            },
            'url' : '/funfactory-1.0/regPostToStarContents'
        };

        postCall(option)
        // 콜백에러체크
        .then(function(rs){
            return snsCommonFunc.msgProtocal(rs);
        })
        .then(function(rs){

            G.dataManager.getUsrMgr(DEF_IDENTITY_ME).addStarContent(rs.callback.STAR_CONT_SEQ);
            self.objData.mesh.addStarContents();
            FPopup.messageBox("성공", "스타콘텐츠 게시물을\n추가하였습니다.",BTN_TYPE.OK);

            self.objData.mesh.setStarContentsUI();
            self.closeUI();

        })
         // 에러
        .catch(function(err){
            snsCommonFunc.alertMsg(err);

            // 로더비활성화
            loaderViewer.hide();
        });

    }


    FObjectTouchUI.prototype.delStarContents = function(postSeq) {

        var sc = this.objData.mesh.getStarContents();
        var self = this;
        var option = {
            param: {
                serverIndex: SERVERINDEX,
                accountPk: ACCOUNTPK,
                star_cont_seq: sc.STARCONTSEQ,
                star_cont_cd: sc.STARCONTCD,
                post_seq: postSeq
            },
            'url' : '/funfactory-1.0/delPostFromStarContents'
        };

        postCall(option)
        // 콜백에러체크
        .then(function(rs){
            return snsCommonFunc.msgProtocal(rs);
        })
        .then(function(rs){

            var seq = rs.param.param.star_cont_seq;
            var fileType = rs.callback.FILE_TYPE;
            var path = rs.callback.img_dir_nm;
            var url = rs.callback.REPRST_IMG_NM;


            self.objData.mesh.delStarContents(seq,fileType,path,url);

            FPopup.messageBox("성공", "스타콘텐츠 게시물을\n삭제하였습니다.",BTN_TYPE.OK);

            self.onClickMainCloseBtn();

        })
         // 에러
        .catch(function(err){
            snsCommonFunc.alertMsg(err);

            // 로더비활성화
            loaderViewer.hide();
        });

    }







    FObjectTouchUI.prototype.onClickstarContentsBackBtn = function()
    {
        this.openMainUI();
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
                instance = new FObjectTouchUI();
                instance.constructor = null;
            }

            return instance;
        }
    };

    return FObjectTouchUI;
}());