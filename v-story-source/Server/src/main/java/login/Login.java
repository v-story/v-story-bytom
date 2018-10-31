package login;
import common.IConstants;
import common.login.UserInfo;
import game.login.CurrencyInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Data
@EqualsAndHashCode
public class Login extends UserInfo {

	private static final long serialVersionUID = 52812335586236L;
	
	@Getter @Setter
    private String		ID;				// 사용자 이름 (아이디)

	@Getter @Setter
	private String		PASSWD;			// 비밀번호


	@Getter @Setter
	private Long 		REGKEY;	
	
	@Getter @Setter
	protected Integer 	FRIENDACCOUNTPK;	
	
	@Getter @Setter
	private Integer 	GUESTSEQ;	
	
	@Getter @Setter
	private Integer 	AUTHKEY;	

    public boolean isValid(int requireType)
    {
    	 switch (requireType)
    	 {
    	 	//case IConstants.SELECT_GET_CHECK 			: return ID != null && (PASSWD != null || this.getUSER_SEQ() != null); 
    	 	case IConstants.SELECT_GET_CHECK 			: return ID != null && PASSWD != null;
    	 	case IConstants.SELECT_GET_GUEST_CHECK 		: return ID != null; 
    	 	//case IConstants.SELECT_GET_GUEST_CHECK 	: return ACCOUNTPK != null && GUESTSEQ !=null && AUTHKEY !=null; 
    	 	//case IConstants.UPDATE_CHECK 			: return this.getUSER_SEQ() != null && this.getINTRODUCE() !=null && !this.getINTRODUCE().isEmpty(); 
    	 	default	:  return false;		  
    	 }
    }
    
    public boolean chkParamLogin() 		{ return ID != null && PASSWD != null; }
}
