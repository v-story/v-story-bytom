'use strict';

var TILE_CELL_SIZE_X = 1;
var TILE_CELL_SZIE_Z = 1;
var TILE_CELL_HEIGHT = 1;

var TILE_TYPE = 
{
    NORMAL: 0,
    WALL:   1,
    DOOR:   2,
    ROAD:   3,
    OBJECT: 4,
    PORTAL: 5,
    WATER:  6,
    MAX:    7,
}

var TILE_CELL = (function()
{
    function TILE_CELL()
    {
        this.index = -1;
        
        this.size =
        { 
            x:TILE_CELL_SIZE_X,
            z:TILE_CELL_SZIE_Z 
        };
    
        this.height = TILE_CELL_HEIGHT,
        
        this.position =
        { 
            x:0, 
            z:0 
        };
    
        this.type = TILE_TYPE.NORMAL;
        this.data = null;
    }

    return TILE_CELL;
    
}());

var TILE_DATA = (function()
{
    function TILE_DATA()
    {
        this.name = "";

        this.tileCount = { x:0, z:0 };
        this.offset = {x:0,z:0};

        this.tile = [];
        this.parsedTile = [];
    }

    return TILE_DATA;
}());

var FTileManager = (function() 
{
    function FTileManager()
    {
        this.currentFile = null;
        this.tileData = null;
    }

    FTileManager.prototype.loadDataFile = function( in_tileDataFile )
    {
        this.currentFile = in_tileDataFile;
        this.tileData = G.dataManager.getTileData( in_tileDataFile );
    }

    FTileManager.prototype.getTileIndexFromWorldPos = function( in_x, in_z )
    {
        var index = parseInt( (in_x-this.tileData.offset.x)/TILE_CELL_SIZE_X ) + (parseInt( (in_z-this.tileData.offset.z)/TILE_CELL_SZIE_Z )*this.tileData.tileCount.x);
        
        return index;
    }

    return FTileManager;
}());