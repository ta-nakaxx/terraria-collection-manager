#!/usr/bin/env tsx

/**
 * アクセサリー分類修正スクリプト
 * 誤分類されたアイテムを適切なカテゴリに移動する
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '../src/data/real-data/curated-items.json');

import { type Item } from '../src/utils/itemValidation';

interface ModificationResults {
  keep: Item[];
  moveToConsumables: Item[];
  moveToCollectibles: Item[];
  delete: Item[];
}

// 装飾品パターン（Collectiblesに移動）
const DECORATION_PATTERNS = [
  /Trophy$/i, /Banner$/i, /Painting$/i, /Statue$/i,
  /Music Box/i, /Clock$/i, /Vase$/i, /Bowl$/i,
  /Chandelier$/i, /Campfire$/i, /Fountain$/i
];

// 弾薬・消耗品パターン（Consumablesに移動）
const CONSUMABLE_PATTERNS = [
  /Arrow$/i, /Bullet$/i, /Dart$/i, /Rocket$/i, /Solution$/i,
  /Potion$/i, /Elixir$/i, /Flask$/i, /Seed$/i, /Gel$/i
];

// 削除対象パターン（建材・ツール・素材）
const DELETE_PATTERNS = [
  // 建材・ブロック
  /Block$/i, /Brick$/i, /Wall$/i, /Fence$/i, /Platform$/i,
  /Beam$/i, /Pillar$/i, /Stairs?$/i, /Door$/i, /Gate$/i,
  /Tile$/i, /Panel$/i, /Slab$/i, /Wood$/i, /Stone$/i,
  /Glass$/i, /Chair$/i, /Table$/i, /Bed$/i, /Chest$/i,
  /Bookcase$/i, /Lantern$/i, /Candle$/i, /Torch$/i,
  
  // ツール
  /Pickaxe$/i, /Drill$/i, /Hammer$/i, /Axe$/i, /Chainsaw$/i,
  /Hook$/i, /Rod$/i, /Net$/i, /Bucket$/i, /Wrench$/i,
  
  // 素材
  /Bar$/i, /Ore$/i, /Fragment$/i, /Essence$/i, /Shard$/i,
  /Scale$/i, /Feather$/i, /Horn$/i, /Fang$/i, /Dust$/i,
  /Fabric$/i, /Thread$/i, /Wire$/i
];

// 真のアクセサリーパターン
const TRUE_ACCESSORY_PATTERNS = [
  /Boots$/i, /Wings$/i, /Emblem$/i, /Ring$/i, /Charm$/i,
  /Amulet$/i, /Band$/i, /Shield$/i, /Cloak$/i, /Balloon$/i,
  /Horseshoe$/i, /Cloud in a Bottle/i, /Mirror$/i, /Watch$/i,
  /Meter$/i, /Compass$/i
];

function categorizeAccessoryItem(item: Item): 'keep' | 'move-to-consumables' | 'move-to-collectibles' | 'delete' {
  const name = item.name;
  
  // 装飾品 → Collectibles
  if (DECORATION_PATTERNS.some(pattern => pattern.test(name))) {
    return 'move-to-collectibles';
  }
  
  // 消耗品 → Consumables  
  if (CONSUMABLE_PATTERNS.some(pattern => pattern.test(name))) {
    return 'move-to-consumables';
  }
  
  // 削除対象（建材・ツール・素材）
  if (DELETE_PATTERNS.some(pattern => pattern.test(name))) {
    return 'delete';
  }
  
  // 真のアクセサリー → keep
  if (TRUE_ACCESSORY_PATTERNS.some(pattern => pattern.test(name)) ||
      item.subcategory === 'Movement' ||
      item.subcategory === 'Combat' ||
      item.subSubcategory === 'emblem') {
    return 'keep';
  }
  
  // その他の情報系アイテム → keep（後で詳細分析）
  return 'keep';
}

async function main() {
  try {
    console.log('🔧 アクセサリー分類の修正を開始します...\n');
    
    const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
    const allItems: Item[] = JSON.parse(rawData);
    
    console.log(`📊 総アイテム数: ${allItems.length}`);
    
    // アクセサリーのみ抽出
    const accessories = allItems.filter(item => item.category === 'Accessories');
    const nonAccessories = allItems.filter(item => item.category !== 'Accessories');
    
    console.log(`📊 現在のアクセサリー数: ${accessories.length}\n`);
    
    // 分類処理
    const results: ModificationResults = {
      keep: [],
      moveToConsumables: [],
      moveToCollectibles: [],
      delete: []
    };
    
    for (const item of accessories) {
      const action = categorizeAccessoryItem(item);
      
      switch (action) {
        case 'keep':
          results.keep.push(item);
          break;
        case 'move-to-consumables':
          const consumableItem = {
            ...item,
            type: 'consumable',
            category: 'Consumables',
            subcategory: item.name.includes('Arrow') || item.name.includes('Bullet') ? 'Ammo' : 'Items',
            iconPath: item.iconPath.replace('/accessories/', '/consumables/')
          };
          results.moveToConsumables.push(consumableItem);
          break;
        case 'move-to-collectibles':
          const collectibleItem = {
            ...item,
            type: 'collectible',
            category: 'Collectibles',
            subcategory: item.name.includes('Trophy') ? 'Trophies' : 
                        item.name.includes('Banner') ? 'Banners' : 
                        item.name.includes('Statue') ? 'Statues' : 'Decorations',
            iconPath: item.iconPath.replace('/accessories/', '/collectibles/')
          };
          results.moveToCollectibles.push(collectibleItem);
          break;
        case 'delete':
          results.delete.push(item);
          break;
      }
    }
    
    // 結果表示
    console.log('=== 分類修正結果 ===\n');
    console.log(`✅ 保持（真のアクセサリー）: ${results.keep.length}個`);
    console.log(`🔄 Consumablesに移動: ${results.moveToConsumables.length}個`);
    console.log(`🔄 Collectiblesに移動: ${results.moveToCollectibles.length}個`);
    console.log(`🗑️  削除（建材・ツール等）: ${results.delete.length}個\n`);
    
    // 新しいデータセット構築
    const newItems = [
      ...nonAccessories,
      ...results.keep,
      ...results.moveToConsumables,
      ...results.moveToCollectibles
      // results.deleteは除外
    ];
    
    console.log(`📊 修正後総アイテム数: ${newItems.length} (削除: ${results.delete.length}個)\n`);
    
    // カテゴリ別統計
    const categoryStats = newItems.reduce((stats, item) => {
      stats[item.category] = (stats[item.category] || 0) + 1;
      return stats;
    }, {} as Record<string, number>);
    
    console.log('=== 修正後カテゴリ統計 ===');
    for (const [category, count] of Object.entries(categoryStats)) {
      console.log(`${category}: ${count}個`);
    }
    
    // 確認プロンプト
    console.log('\n=== 削除対象アイテム例 ===');
    results.delete.slice(0, 10).forEach(item => {
      console.log(`- ${item.name} (ID: ${item.id})`);
    });
    if (results.delete.length > 10) {
      console.log(`... および${results.delete.length - 10}個の追加アイテム`);
    }
    
    // バックアップ作成
    const backupPath = DATA_PATH + '.backup-' + Date.now();
    fs.writeFileSync(backupPath, rawData);
    console.log(`\n💾 バックアップ作成: ${backupPath}`);
    
    // 新しいデータを保存
    fs.writeFileSync(DATA_PATH, JSON.stringify(newItems, null, 2));
    console.log(`✅ 修正されたデータを保存しました: ${DATA_PATH}`);
    
    // レポート保存
    const report = generateModificationReport(results, categoryStats);
    const reportPath = path.join(__dirname, '../accessory-fix-report.txt');
    fs.writeFileSync(reportPath, report);
    console.log(`📝 修正レポートを保存: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ 修正中にエラーが発生しました:', error);
    process.exit(1);
  }
}

function generateModificationReport(
  results: ModificationResults,
  categoryStats: Record<string, number>
): string {
  let report = '=== アクセサリー分類修正レポート ===\n\n';
  
  report += '1. 修正結果サマリー:\n';
  report += `   保持（真のアクセサリー）: ${results.keep.length}個\n`;
  report += `   Consumablesに移動: ${results.moveToConsumables.length}個\n`;
  report += `   Collectiblesに移動: ${results.moveToCollectibles.length}個\n`;
  report += `   削除（建材・ツール等）: ${results.delete.length}個\n\n`;
  
  report += '2. 修正後カテゴリ統計:\n';
  for (const [category, count] of Object.entries(categoryStats)) {
    report += `   ${category}: ${count}個\n`;
  }
  
  report += '\n3. 削除されたアイテム一覧:\n';
  for (const item of results.delete) {
    report += `- ${item.name} (ID: ${item.id})\n`;
  }
  
  return report;
}

if (require.main === module) {
  main();
}