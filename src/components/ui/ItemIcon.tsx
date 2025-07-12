/**
 * 改良されたアイテムアイコンコンポーネント
 * 段階的フォールバック戦略とローディング状態を実装
 */

import React, { useState, useCallback } from 'react';
import { Item } from '@/types';
import DynamicIcon from './DynamicIcon';

interface ItemIconProps {
  item: Item;
  size?: number;
  className?: string;
  showHoverEffect?: boolean;
}

export const ItemIcon: React.FC<ItemIconProps> = ({
  item,
  size = 64,
  className = '',
  showHoverEffect = true
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error' | 'fallback'>('loading');
  const [currentSrc, setCurrentSrc] = useState(item.iconPath);

  const handleImageLoad = useCallback(() => {
    setImageState('loaded');
  }, []);

  const handleImageError = useCallback(() => {
    // Try fallback strategy
    if (imageState === 'loading' && currentSrc === item.iconPath) {
      // First error: try placeholder
      setCurrentSrc('/placeholder.svg');
      setImageState('loading');
    } else {
      // Second error or placeholder failed: use dynamic icon
      setImageState('fallback');
    }
  }, [imageState, currentSrc, item.iconPath]);

  const baseClasses = `object-contain transition-all duration-300 ${
    showHoverEffect ? 'group-hover:scale-110' : ''
  } drop-shadow-sm`;

  // If we need to use fallback, render dynamic icon
  if (imageState === 'fallback') {
    return (
      <DynamicIcon
        type={item.type}
        size={size}
        className={`${className} ${showHoverEffect ? 'group-hover:scale-110 transition-transform duration-300' : ''}`}
      />
    );
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Loading indicator */}
      {imageState === 'loading' && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded animate-pulse"
          style={{ width: size, height: size }}
        >
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={currentSrc}
        alt={item.name}
        className={`${baseClasses} ${className} ${imageState === 'loading' ? 'opacity-0' : 'opacity-100'}`}
        style={{ width: size, height: size }}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

export default ItemIcon;