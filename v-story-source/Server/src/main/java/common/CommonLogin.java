package common;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

public class CommonLogin implements Serializable {

	private static final long serialVersionUID = 1133858920L;
	
	@Getter @Setter
	private Integer ACCOUNTPK;	
	
	@Getter @Setter
	private Integer RESULT;
	
	@Getter @Setter
	private String MESSAGE;	
}
