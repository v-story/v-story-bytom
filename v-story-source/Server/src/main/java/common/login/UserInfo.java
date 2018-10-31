package common.login;

import common.CommonResult;
import lombok.Getter;
import lombok.Setter;

public class UserInfo extends CommonResult  {

	private static final long serialVersionUID = 533223586230L;

	@Getter @Setter
	private Integer 			ACCOUNTPK;
	
	@Getter @Setter
	private String 				ACCOUNTID;
	
	@Getter @Setter
	private String				USER_NM;	
	
	@Getter @Setter
	private String 				AVATAR_CD;
	
	@Getter @Setter
	private Integer 			GENDER;
	
	@Getter @Setter
	private Integer				EXP;
	
	@Getter @Setter
	private Integer 			LV;	
	
	@Getter @Setter
	private Integer 			ROOM_TYPE;	
	
	@Getter @Setter
	private Integer 			PROGRESS_STATE;	
	
	@Getter @Setter
	private Integer 			SERVER_INDEX;		
	
	@Getter @Setter
	protected String 	URL;	
	
	@Getter @Setter
    private String 		PROF_PIC_PATH;
	
	@Getter @Setter
	String 				PROF_PIC_NM;
	
	@Getter @Setter
	private String 		INTRODUCE;
	
	

}
