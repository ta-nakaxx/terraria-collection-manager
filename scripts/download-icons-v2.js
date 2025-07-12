/**
 * Terraria アイコン画像ダウンロードスクリプト v2
 * Terraria.wiki.gg から個別のアイテムアイコンをダウンロード
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// アイテムデータの読み込み
const loadItemData = () => {
  const dataDir = path.join(__dirname, '../src/data/real-data');
  const files = ['weapons.json', 'tools.json', 'npcs.json', 'bosss.json'];
  
  let allItems = [];
  
  for (const file of files) {
    try {
      const filePath = path.join(dataDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      allItems = allItems.concat(data);
    } catch (error) {
      console.log(`⚠️  Could not load ${file}:`, error.message);
    }
  }
  
  return allItems;
};

// アイテム名をWikiファイル名に変換
const itemNameToWikiFileName = (itemName) => {
  // より正確なWikiファイル名形式への変換
  return itemName
    .replace(/'/g, '_')     // アポストロフィ
    .replace(/ /g, '_')     // スペース
    .replace(/\(/g, '')     // 括弧を削除
    .replace(/\)/g, '')
    .replace(/&/g, 'and')   // &をandに
    .replace(/:/g, '_')     // コロン
    .replace(/\./g, '')     // ピリオド削除
    .replace(/_+/g, '_')    // 連続するアンダースコアを1つに
    .replace(/^_|_$/g, ''); // 先頭末尾のアンダースコア削除
};

// 複数のURLパターンを試す
const generateImageUrls = (itemName) => {
  const originalName = itemName;
  const wikiName = itemNameToWikiFileName(itemName);
  
  return [
    // パターン1: terraria.wiki.gg (メイン)
    `https://terraria.wiki.gg/images/${originalName.replace(/ /g, '_')}.png`,
    `https://terraria.wiki.gg/images/thumb/${originalName.replace(/ /g, '_')}.png/32px-${originalName.replace(/ /g, '_')}.png`,
    
    // パターン2: 簡潔なファイル名
    `https://terraria.wiki.gg/images/${wikiName}.png`,
    
    // パターン3: フォールバック用 placeholder
    '/placeholder.svg'
  ];
};

// ファイルをダウンロード（複数URLを試行）
const downloadFileWithFallback = async (urls, filePath) => {
  for (let i = 0; i < urls.length - 1; i++) {  // placeholderは除く
    try {
      await downloadFile(urls[i], filePath);
      return urls[i]; // 成功したURLを返す
    } catch (error) {
      console.log(`   試行 ${i + 1} 失敗: ${error.message}`);
    }
  }
  throw new Error('すべてのURLで失敗');
};

// ファイルをダウンロード
const downloadFile = (url, filePath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        file.close();
        fs.unlinkSync(filePath); // 失敗ファイルを削除
        const redirectUrl = response.headers.location;
        downloadFile(redirectUrl, filePath).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlinkSync(filePath); // 失敗ファイルを削除
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    });
    
    request.on('error', (error) => {
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // 失敗ファイルを削除
      }
      reject(error);
    });
    
    request.setTimeout(5000, () => {
      request.destroy();
      file.close();
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      reject(new Error('Timeout'));
    });
  });
};

// ディレクトリ作成
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// プレースホルダー画像をコピー
const copyPlaceholder = (destinationPath) => {
  const placeholderPath = path.join(__dirname, '../public/placeholder.svg');
  if (fs.existsSync(placeholderPath)) {
    // SVGをPNGディレクトリにコピー（拡張子はそのまま）
    const destDir = path.dirname(destinationPath);
    const baseName = path.basename(destinationPath, '.png');
    const svgDestPath = path.join(destDir, `${baseName}.svg`);
    fs.copyFileSync(placeholderPath, svgDestPath);
    return true;
  }
  return false;
};

// メイン処理
const downloadIcons = async () => {
  console.log('🚀 Terraria アイコンダウンロード v2 開始...');
  
  const items = loadItemData();
  console.log(`📊 総アイテム数: ${items.length}`);
  
  // ディレクトリ準備
  const publicIconsDir = path.join(__dirname, '../public/assets/icons');
  const categories = ['weapons', 'tools', 'npcs', 'bosses'];
  
  categories.forEach(category => {
    ensureDir(path.join(publicIconsDir, category));
  });
  
  let successCount = 0;
  let placeholderCount = 0;
  let failedCount = 0;
  const failed = [];
  const successful = [];
  
  // 少量から始めてテスト
  const testItems = items.slice(0, 20);
  console.log(`🧪 テスト用に最初の${testItems.length}アイテムを処理します...`);
  
  for (const item of testItems) {
    try {
      const category = item.type === 'boss' ? 'bosses' : `${item.type}s`;
      const fileName = `${item.id}.png`;
      const filePath = path.join(publicIconsDir, category, fileName);
      
      // 既存ファイルはスキップ
      if (fs.existsSync(filePath)) {
        console.log(`⏭️  スキップ: ${item.name} (既存)`);
        continue;
      }
      
      console.log(`🔍 処理中: ${item.name}`);
      
      const urls = generateImageUrls(item.name);
      console.log(`   試行するURL: ${urls.slice(0, -1).length}個`);
      
      try {
        const successUrl = await downloadFileWithFallback(urls, filePath);
        successCount++;
        successful.push({ name: item.name, url: successUrl });
        console.log(`✅ 成功: ${item.name}`);
      } catch (error) {
        // プレースホルダーをコピー
        if (copyPlaceholder(filePath)) {
          placeholderCount++;
          console.log(`📋 プレースホルダー使用: ${item.name}`);
        } else {
          failedCount++;
          failed.push({ name: item.name, error: error.message });
          console.log(`❌ 完全失敗: ${item.name} - ${error.message}`);
        }
      }
      
      // レート制限のため待機
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      failedCount++;
      failed.push({ name: item.name, error: error.message });
      console.log(`❌ エラー: ${item.name} - ${error.message}`);
    }
  }
  
  // 結果レポート
  console.log('\n📈 テストダウンロード完了レポート');
  console.log(`✅ 成功: ${successCount}`);
  console.log(`📋 プレースホルダー: ${placeholderCount}`);
  console.log(`❌ 失敗: ${failedCount}`);
  
  if (successful.length > 0) {
    console.log('\n✅ 成功したアイテム:');
    successful.slice(0, 5).forEach(item => {
      console.log(`   - ${item.name}: ${item.url}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ 失敗したアイテム:');
    failed.forEach(item => {
      console.log(`   - ${item.name}: ${item.error}`);
    });
  }
  
  // 結果をファイルに保存
  const resultsPath = path.join(__dirname, '../data/download-results.json');
  const results = {
    successful,
    failed,
    placeholderCount,
    totalProcessed: testItems.length,
    timestamp: new Date().toISOString()
  };
  
  ensureDir(path.dirname(resultsPath));
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`📝 結果を保存: ${resultsPath}`);
  
  if (successCount > 0) {
    console.log('\n🎉 いくつかのアイコンのダウンロードに成功しました!');
    console.log('   成功したパターンを使用して全体処理に進められます。');
  } else {
    console.log('\n⚠️  アイコンダウンロードに成功しませんでした。');
    console.log('   URLパターンの再検討が必要です。');
  }
};

// 実行
if (require.main === module) {
  downloadIcons().catch(console.error);
}

module.exports = { downloadIcons };