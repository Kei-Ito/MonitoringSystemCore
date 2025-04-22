
import { Request, Response } from 'express';
import { getDashboardChartList,addDashboardChart ,updateDashboardChart} from "src/services/databaseService";
import { ChartSetting } from '@monitoring/shared/model';

export async function addChart(req: Request<{},{},ChartSetting>, res: Response) {
    try {
        await addDashboardChart(req.body);
        res.status(200).send();
    } catch (error) {
        res.status(500).json({ message: error });
    }

}

export async function getDashboardCharts(req: Request<{},{},{}>, res: Response) {
  try {
    const data = await getDashboardChartList();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export async function updateDashboardChartController(req: Request<{},{},ChartSetting>, res: Response) {
  try {
    await updateDashboardChart(req.body);
    res.status(200).send();
  } catch (error) {
    res.status(500).json({ message: error });
  }
}