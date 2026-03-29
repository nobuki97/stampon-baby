'use client'

import { useState } from 'react'
import JSZip from 'jszip'

interface Props {
  stampDataURLs: string[]
}

const STAMP_W = 370
const STAMP_H = 320
const MAIN_W = 240
const MAIN_H = 240
const TAB_W = 96
const TAB_H = 74

const README = `\uFEFF\u25a0 LINE\u30b9\u30bf\u30f3\u30d7\u7533\u8acb\u30ac\u30a4\u30c9

\u3010ZIP\u306e\u5185\u5bb9\u3011
\u30fbmain.png    \u2192 \u30e1\u30a4\u30f3\u753b\u50cf\uff08240\u00d7240px\uff09
\u30fbtab.png     \u2192 \u30bf\u30d6\u753b\u50cf\uff0896\u00d774px\uff09
\u30fbstamp_01\uff5e16.png \u2192 \u30b9\u30bf\u30f3\u30d7\u753b\u50cf\uff08370\u00d7320px\uff09

\u3010\u7533\u8acb\u624b\u9806\u3011
1. https://creator.line.me/ja/ \u306b\u30ed\u30b0\u30a4\u30f3
2. \u300c\u30b9\u30bf\u30f3\u30d7\u300d\u2192\u300c\u65b0\u898f\u767b\u9332\u300d
3. \u30b9\u30bf\u30f3\u30d7\u7de8\u96c6\u753b\u9762\u3067 stamp_01\uff5estamp_16 \u3092\u767b\u9332
4. \u30e1\u30a4\u30f3\u753b\u50cf\u306b main.png \u3092\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9
5. \u30bf\u30d6\u753b\u50cf\u306b tab.png \u3092\u30a2\u30c3\u30d7\u30ed\u30fc\u30c9
6. \u30bf\u30a4\u30c8\u30eb\u30fb\u8aac\u660e\u6587\u30fbAI\u306e\u4f7f\u7528\uff08\u8981\u30c1\u30a7\u30c3\u30af\uff09\u3092\u5165\u529b
7. \u300c\u5be9\u67fb\u7533\u8acb\u300d\u2192 1\uff5e3\u65e5\u3067\u5be9\u67fb\u5b8c\u4e86

\u3010\u6ce8\u610f\u3011
\u30fbAI\u3092\u4f7f\u7528\u3057\u3066\u3044\u307e\u3059 \u2190 \u5fc5\u305a\u30c1\u30a7\u30c3\u30af
\u30fb\u8457\u4f5c\u6a29: \u00a9 2026 Nobrich`

async function resizeDataUrl(dataUrl: string, w: number, h: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('canvas context failed')); return }
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('image load failed'))
    img.src = dataUrl
  })
}

function dataUrlToBase64(dataUrl: string): string {
  return dataUrl.split(',')[1] ?? ''
}

const STEPS = [
  'ZIPファイルを解凍して、各画像を用意します。',
  'LINE Creators Studio（creator.line.me）にアクセスし、LINEアカウントでログインします。',
  '「スタンプ」→「新規登録」をクリックし、タイトルや説明など必要事項を入力します。',
  'stamp_01〜stamp_16.png を各スタンプ枠にアップロードします。',
  'メイン画像に main.png（240×240px）をアップロードします。',
  'タブ画像に tab.png（96×74px）をアップロードします。',
  'AI使用のチェックを入れて「審査申請」。審査は1〜3日程度です。',
]

export default function DownloadSection({ stampDataURLs }: Props) {
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const zip = new JSZip()

      // stamp_01〜16.png — 370×320px
      await Promise.all(
        stampDataURLs.map(async (url, i) => {
          const resized = await resizeDataUrl(url, STAMP_W, STAMP_H)
          zip.file(`stamp_${String(i + 1).padStart(2, '0')}.png`, dataUrlToBase64(resized), {
            base64: true,
          })
        }),
      )

      // main.png — 240×240px (from stamp 1)
      const mainResized = await resizeDataUrl(stampDataURLs[0], MAIN_W, MAIN_H)
      zip.file('main.png', dataUrlToBase64(mainResized), { base64: true })

      // tab.png — 96×74px (from stamp 1)
      const tabResized = await resizeDataUrl(stampDataURLs[0], TAB_W, TAB_H)
      zip.file('tab.png', dataUrlToBase64(tabResized), { base64: true })

      // README.txt
      zip.file('README.txt', README)

      const blob = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'pet-stamps.zip'
      link.click()
      URL.revokeObjectURL(link.href)
      setDownloaded(true)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-pink-100">
      {/* ZIP contents info */}
      <div className="mb-4 bg-pink-50 rounded-2xl px-4 py-3 text-xs text-gray-500 space-y-0.5">
        <p className="font-bold text-gray-600 mb-1">📦 ZIPの内容</p>
        <p>・stamp_01〜16.png（370×320px）</p>
        <p>・main.png（240×240px）</p>
        <p>・tab.png（96×74px）</p>
        <p>・README.txt（申請ガイド）</p>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full py-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-lg shadow-md hover:shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {downloading
          ? '⏳ 準備中...'
          : downloaded
          ? '✅ ダウンロード完了！（再ダウンロード）'
          : '📦 まとめてダウンロード（ZIP）'}
      </button>

      {/* LINE instructions — shown after download */}
      {downloaded && (
        <div className="mt-6">
          <h3 className="font-bold text-gray-700 text-base mb-4 flex items-center gap-2">
            <span className="text-xl">📱</span>
            LINEスタンプメーカーへの取り込み手順
          </h3>
          <ol className="space-y-3">
            {STEPS.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-600">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 text-white flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700">
            <p className="font-bold mb-1">💡 スマホからの場合</p>
            <p>
              App Store / Google Play で「<strong>LINE Creators Studio</strong>
              」アプリをインストールすると、スマホから直接画像をアップロードできます。
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
