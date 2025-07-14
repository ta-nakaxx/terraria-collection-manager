"use client";

/**
 * シンプルアイテムアイコンコンポーネント
 * パフォーマンス重視、チェックマーク方式
 */

import React from 'react';

interface SimpleItemIconProps {
  item: {
    id: string;
    name: string;
    category: string;
    rarity?: string;
    owned?: boolean;
  };
  size?: number;
  className?: string;
  showIcon?: boolean;
}

// カテゴリ別エモジ（軽量フォールバック）
const CATEGORY_EMOJI = {
  'Weapons': '⚔️',
  'Armor': '🛡️', 
  'Accessories': '💎',
  'Consumables': '🧪',
  'Collectibles': '🏆',
  'NPCs': '👤',
  'Bosses': '💀'
} as const;

// レア度別カラー
const RARITY_COLORS = {
  'white': '#FFFFFF',
  'blue': '#9696FF',
  'green': '#96FF96', 
  'orange': '#FFAF50',
  'red': '#FF5050',
  'pink': '#FF69B4',
  'yellow': '#FFFF96',
  'cyan': '#5CD5FF',
  'purple': '#D896FF'
} as const;

export default function SimpleItemIcon({ 
  item, 
  size = 32, 
  className = '',
  showIcon = true 
}: SimpleItemIconProps) {
  const rarityColor = RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS] || '#FFFFFF';
  const categoryEmoji = CATEGORY_EMOJI[item.category as keyof typeof CATEGORY_EMOJI] || '📦';

  // 所持状態に応じたスタイル
  const isOwned = item.owned;
  const borderStyle = isOwned ? 'border-green-400' : 'border-gray-600';
  const bgStyle = isOwned ? 'bg-green-50' : 'bg-gray-800';
  const opacityStyle = isOwned ? 'opacity-100' : 'opacity-60';

  return (
    <div 
      className={`
        relative flex items-center justify-center 
        border-2 rounded-md transition-all duration-200
        ${borderStyle} ${bgStyle} ${opacityStyle} ${className}
      `}
      style={{ 
        width: size, 
        height: size,
        borderColor: isOwned ? '#10B981' : rarityColor,
      }}
      title={`${item.name} (ID: ${item.id})`}
    >
      {/* カテゴリエモジ表示 */}
      {showIcon && (
        <span 
          style={{ fontSize: size * 0.5 }}
          className="select-none"
        >
          {categoryEmoji}
        </span>
      )}
      
      {/* 所持状態チェックマーク */}
      {isOwned && (
        <div 
          className="absolute -top-1 -right-1 bg-green-500 rounded-full flex items-center justify-center"
          style={{ width: size * 0.4, height: size * 0.4 }}
        >
          <svg 
            className="text-white" 
            style={{ width: size * 0.25, height: size * 0.25 }}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      )}
    </div>
  );
}