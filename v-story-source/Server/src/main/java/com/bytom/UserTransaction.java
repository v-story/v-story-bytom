package com.bytom;

import java.io.Serializable;

import common.IConstants;
import lombok.Getter;
import lombok.Setter;

public class UserTransaction  implements Serializable{

	static final long serialVersionUID = 4315376236L;
	
	@Getter @Setter
	private Integer SERVERINDEX;   	
	
	@Getter @Setter
    public String TX_ID;
	
	@Getter @Setter
    public Long AMOUNT;	
	
	@Getter @Setter
	public Long	SMILE;
	
	@Getter @Setter
    public Long TOAMOUNT;
	
	@Getter @Setter
    public Integer GAS;		

	
	@Getter @Setter
    public Long TOACCOUNT_ALIAS;
	
	@Getter @Setter
	public Integer STATE;
	
    public boolean isValid(int requireType)
    {
    	 switch (requireType)
    	 {
    	 	case IConstants.SELECT_GET_CHECK 	: { return TX_ID != null;}
//    	 	case IConstants.INSERT_CHECK 		: { return SERVERINDEX != null && SMILEMARK != null && TOAMOUNT != null && GAS != null;}
    	 	case IConstants.INSERT_CHECK 		: { return SERVERINDEX != null && SMILE != null && GAS != null;}
    	 	default	:  return false;		  
    	 }
    }	

	
}
