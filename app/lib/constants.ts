export const STAMP_TEXTS = [
  'ありがとう！',
  'おはよう！',
  'お疲れさま〜',
  'おやすみ',
  'よろしく！',
  '了解！',
  'がんばれ〜',
  'いいね！',
  'ごめんね',
  'かわいい〜',
  'うれしい！',
  'まかせて！',
  'たのしいね',
  'だいすき♡',
  'ナイス！',
  'バイバ〜イ',
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
  'paws pressed together in gratitude, warm smile',
  'stretching and yawning, sleepy eyes',
  'holding a steaming coffee cup with both paws, gentle warm smile, comforting pose',
  'curled up sleeping, eyes closed, Z bubble',
  'bowing politely, friendly smile',
  'confident thumbs-up, nodding',
  'both fists raised, cheering energetically',
  'thumbs-up, big satisfied grin',
  'ears drooping, apologetic, small tear',
  'heart eyes, blushing, excited',
  'jumping for joy, huge smile, sparkling eyes',
  'arms folded, cool confident smile',
  'laughing, paws on belly, playful',
  'heart-shaped eyes, blowing a kiss, hearts floating',
  'peace sign, winking, cool pose',
  'waving enthusiastically, bright farewell smile',
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
