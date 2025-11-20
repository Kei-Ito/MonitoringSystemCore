import { Request, Response } from 'express';
import * as dataSaveService from 'src/services/dataSaveService';
import { getIsDataExist } from 'src/services/trendDataService';
import { getCumulativeValue } from 'src/services/AnalysisService';
import { trendSpan } from '@monitoring/shared/enum';
import { csvDataRequest ,trendDataRequest,getIsDataExistRequestModel } from '@monitoring/shared/api';


export async function getTrendData(req: Request, res: Response) {
    const {channel_uuid , start_time, end_time, span } = req.query;

    // バリデーション
    if (!channel_uuid || !start_time || !end_time) {
        res.status(400).json({ error: 'Missing required parameters' });
        return;
    }
    
    const trendDataRequest: trendDataRequest= {
        channel_uuid: String(channel_uuid),
        start_time: String(start_time),
        end_time: String(end_time),
        span: span as trendSpan,
    };

    // トレンドデータ取得処理
    const trendData = await dataSaveService.getTrendData(trendDataRequest);
    console.log('Trend data fetched successfully:', trendData);
    res.json(trendData);
    return;
};

export async function getIsDataExistController(req: Request, res: Response) {
    const { start_time, end_time } = req.query;
    // バリデーション
    if (!start_time || !end_time) {
        res.status(400).json({ error: 'Missing required parameters' });
        return;
    }
    const isDataExistRequest: getIsDataExistRequestModel = {
        start_time: String(start_time),
        end_time: String(end_time),
    };

    // データ存在確認処理
    const response = await getIsDataExist(isDataExistRequest);
    res.json(response);
    return;
}

export async function exportCsv(req: Request, res: Response) {
    // TODO: databaseServiceが削除されたため、CSV エクスポート機能の実装が必要
    // CSVファイルから直接データを読み取ってエクスポートする実装を追加する
    const { input_channel_ids, start_date, end_date } = req.query;
    // バリデーション
    if (!input_channel_ids || !start_date || !end_date) {
        res.status(400).json({ error: 'Missing required parameters' });
        return;
    }
    
    res.status(501).json({ error: 'CSV export feature is not implemented yet' });
    return;
}

export async function  getCumulativeValueController(req: Request, res: Response) {
    
    const { channel_uuid, start_time, end_time } = req.query;
    // バリデーション
    if (!channel_uuid || !start_time || !end_time) {
        res.status(400).json({ error: 'Missing required parameters' });
        return;
    }
    const cumulativeValueRequest: trendDataRequest = {
        channel_uuid: String(channel_uuid),
        start_time: String(start_time),
        end_time: String(end_time),
        span: trendSpan.Dayly,
    };
    
    // 累積値取得処理
    const cumulativeValue = await getCumulativeValue(cumulativeValueRequest);
    
    res.json(cumulativeValue);
    return;
}