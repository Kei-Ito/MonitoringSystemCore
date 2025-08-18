import {Router} from 'express';
import * as uiController from 'src/controllers/uiController';

const router: Router = Router();

router.get('/layouts', uiController.getLayouts);

export default router;