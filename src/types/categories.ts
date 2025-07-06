// Category definitions for Terraria items

export interface CategoryDefinition {
  id: string;
  name: string;
  description?: string;
  subcategories?: CategoryDefinition[];
}

export interface WeaponCategories {
  melee: {
    swords: {
      shortswords: string[];
      broadswords: string[];
    };
    spears: string[];
    flails: string[];
    yoyos: string[];
    other: string[];
  };
  ranged: {
    bows: string[];
    repeaters: string[];
    guns: string[];
    launchers: string[];
    consumable: string[];
  };
  magic: {
    staves: string[];
    tomes: string[];
    other: string[];
  };
  summoner: {
    minions: string[];
    sentries: string[];
  };
}

export interface ArmorCategories {
  head: {
    melee: string[];
    ranged: string[];
    magic: string[];
    summoner: string[];
  };
  chest: string[];
  legs: string[];
}

export interface AccessoryCategories {
  movement: {
    wings: string[];
    boots: string[];
    hooks: string[];
  };
  combat: {
    emblems: string[];
    shields: string[];
    necklaces: string[];
  };
  utility: {
    informational: string[];
    light: string[];
    building: string[];
  };
  special: {
    balloons: string[];
    clouds: string[];
    counterweights: string[];
  };
}

export interface NPCCategories {
  merchants: string[];
  craftsmen: string[];
  combat: string[];
  event: string[];
}

export interface BossCategories {
  pre_hardmode: string[];
  hardmode: string[];
  event: string[];
}

export interface AllCategories {
  weapons: WeaponCategories;
  armor: ArmorCategories;
  accessories: AccessoryCategories;
  npcs: NPCCategories;
  bosses: BossCategories;
}