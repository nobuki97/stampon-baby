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

#### 移行後のディレクトリ構成

```
stampon-monorepo/
├── app/
│   ├── config/
│   │   ├── index.ts        ← NEXT_PUBLIC_VARIANT を読んで型安全にエクスポート
│   │   ├── baby.ts         ← Baby版の全設定（テキスト・ポーズ・メタデータ等）
│   │   └── pet.ts          ← Pet版の全設定
│   ├── components/
│   │   ├── baby/
│   │   │   ├── CharacterSetup.tsx  ← baby専用
│   │   │   └── StampGenerator.tsx  ← baby専用
│   │   ├── pet/
│   │   │   ├── CharacterSetup.tsx  ← pet専用
│   │   │   └── StampGenerator.tsx  ← pet専用
│   │   ├── StampCard.tsx           ← 共通（変更なし）
│   │   └── DownloadSection.tsx     ← 共通（変更なし）
│   ├── api/
│   │   ├── generate/route.ts       ← variant分岐（キャラクター説明・プロンプトが異なる）
│   │   ├── checkout/route.ts       ← variant分岐（メタデータフィールド・商品名が異なる）
│   │   ├── verify-session/route.ts ← variant分岐（メタデータフィールドが異なる）
│   │   ├── generate-stamp/route.ts ← 共通（両版で完全一致）
│   │   └── stamps/route.ts         ← 共通（両版で完全一致）
│   ├── layout.tsx                  ← variant別metadata
│   └── page.tsx                    ← variantでコンポーネント切替
└── package.json
```

#### Vercel設定（移行後）

| Vercelプロジェクト | GitHubリポジトリ | 環境変数 |
|---|---|---|
| `stampon-for-baby` | nobuki97/stampon-monorepo | `NEXT_PUBLIC_VARIANT=baby` |
| `stampon` | nobuki97/stampon-monorepo | `NEXT_PUBLIC_VARIANT=pet` |

両プロジェクトとも同じ `main` ブランチをデプロイ → バグ修正が1回で両方に反映。

#### 両版の差分まとめ（移行時の参考）

| ファイル | 状態 |
|---|---|
| `app/api/generate-stamp/route.ts` | 完全一致（共通化そのまま） |
| `app/api/stamps/route.ts` | 完全一致（共通化そのまま） |
| `app/lib/constants.ts` | STAMP_TEXTS・POSES が異なる。EXPRESSIONSはbaby版のみ |
| `app/layout.tsx` | metadataのみ異なる |
| `app/components/CharacterSetup.tsx` | 入力項目が全く異なる（赤ちゃん情報 vs ペット情報） |
| `app/components/StampGenerator.tsx` | 大幅に異なる（383行 vs 340行）。baby版にYoutubeSection・LineGuide・FACE_FEATURESあり |
| `app/api/generate/route.ts` | buildBabyDesc vs buildCharacterDesc。プロンプト・デフォルトstyleが異なる |
| `app/api/checkout/route.ts` | メタデータフィールド名・商品名・originが異なる |
| `app/api/verify-session/route.ts` | メタデータフィールド名が異なる |

#### 移行手順（実施時）

1. 新リポジトリ `nobuki97/stampon-monorepo` 作成
2. `app/config/` ディレクトリと `baby.ts` / `pet.ts` / `index.ts` 作成
3. 共通コンポーネント（StampCard, DownloadSection, generate-stamp, stamps）をそのまま移行
4. variant別コンポーネントを `app/components/baby/` と `app/components/pet/` に分離
5. API routeを `process.env.NEXT_PUBLIC_VARIANT` で分岐
6. `page.tsx` / `layout.tsx` のvariant分岐実装
7. Vercel両プロジェクトの環境変数に `NEXT_PUBLIC_VARIANT` を設定
8. 旧リポジトリ（stampon / stampon-baby）をアーカイブ

### ✅ 実装済み
- [x] 生成画像のサーバー一時保存（Vercel Blob）
- [x] 接続切れ時の自動再接続・途中再開機能
- [x] LINE・Instagram/Facebook インアプリブラウザ検出

### 🗑️ 削除待ち
- [ ] 不要になったブランチ・旧プロジェクトの整理
