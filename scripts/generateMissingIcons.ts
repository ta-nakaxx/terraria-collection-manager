#!/usr/bin/env tsx

/**
 * 不足アイコンの自動生成スクリプト
 * データベース内の全アイテムに対してプレースホルダーアイコンを生成する
 */

import * as fs from 'fs';
import * as path from 'path';
import { type Item } from '../src/utils/itemValidation';

const DATA_PATH = path.join(__dirname, '../src/data/real-data/curated-items.json');
const ICONS_BASE_PATH = path.join(__dirname, '../public/assets/icons');

// カテゴリ別SVGテンプレート
const SVG_TEMPLATES = {
  'Weapons': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#1F2937" stroke="#374151" stroke-width="1"/>
    <path d="M6 26L26 6L24 4L22 6L8 20L6 22L4 24L6 26Z" fill="#9CA3AF"/>
    <path d="M24 4L28 8L26 10L22 6L24 4Z" fill="#D1D5DB"/>
    <circle cx="8" cy="24" r="2" fill="#6B7280"/>
  </svg>`,
  
  'Armor': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#1F2937" stroke="#374151" stroke-width="1"/>
    <path d="M16 4L20 8V12L28 16V24L16 28L4 24V16L12 12V8L16 4Z" fill="#9CA3AF"/>
    <path d="M16 4L20 8L16 12L12 8L16 4Z" fill="#D1D5DB"/>
    <path d="M12 8V12L4 16V20L16 24L28 20V16L20 12V8" stroke="#6B7280" stroke-width="1" fill="none"/>
  </svg>`,
  
  'Accessories': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#1F2937" stroke="#374151" stroke-width="1"/>
    <path d="M16 6L20 10L24 6L26 8L22 12L26 16L24 18L20 14L16 18L12 14L8 18L6 16L10 12L6 8L8 6L12 10L16 6Z" fill="#9CA3AF"/>
    <circle cx="16" cy="12" r="2" fill="#D1D5DB"/>
  </svg>`,
  
  'Consumables': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#1F2937" stroke="#374151" stroke-width="1"/>
    <path d="M12 4H20V8H22V24H20V28H12V24H10V8H12V4Z" fill="#9CA3AF"/>
    <path d="M12 4H20V8H18V6H14V8H12V4Z" fill="#D1D5DB"/>
    <path d="M14 10H18V22H14V10Z" fill="#6B7280"/>
    <circle cx="16" cy="16" r="1" fill="#D1D5DB"/>
  </svg>`,
  
  'Collectibles': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#1F2937" stroke="#374151" stroke-width="1"/>
    <path d="M16 4L20 8L28 6L26 14L16 16L6 14L4 6L12 8L16 4Z" fill="#9CA3AF"/>
    <path d="M16 4L20 8L16 12L12 8L16 4Z" fill="#D1D5DB"/>
    <rect x="14" y="18" width="4" height="10" fill="#9CA3AF"/>
    <rect x="12" y="26" width="8" height="2" fill="#6B7280"/>
  </svg>`,
  
  'NPCs': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#1F2937" stroke="#374151" stroke-width="1"/>
    <circle cx="16" cy="12" r="6" fill="#9CA3AF"/>
    <path d="M8 24C8 20 11.5 18 16 18C20.5 18 24 20 24 24V28H8V24Z" fill="#9CA3AF"/>
    <circle cx="14" cy="10" r="1" fill="#374151"/>
    <circle cx="18" cy="10" r="1" fill="#374151"/>
    <path d="M14 14C14 15 15 16 16 16C17 16 18 15 18 14" stroke="#374151" stroke-width="1" fill="none"/>
  </svg>`,
  
  'Bosses': `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" fill="#1F2937" stroke="#374151" stroke-width="1"/>
    <circle cx="16" cy="16" r="10" fill="#9CA3AF"/>
    <circle cx="12" cy="12" r="2" fill="#EF4444"/>
    <circle cx="20" cy="12" r="2" fill="#EF4444"/>
    <path d="M12 20C12 22 14 24 16 24C18 24 20 22 20 20" stroke="#374151" stroke-width="2" fill="none"/>
    <path d="M6 8L10 10L8 14L6 12L6 8Z" fill="#9CA3AF"/>
    <path d="M26 8L22 10L24 14L26 12L26 8Z" fill="#9CA3AF"/>
    <path d="M8 22L10 26L14 24L12 22L8 22Z" fill="#9CA3AF"/>
    <path d="M24 22L22 26L18 24L20 22L24 22Z" fill="#9CA3AF"/>
  </svg>`
};

// レア度別色のバリエーション（SVGの色を動的に変更するため）
const RARITY_COLORS = {
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

async function main() {
  try {
    console.log('🎨 不足アイコンの自動生成を開始します...\n');
    
    // データ読み込み
    const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
    const items: Item[] = JSON.parse(rawData);
    
    console.log(`📊 総アイテム数: ${items.length}`);
    
    let generated = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const item of items) {
      try {
        // 既存のアイコンをチェック
        const fullIconPath = path.join(process.cwd(), 'public', item.iconPath);
        
        if (fs.existsSync(fullIconPath)) {
          skipped++;
          continue;
        }
        
        // ディレクトリが存在しない場合は作成
        const iconDir = path.dirname(fullIconPath);
        if (!fs.existsSync(iconDir)) {
          fs.mkdirSync(iconDir, { recursive: true });
        }
        
        // SVGテンプレートを取得
        const template = SVG_TEMPLATES[item.category as keyof typeof SVG_TEMPLATES] || SVG_TEMPLATES['Weapons'];
        
        // レア度に基づいて色を調整
        const colors = RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS['white'];
        let svgContent = template
          .replace(/#9CA3AF/g, colors.primary)
          .replace(/#D1D5DB/g, colors.secondary)
          .replace(/#6B7280/g, colors.accent);
        
        // ファイル拡張子に基づいて保存
        const ext = path.extname(fullIconPath).toLowerCase();
        
        if (ext === '.svg') {
          // SVGとして保存
          fs.writeFileSync(fullIconPath, svgContent);
        } else {
          // PNGとして保存（SVGを一旦保存してから後でPNGに変換することも可能）
          // 今回は簡単のため、SVGファイルとして保存し、拡張子のみ変更
          const svgPath = fullIconPath.replace(/\.(png|jpg|jpeg)$/, '.svg');
          fs.writeFileSync(svgPath, svgContent);
          
          // 元のPNGパスにもSVGコンテンツを保存（Next.jsが読み込めるように）
          fs.writeFileSync(fullIconPath, svgContent);
        }
        
        generated++;
        
        if (generated % 100 === 0) {
          console.log(`✅ ${generated}個のアイコンを生成しました...`);
        }
        
      } catch (error) {
        console.error(`❌ ${item.name} (ID: ${item.id}) のアイコン生成に失敗:`, error);
        errors++;
      }
    }
    
    console.log('\n=== アイコン生成結果 ===');
    console.log(`✅ 生成: ${generated}個`);
    console.log(`⏭️  スキップ（既存）: ${skipped}個`);
    console.log(`❌ エラー: ${errors}個`);
    console.log(`📊 合計: ${generated + skipped + errors}個`);
    
    const successRate = ((generated + skipped) / items.length * 100).toFixed(1);
    console.log(`🎯 成功率: ${successRate}%`);
    
  } catch (error) {
    console.error('❌ アイコン生成中にエラーが発生しました:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}