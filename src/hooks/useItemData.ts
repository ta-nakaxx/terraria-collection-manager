/**
 * アイテムデータ読み込み管理フック
 */

import { useState, useEffect, useCallback } from 'react';
import { Item } from '@/types';
import { loadItemData, DataLoadResult, DataSource, getDataStatistics } from '@/data/dataProvider';

/**
 * アイテムデータの状態
 */
interface ItemDataState {
  /** 読み込まれたアイテム一覧 */
  items: Item[];
  /** データの読み込み状態 */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 使用されているデータソース */
  dataSource: DataSource | null;
  /** アイテム数 */
  itemCount: number;
  /** データ統計情報 */
  statistics: ReturnType<typeof getDataStatistics> | null;
}

/**
 * アイテムデータ読み込みフック
 */
export function useItemData() {
  const [state, setState] = useState<ItemDataState>({
    items: [],
    isLoading: true,
    error: null,
    dataSource: null,
    itemCount: 0,
    statistics: null
  });

  /**
   * データの読み込み処理
   */
  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result: DataLoadResult = await loadItemData();
      
      const statistics = getDataStatistics(result.items);
      
      setState({
        items: result.items,
        isLoading: false,
        error: result.error || null,
        dataSource: result.source,
        itemCount: result.count,
        statistics
      });

      // データソース情報をコンソールに出力
      console.log(`📊 Data loaded: ${result.count} items from ${result.source} source`);
      if (result.error) {
        console.warn(`⚠️ Data load warning: ${result.error}`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        items: [], // エラー時は空配列
        itemCount: 0,
        statistics: null
      }));

      console.error('❌ Failed to load item data:', errorMessage);
    }
  }, []);

  /**
   * データの再読み込み
   */
  const reloadData = useCallback(() => {
    loadData();
  }, [loadData]);

  /**
   * 初回読み込み
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    // データ状態
    items: state.items,
    isLoading: state.isLoading,
    error: state.error,
    dataSource: state.dataSource,
    itemCount: state.itemCount,
    statistics: state.statistics,
    
    // アクション
    reloadData,
    
    // ヘルパー関数
    isRealData: state.dataSource === 'real',
    isSampleData: state.dataSource === 'sample',
    hasError: !!state.error,
    isEmpty: state.items.length === 0 && !state.isLoading
  };
}

/**
 * データソース情報表示用のヘルパー
 */
export function getDataSourceDisplayInfo(dataSource: DataSource | null): {
  label: string;
  icon: string;
  color: string;
  description: string;
} {
  switch (dataSource) {
    case 'real':
      return {
        label: 'Real Data',
        icon: '🎮',
        color: 'text-green-600',
        description: 'Using actual Terraria game data'
      };
    case 'sample':
      return {
        label: 'Sample Data',
        icon: '📋',
        color: 'text-yellow-600',
        description: 'Using sample data for demonstration'
      };
    default:
      return {
        label: 'Unknown',
        icon: '❓',
        color: 'text-gray-600',
        description: 'Data source not determined'
      };
  }
}