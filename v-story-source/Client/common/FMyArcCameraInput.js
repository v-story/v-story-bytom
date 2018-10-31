
'use strict';

var __decorate=this&&this.__decorate||function(e,t,i,r){var n,o=arguments.length,s=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(s=(o<3?n(s):o>3?n(t,i,s):n(t,i))||s);return o>3&&s&&Object.defineProperty(t,i,s),s}

var FMyArcRotateCameraPointersInput = /** @class */ (function () {
    function FMyArcRotateCameraPointersInput(axisX, axisY, axisZ, panningInertia) {
        this.buttons = [0, 1, 2];
        this.angularSensibilityX = 1000.0; //회전 민감도
        this.angularSensibilityY = 1000.0;
        this.pinchPrecision = 12.0;
        /**
         * pinchDeltaPercentage will be used instead of pinchPrecision if different from 0.
         * It defines the percentage of current camera.radius to use as delta when pinch zoom is used.
         */
        this.pinchDeltaPercentage = 0;
        this.panningSensibility = 50.0;//1000.0; 이동 민감도
        this.multiTouchPanning = true;
        this.multiTouchPanAndZoom = true;
        this._isPanClick = false;
        this.pinchInwards = true;
        this.wheelPrecision = 5.0;
        
        this.cantMoveCamera = false;

        this.axisX = axisX;
        this.axisY = axisY;
        this.axisZ = axisZ;

        if(panningInertia)
            this.panningInertia = panningInertia;
        else
            this.panningInertia = 0.9;
    }

    FMyArcRotateCameraPointersInput.prototype.attachControl = function (element, noPreventDefault) {
        var _this = this;
        var engine = this.camera.getEngine();
        var cacheSoloPointer; // cache pointer object for better perf on camera rotation
        var pointA = null;
        var pointB = null;
        var previousPointerA = null;
        var previousPointerB = null;
        var previousPinchSquaredDistance = 0;
        var initialDistance = 0;
        var twoFingerActivityCount = 0;
        var previousMultiTouchPanPosition = { x: 0, y: 0, isPaning: false, isPinching: false };
        // var previousClientY = 0;

        
        //화면 움직임을 x,z축으로 움직이도록
        this.camera.panningAxis = new Vector3(this.axisX,this.axisY,this.axisZ);

        //효과 없음
        this.inertia = 0;
        

        // mouse wheel input
        // this._wheel = function (p, s) {
        this.onPointerWheel = function (p) {

            // console.log('mousewheel');
            //sanity check - this should be a PointerWheel event.
            // if (p.type !== BABYLON.PointerEventTypes.POINTERWHEEL)
            if (p.type !== "mousewheel")
                return;
            // var event = p.event;
            var event = p;
            var delta = 0;
            if (event.wheelDelta) {
                delta = event.wheelDelta / (_this.wheelPrecision * 4);
            }
            else if (event.detail) {
                delta = -event.detail / _this.wheelPrecision;
            }
            if (delta)
                if(_this.camera) _this.camera.inertialRadiusOffset += delta;
            if (event.preventDefault) {
                if (!noPreventDefault) {
                    event.preventDefault();
                }
            }
        };
        // this._observer = this.camera.getScene().onPointerObservable.add(this._wheel, BABYLON.PointerEventTypes.POINTERWHEEL);

        this.onPointerDown = function(evt) {
            if (evt.type != "pointerdown") return;
            // try {
            //     srcElement.setPointerCapture(evt.pointerId);
            // }
            // catch (e) {
            //     //Nothing to do with the error. Execution will continue.
            // }
            // Manage panning with pan button click
            _this._isPanClick = evt.button === _this.camera._panningMouseButton;
            // manage pointers
            cacheSoloPointer = { x: evt.clientX, y: evt.clientY, pointerId: evt.pointerId, type: evt.pointerType };
            if (pointA === null) {
                pointA = cacheSoloPointer;
                // console.log('pointA : ' + evt.pointerId);
            }
            else if (pointB === null && (pointA.pointerId !=  evt.pointerId)) {
                pointB = cacheSoloPointer;
                // console.log('pointB : ' + evt.pointerId);
            }
            if (!noPreventDefault) {
                evt.preventDefault();
                element.focus();
            }

            //새로 눌리면 기존에 관성으로 움직이던 애들을 스톱
            _this.camera.inertialAlphaOffset = 0;
            _this.camera.inertialBetaOffset = 0;
        }

        this.onPointerGUp = function(evt) {
            if (evt.type != "pointerup") return;
            
            // try {
            //     srcElement.releasePointerCapture(evt.pointerId);
            // }
            // catch (e) {
            //     //Nothing to do with the error.
            // }
            _this.cantMoveCamera = false;

            if(CommFunc.isPhone()) {
                _this.camera.inertialAlphaOffset /= 2;
                _this.camera.inertialBetaOffset /= 2;
            }


            cacheSoloPointer = null;
            previousPinchSquaredDistance = 0;
            previousMultiTouchPanPosition.isPaning = false;
            previousMultiTouchPanPosition.isPinching = false;
            twoFingerActivityCount = 0;
            initialDistance = 0;

            if (evt.pointerType !== "touch") {
                pointB = null; // Mouse and pen are mono pointer
            }
            //would be better to use pointers.remove(evt.pointerId) for multitouch gestures, 
            //but emptying completly pointers collection is required to fix a bug on iPhone : 
            //when changing orientation while pinching camera, one pointer stay pressed forever if we don't release all pointers  
            //will be ok to put back pointers.remove(evt.pointerId); when iPhone bug corrected
            if (engine.badOS) {
                pointA = pointB = null;
            }
            else {
                //only remove the impacted pointer in case of multitouch allowing on most 
                //platforms switching from rotate to zoom and pan seamlessly.
                if (pointB && pointA && pointA.pointerId == evt.pointerId) {
                    pointA = pointB;
                    pointB = null;
                    cacheSoloPointer = { x: pointA.x, y: pointA.y, pointerId: pointA.pointerId, type: evt.pointerType };
                }
                else if (pointA && pointB && pointB.pointerId == evt.pointerId) {
                    pointB = null;
                    cacheSoloPointer = { x: pointA.x, y: pointA.y, pointerId: pointA.pointerId, type: evt.pointerType };
                }
                else {
                    pointA = pointB = null;
                    previousPointerA = null;
                    previousPointerB = null;
                }
            }
            if (!noPreventDefault) {
                evt.preventDefault();
            }
        
        }

        this.onPointerMove = function (evt) {
            if (evt.type != "pointermove") return;

            if (!noPreventDefault) {
                evt.preventDefault();
            }
            // One button down
            if (pointA && pointB === null && cacheSoloPointer) {
                
                // console.log('one button mouse');

                if(_this.cantMoveCamera) return;
                
                if (_this.panningSensibility !== 0 &&
                    ((evt.ctrlKey && _this.camera._useCtrlForPanning) || _this._isPanClick)) {
                        //오른쪽 마우스로 카메라 회전
                        //폰에서는 작동하지 않는다.
                        var offsetX = evt.clientX - cacheSoloPointer.x;
                        var offsetY = evt.clientY - cacheSoloPointer.y;
                        _this.camera.inertialAlphaOffset -= offsetX / _this.angularSensibilityX;
                        _this.camera.inertialBetaOffset -= offsetY / _this.angularSensibilityY;
                }
                else {
                    //왼쪽 마우스로 카메라 이동
                    _this.camera.panningInertia = _this.panningInertia;//0.3;
                    _this.camera.inertialPanningX += -(evt.clientX - cacheSoloPointer.x)*(_this.camera.radius*0.06) / _this.panningSensibility;
                    _this.camera.inertialPanningY += (evt.clientY - cacheSoloPointer.y)*(_this.camera.radius*0.06) / _this.panningSensibility;

                    _this.camera.inertialPanningY += _this.camera.inertialPanningY*(Math.max( 0, 0.4-_this.camera.beta )*5);
                }
                cacheSoloPointer.x = evt.clientX;
                cacheSoloPointer.y = evt.clientY;
            }
            else if (pointA && pointB) { // 이건 손가락 두개로 눌렀을때

                var prePointerA = { x: pointA.x, y: pointA.y, pointerId: pointA.pointerId, type: pointA.pointerType };
                var prePointerB = { x: pointB.x, y: pointB.y, pointerId: pointB.pointerId, type: pointB.pointerType };

                if(pointA.pointerId === evt.pointerId) {
                    previousPointerA = { x: pointA.x, y: pointA.y, pointerId: pointA.pointerId, type: pointA.pointerType };
                } else {
                    previousPointerB = { x: pointB.x, y: pointB.y, pointerId: pointB.pointerId, type: pointB.pointerType };
                }

                //if (noPreventDefault) { evt.preventDefault(); } //if pinch gesture, could be useful to force preventDefault to avoid html page scroll/zoom in some mobile browsers
                var ed = (pointA.pointerId === evt.pointerId) ? pointA : pointB;
                ed.x = evt.clientX;
                ed.y = evt.clientY;
                var direction = _this.pinchInwards ? 1 : -1;
                var distX = pointA.x - pointB.x;
                var distY = pointA.y - pointB.y;
                var pinchSquaredDistance = (distX * distX) + (distY * distY);

                var pinchDistance = Math.sqrt(pinchSquaredDistance);
                if (previousPinchSquaredDistance === 0) {
                    initialDistance = pinchDistance;
                    previousPinchSquaredDistance = pinchSquaredDistance;
                    previousMultiTouchPanPosition.x = (pointA.x + pointB.x) / 2;
                    previousMultiTouchPanPosition.y = (pointA.y + pointB.y) / 2;
                    return;
                }

                if (_this.multiTouchPanAndZoom) {
                    if (_this.pinchDeltaPercentage) {
                        _this.camera.inertialRadiusOffset += ((pinchSquaredDistance - previousPinchSquaredDistance) * 0.001) * _this.camera.radius * _this.pinchDeltaPercentage;
                    }
                    else {

                        var offAX = prePointerA.x - pointA.x;
                        var offAY = prePointerA.y - pointA.y;
                        var offBX = prePointerB.x - pointB.x;
                        var offBY = prePointerB.y - pointB.y;

                        var zoomValue = (pinchSquaredDistance - previousPinchSquaredDistance) /
                        (_this.pinchPrecision * ((_this.angularSensibilityX + _this.angularSensibilityY) / 2) * direction);
                        _this.camera.radius -= zoomValue*30;


                        if(!CommFunc.isPhone()) {                             

                            if(offAX && offAY) {
                                _this.camera.inertialBetaOffset += offAY / _this.angularSensibilityY;
                            } else if(offBX && offBY) {
                                _this.camera.inertialBetaOffset += offBY / _this.angularSensibilityY;
                            }

                            var AX, AY, BX, BY;
                            var previousAX, previousAY, previousBX, previousBY;                        

                            //x값이 작은게 왼손, 큰게 오른손
                            //왜냐..오른손 먼저 누르고 왼손을 누르게 되면 거꾸로 회전이 된다.
                            if(pointA.x < pointB.x) {
                                AX = pointA.x; previousAX = previousPointerA.x;
                                AY = pointA.y; previousAY = previousPointerA.y;
                                BX = pointB.x; previousBX = previousPointerB.x;
                                BY = pointB.y; previousBY = previousPointerB.y;
                            } else {
                                AX = pointB.x; previousAX = previousPointerB.x;
                                AY = pointB.y; previousAY = previousPointerB.y;
                                BX = pointA.x; previousBX = previousPointerA.x;
                                BY = pointA.y; previousBY = previousPointerA.y;
                            }

                            offAX = previousAX - AX;
                            offAY = previousAY - AY;
                            offBX = previousBX - BX;
                            offBY = previousBY - BY;

                            if(offAY > 0 && offBY < 0) {
                                _this.camera.inertialAlphaOffset += offAY / _this.angularSensibilityX;
                            } if(offAY < 0 && offBY > 0) {
                                _this.camera.inertialAlphaOffset += offAY / _this.angularSensibilityX;
                            }
                        }
                    }
                }
                else {
                    twoFingerActivityCount++;
                    if (previousMultiTouchPanPosition.isPinching || (twoFingerActivityCount < 20 && Math.abs(pinchDistance - initialDistance) > _this.camera.pinchToPanMaxDistance)) {
                        if (_this.pinchDeltaPercentage) {
                            _this.camera.inertialRadiusOffset += ((pinchSquaredDistance - previousPinchSquaredDistance) * 0.001) * _this.camera.radius * _this.pinchDeltaPercentage;
                        }
                        else {
                            _this.camera.inertialRadiusOffset += (pinchSquaredDistance - previousPinchSquaredDistance) /
                                                                    (_this.pinchPrecision * ((_this.angularSensibilityX + _this.angularSensibilityY) / 2) * direction);
                        }
                        previousMultiTouchPanPosition.isPaning = false;
                        previousMultiTouchPanPosition.isPinching = true;
                    }
                    else {
                        if (cacheSoloPointer && cacheSoloPointer.pointerId === ed.pointerId && _this.panningSensibility !== 0 && _this.multiTouchPanning) {
                            if (!previousMultiTouchPanPosition.isPaning) {
                                previousMultiTouchPanPosition.isPaning = true;
                                previousMultiTouchPanPosition.isPinching = false;
                                previousMultiTouchPanPosition.x = ed.x;
                                previousMultiTouchPanPosition.y = ed.y;
                                return;
                            }
                            _this.camera.inertialPanningX += -(ed.x - previousMultiTouchPanPosition.x) / (_this.panningSensibility);
                            _this.camera.inertialPanningY += (ed.y - previousMultiTouchPanPosition.y) / (_this.panningSensibility);
                        }
                    }
                    if (cacheSoloPointer && cacheSoloPointer.pointerId === evt.pointerId) {
                        previousMultiTouchPanPosition.x = ed.x;
                        previousMultiTouchPanPosition.y = ed.y;
                    }
                }
                previousPinchSquaredDistance = pinchSquaredDistance;
            }
            
        }

        this.onPointerLeave = function (evt) {
            _this._onLostFocus();
        }


        this._onContextMenu = function (evt) {
            evt.preventDefault();
        };
        if (!this.camera._useCtrlForPanning) {
            element.addEventListener("contextmenu", this._onContextMenu, false);
        }
        this._onLostFocus = function () {
            //this._keys = [];
            pointA = pointB = null;
            previousPinchSquaredDistance = 0;
            previousMultiTouchPanPosition.isPaning = false;
            previousMultiTouchPanPosition.isPinching = false;
            twoFingerActivityCount = 0;
            cacheSoloPointer = null;
            initialDistance = 0;
        };

        // this._onMouseMove = function (evt) {

        //     if (!engine.isPointerLock) {
        //         return;
        //     }
            
        //     var offsetX = evt.movementX || evt.mozMovementX || evt.webkitMovementX || evt.msMovementX || 0;
        //     var offsetY = evt.movementY || evt.mozMovementY || evt.webkitMovementY || evt.msMovementY || 0;
        //     _this.camera.inertialAlphaOffset -= offsetX / _this.angularSensibilityX;
        //     _this.camera.inertialBetaOffset -= offsetY / _this.angularSensibilityY;
        //     if (!noPreventDefault) {
        //         evt.preventDefault();
        //     }
        // };

        // this._onPointerLeave = function(evt) {
        //     _this._onLostFocus();
        // }

        this._onGestureStart = function (e) {
            if (window.MSGesture === undefined) {
                return;
            }
            if (!_this._MSGestureHandler) {
                _this._MSGestureHandler = new MSGesture();
                _this._MSGestureHandler.target = element;
            }
            _this._MSGestureHandler.addPointer(e.pointerId);
        };
        this._onGesture = function (e) {
            _this.camera.radius *= e.scale;
            if (e.preventDefault) {
                if (!noPreventDefault) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        };
        // element.addEventListener("mouseout",  this._onPointerLeave, false);
        // element.addEventListener("mousemove", this._onMouseMove, false);
        element.addEventListener("MSPointerDown", this._onGestureStart, false);
        element.addEventListener("MSGestureChange", this._onGesture, false);
        BABYLON.Tools.RegisterTopRootEvents([
            { name: "blur", handler: this._onLostFocus }
        ]);
    };
    
    FMyArcRotateCameraPointersInput.prototype.detachControl = function (element) {
        if (this._onLostFocus) {
            BABYLON.Tools.UnregisterTopRootEvents([
                { name: "blur", handler: this._onLostFocus }
            ]);
        }
        if (element && this._observer) {
            this.camera.getScene().onPointerObservable.remove(this._observer);
            this._observer = null;
            if (this._onContextMenu) {
                element.removeEventListener("contextmenu", this._onContextMenu);
            }
            // if (this._onMouseMove) {
            //     element.removeEventListener("mousemove", this._onMouseMove);
            // }
            // if (this._onPointerLeave) {
            //     element.removeEventListener("mouseout", this._onPointerLeave);
            // }
            if (this._onGestureStart) {
                element.removeEventListener("MSPointerDown", this._onGestureStart);
            }
            if (this._onGesture) {
                element.removeEventListener("MSGestureChange", this._onGesture);
            }
            this._isPanClick = false;
            this.pinchInwards = true;
            // this._onMouseMove = null;
            // this._onPointerLeave = null;
            this._onGestureStart = null;
            this._onGesture = null;
            this._MSGestureHandler = null;
            this._onLostFocus = null;
            this._onContextMenu = null;
        }
    };

    FMyArcRotateCameraPointersInput.prototype.enableMoveCamera = function() {
        this.cantMoveCamera = false;
        if(this._onLostFocus) this._onLostFocus();
        // console.error('move camera');
    };

    FMyArcRotateCameraPointersInput.prototype.disableMoveCamera = function() {
        this.cantMoveCamera = true;
        if(this._onLostFocus) this._onLostFocus();
        // console.error('dont move camera');
    };

    FMyArcRotateCameraPointersInput.prototype.getClassName = function () {
        return "FMyArcRotateCameraPointersInput";
    };
    FMyArcRotateCameraPointersInput.prototype.getSimpleName = function () {
        return "pointers";
    };
    __decorate([
        BABYLON.serialize()
    ], FMyArcRotateCameraPointersInput.prototype, "buttons", void 0);
    __decorate([
        BABYLON.serialize()
    ], FMyArcRotateCameraPointersInput.prototype, "angularSensibilityX", void 0);
    __decorate([
        BABYLON.serialize()
    ], FMyArcRotateCameraPointersInput.prototype, "angularSensibilityY", void 0);
    __decorate([
        BABYLON.serialize()
    ], FMyArcRotateCameraPointersInput.prototype, "pinchPrecision", void 0);
    __decorate([
        BABYLON.serialize()
    ], FMyArcRotateCameraPointersInput.prototype, "pinchDeltaPercentage", void 0);
    __decorate([
        BABYLON.serialize()
    ], FMyArcRotateCameraPointersInput.prototype, "panningSensibility", void 0);
    __decorate([
        BABYLON.serialize()
    ], FMyArcRotateCameraPointersInput.prototype, "multiTouchPanning", void 0);
    __decorate([
        BABYLON.serialize()
    ], FMyArcRotateCameraPointersInput.prototype, "multiTouchPanAndZoom", void 0);
    return FMyArcRotateCameraPointersInput;
}());
BABYLON.FMyArcRotateCameraPointersInput = FMyArcRotateCameraPointersInput;
BABYLON.CameraInputTypes["FMyArcRotateCameraPointersInput"] = FMyArcRotateCameraPointersInput;

