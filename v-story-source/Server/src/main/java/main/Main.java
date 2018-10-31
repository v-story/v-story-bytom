package main;

import static spark.Spark.after;
import static spark.Spark.before;
import static spark.Spark.halt;

import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.sql2o.Sql2o;

import com.bytom.BytomController;
import com.bytom.BytomModel;
import com.ndoctor.framework.config.QProperties;
import com.ndoctor.framework.sqlm.SqlRegistryManager;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

import common.IConstants;
import common.MsgConstants;
import common.database.DBAdapter;
import common.database.RedisConnectionManager;
import common.util.ByTomConnectionUtil;
import common.util.JsonUtilManager;
import common.util.LoginUtil;
import game.login.GameLoginController;
import game.login.GameLoginModel;
import io.bytom.http.Client;
import login.Login;
import login.LoginController;
import login.LoginModel;
import login.UserSession;
import spark.Filter;
import spark.servlet.SparkApplication;

public class Main implements SparkApplication {

	static Logger logger = Logger.getLogger(Main.class);
	private DBAdapter mySQLAdapter  	= null;					//SNS Database;
	
	private HikariDataSource ds_account 		= null;	// account

	private HikariDataSource ds_game 			= null; // game
	private HikariDataSource ds_game_select 	= null; // game(L4)
	
	private HikariDataSource ds_sns		 		= null; // sns
	private HikariDataSource ds_sns_select 		= null; // sns(L4)
	
	
	private Sql2o mysql_account					= null;	//account db	
	
	private Sql2o mysql_game					= null;	//game db	
	private Sql2o mysql_game_select				= null;	//game db	
	
	private Sql2o mysql_sns						= null;	//sns db	
	private Sql2o mysql_sns_select				= null;	//sns db	

	
	public static void main(String[] args)
	{
		new Main().init();
	}	
	
	public void init()
	{
		before((req, res) -> {
			if (!"/getProfilePost4kakao".equals(req.pathInfo()) 
		    		&& !"/regUser".equals(req.pathInfo()) 
		    		&& !"/updateAvatar".equals(req.pathInfo()) 
		    		&& !"/login".equals(req.pathInfo()) 
		    		&& !"/login".equals(req.pathInfo()) 
		    		&& !"/login_guest2".equals(req.pathInfo()) 
		    		&& !"/login_park".equals(req.pathInfo()) 
		    		&& !"/login_test".equals(req.pathInfo()) 
		    		&& !"/login_crtjin".equals(req.pathInfo()) 
		    		&& !"/login4Seq".equals(req.pathInfo()) 
		    		&& !"/profileView".equals(req.pathInfo()) 
		    		&& !"/videoView".equals(req.pathInfo()) 
		    		&& !"/kakaoFileView".equals(req.pathInfo()) 
		    		&& !"/guestData".equals(req.pathInfo()) 
		    		&& !"/chkSession".equals(req.pathInfo()) 
		    		&& !"/delSession".equals(req.pathInfo()) 
		    		&& !"/reloadSqlRegistry".equals(req.pathInfo()) 
		    		&& !(req.pathInfo().indexOf("/test/")>0))
					{
		    		//&& !LoginUtil.isLoggedIn(req)) {
				UserSession userSession = LoginUtil.getUserSession(req);
				if(null==userSession)
				{	
		    	Login objLogin = new Login();
					objLogin.setResult(IConstants.FAIL);
					objLogin.setMessage(MsgConstants.ERROR_SESSION);//"Error Session.");
					halt(JsonUtilManager.getInstance().render(objLogin));
				}
				else
				{
					System.out.println(userSession.getACCOUNTPK());
				}
		    }
		    
		});
		
		
		 after((Filter) (req, res) -> {
			 res.type("application/json;charset=UTF-8");
		});
		String dburl		= null;
		String datasource	= null;
		String username 	= null;
		String password		= null;
		String hostname		= null;
		String dbname		= null;
		int    port			= 3306;	
		QProperties prop 		= null;
		HikariConfig config1 = new HikariConfig();
        String osName = System.getProperty("os.name");
        String propPath = null;
        //logger.info("osName is ::" + osName);	
        try 
		{
			if(osName.startsWith("Windows"))
				propPath = IConstants.WINDOW_CONTEXT_PATH + "webapps/funfactory-1.0/WEB-INF/classes/conf/wincsweb.properties";
			else
				propPath = IConstants.LINUX_CONTEXT_PATH + "webapps/funfactory-1.0/WEB-INF/classes/conf/lincsweb.properties";
			prop = new QProperties(propPath);

			if(null!=prop)	
			{
				dburl		= prop.getString("com.funfactory.db.url");
				datasource	= prop.getString("com.funfactory.db.datasource");		
		        // ###############################################################################
				username 	= prop.getString("com.funfactory.account.db1.username");
				password 	= prop.getString("com.funfactory.account.db1.password");
				port	 	= Integer.parseInt(prop.getString("com.funfactory.account.db1.port"));
				hostname 	= prop.getString("com.funfactory.account.db1.hostname");	
				dbname	 	= prop.getString("com.funfactory.account.db1.dbname");		
				
		        config1.setDataSourceClassName(datasource);
		        config1.setConnectionTestQuery("SELECT 1");
		        config1.addDataSourceProperty("URL", dburl + hostname + ":" + port+ "/" + dbname);
		        config1.addDataSourceProperty("useUnicode", "true");
		        config1.addDataSourceProperty("characterEncoding", "euckr");
		        config1.addDataSourceProperty("user",username);
		        config1.addDataSourceProperty("password", password);
		        config1.setMaximumPoolSize(prop.getInt("com.funfactory.account.db1.maxpoolsize", 1));
		        config1.setMinimumIdle(prop.getInt("com.funfactory.account.db1.minpoolsize", 1));
		        config1.setConnectionTimeout(0);
		        config1.setIdleTimeout(0);
		        config1.setMaxLifetime(1000*60*30);
		        ds_account = new HikariDataSource(config1);	
		        // ###############################################################################
				username 	= prop.getString("com.funfactory.game.db1.username");
				password 	= prop.getString("com.funfactory.game.db1.password");
				port	 	= Integer.parseInt(prop.getString("com.funfactory.game.db1.port"));
				hostname 	= prop.getString("com.funfactory.game.db1.hostname");
				dbname	 	= prop.getString("com.funfactory.game.db1.dbname");

				config1.setDataSourceClassName(datasource);
		        config1.setConnectionTestQuery("SELECT 1");
		        config1.addDataSourceProperty("URL", dburl + hostname + ":" + port+ "/" + dbname);
		        config1.addDataSourceProperty("useUnicode", "true");
		        config1.addDataSourceProperty("characterEncoding", "euckr");
		        config1.addDataSourceProperty("user",username);
		        config1.addDataSourceProperty("password", password);
		        config1.setMaximumPoolSize(prop.getInt("com.funfactory.game.db1.maxpoolsize", 1));
		        config1.setMinimumIdle(prop.getInt("com.funfactory.game.db1.minpoolsize", 1));
		        config1.setConnectionTimeout(0);
		        config1.setIdleTimeout(0);
		        config1.setMaxLifetime(1000*60*30);
		        ds_game = new HikariDataSource(config1);	
		        // ###############################################################################
		        username 	= prop.getString("com.funfactory.gameL4.db1.username");
				password 	= prop.getString("com.funfactory.gameL4.db1.password");
				port	 	= Integer.parseInt(prop.getString("com.funfactory.gameL4.db1.port"));
				hostname 	= prop.getString("com.funfactory.gameL4.db1.hostname");
				dbname	 	= prop.getString("com.funfactory.gameL4.db1.dbname");
				
		        
				config1.setDataSourceClassName(datasource);
		        config1.setConnectionTestQuery("SELECT 1");
		        config1.addDataSourceProperty("URL", dburl + hostname + ":" + port+ "/" + dbname);
		        config1.addDataSourceProperty("useUnicode", "true");
		        config1.addDataSourceProperty("characterEncoding", "euckr");
		        config1.addDataSourceProperty("user",username);
		        config1.addDataSourceProperty("password", password);
		        config1.setMaximumPoolSize(prop.getInt("com.funfactory.gameL4.db1.maxpoolsize", 1));
		        config1.setMinimumIdle(prop.getInt("com.funfactory.gameL4.db1.minpoolsize", 1));
		        config1.setConnectionTimeout(0);
		        config1.setIdleTimeout(0);
		        config1.setMaxLifetime(1000*60*30);
		        ds_game_select = new HikariDataSource(config1);	
		       
		        // ###############################################################################
				username 	= prop.getString("com.funfactory.sns.db1.username");
				password 	= prop.getString("com.funfactory.sns.db1.password");
				port	 	= Integer.parseInt(prop.getString("com.funfactory.sns.db1.port"));
				hostname 	= prop.getString("com.funfactory.sns.db1.hostname");	
				dbname	 	= prop.getString("com.funfactory.sns.db1.dbname");				
				
		        config1.setDataSourceClassName(datasource);
		        config1.setConnectionTestQuery("SELECT 1");
		        config1.addDataSourceProperty("URL", dburl + hostname + ":" + port+ "/" + dbname);
		        config1.addDataSourceProperty("useUnicode", "true");
		        config1.addDataSourceProperty("characterEncoding", "euckr");
		        config1.addDataSourceProperty("user",username);
		        config1.addDataSourceProperty("password", password);
		        config1.setMaximumPoolSize(prop.getInt("com.funfactory.sns.db1.maxpoolsize", 1));
		        config1.setMinimumIdle(prop.getInt("com.funfactory.sns.db1.minpoolsize", 1));
		        config1.setConnectionTimeout(0);
		        config1.setIdleTimeout(0);
		        config1.setMaxLifetime(1000*60*30);
		        ds_sns = new HikariDataSource(config1);	
		        // ###############################################################################
		        username 	= prop.getString("com.funfactory.snsL4.db1.username");
				password 	= prop.getString("com.funfactory.snsL4.db1.password");
				port	 	= Integer.parseInt(prop.getString("com.funfactory.snsL4.db1.port"));
				hostname 	= prop.getString("com.funfactory.snsL4.db1.hostname");	
				dbname	 	= prop.getString("com.funfactory.snsL4.db1.dbname");				
				
		        
				config1.setDataSourceClassName(datasource);
		        config1.setConnectionTestQuery("SELECT 1");
		        config1.addDataSourceProperty("URL", dburl + hostname + ":" + port+ "/" + dbname);
		        config1.addDataSourceProperty("useUnicode", "true");
		        config1.addDataSourceProperty("characterEncoding", "euckr");
		        config1.addDataSourceProperty("user",username);
		        config1.addDataSourceProperty("password", password);
		        config1.setMaximumPoolSize(prop.getInt("com.funfactory.snsL4.db1.maxpoolsize", 1));
		        config1.setMinimumIdle(prop.getInt("com.funfactory.snsL4.db1.minpoolsize", 1));
		        config1.setConnectionTimeout(0);
		        config1.setIdleTimeout(0);
		        config1.setMaxLifetime(1000*60*30);
		        ds_sns_select = new HikariDataSource(config1);	
		        openSQLManagerService();  
			}
		
		}
        catch(Exception e)
        {
			logger.error(e.getMessage());
			e.printStackTrace();        	
        }
        
		mySQLAdapter  = new DBAdapter((DataSource)ds_account);
		mysql_account = mySQLAdapter.getMysql();     

		mySQLAdapter  = new DBAdapter((DataSource)ds_game);
		mysql_game = mySQLAdapter.getMysql();     

		
		mySQLAdapter  = new DBAdapter((DataSource)ds_game_select);
		mysql_game_select = mySQLAdapter.getMysql();  		
		
		
		mySQLAdapter  = new DBAdapter((DataSource)ds_sns);
		mysql_sns = mySQLAdapter.getMysql();     
		
		
		mySQLAdapter  = new DBAdapter((DataSource)ds_sns_select);
		mysql_sns_select = mySQLAdapter.getMysql();     
		
		GameLoginModel		guestLoginModel		= new GameLoginModel(mysql_account,mysql_sns_select,mysql_game_select);
		new GameLoginController(guestLoginModel);	
		
		// 로그??
		LoginModel	loginModel			= new LoginModel(mysql_account, mysql_sns, mysql_sns_select);		
		new LoginController(loginModel,guestLoginModel, prop.getString("com.funfactory.sessionserver.http"));
		
		Client client = null;
		try
		{
			client =  ByTomConnectionUtil.generateClient();
		}
		catch(Exception e)
		{
			
		}
		BytomModel bytomModel = new BytomModel(client,mysql_account,mysql_sns_select);
		new BytomController(bytomModel);		
		RedisConnectionManager.getInstance();
	
	}
	
	private void openSQLManagerService()  
	{
		QProperties prop = null;
		try
		{
			prop = new QProperties();
			if(null!=prop)
			{	
				String configPath = prop.getString("com.funfactory.framework.sqlm.registry.config");
				SqlRegistryManager manager = SqlRegistryManager.getInstance();
				manager.setParentClassLoader(this.getClass().getClassLoader());
				manager.readConfiguration(configPath);
			}	

		}
		catch(Exception e)
		{
			logger.error(e.getMessage());
			e.printStackTrace();
			return;
		}
	}   	
	
	
	@Override
	public void destroy()
	{
		logger.info("init destroy call");
		try
		{
			//mySQLAdapter0 	= null;
			mySQLAdapter 	= null;
			
			ds_account.close();
			ds_account		= null;
			mysql_account		= null;

			ds_game.close();
			ds_game		= null;
			mysql_game	= null;
			
			ds_game_select.close();
			ds_game_select		= null;
			mysql_game_select	= null;			

			
			ds_sns.close();
			ds_sns				= null;
			mysql_sns			= null;

			ds_sns_select.close();
			ds_sns_select		= null;
			mysql_sns_select	= null;
			
			
			SqlRegistryManager.getInstance().reset();
		}
		catch(Exception e)
		{
			
		}
	}	
}
