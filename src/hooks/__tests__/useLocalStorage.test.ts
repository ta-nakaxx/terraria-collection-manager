import { renderHook } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';
import { STORAGE_KEY, STORAGE_VERSION, DEFAULT_SETTINGS } from '@/data';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Replace global localStorage with mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadData', () => {
    it('should return null when no data exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useLocalStorage());
      
      const data = result.current.loadData();
      expect(data).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should return parsed data when valid data exists', () => {
      const mockData = {
        version: STORAGE_VERSION,
        lastUpdated: '2024-01-01T00:00:00.000Z',
        collection: { 'item1': true },
        settings: DEFAULT_SETTINGS
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockData));
      
      const { result } = renderHook(() => useLocalStorage());
      
      const data = result.current.loadData();
      expect(data).toEqual(mockData);
    });

    it('should clear and return null for version mismatch', () => {
      const mockData = {
        version: '0.0.1', // Different version
        lastUpdated: '2024-01-01T00:00:00.000Z',
        collection: { 'item1': true },
        settings: DEFAULT_SETTINGS
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockData));
      
      const { result } = renderHook(() => useLocalStorage());
      
      const data = result.current.loadData();
      expect(data).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should return null for invalid JSON', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');
      
      const { result } = renderHook(() => useLocalStorage());
      
      const data = result.current.loadData();
      expect(data).toBeNull();
    });
  });

  describe('saveData', () => {
    it('should save data successfully', () => {
      const { result } = renderHook(() => useLocalStorage());
      
      const collection = { 'item1': true };
      const settings = DEFAULT_SETTINGS;
      
      const success = result.current.saveData(collection, settings);
      
      expect(success).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.stringContaining('"collection":{"item1":true}')
      );
    });

    it('should handle save errors', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      const { result } = renderHook(() => useLocalStorage());
      
      const collection = { 'item1': true };
      const settings = DEFAULT_SETTINGS;
      
      const success = result.current.saveData(collection, settings);
      
      expect(success).toBe(false);
    });
  });

  describe('clearAllData', () => {
    it('should clear all data successfully', () => {
      const { result } = renderHook(() => useLocalStorage());
      
      const success = result.current.clearAllData();
      
      expect(success).toBe(true);
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should handle clear errors', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const { result } = renderHook(() => useLocalStorage());
      
      const success = result.current.clearAllData();
      
      expect(success).toBe(false);
    });
  });

  describe('exportData', () => {
    it('should export data as JSON string', () => {
      const mockData = {
        version: STORAGE_VERSION,
        lastUpdated: '2024-01-01T00:00:00.000Z',
        collection: { 'item1': true },
        settings: DEFAULT_SETTINGS
      };
      
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockData));
      
      const { result } = renderHook(() => useLocalStorage());
      
      const exportedData = result.current.exportData();
      const parsedData = JSON.parse(exportedData!);
      
      expect(parsedData).toEqual(mockData);
    });

    it('should return null when no data exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      
      const { result } = renderHook(() => useLocalStorage());
      
      const exportedData = result.current.exportData();
      
      expect(exportedData).toBeNull();
    });
  });

  describe('importData', () => {
    it('should import valid data successfully', () => {
      const importData = {
        version: STORAGE_VERSION,
        lastUpdated: '2024-01-01T00:00:00.000Z',
        collection: { 'item1': true },
        settings: DEFAULT_SETTINGS
      };
      
      const { result } = renderHook(() => useLocalStorage());
      
      const success = result.current.importData(JSON.stringify(importData));
      
      expect(success).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify(importData)
      );
    });

    it('should reject invalid JSON', () => {
      const { result } = renderHook(() => useLocalStorage());
      
      const success = result.current.importData('invalid json');
      
      expect(success).toBe(false);
    });

    it('should reject data with missing properties', () => {
      const invalidData = {
        version: STORAGE_VERSION,
        // missing collection and settings
      };
      
      const { result } = renderHook(() => useLocalStorage());
      
      const success = result.current.importData(JSON.stringify(invalidData));
      
      expect(success).toBe(false);
    });
  });
});