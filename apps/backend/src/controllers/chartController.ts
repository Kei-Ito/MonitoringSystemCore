
import { Request, Response } from 'express';
import { ChartConfig } from '@monitoring/shared/model';

// TODO: databaseServiceが削除されたため、チャート設定の永続化機能の実装が必要
// ローカルJSONファイルまたは別のストレージ実装を追加する

export async function addChart(req: Request<{},{},ChartConfig>, res: Response) {
    try {
        // TODO: チャート追加機能の実装
        res.status(501).json({ message: 'Chart add feature is not implemented yet' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

export async function getDashboardCharts(req: Request<{},{},{}>, res: Response) {
  try {
    // TODO: チャート取得機能の実装
    res.status(501).json([]);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export async function updateDashboardChartController(req: Request<{},{},ChartConfig>, res: Response) {
  try {
    // TODO: チャート更新機能の実装
    res.status(501).json({ message: 'Chart update feature is not implemented yet' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}