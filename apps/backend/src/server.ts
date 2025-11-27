import path, { dirname } from 'path';
import { fileURLToPath } from "node:url";
import express, { Request, Response } from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import fileRoutes from './routes/fileRoutes.js';
import IOModuleRoutes from './routes/IOModuleRoutes.js';
import trendDataRoutes from './routes/trendDataRouters.js';
import chartRoutes from './routes/chartRouters.js';
import uiRouters from './routes/uiRouters';
import systemSettingRoutes from './routes/systemSettingRouters.js';
import systemRoutes from './routes/systemRouters.js';
import { getIsSamplingIntervalRunning } from './services/IOModuleService.js';
import { initializeIOModules } from './services/IOModuleService.js';
import { initializeLayouts } from './services/uiService.js';
import { SystemSettingService } from './config/SystemSetting.js';

async function bootstrap() {
  const app = express();
  app.use(cors());
  const PORT = 2478;
  const WEBSOCKET_PORT = 2479;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname  = dirname(__filename);        // ★ ESM でも __dirname を再現

  // IOモジュールの初期化
  await initializeIOModules();

  // UIレイアウトの初期化
  await initializeLayouts();

  // フロントエンドのビルド済みファイルを静的ファイルとして提供
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  // JSONパース用ミドルウェアを追加
  app.use(express.json());

  // WebSocketサーバーの設定
  const wss = new WebSocketServer({ port: WEBSOCKET_PORT });

  // broadcast関数を設定(APIで呼び出される可能性があるので、それより前に定義)
  const broadcast = (data: any) => {
    wss.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  wss.on('connection', (ws) => {
    // ① SystemSettingService からサンプリングの状態を取得
    const isSamplingOn = getIsSamplingIntervalRunning();
    // ② クライアントへ送信
    ws.send(JSON.stringify({
      type: 'samplingStatus',
      data: isSamplingOn 
    }));
    ws.on('close', () => console.log('Client disconnected'));
  });

  // app.localsにbroadcast関数を保持
  app.locals.broadcast = broadcast;


  // APIのルート設定
  app.use('/api/files', fileRoutes);
  app.use('/api/io_module', IOModuleRoutes); // センサ関連のAPI
  app.use('/api/trend_data', trendDataRoutes); // トレンドデータ取得API
  app.use('/api/chart', chartRoutes); // グラフ関連のAPI
  app.use('/api/system_setting', systemSettingRoutes); // システム設定関連のAPI
  app.use('/api/ui', uiRouters); // UIレイアウト関連のAPI
  app.use('/api/system', systemRoutes); // システム制御関連のAPI

  // システム設定の初期化
  const configService = SystemSettingService.getInstance();
  await configService.loadSystemSettingFromDatabase();


  // 未定義のルートに対してindex.htmlを返す
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, './../../frontend/dist', 'index.html'));
  });

  

  app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
  });

}

bootstrap();
