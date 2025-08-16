# API 層と mock

場所:
- apps/frontend/src/api
- apps/frontend/src/service
- apps/frontend/src/mock

役割:
- api: API の型やエンドポイント定義、クライアント設定（axios 等）を含むことが多い。
- service: コンポーネントから呼ばれるビジネスロジックや API 呼び出しラッパー。エラーハンドリングやレスポンス整形を行う。
- mock: 開発用のモックデータ、モックサーバや fixture。開発中はここを使って API が未完成でも UI 開発を進められる。

shared 連携:
- shared/src/types に API の型がある場合は、service と API レスポンスで型を共有することを推奨します。

確認ポイント:
- axios や fetch をラップしている箇所のタイムアウト・共通ヘッダ・認証トークン注入の実装。
- エラーハンドリング方針（トースト通知、リトライ、401 のリダイレクト等）。
