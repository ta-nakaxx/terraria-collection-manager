/**
 * cr0wst/terraria-info からのデータ取得スクリプト
 */

import fs from 'fs/promises';
import path from 'path';

interface RawTerrariaItem {
  id: string;
  name: string;
  recipe1?: string;
  recipe2?: string;
  recipe3?: string;
  recipe4?: string;
  recipe5?: string;
  recipe6?: string;
  recipe7?: string;
  recipe8?: string;
  recipe9?: string;
  recipe10?: string;
  recipe11?: string;
  recipe12?: string;
  recipe13?: string;
  recipe14?: string;
  recipe15?: string;
  [key: string]: any;
}

/**
 * GitHub APIを使用してcr0wst/terraria-infoのデータを取得
 */
export async function fetchTerrariaData(): Promise<RawTerrariaItem[]> {
  try {
    console.log('Fetching Terraria data from cr0wst/terraria-info...');
    
    const response = await fetch(
      'https://raw.githubusercontent.com/cr0wst/terraria-info/master/json/items.json',
      {
        headers: {
          'User-Agent': 'terraria-collection-manager'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`Successfully fetched ${data.length} items from terraria-info`);
    
    return data;
  } catch (error) {
    console.error('Error fetching Terraria data:', error);
    throw error;
  }
}

/**
 * 取得したデータをローカルファイルに保存
 */
export async function saveTerrariaData(data: RawTerrariaItem[]): Promise<void> {
  try {
    const dataDir = path.join(process.cwd(), 'data', 'raw');
    await fs.mkdir(dataDir, { recursive: true });
    
    const filePath = path.join(dataDir, 'terraria-items-raw.json');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    
    console.log(`Saved ${data.length} items to ${filePath}`);
  } catch (error) {
    console.error('Error saving Terraria data:', error);
    throw error;
  }
}

/**
 * 既存のローカルデータを読み込む
 */
export async function loadLocalTerrariaData(): Promise<RawTerrariaItem[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'raw', 'terraria-items-raw.json');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log('No local data found, will fetch from remote');
    return [];
  }
}

/**
 * データの基本統計を表示
 */
export function analyzeData(data: RawTerrariaItem[]): void {
  console.log('\n=== Data Analysis ===');
  console.log(`Total items: ${data.length}`);
  
  const itemsWithRecipes = data.filter(item => item.recipe1);
  console.log(`Items with recipes: ${itemsWithRecipes.length}`);
  
  const uniqueNames = new Set(data.map(item => item.name));
  console.log(`Unique item names: ${uniqueNames.size}`);
  
  // サンプルアイテムを表示
  console.log('\n=== Sample Items ===');
  data.slice(0, 3).forEach(item => {
    console.log(`- ${item.name} (ID: ${item.id})`);
    if (item.recipe1) {
      console.log(`  Recipe: ${item.recipe1}`);
    }
  });
}

/**
 * メイン実行関数
 */
export async function main(): Promise<void> {
  try {
    console.log('Starting Terraria data fetch process...');
    
    // ローカルデータを確認
    let data = await loadLocalTerrariaData();
    
    // ローカルデータがない場合は取得
    if (data.length === 0) {
      data = await fetchTerrariaData();
      await saveTerrariaData(data);
    } else {
      console.log(`Using existing local data (${data.length} items)`);
    }
    
    // データ分析
    analyzeData(data);
    
    console.log('\nTerraria data fetch completed successfully!');
    return;
  } catch (error) {
    console.error('Failed to fetch Terraria data:', error);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合
if (require.main === module) {
  main();
}