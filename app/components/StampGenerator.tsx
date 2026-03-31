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

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => setPhoto(e.target?.result as string)
    reader.readAsDataURL(file)
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
        body: JSON.stringify({
          photo,
          breed: breed.trim(),
          color: color.trim(),
          pattern: pattern.trim(),
          feature: feature.trim(),
          petName: petName.trim(),
          style,
          phrases: FIXED_PHRASES,
          trial: true,
        }),
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
          if (event.type === 'stamp') {
            setTrialDataURL(event.dataUrl ?? null)
            setPhase('trial_done')
          } else if (event.type === 'error') {
            throw new Error(event.message ?? '生成に失敗しました')
          }
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
      const formData = {
        breed: breed.trim(),
        color: color.trim(),
        pattern: pattern.trim(),
        feature: feature.trim(),
        petName: petName.trim(),
        style,
        phrases: FIXED_PHRASES,
      }
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setError(data.error ?? '決済ページの準備に失敗しました')
        setIsRedirecting(false)
        return
      }
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
        <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2">
          🐾 STAMPON
        </h1>
        <p className="text-gray-400 text-sm">愛するペットがLINEスタンプになる！</p>
      </header>

      {error && (
        <div className="max-w-sm mx-auto mb-6 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-sm text-red-600">
          ⚠️ {error}
        </div>
      )}

      {(phase === 'setup' || phase === 'trial_generating' || phase === 'trial_done') && (
        <div className="max-w-sm mx-auto flex flex-col gap-5">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-600">📷 ペットの写真（必須）</label>
            <div
              className={`rounded-2xl border-2 border-dashed transition-colors cursor-pointer ${isDragging ? 'border-pink-400 bg-pink-50' : photo ? 'border-pink-300 bg-pink-50' : 'border-pink-200 bg-white hover:border-pink-300 hover:bg-pink-50'}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {photo ? (
                <div className="relative">
                  <img src={photo} alt="ペット" className="w-full h-52 object-cover rounded-2xl" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-bold">タップして変更</span>
