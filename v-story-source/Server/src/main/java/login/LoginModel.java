package login;

import java.util.HashMap;
import java.util.Map;

import org.sql2o.Connection;
import org.sql2o.Sql2o;

import com.ndoctor.framework.sqlm.SqlManager;
import com.ndoctor.framework.sqlm.SqlManagerFactory;

//import common.ErrorCode.GameResultCode;
import common.IConstants;
import common.MsgConstants;


public class LoginModel {
    private Sql2o accountMysql 		= null;
    private Sql2o snsMysql			= null;		//insert,update,delete 전용
    private Sql2o snsMysqlSelect 	= null;		//select 전용

    public LoginModel(Sql2o accountMysql,Sql2o snsMysql,Sql2o snsMysqlSelect) {
        this.accountMysql 	= accountMysql;
        this.snsMysql 		= snsMysql;
        this.snsMysqlSelect	= snsMysqlSelect;
    }
    
    public Login getUser(Login oLogin){
    	String sqlString = null;
    	try(Connection con_account = accountMysql.open(); 
    			Connection con_sns = snsMysql.open();)
    	{
        	SqlManager sqlManager = SqlManagerFactory.create("login");
			
        	Map<String, Object> mP = new HashMap<String, Object>();
        	int iRt = 0;

        	// ##############################
        	// 아이디 체크
        	// ##############################
        	sqlManager.findSQL("login.idCheck");
        	mP.put("ID", oLogin.getID());
        	sqlManager.setParam(mP);
			sqlString = sqlManager.getSQL();
       		iRt = con_account.createQuery(sqlString).executeScalar(Integer.class);
        	sqlManager.clearQParams();

        	// ##############################
			// 아이디 있으면 로그인 처리
        	// ##############################
       		if (iRt > 0)
       		{
            	sqlManager.findSQL("login.loginCheck");
            	mP.put("ID", oLogin.getID());
            	mP.put("PASSWD", oLogin.getPASSWD());
            	sqlManager.setParam(mP);
    			sqlString = sqlManager.getSQL();
            	oLogin= con_account.createQuery(sqlString).executeAndFetchFirst(Login.class);
            	sqlManager.clearQParams();
            	
            	// 로그인 실패
            	if (oLogin == null)
            	{
            		oLogin = new Login();
            		/*
            		oLogin.setRESULT(IConstants.FAIL);
            		oLogin.setMESSAGE(MsgConstants.LOGIN_FAIL_LOGIN);//"로그인 실패!");
            		*/
            		oLogin.setResult(IConstants.FAIL);
            		oLogin.setMessage(MsgConstants.LOGIN_FAIL_LOGIN);//"로그인 실패!");

            		return oLogin;
            	}
            	else
            	{
                	// 마지막 접속 시간 갱신
                	sqlManager.findSQL("login.modUserLastConnTime_SNS");
                	mP.put("ACCOUNTPK", oLogin.getACCOUNTPK());
                	sqlManager.setParam(mP);
        			sqlString = sqlManager.getSQL();
                	con_sns.createQuery(sqlString).executeUpdate().getResult();
	            	sqlManager.clearQParams();
	            	
	            	/*
                	oLogin.setRESULT(IConstants.SUCCESS);
            		oLogin.setMESSAGE(MsgConstants.SUCCESS);//"Success...");
	            	*/
                	oLogin.setResult(IConstants.SUCCESS);
            		oLogin.setMessage(MsgConstants.SUCCESS);//"Success...");
	            	return oLogin;
            	}
       		}			
        	// ##############################
			// 아이디 없으면 가입
        	// ##############################
       		else
       		{
            	/*
       			oLogin.setRESULT(IConstants.FAIL);
        		oLogin.setMESSAGE(MsgConstants.LOGIN_NOTFOUND_ID);//"Not found Id");
            	*/
       			oLogin.setResult(IConstants.FAIL);
        		oLogin.setMessage(MsgConstants.LOGIN_NOTFOUND_ID);//"Not found Id");

       			return oLogin;
       		}
    	}
    	catch(Exception ex)
    	{
    		ex.printStackTrace();
    		
    		oLogin = new Login();
    		/*
    		oLogin.setRESULT(IConstants.FAIL);
    		oLogin.setMESSAGE(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception : "+e.getMessage());
    		*/
    		oLogin.setResult(IConstants.FAIL);
    		oLogin.setMessage(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception : "+e.getMessage());

    		return oLogin;
    	}
    }
    
    public Login getGametUser(Login oGuestLogin)
    {
    	//게스트 로그인시 인증키가 하나 필요할거 같다.
    	//공유하기 버튼 클릭시 인증키 생성/시간도 필요
    	String sqlString = null;
    	try(
    			Connection con_account 		= accountMysql.open();
    			Connection con_sns_select	= snsMysqlSelect.open();
    		)
    	{
        	SqlManager sqlManager = SqlManagerFactory.create("login");
        	Map<String, Object> mP = new HashMap<String, Object>();
        	sqlManager.findSQL("login.GuestloginCheck");
        	mP.put("GUEST_SEQ", oGuestLogin.getGUESTSEQ());
        	sqlManager.setParam(mP);
			sqlString = sqlManager.getSQL();
			Login guestLogin = con_account.createQuery(sqlString).executeAndFetchFirst(Login.class);
 			sqlManager.clearQParams();
 			System.out.println(guestLogin);
 			// 로그인 실패
 			if (guestLogin == null)
        	{
        		guestLogin = new Login();
        		guestLogin.setResult(IConstants.FAIL);
        		guestLogin.setMessage(MsgConstants.LOGIN_FAIL_LOGIN);//"로그인 실패!");

        		/*
        		guestLogin.setRESULT(IConstants.FAIL);
        		guestLogin.setMESSAGE(MsgConstants.LOGIN_FAIL_LOGIN);//"로그인 실패!");
        		*/
        		return guestLogin;
        	}
        	else
        	{
        		if(guestLogin.getACCOUNTPK()!=oGuestLogin.getACCOUNTPK())
        		{
            		guestLogin = new Login();
            		guestLogin.setResult(IConstants.FAIL);
            		guestLogin.setMessage(MsgConstants.GUEST_LOGIN_NOTFOUND_ID);//"로그인 실패!");
            		return guestLogin;
        		}
        		
        		if(!String.valueOf(guestLogin.getAUTHKEY()).trim().equals(String.valueOf(oGuestLogin.getAUTHKEY()).trim()))
        		{
            		guestLogin = new Login();
            		guestLogin.setResult(IConstants.FAIL);
            		guestLogin.setMessage(MsgConstants.GUEST_LOGIN_AUTH_KEY);//"로그인 실패!");
            		return guestLogin;
        		}
        		
        		//추가
        		sqlManager.findSQL("login.UserSession_SNS");
            	mP.put("ACCOUNTPK", guestLogin.getACCOUNTPK());
            	sqlManager.setParam(mP);
    			sqlString = sqlManager.getSQL();
    			Login tmpLogin = con_sns_select.createQuery(sqlString).executeAndFetchFirst(Login.class);
            	sqlManager.clearQParams();
            	guestLogin.setID(tmpLogin.getID());
            	guestLogin.setPROF_PIC_NM(tmpLogin.getPROF_PIC_NM());
        		
        		
        		guestLogin.setResult(IConstants.SUCCESS);
        		guestLogin.setMessage(MsgConstants.SUCCESS);//"Success...");
            	return guestLogin;
        	}
        }
    	catch(Exception ex)
    	{
    		ex.printStackTrace();
    		
    		oGuestLogin = new Login();
    		oGuestLogin.setResult(IConstants.FAIL);
    		oGuestLogin.setMessage(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception : "+e.getMessage());
    		return oGuestLogin;
    	}
    	
    }   
    
    
    public Login getUserWithTransaction(Login oLogin){
    	String sqlString = null;
    	try(Connection con_account 			= accountMysql.beginTransaction(); 
    			Connection con_sns 			= snsMysql.beginTransaction(); 
    			Connection con_sns_select 	= snsMysql.open(); )
    	{
        	SqlManager sqlManager = SqlManagerFactory.create("login");
			
        	Map<String, Object> mP = new HashMap<String, Object>();
        	int iRt = 0;

        	// ##############################
        	// 아이디 체크
        	// ##############################
        	sqlManager.findSQL("login.idCheck");
        	mP.put("ID", oLogin.getID());
        	sqlManager.setParam(mP);
			sqlString = sqlManager.getSQL();
       		iRt = con_account.createQuery(sqlString).executeScalar(Integer.class);
        	sqlManager.clearQParams();

        	// ##############################
			// 아이디 있으면 로그인 처리
        	// ##############################
       		if (iRt > 0)
       		{
            	sqlManager.findSQL("login.loginCheck");
            	mP.put("ID", oLogin.getID());
            	mP.put("PASSWD", oLogin.getPASSWD());
            	sqlManager.setParam(mP);
    			sqlString = sqlManager.getSQL();
            	oLogin= con_account.createQuery(sqlString).executeAndFetchFirst(Login.class);
            	sqlManager.clearQParams();
            	
            	// 로그인 실패
            	if (oLogin == null)
            	{
            		oLogin = new Login();
            		oLogin.setResult(IConstants.FAIL);
            		oLogin.setMessage(MsgConstants.LOGIN_FAIL_LOGIN);//"로그인 실패 했습니다.");
            		return oLogin;            		
            		/*
            		GameResultCode resultCode = GameResultCode.LOGIN_FAIL_LOGIN;
            		oLogin = new Login();
            		oLogin.setResult(resultCode.getValue());
            		return oLogin;
            		*/
            	}
            	else
            	{
            		//2018.01.26 박종훈 추가
            		/*
            		sqlManager.findSQL("login.UserSession_SNS");
                	mP.put("ACCOUNTPK", oLogin.getACCOUNTPK());
                	sqlManager.setParam(mP);
        			sqlString = sqlManager.getSQL();
        			Login tmpLogin = con_sns_select.createQuery(sqlString).executeAndFetchFirst(Login.class);
	            	sqlManager.clearQParams();
	            	oLogin.setID(tmpLogin.getID());
            		oLogin.setPROF_PIC_NM(tmpLogin.getPROF_PIC_NM());
	            	*/
            		// 마지막 접속 시간 갱신
                	sqlManager.findSQL("login.modUserLastConnTime_SNS");
                	mP.put("ACCOUNTPK", oLogin.getACCOUNTPK());
                	sqlManager.setParam(mP);
        			sqlString = sqlManager.getSQL();
                	con_sns.createQuery(sqlString).executeUpdate().getResult();
	            	sqlManager.clearQParams();
	            	oLogin.setPASSWD(oLogin.getPASSWD());	
                	oLogin.setResult(IConstants.SUCCESS);
            		//oLogin.setMESSAGE(MsgConstants.LOGIN_SUCCESS_LOGIN);//"정상적으로 로그인 되었습니다.");
            		con_account.commit();
            		con_sns.commit();
            		//con_game.commit();
            		
	            	return oLogin;
            	}
       		}			
        	// ##############################
			// 아이디 없으면 가입
        	// ##############################
       		else
       		{
       			/*
       			GameResultCode resultCode = GameResultCode.LOGIN_NOTFOUND_ID;
       			oLogin.setResult(resultCode.getValue());
            	return oLogin;
            	*/
            	oLogin.setResult(IConstants.FAIL);
        		oLogin.setMessage(MsgConstants.LOGIN_NOTFOUND_ID);//"아이디가 존재하지 않습니다.");
            	return oLogin;       			
       		}
    	}
    	catch(Exception ex)
    	{
    		ex.printStackTrace();
    		oLogin = new Login();
    		oLogin.setResult(IConstants.FAIL);
    		oLogin.setMessage(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception : "+e.getMessage());
    		return oLogin;    	
    		/*
    		GameResultCode resultCode = GameResultCode.EXCEPTION_ERROR;
    		oLogin = new Login();
    		oLogin.setResult(resultCode.getValue());
    		return oLogin;
    		*/
    	}
    }

    public Login getUser4Seq(Login oLogin)
    {
      	String sqlString = null;
      	try(Connection con_account = accountMysql.open())
      	{
          	SqlManager sqlManager = SqlManagerFactory.create("login");
  			
          	Map<String, Object> mP = new HashMap<String, Object>();

			sqlManager.findSQL("login.loginCheck2");
			mP.put("ID", oLogin.getID());
			mP.put("ACCOUNTPK", oLogin.getACCOUNTPK());// getUSER_SEQ());
			sqlManager.setParam(mP);
			sqlString = sqlManager.getSQL();
			oLogin = con_account.createQuery(sqlString).executeAndFetchFirst(Login.class);

			// 로그인 실패
			if (oLogin == null)
			{
				oLogin = new Login();
				oLogin.setResult(IConstants.FAIL);
				oLogin.setMessage(MsgConstants.LOGIN_FAIL_LOGIN);//"로그인 실패!");
				return oLogin;
			}
			else
			{
				oLogin.setResult(IConstants.SUCCESS);
				oLogin.setMessage(MsgConstants.SUCCESS);//"Success...");
				return oLogin;
			}
		}
		catch(Exception ex)
		{
			ex.printStackTrace();
			      		
			oLogin = new Login();
			oLogin.setResult(IConstants.FAIL);
			oLogin.setMessage(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception : "+e.getMessage());
			return oLogin;
		}
    }
    
}
