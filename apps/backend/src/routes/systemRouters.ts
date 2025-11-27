import { Router } from 'express';
import { shutdown, reboot } from '../controllers/systemController.js';

const router: Router = Router();

// システムシャットダウン
router.post('/shutdown', shutdown);

// システム再起動
router.post('/reboot', reboot);

export default router;
