'use client'

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
      ctx.clearRect(0, 0, w, h)
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

export default function DownloadSection({ stampDataURLs }: Props) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [progress, setProgress] = useState(0)
  const [zipping, setZipping] = useState(false)
  const [zipped, setZipped] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setProgress(0)
    try {
      for (let i = 0; i < stampDataURLs.length; i++) {
        const resized = await resizeDataUrl(stampDataURLs[i], 370, 320)
        const link = document.createElement('a')
        link.href = resized
        link.download = 'stamp_' + String(i + 1).padStart(2, '0') + '.png'
        link.click()
        await new Promise(r => setTimeout(r, 300))
        setProgress(i + 1)
      }
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  const handleZip = async () => {
    setZipping(true)
    try {
      const zip = new JSZip()
      await Promise.all(
        stampDataURLs.map(async (url, i) => {
          const resized = await resizeDataUrl(url, 370, 320)
          zip.file('stamp_' + String(i + 1).padStart(2, '0') + '.png', dataUrlToBase64(resized), { base64: true })
        })
      )
      const main = await resizeDataUrl(stampDataURLs[0], 240, 240)
      zip.file('main.png', dataUrlToBase64(main), { base64: true })
      const tab = await resizeDataUrl(stampDataURLs[0], 96, 74)
      zip.file('tab.png', dataUrlToBase64(tab), { base64: true })
      const blob = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'pet-stamps.zip'
      link.click()
      URL.revokeObjectURL(link.href)
      setZipped(true)
    } finally {
      setZipping(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-pink-100 flex flex-col gap-6">

      <div className="text-center">
        <p className="text-lg font-black text-gray-700">STAMPON</p>
        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">16枚完成！</p>
        <p className="text-sm text-gray-400 mt-1">使い方を選んでください</p>
      </div>

      <div className="flex flex-col gap-3 bg-pink-50 rounded-2xl p-4 border border-pink-100">
        <p className="text-sm font-black text-pink-500">[スマホ] 画像として使う</p>
        <p className="text-xs text-gray-500 leading-relaxed">LINEに登録せず画像スタンプとしてそのまま使えます。ボタンを押すと1枚ずつ連続で画像フォルダに保存されます。保存後すぐに使えます。</p>
        <button onClick={handleSave} disabled={saving}
          className="w-full py-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-lg shadow-md hover:shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
          {saving ? '保存中... ' + progress + ' / 16枚' : saved ? '保存完了！（もう一度保存）' : '16枚を画像フォルダに保存する'}
        </button>
        {saving && (
          <div className="w-full bg-pink-100 rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-300" style={{ width: (progress / 16 * 100) + '%' }} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 bg-green-50 rounded-2xl p-4 border border-green-100">
        <p className="text-sm font-black text-green-600">[LINE] 16枚をLINEスタンプとして使う</p>
        <p className="text-xs text-gray-500 leading-relaxed">ZIPファイルをダウンロードしてLINEスタンプに登録します。登録時に以下のどちらかを選んでください。</p>

        <div className="flex flex-col gap-2">
          <div className="bg-white rounded-xl p-3 border border-green-200">
            <p className="text-xs font-black text-green-700 mb-1">A. 個人用（すぐ使える・無料）</p>
            <p className="text-xs text-gray-500 leading-relaxed">登録後すぐ自分用として無料で使えます。販売はできません。</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-green-200">
            <p className="text-xs font-black text-green-700 mb-1">B. 販売用（審査2〜3日後に販売可）</p>
            <p className="text-xs text-gray-500 leading-relaxed">審査通過後にLINE Creators Marketで有料販売もできます。</p>
          </div>
        </div>

        <button onClick={handleZip} disabled={zipping}
          className="w-full py-4 rounded-full bg-gradient-to-r from-green-400 to-teal-400 text-white font-bold text-lg shadow-md hover:shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
          {zipping ? '準備中...' : zipped ? 'ダウンロード完了！（再ダウンロード）' : 'ZIPをダウンロードする'}
        </button>
        <a href="/guide" className="text-center text-xs text-green-500 font-bold">LINEスタンプ申請ガイドを見る</a>
      </div>

    </div>
  )
}
