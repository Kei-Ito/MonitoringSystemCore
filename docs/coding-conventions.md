# コーディング規約

本ドキュメントでは MonitoringSystemCore プロジェクトのコーディング規約について説明します。

## 目次

- [全般](#全般)
- [命名規則](#命名規則)
- [ファイル構成](#ファイル構成)
- [インポート順序](#インポート順序)
- [TypeScript](#typescript)
- [エラーハンドリング](#エラーハンドリング)
- [バックエンド固有](#バックエンド固有)
- [フロントエンド固有](#フロントエンド固有)

---

## 全般

### 言語

- TypeScript を使用（JavaScript は使用しない）
- 厳格な型チェックを有効化

### フォーマッター

- ESLint によるコードスタイルチェック
- 設定ファイル: `eslint.config.mjs`

### コメント

- 日本語でのコメントを推奨
- JSDoc形式で関数・クラスを説明

```typescript
/**
 * IOモジュールの入力データを取得する
 * @param moduleUuid モジュールのUUID
 * @returns 入力データの配列
 */
export async function getModuleInput(moduleUuid: string): Promise<InputData[]> {
  // ...
}
```

---

## 命名規則

### ファイル名

| 種類 | 規則 | 例 |
|-----|------|-----|
| サービス | `{Name}Service.ts` | `IOModuleService.ts` |
| コントローラー | `{name}Controller.ts` | `trendDataController.ts` |
| ルーター | `{name}Routers.ts` または `{name}Routes.ts` | `IOModuleRoutes.ts` |
| 型定義 | `{Name}.ts` | `IOModule.ts` |
| ユーティリティ | `{name}.ts` | `csv.ts`, `json.ts` |
| Vue コンポーネント | `{ComponentName}.vue` | `ChannelPickerModal.vue` |
| Pinia ストア | `{name}Store.ts` | `monitoringStore.ts` |

### 変数・関数名

| 種類 | 規則 | 例 |
|-----|------|-----|
| 変数 | camelCase | `currentInputDatas`, `samplingInterval` |
| 関数 | camelCase | `getIOModules()`, `saveInputDatas()` |
| 定数 | UPPER_SNAKE_CASE | `CLEANUP_INTERVAL_MS`, `API_BASE_URL` |
| クラス | PascalCase | `SystemSettingService`, `HealthCheckService` |
| インターフェース | PascalCase | `IOModule`, `SystemSettingData` |
| 型エイリアス | PascalCase | `DailyIntervalCache`, `Result<T>` |
| 列挙型 | PascalCase | `IOModuleStatus`, `ChartTypes` |

### UUID関連

- UUID を含む変数名は `uuid` または `Uuid` を使用
- 複数形は `uuids` または `Uuids`

```typescript
const moduleUuid: string = '...';
const channelUuids: string[] = ['...', '...'];
```

---

## ファイル構成

### バックエンド

```
src/
├── api/           # 外部API連携（ハードウェア制御など）
├── config/        # 設定管理（シングルトンサービス）
├── controllers/   # HTTPリクエストハンドラー
├── factories/     # ファクトリーメソッド
├── models/        # データモデル定義
├── routes/        # ルーティング定義
├── services/      # ビジネスロジック
└── utils/         # ユーティリティ関数
```

### フロントエンド

```
src/
├── api/           # APIクライアント
├── components/    # 再利用可能コンポーネント
├── composables/   # Composition API フック
├── pinia/         # 状態管理ストア
├── router/        # ルーティング設定
├── service/       # サービス層（API呼び出しラッパー）
├── types/         # フロントエンド固有の型定義
├── utils/         # ユーティリティ関数
└── views/         # ページコンポーネント
```

---

## インポート順序

以下の順序でインポートを記述します。各グループ間は空行で区切ります。

### バックエンド

```typescript
// 1. Node.js 組み込みモジュール
import path from 'path';
import fs from 'fs';

// 2. 外部ライブラリ
import express from 'express';
import axios from 'axios';

// 3. @monitoring/shared パッケージ
import { IOModule } from '@monitoring/shared/model';
import { Result, ok, err } from '@monitoring/shared/utils';

// 4. ローカルモジュール（src/ 配下）
import { SystemSettingService } from 'src/config/SystemSetting';
import * as IOModuleService from 'src/services/IOModuleService';
```

### フロントエンド

```typescript
// 1. Vue 関連
import { ref, computed, onMounted } from 'vue';

// 2. 外部ライブラリ
import { useToast } from 'vue-toast-notification';

// 3. @monitoring/shared パッケージ
import type { IOModule } from '@monitoring/shared/model';

// 4. ローカルモジュール（@/ エイリアス使用）
import { useMonitoringStore } from '@/pinia/monitoringStore';
import * as api from '@/api';
```

---

## TypeScript

### 型定義

- 可能な限り明示的に型を指定
- `any` の使用は最小限に（やむを得ない場合はコメントで理由を記載）
- 共有する型は `@monitoring/shared` に定義

```typescript
// ✓ Good
const modules: IOModule[] = [];
function getModule(uuid: string): IOModule | undefined { ... }

// ✗ Bad
const modules = [];  // 型がany[]になる
function getModule(uuid) { ... }  // 引数・戻り値の型がない
```

### 型のインポート

型のみをインポートする場合は `import type` を使用

```typescript
import type { IOModule, IChannelSetting } from '@monitoring/shared/model';
import { IOModuleStatus } from '@monitoring/shared/enum';
```

### Null/Undefined ハンドリング

- オプショナルチェーン `?.` を活用
- Nullish coalescing `??` でデフォルト値を設定

```typescript
const name = channel?.name ?? 'Unknown';
const value = setting?.dataRetentionDays ?? 365;
```

---

## エラーハンドリング

### Result 型の使用

`@monitoring/shared/utils` の Result 型を使用して成功/失敗を表現

```typescript
import { Result, ok, err } from '@monitoring/shared/utils';

async function saveData(): Promise<Result<void>> {
  try {
    await fs.promises.writeFile(path, data);
    return ok(void 0);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return err(`Failed to save: ${message}`);
  }
}

// 使用側
const result = await saveData();
if (result.ok) {
  console.log('Success');
} else {
  console.error(result.error);
}
```

### try-catch パターン

```typescript
try {
  // 処理
} catch (error) {
  // Error オブジェクトかどうかを確認
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('Error:', errorMessage);
  
  // 必要に応じてリスロー
  throw error;
}
```

### HTTPエラーレスポンス

```typescript
// コントローラーでのエラーレスポンス
export async function getIOModules(req: Request, res: Response) {
  try {
    const modules = await IOModuleService.getIOModules();
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get IO modules' });
  }
}
```

---

## バックエンド固有

### シングルトンパターン

設定サービスなど、アプリケーション全体で1インスタンスのみ必要なクラスに使用

```typescript
export class SystemSettingService {
  private static _instance: SystemSettingService | null = null;
  
  private constructor() {}
  
  public static getInstance(): SystemSettingService {
    if (!SystemSettingService._instance) {
      SystemSettingService._instance = new SystemSettingService();
    }
    return SystemSettingService._instance;
  }
}

// エクスポート
export default SystemSettingService.getInstance();
```

### コントローラーの形式

```typescript
// RequestHandler 型を使用する場合
export const getSystemSetting: RequestHandler = async (req, res) => {
  // ...
};

// 通常の関数として定義する場合
export async function getTrendData(req: Request, res: Response) {
  // ...
}
```

### ルーティング定義

```typescript
import { Router } from 'express';
import * as controller from 'src/controllers/exampleController';

const router: Router = Router();

router.get('/items', controller.getItems);
router.post('/items', controller.createItem);
router.put('/items/:id', controller.updateItem);
router.delete('/items/:id', controller.deleteItem);

export default router;
```

---

## フロントエンド固有

### Composition API

Vue 3 の Composition API を使用

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useMonitoringStore } from '@/pinia/monitoringStore';

const store = useMonitoringStore();

const items = ref<Item[]>([]);
const filteredItems = computed(() => items.value.filter(i => i.active));

onMounted(async () => {
  await store.initialize();
});
</script>
```

### Pinia ストア

```typescript
import { defineStore } from 'pinia';

export const useExampleStore = defineStore('example', {
  state: () => ({
    items: [] as Item[],
    loading: false,
  }),
  
  getters: {
    activeItems: (state) => state.items.filter(i => i.active),
  },
  
  actions: {
    async fetchItems() {
      this.loading = true;
      try {
        const result = await api.getItems();
        if (result.ok) {
          this.items = result.value;
        }
      } finally {
        this.loading = false;
      }
    },
  },
});
```

### サービス層パターン

API呼び出しとエラーハンドリングをカプセル化

```typescript
import { handleApiRequest } from '@/service/handle';
import * as api from '@/api';

export const fetchItems = (options?: { showErrorToast?: boolean }) =>
  handleApiRequest({
    apiCall: () => api.getItems(),
    onSuccess: (val) => val,
    errorMsg: 'アイテムの取得に失敗しました',
    showErrorToast: options?.showErrorToast,
  });
```

### CSS スタイル

- Scoped CSS を使用
- Material Dashboard テーマに準拠

```vue
<style scoped>
.component-class {
  /* スタイル */
}
</style>
```

---

## コミットメッセージ

以下の形式を推奨：

```
<type>: <subject>

<body>
```

### Type

| Type | 説明 |
|------|------|
| feat | 新機能 |
| fix | バグ修正 |
| docs | ドキュメント |
| style | フォーマット変更（機能変更なし） |
| refactor | リファクタリング |
| test | テスト追加・修正 |
| chore | ビルド・設定変更 |

### 例

```
feat: データ自動削除機能を追加

- dataRetentionDays 設定を追加
- dataCleanupService を新規作成
- 起動時および24時間ごとに古いデータを削除
```
