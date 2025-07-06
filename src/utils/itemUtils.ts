import { Item, ItemType } from '@/types';

/**
 * アイテム関連のユーティリティ関数
 */

/**
 * 指定したタイプのアイテムをフィルタリング
 */
export const getItemsByType = (items: Item[], type: ItemType): Item[] => {
  return items.filter(item => item.type === type);
};

/**
 * 指定したカテゴリのアイテムをフィルタリング
 */
export const getItemsByCategory = (items: Item[], category: string): Item[] => {
  return items.filter(item => item.category === category);
};

/**
 * 指定したサブカテゴリのアイテムをフィルタリング
 */
export const getItemsBySubcategory = (items: Item[], subcategory: string): Item[] => {
  return items.filter(item => item.subcategory === subcategory);
};

/**
 * 所持しているアイテムをフィルタリング
 */
export const getOwnedItems = (items: Item[]): Item[] => {
  return items.filter(item => item.owned);
};

/**
 * 所持していないアイテムをフィルタリング
 */
export const getUnownedItems = (items: Item[]): Item[] => {
  return items.filter(item => !item.owned);
};

/**
 * アイテムの進行状況を計算
 */
export const calculateProgress = (items: Item[]): {
  total: number;
  owned: number;
  percentage: number;
} => {
  const total = items.length;
  const owned = getOwnedItems(items).length;
  const percentage = total > 0 ? Math.round((owned / total) * 100) : 0;
  
  return { total, owned, percentage };
};

/**
 * タイプ別の進行状況を計算
 */
export const calculateProgressByType = (items: Item[]): Record<ItemType, {
  total: number;
  owned: number;
  percentage: number;
}> => {
  const types: ItemType[] = ['weapon', 'armor', 'accessory', 'npc', 'boss'];
  
  return types.reduce((acc, type) => {
    const typeItems = getItemsByType(items, type);
    acc[type] = calculateProgress(typeItems);
    return acc;
  }, {} as Record<ItemType, { total: number; owned: number; percentage: number }>);
};

/**
 * 検索クエリに基づいてアイテムをフィルタリング
 */
export const searchItems = (items: Item[], query: string): Item[] => {
  if (!query.trim()) {
    return items;
  }
  
  const lowerQuery = query.toLowerCase();
  return items.filter(item => 
    item.name.toLowerCase().includes(lowerQuery) ||
    item.category.toLowerCase().includes(lowerQuery) ||
    (item.subcategory && item.subcategory.toLowerCase().includes(lowerQuery))
  );
};

/**
 * 複数の条件でアイテムをフィルタリング
 */
export const filterItems = (
  items: Item[],
  filters: {
    type?: ItemType;
    category?: string;
    subcategory?: string;
    owned?: boolean;
    search?: string;
  }
): Item[] => {
  let filtered = items;

  if (filters.type) {
    filtered = getItemsByType(filtered, filters.type);
  }

  if (filters.category) {
    filtered = getItemsByCategory(filtered, filters.category);
  }

  if (filters.subcategory) {
    filtered = getItemsBySubcategory(filtered, filters.subcategory);
  }

  if (filters.owned !== undefined) {
    filtered = filters.owned ? getOwnedItems(filtered) : getUnownedItems(filtered);
  }

  if (filters.search) {
    filtered = searchItems(filtered, filters.search);
  }

  return filtered;
};

/**
 * アイテムをソート
 */
export const sortItems = (
  items: Item[],
  sortBy: 'name' | 'category' | 'owned' = 'name',
  order: 'asc' | 'desc' = 'asc'
): Item[] => {
  return [...items].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'owned':
        comparison = Number(b.owned) - Number(a.owned);
        break;
    }
    
    return order === 'asc' ? comparison : -comparison;
  });
};