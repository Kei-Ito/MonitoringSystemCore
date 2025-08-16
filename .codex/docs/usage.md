# 開発・ビルド手順（apps/frontend）

前提:
- Node.js と pnpm がインストールされていること。

ローカル開発:
1. ルートで依存をインストール: pnpm install
2. フロントエンドのみ起動: cd apps/frontend && pnpm install && pnpm dev

ビルド:
1. cd apps/frontend
2. pnpm build
3. dist/ にビルド成果物が生成される（設定により apps/frontend/dist）。

Lint / フォーマット:
- プロジェクトルートで pre-commit が設定されている場合は push 前に実行されます。個別にチェックする場合は package.json の scripts を参照してください。

デバッグのヒント:
- Vite のエイリアス (@) は src を指しているため、ソース内 import は @/components/.. のようになっています。
- mock を利用している場合は mock ディレクトリのスクリプトや起動方法を確認してください。
