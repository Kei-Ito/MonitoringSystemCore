import {Router} from 'express';
import * as uiController from 'src/controllers/uiController';

const router: Router = Router();

router.get('/layouts', uiController.getLayouts);
router.post('/layouts', uiController.updateLayouts);

export default router;