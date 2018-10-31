package common;

import java.io.Serializable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import net.sf.jsefa.csv.annotation.CsvDataType;

@EqualsAndHashCode
@CsvDataType
public class CommonResult implements Serializable {
	private static final long serialVersionUID = 7134223586230L;
	
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
	
	
	@Getter @Setter
	protected Integer PAGE;
	@Getter @Setter
	protected Integer ROWS;
	@Getter @Setter
	protected String  SIDX;
	@Getter @Setter
	protected String  SORD;
	
}
