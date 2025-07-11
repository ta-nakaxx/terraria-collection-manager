"use client";

import { useState } from 'react';
import { Item } from '@/types';
import { getRarityStyle } from '@/constants/rarityStyles';

interface ItemCardProps {
  item: Item;
  onToggleOwned: (itemId: string) => void;
  onItemClick: (item: Item) => void;
}

// Function to abbreviate subcategory text
const abbreviateSubcategory = (subcategory: string): string => {
  const abbreviations: { [key: string]: string } = {
    "Pre-Hardmode": "Pre-HM",
    Hardmode: "HM",
    Movement: "Move",
    Combat: "Combat",
    Utility: "Util",
    Merchants: "Merch",
    Craftsmen: "Craft",
    Melee: "Melee",
    Ranged: "Range",
    Magic: "Magic",
    Summoner: "Summon",
    Head: "Head",
    Chest: "Chest",
    Legs: "Legs",
    Event: "Event",
  };

  return abbreviations[subcategory] || subcategory;
};

export function ItemCard({ item, onToggleOwned, onItemClick }: ItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const rarityStyle = getRarityStyle(item.rarity);

  const handleImageError = () => {
    setImageError(true);
  };

  // コレクション対象アイテムは所有状況に応じて表示を変更
  // 参考アイテムは常にカラーで表示
  const isCollectible = item.collectionType === 'collectible';
  const shouldShowOwned = isCollectible ? item.owned : true;
  const opacityClass = shouldShowOwned ? "opacity-100" : "opacity-35 grayscale hover:opacity-70";

  return (
    <div
      className={`group relative ${rarityStyle.background} ${rarityStyle.border} border rounded-sm p-3 cursor-pointer transition-all duration-300 hover:shadow-xl ${rarityStyle.glow} hover:-translate-y-1 hover:scale-105 ${opacityClass} w-24 h-24`}
      onClick={() => onItemClick(item)}
    >
      {/* Ownership Status Indicator - Top Right (コレクション対象のみ表示) */}
      {isCollectible && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleOwned(item.id);
          }}
          className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-white/50 rounded-full z-20 bg-white/80 shadow-sm"
          title={item.owned ? "Mark as not owned" : "Mark as owned"}
        >
          <div
            className={`w-2.5 h-2.5 rounded-full border-2 transition-all duration-200 ${
              item.owned ? "bg-green-500 border-green-500 shadow-sm" : "border-gray-400 hover:border-gray-600"
            }`}
          />
        </button>
      )}

      {/* Icon with overlaid elements */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img
          src={imageError ? "/placeholder.svg" : item.iconPath || "/placeholder.svg"}
          alt={item.name}
          className="w-16 h-16 object-contain transition-all duration-300 group-hover:scale-110 drop-shadow-sm"
          onError={handleImageError}
        />

        {/* Subtle glow effect for higher rarities */}
        {(item.rarity === "purple" || item.rarity === "red" || item.rarity === "orange") && (
          <div
            className={`absolute inset-0 w-16 h-16 rounded-full blur-lg opacity-10 ${
              item.rarity === "purple" ? "bg-purple-400" : item.rarity === "red" ? "bg-red-400" : "bg-orange-400"
            }`}
          />
        )}

        {/* Category Badge - Top Left */}
        {item.category && (
          <div className="absolute top-0 left-0 z-10">
            <span className="inline-flex items-center px-1 py-0.5 rounded-sm text-[8px] font-medium bg-black/30 text-white backdrop-blur-sm shadow-sm">
              {abbreviateSubcategory(item.category)}
            </span>
          </div>
        )}

        {/* Item Name - Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="bg-gradient-to-t from-black/60 via-black/40 to-transparent backdrop-blur-sm rounded-b-sm px-1.5 py-1">
            <h3 className="text-[10px] font-semibold text-white leading-tight text-center truncate" title={item.name}>
              {item.name}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}