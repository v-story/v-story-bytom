package common;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import net.sf.jsefa.csv.annotation.CsvField;

public class CommonUser implements Serializable
{
	//@Getter @Setter
	protected Integer  ACCOUNTPK;				//등록자
	public Integer getACCOUNTPK()
	{
		if(ACCOUNTPK == null)
			return USER_SEQ;
		else
			return ACCOUNTPK;
	}
	public void setACCOUNTPK(Integer val)
	{
		ACCOUNTPK = val;
	}

	@Getter @Setter
	protected Integer  USER_SEQ;				//등록자	
	
	@Getter @Setter
	@CsvField(pos = 1,format = {"yyyy-mm-dd H:mm:ss"})
	protected String  REG_TIME;				//등록 시간		

	/*
	@Getter @Setter
	private Integer RESULT;
	@Getter @Setter
	private String MESSAGE;	
	*/
	
	@Getter @Setter
	private Integer result;
	@Getter @Setter
	private String message;	
	
	
}
