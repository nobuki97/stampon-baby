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
    <div className="bg-white rounded-3xl p-6 shadow-md border border-pink-100 flex flex-col gap-4">

      {/* ②スマホ保存ボタン */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-gray-500 text-center">📱 スマホで画像として使う（初心者向け）</p>
        <button onClick={handleSave} disabled={saving}
          className="w-full py-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-lg shadow-md hover:shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
          {saving ? '保存中... ' + progress + ' / 16枚' : saved ? '✅ 保存完了！（もう一度保存）' : '📱 16枚をスマホに保存する'}
        </button>
        {saving && (
          <div className="w-full bg-pink-100 rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-300" style={{ width: (progress / 16 * 100) + '%' }} />
          </div>
        )}
      </div>

      <div className="border-t border-pink-100" />

      {/* ①ZIPダウンロードボタン */}
      <div className="flex flex-col gap-2">
        <p className="text-xs font-bold text-gray-500 text-center">📦 LINEスタンプとして正式登録する（上級者向け）</p>
        <button onClick={handleZip} disabled={zipping}
          className="w-full py-4 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 text-white font-bold text-lg shadow-md hover:shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
          {zipping ? '⏳ 準備中...' : zipped ? '✅ ダウンロード完了！（再ダウンロード）' : '📦 ZIPをダウンロードする'}
        </button>
        <a href="/guide" className="text-center text-xs text-pink-400 font-bold">LINEスタンプ申請ガイドを見る →</a>
      </div>

      {/* スマホ保存後のガイド */}
      {saved && (
        <div className="flex flex-col gap-3 mt-2">
          <h3 className="font-bold text-gray-700 text-base">📂 LINEで使う方法</h3>
          {[
            { num: '1', text: '写真アプリを開いて「アルバム」→「＋」→「新規アルバム」を作成' },
            { num: '2', text: 'アルバム名を「LINEスタンプ」にする' },
            { num: '3', text: '保存した16枚をそのアルバムに追加する' },
            { num: '4', text: 'LINEのトークで画像送信ボタンをタップ' },
            { num: '5', text: '「LINEスタンプ」アルバムを選んでスタンプを送る' },
          ].map((step) => (
            <div key={step.num} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-black text-xs flex items-center justify-center shrink-0">{step.num}</div>
              <p className="text-sm text-gray-600 leading-relaxed pt-0.5">{step.text}</p>
            </div>
          ))}
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 text-xs text-gray-500">
            <p className="font-bold text-gray-600 mb-1">💡 ポイント</p>
            <p>アルバムを一度作れば次回からすぐ選べます！</p>
          </div>
        </div>
      )}
    </div>
  )
}