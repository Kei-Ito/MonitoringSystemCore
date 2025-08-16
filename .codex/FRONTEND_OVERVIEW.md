# フロントエンド横断ドキュメント

このドキュメントはリポジトリ内のフロントエンド実装（主に `apps/frontend`）を横断して調査し、構成・主要ファイル・実装状況・実行手順・注意点をまとめたものです。

概要:
- フレームワーク: Vue 3
- 状態管理: Pinia
- ルーティング: vue-router
- ビルド: Vite
- パッケージ管理: pnpm

配置:
- apps/frontend: 実際のフロントエンドアプリケーション
- shared: フロントエンドとバックエンドで共有する型や定義（`shared/src`）

このファイルは簡易目次とし、詳細は下位セクションにリンクします。

- docs/structure: ディレクトリ構成と役割
- docs/router: ルーティングの構成と注目ポイント
- docs/stores: Pinia のストア構成
- docs/api: API 層（service）と mock の説明
- docs/components: 主要コンポーネントと uniqueComponents の説明
- docs/i18n_and_theming: i18n と Material Dashboard の統合
- docs/todo: 現状未完成・要注意箇所
