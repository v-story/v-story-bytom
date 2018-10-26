'use strict';

var opcode = { 
	"PlayerLogin":1,
	"GetHoldCategory":2,
	"GetInven":3,
	"ExtendCategorySlot":4,
	"SalesInvenObject":5,
	"BatchSalesInvenObject":6,
	"GetUnLockObject":7,
	"ReleaseUnLockObject":8,
	"PurchaseObject":9,
	"GetObjectMap":11,
	"AddObjectMap":12,
	"ModObjectMap":13,
	"DelObjectMap":14,
	"SaleObjectMap":15,
	"GetRoomMap":16,
	"AddRoomMap":17,
	"ModRoomMap":18,
	"MailLoad":19,
	"MailRead":20,
	"GetSNSQuest":21,
	"UpdateSNSQuest":22,
	"PlayerLogout":23,
	"GetSNSQuestSub":24,
	"UpdateSNSQuestSub":25,
	"ResetSNSQuestSub":26,
	"GetStarContents":27,
	"GetScenarioList":28,
	"AddScenarioEnter":29,
	"UpdateScenarioInstall":30,
	"UpdateScenarioClear":31,
	"UpdateScenarioQuickClear":32,
	"UpdateChapterScenarioReward":33,
	"MoveStarContents":36,
	"GetSuggestFriend":39,
	"UpdateSNSQuestOpen":40,
	"GetSuggestFriendInfo":41,
	"GetShareObjList":42,
	"GetShareObjInfo":43,
	"AddShareObj":44,
	"GetMyStarContents":45,
	"GetAllInteractionList":47,
	"GetPollList":48,
	"UpdatePollEnter":49,
	"GetPollInfo":50,
	"UpdatePollComplete":51,
	"UpdatePollScore":52,
	"UpdatePollReward":53,
	"GetPollSuggestInfo":54,
	"UpdatePollSuggestScore":55,
	"UpdateAllInteractionReward":56,
	"NotifyPollMatching":57,
	"NotifyPollSuggest":58,
	"NotifyTodoQuest":59,
	"CreateAvatar":199,
	"GetRoomMapFriend":200,
	"GetObjectMapFriend":201,
	"GetStarContentsFriend":202,
	"GetSNSQuestFriend":203,
	"GetSuggestFriendVisit":204,
	"ModUserProgressState":206,
	"GetUserInfoFriendVisit":207,
	"GetTarUserInfo":208,
	"UpdateAvatar":299,
	"SmileGoodBuy":701,
	"CreateGuestKey":751,
	"FpsLog":899,
	"HeartBeat" : 999,
	"NotifyConnect":1001,
	"NotifyDisconnect":1002,
	"NotifySmileMark":1003,
	"NotifyBtmTransaction":1005,
	"EnterChannel":2001,
	"ChangeChannel":2002,
	"MoveLocation":2003,
	"ChatChannel":2004,
	"Whisper":2005,
	
	"GetChannelInteractionInfo":2006,
	"ReqChannelInteraction":2007,
	"NotifyReqChannelInteraction":2008,
	"AcceptChannelInteraction":2009,
	"NotifyAcceptChannelInteraction":2010,
	"ActChannelInteraction":2011,
	"NotifyActChannelInteraction":2012,
	"ChannelInteractiveStatusInit":2013,

	"ExitChannel":2020,
	"ChatWorld":2021,
 };

 var resultcode = { 
	0:"성공",
	1:"Master Server에등록되지않은서버입니다.",
	2:"서버 버전이 일치하지 않습니다.",
	3:"계정 정보를 찾을 수 없습니다.",
	4:"계정 인증에 실패했습니다.",
	5:"서버에 정상 접속 상태가 아닙니다.",
	6:"게임 서버 정보를 가져오는데 실패했습니다.",
	7:"DB 서버정보를가져오는데실패했습니다.",
	8:"같은 이름의 계정이 존재합니다.",
	9:"올바른 JSON FORMAT이 아닙니다.",
	10:"LOGIN PARSE에실패했습니다.",
	11:"중복로그아웃처리 타임아웃입니다.",
	12:"계정풀 생성에 실패했습니다.",
	13:"DB 연결에실패했습니다.",
	14:"DB Connection Open에실패했습니다.",
	15:"Procedure 로드에실패했습니다.",
	16:"골드가 부족합니다.",
	17:"루비가 부족합니다.",
	18:"별이 부족합니다.",
	19:"SWEET개수가부족합니다.",
	20:"SMILE개수부족합니다.",
	21:"리필 재화가 부족합니다.",
	22:"재화 리필 주기를 설정하지 않았습니다.",
	23:"없는 재화 입니다.",
	24:"재화가 부족합니다.",
	25:"없는 재화 타입니다.",
	26:"잘못된 룸타일 개수입니다.",
	27:"메모리 할당에 실패하였습니다.",
	28:"소지 공간이 부족하여 완료 할 수 없습니다.",
	29:"같은 이름의 캐릭터가 존재합니다.",
	30:"선언되지 않은 OPCODE입니다.",
	31:"파라메터 변수가 없습니다.",
	32:"PARSING 오류입니다.",
	33:"OBJECT CATEGORY 범주를넘어섰습니다.",
	34:"이미 열려 있는 OBJECT CATEGORY 입니다.",
	35:"보유하지 않은 CATEGORY 입니다.",
	36:"보유하지 않은 OBJECT 입니다.",
	37:"TILE INDEX 정보오류",
	38:"없는 OBJECT 입니다.",
	39:"OBJECT 개수가부족합니다.",
	40:"PARAMETER 오류입니다.",
	41:"SLOT MAX 범주를넘어섰습니다.",
	42:"SLOT이꽉찼습니다.",
	43:"비용 ID 오류 입니다.",
	44:"삭제 실패 했습니다.",
	45:"찾을 수 없는 오브젝트 아이디 값 입니다.",
	46:"우편을 찾을수가 없다.",
	47:"찾을 수 없는 룸맵 정보입니다.",
	48:"쇼셜퀘스트 친구추천을 시작하기를 할수없다.",
	49:"쇼셜퀘스트 소비,공유 퀘스트를 완료 할수없다.",
	50:"이미 퀘스트가 진행중입니다",
	51:"이미 퀘스트가 시작되었습니다",
	52:"잠김 해제 레벨 오류",
	53:"테이블 정보를 찾을수 없다.",
	54:"클리어 최대 회수 초과",
	55:"서버 로직 에러",
	56:"쇼셜퀘스트를 생성하지 못하였습니다",
	57:"쇼셜퀘스트 추천친구를 찾을수 없습니다.",
	58:"쇼셜퀘스트 추천친구 초기화 할 대상들이 없습니다.",
	59:"입력값 오류",
	60:"방문친구 룸정보를 찾을 수 없습니다.",
	61:"잘못된 CATEGORY ID 입니다.",
	62:"이미 보유하고 있는 카테고리 입니다.",
	63:"스타컨텐츠를 찾을 수 없습니다.",
	64:"레벨이 부족합니다.",
	65:"조건이 충족되지 않습니다.",
	66:"배치된 곳에 오브젝트가 없습니다.",
	67:"배치할 곳에 오브젝트가 없습니다.",
	68:"방문 친구 ACCOUNTPK 정보가 잘못되었습니다.",
	69:"방문 친구 쇼셜퀘스트 정보가 없습니다.",
	70:"잘못된 진행 상태 정보 입니다",
	71:"범위에서 벗어나는 변수값들이 정의 되어 있습니다.",
	72:"현재 인덱스에 오브젝트가 설치되어 있습니다.",
	76:"스타콘텐츠 생성 타임아웃",
	77:"스타콘텐츠 갱신 타임아웃",
	78:"스타콘텐츠 정보 갱신 타임아웃",
	79:"쇼셜퀘스트(생산) 갱신 타임아웃",
	80:"쇼셜퀘스트(소비,공유) 갱신 타임아웃",
	81:"스타콘테츠가 삭제 실패",
	82:"친구 방문시 추천 친구 개수 보족",
	83:"이미 스타콘텐츠가 존재합니다.",
	84:"스타콘텐츠 대표이미지 변경 타임아웃",
	85:"이미 보상을 받았습니다.",
	86:"매칭이 안되었습니다.",
	87:"REDIS SERVER가 구동 되어 있지 않습니다.",
	88:"동일한 채널로 이동을 할수 없습니다.",
	89:"채널 생성 실패",
	90:"현재 접속된 채널이 없습니다.",
	91:"현재 채널 정원 초과",
	92:"현재 채널에 참여한 멤버입니다.",
	93:"해당 채널의 멤버가 아닙니다.",
	94:"채널 인터렉티브 정보가 없습니다.",
	95:"채널 상태값 오류 입니다.",/* 특별하게 사용되는 에러이다. isError를 봐라 */
	96:"상대방 계정 정보를 찾을 수 없습니다.",
	97:"채널 정보가 서로 다릅니다.",
	98:"GAME SERVER가 구동 되어 있지 않습니다.",
	99:"이미 사용중입니다.",
	100:"이미 점수 등록.",
	101:"이미 상호작용중입니다.",
	102:"상호작용 타임아웃",
	103:"해당 아이디에 일치하는 상호 작용 아이디를 찾을 수 없습니다.",
	104:"상호 작용 베이스 정보가 없습니다.",
	105:"상호 작용 레벨 베이스 정보가 없습니다.",
	106:"상호 작용 상태값이 잘못되었습니다.",
	107:"죄송합니다.해당사용자를 찾을수 없습니다",
	108:"세션 에러입니다.",
	109:"로그인을 해주세요",
	110:"세션 삭제 에러입니다.",
	111:"예외발생",
	112:"업로드할 파일 크기가 초과 되었습니다 (최대 10M).",
	113:"업로드할 파일을 찾을 수 없습니다.",
	114:"파일 타입 오류입니다.",
	115:"데이터를 찾을 수 없습니다.",
	116:"유저 가입이 완료 되었습니다.",
	117:"유저 아바타, 관심분야 정보 생성에 성공 하였습니다.",
	118:"유저 아바타 정보 수정에 성공 하였습니다.",
	119:"아이디가 이미 존재합니다.",
	120:"유저 가입에 실패 하였습니다. 다시 시도 하세요.",
	121:"어카운트 유저 정보 추가에 실패 하였습니다. 다시 시도 하세요.",
	122:"SNS 유저 정보 추가에 실패 하였습니다. 다시 시도 하세요.",
	123:"SNS 유저 태그 정보 추가에 실패 하였습니다. 다시 시도 하세요.",
	124:"Game 유저 정보 추가에 실패 하였습니다. 다시 시도 하세요.",
	125:"Game 방정보 추가에 실패 하였습니다. 다시 시도 하세요.",
	126:"Game 오브젝트 정보 추가에 실패 하였습니다. 다시 시도 하세요.",
	127:"Game 아바타 정보 추가에 실패 하였습니다. 다시 시도 하세요.",
	128:"SNS 유저 관심분야 정보 추가에 실패 하였습니다. 다시 시도 하세요.",
	129:"관심분야 개수가 맥스를 초과하였습니다.",
	130:"로그인 되었습니다.",
	131:"세션 서버로부터 예러 발생",
	132:"로그인 실패 하였습니다. 다시 시도 하세요.",
	133:"아이디가 존재 하지 않습니다.",
	134:"게스트 로그인 아이디가 존재 하지 않습니다.",
	135:"인증키가 일치 하지 않습니다.",
	136:"댓글 등록이 완료 되었습니다.",
	137:"좋아요 등록이 완료 되었습니다.",
	138:"스마일 등록이 완료 되었습니다.",
	139:"좋아요 취소가 완료 되었습니다.",
	140:"친구 AccountPk를 찾을 수 없습니다.",
	141:"좋아요를 이미 등록 하였습니다.",
	142:"댓글 등록에 실패 하였습니다.",
	143:"좋아요 등록에 실패 하였습니다.",
	144:"Account DB에 좋아요 개수 등록에 실패 하였습니다.",
	145:"게시물 가중치 등록에 실패 하였습니다.",
	146:"소셜 퀘스트 완료 내역 등록에 실패 하였습니다.",
	147:"좋아요 취소에 실패 하였습니다.",
	148:"본인 게시물에 스마일을 등록 할 수 없습니다.",
	149:"보유 스마일 개수가 충분하지 않습니다.",
	150:"스마일 내역 등록에 실패 하였습니다.",
	151:"AccountDB 스마일 개수 변경에 실패 하였습니다.",
	152:"게시물을 찾을 수 없습니다.",
	153:"유저 정보를 찾을 수 없습니다.",
	154:"댓글을 찾을 수 없습니다.",
	155:"유저 비디오 게시물을 찾을 수 없습니다.",
	156:"하트 유저를 찾을 수 없습니다.",
	157:"스마일 유저를 찾을 수 없습니다.",
	158:"스마일 정보를 찾을 수 없습니다.",
	159:"관심분야는 최대 5개까지 선택 할 수 있습니다.",
	160:"관심분야 등록에 실패 했습니다.",
	161:"유저 태그(ID,명) 등록에 실패 했습니다.",
	162:"섬네일을 찾을 수 없습니다.",
	163:"게시물을 찾을 수 없습니다.",
	164:"유저 정보를 찾을 수 없습니다.",
	165:"팔로워를 찾을 수 없습니다.",
	166:"팔로우를 찾을 수 없습니다.",
	167:"섬네일 정보를 찾을 수 없습니다.",
	168:"관심분야가 중복 되었습니다.",
	169:"좋아할만한 동영상을 찾지 못했습니다.",
	170:"친구 검색 내역 등록에 실패 하였습니다.",
	171:"태그 검색 내역 등록에 실패 하였습니다.",
	172:"태그를 찾을 수 없습니다.",
	173:"게시물을 찾을 수 없습니다.",
	174:"유저 정보를 찾을 수 없습니다.",
	175:"추천 태그를 찾을 수 없습니다.",
	176:"추천 친구를 찾을 수 없습니다.",
	177:"검색 결과를 찾을 수 없습니다.",
	178:"인기 게시물을 찾을 수 없습니다.",
	179:"최신 게시물을 찾을 수 없습니다.",
	180:"최신 검색한 친구를 찾을 수 없습니다.",
	181:"최신 검색한 태그를 찾을 수 없습니다.",
	184:"SNS 퀘스트 내역 등록에 실패 했습니다.",
	185:"스타콘텐츠 정보를 얻어 왔습니다.",
	186:"스타콘텐츠에서 게시물 삭제를 완료 하였습니다.",
	187:"스타콘텐츠 유저 정보를 얻어왔습니다.",
	188:"스타콘텐츠 오브젝트 변경이 완료 되었습니다.",
	189:"스타콘텐츠 팔로우 취소가 완료 되었습니다.",
	190:"스타콘텐츠 팔로우 등록이 완료 되었습니다.",
	191:"스타콘텐츠 변경이 완료 되었습니다.",
	192:"스타콘텐츠 등록이 완료 되었습니다.",
	193:"스타콘텐츠 팔로우가 이미 등록 되어 있습니다.",
	194:"스타콘텐츠를 찾을 수 없습니다.",
	195:"스타콘텐츠 카테고리 정보를 찾을 수 없습니다.",
	196:"스타콘텐츠 대표이미지 명 또는 파일 타입을 찾을 수 없습니다.",
	197:"관심분야를 찾을 수 없습니다.",
	198:"섬네일 정보를 찾을 수 없습니다.",
	199:"스타콘텐츠에 2개이상 게시물을 등록 할 수 없습니다.",
	200:"스타콘텐츠가 이미 존재합니다.",
	201:"게시물이 이미 존재합니다.",
	202:"마이홈에서 오브젝트를 찾을 수 없습니다.",
	203:"이미지 또는 동영상 파일을 찾을 수 없습니다.",
	204:"스타콘텐츠에 등록할 게시물이 없습니다.",
	205:"스타콘텐츠에 등록할 게시물 정보를 찾을 수 없습니다.",
	206:"스타콘텐츠에 등록할 게시물 개수 정보를 찾을 수 없습니다.",
	207:"스타콘텐츠를 찾을 수 없습니다.",
	208:"스타콘텐츠 유저 정보를 찾을 수 없습니다.",
	209:"스타콘텐츠 카테고리 정보를 찾을 수 없습니다.",
	210:"스타콘텐츠 팔로우 개수 정보를 찾을 수 없습니다.",
	211:"스타콘텐츠 AccountPk를 찾을 수 없습니다.",
	212:"스타콘텐츠 코드값의 범위가 잘못 되었습니다.",
	213:"스타콘텐츠 등록에 실패 했습니다.",
	214:"스타콘텐츠 카운트 정보 등록에 실패 했습니다.",
	215:"스타콘텐츠 관심분야 등록에 실패 했습니다.",
	216:"스타콘텐츠 추가정보 등록에 실패 했습니다.",
	217:"스타콘텐츠 매핑 정보 등록에 실패했습니다.",
	218:"스타콘텐츠 존재유무 등록에 실패했습니다.",
	219:"새로운 대표이미지 정보를 얻지 못했습니다.",
	220:"스타콘텐츠에 대표이미지 변경에 실패 했습니다.",
	221:"스타콘텐츠 존재 유무 변경에 실패 하였습니다.",
	222:"스타콘텐츠에서 게시물 정보 삭제에 실패 하였습니다.",
	223:"스타콘텐츠 게시물정보 변경에 실패 하였습니다.",
	224:"스타콘텐츠에 오브젝트 시퀀스 변경에 실패 했습니다.",
	225:"스타콘텐츠 팔로우 개수 변경에 실패 하였습니다.",
	226:"스타콘텐츠 팔로우 해제에 실패 하였습니다.",
	227:"스타콘텐츠 팔로우 등록에 실패 하였습니다.",
	228:"스타콘텐츠 정보 변경에 실패 하였습니다.",
	231:"Guest 계정은 이 페이지에 대한 권한이 없습니다.",
	232:"처리 예외 발생",
	233:"DB 갱신 오류",
	234:"이미 오픈되어 있습니다.",
	235:"보상을 받을수가 없습니다.",
	236:"MAX_GAME_RESULT"
 };




var protocol = {};

protocol.NOW_OPEN = 1; //(1:바로열기
protocol.NOW_REWARD = 3; // 3:완료하기 ==>보상 받기 버튼을 누르는 것임

//<------------------------------------------------------------------------------------------------------------>//
protocol.login = function() {

	var req = {
        'accountPk': ACCOUNTPK,
        'opCode' : opcode['PlayerLogin'],
        'regKey': REGKEY
    }

    return req;
}

protocol.res_login = function(res) {
	
	//재화
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setCurrencyInfo(res.currencyInfo);

	SERVERINDEX = res.serverIndex;

	//임시
	// var roomType = 6; //1~6
	//유저정보
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setAccountPk(ACCOUNTPK);
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setUserInfomation(res.lv, 
												 res.exp, 
												 res.id, 
												 res.picNm, 
												 res.gender, 
												 res.avatarCd, 
												 res.progressState, 
												 res.interestNm,
												 res.roomType);
}
//<------------------------------------------------------------------------------------------------------------>//

//{"routingId":99,"opCode":프로토콜코드,"accountPk":어카운트pk}
protocol.heartBeat = function() {

    var req = {
        'routingId' : 99,
        'opCode' : opcode['HeartBeat'],
        'accountPk' : ACCOUNTPK
	}
	
	return req;
}


//<------------------------------------------------------------------------------------------------------------>//
//보유 카테고리 정보 리스트
protocol.getHoldCategory = function() {

	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetHoldCategory'],
        'accountPk' : ACCOUNTPK
	}

	return req;
}

protocol.res_getHoldCategory = function(res) {

	return;

	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).clearInvenInfo();
	if(res.rowCnt <= 0 ) return;

	var self = this;
	res.data.forEach(function(d){
		var inven = {
			"CATE_ID"  : d[0], //카테고리아이디
			"SLOT_CNT" : d[1], //슬롯갯수
			"MAX_CNT"  : d[2]  //슬롯 최대갯수
		};
		
		G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushInvenInfo(inven);
	});
}
	

//<------------------------------------------------------------------------------------------------------------>//
//인벤토리 정보
protocol.getInven = function(categoryid, page) {
	
	var req = {
		'routingId' : 1,
		'opCode' : opcode['GetInven'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'categoryId' : categoryid,
			'page' : page
		}
	}

	return req;
}

protocol.res_getInven = function(res) {
	return;
	
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).clearCategoryInven();
	if(res.rowCnt <= 0 ) return;

	var self = this;
	res.data.forEach(function(d){
		var inven = {
			"CATE_ID"   : d[0], //카테고리아이디
			"OBJ_ID" 	: d[1], //오브젝트아이디
			"OBJ_CNT"   : d[2]  //오브젝트개수
		};
		
		G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushCategoryInven(inven);
	});

}

//<------------------------------------------------------------------------------------------------------------>//
//슬롯 확장
protocol.extendCategorySlot = function(categoryId, slotCnt) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['ExtendCategorySlot'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'categoryId': categoryId,  //카테고리아이디, 
			'slotCnt': slotCnt     //슬롯개수
		}
	}

	return req;
}

protocol.res_extendCategorySlot = function(res) {

	//재화
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setCurrencyInfo(res.currencyInfo);

	var inven = {
		"CATE_ID"  : res.data[0][0], //카테고리아이디
		"SLOT_CNT" : res.data[0][1], //슬롯갯수
		"MAX_CNT"  : res.data[0][2]  //슬롯 최대갯수
	};
	
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushInvenInfo(inven);
}


//보관함 오브젝트 판매
protocol.salesInvenObject = function(categoryId, objectId, salesCnt) {

	var req = {
		'routingId' : 1,
        'opCode' : opcode['SalesInvenObject'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'categoryId': categoryId,  //카테고리아이디, 
			'objectId':	objectId,	//오브젝트아이디, 
			'salesCnt':	salesCnt	//판매개수
		}
	}
	return req;
}

protocol.res_salesInvenObject = function(res) {

	//재화
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setCurrencyInfo(res.currencyInfo);

	//res.cate_id로 getInven해줘야 정보가 갱신된다...
}


//보관함 오브젝트 일괄 판매
protocol.batchSalesInvenObject = function(categoryId) {

	var req = {
		'routingId' : 1,
        'opCode' : opcode['BatchSalesInvenObject'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'categoryId': categoryId  //카테고리아이디, 
		}
	}

	return req;
}

protocol.res_batchSalesInvenObject = function(res) {
	
	//재화
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setCurrencyInfo(res.currencyInfo);

	//res.cate_id로 getInven해줘야 정보가 갱신된다...
}


//잠김 해제 오브젝트 조회
protocol.getUnLockObject = function(categoryId) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetUnLockObject'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'categoryId': categoryId  //카테고리아이디, 
		}
	}

	return req;
}

protocol.res_getUnLockObject = function(res){
	if(res.rowCnt <= 0 ) return;

	res.data.forEach(function(d){
		var inven = {
			'CATE_ID'  : d[0], //카테고리아이디
			'OBJ_ID'   : d[1]  //오브젝트아이디
		};
		
		G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushUnlockObject(inven);
	});
}

//잠김 해제 오브젝트 해제
protocol.releaseUnLockObject = function(categoryId, objectId) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['ReleaseUnLockObject'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'categoryId': categoryId,  //카테고리아이디, 
			'objectId' : objectId
		}
	}

	return req;
}

protocol.res_releaseUnLockObject = function(res, self) {
	var inven = {
		'CATE_ID'  : data[0][0], //카테고리아이디
		'OBJ_ID'   : data[0][1]  //오브젝트아이디
	};
	
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushUnlockObject(inven);
}

//<------------------------------------------------------------------------------------------------------------>//
//오브젝트맵정보 얻기
protocol.getObjectMap = function(sectorIndex) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetObjectMap'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'sectorIdx': sectorIndex
		}
	}

	return req;
}

protocol.res_getObjectMap = function(res) {

	if(res.rowCnt <= 0 ) return;
	// var tile = [[110002,4025,1],[160002,2585,1],[130002,3305,1],[390002,4511,1],[120002,4430,1],[260002,4438,1],[170002,2512,1],[140002,4435,1],[390001,3865,1],[150002,2905,1]];
	// var tile = [[170002,2504,1],[200002,3810,1],[210002,3244,1],[110002,4017,1],[160002,2577,1],[390001,3857,1],[390002,4503,1],[190002,3888,1],[180002,3800,1],[150002,2897,1],[260002,4430,1],[130002,3297,1],[120002,4422,1],[390003,3963,1],[140002,4427,1]];
	// var tile = [[320002,4821,1],[180002,3160,1],[170002,1864,1],[110002,3377,1],[260002,3790,1],[160002,1937,1],[330002,4337,1],[200002,3170,1],[390005,4994,1],[340002,4738,1],[150002,2257,1],[120002,3782,1],[130002,2657,1],[190002,3248,1],[210002,2604,1],[140002,3787,1],[350002,4344,1],[390001,3217,1],[390004,4098,1],[390003,3323,1],[390002,3863,1]];
	// var tile = [[260002,4025,1],[150002,2492,1],[190002,3483,1],[130002,2892,1],[280002,3714,1],[390004,4333,1],[200002,3405,1],[120002,4017,1],[340002,4973,1],[390005,5229,1],[390003,3558,1],[270002,5323,1],[390002,4098,1],[290002,4200,1],[320002,5056,1],[350002,4579,1],[210002,2839,1],[240002,4439,1],[170002,2099,1],[390001,3452,1],[180002,3395,1],[390006,5479,1],[160002,2172,1],[140002,4022,1],[110002,3612,1],[260002,5329,1],[250002,4194,1],[230002,4043,1],[220002,4443,1],[330002,4572,1]];
	// var tile = [[320002,3856,1],[220002,3243,1],[150002,1292,1],[330002,3372,1],[240002,3239,1],[110002,2412,1],[190002,2283,1],[250002,2994,1],[390002,2898,1],[280002,2514,1],[140002,2822,1],[160002,972,1],[120002,2817,1],[310002,5328,1],[340002,3773,1],[390004,3133,1],[390006,4279,1],[390005,4029,1],[290002,3000,1],[300002,4684,1],[170002,899,1],[390003,2358,1],[180002,2195,1],[260002,4129,1],[310002,5318,1],[130002,1692,1],[200002,2205,1],[300002,4677,1],[390001,2252,1],[260002,2825,1],[270002,4123,1],[350002,3379,1],[210002,1639,1],[230002,2843,1]];
	// var tile = [[110002,2412,1],[390006,4279,1],[120002,2817,1],[190002,2283,1],[310002,5318,1],[390001,2252,1],[390004,3133,1],[390003,2358,1],[150002,1292,1],[390005,4029,1],[370002,4572,1],[300002,4685,1],[290002,3000,1],[170002,899,1],[380002,5219,1],[180002,2195,1],[140002,2822,1],[390002,2898,1],[160002,972,1],[270002,4123,1],[240002,3239,1],[350002,3379,1],[320002,3856,1],[300002,4678,1],[280002,2514,1],[210002,1639,1],[260002,2825,1],[260002,4129,1],[360002,4577,1],[220002,3243,1],[330002,3372,1],[340002,3773,1],[200002,2205,1],[130002,1692,1],[310002,5328,1],[250002,2994,1],[230002,2843,1]];
	// var k = 0;
	// tile.forEach(function(d){
	// 	var obj = {
	// 		'OBJ_MAP_SEQ' 	: k++,
	// 		'SECTOR_IDX'	: 1,
	// 		'CATE_ID'		: 1,
	// 		'OBJ_ID'		: d[0],
	// 		'TILE_IDX'		: d[1],
	// 		'ROT_DIR'		: d[2],
	// 		'LAYER_IDX'		: 1,
	// 	};

	// 	FObjectManager.getInstance().createRoomObject(obj, 0);
	// });

	res.data.forEach(function(d){
		var obj = {
			'OBJ_MAP_SEQ' 	: d[0],
			'SECTOR_IDX'	: d[1],
			'CATE_ID'		: d[2],
			'OBJ_ID'		: d[3],
			'TILE_IDX'		: d[4],
			'ROT_DIR'		: d[5],
			'LAYER_IDX'		: d[6],
		};

		FObjectManager.getInstance().createRoomObject(obj, DEF_IDENTITY_ME);
	});

	FObjectManager.getInstance().updateActionObjectList();
}

//<------------------------------------------------------------------------------------------------------------>//
//오브젝트맵정보 추가 - 일단 한개씩..
//shopInstallType : (상점:1,인벤:2)
protocol.addObjectMap = function(sectorIndex, obj, shopInstallType) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['AddObjectMap'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'addType': shopInstallType,
			'sectorIdx':sectorIndex,
			'cateId':obj.CATE_ID,
			'objId':obj.OBJ_ID,
			'tileIdx':obj.TILE_IDX,
			'rotDir':obj.ROT_DIR,
			'layerIdx':obj.LAYER_IDX
		}
	}

	return req;
}

protocol.res_addObjectMap = function(res) {

	// var obj = new sOBJECTINFO();

	// obj.OBJ_MAP_SEQ = res.objMapSeq; //:오브젝트맵시퀀스,;
	// obj.TILE_IDX    = res.tileIdx; //:타일인덱스,
	// obj.ROT_DIR     = res.rotDir; //:회전방향,
	// obj.OBJ_ID      = res.objId; //:오브젝트아이디,;
	// obj.LAYER_IDX   = res.layerIdx;//:레이어인덱스
	// obj.CATE_ID     = res.cateId; //카테고리아이디,;

	//재화
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setCurrencyInfo(res.currencyInfo);

	return obj;	
}


//<------------------------------------------------------------------------------------------------------------>//
//오브젝트맵정보 변경
protocol.modObjectMap = function(obj, preIndex) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['ModObjectMap'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'objMapSeq': obj.OBJ_MAP_SEQ, //오브젝트맵시퀀스
			'sectorIdx': 1, 				//섹터인덱스,
			'fromTileIdx': preIndex,		//타일인덱스(바뀌기전),
			'objId': obj.OBJ_ID,
			'cateId': obj.CATE_ID,
			'toTileIdx': obj.TILE_IDX, 	//타일인덱스(바뀐후),
			'rotDir': obj.ROT_DIR,     	//회전방향,
			'layerIdx': obj.LAYER_IDX		//레이어인덱스
		}
	}

	return req;
}

//response는 할일 없음

//<------------------------------------------------------------------------------------------------------------>//
//오브젝트맵정보 삭제(인벤토리로 저장)
protocol.delObjectMap = function(obj) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['DelObjectMap'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'objMapSeq': obj.OBJ_MAP_SEQ, //오브젝트맵시퀀스
			'sectorIdx': 1, 				//섹터인덱스,
			'objId': obj.OBJ_ID,
			'tileIdx': obj.TILE_IDX, 		//타일인덱스
			'layerIdx': obj.LAYER_IDX		//레이어인덱스
		}
	}

	return req;
}

//response는 할일 없음

//<------------------------------------------------------------------------------------------------------------>//
protocol.saleObjectMap = function(obj) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['SaleObjectMap'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'objMapSeq': obj.OBJ_MAP_SEQ, //오브젝트맵시퀀스
			'sectorIdx': 1, 				//섹터인덱스,
			'objId': obj.OBJ_ID,
			'tileIdx': obj.TILE_IDX, 		//타일인덱스
			'layerIdx': obj.LAYER_IDX		//레이어인덱스
		}
	}

	return req;
}

protocol.res_saleObjectMap = function(res) {
	
	//재화
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setCurrencyInfo(res.currencyInfo);
}

//<------------------------------------------------------------------------------------------------------------>//
//방맵정보 얻기
// protocol.getRoomMap = function() {

// 	var req = {
// 		'routingId' : 1,
//         'opCode' : opcode['GetRoomMap'],
//         'accountPk' : ACCOUNTPK
// 	}

// 	return req;
// }

// protocol.res_getRoomMap = function(res) {
// 	if(res.rowCnt <=0) return;

// 	FMapManager.getInstance().MapSequence = res.data[0][0];

// 	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setRoomType(res.data[0][1]);
// 	var Map = JSON.parse(res.data[0][3]);
	
// 	Map.forEach(function(room){
// 		//// 통맵 테스트때문에 방 바닥,벽정보를 세팅하지 않습니다.
// 		FMapManager.getInstance().setRoomMap(room[0], room[1], room[2], room[3], null);
// 	});

// 	FMapManager.getInstance().makeWallMap();
// }

 //<------------------------------------------------------------------------------------------------------------>//
function makeArrayRoom(RoomMap) {
	var json = '[';

	for(var i=0; i<RoomMap.length; i++){
		//json += JSON.stringify(RoomMap[i]);

		var ab = new Array(RoomMap[i].START_INDEX, RoomMap[i].END_INDEX, RoomMap[i].WALL_PAPER_ID, RoomMap[i].FLOOR_ID);
		json += JSON.stringify(ab);

		if(i != RoomMap.length-1) json += ',';
	}

	json += ']';

	return json;
 }

 //<------------------------------------------------------------------------------------------------------------>//
//방맵정보 추가
protocol.addRoomMap = function(tileCnt, RoomMap) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['AddRoomMap'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'room_tile_cnt' : tileCnt, //방타일 개수(재화변경용도)
			'room_info' : makeArrayRoom(RoomMap)
		}
	}

	return req;
}

//이건 사용하지 않을 꺼임..

//<------------------------------------------------------------------------------------------------------------>//
//방맵정보 변경
protocol.modRoomMap = function(tileCnt, wallpaperID, floorID, RoomMap) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['ModRoomMap'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'roomMapSeq': FMapManager.getInstance().MapSequence,  //방 시퀀스
			'roomTileCnt': tileCnt,								//방타일개수(재화변경용도:타일개수,벽지개수)
			'tileObjId': floorID,//RoomMap[0].FLOOR_ID,						//타일오브젝트아이디,
			'paperObjId': wallpaperID,// RoomMap[0].WALL_PAPER_ID, 				//벽지오브젝트아이디
			'roomInfo': makeArrayRoom(RoomMap),
			'objInfo': []											//[{"SEQ":오브젝트맵시퀀스,"SECTOR_IDX":섹터인데스,"LAYER_IDX":레이어인덱스,"TILE_IDX":타일인덱스},...]
		}
	}

	return req;
}

protocol.res_modRoomMap = function(res) {
	
	//재화
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setCurrencyInfo(res.currencyInfo);
}

//<------------------------------------------------------------------------------------------------------------>//
//쇼셜 퀘스트 메인정보 얻어오기
protocol.getSNSQuest = function() {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetSNSQuest'],
        'accountPk' : ACCOUNTPK
	}

	return req;
}

protocol.res_getSNSQuest = function(res) {

	if(res.rowCnt <= 0) return;

	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushSocialQuestList(res.imgPath, res.open, res.data);

	FRoomUI.getInstance().refreshSQAlertIcon();
}


//쇼셜 퀘스트 조건 완료 처리하기
protocol.updateSNSQuest = function(questID, teamAccountPk) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['UpdateSNSQuest'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'questID' : questID, //퀘스트아이디(101:생산, 201:소비, 301:공유)
			'teamAccountPk' : teamAccountPk //팀시퀀스(소비,공유시에만 설정)
		}
	}

	return req;
}

protocol.res_updateSNSQuest = function(res) {

	if(res.rowCnt != 0) {

		G.dataManager.getUsrMgr(DEF_IDENTITY_ME).updateSocialQuestListAll(res.data, res.open);

	} 
	if(res.subRowCnt != 0) {


		// G.dataManager.getUsrMgr(DEF_IDENTITY_ME).updateSubSocialQuestList(res.subData);
	}
}

protocol.produceSocialQuestDirectVisit = function()
{
	var req = {
		'routingId' : 1,
        'opCode' : opcode['UpdateSNSQuestOpen'],
		'accountPk' : ACCOUNTPK,
	}

	return req;
}

protocol.res_produceSocialQuestDirectVisit = function( res ){
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setCurrencyInfo(res.currencyInfo);
}

//추천친구 리스트 얻기
protocol.getSNSQuestSub = function(QUEST_ID) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetSNSQuestSub'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'questID' : QUEST_ID //퀘스트종류' (201:소비, 301:공유)
		}
	}

	return req;
}

protocol.res_getSNSQuestSub = function(res) {
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushSubSocialQuestList(res.imgPath, res.data);
}



//추천친구 바로열기,시작하기 버튼 클릭
//questStep : (1:바로열기, 3:완료하기)
protocol.updateSNSQuestSub = function(questID, accountPK, questStep) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['UpdateSNSQuestSub'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'questID': questID, 		//퀘스트아이디, (201:소비, 301:공유)
			'teamAccountPk': accountPK,  		//추천친구 시퀀스 
			'questStep': questStep     //추천친구 상태변경(1:바로열기, 2:시작하기)
		}
	}

	return req;
}


protocol.res_updateSNSQuestSub = function(res) {

	//재화
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setCurrencyInfo(res.currencyInfo);

	if(res.rowCnt != 0) {
		//"퀘스트아이디","퀘스트진행단계(0~6)","추천친구 시퀀스"
		//res.data[0]; //QuestID
		//res.data[1]; //QuestStep
		//res.data[2]; //accountPk
		G.dataManager.getUsrMgr(DEF_IDENTITY_ME).updateSocialQuestList(res.data);

	} 
	
	if(res.subRowCnt != 0) {

		//퀘스트아이디, 추천친구 상태(0:미오픈, 1:오픈, 2:조건완료, 3:완료),"추천친구 시퀀스
		//res.subData[0]; //questID
		//res.subData[1]; //questStep
		//res.subData[2]; //accountPk

		G.dataManager.getUsrMgr(DEF_IDENTITY_ME).updateSubSocialQuestList(res.subData);
	}

}


//추천친구 리스트 초기화
protocol.resetSNSQuestSub = function(questID) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['ResetSNSQuestSub'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'questID': questID 		//퀘스트아이디, 
		}
	}

	return req;
}


protocol.res_resetSNSQuestSub = function(res) {
	//재화
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setCurrencyInfo(res.currencyInfo);

	if(res.rowCnt <= 0) return;

	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushSubSocialQuestList(res.imgPath, res.data);
}



//<------------------------------------------------------------------------------------------------------------>//
//우편함 리스트 요청
protocol.mailLoad = function() {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['MailLoad'],
		'accountPk' : ACCOUNTPK,
	}

	return req;
}

//우편함받기
protocol.mailRead = function(mailSeq) {
	// var req = {
	// 	'routingId' : 1,
    //     'opCode' : opcode['SNSQuestSubUpdate'],
	// 	'accountPk' : ACCOUNTPK,
	// 	'param' : {
	// 		'MAIL_SEQ': mailSeq, 		//퀘스트종류, 
	// 	}
	// }

	//return req;
}

//<------------------------------------------------------------------------------------------------------------>//
//친구네집에 놀러가기
protocol.getRoomMapFriend = function(friendPK) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetRoomMapFriend'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'friendAccountPk': friendPK 		//친구어카운트PK, 
		}
	}

	return req;
}

protocol.res_getRoomMapFriend = function(res) {

	if(res.rowCnt <=0) return;
	
	FMapManager.getInstance().MapSequence = res.data[0][0];
	G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).setRoomType(res.data[0][1]);
	// var Map = JSON.parse(res.data[0][3]);
	
	// Map.forEach(function(room){
	// 	FMapManager.getInstance().setRoomMap(room[0], room[1], room[2], room[3], null);
	// });

	// FMapManager.getInstance().makeWallMap();
}


protocol.getObjectMapFriend = function(friendPK) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetObjectMapFriend'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'friendAccountPk': friendPK 		//친구어카운트PK, 
		}
	}

	return req;
}

protocol.res_getObjectMapFriend = function(res) {
	
	if(res.rowCnt <= 0 ) return;

	res.data.forEach(function(d){
		var obj = {
			'OBJ_MAP_SEQ' 	: d[0],
			'SECTOR_IDX'	: d[1],
			'CATE_ID'		: d[2],
			'OBJ_ID'		: d[3],
			'TILE_IDX'		: d[4],
			'ROT_DIR'		: d[5],
			'LAYER_IDX'		: d[6],
		};
		
		// FMapManager.getInstance().pushObjectMap (obj.OBJ_MAP_SEQ, obj.TILE_IDX, obj.CATE_ID, obj.OBJ_ID, obj.ROT_DIR, obj.LAYER_IDX);

		FObjectManager.getInstance().createRoomObject(obj, DEF_IDENTITY_FRIEND);

	});

	FObjectManager.getInstance().updateActionObjectList();
}

//친구스타컨텐츠목록
protocol.getStarContentsFriend = function(friendPK) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetStarContentsFriend'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'friendAccountPk': friendPK 		//친구어카운트PK, 
		}
	}

	return req;
}

protocol.res_getStarContentsFriend = function(res) {
	
	G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).setStarContentUrl(res.url, res.imgPath, res.vdoPath, res.vdoThumbnailPath);
	
	if(res.rowCnt <=0) return;

	for(var i=0; i<res.rowCnt; i++) {
		//스타컨텐츠시퀀스,스타컨텐츠코드,"대표이미지명",파일타입(1:이미지,2:동영상),오브젝트맵시퀀스,게시물개수
		G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).pushStarContent(res.data[i][0], res.data[i][1], res.data[i][2], res.data[i][3], res.data[i][4], res.data[i][5]);
	}
}

//친구 쇼셜퀘스트 메인정보 얻어오기
protocol.getSNSQuestFriend = function(friendPK) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetSNSQuestFriend'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'friendAccountPk': friendPK 		//친구어카운트PK, 
		}
	}

	return req;
}

protocol.res_getSNSQuestFriend = function(res) {

	if(res.rowCnt <= 0 ) return;

	G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).pushSocialQuestList(res.imgPath, null, res.data);
}

//친구의 옥외추천 얻어오기
protocol.getSuggestFriendVisit = function(friendPK) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetSuggestFriendVisit'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'friendAccountPk': friendPK 		//친구어카운트PK, 
		}
	}

	return req;
}

protocol.res_getSuggestFriendVisit = function(res) {

	if(res.rowCnt <= 0 ) return;

	G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).clearSuggestFriend();

	for(var i=0; i<res.rowCnt; i++) {
		G.dataManager.getUsrMgr(DEF_IDENTITY_FRIEND).pushSuggestFriendVisit(res.data[i][0], res.data[i][1], res.data[i][2], res.data[i][3], res.data[i][4],res.imgPath);
	}
}





//<------------------------------------------------------------------------------------------------------------>//
//옥외추천요청
protocol.getSuggestFriend = function() {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetSuggestFriend'],
		'accountPk' : ACCOUNTPK,
	}

	return req;
}

protocol.res_getSuggestFriend = function(res) {
	
	if(res.rowCnt <=0) {
		Debug.Error('추천친구가 서버에서 오지 않음');
		return;
	}
	
	var f = JSON.parse(res.data[0][0]);

	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).clearSuggestFriend();

	for(var i=0; i<res.rowCnt; i++) {
		G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushSuggestFriend(res.data[i][0], res.data[i][1], res.data[i][2], res.data[i][3], res.data[i][4], res.imgPath);
	}

}

//옥외 추천 세부정보
protocol.getSuggestFriendInfo = function(friendAccountPk) {
	
	var req = {
		'routingId' : 1,
		'opCode' : opcode['GetSuggestFriendInfo'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'friendAccountPk' : friendAccountPk
		}
	}

	return req;
}

protocol.res_getSuggestFriendInfo = function(res, friend) {
	
	if(res.rowCnt <=0) return;

	G.dataManager.getUsrMgr(friend).addSuggestFriendDetail(
									res.friendAccountPk,
									res.friendAccountID,
									res.imgPath, 
									res.imgUrl, 
									res.intro, 
									res.picCnt, 
									res.movCnt, 
									res.palCnt, 
									res.smiCnt, 
									res.semiImg1, 
									res.semiImg2, 
									res.semiImg3,
									res.starContSeq,
									res.vdoThumbnailPath,
									res.semiImgType1,
									res.semiImgType2,
									res.semiImgType3
								);
}


//<------------------------------------------------------------------------------------------------------------>//
//스타컨텐츠목록
protocol.getStarContents = function() {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetStarContents'],
		'accountPk' : ACCOUNTPK,
	}

	return req;
}

protocol.res_getStarContents = function(res) {

	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setStarContentUrl(res.url, res.imgPath, res.vdoPath, res.vdoThumbnailPath);

	if(res.rowCnt <=0) return;

	for(var i=0; i<res.rowCnt; i++) {
		//스타컨텐츠시퀀스,스타컨텐츠코드,"대표이미지명",파일타입(1:이미지,2:동영상),오브젝트맵시퀀스,게시물개수
		G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushStarContent(res.data[i][0], res.data[i][1], res.data[i][2], res.data[i][3], res.data[i][4], res.data[i][5]);
	}
}


//<------------------------------------------------------------------------------------------------------------>//
//마이스타컨텐츠
protocol.getMyStarContents = function() {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetMyStarContents'],
		'accountPk' : ACCOUNTPK,
	}

	return req;
}

protocol.res_getMyStarContents = function(res) {

	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setMyStarContentInfo(res.mySumSmileCnt, res.url, res.imgPath, res.vdoPath, res.vdoThumbnailPath);

	if(res.rowCnt <=0) return;

	for(var i=0; i<res.rowCnt; i++) {
		//스타컨텐츠시퀀스,스타컨텐츠코드,"대표이미지명",파일타입(1:이미지,2:동영상),게시물개수,팔로우수
		G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushMyStarContent(res.data[i][0], res.data[i][1], res.data[i][2], res.data[i][3], res.data[i][4], res.data[i][5]);
	}
}


//<------------------------------------------------------------------------------------------------------------>//
//스타컨텐츠 오브젝트 변경
protocol.moveStarContents = function(starContSeq,objMapSeq,sectorIdx,layerIdx,tileIdx) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['MoveStarContents'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'starContSeq':starContSeq, //스타컨텐츠시퀀스,
			'objMapSeq':objMapSeq, //변경될오브젝트맵시퀀스(검증도해야됨),
			'sectorIdx':sectorIdx, //변경될섹터인데스(검증용),
			'layerIdx':layerIdx, //변경될레이어인덱스(검증용),
			'tileIdx':tileIdx, //변경될타일인덱스(검증용)
		}
	}

	return req;
}


//<------------------------------------------------------------------------------------------------------------>//
//시나리오퀘스트 얻기
protocol.getScenarioList = function() {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetScenarioList'],
		'accountPk' : ACCOUNTPK,
	}

	return req;
}

protocol.res_getScenarioList = function(res) {
	
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).pushScenarioQuest(res.clearCnt, res.mainIdx, res.data, res.subData);
}

//시나리오 퀘스트 수락
protocol.addScenarioEnter = function(seq) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['AddScenarioEnter'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'seq' : seq
		}
	}

	return req;
}

protocol.res_addScenarioEnter = function(res) {
	
	//재화
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setCurrencyInfo(res.currencyInfo);
	
	//시나리오인덱스, 진행단계(1:진행중)
	//data 로 오지 않고 seq, step 값으로 온다고 하여 수정합니다.
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).updateScenarioQuestStep(res.seq, res.step);
}


//시나리오 퀘스트 물품설치
protocol.updateScenarioInstall = function(seq,sectorIdx,in_objList) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['UpdateScenarioInstall'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'seq': seq,				//시나리오인덱스
			'sectorIdx':sectorIdx,  //섹터인덱스,
			'rowCnt':in_objList.length,
			'data':in_objList
		}
	}

	return req;
}

protocol.res_updateScenarioInstall = function(res) 
{
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).updateScenarioQuest( res.lv, res.exp, res.seq, res.step, res.limitTime, res.data, res.clearCnt );
}


//시나리오 퀘스트 클리어
protocol.updateScenarioClear = function(seq) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['UpdateScenarioClear'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'seq': seq				//시나리오인덱스
		}
	}

	return req;
}

protocol.res_updateScenarioClear = function(res) {

}

//시나리오 퀘스트 조기 클리어
protocol.updateScenarioQuickClear = function(seq) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['UpdateScenarioQuickClear'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'seq': seq				//시나리오인덱스
		}
	}

	return req;
}

protocol.res_updateScenarioQuickClear = function(res) {

}


//시나리오 챕터보상받기
protocol.updateChapterScenarioReward = function(seq) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['UpdateChapterScenarioReward'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'seq': seq				//시나리오인덱스
		}
	}

	return req;
}

protocol.res_updateChapterScenarioReward = function(res) {

}

//<------------------------------------------------------------------------------------------------------------>//
//유저 진행 상태 수정
protocol.modUserProgressState = function(state) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['ModUserProgressState'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'progressState': state				//진행상태값
		}
	}

	return req;
}

protocol.res_modUserProgressState = function(res) {
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setProgressState(res.progressState);
}


//<------------------------------------------------------------------------------------------------------------>//
//아바타 생성
protocol.createAvatar = function(avatar, interest) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['CreateAvatar'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'avatarCd' : avatar,
			'interestInfos' : interest
		}
	}

	return req;
}

protocol.res_createAvatar = function(res) {
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setUserAvatar(res.avatarCd, res.interestNm);
}

//<------------------------------------------------------------------------------------------------------------>//
//아바타 수정
protocol.updateAvatar = function(avatar) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['UpdateAvatar'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'avatarCd' : avatar
		}
	}

	return req;
}

protocol.res_updateAvatar = function(res) {
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setAvatar(res.avatarCd);
}




//<------------------------------------------------------------------------------------------------------------>//
//방문친구 사용자 정보
protocol.getUserInfoFriendVisit = function(accountPK) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetUserInfoFriendVisit'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'friendAccountPk': accountPK
		}
	}

	return req;
}


protocol.res_getUserInfoFriendVisit = function(res) {
	
}


//<------------------------------------------------------------------------------------------------------------>//
//상대 사용자 정보
protocol.getTarUserInfo = function(accountPK) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetTarUserInfo'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'toAccountPk': accountPK
		}
	}

	return req;
}


protocol.res_getTarUserInfo = function(res) {
	
}

//<------------------------------------------------------------------------------------------------------------>//
//공유 오브젝트 리스트 얻기
protocol.getShareObjList = function() {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetShareObjList'],
		'accountPk' : ACCOUNTPK
	}

	return req;
}

protocol.res_getShareObjList = function(res) {

	if(res.rowCnt <= 0 ) return;
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setShareObject(res);
}

//공유 오브젝트 세부 정보 얻기
protocol.getShareObjInfo = function(seq) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetShareObjInfo'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'seq' : seq //공유오브젝트 고유인덱스
		}
	}

	return req;
}

protocol.res_getShareObjInfo = function(res) {
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).updateShareObject(res.imgPath, res.data);
}

//공유 오브젝트 등록
protocol.addShareObj = function(fromAccountPk, tile, postSeq, limitTime, msg) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['AddShareObj'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			"fromAccountPk": fromAccountPk, //받는사람시퀸스, 
			"tile":	tile,		 			//타일 인덱스, 
			"limitTime": limitTime,	 		//남은시간, 
			"msg": msg,						//메세지
			"postSeq" : postSeq				//게시물시퀀스
		}
	}

	return req;
}

protocol.res_addShareObj = function(res) {
	
	if(res.rowCnt <= 0 ) return;
	
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setShareObject(res);
}

// 스마일마크 차감 프로토콜 (상품구매 등)
protocol.smileDecrease = function( in_count )
{
	var req = 
	{
		'routingId' : 1,
        'opCode' : opcode['SmileGoodBuy'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'paySmileFree': in_count
		}
	}

	return req;
}

protocol.res_smileDecrease = function( res )
{
	if( res.result == 0 )
		console.log("result");
}


// AI Interaction 프로토콜 영역 시작 //<------------------------------------------------------------------------------------------------------------>//

// 매칭된 상대 리스트와 해야 할 일을 모두 조회하는 패킷입니다.
protocol.getAllInteractionList = function()
{
	var req = 
	{
		'routingId' : 1,
        'opCode' : opcode['GetAllInteractionList'],
		'accountPk' : ACCOUNTPK
	}

	return req;
}

protocol.res_getAllInteractionList = function( in_res )
{
	G.aiButlerManager.initMatchingList();

	for ( var i = 0; i < in_res.PSCnt; ++i )
	{
		var data = in_res.PSData[i];

		var matchingData = new SURVEY_DATA.MATCHING_USER_DETAIL_INFO();
		matchingData.SEQ 		= data[0];
		matchingData.MYSCORE 	= data[1];
		matchingData.SCORE		= data[2];
		matchingData.SURVEYSEQ 	= data[3];
		matchingData.PK			= data[4]; 
		matchingData.IMGURL		= in_res.imgPath + data[5];
		matchingData.LIMITTIME 	= data[6];
		matchingData.ID			= data[7];

		G.aiButlerManager.addUpdateMatchingList( matchingData );	
	}
	for ( var i = 0; i < in_res.DQCnt; ++i )
	{
		var data = in_res.DQData[i];

		var questData = new QUEST_DATA.TODAY_QUEST();
		questData.INDEX = data[0];
		questData.STATE = data[1];
		questData.COUNT = data[2];
		questData.LIMITTIME = data[3];
		questData.TABLEDATA = G.aiButlerManager.getQusetTableData( questData.INDEX );

		G.aiButlerManager.addUpdateTodayQuestData( questData );
	}
}

// 설문조사 리스트를 조회하는 패킷입니다. (미리보기)
protocol.getSurveyList = function( in_surveySeq )
{
	var req = 
	{
		'routingId' : 1,
        'opCode' : opcode['GetPollList'],
		'accountPk' : ACCOUNTPK
	}

	return req;
}

protocol.res_getSurveyList = function( in_res )
{
	G.aiButlerManager.initSurveyPrevList();

	// 랜덤으로 넣기
	var indexList = [ 0, 0, 0 ];
	var total = in_res.PCnt + G.aiButlerManager.todayQuestDataList.length + G.aiButlerManager.matchingInfoDataList.length;

	for ( var i = 0; i < total; ++i )
	{
		var curType = i%3;
		
		switch( curType )
		{
		case 0 :
			{
				if ( indexList[curType] >= in_res.PCnt )
				{
					total++;
					continue;
				}

				var data = in_res.PData[indexList[curType]++];
				var surveyPrevData = new SURVEY_DATA.LIST_PREVIEW_DATA();
				
				surveyPrevData.ID = "집사 안드로이드";
				surveyPrevData.ICON = AIUI_PATH + "Ai_window/A_ai2_icon.png";

				surveyPrevData.SEQ 			= data[0];
				surveyPrevData.FILENAME		= data[1];
				surveyPrevData.STATE    	= data[2];
				surveyPrevData.PREVQUESTION = data[3];
				surveyPrevData.PREVTEXT 	= data[4];
				surveyPrevData.LIMITTIME	= data[5];

				if ( surveyPrevData.STATE >= SURVEY_DATA.SURVEY_STATE.MATCHED )
				{
					surveyPrevData.ICON 		= data[6];
					surveyPrevData.ID 			= data[7];
				}
		
				G.aiButlerManager.addUpdateSurveyPrevDataList( surveyPrevData );
			}
			break;

		case 1 :
			{
				if ( indexList[curType] >= G.aiButlerManager.todayQuestDataList.length )
				{
					total++;
					continue;
				}

				G.aiButlerManager.createTodayQuestPrevListItemUI( G.aiButlerManager.todayQuestDataList[indexList[curType]++] );
			}
			break;

		case 2 :
			{
				if ( indexList[curType] >= G.aiButlerManager.matchingInfoDataList.length )
				{
					total++;
					continue;
				}

				if ( G.aiButlerManager.matchingInfoDataList[indexList[curType]].MYSCORE > 0 )
					G.aiButlerManager.createGiveMeHighScoreUserPrevUI( G.aiButlerManager.matchingInfoDataList[indexList[curType]] );

				indexList[curType]++;
			}
			break;
		}
	}

	return;

	// 받아서 설문 미리보기 리스트에 넣기
	for ( var i = 0; i < in_res.PCnt; ++i )
	{
		var data = in_res.PData[i];
		var surveyPrevData = new SURVEY_DATA.LIST_PREVIEW_DATA();
		surveyPrevData.SEQ 			= data[0];
		surveyPrevData.FILENAME		= data[1];
		surveyPrevData.STATE    	= data[2];
		surveyPrevData.PREVQUESTION = data[3];
		surveyPrevData.PREVTEXT 	= data[4];
		surveyPrevData.LIMITTIME	= data[5];

		G.aiButlerManager.addUpdateSurveyPrevDataList( surveyPrevData );
	}

	// 오늘 할일도 뒤따라 넣기
	for ( var i = 0; i < G.aiButlerManager.todayQuestDataList.length; ++i )
	{
		G.aiButlerManager.createTodayQuestPrevListItemUI( G.aiButlerManager.todayQuestDataList[i] );
	}

	// 나한테 관심있는사람도 넣기
	for ( var i = 0; i < G.aiButlerManager.matchingInfoDataList.length; ++i )
	{
		G.aiButlerManager.createGiveMeHighScoreUserPrevUI( G.aiButlerManager.matchingInfoDataList[i] );
	}
}

/**
 * @description // 설문조사 각 질문에 대한 답변을 서버로 전송하는 패킷입니다.
 * @param {Number} in_surveySeq 	// 서버에서 받은 설문조사 고유값
 * @param {Number} in_questionIndex // 답한 질문 인덱스
 * @param {Number} in_answer 		// 답변값
 */
protocol.surveyAnswer = function( in_surveySeq, in_questionIndex, in_answer )
{
	var req = 
	{
		'routingId' : 1,
        'opCode' : opcode['UpdatePollEnter'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'PSeq' 	: in_surveySeq,
			'POrder' : in_questionIndex,
			'PValue' : in_answer
		}
	}

	return req;
}

protocol.res_surveyAnswer = function( in_res )
{
	G.aiButlerManager.getSurveyPrevData( in_res.PSeq ).STATE = in_res.PState;
}


/**
 * @description // 서버에서 받은 설문조사 시퀀스를 이용해 상세정보를 조회하는 패킷입니다.
 * @param {Number} in_surveySeq 	// 조회할 설문의 시퀀스
 */
protocol.getSurveyDetail = function( in_surveySeq )
{
	var req = 
	{
		'routingId' : 1,
        'opCode' : opcode['GetPollInfo'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'PSeq' : in_surveySeq
		}
	}

	return req;
}

protocol.res_getSurveyDetail = function( in_res )
{
	var surveyDetailInfo = new SURVEY_DATA.LIST_DETAIL_DATA();
	surveyDetailInfo.SEQ = in_res.PSeq;
	surveyDetailInfo.STATE = in_res.PState;
	surveyDetailInfo.SELECTREWARD = in_res.PSelectReward;

	for ( var i = 0; i < in_res.PInfoCnt; ++i )
	{
		var questionAnswerData = { question:in_res.data[i][0], answer:in_res.data[i][1] };
		surveyDetailInfo.ANSWERLIST.push( questionAnswerData );
	}

	G.aiButlerManager.addUpdateSurveyDetailData( surveyDetailInfo );	
	
	surveyDetailInfo.MATCHINGINFO = G.aiButlerManager.addUpdateMatchingList( G.aiButlerManager.convertMatchingInfoFromProtocol( in_res ) );
}


/**
 * @description // 설문의 마지막 질문에 응답한 뒤 설문을 완료했다고 서버에 알려주는 패킷입니다.
 * @param {Number} in_surveySeq 	// 완료할 설문의 시퀀스
 */
protocol.completeSurvey = function( in_surveySeq )
{
	var req = 
	{
		'routingId' : 1,
        'opCode' : opcode['UpdatePollComplete'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'PSeq' : in_surveySeq
		}
	}

	return req;
}

protocol.res_completeSurvey = function( in_res )
{
	var completeSurvey = G.aiButlerManager.getSurveyDetailData( in_res.PSeq );
	completeSurvey.STATE = in_res.PState;
	completeSurvey.MATCHINGINFO = G.aiButlerManager.convertMatchingInfoFromProtocol( in_res );
	G.aiButlerManager.addUpdateMatchingList( completeSurvey.MATCHINGINFO );
}

/**
 * @description // 매칭상대 평가하기 패킷입니다.
 * @param {Number} in_surveySeq 		// 매칭 평가할 대상 설문지
 * @param {Number} in_evaluationScore 	// 평가 점수
 */
protocol.evaluationMatching = function( in_surveySeq, in_evaluationScore )
{
	var req = 
	{
		'routingId' : 1,
        'opCode' : opcode['UpdatePollScore'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'PSeq' : in_surveySeq,
			'PSTarScore' : in_evaluationScore
		}
	}

	return req;
}

protocol.res_evaluationMatching = function( in_res )
{
	var surveyPrevData = G.aiButlerManager.getSurveyPrevData( in_res.PSeq );
	surveyPrevData.STATE = in_res.PState;
	surveyPrevData.DETAILINFO.STATE = in_res.PState;
	surveyPrevData.DETAILINFO.MATCHINGINFO.SCORE = in_res.PSTarScore;
}

/**
 * @description // 설문조사 보상 선택 후 서버에 보상을 요청하는 패킷입니다.
 * @param {*} in_surveySeq 			// 설문의 시퀀스
 * @param {*} in_select 			// 선택한 보상
 */
protocol.getSurveyReward = function( in_surveySeq, in_select )
{
	var req = 
	{
		'routingId' : 1,
        'opCode' : opcode['UpdatePollReward'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'PSeq' : in_surveySeq,
			'select' : in_select
		}
	}

	return req;
}

protocol.res_getSurveyReward = function( in_res )
{
	var surveyPrevData = G.aiButlerManager.getSurveyPrevData( in_res.PSeq );
	surveyPrevData.STATE = in_res.PState;
	surveyPrevData.DETAILINFO.STATE = in_res.PState;
}


/**
 * @description // 호감 매칭상대 UI에서 상대를 눌렀을때 상세정보를 전달받기 위해 요청하는 패킷입니다.
 * @param {} in_matchingSeq  	// 매칭 상대의 시퀀스
 */
protocol.getMatchingDetailInfo = function( in_matchingSeq )
{
	var req = 
	{
		'routingId' : 1,
        'opCode' : opcode['GetPollSuggestInfo'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'PSSeq' : in_matchingSeq,
		}
	}

	return req;
}

protocol.res_getMatchingDetailInfo = function( in_res )
{
	G.aiButlerManager.addUpdateMatchingList( G.aiButlerManager.convertMatchingInfoFromProtocol( in_res ) );
}


protocol.evaluationSuggestMatching = function( in_matchingSeq, in_score )
{
	var req = 
	{
		'routingId' : 1,
        'opCode' : opcode['UpdatePollSuggestScore'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'PSSeq' : in_matchingSeq,
			'PSTarScore' : in_score
		}
	}

	return req;
}

protocol.res_evaluationSuggestMatching = function( in_res )
{
	G.aiButlerManager.addUpdateMatchingList( G.aiButlerManager.convertMatchingInfoFromProtocol( in_res ) );
}



// AI Interaction 프로토콜 영역 끝 //<------------------------------------------------------------------------------------------------------------>//


//<------------------------------------------------------------------------------------------------------------>//

protocol.FpsLog = function(log) {
	
	var req = {
		'routingId' : 98,
        'opCode' : opcode['FpsLog'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'FPSLog' : log
		}
	}

	return req;
}

//<------------------------------------------------------------------------------------------------------------>//
//게스트 로그인 키 생성
protocol.createGuestKey = function(postSeq) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['CreateGuestKey'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'postSeq': postSeq
		}
	}

	return req;
}


protocol.res_createGuestKey = function(res) {
	
}

var CHANNEL_ID = 10000;

//<------------------------------------------------------------------------------------------------------------>//
protocol.enterChannel = function(channel) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['EnterChannel'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'channelId': channel
		}
	}

	return req;
}

protocol.res_enterChannel = function(res) {

	if(res.rowCnt <= 0 ) {
		console.log('channel에 아무도 없음');
		return;
	}

	G.dataManager.dataChannel.setChannelName(res.channelName);
	G.dataManager.dataChannel.setChannelIndex(res.channelIndex);

	for(var i=0; i<res.rowCnt; i++) {
		
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

		G.dataManager.dataChannel.addUser(user);
	}
}


protocol.changeChannel = function(channel,channelIndex) {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['ChangeChannel'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'channelId': channel,
			'channelIndex': channelIndex
		}
	}

	return req;
}

protocol.res_changeChannel = function(res) {

	G.dataManager.dataChannel.setChannelName(res.channelName);
	G.dataManager.dataChannel.setChannelIndex(res.channelIndex);

	G.dataManager.dataChannel.removeAllUser();

	for(var i=0; i<res.rowCnt; i++) {
		
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

		G.dataManager.dataChannel.addUser(user);
	}

}

protocol.exitChannel = function() {
	
	var req = {
		'routingId' : 1,
        'opCode' : opcode['ExitChannel'],
		'accountPk' : ACCOUNTPK
		
	}

	return req;
}

protocol.res_exitChannel = function(res) {

}


protocol.moveLocation = function(tile,data) {

	var req = {
		'routingId' : 1,
        'opCode' : opcode['MoveLocation'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'tileIdx': tile,
			'stringData': JSON.stringify(data)
		}
	}

	return req;
}

protocol.res_moveLocation = function(res) {

}


protocol.sendMessage = function(msgBase64, bWorld) {

	var op = null;

	if(!bWorld) op = opcode['ChatChannel'];
	else op = opcode['ChatWorld'];

	var req = {
		'routingId' : 1,
        'opCode' : op,
		'accountPk' : ACCOUNTPK,
		'param' : {
			'chatMsg': msgBase64
		}
	}

	return req;
}

protocol.res_sendMessage = function(res) {

}


protocol.sendWhisper = function(msgBase64, pk) {

	var req = {
		'routingId' : 1,
        'opCode' : opcode['Whisper'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'toAccountPk': pk,
			'chatMsg': msgBase64
		}
	}

	return req;
}

protocol.res_sendMessage = function(res) {

}


//<------------------------------------------------------------------------------------------------------------>//
//비동기프로토콜
protocol.res_notifyConnect = function(res) {
	var type = ["(소셜퀘스트)", "(추천친구)"];
	GUI.alertEffect( { "img":res.imgUrl + res.teamProfilePicNm, "str" : res.teamAccountId + "님이 접속하셨습니다." + type[ parseInt( res.connectType ) - 1] }, true );
}

protocol.res_notifyDisconnect = function(res) {
	var type = ["(소셜퀘스트)", "(추천친구)"];
	GUI.alertEffect( {  "img":res.imgUrl + res.teamProfilePicNm, "str" : res.teamAccountId + "님이 접속 종료하셨습니다." + type[ parseInt( res.disConnectType ) - 1] }, true );
}


protocol.res_notifySmileMark = function(res) {
	GUI.getSmileMarkEffect( { "img":res.teamProfileImg, "nick":res.teamAccountId } );
}

protocol.res_notifyPollMatching = function(res)
{
	G.aiButlerManager.onreceiveMatchingComplete( res );
}

protocol.res_notifyPollSuggest = function( res )
{
	G.aiButlerManager.onreceiveMatchingHignScoreGet( res );
}

protocol.res_notifyTodoQuest = function( res )
{
	G.aiButlerManager.onreceiveDailyQuestUpdate( res );
}

//누군가가 나에게 상호 작용을 요청했다.
protocol.res_notifyReqChannelInteraction = function(res) {

	var info = {
		'fromAccountId' : res.fromAccountId,
		'fromAccountPk' : res.fromAccountPk,
		'fromInteractiveSeq' : res.fromInteractiveSeq,
		'fromProfilePicNm' : res.fromProfilePicNm,
		"fromInteractiveLevel" : res.fromInteractiveLevel,
		"fromInteractiveExp" : res.fromInteractiveExp,
		'interactiveId' : res.interactiveId,
		'interactiveSeq' : res.interactiveSeq,
		'limitTime' : res.limitTime,
	};

	G.dataManager.dataChannel.setRequestInteraction(info);

	var scene = G.sceneMgr.getCurrentScene();

	if(scene) {

		scene.requestInteractionFromFriend();

	}
}

//누군가가 요청한 상호작용을 수락했다.
protocol.notifyAcceptChannelInteraction = function(res) {
	
	var info = {

		"interactiveId" : res.interactiveId,
		"interactiveSeq" : res.interactiveSeq,
		"toAccountId" : res.toAccountId,
		"toAccountPk" : res.toAccountPk,
		"toInteractiveSeq" : res.toInteractiveSeq,
		"toProfilePicNm" : res.toProfilePicNm
	}		

	G.dataManager.dataChannel.setAcceptInteraction(info);

	var scene = G.sceneMgr.getCurrentScene();

	if(scene) {

		scene.acceptInteractionFromFriend();

	}

}

//<------------------------------------------------------------------------------------------------------------>//

protocol.getChannelInteractionInfo = function(pk) {

	var req = {
		'routingId' : 1,
        'opCode' : opcode['GetChannelInteractionInfo'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'toAccountPk': pk
		}
	}

	return req;
}

protocol.res_getChannelInteractionInfo = function(res) {

	var info = {
		'accountPk' : res.toAccountPk,
		'exp' : res.interactiveExp,
		'level' : res.interactiveLevel
	};

	G.dataManager.dataChannel.setInteractionInfo(info);
}


protocol.reqChannelInteraction = function(pk, gender, serverIndex, actionId) {

	var req = {
		'routingId' : 1,
        'opCode' : opcode['ReqChannelInteraction'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'toAccountPk': pk,
			'toGender' : gender,
			'serverIndex': serverIndex,
			'interactiveId': actionId
		}
	}

	return req;
}

protocol.res_reqChannelInteraction = function(res) {

	if(res.result == 95) {

		// sysInfo('이미 신청한 유저입니다.');

	} else {
		
		//res.toAccountPk; //요청받은사람계정Pk,
		//res.interactiveId;//상호작용아이디

	}
}

//상호 작용 수락
protocol.AcceptChannelInteraction = function(pk,serverIndex,actionId) {

	var req = {
		'routingId' : 1,
        'opCode' : opcode['AcceptChannelInteraction'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'fromAccountPk': pk,
			'serverIndex': serverIndex,
			'interactiveId': actionId
		}
	}

	return req;
}

protocol.res_AcceptChannelInteraction = function(res) {

}


//상호 작용
protocol.ActChannelInteraction = function(pk,gender,seq,serverIndex,actionId) {

	var req = {
		'routingId' : 1,
        'opCode' : opcode['ActChannelInteraction'],
		'accountPk' : ACCOUNTPK,
		'param' : {
			'toAccountPk': pk,
			'toGender': gender,
			'toInteractiveSeq': seq,
			'serverIndex': serverIndex,
			'interactiveId': actionId
		}
	}

	return req;
}

protocol.res_actChannelInteraction = function(res) {

}


protocol.notifyActChannelInteraction = function(res) {

	var scene = G.sceneMgr.getCurrentScene();

	if(scene) {

		scene.actInteractionFromFriend(res.interactiveExp,res.interactiveLevel);

	}
	
}


protocol.channelInteractiveStatusInit = function() {
	var req = {
		'routingId' : 1,
        'opCode' : opcode['ChannelInteractiveStatusInit'],
		'accountPk' : ACCOUNTPK,
	}

	return req;
}


//<------------------------------------------------------------------------------------------------------------>//
// protocol.testHttp = function(id, passwd)
// {
// 	//변수생성
// 	var param = {
// 		id: id,
// 		passwd: passwd,
// 		url: SERVER_IP + "/funfactory-1.0/login"
// 	}
	

// 	console.log(JSON.stringify(param));
	
// 	//서버호출
// 	$.post(
// 		param.url,
// 		{
// 			param: JSON.stringify(param)
// 		},
// 		function(callback){
// 			console.log(callback);
// 		},
// 		"json"
// 	);
// }



//<------------------------------------------------------------------------------------------------------------>//
//<------------------------------------------------------------------------------------------------------------>//
//<------------------------------------------------------------------------------------------------------------>//
//<------------------------------------------------------------------------------------------------------------>//
//<------------------------------------------------------------------------------------------------------------>//
protocol.httpLogin = function(id, password) {

	var option = { 
		'param' : {
			'id' : id,
			'passwd' : password
		},
		
		'protocol' : 'login'
	}

	return option;
}


protocol.getBtmUserInfo = function( in_callback ) {
	BTMCall("getBtmUserInfo")
	// 콜백에러체크
	.then(function(rs){
		console.log(rs);
/*
		rs.ACCOUNTID: "poiu"
		rs.GENDER: "2"
		rs.INTRODUCE: "hello"
		rs.PROF_PIC_NM: "profile_78_765976015.png"
		rs.RESULT: 0
		rs.SMILE: 2
*/
		if ( in_callback )
			in_callback( rs );
	})
	 // 에러
	.catch(function(err){
		console.log(err);
	});
}

protocol.getBalance = function(in_callback) {
	BTMCall("getBalance")
	// 콜백에러체크
	.then(function(rs){
		console.log(rs);

		if ( in_callback )
			in_callback( rs );
	})
	 // 에러
	.catch(function(err){
		console.log(err);
	});
}


protocol.smileToBtmTransaction = function(smile, gas, in_callback) {
	
	var option = {'serverindex': SERVERINDEX, 'smile': smile, 'gas': gas};

	BTMCall("smileToBtmTransaction", option)
	// 콜백에러체크
	.then(function(rs){
		console.log(rs);
		if ( in_callback )
			in_callback( rs );
	})
	 // 에러
	.catch(function(err){
		console.log(err);
	});
}


protocol.btmToSmileTransaction = function(smile, gas, in_callback) {
	
	var option = {'serverindex': SERVERINDEX, 'smile': smile, 'gas': gas};

	BTMCall("btmToSmileTransaction", option)
	// 콜백에러체크
	.then(function(rs){
		console.log(rs);
		if ( in_callback )
			in_callback( rs );
	})
	 // 에러
	.catch(function(err){
		console.log(err);
	});
}


protocol.listTransaction = function(in_callback) {
	
	var option = {'serverindex': SERVERINDEX};

	BTMCall("listTransaction", option)
	// 콜백에러체크
	.then(function(rs){
		console.log(rs);
		if ( in_callback )
			in_callback( rs );
	})
	 // 에러
	.catch(function(err){
		console.log(err);
	});
}

protocol.notifyBtmTransaction = function(data) {
	if(data.result) return;
	G.dataManager.getUsrMgr(DEF_IDENTITY_ME).setSmileInfo(data.smile);	
}

function BTMCall(req, param) {

	var deferred = $.Deferred();
	var url = "https://vsnsgame.onlinestory.co.kr/funfactory-1.0/"+req;

	$.ajax({
		crossDomain: true,
		xhrFields: {
		withCredentials: true
		},
		url:url,
		data: {
			param: JSON.stringify(param)
		},
		success:function(data)
		{
			deferred.resolve(data);
		},
		error: function(jqXHR, textStatus, errorThrown)
		{
			console.error(jqXHR);
			console.error(textStatus);
			console.error(errorThrown);
			deferred.reject(textStatus);
		}
	});

	return deferred.promise();
}




