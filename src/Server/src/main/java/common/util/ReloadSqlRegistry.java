package common.util;

import java.util.Enumeration;

import com.ndoctor.framework.sqlm.SqlManager;
import com.ndoctor.framework.sqlm.SqlManagerFactory;
import com.ndoctor.framework.sqlm.SqlRegistryManager;

public class ReloadSqlRegistry {

	
	public static synchronized void reloadSql(String flag,String registryName) throws Exception
	{
		if ( "0".equals(flag) ) 
		{
			//out.println("printl1");
			SqlRegistryManager srm1	= SqlRegistryManager.getInstance();
			Enumeration enum1 		= srm1.getSqlRegistryNames();
			String regName 	= null;
			//out.println("enum1.hasMoreElements()::"+enum1.hasMoreElements());
			while (enum1.hasMoreElements()) 
			{
				regName 	= (String)enum1.nextElement();
				//out.println("regName::"+regName);
				SqlManager sm 	= SqlManagerFactory.create(regName);
				try
				{
					sm.reloadSqlRegistry();
				}
				catch (Exception e)
				{
					System.out.println("<p>Error:"+regName+"::"+e.getMessage()+"</p>");
					continue;
				}
				System.out.println("Success to load the registry, "+regName+"<br/>");
			}
		} 
		else if ( "2".equals(flag) )
		{
			SqlRegistryManager srm1	= SqlRegistryManager.getInstance();
			Enumeration enum1 		= srm1.getSqlRegistryNames();
			SqlManager sm 	= SqlManagerFactory.create(registryName);
			try
			{
				sm.reloadSqlRegistry();
				System.out.println("Success to load the registry, "+registryName+"<br/>");
			}
			catch (Exception e)
			{
				System.out.println("<p>Error:"+registryName+"::"+e.getMessage()+"</p>");
			}			
			
		}
	}
	
}
