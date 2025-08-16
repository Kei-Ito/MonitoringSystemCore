# ディレクトリ構成と役割（apps/frontend）

ルート: apps/frontend/src

- App.vue: ルートコンポーネント。レイアウトやルート用のスロットが含まれる。
- main.ts: アプリ起動処理。Pinia、router、i18n、MaterialDashboard、Toast を登録している。
- router/: ルーティング設定。views 以下のページコンポーネントへ紐付く。
- pinia/: Pinia ストア定義。
- components/: 再利用可能な UI コンポーネント群。
- uniqueComponents/: プロジェクト専用の個別コンポーネント群（ダッシュボード等）。
- views/: ページ単位の Vue コンポーネント。
- api/: フロントエンドが利用する API の型・クライアント設定（axios 等のラッパーがある場合はここに配置）。
- service/: ビジネスロジックや API 呼び出しを行うサービス層（apps/frontend/src/service）。
- mock/: 開発用のモックデータ・モックサーバ設定。
- types/: アプリ固有の TypeScript 型定義（shared の型と合わせて利用）。
- utils/: ヘルパー関数や汎用ユーティリティ。
- assets/: 画像・CSS などの静的資産。

shared:
- shared/src: フロントとバックで共有する enum や types。フロントエンドはここから型を import して使う想定。

ビルド/実行関連:
- vite.config.ts: Vite の設定ファイル。エイリアス設定（@ -> src）などを確認。
- package.json: スクリプト（dev / build / preview / lint など）。
