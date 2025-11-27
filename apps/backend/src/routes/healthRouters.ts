import { Router } from 'express';
import * as healthController from '../controllers/healthController';

const router: Router = Router();

router.get('/check', healthController.getHealthCheck);

export default router;
