// UI-specific types for v0 integration

export interface Category {
  id: string;
  name: string;
  type: "weapon" | "armor" | "accessory" | "npc" | "boss";
  subcategories: string[];
}