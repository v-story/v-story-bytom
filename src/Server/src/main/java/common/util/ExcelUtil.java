package common.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

/*
 * author jong-hun park
 */
public class ExcelUtil {
	public void ExcelLoad(String fileName)
	{
		if("".equals(fileName) || null == fileName)
			return;
		XSSFWorkbook wb = null;
		try
		{
			File file = new File(fileName);
            // ���� ���� ����
            wb = new XSSFWorkbook(new FileInputStream(file));
            Cell cell = null;
            
            // ù��° Sheet ���� �о� ����
            for (Row row : wb.getSheetAt(0))
            {
            	// ��°�ٺ��� �о�´�.
            	if(row.getRowNum() < 2)
            		continue;
            	// �ι�° ���� ��� ������ for���� �����.
            	if(row.getCell(1) == null)
            		break;
                // �ܼ� ���
                System.out.println("[row] �̸� : " + row.getCell(1) + ", ����: " + row.getCell(2)
                                + ", ����: " + row.getCell(3) + ", ���: " + row.getCell(4));
                
                // 4��° �� ���� ����
                cell = row.createCell(4);
                cell.setCellValue("Ȯ��");
                
                //���� ���� ����
                FileOutputStream fileOut = new FileOutputStream(file);
                wb.write(fileOut);
            }
		}
		catch(FileNotFoundException fe)
		{
			fe.printStackTrace();
		}
		catch(IOException e)
		{
			e.printStackTrace();
		}
		finally
		{
			if(null != wb)
			{	
				try 
				{
					wb.close();
				}
				catch(Exception e)
				{
					e.printStackTrace();
				}
				
			}
			
		}	
	}
}
