import {Router} from 'express';
import * as trendDataController from '@/controllers/trendDataController';

const router: Router = Router();

router.get('/', trendDataController.getTrendData);
router.get('/export_csv', trendDataController.exportCsv);
router.get('/is_data_exist', trendDataController.getIsDataExistController);
router.get('/get_cumulative_value', trendDataController.getCumulativeValueController);

export default router;