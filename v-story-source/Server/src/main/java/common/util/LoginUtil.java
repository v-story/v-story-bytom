package common.util;

import org.apache.log4j.Logger;

import common.CommonLogin;
import common.CommonUser;
//import common.ErrorCode.GameResultCode;
import common.IConstants;
import common.MsgConstants;
import common.database.RedisConnectionManager;
import game.login.CurrencyInfo;
import login.UserSession;
import spark.Request;
import spark.Session;

/*
 * author jong-hun park
 */
public class LoginUtil {
	Logger logger = Logger.getLogger(LoginUtil.class);
	public static boolean isLoggedIn(Request req)
	{
		if (req.session(false) == null || (req.session().attribute(IConstants.USER_SESSION_KEY) == null))
		{
			return false;
		}
		else
		{
			return true;
		}
	}

	public static String getUserId(Request req)
	{
		UserSession userSession = (UserSession) req.session().attribute(IConstants.USER_SESSION_KEY);
		if (userSession == null)
		{
			return null;
		}

		return userSession.getID();
	}
	
	public static Integer getAccountPk(Request req)
	{
		UserSession userSession = (UserSession)req.session().attribute(IConstants.USER_SESSION_KEY);
		if (userSession == null)
		{
//			logger.debug("LoginUtil : User information not found.");
			return null;
		}

		return userSession.getACCOUNTPK();
	}	
	
	/**
	 * MEMBER_SESSION_KEY�� ���� Member session�� �����ϴ��� üũ�Ѵ�.
	 * 
	 * @param request
	 * @return
	 */
	public static boolean existUserSession(Request req)
	{
		if (req.session(false) == null	|| (req.session().attribute(IConstants.USER_SESSION_KEY) == null))
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	
	/**
	 * Member Session�� ����Ѵ�.
	 * 
	 * @param request
	 */
	public static void setUserSession(Request req, Object obj)
	{
		req.session(true);
		req.session().attribute(IConstants.USER_SESSION_KEY, obj);		
	}
	public static void setUserSessionCurrency(Request req, CurrencyInfo oCurrencyInfo)
	{
		UserSession userSession = req.session().attribute(IConstants.USER_SESSION_KEY)!=null?(UserSession)req.session().attribute(IConstants.USER_SESSION_KEY):null;
		if (userSession == null)
			return;

		userSession.setCURRENCYINFO(oCurrencyInfo);
		
		req.session(true).attribute(IConstants.USER_SESSION_KEY, userSession);		
	}
	public static CurrencyInfo getUserSessionCurrency(Request req)
	{
		return new CurrencyInfo();
		/*UserSession userSession = req.session().attribute(IConstants.USER_SESSION_KEY)!=null?(UserSession)req.session().attribute(IConstants.USER_SESSION_KEY):null;
		if (userSession == null)
		{
			return null;
		}
		return userSession.getCURRENCYINFO();*/
	}
	public static void removeUserSession(Request req)
	{
		//Session ss = req.session(false);
		Session ss = req.session(false);
		if (ss != null)
		{
			ss.removeAttribute(IConstants.USER_SESSION_KEY);
		}
	}

	public static UserSession getUserSession(Request req)
	{
		UserSession userSession = req.session().attribute(IConstants.USER_SESSION_KEY)!=null?(UserSession)req.session().attribute(IConstants.USER_SESSION_KEY):null;
		if (userSession == null)
		{
			return null;
		}
		return userSession;
	}	
	
	public static CommonLogin getUserSessionAccountPk(Request req)
	{
		CommonLogin commonLogin = new CommonLogin();
		/*commonLogin.setACCOUNTPK(5);
		commonLogin.setRESULT(IConstants.SUCCESS);
		return commonLogin;*/
		UserSession userSession = LoginUtil.getUserSession(req);
		Integer accountPk = null;
		//세션정보가 있을경우
		if(null != userSession)
		{
			CommonUser commonUser = new CommonUser();
			commonUser = (CommonUser)StringUtil.getInstance().ParamObject(req, commonUser);
			if(null!=commonUser)
			{
				commonLogin.setACCOUNTPK(commonUser.getACCOUNTPK());
				commonLogin.setRESULT(IConstants.SUCCESS);
			}
			else
			{	
				accountPk = (Integer)LoginUtil.getAccountPk(req);
				commonLogin.setACCOUNTPK(accountPk);
				commonLogin.setRESULT(IConstants.SUCCESS);
			}	
			return commonLogin;
		}
		//세션정보가 없을경우
		else
		{
			CommonUser commonUser = new CommonUser();
			commonUser = (CommonUser)StringUtil.getInstance().ParamObject(req, commonUser);
			//param정보가 있을경우
			if(null ==commonUser)
			{
				String id = req.queryParams("id");
				id		  = id==null?req.params(":id"):id;
				if(null == id)
				{
					//GameResultCode resultCode = GameResultCode.NO_PARAMETER;
					commonLogin.setACCOUNTPK(accountPk);
					commonLogin.setRESULT(IConstants.FAIL);
					commonLogin.setMESSAGE(MsgConstants.ERROR_PARAMETER);
					//commonLogin.setRESULT(resultCode.getValue());
					return commonLogin;
				}
				String strAccountPk = RedisConnectionManager.getInstance().redisGet(id);
				if(null == strAccountPk)
				{
					//GameResultCode resultCode = GameResultCode.ID_NOT_FOUOND;
					commonLogin.setACCOUNTPK(accountPk);
					commonLogin.setRESULT(IConstants.FAIL);
					commonLogin.setMESSAGE(MsgConstants.LOGIN_NOTFOUND_ID);
					return commonLogin;
				}
				else
				{
					accountPk = Integer.parseInt(strAccountPk);
					commonLogin.setACCOUNTPK(accountPk);
					commonLogin.setRESULT(IConstants.SUCCESS);
					return commonLogin;
				}					
			}
			//param정보가 없을경우
			else
			{	
				accountPk = commonUser.getACCOUNTPK();
				if(null == accountPk)
				{
					commonLogin.setACCOUNTPK(accountPk);
					commonLogin.setRESULT(IConstants.FAIL);
					commonLogin.setMESSAGE(MsgConstants.ERROR_PARAMETER);					
					/*
					GameResultCode resultCode = GameResultCode.NO_PARAMETER;
					commonLogin.setRESULT(resultCode.getValue());
					*/
					//return commonLogin;
				}
				else
				{
					commonLogin.setACCOUNTPK(accountPk);
					commonLogin.setRESULT(IConstants.SUCCESS);
				}
				return commonLogin;
			}	
		}
	}
	
	/**
	 * 세션값을 우선으로 해서 accountPk를 리턴한다.
	 * @param req
	 * @param paramAccountPk
	 * @return
	 */
	public static Integer getAccountPkBySession(Request req, Integer paramAccountPk)
	{
		if (paramAccountPk == null || paramAccountPk < 1)
		{
			UserSession userSession = getUserSession(req);
			if (null == userSession)
			{
				return paramAccountPk;
			}
			return userSession.getACCOUNTPK();
		}
		else
			return paramAccountPk;
	}	
	
}
