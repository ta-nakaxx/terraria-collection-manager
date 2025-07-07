# サンプルデータから実データへの移行計画

## 🎯 移行目標
現在のv0生成サンプルデータ（約20アイテム）から、実際のTerrariaゲームデータ（500+アイテム）への段階的移行を実現する。

## 📊 現状分析

### **現在のデータ構造**
```typescript
// src/data/v0-data.ts - 現在のサンプルデータ
export const v0Items: Item[] = [
  // 約20アイテムのサンプルデータ
];
```

### **目標データ構造**
```typescript
// src/data/terraria-items.json - 実際のTerrariaデータ
{
  "weapons": WeaponItem[],     // ~200アイテム
  "armor": ArmorItem[],        // ~150アイテム  
  "accessories": AccessoryItem[], // ~100アイテム
  "npcs": NPCItem[],          // ~30アイテム
  "bosses": BossItem[]        // ~20アイテム
}
```

## 🚀 段階的移行戦略

### **Phase 1: データ変換基盤の構築** (1-2日)

#### **1.1 データ変換スクリプトの作成**
```bash
# scripts/data-conversion/
├── fetch-terraria-data.ts      # 外部データ取得
├── convert-to-our-format.ts    # 形式変換
├── classify-items.ts           # アイテム分類
├── generate-icons.ts           # アイコン処理
└── validate-data.ts            # データ検証
```

#### **1.2 新しいデータファイル構造**
```bash
# src/data/
├── real-data/
│   ├── weapons.json
│   ├── armor.json  
│   ├── accessories.json
│   ├── npcs.json
│   └── bosses.json
├── v0-data.ts                  # 既存サンプル (保持)
└── index.ts                    # データエクスポート
```

### **Phase 2: 最小限の実データ統合** (1日)

#### **2.1 代表的なアイテムから開始**
- **武器**: 10種類（序盤〜終盤の代表例）
- **防具**: 5セット（15アイテム）
- **アクセサリー**: 10種類
- **NPC**: 5名
- **ボス**: 3体

#### **2.2 フォールバック機能の実装**
```typescript
// データが不足した場合のサンプルデータへの自動フォールバック
const getItemData = (): Item[] => {
  try {
    return loadRealData();
  } catch (error) {
    console.warn('Real data unavailable, using sample data');
    return v0Items;
  }
};
```

### **Phase 3: 完全データの統合** (2-3日)

#### **3.1 全カテゴリの完全実装**
- 500+ 全アイテムの統合
- 完全な分類システム
- レアリティ・ゲームステージ情報

#### **3.2 パフォーマンス最適化**
- 遅延読み込み
- 仮想化
- インデックス作成

### **Phase 4: 品質向上とテスト** (1-2日)

#### **4.1 データ品質の保証**
- データバリデーション
- 重複除去
- 不整合データの修正

#### **4.2 テストの追加**
- 実データを使用したテスト
- パフォーマンステスト
- UI/UXテスト

## 🔧 技術実装詳細

### **データ変換スクリプト例**

```typescript
// scripts/data-conversion/convert-to-our-format.ts
interface RawTerrariaItem {
  id: string;
  name: string;
  recipe1?: string;
}

interface OurItem extends Item {
  // 我々の型定義
}

export const convertRawData = (rawData: RawTerrariaItem[]): OurItem[] => {
  return rawData.map(item => ({
    id: item.id,
    name: item.name,
    type: classifyItemType(item.name),
    category: deriveCategory(item.name),
    subcategory: deriveSubcategory(item.name),
    iconPath: generateIconPath(item.id),
    acquisition: deriveAcquisition(item),
    rarity: deriveRarity(item.name),
    gameStage: deriveGameStage(item.name),
    owned: false
  }));
};

const classifyItemType = (name: string): ItemType => {
  const weaponKeywords = ['sword', 'bow', 'staff', 'gun', 'spear'];
  const armorKeywords = ['helmet', 'breastplate', 'greaves', 'hat'];
  
  if (weaponKeywords.some(keyword => 
    name.toLowerCase().includes(keyword))) return 'weapon';
  if (armorKeywords.some(keyword => 
    name.toLowerCase().includes(keyword))) return 'armor';
  
  return 'accessory'; // デフォルト
};
```

### **段階的データ読み込み**

```typescript
// src/data/index.ts
export const getAllItems = async (): Promise<Item[]> => {
  const phase = getCurrentPhase();
  
  switch (phase) {
    case 'sample':
      return v0Items;
    case 'minimal':
      return await loadMinimalRealData();
    case 'complete':
      return await loadCompleteRealData();
    default:
      return v0Items;
  }
};

const getCurrentPhase = (): DataPhase => {
  // 環境変数または設定ファイルから判定
  return process.env.DATA_PHASE as DataPhase || 'sample';
};
```

## 📅 詳細スケジュール

### **Day 1: 基盤構築**
- [ ] データ変換スクリプト作成
- [ ] cr0wst/terraria-info データ取得
- [ ] 基本的な型変換ロジック実装

### **Day 2: 最小実装**
- [ ] 代表的な50アイテムの変換
- [ ] アプリでの動作確認
- [ ] フォールバック機能のテスト

### **Day 3-4: 完全実装**
- [ ] 500+ 全アイテムの変換
- [ ] NPCとボスデータの統合
- [ ] パフォーマンステスト

### **Day 5: 品質保証**
- [ ] データ品質チェック
- [ ] UIテスト
- [ ] デプロイ前の最終確認

## 🔄 段階的展開戦略

### **Feature Flag による制御**
```typescript
// src/config/features.ts
export const FEATURE_FLAGS = {
  USE_REAL_DATA: process.env.NODE_ENV === 'production',
  ENABLE_LAZY_LOADING: true,
  ENABLE_VIRTUAL_SCROLLING: false
};
```

### **A/Bテスト対応**
- サンプルデータ版と実データ版の比較
- パフォーマンス測定
- ユーザー体験の評価

## ⚠️ リスク管理

### **技術的リスク**
1. **データサイズ増大**: 20→500+アイテム
   - **対策**: 遅延読み込み、仮想化
2. **パフォーマンス低下**: 大量データの処理
   - **対策**: インデックス、キャッシュ
3. **データ品質問題**: 不正確な分類
   - **対策**: バリデーション、手動確認

### **法的リスク**
1. **著作権問題**: Terrariaアセット使用
   - **対策**: フェアユース範囲、著作権表示
2. **ライセンス遵守**: CC BY-NC-SA 3.0
   - **対策**: 適切な帰属表示

## 🎯 成功指標

### **技術指標**
- [ ] データ読み込み時間: < 2秒
- [ ] 検索レスポンス: < 500ms
- [ ] メモリ使用量: < 100MB

### **品質指標**
- [ ] データ正確性: > 95%
- [ ] アイテム分類精度: > 90%
- [ ] テストカバレッジ: > 80%

### **ユーザー体験指標**
- [ ] 初回読み込み時間の改善
- [ ] アイテム発見性の向上
- [ ] コレクション管理の効率化

---

*作成日: 2025-07-06*
*実装開始予定: 2025-07-06*