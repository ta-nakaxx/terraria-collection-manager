// V0 data adapted to our project structure
import { Item, Category } from '@/types';

/**
 * 5つの主要カテゴリに絞り込んだ構成
 * Weapons, Armor, Accessories, NPCs, Bosses のみ
 */
export const categories: Category[] = [
  {
    id: "weapons",
    name: "Weapons",
    type: "weapon",
    subcategories: ["Melee", "Ranged", "Magic", "Summoner"],
    collectionType: "collectible",
    order: 1,
    icon: "⚔️",
    expandable: true
  },
  {
    id: "armor",
    name: "Armor",
    type: "armor",
    subcategories: ["Head", "Chest", "Legs"],
    collectionType: "collectible",
    order: 2,
    icon: "🛡️",
    expandable: true
  },
  {
    id: "accessories",
    name: "Accessories",
    type: "accessory",
    subcategories: ["Movement", "Health", "Permanent", "Combat", "Utility"],
    collectionType: "collectible",
    order: 3,
    icon: "💍",
    expandable: true
  },
  {
    id: "npcs",
    name: "NPCs",
    type: "npc",
    subcategories: ["Helper", "Vendor", "Service"],
    collectionType: "reference",
    order: 4,
    icon: "👤",
    expandable: true
  },
  {
    id: "bosses",
    name: "Bosses",
    type: "boss",
    subcategories: ["Pre-Hardmode", "Hardmode", "Event"],
    collectionType: "reference",
    order: 5,
    icon: "👹",
    expandable: true
  }
];

export const v0Items: Item[] = [
  // Weapons - Melee
  {
    id: "copper-shortsword",
    name: "Copper Shortsword",
    type: "weapon",
    category: "Weapons",
    subcategory: "Melee",
    subSubcategory: "Sword",
    rarity: "white",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["Craft"],
    stats: { damage: 5 },
    description: "A basic copper sword.",
    gameStage: "pre-hardmode",
    owned: true,
    collectionType: "collectible"
  },
  {
    id: "enchanted-sword",
    name: "Enchanted Sword",
    type: "weapon",
    category: "Weapons",
    subcategory: "Melee",
    subSubcategory: "Sword",
    rarity: "blue",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["Rare chest", "World generation"],
    stats: { damage: 24 },
    description: "A magical sword that shoots projectiles.",
    gameStage: "pre-hardmode",
    owned: true,
    collectionType: "collectible"
  },
  {
    id: "terra-blade",
    name: "Terra Blade",
    type: "weapon",
    category: "Weapons",
    subcategory: "Melee",
    rarity: "green",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["Craft"],
    stats: { damage: 95 },
    description: "A powerful endgame sword.",
    gameStage: "hardmode",
    owned: false,
    collectionType: "collectible"
  },
  {
    id: "meowmere",
    name: "Meowmere",
    type: "weapon",
    category: "Weapons",
    subcategory: "Melee",
    rarity: "red",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["Moon Lord drop"],
    stats: { damage: 200 },
    description: "The ultimate cat sword.",
    gameStage: "hardmode",
    owned: false,
    collectionType: "collectible"
  },
  // Weapons - Ranged
  {
    id: "wooden-bow",
    name: "Wooden Bow",
    type: "weapon",
    category: "Weapons",
    subcategory: "Ranged",
    subSubcategory: "Bow",
    rarity: "white",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["Craft"],
    stats: { damage: 4 },
    description: "A simple wooden bow.",
    gameStage: "pre-hardmode",
    owned: false,
    collectionType: "collectible"
  },
  {
    id: "demon-bow",
    name: "Demon Bow",
    type: "weapon",
    category: "Weapons",
    subcategory: "Ranged",
    rarity: "blue",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["Drop"],
    stats: { damage: 14 },
    description: "A bow infused with demonic power.",
    gameStage: "pre-hardmode",
    owned: true,
    collectionType: "collectible"
  },
  // Weapons - Magic
  {
    id: "wand-of-sparking",
    name: "Wand of Sparking",
    type: "weapon",
    category: "Weapons",
    subcategory: "Magic",
    subSubcategory: "Wand",
    rarity: "white",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["Chest"],
    stats: { damage: 8 },
    description: "A magical wand that shoots sparks.",
    gameStage: "pre-hardmode",
    owned: true,
    collectionType: "collectible"
  },
  {
    id: "diamond-staff",
    name: "Diamond Staff",
    type: "weapon",
    category: "Weapons",
    subcategory: "Magic",
    rarity: "white",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["Craft"],
    stats: { damage: 23 },
    description: "A staff made from diamond gems.",
    gameStage: "pre-hardmode",
    owned: true,
    collectionType: "collectible"
  },
  // Armor
  {
    id: "copper-helmet",
    name: "Copper Helmet",
    type: "armor",
    category: "Armor",
    subcategory: "Head",
    subSubcategory: "Helmet",
    rarity: "white",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["Craft"],
    stats: { defense: 1 },
    description: "Basic copper head protection.",
    gameStage: "pre-hardmode",
    owned: true,
    collectionType: "collectible"
  },
  {
    id: "iron-chainmail",
    name: "Iron Chainmail",
    type: "armor",
    category: "Armor",
    subcategory: "Chest",
    rarity: "white",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["Craft"],
    stats: { defense: 3 },
    description: "Sturdy iron chest protection.",
    gameStage: "pre-hardmode",
    owned: true,
    collectionType: "collectible"
  },
  // Accessories
  {
    id: "band-of-regeneration",
    name: "Band of Regeneration",
    type: "accessory",
    category: "Accessories",
    subcategory: "Utility",
    subSubcategory: "Ring",
    rarity: "blue",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["Chest", "Drop"],
    stats: { effects: ["Slowly regenerates health"] },
    description: "Slowly regenerates the player's health.",
    gameStage: "pre-hardmode",
    owned: true,
    collectionType: "collectible"
  },
  {
    id: "hermes-boots",
    name: "Hermes Boots",
    type: "accessory",
    category: "Accessories",
    subcategory: "Movement",
    rarity: "blue",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["Chest"],
    stats: { effects: ["Increased movement speed"] },
    description: "Allows the player to run super fast.",
    gameStage: "pre-hardmode",
    owned: false,
    collectionType: "collectible"
  },
  // NPCs
  {
    id: "guide",
    name: "Guide",
    type: "npc",
    category: "NPCs",
    subcategory: "Craftsmen",
    rarity: "white",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["Always available"],
    description: "Provides helpful tips and crafting recipes.",
    gameStage: "pre-hardmode",
    owned: true,
    collectionType: "reference"
  },
  {
    id: "merchant",
    name: "Merchant",
    type: "npc",
    category: "NPCs",
    subcategory: "Merchants",
    rarity: "white",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["50 silver coins"],
    description: "Sells basic items and tools.",
    gameStage: "pre-hardmode",
    owned: false,
    collectionType: "reference"
  },
  // Bosses
  {
    id: "eye-of-cthulhu",
    name: "Eye of Cthulhu",
    type: "boss",
    category: "Bosses",
    subcategory: "Pre-Hardmode",
    rarity: "orange",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["Summon", "Natural spawn"],
    stats: { damage: 15 },
    description: "A giant eyeball that serves as one of the first bosses.",
    gameStage: "pre-hardmode",
    owned: false,
    collectionType: "reference"
  },
  {
    id: "wall-of-flesh",
    name: "Wall of Flesh",
    type: "boss",
    category: "Bosses",
    subcategory: "Pre-Hardmode",
    rarity: "red",
    iconPath: "/placeholder.svg?height=64&width=64",
    acquisition: ["Drop Guide Voodoo Doll in lava"],
    stats: { damage: 50 },
    description: "The final pre-hardmode boss.",
    gameStage: "pre-hardmode",
    owned: false,
    collectionType: "reference"
  },
];