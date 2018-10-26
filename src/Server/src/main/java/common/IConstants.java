package common;

public interface IConstants {

	public static final int    	SUCCESS = 0;
    public static final int 	FAIL	= 1;
    public static final int		DEFAULT_PAGE_SIZE = 10;
    
    public static final int		INSERT_CHECK 			= 1;
    public static final int		UPDATE_CHECK 			= 2;
    public static final int		SELECT_LIST_CHECK 		= 3;
    public static final int		SELECT_GET_CHECK 		= 4;
    public static final int		INSERT_CHECK_4CS 		= 5;
    public static final int		SELECT_GET_GUEST_CHECK	= 6;
    public static final int		UPDATE_BATCH			= 7;
    
    public static final String 	USER_SESSION_KEY 	= "USER_SESSION";
    public static final String 	WINDOW_CONTEXT_PATH = "D:/dev/apache-tomcat-9.0.0.M9/";
    public static final String 	LINUX_CONTEXT_PATH 	= "/opt/www/";
    public static final String 	FILE_PATH 			= "D:/server/csweb/mailFile/";	
    
    public static final String 	START_MS 			= " 00:00:00";	
    public static final String 	END_MS 				= " 23:59:59";	
    
    public static final int 	SPC_USER = 0;			//특정 유저
    public static final int 	ALL_USER = 1;			//전체 유저
    public static final int		ONE_USER = 2;			//1인 유저	
    
    public static final int		INSERT_WORK	= 1;
    public static final int		MODIFY_WORK	= 2;
    
    
    public static final String IMAGE				= "image";
    public static final String OCTET_STREAM 		= "video";
    public static final String VIDEO 				= "video";
    public static final String VIDEO_DEFAULT_NM		= "video_default.png";
    public static final String PROFILE_DEFAULT_NM	= "profile_default.png";
    
    public static final Integer IMAGE_TYPE 			= 1;
    public static final Integer VIDEO_TYPE 			= 2;
    public static final Integer YOUTUBE_TYPE		= 3;
    
    
    public static final	int		QUEST_POST			= 1;
    public static final int		QUEST_SHARE			= 2;
    public static final int		QUEST_HEART			= 3;
    
    public static final int		WEIGHT_COMMENT		= 35;
	public static final int		WEIGHT_HEART		= 15;
	public static final int		WEIGHT_SMILE		= 50;
	public static final int		HEAD_PRINT			= 1;
	
	
	public static final int	CURRENCY_STAR			= 1001;
	public static final int	CURRENCY_GOLD			= 1002;
	public static final int	CURRENCY_RUBY			= 1003;
	public static final int	CURRENCY_HEART			= 1004;
	public static final int	CURRENCY_SWEET			= 1005;
	public static final int	CURRENCY_SMILE			= 1006;
	public static final int	CURRENCY_RUBY_FREE		= 1013;
	public static final int	CURRENCY_SMILE_FREE		= 1014;
	
	
	
	
	
	
	public static final String  LOGIN_CONTEXT		= "/auth";
}
