# アイテム実装ルール - Terraria Collection Manager

このファイルは、新しいアイテムを追加する際に遵守すべき実装ルールと現在の状態を記録しています。

## 現在の実装状態

### アイコンシステム
1. **フォールバック戦略**: PNG → SVG → 文字ベースプレースホルダー
2. **プレースホルダーの統一**: 全カテゴリで軽量な文字ベース（薄いグレー背景 #f3f4f6 + 濃いグレーテキスト #374151）
3. **アイコンパス**: `/assets/icons/{category}/{id}.png` 形式

### データ構造
- **メインデータファイル**: `src/data/real-data/curated-items.json`
- **単一真実のソース**: アイテムデータはこのファイルのみで管理
- **必須フィールド**: id, name, type, category, subcategory, iconPath, acquisition, description, rarity, gameStage, owned, collectionType

### カテゴリ分類
- **Weapons**: Melee, Ranged, Magic, Summoner
- **Armor**: Head, Chest, Legs  
- **Accessories**: Movement, Health, Permanent, Combat, Utility
- **NPCs**: Helper, Vendor, Service
- **Bosses**: Pre-Hardmode, Hardmode, Event

## 新アイテム追加ルール

### 1. データ追加
```json
{
  "id": "ゲーム内ID（文字列）",
  "name": "アイテム名",
  "type": "weapon|armor|accessory|npc|boss",
  "category": "Weapons|Armor|Accessories|NPCs|Bosses",
  "subcategory": "適切なサブカテゴリ",
  "subSubcategory": "詳細分類（オプション）",
  "iconPath": "/assets/icons/{category}/{id}.png",
  "acquisition": ["取得方法の配列"],
  "description": "アイテムの説明",
  "rarity": "white|blue|green|orange|red|yellow|purple",
  "gameStage": "pre-hardmode|hardmode",
  "owned": false,
  "collectionType": "collectible|reference"
}
```

### 2. アイコンファイル配置
- **パス**: `public/assets/icons/{category}/{id}.png`
- **推奨サイズ**: 64x64ピクセル
- **フォーマット**: PNG（SVGでも可）
- **ソース**: Terraria公式Wiki推奨

### 3. 分類の正確性
- **武器分類**: ゲーム内での実際の分類に従う
  - Terraprisma → Summoner
  - Life Crystal → consumable（weaponではない）
- **アイテムタイプ**: TypeScript の ItemType 型に準拠

### 4. ID管理
- **重複防止**: 既存IDとの重複を必ず確認
- **ID形式**: ゲーム内アイテムIDを文字列として使用
- **特殊アイテム**: tool_1, npc_guide など接頭辞付きも可

## コンポーネント実装ルール

### ItemIcon コンポーネント
- **フォールバック順序**: PNG → SVG → DynamicIcon
- **エラーハンドリング**: 適切な状態管理でエラー時の表示崩れを防止
- **パフォーマンス**: useCallback でレンダリング最適化

### DynamicIcon コンポーネント  
- **文字マッピング**: 各カテゴリに対応した文字（W, A, C, U, X, etc.）
- **スタイリング**: 統一された薄いグレー背景 + 濃いグレーテキスト
- **レスポンシブ**: size プロパティに応じた適切なフォントサイズ

## プロジェクト設定ファイル

### 変更禁止
- `next.config.js`
- `tsconfig.json` 
- `package.json` の dependencies/devDependencies
- `tailwind.config.js`
- `vercel.json`（作成も含む）

### 変更条件
明確な理由と必要性がある場合のみ、事前説明とレビューを経て変更可能

## デプロイメント前チェック

### 必須確認事項
1. `npm run build` でローカルビルド成功
2. TypeScript型整合性の確認
3. アイコンファイルとiconPathの一致確認
4. ID重複チェック
5. カテゴリ分類の正確性確認

### Git管理
- コミット前に変更内容の確認
- 適切なコミットメッセージ
- GitHubへのプッシュでVercel自動デプロイ

## トラブルシューティング

### よくある問題
1. **アイコン表示されない**: iconPathとファイル位置の不一致
2. **Terra Blade問題**: ID重複による表示バグ
3. **ビルドエラー**: TypeScript型定義の不整合
4. **プレースホルダー不統一**: SVGファイルの直接編集で解決

---

このルールに従って段階的にアイテムを追加し、品質と一貫性を保持してください。