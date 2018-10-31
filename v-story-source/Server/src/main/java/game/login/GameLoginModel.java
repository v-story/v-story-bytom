package game.login;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.sql2o.Connection;
import org.sql2o.Sql2o;

import com.ndoctor.framework.sqlm.SqlManager;
import com.ndoctor.framework.sqlm.SqlManagerFactory;

import common.login.UserInfo;

public class GameLoginModel
{

    private Sql2o accountMysql 		= null;
    private Sql2o gameMysqlSelect 	= null;
    private Sql2o snsMysqlSelect 	= null;
    
    Logger logger = Logger.getLogger(this.getClass());
    
    public GameLoginModel(Sql2o accountMysql,Sql2o snsMysqlSelect,Sql2o gameMysqlSelect)
    {
        this.accountMysql 		= accountMysql;
        this.snsMysqlSelect		= snsMysqlSelect;
        this.gameMysqlSelect	= gameMysqlSelect;
    }	
    
    public UserInfo GetUserInfo(Integer accountPk)
    {
    	String sqlString = null;
    	try(Connection con_game_select =gameMysqlSelect.open())
    	{
        	SqlManager sqlManager = SqlManagerFactory.create("gamelogin");
        	sqlManager.findSQL("gamelogin.getUserInfo");
        
        	Map<String, Object> mP = new HashMap<String, Object>();
        	mP.put("ACCOUNTPK", accountPk);
        	sqlManager.setParam(mP);
			sqlString = sqlManager.getSQL();
			return con_game_select.createQuery(sqlString).executeAndFetchFirst(UserInfo.class);
    	}
    	catch(Exception ex)
    	{
    		ex.printStackTrace();
    		return null; 
    	}        
    }	  
    
    public CurrencyInfo GetCurrencyInfo(Integer accountPk)
    {
    	String sqlString = null;
    	try(Connection con_account =accountMysql.open())
    	{
        	SqlManager sqlManager = SqlManagerFactory.create("gamelogin");
        	sqlManager.findSQL("gamelogin.getCurrencyInfo");
        
        	Map<String, Object> mP = new HashMap<String, Object>();
        	mP.put("ACCOUNTPK", accountPk);
        	sqlManager.setParam(mP);
			sqlString = sqlManager.getSQL();
			return con_account.createQuery(sqlString).executeAndFetchFirst(CurrencyInfo.class);
    	}
    	catch(Exception ex)
    	{
    		ex.printStackTrace();
    		return null; 
    	}        
    }    
    
    public List<Integer> GetInerestInfo(Integer accountPk)
    {
    	String sqlString = null;
    	try(Connection con_sns_select =snsMysqlSelect.open())
    	{
        	SqlManager sqlManager = SqlManagerFactory.create("gamelogin");
        	sqlManager.findSQL("gamelogin.getInterestInfo");
        
        	Map<String, Object> mP = new HashMap<String, Object>();
        	mP.put("ACCOUNTPK", accountPk);
        	sqlManager.setParam(mP);
			sqlString = sqlManager.getSQL();
			return con_sns_select.createQuery(sqlString).executeAndFetch(Integer.class);
    	}
    	catch(Exception ex)
    	{
    		ex.printStackTrace();
    		List<Integer> nullList = new ArrayList<Integer>();	
    		return nullList;
    	}        
    }    
    
     
	
}
