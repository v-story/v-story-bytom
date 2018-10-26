'use strict';

var sSQINFO = (function () {
    function sSQINFO() {

        this.QUEST_ID           = null; //퀘스트아이디
        this.QUEST_CLEARCNT     = null; //클리어회수 (0~3)
        this.QUEST_STEP         = null; //퀘스트 상태 - 생산에서 마지막 열려있는 퀘스트의 상태다. 0:오픈 2:조건완료
        this.TEAM_ACCOUNTPK     = null; //팀시퀀스
        this.TEAM_AVATARCD      = 0;
        this.TEAM_QUEST_STEP    = null; //팀퀘스트진행단계(0~3)
        this.TEAM_IMG_URL       = null; //팀 이미지URL
        this.TEAM_INTRO         = null; //팀 관심분야
        this.TEAM_AGE           = null;
        this.INTEREST           = null; 
        this.STARCONTTAG        = null; 
    }

    return sSQINFO;
}());


var sSUBINFO = (function () {
    function sSUBINFO() {

        this.QUEST_ID      = null; //퀘스트아이디
        this.QUEST_STEP    = null; //추천친구 상태(0:미오픈, 1:오픈, 2:진행중, 3:완료)
        this.ACCOUNTPK     = null; //추천친구 시퀀스
        this.AVATARCD      = 0;
        this.ACCOUNTID     = null; //추천친구 닉네임    
        this.IMG_URL       = null; //추천친구 프로필
        this.INTRO         = null; //추천친구 관심분야
        this.AGE           = 0; 
        this.INTEREST      = null; 
        this.STARCONTTAG   = null;
        this.CONNECTING    = false; 
    }

    return sSUBINFO;
}());

var sSOCIALQUESTINFO = (function () {
    function sSOCIALQUESTINFO() {

        this.TEAM_IMG_PATH = null; //팀 이미지 URL 주소
        this.OPEN = null;
        this.SUB_IMG_PATH = null;
        this.SQINFO = new Array();
        this.SQSUBINFO = new Array();
    }

    return sSOCIALQUESTINFO;
}());

var sFriend = (function () {
    function sFriend() {

        this.ACCOUNTPK      = null,     //추천친구 시퀀스
        this.AVATACD        = null, 
        this.NICKNAME       = null,     //추천친구ID
        this.IMG_URL        = null,     //추천친구 프로필
        this.INTRO          = null,     //추천친구 소개
        this.PICCNT         = 0,        //사진개수
        this.MOVCNT         = 0,        //동영상개수
        this.PALCNT         = 0,        //팔로워수
        this.SMICNT         = 0,        //스마일 마크개수
        this.SEMIIMG1       = null,     //간이사진1
        this.SEMIIMG2       = null,     //간이사진2
        this.SEMIIMG3       = null      //간이사진3
        this.STARCONTSEQ    = 0;
        this.GENDER         = 0;
        this.AGE            = 0;
        this.INTEREST       = null;
        this.IMG_PATH       = null; //이건느 원래 따로 가야 되는데..원래 구조와 다르게 변경되어서 귀찮아서 여기다 넣는다.
        this.SEMIIMGTYPE1   = null;
        this.SEMIIMGTYPE2   = null;
        this.SEMIIMGTYPE3   = null;
        this.VDO_PATH       = null;
        this.CONNECTING     = false;
    }
    
    return sFriend;
}());


var sStarContentsList = (function () {
    function sStarContentsList() {

        this.IMG_PATH   = null; 
        this.URL        = null;
        this.VDO_PATH   = null;
        this.SC = new Array();
    }

    return sStarContentsList;
}());


var sStarContent = (function () {
    function sStarContent() {

        this.STARCONTSEQ    = null;
        this.STARCONTCD     = null;
        this.REPRSTIMGNM    = null;
        this.FILETYPE       = null;
        this.OBJMAPSEQ      = null;
        this.POSTCNT        = null;

    }

    return sStarContent;
}());


var sMyStarContentsList = (function () {
    function sMyStarContentsList() {

        this.MYSUMSMILECNT      = 0; //선물받은 스마일개수
        this.IMG_PATH           = null; //"이미지Path
        this.URL                = null; // "이미지/동영상 URL정보"
        this.VDO_PATH           = null; //"동영상Path"
        this.VDO_THUMBNAILPATH  = null;
        this.SC = new Array();
    }

    return sMyStarContentsList;
}());


var sMyStarContent = (function () {
    function sMyStarContent() {

        this.STARCONTSEQ    = null; //스타컨텐츠시퀀스
        this.STARCONTCD     = null; //스타컨텐츠코드
        this.REPRSTIMGNM    = null; //대표이미지명
        this.FILETYPE       = null; //(1:이미지,2:동영상,3:유튜브링크)
        this.POSTCNT        = null; //개시물수
        this.FOLLOWERCNT    = 0;    //팔로우수
    }

    return sMyStarContent;
}());


var sScenarioObject = (function() {
    function sScenarioObject() {
        this.seq        = null;        
        this.objSeq     = null;
        this.objID      = null;
        this.sectorIdx  = null; //섹터인덱스
        this.tileIdx    = null; //타일인덱스
        this.roxDir     = null; //회전값
        this.layerIdx   = null; //레이어
    }

    return sScenarioObject;
}())


var sScenario = (function () {
    function sScenario() {
        this.seq        = null; //시나리오인덱스         
        this.limitTime  = null; //건설남은시간
        this.step       = null; //진행단계(0:미진행,1:진행중)

        this.objectList = []; // 이 해야할일에 해당하는 오브젝트 정보들
    }

    return sScenario;
}());


var sScenarioQuest = (function () {
    function sScenarioQuest() {

        this.clearCnt       = 0;
        this.mainIdx        = 0;

        this.scenario       = [];
    }

    return sScenarioQuest;
}());


var sShareObject = (function () {
    function sShareObject() {
        this.seq         = -1;
        this.toAccountPk = -1;
        this.tile        = -1;
        this.url         = null;
        this.limitTime   = 0;

        //상세정보
        this.accountID   = 0;       //아이디
        this.avataCD     = 0;       //아바타코드
        this.imgUrl      = null;    //프로필Url
        this.aCnt        = null;    //콘텐츠개수
        this.bCnt        = null;    //팔로워개수
        this.cCnt        = null;    //팔로잉개수
        this.msg         = null;    //메세지
        this.postSeq     = -1;      //게시물시퀀스
    }
    
    return sShareObject;
}());


var sShareObjectList = (function () {
    function sShareObjectList() {

        this.imgPath          = null;
        this.vdoThumbnailPath = null;
        this.list    = [];
    }

    return sShareObjectList;
}());



var GOODS_TYPE_STAR        = 1001;
var GOODS_TYPE_GOLD        = 1002;
var GOODS_TYPE_RUBY        = 1003;
var GOODS_TYPE_COIN        = 1004;
var GOODS_TYPE_LIKE        = 1005;
var GOODS_TYPE_SMILE       = 1006;
var GOODS_TYPE_EXP         = 1007;
var GOODS_TYPE_ACHEIVE_EXP = 1008;
var GOODS_TYPE_GIFTBOX1    = 1009;
var GOODS_TYPE_GIFTBOX2    = 1010;
var GOODS_TYPE_GIFTBOX3    = 1011;
var GOODS_TYPE_GIFTBOX4    = 1012;

var Gender = 
{
    "None":0,
    "Male":1,
    "FeMale":2
}

var sendSmileCountToSNS = function() {
    return G.dataManager.getUsrMgr(DEF_IDENTITY_ME).goods.SMILE;
}


var FUserDataManager = (function () {
    function FUserDataManager() {
        this.id = null;
        this.birthday = null;
        this.gender = null;
        this.goods = {
            STAR        : 0,
            GOLD        : 0,
            HEART       : 0,
            RUBY        : 0,
            COIN        : 0,
            SMILE       : 0,
            RUBY_FREE   : 0,
            SMILE_FREE  : 0
        };

        //유저정보
        this.level = 0;
        this.exp   = 0;
        this.id    = null;
        this.url   = null; //사진 위치
        this.gender = 0;    //0:값없음,1:남자,2:여자
        this.avatarCd = 0;
        this.progressState = 0; //유저진행정보저장
        this.txtInterest = null;
        this.roomType = 0; //통맵 타입 번호
        this.accountPk = -1;
        this.nickname = null;
        this.visitPurposeForShare = false;

        //인테리어상점->인벤토리->카테고리별 아이템 :  카테고리별 오브젝트들을 담는 저장소
        // this.categoryInvenObject = new Array();

        //저장소
        this.Inventory = new Array();

        //잠김해제 오브젝트리스트
        this.UnlockObject = new Array();

        /*
            this.OBJ_MAP_SEQ = null;
            this.TILE_IDX    = null;
            this.ROT_DIR     = null;
            this.OBJ_ID      = null;
            this.LAYER_IDX   = null;
            this.CATE_ID     = null;
        */
        // this.RoomObjectMap = new Array();

        //소셜퀘스트 리스트
        this.socialQuestList = new sSOCIALQUESTINFO();

        //옥외추천
        //친구들에 대한 정보            
        this.friend = new Array();

        //스타콘텐츠리스트
        this.sStarContentsList = new sStarContentsList();

        //나의스타콘텐츠리스트
        this.sMyStarContentsList = new sMyStarContentsList();

        //시나리오퀘스트
        this.sScenarioQuest = new sScenarioQuest();

        //공유오브젝트
        this.sShareObjectList = new sShareObjectList();
        
    }

    FUserDataManager.prototype.getGenderToAvatarCode = function(avatarCode) {
        var code = avatarCode - 1;

        var h_ge = (code & 0x0000ff0000) >>> 16;
        var g = h_ge >>> 7;
        if(g) return 2;
        
        return 1;
    }

    //<---------------------------------------------------------------------------------------------------------
    FUserDataManager.prototype.clearShareObject = function() {
        this.sShareObjectList.imgPath          = null;
        this.sShareObjectList.vdoThumbnailPath = null;

        CommFunc.arrayRemoveAll(this.sShareObjectList.list);
    }

    FUserDataManager.prototype.setRoomType = function(roomType) {
        this.roomType = roomType;
    }

    FUserDataManager.prototype.getShareObject = function() {
        return this.sShareObjectList;
    }

    FUserDataManager.prototype.setShareObject = function(res) {

        if(this.sShareObjectList.list.length)
            CommFunc.arrayRemoveAll(this.sShareObjectList.list);

        this.sShareObjectList.imgPath = res.imgPath;
        this.sShareObjectList.vdoThumbnailPath = res.vdoThumbnailPath;

        for(var i=0; i<res.data.length; i++) {
            var sSharObject = new sShareObject();
            
            sSharObject.seq         = res.data[i][0];
            sSharObject.toAccountPk = res.data[i][1];
            sSharObject.tile        = res.data[i][2];  //타일 인덱스
            sSharObject.url         = res.data[i][3];  //대표이미지명
            sSharObject.fileType    = res.data[i][4];
            sSharObject.limitTime   = res.data[i][5];  //남은시간(초)

            this.sShareObjectList.list.push(sSharObject);
        }
    }

    FUserDataManager.prototype.updateShareObject = function(imgPath, data) {

        var len = this.sShareObjectList.list.length;

        for(var i=0; i<len; i++) {

            for(var j=0; j<data.length; j++) {
                if(this.sShareObjectList.list[i].seq == data[j][0]) {
                    this.sShareObjectList.list[i].accountID   = data[j][1];       //아이디
                    this.sShareObjectList.list[i].avataCD     = data[j][2];       //아바타코드
                    this.sShareObjectList.list[i].imgUrl      = imgPath + data[j][3];    //프로필Url
                    this.sShareObjectList.list[i].aCnt        = data[j][4];    //콘텐츠개수
                    this.sShareObjectList.list[i].bCnt        = data[j][5];    //팔로워개수
                    this.sShareObjectList.list[i].cCnt        = data[j][6];    //팔로잉개수
                    this.sShareObjectList.list[i].msg         = Base64.decode(data[j][7]);    //메세지
                    this.sShareObjectList.list[i].postSeq     = data[j][8];
                    
                    break;
                }
            }
        }
    }


    //<---------------------------------------------------------------------------------------------------------



    FUserDataManager.prototype.setProgressState = function(state) {
        this.progressState = state;
    }

    //<---------------------------------------------------------------------------------------------------------
    FUserDataManager.prototype.updateScenarioObject = function(in_questSeq, in_scenarioObjectData )
    {
        if ( undefined == in_scenarioObjectData.seq )
            in_scenarioObjectData.seq = in_questSeq;

        for ( var i = 0; i < this.sScenarioQuest.scenario.length; ++i )
        {
            var scenarioData = this.sScenarioQuest.scenario[i];
            if ( scenarioData.seq == in_questSeq )
            {
                var isChanged = false;
                for ( var j = 0; j < scenarioData.objectList.length; ++j )
                {
                    if ( scenarioData.objectList[j].objSeq == in_scenarioObjectData.objSeq )
                    {
                        isChanged = true;
                        scenarioData.objectList[j] = in_scenarioObjectData;
                        break;
                    }
                }

                if ( !isChanged )
                    scenarioData.objectList.push( in_scenarioObjectData );

                return;
            }
        }

        console.error("시나리오 오브젝트의 대상 퀘스트가 없습니다.");
    }

    FUserDataManager.prototype.pushScenarioQuest = function(clearCnt, mainIdx, data, objectData) {
        
        this.clearScenarioQuest();

        this.sScenarioQuest.clearCnt = clearCnt;
        this.sScenarioQuest.mainIdx = mainIdx;

        var len = data.length;

        for(var i=0; i<len; i++) 
        {            
            var scenario = new sScenario();

            scenario.seq        = data[i][0];
            scenario.step       = data[i][1];
            scenario.limitTime  = data[i][2];

            this.sScenarioQuest.scenario.push(scenario);
        }

        if ( undefined == objectData)
            return;

        var objectDataLen = objectData.length;
        for ( var i = 0; i <objectDataLen; ++i )
        {
            var sScenarioObject = new sScenarioObject();
            sScenarioObject.seq        = data[i][0];
            sScenarioObject.objSeq     = data[i][1];
            sScenarioObject.objID      = data[i][2];
            sScenarioObject.sectorIdx  = data[i][3];
            sScenarioObject.tileIdx    = data[i][4];
            sScenarioObject.roxDir     = data[i][5];
            sScenarioObject.layerIdx   = data[i][6];

            this.updateScenarioObject( sScenarioObject.seq, sScenarioObject );
        }
    }

    FUserDataManager.prototype.clearScenarioQuest = function() {
        this.sScenarioQuest.clearCnt       = 0;
        this.sScenarioQuest.mainIdx        = 0;

        this.sScenarioQuest.scenario.objectList = [];
        CommFunc.arrayRemoveAll(this.sScenarioQuest.scenario);
    }

    FUserDataManager.prototype.updateScenarioQuestStep = function(seq, step) {

        var len = this.sScenarioQuest.scenario.length;

        for(var i=0; i<len; i++) {
            if(this.sScenarioQuest.scenario[i].seq == seq){
                this.sScenarioQuest.scenario[i].step = step;
                return;
            }
        }
    }

    FUserDataManager.prototype.updateScenarioQuest = function( in_level, in_exp, in_seq, in_step, in_limitTime, in_dataList, in_clearCount )
    {
        var len = this.sScenarioQuest.scenario.length;
        
        for(var i=0; i<len; i++) 
        {
            if(this.sScenarioQuest.scenario[i].seq == in_seq)
            {
                this.sScenarioQuest.scenario[i].step      = in_step;
                this.sScenarioQuest.scenario[i].limitTime = in_limitTime;

                for ( var j = 0; j < in_dataList.length; ++j )
                    this.updateScenarioObject( in_seq, in_dataList[j] );

                return;
            }
        }

        console.error("시나리오 오브젝트의 대상 퀘스트가 없습니다.");
    }

    FUserDataManager.prototype.getScenarioQuestList = function() {
        return this.sScenarioQuest;
    }

    FUserDataManager.prototype.getScenarioQuest = function(seq) {
        var len = this.sScenarioQuest.scenario.length;
        
        for(var i=0; i<len; i++) {
            if(this.sScenarioQuest.scenario[i].seq == seq){
                return this.sScenarioQuest.scenario[i];
            }
        }
    }

    //<--------------------------------------------------------------------------------------------------------------
    FUserDataManager.prototype.getGoodsName = function( in_itemID )
    {
        var str = "Error"
        switch( in_itemID )
        {
            case GOODS_TYPE_STAR        : str = "별";
            case GOODS_TYPE_GOLD        : str = "골드";
            case GOODS_TYPE_RUBY        : str = "루비";
            case GOODS_TYPE_COIN        : str = "코인";
            case GOODS_TYPE_LIKE        : str = "좋아요";
            case GOODS_TYPE_SMILE       : str = "스마일";
            case GOODS_TYPE_EXP         : str = "경험치";
            case GOODS_TYPE_ACHEIVE_EXP : str = "업적경험치";
            case GOODS_TYPE_GIFTBOX1    : str = "선물상자_1";
            case GOODS_TYPE_GIFTBOX2    : str = "선물상자_2";
            case GOODS_TYPE_GIFTBOX3    : str = "선물상자_3";
            case GOODS_TYPE_GIFTBOX4    : str = "선물상자_4";
        }
    }

    FUserDataManager.prototype.doYouHaveMoney = function(goodsType, needMoney) {

        switch(goodsType) {
            case GOODS_TYPE_STAR:
                if(this.goods.STAR >= needMoney) return true;
                break;
            case GOODS_TYPE_GOLD:
                if(this.goods.GOLD >= needMoney) return true;
                break;
            case GOODS_TYPE_RUBY:
                if(this.goods.RUBY >= needMoney) return true;
                break;
            case GOODS_TYPE_COIN:
                if(this.goods.COIN >= needMoney) return true;
                break;
            case GOODS_TYPE_LIKE:
                if(this.goods.LIKE >= needMoney) return true;
                break;
            case GOODS_TYPE_SMILE:
                if(this.goods.SMILE >= needMoney) return true;
                break;
        }

        return false;
    }

    FUserDataManager.prototype.getSQInfoPath = function(index) {

        if(this.socialQuestList.TEAM_IMG_PATH == null) {

            Debug.Error('getSQInfoPath : TEAM_IMG_PATH 가 없음');
            return;
        }

        if(this.socialQuestList.SQINFO.length <= index) {
            Debug.Error('Empty SQInfo');
            return;
        }

        return this.socialQuestList.TEAM_IMG_PATH + this.socialQuestList.SQINFO[index].TEAM_IMG_URL;
    }


    FUserDataManager.prototype.getSQInfoIntro = function(index) {
        return this.socialQuestList.SQINFO[index].TEAM_INTRO;
    }


    FUserDataManager.prototype.canGetRewardSocialQuest = function( in_questType )
    {        
        return (this.socialQuestList.SQINFO[in_questType].QUEST_STEP == 2/*보상수취가능*/)
    }

    FUserDataManager.prototype.getQuestInfo = function(index) {
        return this.socialQuestList.SQINFO[index];
    }

    FUserDataManager.prototype.getQuestSubInfo = function() {
        return this.socialQuestList.SQSUBINFO;
    }

    FUserDataManager.prototype.pushSocialQuestList = function(path, open, data) {

        this.socialQuestList.TEAM_IMG_PATH = path;

        CommFunc.arrayRemoveAll(this.socialQuestList.SQINFO);
        if(open != null) {
            this.socialQuestList.OPEN = open;
            for(var i=0; i<data.length; i++) {
                var info = new sSQINFO();
                info.QUEST_ID           = data[i][0]; //퀘스트아이디
                
                info.QUEST_CLEARCNT     = data[i][1]; //퀘스트 진행단계(0~6)
    
                info.QUEST_STEP         = data[i][2];
                info.TEAM_ACCOUNTPK     = data[i][3]; //팀시퀀스
                info.TEAM_AVATARCD      = data[i][4];
                info.CONNECTING         = data[i][5];
                info.TEAM_QUEST_STEP    = data[i][6]; //팀퀘스트진행단계(0~3)
                info.TEAM_IMG_URL       = data[i][7]; //팀 이미지URL
                info.TEAM_INTRO         = Base64.decode(data[i][8]); //팀 관심분야
                info.TEAM_AGE           = data[i][9];
                info.INTEREST           = data[i][10];; 
                info.STARCONTTAG        = data[i][11];
    
                this.socialQuestList.SQINFO.push(info);
            }
        }
            
        else {
            this.socialQuestList.OPEN = 0;
            for(var i=0; i<data.length; i++) {
                var info = new sSQINFO();
                info.QUEST_ID           = data[i][0]; //퀘스트아이디
                
                info.QUEST_CLEARCNT     = 0;
    
                info.QUEST_STEP         = data[i][1];
                info.TEAM_ACCOUNTPK     = data[i][2]; //팀시퀀스
                info.TEAM_AVATARCD      = data[i][3];
                info.TEAM_QUEST_STEP    = data[i][4]; //팀퀘스트진행단계(0~3)
                info.TEAM_IMG_URL       = data[i][5]; //팀 이미지URL
                info.TEAM_INTRO         = Base64.decode(data[i][6]); //팀 관심분야
                info.TEAM_AGE           = 0;
                info.INTEREST           = null;
                info.STARCONTTAG        = null;
    
                this.socialQuestList.SQINFO.push(info);
            }
        }
    }



    FUserDataManager.prototype.updateSocialQuestListAll = function(data, in_open) {

        var len = this.socialQuestList.SQINFO.length;

        if ( undefined != in_open )
            this.socialQuestList.OPEN = in_open;

        for(var k=0; k<data.length; ++k) {

            for(var i=0; i<len; i++) {
                if(this.socialQuestList.SQINFO[i].QUEST_ID == data[k][0]) {
                    this.socialQuestList.SQINFO[i].QUEST_CLEARCNT = data[k][1];
                    this.socialQuestList.SQINFO[i].QUEST_STEP     = data[k][2] 
                    this.socialQuestList.SQINFO[i].TEAM_AVATARCD  = data[k][3];
                    this.socialQuestList.SQINFO[i].TEAM_QUEST_STEP= data[k][4];
                }
            }
        }
    }


    FUserDataManager.prototype.pushSubSocialQuestList = function(imgPath, data) {

        if(data.length == 0) {
            return;
        }

        CommFunc.arrayRemoveAll(this.socialQuestList.SQSUBINFO);

        this.socialQuestList.SUB_IMG_PATH = imgPath;

        for(var i=0; i<data.length; i++) {
            var info = new sSUBINFO();

            info.QUEST_ID      = data[i][0]; //퀘스트아이디
            info.QUEST_STEP    = data[i][1]; //추천친구 상태(0:미오픈, 1:오픈, 2:진행중, 3:완료)
            info.ACCOUNTPK     = data[i][2]; //추천친구 시퀀스
            info.ACCOUNTID     = data[i][3]; //추천친구 닉네임
            info.AVATARCD      = data[i][4];    
            info.IMG_URL       = data[i][5]; //추천친구 프로필
            info.INTRO         = Base64.decode(data[i][6]); //추천친구 관심분야            
            info.AGE           = data[i][7]; //추천친구 나이
            info.INTEREST      = data[i][8]; //개인관심분야[]
            info.STARCONTTAG   = data[i][9]; //스타컨텐츠관심분야[1,2,3,4]]

            this.socialQuestList.SQSUBINFO.push(info);
        }
    }

    FUserDataManager.prototype.updateSubSocialQuestList = function(subData) {

        var len = this.socialQuestList.SQSUBINFO.length;

        for ( var k = 0; k < subData.length; ++k )
        {
            for(var i=0; i<len; i++) {
                if((this.socialQuestList.SQSUBINFO[i].QUEST_ID == subData[k][0]) && (this.socialQuestList.SQSUBINFO[i].ACCOUNTPK == subData[k][2]) ) {
                    this.socialQuestList.SQSUBINFO[i].QUEST_STEP = subData[k][1];

                    //서버에서 안보내줘서 갱신하지 않는다.
                    //원래 안보내줬는지..보내주기로 했는데 안 보내주는건지 알수가 없다..
                    // this.socialQuestList.SQSUBINFO[i].AVATARCD = subData[k][3];
                }
            }
        }
    }

    FUserDataManager.prototype.updateSocialQuestList = function(data) {

        if((data[0] == 0) && (data[1] == 0) && (data[2] == 0)) return;

        var len = this.socialQuestList.SQINFO.length;

        for(var i=0; i<len; i++) {
            if((this.socialQuestList.SQINFO[i].QUEST_ID == data[0]) && (this.socialQuestList.SQINFO[i].TEAM_ACCOUNTPK == data[2])) {
                this.socialQuestList.SQINFO[i].QUEST_STEP = data[1];
            }
        }
    }



    FUserDataManager.prototype.getSQSubInfoPath = function(index) {
        return this.socialQuestList.SUB_IMG_PATH + this.socialQuestList.SQSUBINFO[index].IMG_URL;
    }

    FUserDataManager.prototype.setVisitPurposeForShare = function(b) {
        this.visitPurposeForShare = b;
    }
    
    FUserDataManager.prototype.getVisitPurposeForShare = function() {
        return this.visitPurposeForShare;
    }


    FUserDataManager.prototype.setAccountPk = function(accountPk) {
        this.accountPk = accountPk;
    }
    
    FUserDataManager.prototype.getAccountPk = function() {
        return this.accountPk;
    }

    FUserDataManager.prototype.setUrl = function(url) {
        this.url = url;
    }

    FUserDataManager.prototype.getUrl = function() {
        return this.url;
    }

    FUserDataManager.prototype.getInterestText = function() {
        return this.txtInterest;
    }

    FUserDataManager.prototype.setUserInfomation = function(level, exp, nickname, url, gender, avatar, progressState, interesNm, roomType) {
        this.level          = level;
        this.exp            = exp;
        this.nickname       = nickname;
        this.url            = url;
        this.gender         = gender;
        this.avatarCd       = avatar;
        this.progressState  = progressState;
        this.txtInterest    = G.dataManager.getInterestString( interesNm );
        this.roomType       = roomType;
    }

    FUserDataManager.prototype.setUserAvatar = function(avatar,interestNm) {
        this.avatarCd       = avatar;

        if(interestNm)
            this.txtInterest    = G.dataManager.getInterestString(interestNm);
    }

    FUserDataManager.prototype.setAvatar = function(avatar) {
        this.avatarCd       = avatar;
    }



    FUserDataManager.prototype.setCurrencyInfo = function(currency_info) {

        if(currency_info.length != 8) {
            Debug.Error('setCurrencyInfo : 재화 갯수가 맞지 않음');
            return;
        }

        this.goods.STAR         = currency_info[0];
        this.goods.GOLD         = currency_info[1];
        this.goods.HEART        = currency_info[2];
        this.goods.RUBY         = currency_info[3];
        this.goods.COIN         = currency_info[4];
        this.goods.SMILE        = currency_info[5];
        this.goods.RUBY_FREE    = currency_info[6];
        this.goods.SMILE_FREE   = currency_info[7];
    }

    FUserDataManager.prototype.setSmileInfo = function(smile) {
        this.goods.SMILE_FREE   = smile;
        FRoomUI.getInstance().setSmileMarkCount( CommFunc.numberWithCommas(G.dataManager.getUsrMgr(DEF_IDENTITY_ME).goods.SMILE_FREE) );
        // G.sceneMgr.getCurrentScene().wrapTopInfo.getChildByName( GUI.ButtonName.mainStar ).getChildByName( "text" ).text = this.goods.SMILE_FREE.toString();
    }

    // FUserDataManager.prototype.pushObjectMap = function(obj) {

    //     var o = this.findObjectMap(obj.OBJ_MAP_SEQ, obj.TILE_IDX);

    //     if(o != null) {
    //         alert('same object map');
    //         return;
    //     } else {
    //         this.RoomObjectMap.push(obj);
    //     }
        
    // }

    //ObjectMap에서 타일인덱스와 시퀀스가 같은지 찾고 있으면 리턴
    // FUserDataManager.prototype.findObjectMap = function(obj_map_seq, tile_index) {
        
    //     var len = this.RoomObjectMap.length;
    //     for(var i=0; i<len; i++) {
    //         if(obj_map_seq != 0) {
    //             if((this.RoomObjectMap[i].OBJ_MAP_SEQ == obj_map_seq) && (this.RoomObjectMap[i].TILE_IDX == tile_index)) {
    //                 return this.RoomObjectMap[i];
    //             }
    //         } else {
    //             if(this.RoomObjectMap[i].TILE_IDX == tile_index) {
    //                 return this.RoomObjectMap[i];
    //             }
    //         }
    //     }

    //     return null;
    // }

    // FUserDataManager.prototype.getObjectMap = function() {
    //     return this.RoomObjectMap;
    // }


    FUserDataManager.prototype.clearInventory = function() {

        CommFunc.arrayRemoveAll(this.Inventory);
    }

    FUserDataManager.prototype.pushInventory = function(objID) {

        this.Inventory.push(objID);
    }
    
    FUserDataManager.prototype.getInventoryAll = function() {
        return this.Inventory;
    }

    FUserDataManager.prototype.getInventory = function(categoryID) {
        
        var obj = null;
        var category = [];
        for(var i=0; i<this.Inventory.length; i++) {

            obj = G.dataManager.getOBJInfo(this.Inventory[i]);

            if(obj.OBJ_CATE == categoryID) {
                
                category.push(this.Inventory[i]);
            }
        }

        return category;
    }

    FUserDataManager.prototype.getItemCountInInventory = function( objID )
    {
        var count = 0;
        for(var i=0; i<this.Inventory.length; i++) {
            if(this.Inventory[i] == objID) {
                count++;
            }
        }

        return count;
    }

    FUserDataManager.prototype.sellInventory = function(objID) {

        for(var i=0; i<this.Inventory.length; i++) {
            if(this.Inventory[i] == objID) {
                CommFunc.arrayRemove(this.Inventory, this.Inventory[i]);
                return;
            }
        }

    }




    // FUserDataManager.prototype.clearCategoryInven = function() {

    //     CommFunc.arrayRemoveAll(this.categoryInvenObject);
    // }

//     FUserDataManager.prototype.pushCategoryInven = function(info) {
// /*
// 			"CATE_ID"   : d[0], //카테고리아이디
// 			"OBJ_ID" 	: d[1], //오브젝트아이디
// 			"OBJ_CNT"   : d[2]  //오브젝트개수
// */
//         for(var i=0; i<this.categoryInvenObject.length; i++) {
//             //이미 들어가 있으면 정보만 업데이트
//             if(this.categoryInvenObject[i].CATE_ID === info.CATE_ID && this.categoryInvenObject[i].OBJ_ID === info.OBJ_ID) {

//                 this.categoryInvenObject[i].OBJ_CNT = info.OBJ_CNT;
//                 return;
//             } 
//         }
//         this.categoryInvenObject.push(info);
//     }

//     FUserDataManager.prototype.getCategoryInvenItemList = function( in_category )
//     {
//         var resultList = [];
//         this.categoryInvenObject.forEach( function( iter )
//         {
//             if(iter.CATE_ID == in_category)
//                 resultList.push(iter);
//         });

//         return resultList;
//     }


    FUserDataManager.prototype.clearUnlockObject = function() {
        
        CommFunc.arrayRemoveAll(this.pushUnlockObject);
    }
    
    FUserDataManager.prototype.pushUnlockObject = function(info) {
        for(var i=0; i<this.UnlockObject.length; i++) {

            if(this.UnlockObject[i].CATE_ID === info.CATE_ID && this.UnlockObject[i].OBJ_ID === info.OBJ_ID) {
                return;
            } 
        }
        this.UnlockObject.push(info);
    }

    //<---------------------------------------------------------------------------------------------------------
    FUserDataManager.prototype.clearSuggestFriend = function() {
        CommFunc.arrayRemoveAll(this.friend);
    }

    FUserDataManager.prototype.getSuggestFriend = function() {
        return this.friend;
    }
    
    FUserDataManager.prototype.getSuggestFriendDetail = function(accountPk) {

        for(var i=0; i<this.friend.length; i++) {
            if(this.friend[i].ACCOUNTPK == accountPk) {
                return this.friend[i];
            }
        }
    }

    FUserDataManager.prototype.pushSuggestFriend = function(accountPk, avatarCD, connecting, imgUrl, intro, imgPath) {
        
        var f = this.getFriend(accountPk);

        if(f) {
            f.AVATACD = avatarCD;
            f.IMG_URL = imgUrl;
            f.IMG_PATH = imgPath;
            f.CONNECTING = (connecting == 1);
            f.INTRO = Base64.decode(intro);
        } else {
            var friend = new sFriend();
            
            friend.ACCOUNTPK = accountPk;
            friend.AVATACD = avatarCD;
            friend.IMG_URL = imgUrl;
            friend.IMG_PATH = imgPath;
            friend.CONNECTING = (connecting == 1);
            friend.INTRO = Base64.decode(intro);
            this.friend.push(friend);
        }
    }

    FUserDataManager.prototype.pushSuggestFriendVisit = function(accountPk, avatarCd, gender, imgUrl, intro, imgPath) {
        
        var f = this.getFriend(accountPk);

        if(f) {
            f.AVATACD           = avatarCd;
            f.GENDER            = gender;
            f.IMG_URL           = imgUrl;
            f.IMG_PATH          = imgPath;
            if(intro)
                f.INTRO             = Base64.decode(intro);
            
        } else {
            var friend = new sFriend();
            
            friend.ACCOUNTPK    = accountPk;
            friend.AVATACD      = avatarCd;
            friend.GENDER       = gender;
            friend.IMG_URL      = imgUrl;
            friend.IMG_PATH     = imgPath;
            if(intro)
                friend.INTRO        = Base64.decode(intro);

            this.friend.push(friend);
        }
    }



    //<---------------------------------------------------------------------------------------------------------
    FUserDataManager.prototype.getFriend = function(accountPk) {
        for(var i=0; i<this.friend.length; i++) {
            if(this.friend[i].ACCOUNTPK == accountPk) {

                return this.friend[i]; 
            }
        }

        return null;
    }
    //<---------------------------------------------------------------------------------------------------------
    FUserDataManager.prototype.addSuggestFriendDetail = function(
                                                            accountPk,
                                                            friendAccountID, 
                                                            imgPath,
                                                            imgUrl, 
                                                            intro, 
                                                            picCnt, 
                                                            movCnt, 
                                                            palCnt, 
                                                            smiCnt, 
                                                            semiImg1, 
                                                            semiImg2, 
                                                            semiImg3,
                                                            starSeq,
                                                            vdoThumbnailPath,
                                                            semiImgType1,
                                                            semiImgType2,
                                                            semiImgType3

                                                        ) {

        var f = this.getFriend(accountPk);

        if(f == null) {
            Debug.Error('friend is not find..i push friend');

            var friend = new sFriend();

            friend.ACCOUNTPK        = accountPk;
            friend.NICKNAME         = friendAccountID;
            friend.IMG_URL          = imgUrl;
            friend.INTRO            = Base64.decode(intro);
            friend.PICCNT           = picCnt;
            friend.MOVCNT           = movCnt;
            friend.PALCNT           = palCnt;
            friend.SMICNT           = smiCnt;
            friend.SEMIIMG1         = semiImg1;
            friend.SEMIIMG2         = semiImg2;
            friend.SEMIIMG3         = semiImg3;
            friend.STARCONTSEQ      = starSeq;
            friend.SEMIIMGTYPE1     = semiImgType1;
            friend.SEMIIMGTYPE2     = semiImgType2;
            friend.SEMIIMGTYPE3     = semiImgType3;
            friend.IMG_PATH         = imgPath;
            friend.VDO_PATH         = vdoThumbnailPath

            this.friend.push(friend);
        } else {

                f.NICKNAME         = friendAccountID;
                f.IMG_URL          = imgUrl;
                f.INTRO            = Base64.decode(intro);
                f.PICCNT           = picCnt;
                f.MOVCNT           = movCnt;
                f.PALCNT           = palCnt;
                f.SMICNT           = smiCnt;
                f.SEMIIMG1         = semiImg1;
                f.SEMIIMG2         = semiImg2;
                f.SEMIIMG3         = semiImg3;
                f.STARCONTSEQ      = starSeq;
                f.SEMIIMGTYPE1     = semiImgType1;
                f.SEMIIMGTYPE2     = semiImgType2;
                f.SEMIIMGTYPE3     = semiImgType3;
                f.IMG_PATH         = imgPath;
                f.VDO_PATH         = vdoThumbnailPath;
        }
    }
    //<---------------------------------------------------------------------------------------------------------
    FUserDataManager.prototype.getSocialFriend = function(index) {
        
        if(this.socialQuestList.SQINFO == null) return;
        if(this.socialQuestList.SQINFO.length <= index) return;
        
        return this.socialQuestList.SQINFO[index];
    }

    //<---------------------------------------------------------------------------------------------------------
    FUserDataManager.prototype.getStarContentInfo = function() {
        return this.sStarContentsList;
    }

    FUserDataManager.prototype.setStarContentUrl = function(url, imgPath, vdoPath, vdoThumbnailPath) {

        var list = this.sStarContentsList;

        CommFunc.arrayRemoveAll(list.SC);

        list.IMG_PATH = imgPath;
        list.URL = url;
        list.VDO_PATH = vdoPath;
        list.VDO_THUMBNAILPATH = vdoThumbnailPath
    }

    FUserDataManager.prototype.changeStarContentUrl = function(seq, fileType, path, url) {
        
        var list = this.sStarContentsList;

        //1:이미지,2:동영상
        if(fileType == 1) {
            list.IMG_PATH = path;
        } else if(fileType == 2) {
            list.VDO_PATH = path;
        } else if(fileType == 3) {
            list.IMG_PATH = path;
        }

        for(var i=0; i<list.SC.length; i++) {
            if(list.SC[i].STARCONTSEQ == seq) {
                sc = list.SC[i];
                sc.REPRSTIMGNM = url;
                sc.FILETYPE = fileType;
                return;
            }
        }
    }

    FUserDataManager.prototype.pushStarContent = function(starContSeq, starContCd, reprstImgNm, fileType, objMapSeq, postCnt) {

        var list = this.sStarContentsList;
        var sc = null;

        for(var i=0; i<list.SC.length; i++) {
            if(list.SC[i].STARCONTSEQ == starContSeq) {
                sc = list.SC[i];
                sc.STARCONTSEQ    = starContSeq;
                sc.STARCONTCD     = starContCd;
                sc.REPRSTIMGNM    = reprstImgNm;
                sc.FILETYPE       = fileType;
                sc.OBJMAPSEQ      = objMapSeq;
                sc.POSTCNT        = postCnt;

                // Debug.Error('pushStarContent 중복 시퀀스: '+starContSeq);
                return;
            }
        }

        sc = new sStarContent();
        
        sc.STARCONTSEQ    = starContSeq;
        sc.STARCONTCD     = starContCd;
        sc.REPRSTIMGNM    = reprstImgNm;
        sc.FILETYPE       = fileType;
        sc.OBJMAPSEQ      = objMapSeq;
        sc.POSTCNT        = postCnt;

        list.SC.push(sc);
    }

    FUserDataManager.prototype.addStarContent = function(starContSeq) {
        var list = this.sStarContentsList;

        for(var i=0; i<list.SC.length; i++) {
            if(list.SC[i].STARCONTSEQ == starContSeq) {
                list.SC[i].POSTCNT++;
                return;
            }
        }
    }

    FUserDataManager.prototype.getStarContentForObjSeq = function(objSeq) {
        var list = this.sStarContentsList;

        for(var i=0; i<list.SC.length; i++) {
            if(list.SC[i].OBJMAPSEQ == objSeq) {
                return list.SC[i];
            }
        }

        return null;
    }

    FUserDataManager.prototype.getStarContentForSeq = function(seq) {
        var list = this.sStarContentsList;

        for(var i=0; i<list.SC.length; i++) {
            if(list.SC[i].STARCONTSEQ == seq) {
                return list.SC[i];
            }
        }

        return null;
    }


    FUserDataManager.prototype.delStarContent = function(seq, fileType, path, url) {

        var list = this.sStarContentsList;

        //1:이미지,2:동영상
        if(fileType == 1) {
            list.IMG_PATH = path;
        } else if(fileType == 2) {
            list.VDO_PATH = path;
        }

        var k = -1;
        for(var i=0; i<list.SC.length; i++) {
            if(list.SC[i].STARCONTSEQ == seq) {
                
                if(list.SC[i].POSTCNT) list.SC[i].POSTCNT--;
                list.SC[i].REPRSTIMGNM = url;
                list.SC[i].FILETYPE = fileType;
                k = i;

                break;;
            }
        }

        if(k!=-1) {
            if(list.SC[k].POSTCNT == 0)
                CommFunc.arrayRemove(list.SC, list.SC[k]);
        }
    }

    FUserDataManager.prototype.isIncludeStarContents = function(objSeq) {

        var list = this.sStarContentsList;

        for(var i=0; i<list.SC.length; i++) {
            if(list.SC[i].OBJMAPSEQ == objSeq) {
                
                return list.SC[i].STARCONTSEQ;
            }
        }

        return 0;
    }

    //<---------------------------------------------------------------------------------------------------------

    FUserDataManager.prototype.getStarContCD = function() {
        
        return this.sMyStarContentsList.SC.length+1;
    }

    FUserDataManager.prototype.getMyStarContentInfo = function() {
        return this.sMyStarContentsList;
    }

    FUserDataManager.prototype.setMyStarContentInfo = function(smileCnt, url, imgPath, vdoPath, vdoThumbnailPath) {
        
        var list = this.sMyStarContentsList;

        CommFunc.arrayRemoveAll(list.SC);

        list.MYSUMSMILECNT  = smileCnt;
        list.IMG_PATH       = imgPath;
        list.URL            = url;
        list.VDO_PATH       = vdoPath;
        list.VDO_THUMBNAILPATH = vdoThumbnailPath;
    }

    FUserDataManager.prototype.pushMyStarContent = function(starContSeq, starContCd, reprstImgNm, fileType, postCnt, followCnt) {

        var list = this.sMyStarContentsList;
        var sc = null;

        for(var i=0; i<list.length; i++) {
            if(list.SC[i].STARCONTSEQ == starContSeq) {
                sc = list.SC[i];
                sc.STARCONTSEQ    = starContSeq;
                sc.STARCONTCD     = starContCd;
                sc.REPRSTIMGNM    = reprstImgNm;
                sc.FILETYPE       = fileType;
                sc.POSTCNT        = postCnt;
                sc.FOLLOWERCNT    = followCnt;

                Debug.Error('pushStarContent 중복 시퀀스: '+starContSeq);
                return;
            }
        }

        sc = new sMyStarContent();
        
        sc.STARCONTSEQ    = starContSeq;
        sc.STARCONTCD     = starContCd;
        sc.REPRSTIMGNM    = reprstImgNm;
        sc.FILETYPE       = fileType;
        sc.POSTCNT        = postCnt;
        sc.FOLLOWERCNT    = followCnt;

        list.SC.push(sc);
    }

    FUserDataManager.prototype.isRegStarCd = function(cd) {
        var list = this.sMyStarContentsList;

        for(var i=0; i<this.sMyStarContentsList.SC.length; i++) {
            if(this.sMyStarContentsList.SC[i].STARCONTCD == cd) {
                return true;
            }
        }

        return false;
    }

    //<---------------------------------------------------------------------------------------------------------
    FUserDataManager.prototype.requestUseSmileMark = function( in_useCount )
    {   
        var self = this;

        var json = protocol.smileDecrease( parseInt( in_useCount ) );
        ws.onRequest(json, self.receiveUseSmileMark, self);
    }

    FUserDataManager.prototype.receiveUseSmileMark = function( in_res, in_self )
    {
        in_self.goods.SMILE_FREE = in_res.smileFree;

        G.sceneMgr.getCurrentScene().wrapTopInfo.getChildByName( GUI.ButtonName.mainStar ).getChildByName( "text" ).text = in_self.goods.SMILE_FREE.toString();
    }


    return FUserDataManager;

}());