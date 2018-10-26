'use strict'

var EXCHANGE_STEP = 
{
    PREVIEW : 0,
    EXCHANGE : 1,
}

var FExchangePopup = (function()
{
    function FExchangePopup()
    {
        this.currentStep = EXCHANGE_STEP.PREVIEW;

        this.ui = 
        {
            wrapper : null,

            previewPopup : 
            {
                wrapper : null,

                BG : null,

                curSmileText : null,
                getSmileText : null,
                excSmileText : null,

                okbtn : null,
                closebtn : null,
            },

            exchagnePopup : 
            {
                wrapper : null,

                BG : null,

                curSmileText : null,
                guideSmileText : null,
                inputSmileText : null,
                resultPriceText : null,

                okbtn : null,
                closebtn : null,
            },
            
            resultPopup :
            {
                wrapper : null,

                BG : null,

                okbtn : null,
            }
        }



        // init func
        this.init();
    }

    FExchangePopup.prototype.init = function()
    {
        this.initUI();
    }

    FExchangePopup.prototype.initUI = function()
    {
        var self = this;

        this.ui.wrapper = FPopup.createPopupWrapper( "black", 0.75 );// GUI.createContainer();
        this.ui.wrapper.isPointerBlocker = true;

        // previewPopup
        this.ui.previewPopup.wrapper = GUI.createContainer();
        var addPreviewUI = function( in_ui ) { self.ui.previewPopup.wrapper.addControl( in_ui ); };

        this.ui.previewPopup.BG = GUI.CreateButton( "previewPopup", px(0), px(0), px(583), px(504), EXCHANGEUI_PATH+"smile_bg1.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.ui.previewPopup.BG.isHitTestVisible = false;
        addPreviewUI( this.ui.previewPopup.BG );

        this.ui.previewPopup.curSmileText = GUI.CreateText( px(-70), px(-80), "123,456,789 개", "Yellow", 33, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        this.ui.previewPopup.BG.addControl( this.ui.previewPopup.curSmileText );

        this.ui.previewPopup.getSmileText = GUI.CreateText( px(-350), px(90), "452,416,424 개", "Black", 20, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        this.ui.previewPopup.BG.addControl( this.ui.previewPopup.getSmileText );
        
        this.ui.previewPopup.excSmileText = GUI.CreateText( px(-70), px(90), "24,000 개", "Black", 20, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        this.ui.previewPopup.BG.addControl( this.ui.previewPopup.excSmileText );

        this.ui.previewPopup.okbtn = GUI.CreateButton( "previewOk", px(0), px(205), px(298), px(67), EXCHANGEUI_PATH + "smile_money.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        addPreviewUI( this.ui.previewPopup.okbtn );
        this.ui.previewPopup.okbtn.onPointerUpObservable.add( function()
        {
            self.openExchangePopup();
        });

        this.ui.previewPopup.closebtn = GUI.CreateButton( "previewClose", px(270), px(-235), px(75), px(74), EXCHANGEUI_PATH + "smile_x.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        addPreviewUI( this.ui.previewPopup.closebtn );
        this.ui.previewPopup.closebtn.onPointerUpObservable.add( function()
        {
            self.closePopup();
        });




        // exchangePopup
        this.ui.exchagnePopup.wrapper = GUI.createContainer();
        var addExchangeUI = function( in_ui ) { self.ui.exchagnePopup.wrapper.addControl( in_ui ); };

        this.ui.exchagnePopup.BG = GUI.CreateButton( "exchagnePopup", px(0), px(0), px(583), px(504), EXCHANGEUI_PATH+"smile_bg2.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.ui.exchagnePopup.BG.isHitTestVisible = false;
        addExchangeUI( this.ui.exchagnePopup.BG );

        this.ui.exchagnePopup.curSmileText = GUI.CreateText( px(-70), px(-80), "123,456,789 개", "Yellow", 33, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        this.ui.exchagnePopup.BG.addControl( this.ui.exchagnePopup.curSmileText );

        this.ui.exchagnePopup.guideSmileText = GUI.CreateText( px(-155), px(37), "신청할 스마일 갯수를 입력해 주세요.", "Gray", 16, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        this.ui.exchagnePopup.BG.addControl( this.ui.exchagnePopup.guideSmileText );
        GUI.alphaAnimation( this.ui.exchagnePopup.guideSmileText, true, 1 );

        var input = GUI.createInputText( "inputText",
                px(250),
                px(37),
                px(500),
                px(100),
                "",
                "Gray",
                22,
                GUI.ALIGN_CENTER,
                GUI.ALIGN_MIDDLE );
            addExchangeUI( input );

        input.onFocusObservable.add ( function()
        {
            self.ui.exchagnePopup.guideSmileText.isVisible = false;
        });

        input.onBlurObservable.add ( function()
        {
            if ( input.text.length <= 0 )
            self.ui.exchagnePopup.guideSmileText.isVisible = true;
        });

        input.onTextChangedObservable.add ( function()
        {
            self.refreshExchangeInput( input );
        });
        
        this.ui.exchagnePopup.resultPriceText = GUI.CreateText( px(-70), px(105), "0 원", "Yellow", 22, GUI.ALIGN_RIGHT, GUI.ALIGN_MIDDLE );
        this.ui.exchagnePopup.BG.addControl( this.ui.exchagnePopup.resultPriceText );

        this.ui.exchagnePopup.okbtn = GUI.CreateButton( "previewOk", px(0), px(205), px(298), px(67), EXCHANGEUI_PATH + "smile_money.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        addExchangeUI( this.ui.exchagnePopup.okbtn );
        this.ui.exchagnePopup.okbtn.onPointerUpObservable.add( function()
        {
            for ( var i = 0; i < 20; ++i )
            {
                setTimeout( function()
                {
                    GUI.createParticle( GUI.DEFAULT_IMAGE_PATH_NEW+"03_symbol/gold_b.png", 20, CommFunc.randomMinMax( 0, 800 )-400, CommFunc.randomMinMax( 0, 1200 )-600 );
                }, 100*i );
            }

            self.openResultPopup();
        });
        self.ui.exchagnePopup.okbtn.alpha = 0.5;
        self.ui.exchagnePopup.okbtn.isHitTestVisible = false;

        this.ui.exchagnePopup.closebtn = GUI.CreateButton( "previewClose", px(270), px(-235), px(75), px(74), EXCHANGEUI_PATH + "smile_x.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        addExchangeUI( this.ui.exchagnePopup.closebtn );
        this.ui.exchagnePopup.closebtn.onPointerUpObservable.add( function()
        {
            self.openPrevPopup();
        });




        // resultPopup
        this.ui.resultPopup.wrapper = GUI.createContainer();
        var addPreviewUI = function( in_ui ) { self.ui.resultPopup.wrapper.addControl( in_ui ); };

        this.ui.resultPopup.BG = GUI.CreateButton( "resultPopup", px(0), px(0), px(583), px(504), EXCHANGEUI_PATH+"smile_bg3.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        this.ui.resultPopup.BG.isHitTestVisible = false;
        addPreviewUI( this.ui.resultPopup.BG );

        this.ui.resultPopup.okbtn = GUI.CreateButton( "previewOk", px(0), px(205), px(298), px(67), EXCHANGEUI_PATH + "smile_ok.png", GUI.ALIGN_CENTER, GUI.ALIGN_MIDDLE );
        addPreviewUI( this.ui.resultPopup.okbtn );
        this.ui.resultPopup.okbtn.onPointerUpObservable.add( function()
        {
            self.closePopup();
        });

        

        self.ui.exchagnePopup.guideSmileText.isVisible = false;
        input.text = "228461";
        self.refreshExchangeInput( input );
    }

    FExchangePopup.prototype.refreshExchangeInput = function( input )
    {
        var self = this;

        
        if ( isNaN( input.text ) || (input.text == "") )
        {
            self.ui.exchagnePopup.resultPriceText.text = "바르게 입력해 주세요";
            self.ui.exchagnePopup.resultPriceText.color = "Red";
            self.ui.exchagnePopup.okbtn.alpha = 0.5;
            self.ui.exchagnePopup.okbtn.isHitTestVisible = false;
        }
        else if ( parseInt( input.text ) < 1000 )
        {   
            self.ui.exchagnePopup.resultPriceText.text = "1000개 이상부터 가능합니다";
            self.ui.exchagnePopup.resultPriceText.color = "Red";
            self.ui.exchagnePopup.okbtn.alpha = 0.5;
            self.ui.exchagnePopup.okbtn.isHitTestVisible = false;
        }
        else
        {
            self.ui.exchagnePopup.resultPriceText.text = CommFunc.numberWithCommas( (parseInt( input.text ) * 60).toString() ) + " 원";
            self.ui.exchagnePopup.resultPriceText.color = "Yellow";
            self.ui.exchagnePopup.okbtn.alpha = 1;
            self.ui.exchagnePopup.okbtn.isHitTestVisible = true;
        }
    }

    FExchangePopup.prototype.openPopup = function()
    {
        G.guiMain.addControl( this.ui.wrapper );
        this.openPrevPopup();
    }

    FExchangePopup.prototype.closePopup = function()
    {
        G.guiMain.removeControl( this.ui.wrapper );
    }

    FExchangePopup.prototype.clearWrapper = function()
    {
        this.ui.wrapper.removeControl( this.ui.previewPopup.wrapper );
        this.ui.wrapper.removeControl( this.ui.exchagnePopup.wrapper );
        this.ui.wrapper.removeControl( this.ui.resultPopup.wrapper );
    }

    FExchangePopup.prototype.openPrevPopup = function()
    {
        this.clearWrapper();

        this.ui.wrapper.addControl( this.ui.previewPopup.wrapper );
        FPopup.openAnimation( this.ui.previewPopup.wrapper );
    }

    FExchangePopup.prototype.openExchangePopup = function()
    {
        this.clearWrapper();

        this.ui.wrapper.addControl( this.ui.exchagnePopup.wrapper );
        FPopup.openAnimation( this.ui.exchagnePopup.wrapper );
    }

    FExchangePopup.prototype.openResultPopup = function()
    {
        this.clearWrapper();

        this.ui.wrapper.addControl( this.ui.resultPopup.wrapper );
        FPopup.openAnimation( this.ui.resultPopup.wrapper );
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
                instance = new FExchangePopup();
                instance.constructor = null;
            }

            return instance;
        }
    };

    return FExchangePopup;
}());