/**
 * 武器アイコン専用ダウンロードスクリプト
 * 開発ガイドラインに従った安全で効率的なダウンロード
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// 追加する武器のリスト
const weaponsToAdd = [
  // Pre-Hardmode
  { id: "155", name: "Starfury", terraria_id: "155" },
  { id: "98", name: "Minishark", terraria_id: "98" },
  { id: "127", name: "Space Gun", terraria_id: "127" },
  { id: "1309", name: "Slime Staff", terraria_id: "1309" },
  
  // Early Hardmode
  { id: "273", name: "Night's Edge", terraria_id: "273" },
  { id: "533", name: "Megashark", terraria_id: "533" },
  { id: "113", name: "Crystal Storm", terraria_id: "113" },
  { id: "1318", name: "Spider Staff", terraria_id: "1318" },
  
  // Late Hardmode/Endgame
  { id: "757", name: "Terra Blade", terraria_id: "757" },
  { id: "3764", name: "S.D.M.G.", terraria_id: "3764" },
  { id: "3571", name: "Last Prism", terraria_id: "3571" },
  { id: "4952", name: "Terraprisma", terraria_id: "4952" }
];

// アイテム名を正規化
const normalizeItemName = (name) => {
  return name
    .replace(/'/g, '')           // アポストロフィ削除
    .replace(/\s+/g, '_')        // スペースをアンダースコアに
    .replace(/[()]/g, '')        // 括弧削除
    .replace(/[&]/g, 'and')      // &をandに
    .replace(/[:]/g, '')         // コロン削除
    .replace(/[.]/g, '')         // ピリオド削除
    .replace(/_+/g, '_')         // 連続アンダースコアを1つに
    .replace(/^_|_$/g, '');      // 先頭末尾アンダースコア削除
};

// 複数のWiki URLパターンを生成
const generateIconUrls = (itemName) => {
  const normalized = normalizeItemName(itemName);
  const original = itemName.replace(/\s+/g, '_');
  
  return [
    `https://terraria.fandom.com/wiki/Special:FilePath/${original}.png`,
    `https://terraria.fandom.com/wiki/Special:FilePath/${normalized}.png`,
    `https://terraria.fandom.com/wiki/Special:FilePath/Item_${original}.png`,
    `https://terraria.wiki.gg/images/${original}.png`,
    `https://terraria.wiki.gg/images/${normalized}.png`
  ];
};

// 改良されたダウンロード関数
const downloadFile = (url, filePath, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    let downloaded = false;
    
    const cleanup = () => {
      file.close();
      if (fs.existsSync(filePath) && !downloaded) {
        fs.unlinkSync(filePath);
      }
    };
    
    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      // リダイレクト処理
      if (response.statusCode === 301 || response.statusCode === 302) {
        cleanup();
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          console.log(`  🔄 リダイレクト: ${redirectUrl}`);
          downloadFile(redirectUrl, filePath, timeout).then(resolve).catch(reject);
        } else {
          reject(new Error(`Redirect without location: ${response.statusCode}`));
        }
        return;
      }
      
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          downloaded = true;
          file.close();
          resolve();
        });
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
      
      // ファイルサイズチェック（開発ガイドラインに従う）
      const stats = fs.statSync(filePath);
      if (stats.size > 100) { // 100バイト以上なら有効
        console.log(`  ✅ 成功: ${itemName} (${stats.size} bytes)`);
        return { url: urls[i], size: stats.size };
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
const downloadWeaponIcons = async () => {
  console.log('⚔️  武器アイコンダウンロード開始...');
  console.log(`📊 対象武器数: ${weaponsToAdd.length}`);
  
  // ディレクトリ準備
  const weaponsIconDir = path.join(__dirname, '../public/assets/icons/weapons');
  ensureDir(weaponsIconDir);
  
  let successCount = 0;
  let failedCount = 0;
  const results = { success: [], failed: [] };
  
  for (const weapon of weaponsToAdd) {
    try {
      console.log(`\n⚔️  処理中: ${weapon.name} (ID: ${weapon.id})`);
      
      const fileName = `${weapon.id}.png`;
      const filePath = path.join(weaponsIconDir, fileName);
      
      // 既存ファイルのチェック（開発ガイドラインに従う）
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        if (stats.size > 100) {
          console.log(`⏭️  スキップ: ${weapon.name} (既存: ${stats.size} bytes)`);
          continue;
        } else {
          fs.unlinkSync(filePath); // 小さすぎるファイルは削除
        }
      }
      
      const urls = generateIconUrls(weapon.name);
      const result = await downloadWithFallback(urls, filePath, weapon.name);
      
      successCount++;
      results.success.push({
        name: weapon.name,
        id: weapon.id,
        url: result.url,
        size: result.size
      });
      
      // レート制限（サーバーに優しく）
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      failedCount++;
      results.failed.push({
        name: weapon.name,
        id: weapon.id,
        error: error.message
      });
      console.log(`❌ 完全失敗: ${weapon.name} - ${error.message}`);
    }
  }
  
  // 結果レポート
  console.log('\n📈 武器アイコンダウンロード完了レポート');
  console.log(`✅ 成功: ${successCount}/${weaponsToAdd.length}`);
  console.log(`❌ 失敗: ${failedCount}/${weaponsToAdd.length}`);
  
  if (results.success.length > 0) {
    console.log('\n✅ 成功した武器:');
    results.success.forEach(weapon => {
      console.log(`   - ${weapon.name} (${weapon.size} bytes)`);
    });
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ 失敗した武器:');
    results.failed.forEach(weapon => {
      console.log(`   - ${weapon.name}: ${weapon.error}`);
    });
  }
  
  // 結果をファイルに保存
  const resultsPath = path.join(__dirname, '../weapon-download-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`📝 結果保存: ${resultsPath}`);
  
  if (successCount > 0) {
    console.log('\n🎉 武器アイコンの取得に成功しました!');
    console.log('   次のステップ: curated-items.jsonに武器データを追加');
  }
  
  return results;
};

// 実行
if (require.main === module) {
  downloadWeaponIcons().catch(console.error);
}

module.exports = { downloadWeaponIcons, weaponsToAdd };