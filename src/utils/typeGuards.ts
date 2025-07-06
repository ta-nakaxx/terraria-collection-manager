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
  return (
    obj &&
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'type' in obj &&
    'category' in obj &&
    'iconPath' in obj &&
    'owned' in obj &&
    typeof (obj as Record<string, unknown>).id === 'string' &&
    typeof (obj as Record<string, unknown>).name === 'string' &&
    isValidItemType((obj as Record<string, unknown>).type as string) &&
    typeof (obj as Record<string, unknown>).category === 'string' &&
    typeof (obj as Record<string, unknown>).iconPath === 'string' &&
    typeof (obj as Record<string, unknown>).owned === 'boolean' &&
    (!('rarity' in obj) || isValidRarity((obj as Record<string, unknown>).rarity as string))
  );
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