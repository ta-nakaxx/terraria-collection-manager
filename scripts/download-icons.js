/**
 * Terraria アイコン画像ダウンロードスクリプト
 * Terraria Wiki から個別のアイテムアイコンをダウンロード
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// アイテムデータの読み込み
const loadItemData = () => {
  const dataDir = path.join(__dirname, '../src/data/real-data');
  const files = ['weapons.json', 'armor.json', 'accessories.json', 'tools.json', 'npcs.json', 'bosss.json'];
  
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
  // 特殊文字の処理とWikiファイル名形式への変換
  return itemName
    .replace(/'/g, '%27')  // アポストロフィ
    .replace(/ /g, '_')    // スペースをアンダースコアに
    .replace(/\(/g, '%28') // 括弧
    .replace(/\)/g, '%29')
    .replace(/&/g, '%26')  // アンパサンド
    + '.png';
};

// Wikia/Fandom URLを生成（より安定）
const generateImageUrl = (itemName) => {
  const fileName = itemNameToWikiFileName(itemName);
  return `https://static.wikia.nocookie.net/terraria_gamepedia/images/${fileName}`;
};

// ファイルをダウンロード
const downloadFile = (url, filePath) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // リダイレクトに対応
        const redirectUrl = response.headers.location;
        downloadFile(redirectUrl, filePath).then(resolve).catch(reject);
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', reject);
  });
};

// ディレクトリ作成
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// メイン処理
const downloadIcons = async () => {
  console.log('🚀 Terraria アイコンダウンロード開始...');
  
  const items = loadItemData();
  console.log(`📊 総アイテム数: ${items.length}`);
  
  // ディレクトリ準備
  const publicIconsDir = path.join(__dirname, '../public/assets/icons');
  const categories = ['weapons', 'armor', 'accessories', 'tools', 'npcs', 'bosses'];
  
  categories.forEach(category => {
    ensureDir(path.join(publicIconsDir, category));
  });
  
  let successCount = 0;
  let failedCount = 0;
  const failed = [];
  
  // 並行処理数を制限（サーバー負荷軽減）
  const BATCH_SIZE = 5;
  
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    
    await Promise.all(batch.map(async (item) => {
      try {
        const imageUrl = generateImageUrl(item.name);
        const category = item.type === 'boss' ? 'bosses' : `${item.type}s`;
        const fileName = `${item.id}.png`;
        const filePath = path.join(publicIconsDir, category, fileName);
        
        // 既存ファイルはスキップ
        if (fs.existsSync(filePath)) {
          console.log(`⏭️  スキップ: ${item.name} (既存)`);
          return;
        }
        
        await downloadFile(imageUrl, filePath);
        successCount++;
        console.log(`✅ ダウンロード成功: ${item.name}`);
        
        // レート制限のため少し待機
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        failedCount++;
        failed.push({ name: item.name, error: error.message });
        console.log(`❌ ダウンロード失敗: ${item.name} - ${error.message}`);
      }
    }));
  }
  
  // 結果レポート
  console.log('\n📈 ダウンロード完了レポート');
  console.log(`✅ 成功: ${successCount}`);
  console.log(`❌ 失敗: ${failedCount}`);
  
  if (failed.length > 0) {
    console.log('\n❌ 失敗したアイテム:');
    failed.slice(0, 10).forEach(item => {
      console.log(`   - ${item.name}: ${item.error}`);
    });
    if (failed.length > 10) {
      console.log(`   ... and ${failed.length - 10} more`);
    }
  }
  
  // 失敗リストをファイルに保存
  if (failed.length > 0) {
    const failedPath = path.join(__dirname, '../data/failed-downloads.json');
    fs.writeFileSync(failedPath, JSON.stringify(failed, null, 2));
    console.log(`📝 失敗リストを保存: ${failedPath}`);
  }
  
  console.log('🎉 アイコンダウンロード処理完了!');
};

// 実行
if (require.main === module) {
  downloadIcons().catch(console.error);
}

module.exports = { downloadIcons };