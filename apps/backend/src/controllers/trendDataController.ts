import { Request, Response } from 'express';
import * as database from 'src/services/databaseService';
import { getIsDataExist } from 'src/services/trendDataService';
import { getCumulativeValue } from 'src/services/AnalysisService';
import { trendSpan } from '@monitoring/shared/enum';
import { csvDataRequest ,trendDataRequest,getIsDataExistRequestModel } from '@monitoring/shared/api';


export async function getTrendData(req: Request, res: Response) {
    const {channel_id , start_time, end_time, span } = req.query;
    // バリデーション
    if (!channel_id || !start_time || !end_time) {
        res.status(400).json({ error: 'Missing required parameters' });
        return;
    }

    const trendDataRequest: trendDataRequest= {
        channel_id: Number(channel_id),
        start_time: String(start_time),
        end_time: String(end_time),
        span: span as trendSpan,
    };

    // トレンドデータ取得処理
    const trendData = await database.getTrendData(trendDataRequest);
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
    const { input_channel_ids, date } = req.query;
    // バリデーション
    if (!input_channel_ids || !date) {
        res.status(400).json({ error: 'Missing required parameters' });
        return;
    }
    const channelIds = String(input_channel_ids)
        //.slice(1,-1)//配列の[]を削除
        .split(',')
        .map(id => parseInt(id,10))
        .filter(id => !isNaN(id));

    const csvDataRequest:csvDataRequest = {
        input_channel_ids: channelIds,
        date: String(date),
    };
    // CSVデータ取得処理
    const csvData = await database.getCsvData(csvDataRequest.input_channel_ids,new Date(csvDataRequest.date));

    // レスポンスヘッダをCSVダウンロード用に設定
    res.setHeader('Content-Type', 'text/csv; charset=UTF-8');
    res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');

    // CSV文字列をレスポンスとして送信
    res.send(csvData);
    return;
}

export async function  getCumulativeValueController(req: Request, res: Response) {
    
    const { channel_id, start_time, end_time } = req.query;
    // バリデーション
    if (!channel_id || !start_time || !end_time) {
        res.status(400).json({ error: 'Missing required parameters' });
        return;
    }
    const cumulativeValueRequest = {
        channel_id: Number(channel_id),
        start_time: String(start_time),
        end_time: String(end_time),
        span: trendSpan.Dayly,
    };
    
    // 累積値取得処理
    const cumulativeValue = await getCumulativeValue(cumulativeValueRequest);
    
    res.json(cumulativeValue);
    return;
}