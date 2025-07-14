/**
 * アイコン生成ユーティリティ
 * ブラウザ環境でSVGアイコンを動的に生成する
 */

// カテゴリ別SVGテンプレート
export const SVG_TEMPLATES = {
  'Weapons': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#1F2937" stroke="#374151" stroke-width="1"/>
    <path d="M6 26L26 6L24 4L22 6L8 20L6 22L4 24L6 26Z" fill="{{PRIMARY}}"/>
    <path d="M24 4L28 8L26 10L22 6L24 4Z" fill="{{SECONDARY}}"/>
    <circle cx="8" cy="24" r="2" fill="{{ACCENT}}"/>
  </svg>`,
  
  'Armor': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#1F2937" stroke="#374151" stroke-width="1"/>
    <path d="M16 4L20 8V12L28 16V24L16 28L4 24V16L12 12V8L16 4Z" fill="{{PRIMARY}}"/>
    <path d="M16 4L20 8L16 12L12 8L16 4Z" fill="{{SECONDARY}}"/>
    <path d="M12 8V12L4 16V20L16 24L28 20V16L20 12V8" stroke="{{ACCENT}}" stroke-width="1" fill="none"/>
  </svg>`,
  
  'Accessories': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#1F2937" stroke="#374151" stroke-width="1"/>
    <path d="M16 6L20 10L24 6L26 8L22 12L26 16L24 18L20 14L16 18L12 14L8 18L6 16L10 12L6 8L8 6L12 10L16 6Z" fill="{{PRIMARY}}"/>
    <circle cx="16" cy="12" r="2" fill="{{SECONDARY}}"/>
  </svg>`,
  
  'Consumables': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#1F2937" stroke="#374151" stroke-width="1"/>
    <path d="M12 4H20V8H22V24H20V28H12V24H10V8H12V4Z" fill="{{PRIMARY}}"/>
    <path d="M12 4H20V8H18V6H14V8H12V4Z" fill="{{SECONDARY}}"/>
    <path d="M14 10H18V22H14V10Z" fill="{{ACCENT}}"/>
    <circle cx="16" cy="16" r="1" fill="{{SECONDARY}}"/>
  </svg>`,
  
  'Collectibles': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#1F2937" stroke="#374151" stroke-width="1"/>
    <path d="M16 4L20 8L28 6L26 14L16 16L6 14L4 6L12 8L16 4Z" fill="{{PRIMARY}}"/>
    <path d="M16 4L20 8L16 12L12 8L16 4Z" fill="{{SECONDARY}}"/>
    <rect x="14" y="18" width="4" height="10" fill="{{PRIMARY}}"/>
    <rect x="12" y="26" width="8" height="2" fill="{{ACCENT}}"/>
  </svg>`,
  
  'NPCs': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#1F2937" stroke="#374151" stroke-width="1"/>
    <circle cx="16" cy="12" r="6" fill="{{PRIMARY}}"/>
    <path d="M8 24C8 20 11.5 18 16 18C20.5 18 24 20 24 24V28H8V24Z" fill="{{PRIMARY}}"/>
    <circle cx="14" cy="10" r="1" fill="#374151"/>
    <circle cx="18" cy="10" r="1" fill="#374151"/>
    <path d="M14 14C14 15 15 16 16 16C17 16 18 15 18 14" stroke="#374151" stroke-width="1" fill="none"/>
  </svg>`,
  
  'Bosses': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#1F2937" stroke="#374151" stroke-width="1"/>
    <circle cx="16" cy="16" r="10" fill="{{PRIMARY}}"/>
    <circle cx="12" cy="12" r="2" fill="#EF4444"/>
    <circle cx="20" cy="12" r="2" fill="#EF4444"/>
    <path d="M12 20C12 22 14 24 16 24C18 24 20 22 20 20" stroke="#374151" stroke-width="2" fill="none"/>
    <path d="M6 8L10 10L8 14L6 12L6 8Z" fill="{{PRIMARY}}"/>
    <path d="M26 8L22 10L24 14L26 12L26 8Z" fill="{{PRIMARY}}"/>
    <path d="M8 22L10 26L14 24L12 22L8 22Z" fill="{{PRIMARY}}"/>
    <path d="M24 22L22 26L18 24L20 22L24 22Z" fill="{{PRIMARY}}"/>
  </svg>`
};

// レア度別色のバリエーション
export const RARITY_COLORS = {
  'white': { primary: '#9CA3AF', secondary: '#D1D5DB', accent: '#6B7280' },
  'blue': { primary: '#60A5FA', secondary: '#93C5FD', accent: '#3B82F6' },
  'green': { primary: '#4ADE80', secondary: '#86EFAC', accent: '#10B981' },
  'orange': { primary: '#FB923C', secondary: '#FDBA74', accent: '#EA580C' },
  'red': { primary: '#F87171', secondary: '#FCA5A5', accent: '#DC2626' },
  'pink': { primary: '#F472B6', secondary: '#F9A8D4', accent: '#DB2777' },
  'yellow': { primary: '#FBBF24', secondary: '#FCD34D', accent: '#D97706' },
  'cyan': { primary: '#22D3EE', secondary: '#67E8F9', accent: '#0891B2' },
  'purple': { primary: '#A78BFA', secondary: '#C4B5FD', accent: '#7C3AED' }
};

/**
 * アイテムのSVGアイコンを動的に生成
 */
export function generateItemIcon(item: {
  category: string;
  rarity?: string;
}): string {
  const template = SVG_TEMPLATES[item.category as keyof typeof SVG_TEMPLATES] || SVG_TEMPLATES['Weapons'];
  const colors = RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS['white'];
  
  return template
    .replace(/\{\{PRIMARY\}\}/g, colors.primary)
    .replace(/\{\{SECONDARY\}\}/g, colors.secondary)
    .replace(/\{\{ACCENT\}\}/g, colors.accent);
}

/**
 * SVGをdata URIに変換
 */
export function svgToDataUri(svg: string): string {
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
}