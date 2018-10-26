package login;

import static spark.Spark.get;
import static spark.Spark.post;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.List;
import java.util.Random;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
//import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;

import com.ndoctor.framework.config.QProperties;

import common.CommonLogin;
import common.CommonResult;
import common.ErrorCode;
//import common.ErrorCode.GameResultCode;
import common.IConstants;
import common.MsgConstants;
import common.login.UserInfo;
import common.util.HttpConnectionUtil;
import common.util.JsonUtilManager;
import common.util.LoginUtil;
import common.util.StringUtil;
import game.login.CurrencyInfo;
import game.login.GameLoginModel;



//Gerencia todas as rotas e chamadas para o model relacionadas aos customers
//Control  all routes and requests related to customer
public class LoginController {
	private StringUtil stringUtil = StringUtil.getInstance(); 
	//private JsonUtil jsonUtil = new JsonUtil();
	ErrorCode errorCode	= new ErrorCode();
	Logger logger = Logger.getLogger(LoginController.class);
	
	//GameResultCode status = GameResultCode.NOT_FOUND_ACCOUNT_INFO;
	
	
	//private String contextName = "/login";
	private String contextName = "";
	
	private String m_strSessionHttp = "";
	
	public LoginController(final LoginModel loginModel,GameLoginModel gameLoginModel, String strSessionHttp) {
		
		logger.info("LoginController is Call");
		
		m_strSessionHttp = strSessionHttp;
		logger.info("LoginController is Call");
		get("/loginTest", 
				(req, res) -> 
				{
					return "test...loginTest";
				}
		);
		
		get("/login/loginTest", 
				(req, res) -> 
				{
					return "protected test...loginTest";
				}
		);		
		
		get(contextName+"/login", (req, res) -> { return login(req, res, loginModel,gameLoginModel); } );
		post(contextName+"/login", (req, res) -> { return login(req, res, loginModel,gameLoginModel); } );		

		get(contextName+"/login_guest", (req, res) -> { return login_guest(req, res, loginModel,gameLoginModel); } );	
		post(contextName+"/login_guest", (req, res) -> { return login_guest(req, res, loginModel,gameLoginModel); } );		
		
		/*
		get("/:id", (req, res)	-> { String id = req.params(":id");return user_home(req, res,id, loginModel,gameLoginModel); } );
		post("/:id", (req, res) -> { String id = req.params(":id");return user_home(req, res,id, loginModel,gameLoginModel); } );		
		*/

		get(contextName+"/logout", (req, res) -> { return logout(req, res, loginModel); } );
		post(contextName+"/logout", (req, res) -> { return logout(req, res, loginModel); } );		
		
		get(contextName+"/delSession", (req, res) -> { return delSession(req, res, loginModel); } );
		post(contextName+"/delSession", (req, res) -> { return delSession(req, res, loginModel); } );		
		
		get(contextName+"/login_park", (req, res) -> { return login_park(req, res, loginModel,gameLoginModel); } );
		post("/login_park", (req, res) -> { return login_park(req, res, loginModel,gameLoginModel); } );		
		
		get(contextName+"/login_crtjin", (req, res) -> { return login_crtjin(req, res, loginModel); } );
		post(contextName+"/login_crtjin", (req, res) -> { return login_crtjin(req, res, loginModel); } );		
		/*
		get("/login_test", (req, res) -> { return login_test(req, res, loginModel); } );
		post("/login_test", (req, res) -> { return login_test(req, res, loginModel); } );		
		
		get("/login_crtjin", (req, res) -> { return login_crtjin(req, res, loginModel); } );
		post("/login_crtjin", (req, res) -> { return login_crtjin(req, res, loginModel); } );		

		get("/login_guest", (req, res) -> { return login_guest(req, res, loginModel,guestLoginModel); } );	
		post("/login_guest", (req, res) -> { return login_guest(req, res, loginModel,guestLoginModel); } );		

		get("/guest_test", (req, res) -> { return guest_test(req, res, loginModel); } );	
		post("/guest_test", (req, res) -> { return guest_test(req, res, loginModel); } );			

		
		get("/login4Seq", (req, res) -> { return login4Seq(req, res, loginModel); } ); 
		post("/login4Seq", (req, res) -> { return login4Seq(req, res, loginModel); } );		
		
		get("/chkSession", (req, res) -> { return chkSession(req, res, loginModel); } );
		post("/chkSession", (req, res) -> { return chkSession(req, res, loginModel); } );		
		
		get("/delSession", (req, res) -> { return delSession(req, res, loginModel); } );
		post("/delSession", (req, res) -> { return delSession(req, res, loginModel); } );		
		*/
    }
	
	
	public String login(spark.Request req, spark.Response res, LoginModel loginModel,GameLoginModel gameLoginModel)
	{
		//req.session().attribute("test", "sessionTest");
		//req.session().attribute("url", "javatips.net");
		
		Login oLogin = new Login();
		CommonResult commonResult = null;
		String callback = req.params("callback");
		oLogin = (Login)stringUtil.ParamObject(req, oLogin);
		if(null == oLogin || !oLogin.chkParamLogin())
		{
			oLogin = new Login();
			oLogin.setResult(IConstants.FAIL);
			oLogin.setMessage(MsgConstants.ERROR_PARAMETER);//"Parameter Error.");	      
			return JsonUtilManager.getInstance().render(oLogin);			
		}
		try
		{
			String passwd 		= oLogin.getPASSWD();
			Login objLogin 		= loginModel.getUserWithTransaction(oLogin);
			//if (objLogin.getRESULT() == IConstants.SUCCESS)
			if (objLogin.getResult() == IConstants.SUCCESS)
			{
				String strRt = checkSessionServer(objLogin);
				//?�스?�용 ?�시�?
				//String strRt = checkSessionServer_park(objLogin);
				JSONObject jsonObj = new JSONObject(strRt);
				int result = jsonObj.getInt("result");
				if(0!=result)
				{
					oLogin = new Login();
					oLogin.setResult(result);
					oLogin.setMessage(MsgConstants.LOGIN_FAIL_FROM_SESSIONSERVER+"("+result+")");//"result is error by session server.");
					return JsonUtilManager.getInstance().render(oLogin);					
					/*
					GameResultCode resultCode = GameResultCode.LOGIN_FAIL_FROM_SESSIONSERVER;
					commonResult = new CommonResult();
					commonResult.setResult(resultCode.getValue());
					//commonResult.setRESULT(resultCode.getValue());
					return JsonUtilManager.getInstance().render(commonResult);
					*/
				}
				int accountPk = jsonObj.getInt("accountPk");
				long regKey = jsonObj.getLong("regKey");
				System.out.println("["+result+"]["+accountPk+"]["+regKey+"]");
				UserInfo userInfo 			= gameLoginModel.GetUserInfo(accountPk);
				CurrencyInfo  currencyInfo = gameLoginModel.GetCurrencyInfo(accountPk);
				List<Integer>  InterestInfo = gameLoginModel.GetInerestInfo(accountPk);
				int interestCnt	= InterestInfo.size();

				String myprofile_url = "";
				try
				{
					QProperties prop 	= new QProperties();
					myprofile_url 	= prop.getString("com.funfactory.fileupload.myprofile_url");
					
				}
				catch(Exception e)
				{
					e.printStackTrace();
				}					
				
				String picNm = myprofile_url + userInfo.getPROF_PIC_NM();
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("result", IConstants.SUCCESS);
				//jsonObject.put("msg", "?�공?�습?�다.");
				jsonObject.put("ID", userInfo.getACCOUNTID());
				jsonObject.put("ACCOUNTPK", accountPk);
				jsonObject.put("MYPROFILE_URL", myprofile_url);
				jsonObject.put("MYPROFILE_NM", userInfo.getPROF_PIC_NM());
				jsonObject.put("REGKEY", regKey);
				
				//jsonObject.put("NICKNM", userInfo.getACCOUNTID());

				//jsonObject.put("ROWCNT", 1);

				/*
				jsonObject.put("ACCOUNTPK", accountPk);
				jsonObject.put("result", IConstants.SUCCESS);
				jsonObject.put("msg", IConstants.SUCCESS);
				jsonObject.put("ROWCNT", 1);
				*/
				/*
				if(1 == IConstants.HEAD_PRINT)
				{
					JSONArray jsonHeader = new JSONArray();
					jsonHeader.put("REGKEY").put("SERVERINDEX");
					jsonHeader.put("ID").put("AVATARCD").put("GENDER");
					jsonHeader.put("EXP").put("LV").put("LEVELUPREWARDYN");
					jsonHeader.put("ROOMTYPE").put("PROGRESSSTATE").put("PICNM");
					jsonHeader.put("CURRENCYINFO").put("INTERESTNM");
					jsonObject.put("HEADER",jsonHeader);
				}
				*/
				/*
				JSONArray data = new JSONArray();
				JSONArray jsonArray = new JSONArray();
				JSONArray currencyArray = new JSONArray();
				JSONArray interestNm = new JSONArray();
				currencyArray.put(currencyInfo.getSTAR_CNT());
				currencyArray.put(currencyInfo.getGOLD_CNT());
				currencyArray.put(currencyInfo.getHEART_CNT());
				currencyArray.put(currencyInfo.getRUBY_CNT());
				currencyArray.put(currencyInfo.getCOIN_CNT());
				currencyArray.put(currencyInfo.getSMILE_CNT());
				currencyArray.put(currencyInfo.getRUBY_FREE_CNT());
				currencyArray.put(currencyInfo.getSMILE_FREE_CNT());
				for(int i=0;i<interestCnt;i++)
				{
					interestNm.put(InterestInfo.get(i));
				}

				jsonArray.put(regKey).put(userInfo.getSERVER_INDEX());
				jsonArray.put(userInfo.getACCOUNTID()).put(userInfo.getAVATAR_CD()).put(userInfo.getGENDER());
				jsonArray.put(userInfo.getEXP()).put(userInfo.getLV()).put(0);
				jsonArray.put(userInfo.getROOM_TYPE()).put(userInfo.getPROGRESS_STATE()).put(picNm);
				jsonArray.put(currencyArray).put(interestNm);
				data.put(jsonArray);
				jsonObject.put("DATA",data);
				*/
				//jsonArray.put(uerInfo.getSERVER_INDEX())
				/*
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("ACCOUNTPK", accountPk);
				jsonObject.put("RESULT", 0);
				jsonObject.put("REGKEY",regKey);		
				JSONArray currencyArray = new JSONArray();
				jsonObject.put("CURRENCYINFO",currencyArray);		
				jsonObject.put("INTERESTNM",interestNm);	
				jsonObject.put("ID",uerInfo.getACCOUNTID());
				jsonObject.put("AVATARCD",uerInfo.getAVATAR_CD());
				jsonObject.put("GENDER",uerInfo.getGENDER());
				jsonObject.put("EXP",uerInfo.getEXP());
				jsonObject.put("LV",uerInfo.getLV());
				jsonObject.put("LEVELUPREWARDYN",0);							//levelUpRewardYn
				jsonObject.put("ROOMTYPE",uerInfo.getROOM_TYPE());				//progressState
				jsonObject.put("PROGRESSSTATE",uerInfo.getPROGRESS_STATE());	//progressState
				jsonObject.put("PICNM",picNm);
				jsonObject.put("SERVERINDEX",uerInfo.getSERVER_INDEX());		
		    	*/

				
				
				
		    	UserSession userSession = new UserSession();
		    	userSession.setACCOUNTPK(accountPk);
		    	userSession.setID(userInfo.getACCOUNTID());
		    	userSession.setPASSWD(passwd);
		    	userSession.setLV(userInfo.getLV());
		    	userSession.setEXP(userInfo.getEXP());
		    	userSession.setPROF_PIC_NM(picNm);
		    	userSession.setCURRENCYINFO(currencyInfo);
		    	
		    	System.out.println("objLogin.getPASSWD() value is :: " + userSession.getPASSWD());
		    	
		    	//userSession.getCURRENCYINFO()
		    	/*
		    	req.cookies();  
		    	res.cookie("foo", "bar");       
				req.session(true);    
				req.session().attribute("user",userSession);
		    	*/
		    	
		    	//req.session(true);
				//req.session().attribute(IConstants.USER_SESSION_KEY, userSession);	
		    	
		    	//사용예정
		    	System.out.println("-------------------------------------------------------");
		    	System.out.println("req.session().id()::" + req.session().id());
		    	System.out.println("-------------------------------------------------------");

		    	//SesssionEventListener.getInstance().expireDuplicatedSession(accountPk, req.session().id());
		    	
		    	LoginUtil.setUserSession(req, userSession);
		    	
		    	//req.session().id();
		    	
		    	
		    	String json = jsonObject.toString();   	
		    	
		    	
		    	//RedisConnectionManager.getInstance().redisSet(String.valueOf(accountPk),json);
		    	/*
		    	String sessionValue = RedisConnectionManager.getInstance().redisGet(req.session().id());
		    	System.out.println("===============================================================");
		    	System.out.println("sessionValue is ::" + sessionValue);
		    	System.out.println("===============================================================");
		    	*/
		    	//req.session().attribute("user","foo");
		    	//UserSession tmpuserSession = LoginUtil.getUserSession(req);
		    	//req.session().id();
		    	//System.out.println(tmpuserSession);    
                  
		    	return json;
		    	  
		    	
		    	//return json;
			}
			else
			{
				return JsonUtilManager.getInstance().render(objLogin);
			}
			
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			
			/*
			GameResultCode resultCode = GameResultCode.EXCEPTION_ERROR;
			commonResult = new CommonResult();
			commonResult.setResult(resultCode.getValue());
			//commonResult.setRESULT(resultCode.getValue());
			return JsonUtilManager.getInstance().render(commonResult);
			*/
			oLogin = new Login();
			oLogin.setResult(IConstants.FAIL);
			oLogin.setMessage(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception.");
			return JsonUtilManager.getInstance().render(oLogin);
			
		}
	}
	
	public String login_guest(spark.Request req, spark.Response res, LoginModel loginModel,GameLoginModel gameLoginModel)
	{
		//logger.info("login_guest is Call");
		Login oGuestLogin = new Login();
		CommonResult commonResult = null;
		oGuestLogin = (Login)stringUtil.ParamObject(req, oGuestLogin);
		if(null == oGuestLogin || !oGuestLogin.isValid(IConstants.SELECT_GET_GUEST_CHECK))
		{
			oGuestLogin = new Login();
			oGuestLogin.setResult(IConstants.FAIL);
			oGuestLogin.setMessage(MsgConstants.ERROR_PARAMETER);//"Parameter Error.");	      

			/*
			oGuestLogin.setRESULT(IConstants.FAIL);
			oGuestLogin.setMESSAGE(MsgConstants.ERROR_PARAMETER);//"Parameter Error.");	      
			*/
			return JsonUtilManager.getInstance().render(oGuestLogin);
		}
		try
		{
			oGuestLogin 		= loginModel.getGametUser(oGuestLogin);
			//if (oGuestLogin.getRESULT() == IConstants.SUCCESS)
			if (oGuestLogin.getResult() == IConstants.SUCCESS)
			{
				LoginUtil.setUserSession(req, oGuestLogin);
			}
			else
			{
				commonResult = new CommonResult();
				commonResult.setResult(IConstants.FAIL);
				//commonResult.setRESULT(IConstants.FAIL);
				return JsonUtilManager.getInstance().render(commonResult);
			}
			
			Integer accountPk = (Integer)LoginUtil.getAccountPk(req);
			if(null == accountPk)
			{
				oGuestLogin = new Login();
				//oGuestLogin.setRESULT(IConstants.FAIL);
				oGuestLogin.setResult(IConstants.FAIL);
				return JsonUtilManager.getInstance().render(oGuestLogin);
			}	
			
			String localhost = "";
			String myprofile_url = "";
			try
			{
				QProperties prop 	= new QProperties();
				localhost = prop.getString("com.funfactory.localhost");
				myprofile_url 	= prop.getString("com.funfactory.fileupload.myprofile_url");
			}
			catch(Exception e)
			{
				e.printStackTrace();
			}			
			
			
			UserInfo guestUserInfo = gameLoginModel.GetUserInfo(accountPk);
			CurrencyInfo  currencyInfo =  gameLoginModel.GetCurrencyInfo(accountPk);

			String picNm = localhost + myprofile_url + guestUserInfo.getPROF_PIC_NM();
			
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("ACCOUNTPK", accountPk);
			jsonObject.put("RESULT", IConstants.SUCCESS);
			jsonObject.put("ROWCNT", 1);
			if(1 == IConstants.HEAD_PRINT)
			{
				JSONArray jsonHeader = new JSONArray();
				jsonHeader.put("REGKEY").put("SERVERINDEX");
				jsonHeader.put("ID").put("AVATARCD").put("GENDER");
				jsonHeader.put("EXP").put("LV").put("LEVELUPREWARDYN");
				jsonHeader.put("ROOMTYPE").put("PROGRESSSTATE").put("PICNM");
				jsonHeader.put("CURRENCYINFO").put("INTERESTNM");
				jsonObject.put("HEADER",jsonHeader);
			}
			
			JSONArray data = new JSONArray();
			JSONArray jsonArray = new JSONArray();
			JSONArray currencyArray = new JSONArray();
			JSONArray interestNm = new JSONArray();
			currencyArray.put(currencyInfo.getSTAR_CNT());
			currencyArray.put(currencyInfo.getGOLD_CNT());
			currencyArray.put(currencyInfo.getHEART_CNT());
			currencyArray.put(currencyInfo.getRUBY_CNT());
			currencyArray.put(currencyInfo.getCOIN_CNT());
			currencyArray.put(currencyInfo.getSMILE_CNT());
			currencyArray.put(currencyInfo.getRUBY_FREE_CNT());
			currencyArray.put(currencyInfo.getSMILE_FREE_CNT());
			/*
			for(int i=0;i<interestCnt;i++)
			{
				interestNm.put(InterestInfo.get(i));
			}
			*/
			jsonArray.put(0).put(0);
			jsonArray.put(guestUserInfo.getACCOUNTID()).put(guestUserInfo.getAVATAR_CD()).put(guestUserInfo.getGENDER());
			jsonArray.put(guestUserInfo.getEXP()).put(guestUserInfo.getLV()).put(0);
			jsonArray.put(guestUserInfo.getROOM_TYPE()).put(guestUserInfo.getPROGRESS_STATE()).put(picNm);
			jsonArray.put(currencyArray).put(interestNm);
			data.put(jsonArray);
			jsonObject.put("DATA",data);			
			
			/*
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("ACCOUNTPK", accountPk);
			jsonObject.put("OPCODE", 1);
			jsonObject.put("RESULT", 0);
			JSONArray currencyArray = new JSONArray();
			JSONArray interestNm = new JSONArray();
			currencyArray.put(currencyInfo.getSTAR_CNT());
			currencyArray.put(currencyInfo.getGOLD_CNT());
			currencyArray.put(currencyInfo.getHEART_CNT());
			currencyArray.put(currencyInfo.getRUBY_CNT());
			currencyArray.put(currencyInfo.getCOIN_CNT());
			currencyArray.put(currencyInfo.getSMILE_CNT());
			currencyArray.put(currencyInfo.getRUBY_FREE_CNT());
			currencyArray.put(currencyInfo.getSMILE_FREE_CNT());
			jsonObject.put("CURRENCYINFO",currencyArray);		
			jsonObject.put("INTERESTNM",interestNm);	
			jsonObject.put("ID",guestUserInfo.getACCOUNTID());
			jsonObject.put("AVATARCD",guestUserInfo.getAVATAR_CD());
			jsonObject.put("GENDER",guestUserInfo.getGENDER());
			jsonObject.put("EXP",guestUserInfo.getEXP());
			jsonObject.put("LV",guestUserInfo.getLV());
			jsonObject.put("LEVELUPREWARDYN",0);				//levelUpRewardYn
			jsonObject.put("PROGRESSSTATE",1);				//progressState
			jsonObject.put("ROOMTYPE",guestUserInfo.getROOM_TYPE());				//progressState
			jsonObject.put("PICNM",picNm);
			jsonObject.put("SERVERINDEX",1);
			*/
	    	String json = jsonObject.toString();   
			return json;
			
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			commonResult = new CommonResult();
			/*
			commonResult.setRESULT(IConstants.FAIL);
			commonResult.setMESSAGE(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception.");	      
			*/
			commonResult.setResult(IConstants.FAIL);
			commonResult.setMessage(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception.");	      

			return JsonUtilManager.getInstance().render(commonResult);
		}
	}	
	
	
	public String user_home(spark.Request req, spark.Response res,String id, LoginModel loginModel,GameLoginModel gameLoginModel)
	{
		logger.info("user_home id value is::" + id);
		
		Integer accountPk = null;
		CommonLogin commonLogin = LoginUtil.getUserSessionAccountPk(req);
		CommonResult commonResult = null;
		if(commonLogin.getRESULT()==IConstants.FAIL)
		{
			return JsonUtilManager.getInstance().render(commonLogin);
		}
		accountPk = commonLogin.getACCOUNTPK();
		if(null == accountPk)
		{
			return JsonUtilManager.getInstance().render(commonLogin);
		}	
		try
		{
			String myprofile_url = "";
			try
			{
				QProperties prop 	= new QProperties();
				myprofile_url 	= prop.getString("com.funfactory.fileupload.myprofile_url");
			}
			catch(Exception e)
			{
				e.printStackTrace();
				commonResult = new CommonResult();
				commonResult.setResult(IConstants.FAIL);
				commonResult.setMessage(MsgConstants.EXCEPTION+"("+e.getMessage()+")");//"Exception.");

				/*
				commonResult.setRESULT(IConstants.FAIL);
				commonResult.setMESSAGE(MsgConstants.EXCEPTION+"("+e.getMessage()+")");//"Exception.");
				*/
				return JsonUtilManager.getInstance().render(commonResult);				
			}			
			
			UserInfo userInfo = gameLoginModel.GetUserInfo(accountPk);
			CurrencyInfo  currencyInfo =  gameLoginModel.GetCurrencyInfo(accountPk);
			List<Integer>  InterestInfo = gameLoginModel.GetInerestInfo(accountPk);
			int interestCnt	= InterestInfo.size();
			//String picNm = localhost + myprofile_url + guestUserInfo.getPROF_PIC_NM();
			String picNm =  myprofile_url + userInfo.getPROF_PIC_NM();
			
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("ACCOUNTPK", accountPk);
			jsonObject.put("RESULT", IConstants.SUCCESS);
			jsonObject.put("ROWCNT", 1);
			if(1 == IConstants.HEAD_PRINT)
			{
				JSONArray jsonHeader = new JSONArray();
				jsonHeader.put("REGKEY").put("SERVERINDEX");
				jsonHeader.put("ID").put("AVATARCD").put("GENDER");
				jsonHeader.put("EXP").put("LV").put("LEVELUPREWARDYN");
				jsonHeader.put("ROOMTYPE").put("PROGRESSSTATE").put("PICNM");
				jsonHeader.put("CURRENCYINFO").put("INTERESTNM");
				jsonObject.put("HEADER",jsonHeader);
			}
			
			JSONArray data = new JSONArray();
			JSONArray jsonArray = new JSONArray();
			JSONArray currencyArray = new JSONArray();
			JSONArray interestNm = new JSONArray();
			currencyArray.put(currencyInfo.getSTAR_CNT());
			currencyArray.put(currencyInfo.getGOLD_CNT());
			currencyArray.put(currencyInfo.getHEART_CNT());
			currencyArray.put(currencyInfo.getRUBY_CNT());
			currencyArray.put(currencyInfo.getCOIN_CNT());
			currencyArray.put(currencyInfo.getSMILE_CNT());
			currencyArray.put(currencyInfo.getRUBY_FREE_CNT());
			currencyArray.put(currencyInfo.getSMILE_FREE_CNT());
			for(int i=0;i<interestCnt;i++)
			{
				interestNm.put(InterestInfo.get(i));
			}

			jsonArray.put(0).put(0);
			jsonArray.put(userInfo.getACCOUNTID()).put(userInfo.getAVATAR_CD()).put(userInfo.getGENDER());
			jsonArray.put(userInfo.getEXP()).put(userInfo.getLV()).put(0);
			jsonArray.put(userInfo.getROOM_TYPE()).put(userInfo.getPROGRESS_STATE()).put(picNm);
			jsonArray.put(currencyArray).put(interestNm);
			data.put(jsonArray);
			jsonObject.put("DATA",data);			
			
			
			/*
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("ACCOUNTPK", accountPk);
			jsonObject.put("OPCODE", 1);
			jsonObject.put("RESULT", 0);
			JSONArray currencyArray = new JSONArray();
			JSONArray interestNm = new JSONArray();
			currencyArray.put(currencyInfo.getSTAR_CNT());
			currencyArray.put(currencyInfo.getGOLD_CNT());
			currencyArray.put(currencyInfo.getHEART_CNT());
			currencyArray.put(currencyInfo.getRUBY_CNT());
			currencyArray.put(currencyInfo.getCOIN_CNT());
			currencyArray.put(currencyInfo.getSMILE_CNT());
			currencyArray.put(currencyInfo.getRUBY_FREE_CNT());
			currencyArray.put(currencyInfo.getSMILE_FREE_CNT());
			jsonObject.put("CURRENCYINFO",currencyArray);	
			for(int i=0;i<interestCnt;i++)
			{
				interestNm.put(InterestInfo.get(i));
			}			
			jsonObject.put("INTERESTNM",interestNm);	
			jsonObject.put("ID",userInfo.getACCOUNTID());
			jsonObject.put("AVATARCD",userInfo.getAVATAR_CD());
			jsonObject.put("GENDER",userInfo.getGENDER());
			jsonObject.put("EXP",userInfo.getEXP());
			jsonObject.put("LV",userInfo.getLV());
			jsonObject.put("LEVELUPREWARDYN",0);				//levelUpRewardYn
			jsonObject.put("PROGRESSSTATE",userInfo.getPROGRESS_STATE());				//progressState
			jsonObject.put("ROOMTYPE",userInfo.getROOM_TYPE());				//progressState
			jsonObject.put("PICNM",picNm);
			jsonObject.put("SERVERINDEX",userInfo.getSERVER_INDEX());	
			*/
			
	    	String json = jsonObject.toString();   
			return json;
			
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			commonResult = new CommonResult();
			commonResult.setResult(IConstants.FAIL);
			commonResult.setMessage(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception.");	      

			/*
			commonResult.setRESULT(IConstants.FAIL);
			commonResult.setMESSAGE(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception.");	      
			*/
			return JsonUtilManager.getInstance().render(commonResult);
		}
	}		
	
	//중복로그?�시 ?�라가 ?�청?�야??
	public String logout(spark.Request req, spark.Response res, LoginModel loginModel)
	{
		LoginUtil.removeUserSession(req);
		CommonResult commonResult = new CommonResult();
		//commonResult.setRESULT(IConstants.SUCCESS);
		commonResult.setResult(IConstants.SUCCESS);
		return JsonUtilManager.getInstance().render(commonResult);
	}	
	
	public String delSession(spark.Request req, spark.Response res, LoginModel loginModel)
	{
		LoginUtil.removeUserSession(req);
		
		CommonResult commonResult = new CommonResult();
		//commonResult.setRESULT(IConstants.SUCCESS);		
		commonResult.setResult(IConstants.SUCCESS);	
		/*
		Login objLogin = new Login();
		objLogin.setRESULT(IConstants.FAIL);
		objLogin.setMESSAGE(MsgConstants.ERROR_DEL_SESSION);//"delSession");
		*/
		return JsonUtilManager.getInstance().render(commonResult);
	}	
	
	
	public String login_park(spark.Request req, spark.Response res, LoginModel loginModel,GameLoginModel gameLoginModel)
	{
		Login oLogin = new Login();
		CommonResult commonResult = null;
		oLogin = (Login)stringUtil.ParamObject(req, oLogin);
		if(null == oLogin || !oLogin.chkParamLogin())
		{
			commonResult = new CommonResult();
			commonResult.setResult(IConstants.FAIL);
			commonResult.setMessage(MsgConstants.ERROR_PARAMETER);//"Parameter Error.");	      
			/*
			commonResult.setRESULT(IConstants.FAIL);
			commonResult.setMESSAGE(MsgConstants.ERROR_PARAMETER);//"Parameter Error.");	      
			*/
			return JsonUtilManager.getInstance().render(commonResult);
		}
		try
		{
			Login objLogin 		= loginModel.getUserWithTransaction(oLogin);
			//if (objLogin.getRESULT() == IConstants.SUCCESS)
			if (objLogin.getResult() == IConstants.SUCCESS)
			{
				// SessionServer check...
				//String strRt = checkSessionServer(objLogin);
				//?�스?�용 ?�시�?
				String strRt = checkSessionServer_park(objLogin);
				
				JSONObject jsonObj = new JSONObject(strRt);
				int result = jsonObj.getInt("result");
				if(0!=result)
				{
					commonResult = new CommonResult();
					commonResult.setResult(result);
					commonResult.setMessage(MsgConstants.LOGIN_FAIL_FROM_SESSIONSERVER+"("+result+")");//"result is error by session server.");

					/*
					commonResult.setRESULT(result);
					commonResult.setMESSAGE(MsgConstants.LOGIN_FAIL_FROM_SESSIONSERVER+"("+result+")");//"result is error by session server.");
					*/
					return JsonUtilManager.getInstance().render(commonResult);
				}
				int accountPk = jsonObj.getInt("accountPk");
				long regKey = jsonObj.getLong("regKey");
				System.out.println("["+result+"]["+accountPk+"]["+regKey+"]");
				/*
				objLogin.setID(objLogin.getID());
				objLogin.setACCOUNTPK(accountPk);
				objLogin.setREGKEY(regKey);
				*/

				UserInfo uerInfo 			= gameLoginModel.GetUserInfo(accountPk);
				CurrencyInfo  currencyInfo = gameLoginModel.GetCurrencyInfo(accountPk);
				List<Integer>  InterestInfo = gameLoginModel.GetInerestInfo(accountPk);
				int interestCnt	= InterestInfo.size();

				String myprofile_url = "";
				try
				{
					QProperties prop 	= new QProperties();
					myprofile_url 	= prop.getString("com.funfactory.fileupload.myprofile_url");
					
				}
				catch(Exception e)
				{
					e.printStackTrace();
				}					
				
				String picNm = myprofile_url + uerInfo.getPROF_PIC_NM();
				JSONObject jsonObject = new JSONObject();
				jsonObject.put("ACCOUNTPK", accountPk);
				jsonObject.put("OPCODE", 1);
				jsonObject.put("RESULT", 0);
				jsonObject.put("REGKEY",regKey);		
				JSONArray currencyArray = new JSONArray();
				JSONArray interestNm = new JSONArray();
				currencyArray.put(currencyInfo.getSTAR_CNT());
				currencyArray.put(currencyInfo.getGOLD_CNT());
				currencyArray.put(currencyInfo.getHEART_CNT());
				currencyArray.put(currencyInfo.getRUBY_CNT());
				currencyArray.put(currencyInfo.getCOIN_CNT());
				currencyArray.put(currencyInfo.getSMILE_CNT());
				currencyArray.put(currencyInfo.getRUBY_FREE_CNT());
				currencyArray.put(currencyInfo.getSMILE_FREE_CNT());
				jsonObject.put("CURRENCYINFO",currencyArray);		
				for(int i=0;i<interestCnt;i++)
				{
					interestNm.put(InterestInfo.get(i));
				}
				jsonObject.put("INTERESTNM",interestNm);	
				jsonObject.put("ID",uerInfo.getACCOUNTID());
				jsonObject.put("AVATARCD",uerInfo.getAVATAR_CD());
				jsonObject.put("GENDER",uerInfo.getGENDER());
				jsonObject.put("EXP",uerInfo.getEXP());
				jsonObject.put("LV",uerInfo.getLV());
				jsonObject.put("LEVELUPREWARDYN",0);							//levelUpRewardYn
				jsonObject.put("ROOMTYPE",uerInfo.getROOM_TYPE());				//progressState
				jsonObject.put("PROGRESSSTATE",uerInfo.getPROGRESS_STATE());	//progressState
				jsonObject.put("PICNM",picNm);
				jsonObject.put("SERVERINDEX",uerInfo.getSERVER_INDEX());		
		    	String json = jsonObject.toString();   				
		    	
		    	UserSession userSession = new UserSession();
		    	userSession.setACCOUNTPK(accountPk);
		    	userSession.setID(uerInfo.getACCOUNTID());
		    	userSession.setPROF_PIC_NM(picNm);
		    	userSession.setCURRENCYINFO(currencyInfo);
		    	LoginUtil.setUserSession(req, userSession);
				return json;
			}
			else
			{
				return JsonUtilManager.getInstance().render(objLogin);
			}
			
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			commonResult = new CommonResult();
			commonResult.setResult(IConstants.FAIL);
			commonResult.setMessage(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception.");
			/*
			commonResult.setRESULT(IConstants.FAIL);
			commonResult.setMESSAGE(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception.");
			*/
			return JsonUtilManager.getInstance().render(commonResult);
		}

	}	
	
	public String login_crtjin(spark.Request req, spark.Response res, LoginModel loginModel)
	{
		Login oLogin = new Login();
		CommonResult commonResult = null;
		oLogin = (Login)stringUtil.ParamObject(req, oLogin);
		if(null == oLogin || !oLogin.isValid(IConstants.SELECT_GET_CHECK))
		{
			commonResult = new CommonResult();
			/*
			commonResult.setRESULT(IConstants.FAIL);
			commonResult.setMESSAGE(MsgConstants.ERROR_PARAMETER);//"Parameter Error.");	      
			*/
			commonResult.setResult(IConstants.FAIL);
			commonResult.setMessage(MsgConstants.ERROR_PARAMETER);//"Parameter Error.");	      
			return JsonUtilManager.getInstance().render(commonResult);
		}
		
		try
		{
			Login objLogin 		= loginModel.getUser(oLogin);
			
			//if (objLogin.getRESULT() == IConstants.SUCCESS)
			if (objLogin.getResult() == IConstants.SUCCESS)
			{
				// SessionServer check...
				String strRt = checkSessionServer_crtjin(objLogin);
				
				System.out.println(">>>"+strRt);
				
				JSONObject jsonObj = new JSONObject(strRt);
				
				int result = jsonObj.getInt("result");
				int accountPk = jsonObj.getInt("accountPk");
				long regKey = jsonObj.getLong("regKey");
				
				
				System.out.println("["+result+"]["+accountPk+"]["+regKey+"]");
				
				objLogin.setACCOUNTPK(accountPk);
				objLogin.setREGKEY(regKey);
				LoginUtil.setUserSession(req, objLogin);
			}
			return JsonUtilManager.getInstance().render(objLogin);
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			
			commonResult = new CommonResult();
			commonResult.setResult(IConstants.FAIL);
			commonResult.setMessage(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception.");	      

			/*
			commonResult.setRESULT(IConstants.FAIL);
			commonResult.setMESSAGE(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception.");	      
			*/
			return JsonUtilManager.getInstance().render(commonResult);
		}
	}		
	
	
	public String checkSessionServer(Login objLogin)
	{
    	Random generator = new Random();  
    	int regKey = generator.nextInt(1000000000) + 20;      
    	JSONObject jsonObject = new JSONObject();
    	jsonObject.put("accountPk", objLogin.getACCOUNTPK());
    	jsonObject.put("regKey", regKey);   	
    	String rawData = "jsondata = " + jsonObject.toString();
    	System.out.println("###rawData:"+rawData);    	
    	HttpClient httpClient = null;
    	HttpResponse response = null;
    	HttpPost postRequest  = null;	
    	//httpClient = new DefaultHttpClient();
        httpClient  = HttpConnectionUtil.getHttpClient();
    	try {
        	//HttpPost postRequest = new HttpPost("http://192.168.1.151:8086"); // session server (webserver)
        	System.out.println("########### m_strSessionHttp:"+m_strSessionHttp);        	
        	
        	//final RequestConfig params = RequestConfig.custom().setConnectTimeout(3000).setSocketTimeout(3000).build();
        	//httpPost.setConfig(params);
        	
        	
        	//final PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
        	
        	postRequest = new HttpPost(m_strSessionHttp); // session server (webserver)
            RequestConfig requestConfig = RequestConfig.custom()
            		  .setSocketTimeout(5*1000)
            		  .setConnectTimeout(5*1000)
            		  .setConnectionRequestTimeout(5*1000)
            		  .build();
              postRequest.setConfig(requestConfig);        	
        	
        	
            postRequest.setHeader("Content-type", "application/json");
            StringEntity entity = new StringEntity(rawData);

            final RequestConfig params = RequestConfig.custom().setConnectTimeout(10*1000).setSocketTimeout(10*1000).build();
            postRequest.setConfig(params);
            postRequest.setEntity(entity);

            long startTime = System.currentTimeMillis();
            response = httpClient.execute(postRequest);
            long elapsedTime = System.currentTimeMillis() - startTime;
            /*
            StatusLine statusLine = response.getStatusLine();
            // ?�러 발생
         	if (statusLine.getStatusCode() < 200 || statusLine.getStatusCode() >= 300) {
         		throw new Exception(statusLine.getStatusCode(), getReason(response));
         	}
         	*/
            InputStream is = response.getEntity().getContent();
            Reader reader = new InputStreamReader(is);
            BufferedReader bufferedReader = new BufferedReader(reader);
            StringBuilder builder = new StringBuilder();
            while (true) {
                try {
                    String line = bufferedReader.readLine();
                    if (line != null) {
                        builder.append(line);
                    } else {
                        break;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            //System.out.println(builder.toString());
            //System.out.println("****************");
            return builder.toString();
        } catch (Exception ex) {
        	HttpConnectionUtil.abort(postRequest);
        	ex.printStackTrace();
            return null;
        }
    	finally
    	{
    		HttpConnectionUtil.release(response);
    	}
	}

	
	public String checkSessionServer_park(Login objLogin)
	{
    	Random generator = new Random();  
    	int regKey = generator.nextInt(1000000000) + 20;      
    	
    	JSONObject jsonObject = new JSONObject();
    	jsonObject.put("accountPk", objLogin.getACCOUNTPK());// getUSER_SEQ());
    	jsonObject.put("regKey", regKey);   	
    	String rawData = "jsondata = " + jsonObject.toString();
		
    	System.out.println("=====================================================================");
    	System.out.println(rawData);
    	System.out.println("=====================================================================");
    	HttpClient httpClient = null;
    	HttpResponse response = null;
    	
    	//HttpClient httpClient = new DefaultHttpClient();
        httpClient = HttpConnectionUtil.getHttpClient();
        
    	try {
        	HttpPost postRequest = new HttpPost("http://172.27.60.52:8086"); // local test
            RequestConfig requestConfig = RequestConfig.custom()
          		  .setSocketTimeout(5*1000)
          		  .setConnectTimeout(5*1000)
          		  .setConnectionRequestTimeout(5*1000)
          		  .build();
            postRequest.setConfig(requestConfig);
        	
        	
        	postRequest.setHeader("Content-type", "application/json");
            StringEntity entity = new StringEntity(rawData);

            postRequest.setEntity(entity);
            long startTime = System.currentTimeMillis();
            response = httpClient.execute(postRequest);
            long elapsedTime = System.currentTimeMillis() - startTime;
            System.out.println("Time taken : "+elapsedTime+"ms");

            InputStream is = response.getEntity().getContent();
            Reader reader = new InputStreamReader(is);
            BufferedReader bufferedReader = new BufferedReader(reader);
            StringBuilder builder = new StringBuilder();
            while (true) {
                try {
                    String line = bufferedReader.readLine();
                    if (line != null) {
                        builder.append(line);
                    } else {
                        break;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            System.out.println(builder.toString());
            System.out.println("****************");
            
            return builder.toString();
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }  
    	finally
    	{
    		HttpConnectionUtil.release(response);
    	}
	}	
	
	public String checkSessionServer_crtjin(Login objLogin)
	{
    	Random generator = new Random();  
    	int regKey = generator.nextInt(1000000000) + 20;      
    	JSONObject jsonObject = new JSONObject();
    	jsonObject.put("accountPk", objLogin.getACCOUNTPK());
    	jsonObject.put("regKey", regKey);   	
    	String rawData = "jsondata = " + jsonObject.toString();
    	System.out.println("###rawData:"+rawData);    	
    	HttpClient httpClient = null;
    	HttpResponse response = null;
    	HttpPost postRequest  = null;	
    	//httpClient = new DefaultHttpClient();
        httpClient  = HttpConnectionUtil.getHttpClient();
    	try {
        	//HttpPost postRequest = new HttpPost("http://192.168.1.151:8086"); // session server (webserver)
        	System.out.println("########### m_strSessionHttp:"+m_strSessionHttp);        	
        	
        	//final RequestConfig params = RequestConfig.custom().setConnectTimeout(3000).setSocketTimeout(3000).build();
        	//httpPost.setConfig(params);
        	
        	
        	//final PoolingHttpClientConnectionManager cm = new PoolingHttpClientConnectionManager();
        	
        	postRequest = new HttpPost(m_strSessionHttp); // session server (webserver)
            postRequest.setHeader("Content-type", "application/json");
            StringEntity entity = new StringEntity(rawData);

            final RequestConfig params = RequestConfig.custom().setConnectTimeout(10*1000).setSocketTimeout(10*1000).build();
            postRequest.setConfig(params);
            postRequest.setEntity(entity);

            long startTime = System.currentTimeMillis();
            response = httpClient.execute(postRequest);
            long elapsedTime = System.currentTimeMillis() - startTime;
            /*
            StatusLine statusLine = response.getStatusLine();
            // ?�러 발생
         	if (statusLine.getStatusCode() < 200 || statusLine.getStatusCode() >= 300) {
         		throw new Exception(statusLine.getStatusCode(), getReason(response));
         	}
         	*/
            InputStream is = response.getEntity().getContent();
            Reader reader = new InputStreamReader(is);
            BufferedReader bufferedReader = new BufferedReader(reader);
            StringBuilder builder = new StringBuilder();
            while (true) {
                try {
                    String line = bufferedReader.readLine();
                    if (line != null) {
                        builder.append(line);
                    } else {
                        break;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            //System.out.println(builder.toString());
            //System.out.println("****************");
            return builder.toString();
        } catch (Exception ex) {
        	HttpConnectionUtil.abort(postRequest);
        	ex.printStackTrace();
            return null;
        }
    	finally
    	{
    		HttpConnectionUtil.release(response);
    	}	
	}		
	
	public String login4Seq(spark.Request req, spark.Response res, LoginModel loginModel)
	{
		Login oLogin = new Login();
		oLogin = (Login)stringUtil.ParamObject(req, oLogin);
		if(null == oLogin || !oLogin.isValid(IConstants.SELECT_GET_CHECK))
		{
			oLogin = new Login();
			/*
			oLogin.setRESULT(IConstants.FAIL);
			oLogin.setMESSAGE(MsgConstants.ERROR_PARAMETER);//"Parameter Error.");	      
			*/
			oLogin.setResult(IConstants.FAIL);
			oLogin.setMessage(MsgConstants.ERROR_PARAMETER);//"Parameter Error.");	      
			return JsonUtilManager.getInstance().render(oLogin);
		}
		
		try
		{
			oLogin	= loginModel.getUser4Seq(oLogin);
			
			//if (oLogin.getRESULT() == IConstants.SUCCESS)
			if (oLogin.getResult() == IConstants.SUCCESS)
			{
				LoginUtil.setUserSession(req, oLogin);
			}
			return JsonUtilManager.getInstance().render(oLogin);
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			
			oLogin = new Login();
			oLogin.setResult(IConstants.FAIL);
			oLogin.setMessage(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception.");	      

			/*
			oLogin.setRESULT(IConstants.FAIL);
			oLogin.setMESSAGE(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception.");	      
			*/
			return JsonUtilManager.getInstance().render(oLogin);
		}
	}
	
	public String chkSession(spark.Request req, spark.Response res, LoginModel loginModel)
	{
		CommonResult commonResult = null;
		try
		{
			if (LoginUtil.getUserSession(req) == null)	
			{
				commonResult = new CommonResult();
				/*
				commonResult.setRESULT(IConstants.FAIL);
				commonResult.setMESSAGE(MsgConstants.ERROR_SESSION);//"Session Error");
				*/
				commonResult.setResult(IConstants.FAIL);
				commonResult.setMessage(MsgConstants.ERROR_SESSION);//"Session Error");

				return JsonUtilManager.getInstance().render(commonResult);		
			} else {
				return JsonUtilManager.getInstance().render(LoginUtil.getUserSession(req));
			}
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
			commonResult = new CommonResult();
			/*
			commonResult.setRESULT(IConstants.FAIL);
			commonResult.setMESSAGE(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception : "+ex.getMessage());
			*/
			commonResult.setResult(IConstants.FAIL);
			commonResult.setMessage(MsgConstants.EXCEPTION+"("+ex.getMessage()+")");//"Exception : "+ex.getMessage());

			return JsonUtilManager.getInstance().render(commonResult);		
		}
	}
	

}
