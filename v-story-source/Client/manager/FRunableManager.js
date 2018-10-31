// var FRunable = (function () {
//     function FRunable() {
//     }

//     FRunable.prototype.run = function () {
//     };
//     return FRunable;
// }());


var FRunableManager = (function () {
    function FRunableManager() {
        this.runner = [];
    }

    FRunableManager.prototype.add = function (self) {
        this.runner.push(self);
    };

    FRunableManager.prototype.remove = function (self) {

        CommFunc.arrayRemove(this.runner, self);
    };


    FRunableManager.prototype.run = function () {
        this.runner.forEach(function(value){
            value.run();
        });
        
    }

    FRunableManager.prototype.destroy = function() {

        CommFunc.arrayRemoveAll(this.runner);
    }


    return FRunableManager;
}());