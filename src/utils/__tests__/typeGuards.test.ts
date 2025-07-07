import {
  isValidItemType,
  isValidRarity,
  isValidItem,
  isValidItemArray,
  isNonEmptyString
} from '../typeGuards';
import { Item } from '@/types';

describe('typeGuards', () => {
  describe('isValidItemType', () => {
    it('should return true for valid item types', () => {
      expect(isValidItemType('weapon')).toBe(true);
      expect(isValidItemType('armor')).toBe(true);
      expect(isValidItemType('accessory')).toBe(true);
      expect(isValidItemType('npc')).toBe(true);
      expect(isValidItemType('boss')).toBe(true);
    });

    it('should return false for invalid item types', () => {
      expect(isValidItemType('invalid')).toBe(false);
      expect(isValidItemType('magic')).toBe(false);
      expect(isValidItemType('')).toBe(false);
    });
  });

  describe('isValidRarity', () => {
    it('should return true for valid rarities', () => {
      expect(isValidRarity('white')).toBe(true);
      expect(isValidRarity('blue')).toBe(true);
      expect(isValidRarity('green')).toBe(true);
      expect(isValidRarity('orange')).toBe(true);
      expect(isValidRarity('red')).toBe(true);
      expect(isValidRarity('purple')).toBe(true);
      expect(isValidRarity('rainbow')).toBe(true);
    });

    it('should return false for invalid rarities', () => {
      expect(isValidRarity('invalid')).toBe(false);
      expect(isValidRarity('yellow')).toBe(false);
      expect(isValidRarity('')).toBe(false);
    });
  });

  describe('isValidItem', () => {
    const validItem: Item = {
      id: 'test-item',
      name: 'Test Item',
      type: 'weapon',
      category: 'melee',
      subcategory: 'sword',
      iconPath: '/icons/test.png',
      acquisition: ['craft'],
      rarity: 'white',
      gameStage: 'pre-hardmode',
      owned: false
    };

    it('should return true for valid item', () => {
      expect(isValidItem(validItem)).toBe(true);
    });

    it('should return false for null or undefined', () => {
      expect(isValidItem(null)).toBe(false);
      expect(isValidItem(undefined)).toBe(false);
    });

    it('should return false for non-object values', () => {
      expect(isValidItem('string')).toBe(false);
      expect(isValidItem(123)).toBe(false);
      expect(isValidItem(true)).toBe(false);
    });

    it('should return false for object missing required properties', () => {
      const itemMissingId = { ...validItem };
      delete (itemMissingId as Record<string, unknown>).id;
      expect(isValidItem(itemMissingId)).toBe(false);

      const itemMissingName = { ...validItem };
      delete (itemMissingName as Record<string, unknown>).name;
      expect(isValidItem(itemMissingName)).toBe(false);

      const itemMissingType = { ...validItem };
      delete (itemMissingType as Record<string, unknown>).type;
      expect(isValidItem(itemMissingType)).toBe(false);
    });

    it('should return false for invalid property types', () => {
      const itemWithInvalidId = { ...validItem, id: 123 };
      expect(isValidItem(itemWithInvalidId)).toBe(false);

      const itemWithInvalidName = { ...validItem, name: null };
      expect(isValidItem(itemWithInvalidName)).toBe(false);

      const itemWithInvalidOwned = { ...validItem, owned: 'yes' };
      expect(isValidItem(itemWithInvalidOwned)).toBe(false);
    });

    it('should return false for invalid item type', () => {
      const itemWithInvalidType = { ...validItem, type: 'invalid' };
      expect(isValidItem(itemWithInvalidType)).toBe(false);
    });

    it('should return false for invalid rarity when present', () => {
      const itemWithInvalidRarity = { ...validItem, rarity: 'invalid' };
      expect(isValidItem(itemWithInvalidRarity)).toBe(false);
    });

    it('should return true when rarity is not present', () => {
      const itemWithoutRarity = { ...validItem };
      delete (itemWithoutRarity as Record<string, unknown>).rarity;
      expect(isValidItem(itemWithoutRarity)).toBe(true);
    });
  });

  describe('isValidItemArray', () => {
    const validItem: Item = {
      id: 'test-item',
      name: 'Test Item',
      type: 'weapon',
      category: 'melee',
      subcategory: 'sword',
      iconPath: '/icons/test.png',
      acquisition: ['craft'],
      rarity: 'white',
      gameStage: 'pre-hardmode',
      owned: false
    };

    it('should return true for valid item array', () => {
      expect(isValidItemArray([validItem])).toBe(true);
      expect(isValidItemArray([validItem, validItem])).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(isValidItemArray([])).toBe(true);
    });

    it('should return false for non-array', () => {
      expect(isValidItemArray(validItem)).toBe(false);
      expect(isValidItemArray('not array')).toBe(false);
      expect(isValidItemArray(null)).toBe(false);
    });

    it('should return false for array containing invalid items', () => {
      const invalidItem = { ...validItem, type: 'invalid' };
      expect(isValidItemArray([validItem, invalidItem])).toBe(false);
    });
  });

  describe('isNonEmptyString', () => {
    it('should return true for non-empty strings', () => {
      expect(isNonEmptyString('hello')).toBe(true);
      expect(isNonEmptyString('a')).toBe(true);
      expect(isNonEmptyString('   text   ')).toBe(true);
    });

    it('should return false for empty strings', () => {
      expect(isNonEmptyString('')).toBe(false);
      expect(isNonEmptyString('   ')).toBe(false);
      expect(isNonEmptyString('\t\n')).toBe(false);
    });

    it('should return false for non-strings', () => {
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
      expect(isNonEmptyString(123)).toBe(false);
      expect(isNonEmptyString({})).toBe(false);
    });
  });
});