#!/usr/bin/env tsx

/**
 * アクセサリーカテゴリ分析スクリプト
 * 2,933個のアクセサリーの内訳を詳細分析し、適切な分類を提案する
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '../src/data/real-data/curated-items.json');

import { type Item } from '../src/utils/itemValidation';

// 建材・ブロック系パターン
const BUILDING_PATTERNS = [
  /Block$/i, /Brick$/i, /Wall$/i, /Fence$/i, /Platform$/i,
  /Beam$/i, /Pillar$/i, /Stairs?$/i, /Door$/i, /Gate$/i,
  /Tile$/i, /Panel$/i, /Slab$/i, /Stone$/i, /Wood$/i,
  /Glass$/i, /Chair$/i, /Table$/i, /Bed$/i, /Chest$/i,
  /Bookcase$/i, /Lantern$/i, /Candle$/i, /Torch$/i
];

// ツール系パターン  
const TOOL_PATTERNS = [
  /Pickaxe$/i, /Drill$/i, /Hammer$/i, /Axe$/i, /Chainsaw$/i,
  /Hook$/i, /Rod$/i, /Net$/i, /Bucket$/i, /Wrench$/i
];

// 弾薬・消耗品パターン
const AMMO_PATTERNS = [
  /Arrow$/i, /Bullet$/i, /Dart$/i, /Rocket$/i, /Solution$/i,
  /Seed$/i, /Bait$/i, /Coin$/i, /Gel$/i, /Powder$/i,
  /Potion$/i, /Elixir$/i, /Flask$/i
];

// 装飾品パターン
const DECORATION_PATTERNS = [
  /Trophy$/i, /Banner$/i, /Painting$/i, /Statue$/i,
  /Music Box$/i, /Clock$/i, /Vase$/i, /Bowl$/i,
  /Chandelier$/i, /Campfire$/i, /Fountain$/i
];

// 材料・クラフト素材パターン
const MATERIAL_PATTERNS = [
  /Bar$/i, /Ore$/i, /Fragment$/i, /Essence$/i, /Crystal$/i,
  /Shard$/i, /Scale$/i, /Feather$/i, /Horn$/i, /Fang$/i,
  /Dust$/i, /Fabric$/i, /Thread$/i, /Wire$/i
];

function categorizeAccessory(item: Item): string {
  const name = item.name;
  
  // 建材・ブロック系
  if (BUILDING_PATTERNS.some(pattern => pattern.test(name))) {
    return 'Building/Blocks';
  }
  
  // ツール系
  if (TOOL_PATTERNS.some(pattern => pattern.test(name))) {
    return 'Tools';
  }
  
  // 弾薬・消耗品
  if (AMMO_PATTERNS.some(pattern => pattern.test(name))) {
    return 'Ammo/Consumables';
  }
  
  // 装飾品
  if (DECORATION_PATTERNS.some(pattern => pattern.test(name))) {
    return 'Decorations';
  }
  
  // 材料・素材
  if (MATERIAL_PATTERNS.some(pattern => pattern.test(name))) {
    return 'Materials';
  }
  
  // 真のアクセサリー（装身具）の特徴
  const subcategory = item.subcategory?.toLowerCase() || '';
  const subSubcategory = item.subSubcategory?.toLowerCase() || '';
  
  if (subcategory.includes('movement') || 
      subcategory.includes('combat') ||
      subcategory.includes('magic') ||
      name.includes('Boots') ||
      name.includes('Wings') ||
      name.includes('Emblem') ||
      name.includes('Ring') ||
      name.includes('Charm') ||
      name.includes('Amulet') ||
      name.includes('Band') ||
      name.includes('Shield') ||
      name.includes('Cloak') ||
      name.includes('Balloon') ||
      name.includes('Horseshoe') ||
      name.includes('Cloud in a Bottle')) {
    return 'True Accessory';
  }
  
  return 'Uncategorized';
}

async function main() {
  try {
    console.log('🔍 アクセサリーカテゴリの詳細分析を開始します...\n');
    
    const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
    const allItems: Item[] = JSON.parse(rawData);
    
    // アクセサリーのみ抽出
    const accessories = allItems.filter(item => item.category === 'Accessories');
    console.log(`📊 総アクセサリー数: ${accessories.length}\n`);
    
    // 分類分析
    const categorizedResults = accessories.reduce((acc, item) => {
      const suggestedCategory = categorizeAccessory(item);
      if (!acc[suggestedCategory]) {
        acc[suggestedCategory] = [];
      }
      acc[suggestedCategory].push(item);
      return acc;
    }, {} as Record<string, Item[]>);
    
    // 結果表示
    console.log('=== 分類分析結果 ===\n');
    
    for (const [category, items] of Object.entries(categorizedResults)) {
      console.log(`🏷️  ${category}: ${items.length}個`);
      
      // 各カテゴリの代表例を表示（最初の5個）
      const examples = items.slice(0, 5).map(item => item.name).join(', ');
      console.log(`   例: ${examples}${items.length > 5 ? '...' : ''}\n`);
    }
    
    // サブカテゴリ分析
    console.log('=== サブカテゴリ分析 ===\n');
    const subcategoryStats = accessories.reduce((acc, item) => {
      const sub = item.subcategory || 'No Subcategory';
      acc[sub] = (acc[sub] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    for (const [sub, count] of Object.entries(subcategoryStats).sort((a, b) => b[1] - a[1])) {
      console.log(`${sub}: ${count}個`);
    }
    
    // 詳細レポート保存
    const report = generateDetailedReport(categorizedResults, subcategoryStats);
    const reportPath = path.join(__dirname, '../accessory-analysis-report.txt');
    fs.writeFileSync(reportPath, report);
    console.log(`\n📝 詳細レポートを保存しました: ${reportPath}`);
    
    // 提案
    console.log('\n=== 推奨アクション ===');
    const trueAccessories = categorizedResults['True Accessory']?.length || 0;
    console.log(`✅ 真のアクセサリー: ${trueAccessories}個 (適切)`);
    
    const problemCategories = Object.entries(categorizedResults)
      .filter(([category]) => category !== 'True Accessory')
      .sort((a, b) => b[1].length - a[1].length);
    
    for (const [category, items] of problemCategories) {
      console.log(`⚠️  ${category}: ${items.length}個 → 別カテゴリに移動推奨`);
    }
    
  } catch (error) {
    console.error('❌ 分析中にエラーが発生しました:', error);
    process.exit(1);
  }
}

function generateDetailedReport(
  categorizedResults: Record<string, Item[]>,
  subcategoryStats: Record<string, number>
): string {
  let report = '=== アクセサリーカテゴリ詳細分析レポート ===\n\n';
  
  report += '1. 分類別アイテム数:\n';
  for (const [category, items] of Object.entries(categorizedResults)) {
    report += `   ${category}: ${items.length}個\n`;
  }
  
  report += '\n2. サブカテゴリ統計:\n';
  for (const [sub, count] of Object.entries(subcategoryStats).sort((a, b) => b[1] - a[1])) {
    report += `   ${sub}: ${count}個\n`;
  }
  
  report += '\n3. 移動候補アイテム詳細:\n\n';
  
  for (const [category, items] of Object.entries(categorizedResults)) {
    if (category === 'True Accessory') continue;
    
    report += `### ${category} (${items.length}個)\n`;
    for (const item of items.slice(0, 20)) { // 最初の20個
      report += `- ${item.name} (ID: ${item.id})\n`;
    }
    if (items.length > 20) {
      report += `... および${items.length - 20}個の追加アイテム\n`;
    }
    report += '\n';
  }
  
  return report;
}

if (require.main === module) {
  main();
}