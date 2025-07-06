"use client";

import { Item } from '@/types';

interface ProgressOverviewProps {
  items: Item[];
}

interface CategoryProgress {
  name: string;
  current: number;
  total: number;
  type: "weapon" | "armor" | "accessory" | "npc" | "boss";
}

export function ProgressOverview({ items }: ProgressOverviewProps) {
  // Calculate overall progress
  const totalItems = items.length;
  const ownedItems = items.filter((item) => item.owned).length;
  const overallPercentage = totalItems > 0 ? (ownedItems / totalItems) * 100 : 0;

  // Calculate category progress
  const categoryProgress: CategoryProgress[] = [
    {
      name: "Weapons",
      type: "weapon",
      current: items.filter((item) => item.type === "weapon" && item.owned).length,
      total: items.filter((item) => item.type === "weapon").length,
    },
    {
      name: "Armor",
      type: "armor",
      current: items.filter((item) => item.type === "armor" && item.owned).length,
      total: items.filter((item) => item.type === "armor").length,
    },
    {
      name: "Accessories",
      type: "accessory",
      current: items.filter((item) => item.type === "accessory" && item.owned).length,
      total: items.filter((item) => item.type === "accessory").length,
    },
    {
      name: "NPCs",
      type: "npc",
      current: items.filter((item) => item.type === "npc" && item.owned).length,
      total: items.filter((item) => item.type === "npc").length,
    },
    {
      name: "Bosses",
      type: "boss",
      current: items.filter((item) => item.type === "boss" && item.owned).length,
      total: items.filter((item) => item.type === "boss").length,
    },
  ];

  return (
    <div className="flex items-center space-x-8">
      {/* Overall Progress - Larger and distinct without background box */}
      <div className="min-w-[200px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-800 tracking-wide">Overall Progress</span>
        </div>
        <div className="w-full bg-gray-200/80 rounded-full h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-gray-700 to-gray-800 h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
        <div className="text-right mt-2">
          <span className="text-sm font-bold text-gray-800">
            {Math.round(overallPercentage)}% ({ownedItems}/{totalItems})
          </span>
        </div>
      </div>

      {/* Category Progress - Uniform layout */}
      <div className="flex items-center space-x-6">
        {categoryProgress.map((category) => {
          const percentage = category.total > 0 ? (category.current / category.total) * 100 : 0;
          return (
            <div key={category.type} className="min-w-[90px]">
              <div className="mb-1">
                <span className="text-xs font-medium text-gray-600">{category.name}</span>
              </div>
              <div className="w-full bg-gray-200/60 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-gray-500 to-gray-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-right mt-1">
                <span className="text-xs text-gray-500 font-medium">
                  {Math.round(percentage)}% ({category.current}/{category.total})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}