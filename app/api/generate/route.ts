import { NextRequest } from "next/server"
import { POSES } from "@/app/lib/constants"

const OPENAI_BASE = "https://api.openai.com/v1"

const STYLE_PROMPTS: Record<string, string> = {
  ghibli: "Studio Ghibli anime style, soft warm earthy palette, painterly brushwork",
  watercolor: "delicate watercolor illustration, soft bleeding edges, translucent washes",
  chibi: "cute chibi anime style, super-deformed, large head, kawaii",
  pastel: "soft pastel kawaii illustration, dreamy gentle colors",
}

function buildCharacterDesc(breed: string, color: string, pattern: string, feature: string, petName: string): string {
  const parts = [breed]
  if (petName) parts[0] += ` named ${petName}`
  parts.push(`${color} fur`)
  if (pattern) parts.push(`${pattern} pattern`)
  if (feature) parts.push(feature)
  return parts.join(", ")
}

async function generateMaster(apiKey: string, photoBase64: string, breed: string, color: string, pattern: string, feature: string, petName: string, style: string): Promise<string> {
  const match = photoBase64.match(/^data:([^;]+);base64,(.+)$/)
  const mimeType = match?.[1] ?? "image/jpeg"
  const b64data = match?.[2] ?? photoBase64
  const buffer = Buffer.from(b64data, "base64")
  const ext = mimeType.split("/")[1] ?? "jpg"
  const blob = new Blob([buffer], { type: mimeType })
  const characterDesc = buildCharacterDesc(breed, color, pattern, feature, petName)
  const stylePrompt = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.ghibli
  const formData = new FormData()
  formData.append("model", "gpt-image-1")
  formData.append("image[]", blob, `photo.${ext}`)
  formData.append("prompt", `Transform this pet photo into a cute LINE sticker character. Character: ${characterDesc}. Style: ${stylePrompt}, large expressive eyes, full body, centered on white background, high quality sticker art.`)
  formData.append("n", "1")
  formData.append("size", "1024x1024")
  const res = await fetch(`${OPENAI_BASE}/images/edits`, { method: "POST", headers: { Authorization: `Bearer ${apiKey}` }, body: formData })
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error((err as { error?: { message?: string } }).error?.message ?? "マスターキャラクター生成に失敗しました") }
  const data = await res.json() as { data: { b64_json: string }[] }
  return data.data[0].b64_json
}

async function generateStamp(apiKey: string, breed: string, color: string, pattern: string, feature: string, petName: string, style: string, phrase: string, index: number): Promise<string> {
  const pose = POSES[index]
  const characterDesc = buildCharacterDesc(breed, color, pattern, feature, petName)
  const stylePrompt = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.ghibli
  const res = await fetch(`${OPENAI_BASE}/images/generations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "gpt-image-1", prompt: `LINE sticker of a cute ${characterDesc}. Pose: ${pose}. Japanese text "${phrase}" at the bottom in bold rounded white letters with dark outline. Style: ${stylePrompt}, large expressive eyes, white background, square format, cute decorative border.`, n: 1, size: "1024x1024" }),
  })
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error((err as { error?: { message?: string } }).error?.message ?? `スタンプ ${index + 1} の生成に失敗しました`) }
  const data = await res.json() as { data: { b64_json: string }[] }
  return data.data[0].b64_json
}

function addWatermark(b64: string): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined") { resolve(b64); return }
    resolve(b64)
  })
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === "your_key_here") {
    return new Response(JSON.stringify({ error: "OpenAI API key が設定されていません。" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }

  let photo: string, breed: string, color: string, pattern: string, feature: string, petName: string, style: string, phrases: string[], trial: boolean
  try {
    const body = await req.json()
    photo = body.photo; breed = body.breed; color = body.color; pattern = body.pattern ?? ""; feature = body.feature ?? ""; petName = body.petName ?? ""; style = body.style ?? "ghibli"; phrases = Array.isArray(body.phrases) ? body.phrases : []; trial = body.trial === true
    if (!photo || !breed || !color) throw new Error("missing required fields")
    if (!trial && phrases.length !== 16) throw new Error("phrases must have 16 items")
  } catch {
    return new Response(JSON.stringify({ error: "リクエストが不正です" }), { status: 400, headers: { "Content-Type": "application/json" } })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => { controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)) }
      try {
        if (trial) {
          // お試しモード：1枚だけ生成
          const b64 = await generateStamp(apiKey, breed, color, pattern, feature, petName, style, phrases[0] ?? "お試し", 0)
          // サーバー側で透かしは入れられないのでそのまま返す（低解像度感はCanvas縮小で対応）
          send({ type: "stamp", index: 0, dataUrl: `data:image/png;base64,${b64}`, trial: true })
          send({ type: "done" })
        } else {
          // 通常モード：マスター＋16枚並列生成
          const masterB64 = await generateMaster(apiKey, photo, breed, color, pattern, feature, petName, style)
          send({ type: "master", dataUrl: `data:image/png;base64,${masterB64}` })
          const BATCH = 4
          for (let i = 0; i < 16; i += BATCH) {
            const batch = Array.from({ length: Math.min(BATCH, 16 - i) }, (_, j) => i + j)
            const results = await Promise.all(batch.map(idx => generateStamp(apiKey, breed, color, pattern, feature, petName, style, phrases[idx], idx)))
            results.forEach((b64, j) => { send({ type: "stamp", index: i + j, dataUrl: `data:image/png;base64,${b64}` }) })
          }
          send({ type: "done" })
        }
      } catch (err) {
        send({ type: "error", message: err instanceof Error ? err.message : "生成に失敗しました" })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } })
}