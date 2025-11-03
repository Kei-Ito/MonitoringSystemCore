# MonitoringSystemCore 実装概要

本ドキュメントは MonitoringSystemCore リポジトリの主要コンポーネントとデータフローを俯瞰し、新規参加者が短時間で開発を始められることを目的としてまとめています。

## リポジトリ構成とビルド

- 本プロジェクトは pnpm を利用したモノレポで、`apps/backend`、`apps/frontend`、`shared` の 3 パッケージがワークスペースとして管理されています。【F:package.json†L1-L39】【F:pnpm-workspace.yaml†L1-L3】
- ルートの `pnpm dev` でフロントエンド(Vite)とバックエンド(Express)の開発サーバーを同時起動し、`pnpm -r run build` で各パッケージのビルドを順次実行します。【F:package.json†L5-L9】
- `shared` パッケージには型定義とユーティリティがまとまっており、ビルド時に `barrelsby` によるバレルファイル生成が走る構成です。【F:shared/package.json†L1-L39】

## 共通パッケージ (@monitoring/shared)

- IO モジュールやチャート設定など、ドメイン固有の型定義を提供します。例として `IOModule` インターフェースはハードウェア設定や入出力チャンネル情報を表現します。【F:shared/src/types/model/IOModule/IOModule.ts†L1-L26】
- ダッシュボード／トレンド画面で利用するチャート設定は `ChartConfig` で定義され、レイアウト座標やカテゴリ情報も保持します。【F:shared/src/types/model/ChartConfig/ChartConfig.ts†L1-L15】
- API レスポンスを Result 型でラップする軽量ユーティリティがあり、成功／失敗の取り扱いを統一しています。【F:shared/src/types/utils/Result.ts†L1-L19】
- `exports` 設定により、`@monitoring/shared/{model,api,enum,utils}` といった名前空間でビルド成果物を公開します。【F:shared/package.json†L14-L32】

## バックエンド (@monitoring/backend)

### サーバー初期化
- Express をベースに API と静的ファイル配信を行い、WebSocket サーバーを別ポート(2479)で立ち上げます。起動時に IO モジュール設定と UI レイアウトをロードし、未定義ルートはフロントエンドの `index.html` にフォールバックします。【F:apps/backend/src/server.ts†L17-L85】
- API ルーティングは `/api/*` 配下に集約され、ファイル操作、IO モジュール制御、トレンドデータ、チャート設定、システム設定、UI レイアウトを担当する各ルーターに委譲されます。【F:apps/backend/src/server.ts†L63-L69】

### 設定ファイルとローカルデータ
- `SystemSettingService` はシングルトンでローカル JSON (`LocalData/systemSetting.json`) を読み書きし、サンプリング周期やカテゴリ選択状態などを保持します。【F:apps/backend/src/config/SystemSetting.ts†L1-L108】
- UI レイアウトは `LocalData/uiLayouts.json` からロードされ、`initializeLayouts` でキャッシュされた後に `/api/ui/layouts` で返却されます。【F:apps/backend/src/services/uiService.ts†L1-L25】
- IO モジュールの定義もローカル JSON (`LocalData/ioModuleSetting.json`) を初期ソースとして読み込み、API からの更新時に保存されます。【F:apps/backend/src/services/IOModuleService.ts†L10-L42】

### IO モジュールとハードウェア連携
- `IOModuleService` はハードウェア制御ソフトウェア(ポート 8000)と通信する API クライアントを介して、モジュールの状態同期・チャンネル追加・入力値の取得を行います。【F:apps/backend/src/services/IOModuleService.ts†L1-L200】【F:apps/backend/src/api/IOModuleAPI.ts†L1-L169】
- サンプリング開始時は `setInterval` で定期的にセンサー入力を取得し、正規化と閾値判定を行った結果を WebSocket で一括配信します。配信データは最新値のキャッシュ `currentInputDatas` に保持されます。【F:apps/backend/src/services/IOModuleService.ts†L70-L151】
- 取得したデータは `saveInputDatas` により日付ディレクトリ配下の CSV に追記され、チャネルごとのログを蓄積します。【F:apps/backend/src/services/dataSaveService.ts†L1-L80】

### データベースと永続化
- MySQL への接続は `mysql2/promise` ベースのプールを使用し、初回起動時に必要なテーブル(Modules, Channels, Measurements 等)を自動生成します。【F:apps/backend/src/infra/database/pool.ts†L1-L160】【F:apps/backend/src/config/databaseConfig.ts†L1-L8】
- `databaseService` では IO モジュール／チャンネルの登録・更新、トレンドデータ取得、CSV エクスポート、ダッシュボードチャート設定管理などの永続化処理を提供します。【F:apps/backend/src/services/databaseService.ts†L1-L443】
- トレンドデータの CSV エクスポートでは、選択したチャネルのヘッダー生成と日内データの整形を行い、BOM 付き文字列を返します。【F:apps/backend/src/services/databaseService.ts†L368-L443】

### 提供 API
主要エンドポイントは以下の通りです。

| パス | メソッド | 役割 | ハンドラ |
| ---- | ---- | ---- | ---- |
| `/api/io_module/get_io_modules` | GET | IO モジュール一覧 | `IOModuleController.getIOModules`【F:apps/backend/src/routes/IOModuleRoutes.ts†L7-L15】【F:apps/backend/src/controllers/IOModuleController.ts†L19-L69】 |
| `/api/io_module/start` / `/stop` | POST | サンプリング制御 | `IOModuleController.start/stop`【F:apps/backend/src/routes/IOModuleRoutes.ts†L7-L15】【F:apps/backend/src/controllers/IOModuleController.ts†L9-L17】 |
| `/api/io_module/add_io_module` | POST | IO モジュール追加 | `IOModuleController.addIOModule`【F:apps/backend/src/routes/IOModuleRoutes.ts†L10-L15】【F:apps/backend/src/controllers/IOModuleController.ts†L29-L38】 |
| `/api/trend_data/` | GET | トレンドデータ取得 (CSV 読み出し) | `trendDataController.getTrendData`【F:apps/backend/src/routes/trendDataRouters.ts†L1-L11】【F:apps/backend/src/controllers/trendDataController.ts†L10-L31】 |
| `/api/chart/get_dashboard_charts` | GET | チャート設定取得 | `chartController.getDashboardCharts`【F:apps/backend/src/routes/chartRouters.ts†L1-L11】【F:apps/backend/src/controllers/chartController.ts†L2-L32】 |
| `/api/system_setting/get_system_setting` | GET | サンプリング設定取得 | `systemSettingController.getSystemSetting`【F:apps/backend/src/routes/systemSettingRouters.ts†L1-L9】【F:apps/backend/src/controllers/systemSettingController.ts†L1-L21】 |
| `/api/ui/layouts` | GET | UI レイアウト提供 | `uiController.getLayouts`【F:apps/backend/src/routes/uiRouters.ts†L1-L7】【F:apps/backend/src/controllers/uiController.ts†L1-L8】 |
| `/api/files/download-csv` | GET | サンプル CSV ダウンロード | `fileController.downloadCSV`【F:apps/backend/src/routes/fileRoutes.ts†L1-L9】 |

※ `/api/trend_data/export_csv` 等の追加エンドポイントはルーターではコメントアウトされているため、有効化にはルートの復帰が必要です。【F:apps/backend/src/routes/trendDataRouters.ts†L6-L9】

### 解析・集計
- `AnalysisService` はトレンドデータの累積値を trapezoidal 積分で算出し、日別集計を `CumulativeData` テーブルに保存します。【F:apps/backend/src/services/AnalysisService.ts†L1-L66】
- 集計値の永続化と取得は `trendDatabase` 経由で行い、既存データの有無を Result 型で返します。【F:apps/backend/src/infra/database/trendDatabase.ts†L1-L40】

## フロントエンド (@monitoring/frontend)

### 起動と共通プラグイン
- Vue 3 + Vite 構成で、Pinia・Vue Router・i18n・Material Dashboard テーマ・Toast をアプリケーションに登録します。【F:apps/frontend/package.json†L1-L45】【F:apps/frontend/src/main.ts†L1-L42】

### ルーティング
- `/dashboard`、`/trend`、`/configurations` など複数ビューを提供し、ルート `/` はダッシュボードへリダイレクトします。【F:apps/frontend/src/router/index.ts†L1-L55】

### 初期データロードと WebSocket
- `App.vue` の `onMounted` で IO モジュール、UI レイアウト、システム設定を順に取得し、WebSocket(ポート 2479)に接続してリアルタイム更新を受信します。【F:apps/frontend/src/App.vue†L45-L155】
- 受信した `IOModuleData` メッセージでランタイム値をストアへ反映し、開始／停止イベントではトースト通知を表示します。【F:apps/frontend/src/App.vue†L89-L180】

### 状態管理
- `monitoringStore` は IO モジュール一覧・サンプリング状態・サンプリング周期を保持し、モジュールやチャンネルの CRUD アクションを提供します。【F:apps/frontend/src/pinia/monitoringStore.ts†L1-L96】
- `chartStore` は UI レイアウトとチャート設定を Record 形式で保持し、ページ／カテゴリ別フィルタリングやドラッグ結果の反映を担います。【F:apps/frontend/src/pinia/chartStore.ts†L1-L97】
- `channelValuesStore` はチャンネルの最新値・時系列データ・デバイス健康状態を管理し、閾値逸脱時にトースト通知を発火します。【F:apps/frontend/src/pinia/channelValuesStore.ts†L1-L92】
- `uiStore` はテーマや管理者モード、カテゴリフィルタ選択肢を管理し、一部設定を localStorage に保存します。【F:apps/frontend/src/pinia/uiStore.ts†L1-L87】

### サービスレイヤー
- 共通 API クライアントは axios をラップし、Result 型でレスポンスを返す `request` 関数を提供します。【F:apps/frontend/src/api/apiClient.ts†L1-L40】
- `monitoringService`、`trendDataService`、`uiService` などのサービスが API 呼び出しとストア操作をカプセル化し、二重送信防止や AbortController を利用したリクエスト制御も実装されています。【F:apps/frontend/src/service/monitoringService.ts†L1-L148】【F:apps/frontend/src/service/trendDataService.ts†L1-L45】【F:apps/frontend/src/service/uiService.ts†L1-L21】
- フロントエンドの API モジュールはバックエンドの各エンドポイントを呼び出し、必要に応じて Blob ダウンロードや直列処理を行います。【F:apps/frontend/src/api/IOModuleAPI.ts†L1-L60】【F:apps/frontend/src/api/trendDataAPI.ts†L1-L80】【F:apps/frontend/src/api/uiLayoutAPI.ts†L1-L25】

### 画面
- ダッシュボード／トレンド画面は `vue-grid-layout` を用いたドラッガブルグリッドでチャートを配置します。カテゴリ選択は `uiStore` の状態と連動しています。【F:apps/frontend/src/views/Dashboard.vue†L1-L44】【F:apps/frontend/src/views/Trend.vue†L1-L114】
- トレンド画面ではマウント時に表示チャートのチャネルを収集し、必要なトレンドデータだけをリクエストしてストアを最新化します。【F:apps/frontend/src/views/Trend.vue†L64-L114】

## データフロー概要

1. バックエンド起動時にローカル JSON・DB の初期化を実施し、WebSocket と REST API を待ち受けます。【F:apps/backend/src/server.ts†L17-L85】【F:apps/backend/src/infra/database/pool.ts†L33-L156】
2. フロントエンドは初回表示で IO モジュール、UI レイアウト、システム設定を REST API から取得し、Pinia ストアに保存します。【F:apps/frontend/src/App.vue†L138-L155】【F:apps/frontend/src/service/monitoringService.ts†L16-L68】【F:apps/frontend/src/service/uiService.ts†L1-L21】
3. ユーザー操作による設定変更はサービスレイヤーから API に送信され、バックエンドで JSON / DB が更新された後、ストアに反映されます。【F:apps/frontend/src/service/monitoringService.ts†L70-L148】【F:apps/backend/src/services/IOModuleService.ts†L201-L268】
4. サンプリング開始後はハードウェア API から取得した入力値をバックエンドが正規化・保存しつつ WebSocket でブロードキャストし、フロントエンドがリアルタイム表示を更新します。【F:apps/backend/src/services/IOModuleService.ts†L70-L151】【F:apps/frontend/src/App.vue†L89-L181】
5. トレンド画面はオンデマンドで CSV ログを読み込み、AbortController により古いリクエストをキャンセルします。【F:apps/backend/src/services/dataSaveService.ts†L54-L110】【F:apps/frontend/src/service/trendDataService.ts†L1-L45】

## 開発のヒント

- 初回セットアップは `pnpm install` の後、ルートで `pnpm dev` を実行します。バックエンドはポート 2478、フロントエンドの Vite はデフォルトポート(5173 など)で起動し、ビルド済みフロントエンドはバックエンドから静的配信されます。【F:package.json†L5-L9】【F:apps/backend/src/server.ts†L18-L85】
- 共有型を更新した際は `pnpm --filter @monitoring/shared run build` でバレル生成と型出力を再実行してください。【F:shared/package.json†L7-L12】
- ローカル JSON (`apps/backend/LocalData`) を書き換えると、DB を介さずに初期モジュールやレイアウトを調整できます。JSON 書式は `shared` の型定義を参照すると安全です。【F:apps/backend/src/services/IOModuleService.ts†L10-L42】【F:shared/src/types/model/IOModule/IOModule.ts†L1-L26】
- ハードウェア API が手元に無い場合は、`apps/backend/src/api/IOModuleAPI.ts` 内のベース URL をモックサーバーに向ける、あるいはサービス層で Result を差し替えてフロントの挙動を確認できます。【F:apps/backend/src/api/IOModuleAPI.ts†L1-L169】

以上を踏まえれば、バックエンド API の拡張、フロントエンド UI の調整、共有型の追加といったタスクに迅速に取り組むことができます。
