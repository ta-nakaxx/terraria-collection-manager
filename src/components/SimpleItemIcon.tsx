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
    iconPath: string;
    rarity?: string;
    owned?: boolean;
  };
  size?: number;
  className?: string;
  showIcon?: boolean;
}

// カテゴリ別シンプルテキスト（軽量フォールバック）
const CATEGORY_TEXT = {
  'Weapons': 'W',
  'Armor': 'A', 
  'Accessories': 'C',
  'Consumables': 'P',
  'Collectibles': 'T',
  'NPCs': 'N',
  'Bosses': 'B'
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
  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(true);
  const [currentIconPath, setCurrentIconPath] = React.useState<string>('');
  const [fallbackIndex, setFallbackIndex] = React.useState(0);
  
  const rarityColor = RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS] || '#FFFFFF';
  const categoryText = CATEGORY_TEXT[item.category as keyof typeof CATEGORY_TEXT] || '?';
  
  // アイコンパスの候補リスト（PNG優先）
  const getIconPathCandidates = React.useCallback(() => {
    const category = item.category.toLowerCase();
    const id = item.id;
    
    return [
      `/assets/icons/${category}/${id}.png`,  // 実際のゲーム画像（最優先）
      `/assets/icons/${category}/${id}.svg`,  // プレースホルダー
      item.iconPath.startsWith('/') ? item.iconPath : `/${item.iconPath}` // 元のパス
    ];
  }, [item.category, item.id, item.iconPath]);
  
  // アイコンパスの決定と初期化
  React.useEffect(() => {
    const candidates = getIconPathCandidates();
    setCurrentIconPath(candidates[0]);
    setFallbackIndex(0);
    setImageError(false);
    setImageLoading(true);
    
    console.log(`🔍 Trying icon for ${item.name} (ID: ${item.id}): ${candidates[0]}`);
  }, [getIconPathCandidates, item.name, item.id]);

  // 所持状態に応じたスタイル
  const isOwned = item.owned;
  const borderStyle = isOwned ? 'border-green-400' : 'border-gray-600';
  const bgStyle = isOwned ? 'bg-green-50' : 'bg-gray-800';
  const opacityStyle = isOwned ? 'opacity-100' : 'opacity-60';

  const handleImageLoad = () => {
    console.log(`✅ Icon loaded successfully: ${item.name} (ID: ${item.id}) - ${currentIconPath}`);
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`❌ Failed to load icon: ${currentIconPath} for ${item.name} (ID: ${item.id})`, e);
    
    const candidates = getIconPathCandidates();
    const nextIndex = fallbackIndex + 1;
    
    if (nextIndex < candidates.length) {
      // 次の候補を試す
      console.log(`🔄 Trying fallback ${nextIndex} for ${item.name} (ID: ${item.id}): ${candidates[nextIndex]}`);
      setCurrentIconPath(candidates[nextIndex]);
      setFallbackIndex(nextIndex);
      setImageError(false);
      setImageLoading(true);
    } else {
      // すべての候補を試し終わったので、エラー状態にする
      console.error(`💥 All icon candidates failed for ${item.name} (ID: ${item.id})`);
      setImageLoading(false);
      setImageError(true);
    }
  };

  // タイムアウトによるフォールバック（3秒後）
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (imageLoading) {
        console.warn(`⏰ Timeout loading icon: ${item.name} (ID: ${item.id}) - forcing fallback`);
        setImageLoading(false);
        setImageError(true);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [imageLoading, item.name, item.id]);

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
      {/* 実際のアイコン表示 */}
      {showIcon && !imageError && currentIconPath && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={currentIconPath}
          alt={item.name}
          className={`object-contain transition-opacity duration-200 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ width: size * 0.8, height: size * 0.8 }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="eager"
          decoding="sync"
        />
      )}
      
      {/* フォールバック: カテゴリテキスト表示 */}
      {showIcon && imageError && (
        <div 
          className="flex items-center justify-center bg-gray-600 text-white font-bold rounded"
          style={{ 
            width: size * 0.8, 
            height: size * 0.8,
            fontSize: size * 0.3
          }}
        >
          {categoryText}
        </div>
      )}
      
      {/* ローディング表示 */}
      {imageLoading && !imageError && (
        <div 
          className="animate-pulse bg-gray-300 rounded"
          style={{ width: size * 0.6, height: size * 0.6 }}
        />
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