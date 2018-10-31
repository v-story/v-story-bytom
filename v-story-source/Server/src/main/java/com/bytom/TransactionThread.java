package com.bytom;

import com.ndoctor.framework.config.QProperties;

import common.util.ByTomUtil;
import io.bytom.api.Transaction;
import io.bytom.http.Client;

public class TransactionThread extends Thread
{
	private Client client;
	private String txId;
	private Long smileMark;
	private Long fromAmount;
	private Long toAmount;
	private int serverIndex;
	private int accountPk;
	private	int opCode;
	
    public TransactionThread(Client client,String txId,Long smileMark,Long fromAmount,Long toAmount,int serverIndex,int accountPk,int opCode)
    {
        
    	this.client 		= client;
    	this.txId 			= txId;
    	this.smileMark 		= smileMark;
    	this.fromAmount 	= fromAmount;
    	this.toAmount		= toAmount;
    	this.serverIndex 	= serverIndex;
    	this.accountPk		= accountPk;
    	this.opCode			= opCode;
    }	
    
    public void run() 
    {
    	boolean runnning = true;
    	int cnt					= 0;
    	int transcheckretry		= 0;
    	int checksleep			= 60000;
    	
    	QProperties prop = null;
		try
		{
			prop 		= new QProperties();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		checksleep			= prop.getInt("com.funfactory.bytom.checksleep",60000);
		transcheckretry		= prop.getInt("com.funfactory.bytom.transcheckretry",10); 	
		System.out.println("=========================================");
		System.out.println("checksleep value is ::"+checksleep);
		System.out.println("transcheckretry value is ::"+transcheckretry);
		System.out.println("=========================================");
    	
    	while(runnning)
    	{
    		try
    		{
	    		Transaction trans = new Transaction.QueryBuilder().setTxId(txId).get(client);
	    		cnt++;
	    		if(trans.blockHeight!=0)
	    		{
	    			System.out.println("=========================================");
	    			System.out.println("Transaction Complete");
	    			System.out.println("=========================================");
	    			String strRt = ByTomUtil.getInstance().checkSyncServer(smileMark,fromAmount,toAmount,serverIndex,accountPk,opCode);
	    			
	    			runnning = false;
	    		}
	    		if(cnt > transcheckretry)
	    		{	
	    			runnning = false;
	    			System.out.println("=========================================");
	    			System.out.println("Loop Cnt Limit");
	    			System.out.println("=========================================");	    			
	    		}
	    		sleep(checksleep);
    		}
    		catch(Exception e)
    		{
    			e.printStackTrace();
    		}
    	}
    }
}
