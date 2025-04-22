import {Router} from 'express';
import * as systemSettingController from 'src/controllers/systemSettingController';

const router: Router = Router();

router.get('/get_system_setting', systemSettingController.getSystemSetting);
router.post('/set_sampling_interval', systemSettingController.setSamplingIntervalController);

export default router;