/**
 * データ検証システム
 */

import { Item, ItemType, Rarity, GameStage } from '@/types';

/**
 * 検証エラーの種類
 */
export type ValidationError = {
  id: string;
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  item?: Item;
};

/**
 * 検証結果
 */
export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  info: ValidationError[];
  summary: {
    totalItems: number;
    validItems: number;
    errorCount: number;
    warningCount: number;
    infoCount: number;
  };
};

/**
 * 必須フィールドの検証
 */
function validateRequiredFields(item: Item): ValidationError[] {
  const errors: ValidationError[] = [];
  
  if (!item.id || item.id.trim() === '') {
    errors.push({
      id: item.id || 'unknown',
      field: 'id',
      message: 'ID is required',
      severity: 'error',
      item
    });
  }
  
  if (!item.name || item.name.trim() === '') {
    errors.push({
      id: item.id,
      field: 'name',
      message: 'Name is required',
      severity: 'error',
      item
    });
  }
  
  if (!item.type) {
    errors.push({
      id: item.id,
      field: 'type',
      message: 'Type is required',
      severity: 'error',
      item
    });
  }
  
  if (!item.category || item.category.trim() === '') {
    errors.push({
      id: item.id,
      field: 'category',
      message: 'Category is required',
      severity: 'error',
      item
    });
  }
  
  if (!item.iconPath || item.iconPath.trim() === '') {
    errors.push({
      id: item.id,
      field: 'iconPath',
      message: 'Icon path is required',
      severity: 'warning',
      item
    });
  }
  
  return errors;
}

/**
 * タイプの検証
 */
function validateItemType(item: Item): ValidationError[] {
  const errors: ValidationError[] = [];
  const validTypes: ItemType[] = [
    'weapon', 'armor', 'accessory', 'vanity', 'tool', 'material', 
    'consumable', 'building', 'furniture', 'lighting', 'storage', 
    'ammunition', 'mechanism', 'novelty', 'key', 'npc', 'boss'
  ];
  
  if (!validTypes.includes(item.type)) {
    errors.push({
      id: item.id,
      field: 'type',
      message: `Invalid item type: ${item.type}. Valid types: ${validTypes.join(', ')}`,
      severity: 'error',
      item
    });
  }
  
  return errors;
}

/**
 * レアリティの検証
 */
function validateRarity(item: Item): ValidationError[] {
  const errors: ValidationError[] = [];
  const validRarities: Rarity[] = ['white', 'blue', 'green', 'orange', 'red', 'purple', 'rainbow'];
  
  if (!validRarities.includes(item.rarity)) {
    errors.push({
      id: item.id,
      field: 'rarity',
      message: `Invalid rarity: ${item.rarity}. Valid rarities: ${validRarities.join(', ')}`,
      severity: 'error',
      item
    });
  }
  
  return errors;
}

/**
 * ゲームステージの検証
 */
function validateGameStage(item: Item): ValidationError[] {
  const errors: ValidationError[] = [];
  const validStages: GameStage[] = ['pre-hardmode', 'hardmode', 'post-plantera', 'post-golem'];
  
  if (!validStages.includes(item.gameStage)) {
    errors.push({
      id: item.id,
      field: 'gameStage',
      message: `Invalid game stage: ${item.gameStage}. Valid stages: ${validStages.join(', ')}`,
      severity: 'error',
      item
    });
  }
  
  return errors;
}

/**
 * 取得方法の検証
 */
function validateAcquisition(item: Item): ValidationError[] {
  const errors: ValidationError[] = [];
  const validAcquisitions = ['craft', 'drop', 'buy', 'find'];
  
  if (!item.acquisition || !Array.isArray(item.acquisition) || item.acquisition.length === 0) {
    errors.push({
      id: item.id,
      field: 'acquisition',
      message: 'At least one acquisition method is required',
      severity: 'warning',
      item
    });
  } else {
    const invalidAcquisitions = item.acquisition.filter(acq => !validAcquisitions.includes(acq));
    if (invalidAcquisitions.length > 0) {
      errors.push({
        id: item.id,
        field: 'acquisition',
        message: `Invalid acquisition methods: ${invalidAcquisitions.join(', ')}. Valid methods: ${validAcquisitions.join(', ')}`,
        severity: 'warning',
        item
      });
    }
  }
  
  return errors;
}

/**
 * カテゴリとタイプの整合性検証
 */
function validateCategoryTypeConsistency(item: Item): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const categoryMapping: Record<ItemType, string[]> = {
    weapon: ['Weapons'],
    armor: ['Armor'],
    accessory: ['Accessories'],
    vanity: ['Vanity'],
    tool: ['Tools'],
    material: ['Materials'],
    consumable: ['Consumables'],
    building: ['Building'],
    furniture: ['Furniture'],
    lighting: ['Lighting'],
    storage: ['Storage'],
    ammunition: ['Ammunition'],
    mechanism: ['Mechanisms'],
    novelty: ['Novelty'],
    key: ['Keys'],
    npc: ['NPCs'],
    boss: ['Bosses']
  };
  
  const validCategories = categoryMapping[item.type];
  if (validCategories && !validCategories.includes(item.category)) {
    errors.push({
      id: item.id,
      field: 'category',
      message: `Category '${item.category}' is not valid for type '${item.type}'. Valid categories: ${validCategories.join(', ')}`,
      severity: 'warning',
      item
    });
  }
  
  return errors;
}

/**
 * 重複IDの検証
 */
function validateDuplicateIds(items: Item[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const idCounts = new Map<string, Item[]>();
  
  items.forEach(item => {
    if (!idCounts.has(item.id)) {
      idCounts.set(item.id, []);
    }
    idCounts.get(item.id)!.push(item);
  });
  
  idCounts.forEach((duplicates, id) => {
    if (duplicates.length > 1) {
      duplicates.forEach(item => {
        errors.push({
          id: item.id,
          field: 'id',
          message: `Duplicate ID found: ${id} (${duplicates.length} occurrences)`,
          severity: 'error',
          item
        });
      });
    }
  });
  
  return errors;
}

/**
 * 名前の重複検証
 */
function validateDuplicateNames(items: Item[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const nameCounts = new Map<string, Item[]>();
  
  items.forEach(item => {
    const normalizedName = item.name.toLowerCase().trim();
    if (!nameCounts.has(normalizedName)) {
      nameCounts.set(normalizedName, []);
    }
    nameCounts.get(normalizedName)!.push(item);
  });
  
  nameCounts.forEach((duplicates, name) => {
    if (duplicates.length > 1) {
      duplicates.forEach(item => {
        errors.push({
          id: item.id,
          field: 'name',
          message: `Duplicate name found: ${name} (${duplicates.length} occurrences)`,
          severity: 'warning',
          item
        });
      });
    }
  });
  
  return errors;
}

/**
 * 包括的なデータ検証
 */
export function validateItems(items: Item[]): ValidationResult {
  const allErrors: ValidationError[] = [];
  
  // 個別アイテムの検証
  items.forEach(item => {
    const itemErrors = [
      ...validateRequiredFields(item),
      ...validateItemType(item),
      ...validateRarity(item),
      ...validateGameStage(item),
      ...validateAcquisition(item),
      ...validateCategoryTypeConsistency(item)
    ];
    
    allErrors.push(...itemErrors);
  });
  
  // 全体的な検証
  const globalErrors = [
    ...validateDuplicateIds(items),
    ...validateDuplicateNames(items)
  ];
  
  allErrors.push(...globalErrors);
  
  // エラーレベル別に分類
  const errors = allErrors.filter(e => e.severity === 'error');
  const warnings = allErrors.filter(e => e.severity === 'warning');
  const info = allErrors.filter(e => e.severity === 'info');
  
  const validItems = items.filter(item => 
    !errors.some(error => error.item?.id === item.id)
  );
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    info,
    summary: {
      totalItems: items.length,
      validItems: validItems.length,
      errorCount: errors.length,
      warningCount: warnings.length,
      infoCount: info.length
    }
  };
}

/**
 * 検証結果の表示
 */
export function displayValidationResult(result: ValidationResult): void {
  console.log('\n=== Data Validation Result ===');
  console.log(`Total items: ${result.summary.totalItems}`);
  console.log(`Valid items: ${result.summary.validItems}`);
  console.log(`Errors: ${result.summary.errorCount}`);
  console.log(`Warnings: ${result.summary.warningCount}`);
  console.log(`Info: ${result.summary.infoCount}`);
  
  if (result.errors.length > 0) {
    console.log('\n🚨 ERRORS:');
    result.errors.forEach(error => {
      console.log(`  ${error.id}: ${error.field} - ${error.message}`);
    });
  }
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    result.warnings.forEach(warning => {
      console.log(`  ${warning.id}: ${warning.field} - ${warning.message}`);
    });
  }
  
  if (result.info.length > 0) {
    console.log('\n💡 INFO:');
    result.info.forEach(info => {
      console.log(`  ${info.id}: ${info.field} - ${info.message}`);
    });
  }
  
  console.log('\n=== Validation Complete ===');
}

/**
 * 検証をパスしたアイテムのみを返す
 */
export function getValidItems(items: Item[]): Item[] {
  const result = validateItems(items);
  
  const invalidIds = new Set(
    result.errors.map(error => error.item?.id).filter(Boolean)
  );
  
  return items.filter(item => !invalidIds.has(item.id));
}

/**
 * データ品質スコアの計算
 */
export function calculateDataQualityScore(result: ValidationResult): number {
  const { totalItems, validItems, errorCount, warningCount } = result.summary;
  
  if (totalItems === 0) return 0;
  
  // 基本スコア（有効アイテム率）
  const baseScore = (validItems / totalItems) * 100;
  
  // エラーによる減点
  const errorPenalty = Math.min(errorCount * 5, 50);
  
  // 警告による減点
  const warningPenalty = Math.min(warningCount * 2, 20);
  
  const finalScore = Math.max(0, baseScore - errorPenalty - warningPenalty);
  
  return Math.round(finalScore);
}