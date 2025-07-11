/**
 * cr0wst/terraria-info データを我々の形式に変換するスクリプト
 */

import { Item, ItemType, Rarity, GameStage, CollectionType } from '@/types';
import { classifyItemType, classifyItemCategory, classifyItemSubcategory, classifyItemSubSubcategory } from './classify-items';

interface RawTerrariaItem {
  id: string;
  name: string;
  recipe1?: string;
  recipe2?: string;
  recipe3?: string;
  recipe4?: string;
  recipe5?: string;
  recipe6?: string;
  recipe7?: string;
  recipe8?: string;
  recipe9?: string;
  recipe10?: string;
  recipe11?: string;
  recipe12?: string;
  recipe13?: string;
  recipe14?: string;
  recipe15?: string;
  [key: string]: any;
}



/**
 * レアリティを推定（基本的にはwhiteから開始）
 */
function deriveRarity(name: string): Rarity {
  const lowerName = name.toLowerCase();
  
  // 特別なアイテムの判定
  if (lowerName.includes('legendary') || lowerName.includes('rainbow')) {
    return 'rainbow';
  }
  
  if (lowerName.includes('master') || lowerName.includes('expert')) {
    return 'purple';
  }
  
  if (lowerName.includes('hardmode') || lowerName.includes('boss')) {
    return 'red';
  }
  
  if (lowerName.includes('rare') || lowerName.includes('special')) {
    return 'orange';
  }
  
  if (lowerName.includes('magic') || lowerName.includes('enchanted')) {
    return 'blue';
  }
  
  if (lowerName.includes('improved') || lowerName.includes('enhanced')) {
    return 'green';
  }
  
  // デフォルトはwhite
  return 'white';
}

/**
 * ゲームステージを推定
 */
function deriveGameStage(name: string): GameStage {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('hardmode') || lowerName.includes('master') || lowerName.includes('expert')) {
    return 'hardmode';
  }
  
  if (lowerName.includes('post-plantera') || lowerName.includes('endgame')) {
    return 'post-plantera';
  }
  
  if (lowerName.includes('post-golem') || lowerName.includes('lunar')) {
    return 'post-golem';
  }
  
  // デフォルトはpre-hardmode
  return 'pre-hardmode';
}

/**
 * 取得方法を推定
 */
function deriveAcquisition(item: RawTerrariaItem): string[] {
  const acquisitions: string[] = [];
  
  // レシピがある場合はクラフト
  if (item.recipe1 || item.recipe2 || item.recipe3) {
    acquisitions.push('craft');
  }
  
  // アイテム名から推定
  const lowerName = item.name.toLowerCase();
  
  if (lowerName.includes('drop') || lowerName.includes('boss')) {
    acquisitions.push('drop');
  }
  
  if (lowerName.includes('buy') || lowerName.includes('shop')) {
    acquisitions.push('buy');
  }
  
  if (lowerName.includes('find') || lowerName.includes('chest')) {
    acquisitions.push('find');
  }
  
  // デフォルトはfind
  if (acquisitions.length === 0) {
    acquisitions.push('find');
  }
  
  return acquisitions;
}

/**
 * アイコンパスを生成
 */
function generateIconPath(id: string, type: ItemType): string {
  const category = type === 'npc' ? 'npcs' : 
                   type === 'boss' ? 'bosses' :
                   type === 'weapon' ? 'weapons' :
                   type === 'armor' ? 'armor' :
                   type === 'tool' ? 'tools' :
                   type === 'material' ? 'materials' :
                   type === 'consumable' ? 'consumables' :
                   type === 'building' ? 'building' :
                   type === 'furniture' ? 'furniture' :
                   type === 'lighting' ? 'lighting' :
                   type === 'storage' ? 'storage' :
                   type === 'ammunition' ? 'ammunition' :
                   type === 'mechanism' ? 'mechanisms' :
                   type === 'novelty' ? 'novelty' :
                   type === 'key' ? 'keys' :
                   type === 'vanity' ? 'vanity' : 'accessories';
  
  return `/assets/icons/${category}/${id}.png`;
}

/**
 * コレクションタイプを決定
 */
function determineCollectionType(type: ItemType): CollectionType {
  const collectibleTypes: ItemType[] = ['weapon', 'armor', 'accessory', 'vanity'];
  const referenceTypes: ItemType[] = ['tool', 'material', 'consumable', 'building', 'furniture', 'lighting', 'storage', 'ammunition', 'mechanism', 'novelty', 'key', 'npc', 'boss'];
  
  if (collectibleTypes.includes(type)) {
    return 'collectible';
  } else if (referenceTypes.includes(type)) {
    return 'reference';
  } else {
    return 'reference'; // デフォルト
  }
}

/**
 * rawデータを我々の形式に変換
 */
export function convertRawData(rawData: RawTerrariaItem[]): Item[] {
  console.log(`Converting ${rawData.length} raw items to our format...`);
  
  const convertedItems: Item[] = rawData.map(item => {
    const type = classifyItemType(item.name);
    const category = classifyItemCategory(item.name, type);
    const subcategory = classifyItemSubcategory(item.name, type);
    const subSubcategory = classifyItemSubSubcategory(item.name, type);
    const rarity = deriveRarity(item.name);
    const gameStage = deriveGameStage(item.name);
    const acquisition = deriveAcquisition(item);
    const iconPath = generateIconPath(item.id, type);
    const collectionType = determineCollectionType(type);
    
    return {
      id: item.id,
      name: item.name,
      type,
      category,
      subcategory,
      subSubcategory,
      iconPath,
      acquisition,
      rarity,
      gameStage,
      owned: false,
      collectionType
    };
  });
  
  console.log(`Successfully converted ${convertedItems.length} items`);
  return convertedItems;
}

/**
 * 変換結果の統計を表示
 */
export function analyzeConvertedData(items: Item[]): void {
  console.log('\n=== Conversion Analysis ===');
  console.log(`Total converted items: ${items.length}`);
  
  // タイプ別統計
  const typeStats = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<ItemType, number>);
  
  console.log('\nItems by type:');
  Object.entries(typeStats).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  
  // レアリティ別統計
  const rarityStats = items.reduce((acc, item) => {
    acc[item.rarity] = (acc[item.rarity] || 0) + 1;
    return acc;
  }, {} as Record<Rarity, number>);
  
  console.log('\nItems by rarity:');
  Object.entries(rarityStats).forEach(([rarity, count]) => {
    console.log(`  ${rarity}: ${count}`);
  });
  
  // ゲームステージ別統計
  const gameStageStats = items.reduce((acc, item) => {
    acc[item.gameStage] = (acc[item.gameStage] || 0) + 1;
    return acc;
  }, {} as Record<GameStage, number>);
  
  console.log('\nItems by game stage:');
  Object.entries(gameStageStats).forEach(([stage, count]) => {
    console.log(`  ${stage}: ${count}`);
  });
}