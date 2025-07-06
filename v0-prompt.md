# Terraria Collection Manager Dashboard - v0 Prompt

## Overview
Create a clean, minimal dashboard for a Terraria collection management application. The dashboard helps players track their item collection progress across weapons, armor, accessories, NPCs, and bosses.

## Layout Requirements

### **Main Layout (3-column design)**
- **Left sidebar (1/4 width)**: Category navigation tabs
- **Center area (1/2 width)**: Item grid/list view 
- **Right sidebar (1/4 width)**: Item details panel (alternatively, use modal popups)
- **Top area**: Progress bar and search functionality

### **Left Sidebar - Category Navigation**
```
Categories to include:
- Weapons (with subcategories: Melee, Ranged, Magic, Summoner)
- Armor (with subcategories: Head, Chest, Legs)  
- Accessories (with subcategories: Movement, Combat, Utility)
- NPCs (with subcategories: Merchants, Craftsmen, Combat)
- Bosses (with subcategories: Pre-Hardmode, Hardmode, Event)
```

### **Center Area - Item Display**
- Grid layout showing item cards
- Each item card contains:
  - Item icon/image placeholder
  - Item name
  - Category badge
  - Owned/Not Owned status (visual distinction)
- Filtering and sorting options
- Search functionality

### **Right Sidebar/Modal - Item Details**
- Item name and large icon
- Detailed stats (damage, defense, effects, etc.)
- Acquisition method (drop, craft, purchase, etc.)
- Game stage information (Pre-Hardmode/Hardmode)
- Item rarity indicator
- Mark as owned/not owned toggle

### **Progress Bar**
- Overall collection progress
- Category-specific progress
- Positioned where it fits naturally in the design

## Design Guidelines

### **Visual Style**
- **Color scheme**: Monochrome/grayscale base (white, gray, black)
- **Accent colors**: Minimal use, only for status indicators and progress
- **Typography**: Clean, readable sans-serif fonts
- **Spacing**: Generous whitespace, clean margins and padding

### **Icons**
- **Category icons**: Simple line art, not colorful
- **UI icons**: Minimalist outline style (search, filter, settings, etc.)
- **Item icons**: Placeholder squares (actual Terraria icons will be added later)

### **Interactive States**
- **Owned items**: Full color, normal opacity
- **Not owned items**: Grayscale/reduced opacity
- **Hover states**: Subtle highlighting
- **Active category**: Clear visual indication

## Sample Data Structure
```typescript
interface Item {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory' | 'npc' | 'boss';
  category: string;
  rarity: 'white' | 'blue' | 'green' | 'orange' | 'red' | 'purple';
  iconPath: string;
  acquisition: string[];
  stats?: {
    damage?: number;
    defense?: number;
    effects?: string[];
  };
  description?: string;
  gameStage: 'pre-hardmode' | 'hardmode';
}
```

## Sample Items for Display
```
Weapons:
- Copper Shortsword (Sword, White rarity, Pre-Hardmode)
- Wooden Bow (Bow, White rarity, Pre-Hardmode)
- Wand of Sparking (Magic Staff, White rarity, Pre-Hardmode)

Armor:
- Copper Helmet (Head armor, White rarity, Pre-Hardmode)
- Copper Chainmail (Chest armor, White rarity, Pre-Hardmode)

Accessories:
- Band of Regeneration (Necklace, Blue rarity, Pre-Hardmode)

NPCs:
- Guide (Craftsman, Always available)

Bosses:
- Eye of Cthulhu (Pre-Hardmode boss, Easy difficulty)
```

## Functionality to Implement
1. **Category filtering**: Click category to filter items
2. **Item status toggle**: Click item to mark owned/not owned
3. **Search functionality**: Filter items by name
4. **Progress tracking**: Show completion percentage
5. **Item details**: Show detailed info on click
6. **Responsive behavior**: Works well on different screen sizes

## Technical Notes
- Use React/Next.js components
- Implement with TypeScript
- Use Tailwind CSS for styling
- State management with React hooks
- Local storage for persistence (not needed in v0, just UI)

## Priority Components
1. **Main Dashboard Layout** (highest priority)
2. **Item Card Component** 
3. **Category Sidebar**
4. **Progress Bar Component**
5. **Item Details Modal/Panel**

Please create modern, clean React components with Tailwind CSS that embody these requirements. Focus on the overall layout and visual hierarchy first, then add interactive details.