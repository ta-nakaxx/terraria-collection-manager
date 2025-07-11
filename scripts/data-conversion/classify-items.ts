/**
 * アイテム分類システムの実装
 */

import { Item, ItemType, Rarity, GameStage } from '@/types';

/**
 * アイテム分類のルール定義
 */
export const CLASSIFICATION_RULES = {
  weapons: {
    melee: {
      sword: ['sword', 'blade', 'saber', 'katana', 'claymore', 'cutlass', 'scimitar'],
      spear: ['spear', 'lance', 'trident', 'halberd', 'partisan'],
      flail: ['flail', 'chain', 'morning star'],
      yoyo: ['yoyo'],
      boomerang: ['boomerang', 'chakram', 'bananarang'],
      other: ['war axe', 'battle axe', 'sword', 'mace', 'club']
    },
    ranged: {
      bow: ['bow', 'crossbow'],
      gun: ['gun', 'rifle', 'pistol', 'revolver', 'shotgun', 'musket', 'sniper'],
      launcher: ['launcher', 'rocket', 'grenade'],
      thrown: ['throwing', 'dart', 'knife', 'star', 'javelin']
    },
    magic: {
      staff: ['staff', 'wand'],
      tome: ['tome', 'book', 'spell'],
      crystal: ['crystal', 'gem', 'orb']
    },
    summoner: {
      whip: ['whip', 'lash'],
      staff: ['summoning staff', 'minion staff'],
      other: ['summoner']
    }
  },
  armor: {
    head: ['helmet', 'hat', 'cap', 'mask', 'hood', 'crown', 'headpiece', 'visor'],
    body: ['breastplate', 'chestplate', 'shirt', 'robe', 'tunic', 'vest', 'mail', 'plate'],
    legs: ['greaves', 'leggings', 'pants', 'boots', 'shoes', 'sandals', 'treads']
  },
  accessories: {
    movement: ['wings', 'rocket boots', 'cloud', 'balloon', 'horseshoe', 'flying carpet'],
    defense: ['shield', 'shackle', 'cross', 'star', 'charm'],
    utility: ['ring', 'band', 'necklace', 'amulet', 'emblem', 'insignia', 'medal'],
    combat: ['glove', 'scope', 'quiver', 'pouch', 'belt']
  },
  tools: {
    mining: ['pickaxe', 'drill'],
    building: ['axe', 'hammer', 'chainsaw'],
    utility: ['fishing pole', 'fishing rod', 'bug net', 'paint brush']
  },
  npcs: {
    town: ['guide', 'merchant', 'nurse', 'demolitionist', 'dye trader', 'angler', 'zoologist', 'golfer', 'princess', 'santa claus'],
    special: ['traveling merchant', 'skeleton merchant', 'old man']
  },
  bosses: {
    pre_hardmode: ['eye of cthulhu', 'brain of cthulhu', 'eater of worlds', 'queen bee', 'skeletron', 'wall of flesh'],
    hardmode: ['destroyer', 'twins', 'skeletron prime', 'plantera', 'golem', 'duke fishron', 'empress of light'],
    post_golem: ['lunatic cultist', 'moon lord']
  }
} as const;

/**
 * レアリティ推定ルール
 */
export const RARITY_RULES = {
  rainbow: ['rainbow', 'legendary', 'mythical', 'unreal', 'godly'],
  purple: ['master mode', 'expert mode', 'legendary', 'mythical'],
  red: ['hardmode', 'post-plantera', 'endgame', 'boss drop'],
  orange: ['rare', 'special', 'unique', 'post-golem'],
  green: ['uncommon', 'magic', 'enhanced', 'improved'],
  blue: ['magic', 'enchanted', 'superior', 'fine'],
  white: ['common', 'basic', 'normal', 'standard']
} as const;

/**
 * ゲームステージ推定ルール
 */
export const GAME_STAGE_RULES = {
  'post-golem': ['post-golem', 'lunar', 'moon lord', 'endgame', 'celestial'],
  'post-plantera': ['post-plantera', 'temple', 'golem', 'duke fishron', 'empress'],
  'hardmode': ['hardmode', 'mechanical', 'destroyer', 'twins', 'prime', 'plantera'],
  'pre-hardmode': ['pre-hardmode', 'eye of cthulhu', 'brain', 'eater', 'queen bee', 'skeletron']
} as const;

/**
 * 文字列がキーワードのいずれかを含むかチェック
 */
function containsKeyword(text: string, keywords: readonly string[]): boolean {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

/**
 * アイテムタイプを詳細に分類
 */
export function classifyItemType(name: string): ItemType {
  const lowerName = name.toLowerCase();
  
  // ツールの判定（武器より先に判定）
  for (const keywords of Object.values(CLASSIFICATION_RULES.tools)) {
    if (containsKeyword(lowerName, keywords)) {
      return 'tool';
    }
  }
  
  // 武器の判定
  for (const [weaponType, subcategories] of Object.entries(CLASSIFICATION_RULES.weapons)) {
    for (const keywords of Object.values(subcategories)) {
      if (containsKeyword(lowerName, keywords)) {
        return 'weapon';
      }
    }
  }
  
  // 防具の判定
  for (const keywords of Object.values(CLASSIFICATION_RULES.armor)) {
    if (containsKeyword(lowerName, keywords)) {
      return 'armor';
    }
  }
  
  // NPCの判定
  for (const keywords of Object.values(CLASSIFICATION_RULES.npcs)) {
    if (containsKeyword(lowerName, keywords)) {
      return 'npc';
    }
  }
  
  // ボスの判定
  for (const keywords of Object.values(CLASSIFICATION_RULES.bosses)) {
    if (containsKeyword(lowerName, keywords)) {
      return 'boss';
    }
  }
  
  // デフォルトはアクセサリー
  return 'accessory';
}

/**
 * UIカテゴリ（UIシステムの親カテゴリ）を分類
 * UIの期待値に合わせて親カテゴリを返す
 */
export function classifyItemCategory(name: string, type: ItemType): string {
  switch (type) {
    case 'weapon':
      return 'Weapons';
    case 'armor':
      return 'Armor';
    case 'accessory':
      return 'Accessories';
    case 'vanity':
      return 'Vanity';
    case 'tool':
      return 'Tools';
    case 'material':
      return 'Materials';
    case 'consumable':
      return 'Consumables';
    case 'building':
      return 'Building';
    case 'furniture':
      return 'Furniture';
    case 'lighting':
      return 'Lighting';
    case 'storage':
      return 'Storage';
    case 'ammunition':
      return 'Ammunition';
    case 'mechanism':
      return 'Mechanisms';
    case 'novelty':
      return 'Novelty';
    case 'key':
      return 'Keys';
    case 'npc':
      return 'NPCs';
    case 'boss':
      return 'Bosses';
    default:
      return 'Tools'; // デフォルト
  }
}

/**
 * UIサブカテゴリを分類
 * アイテム名とタイプに基づいてサブカテゴリを返す
 */
export function classifyItemSubcategory(name: string, type: ItemType): string {
  const lowerName = name.toLowerCase();
  
  switch (type) {
    case 'weapon':
      // 武器のサブカテゴリ
      for (const [weaponClass, subcategories] of Object.entries(CLASSIFICATION_RULES.weapons)) {
        for (const keywords of Object.values(subcategories)) {
          if (containsKeyword(lowerName, keywords)) {
            switch (weaponClass) {
              case 'melee':
                return 'Melee';
              case 'ranged':
                return 'Ranged';
              case 'magic':
                return 'Magic';
              case 'summoner':
                return 'Summoner';
              default:
                return 'Melee';
            }
          }
        }
      }
      return 'Melee'; // デフォルト
      
    case 'tool':
      // ツールのサブカテゴリ
      for (const [toolClass, keywords] of Object.entries(CLASSIFICATION_RULES.tools)) {
        if (containsKeyword(lowerName, keywords)) {
          switch (toolClass) {
            case 'mining':
              return 'Mining';
            case 'building':
              return 'Building';
            case 'utility':
              return 'Utility';
            default:
              return 'Mining';
          }
        }
      }
      return 'Mining'; // デフォルト
      
    case 'armor':
      // 防具のサブカテゴリ
      for (const [category, keywords] of Object.entries(CLASSIFICATION_RULES.armor)) {
        if (containsKeyword(lowerName, keywords)) {
          switch (category) {
            case 'head':
              return 'Head';
            case 'body':
              return 'Chest';
            case 'legs':
              return 'Legs';
            default:
              return 'Head';
          }
        }
      }
      return 'Head'; // デフォルト
      
    case 'accessory':
      // アクセサリーのサブカテゴリ
      for (const [category, keywords] of Object.entries(CLASSIFICATION_RULES.accessories)) {
        if (containsKeyword(lowerName, keywords)) {
          switch (category) {
            case 'movement':
              return 'Movement';
            case 'defense':
            case 'combat':
              return 'Combat';
            case 'utility':
              return 'Utility';
            default:
              return 'Utility';
          }
        }
      }
      return 'Utility'; // デフォルト
      
    case 'material':
      // マテリアルのサブカテゴリ
      if (containsKeyword(lowerName, ['ore'])) return 'Ores';
      if (containsKeyword(lowerName, ['bar', 'ingot'])) return 'Bars';
      if (containsKeyword(lowerName, ['wood', 'log'])) return 'Wood';
      if (containsKeyword(lowerName, ['seed'])) return 'Seeds';
      return 'Natural'; // デフォルト
      
    case 'consumable':
      // 消費アイテムのサブカテゴリ
      if (containsKeyword(lowerName, ['potion', 'elixir', 'flask'])) return 'Potions';
      if (containsKeyword(lowerName, ['upgrade', 'enhancement'])) return 'Upgrades';
      if (containsKeyword(lowerName, ['summon', 'boss'])) return 'Summoning';
      return 'Potions'; // デフォルト
      
    case 'building':
      // 建築のサブカテゴリ
      if (containsKeyword(lowerName, ['wall'])) return 'Walls';
      return 'Blocks'; // デフォルト
      
    case 'furniture':
      // 家具のサブカテゴリ
      if (containsKeyword(lowerName, ['chair', 'seat', 'throne'])) return 'Seating';
      if (containsKeyword(lowerName, ['table', 'desk', 'workbench'])) return 'Surface';
      if (containsKeyword(lowerName, ['station', 'anvil', 'furnace'])) return 'Crafting Stations';
      if (containsKeyword(lowerName, ['chest', 'safe', 'storage'])) return 'Storage';
      if (containsKeyword(lowerName, ['door', 'gate'])) return 'Doors';
      return 'Surface'; // デフォルト
      
    case 'lighting':
      // 照明のサブカテゴリ
      if (containsKeyword(lowerName, ['torch'])) return 'Torches';
      if (containsKeyword(lowerName, ['lantern'])) return 'Lanterns';
      if (containsKeyword(lowerName, ['candle'])) return 'Candles';
      return 'Torches'; // デフォルト
      
    case 'storage':
      // ストレージのサブカテゴリ
      if (containsKeyword(lowerName, ['chest'])) return 'Chests';
      return 'Containers'; // デフォルト
      
    case 'ammunition':
      // 弾薬のサブカテゴリ
      if (containsKeyword(lowerName, ['arrow'])) return 'Arrows';
      if (containsKeyword(lowerName, ['bullet'])) return 'Bullets';
      if (containsKeyword(lowerName, ['rocket'])) return 'Rockets';
      return 'Arrows'; // デフォルト
      
    case 'npc':
      // NPCのサブカテゴリ
      return 'Merchants'; // デフォルト
      
    case 'boss':
      // ボスのサブカテゴリ
      return 'Pre-Hardmode'; // デフォルト
      
    case 'vanity':
      // バニティのサブカテゴリ
      if (containsKeyword(lowerName, ['hat', 'helmet', 'mask', 'cap'])) return 'Head';
      if (containsKeyword(lowerName, ['shirt', 'robe', 'vest'])) return 'Body';
      if (containsKeyword(lowerName, ['pants', 'legs', 'skirt'])) return 'Legs';
      if (containsKeyword(lowerName, ['dye'])) return 'Dyes';
      return 'Head'; // デフォルト
      
    case 'mechanism':
      // メカニズムのサブカテゴリ
      if (containsKeyword(lowerName, ['wire'])) return 'Wires';
      if (containsKeyword(lowerName, ['switch', 'lever', 'trigger'])) return 'Switches';
      return 'Other'; // デフォルト
      
    case 'novelty':
      // ノベルティのサブカテゴリ
      return 'Misc'; // デフォルト
      
    case 'key':
      // キーのサブカテゴリ
      if (containsKeyword(lowerName, ['temple', 'dungeon'])) return 'Dungeon Keys';
      if (containsKeyword(lowerName, ['boss', 'summon'])) return 'Boss Keys';
      return 'Quest Keys'; // デフォルト
      
    default:
      return 'Other';
  }
}

/**
 * サブサブカテゴリを詳細に分類（詳細な武器タイプなど）
 */
export function classifyItemSubSubcategory(name: string, type: ItemType): string {
  const lowerName = name.toLowerCase();
  
  switch (type) {
    case 'weapon':
      // 武器の詳細分類
      for (const [weaponClass, subcategories] of Object.entries(CLASSIFICATION_RULES.weapons)) {
        for (const [subcategory, keywords] of Object.entries(subcategories)) {
          if (containsKeyword(lowerName, keywords)) {
            return subcategory;
          }
        }
      }
      return 'other';
      
    case 'armor':
      // 防具の詳細分類
      for (const [armorSlot, keywords] of Object.entries(CLASSIFICATION_RULES.armor)) {
        if (containsKeyword(lowerName, keywords)) {
          return armorSlot;
        }
      }
      return 'other';
      
    case 'accessory':
      // アクセサリーの詳細分類
      for (const [accessoryType, keywords] of Object.entries(CLASSIFICATION_RULES.accessories)) {
        if (containsKeyword(lowerName, keywords)) {
          // 最初にマッチしたキーワードを返す
          for (const keyword of keywords) {
            if (lowerName.includes(keyword)) {
              return keyword.replace(/\s+/g, '_');
            }
          }
          return accessoryType;
        }
      }
      return 'other';
      
    case 'npc':
      return 'merchant';
      
    case 'boss':
      return 'boss';
      
    default:
      return 'other';
  }
}

/**
 * レアリティを推定
 */
export function classifyRarity(name: string): Rarity {
  const lowerName = name.toLowerCase();
  
  // 高いレアリティから順に判定
  for (const [rarity, keywords] of Object.entries(RARITY_RULES)) {
    if (containsKeyword(lowerName, keywords)) {
      return rarity as Rarity;
    }
  }
  
  // デフォルトはwhite
  return 'white';
}

/**
 * ゲームステージを推定
 */
export function classifyGameStage(name: string): GameStage {
  const lowerName = name.toLowerCase();
  
  // 後期ステージから順に判定
  for (const [stage, keywords] of Object.entries(GAME_STAGE_RULES)) {
    if (containsKeyword(lowerName, keywords)) {
      return stage as GameStage;
    }
  }
  
  // デフォルトはpre-hardmode
  return 'pre-hardmode';
}

/**
 * 包括的なアイテム分類
 */
export function classifyItem(name: string): {
  type: ItemType;
  category: string;
  subcategory: string;
  rarity: Rarity;
  gameStage: GameStage;
} {
  const type = classifyItemType(name);
  const category = classifyItemCategory(name, type);
  const subcategory = classifyItemSubcategory(name, type);
  const rarity = classifyRarity(name);
  const gameStage = classifyGameStage(name);
  
  return {
    type,
    category,
    subcategory,
    rarity,
    gameStage
  };
}

/**
 * 分類精度の検証
 */
export function validateClassification(items: Item[]): {
  totalItems: number;
  typeAccuracy: Record<ItemType, number>;
  rarityDistribution: Record<Rarity, number>;
  gameStageDistribution: Record<GameStage, number>;
} {
  const totalItems = items.length;
  
  // タイプ別統計
  const typeStats = items.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<ItemType, number>);
  
  // レアリティ分布
  const rarityStats = items.reduce((acc, item) => {
    acc[item.rarity] = (acc[item.rarity] || 0) + 1;
    return acc;
  }, {} as Record<Rarity, number>);
  
  // ゲームステージ分布
  const gameStageStats = items.reduce((acc, item) => {
    acc[item.gameStage] = (acc[item.gameStage] || 0) + 1;
    return acc;
  }, {} as Record<GameStage, number>);
  
  return {
    totalItems,
    typeAccuracy: typeStats,
    rarityDistribution: rarityStats,
    gameStageDistribution: gameStageStats
  };
}