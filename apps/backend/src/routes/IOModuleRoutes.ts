// src/routes/sensorRoutes.ts
import { Router } from 'express';
import * as sensorController from 'src/controllers/IOModuleController';

const router: Router = Router();

router.get('/current', sensorController.getCurrentInputData); // 入力データの取得
router.post('/start', sensorController.startIOModuleInputSamplingInterval); // インターバル開始
router.post('/stop', sensorController.stopIOModuleInputSamplingInterval); // インターバル停止
router.get('/get_io_modules', sensorController.getIOModules); // センサ一覧の取得
router.post('/add_io_module', sensorController.addIOModule); // センサの追加
router.post('/add_channel', sensorController.addChannel); // チャンネルの追加
router.patch('/update_io_module', sensorController.updateIOModule); // センサの更新
router.delete('/', sensorController.deleteIOModule); // センサの削除
router.post('/delete_channel', sensorController.deleteChannel); // チャンネルの削除

export default router;
