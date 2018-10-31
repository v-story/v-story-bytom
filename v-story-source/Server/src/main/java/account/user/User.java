package account.user;

import common.CommonResult;
import common.IConstants;
import lombok.Getter;
import lombok.Setter;

public class User extends CommonResult
{
	
	static final long serialVersionUID = 573522399935586236L;
	
    interface Validable {
        boolean isValid(int requireType);
    }		

	//@Getter @Setter
	//private Integer USER_SEQ;

	@Getter @Setter
	private Integer ACCOUNTPK;
	
	@Getter @Setter
	private Integer NT_ID;
	
	@Getter @Setter
	private String ID;					// 사용자 이름(다른 사용자에게 보여지는 계정)
	
	@Getter @Setter
	private String PASSWD;				// 패스워드
	
	@Getter @Setter
	private String EMAIL;				// 이메일
	
	@Getter @Setter
	private String PHONE;				// 휴대폰 번호
	
	@Getter @Setter
	private String BIRTHYEAR;			// 생년
	
	@Getter @Setter
	private String BIRTHMONTH;			// 생월
	
	@Getter @Setter
	private String BIRTHDAY;			// 생일
	
	@Getter @Setter
	private String	PROF_PIC_PATH;
	
	@Getter @Setter
	private String PROF_PIC_NM;
	
	@Getter @Setter
	private String INTRODUCE;
	
	@Getter @Setter
	private String ACCEPT_TERMS;
	
	@Getter @Setter
	private Integer	GENDER;				// 성별
	
	@Getter @Setter
	private String	USER_NM;
	
	@Getter @Setter
	private String	URL;
	
	@Getter @Setter
	private Integer	AVATAR_CD;
	
	@Getter @Setter
	private Integer[] ARR_TAG_CD; 
	
	@Getter @Setter
	private String[] ARR_TAG_NM;
	
	@Getter @Setter
	private String REG_TIME;
	
	@Getter @Setter
	private String myprofile_url;
	
    @Getter @Setter
    private Integer	SERVERINDEX;
	
    public boolean isInvalid(int requireType)
    {
    	switch (requireType)
    	{
    		case IConstants.INSERT_CHECK 		: return ID == null ||  PASSWD == null || (PHONE == null && EMAIL == null); 
    	 	default	:  return false;		  
    	}
    }		
	
    //public boolean chkParamModMyProfileInfo() 		{ return ACCOUNTPK != null && USER_NM != null && URL != null && INTRODUCE != null && ARR_TAG_CD != null && GENDER != null; }
    public boolean chkParamModMyProfileInfo() 		{ return ACCOUNTPK != null &&  ARR_TAG_CD != null && GENDER != null; }
    public boolean chkParamGetMyProfileInfo() 		{ return ACCOUNTPK != null; }
    public boolean chkParamGetSmileFree4jqGrid() 	{ return ACCOUNTPK != null; }
    public boolean chkParamRegUser() 				{ return ID != null && PASSWD != null && (PHONE!=null || EMAIL!=null) && BIRTHYEAR != null && BIRTHMONTH != null && BIRTHDAY != null && GENDER != null; }
    public boolean chkParamRegAvatarInterest() 		{ return ACCOUNTPK != null && AVATAR_CD != null && ARR_TAG_CD != null; }
}
