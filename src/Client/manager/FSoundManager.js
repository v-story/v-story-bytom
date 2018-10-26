'use strict';

var FSoundManager = (function() 
{
    var DEFAULT_SOUND_PATH = ASSET_URL+"101_sound/"
    function FSoundManager()
    {
        this.BGMList = [];
        this.EffectList = [];       
        this.globalVolume = 1;
    }

    FSoundManager.prototype.preloadSound = function()
    {
        var self = this;

        this.EffectList = [];

        var effectPreloadList = [ "EFFECT_ButtonClick.ogg", "EFFECT_PopupOpen.ogg", "EFFECT_QuestClear.ogg", "EFFECT_SmileMark.ogg", 
        "EFFECT_SmileMarkExchange.ogg", "EFFECT_Login.ogg", "EFFECT_Object.ogg" ];
        
        var pushEffectSound = function( in_soundName )
        {
            self.EffectList.push( new BABYLON.Sound( in_soundName, DEFAULT_SOUND_PATH+in_soundName, G.scene, null, { loop:false, autoplay:false } ) );
        }
        
        effectPreloadList.forEach( function( in_iter )
        {
            pushEffectSound( in_iter );
        });
    }

    FSoundManager.prototype.stopSound = function() {

        this.BGMList.forEach( function( in_iter )
        {
            in_iter.stop();
        });

        this.EffectList.forEach( function( in_iter )
        {
            in_iter.stop();
        });
    }

    FSoundManager.prototype.playBGMSound = function( in_bgmName )
    {
        var self = this;

        self.BGMList.forEach( function( in_iter )
        {
            in_iter.stop();
        });

        self.BGMList = []; // 미리 로드한 사운드는 가지고있다가 재생시키려 했는데 씬이 달라서 그런지 안된다. 걍 바로 로딩함.

        var found = false;
        this.BGMList.forEach( function( in_iter )
        {
            if ( in_iter.name == in_bgmName )
            {
                in_iter.play();
                found = true;
            }
        } );

        if ( !found )
        {
            self.BGMList.push( new BABYLON.Sound( in_bgmName, DEFAULT_SOUND_PATH+in_bgmName, G.scene, null, { loop:true, autoplay:true }) );
        }
    }

    FSoundManager.prototype.playEffectSound = function( in_effectName )
    {
        return;
        var self = this;

        var found = false;
        this.EffectList.forEach( function( in_iter )
        {
            if ( in_iter.name == in_effectName )
            {
                in_iter.play();
                found = true;
            }
        } );

        if ( !found )
        {
            self.EffectList.push( newLoadSound = new BABYLON.Sound( in_effectName, DEFAULT_SOUND_PATH+in_effectName, G.scene, { loop:false, autoplay:true }) );
        }
    }

    FSoundManager.prototype.playPopupOpenSound = function()
    {        
        this.playEffectSound( "EFFECT_PopupOpen.ogg" );
    }

    FSoundManager.prototype.playQuestClearSound = function()
    {
        this.playEffectSound( "EFFECT_QuestClear.ogg" );
    }

    FSoundManager.prototype.mute = function()
    {
        this.globalVolume = 0;
        BABYLON.Engine.audioEngine.setGlobalVolume(this.globalVolume);
    }

    FSoundManager.prototype.unMute = function()
    {
        this.globalVolume = 1;
        BABYLON.Engine.audioEngine.setGlobalVolume(this.globalVolume);        
    }

    FSoundManager.prototype.isMute = function()
    {
        return ((0==this.globalVolume)?true:false);
    }



    return FSoundManager;
}());