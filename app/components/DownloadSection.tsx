[System.IO.File]::WriteAllText("C:\Users\nobhi\pet-stamp-app\app\components\DownloadSection.tsx", "'use client'

import { useState } from 'react'
import JSZip from 'jszip'

interface Props {
  stampDataURLs: string[]
}

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

function isInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('line') || ua.includes('instagram') || ua.includes('fbav') || ua.includes('twitter')
}

export default function DownloadSection({ stampDataURLs }: Props) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [progress, setProgress] = useState(0)
  const [zipping, setZipping] = useState(false)
  const [zipped, setZipped] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const inAppBrowser = isInAppBrowser()

  const handleSaveAll = async () => {
    setSaving(true)
    setProgress(0)
    for (let i = 0; i < stampDataURLs.length; i++) {
      const url = stampDataURLs[i]
      if (!url) continue
      const a = document.createElement('a')
      a.href = url
      a.download = `stamp_${String(i + 1).padStart(2, '0')}.png`
      a.click()
      await new Promise(r => setTimeout(r, 300))
      setProgress(i + 1)
    }
    setSaving(false)
    setSaved(true)
  }

  const handleZip = async () => {
    setZipping(true)
    try {
      const zip = new JSZip()
      for (let i = 0; i < stampDataURLs.length; i++) {
        const url = stampDataURLs[i]
        if (!url) continue
        const resized = await resizeDataUrl(url, 370, 320)
        zip.file(`${String(i + 1).padStart(2, '0')}.png`, dataUrlToBase64(resized), { base64: true })
      }
      if (stampDataURLs[0]) {
        const main = await resizeDataUrl(stampDataURLs[0], 240, 240)
        zip.file('main.png', dataUrlToBase64(main), { base64: true })
      }
      if (stampDataURLs[0]) {
        const tab = await resizeDataUrl(stampDataURLs[0], 96, 74)
        zip.file('tab.png', dataUrlToBase64(tab), { base64: true })
      }
      const blob = await zip.generateAsync({ type: 'blob' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'stampon_line.zip'
      a.click()
      setZipped(true)
    } finally {
      setZipping(false)
    }
  }

  const openInChrome = () => {
    window.location.href = 'googlechrome://' + window.location.href.replace(/^https?:\/\//, '')
  }

  return (
    <div className='flex flex-col gap-4'>

      {inAppBrowser && (
        <div className='bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 flex flex-col gap-3'>
          <p className='text-sm font-black text-yellow-700'>LINEブラウザではダウンロードできません</p>
          <p className='text-xs text-yellow-600 leading-relaxed'>ダウンロードにはChromeが必要です。下のボタンでChromeを開いてください。</p>
          <button onClick={openInChrome} className='w-full py-3 rounded-full bg-yellow-400 text-white font-bold text-sm shadow-md hover:opacity-90 active:scale-[0.98] transition-all'>
            Chromeで開く
          </button>
        </div>
      )}

      <div className='flex flex-col gap-3 bg-pink-50 rounded-2xl p-4 border border-pink-100'>
        <p className='text-sm font-black text-pink-600'>スタンプ画像を保存する</p>
        <p className='text-xs text-gray-500 leading-relaxed'>16枚をスマホに保存します。保存後は「ファイル」アプリ→「ダウンロード」フォルダで確認できます。LINEやSNSのアイコンとしてお使いいただけます。</p>
        <button onClick={handleSaveAll} disabled={saving} className='w-full py-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-lg shadow-md hover:shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed'>
          {saving ? '保存中... ' + progress + ' / 16枚' : saved ? '保存完了！（もう一度保存）' : '16枚を保存する'}
        </button>
        {saving && (
          <div className='w-full bg-pink-100 rounded-full h-2 overflow-hidden'>
            <div className='h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-300' style={{ width: (progress / 16 * 100) + '%' }} />
          </div>
        )}
        {saved && (
          <div className='bg-white rounded-xl p-3 border border-pink-200'>
            <p className='text-xs font-black text-pink-600 mb-1'>保存場所の確認方法</p>
            <p className='text-xs text-gray-500 leading-relaxed'>Androidの場合：「ファイル」アプリ→「ダウンロード」フォルダ</p>
            <p className='text-xs text-gray-500 leading-relaxed'>iPhoneの場合：「ファイル」アプリ→「ダウンロード」フォルダ</p>
          </div>
        )}
      </div>

      <div className='flex flex-col gap-3 bg-green-50 rounded-2xl p-4 border border-green-100'>
        <p className='text-sm font-black text-green-600'>LINEスタンプとして使う</p>
        <p className='text-xs text-gray-500 leading-relaxed'>ZIPファイルをダウンロードして、LINEスタンプに登録します。</p>
        <div className='flex flex-col gap-2'>
          <div className='bg-white rounded-xl p-3 border border-green-200'>
            <p className='text-xs font-black text-green-700 mb-1'>A. 個人用（すぐ使える・無料）</p>
            <p className='text-xs text-gray-500 leading-relaxed'>登録後すぐ自分用として無料で使えます。販売はできません。</p>
          </div>
          <div className='bg-white rounded-xl p-3 border border-green-200'>
            <p className='text-xs font-black text-green-700 mb-1'>B. 販売用（審査2〜3日後に販売可）</p>
            <p className='text-xs text-gray-500 leading-relaxed'>審査通過後にLINE Creators Marketで有料販売もできます。</p>
          </div>
        </div>
        <button onClick={handleZip} disabled={zipping || inAppBrowser} className='w-full py-4 rounded-full bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold text-lg shadow-md hover:shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed'>
          {zipping ? '準備中...' : zipped ? 'ダウンロード完了！（再ダウンロード）' : 'ZIPをダウンロードする'}
        </button>
        <button onClick={() => setGuideOpen(v => !v)} className='w-full py-3 rounded-full border-2 border-green-300 text-green-600 font-bold text-sm hover:bg-green-100 transition-colors'>
          {guideOpen ? 'ガイドを閉じる ▲' : 'LINEスタンプ申請ガイドを見る ▼'}
        </button>
        {guideOpen && (
          <div className='flex flex-col gap-4 bg-white rounded-2xl p-4 border border-green-200 text-xs text-gray-600 leading-relaxed'>
            <div>
              <p className='font-black text-green-700 mb-2'>A. 個人用（無料）の申請手順</p>
              <ol className='flex flex-col gap-1 list-decimal list-inside'>
                <li>ZIPを解凍して16枚の画像を確認する</li>
                <li>LINEスタンプメーカーアプリをインストール</li>
                <li>アプリを開いてスタンプを作成をタップ</li>
                <li>16枚の画像を1枚ずつ登録する</li>
                <li>販売情報で無料ダウンロード・売上分配なしを選択</li>
                <li>販売申請をタップして審査に提出</li>
                <li>審査通過後（1〜3日）、自分のLINEで無料利用できる</li>
              </ol>
            </div>
            <div>
              <p className='font-black text-green-700 mb-2'>B. 販売用の申請手順</p>
              <ol className='flex flex-col gap-1 list-decimal list-inside'>
                <li>ZIPを解凍して16枚の画像を確認する</li>
                <li>LINEスタンプメーカーアプリをインストール</li>
                <li>アプリを開いてスタンプを作成をタップ</li>
                <li>16枚の画像を1枚ずつ登録する</li>
                <li>販売情報で有料ダウンロード・売上分配ありを選択</li>
                <li>価格（120円〜）を設定する</li>
                <li>販売申請をタップして審査に提出</li>
                <li>審査通過後（2〜3日）、LINE Creators Marketで販売開始</li>
              </ol>
            </div>
            <div className='bg-yellow-50 rounded-xl p-3 border border-yellow-200'>
              <p className='font-black text-yellow-700 mb-1'>注意事項</p>
              <ul className='flex flex-col gap-1 list-disc list-inside'>
                <li>01.png〜16.pngをそのまま使用してください</li>
                <li>main.pngはメイン画像として登録してください</li>
                <li>tab.pngはタブ画像として登録してください</li>
              </ul>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}", [System.Text.Encoding]::UTF8)
