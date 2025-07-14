#!/usr/bin/env tsx

/**
 * データ検証スクリプト
 * curated-items.jsonの分類を自動検証する
 */

import * as fs from 'fs';
import * as path from 'path';
import { validateAllItems, generateValidationReport, type Item } from '../src/utils/itemValidation';

const DATA_PATH = path.join(__dirname, '../src/data/real-data/curated-items.json');

async function main() {
  try {
    console.log('🔍 アイテムデータの検証を開始します...\n');
    
    // データファイルの読み込み
    if (!fs.existsSync(DATA_PATH)) {
      console.error(`❌ データファイルが見つかりません: ${DATA_PATH}`);
      process.exit(1);
    }

    const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
    const items: Item[] = JSON.parse(rawData);
    
    console.log(`📊 総アイテム数: ${items.length}`);
    
    // 検証実行
    const validationResult = validateAllItems(items);
    
    // レポート生成
    const report = generateValidationReport(validationResult);
    console.log(report);
    
    // レポートファイルに保存
    const reportPath = path.join(__dirname, '../validation-report.txt');
    fs.writeFileSync(reportPath, report);
    console.log(`\n📝 詳細レポートを保存しました: ${reportPath}`);
    
    // 終了コード設定
    if (!validationResult.isValid) {
      console.log('\n❌ 検証失敗: 分類エラーが検出されました');
      process.exit(1);
    } else {
      console.log('\n✅ 検証成功: 全アイテムの分類が正常です');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ 検証中にエラーが発生しました:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}