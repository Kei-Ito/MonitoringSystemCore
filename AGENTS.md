# MonitoringSystemCore - AIエージェント向けガイド# MonitoringSystemCore 実装概要



本ドキュメントはAIエージェントがこのリポジトリで作業する際のエントリーポイントです。本ドキュメントは MonitoringSystemCore リポジトリの主要コンポーネントとデータフローを俯瞰し、新規参加者が短時間で開発を始められることを目的としてまとめています。



## 📚 ドキュメント構成## 📚 詳細ドキュメント



詳細な情報は `docs/` ディレクトリに配置されています。**タスクに応じて適切なドキュメントを参照してください。**本リポジトリには `docs/` ディレクトリに詳細なドキュメントが配置されています。タスクに応じて適切なドキュメントを参照してください。



| ドキュメント | パス | 内容 || ドキュメント | パス | 参照するタイミング |

|-------------|------|------||-------------|------|-------------------|

| **README** | `docs/README.md` | プロジェクト概要、セットアップ手順、開発コマンド || **README** | `docs/README.md` | プロジェクト概要、セットアップ手順、開発コマンドを確認したい時 |

| **アーキテクチャ** | `docs/architecture.md` | システム構成図、パッケージ依存関係、データフロー || **アーキテクチャ** | `docs/architecture.md` | システム構成、データフロー、各レイヤーの責務を理解したい時 |

| **API仕様** | `docs/api-specification.md` | REST API / WebSocket エンドポイント一覧、型定義 || **API仕様** | `docs/api-specification.md` | REST API / WebSocket のエンドポイント、リクエスト/レスポンス型を確認したい時 |

| **設定・環境** | `docs/configuration.md` | ポート番号、設定ファイル、外部依存サービス || **設定・環境** | `docs/configuration.md` | ポート番号、設定ファイル、外部依存サービスを確認したい時 |

| **サービス層** | `docs/services.md` | バックエンドサービスの詳細仕様・関数リファレンス || **サービス層** | `docs/services.md` | バックエンドの各サービスの詳細な仕様・関数を確認したい時 |

| **コーディング規約** | `docs/coding-conventions.md` | 命名規則、インポート順序、エラーハンドリングパターン || **コーディング規約** | `docs/coding-conventions.md` | 命名規則、インポート順序、エラーハンドリングパターンを確認したい時 |



### タスク別の参照ガイド### ドキュメント参照の指針



| タスク | 参照順序 |- **新機能の追加**: `architecture.md` → `services.md` → `api-specification.md`

|-------|---------|- **バグ修正**: `services.md` で対象サービスの仕様を確認

| 新機能の追加 | `architecture.md` → `services.md` → `api-specification.md` → `coding-conventions.md` |- **API の追加・変更**: `api-specification.md` → `coding-conventions.md`

| バグ修正 | `services.md` で対象サービスの仕様を確認 |- **設定の変更**: `configuration.md`

| API の追加・変更 | `api-specification.md` → `coding-conventions.md` |- **コードレビュー**: `coding-conventions.md`

| 設定の追加・変更 | `configuration.md` |

| コードレビュー | `coding-conventions.md` |---



---## リポジトリ構成とビルド



## 🏗️ プロジェクト概要- 本プロジェクトは pnpm を利用したモノレポで、`apps/backend`、`apps/frontend`、`shared` の 3 パッケージがワークスペースとして管理されています。【F:package.json†L1-L39】【F:pnpm-workspace.yaml†L1-L3】

- ルートの `pnpm dev` でフロントエンド(Vite)とバックエンド(Express)の開発サーバーを同時起動し、`pnpm -r run build` で各パッケージのビルドを順次実行します。【F:package.json†L5-L9】

pnpm モノレポ構成の監視システムです。- `shared` パッケージには型定義とユーティリティがまとまっており、ビルド時に `barrelsby` によるバレルファイル生成が走る構成です。【F:shared/package.json†L1-L39】



```## 共通パッケージ (@monitoring/shared)

MonitoringSystemCoreService/

├── apps/- IO モジュールやチャート設定など、ドメイン固有の型定義を提供します。例として `IOModule` インターフェースはハードウェア設定や入出力チャンネル情報を表現します。【F:shared/src/types/model/IOModule/IOModule.ts†L1-L26】

│   ├── backend/          # Express + WebSocket サーバー (ポート: 2478, 2479)- ダッシュボード／トレンド画面で利用するチャート設定は `ChartConfig` で定義され、レイアウト座標やカテゴリ情報も保持します。【F:shared/src/types/model/ChartConfig/ChartConfig.ts†L1-L15】

│   └── frontend/         # Vue.js 3 SPA- API レスポンスを Result 型でラップする軽量ユーティリティがあり、成功／失敗の取り扱いを統一しています。【F:shared/src/types/utils/Result.ts†L1-L19】

├── shared/               # 共有型定義 (@monitoring/shared)- `exports` 設定により、`@monitoring/shared/{model,api,enum,utils}` といった名前空間でビルド成果物を公開します。【F:shared/package.json†L14-L32】

└── docs/                 # ドキュメント

```## バックエンド (@monitoring/backend)



### 技術スタック### サーバー初期化

- Express をベースに API と静的ファイル配信を行い、WebSocket サーバーを別ポート(2479)で立ち上げます。起動時に IO モジュール設定と UI レイアウトをロードし、未定義ルートはフロントエンドの `index.html` にフォールバックします。【F:apps/backend/src/server.ts†L17-L85】

- **バックエンド**: Node.js, Express, TypeScript, WebSocket- API ルーティングは `/api/*` 配下に集約され、ファイル操作、IO モジュール制御、トレンドデータ、チャート設定、システム設定、UI レイアウトを担当する各ルーターに委譲されます。【F:apps/backend/src/server.ts†L63-L69】

- **フロントエンド**: Vue.js 3, Vite, Pinia, TypeScript

- **データ永続化**: ファイルシステム (CSV/JSON) ※データベース不使用### 設定ファイルとローカルデータ

- `SystemSettingService` はシングルトンでローカル JSON (`LocalData/systemSetting.json`) を読み書きし、サンプリング周期やカテゴリ選択状態などを保持します。【F:apps/backend/src/config/SystemSetting.ts†L1-L108】

### クイックスタート- UI レイアウトは `LocalData/uiLayouts.json` からロードされ、`initializeLayouts` でキャッシュされた後に `/api/ui/layouts` で返却されます。【F:apps/backend/src/services/uiService.ts†L1-L25】

- IO モジュールの定義もローカル JSON (`LocalData/ioModuleSetting.json`) を初期ソースとして読み込み、API からの更新時に保存されます。【F:apps/backend/src/services/IOModuleService.ts†L10-L42】

```bash

pnpm install                              # 依存関係インストール### IO モジュールとハードウェア連携

pnpm --filter @monitoring/shared run build # 共有パッケージビルド- `IOModuleService` はハードウェア制御ソフトウェア(ポート 8000)と通信する API クライアントを介して、モジュールの状態同期・チャンネル追加・入力値の取得を行います。【F:apps/backend/src/services/IOModuleService.ts†L1-L200】【F:apps/backend/src/api/IOModuleAPI.ts†L1-L169】

pnpm dev                                   # 開発サーバー起動- サンプリング開始時は `setInterval` で定期的にセンサー入力を取得し、正規化と閾値判定を行った結果を WebSocket で一括配信します。配信データは最新値のキャッシュ `currentInputDatas` に保持されます。【F:apps/backend/src/services/IOModuleService.ts†L70-L151】

```- 取得したデータは `saveInputDatas` により日付ディレクトリ配下の CSV に追記され、チャネルごとのログを蓄積します。【F:apps/backend/src/services/dataSaveService.ts†L1-L80】



---### データベースと永続化

- 本システムはデータベースを使用せず、全てのデータをファイルシステム（CSVおよびJSON）で管理します。

## 🔑 重要な設計ポイント- `databaseService` では IO モジュール／チャンネルの登録・更新、トレンドデータ取得、CSV エクスポート、ダッシュボードチャート設定管理などの永続化処理を提供します。【F:apps/backend/src/services/databaseService.ts†L1-L443】

- トレンドデータの CSV エクスポートでは、選択したチャネルのヘッダー生成と日内データの整形を行い、BOM 付き文字列を返します。【F:apps/backend/src/services/databaseService.ts†L368-L443】

AIエージェントが作業する際に把握しておくべき要点です。

### 提供 API

### 1. データはファイルベースで管理主要エンドポイントは以下の通りです。



- 設定: `apps/backend/LocalData/*.json`| パス | メソッド | 役割 | ハンドラ |

- ログデータ: `{dataRootPath}/{year}/{month}/{day}/data.csv`| ---- | ---- | ---- | ---- |

- キャッシュ: `{dataRootPath}/cache/`| `/api/io_module/get_io_modules` | GET | IO モジュール一覧 | `IOModuleController.getIOModules`【F:apps/backend/src/routes/IOModuleRoutes.ts†L7-L15】【F:apps/backend/src/controllers/IOModuleController.ts†L19-L69】 |

| `/api/io_module/start` / `/stop` | POST | サンプリング制御 | `IOModuleController.start/stop`【F:apps/backend/src/routes/IOModuleRoutes.ts†L7-L15】【F:apps/backend/src/controllers/IOModuleController.ts†L9-L17】 |

### 2. 共有型の変更時は再ビルド必須| `/api/io_module/add_io_module` | POST | IO モジュール追加 | `IOModuleController.addIOModule`【F:apps/backend/src/routes/IOModuleRoutes.ts†L10-L15】【F:apps/backend/src/controllers/IOModuleController.ts†L29-L38】 |

| `/api/trend_data/` | GET | トレンドデータ取得 (CSV 読み出し) | `trendDataController.getTrendData`【F:apps/backend/src/routes/trendDataRouters.ts†L1-L11】【F:apps/backend/src/controllers/trendDataController.ts†L10-L31】 |

```bash| `/api/chart/get_dashboard_charts` | GET | チャート設定取得 | `chartController.getDashboardCharts`【F:apps/backend/src/routes/chartRouters.ts†L1-L11】【F:apps/backend/src/controllers/chartController.ts†L2-L32】 |

pnpm --filter @monitoring/shared run build| `/api/system_setting/get_system_setting` | GET | サンプリング設定取得 | `systemSettingController.getSystemSetting`【F:apps/backend/src/routes/systemSettingRouters.ts†L1-L9】【F:apps/backend/src/controllers/systemSettingController.ts†L1-L21】 |

```| `/api/ui/layouts` | GET | UI レイアウト提供 | `uiController.getLayouts`【F:apps/backend/src/routes/uiRouters.ts†L1-L7】【F:apps/backend/src/controllers/uiController.ts†L1-L8】 |

| `/api/files/download-csv` | GET | サンプル CSV ダウンロード | `fileController.downloadCSV`【F:apps/backend/src/routes/fileRoutes.ts†L1-L9】 |

### 3. サービス層のシングルトン

※ `/api/trend_data/export_csv` 等の追加エンドポイントはルーターではコメントアウトされているため、有効化にはルートの復帰が必要です。【F:apps/backend/src/routes/trendDataRouters.ts†L6-L9】

以下のサービスはシングルトンパターンで実装されています：

- `SystemSettingService` - システム設定管理### 解析・集計

- `HealthCheckService` - ヘルスチェック- `AnalysisService` はトレンドデータの累積値を trapezoidal 積分で算出し、結果をファイルベースのキャッシュ (`LocalData/cache`) に保存します。【F:apps/backend/src/services/AnalysisService.ts†L1-L66】

- キャッシュは `cumulativeCacheService` を介して JSON 形式で読み書きされ、再計算のコストを削減します。【F:apps/backend/src/services/cumulativeCacheService.ts】

### 4. リアルタイム通信

## フロントエンド (@monitoring/frontend)

WebSocket (ポート 2479) でサンプリングデータをブロードキャスト。

フロントエンドは `App.vue` で接続・受信処理を実装。### 起動と共通プラグイン

- Vue 3 + Vite 構成で、Pinia・Vue Router・i18n・Material Dashboard テーマ・Toast をアプリケーションに登録します。【F:apps/frontend/package.json†L1-L45】【F:apps/frontend/src/main.ts†L1-L42】

### 5. 定期タスク

### ルーティング

- **データクリーンアップ**: 起動時 + 24時間ごとに古いデータを自動削除- `/dashboard`、`/trend`、`/configurations` など複数ビューを提供し、ルート `/` はダッシュボードへリダイレクトします。【F:apps/frontend/src/router/index.ts†L1-L55】

- **サンプリング**: 設定された周期でセンサーデータを取得・保存

### 初期データロードと WebSocket

---- `App.vue` の `onMounted` で IO モジュール、UI レイアウト、システム設定を順に取得し、WebSocket(ポート 2479)に接続してリアルタイム更新を受信します。【F:apps/frontend/src/App.vue†L45-L155】

- 受信した `IOModuleData` メッセージでランタイム値をストアへ反映し、開始／停止イベントではトースト通知を表示します。【F:apps/frontend/src/App.vue†L89-L180】

## 📁 主要ファイルの場所

### 状態管理

よく編集するファイルへのクイックリファレンスです。- `monitoringStore` は IO モジュール一覧・サンプリング状態・サンプリング周期を保持し、モジュールやチャンネルの CRUD アクションを提供します。【F:apps/frontend/src/pinia/monitoringStore.ts†L1-L96】

- `chartStore` は UI レイアウトとチャート設定を Record 形式で保持し、ページ／カテゴリ別フィルタリングやドラッグ結果の反映を担います。【F:apps/frontend/src/pinia/chartStore.ts†L1-L97】

### バックエンド- `channelValuesStore` はチャンネルの最新値・時系列データ・デバイス健康状態を管理し、閾値逸脱時にトースト通知を発火します。【F:apps/frontend/src/pinia/channelValuesStore.ts†L1-L92】

- `uiStore` はテーマや管理者モード、カテゴリフィルタ選択肢を管理し、一部設定を localStorage に保存します。【F:apps/frontend/src/pinia/uiStore.ts†L1-L87】

| 目的 | ファイル |

|-----|---------|### サービスレイヤー

| サーバー起動・初期化 | `apps/backend/src/server.ts` |- 共通 API クライアントは axios をラップし、Result 型でレスポンスを返す `request` 関数を提供します。【F:apps/frontend/src/api/apiClient.ts†L1-L40】

| システム設定 | `apps/backend/src/config/SystemSetting.ts` |- `monitoringService`、`trendDataService`、`uiService` などのサービスが API 呼び出しとストア操作をカプセル化し、二重送信防止や AbortController を利用したリクエスト制御も実装されています。【F:apps/frontend/src/service/monitoringService.ts†L1-L148】【F:apps/frontend/src/service/trendDataService.ts†L1-L45】【F:apps/frontend/src/service/uiService.ts†L1-L21】

| IOモジュール管理 | `apps/backend/src/services/IOModuleService.ts` |- フロントエンドの API モジュールはバックエンドの各エンドポイントを呼び出し、必要に応じて Blob ダウンロードや直列処理を行います。【F:apps/frontend/src/api/IOModuleAPI.ts†L1-L60】【F:apps/frontend/src/api/trendDataAPI.ts†L1-L80】【F:apps/frontend/src/api/uiLayoutAPI.ts†L1-L25】

| データ保存 | `apps/backend/src/services/dataSaveService.ts` |

| データ削除 | `apps/backend/src/services/dataCleanupService.ts` |### 画面

| APIルーティング | `apps/backend/src/routes/*.ts` |- ダッシュボード／トレンド画面は `vue-grid-layout` を用いたドラッガブルグリッドでチャートを配置します。カテゴリ選択は `uiStore` の状態と連動しています。【F:apps/frontend/src/views/Dashboard.vue†L1-L44】【F:apps/frontend/src/views/Trend.vue†L1-L114】

| コントローラー | `apps/backend/src/controllers/*.ts` |- トレンド画面ではマウント時に表示チャートのチャネルを収集し、必要なトレンドデータだけをリクエストしてストアを最新化します。【F:apps/frontend/src/views/Trend.vue†L64-L114】

| ローカル設定JSON | `apps/backend/LocalData/*.json` |

## データフロー概要

### フロントエンド

1. バックエンド起動時にローカル JSON・DB の初期化を実施し、WebSocket と REST API を待ち受けます。【F:apps/backend/src/server.ts†L17-L85】【F:apps/backend/src/infra/database/pool.ts†L33-L156】

| 目的 | ファイル |2. フロントエンドは初回表示で IO モジュール、UI レイアウト、システム設定を REST API から取得し、Pinia ストアに保存します。【F:apps/frontend/src/App.vue†L138-L155】【F:apps/frontend/src/service/monitoringService.ts†L16-L68】【F:apps/frontend/src/service/uiService.ts†L1-L21】

|-----|---------|3. ユーザー操作による設定変更はサービスレイヤーから API に送信され、バックエンドで JSON / DB が更新された後、ストアに反映されます。【F:apps/frontend/src/service/monitoringService.ts†L70-L148】【F:apps/backend/src/services/IOModuleService.ts†L201-L268】

| アプリ初期化・WebSocket | `apps/frontend/src/App.vue` |4. サンプリング開始後はハードウェア API から取得した入力値をバックエンドが正規化・保存しつつ WebSocket でブロードキャストし、フロントエンドがリアルタイム表示を更新します。【F:apps/backend/src/services/IOModuleService.ts†L70-L151】【F:apps/frontend/src/App.vue†L89-L181】

| 状態管理 (Pinia) | `apps/frontend/src/pinia/*.ts` |5. トレンド画面はオンデマンドで CSV ログを読み込み、AbortController により古いリクエストをキャンセルします。【F:apps/backend/src/services/dataSaveService.ts†L54-L110】【F:apps/frontend/src/service/trendDataService.ts†L1-L45】

| サービス層 | `apps/frontend/src/service/*.ts` |

| APIクライアント | `apps/frontend/src/api/*.ts` |## 開発のヒント

| ページコンポーネント | `apps/frontend/src/views/*.vue` |

- 初回セットアップは `pnpm install` の後、ルートで `pnpm dev` を実行します。バックエンドはポート 2478、フロントエンドの Vite はデフォルトポート(5173 など)で起動し、ビルド済みフロントエンドはバックエンドから静的配信されます。【F:package.json†L5-L9】【F:apps/backend/src/server.ts†L18-L85】

### 共有パッケージ- 共有型を更新した際は `pnpm --filter @monitoring/shared run build` でバレル生成と型出力を再実行してください。【F:shared/package.json†L7-L12】

- ローカル JSON (`apps/backend/LocalData`) を書き換えると、DB を介さずに初期モジュールやレイアウトを調整できます。JSON 書式は `shared` の型定義を参照すると安全です。【F:apps/backend/src/services/IOModuleService.ts†L10-L42】【F:shared/src/types/model/IOModule/IOModule.ts†L1-L26】

| 目的 | ファイル |- ハードウェア API が手元に無い場合は、`apps/backend/src/api/IOModuleAPI.ts` 内のベース URL をモックサーバーに向ける、あるいはサービス層で Result を差し替えてフロントの挙動を確認できます。【F:apps/backend/src/api/IOModuleAPI.ts†L1-L169】

|-----|---------|- **より詳細な情報が必要な場合は `docs/` 配下のドキュメントを参照してください。** 特に API 仕様は `docs/api-specification.md`、サービス層の詳細は `docs/services.md` に記載されています。

| データモデル型 | `shared/src/types/model/` |

| API型定義 | `shared/src/types/api/` |以上を踏まえれば、バックエンド API の拡張、フロントエンド UI の調整、共有型の追加といったタスクに迅速に取り組むことができます。

| 列挙型 | `shared/src/enum/` |
| ユーティリティ | `shared/src/types/utils/` |

---

## ⚠️ 作業時の注意事項

1. **型定義を変更したら `shared` を再ビルド** してからバックエンド/フロントエンドを確認
2. **新しい設定プロパティを追加する場合** は `SystemSettingService` でデフォルト値とマイグレーション処理を追加
3. **新しいAPIを追加する場合** は routes → controller → service の順で実装
4. **コーディング規約** は `docs/coding-conventions.md` を参照

---

## 🔗 関連リンク

- 詳細なAPI仕様: `docs/api-specification.md`
- サービス層の関数リファレンス: `docs/services.md`
- 設定ファイルの構造: `docs/configuration.md`
