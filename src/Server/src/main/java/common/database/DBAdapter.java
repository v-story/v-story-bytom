package common.database;

import javax.sql.DataSource;

import org.sql2o.Sql2o;

/*
 * author jong-hun park
 */
public class DBAdapter {
	
    public static String USERNAME = "root";
    public static String PASSWORD = "djfudnsdkagh";
    public static String PORT_NUMBER = "3306";
    public static String HOST_NAME = "1.232.18.80";
    public static String DATABASE_NAME = "notafiscal";
    private Sql2o mysql = null;
	

    public DBAdapter()
    {
    	mysql = new Sql2o("jdbc:mysql://" + HOST_NAME + ":" + PORT_NUMBER + "/" + DATABASE_NAME, USERNAME, PASSWORD);
    } 
    
    
    public DBAdapter(String dbName)
    {
    	mysql = new Sql2o("jdbc:mysql://" + HOST_NAME + ":" + PORT_NUMBER + "/" + dbName, USERNAME, PASSWORD);
    }     
    
    public DBAdapter(String USERNAME,String PASSWORD,int PORT_NUMBER,String HOST_NAME,String dbName)
    {
    	mysql = new Sql2o("jdbc:mysql://" + HOST_NAME + ":" + PORT_NUMBER + "/" + dbName, USERNAME, PASSWORD);
    }     
    
    public DBAdapter(DataSource datasource)
    {
    	mysql = new Sql2o(datasource);
    }     
    
    public Sql2o getMysql()
    {
    	
    	return mysql;
    }    
    
}
