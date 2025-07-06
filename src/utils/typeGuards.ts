import { Item, ItemType, Rarity } from '@/types';

/**
 * 型安全性を向上させるためのタイプガード関数集
 */

/**
 * 値が有効なItemTypeかどうかを判定
 */
export const isValidItemType = (type: string): type is ItemType => {
  return ['weapon', 'armor', 'accessory', 'npc', 'boss'].includes(type);
};

/**
 * 値が有効なRarityかどうかを判定
 */
export const isValidRarity = (rarity: string): rarity is Rarity => {
  return ['white', 'blue', 'green', 'orange', 'red', 'purple', 'rainbow'].includes(rarity);
};

/**
 * オブジェクトが有効なItemかどうかを判定
 */
export const isValidItem = (obj: unknown): obj is Item => {
  if (!obj || typeof obj !== 'object' || obj === null) {
    return false;
  }

  const record = obj as Record<string, unknown>;

  // 必須プロパティの存在確認
  if (!('id' in record) || !('name' in record) || !('type' in record) || 
      !('category' in record) || !('iconPath' in record) || !('owned' in record)) {
    return false;
  }

  // 型チェック
  if (typeof record.id !== 'string' || 
      typeof record.name !== 'string' || 
      typeof record.category !== 'string' || 
      typeof record.iconPath !== 'string' || 
      typeof record.owned !== 'boolean') {
    return false;
  }

  // type の型チェック
  if (!isValidItemType(record.type as string)) {
    return false;
  }

  // rarity の型チェック（オプショナル）
  if ('rarity' in record && !isValidRarity(record.rarity as string)) {
    return false;
  }

  return true;
};

/**
 * 配列が有効なItem配列かどうかを判定
 */
export const isValidItemArray = (arr: unknown): arr is Item[] => {
  return Array.isArray(arr) && arr.every(isValidItem);
};

/**
 * 文字列が空でないかどうかを判定
 */
export const isNonEmptyString = (str: unknown): str is string => {
  return typeof str === 'string' && str.trim().length > 0;
};