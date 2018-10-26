package login;

import java.io.Serializable;

import game.login.CurrencyInfo;
import lombok.Getter;
import lombok.Setter;

public class UserSession implements Serializable {

	private static final long serialVersionUID = 3135586236L;
	@Getter @Setter
    private Integer		ACCOUNTPK;		// 사용자 이름 (아이디)
	@Getter @Setter
	String 				PASSWD;	
	@Getter @Setter
    private String		ID;				// 사용자 이름 (아이디)
	@Getter @Setter
	private Integer 	LV;
	@Getter @Setter
	private Integer 	EXP;
	@Getter @Setter
	String 				PROF_PIC_NM;	
	@Getter @Setter
	private CurrencyInfo CURRENCYINFO;	// 재화 정보
}
