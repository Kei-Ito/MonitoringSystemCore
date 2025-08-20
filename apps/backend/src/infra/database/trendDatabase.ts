import { pool } from 'src/infra/database/pool';
import { Result ,ok,err} from 'src/utils/result';

/**
 * 集計データをデータベースに登録する\
 * 日付は時刻を切り捨てたものを使用する
 * @param date 登録する日付
 * @param channel_id 登録するチャンネルID
 * @param cumulativeValue 集計データ
 * @returns Result
 */
export async function saveDailyCumulativeValue(date:Date,channel_uuid:string,cumulativeValue:number): Promise<Result<void>> {
    const connection = await pool.getConnection();
    try {
        const registerDate = new Date(date.getFullYear(),date.getMonth(),date.getDate());
        await connection.query('INSERT INTO CumulativeData (date,channel_uuid,value) VALUES (?,?,?)',[registerDate,channel_uuid,cumulativeValue]);
        return ok(void 0);
    } catch (e:any) {
        return err(e.message);
    } finally {
        connection.release();
    }
}

/**
 * 累積データを集計したデータが存在するか確認し、存在する場合はその値を返すメソッド\
 * 存在しない場合はエラーを返す
 * @param date データを確認する日付（内部で時刻は切り捨てられる）
 * @param channel_id チャンネルID
 * @returns 集計データ、データが存在しない場合はerrを返す
 */
export async function findCumulativeValueForDate(date:Date,channel_uuid:string): Promise<Result<number>> {
    const connection = await pool.getConnection();
    try {
        const searchDate = new Date(date.getFullYear(),date.getMonth(),date.getDate());
        const [rows] = await connection.query('SELECT value FROM CumulativeData WHERE date = ? AND channel_uuid = ?',[searchDate,channel_uuid]) as any[];
        if (rows.length === 0) {
            return err('No data');
        }
        return ok(rows[0].value);
    } catch (e:any) {
        return err(e.message);
    } finally {
        connection.release();
    }
}