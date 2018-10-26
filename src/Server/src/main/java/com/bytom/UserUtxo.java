package com.bytom;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

public class UserUtxo extends UserBalance implements Serializable
{
	static final long serialVersionUID = 4714386236L;
	
	@Getter @Setter
	String ACCOUNT_ID;
	
	@Getter @Setter
	String CONTROL_PROGRAM	;
	
	@Getter @Setter
	String PROGRAM_INDEX	;
	
	@Getter @Setter
	String SOURCE_ID	;	
	
	@Getter @Setter
	Integer SOURCE_POSITION	;
	
	@Getter @Setter
	boolean SOURCE_CHANGE	;
	
	
}
