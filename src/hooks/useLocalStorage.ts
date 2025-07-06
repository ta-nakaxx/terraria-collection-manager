import { useState, useEffect, useCallback } from 'react';
import { CollectionState, StorageData, CollectionSettings } from '@/types/collection';
import { STORAGE_KEY, STORAGE_VERSION, DEFAULT_SETTINGS } from '@/data';

/**
 * ローカルストレージ管理カスタムフック
 * Terrariaコレクションの状態をブラウザのローカルストレージに永続化する
 */
export const useLocalStorage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * ローカルストレージからデータを読み込む
   */
  const loadData = useCallback((): StorageData | null => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) {
        return null;
      }

      const data: StorageData = JSON.parse(rawData);
      
      // バージョンチェック
      if (data.version !== STORAGE_VERSION) {
        console.warn('Storage version mismatch, clearing old data');
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Failed to load data from localStorage:', err);
      setError('データの読み込みに失敗しました');
      return null;
    }
  }, []);

  /**
   * ローカルストレージにデータを保存する
   */
  const saveData = useCallback((collection: CollectionState, settings: CollectionSettings): boolean => {
    try {
      const data: StorageData = {
        version: STORAGE_VERSION,
        lastUpdated: new Date().toISOString(),
        collection,
        settings
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to save data to localStorage:', err);
      setError('データの保存に失敗しました');
      return false;
    }
  }, []);

  /**
   * 特定のアイテムの所持状態を更新する
   */
  const updateItemStatus = useCallback((itemId: string, owned: boolean): boolean => {
    try {
      const currentData = loadData();
      const currentCollection = currentData?.collection || {};
      const currentSettings = currentData?.settings || DEFAULT_SETTINGS;

      const updatedCollection: CollectionState = {
        ...currentCollection,
        [itemId]: owned
      };

      return saveData(updatedCollection, currentSettings);
    } catch (err) {
      console.error('Failed to update item status:', err);
      setError('アイテム状態の更新に失敗しました');
      return false;
    }
  }, [loadData, saveData]);

  /**
   * 複数のアイテムの所持状態を一括更新する
   */
  const updateMultipleItems = useCallback((updates: { [itemId: string]: boolean }): boolean => {
    try {
      const currentData = loadData();
      const currentCollection = currentData?.collection || {};
      const currentSettings = currentData?.settings || DEFAULT_SETTINGS;

      const updatedCollection: CollectionState = {
        ...currentCollection,
        ...updates
      };

      return saveData(updatedCollection, currentSettings);
    } catch (err) {
      console.error('Failed to update multiple items:', err);
      setError('複数アイテムの更新に失敗しました');
      return false;
    }
  }, [loadData, saveData]);

  /**
   * 設定を更新する
   */
  const updateSettings = useCallback((newSettings: Partial<CollectionSettings>): boolean => {
    try {
      const currentData = loadData();
      const currentCollection = currentData?.collection || {};
      const currentSettings = currentData?.settings || DEFAULT_SETTINGS;

      const updatedSettings: CollectionSettings = {
        ...currentSettings,
        ...newSettings
      };

      return saveData(currentCollection, updatedSettings);
    } catch (err) {
      console.error('Failed to update settings:', err);
      setError('設定の更新に失敗しました');
      return false;
    }
  }, [loadData, saveData]);

  /**
   * すべてのデータをクリアする
   */
  const clearAllData = useCallback((): boolean => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to clear data:', err);
      setError('データのクリアに失敗しました');
      return false;
    }
  }, []);

  /**
   * データをエクスポートする
   */
  const exportData = useCallback((): string | null => {
    try {
      const data = loadData();
      if (!data) {
        return null;
      }
      return JSON.stringify(data, null, 2);
    } catch (err) {
      console.error('Failed to export data:', err);
      setError('データのエクスポートに失敗しました');
      return null;
    }
  }, [loadData]);

  /**
   * データをインポートする
   */
  const importData = useCallback((jsonData: string): boolean => {
    try {
      const data: StorageData = JSON.parse(jsonData);
      
      // 基本的なバリデーション
      if (!data.collection || !data.settings || !data.version) {
        throw new Error('Invalid data format');
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setError(null);
      return true;
    } catch (err) {
      console.error('Failed to import data:', err);
      setError('データのインポートに失敗しました');
      return false;
    }
  }, []);

  /**
   * 初期化処理
   */
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return {
    // 状態
    isLoading,
    error,
    
    // データ操作
    loadData,
    saveData,
    updateItemStatus,
    updateMultipleItems,
    updateSettings,
    clearAllData,
    
    // インポート/エクスポート
    exportData,
    importData,
  };
};