/**
 * 実際のTerrariaアイコン取得スクリプト v3
 * より確実なURL生成とエラーハンドリング
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

// アイテム名を正規化（より確実なマッピング）
const normalizeItemName = (name) => {
  return name
    .replace(/'/g, '')           // アポストロフィ削除
    .replace(/\s+/g, '_')        // スペースをアンダースコアに
    .replace(/[()]/g, '')        // 括弧削除
    .replace(/[&]/g, 'and')      // &をandに
    .replace(/[:]/g, '')         // コロン削除
    .replace(/[.]/g, '')         // ピリオド削除
    .replace(/_+/g, '_')         // 連続アンダースコアを1つに
    .replace(/^_|_$/g, '')       // 先頭末尾アンダースコア削除
    .toLowerCase();
};

// 複数のWiki URLパターンを生成
const generateWikiUrls = (itemName) => {
  const normalized = normalizeItemName(itemName);
  const original = itemName.replace(/\s+/g, '_');
  
  // 試行するURL（優先度順）
  return [
    // Terraria.wiki.gg (新Wiki)
    `https://terraria.wiki.gg/images/${original}.png`,
    `https://terraria.wiki.gg/images/${normalized}.png`,
    `https://terraria.wiki.gg/images/Item_${original}.png`,
    `https://terraria.wiki.gg/images/Item_${normalized}.png`,
    
    // Terraria.fandom.com (旧Wiki)
    `https://terraria.fandom.com/wiki/Special:FilePath/${original}.png`,
    `https://terraria.fandom.com/wiki/Special:FilePath/Item_${original}.png`,
    
    // Static.wikia.nocookie.net (直接画像)
    `https://static.wikia.nocookie.net/terraria_gamepedia/images/${original}.png`,
    `https://static.wikia.nocookie.net/terraria_gamepedia/images/${normalized}.png`
  ];
};

// より堅牢なファイルダウンロード
const downloadFile = (url, filePath, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    let downloaded = false;
    
    const cleanup = () => {
      file.close();
      if (fs.existsSync(filePath) && !downloaded) {
        fs.unlinkSync(filePath); // 失敗時はファイル削除
      }
    };
    
    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          downloaded = true;
          file.close();
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        cleanup();
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          console.log(`  🔄 リダイレクト: ${redirectUrl}`);
          downloadFile(redirectUrl, filePath, timeout).then(resolve).catch(reject);
        } else {
          reject(new Error(`Redirect without location: ${response.statusCode}`));
        }
      } else {
        cleanup();
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    });
    
    request.on('error', (error) => {
      cleanup();
      reject(error);
    });
    
    request.setTimeout(timeout, () => {
      request.destroy();
      cleanup();
      reject(new Error('Download timeout'));
    });
  });
};

// 複数URLでダウンロード試行
const downloadWithFallback = async (urls, filePath, itemName) => {
  for (let i = 0; i < urls.length; i++) {
    try {
      console.log(`  🔄 試行 ${i + 1}/${urls.length}: ${urls[i]}`);
      await downloadFile(urls[i], filePath);
      
      // ファイルサイズチェック
      const stats = fs.statSync(filePath);
      console.log(`  📁 ファイル作成確認: ${filePath} (${stats.size} bytes)`);
      if (stats.size > 100) { // 100バイト以上なら有効とみなす
        console.log(`  ✅ 成功: ${itemName} (${stats.size} bytes)`);
        return urls[i];
      } else {
        fs.unlinkSync(filePath);
        console.log(`  ⚠️  ファイルサイズが小さすぎ: ${stats.size} bytes`);
      }
    } catch (error) {
      console.log(`  ❌ 失敗: ${error.message}`);
    }
  }
  throw new Error('All URLs failed');
};

// ディレクトリ作成
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// メイン処理
const downloadRealIcons = async () => {
  console.log('🎮 実際のTerrariaアイコンダウンロード開始...');
  
  const items = loadItemData();
  console.log(`📊 総アイテム数: ${items.length}`);
  
  // デバッグ: 少数で確認
  const testItems = items.slice(0, 5);
  console.log(`🔍 デバッグ: 最初の${testItems.length}アイテムで実行`);
  
  // ディレクトリ準備
  const publicIconsDir = path.join(__dirname, '../public/assets/icons');
  const categories = ['weapons', 'tools', 'npcs', 'bosses'];
  
  categories.forEach(category => {
    ensureDir(path.join(publicIconsDir, category));
  });
  
  let successCount = 0;
  let failedCount = 0;
  const results = { success: [], failed: [] };
  
  for (const item of testItems) {
    try {
      console.log(`\n🔍 処理中: ${item.name} (ID: ${item.id})`);
      
      const category = item.type === 'boss' ? 'bosses' : `${item.type}s`;
      const fileName = `${item.id}.png`;
      const filePath = path.join(publicIconsDir, category, fileName);
      
      console.log(`  📂 保存先: ${filePath}`);
      
      // 既存ファイルをスキップ（サイズチェック付き）
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.size > 100) {
          console.log(`⏭️  スキップ: ${item.name} (既存: ${stats.size} bytes)`);
          continue;
        } else {
          fs.unlinkSync(filePath); // 小さすぎるファイルは削除
        }
      }
      
      const urls = generateWikiUrls(item.name);
      const successUrl = await downloadWithFallback(urls, filePath, item.name);
      
      successCount++;
      results.success.push({ 
        name: item.name, 
        id: item.id, 
        url: successUrl,
        size: fs.statSync(filePath).size
      });
      
      // レート制限
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      failedCount++;
      results.failed.push({ name: item.name, id: item.id, error: error.message });
      console.log(`❌ 完全失敗: ${item.name}`);
    }
  }
  
  // 結果レポート
  console.log('\n📈 ダウンロード完了レポート');
  console.log(`✅ 成功: ${successCount}/${testItems.length}`);
  console.log(`❌ 失敗: ${failedCount}/${testItems.length}`);
  
  if (results.success.length > 0) {
    console.log('\n✅ 成功したアイテム:');
    results.success.forEach(item => {
      console.log(`   - ${item.name} (${item.size} bytes)`);
    });
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ 失敗したアイテム:');
    results.failed.forEach(item => {
      console.log(`   - ${item.name}: ${item.error}`);
    });
  }
  
  // 結果をファイルに保存
  const resultsPath = path.join(__dirname, '../data/real-icon-results.json');
  ensureDir(path.dirname(resultsPath));
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`📝 結果保存: ${resultsPath}`);
  
  if (successCount > 0) {
    console.log('\n🎉 実際のTerrariaアイコンの取得に成功しました!');
    console.log('   ブラウザで確認してテンションを上げましょう！');
  } else {
    console.log('\n😔 今回は取得できませんでした。URLパターンの調整が必要かもしれません。');
  }
};

// 実行
if (require.main === module) {
  downloadRealIcons().catch(console.error);
}

module.exports = { downloadRealIcons };