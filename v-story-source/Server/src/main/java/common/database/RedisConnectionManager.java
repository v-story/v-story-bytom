package common.database;

import com.ndoctor.framework.config.QProperties;

import common.IConstants;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

public class RedisConnectionManager
{
	private static RedisConnectionManager redisConnectionManager;
	private JedisPoolConfig config = new JedisPoolConfig();
	private JedisPool redisPool		= null;
	private QProperties prop 		= null;
	private String propPath			= null;	
	private RedisConnectionManager()
	{
		try
		{
			String osName = System.getProperty("os.name");
			if(osName.startsWith("Windows"))
				propPath = IConstants.WINDOW_CONTEXT_PATH + "webapps/funfactory-1.0/WEB-INF/classes/conf/wincsweb.properties";
			else
				propPath = IConstants.LINUX_CONTEXT_PATH + "webapps/funfactory-1.0/WEB-INF/classes/conf/lincsweb.properties";
			prop = new QProperties(propPath);
			/*
			System.out.println("=========================================");
			System.out.println("com.funfactory.redis.maxtotal" + prop.getInt("com.funfactory.redis.maxtotal", 30));
			System.out.println("=========================================");
			*/
			config.setMaxTotal(prop.getInt("com.funfactory.redis.maxtotal", 30));
			redisPool = new JedisPool(config, prop.getString("com.funfactory.redis.host","172.27.30.37")  ,prop.getInt("com.funfactory.redis.port", 6379) );
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
	}
	
	public static RedisConnectionManager getInstance()
	{
		if(null == redisConnectionManager)
		{
			redisConnectionManager = new RedisConnectionManager();
		}
		return redisConnectionManager;
	}
	
	public Jedis getConnection()
	{
		if (redisPool == null) 
		{
			config.setMaxTotal(prop.getInt("com.funfactory.redis.maxtotal", 30));
			redisPool = new JedisPool(config, prop.getString("com.funfactory.redis.host","172.27.30.228")  ,prop.getInt("com.funfactory.redis.port", 6379) );
			//redisPool = new JedisPool(config,"172.27.30.36", 6379);
		}
		return redisPool.getResource();
	}	
	
	public void redisSet(String key,String value)
	{
		Jedis jedis = RedisConnectionManager.getInstance().getConnection();
		jedis.set(key,value);
		RedisConnectionManager.getInstance().freeJedis(jedis);		
	}
	
	public void redisSessionSet(String key,String value)
	{
		Jedis jedis = RedisConnectionManager.getInstance().getConnection();
		jedis.set(key,value);
		jedis.expire(key, 60);
		RedisConnectionManager.getInstance().freeJedis(jedis);		
	}	
	
	public void redisSessionDel(String key)
	{
		Jedis jedis = RedisConnectionManager.getInstance().getConnection();
		jedis.del(key);
		RedisConnectionManager.getInstance().freeJedis(jedis);		
	}		
	
	public String redisGet(String key)
	{
		String value = null;
		try
		{
			Jedis jedis = RedisConnectionManager.getInstance().getConnection();
			value = jedis.get(key);
			RedisConnectionManager.getInstance().freeJedis(jedis);		
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return value;
	}
	
	public void freeJedis(Jedis jedis)
	{
		redisPool.returnResource(jedis);
		
	}	
	
	public void releaseConnection(Jedis jedis, boolean isBroken, String val)
	{
		/*
	    if (jedis == null) return;
	    if (pool != null) {
	        synchronized (jedis) {
	            if (isBroken) {
	                pool.returnBrokenResource(jedis);
	            } else {
	                pool.returnResource(jedis);
	            }
	            checkedOutJedises.remove(jedis);
	        }
	    }
	     else {
	        logger.warn("attempted to return a broken jedis: " + jedis.toString() + " that wasn't checked out");
	    }
	    */		
	}
}
