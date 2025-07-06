// Collection state and progress tracking types

export interface CollectionState {
  [itemId: string]: boolean; // true = owned, false = not owned
}

export interface CategoryProgress {
  total: number;
  owned: number;
  percentage: number;
}

export interface ProgressData {
  total: number;
  owned: number;
  percentage: number;
  byType: {
    weapons: CategoryProgress;
    armor: CategoryProgress;
    accessories: CategoryProgress;
    npcs: CategoryProgress;
    bosses: CategoryProgress;
  };
  byCategory: {
    [category: string]: CategoryProgress;
  };
}

export interface CollectionSettings {
  showCompletedItems: boolean;
  defaultCategory: string;
  sortOrder: 'name' | 'rarity' | 'category' | 'gameStage';
  filterByGameStage: 'all' | 'pre-hardmode' | 'hardmode';
  showOnlyObtainable: boolean;
}

export interface StorageData {
  version: string;
  lastUpdated: string;
  collection: CollectionState;
  settings: CollectionSettings;
}

export interface FilterOptions {
  type?: string;
  category?: string;
  rarity?: string;
  gameStage?: string;
  owned?: boolean;
  searchTerm?: string;
}

export interface SortOptions {
  field: 'name' | 'rarity' | 'category' | 'gameStage';
  direction: 'asc' | 'desc';
}