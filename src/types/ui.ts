// UI-specific types for v0 integration

import { ItemType, CollectionType } from './items';

/**
 * Extensible category interface for UI navigation
 * New item types are automatically supported through ItemType import
 */
export interface Category {
  id: string;
  name: string;
  type: ItemType; // Uses the extensible ItemType from items.ts
  subcategories: string[];
  collectionType: CollectionType;
  
  // Extensibility fields
  icon?: string;              // Future: Category icons
  description?: string;       // Future: Category descriptions
  order?: number;            // Future: Custom ordering
  hidden?: boolean;          // Future: Hide categories conditionally
  expandable?: boolean;      // Future: Collapsible subcategories
  metadata?: Record<string, unknown>; // Future: Custom properties
}

/**
 * Dynamic category configuration system
 * Allows for runtime category management without code changes
 */
export interface CategoryConfig {
  categories: Category[];
  displayMode: 'grid' | 'list' | 'tree';
  grouping: 'type' | 'collection' | 'custom';
  filters: FilterConfig[];
}

export interface FilterConfig {
  id: string;
  name: string;
  type: 'select' | 'multiselect' | 'toggle' | 'range';
  field: keyof import('./items').Item; // Automatically stays in sync with Item interface
  options?: Array<{ value: string; label: string }>;
  defaultValue?: unknown;
}