import { Request, Response } from 'express';
import * as dataSaveService from 'src/services/dataSaveService';
import * as IOModuleService from 'src/services/IOModuleService';
import { getIsDataExist } from 'src/services/trendDataService';
import { getAggregatedCumulativeTrend } from 'src/services/AnalysisService';
import HealthCheckService from 'src/services/healthCheckService';
import { trendSpan } from '@monitoring/shared/enum';
import { trendDataRequest,getIsDataExistRequestModel } from '@monitoring/shared/api';


export async function getTrendData(req: Request, res: Response) {
    // ヘルスチェック: ドライブがマウントされていない場合はエラーを返す
    const healthService = HealthCheckService.getInstance();
    if (!healthService.getHealthStatus().drivesMounted) {
        res.status(503).json({ error: 'Data storage is not available (Drive not mounted)' });
        return;
    }

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

    // チャンネル設定からdecimalsを取得
    const modules = IOModuleService.getAllModules();
    let decimals: number | undefined;
    
    for (const module of modules) {
        const channel = module.input_channels.find(c => c.channel_uuid === String(channel_uuid));
        if (channel) {
            decimals = channel.decimals;
            break;
        }
    }

    // トレンドデータ取得処理
    const trendData = await dataSaveService.getTrendData(trendDataRequest, decimals);
    res.json(trendData);
    return;
};

export async function getIsDataExistController(req: Request, res: Response) {
    // ヘルスチェック: ドライブがマウントされていない場合はエラーを返す
    const healthService = HealthCheckService.getInstance();
    if (!healthService.getHealthStatus().drivesMounted) {
        res.status(503).json({ error: 'Data storage is not available (Drive not mounted)' });
        return;
    }

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

export async function getAggregatedTrendData(req: Request, res: Response) {
    // ヘルスチェック: ドライブがマウントされていない場合はエラーを返す
    const healthService = HealthCheckService.getInstance();
    if (!healthService.getHealthStatus().drivesMounted) {
        res.status(503).json({ error: 'Data storage is not available (Drive not mounted)' });
        return;
    }

    const { channel_uuid, start_time, end_time, interval_minutes } = req.query;

    // バリデーション
    if (!channel_uuid || !start_time || !end_time || !interval_minutes) {
        res.status(400).json({ error: 'Missing required parameters' });
        return;
    }

    const trendDataRequest: trendDataRequest = {
        channel_uuid: String(channel_uuid),
        start_time: String(start_time),
        end_time: String(end_time),
        span: trendSpan.Dayly, // span is not strictly used for aggregation logic but required by type
    };

    const interval = Number(interval_minutes);
    if (isNaN(interval) || interval <= 0) {
        res.status(400).json({ error: 'Invalid interval_minutes' });
        return;
    }

    // 集計データ取得処理
    const aggregatedData = await getAggregatedCumulativeTrend(trendDataRequest, interval);
    res.json(aggregatedData);
    return;
}