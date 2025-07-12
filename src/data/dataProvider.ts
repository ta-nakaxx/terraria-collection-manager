/**
 * データ提供システム - 実データとサンプルデータの統一インターフェース
 */

import { Item } from '@/types';
import { v0Items } from './v0-data';

/**
 * データソースの種類
 */
export type DataSource = 'real' | 'sample';

/**
 * データロード結果
 */
export interface DataLoadResult {
  items: Item[];
  source: DataSource;
  count: number;
  error?: string;
}

/**
 * 実データの非同期読み込み
 */
async function loadRealData(): Promise<Item[]> {
  try {
    // キュレーションされたアイテムデータの読み込み
    const response = await import('./real-data/curated-items.json');
    const realItems = response.default || response;
    
    if (!Array.isArray(realItems) || realItems.length === 0) {
      throw new Error('Real data is empty or invalid format');
    }
    
    // データの基本検証
    const validItems = realItems.filter((item: unknown) => 
      item && 
      typeof item === 'object' &&
      item !== null &&
      typeof (item as Record<string, unknown>).id === 'string' && 
      typeof (item as Record<string, unknown>).name === 'string' &&
      typeof (item as Record<string, unknown>).type === 'string' &&
      typeof (item as Record<string, unknown>).collectionType === 'string'
    );
    
    if (validItems.length === 0) {
      throw new Error('No valid items found in real data');
    }
    
    console.log(`✅ Real data loaded successfully: ${validItems.length} items`);
    return validItems as Item[];
  } catch (error) {
    console.warn('❌ Failed to load real data:', error);
    throw error;
  }
}

/**
 * サンプルデータの取得
 */
function getSampleData(): Item[] {
  console.log(`📋 Using sample data: ${v0Items.length} items`);
  return v0Items;
}

/**
 * フォールバック機能付きデータ読み込み
 */
export async function loadItemData(): Promise<DataLoadResult> {
  try {
    // まず実データの読み込みを試行
    const realItems = await loadRealData();
    
    return {
      items: realItems,
      source: 'real',
      count: realItems.length
    };
  } catch (realDataError) {
    // 実データが失敗した場合、サンプルデータにフォールバック
    console.warn('Real data unavailable, falling back to sample data');
    
    try {
      const sampleItems = getSampleData();
      
      return {
        items: sampleItems,
        source: 'sample',
        count: sampleItems.length,
        error: `Real data failed: ${realDataError}`
      };
    } catch (sampleError) {
      // サンプルデータも失敗した場合（この状況は稀）
      throw new Error(`Both real and sample data failed. Real: ${realDataError}, Sample: ${sampleError}`);
    }
  }
}

/**
 * 指定されたデータソースからアイテムを読み込み
 */
export async function loadItemDataFromSource(source: DataSource): Promise<DataLoadResult> {
  switch (source) {
    case 'real':
      try {
        const realItems = await loadRealData();
        return {
          items: realItems,
          source: 'real',
          count: realItems.length
        };
      } catch (error) {
        throw new Error(`Failed to load real data: ${error}`);
      }
      
    case 'sample':
      const sampleItems = getSampleData();
      return {
        items: sampleItems,
        source: 'sample',
        count: sampleItems.length
      };
      
    default:
      throw new Error(`Unknown data source: ${source}`);
  }
}

/**
 * データソースの利用可能性チェック
 */
export async function checkDataSourceAvailability(): Promise<{
  real: boolean;
  sample: boolean;
}> {
  const result = {
    real: false,
    sample: false
  };
  
  // 実データの利用可能性をチェック
  try {
    await loadRealData();
    result.real = true;
  } catch {
    result.real = false;
  }
  
  // サンプルデータの利用可能性をチェック
  try {
    getSampleData();
    result.sample = true;
  } catch {
    result.sample = false;
  }
  
  return result;
}

/**
 * データ統計情報の取得
 */
export function getDataStatistics(items: Item[]): {
  totalItems: number;
  byType: Record<string, number>;
  byRarity: Record<string, number>;
  byGameStage: Record<string, number>;
} {
  const stats = {
    totalItems: items.length,
    byType: {} as Record<string, number>,
    byRarity: {} as Record<string, number>,
    byGameStage: {} as Record<string, number>
  };
  
  items.forEach(item => {
    // タイプ別統計
    stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
    
    // レアリティ別統計
    stats.byRarity[item.rarity] = (stats.byRarity[item.rarity] || 0) + 1;
    
    // ゲームステージ別統計
    stats.byGameStage[item.gameStage] = (stats.byGameStage[item.gameStage] || 0) + 1;
  });
  
  return stats;
}