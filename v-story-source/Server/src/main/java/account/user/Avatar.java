package account.user;

import common.CommonResult;
import common.IConstants;
import lombok.Getter;
import lombok.Setter;

public class Avatar extends CommonResult
{
	static final long serialVersionUID = 517235223795586236L;
	
    interface Validable {
        boolean isValid(int requireType);
    }	
    
	@Getter @Setter
	private Integer SERVERINDEX;   
	
	@Getter @Setter
	private Integer ACCOUNTPK;
	
	@Getter @Setter
	private Integer AVATARCD;
	
	@Getter @Setter
	private Integer PARTS;	
	
	@Getter @Setter
	private Integer MAPPING;	
	
	@Getter @Setter
	private String FILENM;	
	
	@Getter @Setter
	private Integer[] INTERESTINFOS;
	
	
    public boolean isInvalid(int requireType)
    {
    	switch (requireType)
    	{
    		//case IConstants.INSERT_CHECK 		: return ACCOUNTPK!=null && ACCOUNTPK!=0 && AVATARCD!=null && AVATARCD!=0 &&  INTERESTINFOS!=null && INTERESTINFOS.length!= 0; 
    		case IConstants.INSERT_CHECK 			: return AVATARCD!=null && AVATARCD!=0 &&  INTERESTINFOS!=null && INTERESTINFOS.length!= 0; 
    		case IConstants.UPDATE_CHECK 			: return ACCOUNTPK!=null && PARTS!=null && MAPPING!=null ; 
    		
    	 	default	:  return false;		  
    	}
    }		
    
}
