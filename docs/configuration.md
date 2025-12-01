# 設定・環境変数

本ドキュメントでは MonitoringSystemCore の設定ファイル、環境変数、ポート設定について説明します。

## 目次

- [ポート設定](#ポート設定)
- [設定ファイル](#設定ファイル)
- [外部依存サービス](#外部依存サービス)
- [データ保存パス](#データ保存パス)
- [開発環境と本番環境](#開発環境と本番環境)

---

## ポート設定

| サービス | ポート | 説明 | 設定箇所 |
|---------|-------|------|---------|
| バックエンド REST API | 2478 | Express サーバー | `apps/backend/src/server.ts` |
| WebSocket | 2479 | リアルタイム通信 | `apps/backend/src/server.ts` |
| ハードウェア制御API | 8000 | IOモジュール連携（外部） | `apps/backend/src/api/IOModuleAPI.ts` |
| フロントエンド開発サーバー | 5173 | Vite 開発サーバー | `apps/frontend/vite.config.ts` |

### ポート変更方法

現時点ではハードコーディングされています。変更する場合は以下のファイルを編集してください：

```typescript
// apps/backend/src/server.ts
const PORT = 2478;
const WEBSOCKET_PORT = 2479;

// apps/backend/src/api/IOModuleAPI.ts
const API_BASE_URL = 'http://localhost:8000';
```

---

## 設定ファイル

設定ファイルは `apps/backend/LocalData/` ディレクトリに JSON 形式で保存されます。

### systemSetting.json

システム全体の設定を管理します。

```json
{
  "samplingIntervals": [
    {
      "uuid": "fast",
      "name": "高速サンプリング",
      "period": 60000
    },
    {
      "uuid": "slow",
      "name": "低速サンプリング",
      "period": 300000
    }
  ],
  "dataRootPath": "/media/linaro/HD-WHAU3",
  "driveUUID": "9A1A2BF71A2BCED7",
  "dataRetentionDays": 365,
  "category1list": ["照射炉1", "照射炉2", "照射炉3"],
  "category2list": ["液温", "UV強度", "炉内温度"],
  "dashboardViewCategory1Selected": ["照射炉1"],
  "dashboardViewCategory2Selected": ["液温", "UV強度"],
  "trendViewCategory1Selected": ["照射炉1"],
  "trendViewCategory2Selected": ["液温"]
}
```

| プロパティ | 型 | 説明 | デフォルト値 |
|-----------|-----|------|------------|
| `samplingIntervals` | SamplingInterval[] | サンプリング周期の定義 | 2種類（高速/低速） |
| `dataRootPath` | string | データ保存先のルートパス | `""` |
| `driveUUID` | string | 外部ドライブのUUID | `""` |
| `dataRetentionDays` | number | データ保存期間（日数） | `365` |
| `category1list` | string[] | カテゴリ1の選択肢 | `[]` |
| `category2list` | string[] | カテゴリ2の選択肢 | `[]` |
| `dashboardViewCategory*Selected` | string[] | ダッシュボードのフィルタ | `[]` |
| `trendViewCategory*Selected` | string[] | トレンド画面のフィルタ | `[]` |

### ioModuleSetting.json

IOモジュール（センサー等）の設定を管理します。

```json
[
  {
    "uuid": "module-001",
    "name": "温度センサーモジュール",
    "type": "MODBUS",
    "status": "DISCONNECTED",
    "ipAddress": "192.168.1.100",
    "port": 502,
    "samplingIntervalUuid": "fast",
    "channels": [
      {
        "uuid": "ch-001",
        "name": "液温",
        "unit": "℃",
        "category1": "照射炉1",
        "category2": "液温",
        "min": 0,
        "max": 100,
        "decimalPlaces": 1
      }
    ]
  }
]
```

### uiLayouts.json

ダッシュボード・トレンド画面のレイアウト設定を管理します。

```json
{
  "dashboard": [
    {
      "i": "chart-1",
      "x": 0,
      "y": 0,
      "w": 6,
      "h": 4,
      "chartConfig": {
        "uuid": "config-1",
        "type": "LINE",
        "channelUuids": ["ch-001", "ch-002"]
      }
    }
  ],
  "trend": []
}
```

---

## 外部依存サービス

### ハードウェア制御API

IOモジュールとの通信を行う外部サービスです。

| 項目 | 値 |
|-----|-----|
| ベースURL | `http://localhost:8000` |
| 通信方式 | HTTP REST |
| 設定箇所 | `apps/backend/src/api/IOModuleAPI.ts` |

**提供されるエンドポイント**

| エンドポイント | 役割 |
|--------------|------|
| `POST /fetch_module/` | モジュール状態の取得 |
| `POST /add_channel/` | チャンネルの追加 |
| `GET /get_input/` | 入力値の取得 |

**注意**: ハードウェア制御APIが利用できない場合は、`IOModuleAPI.ts` をモック化するか、サービス層でダミーデータを返すように変更してください。

### 外部ドライブ

データの永続化には外部ドライブを使用します。

| 項目 | 説明 |
|-----|------|
| マウントポイント | `systemSetting.json` の `dataRootPath` |
| ドライブ識別 | `driveUUID` でマウント確認 |
| ヘルスチェック | `HealthCheckService` でマウント状態を監視 |

---

## データ保存パス

### ディレクトリ構造

```
{dataRootPath}/
├── {year}/
│   └── {month}/
│       └── {day}/
│           ├── data.csv              # デフォルトのデータファイル
│           └── data_{suffix}.csv     # サンプリング周期別ファイル
│
└── cache/
    ├── {year}/{month}/{day}/
    │   └── cache_{channelUuid}_{resolution}.json  # トレンドデータキャッシュ
    │
    ├── aggregated/{channelUuid}/{intervalMinutes}/
    │   └── {date}.json               # 集計データキャッシュ
    │
    └── daily_total/{channelUuid}/
        └── {date}.json               # 日次合計キャッシュ
```

### CSVファイル形式

データファイルは BOM付き UTF-8 で保存されます。

```csv
HEADER,温度1,温度2,圧力
HEADER,℃,℃,kPa
HEADER,ch-001,ch-002,ch-003
2024/01/15 10:00:00.000,25.5,26.0,101.3
2024/01/15 10:01:00.000,25.6,26.1,101.4
```

- 1行目: チャンネル名
- 2行目: 単位
- 3行目: チャンネルUUID
- 4行目以降: タイムスタンプ + データ値

---

## 開発環境と本番環境

### 開発環境

```bash
# 開発サーバー起動
pnpm dev
```

- フロントエンド: Vite 開発サーバー (HMR有効)
- バックエンド: ts-node による直接実行

### 本番環境

```bash
# ビルド
pnpm -r run build

# 本番サーバー起動
cd apps/backend
node dist/server.js
```

- フロントエンド: ビルド済み静的ファイルをバックエンドから配信
- バックエンド: コンパイル済み JavaScript を実行

### systemd サービス設定

Linux環境での自動起動設定例は `apps/backend/systemd/monitoring-system.service` を参照してください。

```ini
[Unit]
Description=Monitoring System Core Service
After=network.target

[Service]
Type=simple
User=linaro
WorkingDirectory=/home/linaro/MonitoringSystemCoreService/apps/backend
ExecStart=/usr/bin/node dist/server.js
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## 設定の優先順位

1. **ローカルJSONファイル** (`LocalData/*.json`) - 最優先
2. **コード内のデフォルト値** - JSONファイルにプロパティがない場合に使用

### 新規プロパティ追加時の注意

1. `@monitoring/shared` で型定義を追加
2. `SystemSettingService` でデフォルト値を設定
3. `loadSystemSettingFromDatabase()` でマイグレーション処理を追加
4. `shared` パッケージを再ビルド

```typescript
// apps/backend/src/config/SystemSetting.ts
public async loadSystemSettingFromDatabase(): Promise<void> {
    // ...
    // 新規プロパティがない場合はデフォルトを設定
    if (this._systemSetting.newProperty === undefined) {
        this._systemSetting.newProperty = defaultSetting.newProperty;
        needsSave = true;
    }
    // ...
}
```
