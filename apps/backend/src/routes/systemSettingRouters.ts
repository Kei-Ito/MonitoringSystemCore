import {Router} from 'express';
import * as systemSettingController from 'src/controllers/systemSettingController';

const router: Router = Router();

router.get('/get_system_setting', systemSettingController.getSystemSetting);
router.post('/set_sampling_interval', systemSettingController.setSamplingIntervalController);

// サンプリングインターバル管理API
router.get('/sampling_intervals', systemSettingController.getSamplingIntervals);
router.post('/sampling_intervals', systemSettingController.addSamplingInterval);
router.put('/sampling_intervals/:uuid', systemSettingController.updateSamplingInterval);
router.delete('/sampling_intervals/:uuid', systemSettingController.deleteSamplingInterval);

export default router;