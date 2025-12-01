# MonitoringSystemCore

監視システム（MonitoringSystem）のコアサービスです。様々なセンサーや機器からデータを収集・分析し、リアルタイムで可視化するプラットフォームを提供します。

## 目次

- [システム概要](#システム概要)
- [技術スタック](#技術スタック)
- [セットアップ](#セットアップ)
- [開発コマンド](#開発コマンド)
- [プロジェクト構成](#プロジェクト構成)
- [ドキュメント一覧](#ドキュメント一覧)

## システム概要

本システムは以下の機能を提供します：

- **リアルタイムデータ収集**: IOモジュール（センサー等）からのデータ取得
- **データ可視化**: ダッシュボード・トレンドグラフによる時系列データ表示
- **設定管理**: サンプリング周期、カテゴリ分類、UIレイアウトのカスタマイズ
- **データ永続化**: CSV形式でのログ保存と自動クリーンアップ

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Vue.js 3, Vite, TypeScript, Pinia |
| バックエンド | Node.js, Express, TypeScript, WebSocket |
| 共有モジュール | TypeScript (型定義・ユーティリティ) |
| パッケージ管理 | pnpm (モノレポ構成) |
| データ永続化 | ファイルシステム (CSV, JSON) |

## セットアップ

### 必要環境

- Node.js v18以上
- pnpm v8以上

### インストール

```bash
# リポジトリのクローン
git clone <repository-url>
cd MonitoringSystemCoreService

# 依存関係のインストール
pnpm install
```

### 共有パッケージのビルド

初回または共有型を変更した場合：

```bash
pnpm --filter @monitoring/shared run build
```

## 開発コマンド

```bash
# 開発サーバーの起動（フロントエンド + バックエンド同時起動）
pnpm dev

# 全パッケージのビルド
pnpm -r run build

# リント実行
pnpm lint

# 個別パッケージの開発サーバー起動
pnpm --filter @monitoring/frontend run dev
pnpm --filter @monitoring/backend run dev
```

## プロジェクト構成

```
MonitoringSystemCoreService/
├── apps/
│   ├── backend/          # Express バックエンドサーバー
│   │   ├── src/
│   │   │   ├── api/          # 外部API連携
│   │   │   ├── config/       # システム設定
│   │   │   ├── controllers/  # APIコントローラー
│   │   │   ├── routes/       # ルーティング定義
│   │   │   ├── services/     # ビジネスロジック
│   │   │   └── utils/        # ユーティリティ
│   │   └── LocalData/        # ローカル設定ファイル (JSON)
│   │
│   └── frontend/         # Vue.js フロントエンド
│       └── src/
│           ├── api/          # APIクライアント
│           ├── components/   # 再利用可能コンポーネント
│           ├── pinia/        # 状態管理ストア
│           ├── router/       # ルーティング
│           ├── service/      # サービス層
│           └── views/        # ページコンポーネント
│
├── shared/               # 共有パッケージ
│   └── src/
│       ├── enum/             # 列挙型定義
│       └── types/            # 型定義
│
└── docs/                 # ドキュメント
```

## ドキュメント一覧

| ドキュメント | 説明 |
|-------------|------|
| [アーキテクチャ](./architecture.md) | システム構成・データフロー |
| [API仕様](./api-specification.md) | REST API エンドポイント一覧 |
| [設定・環境](./configuration.md) | ポート番号・環境変数・設定ファイル |
| [サービス層](./services.md) | バックエンドサービスの詳細 |
| [コーディング規約](./coding-conventions.md) | 命名規則・コードスタイル |

## ポート番号

| サービス | ポート | 説明 |
|---------|-------|------|
| バックエンド (REST API) | 2478 | Express サーバー |
| WebSocket | 2479 | リアルタイム通信 |
| ハードウェア制御API | 8000 | IOモジュール連携（外部） |
| フロントエンド (開発時) | 5173 | Vite 開発サーバー |

## ライセンス

Private
