import { Rarity } from '@/types';

/**
 * Terrariaのレアリティに応じたスタイル定義
 */
export const RARITY_STYLES: Record<Rarity, {
  border: string;
  glow: string;
  text: string;
  background: string;
}> = {
  white: {
    border: 'border-gray-300/40',
    glow: 'hover:shadow-gray-200/30',
    text: 'text-gray-700',
    background: 'bg-gradient-to-br from-gray-50/60 to-white/90'
  },
  blue: {
    border: 'border-blue-300/40',
    glow: 'hover:shadow-blue-200/30',
    text: 'text-blue-700',
    background: 'bg-gradient-to-br from-blue-50/40 to-white/90'
  },
  green: {
    border: 'border-green-300/40',
    glow: 'hover:shadow-green-200/30',
    text: 'text-green-700',
    background: 'bg-gradient-to-br from-green-50/40 to-white/90'
  },
  orange: {
    border: 'border-orange-300/40',
    glow: 'hover:shadow-orange-200/30',
    text: 'text-orange-700',
    background: 'bg-gradient-to-br from-orange-50/40 to-white/90'
  },
  red: {
    border: 'border-red-300/40',
    glow: 'hover:shadow-red-200/30',
    text: 'text-red-700',
    background: 'bg-gradient-to-br from-red-50/40 to-white/90'
  },
  purple: {
    border: 'border-purple-300/40',
    glow: 'hover:shadow-purple-200/30',
    text: 'text-purple-700',
    background: 'bg-gradient-to-br from-purple-50/40 to-white/90'
  },
  rainbow: {
    border: 'border-purple-300/40',
    glow: 'hover:shadow-purple-200/30',
    text: 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
    background: 'bg-gradient-to-br from-purple-50/40 to-white/90'
  }
};

/**
 * デフォルトのレアリティスタイル
 */
export const DEFAULT_RARITY_STYLE = RARITY_STYLES.white;

/**
 * レアリティが有効かどうかを判定する型ガード
 */
export const isValidRarity = (rarity: string): rarity is Rarity => {
  return rarity in RARITY_STYLES;
};

/**
 * 安全にレアリティスタイルを取得する関数
 */
export const getRarityStyle = (rarity?: string) => {
  if (!rarity || !isValidRarity(rarity)) {
    return DEFAULT_RARITY_STYLE;
  }
  return RARITY_STYLES[rarity];
};