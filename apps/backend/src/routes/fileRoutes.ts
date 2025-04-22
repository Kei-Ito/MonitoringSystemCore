// src/routes/fileRoutes.ts
import { Router } from 'express';
import { downloadCSV } from 'src/controllers/fileController';

const router: Router = Router();

router.get('/download-csv', downloadCSV);

export default router;
