# Claude Code 指示書
## プロジェクト名：STAMPON for Baby（赤ちゃん専用LINEスタンプ作成サービス）

---

## 0. 前提確認・作業開始前チェックリスト

```bash
# 1. 既存のSTAMPONリポジトリのルートに移動
cd /path/to/stampon

# 2. 現在のディレクトリ構成を確認
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" | head -50

# 3. 既存の環境変数を確認（値は表示しない）
cat .env.example || cat .env.local.example
```

---

## 1. ディレクトリ構成・ファイル複製

### タスク 1-1：新ディレクトリの作成

既存の `stampon/` または現在のルートディレクトリ構成を **そのままコピー** して、
`stampon-baby/` という新ディレクトリ（または `for-baby` ブランチ）を作成する。

```bash
# オプションA：別ディレクトリとして作成する場合
cp -r . ../stampon-baby
cd ../stampon-baby

# オプションB：同一リポジトリでブランチを切る場合
git checkout -b feature/for-baby
```

### タスク 1-2：確認すべき既存ファイル一覧

以下のファイルが存在することを確認し、それぞれを修正対象とする：

| ファイルパス（推定） | 役割 | 修正要否 |
|---|---|---|
| `app/page.tsx` または `pages/index.tsx` | トップページUI | ✅ 必須 |
| `app/api/generate/route.ts` | 画像生成APIロジック | ✅ 必須 |
| `app/api/checkout/route.ts` | Stripe決済API | ✅ 必須 |
| `app/api/download/route.ts` | ZIPダウンロードAPI | 🔲 サービス名のみ |
| `components/Logo.tsx` | ロゴコンポーネント | ✅ 必須 |
| `components/UploadForm.tsx` | アップロードフォーム | ✅ 必須 |
| `lib/prompts.ts` または `utils/prompts.ts` | プロンプト生成ロジック | ✅ 必須 |
| `app/legal/tokushoho/page.tsx` | 特商法ページ | ✅ 必須 |
| `app/legal/terms/page.tsx` | 利用規約ページ | ✅ 必須 |
| `app/legal/privacy/page.tsx` | プライバシーポリシーページ | ✅ 必須 |
| `.env.local` | 環境変数 | ✅ 必須 |
| `package.json` | プロジェクトメタ情報 | ✅ 必須 |

---

## 2. 環境変数の更新

`.env.local` に以下の変数を **追加・更新** する。
既存のペット版の変数は残しつつ、Baby版用を別名で定義する。

```bash
# .env.local に追記・更新する内容

# ===== STAMPON for Baby 専用 =====

# Stripe: Baby版用の新しい価格ID（480円）
# StripeダッシュボードでProduct→Price を新規作成し、そのIDをここに設定
STRIPE_PRICE_ID_BABY=price_XXXXXXXXXXXXXXXXXX

# サービス識別子（API内でペット版とBaby版を切り替えるために使用）
NEXT_PUBLIC_SERVICE_ID=baby

# サービス表示名
NEXT_PUBLIC_SERVICE_NAME="STAMPON for Baby"

# OGP・メタデータ用
NEXT_PUBLIC_SITE_URL=https://baby.stampon.ai   # デプロイ先URLに合わせて変更
NEXT_PUBLIC_OG_TITLE="STAMPON for Baby - うちの子が世界に一つだけのLINEスタンプに！"
NEXT_PUBLIC_OG_DESCRIPTION="赤ちゃんの写真をアップするだけ。AIが16枚のLINEスタンプを自動生成。スマホで5分、480円。"
```

> ⚠️ **Stripe設定手順**（開発者への補足）
> 1. Stripeダッシュボード → Products → 「STAMPON for Baby スタンプセット」を新規作成
> 2. 価格：480円（一括払い、JPY）
> 3. 生成されたPrice ID（`price_...`）を `STRIPE_PRICE_ID_BABY` に設定

---

## 3. ロゴコンポーネントの変更

### タスク 3-1：Logo コンポーネントを修正

`components/Logo.tsx`（または該当ファイル）を以下の仕様で更新する。

**変更仕様：**
- 「STAMPON」の文字は維持
- 「O」の文字のみを、スタンプの印影風の円形アイコンに置き換える
- 円の中に 👶 絵文字（またはSVGの赤ちゃんアイコン）を配置

```tsx
// components/LogoBaby.tsx として新規作成（既存LogoはそのままにBaby版を別コンポーネント化）

export function LogoBaby({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-0 font-black tracking-tight select-none ${className}`}>
      {/* "STAMP" テキスト部分 */}
      <span className="text-3xl font-black text-gray-900">STAMP</span>
      
      {/* "O" をスタンプアイコンに置き換え */}
      <span className="relative inline-flex items-center justify-center mx-0.5">
        {/* スタンプの印影風：二重円＋破線ボーダー */}
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-full text-xl
                     border-4 border-dashed border-red-500
                     bg-red-50 shadow-inner"
          style={{ letterSpacing: 0 }}
          aria-label="赤ちゃんアイコン"
        >
          👶
        </span>
      </span>
      
      {/* "N" テキスト部分 */}
      <span className="text-3xl font-black text-gray-900">N</span>
      
      {/* "for Baby" サブテキスト */}
      <span className="ml-2 text-sm font-semibold text-red-400 self-end mb-0.5">
        for Baby
      </span>
    </div>
  );
}
```

---

## 4. トップページUI（テキスト・コピーの置換）

`app/page.tsx`（または `pages/index.tsx`）を以下の通り修正する。

### 4-1：テキスト置換マップ

| 変更前（ペット版） | 変更後（Baby版） |
|---|---|
| `愛するペットがLINEスタンプになる！` | `うちの子が世界に一つだけのLINEスタンプに！` |
| `ペットの写真（必須）` | `赤ちゃんの写真（必須）` |
| `ペットの名前` | `赤ちゃんの名前` |
| `名前を入れると首輪に名前が入ります` | `入力するとスタイ（よだれかけ）や帽子に名前が入ります` |
| `ペット` | `赤ちゃん` |
| `STAMPON` (ロゴ単独表記) | `LogoBaby` コンポーネントに置換 |
| `<title>STAMPON - AIペットスタンプメーカー</title>` | `<title>STAMPON for Baby - AIベビースタンプメーカー</title>` |

### 4-2：入力フォーム変更（`components/UploadForm.tsx` または同等ファイル）

```tsx
// 変更箇所のみ抜粋。既存コードの構造は維持すること。

// ① 写真アップロードラベル
// Before: ペットの写真（必須）
// After:
<label>赤ちゃんの写真（必須）</label>

// ② 名前入力フィールド
// Before: ペットの名前（任意）
// After:
<label>赤ちゃんの名前（任意）</label>
<p className="text-xs text-gray-500 mt-1">
  入力するとスタイ（よだれかけ）や帽子に名前が入ります
</p>

// ③ 属性選択フィールド：ペット種別 → 性別選択に変更
// Before: 犬・猫・うさぎ etc. のペット種別選択
// After:
<fieldset>
  <legend className="text-sm font-medium text-gray-700 mb-2">
    性別（任意）
  </legend>
  <div className="flex gap-4">
    <label className="flex items-center gap-2">
      <input type="radio" name="gender" value="boy" />
      <span>男の子</span>
    </label>
    <label className="flex items-center gap-2">
      <input type="radio" name="gender" value="girl" />
      <span>女の子</span>
    </label>
    <label className="flex items-center gap-2">
      <input type="radio" name="gender" value="unspecified" defaultChecked />
      <span>指定なし</span>
    </label>
  </div>
</fieldset>

// ④ 顔の特徴選択フィールド（新規追加）
<fieldset>
  <legend className="text-sm font-medium text-gray-700 mb-2">
    顔の特徴（任意・複数選択可）
  </legend>
  <div className="flex flex-wrap gap-2">
    {['たれ目', 'ぷくぷくほっぺ', '大きな瞳', '丸顔', '一重まぶた', 'くりくり眉毛'].map((feature) => (
      <label key={feature} className="flex items-center gap-1 px-3 py-1 rounded-full border border-gray-200 text-sm cursor-pointer hover:bg-pink-50">
        <input type="checkbox" name="features" value={feature} className="sr-only" />
        <span>{feature}</span>
      </label>
    ))}
  </div>
</fieldset>
```

---

## 5. AI画像生成プロンプトの再定義

`lib/prompts.ts`（または `utils/prompts.ts`、`app/api/generate/route.ts` 内のプロンプト定義部分）を以下の通り **完全に置き換え** る。

### 5-1：スタンプセット定義（16枚）

```typescript
// lib/babyStampDefinitions.ts として新規作成

export interface BabyStampDefinition {
  id: number;
  text: string;       // スタンプに入るテキスト（日本語）
  pose: string;       // ポーズの説明（英語、プロンプト用）
  expression: string; // 表情の説明（英語、プロンプト用）
}

export const BABY_STAMP_DEFINITIONS: BabyStampDefinition[] = [
  {
    id: 1,
    text: 'おはよう！',
    pose: 'just waking up, stretching arms, sitting up in bed',
    expression: 'sleepy but happy smile, squinting eyes',
  },
  {
    id: 2,
    text: 'おやすみ',
    pose: 'sleeping peacefully, lying on side, small blanket',
    expression: 'eyes closed, peaceful smile, slightly open mouth (cute sleeping face)',
  },
  {
    id: 3,
    text: 'お疲れさま〜',
    pose: 'clapping hands (patty-cake gesture), both hands together',
    expression: 'big cheerful smile, laughing',
  },
  {
    id: 4,
    text: 'バイバ〜イ',
    pose: 'waving one hand goodbye, or rear view (back facing viewer, looking over shoulder)',
    expression: 'happy smile, bright eyes',
  },
  {
    id: 5,
    text: 'ありがとう！',
    pose: 'both hands touching cheeks (a la Home Alone pose)',
    expression: 'delighted blushing smile, sparkly eyes',
  },
  {
    id: 6,
    text: 'うれしい！',
    pose: 'banzai pose, both arms raised triumphantly above head',
    expression: 'wide open mouth smile, eyes curved with joy',
  },
  {
    id: 7,
    text: 'だいすき♡',
    pose: 'hugging a big red heart plushie or balloon',
    expression: 'loving smile, slightly squinted happy eyes',
  },
  {
    id: 8,
    text: 'できたよ！',
    pose: 'proud pose, pointing one index finger upward confidently',
    expression: 'smug satisfied expression (doya-gao), slight eyebrow raise',
  },
  {
    id: 9,
    text: 'いいね！',
    pose: 'thumbs up gesture with one hand, smiling',
    expression: 'cheerful grin, eyes turned upward happily',
  },
  {
    id: 10,
    text: 'ナイス！',
    pose: 'high-five stance, one palm raised and facing forward (ready for high five)',
    expression: 'excited energetic smile, wide open eyes',
  },
  {
    id: 11,
    text: '了解！',
    pose: 'salute pose, one hand raised to forehead',
    expression: 'confident smile, focused eyes',
  },
  {
    id: 12,
    text: 'がんばれ〜',
    pose: 'fist pump, raising clenched fist in encouragement',
    expression: 'enthusiastic cheering expression, mouth wide open',
  },
  {
    id: 13,
    text: 'ごめんね',
    pose: 'head tilted slightly, both hands fidgeting in front',
    expression: 'apologetic troubled face, puppy dog eyes',
  },
  {
    id: 14,
    text: 'あそぼ！',
    pose: 'holding out a colorful toy (rattle or plush) toward viewer',
    expression: 'inviting playful smile, bright eager eyes',
  },
  {
    id: 15,
    text: 'ねむい...',
    pose: 'rubbing one eye with fist, swaying slightly',
    expression: 'droopy heavy eyelids, yawning or half-closed eyes',
  },
  {
    id: 16,
    text: 'おねがい',
    pose: 'both hands pressed together in prayer/pleading gesture, looking upward',
    expression: 'upward puppy-dog gaze, big pleading eyes',
  },
];
```

### 5-2：プロンプト生成関数

```typescript
// lib/generateBabyPrompt.ts として新規作成

import { BabyStampDefinition } from './babyStampDefinitions';

interface BabyStampPromptOptions {
  babyName?: string;
  gender?: 'boy' | 'girl' | 'unspecified';
  faceFeatures?: string[]; // 例：['たれ目', 'ぷくぷくほっぺ']
  referenceImageDescription?: string; // Vision APIで取得した赤ちゃんの特徴
}

/**
 * 1枚分のスタンプ画像生成プロンプトを生成する
 */
export function generateBabyStampPrompt(
  stamp: BabyStampDefinition,
  options: BabyStampPromptOptions
): string {
  const { babyName, gender, faceFeatures = [], referenceImageDescription } = options;

  // 性別に基づく服装・アクセサリの指定
  const genderStyling =
    gender === 'girl'
      ? 'wearing a cute pink dress or onesie with a bow, pink accessories'
      : gender === 'boy'
      ? 'wearing a light blue onesie or overalls, cute baby sneakers'
      : 'wearing a neutral-colored cozy onesie';

  // 名前入りアイテムの指定（名前がある場合のみ）
  const nameEmbroidery = babyName
    ? `The baby's bib (yodarekake) or hat has the name "${babyName}" embroidered on it.`
    : '';

  // 顔の特徴の変換（日本語→英語）
  const featureMap: Record<string, string> = {
    'たれ目': 'droopy gentle eyes',
    'ぷくぷくほっぺ': 'chubby round cheeks',
    '大きな瞳': 'large round eyes',
    '丸顔': 'round chubby face',
    '一重まぶた': 'single eyelid',
    'くりくり眉毛': 'thick expressive eyebrows',
  };
  const featureDescription =
    faceFeatures.length > 0
      ? `Facial features: ${faceFeatures.map((f) => featureMap[f] || f).join(', ')}.`
      : '';

  // 参照画像の特徴（Vision APIから取得した場合）
  const referenceDesc = referenceImageDescription
    ? `Based on the uploaded photo: ${referenceImageDescription}.`
    : '';

  const prompt = `
Create a LINE sticker illustration of a cute baby (approximately 6-12 months old) in the following scene.

STYLE:
- Kawaii Japanese LINE sticker art style
- Clean bold outlines, flat coloring with soft cel-shading
- Chibi proportions: oversized round head (60% of body), tiny body
- Transparent or pure white background (suitable for LINE sticker)
- High contrast, vibrant but soft pastel colors
- Resolution: 370×320 pixels equivalent quality

BABY APPEARANCE:
- ${referenceDesc}
- ${featureDescription}
- Rosy chubby cheeks, button nose, small cute mouth
- ${genderStyling}
- ${nameEmbroidery}

POSE & EXPRESSION:
- Pose: ${stamp.pose}
- Expression: ${stamp.expression}

TEXT ON STICKER:
- Include the Japanese text "${stamp.text}" at the bottom of the sticker
- Font: rounded, friendly, bold Japanese font (similar to Rounded Mplus)
- Text color: contrasting color that is legible against the background
- Text should be cleanly integrated, not overlapping the baby

IMPORTANT:
- Single character only, no multiple babies
- No backgrounds, scenery, or props other than what is specified in the pose
- The baby should be centered with slight padding on all sides
- Style must be consistent across all 16 stickers in the set
`.trim();

  return prompt;
}
```

### 5-3：既存の API ルートへの組み込み

`app/api/generate/route.ts` の既存ロジックを以下のように修正する：

```typescript
// app/api/generate/route.ts の修正箇所（既存コードに追記・置換）

// 変更前（ペット版）のインポートを置き換え
// import { generatePetStampPrompt, PET_STAMP_DEFINITIONS } from '@/lib/prompts';

// 変更後（Baby版）
import { generateBabyStampPrompt, BABY_STAMP_DEFINITIONS } from '@/lib/generateBabyPrompt';
import { BabyStampDefinition } from '@/lib/babyStampDefinitions';

// ループ処理内のプロンプト生成部分を置き換え
// 既存のループ（16枚分の画像生成）を以下で置き換える:

for (const stamp of BABY_STAMP_DEFINITIONS) {
  const prompt = generateBabyStampPrompt(stamp, {
    babyName: formData.babyName || undefined,
    gender: formData.gender || 'unspecified',
    faceFeatures: formData.features || [],
    referenceImageDescription: imageAnalysisResult || undefined, // Vision API結果
  });

  // 以下は既存のDALL-E / Imagen APIコールをそのまま使用
  const imageResult = await generateImage(prompt); // 既存関数
  // ...
}
```

---

## 6. Stripe 決済APIの更新

`app/api/checkout/route.ts` を修正する。

```typescript
// 変更箇所のみ抜粋

// 変更前
const priceId = process.env.STRIPE_PRICE_ID;

// 変更後：サービスIDで切り替える（ペット版・Baby版の共存が必要な場合）
const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID || 'pet';
const priceId =
  serviceId === 'baby'
    ? process.env.STRIPE_PRICE_ID_BABY
    : process.env.STRIPE_PRICE_ID;

if (!priceId) {
  return NextResponse.json({ error: 'Price ID not configured' }, { status: 500 });
}

// Stripeセッション作成のメタデータ更新
const session = await stripe.checkout.sessions.create({
  // ... 既存のパラメータを維持 ...
  metadata: {
    service: 'stampon-baby',    // ← 変更
    version: '1.0.0',
  },
  payment_intent_data: {
    metadata: {
      service: 'STAMPON for Baby',   // ← 変更
    },
  },
});
```

---

## 7. 法的ページの更新

以下の3ページについて、サービス名の文字列置換のみ実施する。
ロジックや構造は変更不要。

### 置換ルール（全法的ページ共通）

```
"STAMPON"     → "STAMPON for Baby"  （ロゴではなくテキスト表記の箇所のみ）
"ペット"      → "赤ちゃん"
"AIペットスタンプ" → "AIベビースタンプ"
"ペットの画像" → "赤ちゃんの画像"
"ペットスタンプ" → "ベビースタンプ"
```

### 各ファイルの確認ポイント

**特商法（`app/legal/tokushoho/page.tsx`）**
- 「販売商品：〇〇」の商品名を更新
- サービスURLを `baby.stampon.ai` 等に更新

**利用規約（`app/legal/terms/page.tsx`）**
- 第1条のサービス定義文を更新
- 「本サービス」の定義を「STAMPON for Baby」に更新

**プライバシーポリシー（`app/legal/privacy/page.tsx`）**
- 取得情報の種類に「赤ちゃんの写真」を明記（「ペットの写真」から変更）
- サービス名を全箇所更新

---

## 8. `package.json` の更新

```json
{
  "name": "stampon-for-baby",
  "version": "1.0.0",
  "description": "STAMPON for Baby - AI-powered baby LINE sticker maker"
}
```

---

## 9. OGP・メタデータの更新

`app/layout.tsx`（または `pages/_app.tsx` / `_document.tsx`）の metadata を更新：

```typescript
// app/layout.tsx

export const metadata: Metadata = {
  title: 'STAMPON for Baby - AIベビースタンプメーカー',
  description:
    'うちの子が世界に一つだけのLINEスタンプに！赤ちゃんの写真をアップするだけ。AIが16枚のオリジナルスタンプを自動生成。スマホで5分、480円。',
  openGraph: {
    title: 'STAMPON for Baby - うちの子が世界に一つだけのLINEスタンプに！',
    description:
      '赤ちゃんの写真をアップするだけ。AIが16枚のLINEスタンプを自動生成。スマホで5分、480円。',
    siteName: 'STAMPON for Baby',
    // images, url は環境変数から取得
  },
  twitter: {
    card: 'summary_large_image',
    title: 'STAMPON for Baby',
    description: 'うちの子が世界に一つだけのLINEスタンプに！',
  },
};
```

---

## 10. 動作確認チェックリスト

すべての実装が完了したら、以下の順番でテストすること：

### ローカル開発環境

```bash
# 依存パッケージのインストール（新規ファイル追加後）
npm install

# 開発サーバー起動
npm run dev

# TypeScriptの型チェック
npx tsc --noEmit

# ビルドテスト
npm run build
```

### 機能テスト項目

| テスト項目 | 確認内容 | 合否 |
|---|---|---|
| トップページ | ロゴが「STAMPON 👶 N for Baby」表示 | ☐ |
| フォーム | 「赤ちゃんの写真（必須）」が表示される | ☐ |
| フォーム | 「性別」選択（男の子/女の子/指定なし）が機能する | ☐ |
| フォーム | 「顔の特徴」チェックボックスが機能する | ☐ |
| フォーム | 「赤ちゃんの名前」入力でヒントテキストが表示される | ☐ |
| 画像生成 | 16種類すべてのスタンプが生成される | ☐ |
| 画像生成 | スタンプに正しい日本語テキストが入る | ☐ |
| Stripe | `STRIPE_PRICE_ID_BABY` のPriceで決済セッションが作成される | ☐ |
| Stripe | 金額が480円になっている | ☐ |
| ダウンロード | ZIPファイルに16枚が入っている | ☐ |
| 法的ページ | 「ペット」表記が残っていないことを確認 | ☐ |
| メタデータ | OGPタイトルが「STAMPON for Baby」になっている | ☐ |

---

## 11. Vercel デプロイ設定

### 新規Vercelプロジェクトの設定

```bash
# Vercel CLIでデプロイ（新規プロジェクトとして）
vercel --name stampon-for-baby

# または既存プロジェクトとは別プロジェクトとしてVercel UIから設定
```

### 環境変数（Vercel Dashboard → Settings → Environment Variables）

以下を本番環境に設定する：

```
STRIPE_SECRET_KEY          = sk_live_...（既存と共有可）
STRIPE_PRICE_ID_BABY       = price_...（Baby版専用）
STRIPE_WEBHOOK_SECRET      = whsec_...（Baby版用webhookエンドポイントを作成）
OPENAI_API_KEY             = sk-...（既存と共有可）
NEXT_PUBLIC_SERVICE_ID     = baby
NEXT_PUBLIC_SERVICE_NAME   = STAMPON for Baby
NEXT_PUBLIC_SITE_URL       = https://baby.stampon.ai
```

---

## 12. 注意事項・禁止事項

1. **既存STAMPONのコードは直接編集しない** - コピーしたBaby版のみ修正
2. **Stripeのペット版Price IDは変更しない** - Baby版は必ず新しいPrice IDを使用
3. **16枚のスタンプ定義を省略しない** - 全16枚分のプロンプト定義が必須
4. **法的ページの連絡先情報は変更しない** - 事業者情報はそのまま維持
5. **プロンプトは英語で記述** - 画像生成AIへの指示は英語が精度が高い
### 🔴 注意事項
- ⚠️ ペット版・Baby版が同一リポジトリ（nobuki97/stampon）を共有中
- 将来的に別リポジトリへの分離を検討（現状は問題なし）

---

*このドキュメントは STAMPON for Baby 開発用 Claude Code 指示書です。*
*作成日：2026-04-03*
