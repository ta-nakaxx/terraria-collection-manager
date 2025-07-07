// Data export utilities

import sampleItemsData from './sample-items.json';
import categoriesData from './categories.json';
import { AnyItem, AllCategories } from '@/types';

// Type-safe data exports
export const sampleItems = sampleItemsData as {
  weapons: AnyItem[];
  armor: AnyItem[];
  accessories: AnyItem[];
  npcs: AnyItem[];
  bosses: AnyItem[];
};

export const categories = categoriesData as AllCategories;

// Utility functions for data access
export const getAllItems = (): AnyItem[] => {
  return [
    ...sampleItems.weapons,
    ...sampleItems.armor,
    ...sampleItems.accessories,
    ...sampleItems.npcs,
    ...sampleItems.bosses
  ];
};

export const getItemsDataByType = (type: string): AnyItem[] => {
  switch (type) {
    case 'weapons':
      return sampleItems.weapons;
    case 'armor':
      return sampleItems.armor;
    case 'accessories':
      return sampleItems.accessories;
    case 'npcs':
      return sampleItems.npcs;
    case 'bosses':
      return sampleItems.bosses;
    default:
      return [];
  }
};

export const getItemById = (id: string): AnyItem | undefined => {
  return getAllItems().find(item => item.id === id);
};

export const getItemsByCategory = (category: string): AnyItem[] => {
  return getAllItems().filter(item => item.category === category);
};

export const getItemsByRarity = (rarity: string): AnyItem[] => {
  return getAllItems().filter(item => item.rarity === rarity);
};

export const getItemsByGameStage = (gameStage: string): AnyItem[] => {
  return getAllItems().filter(item => item.gameStage === gameStage);
};

// Constants for UI
export const ITEM_TYPES = ['weapons', 'armor', 'accessories', 'npcs', 'bosses'] as const;
export const RARITIES = ['white', 'blue', 'green', 'orange', 'red', 'purple', 'rainbow'] as const;
export const GAME_STAGES = ['pre-hardmode', 'hardmode', 'post-plantera', 'post-golem'] as const;

// Default collection settings
export const DEFAULT_SETTINGS = {
  showCompletedItems: true,
  defaultCategory: 'weapons',
  sortOrder: 'name' as const,
  filterByGameStage: 'all' as const,
  showOnlyObtainable: false,
};

// Local storage key
export const STORAGE_KEY = 'terraria-collection-status';
export const STORAGE_VERSION = '1.0.0';