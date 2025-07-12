/**
 * サンプルアイコン生成スクリプト
 * SVGベースのシンプルなアイコンを生成してフォールバック機能をテスト
 */

const fs = require('fs');
const path = require('path');

// ディレクトリ作成
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// SVGアイコン生成
const generateSVGIcon = (type, id, name) => {
  const colors = {
    weapon: '#FF4444',
    tool: '#44FF44', 
    npc: '#4444FF',
    boss: '#FF44FF'
  };
  
  const symbols = {
    weapon: '⚔️',
    tool: '🔨',
    npc: '👤',
    boss: '💀'
  };
  
  const color = colors[type] || '#888888';
  const symbol = symbols[type] || '📦';
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <rect width="64" height="64" fill="${color}" rx="8"/>
    <text x="32" y="40" text-anchor="middle" font-size="24" fill="white">${symbol}</text>
    <text x="32" y="58" text-anchor="middle" font-size="8" fill="white" opacity="0.8">${id}</text>
  </svg>`;
};

// メイン処理
const generateSampleIcons = () => {
  console.log('🎨 サンプルアイコン生成開始...');
  
  // アイテムデータの読み込み
  const dataDir = path.join(__dirname, '../src/data/real-data');
  const files = ['weapons.json', 'tools.json', 'npcs.json', 'bosss.json'];
  
  let allItems = [];
  
  for (const file of files) {
    try {
      const filePath = path.join(dataDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      allItems = allItems.concat(data.slice(0, 5)); // 各タイプから5個ずつサンプル
    } catch (error) {
      console.log(`⚠️  Could not load ${file}:`, error.message);
    }
  }
  
  console.log(`📊 サンプルアイテム数: ${allItems.length}`);
  
  // ディレクトリ準備
  const publicIconsDir = path.join(__dirname, '../public/assets/icons');
  const categories = ['weapons', 'tools', 'npcs', 'bosses'];
  
  categories.forEach(category => {
    ensureDir(path.join(publicIconsDir, category));
  });
  
  let generatedCount = 0;
  
  // サンプルアイコン生成
  for (const item of allItems) {
    try {
      const category = item.type === 'boss' ? 'bosses' : `${item.type}s`;
      const fileName = `${item.id}.svg`;
      const filePath = path.join(publicIconsDir, category, fileName);
      
      const svgContent = generateSVGIcon(item.type, item.id, item.name);
      fs.writeFileSync(filePath, svgContent);
      
      generatedCount++;
      console.log(`✅ 生成: ${item.name} (${fileName})`);
      
    } catch (error) {
      console.log(`❌ エラー: ${item.name} - ${error.message}`);
    }
  }
  
  console.log(`\n📈 サンプルアイコン生成完了: ${generatedCount}個`);
  console.log('🎉 フォールバック機能をテストできます!');
};

// 実行
if (require.main === module) {
  generateSampleIcons();
}

module.exports = { generateSampleIcons };