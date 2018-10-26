package game.login;

import static spark.Spark.get;

import org.apache.log4j.Logger;



public class GameLoginController 
{

	Logger logger = Logger.getLogger(GameLoginController.class);
	//private String contextName = "/gameLogin";
	private String contextName = "";
	
	public GameLoginController(final GameLoginModel guestLoginModel) 
	{
		
		get(contextName+"/guestLoginTest", 
				(req, res) -> 
				{
					return "test...guestLoginTest";
				}
		);
	}
	
}
