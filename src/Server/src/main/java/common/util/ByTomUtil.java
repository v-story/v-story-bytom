package common.util;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;


import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.log4j.Logger;
import org.json.JSONObject;

import com.bytom.TransactionThread;
import com.bytom.TransactionnoLog;
import com.ndoctor.framework.config.QProperties;

import io.bytom.api.Account;
import io.bytom.api.Balance;
import io.bytom.api.Key;
import io.bytom.api.Receiver;
import io.bytom.http.Client;


public class ByTomUtil {

	Logger logger = Logger.getLogger(ByTomUtil.class);	
	private static ByTomUtil instance = null;
	
	public synchronized static ByTomUtil getInstance()
	{
		if (instance == null)
		{
			instance = new ByTomUtil();
		}
		return instance;	
	}	
	
	public boolean CreateKey(String id,String passwd) 
	{
		try
		{
			Client client = ByTomConnectionUtil.generateClient();
	        Key.Builder builder = new Key.Builder().setAlias(id).setPassword(passwd);
	        Key key = Key.create(client, builder);  
	        
	    	List<String> root_xpubs = new ArrayList<String>();
	    	root_xpubs.add(key.xpub);
	    	return true;
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return false;
		}
	}
	
	public boolean CreateBytomInfo(String id,String passwd)
	{
		Integer quorum = 1;
		try
		{
			//key 생성
			Client client = ByTomConnectionUtil.generateClient();
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
	
	//수정 필요
	public String GetAccountId(String alias)
	{
		String accountId = null;
		try
		{
			Client client = ByTomConnectionUtil.generateClient();
		    List<Account> accountList = Account.list(client);
		    int accountSize = accountList.size();	
		    for(int i=0;i<accountSize;i++)
		    {
		    	Account account = (Account)accountList.get(i);
		    	if(null!=account)
		    	{
		    		if(account.alias.equals(alias))
		    		{
		    			accountId	 = accountList.get(i).id;
		    			break;
		    		}
		    	}
		    	else
		    	{
		    		continue;
		    	}
		    }	
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return accountId;
	}	
	
	//수정 필요
	public String GetAccountAddress(String alias)
	{
		String receiverAddress = null;
		try
		{
			Client client = ByTomConnectionUtil.generateClient();
		    List<Account> accountList = Account.list(client);
		    int accountSize = accountList.size();	
		    for(int i=0;i<accountSize;i++)
		    {
		    	Account account = (Account)accountList.get(i);
		    	if(null!=account)
		    	{
		    		if(account.alias.equals(alias))
		    		{
		    			String id	 = accountList.get(i).id;
		    			Account.ReceiverBuilder receiverBuilder =   new Account.ReceiverBuilder().setAccountAlias(alias).setAccountId(id);
		    			Receiver receiver = receiverBuilder.create(client);
		    			receiverAddress =  receiver.address;
		    			break;
		    		}
		    	}
		    	else
		    	{
		    		continue;
		    	}
		    }	
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return receiverAddress;
	}
	
	public String GetReceiverAddress(String alias)
	{
		String receiverAddress = null;
		try
		{
			Client client = ByTomConnectionUtil.generateClient();
			Account.ReceiverBuilder receiverBuilder =   new Account.ReceiverBuilder().setAccountAlias(alias);
	    	Receiver receiver = receiverBuilder.create(client);		
	    	receiverAddress = receiver.address;
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return receiverAddress;
	}
	
	/*
	public boolean Transaction(int serverIndex,int accountPk,String reveiverId,Long smileMark,Long fromAmount,Long toAmount)
	{
		try
    	{
			QProperties prop 		= new QProperties();
			String sendAccountAlias = prop.getString("com.funfactory.bytom.accountalias")!=null?prop.getString("com.funfactory.bytom.accountalias"):"vstory";
			String assetAlias		= prop.getString("com.funfactory.bytom.assetalias")!=null?prop.getString("com.funfactory.bytom.assetalias"):"BTM";
			String passwd			="vstory1234"; 
			System.out.println("sendAccountAlias value is:" + sendAccountAlias);
			System.out.println("assetAlias value is:" + assetAlias);
			Client client = ByTomConnectionUtil.generateClient();
			Account.ReceiverBuilder receiverBuilder =   new Account.ReceiverBuilder().setAccountAlias(reveiverId);
	    	Receiver receiver = receiverBuilder.create(client);	   		
    		String receiverAddress = receiver.address;
    		System.out.println("receiverAddress value is:" + receiverAddress);
    		TransactionnoLog.Template controlAddress = new TransactionnoLog.Builder()
    		        .addAction(
    		                new TransactionnoLog.Action.SpendFromAccount()
    		                        .setAccountAlias(sendAccountAlias)
    		                        .setAssetAlias("BTM")
    		                        .setAmount(fromAmount)
    		        )
    		        .addAction(
    		                new TransactionnoLog.Action.ControlWithAddress()
    		                        .setAddress(receiverAddress)
    		                        .setAssetAlias("BTM")
    		                        .setAmount(toAmount)
    		        ).build(client);
    		
    		
    		TransactionnoLog.Template singer = new TransactionnoLog.SignerBuilder().sign(client,
    		        controlAddress, passwd);	
    		TransactionnoLog.SubmitResponse txs = TransactionnoLog.submit(client, singer); 
    		TransactionThread transactionThread = new TransactionThread(client,txs.tx_id,smileMark,fromAmount,toAmount,serverIndex,accountPk);
    		transactionThread.start();
    		return true;
     	}
		catch(Exception e)
		{
			e.printStackTrace();
			return false;
		}
	}
	*/
	
	public String checkSyncServer(Long smileMark,Long fromAmount,Long toAmount,int serverIndex,int accountPk,int opCode)
	{
    	JSONObject jsonObject = new JSONObject();
    	jsonObject.put("opCode",	 opCode);
    	jsonObject.put("accountPk", accountPk);
    	jsonObject.put("serverIndex", serverIndex);
    	jsonObject.put("bytom", toAmount);
    	jsonObject.put("smile", smileMark);
    	String rawData = "jsondata = " + jsonObject.toString();
    	System.out.println("###rawData:"+rawData);    	
    	HttpClient httpClient = null;
    	HttpResponse response = null;
    	HttpPost postRequest  = null;	
    	//httpClient = new DefaultHttpClient();
        httpClient  = HttpConnectionUtil.getHttpClient();
    	try {
        	//HttpPost postRequest = new HttpPost("http://192.168.1.151:8086"); // session server (webserver)
    		QProperties prop = new QProperties();
    		String syncserver = prop.getString("com.funfactory.syncserver.http","http://172.27.30.214:8087");
    		System.out.println("########### syncserver:"+syncserver);        	
        	postRequest = new HttpPost(syncserver); // session server (webserver)
            RequestConfig requestConfig = RequestConfig.custom()
            		  .setSocketTimeout(5*1000)
            		  .setConnectTimeout(5*1000)
            		  .setConnectionRequestTimeout(5*1000)
            		  .build();
              postRequest.setConfig(requestConfig);        	
        	
        	
            postRequest.setHeader("Content-type", "application/json");
            StringEntity entity = new StringEntity(rawData);

            final RequestConfig params = RequestConfig.custom().setConnectTimeout(10*1000).setSocketTimeout(10*1000).build();
            postRequest.setConfig(params);
            postRequest.setEntity(entity);

            long startTime = System.currentTimeMillis();
            response = httpClient.execute(postRequest);
            long elapsedTime = System.currentTimeMillis() - startTime;
            /*
            StatusLine statusLine = response.getStatusLine();
            // ?�러 발생
         	if (statusLine.getStatusCode() < 200 || statusLine.getStatusCode() >= 300) {
         		throw new Exception(statusLine.getStatusCode(), getReason(response));
         	}
         	*/
            InputStream is = response.getEntity().getContent();
            Reader reader = new InputStreamReader(is);
            BufferedReader bufferedReader = new BufferedReader(reader);
            StringBuilder builder = new StringBuilder();
            while (true) {
                try {
                    String line = bufferedReader.readLine();
                    if (line != null) {
                        builder.append(line);
                    } else {
                        break;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            //System.out.println(builder.toString());
            //System.out.println("****************");
            return builder.toString();
        } catch (Exception ex) {
        	HttpConnectionUtil.abort(postRequest);
        	ex.printStackTrace();
            return null;
        }
    	finally
    	{
    		HttpConnectionUtil.release(response);
    	}
	}	
	
}
