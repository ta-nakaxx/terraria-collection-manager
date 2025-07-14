#!/usr/bin/env tsx

/**
 * 既存アイコンの整理スクリプト
 * 現在のアイコンファイルを新しい分類に基づいて適切なディレクトリに移動する
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '../src/data/real-data/curated-items.json');
const ICONS_BASE_PATH = path.join(__dirname, '../public/assets/icons');

import { type Item } from '../src/utils/itemValidation';

async function main() {
  try {
    console.log('🔧 既存アイコンの整理を開始します...\n');
    
    // データ読み込み
    const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
    const items: Item[] = JSON.parse(rawData);
    
    // 既存アイコンファイルのスキャン
    const existingIcons = await scanExistingIcons();
    console.log(`📊 発見された既存アイコン: ${existingIcons.length}個\n`);
    
    // IDベースのアイテムマップ作成
    const itemMap = new Map<string, Item>();
    for (const item of items) {
      itemMap.set(item.id, item);
    }
    
    let movedCount = 0;
    let errorCount = 0;
    
    console.log('=== アイコン移動処理 ===\n');
    
    for (const iconFile of existingIcons) {
      const itemId = iconFile.id;
      const item = itemMap.get(itemId);
      
      if (!item) {
        console.log(`⚠️  ID ${itemId} に対応するアイテムが見つかりません: ${iconFile.currentPath}`);
        errorCount++;
        continue;
      }
      
      // 期待される新しいパス
      const expectedPath = path.join(process.cwd(), 'public', item.iconPath);
      const expectedDir = path.dirname(expectedPath);
      
      // ディレクトリが存在しない場合は作成
      if (!fs.existsSync(expectedDir)) {
        fs.mkdirSync(expectedDir, { recursive: true });
        console.log(`📁 ディレクトリ作成: ${path.relative(process.cwd(), expectedDir)}`);
      }
      
      // ファイル移動
      if (iconFile.currentPath !== expectedPath) {
        try {
          fs.copyFileSync(iconFile.currentPath, expectedPath);
          fs.unlinkSync(iconFile.currentPath); // 元ファイル削除
          console.log(`✅ 移動: ${item.name} (ID: ${itemId}) → ${item.category}`);
          movedCount++;
        } catch (error) {
          console.log(`❌ 移動失敗: ${iconFile.currentPath} → ${expectedPath}`);
          console.log(`   エラー: ${error}`);
          errorCount++;
        }
      } else {
        console.log(`✓ 既に正しい位置: ${item.name} (ID: ${itemId})`);
      }
    }
    
    console.log('\n=== 整理結果 ===');
    console.log(`✅ 移動完了: ${movedCount}個`);
    console.log(`❌ エラー: ${errorCount}個`);
    console.log(`📊 正しく配置されたアイコン: ${movedCount}個`);
    
    // 空ディレクトリのクリーンアップ
    await cleanupEmptyDirectories();
    
  } catch (error) {
    console.error('❌ 整理中にエラーが発生しました:', error);
    process.exit(1);
  }
}

async function scanExistingIcons(): Promise<{ id: string; currentPath: string; extension: string }[]> {
  const icons: { id: string; currentPath: string; extension: string }[] = [];
  
  // icons ディレクトリを再帰的にスキャン
  function scanDirectory(dirPath: string) {
    if (!fs.existsSync(dirPath)) return;
    
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (['.png', '.svg', '.jpg', '.jpeg'].includes(ext)) {
          const filename = path.basename(item, ext);
          // ファイル名から ID を抽出（数字のみ）
          const match = filename.match(/^(\d+)$/);
          if (match) {
            icons.push({
              id: match[1],
              currentPath: fullPath,
              extension: ext
            });
          }
        }
      }
    }
  }
  
  scanDirectory(ICONS_BASE_PATH);
  return icons;
}

async function cleanupEmptyDirectories() {
  console.log('\n🧹 空ディレクトリのクリーンアップ...');
  
  function isDirectoryEmpty(dirPath: string): boolean {
    try {
      const items = fs.readdirSync(dirPath);
      return items.length === 0;
    } catch {
      return false;
    }
  }
  
  function removeEmptyDirectories(dirPath: string) {
    if (!fs.existsSync(dirPath)) return;
    
    const items = fs.readdirSync(dirPath);
    
    // 先にサブディレクトリを処理
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      if (fs.statSync(fullPath).isDirectory()) {
        removeEmptyDirectories(fullPath);
      }
    }
    
    // 空になったディレクトリを削除
    if (isDirectoryEmpty(dirPath) && dirPath !== ICONS_BASE_PATH) {
      fs.rmdirSync(dirPath);
      console.log(`🗑️  空ディレクトリ削除: ${path.relative(process.cwd(), dirPath)}`);
    }
  }
  
  removeEmptyDirectories(ICONS_BASE_PATH);
}

if (require.main === module) {
  main();
}