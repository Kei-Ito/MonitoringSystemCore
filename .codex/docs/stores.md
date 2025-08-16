# 状態管理（Pinia ストア）

場所: apps/frontend/src/pinia

概要:
- Pinia を用いて状態管理を行います。main.ts で createPinia() を登録しています。

典型的な構成:
- modules ごとにファイルを分け、export された useXxxStore 関数をコンポーネントから呼び出して利用します。

注目ポイント:
- ストア内で API 呼び出し（service 層）を直接行っている場合があるため、ビジネスロジックの分離状況を確認してください。
- 永続化（localStorage / sessionStorage）やサーバとの同期ロジックが実装されている場合は、初期化フロー（アプリ起動時の hydrate）の確認が必要です。
