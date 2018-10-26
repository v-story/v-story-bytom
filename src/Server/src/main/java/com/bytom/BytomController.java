package com.bytom;

import static spark.Spark.get;
import static spark.Spark.post;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.json.JSONObject;

import com.ndoctor.framework.config.QProperties;

import common.IConstants;
import common.MsgConstants;
import common.util.ByTomConnectionUtil;
import common.util.ByTomUtil;
import common.util.JQGridDataUtil;
import common.util.JsonUtilManager;
import common.util.LoginUtil;
import common.util.StringUtil;
import io.bytom.api.Transaction;
import io.bytom.http.Client;
import login.UserSession;

public class BytomController
{
	private BytomModel bytomModel;
	private StringUtil stringUtil 	= StringUtil.getInstance(); 
	Logger logger 					= Logger.getLogger(this.getClass());
	
	public BytomController(BytomModel bytomModel) 
	{
		System.out.println("BytomController!!!!");
		
		this.bytomModel = bytomModel;
		get("/testBytomController", 
				(req, res) -> 
				{
					return "test...BytomController";
				}
		);	
		
		
		get("/getBtmUserInfo",(req, res) 		-> { return getBtmUserInfo(req, res); } );
		post("/getBtmUserInfo",(req, res) 		-> { return getBtmUserInfo(req, res); } );			

		get("/listBalance",(req, res) 			-> { return listBalance(req, res); } );
		post("/listBalance",(req, res) 			-> { return listBalance(req, res); } );		
		
		get("/getBalance",(req, res) 			-> { return getBalance(req, res); } );
		get("/getBalance",(req, res) 			-> { return getBalance(req, res); } );			
		

		get("/listTransaction",(req, res) 		-> { return listTransaction(req, res); } );
		get("/listTransaction",(req, res) 		-> { return listTransaction(req, res); } );
		
		get("/getTransaction",(req, res) 		-> { return getTransaction(req, res); } );
		get("/getTransaction",(req, res) 		-> { return getTransaction(req, res); } );	

		get("/listSmileTransaction",(req, res) 	-> { return listSmileTransaction(req, res); } );
		get("/listSmileTransaction",(req, res) 	-> { return listSmileTransaction(req, res); } );
		
		get("/smileToBtmTransaction",(req, res) -> { return smileToBtmTransaction(req, res); } );
		get("/smileToBtmTransaction",(req, res) -> { return smileToBtmTransaction(req, res); } );		
		
		get("/btmToSmileTransaction",(req, res) -> { return btmToSmileTransaction(req, res); } );
		get("/btmToSmileTransaction",(req, res) -> { return btmToSmileTransaction(req, res); } );	
		
		post("/listUtxo",(req, res) 			-> { return listUtxo(req, res); } );		
		get("/listUtxo",(req, res) 				-> { return listUtxo(req, res); } );
		
	}
	

	public String getBtmUserInfo(spark.Request req, spark.Response res)
	{
		String json = null;
		List<UserBalance> userBalanceList = null;
		BtmUserInfo btmUserInfo = null;
		Map<String, Object> rtMap = new HashMap<String, Object>();
		try
		{
			UserSession userSession = LoginUtil.getUserSession(req);
			if(null==userSession)
			{
				btmUserInfo = new BtmUserInfo();
				btmUserInfo.setResult(IConstants.FAIL);
				return JsonUtilManager.getInstance().render(btmUserInfo);

			}
			String id = userSession.getID();
			int accountpk = userSession.getACCOUNTPK();
			btmUserInfo = bytomModel.getBtmUserInfo(accountpk,id);
			if(null == btmUserInfo)
			{
				btmUserInfo = new BtmUserInfo();
				btmUserInfo.setResult(IConstants.FAIL);
				return JsonUtilManager.getInstance().render(btmUserInfo);
			}
			else
			{	
				
				QProperties prop = new QProperties();
				int bytomMargin = prop.getInt("com.funfactory.bytom.bytommargin", 100000000);
				List<BalancenoLog> balanceList = bytomModel.getBalanceList(id);
				
				if(null!=balanceList)
				{
					
					if(0==balanceList.size())
					{
						btmUserInfo.setBTM((double)0);
						btmUserInfo.setBTM_ACCOUNT_ID(bytomModel.getBtmAccountAlias(id));
					}					
					else
					{	
						userBalanceList = new ArrayList<UserBalance>();
						//DecimalFormat format = new DecimalFormat(".##########");
						for (BalancenoLog result : balanceList)
						{
							if(id.equals(result.accountAlias))
							{	
								if(id.equals(result.accountAlias) && "BTM".equals(result.assetAlias))
								{	
									btmUserInfo.setBTM((double)result.amount/bytomMargin);
									btmUserInfo.setBTM_ACCOUNT_ID(result.accountId);
									break;
								}
							}	
						}
					}	
					Integer smile = bytomModel.getSmile(accountpk);
					JSONObject jsonObject = new JSONObject();
					jsonObject.put("RESULT", IConstants.SUCCESS);
					jsonObject.put("ACCOUNTID", btmUserInfo.getACCOUNT_ID());
					jsonObject.put("GENDER", btmUserInfo.getGENDER());
					jsonObject.put("INTRODUCE", btmUserInfo.getINTRODUCE());
					jsonObject.put("PROF_PIC_NM", btmUserInfo.getPROF_PIC_NM());
					jsonObject.put("BTM", btmUserInfo.getBTM());	
					jsonObject.put("BTM_ACCOUNT_ID", btmUserInfo.getBTM_ACCOUNT_ID());	
					jsonObject.put("SMILE", smile);	
					json = jsonObject.toString();
					return json;
				}
				else
				{
					btmUserInfo = new BtmUserInfo();
					btmUserInfo.setResult(IConstants.FAIL);
					return JsonUtilManager.getInstance().render(btmUserInfo);					
					
				}
			}
		}
		catch(Exception e)
		{
			btmUserInfo = new BtmUserInfo();
			btmUserInfo.setResult(IConstants.FAIL);
			return JsonUtilManager.getInstance().render(btmUserInfo);	
		}

	}	
	
	public String listBalance(spark.Request req, spark.Response res)
	{
		List<UserBalance> userBalanceList = null;
		Map<String, Object> rtMap = new HashMap<String, Object>();
		try
		{
			UserSession userSession = LoginUtil.getUserSession(req);
			if(null==userSession)
			{
				rtMap.put("result", IConstants.FAIL);
				rtMap.put("message", "SESSIONS IS NULL");//"Success.");

			}
			String id = userSession.getID();
			List<BalancenoLog> balanceList = bytomModel.getBalanceList(id);
			QProperties prop = new QProperties();
			int bytomMargin = prop.getInt("com.funfactory.bytom.bytommargin", 100000000);
			int smileMargin = prop.getInt("com.funfactory.bytom.smilemargin", 1);
			if(null!=balanceList)
			{
				userBalanceList = new ArrayList<UserBalance>();
				//DecimalFormat format = new DecimalFormat(".##########");
				for (BalancenoLog result : balanceList)
				{
					if(id.equals(result.accountAlias))
					{	
						
						System.out.println("amount value is::" + result.amount/bytomMargin);
						UserBalance userBalance = new UserBalance();
						userBalance.setACCOUNT_ALIAS(result.accountAlias);
						
						
						/*
						int decimals = ((Double)result.definition.get("decimals")).intValue();
						int a = ((Double)result.definition.get("decimals")).intValue();
						int decimals = 0;
						Double aa = ((Double)result.definition.get("decimals"));
						int a = aa.intValue();
						System.out.println("aaa value is::" + a);
						*/
						//String decimals = StringUtil.getInstance().padLeftZeros("1",((Double)result.definition.get("decimals")).intValue());
						//String decimalsStr = StringUtil.getInstance().padLeftZeros("1",a);
						//System.out.println("aaa value is::" +decimalsStr );	
						if(result.assetAlias.equals("SMILE"))
							userBalance.setAMOUNT((double)result.amount/smileMargin);
						else
							userBalance.setAMOUNT((double)result.amount/bytomMargin);
						userBalance.setASSET_ALIAS(result.assetAlias);
						userBalance.setASSET_ID(result.assetId);
						userBalanceList.add(userBalance);
					}	
				}
				rtMap = JQGridDataUtil.getInstance().GetJqgridMap(1, userBalanceList.size(), userBalanceList.size(), userBalanceList);
				rtMap.put("result", IConstants.SUCCESS);
				rtMap.put("message", MsgConstants.SUCCESS);//"Success.");
			}
		}
		catch(Exception e)
		{
			rtMap.put("result", IConstants.FAIL);
			rtMap.put("message", e.getMessage());//"Success.");
		}
		return JsonUtilManager.getInstance().render(rtMap);
	}	
	
	public String getBalance(spark.Request req, spark.Response res)
	{
		List<UserBalance> userBalanceList = null;
		Map<String, Object> rtMap = new HashMap<String, Object>();
		UserBalance parameter = new UserBalance();
		UserBalance userBalance = null;
		try
		{
			UserSession userSession = LoginUtil.getUserSession(req);
			if(null==userSession)
			{
				userBalance = new UserBalance();
				userBalance.setResult(IConstants.FAIL);
				return JsonUtilManager.getInstance().render(userBalance);

			}
			String id = userSession.getID();
			List<BalancenoLog> balanceList = bytomModel.getBalanceList(id);
			QProperties prop = new QProperties();
			int bytomMargin = prop.getInt("com.funfactory.bytom.bytommargin", 100000000);
			int smileMargin = prop.getInt("com.funfactory.bytom.smilemargin", 1);
			String assetAlias	= prop.getString("com.funfactory.bytom.assetalias", "BTM");
			
			System.out.println("balanceList value is:" + balanceList);
			
			if(null!=balanceList)
			{
				Integer smile = 0;
				int accountpk = userSession.getACCOUNTPK();
				if(0==balanceList.size())
				{
					smile = bytomModel.getSmile(accountpk);
					JSONObject jsonObject = new JSONObject();
					jsonObject.put("RESULT", IConstants.SUCCESS);
					jsonObject.put("BTM", 0);
					jsonObject.put("SMILE", smile);
					return jsonObject.toString();					
				}
				//userBalanceList = new ArrayList<UserBalance>();
				for (BalancenoLog result : balanceList)
				{
					if(id.equals(result.accountAlias) && assetAlias.equals(result.assetAlias))
					{	
						userBalance = new UserBalance();
						userBalance.setACCOUNT_ALIAS(result.accountAlias);
						userBalance.setAMOUNT((double)result.amount/bytomMargin);						
						userBalance.setAMOUNT((double)result.amount/(double)bytomMargin);
						userBalance.setASSET_ALIAS(result.assetAlias);
						userBalance.setASSET_ID(result.assetId);
						break;
					}	
					else
					{
						
					}
				}
				if(null!=userBalance)
				{	
					
					smile = bytomModel.getSmile(accountpk);
					JSONObject jsonObject = new JSONObject();
					jsonObject.put("RESULT", IConstants.SUCCESS);
					jsonObject.put("BTM", userBalance.getAMOUNT());
					jsonObject.put("SMILE", smile);
					return jsonObject.toString();
				}
				else
				{
					userBalance = new UserBalance();
					userBalance.setResult(IConstants.FAIL);
					return JsonUtilManager.getInstance().render(userBalance);					
				}
			}
			else
			{
				userBalance = new UserBalance();
				userBalance.setResult(IConstants.FAIL);
				return JsonUtilManager.getInstance().render(userBalance);	
			}
		}
		catch(Exception e)
		{
			userBalance = new UserBalance();
			userBalance.setResult(IConstants.FAIL);
			return JsonUtilManager.getInstance().render(userBalance);
		}
	}	

	public String listTransaction(spark.Request req, spark.Response res)
	{
		List<UserTransaction> userTransactionList = null;
		Map<String, Object> rtMap = new HashMap<String, Object>();
		try
		{
			QProperties prop 		= new QProperties();
			UserSession userSession = LoginUtil.getUserSession(req);
			if(null==userSession)
			{
				rtMap.put("result", IConstants.FAIL);
				rtMap.put("message", "SESSIONS IS NULL");//"Success.");

			}
			String id = userSession.getID();
			List<TransactionnoLog> transactionList = bytomModel.listTransaction(id);
			if(null!=transactionList)
			{
				int bytomMargin = prop.getInt("com.funfactory.bytom.bytommargin", 100000000);
				userTransactionList = new ArrayList<UserTransaction>();
				
				for (TransactionnoLog result : transactionList)
				{
					UserTransaction userTransaction = new UserTransaction();
					userTransaction.setTX_ID(result.txId);
					String vstoryAccountId = prop.getString("com.funfactory.bytom.accountalias")!=null?prop.getString("com.funfactory.bytom.accountalias"):"vstory";
					if( vstoryAccountId.equals(result.inputs.get(0).accountAlias))	// Smile -> BTM
					{	
						long inputAmount = 0;
						for(int ii=0;ii<result.inputs.size();++ii)
						{
							if( result.inputs.get(ii).assetAlias.equals("BTM"))
								inputAmount += result.inputs.get(ii).amount;
						}
						long iNum = 0;
						for(int ii=0;ii<result.outputs.size();++ii)
						{
							if( result.outputs.get(ii).accountAlias.equals(vstoryAccountId))
							{
								iNum = result.outputs.get(ii).amount;
								
								break; 
							}
						}
						userTransaction.setSMILE( ((inputAmount - iNum) / bytomMargin) * -1 );
						for(int ii=0;ii<result.outputs.size();++ii)
						{
							if( !result.outputs.get(ii).accountAlias.equals(vstoryAccountId))
							{
								userTransaction.setTOAMOUNT(result.outputs.get(ii).amount / bytomMargin);
								break;
							}
						}
					}
					else	// BTM -> Smile 
					{
						long inputAmount = 0;
						for(int ii=0;ii<result.inputs.size();++ii)
						{
							if( result.inputs.get(ii).assetAlias.equals("BTM"))
								inputAmount += result.inputs.get(ii).amount;
						}
						for(int ii=0;ii<result.outputs.size();++ii)
						{
							if( result.outputs.get(ii).accountAlias.equals(vstoryAccountId))
							{
								userTransaction.setSMILE(result.outputs.get(ii).amount / bytomMargin);
								break;
							}
						}
						long iNum = 0;
						for(int ii=0;ii<result.outputs.size();++ii)
						{
							if( !result.outputs.get(ii).accountAlias.equals(vstoryAccountId))
							{
								iNum = result.outputs.get(ii).amount;
								break;
							}
						}
						userTransaction.setTOAMOUNT(((inputAmount - iNum) / bytomMargin) * -1);
					}
					if( result.blockHeight!= 0)
						userTransaction.setSTATE(1);
					else
						userTransaction.setSTATE(0);
					
					userTransactionList.add(userTransaction);
				}
				
				rtMap = JQGridDataUtil.getInstance().GetJqgridMap(1, userTransactionList.size(), userTransactionList.size(), userTransactionList);
				rtMap.put("result", IConstants.SUCCESS);
				rtMap.put("message", MsgConstants.SUCCESS);//"Success.");				
			}
		}
		catch(Exception e)
		{
			rtMap.put("result", IConstants.FAIL);
			rtMap.put("message", e.getMessage());//"Success.");
		}
		return JsonUtilManager.getInstance().render(rtMap);
	}	
	
	public String getTransaction(spark.Request req, spark.Response res)
	{
		UserTransaction parameter = new UserTransaction();
		parameter = (UserTransaction)stringUtil.ParamObject(req,parameter);
		if(null == parameter || !parameter.isValid(IConstants.SELECT_GET_CHECK))		
		{			
			return JsonUtilManager.getInstance().renderNoData(IConstants.FAIL, MsgConstants.ERROR_PARAMETER);//"Parameter Error.");
		}		
		
		Map<String, Object> rtMap = new HashMap<String, Object>();
		try
		{
			UserSession userSession = LoginUtil.getUserSession(req);
			if(null==userSession)
			{
				rtMap.put("result", IConstants.FAIL);
				rtMap.put("message", "SESSIONS IS NULL");//"Success.");

			}
			Transaction trans =  bytomModel.getTransaction(parameter.getTX_ID());
			if(null!=trans)
				return trans.toJson();
			else
				rtMap.put("result", IConstants.FAIL);
		}
		catch(Exception e)
		{
			logger.error(e);
			rtMap.put("result", IConstants.FAIL);
		}
		return JsonUtilManager.getInstance().render(rtMap);
	}
		
	
	public String listSmileTransaction(spark.Request req, spark.Response res)
	{
		List<UserTransaction> userTransactionList = null;
		Map<String, Object> rtMap = new HashMap<String, Object>();
		try
		{
			UserSession userSession = LoginUtil.getUserSession(req);
			if(null==userSession)
			{
				rtMap.put("result", IConstants.FAIL);
				rtMap.put("message", "SESSIONS IS NULL");//"Success.");

			}
			String id = userSession.getID();
			//String bytomId = ByTomUtil.getInstance().GetAccountId(id);
			
			String bytomId =  bytomModel.getBtmAccountAlias(id);
			
			Client client = ByTomConnectionUtil.generateClient();
			List<TransactionnoLog> transactionList = new TransactionnoLog.QueryBuilder().setAccountId(bytomId).listByAccountId(client);
			if(null!=transactionList)
			{
				userTransactionList = new ArrayList<UserTransaction>();
				for (TransactionnoLog result : transactionList)
				{
					System.out.println("============================================");
					System.out.println(result.toJson());
					System.out.println("============================================");
					UserTransaction userTransaction = new UserTransaction();
					userTransaction.setTX_ID(result.txId);
					userTransactionList.add(userTransaction);
				}
				rtMap = JQGridDataUtil.getInstance().GetJqgridMap(1, userTransactionList.size(), userTransactionList.size(), userTransactionList);
				rtMap.put("result", IConstants.SUCCESS);
				rtMap.put("message", MsgConstants.SUCCESS);//"Success.");				
			}
		}
		catch(Exception e)
		{
			rtMap.put("result", IConstants.FAIL);
			rtMap.put("message", e.getMessage());//"Success.");
		}
		return JsonUtilManager.getInstance().render(rtMap);
	}	

	public String smileToBtmTransaction(spark.Request req, spark.Response res)
	{
		UserTransaction parameter = new UserTransaction();
		parameter = (UserTransaction)stringUtil.ParamObject(req,parameter);
		if(null == parameter || !parameter.isValid(IConstants.INSERT_CHECK))		
		{			
			return JsonUtilManager.getInstance().renderNoData(IConstants.FAIL, MsgConstants.ERROR_PARAMETER);//"Parameter Error.");
		}		
		
		Map<String, Object> rtMap = new HashMap<String, Object>();
		try
		{
			UserSession userSession = LoginUtil.getUserSession(req);
			int	accountPk			= userSession.getACCOUNTPK();
			if(null==userSession)
			{
				rtMap.put("result", IConstants.FAIL);
				rtMap.put("message", "SESSIONS IS NULL");//"Success.");
			}
			String reveiverId = userSession.getID();
			//Client client = ByTomConnectionUtil.generateClient();
			
			parameter.setTOAMOUNT(parameter.getSMILE());
			
			boolean transResult = bytomModel.smileToBtmTransaction(parameter.getSERVERINDEX(),accountPk,reveiverId,parameter.getSMILE(),parameter.getAMOUNT(), parameter.getTOAMOUNT(),parameter.getGAS());
			if(transResult)
				rtMap.put("result", IConstants.SUCCESS);
			else
				rtMap.put("result", IConstants.FAIL);
		}
		catch(Exception e)
		{
			rtMap.put("result", IConstants.FAIL);
			rtMap.put("message", e.getMessage());//"Success.");
		}
		return JsonUtilManager.getInstance().render(rtMap);
	}	
	
	
	public String btmToSmileTransaction(spark.Request req, spark.Response res)
	{
		UserTransaction parameter = new UserTransaction();
		parameter = (UserTransaction)stringUtil.ParamObject(req,parameter);
		if(null == parameter || !parameter.isValid(IConstants.INSERT_CHECK))		
		{			
			return JsonUtilManager.getInstance().renderNoData(IConstants.FAIL, MsgConstants.ERROR_PARAMETER);//"Parameter Error.");
		}		
		
		Map<String, Object> rtMap = new HashMap<String, Object>();
		try
		{
			UserSession userSession = LoginUtil.getUserSession(req);
			int	accountPk			= userSession.getACCOUNTPK();
			String passwd			= userSession.getPASSWD();
			if(null==userSession)
			{
				rtMap.put("result", IConstants.FAIL);
				rtMap.put("message", "SESSIONS IS NULL");//"Success.");
			}
			String reveiverId = userSession.getID();
			//Client client = ByTomConnectionUtil.generateClient();
			parameter.setTOAMOUNT(parameter.getSMILE());
			//parameter.setAMOUNT(parameter.getSMILEMARK());
			
			boolean transResult = bytomModel.btmToSmileTransaction(parameter.getSERVERINDEX(),accountPk,reveiverId,parameter.getSMILE(),parameter.getAMOUNT(), parameter.getTOAMOUNT(),parameter.getGAS(),passwd);
			if(transResult)
				rtMap.put("result", IConstants.SUCCESS);
			else
				rtMap.put("result", IConstants.FAIL);
		}
		catch(Exception e)
		{
			rtMap.put("result", IConstants.FAIL);
			rtMap.put("message", e.getMessage());//"Success.");
		}
		return JsonUtilManager.getInstance().render(rtMap);
	}		
	
	
	public String listUtxo(spark.Request req, spark.Response res)
	{
		List<UserUtxo> userUtxoList = null;
		Map<String, Object> rtMap = new HashMap<String, Object>();
		try
		{
			UserSession userSession = LoginUtil.getUserSession(req);
			if(null==userSession)
			{
				rtMap.put("result", IConstants.FAIL);
				rtMap.put("message", "SESSIONS IS NULL");//"Success.");

			}
			String id = userSession.getID();
			Client client = ByTomConnectionUtil.generateClient();
			List<UnspentOutputnoLog> utxoList = bytomModel.listUtxo();
			if(null!=utxoList)
			{
				userUtxoList = new ArrayList<UserUtxo>();
				for (UnspentOutputnoLog result : utxoList)
				{
					if(id.equals(result.accountAlias))
					{	
						UserUtxo userUtxo = new UserUtxo();
						userUtxo.setACCOUNT_ALIAS(result.accountAlias);
						userUtxo.setAMOUNT((double)result.amount);
						userUtxo.setASSET_ALIAS(result.assetAlias);
						userUtxo.setASSET_ID(result.assetId);
						userUtxo.setACCOUNT_ID(result.accountId);
						userUtxo.setCONTROL_PROGRAM(result.program);
						userUtxo.setPROGRAM_INDEX(result.controlProgramIndex);
						userUtxo.setSOURCE_ID(result.sourceId);
						userUtxo.setSOURCE_POSITION(result.sourcePos);
						userUtxo.setSOURCE_CHANGE(result.change);
						userUtxoList.add(userUtxo);
					}	
				}
				rtMap = JQGridDataUtil.getInstance().GetJqgridMap(1, userUtxoList.size(), userUtxoList.size(), userUtxoList);
				rtMap.put("result", IConstants.SUCCESS);
				rtMap.put("message", MsgConstants.SUCCESS);//"Success.");
			}
			else
			{
				rtMap.put("result", IConstants.FAIL);
			}
		}
		catch(Exception e)
		{
			logger.error(e);
			rtMap.put("result", IConstants.FAIL);
		}
		return JsonUtilManager.getInstance().render(rtMap);
	}	
	
}
