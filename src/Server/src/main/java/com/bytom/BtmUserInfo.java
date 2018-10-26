package com.bytom;

import java.io.Serializable;

import common.CommonResult;
import lombok.Getter;
import lombok.Setter;

public class BtmUserInfo extends CommonResult implements Serializable {
	
	static final long serialVersionUID = 48114386236L;
	
	@Getter @Setter
	private String ACCOUNT_ID;

	@Getter @Setter
	private String GENDER;

	@Getter @Setter
	private String INTRODUCE;
	
	@Getter @Setter
	private String PROF_PIC_NM;
	
	@Getter @Setter
	private String BTM_ACCOUNT_ID;
	
	@Getter @Setter
	private Long SMILE;	
	
	@Getter @Setter
	private Double BTM;		
	
	
}
