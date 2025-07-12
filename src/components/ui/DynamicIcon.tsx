/**
 * 動的アイコン生成コンポーネント
 * カテゴリ別の色とシンボルを持つSVGアイコンを生成
 */

import React from 'react';
import { ItemType } from '@/types';
import { getCategoryColor } from '@/utils/iconFallback';

interface DynamicIconProps {
  type: ItemType;
  size?: number;
  className?: string;
}

/**
 * カテゴリ別のシンボル定義
 */
const getCategorySymbol = (type: ItemType): string => {
  const symbols: Record<ItemType, string> = {
    weapon: '⚔️',
    armor: '🛡️',
    accessory: '💍',
    vanity: '👕',
    tool: '🔨',
    material: '📦',
    consumable: '🧪',
    building: '🧱',
    furniture: '🪑',
    lighting: '💡',
    storage: '📦',
    ammunition: '🏹',
    mechanism: '⚙️',
    novelty: '🎭',
    key: '🗝️',
    npc: '👤',
    boss: '👹'
  };

  return symbols[type] || '❓';
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  type,
  size = 64,
  className = ''
}) => {
  const color = getCategoryColor(type);
  const symbol = getCategorySymbol(type);

  return (
    <div
      className={`flex items-center justify-center rounded-lg border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 ${className}`}
      style={{ 
        width: size, 
        height: size,
        borderColor: color + '40', // 25% opacity
        backgroundColor: color + '10' // 6% opacity
      }}
    >
      <span 
        style={{ 
          fontSize: size * 0.5,
          color: color,
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        {symbol}
      </span>
    </div>
  );
};

export default DynamicIcon;