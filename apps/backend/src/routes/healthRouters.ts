import { Router } from 'express';
import { getHealthCheck } from '../controllers/healthController.js';

const router: Router = Router();

router.get('/check', getHealthCheck);

export default router;
