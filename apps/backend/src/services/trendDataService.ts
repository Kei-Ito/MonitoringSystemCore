import { getIsDataExistRequestModel, getIsDataExistResponseModel } from '@monitoring/shared/api';
import fs from 'fs';
import path from 'path';
import { SystemSettingService } from 'src/config/SystemSetting';

const configService = SystemSettingService.getInstance();

/**
 * 指定期間内にデータが存在する日付のリストを取得
 * CSVファイルの存在を確認して返す
 */
export async function getIsDataExist(request: getIsDataExistRequestModel): Promise<getIsDataExistResponseModel[]> {
    const start_date = new Date(request.start_time);
    const end_date = new Date(request.end_time);

    const date_str_list: string[] = await getDataExistDateList(start_date, end_date);
    const response: getIsDataExistResponseModel[] = date_str_list.map(date => {
        const date_obj = new Date(date);
        const start_time_str: string = new Date(date_obj.getFullYear(), date_obj.getMonth(), date_obj.getDate()).toISOString();
        const end_time_str: string = new Date(date_obj.getFullYear(), date_obj.getMonth(), date_obj.getDate(), 23, 59, 59).toISOString();
        return {
            start_time: start_time_str,
            end_time: end_time_str,
        }
    });
    return response;
}

/**
 * 指定期間内のCSVファイルが存在する日付リストを取得
 */
async function getDataExistDateList(startDate: Date, endDate: Date): Promise<string[]> {
    const dateList: string[] = [];
    const rootPath = configService.getSystemSetting().dataRootPath;
    
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
        const year = current.getFullYear().toString();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        const day = String(current.getDate()).padStart(2, '0');
        const filePath = path.join(rootPath, year, month, day, 'data.csv');
        
        // ファイルが存在するかチェック
        if (fs.existsSync(filePath)) {
            dateList.push(current.toISOString());
        }
        
        current.setDate(current.getDate() + 1);
    }
    
    return dateList;
}

/*
function getDateRangeList(startDate:Date, endDate:Date):Date[] {

    const start = new Date(startDate);
    const end = new Date( endDate);
  
    const dateArray = [];
    let current = new Date(start);
  
    // current が end 以下の日付である限り、1日ずつ進めて配列に追加
    while (current <= end) {
      // イミュータブルに扱うため new Date(current) のように複製して push
      dateArray.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  
    return dateArray;
  }
    */