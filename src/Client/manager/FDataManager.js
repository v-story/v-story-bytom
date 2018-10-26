
'use strict';

var OBJ_MALE        = 500000
var OBJ_FEMALE      = 510000;
var OBJ_ANDROID     = 520000;
var OBJ_CAR         = 530000;
var OBJ_CAT         = 540000;
var OBJ_DOG         = 540001;
var OBJ_MAX_HUNMAN  = 600000;


var DEF_IDENTITY_ME = 0;
var DEF_IDENTITY_FRIEND = 1;
var DEF_IDENTITY_NONE = 99;

// var MAX_CATEGORY = 23;

var FDataChannel = (function() {
    
    function FDataChannel() {

        this.channelName = null;
        this.channelIndex = null;

        this.users = []; //pk, avatar, gender, profile, avatarObj
        this.myAvatar = null;

        this.advertise = [];

        this.interactionInfo = null;
        this.reqestInteraction = null;
        this.acceptInteraction = null;
    }

    FDataChannel.prototype.destroy = function() {

        this.removeAllUser();
        
    }

    FDataChannel.prototype.setInteractionInfo = function(info) {

        /*
        var info = {
            'accountPk' : res.accountPk,
            'exp' : res.interactiveExp,
            'level' : res.interactiveLevel
        };

        var user = {
			'pk' : res.data[i][0],
			'id' : res.data[i][1],
			'avatar' : res.data[i][2],
			'gender' : res.data[i][3],
			'profile' : res.data[i][4],
			'tileIdx' : res.data[i][5],
			'serverIndex' : res.data[i][6],
			'avatarObj' : null
		}

        */

        var user = this.getUserInfo(info.accountPk);

        var newInfo = {
            'info' : info,
            'user' : user
        }

        this.interactionInfo = newInfo;
    }

    FDataChannel.prototype.setRequestInteraction = function(req) {
        this.reqestInteraction = req;

        //피해자 입장에서는 this.interactionInfo값이 없다
        //여기서 만들어 주자..
        var info = {
            'accountPk' : req.fromAccountPk,
            'exp' : req.fromInteractiveExp,
            'level' : req.fromInteractiveLevel
        };

        var user = this.getUserInfo(req.fromAccountPk);

        var newInfo = {
            'info' : info,
            'user' : user
        }

        this.interactionInfo = newInfo;

    }

    FDataChannel.prototype.getRequestInteraction = function() {
        return this.reqestInteraction;
    }

    FDataChannel.prototype.setAcceptInteraction = function(info) {
        this.acceptInteraction = info;
    }

    FDataChannel.prototype.getAcceptInteraction = function() {
        return this.acceptInteraction;
    }


    FDataChannel.prototype.getInteractionInfo = function() {
        return this.interactionInfo;
    }

    FDataChannel.prototype.getMyAvatar = function() {
        return this.myAvatar;
    }

    FDataChannel.prototype.getID = function(pk) {
        for(var i=0; i<this.users.length; i++) {
            if(this.users[i].pk == pk) {

                return this.users[i].id;
            }
        }

        console.log('not found ID');

        return 'UNKNOWN';
    }

    FDataChannel.prototype.getPk = function(id) {
        for(var i=0; i<this.users.length; i++) {
            if(this.users[i].id == id) {

                return this.users[i].pk;
            }
        }

        console.log('not found PK');

        return 'UNKNOWN';
    }

    FDataChannel.prototype.getUserAvatar = function(pk) {
        for(var i=0; i<this.users.length; i++) {
            if(this.users[i].pk == pk) {

                return this.users[i].avatarObj;
            }
        }
    }

    FDataChannel.prototype.getUserInfo = function(pk) {
        for(var i=0; i<this.users.length; i++) {
            if(this.users[i].pk == pk) {

                return this.users[i];
            }
        }
    }

    FDataChannel.prototype.setChannelName = function(name) {
        this.channelName = name;
    }

    FDataChannel.prototype.setChannelIndex = function(index) {
        this.channelIndex = index;
    }

    FDataChannel.prototype.removeAllUser = function(pk) {

        for(var i=0; i<this.users.length; i++) {

            if(this.users[i].avatarObj) {
                this.users[i].avatarObj.destroy();
                this.users[i].avatarObj = null;
            }
        
        }

        CommFunc.arrayRemoveAll(this.users);
    }


    FDataChannel.prototype.removeUser = function(pk) {

        for(var i=0; i<this.users.length; i++) {
            if(this.users[i].pk == pk) {

                if(this.users[i].avatarObj) {
                    this.users[i].avatarObj.destroy();
                    this.users[i].avatarObj = null;
                }
                
                    
                CommFunc.arrayRemove(this.users, this.users[i]);
                return;
            }
        }

    }

    FDataChannel.prototype.setAvatarObj = function(user, obj) {
        
        if(user.pk == ACCOUNTPK) {

            this.myAvatar = obj;

        } 

        for(var i=0; i<this.users.length; i++) {
            if(this.users[i].pk == user.pk 
                && this.users[i].avatar == user.avatar) {

                if(this.users[i].avatarObj != null) {
                    Debug.Error('avatar is not null!! => ' + user.pk);
                }

                this.users[i].avatarObj = obj;
            }
        }
    }

    FDataChannel.prototype.addUser = function(user) {
        //pk, id, avatar, gender, profile

        for(var i=0; i<this.users.length; i++) {
            if(this.users[i].pk == user.pk 
                && this.users[i].avatar == user.avatar) return;
        }

        this.users.push(user);
    }

    FDataChannel.prototype.getProfileUrl = function(pk) {
        for(var i=0; i<this.users.length; i++) {
            if(this.users[i].pk == pk) {

                return this.users[i].profile;
            }
        }

        return null;
    }

    FDataChannel.prototype.getUsers = function() {
        return this.users;
    }

    FDataChannel.prototype.getUsersCount = function() {
        return this.users.length;
    }


    FDataChannel.prototype.getAdInfo = function(hashTag) {

        return this.advertise[hashTag];
    }
    
    FDataChannel.prototype.getHttpAdInfo = function(hashTag, This, callback) {

        var option = { 'param' : {'tag_nm' : hashTag},
                       'url' : '/funfactory-1.0/getTagSeq'
        }

        var buff = this.advertise[hashTag];

        if(!buff) {

            var tag = {
                'adBest'     : [],
                'adRecent'   : [],
                'adSpotFile' : []
            };

            this.advertise[hashTag] = tag;
        }

        var self = this;
        postCall(option)
        // 작업완료
        .then(function(rs){

            var res = rs.callback;

            if(res.result == 1) {
                return;
            }

            var option = {'param' : {'accountpk': ACCOUNTPK, 'page': 1, 'rows': 6, 'tag_seq': res.TAG_SEQ},
            'url' : '/funfactory-1.0/listTagPopularPost'
            };
            postCall(option)
            // 작업완료
            .then(function(rs){

                var res = rs.callback;

                if(res.result == 1) {
                    
                    return;
                }
                CommFunc.arrayRemoveAll(self.advertise[hashTag].adBest);
                setInfo(self.advertise[hashTag].adBest, res, false);
            })
            // 에러
            .catch(function(err){
                alert(err);
                
            })



            option = {'param' : {'accountpk': ACCOUNTPK, 'page': 1, 'rows': 6, 'tag_seq': res.TAG_SEQ},
                    'url' : '/funfactory-1.0/listTagResentPost'
            };
            postCall(option)
            // 작업완료
            .then(function(rs){

                var res = rs.callback;

                if(res.result == 1) {
                        
                    return;
                }

                CommFunc.arrayRemoveAll(self.advertise[hashTag].adRecent);
                CommFunc.arrayRemoveAll(self.advertise[hashTag].adSpotFile);
                setInfo(self.advertise[hashTag].adRecent, res, false);
                setInfo(self.advertise[hashTag].adSpotFile, res, true);

                if(callback) callback(This, self.advertise[hashTag].adSpotFile);
            })
            // 에러
            .catch(function(err){
                alert(err);
                
            })
        })
        // 에러
        .catch(function(err){
            alert(err);
            
        })
        
        function setInfo (array, res, isThumb) {

            for(var i=0; i<res.rows.length; i++) {
                var row = res.rows[i];
                var type = row.FILE_TYPE;
    
                //1:이미지,2:동영상,3:유튜브링크
                if(type == 1) {
    
                    if(!isThumb) {
                        var obj = {
                            'type': type,
                            'url' : res.img_dir_nm + row.FILE_NM,
                            'pk'  : row.ACCOUNTPK,
                            'seq' : row.POST_SEQ
                        };
        
                        array.push(obj); 
                    } else {
                        array.push(res.img_dir_nm + row.FILE_NM)
                    }

    
                } else if(type == 2) {
    
                    if(!isThumb) {
                        var obj = {
                            'type': type,
                            'url' : res.vdo_dir_nm + row.FILE_NM,
                            'pk'  : row.ACCOUNTPK,
                            'seq' : row.POST_SEQ
                        };
        
                        array.push(obj);
                    } else {

                        var url = res.vdo_dir_nm + row.FILE_NM;

                        url = CommFunc.getThumbUrl(url);
                        array.push(url);
                    }

                } else if(type == 3) {
    
                } else {
                    Alert('File Type Error!!!!');
                }
            }
        }
    }

    return FDataChannel;
}());


var FDataManager = (function () {
    function FDataManager() {
        var self = this;

        // self.mapMgr = null;
        self.usrMgr    = new FUserDataManager();
        self.friendMgr = new FUserDataManager();

        self.loadDataLen = -1;
        //Dictionary화 해서 키, 밸류로 바로 찾는다.
        self.B_OBJ                = null;
        self.B_SOCIAL_QUEST       = new buckets.Dictionary();
        self.B_SOCIAL_QUEST_TEXT  = new buckets.Dictionary();

        //기획데이타에 사용되는 스트링들을 모아 놓은 테이블
        self.B_STRING             = null;

        
        self.B_ITEM               = new buckets.Dictionary();
        self.B_OBJ_ACTN           = null;
        self.B_ROOM               = null;
        self.B_OBJ_CATE           = null;
        //관심분야테이블
        self.B_INTEREST           = null;


        // == 로드한 설문데이터들
        self.B_SURVEY             = [];

        self.B_OBJ_ACTN_KIND      = null;
        self.SKELECTON_ANI        = new Array(5);
        for(var i=0; i<5; i++) {
            self.SKELECTON_ANI[i] = [];
        }
        
        self.B_ACT_GRADE          = new Array(2);
        for(var i=0; i<2; i++) {
            self.B_ACT_GRADE[i] = [];
        }

        self.categoryStore   = null;

        self.preCameraPosition = null;
        self.preAlpha = 0;
        self.preBeta = 0;
        self.preRadius = 0;
        self.preTarget = null;

        self.dataChannel = new FDataChannel();

        self.loadData();
        // self.loadTileData();
    }


    // FDataManager.prototype.createMapManager = function(roomID) {

    //     FMapManager.getInstance().createMapData(roomID);

    // }

    // FDataManager.prototype.destroyMapManager = function() {
    //     this.mapMgr.destroy();
    //     this.mapMgr = null;
    // }

    FDataManager.prototype.setCameraInformation = function(pos, a, b, r, target) {
        this.preCameraPosition = pos;
        this.preAlpha = a;
        this.preBeta = b;
        this.preRadius = r;
        this.preTarget = target;
    }
 
    FDataManager.prototype.getPreCameraInfo = function() {
        if(!this.preCameraPosition && !this.preAlpha && !this.preBeta && !this.preRadius && !this.preTarget)
            return null;

        return { "pos" : this.preCameraPosition,
                 "a" : this.preAlpha,
                 "b" : this.preBeta,
                 "r" : this.preRadius,
                 "target": this.preTarget};
    }


    //objID로 해당 오브젝트의 정보를 기획데이터에서 찾아서 보내준다.
    FDataManager.prototype.getOBJInfo = function(objID){
        var obj = this.B_OBJ[objID];

        if(obj == null) {
            Debug.Alert("FDataManager.js : getOBJInfo Error..not find objID - " + objID.toString());
        }

        return obj;
    }

    FDataManager.prototype.getString = function(objID) {
        var obj = this.B_STRING[objID];

        if(obj != null) {
            return obj.STRING_KR;
        } else {
            return "텍스트 못찾음";
        }
    }

    FDataManager.prototype.getActnKind = function(actnID) {
        return this.B_OBJ_ACTN[actnID];
    }

    // FDataManager.prototype.getText = function(index) {
    //     return this.B_TEXT[index];
    //  }

    FDataManager.prototype.getMapMgr = function () {

        return this.mapMgr;

    };

    FDataManager.prototype.getUsrMgr = function (friend) {
        
        if(!friend) return this.usrMgr;
        
        return this.friendMgr;
    };

    FDataManager.prototype.getFriendPk = function() {
        return G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).getAccountPk();
    }
    
    FDataManager.prototype.setFriendInfo = function(pk, avatar, url) {

        G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).setAccountPk(pk);
        G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).setUserAvatar(avatar, null);
        G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).setUrl(url);
    }


    FDataManager.prototype.loadData = function() {
        
        var self = this;
        JSZipUtils.getBinaryContent('Assets/98_data/B_DATA.zip', function(err, data) {
            if(err) {
                throw err; // or handle err
            }
            
            JSZip.loadAsync(data).then(function (dat) {

                self.loadDataLen = Object.keys(dat.files).length;
            
                //Object.keys(dat.files)[i] is file name..'B_OBJ.json', 'B_OBJ.json'

                dat.file('B_ACT_GRADE.json').async("string").then(function (json) {
                    
                    var obj = JSON.parse(json);
                    self.loadDataLen--;

                    //배열을 dictionary화 한다.
                    for(var i=0; i<obj.length; i++) {

                        self.B_ACT_GRADE[obj[i].gender - 1][obj[i].act_grade] = obj[i];
                    }
                });

                dat.file('B_INTEREST.json').async("string").then(function (json) {
                    
                    var obj = JSON.parse(json);
                    self.loadDataLen--;

                    //배열을 dictionary화 한다.
                    self.B_INTEREST = {};
                    for(var i=0; i<obj.length; i++) {
                        self.B_INTEREST[obj[i].INTEREST_ID] = obj[i];
                    }
                });   

                dat.file('B_ITEM.json').async("string").then(function (json) {
                    
                    var obj = JSON.parse(json);
                    self.loadDataLen--;

                    //배열을 dictionary화 한다.
                    for(var i=0; i<obj.length; i++) {
                        self.B_ITEM.set(obj[i].ITEM_ID, obj[i]);
                    }
                });   

                dat.file('B_OBJ.json').async("string").then(function (json) {
                    
                    var obj = JSON.parse(json);
                    self.loadDataLen--;

                    //배열을 dictionary화 한다.
                    self.B_OBJ = {};
                    self.categoryStore = {};
                    for(var i=0; i<obj.length; i++) {
                        self.B_OBJ[obj[i].OBJ_ID] = obj[i];

                        //샵에 카타고리별로 그려야 해서 OBJ_ID별로 카타고리를 나눈다.
                        if(self.categoryStore[obj[i].OBJ_CATE] == null) {
                            self.categoryStore[obj[i].OBJ_CATE] = new Array();
                        }

                        self.categoryStore[obj[i].OBJ_CATE].push(obj[i].OBJ_ID);
                    }

                });

                dat.file('B_OBJ_ACTN.json').async("string").then(function (json) {
                    
                    var obj = JSON.parse(json);
                    self.loadDataLen--;

                    //배열을 dictionary화 한다.
                    self.B_OBJ_ACTN = {};
                    for(var i=0; i<obj.length; i++) {
                        self.B_OBJ_ACTN[obj[i].OBJ_ACTN_ID] = obj[i];
                    }
                });

                dat.file('B_OBJ_ACTN_KIND.json').async("string").then(function (json) {
                    
                    var obj = JSON.parse(json);
                    self.loadDataLen--;

                    //배열을 dictionary화 한다.
                    self.B_OBJ_ACTN_KIND = {};
                    for(var i=0; i<obj.length; i++) {
                        self.B_OBJ_ACTN_KIND[obj[i].OBJ_ACTN_KIND_ID] = obj[i];

                        var length = 0;
                        if(1 == obj[i].OBJ_ACTN_KIND_TYPE) {
                            length = self.SKELECTON_ANI[0].length;
                            self.SKELECTON_ANI[0][length] = (obj[i]);
                        } else if(2 == obj[i].OBJ_ACTN_KIND_TYPE) {
                            length = self.SKELECTON_ANI[1].length;
                            self.SKELECTON_ANI[1][length] = (obj[i]);
                        } else if(3 == obj[i].OBJ_ACTN_KIND_TYPE) { 
                            length = self.SKELECTON_ANI[2].length;
                            self.SKELECTON_ANI[2][length] = (obj[i]);
                        } else if(4 == obj[i].OBJ_ACTN_KIND_TYPE) {
                            length = self.SKELECTON_ANI[3].length;
                            self.SKELECTON_ANI[3][length] = (obj[i]);
                        } else if(5 == obj[i].OBJ_ACTN_KIND_TYPE) {
                            length = self.SKELECTON_ANI[4].length;
                            self.SKELECTON_ANI[4][length] = (obj[i]);
                        } else {
                            Debug.Alert('fault atcion data');
                        }
                    }
                });

                dat.file('B_OBJ_CATE.json').async("string").then(function (json) {
                    
                    var obj = JSON.parse(json);
                    self.loadDataLen--;

                    //배열을 dictionary화 한다.
                    self.B_OBJ_CATE = {};
                    for(var i=0; i<obj.length; i++) {
                        self.B_OBJ_CATE[obj[i].OBJ_CATE_ID] = obj[i];
                    }
                });

                dat.file('B_ROOM.json').async("string").then(function (json) {
                    
                    var obj = JSON.parse(json);
                    self.loadDataLen--;

                    self.B_ROOM = {};
                    //배열을 dictionary화 한다.
                    for(var i=0; i<obj.length; i++) {
                        self.B_ROOM[obj[i].ROOM_ID] = obj[i];
                    }
                });

                dat.file('B_SOCIAL_QUEST.json').async("string").then(function (json) {
                    
                    var obj = JSON.parse(json);
                    self.loadDataLen--;

                    //배열을 dictionary화 한다.
                    for(var i=0; i<obj.length; i++) {
                        self.B_SOCIAL_QUEST.set(obj[i].SEQ, obj[i]);
                    }
                });

                dat.file('B_SOCIAL_QUEST_TEXT.json').async("string").then(function (json) {
                    
                    var obj = JSON.parse(json);
                    self.loadDataLen--;

                    //배열을 dictionary화 한다.
                    for(var i=0; i<obj.length; i++) {
                        self.B_SOCIAL_QUEST_TEXT.set(obj[i].SEQ, obj[i]);
                    }
                });

             
                dat.file('B_STRING.json').async("string").then(function (json) {
                    
                    var obj = JSON.parse(json);
                    self.loadDataLen--;

                    self.B_STRING = {};
                    for(var i=0; i<obj.length; i++) {
                        self.B_STRING[obj[i].STRING_ID] = obj[i];
                    }
                });

                if(self.loadDataLen == 0) {
                    
                }
            });
        });

    }

    FDataManager.prototype.getFrameAnimation = function(objID, actionID) {
        
        var idx = -1;
        if(objID == OBJ_MALE) idx = 0;
        else if(objID == OBJ_FEMALE) idx = 1;
        else if(objID == OBJ_ANDROID) idx = 4;
        else if(objID == OBJ_CAT) idx = 2;
        else if(objID == OBJ_DOG) idx = 3;
        

        var ske = this.SKELECTON_ANI[idx];
        for(var i=0; i<ske.length; i++) {
            if(ske[i].OBJ_ACTN_KIND_ID == actionID) return ske[i];
        }

        return null;
    }

    FDataManager.prototype.getInteractionMaxExp = function(myGender, yourGender, grade) {

        var gender = 0;

        if(myGender != yourGender) gender = 1;

        return this.B_ACT_GRADE[gender][grade].grade_exp;
    }

    FDataManager.prototype.getInteractionActName = function(actId) {
        var nm = this.B_OBJ_ACTN_KIND[actId].OBJ_ACTN_KIND_NM;

        return this.getString(nm);
    }

    FDataManager.prototype.getInteractionGradeName = function(myGender, yourGender, grade) {

        var gender = 0;

        if(myGender != yourGender) gender = 1;

        return this.B_ACT_GRADE[gender][grade].grade_name;
    }

    FDataManager.prototype.getInteractionActList = function(myGender, yourGender, grade) {

        var gender = 0;
        var list = [];
        var act;
        if(myGender != yourGender) gender = 1;

        act = Number(this.B_ACT_GRADE[gender][grade].act_id1);
        if(act) list.push(act);

        act = Number(this.B_ACT_GRADE[gender][grade].act_id2);
        if(act) list.push(act);

        act = Number(this.B_ACT_GRADE[gender][grade].act_id3);
        if(act) list.push(act);

        act = Number(this.B_ACT_GRADE[gender][grade].act_id4);
        if(act) list.push(act);

        act = Number(this.B_ACT_GRADE[gender][grade].act_id5);
        if(act) list.push(act);

        act = Number(this.B_ACT_GRADE[gender][grade].act_id6);
        if(act) list.push(act);

        act = Number(this.B_ACT_GRADE[gender][grade].act_id7);
        if(act) list.push(act);

        act = Number(this.B_ACT_GRADE[gender][grade].act_id8);
        if(act) list.push(act);

        act = Number(this.B_ACT_GRADE[gender][grade].act_id9);
        if(act) list.push(act);

        act = Number(this.B_ACT_GRADE[gender][grade].act_id10);
        if(act) list.push(act);

        act = Number(this.B_ACT_GRADE[gender][grade].act_id11);
        if(act) list.push(act);

        act = Number(this.B_ACT_GRADE[gender][grade].act_id12);
        if(act) list.push(act);

        return list;
    }

    FDataManager.prototype.getInterestData = function( index ) {

        //임시다..
        var id = index + 3000;

        return this.B_INTEREST[id];
    }

    FDataManager.prototype.getInterestDataName = function( index ) {

        //임시다..
        var id = index + 3000;

         var nm = this.B_INTEREST[id].INTEREST_NM;
         return this.getString(nm);
    }

    FDataManager.prototype.getAct = function() {
        return this.B_OBJ_ACTN_KIND;
    }

    

    /**
     * 관심분야 인덱스를 넣으면 텍스트로 변환해준다.
     * @param {Number Or Array[Number,..]} in_interestIndex 
     */
    FDataManager.prototype.getInterestString = function( in_interestIndex )
    {
        return;
        var self = this;
        if ( Array.isArray( in_interestIndex ) )
        {
            if ( in_interestIndex.length <= 0 )
                return;

            if ( !Number.isInteger( in_interestIndex[0] ) )
            {
                console.log(in_interestIndex + " : !!! 이 데이터는 인덱스 배열이 아닙니다. 텍스트 변환을 거치지 않고 원본을 바로 출력합니다.");
                return in_interestIndex.toString();
            }

            console.log(in_interestIndex + " : 인덱스 배열 에서 관심분야 텍스트로 변환합니다. 이곳에서 오류가 난다면 데이터를 확인해 주세요.");

            var str = "";
            in_interestIndex.forEach( function( in_iter ) { str += ( ((""==str)?"":", ")+ self.getInterestDataName( in_iter ))} );

            return str;
        }
        else
        {
            if ( in_interestIndex == null )
                return;

            if ( !Number.isInteger( in_interestIndex ) )
            {
                console.log(in_interestIndex + " : !!! 이 데이터는 인덱스가 아닙니다. 텍스트 변환을 거치지 않고 원본을 바로 출력합니다.");
                return in_interestIndex.toString();
            }

            console.log(in_interestIndex + " : 인덱스를 관심분야 텍스트로 변환합니다. 이곳에서 오류가 난다면 데이터를 확인해 주세요.");

            return self.getInterestDataName( in_interestIndex );
        }
        
    }

    // FDataManager.prototype.getTodoData = function(id) {
    //     var todo = this.B_TODO.get(id);

    //     if(todo == null) {
    //         Debug.Alert("FDataManager.js : getTodoData Error..not find id - " + todo.toString());
    //     }

    //     return todo;
    // }    

    FDataManager.prototype.getSocialQuestData = function( in_seq ) {
        var socialQuest = this.B_SOCIAL_QUEST.get(in_seq);
        
        if(socialQuest == null) 
        {
            Debug.Alert("FDataManager.js : getSocialQuestData Error..not find in_seq - " + in_seq.toString());
        }
    
        return socialQuest;
    }

    FDataManager.prototype.getSocialQuestDataText = function( in_seq ) {
        var sqt = this.B_SOCIAL_QUEST_TEXT.get(in_seq);
        
        if(sqt == null) 
        {
            Debug.Alert("FDataManager.js : getSocialQuestDataText Error..not find in_seq - " + in_seq.toString());
        }
    
        return sqt;
    }

    FDataManager.prototype.isInitDataMgr = function() {
        
        if(this.loadDataLen == 0) return true;

        return false;
    }

    // FDataManager.prototype.getObjImagePath = function( in_objID )
    // {
    //     var obj = this.B_OBJ[in_objID];

    //     if(obj == null) return ASSET_URL+"95_shopIcon/" + "temp" + ".png";

    //     return ASSET_URL+"95_shopIcon/" + in_objID.toString() + ".png";
    // }

    FDataManager.prototype.getObjForCategory = function(objCategory) {
        return this.categoryStore[objCategory];
    }


// 타일 관련부분 시작 //<------------------------------------------------------------------------------------------------------------>//
    // 타일 데이터 로드, 호출부
    // FDataManager.prototype.loadTileData = function()
    // {
    //     var self = this;
    //     JSZipUtils.getBinaryContent('Assets/98_data/B_TILEDATA.zip', function(err, data)
    //     {
    //         if(err)
    //         {
    //             throw err; // or handle err
    //         }
            
    //         JSZip.loadAsync(data).then(function (in_data) 
    //         {                
    //             var fileList = Object.keys(in_data.files);
    //             var loadedCount = 0;
    //             for ( var i = 0; i < fileList.length; ++i )
    //             {
    //                 in_data.file(fileList[i]).async("string").then(function(in_json)
    //                 {
    //                     var tileData = JSON.parse( in_json );
    //                     var tempSimpleTileData = [];

    //                     for ( var i = 0; i < tileData.tile.length; ++i )
    //                     {
    //                         var originTileData = new TILE_CELL();

    //                         originTileData.index = tileData.tile[i][0];
    //                         originTileData.size.x = tileData.tile[i][1];
    //                         originTileData.size.y = tileData.tile[i][2];
    //                         originTileData.height = tileData.tile[i][3];
    //                         originTileData.position.x = tileData.tile[i][4];
    //                         originTileData.position.z = tileData.tile[i][5];
    //                         originTileData.type = tileData.tile[i][6];
    //                         originTileData.data = tileData.tile[i][7];

    //                         tileData.tile[i] = originTileData;
    //                     }

    //                     self.B_TILEDATA.push( tileData );
    //                 });
    //             }
    //         });
    //     });
    // }

    // FDataManager.prototype.getTileData = function( in_tileDataName )
    // {
    //     for ( var i = 0; i < this.B_TILEDATA.length; ++i )
    //     {
    //         var tileData = this.B_TILEDATA[i];

    //         if ( tileData.name == in_tileDataName )
    //             return tileData;
    //     }

    //     return undefined;
    // }
    
// 타일 관련부분 끝 //<------------------------------------------------------------------------------------------------------------>//


// 설문 관련부분 시작 //<------------------------------------------------------------------------------------------------------------>//

    FDataManager.prototype.loadSurveyTable = function( in_fileName, in_onLoadEndFunc )
    {
        for ( var i = 0; i < this.B_SURVEY.length; ++i )
        {
            if ( this.B_SURVEY[i].name == in_fileName )
            {
                in_onLoadEndFunc( this.B_SURVEY[i].data );
                return;
            }
        }

        var self = this;
        JSZipUtils.getBinaryContent('Assets/98_data/B_SURVEY/' + in_fileName + '.zip', function(err, data)
        {
            if(err)
            {
                throw err; // or handle err
            }
            
            JSZip.loadAsync(data).then(function (in_data) 
            {                
                var fileList = Object.keys(in_data.files);
                var loadedCount = 0;
                in_data.file(fileList[0]).async("string").then(function(in_json)
                {
                    var surveyTableData = JSON.parse( in_json );
                    self.B_SURVEY.push( {name:in_fileName, data:surveyTableData} );       
                    
                    in_onLoadEndFunc( surveyTableData );
                    return;
                });                
            });
        });
    }


// 설문 관련부분 끝 //<------------------------------------------------------------------------------------------------------------>//


    return FDataManager;
}());

