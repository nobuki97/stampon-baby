'use client'

import { useState, useRef, useCallback } from 'react'
import { STAMP_TEXTS } from '@/app/lib/constants'

type StyleType = 'ghibli' | 'watercolor' | 'chibi' | 'pastel'
type Phase = 'setup' | 'trial_generating' | 'trial_done' | 'generating' | 'done'

const STYLES: { value: StyleType; label: string; emoji: string }[] = [
  { value: 'ghibli', label: 'ジブリ風', emoji: '🎨' },
  { value: 'watercolor', label: '水彩画風', emoji: '🖌️' },
  { value: 'chibi', label: 'ちびキャラ', emoji: '🐾' },
  { value: 'pastel', label: 'パステル', emoji: '🌸' },
]

const FIXED_PHRASES = [...STAMP_TEXTS] as string[]

function resizeImage(file: File, maxSize = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('ファイル読み込みエラー'))
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error('画像読み込みエラー'))
      img.onload = () => {
        const { width, height } = img
        let w = width
        let h = height
        if (w > maxSize || h > maxSize) {
          if (w > h) { h = Math.round(h * maxSize / w); w = maxSize }
          else { w = Math.round(w * maxSize / h); h = maxSize }
        }
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) { reject(new Error('canvas error')); return }
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.92))
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

export default function StampGenerator() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [photo, setPhoto] = useState<string | null>(null)
  const [breed, setBreed] = useState('')
  const [color, setColor] = useState('')
  const [pattern, setPattern] = useState('')
  const [feature, setFeature] = useState('')
  const [petName, setPetName] = useState('')
  const [style, setStyle] = useState<StyleType>('ghibli')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trialDataURL, setTrialDataURL] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    try {
      const resized = await resizeImage(file, 1024)
      setPhoto(resized)
    } catch {
      setError('写真の読み込みに失敗しました。別の写真をお試しください。')
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('image/')) handleFile(file)
  }, [])

  const handleTrial = async () => {
    if (!photo || !breed.trim() || !color.trim()) return
    setPhase('trial_generating')
    setError(null)
    setTrialDataURL(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo, breed: breed.trim(), color: color.trim(), pattern: pattern.trim(), feature: feature.trim(), petName: petName.trim(), style, phrases: FIXED_PHRASES, trial: true }),
      })
      if (!res.ok || !res.body) {
        const msg = (await res.json().catch(() => ({}))) as { error?: string }
        setError(msg.error ?? '生成に失敗しました')
        setPhase('setup')
        return
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n\n')
        buffer = parts.pop() ?? ''
        for (const part of parts) {
          const line = part.trim()
          if (!line.startsWith('data: ')) continue
          const event = JSON.parse(line.slice(6)) as { type: string; dataUrl?: string; message?: string }
          if (event.type === 'stamp') { setTrialDataURL(event.dataUrl ?? null); setPhase('trial_done') }
          else if (event.type === 'error') { throw new Error(event.message ?? '生成に失敗しました') }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成に失敗しました')
      setPhase('setup')
    }
  }

  const handleCheckout = async () => {
    if (!photo || !breed.trim() || !color.trim()) return
    setIsRedirecting(true)
    setError(null)
    try {
      sessionStorage.setItem('stampon_photo', photo)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: { breed: breed.trim(), color: color.trim(), pattern: pattern.trim(), feature: feature.trim(), petName: petName.trim(), style, phrases: FIXED_PHRASES } }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) { setError(data.error ?? '決済ページの準備に失敗しました'); setIsRedirecting(false); return }
      window.location.href = data.url
    } catch {
      setError('ネットワークエラーが発生しました')
      setIsRedirecting(false)
    }
  }

  const isValid = !!photo && breed.trim() !== '' && color.trim() !== ''
  const inputClass = 'w-full px-4 py-3 rounded-2xl border-2 border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-gray-700 placeholder-gray-300 transition-colors'

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50 py-8 px-4">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2">🐾 STAMPON</h1>
        <p className="text-gray-400 text-sm">愛するペットがLINEスタンプになる！</p>
      </header>
      {error && <div className="max-w-sm mx-auto mb-6 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600">⚠️ {error}</div>}
      {(phase === 'setup' || phase === 'trial_generating' || phase === 'trial_done') && (
        <div className="max-w-sm mx-auto flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-600">📷 ペットの写真（必須）</label>
            <div className={`rounded-2xl border-2 border-dashed transition-colors cursor-pointer ${isDragging ? 'border-pink-400 bg-pink-50' : photo ? 'border-pink-300 bg-pink-50' : 'border-pink-200 bg-white hover:border-pink-300 hover:bg-pink-50'}`} onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}>
              {photo ? (
                <div className="relative">
                  <img src={photo} alt="ペット" className="w-full h-52 object-cover rounded-2xl" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl opacity-0 hover:opacity-100 transition-opacity"><span className="text-white text-sm font-bold">タップして変更</span></div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-12 px-4">
                  <span className="text-5xl">📸</span>
                  <p className="text-sm font-bold text-gray-500">タップして写真を選ぶ</p>
                  <p className="text-xs text-gray-400">またはここにドラッグ＆ドロップ</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-600">🏷️ ペットの名前<span className="ml-2 text-xs font-normal text-pink-400">入力すると首元に名札がつきます</span></label>
            <input type="text" value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="例：そら" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-600">🐾 ペットの種類 <span className="text-pink-400">*</span></label>
            <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="例：フレンチブルドッグ" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-600">🎨 毛色 <span className="text-pink-400">*</span></label>
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="例：クリーム" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-600">🎭 模様・柄</label>
            <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="例：無地、パイド" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-600">✨ 特徴</label>
            <input type="text" value={feature} onChange={(e) => setFeature(e.target.value)} placeholder="例：バットイヤー、垂れ耳" className={inputClass} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-600">🖼️ イラストスタイル</label>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map(({ value, label, emoji }) => (
                <button key={value} type="button" onClick={() => setStyle(value)} className={`py-3 px-2 rounded-2xl border-2 font-bold text-sm transition-all ${style === value ? 'border-pink-400 bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-md' : 'border-pink-200 bg-white text-gray-600 hover:border-pink-300'}`}>{emoji} {label}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-600">💬 スタンプのセリフ（16種類固定）</label>
            <div className="grid grid-cols-4 gap-1.5">
              {FIXED_PHRASES.map((phrase, i) => (
                <div key={i} className="w-full px-1.5 py-2 text-[11px] text-center rounded-xl border-2 border-pink-100 bg-pink-50 text-gray-600 leading-tight">{phrase}</div>
              ))}
            </div>
            <p className="text-xs text-gray-400 text-center">セリフとポーズはセットで最適化されています</p>
          </div>
          {phase === 'trial_done' && trialDataURL && (
            <div className="flex flex-col items-center gap-2 bg-pink-50 rounded-2xl p-4 border-2 border-pink-200">
              <p className="text-xs font-bold text-pink-500">🎨 お試し生成結果（1枚だけ）</p>
              <img src={trialDataURL} alt="お試しスタンプ" className="w-40 h-40 rounded-2xl object-cover shadow-md" />
              <p className="text-xs text-gray-400 text-center">気に入ったら480円で16枚フルセットを作りましょう！</p>
            </div>
          )}
          <button onClick={handleTrial} disabled={!isValid || phase === 'trial_generating'} className="w-full py-3 rounded-full border-2 border-pink-400 text-pink-500 font-bold text-base hover:bg-pink-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            {phase === 'trial_generating' ? '⏳ お試し生成中...' : '🎨 まず1枚無料でお試し'}
          </button>
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl px-4 py-4 text-center">
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">¥480</p>
            <p className="text-xs text-gray-500 mt-1">16枚スタンプセット・1回払い</p>
          </div>
          <button onClick={handleCheckout} disabled={!isValid || isRedirecting} className="w-full py-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-black text-lg shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none">
            {isRedirecting ? '⏳ 決済ページへ移動中...' : '💳 480円で16枚作る！'}
          </button>
          <p className="text-center text-xs text-gray-400">🔒 決済はStripeで安全に処理されます</p>
        </div>
      )}
    </div>
  )
}
