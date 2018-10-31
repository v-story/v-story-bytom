package com.bytom;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.sql2o.Connection;
import org.sql2o.Sql2o;

import com.ndoctor.framework.config.QProperties;

import common.util.ByTomConnectionUtil;
import common.util.ByTomUtil;
import io.bytom.api.Account;
import io.bytom.api.Key;
import io.bytom.api.Receiver;
import io.bytom.api.Transaction;
import io.bytom.exception.BytomException;
import io.bytom.http.Client;

public class BytomModel
{

    Logger logger = Logger.getLogger(this.getClass());
    private Client client 					= null;
    private Sql2o  mysql_account			= null;
    private Sql2o mysql_sns_select 			= null;
    public BytomModel(Client client,Sql2o mysql_account, Sql2o mysql_sns_select)
    {
        this.client 				= client;
        this.mysql_account			= mysql_account;
        this.mysql_sns_select		= mysql_sns_select;
    }	
    
    
    
	public boolean CreateBytomInfo(String id,String passwd)
	{
		Integer quorum = 1;
		try
		{
			//key 생성
			Key.Builder builder1 = new Key.Builder().setAlias(id).setPassword(passwd);
	        Key key = Key.create(client, builder1);  
	        List<String> root_xpubs = new ArrayList<String>();
	    	root_xpubs.add(key.xpub);
	    	
	    	//Account 생성
	    	Account.Builder builder2 = new Account.Builder().setAlias(id).setQuorum(quorum).setRootXpub(root_xpubs);	
	    	Account account = Account.create(client, builder2); 	
	    	
	    	//Address 생성
	    	String bytomAlias 	= account.alias;
	    	String bytomId	 	= account.id;
	    	Account.ReceiverBuilder receiverBuilder =   new Account.ReceiverBuilder().setAccountAlias(bytomAlias).setAccountId(bytomId);
	    	//String aa = receiverBuilder.accountId;
	    	Receiver receiver = receiverBuilder.create(client);
	    	
	    	//Asset 생성
	    	/*
	    	List<String> xpubs = account.xpubs;
        	Asset.Builder builder = new Asset.Builder()
        	                        .setAlias(id)
        	                        .setQuorum(quorum)
        	                        //.addDefinitionField("decimals", 4)
        	                        .setRootXpubs(xpubs);
        	Asset accountAsset = builder.create(client);	
	    	*/
	    	return true;
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return false;
		}		
	}  
    
    public BtmUserInfo getBtmUserInfo(int accountPk,String accountID)
    {
    	System.out.println("snsMysql value is:" + mysql_sns_select);
    	
    	BtmUserInfo btmUserInfo = null;
    	try(Connection con_sns_select = mysql_sns_select.open())
    	{
        	String sqlString = "SELECT ID AS ACCOUNT_ID,GENDER,INTRODUCE,PROF_PIC_NM FROM TB_USER WHERE ACCOUNTPK = "+accountPk ;
        	btmUserInfo = con_sns_select.createQuery(sqlString).executeAndFetchFirst(BtmUserInfo.class);
    	}
    	catch(Exception e)
    	{
    		e.printStackTrace();
    		logger.error(e);
    	}
    	return btmUserInfo;
    }   
    
    
    public List<AccountnoLog> btmAccountList()
    {
    	List<AccountnoLog> accountlist = null;
    	try
    	{ 
    		accountlist = AccountnoLog.list(client);
    	}
    	catch(Exception e)
    	{
    		e.printStackTrace();
    		logger.error(e);
    	}
    	return accountlist;
    }
    
    public String getBtmAccountAlias(String accountId)
    {
    	String btmAccountId = null;
    	List<AccountnoLog> accountlist = btmAccountList();
		for (AccountnoLog result : accountlist)
		{	
			if(accountId.equals(result.alias))
				btmAccountId =  result.id;
		}
    	return btmAccountId;
    }    
    
    public Integer getSmile(int accountPk)
    {
    	Integer smile = 0;
    	try(Connection con_account = mysql_account.open())
    	{
        	String sqlString = "SELECT SMILE_FREE_CNT FROM TB_CURRENCY_INFO WHERE ACCOUNTPK = "+accountPk ;
        	smile = con_account.createQuery(sqlString).executeAndFetchFirst(Integer.class);
    	}
    	catch(Exception e)
    	{
    		e.printStackTrace();
    		logger.error(e);
    		return 1;
    	}
    	return smile;
    }     
    
    public List<BalancenoLog> getBalance(String accountAlias,String assetAlias)
    {
    	List<BalancenoLog> balanceList = null;
    	try
    	{
    		balanceList = new BalancenoLog.QueryBuilder().listByAccountAlias(client, accountAlias); 
    	}
    	catch(BytomException e)
    	{
    		e.printStackTrace();
    	}
    	return balanceList;
    }
    
    public List<BalancenoLog> getBalanceList(String accountAlias)
    {
    	List<BalancenoLog> balanceList = null;
    	try
    	{
    		balanceList = new BalancenoLog.QueryBuilder().listByAccountAlias(client, accountAlias); 
    	}
    	catch(BytomException e)
    	{
    		e.printStackTrace();
    	}
    	return balanceList;
    }
    
    public List<TransactionnoLog> listTransaction(String accountAlias)
    {
    	List<TransactionnoLog> transactionList = null;
    	try
    	{
			String bytomId = getBtmAccountAlias(accountAlias);
			transactionList = new TransactionnoLog.QueryBuilder().setAccountId(bytomId).listByAccountId(client);
    	}
    	catch(BytomException e)
    	{
    		logger.error(e);
    	}
    	return transactionList;
    }   
    
    public Transaction getTransaction(String txId)
    {
    	Transaction trans = null;
    	try
    	{
    		trans = new Transaction.QueryBuilder().setTxId(txId).get(client);
    	}
    	catch(BytomException e)
    	{
    		logger.error(e);
    	}
    	return trans;
    }   
    
    public boolean smileToBtmTransaction(int serverIndex,int accountPk,String reveiverId,Long smile,Long fromAmount,Long toAmount,int gas)
    {
		try
    	{
			QProperties prop 		= new QProperties();
			String senderId 			= prop.getString("com.funfactory.bytom.accountalias")!=null?prop.getString("com.funfactory.bytom.accountalias"):"vstory";
			String assetAlias		= prop.getString("com.funfactory.bytom.assetalias")!=null?prop.getString("com.funfactory.bytom.assetalias"):"BTM";
			int bytommargin			= prop.getInt("com.funfactory.bytom.bytommargin",100000000);
			String passwd			="vstory1234"; 
			logger.info("sendId value is:" + senderId);
			logger.info("assetAlias value is:" + assetAlias);
			Client client = ByTomConnectionUtil.generateClient();
			Account.ReceiverBuilder receiverBuilder =   new Account.ReceiverBuilder().setAccountAlias(reveiverId);
	    	Receiver receiver = receiverBuilder.create(client);	   		
    		String receiverAddress = receiver.address;
			System.out.println("=====================================================================");
			System.out.println("smileToBtmTransaction");
			System.out.println("senderId value is::" + senderId);
			System.out.println("senderId value is::" + smile);
			System.out.println("gas value is::" + gas);
			System.out.println("reveiverId value is::" + reveiverId);
			System.out.println("(smileMark+gas)*bytommargin value is::" + (smile+gas)*bytommargin);
			System.out.println("smileMark*bytommargin value is::" + smile*bytommargin);
			System.out.println("passwd value is::" + passwd);
			System.out.println("=====================================================================");
    		TransactionnoLog.Template controlAddress = new TransactionnoLog.Builder()
    		        .addAction(
    		                new TransactionnoLog.Action.SpendFromAccount()
    		                        .setAccountAlias(senderId)
    		                        .setAssetAlias("BTM")
    		                        .setAmount((smile)*bytommargin)
    		        )
    		        .addAction(
    		                new TransactionnoLog.Action.ControlWithAddress()
    		                        .setAddress(receiverAddress)
    		                        .setAssetAlias("BTM")
    		                        .setAmount((smile-gas)*bytommargin)
    		        ).build(client);
    		
    		
    		TransactionnoLog.Template singer = new TransactionnoLog.SignerBuilder().sign(client,
    		        controlAddress, passwd);	
    		TransactionnoLog.SubmitResponse txs = TransactionnoLog.submit(client, singer); 
    		TransactionThread transactionThread = new TransactionThread(client,txs.tx_id,smile,fromAmount,toAmount,serverIndex,accountPk,1003);
    		transactionThread.start();
    		return true;
     	}
		catch(Exception e)
		{
			e.printStackTrace();
			logger.error(e);
			return false;
		}
    }  
    
    public boolean btmToSmileTransaction(int serverIndex,int accountPk,String senderId,Long smile,Long fromAmount,Long toAmount,int gas,String passwd)
    {
		try
    	{
			QProperties prop 		= new QProperties();
			String reveiverId = prop.getString("com.funfactory.bytom.accountalias")!=null?prop.getString("com.funfactory.bytom.accountalias"):"vstory";
			String assetAlias		= prop.getString("com.funfactory.bytom.assetalias")!=null?prop.getString("com.funfactory.bytom.assetalias"):"BTM";
			//String passwd			="vstory1234"; 
			int bytommargin			= prop.getInt("com.funfactory.bytom.bytommargin",100000000);
			//logger.info("receiveId value is:" + reveiverId);
			//logger.info("assetAlias value is:" + assetAlias);
			
			System.out.println("=====================================================================");
			System.out.println("btmToSmileTransaction");
			System.out.println("senderId value is::" + senderId);
			System.out.println("senderId value is::" + smile);
			System.out.println("gas value is::" + gas);
			System.out.println("reveiverId value is::" + reveiverId);
			System.out.println("(smileMark+gas)*bytommargin value is::" + (smile+gas)*bytommargin);
			System.out.println("smileMark*bytommargin value is::" + smile*bytommargin);
			System.out.println("passwd value is::" + passwd);
			System.out.println("=====================================================================");
			
			
			Client client = ByTomConnectionUtil.generateClient();
			Account.ReceiverBuilder receiverBuilder =   new Account.ReceiverBuilder().setAccountAlias(reveiverId);
	    	Receiver receiver = receiverBuilder.create(client);	   		
    		String receiverAddress = receiver.address;
    		System.out.println("receiverAddress value is:" + receiverAddress);
    		TransactionnoLog.Template controlAddress = new TransactionnoLog.Builder()
    		        .addAction(
    		                new TransactionnoLog.Action.SpendFromAccount()
    		                        .setAccountAlias(senderId)
    		                        .setAssetAlias(assetAlias)
    		                        .setAmount((smile+gas)*bytommargin)
    		        )
    		        .addAction(
    		                new TransactionnoLog.Action.ControlWithAddress()
    		                        .setAddress(receiverAddress)
    		                        .setAssetAlias(assetAlias)
    		                        .setAmount(smile*bytommargin)
    		        ).build(client);
    		
    		
    		TransactionnoLog.Template singer = new TransactionnoLog.SignerBuilder().sign(client,
    		        controlAddress, passwd);	
    		TransactionnoLog.SubmitResponse txs = TransactionnoLog.submit(client, singer); 
    		TransactionThread transactionThread = new TransactionThread(client,txs.tx_id,smile,fromAmount,toAmount,serverIndex,accountPk,1002);
    		transactionThread.start();
    		return true;
     	}
		catch(Exception e)
		{
			e.printStackTrace();
			logger.error(e);
			return false;
		}
    }  
   
    
    public List<UnspentOutputnoLog> listUtxo()
    {
    	List<UnspentOutputnoLog> unspentOutputList = null;
    	try
    	{
			unspentOutputList = new UnspentOutputnoLog.QueryBuilder().list(client);
    	}
    	catch(BytomException e)
    	{
    		logger.error(e);
    	}
    	return unspentOutputList;
    }      
    
}
