'use strict';

var FState = (function () {
    function FState() {
        this.state = -1;
        this.preState = -1;
        this.nextState = -1;
        this.count = 0;
        this.state = -1;
        this.preState = -1;
        this.nextState = -1;
        this.count = 0;
    }
    FState.prototype.init = function () {
    };
    FState.prototype.destroy = function () {
    };
    FState.prototype.run = function () {
        if (-1 != this.nextState) {
            this.destroy();
            this.preState = this.state;
            this.state = this.nextState;
            this.nextState = -1;
            this.init();
            this.count = 0;
        }
        this.count++;

        return 0;
    };
    FState.prototype.reservedState = function (state, force) {
        if (this.state == state && force != true)
            return;
        this.nextState = state;
    };
    return FState;
}());
//# sourceMappingURL=FState.js.map