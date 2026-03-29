import {
  STAMP_WIDTH,
  STAMP_HEIGHT,
  ColorTheme,
  DECO_PAIRS,
  STAMP_TEXTS,
} from './constants'

const FONT_FAMILY = '"M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "YuGothic", "Meiryo", sans-serif'

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function lighten(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, ((n >> 16) & 0xff) + 25)
  const g = Math.min(255, ((n >> 8) & 0xff) + 25)
  const b = Math.min(255, (n & 0xff) + 25)
  return `rgb(${r},${g},${b})`
}

export async function drawStamp(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  index: number,
  theme: ColorTheme
): Promise<void> {
  const W = STAMP_WIDTH
  const H = STAMP_HEIGHT
  const ctx = canvas.getContext('2d')!
  canvas.width = W
  canvas.height = H

  ctx.clearRect(0, 0, W, H)

  // ── Background ──────────────────────────────────────────────
  ctx.save()
  roundedRect(ctx, 0, 0, W, H, 26)
  ctx.clip()
  const bgGrad = ctx.createLinearGradient(0, 0, W, H)
  bgGrad.addColorStop(0, theme.bg)
  bgGrad.addColorStop(1, lighten(theme.bg))
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, W, H)
  ctx.restore()

  // ── Border ──────────────────────────────────────────────────
  ctx.save()
  roundedRect(ctx, 4, 4, W - 8, H - 8, 22)
  ctx.strokeStyle = theme.border
  ctx.lineWidth = 5
  ctx.stroke()
  ctx.restore()

  // ── Pet image ───────────────────────────────────────────────
  const imgR = 106  // radius
  const imgCX = W / 2
  const imgCY = H / 2 - 16

  // Drop shadow ring
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.20)'
  ctx.shadowBlur = 20
  ctx.shadowOffsetY = 6
  ctx.beginPath()
  ctx.arc(imgCX, imgCY, imgR + 7, 0, Math.PI * 2)
  ctx.fillStyle = 'white'
  ctx.fill()
  ctx.restore()

  // Accent ring
  ctx.save()
  ctx.beginPath()
  ctx.arc(imgCX, imgCY, imgR + 5, 0, Math.PI * 2)
  ctx.strokeStyle = theme.border
  ctx.lineWidth = 5
  ctx.stroke()
  ctx.restore()

  // Circular image clip
  ctx.save()
  ctx.beginPath()
  ctx.arc(imgCX, imgCY, imgR, 0, Math.PI * 2)
  ctx.clip()
  const imgD = imgR * 2
  const scale = Math.max(imgD / image.width, imgD / image.height)
  const sw = imgD / scale
  const sh = imgD / scale
  const sx = (image.width - sw) / 2
  const sy = (image.height - sh) / 2
  ctx.drawImage(image, sx, sy, sw, sh, imgCX - imgR, imgCY - imgR, imgD, imgD)
  ctx.restore()

  // ── Text bubble ─────────────────────────────────────────────
  // Ensure font is loaded before drawing
  try {
    await document.fonts.load(`bold 28px ${FONT_FAMILY}`)
  } catch {
    // fall through with system fonts
  }

  const bH = 54
  const bPad = 24
  const bX = bPad
  const bY = H - bH - 14
  const bW = W - bPad * 2

  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.12)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 3
  roundedRect(ctx, bX, bY, bW, bH, bH / 2)
  ctx.fillStyle = 'white'
  ctx.fill()
  ctx.restore()

  ctx.save()
  roundedRect(ctx, bX, bY, bW, bH, bH / 2)
  ctx.strokeStyle = theme.border
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.restore()

  const text = STAMP_TEXTS[index]
  ctx.save()
  ctx.font = `bold 28px ${FONT_FAMILY}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // White outline for legibility
  ctx.strokeStyle = 'white'
  ctx.lineWidth = 6
  ctx.lineJoin = 'round'
  ctx.strokeText(text, W / 2, bY + bH / 2)
  ctx.fillStyle = theme.text
  ctx.fillText(text, W / 2, bY + bH / 2)
  ctx.restore()

  // ── Corner decorations ──────────────────────────────────────
  const [d1, d2] = DECO_PAIRS[index]
  ctx.save()
  ctx.font = `bold 20px ${FONT_FAMILY}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = theme.accent
  ctx.fillText(d1, 28, 28)
  ctx.fillText(d2, W - 28, 28)
  ctx.restore()
}
