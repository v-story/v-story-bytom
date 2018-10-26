package common;

public class ErrorCode {
	
	
	public enum Type {
	    WALKING, RUNNING, TRACKING, HIKING
	}	
	
	private enum DownloadType {
	    AUDIO(1), VIDEO(2), AUDIO_AND_VIDEO(3);
	   
		private final int value;

	    private DownloadType(int value) {
	        this.value = value;
	    }

	    public int getValue() {
	        return value;
	    }
	    
	}
	
	public enum GameResultCode
	{
		RESULT_OK(0), 									//성공
		MASTER_NOT_REGISTED_HOSTID(1),					//Master Server에 등록되지 않은 서버입니다.
		DIFFRENT_SERVER_VERSION(2),					//서버 버전이 일치하지 않습니다.
		NOT_FOUND_ACCOUNT_INFO(3),						//계정 정보를 찾을 수 없습니다.
		ACCOUNT_CERTIFY_FAIL(4),						//계정 인증에 실패했습니다.
		CANNOT_CONNECT_SERVER(5),						//서버에 정상 접속 상태가 아닙니다.
		NOT_FOUND_GAME_SERVER(6),						//게임 서버 정보를 가져오는데 실패했습니다.
		NOT_FOUND_DB_SERVER(7),						//DB 서버 정보를 가져오는데 실패했습니다.
		DUPLICATE_ACCOUNT_INFO(8),						//같은 이름의 계정이 존재합니다.
		INVALID_LOGIN_JSON_TYPE(9),					//올바른 JSON FORMAT이 아닙니다.
		LOGIN_PARSE_FAIL(10),							//LOGIN PARSE에 실패했습니다.
		DUPLICATE_LOGOUT_TIMEOUT(11),					//중복로그아웃처리 타임아웃입니다.
		CREATE_ACCOUNTPOLL_FAIL(12),					//계정풀 생성에 실패했습니다.
		// DB 관련
		CANNOT_CONNECT_DB(13),							//DB 연결에 실패했습니다.
		CANNOT_OPEN_DB(14),								//DB Connection Open에 실패했습니다.
		PROCEDURE_DB_EXCEPTION(15),						//Procedure 로드에 실패했습니다.
		// 재화 관련 
		NOT_ENOUGH_GOLD(16),							//골드가 부족합니다.
		NOT_ENOUGH_RUBY(17),							//루비가 부족합니다.
		NOT_ENOUGH_STAR(18),							//별이 부족합니다.
		NOT_ENOUGH_HEART(19),							//하트(좋아요)개수가 부족합니다.
		NOT_ENOUGH_SMILE(20),							//SMILE개수 부족합니다.
		NOT_ENOUGH_REFILL_MONEY(21),					//리필 재화가 부족합니다.
		NOT_SET_REFILL_PERIOD(22),						//재화 리필 주기를 설정하지 않았습니다.
		INVALID_CURRENCY_VALUE(23),						//없는 재화 입니다.
		NEED_CURRENCY(24),								//재화가 부족합니다.
		INVALID_CURRENCY_TYPE(25),						//없는 재화 타입니다.
		INVALID_ROOM_TILE_CNT(26),						// 잘못된 룸타일 개수입니다.
		FAIL_MEMORY_ASSIGNMENT(27),						// 메모리 할당에 실패하였습니다.
		CANNOT_COMPLETE_QUEST_FULL_INVEN(28),			// 소지 공간이 부족하여 완료 할 수 없습니다.
		DUPLICATE_CHARACTER_NAME(29),					// 같은 이름의 캐릭터가 존재합니다.
		INVALID_OPCODE(30),								// 선언되지 않은 OPCODE입니다.
		NO_PARAMETER(31),								// 파라메터 변수가 없습니다.
		INVALID_PARSING(32),							// PARSING 오류입니다.
		OBJECT_CATEGORY_SCOPE_OVER(33),					// OBJECT CATEGORY 범주를 넘어섰습니다.
		AlREADY_OPEN_CATEGORY_OBJECT(34),				// 이미 열려 있는 OBJECT CATEGORY 입니다.
		NOT_OWNER_CATEGORY(35),							// 보유하지 않은 CATEGORY 입니다.
		NOT_OWNER_INVENTORY_OBJECT(36),					// 보유하지 않은 OBJECT 입니다.	
		INVALID_TILE_INDEX(37),							// TILE INDEX 정보 오류
		INVALID_OBJECT(38),								// 없는 OBJECT 입니다.	
		NOT_ENOUGH_OBJECT_CNT(39),						//OBJECT 개수가 부족합니다.
		INVALID_PARAMETER(40),							// PARAMETER 오류 입니다.
		SLOT_MAX_SCOPE_OVER(41),						// SLOT MAX 범주를 넘어섰습니다.
		SLOT_ISFULL(42),								// SLOT이 꽉 찼습니다.
		INVALID_COST_ID(43),							// 비용 ID 오류 입니다.
		FAIL_DELETE(44),								// 삭제 실패 했습니다.
		NOT_FOUND_OBJECT_ID(45),						// 찾을 수 없는 오브젝트 아이디 값 입니다.
		NOT_FOUND_MAIL(46),								// 우편을 찾을수가 없다.
		NOT_FOUND_ROOMMAP_INFO(47),						// 찾을 수 없는 룸맵 정보입니다.
		NOT_QUESTSUB_OPEN(48),							// 쇼셜퀘스트 친구추천을 시작하기를 할수없다.
		NOT_QUESTSUB_COMPLATE(49),						// 쇼셜퀘스트 소비,공유 퀘스트를 완료 할수없다.
		NOW_QUEST_ING(50),								// 이미 퀘스트가 진행중입니다
		NOW_QUEST_START(51),							// 이미 퀘스트가 시작되었습니다
		UNRELEASE_OBJECT_LEVEL(52),						// 잠김 해제 레벨 오류
		NOT_FIND_TABLE(53),								// 테이블 정보를 찾을수 없다.
		SNSQUEST_CLEAR_CNT_OVER(54),					// 클리어 최대 회수 초과
		SERVER_LOGIC_ERROR(55),							// 서버 로직 에러
		NOT_MAKE_SNSQUEST(56),							// 쇼셜퀘스트를 생성하지 못하였습니다.
		NOT_SEARCH_SNSQUESTSUB(57),						// 쇼셜퀘스트 추천친구를 찾을수 없습니다.
		NOT_QUESTSUB_RESET(58),							// 쇼셜퀘스트 추천친구 초기화 할 대상들이 없습니다.
		ERROR_INPUT(59),								// 입력값 오류
		NOT_FOUND_FRIEND_ROOM_INFO(60),					// 방문친구 룸정보를 찾을 수 없습니다.
		INVALID_CATEGORY_ID(61),						// 잘못된 CATEGORY ID 입니다.
		ALREADY_EXISTENCE_HOLDCATEGORY(62),				// 이미 보유하고 있는 카테고리 입니다.
		NOT_FOUND_STARCNTENTS(63),						// 스타컨텐츠를 찾을 수 없습니다.
		LEVEL_LACK(64),									// 레벨이 부족합니다.
		CONDITIONS_ARE_NOT_MET(65),						// 조건이 충족되지 않습니다.
		NO_OBJECT_MOVE_FROM(66),						//배치된 곳에 오브젝트가 없습니다.
		NO_OBJECT_MOVE_TO(67),							//배치할 곳에 오브젝트가 없습니다.	
		INVALID_FRIEND_ACCOUNTPK(68),					//방문 친구 ACCOUNTPK 정보가 잘못되었습니다.
		NO_FRIEND_SNSQUEST(69),							//방문 친구 쇼셜퀘스트 정보가 없습니다.
		INVALID_PROGRESS_STATE(70),						// 잘못된 진행 상태 정보 입니다.
		ISCOLLISION_INVALID_VALUE(71),					// 범위에서 벗어나는 변수값들이 정의 되어 있습니다.
		ISCOLLISION_OBJECT(72),							// 현재 인덱스에 오브젝트가 설치되어 있습니다.
		WAITING1(73),									// 대기 상태1
		WAITING2(74),									// 대기 상태2
		WAITING3(75),									// 대기 상태3
		CREATESTARCONTENTS_TIMEOUT(76),					// 스타콘텐츠 생성 타임아웃
		MODSTARCONTENTSPOSTCNT_TIMEOUT(77),				// 스타콘텐츠 갱신 타임아웃
		MODSTARCONTENTSPOSTINFO_TIMEOUT(78),			// 스타콘텐츠 정보 갱신 타임아웃
		UPDATESNSQUEST_TIMEOUT(79),						// 쇼셜퀘스트(생산) 갱신 타임아웃
		UPDATESNSQUESTSUB_TIMEOUT(80),					// 쇼셜퀘스트(소비,공유) 갱신 타임아웃
		DELETE_OBJECTMAP_STARCONTENTS_FAIL(81),			// 스타콘테츠가 삭제 실패. 
		VISIT_SUGGEST_FRIEND_COUNT_LACK(82),			// 친구 방문 추천 친구 개수 보족
		ALREADY_EXIST_STARCNTENTS(83),					// 이미 스타콘텐츠가 존재합니다.
		MODSTARCONTENTSREPRSTIMGNM_TIMEOUT(84),			// 스타콘텐츠 대표이미지 변경 타임아웃
		ALREADY_RECEIVED_REWARD(85),					// 이미 보상을 받았습니다.
		NO_MATCHING(86),								// 매칭이 안되었습니다.
		REDIS_SERVER_NOT_FOUND(87),						// REDIS SERVER가 구동 되어 있지 않습니다.
		CHANNEL_INDEX_EQUAL(88),						// 동일한 채널로 이동을 할수 없습니다.
		CHANNEL_CREATE_FAIL(89),						// 채널 생성 실패
		CHANNEL_ID_NOT_FOUND(90),						// 현재 접속된 채널이 없습니다.
		CHANNEL_EXCEED_MEMBER(91),						// 현재 채널 정원 초과
		CHANNEL_PARTICIPATION_MEMBER(92),				// 현재 채널에 참여한 멤버입니다.
		CHANNEL_NO_MEMBER(93),							// 해당 채널의 멤버가 아닙니다.
		CHANNEL_INTERACTIVE_NOT_FOUND(94),				// 채널 인터렉티브 정보가 없습니다.
		CHANNEL_INTERACTIVE_STATUS(95),					// 채널 상태값 오류 입니다.
		NOT_FOUND_TOACCOUNT_INFO(96),					// 상대방 계정 정보를 찾을 수 없습니다.
		DIFFERENT_CHANNEL_INFO(97),						// 채널 정보가 서로 다릅니다.
		GAME_SERVER_NOT_FOUND(98),						// GAME SERVER가 구동 되어 있지 않습니다.
		ALREADY_IN_USE(99),								// 이미 사용중입니다.
		REGISTER_ALERADY_POINTS(100),					// 이미 점수 등록.
		ALREADY_IN_INTERACTIVE(101),						// 이미 상호작용중입니다.
		CHANNEL_INTERACTIVE_TIMEOUT(102),				// 상호 작용 타임아웃
		CHANNEL_INTERACTIVE_LV_TO_ID_NOT_FOUND(103),		// 해당 아이디에 일치하는 상호 작용 아이디를 찾을 수 없습니다.
		CHANNEL_INTERACTIVE_BASE_NOT_FOUND(104),			// 상호 작용 베이스 정보가 없습니다.
		CHANNEL_INTERACTIVE_LV_BASE_NOT_FOUND(105),		// 상호 작용 레벨 베이스 정보가 없습니다.
		CHANNEL_STATUS_INVALID(106),						// 상호 작용 상태값이 잘못되었습니다.
		
		ID_NOT_FOUOND(107)							,// "죄송합니다.해당사용자를 찾을수 없습니다.";
		ERROR_SESSION(108)							,// "세션 에러입니다.";
		USER_NOT_LOGIN(109)							,// "로그인을 해주세요";
		ERROR_DEL_SESSION(110)						,// "세션 삭제 에러입니다.";
		EXCEPTION(111)								,// "예외발생";
		FILE_OVER_MAX_SIZE(112)						,// "업로드할 파일 크기가 초과 되었습니다 (최대 10M).";
		FILE_NOTFOUND_UPLOADFILE(113)					,// "업로드할 파일을 찾을 수 없습니다.";
		FILE_INVALID_TYPE(114)						,// "파일 타입 오류입니다.";
		NOTFOUND_DATA(115)							,// "데이터를 찾을 수 없습니다.";

		USER_SUCCESS_REG_USER(116)					,// "유저 가입이 완료 되었습니다.";
		USER_SUCCESS_CREATE_USERINTEREST(117)			,// "유저 아바타, 관심분야 정보 생성에 성공 하였습니다.";
		USER_SUCCESS_UPDATE_USERINTEREST(118)			,// "유저 아바타 정보 수정에 성공 하였습니다.";
		USER_ALREADY_EXIST_ID(119)					,// "아이디가 이미 존재합니다.";
		USER_FAIL_REG_USER(120)						,// "유저 가입에 실패 하였습니다. 다시 시도 하세요.";
		USER_FAIL_REG_ID_PASSWD(121)					,// "어카운트 유저 정보 추가에 실패 하였습니다. 다시 시도 하세요.";
		USER_FAIL_REG_SNS_INFO(122)					,// "SNS 유저 정보 추가에 실패 하였습니다. 다시 시도 하세요.";
		USER_FAIL_REG_TAG_INFO(123)					,// "SNS 유저 태그 정보 추가에 실패 하였습니다. 다시 시도 하세요.";
		USER_FAIL_REG_GAMEUSER_INFO(124)				,// "Game 유저 정보 추가에 실패 하였습니다. 다시 시도 하세요.";
		USER_FAIL_REG_GAMEROOM_INFO(125)				,// "Game 방정보 추가에 실패 하였습니다. 다시 시도 하세요.";
		USER_FAIL_REG_GAMEOBJECT_INFO(126)			,// "Game 오브젝트 정보 추가에 실패 하였습니다. 다시 시도 하세요.";
		USER_FAIL_REG_GAMEAVATAR_INFO(127)			,// "Game 아바타 정보 추가에 실패 하였습니다. 다시 시도 하세요.";
		USER_FAIL_REG_SNSINTEREST_INFO(128)			,// "SNS 유저 관심분야 정보 추가에 실패 하였습니다. 다시 시도 하세요.";
		USER_FAIL_INTEREST_CNT_INVALID(129)			,// "관심분야 개수가 맥스를 초과하였습니다.";

		LOGIN_SUCCESS_LOGIN(130)						,// "로그인 되었습니다.";
		LOGIN_FAIL_FROM_SESSIONSERVER(131)			,// "세션 서버로부터 예러 발생";
		LOGIN_FAIL_LOGIN(132)							,// "로그인 실패 하였습니다. 다시 시도 하세요.";
		LOGIN_NOTFOUND_ID(133)						,// "아이디가 존재 하지 않습니다.";

		GUEST_LOGIN_NOTFOUND_ID(134)					,// "아이디가 존재 하지 않습니다.";
		GUEST_LOGIN_AUTH_KEY(135)						,// "인증키가 일치 하지 않습니다.";

		HOME_SUCCESS_REG_COMMENT(136)					,// "댓글 등록이 완료 되었습니다.";
		HOME_SUCCESS_REG_HEART(137)					,// "좋아요 등록이 완료 되었습니다.";
		HOME_SUCCESS_REG_SMILE(138)					,// "스마일 등록이 완료 되었습니다.";
		HOME_SUCCESS_CANCEL_HEART(139)				,// "좋아요 취소가 완료 되었습니다.";
		HOME_NOTFOUND_FRND_ACCOUNTPK(140)				,// "친구 AccountPk를 찾을 수 없습니다.";
		HOME_ALREADY_REG_HEART(141)					,// "좋아요를 이미 등록 하였습니다.";
		HOME_FAIL_REG_COMMENT(142)					,// "댓글 등록에 실패 하였습니다.";
		HOME_FAIL_REG_HEARTHIST(143)					,// "좋아요 등록에 실패 하였습니다.";
		HOME_FAIL_REG_HEARTCNT(144)					,// "Account DB에 좋아요 개수 등록에 실패 하였습니다.";
		HOME_FAIL_REG_POSTWEIGHT(145)					,// "게시물 가중치 등록에 실패 하였습니다.";
		HOME_FAIL_REG_QUESTHIST(146)					,// "소셜 퀘스트 완료 내역 등록에 실패 하였습니다.";
		HOME_FAIL_CANCEL_HEART(147)					,// "좋아요 취소에 실패 하였습니다.";
		HOME_CANNNOT_REG_SELF_SMILE(148)				,// "본인 게시물에 스마일을 등록 할 수 없습니다.";
		HOME_NOTENOUGHT_SMILE(149)					,// "보유 스마일 개수가 충분하지 않습니다.";
		HOME_FAIL_REG_SMILEHIST(150)					,// "스마일 내역 등록에 실패 하였습니다.";
		HOME_FAIL_REG_SMILECNT(151)					,// "AccountDB 스마일 개수 변경에 실패 하였습니다.";
		HOME_NOTFOUND_POST(152)						,// "게시물을 찾을 수 없습니다.";
		HOME_NOTFOUND_USER_INFO(153)					,// "유저 정보를 찾을 수 없습니다.";
		HOME_NOTFOUND_COMMENT(154)					,// "댓글을 찾을 수 없습니다.";
		HOME_NOTFOUND_VIDEO_POST(155)					,// "유저 비디오 게시물을 찾을 수 없습니다.";
		HOME_NOTFOUND_HEART_USER(156)					,// "하트 유저를 찾을 수 없습니다.";
		HOME_NOTFOUND_SMILE_USER(157)					,// "스마일 유저를 찾을 수 없습니다.";

		MP_NOFOUND_SMILE_INFO(158)					,// "스마일 정보를 찾을 수 없습니다.";
		MP_MAX_FIVE_INTEREST(159)						,// "관심분야는 최대 5개까지 선택 할 수 있습니다.";
		MP_FAIL_REG_INTEREST(160)						,// "관심분야 등록에 실패 했습니다.";
		MP_FAIL_REG_USERTAG(161)						,// "유저 태그(ID,명) 등록에 실패 했습니다.";
		MP_NOFOUND_THUMBNAIL(162)						,// "섬네일을 찾을 수 없습니다.";
		MP_NOTFOUND_POST(163)							,// "게시물을 찾을 수 없습니다.";
		MP_NOTFOUND_USER_INFO(164)					,// "유저 정보를 찾을 수 없습니다.";
		MP_NOTFOUND_FOLLOWER(165)						,// "팔로워를 찾을 수 없습니다.";
		MP_NOTFOUND_FOLLOW(166)						,// "팔로우를 찾을 수 없습니다.";
		MP_NOTFOUND_THUMBNAIL(167)					,// "섬네일 정보를 찾을 수 없습니다.";
		MP_DUPLICATE_INTEREST(168)					,// "관심분야가 중복 되었습니다.";

		SEARCH_NOFOUND_FAVORITE_VIDEO(169)			,// "좋아할만한 동영상을 찾지 못했습니다.";
		SEARCH_FAIL_REG_FRND_SEARCHHIST(170)			,// "친구 검색 내역 등록에 실패 하였습니다.";
		SEARCH_FAIL_REG_TAG_SEARCHHIST(171)			,// "태그 검색 내역 등록에 실패 하였습니다.";
		SEARCH_NOTFOUND_TAG(172)						,// "태그를 찾을 수 없습니다.";
		SEARCH_NOTFOUND_POST(173)						,// "게시물을 찾을 수 없습니다.";
		SEARCH_NOTFOUND_USER_INFO(174)				,// "유저 정보를 찾을 수 없습니다.";
		SEARCH_NOTFOUND_RECOMMAND_TAG(175)			,// "추천 태그를 찾을 수 없습니다.";
		SEARCH_NOTFOUND_RECOMMAND_FRND(176)			,// "추천 친구를 찾을 수 없습니다.";
		SEARCH_NOTFOUND_SEARCH(177)					,// "검색 결과를 찾을 수 없습니다.";
		SEARCH_NOTFOUND_POPULAR_POST(178)				,// "인기 게시물을 찾을 수 없습니다.";
		SEARCH_NOTFOUND_RESENT_POST(179)				,// "최신 게시물을 찾을 수 없습니다.";
		SEARCH_NOTFOUND_RESENT_FRND(180)				,// "최신 검색한 친구를 찾을 수 없습니다.";
		SEARCH_NOTFOUND_RESENT_TAG(181)				,// "최신 검색한 태그를 찾을 수 없습니다.";

		SHARE_FAIL_REG_TB_HOME_POST(182)				,// "TB_HOME_POST 테이블 등록에 실패 했습니다.";
		SHARE_FAIL_MOD_TB_COUNTER(183)				,// "TB_COUNTER 테이블 수정에 실패 했습니다.";
		SHARE_FAIL_REG_SNS_QUESTHIST(184)				,// "SNS 퀘스트 내역 등록에 실패 했습니다.";

		STARCONT_SUCCESS_GETSTARCONT_INFO(185)		,// "스타콘텐츠 정보를 얻어 왔습니다.";
		STARCONT_SUCCESS_DEL_POST(186)				,// "스타콘텐츠에서 게시물 삭제를 완료 하였습니다.";
		STARCONT_SUCCESS_GET_STARCONT_USERINFO(187)	,// "스타콘텐츠 유저 정보를 얻어왔습니다.";
		STARCONT_SUCCESS_MOD_STARCONT_OBJINFO(188)	,// "스타콘텐츠 오브젝트 변경이 완료 되었습니다.";
		STARCONT_SUCCESS_CANCEL_FOLLOW(189)			,// "스타콘텐츠 팔로우 취소가 완료 되었습니다.";
		STARCONT_SUCCESS_REG_FOLLOW(190)				,// "스타콘텐츠 팔로우 등록이 완료 되었습니다.";
		STARCONT_SUCCESS_MOD_STARCONT(191)			,// "스타콘텐츠 변경이 완료 되었습니다.";
		STARCONT_SUCCESS_REG_STARCONT(192)			,// "스타콘텐츠 등록이 완료 되었습니다.";
		STARCONT_ALREADY_REG_FOLLOW(193)				,// "스타콘텐츠 팔로우가 이미 등록 되어 있습니다.";
		STARCONT_NOTFOUND_STARCONT(194)				,// "스타콘텐츠를 찾을 수 없습니다.";
		STARCONT_NOTFOUND_CATEGORY(195)				,// "스타콘텐츠 카테고리 정보를 찾을 수 없습니다.";	
		STARCONT_NOTFOUND_REPRST_FILETYPE(196)		,// "스타콘텐츠 대표이미지 명 또는 파일 타입을 찾을 수 없습니다.";
		STARCONT_NOTFOUND_INTEREST(197)				,// "관심분야를 찾을 수 없습니다.";
		STARCONT_NOTFOUND_THUMBNAIL(198)				,// "섬네일 정보를 찾을 수 없습니다.";
		STARCONT_FAIL_TOO_MANY_POST(199)				,// "스타콘텐츠에 2개이상 게시물을 등록 할 수 없습니다.";
		STARCONT_FAIL_ALREADY_EXIST_STAR_CONT(200)	,// "스타콘텐츠가 이미 존재합니다.";
		STARCONT_FAIL_ALREADY_EXIST_POST(201)			,// "게시물이 이미 존재합니다.";
		STARCONT_FAIL_NOT_FOUND_OBJECT_INTHEROOM(202)	,// "마이홈에서 오브젝트를 찾을 수 없습니다.";
		STARCONT_FAIL_NOT_FOUND_PIC_VIDEO(203)		,// "이미지 또는 동영상 파일을 찾을 수 없습니다.";
		STARCONT_FAIL_NOT_FOUND_POST(204)				,// "스타콘텐츠에 등록할 게시물이 없습니다.";
		STARCONT_FAIL_NOT_FOUND_POST_INFO(205)		,// "스타콘텐츠에 등록할 게시물 정보를 찾을 수 없습니다.";
		STARCONT_FAIL_NOT_FOUND_POST_COUNT(206)		,// "스타콘텐츠에 등록할 게시물 개수 정보를 찾을 수 없습니다.";
		STARCONT_FAIL_NOT_FOUND_STAR_CONT(207)		,// "스타콘텐츠를 찾을 수 없습니다.";
		STARCONT_FAIL_NOTFOUND_USER_INFO(208)			,// "스타콘텐츠 유저 정보를 찾을 수 없습니다.";
		STARCONT_FAIL_NOTFOUND_CATE_INFO(209)			,// "스타콘텐츠 카테고리 정보를 찾을 수 없습니다.";
		STARCONT_FAIL_NOTFOUND_FOLLOW_CNT(210)		,// "스타콘텐츠 팔로우 개수 정보를 찾을 수 없습니다.";
		STARCONT_FAIL_NOTFOUND_ACCOUNTPK(211)			,// "스타콘텐츠 AccountPk를 찾을 수 없습니다.";
		STARCONT_FAIL_OUTRANGE_STAR_CONT_CD(212)		,// "스타콘텐츠 코드값의 범위가 잘못 되었습니다.";
		STARCONT_FAIL_REG_STAR_CONT(213)				,// "스타콘텐츠 등록에 실패 했습니다.";
		STARCONT_FAIL_REG_STAR_CONT_COUNT(214)		,// "스타콘텐츠 카운트 정보 등록에 실패 했습니다.";
		STARCONT_FAIL_REG_STAR_CONT_INTEREST(215)		,// "스타콘텐츠 관심분야 등록에 실패 했습니다.";
		STARCONT_FAIL_REG_STAR_CONT_ADDINFO(216)	,// "스타콘텐츠 추가정보 등록에 실패 했습니다.";
		STARCONT_FAIL_REG_STAR_CONT_MAPPING(217)		,// "스타콘텐츠 매핑 정보 등록에 실패했습니다.";
		STARCONT_FAIL_REG_STAR_CONT_EXIST_YN(218)		,// "스타콘텐츠 존재유무 등록에 실패했습니다.";
		STARCONT_FAIL_GET_STARCONT_REPRST_IMG(219)	,// "새로운 대표이미지 정보를 얻지 못했습니다.";
		STARCONT_FAIL_MOD_STARCONT_REPRST_IMG(220)	,// "스타콘텐츠에 대표이미지 변경에 실패 했습니다.";
		STARCONT_FAIL_MOD_STARCONT_EXIST_YN(221)		,// "스타콘텐츠 존재 유무 변경에 실패 하였습니다.";
		STARCONT_FAIL_DEL_STARCONT_POST(222)			,// "스타콘텐츠에서 게시물 정보 삭제에 실패 하였습니다.";
		STARCONT_FAIL_MOD_STARCONT_POST(223)			,// "스타콘텐츠 게시물정보 변경에 실패 하였습니다.";
		STARCONT_FAIL_MOD_STARCONT_OBJINFO(224)		,// "스타콘텐츠에 오브젝트 시퀀스 변경에 실패 했습니다.";
		STARCONT_FAIL_MOD_FOLLOW_CNT(225)				,// "스타콘텐츠 팔로우 개수 변경에 실패 하였습니다.";
		STARCONT_FAIL_CANCEL_FOLLOW(226)				,// "스타콘텐츠 팔로우 해제에 실패 하였습니다.";
		STARCONT_FAIL_REG_FOLLOW(227)					,// "스타콘텐츠 팔로우 등록에 실패 하였습니다.";
		STARCONT_FAIL_MOD_STARCONT(228)				,// "스타콘텐츠 정보 변경에 실패 하였습니다.";
		SERVER_FAIL_SYNC_TO_GAMESERVER(229)			,// "게임서버와 동기화에 실패 했습니다.";	
		SERVER_FAIL_SYNC_TO_SESSIONSERVER(230)		,// "세션서버와 동기화에 실패 했습니다.";
		GUEST_AUTH_ERROR(231)						,// "Guest 계정은 이 페이지에 대한 권한이 없습니다.";
		EXCEPTION_ERROR(232)						,// 처리 예외 발생 
		DB_UPDATE_ERROR(233)						,// DB 갱신 오류 
		ALREADY_OPEN(234)							,// 이미 오픈되어 있습니다.";
		CONDITIONS_NOT_REWARD(235)					,// 보상을 받을수가 없습니다.";
		MAX_GAME_RESULT(236);							//MAX_GAME_RESULT
		
		private final int value;

	    private GameResultCode(int value) {
	        this.value = value;
	    }

	    public int getValue() {
	        return value;
	    }
	    		

	};	

	
	
	
	
}
