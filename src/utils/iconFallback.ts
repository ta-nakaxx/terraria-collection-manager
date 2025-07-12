/**
 * アイコンフォールバックシステム
 * カテゴリ別のフォールバック画像を提供
 */

import { ItemType } from '@/types';

/**
 * アイテムタイプに基づいてフォールバックアイコンを取得
 */
export function getCategoryFallbackIcon(type: ItemType): string {
  const fallbackIcons: Record<ItemType, string> = {
    weapon: '/assets/fallback/weapon.svg',
    armor: '/assets/fallback/armor.svg',
    accessory: '/assets/fallback/accessory.svg',
    vanity: '/assets/fallback/vanity.svg',
    tool: '/assets/fallback/tool.svg',
    material: '/assets/fallback/material.svg',
    consumable: '/assets/fallback/consumable.svg',
    building: '/assets/fallback/building.svg',
    furniture: '/assets/fallback/furniture.svg',
    lighting: '/assets/fallback/lighting.svg',
    storage: '/assets/fallback/storage.svg',
    ammunition: '/assets/fallback/ammunition.svg',
    mechanism: '/assets/fallback/mechanism.svg',
    novelty: '/assets/fallback/novelty.svg',
    key: '/assets/fallback/key.svg',
    npc: '/assets/fallback/npc.svg',
    boss: '/assets/fallback/boss.svg'
  };

  return fallbackIcons[type] || '/placeholder.svg';
}

/**
 * 段階的フォールバック戦略
 * 1. オリジナルアイコン
 * 2. カテゴリ別フォールバック
 * 3. 汎用プレースホルダー
 */
export function getIconWithFallback(iconPath: string, type: ItemType): {
  primary: string;
  fallback: string;
  ultimate: string;
} {
  return {
    primary: iconPath,
    fallback: getCategoryFallbackIcon(type),
    ultimate: '/placeholder.svg'
  };
}

/**
 * カテゴリ色の取得（将来のアイコン生成用）
 */
export function getCategoryColor(type: ItemType): string {
  const colors: Record<ItemType, string> = {
    weapon: '#ef4444', // red-500
    armor: '#3b82f6', // blue-500
    accessory: '#8b5cf6', // violet-500
    vanity: '#ec4899', // pink-500
    tool: '#f59e0b', // amber-500
    material: '#10b981', // emerald-500
    consumable: '#06b6d4', // cyan-500
    building: '#6b7280', // gray-500
    furniture: '#d97706', // amber-600
    lighting: '#fbbf24', // amber-400
    storage: '#7c3aed', // violet-600
    ammunition: '#dc2626', // red-600
    mechanism: '#374151', // gray-700
    novelty: '#f472b6', // pink-400
    key: '#fde047', // yellow-300
    npc: '#22d3ee', // cyan-400
    boss: '#7c2d12'  // red-900
  };

  return colors[type] || '#6b7280';
}