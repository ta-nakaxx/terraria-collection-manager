# Vercelデプロイメントガイド

## 成功したデプロイ構成

### 推奨設定
- **vercel.json**: 使用しない（Next.jsの自動設定を活用）
- **デプロイ方法**: GitHub統合 + Deploy Hooks

### Deploy Hook設定
1. Vercel Dashboard → Settings → Git → Deploy Hooks
2. Hook名: `GitHub Auto Deploy`
3. Branch: `main`
4. GitHub Webhook URL: 生成されたDeploy Hook URLを使用

## よくあるエラーと解決方法

### 1. Conflicting Configuration Error
```
Error: Conflicting functions and builds configuration
```
**解決**: `vercel.json`から`builds`配列を削除、または`vercel.json`を完全削除

### 2. TypeScript Compilation Errors
**予防策**:
- ローカルで`npm run build`を実行してからpush
- コンポーネント名とimport名の一致を確認
- 型定義の整合性を保つ

### 3. Dynamic Import Issues
**予防策**:
- ファイルを削除/移動する際は、importしているコードも更新
- コメントアウト時は依存する全コードを確認

## 開発フロー
1. **ローカルテスト**: `npm run build`で事前確認
2. **型チェック**: TypeScriptエラーがないことを確認
3. **Git Push**: 自動デプロイがトリガー
4. **Vercel確認**: デプロイ状況をモニタリング

## 緊急時の対応
### デプロイ失敗時
1. Vercel Dashboard → Deployments → 失敗したデプロイをクリック
2. Build Logsでエラー詳細を確認
3. 該当コミットを特定してローカルで修正
4. 修正後にpushして再デプロイ

### キャッシュ問題
- Project Settings → General → Clear Build Cache

## 注意事項
- `vercel.json`の設定変更は慎重に行う
- 大きなデータファイルはビルド時間に影響する可能性あり
- TypeScript厳密モードでの型整合性を保つ