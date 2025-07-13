# Terraria コレクション管理 - アイテム分類ルール

## 概要
このドキュメントは、Terrariaアイテムの正確な分類を確保するための明確なルールとガイドラインを定義します。

## 5つの主要カテゴリ

### 1. Weapons（武器）
**定義**: 敵にダメージを与えるために使用される装備アイテム

**含まれるアイテム**:
- 近接武器: 剣、槍、ヨーヨー、ブーメラン等
- 遠距離武器: 弓、銃、投げ武器等
- 魔法武器: 魔法杖、魔導書、呪文等
- 召喚武器: サモンスタッフ、ムチ等

**除外されるアイテム**:
- ツール（ピッケル、斧、ハンマー）
- 永続効果アイテム（Life Crystal、Mana Crystal）
- 消耗品（ポーション、食べ物）

### 2. Armor（防具）
**定義**: プレイヤーの防御力を向上させる装備アイテム

**含まれるアイテム**:
- ヘルメット（Head slot装備）
- チェストプレート（Chest slot装備）  
- レギンス（Legs slot装備）

**除外されるアイテム**:
- アクセサリー（防御ボーナスがあっても）
- バニティアイテム（見た目のみの防具）

### 3. Accessories（アクセサリー）
**定義**: 特殊効果やステータス向上を提供する装備アイテム

**含まれるアイテム**:
- 移動系: Hermes Boots、Cloud in a Bottle等
- 戦闘系: Band of Regeneration、エンブレム等
- 永続効果: **Life Crystal、Mana Crystal**
- 情報系: 各種メーター、コンパス等
- ユーティリティ: Magic Mirror、翼等

**重要な注意事項**:
- **Life CrystalとMana Crystalは必ずAccessoriesカテゴリ**
- 使用して永続効果を得るアイテムはアクセサリー扱い

### 4. NPCs（NPC）
**定義**: プレイヤーと相互作用できる非プレイヤーキャラクター

**含まれるアイテム**:
- 町の住人NPC（Guide、Merchant等）
- サービス提供NPC（Goblin Tinkerer、Witch Doctor等）
- 特殊NPC（Traveling Merchant、Old Man等）

**除外されるアイテム**:
- 敵キャラクター
- NPCが販売するアイテム
- NPCが落とすアイテム

### 5. Bosses（ボス）
**定義**: 特別な戦闘エンカウンターとなる強力な敵

**含まれるアイテム**:
- 公式ボスエンティティのみ（18個）
- Pre-Hardmode: King Slime, Eye of Cthulhu, Eater of Worlds, Brain of Cthulhu, Queen Bee, Deerclops, Skeletron, Wall of Flesh
- Hardmode: Queen Slime, The Twins, The Destroyer, Skeletron Prime, Plantera, Golem, Duke Fishron, Empress of Light, Lunatic Cultist, Moon Lord

**除外されるアイテム**:
- **ボストロフィー**（装飾アイテム）
- **ボスバナー**（装飾アイテム）
- **ボス部位**（Skeletron Hand、Golem Fist等）
- **メッセージテキスト**（"The Twins Have Awoken"等）
- **ボスドロップアイテム**（武器、防具、アクセサリー）

## 問題のあるアイテム - ブラックリスト

### 絶対に間違った分類をしてはいけないアイテム

| アイテム名 | 正しい分類 | よくある間違い | 理由 |
|------------|------------|----------------|------|
| Life Crystal | Accessories | Weapons, Consumables | 永続的なHealth増加効果 |
| Mana Crystal | Accessories | Weapons, Consumables | 永続的なMana増加効果 |
| Eye of Cthulhu Trophy | Collectibles | Bosses | 装飾アイテム、ボスエンティティではない |
| Skeletron Hand | ❌削除対象 | Bosses | ボス部位、統合されるべき |
| The Twins Have Awoken | ❌削除対象 | Bosses | メッセージテキスト、ボス名は"The Twins" |
| Destroyer Emblem | Accessories | Bosses | プレイヤー装備アイテム |

## 検証チェックリスト

### 新しいアイテムを追加する際の確認事項

1. **Life Crystal/Mana Crystalの確認**
   - [ ] Life CrystalがAccessoriesカテゴリにある
   - [ ] 武器やConsumablesに分類されていない

2. **ボスカテゴリの確認**
   - [ ] トロフィー、バナー、置物が混入していない
   - [ ] ボス部位（手、目等）が単独で存在していない
   - [ ] メッセージテキストが含まれていない
   - [ ] 18個の公式ボスのみが含まれている

3. **武器カテゴリの確認**
   - [ ] ツール（ピッケル、斧等）が含まれていない
   - [ ] 永続効果アイテムが含まれていない
   - [ ] 実際に敵を攻撃するアイテムのみが含まれている

4. **一般的な確認**
   - [ ] 分類がゲーム内の実際の用途と一致している
   - [ ] 類似アイテムと一貫した分類になっている
   - [ ] アイコンパスが分類と一致している

## 自動検証ルール

### 実装すべき検証ロジック

```typescript
// 分類検証ルール
const CLASSIFICATION_RULES = {
  // 必須Accessoriesアイテム
  MUST_BE_ACCESSORIES: [
    "Life Crystal",
    "Mana Crystal",
    "Life Fruit"
  ],
  
  // ボスカテゴリから除外すべきパターン
  BOSS_EXCLUSION_PATTERNS: [
    /Trophy$/,      // トロフィー
    /Banner$/,      // バナー
    /Hand$/,        // 部位
    /Fist$/,        // 部位
    /Eye of the/,   // 部位
    /Have Awoken/   // メッセージ
  ],
  
  // 武器カテゴリから除外すべきアイテム
  WEAPON_EXCLUSIONS: [
    "Life Crystal",
    "Mana Crystal",
    "Life Fruit"
  ]
};
```

## データ統合時の注意事項

1. **優先順位**: 手動で修正されたデータ > 自動変換データ
2. **検証**: 統合後は必ず自動検証を実行
3. **レビュー**: 重要アイテム（Life Crystal等）は手動確認必須
4. **テスト**: 分類変更後はアプリの動作確認を実行

## 今後の管理方針

1. **変更時の検証**: すべてのデータ変更時に自動検証実行
2. **定期監査**: 月1回の全データ分類監査
3. **ドキュメント更新**: 新しい問題発見時のルール更新
4. **テスト強化**: 分類間違いを検出するテストケース追加

---

**最終更新**: 2025年7月13日
**バージョン**: 1.0