"use client";

import { useMemo } from 'react';
import { Item, ItemType } from '@/types';
import { calculateProgress, calculateProgressByType } from '@/utils/itemUtils';

interface ProgressOverviewProps {
  items: Item[];
}

interface CategoryProgress {
  name: string;
  current: number;
  total: number;
  type: ItemType;
}

export function ProgressOverview({ items }: ProgressOverviewProps) {
  // Calculate overall progress using utility function
  const overallProgress = useMemo(() => calculateProgress(items), [items]);
  
  // Calculate category progress using utility function
  const categoryProgress: CategoryProgress[] = useMemo(() => {
    const progressByType = calculateProgressByType(items);
    
    return [
      {
        name: "Weapons",
        type: "weapon",
        current: progressByType.weapon.owned,
        total: progressByType.weapon.total,
      },
      {
        name: "Armor",
        type: "armor",
        current: progressByType.armor.owned,
        total: progressByType.armor.total,
      },
      {
        name: "Accessories",
        type: "accessory",
        current: progressByType.accessory.owned,
        total: progressByType.accessory.total,
      },
      {
        name: "NPCs",
        type: "npc",
        current: progressByType.npc.owned,
        total: progressByType.npc.total,
      },
      {
        name: "Bosses",
        type: "boss",
        current: progressByType.boss.owned,
        total: progressByType.boss.total,
      },
    ];
  }, [items]);

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
            style={{ width: `${overallProgress.percentage}%` }}
          />
        </div>
        <div className="text-right mt-2">
          <span className="text-sm font-bold text-gray-800">
            {overallProgress.percentage}% ({overallProgress.owned}/{overallProgress.total})
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