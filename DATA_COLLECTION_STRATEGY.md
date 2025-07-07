# Terraria データ収集戦略

## 🎯 目的
Terrariaコレクション管理アプリに実際のゲームデータを統合し、サンプルデータから本格的なアプリケーションに移行する。

## 📊 データソース分析

### 1. 利用可能なデータソース

#### **A. Community Repository: cr0wst/terraria-info**
- **URL**: https://github.com/cr0wst/terraria-info
- **形式**: JSON/CSV
- **ライセンス**: CC BY-NC-SA 3.0
- **含有データ**: 約490アイテム
- **品質**: 基本的なアイテム情報とレシピ情報
- **長所**: 
  - 構造化されたJSONデータ
  - アクセス可能
  - 商用利用制限があるが個人プロジェクトには問題なし
- **短所**: 
  - 詳細な統計情報が不足
  - レアリティ、ゲームステージ情報が不完全
  - NPCとボス情報が限定的

#### **B. Official Terraria Wiki API**
- **URL**: https://terraria.wiki.gg/api.php
- **形式**: MediaWiki API (JSON)
- **ライセンス**: CC BY-NC-SA 3.0
- **含有データ**: 完全なアイテム、NPC、ボス情報
- **品質**: 高品質、最新情報
- **長所**: 
  - 最も正確で完全なデータ
  - 詳細な統計、レアリティ、取得方法情報
  - 公式ソース
- **短所**: 
  - API呼び出しが複雑
  - レート制限あり
  - データ抽出に追加処理が必要

#### **C. Terraria Fandom Wiki**
- **URL**: https://terraria.fandom.com/wiki/
- **形式**: MediaWiki API
- **品質**: 高品質だが公式wiki.ggが推奨

## 🎯 推奨データ収集戦略

### **段階的アプローチ**

#### **フェーズ1: 基本データの統合 (即座に実装可能)**
1. **cr0wst/terraria-info を基盤として使用**
   - 既存の490アイテムを基本データセットとして活用
   - 我々の型定義に合わせてデータ変換
   - 不足情報は手動で補完

#### **フェーズ2: 拡張データの統合 (中期目標)**
1. **公式Wiki APIから詳細情報を取得**
   - レアリティ情報
   - ゲームステージ分類
   - 詳細な統計情報
   - NPCとボス情報

#### **フェーズ3: 自動更新システム (長期目標)**
1. **データ更新の自動化**
   - 定期的なWiki API呼び出し
   - データ差分検出
   - 自動更新機能

## 🔧 技術実装計画

### **1. データ変換スクリプトの作成**

```typescript
// データ変換の基本構造
interface RawTerrariaItem {
  id: string;
  name: string;
  recipe1?: string;
  // ... cr0wst/terraria-info 形式
}

interface OurItem {
  id: string;
  name: string;
  type: ItemType;
  category: string;
  subcategory: string;
  iconPath: string;
  acquisition: string[];
  stats?: ItemStats;
  description?: string;
  rarity: Rarity;
  gameStage: GameStage;
  owned: boolean;
}
```

### **2. データ拡張戦略**

#### **アイテム分類ロジック**
```typescript
const classifyItem = (item: RawTerrariaItem): ItemType => {
  // 名前パターンマッチングによる分類
  if (item.name.includes('Sword') || item.name.includes('Spear')) return 'weapon';
  if (item.name.includes('Helmet') || item.name.includes('Breastplate')) return 'armor';
  // ... その他の分類ロジック
}
```

#### **レアリティマッピング**
```typescript
const rarityMapping: Record<string, Rarity> = {
  'white': 'white',
  'blue': 'blue',
  'green': 'green',
  'orange': 'orange',
  'red': 'red',
  'purple': 'purple',
  'rainbow': 'rainbow'
};
```

### **3. アイコン取得戦略**

#### **Option A: 公式リソース使用**
- Terraria公式アセットの利用（著作権考慮が必要）
- 低解像度での使用

#### **Option B: コミュニティアイコン使用**
- オープンソースのアイコンセット
- 統一されたスタイル

#### **Option C: プレースホルダーアイコン**
- アイテムタイプ別の汎用アイコン
- 段階的な本格アイコンへの移行

## 📋 実装優先順位

### **緊急度: 高**
1. cr0wst/terraria-info データの統合
2. 基本的なデータ変換スクリプト
3. 武器・防具・アクセサリーの分類

### **緊急度: 中**
1. NPC・ボスデータの追加
2. レアリティ情報の完全化
3. ゲームステージ分類

### **緊急度: 低**
1. 詳細統計情報
2. アイコンの高品質化
3. 自動更新システム

## ⚖️ 法的考慮事項

### **著作権とライセンス**
- **ゲームデータ**: 事実情報として利用可能
- **アイコン・画像**: Re-Logic社の著作物、フェアユース範囲での利用
- **Wiki情報**: CC BY-NC-SA 3.0 ライセンス遵守
- **商用利用**: 現在は非商用プロジェクトとして位置づけ

### **推奨アプローチ**
1. 文字情報の利用を優先
2. 公式アイコンは低解像度での利用
3. 著作権表示の明記
4. フェアユース範囲内での利用

## 🎯 次のアクション

1. **cr0wst/terraria-info からのデータ取得**
2. **データ変換スクリプトの実装**
3. **基本的な500+アイテムの統合**
4. **アプリケーションでのテスト**
5. **段階的な情報拡張**

---

*作成日: 2025-07-06*
*更新予定: データ統合進捗に応じて随時更新*