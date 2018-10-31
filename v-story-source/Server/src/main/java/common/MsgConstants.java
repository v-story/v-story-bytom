package common;

public interface MsgConstants {
	public static final String SUCCESS									= "성공.";
	public static final String ERROR_PARAMETER							= "파라메터 오류입니다.";
	public static final String ID_NOT_FOUOND							= "죄송합니다.해당사용자를 찾을수 없습니다.";
	public static final String ERROR_SESSION							= "세션 에러입니다.";
	public static final String USER_NOT_LOGIN							= "로그인을 해주세요";
	public static final String ERROR_DEL_SESSION						= "세션 삭제 에러입니다.";
	public static final String EXCEPTION								= "예외발생";
	public static final String FILE_OVER_MAX_SIZE						= "업로드할 파일 크기가 초과 되었습니다 (최대 10M).";
	public static final String FILE_NOTFOUND_UPLOADFILE					= "업로드할 파일을 찾을 수 없습니다.";
	public static final String FILE_INVALID_TYPE						= "파일 타입 오류입니다.";
	public static final String NOTFOUND_DATA							= "데이터를 찾을 수 없습니다.";

	public static final String USER_SUCCESS_REG_USER					= "유저 가입이 완료 되었습니다.";
	public static final String USER_SUCCESS_CREATE_USERINTEREST			= "유저 아바타, 관심분야 정보 생성에 성공 하였습니다.";
	public static final String USER_SUCCESS_UPDATE_USERINTEREST			= "유저 아바타 정보 수정에 성공 하였습니다.";
	public static final String USER_ALREADY_EXIST_ID					= "아이디가 이미 존재합니다.";
	public static final String USER_FAIL_REG_USER						= "유저 가입에 실패 하였습니다. 다시 시도 하세요.";
	public static final String USER_FAIL_REG_ID_PASSWD					= "어카운트 유저 정보 추가에 실패 하였습니다. 다시 시도 하세요.";
	public static final String USER_FAIL_REG_SNS_INFO					= "SNS 유저 정보 추가에 실패 하였습니다. 다시 시도 하세요.";
	public static final String USER_FAIL_REG_TAG_INFO					= "SNS 유저 태그 정보 추가에 실패 하였습니다. 다시 시도 하세요.";
	public static final String USER_FAIL_REG_GAMEUSER_INFO				= "Game 유저 정보 추가에 실패 하였습니다. 다시 시도 하세요.";
	public static final String USER_FAIL_REG_GAMEROOM_INFO				= "Game 방정보 추가에 실패 하였습니다. 다시 시도 하세요.";
	public static final String USER_FAIL_REG_GAMEOBJECT_INFO			= "Game 오브젝트 정보 추가에 실패 하였습니다. 다시 시도 하세요.";
	public static final String USER_FAIL_REG_GAMEAVATAR_INFO			= "Game 아바타 정보 추가에 실패 하였습니다. 다시 시도 하세요.";
	public static final String USER_FAIL_REG_SNSINTEREST_INFO			= "SNS 유저 관심분야 정보 추가에 실패 하였습니다. 다시 시도 하세요.";
	public static final String USER_FAIL_INTEREST_CNT_INVALID			= "관심분야 개수가 맥스를 초과하였습니다.";

	public static final String LOGIN_SUCCESS_LOGIN						= "로그인 되었습니다.";
	public static final String LOGIN_FAIL_FROM_SESSIONSERVER			= "세션 서버로부터 예러 발생";
	public static final String LOGIN_FAIL_LOGIN							= "로그인 실패 하였습니다. 다시 시도 하세요.";
	public static final String LOGIN_NOTFOUND_ID						= "아이디가 존재 하지 않습니다.";
	
	public static final String GUEST_LOGIN_NOTFOUND_ID					= "아이디가 존재 하지 않습니다.";
	public static final String GUEST_LOGIN_AUTH_KEY						= "인증키가 일치 하지 않습니다.";
	
	public static final String HOME_SUCCESS_REG_COMMENT					= "댓글 등록이 완료 되었습니다.";
	public static final String HOME_SUCCESS_REG_HEART					= "좋아요 등록이 완료 되었습니다.";
	public static final String HOME_SUCCESS_REG_SMILE					= "스마일 등록이 완료 되었습니다.";
	public static final String HOME_SUCCESS_CANCEL_HEART				= "좋아요 취소가 완료 되었습니다.";
	public static final String HOME_NOTFOUND_FRND_ACCOUNTPK				= "친구 AccountPk를 찾을 수 없습니다.";
	public static final String HOME_ALREADY_REG_HEART					= "좋아요를 이미 등록 하였습니다.";
	public static final String HOME_FAIL_REG_COMMENT					= "댓글 등록에 실패 하였습니다.";
	public static final String HOME_FAIL_REG_HEARTHIST					= "좋아요 등록에 실패 하였습니다.";
	public static final String HOME_FAIL_REG_HEARTCNT					= "Account DB에 좋아요 개수 등록에 실패 하였습니다.";
	public static final String HOME_FAIL_REG_POSTWEIGHT					= "게시물 가중치 등록에 실패 하였습니다.";
	public static final String HOME_FAIL_REG_QUESTHIST					= "소셜 퀘스트 완료 내역 등록에 실패 하였습니다.";
	public static final String HOME_FAIL_CANCEL_HEART					= "좋아요 취소에 실패 하였습니다.";
	public static final String HOME_CANNNOT_REG_SELF_SMILE				= "본인 게시물에 스마일을 등록 할 수 없습니다.";
	public static final String HOME_NOTENOUGHT_SMILE					= "보유 스마일 개수가 충분하지 않습니다.";
	public static final String HOME_FAIL_REG_SMILEHIST					= "스마일 내역 등록에 실패 하였습니다.";
	public static final String HOME_FAIL_REG_SMILECNT					= "AccountDB 스마일 개수 변경에 실패 하였습니다.";
	public static final String HOME_NOTFOUND_POST						= "게시물을 찾을 수 없습니다.";
	public static final String HOME_NOTFOUND_USER_INFO					= "유저 정보를 찾을 수 없습니다.";
	public static final String HOME_NOTFOUND_COMMENT					= "댓글을 찾을 수 없습니다.";
	public static final String HOME_NOTFOUND_VIDEO_POST					= "유저 비디오 게시물을 찾을 수 없습니다.";
	public static final String HOME_NOTFOUND_HEART_USER					= "하트 유저를 찾을 수 없습니다.";
	public static final String HOME_NOTFOUND_SMILE_USER					= "스마일 유저를 찾을 수 없습니다.";
	
	public static final String MP_NOFOUND_SMILE_INFO					= "스마일 정보를 찾을 수 없습니다.";
	public static final String MP_MAX_FIVE_INTEREST						= "관심분야는 최대 5개까지 선택 할 수 있습니다.";
	public static final String MP_FAIL_REG_INTEREST						= "관심분야 등록에 실패 했습니다.";
	public static final String MP_FAIL_REG_USERTAG						= "유저 태그(ID,명) 등록에 실패 했습니다.";
	public static final String MP_NOFOUND_THUMBNAIL						= "섬네일을 찾을 수 없습니다.";
	public static final String MP_NOTFOUND_POST							= "게시물을 찾을 수 없습니다.";
	public static final String MP_NOTFOUND_USER_INFO					= "유저 정보를 찾을 수 없습니다.";
	public static final String MP_NOTFOUND_FOLLOWER						= "팔로워를 찾을 수 없습니다.";
	public static final String MP_NOTFOUND_FOLLOW						= "팔로우를 찾을 수 없습니다.";
	public static final String MP_NOTFOUND_THUMBNAIL					= "섬네일 정보를 찾을 수 없습니다.";
	public static final String MP_DUPLICATE_INTEREST					= "관심분야가 중복 되었습니다.";
	
	public static final String SEARCH_NOFOUND_FAVORITE_VIDEO			= "좋아할만한 동영상을 찾지 못했습니다.";
	public static final String SEARCH_FAIL_REG_FRND_SEARCHHIST			= "친구 검색 내역 등록에 실패 하였습니다.";
	public static final String SEARCH_FAIL_REG_TAG_SEARCHHIST			= "태그 검색 내역 등록에 실패 하였습니다.";
	public static final String SEARCH_NOTFOUND_TAG						= "태그를 찾을 수 없습니다.";
	public static final String SEARCH_NOTFOUND_POST						= "게시물을 찾을 수 없습니다.";
	public static final String SEARCH_NOTFOUND_USER_INFO				= "유저 정보를 찾을 수 없습니다.";
	public static final String SEARCH_NOTFOUND_RECOMMAND_TAG			= "추천 태그를 찾을 수 없습니다.";
	public static final String SEARCH_NOTFOUND_RECOMMAND_FRND			= "추천 친구를 찾을 수 없습니다.";
	public static final String SEARCH_NOTFOUND_SEARCH					= "검색 결과를 찾을 수 없습니다.";
	public static final String SEARCH_NOTFOUND_POPULAR_POST				= "인기 게시물을 찾을 수 없습니다.";
	public static final String SEARCH_NOTFOUND_RESENT_POST				= "최신 게시물을 찾을 수 없습니다.";
	public static final String SEARCH_NOTFOUND_RESENT_FRND				= "최신 검색한 친구를 찾을 수 없습니다.";
	public static final String SEARCH_NOTFOUND_RESENT_TAG				= "최신 검색한 태그를 찾을 수 없습니다.";
	
	public static final String SHARE_FAIL_REG_TB_HOME_POST				= "TB_HOME_POST 테이블 등록에 실패 했습니다.";
	public static final String SHARE_FAIL_MOD_TB_COUNTER				= "TB_COUNTER 테이블 수정에 실패 했습니다.";
	public static final String SHARE_FAIL_REG_SNS_QUESTHIST				= "SNS 퀘스트 내역 등록에 실패 했습니다.";
	
	public static final String STARCONT_SUCCESS_GETSTARCONT_INFO		= "스타콘텐츠 정보를 얻어 왔습니다.";
	public static final String STARCONT_SUCCESS_DEL_POST				= "스타콘텐츠에서 게시물 삭제를 완료 하였습니다.";
	public static final String STARCONT_SUCCESS_GET_STARCONT_USERINFO	= "스타콘텐츠 유저 정보를 얻어왔습니다.";
	public static final String STARCONT_SUCCESS_MOD_STARCONT_OBJINFO	= "스타콘텐츠 오브젝트 변경이 완료 되었습니다.";
	public static final String STARCONT_SUCCESS_CANCEL_FOLLOW			= "스타콘텐츠 팔로우 취소가 완료 되었습니다.";
	public static final String STARCONT_SUCCESS_REG_FOLLOW				= "스타콘텐츠 팔로우 등록이 완료 되었습니다.";
	public static final String STARCONT_SUCCESS_MOD_STARCONT			= "스타콘텐츠 변경이 완료 되었습니다.";
	public static final String STARCONT_SUCCESS_REG_STARCONT			= "스타콘텐츠 등록이 완료 되었습니다.";
	public static final String STARCONT_ALREADY_REG_FOLLOW				= "스타콘텐츠 팔로우가 이미 등록 되어 있습니다.";
	public static final String STARCONT_NOTFOUND_STARCONT				= "스타콘텐츠를 찾을 수 없습니다.";
	public static final String STARCONT_NOTFOUND_CATEGORY				= "스타콘텐츠 카테고리 정보를 찾을 수 없습니다.";	
	public static final String STARCONT_NOTFOUND_REPRST_FILETYPE		= "스타콘텐츠 대표이미지 명 또는 파일 타입을 찾을 수 없습니다.";
	public static final String STARCONT_NOTFOUND_INTEREST				= "관심분야를 찾을 수 없습니다.";
	public static final String STARCONT_NOTFOUND_THUMBNAIL				= "섬네일 정보를 찾을 수 없습니다.";
	public static final String STARCONT_FAIL_TOO_MANY_POST				= "스타콘텐츠에 2개이상 게시물을 등록 할 수 없습니다.";
	public static final String STARCONT_FAIL_ALREADY_EXIST_STAR_CONT	= "스타콘텐츠가 이미 존재합니다.";
	public static final String STARCONT_FAIL_ALREADY_EXIST_POST			= "게시물이 이미 존재합니다.";
	public static final String STARCONT_FAIL_NOT_FOUND_OBJECT_INTHEROOM	= "마이홈에서 오브젝트를 찾을 수 없습니다.";
	public static final String STARCONT_FAIL_NOT_FOUND_PIC_VIDEO		= "이미지 또는 동영상 파일을 찾을 수 없습니다.";
	public static final String STARCONT_FAIL_NOT_FOUND_POST				= "스타콘텐츠에 등록할 게시물이 없습니다.";
	public static final String STARCONT_FAIL_NOT_FOUND_POST_INFO		= "스타콘텐츠에 등록할 게시물 정보를 찾을 수 없습니다.";
	public static final String STARCONT_FAIL_NOT_FOUND_POST_COUNT		= "스타콘텐츠에 등록할 게시물 개수 정보를 찾을 수 없습니다.";
	public static final String STARCONT_FAIL_NOT_FOUND_STAR_CONT		= "스타콘텐츠를 찾을 수 없습니다.";
	public static final String STARCONT_FAIL_NOTFOUND_USER_INFO			= "스타콘텐츠 유저 정보를 찾을 수 없습니다.";
	public static final String STARCONT_FAIL_NOTFOUND_CATE_INFO			= "스타콘텐츠 카테고리 정보를 찾을 수 없습니다.";
	public static final String STARCONT_FAIL_NOTFOUND_FOLLOW_CNT		= "스타콘텐츠 팔로우 개수 정보를 찾을 수 없습니다.";
	public static final String STARCONT_FAIL_NOTFOUND_ACCOUNTPK			= "스타콘텐츠 AccountPk를 찾을 수 없습니다.";
	public static final String STARCONT_FAIL_OUTRANGE_STAR_CONT_CD		= "스타콘텐츠 코드값의 범위가 잘못 되었습니다.";
	public static final String STARCONT_FAIL_REG_STAR_CONT				= "스타콘텐츠 등록에 실패 했습니다.";
	public static final String STARCONT_FAIL_REG_STAR_CONT_COUNT		= "스타콘텐츠 카운트 정보 등록에 실패 했습니다.";
	public static final String STARCONT_FAIL_REG_STAR_CONT_INTEREST		= "스타콘텐츠 관심분야 등록에 실패 했습니다.";
	public static final String STARCONT_FAIL_REG_STAR_CONT_ADDINFO		= "스타콘텐츠 추가정보 등록에 실패 했습니다.";
	public static final String STARCONT_FAIL_REG_STAR_CONT_MAPPING		= "스타콘텐츠 매핑 정보 등록에 실패했습니다.";
	public static final String STARCONT_FAIL_REG_STAR_CONT_EXIST_YN		= "스타콘텐츠 존재유무 등록에 실패했습니다.";
	public static final String STARCONT_FAIL_GET_STARCONT_REPRST_IMG	= "새로운 대표이미지 정보를 얻지 못했습니다.";
	public static final String STARCONT_FAIL_MOD_STARCONT_REPRST_IMG	= "스타콘텐츠에 대표이미지 변경에 실패 했습니다.";
	public static final String STARCONT_FAIL_MOD_STARCONT_EXIST_YN		= "스타콘텐츠 존재 유무 변경에 실패 하였습니다.";
	public static final String STARCONT_FAIL_DEL_STARCONT_POST			= "스타콘텐츠에서 게시물 정보 삭제에 실패 하였습니다.";
	public static final String STARCONT_FAIL_MOD_STARCONT_POST			= "스타콘텐츠 게시물정보 변경에 실패 하였습니다.";
	public static final String STARCONT_FAIL_MOD_STARCONT_OBJINFO		= "스타콘텐츠에 오브젝트 시퀀스 변경에 실패 했습니다.";
	public static final String STARCONT_FAIL_MOD_FOLLOW_CNT				= "스타콘텐츠 팔로우 개수 변경에 실패 하였습니다.";
	public static final String STARCONT_FAIL_CANCEL_FOLLOW				= "스타콘텐츠 팔로우 해제에 실패 하였습니다.";
	public static final String STARCONT_FAIL_REG_FOLLOW					= "스타콘텐츠 팔로우 등록에 실패 하였습니다.";
	public static final String STARCONT_FAIL_MOD_STARCONT				= "스타콘텐츠 정보 변경에 실패 하였습니다.";
	
	public static final String SERVER_FAIL_SYNC_TO_GAMESERVER			= "게임서버와 동기화에 실패 했습니다.";	
	public static final String SERVER_FAIL_SYNC_TO_SESSIONSERVER		= "세션서버와 동기화에 실패 했습니다.";
	
	public static final String GUEST_AUTH_ERROR							= "Guest 계정은 이 페이지에 대한 권한이 없습니다.";
	
	public static final String PROCEDURE_DB_EXCEPTION					= "Procedure 로드에 실패했습니다.";
	public static final String SNSQUEST_CLEAR_CNT_OVER					= "클리어 최대 회수 초과 했습니다.";
	public static final String NOT_FIND_TABLE							= "테이블 정보를 찾을수 없다.";
	public static final String CONDITIONS_ARE_NOT_MET					= "조건이 충족되지 않습니다.";
	public static final String NEED_CURRENCY							= "재화가 부족합니다.";
	public static final String ALREADY_OPEN								= "이미 오픈되어 있습니다.";
	public static final String CONDITIONS_NOT_REWARD					= "보상을 받을수가 없습니다.";
}
