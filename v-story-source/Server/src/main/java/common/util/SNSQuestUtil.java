package common.util;

import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.sql2o.Sql2o;
import org.sql2o.Connection;

import com.ndoctor.framework.sqlm.SqlManager;
import com.ndoctor.framework.sqlm.SqlManagerFactory;

import common.IConstants;

public class SNSQuestUtil 
{
	Logger logger = Logger.getLogger(SNSQuestUtil.class);	
	private static SNSQuestUtil instance = null;
	
	public synchronized static SNSQuestUtil getInstance()
	{
		if (instance == null)
		{
			instance = new SNSQuestUtil();
		}
		return instance;	
	}
	
	public int setQuestFinish(Sql2o snsMysql,Sql2o snsMysqlSelect, Integer iAccountPk, Integer iFriendAccountPk, Integer iQuestId, int iCondType)
	{
		if (1==1) return IConstants.SUCCESS;
		
		if (iAccountPk == 0 || iAccountPk == null || iFriendAccountPk == 0 || iFriendAccountPk == null || iQuestId == 0|| iQuestId == null)
		{
			return IConstants.FAIL;
		}
		
		String sqlString = null;
		try(Connection con_sns = snsMysqlSelect.open();
			Connection con_sns_select = snsMysqlSelect.open())
		{
			SqlManager sqlManager = SqlManagerFactory.create("snsquest");
			Map<String, Object> mP = new HashMap<String, Object>();
			
			sqlManager.clearQParams();
			// 등록된 퀘스트가 있는지 중복 체크
        	sqlManager.findSQL("snsquest.getSNSQuest_SNS");
        	mP.put("ACCOUNTPK", iAccountPk);
        	mP.put("FRIENDACCOUNTPK", iFriendAccountPk);
        	mP.put("QUESTID", iQuestId);
        	mP.put("CONDTYPE", iCondType);
        	sqlManager.setParam(mP);        	
			sqlString = sqlManager.getSQL();
			Integer iCnt = con_sns_select.createQuery(sqlString).executeAndFetchFirst(Integer.class);

			sqlManager.clearQParams();
			// 없으면 INSERT
			if (iCnt == null || iCnt.intValue() < 1)
			{
	        	sqlManager.findSQL("snsquest.regSNSQuest_SNS");
	        	mP.put("ACCOUNTPK", iAccountPk);
	        	mP.put("FRIENDACCOUNTPK", iFriendAccountPk);
	        	mP.put("QUESTID", iQuestId);
	        	mP.put("CONDTYPE", iCondType);
	        	sqlManager.setParam(mP);
	        	sqlString = sqlManager.getSQL();
	        	Object oSNSQuestSeq = con_sns.createQuery(sqlString).executeUpdate().getKey();
	        	if (oSNSQuestSeq == null)
	        	{
	        		return IConstants.FAIL;
	        	}
			}
			return IConstants.SUCCESS;
		}		
    	catch(Exception e)
    	{
    		e.printStackTrace();
    		logger.error(e.getMessage());
    		return IConstants.FAIL;
    	} 		
		
	}

}
