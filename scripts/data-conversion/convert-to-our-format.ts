/**
 * cr0wst/terraria-info データを我々の形式に変換するスクリプト
 */

import { Item, ItemType, Rarity, GameStage } from '@/types';

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
 * アイテム名からタイプを推定
 */
function classifyItemType(name: string): ItemType {
  const lowerName = name.toLowerCase();
  
  // 武器の判定
  const weaponKeywords = [
    'sword', 'blade', 'saber', 'katana', 'claymore',
    'bow', 'gun', 'rifle', 'pistol', 'revolver', 'shotgun',
    'staff', 'wand', 'tome', 'book',
    'spear', 'lance', 'trident', 'halberd',
    'whip', 'flail', 'chain',
    'yoyo', 'boomerang', 'chakram',
    'drill', 'pickaxe', 'hammer', 'axe',
    'magic', 'spell', 'crystal'
  ];
  
  // 防具の判定
  const armorKeywords = [
    'helmet', 'hat', 'cap', 'mask', 'hood', 'crown',
    'breastplate', 'chestplate', 'shirt', 'robe', 'tunic',
    'greaves', 'leggings', 'pants', 'boots', 'shoes'
  ];
  
  // アクセサリーの判定
  const accessoryKeywords = [
    'ring', 'necklace', 'amulet', 'charm', 'emblem',
    'wings', 'balloon', 'cloud', 'bottle', 'horseshoe',
    'band', 'cross', 'star', 'moon', 'sun',
    'shield', 'anklet', 'charm', 'token'
  ];
  
  // NPCの判定
  const npcKeywords = [
    'guide', 'merchant', 'nurse', 'demolitionist', 'dye trader',
    'angler', 'zoologist', 'golfer', 'princess', 'santa'
  ];
  
  // ボスの判定
  const bossKeywords = [
    'eye of cthulhu', 'brain of cthulhu', 'eater of worlds',
    'skeleton', 'wall of flesh', 'destroyer', 'twins',
    'prime', 'plantera', 'golem', 'duke fishron', 'moon lord'
  ];
  
  if (weaponKeywords.some(keyword => lowerName.includes(keyword))) {
    return 'weapon';
  }
  
  if (armorKeywords.some(keyword => lowerName.includes(keyword))) {
    return 'armor';
  }
  
  if (accessoryKeywords.some(keyword => lowerName.includes(keyword))) {
    return 'accessory';
  }
  
  if (npcKeywords.some(keyword => lowerName.includes(keyword))) {
    return 'npc';
  }
  
  if (bossKeywords.some(keyword => lowerName.includes(keyword))) {
    return 'boss';
  }
  
  // デフォルトはアクセサリー
  return 'accessory';
}

/**
 * アイテム名からカテゴリを推定
 */
function deriveCategory(name: string, type: ItemType): string {
  const lowerName = name.toLowerCase();
  
  switch (type) {
    case 'weapon':
      if (lowerName.includes('sword') || lowerName.includes('blade')) return 'melee';
      if (lowerName.includes('bow') || lowerName.includes('gun')) return 'ranged';
      if (lowerName.includes('staff') || lowerName.includes('wand')) return 'magic';
      if (lowerName.includes('whip') || lowerName.includes('flail')) return 'summoner';
      return 'melee';
    
    case 'armor':
      if (lowerName.includes('helmet') || lowerName.includes('hat')) return 'head';
      if (lowerName.includes('breastplate') || lowerName.includes('shirt')) return 'body';
      if (lowerName.includes('greaves') || lowerName.includes('boots')) return 'legs';
      return 'head';
    
    case 'accessory':
      if (lowerName.includes('ring') || lowerName.includes('band')) return 'utility';
      if (lowerName.includes('wings')) return 'movement';
      if (lowerName.includes('shield')) return 'defense';
      return 'utility';
    
    case 'npc':
      return 'town';
    
    case 'boss':
      return 'hostile';
    
    default:
      return 'misc';
  }
}

/**
 * サブカテゴリを推定
 */
function deriveSubcategory(name: string, type: ItemType): string {
  const lowerName = name.toLowerCase();
  
  switch (type) {
    case 'weapon':
      if (lowerName.includes('sword')) return 'sword';
      if (lowerName.includes('bow')) return 'bow';
      if (lowerName.includes('gun')) return 'gun';
      if (lowerName.includes('staff')) return 'staff';
      return 'other';
    
    case 'armor':
      if (lowerName.includes('helmet')) return 'helmet';
      if (lowerName.includes('breastplate')) return 'breastplate';
      if (lowerName.includes('greaves')) return 'greaves';
      return 'other';
    
    case 'accessory':
      if (lowerName.includes('ring')) return 'ring';
      if (lowerName.includes('wings')) return 'wings';
      if (lowerName.includes('necklace')) return 'necklace';
      return 'other';
    
    default:
      return 'other';
  }
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
                   type === 'armor' ? 'armor' : 'accessories';
  
  return `/assets/icons/${category}/${id.toLowerCase().replace(/\s+/g, '-')}.png`;
}

/**
 * rawデータを我々の形式に変換
 */
export function convertRawData(rawData: RawTerrariaItem[]): Item[] {
  console.log(`Converting ${rawData.length} raw items to our format...`);
  
  const convertedItems: Item[] = rawData.map(item => {
    const type = classifyItemType(item.name);
    const category = deriveCategory(item.name, type);
    const subcategory = deriveSubcategory(item.name, type);
    const rarity = deriveRarity(item.name);
    const gameStage = deriveGameStage(item.name);
    const acquisition = deriveAcquisition(item);
    const iconPath = generateIconPath(item.id, type);
    
    return {
      id: item.id,
      name: item.name,
      type,
      category,
      subcategory,
      iconPath,
      acquisition,
      rarity,
      gameStage,
      owned: false
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