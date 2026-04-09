@AGENTS.md

## リポジトリ構成

| リポジトリ | ブランチ | Vercelプロジェクト | URL |
|---|---|---|---|
| `nobuki97/stampon`（ペット版） | `main` | `stampon` | stampon-two.vercel.app |
| `nobuki97/stampon-baby`（このリポジトリ） | `main` | `stampon-for-baby` | stampon-for-baby.vercel.app（Baby版） |

## デプロイルール

- デプロイは **git push のみ**。Vercel Git Integration が自動デプロイする。
- Baby版の変更：このリポジトリ（`nobuki97/stampon-baby`）の `main` に push
- ペット版の変更：`nobuki97/stampon` リポジトリの `main` に push
- `vercel deploy --prod` は使用禁止
- `git checkout baby` は使わない（Baby版はこの別リポジトリで管理）

## サービス情報

- サービス名：**STAMPON for Baby**
- 対象：赤ちゃん専用LINEスタンプ作成サービス
- URL：https://stampon-for-baby.vercel.app
- Vercelプロジェクト：`stampon-for-baby`

## 未対策・将来対応事項

### 🟡 中期対応
- [ ] 両版でStripe商品名が別・価格同一 → 売上レポートが見づらい（Stripeで別商品として管理を検討）
- [ ] 共通バグ修正の二重管理 → stamponとstampon-babyで同じ修正を2回する必要あり

### 🟢 将来対応（英語版・子供版追加時）
- [ ] モノレポ × NEXT_PUBLIC_VARIANT方式への移行（設計済み）
  - app/config/pet.ts、app/config/baby.ts で設定を完全分離
  - 1リポジトリ・1ブランチで全シリーズ管理
  - 新シリーズ追加が設定ファイル1本で完結

### ✅ 実装済み
- [x] 生成画像のサーバー一時保存（Vercel Blob）
- [x] 接続切れ時の自動再接続・途中再開機能
- [x] LINE・Instagram/Facebook インアプリブラウザ検出

### 🗑️ 削除待ち
- [ ] 不要になったブランチ・旧プロジェクトの整理
