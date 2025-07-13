/**
 * アイテム分類の自動検証システム
 * 分類間違いを検出し、データ品質を保証する
 */

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  itemId: string;
  itemName: string;
  type: 'classification' | 'data' | 'consistency';
  message: string;
  severity: 'critical' | 'high' | 'medium';
}

export interface ValidationWarning {
  itemId: string;
  itemName: string;
  message: string;
}

// 分類検証ルール
export const CLASSIFICATION_RULES = {
  // 必須Consumablesアイテム（永続効果ブースター）
  MUST_BE_CONSUMABLES: [
    "Life Crystal",
    "Mana Crystal", 
    "Life Fruit",
    "Lesser Healing Potion",
    "Lesser Mana Potion",
    "Healing Potion",
    "Mana Potion",
    "Greater Healing Potion",
    "Greater Mana Potion",
    "Super Healing Potion",
    "Super Mana Potion"
  ],
  
  // 必須Accessoriesアイテム（装身具）
  MUST_BE_ACCESSORIES: [
    "Hermes Boots",
    "Terraspark Boots",
    "Cloud in a Bottle",
    "Band of Regeneration",
    "Magic Mirror",
    "Angel Wings",
    "Demon Wings"
  ],

  // ボスカテゴリから除外すべきパターン
  BOSS_EXCLUSION_PATTERNS: [
    /Trophy$/i,           // トロフィー
    /Banner$/i,           // バナー
    /Hand$/i,            // 部位
    /Fist$/i,            // 部位
    /Eye of the/i,       // 部位
    /Have Awoken/i,      // メッセージ
    /Emblem$/i,          // エンブレム
    /Mask$/i,            // マスク
    /\s+Dye$/i          // 染料
  ],
  
  // 武器カテゴリから除外すべきアイテム
  WEAPON_EXCLUSIONS: [
    "Life Crystal",
    "Mana Crystal", 
    "Life Fruit",
    "Pickaxe",
    "Hammer",
    "Axe"
  ],

  // 公式ボス一覧（18個）
  OFFICIAL_BOSSES: [
    "King Slime",
    "Eye of Cthulhu", 
    "Eater of Worlds",
    "Brain of Cthulhu",
    "Queen Bee",
    "Deerclops", 
    "Skeletron",
    "Wall of Flesh",
    "Queen Slime",
    "The Twins",
    "The Destroyer", 
    "Skeletron Prime",
    "Plantera",
    "Golem",
    "Duke Fishron",
    "Empress of Light",
    "Lunatic Cultist",
    "Moon Lord"
  ]
};

/**
 * 単一アイテムの分類を検証
 */
export function validateItemClassification(item: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Life Crystal等の重要アイテムの分類チェック
  if (CLASSIFICATION_RULES.MUST_BE_CONSUMABLES.includes(item.name)) {
    if (item.type !== 'consumable') {
      errors.push({
        itemId: item.id,
        itemName: item.name,
        type: 'classification',
        message: `${item.name}はconsumableタイプである必要があります（現在: ${item.type}）`,
        severity: 'critical'
      });
    }
  }

  // アクセサリー必須アイテムのチェック
  if (CLASSIFICATION_RULES.MUST_BE_ACCESSORIES.includes(item.name)) {
    if (item.type !== 'accessory') {
      errors.push({
        itemId: item.id,
        itemName: item.name,
        type: 'classification', 
        message: `${item.name}はaccessoryタイプである必要があります（現在: ${item.type}）`,
        severity: 'high'
      });
    }
  }

  // ボスカテゴリの不正アイテムチェック
  if (item.category === 'Bosses') {
    // 公式ボス以外のチェック
    if (!CLASSIFICATION_RULES.OFFICIAL_BOSSES.includes(item.name)) {
      errors.push({
        itemId: item.id,
        itemName: item.name,
        type: 'classification',
        message: `${item.name}は公式ボスではありません`,
        severity: 'high'
      });
    }

    // 除外パターンのチェック
    for (const pattern of CLASSIFICATION_RULES.BOSS_EXCLUSION_PATTERNS) {
      if (pattern.test(item.name)) {
        errors.push({
          itemId: item.id,
          itemName: item.name,
          type: 'classification',
          message: `${item.name}はボスカテゴリに含まれるべきではありません（${pattern}にマッチ）`,
          severity: 'high'
        });
        break;
      }
    }
  }

  // 武器カテゴリの不正アイテムチェック
  if (item.category === 'Weapons') {
    if (CLASSIFICATION_RULES.WEAPON_EXCLUSIONS.some(excluded => item.name.includes(excluded))) {
      errors.push({
        itemId: item.id,
        itemName: item.name,
        type: 'classification',
        message: `${item.name}は武器カテゴリに含まれるべきではありません`,
        severity: 'high'
      });
    }
  }

  // アイコンパスと分類の一致チェック
  if (item.iconPath && item.category) {
    const expectedPath = item.category.toLowerCase();
    if (!item.iconPath.includes(expectedPath)) {
      warnings.push({
        itemId: item.id,
        itemName: item.name,
        message: `アイコンパス(${item.iconPath})がカテゴリ(${item.category})と一致していません`
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * 全アイテムデータの検証
 */
export function validateAllItems(items: any[]): ValidationResult {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];

  for (const item of items) {
    const result = validateItemClassification(item);
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
  }

  // 統計情報の追加
  const categoryStats = items.reduce((stats, item) => {
    stats[item.category] = (stats[item.category] || 0) + 1;
    return stats;
  }, {} as Record<string, number>);

  console.log('カテゴリ別アイテム数:', categoryStats);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
}

/**
 * 検証結果のレポート生成
 */
export function generateValidationReport(result: ValidationResult): string {
  let report = '=== アイテム分類検証レポート ===\n\n';
  
  if (result.isValid) {
    report += '✅ 全アイテムの分類が正常です\n';
  } else {
    report += `❌ ${result.errors.length}個の分類エラーが検出されました\n\n`;
    
    // エラーを重要度別にグループ化
    const errorsBySeverity = result.errors.reduce((groups, error) => {
      if (!groups[error.severity]) groups[error.severity] = [];
      groups[error.severity].push(error);
      return groups;
    }, {} as Record<string, ValidationError[]>);

    for (const [severity, errors] of Object.entries(errorsBySeverity)) {
      report += `\n🔴 ${severity.toUpperCase()} (${errors.length}件):\n`;
      for (const error of errors) {
        report += `  - ${error.itemName} (ID: ${error.itemId}): ${error.message}\n`;
      }
    }
  }

  if (result.warnings.length > 0) {
    report += `\n⚠️  ${result.warnings.length}個の警告があります:\n`;
    for (const warning of result.warnings) {
      report += `  - ${warning.itemName} (ID: ${warning.itemId}): ${warning.message}\n`;
    }
  }

  return report;
}