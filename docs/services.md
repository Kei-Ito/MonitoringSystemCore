# サービス層ドキュメント

本ドキュメントでは MonitoringSystemCore バックエンドのサービス層について詳しく説明します。

## 目次

- [サービス一覧](#サービス一覧)
- [IOModuleService](#iomoduleservice)
- [SystemSettingService](#systemsettingservice)
- [dataSaveService](#datasaveservice)
- [trendDataService](#trenddataservice)
- [dataCleanupService](#datacleanupservice)
- [HealthCheckService](#healthcheckservice)
- [AnalysisService](#analysisservice)
- [uiService](#uiservice)
- [cumulativeCacheService](#cumulativecacheservice)

---

## サービス一覧

| サービス | パターン | 責務 |
|---------|---------|------|
| IOModuleService | モジュール | IOモジュールの状態管理・サンプリング制御 |
| SystemSettingService | シングルトン | システム設定の読み込み・保存 |
| dataSaveService | モジュール | CSVへのデータ保存・読み込み |
| trendDataService | モジュール | トレンドデータの取得 |
| dataCleanupService | モジュール | 古いデータの自動削除 |
| HealthCheckService | シングルトン | システムヘルスチェック |
| AnalysisService | モジュール | データ解析・累積値計算 |
| uiService | モジュール | UIレイアウトの管理 |
| cumulativeCacheService | モジュール | 解析結果のキャッシュ管理 |

---

## IOModuleService

**ファイル**: `apps/backend/src/services/IOModuleService.ts`

IOモジュール（センサー等）の管理とサンプリング処理を担当する中核サービスです。

### 主要関数

#### initializeIOModules()

```typescript
export async function initializeIOModules(): Promise<void>
```

サーバー起動時に呼び出され、ローカルJSONファイルからIOモジュール設定を読み込みます。

#### startIOModuleInputSamplingInterval()

```typescript
export function startIOModuleInputSamplingInterval(
  broadcast: (data: any) => void,
  samplingIntervalUuid: string
): void
```

指定されたサンプリング周期でデータ収集を開始します。

**処理フロー**:
1. 指定された `samplingIntervalUuid` に対応する周期を取得
2. `setInterval` で定期実行を設定
3. 各モジュールの入力値を `IOModuleAPI` から取得
4. 値の正規化・閾値判定
5. `dataSaveService.saveInputDatas()` でCSVに保存
6. WebSocket で全クライアントにブロードキャスト

#### stopIOModuleInputSamplingInterval()

```typescript
export function stopIOModuleInputSamplingInterval(
  broadcast: (data: any) => void
): void
```

サンプリングを停止し、クライアントに通知します。

#### getIOModules()

```typescript
export function getIOModules(): IOModule[]
```

現在登録されているIOモジュール一覧を返します。

#### getCurrentInputData()

```typescript
export function getCurrentInputData(): getIOModuleInputResponse[]
```

最新のサンプリングデータをメモリキャッシュから返します。

### 状態管理

```typescript
// モジュール内で保持される状態
let ioModules: IOModule[] = [];                    // IOモジュール一覧
let currentInputDatas: getIOModuleInputResponse[]; // 最新の入力データ
let samplingIntervalId: NodeJS.Timeout | null;     // サンプリングタイマーID
let isSamplingRunning: boolean = false;            // サンプリング実行中フラグ
```

---

## SystemSettingService

**ファイル**: `apps/backend/src/config/SystemSetting.ts`

システム設定をシングルトンパターンで管理します。

### 使用方法

```typescript
import { SystemSettingService } from 'src/config/SystemSetting';

const configService = SystemSettingService.getInstance();
const setting = configService.getSystemSetting();
```

### 主要メソッド

#### getInstance()

```typescript
public static getInstance(): SystemSettingService
```

シングルトンインスタンスを取得します。

#### loadSystemSettingFromDatabase()

```typescript
public async loadSystemSettingFromDatabase(): Promise<void>
```

`LocalData/systemSetting.json` から設定を読み込みます。
存在しないプロパティにはデフォルト値を設定し、JSONファイルを更新します。

#### getSystemSetting()

```typescript
public getSystemSetting(): SystemSettingData
```

現在の設定を返します。

#### setSystemSetting()

```typescript
public async setSystemSetting(setting: SystemSettingData): Promise<void>
```

設定を更新し、JSONファイルに保存します。

### 設定プロパティ

| プロパティ | 型 | デフォルト値 |
|-----------|-----|------------|
| `samplingIntervals` | `SamplingInterval[]` | 高速(60s)/低速(300s) |
| `dataRootPath` | `string` | `""` |
| `driveUUID` | `string` | `""` |
| `dataRetentionDays` | `number` | `365` |
| `category1list` | `string[]` | `[]` |
| `category2list` | `string[]` | `[]` |

---

## dataSaveService

**ファイル**: `apps/backend/src/services/dataSaveService.ts`

CSVファイルへのデータ保存と読み込みを担当します。

### 主要関数

#### saveInputDatas()

```typescript
export async function saveInputDatas(
  data_list: getIOModuleInputResponse[],
  channelMeta?: Map<string, { name: string, unit: string }>,
  suffix?: string
): Promise<Result<void>>
```

入力データをCSVファイルに追記します。

**特徴**:
- BOM付きUTF-8で保存（Excel互換）
- 新規チャンネルは自動的にヘッダーに追加
- Mutexによる排他制御で同時書き込みを防止

#### getTrendData()

```typescript
export async function getTrendData(
  trendDataRequest: trendDataRequest,
  decimals?: number
): Promise<{ timestamp: Date; value: number }[]>
```

指定期間のトレンドデータを取得します。

**最適化**:
- 期間に応じた自動ダウンサンプリング
- 過去データはキャッシュを利用
- 当日データはリアルタイム読み込み

### ダウンサンプリング解像度

| 期間 | 解像度 |
|-----|--------|
| 24時間以内 | そのまま |
| 3日以内 | 1分単位 |
| 8日以内 | 10分単位 |
| 30日以内 | 1時間単位 |
| それ以上 | 1日単位 |

---

## trendDataService

**ファイル**: `apps/backend/src/services/trendDataService.ts`

トレンドデータの存在確認などの補助機能を提供します。

### 主要関数

#### getIsDataExist()

```typescript
export async function getIsDataExist(
  request: getIsDataExistRequestModel
): Promise<boolean>
```

指定期間にデータが存在するかを確認します。

---

## dataCleanupService

**ファイル**: `apps/backend/src/services/dataCleanupService.ts`

保存期間を過ぎた古いデータとキャッシュを自動削除します。

### 主要関数

#### startDataCleanupScheduler()

```typescript
export function startDataCleanupScheduler(): void
```

クリーンアップスケジューラを開始します。

**動作**:
1. サーバー起動時に即時実行
2. 24時間ごとに定期実行

#### runDataCleanup()

```typescript
export async function runDataCleanup(): Promise<{
  dataDeleted: number;
  cacheDeleted: number;
}>
```

クリーンアップを実行します。

**削除対象**:
- `{dataRootPath}/{year}/{month}/{day}/` 配下のデータファイル
- `{dataRootPath}/cache/` 配下のキャッシュファイル

**削除条件**:
- `systemSetting.dataRetentionDays` より古いデータ
- 空になった親ディレクトリも自動削除

#### stopDataCleanupScheduler()

```typescript
export function stopDataCleanupScheduler(): void
```

スケジューラを停止します。

### 設定

| 設定 | 値 | 説明 |
|-----|-----|------|
| 実行間隔 | 24時間 | `CLEANUP_INTERVAL_MS` |
| 保存期間 | 設定による | `systemSetting.dataRetentionDays` |

---

## HealthCheckService

**ファイル**: `apps/backend/src/services/healthCheckService.ts`

システムの健康状態を監視するシングルトンサービスです。

### 使用方法

```typescript
import HealthCheckService from './services/healthCheckService';

const healthService = HealthCheckService.getInstance();
await healthService.checkDriveMount();
const status = healthService.getHealthStatus();
```

### 主要メソッド

#### checkDriveMount()

```typescript
public async checkDriveMount(): Promise<void>
```

外部ドライブがマウントされているか確認します。

#### getHealthStatus()

```typescript
public getHealthStatus(): { drivesMounted: boolean; lastCheck: string }
```

最新のヘルスステータスを返します。

### 利用箇所

- サーバー起動時の初期チェック
- `/api/health/check` エンドポイント
- トレンドデータ取得前のチェック（503エラーを返す）

---

## AnalysisService

**ファイル**: `apps/backend/src/services/AnalysisService.ts`

データの解析・累積値計算を担当します。

### 主要関数

#### getAggregatedCumulativeTrend()

```typescript
export async function getAggregatedCumulativeTrend(
  channelUuid: string,
  startDate: Date,
  endDate: Date,
  intervalMinutes: number
): Promise<{ timestamp: string; value: number }[]>
```

指定間隔で集計した累積値を計算します。

**計算方法**:
- 台形積分（trapezoidal integration）で累積値を算出
- 結果はキャッシュに保存して再利用

---

## uiService

**ファイル**: `apps/backend/src/services/uiService.ts`

UIレイアウトの読み込み・保存を担当します。

### 主要関数

#### initializeLayouts()

```typescript
export async function initializeLayouts(): Promise<void>
```

`LocalData/uiLayouts.json` からレイアウトを読み込みます。

#### getLayouts()

```typescript
export function getLayouts(): UiLayout
```

現在のレイアウトを返します。

#### saveLayouts()

```typescript
export async function saveLayouts(layouts: UiLayout): Promise<void>
```

レイアウトを保存します。

---

## cumulativeCacheService

**ファイル**: `apps/backend/src/services/cumulativeCacheService.ts`

解析結果のキャッシュ管理を担当します。

### キャッシュの種類

| 種類 | パス | 内容 |
|-----|-----|------|
| Aggregated Cache | `cache/aggregated/{channelUuid}/{interval}/{date}.json` | 間隔ごとの集計データ |
| Daily Total Cache | `cache/daily_total/{channelUuid}/{date}.json` | 日次合計値 |

### 主要関数

#### loadAggregatedCache() / saveAggregatedCache()

```typescript
export async function loadAggregatedCache(
  channel_uuid: string,
  intervalMinutes: number,
  date: Date
): Promise<DailyIntervalCache>

export async function saveAggregatedCache(
  channel_uuid: string,
  intervalMinutes: number,
  date: Date,
  cache: DailyIntervalCache
): Promise<void>
```

#### loadDailyTotalCache() / saveDailyTotalCache()

```typescript
export async function loadDailyTotalCache(
  channel_uuid: string,
  date: Date
): Promise<number | null>

export async function saveDailyTotalCache(
  channel_uuid: string,
  date: Date,
  value: number
): Promise<void>
```

### 注意事項

- ドライブがマウントされていない場合、保存処理はスキップされます
- キャッシュファイルは `dataCleanupService` によって自動削除されます
