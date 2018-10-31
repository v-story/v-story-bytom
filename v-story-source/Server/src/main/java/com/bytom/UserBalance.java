package com.bytom;

import java.io.Serializable;

import common.CommonResult;
import common.IConstants;
import lombok.Getter;
import lombok.Setter;

public class UserBalance extends CommonResult implements Serializable
{
	static final long serialVersionUID = 4715386236L;
	
	@Getter @Setter
	String ASSET_ID ;
	
	@Getter @Setter
	String ASSET_ALIAS;
	
	@Getter @Setter
	Double AMOUNT;
	
	@Getter @Setter
	String ACCOUNT_ALIAS;
	
    public boolean isValid(int requireType)
    {
    	 switch (requireType)
    	 {
    	 	case IConstants.SELECT_GET_CHECK 	: { return ASSET_ALIAS != null;}
    	 	default	:  return false;		  
    	 }
    }		
	
}
