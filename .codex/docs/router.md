# ルーティング（router）

場所: apps/frontend/src/router

概要:
- ルーティングは vue-router を使用して定義されています。
- 各 route は views ディレクトリ内のページコンポーネントへマッピングされています。

注目点:
- 認証や権限制御が必要なページにはナビゲーションガード（beforeEach 等）が設置される想定ですが、現状の実装でガードがあるかは確認が必要です。
- 動的ルートやネストされたルートは views 配下のディレクトリ構造に依存します。

確認手順:
1. apps/frontend/src/router/index.ts（または router.ts）を開く。
2. 登録されているパス、lazy-load（import() による遅延読み込み）の有無、meta 情報（title / requiresAuth など）を確認する。
