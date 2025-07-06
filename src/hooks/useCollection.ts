import { useState, useEffect, useCallback } from 'react';
import { CollectionState, CollectionSettings, StorageData } from '@/types/collection';
import { DEFAULT_SETTINGS } from '@/data';
import { useLocalStorage } from './useLocalStorage';

/**
 * コレクション状態管理カスタムフック
 * アイテムの所持状態とアプリケーション設定を管理する
 */
export const useCollection = () => {
  const [collection, setCollection] = useState<CollectionState>({});
  const [settings, setSettings] = useState<CollectionSettings>(DEFAULT_SETTINGS);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    isLoading: storageLoading,
    error: storageError,
    loadData,
    saveData,
    updateItemStatus,
    updateMultipleItems,
    updateSettings: updateStorageSettings,
    clearAllData,
    exportData,
    importData
  } = useLocalStorage();

  /**
   * 初期化処理：ローカルストレージからデータを復元
   */
  const initializeCollection = useCallback(() => {
    try {
      const savedData = loadData();
      
      if (savedData) {
        // 保存されたデータを復元
        setCollection(savedData.collection);
        setSettings(savedData.settings);
        console.log('Collection data restored from localStorage');
      } else {
        // 初回起動時はデフォルト設定を使用
        setCollection({});
        setSettings(DEFAULT_SETTINGS);
        console.log('Using default collection settings');
      }
      
      setIsInitialized(true);
    } catch (err) {
      console.error('Failed to initialize collection:', err);
      // エラー時もデフォルト設定で初期化
      setCollection({});
      setSettings(DEFAULT_SETTINGS);
      setIsInitialized(true);
    }
  }, [loadData]);

  /**
   * アイテムの所持状態を切り替える
   */
  const toggleItemOwnership = useCallback((itemId: string) => {
    const currentStatus = collection[itemId] || false;
    const newStatus = !currentStatus;
    
    // UIを即座に更新
    setCollection(prev => ({
      ...prev,
      [itemId]: newStatus
    }));
    
    // ローカルストレージに保存
    updateItemStatus(itemId, newStatus);
  }, [collection, updateItemStatus]);

  /**
   * 複数のアイテムの所持状態を一括更新
   */
  const updateMultipleItemsOwnership = useCallback((updates: { [itemId: string]: boolean }) => {
    // UIを即座に更新
    setCollection(prev => ({
      ...prev,
      ...updates
    }));
    
    // ローカルストレージに保存
    updateMultipleItems(updates);
  }, [updateMultipleItems]);

  /**
   * 特定のアイテムの所持状態を取得
   */
  const getItemOwnership = useCallback((itemId: string): boolean => {
    return collection[itemId] || false;
  }, [collection]);

  /**
   * 設定を更新
   */
  const updateCollectionSettings = useCallback((newSettings: Partial<CollectionSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    
    // UIを即座に更新
    setSettings(updatedSettings);
    
    // ローカルストレージに保存
    updateStorageSettings(newSettings);
  }, [settings, updateStorageSettings]);

  /**
   * すべてのデータをリセット
   */
  const resetAllData = useCallback(() => {
    setCollection({});
    setSettings(DEFAULT_SETTINGS);
    clearAllData();
  }, [clearAllData]);

  /**
   * データをエクスポート
   */
  const exportCollectionData = useCallback(() => {
    return exportData();
  }, [exportData]);

  /**
   * データをインポート
   */
  const importCollectionData = useCallback((jsonData: string): boolean => {
    const success = importData(jsonData);
    
    if (success) {
      // インポート成功時は再初期化
      initializeCollection();
    }
    
    return success;
  }, [importData, initializeCollection]);

  /**
   * 初回マウント時の初期化
   */
  useEffect(() => {
    if (!storageLoading && !isInitialized) {
      initializeCollection();
    }
  }, [storageLoading, isInitialized, initializeCollection]);

  /**
   * 状態変更時の自動保存
   */
  useEffect(() => {
    if (isInitialized) {
      saveData(collection, settings);
    }
  }, [collection, settings, isInitialized, saveData]);

  return {
    // 状態
    collection,
    settings,
    isInitialized,
    isLoading: storageLoading || !isInitialized,
    error: storageError,
    
    // アイテム操作
    toggleItemOwnership,
    updateMultipleItemsOwnership,
    getItemOwnership,
    
    // 設定操作
    updateCollectionSettings,
    
    // データ管理
    resetAllData,
    exportCollectionData,
    importCollectionData,
    
    // 初期化
    initializeCollection,
  };
};