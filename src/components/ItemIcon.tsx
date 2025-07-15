"use client";

/**
 * アイテムアイコンコンポーネント
 * アイコンファイルが存在しない場合のフォールバック機能付き
 */

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { generateItemIcon, svgToDataUri } from '@/utils/iconGenerator';

interface ItemIconProps {
  item: {
    id: string;
    name: string;
    category: string;
    iconPath: string;
    rarity?: string;
  };
  size?: number;
  className?: string;
}

// カテゴリ別デフォルトアイコン
const CATEGORY_FALLBACKS = {
  'Weapons': '/assets/icons/default/weapon.svg',
  'Armor': '/assets/icons/default/armor.svg', 
  'Accessories': '/assets/icons/default/accessory.svg',
  'Consumables': '/assets/icons/default/consumable.svg',
  'Collectibles': '/assets/icons/default/collectible.svg',
  'NPCs': '/assets/icons/default/npc.svg',
  'Bosses': '/assets/icons/default/boss.svg'
};

// カテゴリ別絵文字フォールバック（SVG読み込み失敗時）
const EMOJI_FALLBACKS = {
  'Weapons': '⚔️',
  'Armor': '🛡️', 
  'Accessories': '💎',
  'Consumables': '🧪',
  'Collectibles': '🏆',
  'NPCs': '👤',
  'Bosses': '💀'
};

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
};

export default function ItemIcon({ item, size = 32, className = '' }: ItemIconProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  // アイコンパスを絶対パスに変換
  const iconPath = item.iconPath.startsWith('/') ? item.iconPath : `/${item.iconPath}`;
  
  // フォールバックアイコンとエモジ
  const fallbackIcon = CATEGORY_FALLBACKS[item.category as keyof typeof CATEGORY_FALLBACKS] || '/assets/icons/placeholder.svg';
  const fallbackEmoji = EMOJI_FALLBACKS[item.category as keyof typeof EMOJI_FALLBACKS] || '📦';
  
  // 動的生成されたアイコン（最終フォールバック）
  const generatedIcon = useMemo(() => {
    const svg = generateItemIcon(item);
    return svgToDataUri(svg);
  }, [item]);
  
  // レア度カラー
  const rarityColor = RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS] || '#FFFFFF';

  const handleImageError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`Icon load failed for ${item.name} (ID: ${item.id}): ${iconPath}`, error);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log(`Icon loaded successfully for ${item.name} (ID: ${item.id}): ${iconPath}`);
    setImageLoaded(true);
  };

  const handleFallbackError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`Fallback icon load failed for ${item.name} (ID: ${item.id}): ${fallbackIcon}`, error);
    setFallbackError(true);
  };

  // 両方の画像が読み込めない場合、動的生成されたアイコンを使用
  if (imageError && fallbackError) {
    return (
      <Image
        src={generatedIcon}
        alt={`Generated ${item.category} icon`}
        width={size}
        height={size}
        className={`rounded border-2 opacity-80 ${className}`}
        style={{ borderColor: rarityColor }}
        title={`${item.name} (ID: ${item.id}) - 動的生成アイコン`}
      />
    );
  }

  // メイン画像が読み込めない場合のフォールバック表示
  if (imageError && !fallbackError) {
    return (
      <Image
        src={fallbackIcon}
        alt={`${item.category} icon`}
        width={size}
        height={size}
        className={`rounded border-2 opacity-60 ${className}`}
        style={{ borderColor: rarityColor }}
        onError={handleFallbackError}
        title={`${item.name} (ID: ${item.id}) - デフォルトアイコン使用`}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* ローディング状態のフォールバック */}
      {!imageLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-800 border rounded animate-pulse"
          style={{ 
            width: size, 
            height: size,
            borderColor: rarityColor,
            borderWidth: '2px'
          }}
        >
          <span 
            style={{ fontSize: size * 0.6 }}
            className="opacity-60"
          >
            {fallbackEmoji}
          </span>
        </div>
      )}
      
      {/* 実際の画像 */}
      <Image
        src={iconPath}
        alt={item.name}
        width={size}
        height={size}
        className={`rounded border-2 transition-opacity duration-200 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ borderColor: rarityColor }}
        onError={handleImageError}
        onLoad={handleImageLoad}
        title={`${item.name} (ID: ${item.id})`}
      />
    </div>
  );
}