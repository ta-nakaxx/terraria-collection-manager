import {
  getItemsByType,
  getItemsByCategory,
  getOwnedItems,
  getUnownedItems,
  calculateProgress,
  calculateProgressByType,
  searchItems,
  filterItems,
  sortItems
} from '../itemUtils';
import { Item } from '@/types';

// Mock data for testing
const mockItems: Item[] = [
  {
    id: 'item1',
    name: 'Copper Sword',
    type: 'weapon',
    category: 'melee',
    subcategory: 'sword',
    iconPath: '/icons/copper-sword.png',
    acquisition: ['craft'],
    rarity: 'white',
    gameStage: 'pre-hardmode',
    owned: true
  },
  {
    id: 'item2',
    name: 'Iron Helmet',
    type: 'armor',
    category: 'head',
    subcategory: 'helmet',
    iconPath: '/icons/iron-helmet.png',
    acquisition: ['craft'],
    rarity: 'white',
    gameStage: 'pre-hardmode',
    owned: false
  },
  {
    id: 'item3',
    name: 'Hermes Boots',
    type: 'accessory',
    category: 'movement',
    subcategory: 'boots',
    iconPath: '/icons/hermes-boots.png',
    acquisition: ['drop'],
    rarity: 'green',
    gameStage: 'pre-hardmode',
    owned: true
  },
  {
    id: 'item4',
    name: 'Silver Bow',
    type: 'weapon',
    category: 'ranged',
    subcategory: 'bow',
    iconPath: '/icons/silver-bow.png',
    acquisition: ['craft'],
    rarity: 'white',
    gameStage: 'pre-hardmode',
    owned: false
  }
];

describe('itemUtils', () => {
  describe('getItemsByType', () => {
    it('should filter items by weapon type', () => {
      const weapons = getItemsByType(mockItems, 'weapon');
      expect(weapons).toHaveLength(2);
      expect(weapons.every(item => item.type === 'weapon')).toBe(true);
    });

    it('should filter items by armor type', () => {
      const armor = getItemsByType(mockItems, 'armor');
      expect(armor).toHaveLength(1);
      expect(armor[0].name).toBe('Iron Helmet');
    });

    it('should return empty array for non-existent type', () => {
      const bosses = getItemsByType(mockItems, 'boss');
      expect(bosses).toHaveLength(0);
    });
  });

  describe('getItemsByCategory', () => {
    it('should filter items by category', () => {
      const meleeItems = getItemsByCategory(mockItems, 'melee');
      expect(meleeItems).toHaveLength(1);
      expect(meleeItems[0].name).toBe('Copper Sword');
    });

    it('should return empty array for non-existent category', () => {
      const magicItems = getItemsByCategory(mockItems, 'magic');
      expect(magicItems).toHaveLength(0);
    });
  });

  describe('getOwnedItems', () => {
    it('should return only owned items', () => {
      const ownedItems = getOwnedItems(mockItems);
      expect(ownedItems).toHaveLength(2);
      expect(ownedItems.every(item => item.owned)).toBe(true);
    });
  });

  describe('getUnownedItems', () => {
    it('should return only unowned items', () => {
      const unownedItems = getUnownedItems(mockItems);
      expect(unownedItems).toHaveLength(2);
      expect(unownedItems.every(item => !item.owned)).toBe(true);
    });
  });

  describe('calculateProgress', () => {
    it('should calculate correct progress', () => {
      const progress = calculateProgress(mockItems);
      expect(progress.total).toBe(4);
      expect(progress.owned).toBe(2);
      expect(progress.percentage).toBe(50);
    });

    it('should handle empty array', () => {
      const progress = calculateProgress([]);
      expect(progress.total).toBe(0);
      expect(progress.owned).toBe(0);
      expect(progress.percentage).toBe(0);
    });
  });

  describe('calculateProgressByType', () => {
    it('should calculate progress for each type', () => {
      const progressByType = calculateProgressByType(mockItems);
      
      expect(progressByType.weapon.total).toBe(2);
      expect(progressByType.weapon.owned).toBe(1);
      expect(progressByType.weapon.percentage).toBe(50);
      
      expect(progressByType.armor.total).toBe(1);
      expect(progressByType.armor.owned).toBe(0);
      expect(progressByType.armor.percentage).toBe(0);
      
      expect(progressByType.accessory.total).toBe(1);
      expect(progressByType.accessory.owned).toBe(1);
      expect(progressByType.accessory.percentage).toBe(100);
    });
  });

  describe('searchItems', () => {
    it('should search by item name', () => {
      const results = searchItems(mockItems, 'copper');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Copper Sword');
    });

    it('should search by category', () => {
      const results = searchItems(mockItems, 'melee');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Copper Sword');
    });

    it('should search by subcategory', () => {
      const results = searchItems(mockItems, 'boots');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Hermes Boots');
    });

    it('should be case insensitive', () => {
      const results = searchItems(mockItems, 'COPPER');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Copper Sword');
    });

    it('should return all items for empty query', () => {
      const results = searchItems(mockItems, '');
      expect(results).toHaveLength(4);
    });
  });

  describe('filterItems', () => {
    it('should filter by type', () => {
      const filtered = filterItems(mockItems, { type: 'weapon' });
      expect(filtered).toHaveLength(2);
      expect(filtered.every(item => item.type === 'weapon')).toBe(true);
    });

    it('should filter by owned status', () => {
      const ownedFiltered = filterItems(mockItems, { owned: true });
      expect(ownedFiltered).toHaveLength(2);
      expect(ownedFiltered.every(item => item.owned)).toBe(true);

      const unownedFiltered = filterItems(mockItems, { owned: false });
      expect(unownedFiltered).toHaveLength(2);
      expect(unownedFiltered.every(item => !item.owned)).toBe(true);
    });

    it('should apply multiple filters', () => {
      const filtered = filterItems(mockItems, { 
        type: 'weapon', 
        owned: true 
      });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Copper Sword');
    });

    it('should filter by search term', () => {
      const filtered = filterItems(mockItems, { search: 'sword' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Copper Sword');
    });
  });

  describe('sortItems', () => {
    it('should sort by name ascending', () => {
      const sorted = sortItems(mockItems, 'name', 'asc');
      expect(sorted[0].name).toBe('Copper Sword');
      expect(sorted[1].name).toBe('Hermes Boots');
    });

    it('should sort by name descending', () => {
      const sorted = sortItems(mockItems, 'name', 'desc');
      expect(sorted[0].name).toBe('Silver Bow');
      expect(sorted[sorted.length - 1].name).toBe('Copper Sword');
    });

    it('should sort by category', () => {
      const sorted = sortItems(mockItems, 'category', 'asc');
      expect(sorted[0].category).toBe('head');
      expect(sorted[1].category).toBe('melee');
    });

    it('should sort by owned status', () => {
      const sorted = sortItems(mockItems, 'owned', 'asc');
      // Owned items should come first (true > false in our implementation)
      expect(sorted[0].owned).toBe(true);
      expect(sorted[1].owned).toBe(true);
    });

    it('should not mutate original array', () => {
      const original = [...mockItems];
      const sorted = sortItems(mockItems, 'name', 'asc');
      expect(mockItems).toEqual(original);
      expect(sorted).not.toBe(mockItems);
    });
  });
});