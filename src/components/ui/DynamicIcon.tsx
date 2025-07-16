/**
 * 動的アイコン生成コンポーネント
 * 軽量なカテゴリ別文字表示
 */

import React from 'react';
import { ItemType } from '@/types';

interface DynamicIconProps {
  type: ItemType;
  size?: number;
  className?: string;
}

/**
 * カテゴリ別のシンボル定義（軽量文字ベース）
 */
const getCategorySymbol = (type: ItemType): string => {
  const symbols: Record<ItemType, string> = {
    weapon: 'W',
    armor: 'A',
    accessory: 'C',
    vanity: 'V',
    tool: 'T',
    material: 'M',
    consumable: 'P',
    building: 'B',
    furniture: 'F',
    lighting: 'L',
    storage: 'S',
    ammunition: 'R',
    mechanism: 'G',
    novelty: 'N',
    key: 'K',
    npc: 'U',
    boss: 'X'
  };

  return symbols[type] || '?';
};

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  type,
  size = 64,
  className = ''
}) => {
  const symbol = getCategorySymbol(type);

  return (
    <div
      className={`flex items-center justify-center rounded bg-gray-100 border border-gray-300 ${className}`}
      style={{ 
        width: size, 
        height: size
      }}
    >
      <span 
        className="font-bold text-gray-700"
        style={{ 
          fontSize: size * 0.4
        }}
      >
        {symbol}
      </span>
    </div>
  );
};

export default DynamicIcon;