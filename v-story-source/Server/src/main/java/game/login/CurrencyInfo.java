package game.login;

import common.CommonResult;
import lombok.Getter;
import lombok.Setter;

public class CurrencyInfo extends CommonResult  {
	
	private static final long serialVersionUID = 79335586256L;
	
	public CurrencyInfo()
	{
		STAR_CNT = 0;
		GOLD_CNT = 0;
		RUBY_CNT = 0;
		HEART_CNT = 0;
		COIN_CNT = 0;
		SMILE_CNT = 0;
		RUBY_FREE_CNT = 0;
		SMILE_FREE_CNT = 0;
	}
	public void Reset()
	{
		STAR_CNT = 0;
		GOLD_CNT = 0;
		RUBY_CNT = 0;
		HEART_CNT = 0;
		COIN_CNT = 0;
		SMILE_CNT = 0;
		RUBY_FREE_CNT = 0;
		SMILE_FREE_CNT = 0;
	}
	@Getter @Setter
	Integer STAR_CNT;
	
	@Getter @Setter
	Integer GOLD_CNT;
	
	@Getter @Setter
	Integer RUBY_CNT;
	
	@Getter @Setter
	Integer COIN_CNT;
	
	@Getter @Setter
	Integer HEART_CNT;
	
	@Getter @Setter
	Integer SMILE_CNT;
	
	@Getter @Setter
	Integer RUBY_FREE_CNT;
	
	@Getter @Setter
	Integer SMILE_FREE_CNT;
	
	
	public String listString()
	{
		String tempStr = "["+STAR_CNT + "," + GOLD_CNT + "," + RUBY_CNT + "," + COIN_CNT + "," + HEART_CNT + "," + SMILE_CNT + "," + RUBY_FREE_CNT + "," + SMILE_FREE_CNT+"]";
		
		return tempStr;
	}
	public boolean chkPrice(Integer currencyType, Integer currency) 	
	{ 
		if( currencyType == 1001)
		{
			return STAR_CNT >= currency;
		}
		else if( currencyType == 1002)
		{
			return GOLD_CNT >= currency;
		}
		else if( currencyType == 1003)
		{
			return RUBY_CNT >= currency;
		}
		else if( currencyType == 1004)
		{
			return HEART_CNT >= currency;
		}
		else if( currencyType == 1005)
		{
			return COIN_CNT >= currency;
		}
		else if( currencyType == 1006)
		{
			return SMILE_CNT >= currency;
		}
		else if( currencyType == 1013)
		{
			return RUBY_FREE_CNT >= currency;
		}
		else if( currencyType == 1014)
		{
			return SMILE_FREE_CNT >= currency;
		}
		return false;
	}
	public Integer minusPrice(Integer currencyType, Integer currency) 	
	{ 
		if( currencyType == 1001)
		{
			if( STAR_CNT >= currency)
			{
				STAR_CNT -= currency;
				return STAR_CNT;
			}
		}
		else if( currencyType == 1002)
		{
			if(GOLD_CNT >= currency)
			{
				GOLD_CNT -= currency;
				return GOLD_CNT;
			}
		}
		else if( currencyType == 1003)
		{
			if(RUBY_CNT >= currency)
			{
				RUBY_CNT -= currency;
				return RUBY_CNT;
			}
		}
		else if( currencyType == 1004)
		{
			if(HEART_CNT >= currency)
			{
				HEART_CNT -= currency;
				return HEART_CNT;
			}
		}
		else if( currencyType == 1005)
		{
			if(COIN_CNT >= currency)
			{
				COIN_CNT -= currency;
				return COIN_CNT;
			}
		}
		else if( currencyType == 1006)
		{
			if(SMILE_CNT >= currency)
			{
				SMILE_CNT -= currency;
				return SMILE_CNT;
			}
		}
		else if( currencyType == 1013)
		{
			if(RUBY_FREE_CNT >= currency)
			{
				RUBY_FREE_CNT -= currency;
				return RUBY_FREE_CNT;
			}
		}
		else if( currencyType == 1014)
		{
			if(SMILE_FREE_CNT >= currency)
			{
				SMILE_FREE_CNT -= currency;
				return SMILE_FREE_CNT;
			}
		}
		return -1;
	}
	public Integer plusPrice(Integer currencyType, Integer currency) 	
	{ 
		if( currencyType == 1001)
		{
			STAR_CNT += currency;
			return STAR_CNT;
		}
		else if( currencyType == 1002)
		{
			GOLD_CNT += currency;
			return GOLD_CNT;
		}
		else if( currencyType == 1003)
		{
			RUBY_CNT += currency;
			return RUBY_CNT;
		}
		else if( currencyType == 1004)
		{
			HEART_CNT += currency;
			return HEART_CNT;
		}
		else if( currencyType == 1005)
		{
			COIN_CNT += currency;
			return COIN_CNT;
		}
		else if( currencyType == 1006)
		{
			SMILE_CNT += currency;
			return SMILE_CNT;
		}
		else if( currencyType == 1013)
		{
			RUBY_FREE_CNT += currency;
			return RUBY_FREE_CNT;
		}
		else if( currencyType == 1014)
		{
			SMILE_FREE_CNT += currency;
			return SMILE_FREE_CNT;
		}
		return -1;
	}
}
