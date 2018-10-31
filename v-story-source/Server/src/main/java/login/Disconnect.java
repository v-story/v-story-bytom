package login;

import common.util.LoginUtil;

public class Disconnect {

	spark.Request req = null;
	
	public Disconnect(spark.Request req)
	{
		this.req = req;
	}
	
	public void Disconnect()
	{
		
		LoginManager loginManager = LoginManager.getInstance();
		
		Integer accountPk = (Integer)LoginUtil.getAccountPk(req);
		
		if(accountPk != null)
		{
			loginManager.removeSession("12122");
			//loginManager.setSession(session, userId);
			//redirect
			
		}
	}	
}

