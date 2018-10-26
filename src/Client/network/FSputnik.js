

'use strict';

var FSputnik = (function () {

    var WS_CONNECTING   = 0;	//연결이 수립되지 않은 상태입니다.
    var WS_OPEN         = 1;	//연결이 수립되어 데이터가 오고갈 수 있는 상태입니다.
    var WS_CLOSING      = 2;	//연결이 닫히는 중 입니다.
    var WS_CLOSED       = 3;	//연결이 종료되었거나, 연결에 실패한 경우입니다.
    
    var STATE_WAIT_SEND = 88;
    var STATE_WAIT_RES  = 99;

    function FSputnik(name) {
        // if ("WebSocket" in window) {
        //     Debug.Alert("WebSocket NOT supported by your Browser!");

        //     return;
        // }
        var self = this;

        this.name = name;
        this.procTimerId = null;
        this.threadTime = 100;
        this.heartbeatTime = 20000;
        this.timeoutTime = 15000;
        this.hbCount = this.heartbeatTime/this.threadTime;

        this.timeoutTimerId = null;

        this.request = new buckets.Queue();
        this.respose = new buckets.Queue();
        this.func    = new buckets.LinkedList();

        this.heartbeat = false;
        this.state = STATE_WAIT_SEND;

        // if(initKey != 1) return;
        if(ACCOUNTPK != -1 && REGKEY != -1) {
            if(this.wsocket != null) this.wsocket.close();

            this.wsocket = new WebSocket(WS_DOMAIN);
            console.log('웹소켓 커넥트');

            this.wsocket.onopen = function(evt) {
                console.log("socket open");
                self.procTimerId = setInterval(function(){
                    Thread(self)
                }, self.threadTime);
    
    
            }
    
            this.wsocket.onmessage = function(evt) {
                
                self.respose.add(evt);
                // console.log(evt);
            }
    
            this.wsocket.onclose = function(evt) {
                console.log("socket close");
                Debug.Alert('socket close');
                self.dispose();
                ACCOUNTPK = -1;
                REGKEY = -1;
                sessionStorage.clear();
                location.href = "";
            }
    
            this.wsocket.onerror = function(evt) {
                console.error(evt);
            }
        }



    }

    FSputnik.prototype.dispose = function() {
        clearInterval(this.procTimerId);
    }

    FSputnik.prototype.getOpcodeName = function(opCode) {
        for(var key in opcode) {
            if(opcode[key] == opCode) {
                return key;
            }
        }
    }

    FSputnik.prototype.ResponseQueue = function() {

        var self = this;
        if( 0 == self.respose.size()) return;
        
        var res = self.respose.dequeue();
        var data = JSON.parse(res.data);
        var sendtype = data.opCode;

        this.state = STATE_WAIT_SEND;

        if(sendtype != opcode['HeartBeat']) {

            Debug.Log("[websocket recv - " + this.getOpcodeName(data.opCode) +"]\n" + res.data);

            // clearTimeout(this.timeoutTimerId);

        }
            

        if(ws.isError(data, true)) return;

        var asyn = this.asyncResponse(data);
        if(!asyn) {
            self.func.forEach(function(elem){

                if(elem.sendtype === sendtype) {
    
                    if(elem.func) elem.func(data, elem.param);
                    self.func.remove(elem);
                    return;
                }
            });
        }

        // console.log(this.name + " recv: " + data);
    }

    FSputnik.prototype.RequestQueue = function() {
        
        var self = this;

        if(this.state != STATE_WAIT_SEND) return;
        if( 0 == this.request.size()) return;
        
        var req = this.request.dequeue();

        var data = JSON.parse(req);

        this.wsocket.send(req);        

        this.state = STATE_WAIT_RES;

        if(data.opCode != 999) {
            Debug.Log("[websocket send - " + this.getOpcodeName(data.opCode) +"]\n" + req);

            // this.timeoutTimerId = setTimeout(function(){
                
            //     Debug.Error('Timeout!!!!');
            //     self.wsocket.close();

            // }, this.timeoutTime);
        }
    }


    FSputnik.prototype.onRequest = function(json, pcallback, pparam) {

        var reqfunc = {
            sendtype:json.opCode,
            func : pcallback,
            param : pparam
        };

        this.func.add(reqfunc);
        this.request.add(JSON.stringify(json));
    }

    function Thread(self) {
        
        if(ws == null) return;
        if(ws.wsocket.readyState != WS_OPEN) return;

        ws.RequestQueue();
        ws.ResponseQueue();

        //<----------------------------------------------------------
        if(self.heartbeat) {
            self.hbCount--;

            if(self.hbCount == 0) {
                self.heartBeat();
                self.hbCount = self.heartbeatTime/self.threadTime;
            }
        }
    }

    FSputnik.prototype.isError = function(res, alert) {
        if(res['result'] == 0) return false;

        Debug.Error(resultcode[res['result']]);
        // Debug.Log(resultcode[res['result']]);

        if(res['result'] == 95) {

            return false;

        } else if(resultcode[res['result']]) {
            FPopup.messageBox('네트워크 에러', resultcode[res['result']], BTN_TYPE.OK, function(self, param){
                
            }, this);
        }


        return true;
    }

    FSputnik.prototype.startHeartBeat = function() {
        this.heartbeat = true;
    }

    
    FSputnik.prototype.heartBeat = function() {
        var json = protocol.heartBeat();
        ws.onRequest(json, this.resHeartBeat, this);
    }

    FSputnik.prototype.resHeartBeat = function(res, self) {

    }

    FSputnik.prototype.asyncResponse = function(data) {
        var sendtype = data.opCode;
        if(sendtype == opcode['NotifyConnect']) {
            protocol.res_notifyConnect(data);
            return true;
        } else if(sendtype == opcode['NotifyDisconnect']) {
            protocol.res_notifyDisconnect(data);
            return true;
        } else if(sendtype == opcode['NotifySmileMark']) {
            protocol.res_notifySmileMark(data);
            return true;
        } else if(sendtype == opcode['NotifyPollMatching']) {
            protocol.res_notifyPollMatching( data );
            return true;
        } else if(sendtype == opcode['NotifyPollSuggest']){
            protocol.res_notifyPollSuggest( data );
            return true;
        } else if(sendtype == opcode['NotifyTodoQuest']){
            protocol.res_notifyPollSuggest( data );
            return true;
        } else if(sendtype == opcode['NotifyReqChannelInteraction']){
            protocol.res_notifyReqChannelInteraction(data);
            return true;
        } else if(sendtype == opcode['NotifyAcceptChannelInteraction']){
            protocol.notifyAcceptChannelInteraction(data);
            return true;
        } else if(sendtype == opcode['NotifyActChannelInteraction']) {
            protocol.notifyActChannelInteraction(data);
            return true;
        } else if(sendtype == opcode['NotifyBtmTransaction']) {
            protocol.notifyBtmTransaction(data);
            return true;
        }

        return false;
    }

    return FSputnik;
    
}());




/*
var option = {
	protocal: "호출프로토콜명",
	param: {
		보낼려는 파라메터
	},
	contents: "컨텐츠명"
};

$.ajax({
	type: "POST",
	url: protocalUrl + "/funfactory-1.0/" + option["protocal"],
	dataType: "json",
	data: {param:JSON.stringify(option["param"])},
	error: function(error){
		alert("에러!!\n콘솔창 내 ajax에러메세지▼를 확인하세요!!");
		console.log("ajax에러메세지▼")
		console.log(error);
	},
	success: function(callback){
		//콜백성공시액션
		console.log("-- renderContents 시작 -----------------------------");
		console.log("콜백데이터▼");
		console.log(callback);
		console.log("옵션▼");
		console.log(tOption);
		console.log("-- renderContents 종료 -----------------------------");
		console.log("");

		if(callback["result"] == 0){
			//정상처리
			
			
		} else{
			//에러
			alert(callback["message"]);
			return false;
		}
	},
	beforeSend: function(){
//		console.log("ajax통신시작-----------------------------------------")
//		console.log("컨텐츠명: " + tOption["contents"])
//		console.log(tOption["protocal"] + " 전달변수▼")
//		console.log(JSON.stringify(tOption["param"]))
//		console.log("ajax통신완료-----------------------------------------")
//		console.log("");
	},
	complete: function(){
//		console.log("ajax통신완료-----------------------------------------")
	}
});

*/


'use strict';

var FApollo13 = (function() {
    function FApollo13() {
     
        this.channelName = null;
        this.callback = null;
        this.param = null;
        // this.launchApollo13();

        this.wsocket = null;
        this.wsocket2 = null;
    }

    FApollo13.prototype.stopApollo13 = function() {
        this.callback = null;
        this.param = null;

        if(this.wsocket) this.wsocket.close();
    }

    //channel chat
    FApollo13.prototype.lanunchApollo13 = function (channelName, param, callback)
    {
        var self = this;

        this.channelName = channelName;

        this.wsocket = new WebSocket(REDIS_SERVER);

        this.wsocket.onopen = function(evt) {
            self.wsocket.send(JSON.stringify(["SUBSCRIBE", self.channelName]));
            console.log("chat socket open");
        }

        this.wsocket.onmessage = function(evt) {
            
            console.log('*****channel****onmessage => ' + evt.data);

            var subscribe = JSON.parse(evt.data);

            if(!subscribe) return;
            var json = JSON.parse(subscribe.SUBSCRIBE[2]);
    
            if(!json) return;
            if(json.opcode == null) return;

            if(opcode['ChatChannel'] == json.opcode 
                || opcode['ChatWorld'] == json.opcode 
                || opcode['Whisper'] == json.opcode ) {
            
                if(G.chatManager && G.chatManager.onRecvMessage) G.chatManager.onRecvMessage(json, false);
                if(callback) callback(param, json);
            } else {
                if(callback) callback(param, json);
            }
        }

        this.wsocket.onclose = function(evt) {
            console.log("socket close");
        }

        this.wsocket.onerror = function(evt) {
            console.error(evt);
        }
    }


    //world chat
    FApollo13.prototype.startWorldChat = function ()
    {
        var self = this;

        this.wsocket2 = new WebSocket(REDIS_SERVER);

        this.wsocket2.onopen = function(evt) {
            self.wsocket2.send(JSON.stringify(["SUBSCRIBE", "funfactory"]));
        }

        this.wsocket2.onmessage = function(evt) {
            
            console.log('*******world****onmessage => ' + evt.data);

            var subscribe = JSON.parse(evt.data);

            if(!subscribe) return;
            var json = JSON.parse(subscribe.SUBSCRIBE[2]);
    
            if(!json) return;
            if(json.opcode == null) return;

            if(opcode['ChatChannel'] == json.opcode 
                || opcode['ChatWorld'] == json.opcode 
                || opcode['Whisper'] == json.opcode ) {
            
                if(G.chatManager && G.chatManager.onRecvMessage) G.chatManager.onRecvMessage(json, true);
            } else {
                alert('world Chat Redis Error');
            }
        }

        this.wsocket2.onclose = function(evt) {
            // console.log("socket close");
        }

        this.wsocket2.onerror = function(evt) {
            // console.error(evt);
        }
    }

    FApollo13.prototype.stopWorldChat = function() {
        this.callback = null;
        this.param = null;

        if(this.wsocket2) this.wsocket2.close();
    }


    return FApollo13;

}());


//<-----------------------------------------------------------------------------------------------------------------
// function httpSend (option, parent, callback) {

//     $.ajax({
//         type: "POST",
//         url: protocalUrl + "/funfactory-1.0/" + option.protocol,
//         dataType: "json",
//         data: {param:JSON.stringify(option.param)},
//         error: function(error){
//             console.log(error);
//         },
//         success: function(res){
            
//             Debug.Log(res)
//             if(res.result != 0) alert('ajax error');
//             if(callback) callback(parent, res);
            
//         },
//         beforeSend: function(){
//     //			console.log("ajax통신시작-----------------------------------------")
//     //			console.log("컨텐츠명: " + tOption["contents"])
//     //			console.log(tOption["protocal"] + " 전달변수▼")
//     //			console.log(JSON.stringify(tOption["param"]))
//     //			console.log("ajax통신완료-----------------------------------------")
//     //			console.log("");
//         },
//         complete: function(){
//     //			console.log("ajax통신완료-----------------------------------------")
//         }
//     });

// }


// var FSputnikShock = (function () {
 
//     var STATE_WAIT_SEND = 88;
//     var STATE_WAIT_RES  = 99;

//     function FSputnikShock(name) {

//         var self = this;

//         this.name = name;
//         this.procTimerId = null;
//         this.threadTime = 100;

//         this.timeoutTime = 15000;
//         this.timeoutTimerId = null;

//         this.request = new buckets.Queue();
//         this.respose = new buckets.Queue();
//         this.func    = new buckets.LinkedList();

//         this.state = STATE_WAIT_SEND;

//         console.log("socket open");
//         self.procTimerId = setInterval(function(){
//             ICBM(self)
//         }, self.threadTime);


//     }

//     FSputnikShock.prototype.dispose = function() {
//         clearInterval(this.procTimerId);
//     }

//     FSputnikShock.prototype.getOpcodeName = function(opCode) {
//         for(var key in opcode) {
//             if(opcode[key] == opCode) {
//                 return key;
//             }
//         }
//     }


//     FSputnikShock.prototype.RequestQueue = function() {
        
//         var self = this;

//         if(this.state != STATE_WAIT_SEND) return;
//         if( 0 == this.request.size()) return;
        
//         var req = this.request.dequeue();


//         $.ajax({
//             type: "POST",
//             url: SERVER_DOMAIN + "/funfactory-1.0/" + req.option.protocol,
//             dataType: "json",
//             data: {
//                 param : JSON.stringify(req.option.param)
//             },
//             error: function(e){
//                 console.log("error");
//             },
//             success: function(res){
                
//                 // Debug.Log(res)
//                 // if(res.result != 0) alert('ajax error');
//                 clearTimeout(this.timeoutTimerId);
//                 if(req.callback) req.callback(res, req.param, req.option);
//                 // self.respose.add(data);
//                 // console.log(req);
//             },
//             beforeSend: function(){
//         			console.log(req.option.protocol+":"+ JSON.stringify(req.option.param));
//             },
//             complete: function(){

//             }
//         });


//         this.state = STATE_WAIT_RES;

//         // Debug.Log("[http send - " + req);

//         this.timeoutTimerId = setTimeout(function(){
            
//             alert('Timeout!!!!');

//         }, this.timeoutTime);
//     }


//     FSputnikShock.prototype.onRequest = function(option, param, callback) {

//         var reqfunc = {
//             option   : option,
//             callback : callback,
//             param    : param
//         };

//         // this.func.add(reqfunc);
//         this.request.add(reqfunc);
//     }

//     function ICBM(self) {
        
//         if(http == null) return;
//         http.RequestQueue();
//     }

//     FSputnikShock.prototype.isError = function(res, alert) {
//         if(res['result'] == 0) return false;

//         Debug.Error(resultcode[res['result']]);
//         // Debug.Log(resultcode[res['result']]);

//         if(res['result'] == 95) {

//             return false;

//         } else if(resultcode[res['result']]) {
//             FPopup.messageBox('네트워크 에러', resultcode[res['result']], BTN_TYPE.OK, function(self, param){
                
//             }, this);
//         }

//         return true;
//     }


//     return FSputnikShock;
    
// }());



var ws = new FSputnik("main_io");
var ws_channel = new FApollo13();
// var http = new FSputnikShock("HTTP_MODULE");
