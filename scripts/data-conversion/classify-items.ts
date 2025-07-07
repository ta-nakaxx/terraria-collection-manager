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
      other: ['pickaxe', 'axe', 'hammer', 'drill']
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
 * UIカテゴリ（サブカテゴリとして使用）を分類
 * UIの期待値に合わせて大分類を返す
 */
export function classifyItemCategory(name: string, type: ItemType): string {
  const lowerName = name.toLowerCase();
  
  switch (type) {
    case 'weapon':
      // 武器の大分類（UIのサブカテゴリに対応）
      for (const [weaponClass, subcategories] of Object.entries(CLASSIFICATION_RULES.weapons)) {
        for (const keywords of Object.values(subcategories)) {
          if (containsKeyword(lowerName, keywords)) {
            // 大分類を適切にマッピング
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
      
    case 'armor':
      // 防具の大分類
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
      // アクセサリーの大分類
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
      
    case 'npc':
      // NPCの大分類
      for (const [category, keywords] of Object.entries(CLASSIFICATION_RULES.npcs)) {
        if (containsKeyword(lowerName, keywords)) {
          switch (category) {
            case 'town':
              return 'Merchants';
            case 'special':
              return 'Craftsmen';
            default:
              return 'Merchants';
          }
        }
      }
      return 'Merchants'; // デフォルト
      
    case 'boss':
      // ボスの大分類
      for (const [category, keywords] of Object.entries(CLASSIFICATION_RULES.bosses)) {
        if (containsKeyword(lowerName, keywords)) {
          switch (category) {
            case 'pre_hardmode':
              return 'Pre-Hardmode';
            case 'hardmode':
              return 'Hardmode';
            case 'post_golem':
              return 'Event';
            default:
              return 'Pre-Hardmode';
          }
        }
      }
      return 'Pre-Hardmode'; // デフォルト
      
    default:
      return 'Other';
  }
}

/**
 * サブカテゴリを詳細に分類（詳細な武器タイプなど）
 */
export function classifyItemSubcategory(name: string, type: ItemType, category: string): string {
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
      return category.toLowerCase();
      
    case 'boss':
      return category.toLowerCase();
      
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
  const subcategory = classifyItemSubcategory(name, type, category);
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