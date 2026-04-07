export const STAMP_TEXTS = [
  'おあよ〜！',
  'ねんね〜',
  'ダッコ～',
  'ばいば〜い',
  'あーと～',
  'えへへ〜！',
  'だいちゅき♡',
  'でちたよ～',
  'イ～ネ',
  'ないしゅ！',
  'りょ～かい！',
  'がんばえ〜！',
  'ごめんね〜',
  'あしょぼ～',
  'ムニャムニャ..',
  'お～ねがい！',
] as const

export const STAMP_COUNT = STAMP_TEXTS.length // 16
export const STAMP_WIDTH = 370
export const STAMP_HEIGHT = 320

export interface ColorTheme {
  bg: string
  text: string
  border: string
  accent: string
}

export const COLOR_THEMES: ColorTheme[] = [
  { bg: '#FFE4EE', text: '#D63384', border: '#FFB3C8', accent: '#FF69B4' },
  { bg: '#FFFBE0', text: '#B8860B', border: '#FFE082', accent: '#FFC107' },
  { bg: '#E0F7F4', text: '#00796B', border: '#80CBC4', accent: '#26A69A' },
  { bg: '#EDE7F6', text: '#6A1B9A', border: '#CE93D8', accent: '#AB47BC' },
  { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7', accent: '#66BB6A' },
  { bg: '#E3F2FD', text: '#1565C0', border: '#90CAF9', accent: '#42A5F5' },
  { bg: '#FFF3E0', text: '#E65100', border: '#FFCC80', accent: '#FFA726' },
  { bg: '#F1F8E9', text: '#33691E', border: '#C5E1A5', accent: '#8BC34A' },
  { bg: '#FCE4EC', text: '#AD1457', border: '#F48FB1', accent: '#EC407A' },
  { bg: '#FFF8E1', text: '#F57F17', border: '#FFE082', accent: '#FFCA28' },
  { bg: '#E8F5E9', text: '#1B5E20', border: '#81C784', accent: '#4CAF50' },
  { bg: '#E8EAF6', text: '#283593', border: '#9FA8DA', accent: '#5C6BC0' },
  { bg: '#FFFDE7', text: '#FF6F00', border: '#FFE082', accent: '#FFB300' },
  { bg: '#FCE4EC', text: '#C2185B', border: '#F48FB1', accent: '#E91E63' },
  { bg: '#F1F8E9', text: '#2E7D32', border: '#A5D6A7', accent: '#66BB6A' },
  { bg: '#E3F2FD', text: '#0D47A1', border: '#90CAF9', accent: '#1E88E5' },
]

export const POSES: string[] = [
  'just waking up, stretching arms, sitting up in bed',
  'sleeping peacefully, lying on side, small blanket, eyes closed',
  'both arms raised up high, reaching out eagerly to be picked up and held',
  'waving one hand goodbye, or rear view (back facing viewer, looking over shoulder)',
  'both hands touching cheeks (a la Home Alone pose)',
  'banzai pose, both arms raised triumphantly above head',
  'hugging a big red heart plushie or balloon',
  'proud pose, pointing one index finger upward confidently',
  'thumbs up gesture with one hand, smiling',
  'high-five stance, one palm raised and facing forward (ready for high five)',
  'salute pose, one hand raised to forehead',
  'fist pump, raising clenched fist in encouragement',
  'head tilted slightly to the side, both hands fidgeting in front',
  'holding out a colorful toy (rattle or plush) toward viewer',
  'rubbing one eye with fist, swaying slightly',
  'both hands pressed together in prayer/pleading gesture, looking upward with upturned eyes',
]

export const EXPRESSIONS: string[] = [
  'sleepy but happy smile, squinting eyes',
  'eyes closed, peaceful sleeping smile, slightly open mouth (cute sleeping face)',
  'eager expectant face, big round eyes looking up hopefully, small pleading smile',
  'happy smile, bright eyes',
  'delighted blushing smile, sparkly eyes',
  'shy giggly smile, eyes curved with delight, slight blush',
  'loving smile, slightly squinted happy eyes',
  'smug satisfied expression (doya-gao), slight eyebrow raise',
  'cheerful grin, eyes turned upward happily',
  'excited energetic smile, wide open eyes',
  'confident smile, focused eyes',
  'enthusiastic cheering expression, mouth wide open',
  'apologetic troubled face, head slightly tilted, puppy dog eyes',
  'inviting playful smile, bright eager eyes',
  'droopy heavy eyelids, rubbing eye, half-asleep expression',
  'upward puppy-dog gaze, big pleading eyes, hands pressed together',
]

export const DECO_PAIRS: [string, string][] = [
  ['🌸', '✨'],
  ['⭐', '🌙'],
  ['💫', '🌸'],
  ['🌿', '🍀'],
  ['✨', '🌿'],
  ['💙', '⭐'],
  ['💫', '🍀'],
  ['✨', '💫'],
  ['🌿', '✨'],
  ['🌿', '✨'],
  ['✨', '🌿'],
  ['💫', '💙'],
  ['🌿', '🌙'],
  ['💖', '✨'],
  ['💫', '🌙'],
  ['✨', '🌸'],
]
