'use strict';

var ALPHAGO_BRAIN_IDLE              = 1;
var ALPHAGO_BRAIN_ACTION            = 2;
var ALPHAGO_BRAIN_OBJ_INTERACTION   = 3;
var ALPHAGO_BRAIN_GO                = 4;

var FAlphaGo = (function () {

    function FAlphaGo(body,steward,pet) {

        this.alphaGoBody = body;
        this.steward = steward;
        this.pet = pet;
        this.relaxTime = 0;
        this.startTime = 0;

        //처음 시작할때 일정 횟수만큼은 걷기만 한다.
        this.brainCount = 0;
        this.preBrain   = 0;
        this.onlyWalk   = false;
    }


    FAlphaGo.prototype.setRelaxTime = function(t) {
        this.relaxTime = t;
    }

    FAlphaGo.prototype.destroy = function() {

    }


    FAlphaGo.prototype.run = function () {

        if(this.steward) {
            if(this.alphaGoBody.isRelax() && !this.relaxTime) {

                if(this.alphaGoBody.follow){
                    
                    // var position = this.alphaGoBody.follow.getPosition();
                    // var x,z;

                    // if(position.x < 0) x = position.x+30;
                    // else x = position.x - 30;

                    // if(position.z < 0) z = position.z-30;
                    // else z = position.z + 30;

                    // var index = FMapManager.getInstance().getWorldToIndex(x, z);

                    var index = this.alphaGoBody.follow.getPositionTile();

                    // var axis = FMapManager.getInstance().getCoordinateAxis(index);

                    // axis.x += 2;
                    // axis.y += 2;

                    // index = FMapManager.getInstance().getIndexAxis(axis.x, axis.y);


                    this.alphaGoBody.startMove(index);
                }
            }
        } else {

            if(!this.relaxTime) {

                var inside = this.alphaGoBody.getInsideWalk();

                if(inside == null) {

                    var rnd = CommFunc.random(1000);

                    if(rnd < 500) inside = true;
                    else inside = false;
                } 
                

                if(this.alphaGoBody.isRelax()) {
                    
                    if(inside == true) {

                        if(this.brainCount < 5 || this.onlyWalk) {
                            
                            this.setStartMove(1);

                        } else {

                            var brainSearch = 10;

                            while(brainSearch) {

                                brainSearch--;

                                var rnd = CommFunc.random(1000);
    
                                if(rnd < 50) {
                                    if(this.preBrain != ALPHAGO_BRAIN_IDLE) {
                                        //그냥 서 있는다.
                                        this.relaxTime = 5000;
                                        this.startTime = new Date().getTime();
                                        this.preBrain = ALPHAGO_BRAIN_IDLE;
                                        brainSearch = 0;
                                    }

                                } else if(rnd < 250) { 
                                    if(this.preBrain != ALPHAGO_BRAIN_ACTION) {
                                        //아무 애니메이션을 한다.
                                        this.alphaGoBody.randomAnimation();
                                        this.preBrain = ALPHAGO_BRAIN_ACTION;
                                        brainSearch = 0;
                                    }

                                } else if(rnd < 350) {
                                    if(this.preBrain != ALPHAGO_BRAIN_OBJ_INTERACTION) {
                                        //오브젝트 상호작용을 한다.
                                        this.setObjectInteraction();
                                        this.preBrain = ALPHAGO_BRAIN_OBJ_INTERACTION;
                                        brainSearch = 0;
                                    }

                                } else {
                                    if(this.preBrain != ALPHAGO_BRAIN_GO) {
                                        //그냥 이동한다.
                                        this.setStartMove(1);
                                        this.preBrain = ALPHAGO_BRAIN_GO;
                                        brainSearch = 0;
                                    }

                                }
                            }
                        }

                        this.brainCount++;
    
                    } else if(inside == false) {
    
                        this.setStartMove(0);
                    }
                } 

            } else {
                var curTime = (new Date()).getTime();

                if(curTime - this.startTime > this.relaxTime) {

                    this.relaxTime = 0;
                    this.startTime = 0;

                }
            }
        }
    }

    FAlphaGo.prototype.setStartMove = function(layer) {

        var index = null;

        if(layer == 1) index = FMapManager.getInstance().getRandomTileLayer1();
        else if(layer == 0) index = FMapManager.getInstance().getRandomTileLayer0();

        this.alphaGoBody.startMove(index);
    }

    FAlphaGo.prototype.setObjectInteraction = function() {
        this.alphaGoBody.randomInteraction();
        // this.waitAction = true;
    }

    return FAlphaGo;

}());