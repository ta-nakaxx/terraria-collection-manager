// Core item types for Terraria Collection Manager

// Core item types for collection management
// Note: This is extensible - new types can be added without breaking existing code
export type ItemType = 
  | 'weapon' 
  | 'armor' 
  | 'accessory' 
  | 'tool' 
  | 'material' 
  | 'consumable' 
  | 'building' 
  | 'ammunition'
  | 'furniture'     // New: Chairs, tables, decorations
  | 'vanity'        // New: Costume sets, dyes
  | 'storage'       // New: Chests, safes, containers
  | 'lighting'      // New: Torches, lanterns
  | 'mechanism'     // New: Wires, switches (future)
  | 'novelty'       // New: Easter eggs, dev items (future)
  | 'key'           // New: Quest items, permanent unlocks (future)
  | 'npc' 
  | 'boss';

// Collection behavior types - extensible for priority levels
export type CollectionType = 'collectible' | 'reference' | 'achievement'; // Achievement added for future

// Game progression stages - extensible for modded content
export type GameStage = 'pre-hardmode' | 'hardmode' | 'post-plantera' | 'post-golem' | 'endgame' | 'event';

// Difficulty exclusives - for Expert/Master mode items
export type DifficultyMode = 'classic' | 'expert' | 'master' | 'journey';

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
/**
 * Base item interface with extensible design
 * New properties can be added without breaking existing items
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
  collectionType: CollectionType;
  
  // Extensibility fields - optional for backward compatibility
  tags?: string[];                    // Future: For multi-category items
  difficultyMode?: DifficultyMode;    // Future: Expert/Master exclusive
  eventExclusive?: string;            // Future: Halloween, Christmas, etc.
  priority?: 'high' | 'medium' | 'low'; // Future: Collection importance
  modSource?: string;                 // Future: Mod compatibility
  version?: string;                   // Future: Version added
  
  // Custom properties can be added via this extensible object
  metadata?: Record<string, unknown>;
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

export interface ToolItem extends Item {
  type: 'tool';
  toolType: 'mining' | 'building' | 'utility';
  power?: number;
  range?: number;
}

export interface MaterialItem extends Item {
  type: 'material';
  materialType: 'ore' | 'bar' | 'gem' | 'wood' | 'other';
  stack?: number;
}

export interface ConsumableItem extends Item {
  type: 'consumable';
  consumableType: 'potion' | 'food' | 'summoning' | 'other';
  effect?: string;
  duration?: number;
}

export interface BuildingItem extends Item {
  type: 'building';
  buildingType: 'block' | 'wall' | 'furniture' | 'crafting_station' | 'decoration';
  placeable: boolean;
}

export interface AmmunitionItem extends Item {
  type: 'ammunition';
  ammunitionType: 'arrow' | 'bullet' | 'rocket' | 'other';
  damage?: number;
  special?: string;
}

export interface FurnitureItem extends Item {
  type: 'furniture';
  furnitureType: 'seating' | 'surface' | 'crafting_station' | 'storage' | 'decoration' | 'door' | 'other';
  placeable: boolean;
  functional?: boolean;
}

export interface VanityItem extends Item {
  type: 'vanity';
  vanityType: 'head' | 'body' | 'legs' | 'dye' | 'hair_dye' | 'costume' | 'other';
  slot?: 'social' | 'dye_slot';
  setName?: string; // For costume sets
}

export interface StorageItem extends Item {
  type: 'storage';
  storageType: 'chest' | 'safe' | 'piggy_bank' | 'void_bag' | 'other';
  capacity?: number;
  special?: string;
}

export interface LightingItem extends Item {
  type: 'lighting';
  lightingType: 'torch' | 'lantern' | 'candle' | 'glowstick' | 'other';
  lightLevel?: number;
  duration?: number; // For temporary lighting
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
 * This is extensible - new item types can be added here
 */
export type AnyItem = 
  | WeaponItem 
  | ArmorItem 
  | AccessoryItem 
  | ToolItem 
  | MaterialItem 
  | ConsumableItem 
  | BuildingItem 
  | AmmunitionItem 
  | FurnitureItem 
  | VanityItem 
  | StorageItem 
  | LightingItem 
  | NPCItem 
  | BossItem;