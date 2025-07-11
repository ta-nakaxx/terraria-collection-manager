/**
 * データ変換メインスクリプト
 * cr0wst/terraria-info から取得したデータを我々の形式に変換
 */

import fs from 'fs/promises';
import path from 'path';
import { Item } from '@/types';
import { fetchTerrariaData, saveTerrariaData, loadLocalTerrariaData, analyzeData } from './fetch-terraria-data';
import { convertRawData, analyzeConvertedData } from './convert-to-our-format';
import { classifyItem } from './classify-items';
import { validateItems, displayValidationResult, getValidItems, calculateDataQualityScore } from './validate-data';

/**
 * コマンドライン引数の解析
 */
function parseArgs(): {
  force: boolean;
  skipValidation: boolean;
  outputFormat: 'json' | 'typescript';
  maxItems?: number;
} {
  const args = process.argv.slice(2);
  
  return {
    force: args.includes('--force'),
    skipValidation: args.includes('--skip-validation'),
    outputFormat: args.includes('--typescript') ? 'typescript' : 'json',
    maxItems: args.includes('--max-items') ? 
      parseInt(args[args.indexOf('--max-items') + 1]) : undefined
  };
}

/**
 * 変換されたデータを保存
 */
async function saveConvertedData(
  items: Item[], 
  format: 'json' | 'typescript' = 'json'
): Promise<void> {
  const outputDir = path.join(process.cwd(), 'src', 'data', 'real-data');
  await fs.mkdir(outputDir, { recursive: true });
  
  // タイプ別に分類
  const itemsByType = items.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, Item[]>);
  
  if (format === 'json') {
    // JSON形式で保存
    for (const [type, typeItems] of Object.entries(itemsByType)) {
      const filename = `${type}s.json`;
      const filepath = path.join(outputDir, filename);
      await fs.writeFile(filepath, JSON.stringify(typeItems, null, 2));
      console.log(`Saved ${typeItems.length} ${type}s to ${filepath}`);
    }
    
    // 全アイテムも保存
    const allItemsPath = path.join(outputDir, 'all-items.json');
    await fs.writeFile(allItemsPath, JSON.stringify(items, null, 2));
    console.log(`Saved all ${items.length} items to ${allItemsPath}`);
  } else {
    // TypeScript形式で保存
    const tsContent = `/**
 * 実際のTerrariaデータ
 * 自動生成されたファイル - 手動での編集は避けてください
 */

import { Item } from '@/types';

${Object.entries(itemsByType).map(([type, typeItems]) => `
export const ${type}Items: Item[] = ${JSON.stringify(typeItems, null, 2)};
`).join('')}

export const allRealItems: Item[] = ${JSON.stringify(items, null, 2)};

export default allRealItems;
`;
    
    const tsPath = path.join(outputDir, 'index.ts');
    await fs.writeFile(tsPath, tsContent);
    console.log(`Saved TypeScript data to ${tsPath}`);
  }
}

/**
 * 統計情報を保存
 */
async function saveStatistics(items: Item[]): Promise<void> {
  const statsDir = path.join(process.cwd(), 'data', 'stats');
  await fs.mkdir(statsDir, { recursive: true });
  
  const stats = {
    totalItems: items.length,
    byType: items.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byRarity: items.reduce((acc, item) => {
      acc[item.rarity] = (acc[item.rarity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byGameStage: items.reduce((acc, item) => {
      acc[item.gameStage] = (acc[item.gameStage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byAcquisition: items.reduce((acc, item) => {
      item.acquisition.forEach(acq => {
        acc[acq] = (acc[acq] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>),
    generatedAt: new Date().toISOString()
  };
  
  const statsPath = path.join(statsDir, 'conversion-stats.json');
  await fs.writeFile(statsPath, JSON.stringify(stats, null, 2));
  console.log(`Saved statistics to ${statsPath}`);
}

/**
 * 進捗表示
 */
function displayProgress(current: number, total: number, operation: string): void {
  const percentage = Math.round((current / total) * 100);
  const bar = '█'.repeat(Math.floor(percentage / 2)) + '░'.repeat(50 - Math.floor(percentage / 2));
  process.stdout.write(`\r${operation}: [${bar}] ${percentage}% (${current}/${total})`);
}

/**
 * メイン処理
 */
async function main(): Promise<void> {
  const args = parseArgs();
  
  console.log('🚀 Starting Terraria data conversion process...');
  console.log(`Arguments: ${JSON.stringify(args, null, 2)}`);
  
  try {
    // Step 1: データ取得
    console.log('\n📥 Step 1: Fetching Terraria data...');
    let rawData = await loadLocalTerrariaData();
    
    if (rawData.length === 0 || args.force) {
      console.log('Fetching fresh data from cr0wst/terraria-info...');
      rawData = await fetchTerrariaData();
      await saveTerrariaData(rawData);
    } else {
      console.log(`Using existing local data (${rawData.length} items)`);
    }
    
    // 最大アイテム数の制限
    if (args.maxItems && rawData.length > args.maxItems) {
      console.log(`Limiting to ${args.maxItems} items for testing`);
      rawData = rawData.slice(0, args.maxItems);
    }
    
    analyzeData(rawData);
    
    // Step 2: データ変換
    console.log('\n🔄 Step 2: Converting data to our format...');
    const convertedItems: Item[] = [];
    
    for (let i = 0; i < rawData.length; i++) {
      const rawItem = rawData[i];
      displayProgress(i + 1, rawData.length, 'Converting');
      
      const classification = classifyItem(rawItem.name);
      const collectibleTypes = ['weapon', 'armor', 'accessory', 'vanity', 'npc', 'boss'];
      const collectionType = collectibleTypes.includes(classification.type) ? 'collectible' : 'reference';
      
      const convertedItem: Item = {
        id: rawItem.id,
        name: rawItem.name,
        type: classification.type,
        category: classification.category,
        subcategory: classification.subcategory,
        iconPath: `/assets/icons/${classification.type === 'npc' ? 'npcs' : 
                    classification.type === 'boss' ? 'bosses' :
                    classification.type === 'weapon' ? 'weapons' :
                    classification.type === 'armor' ? 'armor' : 'accessories'}/${rawItem.id.toLowerCase().replace(/\s+/g, '-')}.png`,
        acquisition: rawItem.recipe1 ? ['craft'] : ['find'],
        rarity: classification.rarity,
        gameStage: classification.gameStage,
        owned: false,
        collectionType
      };
      
      convertedItems.push(convertedItem);
    }
    
    console.log('\n✅ Conversion completed!');
    analyzeConvertedData(convertedItems);
    
    // Step 3: データ検証
    let validItems = convertedItems;
    if (!args.skipValidation) {
      console.log('\n🔍 Step 3: Validating converted data...');
      const validationResult = validateItems(convertedItems);
      
      displayValidationResult(validationResult);
      
      const qualityScore = calculateDataQualityScore(validationResult);
      console.log(`\n📊 Data Quality Score: ${qualityScore}/100`);
      
      if (!validationResult.isValid) {
        console.log('⚠️  Using only valid items for output');
        validItems = getValidItems(convertedItems);
      }
    }
    
    // Step 4: データ保存
    console.log('\n💾 Step 4: Saving converted data...');
    await saveConvertedData(validItems, args.outputFormat);
    await saveStatistics(validItems);
    
    // Step 5: 完了報告
    console.log('\n🎉 Data conversion completed successfully!');
    console.log(`✅ Total items processed: ${rawData.length}`);
    console.log(`✅ Valid items saved: ${validItems.length}`);
    console.log(`✅ Output format: ${args.outputFormat.toUpperCase()}`);
    
    if (validItems.length !== rawData.length) {
      console.log(`⚠️  ${rawData.length - validItems.length} items were filtered out due to validation issues`);
    }
    
  } catch (error) {
    console.error('❌ Data conversion failed:', error);
    process.exit(1);
  }
}

// ヘルプ表示
function displayHelp(): void {
  console.log(`
🛠️  Terraria Data Conversion Tool

Usage: ts-node scripts/data-conversion/index.ts [options]

Options:
  --force               Force re-download of data from remote
  --skip-validation     Skip data validation step
  --typescript          Output as TypeScript file instead of JSON
  --max-items <number>  Limit number of items to process (for testing)
  --help                Show this help message

Examples:
  ts-node scripts/data-conversion/index.ts
  ts-node scripts/data-conversion/index.ts --force --typescript
  ts-node scripts/data-conversion/index.ts --max-items 50
  ts-node scripts/data-conversion/index.ts --skip-validation
`);
}

// メイン実行
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    displayHelp();
    process.exit(0);
  }
  
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { main as runDataConversion };