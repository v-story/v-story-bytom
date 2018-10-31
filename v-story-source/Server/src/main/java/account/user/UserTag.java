package account.user;

import common.CommonResult;
import common.IConstants;
import lombok.Getter;
import lombok.Setter;

public class UserTag extends CommonResult
{
	@Getter @Setter
	private Integer	TAG_CD;
	
	@Getter @Setter
	private String	TAG_NM;
	
//	@Getter @Setter
//	private Integer[] ARR_TAG_CD;
//	@Getter @Setter
//	private String[] ARR_TAG_NM;
	
	
    public boolean isValid(int requireType)
    {
    	 switch (requireType)
    	 {
    	 	case IConstants.INSERT_CHECK 		: return true;
    	 	case IConstants.UPDATE_CHECK 		: return true;
    	 	case IConstants.SELECT_LIST_CHECK 	: return true;
    	 	case IConstants.SELECT_GET_CHECK 	: return true; 
    	 	default	:  return false;		  
    	 }
    }			
}
