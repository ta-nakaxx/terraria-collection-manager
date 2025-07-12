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
    console.log(`✅ Icon loaded successfully for ${item.name}: ${currentSrc}`);
    setImageState('loaded');
  }, [item.name, currentSrc]);

  const handleImageError = useCallback(() => {
    console.log(`🔍 Icon error for ${item.name}:`, {
      originalPath: item.iconPath,
      currentSrc,
      imageState
    });
    
    // Try fallback strategy
    if (imageState === 'loading' && currentSrc === item.iconPath) {
      // First error: try SVG version if original was PNG
      if (item.iconPath.endsWith('.png')) {
        const svgPath = item.iconPath.replace('.png', '.svg');
        console.log(`🔄 Trying SVG version: ${svgPath}`);
        setCurrentSrc(svgPath);
        setImageState('loading');
      } else {
        // Not PNG, try placeholder
        console.log(`🔄 Trying placeholder for: ${item.name}`);
        setCurrentSrc('/placeholder.svg');
        setImageState('loading');
      }
    } else if (imageState === 'loading' && currentSrc !== '/placeholder.svg' && currentSrc !== item.iconPath) {
      // SVG failed, try placeholder
      console.log(`🔄 SVG failed, trying placeholder for: ${item.name}`);
      setCurrentSrc('/placeholder.svg');
      setImageState('loading');
    } else {
      // All attempts failed: use dynamic icon
      console.log(`❌ All failed, using dynamic icon for: ${item.name}`);
      setImageState('fallback');
    }
  }, [imageState, currentSrc, item.iconPath, item.name]);

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
      {/* eslint-disable-next-line @next/next/no-img-element */}
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