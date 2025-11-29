import {Router} from 'express';
import * as trendDataController from 'src/controllers/trendDataController';

const router: Router = Router();

router.get('/', trendDataController.getTrendData);
router.get('/aggregated', trendDataController.getAggregatedTrendData);
//router.get('/export_csv', trendDataController.exportCsv);
//router.get('/is_data_exist', trendDataController.getIsDataExistController);
//router.get('/get_cumulative_value', trendDataController.getCumulativeValueController);

export default router;