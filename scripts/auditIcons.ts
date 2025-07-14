#!/usr/bin/env tsx

/**
 * アイコンファイル監査スクリプト
 * データとアイコンファイルの整合性をチェックし、不足アイコンを特定する
 */

import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(__dirname, '../src/data/real-data/curated-items.json');
const ICONS_PATH = path.join(__dirname, '../public/assets/icons');

import { type Item } from '../src/utils/itemValidation';

interface IconAuditResult {
  totalItems: number;
  iconsFound: number;
  iconsMissing: number;
  missingIcons: { item: Item; expectedPath: string }[];
  categoryBreakdown: Record<string, { total: number; found: number; missing: number }>;
}

async function main() {
  try {
    console.log('🔍 アイコンファイル監査を開始します...\n');
    
    // データ読み込み
    const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
    const items: Item[] = JSON.parse(rawData);
    
    console.log(`📊 総アイテム数: ${items.length}`);
    
    // アイコン監査実行
    const auditResult = await auditIcons(items);
    
    // 結果表示
    displayAuditResults(auditResult);
    
    // 詳細レポート保存
    const report = generateIconAuditReport(auditResult);
    const reportPath = path.join(__dirname, '../icon-audit-report.txt');
    fs.writeFileSync(reportPath, report);
    console.log(`\n📝 詳細レポートを保存: ${reportPath}`);
    
    // 不足アイコンリスト保存
    const missingIconsList = generateMissingIconsList(auditResult);
    const missingPath = path.join(__dirname, '../missing-icons-list.txt');
    fs.writeFileSync(missingPath, missingIconsList);
    console.log(`📝 不足アイコンリストを保存: ${missingPath}`);
    
  } catch (error) {
    console.error('❌ 監査中にエラーが発生しました:', error);
    process.exit(1);
  }
}

async function auditIcons(items: Item[]): Promise<IconAuditResult> {
  const result: IconAuditResult = {
    totalItems: items.length,
    iconsFound: 0,
    iconsMissing: 0,
    missingIcons: [],
    categoryBreakdown: {}
  };
  
  // カテゴリ別統計初期化
  for (const item of items) {
    if (!result.categoryBreakdown[item.category]) {
      result.categoryBreakdown[item.category] = { total: 0, found: 0, missing: 0 };
    }
    result.categoryBreakdown[item.category].total++;
  }
  
  // 各アイテムのアイコンをチェック
  for (const item of items) {
    const expectedIconPath = path.join(process.cwd(), 'public', item.iconPath);
    const exists = fs.existsSync(expectedIconPath);
    
    if (exists) {
      result.iconsFound++;
      result.categoryBreakdown[item.category].found++;
    } else {
      result.iconsMissing++;
      result.categoryBreakdown[item.category].missing++;
      result.missingIcons.push({
        item,
        expectedPath: expectedIconPath
      });
    }
  }
  
  return result;
}

function displayAuditResults(result: IconAuditResult) {
  console.log('\n=== アイコン監査結果 ===\n');
  
  const coveragePercent = ((result.iconsFound / result.totalItems) * 100).toFixed(1);
  console.log(`📊 総アイテム数: ${result.totalItems}`);
  console.log(`✅ アイコン存在: ${result.iconsFound}個`);
  console.log(`❌ アイコン不足: ${result.iconsMissing}個`);
  console.log(`📈 カバー率: ${coveragePercent}%\n`);
  
  console.log('=== カテゴリ別詳細 ===\n');
  
  for (const [category, stats] of Object.entries(result.categoryBreakdown)) {
    const categoryPercent = stats.total > 0 ? ((stats.found / stats.total) * 100).toFixed(1) : '0.0';
    console.log(`🏷️  ${category}:`);
    console.log(`   総数: ${stats.total}個`);
    console.log(`   存在: ${stats.found}個`);
    console.log(`   不足: ${stats.missing}個`);
    console.log(`   カバー率: ${categoryPercent}%\n`);
  }
  
  // 最も不足の多いカテゴリ
  const mostMissingCategory = Object.entries(result.categoryBreakdown)
    .sort((a, b) => b[1].missing - a[1].missing)[0];
  
  console.log(`⚠️  最も不足が多いカテゴリ: ${mostMissingCategory[0]} (${mostMissingCategory[1].missing}個不足)`);
}

function generateIconAuditReport(result: IconAuditResult): string {
  let report = '=== アイコンファイル監査レポート ===\n\n';
  
  const coveragePercent = ((result.iconsFound / result.totalItems) * 100).toFixed(1);
  
  report += '1. 全体サマリー:\n';
  report += `   総アイテム数: ${result.totalItems}\n`;
  report += `   アイコン存在: ${result.iconsFound}個\n`;
  report += `   アイコン不足: ${result.iconsMissing}個\n`;
  report += `   カバー率: ${coveragePercent}%\n\n`;
  
  report += '2. カテゴリ別詳細:\n';
  for (const [category, stats] of Object.entries(result.categoryBreakdown)) {
    const categoryPercent = stats.total > 0 ? ((stats.found / stats.total) * 100).toFixed(1) : '0.0';
    report += `   ${category}: ${stats.found}/${stats.total} (${categoryPercent}%)\n`;
  }
  
  report += '\n3. 優先度別推奨アクション:\n';
  
  // カテゴリを不足数でソート
  const sortedCategories = Object.entries(result.categoryBreakdown)
    .sort((a, b) => b[1].missing - a[1].missing);
  
  report += '   高優先度（不足数順）:\n';
  for (const [category, stats] of sortedCategories.slice(0, 3)) {
    report += `   - ${category}: ${stats.missing}個のアイコンが必要\n`;
  }
  
  return report;
}

function generateMissingIconsList(result: IconAuditResult): string {
  let list = '=== 不足アイコン一覧 ===\n\n';
  
  // カテゴリ別にグループ化
  const byCategory = result.missingIcons.reduce((acc, { item }) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Item[]>);
  
  for (const [category, items] of Object.entries(byCategory)) {
    list += `### ${category} (${items.length}個)\n`;
    for (const item of items.slice(0, 20)) { // 最初の20個のみ表示
      list += `- ${item.name} (ID: ${item.id}) → ${item.iconPath}\n`;
    }
    if (items.length > 20) {
      list += `... および${items.length - 20}個の追加アイテム\n`;
    }
    list += '\n';
  }
  
  return list;
}

if (require.main === module) {
  main();
}