'use client'

import { useState } from 'react'

export interface CharacterInfo {
  breed: string
  color: string
  pattern: string
  feature: string
}

interface Props {
  onSubmit: (info: CharacterInfo) => void
  loading: boolean
}

const FIELDS: {
  key: keyof CharacterInfo
  label: string
  placeholder: string
  hint: string
}[] = [
  {
    key: 'breed',
    label: '犬種・猫種',
    placeholder: 'Shiba Inu',
    hint: '例: Golden Retriever, French Bulldog, Scottish Fold',
  },
  {
    key: 'color',
    label: '毛の色',
    placeholder: 'golden',
    hint: '例: white, black and white, orange tabby, cream',
  },
  {
    key: 'pattern',
    label: '模様',
    placeholder: 'solid',
    hint: '例: tabby stripes, spots, bi-color, tuxedo, patchy',
  },
  {
    key: 'feature',
    label: '特徴',
    placeholder: 'floppy ears',
    hint: '例: big round eyes, curly tail, fluffy fur, blue eyes',
  },
]

export default function CharacterSetup({ onSubmit, loading }: Props) {
  const [info, setInfo] = useState<CharacterInfo>({
    breed: '',
    color: '',
    pattern: 'solid',
    feature: '',
  })

  const isValid = info.breed.trim() && info.color.trim() && info.pattern.trim() && info.feature.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) onSubmit(info)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto flex flex-col gap-5">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-700">
        <p className="font-bold mb-0.5">💡 入力のコツ</p>
        <p>英語で入力するとAIがより正確に生成します。プレースホルダーを参考にどうぞ。</p>
      </div>

      {FIELDS.map(({ key, label, placeholder, hint }) => (
        <div key={key} className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-gray-600">{label}</label>
          <input
            type="text"
            value={info[key]}
            onChange={(e) => setInfo((prev) => ({ ...prev, [key]: e.target.value }))}
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 bg-white focus:border-pink-400 focus:outline-none text-gray-700 placeholder-gray-300 transition-colors"
            disabled={loading}
          />
          <p className="text-xs text-gray-400 pl-1">{hint}</p>
        </div>
      ))}

      <button
        type="submit"
        disabled={!isValid || loading}
        className="mt-2 w-full py-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-black text-lg shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        ✨ AIスタンプを生成する
      </button>
    </form>
  )
}
