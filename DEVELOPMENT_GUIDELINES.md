# Terraria Collection Manager - 開発ガイドライン

## 📋 概要

このドキュメントは、Terraria Collection Managerの開発において今後発生しうる問題を防ぐため、今回の経験をもとに作成されたガイドラインです。

## 🚨 今回発生した主な問題と教訓

### 1. データとアイコンの不整合問題
**問題:** アイテムデータとアイコンファイルの不一致により、アプリケーションでアイコンが表示されない

**原因:**
- アイテムデータのパスとアイコンファイルの実際の場所が一致しない
- PNG/SVGの拡張子の混在
- 複数のデータファイルで同じアイテムが重複定義

**解決策:**
- キュレーションされた単一データファイル(`curated-items.json`)の導入
- アイコンファイルの存在確認とパス整合性の保証

### 2. アイテム分類の誤り
**問題:** Life Crystalが武器として分類されていた

**原因:**
- 自動変換スクリプトでの分類ロジックの不備
- 手動レビューの不足

**解決策:**
- 各アイテムの正しいTerrariaゲーム内分類の確認
- 分類スキーマの明確化

### 3. TypeScript型エラー
**問題:** ビルド時にItemType型の不一致エラー

**原因:**
- JSONデータの`type`フィールドが文字列型だが、TypeScriptでは厳密な型定義が必要

**解決策:**
- 適切な型キャストの実装
- データとTypeScript型定義の整合性確保

## 📂 データ管理のベストプラクティス

### データファイル構造の原則

1. **単一真実のソース (Single Source of Truth)**
   ```
   src/data/real-data/curated-items.json - メインデータファイル
   src/data/v0-data.ts - フォールバック用サンプルデータ
   ```

2. **アイコンとデータの対応**
   ```
   データ: { "id": "4", "iconPath": "/assets/icons/weapons/4.png" }
   ファイル: public/assets/icons/weapons/4.png (実際に存在する必要がある)
   ```

3. **分類の一貫性**
   ```typescript
   // 正しい分類例
   {
     "name": "Life Crystal",
     "type": "consumable",        // ItemType列挙型に準拠
     "category": "Upgrades",      // 論理的なグループ
     "subcategory": "Permanent",  // 詳細分類
     "subSubcategory": "health"   // さらなる詳細
   }
   ```

### データ追加・変更時のチェックリスト

#### ✅ 新しいアイテムを追加する際
1. **アイコンファイルの確認**
   - [ ] アイコンファイルが`public/assets/icons/`に存在する
   - [ ] ファイル拡張子（.png/.svg）がデータと一致している
   - [ ] ファイルサイズが0バイトでない

2. **分類の確認**
   - [ ] `type`フィールドがTypeScriptの`ItemType`型に準拠している
   - [ ] Terrariaゲーム内での実際の分類と一致している
   - [ ] 既存アイテムと分類が整合している

3. **データ整合性**
   - [ ] IDが既存アイテムと重複していない
   - [ ] 必須フィールドがすべて入力されている
   - [ ] 同じアイテムが他のファイルで重複定義されていない

#### ✅ アイコンを追加・変更する際
1. **ファイル配置**
   - [ ] 正しいカテゴリディレクトリに配置
   - [ ] ファイル名がアイテムIDと一致
   - [ ] ファイルサイズが適切（100バイト以上）

2. **パス更新**
   - [ ] `curated-items.json`のiconPathを更新
   - [ ] 拡張子の一致確認

## 🛠️ 開発時の推奨フロー

### 1. データ変更時
```bash
# 1. データファイル編集
vim src/data/real-data/curated-items.json

# 2. TypeScript型チェック
npm run type-check

# 3. ローカルビルドテスト
npm run build

# 4. アイコン表示確認
npm run dev
```

### 2. アイコン追加時
```bash
# 1. アイコンファイル配置
cp new-icon.png public/assets/icons/weapons/123.png

# 2. データファイル更新
# curated-items.jsonにアイテム追加

# 3. 整合性確認
ls -la public/assets/icons/weapons/123.png
```

## 🔍 デバッグ・トラブルシューティング

### よくある問題と解決方法

1. **アイコンが表示されない**
   ```bash
   # ファイル存在確認
   ls -la public/assets/icons/[category]/[id].[ext]
   
   # データパス確認
   grep "iconPath" src/data/real-data/curated-items.json
   ```

2. **TypeScript型エラー**
   ```typescript
   // 悪い例
   const items = data; // 型不明
   
   // 良い例
   const items = data as Item[]; // 明示的型キャスト
   ```

3. **ビルドエラー**
   ```bash
   # 型チェック実行
   npm run type-check
   
   # 詳細エラー確認
   npx tsc --noEmit
   ```

## 📋 定期メンテナンス

### 月次チェック項目
- [ ] 孤立したアイコンファイルの確認
- [ ] 使用されていないデータファイルの削除
- [ ] TypeScript型定義の更新確認

### アイコンクリーンアップスクリプト（参考）
```bash
# 使用されていないアイコンファイル検出
find public/assets/icons/ -name "*.png" -o -name "*.svg" | while read file; do
  basename=$(basename "$file" | cut -d. -f1)
  if ! grep -q "\"$basename\"" src/data/real-data/curated-items.json; then
    echo "Unused icon: $file"
  fi
done
```

## 🎯 今後の改善提案

1. **自動整合性チェック**
   - データとアイコンの整合性を検証するテストスクリプト
   - CI/CDパイプラインでの自動チェック

2. **型安全性の向上**
   - JSON SchemaまたはZodを使用したランタイム型検証
   - 厳密なTypeScript設定

3. **アイコン管理の自動化**
   - アイコンダウンロードスクリプトの改良
   - ファイル存在確認の自動化

---

**最終更新:** 2025-07-12  
**作成者:** Claude Code  
**バージョン:** 1.0