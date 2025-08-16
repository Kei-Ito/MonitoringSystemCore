# コンポーネント構成

主要フォルダ:
- components/: 汎用コンポーネント
- uniqueComponents/: 本プロジェクト専用の UI パーツ（ダッシュボードウィジェット等）
- views/: ページ単位のコンポーネント。ここで components を組み合わせてページを作る。

設計上のガイドライン（現状の実装を踏まえた推奨）:
- presentational（表示のみ）コンポーネントと container（状態/ロジックを持つ）コンポーネントを分離する。
- 可能なら props と emits の型を明確にし、TypeScript 型を利用する。
- 共通 UI（ボタン・フォーム・モーダル等）は components に置き、プロジェクト固有の組み合わせは uniqueComponents に置く。

確認ポイント:
- Vuetify / Element / Material のような UI ライブラリを使っている場合は、そのテーマ適用箇所を確認（Material-Icons, nucleo-icons 等の css を main.ts で読み込んでいる）。
