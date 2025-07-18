# アイテム拡張計画 - Terraria Collection Manager

## 現在の状況
- **Weapons**: 51アイテム（十分な数）
- **Armor**: 3アイテム（大幅に不足）
- **Accessories**: 3アイテム（大幅に不足）  
- **NPCs**: 実装済み
- **Bosses**: 実装済み

## 段階的実装計画

### フェーズ1: 基本防具セットの追加
**目標**: 各ゲームステージの代表的な防具セットを追加

#### Pre-Hardmode防具 (12アイテム)
1. **Wood Armor** (3アイテム)
   - Wood Helmet (1101)
   - Wood Breastplate (1102)  
   - Wood Greaves (1103)

2. **Copper Armor** (3アイテム)
   - Copper Helmet (82)
   - Copper Chainmail (83)
   - Copper Greaves (84)

3. **Silver Armor** (3アイテム)
   - Silver Helmet (85)
   - Silver Chainmail (86)
   - Silver Greaves (87)

4. **Gold Armor** (3アイテム)
   - Gold Helmet (94)
   - Gold Chainmail (95)
   - Gold Greaves (96)

#### Hardmode防具 (12アイテム)
1. **Cobalt Armor** (3アイテム)
   - Cobalt Helmet (371)
   - Cobalt Breastplate (372)
   - Cobalt Leggings (373)

2. **Mythril Armor** (3アイテム)
   - Mythril Helmet (374)
   - Mythril Chainmail (375)
   - Mythril Greaves (376)

3. **Adamantite Armor** (3アイテム)
   - Adamantite Helmet (377)
   - Adamantite Breastplate (378)
   - Adamantite Leggings (379)

4. **Hallowed Armor** (3アイテム)
   - Hallowed Helmet (549)
   - Hallowed Plate Mail (550)
   - Hallowed Greaves (551)

### フェーズ2: 基本アクセサリーの追加
**目標**: 各カテゴリの重要なアクセサリーを追加

#### Movement系 (8アイテム)
- Cloud in a Bottle (159) ✓
- Hermes Boots (862) ✓
- Rocket Boots (405)
- Spectre Boots (406)
- Lightning Boots (898)
- Frostspark Boots (1862)
- Terraspark Boots (5000)
- Angel Wings (493)

#### Health系 (6アイテム)
- Band of Regeneration (156) ✓
- Panic Necklace (157)
- Band of Starpower (158)
- Life Crystal (29)
- Life Fruit (1291)
- Philosopher's Stone (414)

#### Combat系 (8アイテム)
- Obsidian Skin Potion (288)
- Ironskin Potion (292)
- Regeneration Potion (289)
- Swiftness Potion (290)
- Warrior Emblem (489)
- Ranger Emblem (490)
- Sorcerer Emblem (491)
- Summoner Emblem (1178)

### フェーズ3: 特殊・高級防具の追加
**目標**: ユニークな防具とエンドゲーム装備

#### 特殊防具 (9アイテム)
- Jungle Armor Set (3アイテム: 250, 251, 252)
- Molten Armor Set (3アイテム: 231, 232, 233)
- Turtle Armor Set (3アイテム: 1316, 1317, 1318)

#### エンドゲーム防具 (6アイテム)
- Beetle Armor Set (2アイテム: 2199, 2200, 2201)
- Solar Flare Armor Set (3アイテム: 2757, 2758, 2759)

### フェーズ4: 高級アクセサリーの追加
**目標**: クラフト系とエンドゲームアクセサリー

#### クラフト系アクセサリー (6アイテム)
- Obsidian Horseshoe (397)
- Lucky Horseshoe (396)
- Shiny Red Balloon (405)
- Bundle of Balloons (785)
- Cloud in a Balloon (783)
- Sandstorm in a Balloon (786)

## 実装優先順位

### 最優先 (フェーズ1)
1. Pre-Hardmode基本防具 (Wood, Copper, Silver, Gold)
2. Hardmode基本防具 (Cobalt, Mythril, Adamantite, Hallowed)

### 高優先 (フェーズ2)  
1. Movement系アクセサリー
2. Health系アクセサリー
3. Combat系アクセサリー

### 中優先 (フェーズ3-4)
1. 特殊防具セット
2. エンドゲーム装備
3. 高級アクセサリー

## 実装作業項目

### 各アイテム追加時の作業
1. **データ追加**: curated-items.json への追加
2. **アイコン取得**: Terraria Wiki からのダウンロード
3. **ファイル配置**: 適切なディレクトリへの配置
4. **テスト**: ローカルビルドとエラーチェック

### バッチ作業
- 同じ防具セットは一括で追加
- アイコンダウンロードはカテゴリごとに実行
- コミットは機能単位（防具セット、アクセサリーカテゴリなど）

## 成功指標
- **Armor**: 3 → 30+アイテム（10倍増）
- **Accessories**: 3 → 25+アイテム（8倍増）
- **品質**: エラーゼロ、アイコン表示100%
- **一貫性**: 統一されたデータ形式とプレースホルダー

---

この計画に従って段階的に実装し、各フェーズ完了後に品質確認を行います。