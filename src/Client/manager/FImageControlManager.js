'use strict'

var FImageControlManager = (function()
{
    function FImageControlManager()
    {
        this.m_cropper = null;

        this.m_html = 
        {
            m_div : null,

            m_imageBG : null,
            m_imageCropBox : null,
            m_imageCover : null,

            m_resultImage : null,

            m_cropBtn : null,
            m_resetBtn : null,

            m_loadingCover : null,
        }

        this.m_endCallback = null;


        // init func
        this.init();
    }

    FImageControlManager.prototype.init = function()
    {
        this.loadHtmlData();
    }

    FImageControlManager.prototype.loadHtmlData = function()
    {
        var self = this;

        this.m_html.m_div = $("#cropDiv");

        this.m_html.m_imageBG = document.querySelector('#cropImageBG');
        this.m_html.m_imageCover = document.querySelector('#cropImageCover');

        this.m_html.m_cropBtn = document.querySelector('#cropImgButton');
        this.m_html.m_cropBtn.onclick = function()
        {
            self.onClickCropBtn();
        }

        this.m_html.m_resetBtn = document.querySelector('#cropResetButton');
        this.m_html.m_resetBtn.onclick = function()
        {
            self.onClickResetBtn();
        }

        this.m_html.m_loadingCover = document.querySelector('#cropLoading');
    }

    /**
     * 
     * @param {String} in_bgImage // 편집할 이미지
     * @param {String} in_coverImage // 위에 올릴 이미지
     * @param {Function( String )} in_onEndFunc  // 최종 이미지 URL 을 인자값으로 콜백해줌
     */
    FImageControlManager.prototype.setCropperData = function( in_bgImage, in_coverImage, in_onEndFunc )
    {
        this.showLoadingCover();

        var self = this;

        this.m_endCallback = in_onEndFunc;

        this.m_html.m_imageBG.src = in_bgImage;
        this.m_html.m_imageCover.src = in_coverImage;

        this.m_cropper = new Cropper( this.m_html.m_imageBG,
            {
                dragMode: 'move',
                aspectRatio: 1,
                autoCropArea: 0.8,
                restore: false,
                guides: false,
                center: false,
                highlight: false,
                cropBoxMovable: false,
                cropBoxResizable: false,
                toggleDragModeOnDblclick: false,
                ready : function () 
                {
                    self.m_html.m_imageCover.style.width = $(".cropper-crop-box")[0].style.width;
                    self.m_html.m_imageCover.style.height = $(".cropper-crop-box")[0].style.height;
                    self.m_html.m_imageCover.style.transform = $(".cropper-crop-box")[0].style.transform;

                    self.hideLoadingCover();
                }
            });
    }

    FImageControlManager.prototype.hideCropper = function()
    {
        $("#cropDiv").hide();
    }

    FImageControlManager.prototype.showCropper = function()
    {
        $("#cropDiv").show();
    }

    FImageControlManager.prototype.showLoadingCover = function()
    {
        $('#cropLoading').show();
    }

    FImageControlManager.prototype.hideLoadingCover = function()
    {
        $('#cropLoading').hide();
    }

    
    FImageControlManager.prototype.onClickCropBtn = function()
    {        
        // alert("onclickCropBtn!");
        this.showLoadingCover();

        var self = this;


        var useBlobFlow = true;
        if ( useBlobFlow )
        {
            // alert("convertBlobFlow Start!");
            this.m_cropper.getCroppedCanvas().toBlob((blob) => 
            {
                var imgURL = window.URL.createObjectURL(blob);

                // alert(blob);
                if ( self.m_endCallback != null )
                {
                    self.m_endCallback( imgURL, blob );
                }
                self.m_endCallback = null;
    
                // alert("des start!");
                self.m_cropper.destroy();
    
                // alert("des success");
                self.hideLoadingCover();
    
                // alert("hideCover");
            });
        }
        else
        {
            // alert("useURLFlow Start!");
            var imgURL = this.m_cropper.getCroppedCanvas().toDataURL();
            
            // alert(imgURL);
            if ( self.m_endCallback != null )
            {
                self.m_endCallback( imgURL );
            }
            self.m_endCallback = null;
            
            // alert("des start!");
            self.m_cropper.destroy();
            // alert("des success");
            self.hideLoadingCover();
            // alert("hideCover");
        }

        this.hideCropper();
    }

    FImageControlManager.prototype.onClickResetBtn = function()
    {
        this.m_cropper.reset();
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
                instance = new FImageControlManager();
                instance.constructor = null;
            }

            return instance;
        }
    };

}());