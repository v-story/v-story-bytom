package common.util;

import java.text.SimpleDateFormat;
import org.apache.commons.lang.time.DateUtils;

/*
 * author jong-hun park
 */
public class DateUtil
{

	public static final String getCurrentDate(final String form)
 	{
 		SimpleDateFormat formatter = new SimpleDateFormat(form);
 		java.util.Date currentDate = new java.util.Date();
 		return formatter.format(currentDate);
 	}
	
	public static final String addMinutes(java.util.Date toDate,int addMinuteTime)
 	{
 		
 		//java.util.Date targetTime = new java.util.Date(); //now
		java.util.Date convertToDate = DateUtils.addMinutes(toDate, addMinuteTime); //add minute 			
		return dateToString(convertToDate);
 	}
	
	
	public static final java.util.Date StringToDate(String fromDate) throws Exception 
	{
 		SimpleDateFormat transFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
 		return transFormat.parse(fromDate);		
	}	
	
	public static final String dateToString(java.util.Date toDate)
	{
 		SimpleDateFormat transFormat1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
 		return transFormat1.format(toDate);		
	}
	
	
}