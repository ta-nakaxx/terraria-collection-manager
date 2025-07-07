// Core item types for Terraria Collection Manager

export type ItemType = 'weapon' | 'armor' | 'accessory' | 'npc' | 'boss';

export type WeaponCategory = 'melee' | 'ranged' | 'magic' | 'summoner';

export type ArmorSlot = 'head' | 'chest' | 'legs';

export type Rarity = 'white' | 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'rainbow';

export type AcquisitionMethod = 'drop' | 'craft' | 'purchase' | 'quest' | 'event';

export type GameStage = 'pre-hardmode' | 'hardmode' | 'post-plantera' | 'post-golem';

export interface ItemStats {
  damage?: number;
  defense?: number;
  effects?: string[];
  requirements?: string[];
  useTime?: number;
  knockback?: number;
  critChance?: number;
}

/**
 * Base item interface with common properties
 * Used as foundation for all specific item types
 */
export interface Item {
  id: string;
  name: string;
  type: ItemType;
  category: string;
  subcategory: string;
  iconPath: string;
  acquisition: string[];
  stats?: ItemStats;
  description?: string;
  rarity: Rarity;
  gameStage: GameStage;
  owned: boolean;
}

export interface WeaponItem extends Item {
  type: 'weapon';
  weaponCategory: WeaponCategory;
  ammoType?: string;
  projectile?: boolean;
}

export interface ArmorItem extends Item {
  type: 'armor';
  slot: ArmorSlot;
  setBonus?: string;
  armorClass?: WeaponCategory;
}

export interface AccessoryItem extends Item {
  type: 'accessory';
  slot: 'accessory';
  combinable?: boolean;
  materials?: string[];
}

export interface NPCItem extends Item {
  type: 'npc';
  unlockCondition: string;
  services?: string[];
  happiness?: {
    likes?: string[];
    dislikes?: string[];
    preferredBiome?: string;
  };
}

export interface BossItem extends Item {
  type: 'boss';
  health: number;
  summonItem?: string;
  drops: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'master';
}

/**
 * Union type representing any specific item type
 * Use this when you need to work with strongly-typed item variants
 */
export type AnyItem = WeaponItem | ArmorItem | AccessoryItem | NPCItem | BossItem;