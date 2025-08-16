# i18n とテーマ（Material Dashboard）

場所:
- apps/frontend/src/i18n.ts
- apps/frontend/src/material-dashboard.ts

概要:
- i18n: vue-i18n を利用して多言語対応を行う設定が含まれています。
- Material Dashboard: カスタムのプラグイン / テーマ設定で、アプリ全体の UI テーマを提供します。

注目点:
- i18n のメッセージファイル（ロケール）を確認し、未翻訳箇所を把握する（開発途中である可能性あり）。
- テーマ設定に依存する CSS（global-style.css 等）が正しくロードされているか確認してください。
