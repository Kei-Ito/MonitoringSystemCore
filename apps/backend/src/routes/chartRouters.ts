// src/routes/sensorRoutes.ts
import { Router } from 'express';
import * as chartController from 'src/controllers/chartController';

const router: Router = Router();

router.get('/get_dashboard_charts', chartController.getDashboardCharts); // センサ一覧の取得
router.post('/add_dashboard_chart', chartController.addChart); // センサの追加
router.post('/update_dashboard_chart', chartController.updateDashboardChartController); // センサの更新

export default router;