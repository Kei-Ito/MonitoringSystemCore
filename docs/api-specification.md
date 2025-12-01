# API 仕様書

本ドキュメントでは MonitoringSystemCore が提供する REST API エンドポイントの仕様を説明します。

## 目次

- [概要](#概要)
- [共通仕様](#共通仕様)
- [IOモジュール API](#ioモジュール-api)
- [トレンドデータ API](#トレンドデータ-api)
- [システム設定 API](#システム設定-api)
- [UIレイアウト API](#uiレイアウト-api)
- [システム制御 API](#システム制御-api)
- [ヘルスチェック API](#ヘルスチェック-api)
- [ファイル API](#ファイル-api)
- [WebSocket API](#websocket-api)

---

## 概要

| 項目 | 値 |
|-----|-----|
| ベースURL | `http://localhost:2478/api` |
| プロトコル | HTTP/1.1 |
| データ形式 | JSON |
| 文字コード | UTF-8 |

---

## 共通仕様

### レスポンス形式

#### 成功時
```json
{
  "success": true,
  "data": { ... }
}
```

#### エラー時
```json
{
  "error": "エラーメッセージ"
}
```

または

```json
{
  "success": false,
  "error": "エラーメッセージ"
}
```

### HTTPステータスコード

| コード | 説明 |
|-------|------|
| 200 | 成功 |
| 400 | リクエスト不正（パラメータエラー） |
| 404 | リソースが見つからない |
| 500 | サーバー内部エラー |
| 503 | サービス利用不可（ドライブ未マウント等） |

---

## IOモジュール API

ベースパス: `/api/io_module`

### IOモジュール一覧取得

```
GET /api/io_module/get_io_modules
```

**レスポンス**
```typescript
IOModule[]
```

```json
[
  {
    "uuid": "module-uuid-1",
    "name": "温度センサーモジュール",
    "type": "MODBUS",
    "status": "CONNECTED",
    "ipAddress": "192.168.1.100",
    "port": 502,
    "channels": [
      {
        "uuid": "channel-uuid-1",
        "name": "温度1",
        "unit": "℃",
        "min": 0,
        "max": 100
      }
    ]
  }
]
```

### サンプリング開始

```
POST /api/io_module/start
```

**リクエストボディ**
```json
{
  "samplingIntervalUuid": "fast"
}
```

**レスポンス**
```json
{
  "message": "IOModule input data sampling interval started."
}
```

### サンプリング停止

```
POST /api/io_module/stop
```

**レスポンス**
```json
{
  "message": "IOModule input data sampling interval stopped."
}
```

### 現在の入力データ取得

```
GET /api/io_module/current
```

**レスポンス**
```json
{
  "input_datas": [
    {
      "module_uuid": "module-uuid-1",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "channels": [
        {
          "channel_uuid": "channel-uuid-1",
          "input_data": 25.5
        }
      ]
    }
  ]
}
```

### IOモジュール追加

```
POST /api/io_module/add_io_module
```

**リクエストボディ**
```typescript
IOModule
```

### IOモジュール更新

```
PATCH /api/io_module/update_io_module
```

**リクエストボディ**
```typescript
IOModule
```

### IOモジュール削除

```
DELETE /api/io_module/delete_io_module
```

**リクエストボディ**
```json
{
  "uuid": "module-uuid-to-delete"
}
```

### チャンネル追加

```
POST /api/io_module/add_channel
```

**リクエストボディ**
```json
{
  "moduleUuid": "module-uuid-1",
  "channel": {
    "name": "新しいチャンネル",
    "unit": "V"
  }
}
```

### チャンネル削除

```
POST /api/io_module/delete_channel
```

---

## トレンドデータ API

ベースパス: `/api/trend_data`

### トレンドデータ取得

```
GET /api/trend_data/
```

**クエリパラメータ**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| channel_uuid | string | ✓ | チャンネルUUID |
| start_time | string | ✓ | 開始日時 (ISO 8601形式) |
| end_time | string | ✓ | 終了日時 (ISO 8601形式) |

**例**
```
GET /api/trend_data/?channel_uuid=ch-001&start_time=2024-01-15T00:00:00Z&end_time=2024-01-15T23:59:59Z
```

**レスポンス**
```json
[
  {
    "timestamp": "2024-01-15T10:00:00.000Z",
    "value": 25.5
  },
  {
    "timestamp": "2024-01-15T10:01:00.000Z",
    "value": 25.6
  }
]
```

### 集計トレンドデータ取得

```
GET /api/trend_data/aggregated
```

**クエリパラメータ**

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| channel_uuid | string | ✓ | チャンネルUUID |
| start_time | string | ✓ | 開始日時 |
| end_time | string | ✓ | 終了日時 |
| interval_minutes | number | ✓ | 集計間隔（分） |

---

## システム設定 API

ベースパス: `/api/system_setting`

### システム設定取得

```
GET /api/system_setting/get_system_setting
```

**レスポンス**
```typescript
interface SystemSettingData {
  samplingIntervals: SamplingInterval[];
  dataRootPath: string;
  driveUUID?: string;
  dataRetentionDays: number;
  category1list: string[];
  category2list: string[];
  dashboardViewCategory1Selected: string[];
  dashboardViewCategory2Selected: string[];
  trendViewCategory1Selected: string[];
  trendViewCategory2Selected: string[];
}
```

```json
{
  "samplingIntervals": [
    { "uuid": "fast", "name": "高速サンプリング", "period": 60000 },
    { "uuid": "slow", "name": "低速サンプリング", "period": 300000 }
  ],
  "dataRootPath": "/media/data",
  "dataRetentionDays": 365,
  "category1list": ["照射炉1", "照射炉2"],
  "category2list": ["液温", "UV強度"],
  "dashboardViewCategory1Selected": ["照射炉1"],
  "dashboardViewCategory2Selected": ["液温", "UV強度"],
  "trendViewCategory1Selected": ["照射炉1"],
  "trendViewCategory2Selected": ["液温"]
}
```

### サンプリングインターバル一覧取得

```
GET /api/system_setting/sampling_intervals
```

### サンプリングインターバル追加

```
POST /api/system_setting/sampling_intervals
```

**リクエストボディ**
```json
{
  "name": "新しいインターバル",
  "period": 120000
}
```

### サンプリングインターバル更新

```
PUT /api/system_setting/sampling_intervals/:uuid
```

### サンプリングインターバル削除

```
DELETE /api/system_setting/sampling_intervals/:uuid
```

---

## UIレイアウト API

ベースパス: `/api/ui`

### レイアウト取得

```
GET /api/ui/layouts
```

**レスポンス**
```typescript
interface UiLayout {
  dashboard: LayoutItem[];
  trend: LayoutItem[];
}

interface LayoutItem {
  i: string;      // アイテムID
  x: number;      // X座標
  y: number;      // Y座標
  w: number;      // 幅
  h: number;      // 高さ
  chartConfig: ChartConfig;
}
```

### レイアウト更新

```
POST /api/ui/layouts
```

**リクエストボディ**
```typescript
UiLayout
```

---

## システム制御 API

ベースパス: `/api/system`

### シャットダウン

```
POST /api/system/shutdown
```

**レスポンス**
```json
{
  "message": "System shutdown initiated"
}
```

### 再起動

```
POST /api/system/reboot
```

**レスポンス**
```json
{
  "message": "System reboot initiated"
}
```

---

## ヘルスチェック API

ベースパス: `/api/health`

### システムヘルスチェック

```
GET /api/health/check
```

**レスポンス**
```typescript
interface HealthCheckResponse {
  success: boolean;
  data: {
    drivesMounted: boolean;
    lastCheck: string;
  };
}
```

```json
{
  "success": true,
  "data": {
    "drivesMounted": true,
    "lastCheck": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## ファイル API

ベースパス: `/api/files`

### CSVダウンロード

```
GET /api/files/download-csv
```

**レスポンス**

- Content-Type: `text/csv`
- Content-Disposition: `attachment; filename="sample.csv"`

---

## WebSocket API

### 接続

```
ws://localhost:2479
```

### メッセージ形式

#### サンプリング状態通知（接続時）

```json
{
  "type": "samplingStatus",
  "data": true
}
```

#### IOモジュールデータ配信

```json
{
  "type": "IOModuleData",
  "data": [
    {
      "module_uuid": "module-uuid-1",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "channels": [
        {
          "channel_uuid": "channel-uuid-1",
          "input_data": 25.5
        }
      ]
    }
  ]
}
```

#### サンプリング開始通知

```json
{
  "type": "start",
  "data": {
    "samplingInterval": {
      "uuid": "fast",
      "name": "高速サンプリング",
      "period": 60000
    }
  }
}
```

#### サンプリング停止通知

```json
{
  "type": "stop"
}
```

---

## 型定義リファレンス

主要な型定義は `@monitoring/shared` パッケージで提供されています。

```typescript
// @monitoring/shared/model
import { IOModule, IChannelSetting, SystemSettingData } from '@monitoring/shared/model';

// @monitoring/shared/api
import { trendDataRequest, getIOModuleInputResponse } from '@monitoring/shared/api';

// @monitoring/shared/enum
import { IOModuleStatus, IOModuleTypes } from '@monitoring/shared/enum';

// @monitoring/shared/utils
import { Result, ok, err } from '@monitoring/shared/utils';
```
