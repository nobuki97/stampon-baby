import { NextRequest } from "next/server"
import { put } from "@vercel/blob"
import { POSES, EXPRESSIONS } from "@/app/lib/constants"

const OPENAI_BASE = "https://api.openai.com/v1"

const STYLE_PROMPTS: Record<string, string> = {
  ghibli: "Studio Ghibli anime style, soft warm earthy palette, painterly brushwork",
  watercolor: "delicate watercolor illustration, soft bleeding edges, translucent washes",
  chibi: "cute chibi anime style, super-deformed, large head, kawaii baby sticker art",
  pastel: "soft pastel kawaii illustration, dreamy gentle colors",
}

const FEATURE_MAP: Record<string, string> = {
  'たれ目': 'droopy gentle eyes',
  'ぷくぷくほっぺ': 'chubby round cheeks',
  '大きな瞳': 'large round eyes',
  '丸顔': 'round chubby face',
  '一重まぶた': 'single eyelid',
  'くりくり眉毛': 'thick expressive eyebrows',
}

function buildBabyDesc(babyName: string, gender: string, features: string[]): { genderStyling: string; nameEmbroidery: string; featureDescription: string } {
  const genderStyling =
    gender === 'girl'
      ? 'wearing a cute pink dress or onesie with a bow, pink accessories'
      : gender === 'boy'
      ? 'wearing a light blue onesie or overalls, cute baby sneakers'
      : 'wearing a neutral-colored cozy onesie'

  const nameEmbroidery = babyName
    ? `The baby's bib (yodarekake) or hat has the name "${babyName}" embroidered on it.`
    : ''

  const featureDescription =
    features.length > 0
      ? `Facial features: ${features.map((f) => FEATURE_MAP[f] || f).join(', ')}.`
      : ''

  return { genderStyling, nameEmbroidery, featureDescription }
}

async function generateMaster(apiKey: string, photoBase64: string, babyName: string, gender: string, features: string[], style: string): Promise<string> {
  const match = photoBase64.match(/^data:([^;]+);base64,(.+)$/)
  const mimeType = match?.[1] ?? "image/jpeg"
  const b64data = match?.[2] ?? photoBase64
  const buffer = Buffer.from(b64data, "base64")
  const ext = mimeType.split("/")[1] ?? "jpg"
  const blob = new Blob([buffer], { type: mimeType })
  const { genderStyling, nameEmbroidery, featureDescription } = buildBabyDesc(babyName, gender, features)
  const stylePrompt = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.chibi
  const formData = new FormData()
  formData.append("model", "gpt-image-1")
  formData.append("image[]", blob, `photo.${ext}`)
  formData.append("prompt", `Transform this baby photo into a cute kawaii LINE sticker character. Style: ${stylePrompt}, chibi proportions with oversized round head, large expressive eyes, full body, centered on white background, high quality sticker art. Appearance: ${genderStyling}. ${featureDescription} ${nameEmbroidery} Rosy chubby cheeks, button nose, small cute mouth.`)
  formData.append("n", "1")
  formData.append("size", "1024x1024")
  const res = await fetch(`${OPENAI_BASE}/images/edits`, { method: "POST", headers: { Authorization: `Bearer ${apiKey}` }, body: formData })
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error((err as { error?: { message?: string } }).error?.message ?? "マスターキャラクター生成に失敗しました") }
  const data = await res.json() as { data: { b64_json: string }[] }
  return data.data[0].b64_json
}

async function generateStamp(apiKey: string, babyName: string, gender: string, features: string[], style: string, phrase: string, index: number, masterB64?: string): Promise<string> {
  const pose = POSES[index]
  const expression = EXPRESSIONS[index]
  const { genderStyling, nameEmbroidery, featureDescription } = buildBabyDesc(babyName, gender, features)
  const stylePrompt = STYLE_PROMPTS[style] ?? STYLE_PROMPTS.chibi
  const prompt = `Create a LINE sticker illustration of a cute baby (approximately 6-12 months old). Style: ${stylePrompt}, kawaii chibi proportions with oversized round head (60% of body), clean bold outlines, flat coloring with soft cel-shading, transparent or pure white background. Baby appearance: ${genderStyling}. ${featureDescription} ${nameEmbroidery} Rosy chubby cheeks, button nose, small cute mouth. Pose: ${pose}. Expression: ${expression}. Japanese text "${phrase}" at the bottom in bold rounded font. Single character only, no backgrounds or extra scenery.`
  if (masterB64) {
    const buffer = Buffer.from(masterB64, "base64")
    const blob = new Blob([buffer], { type: "image/png" })
    const fd = new FormData()
    fd.append("model", "gpt-image-1")
    fd.append("image[]", blob, "master.png")
    fd.append("prompt", prompt)
    fd.append("n", "1")
    fd.append("size", "1024x1024")
    const res = await fetch(`${OPENAI_BASE}/images/edits`, { method: "POST", headers: { Authorization: `Bearer ${apiKey}` }, body: fd })
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error((err as { error?: { message?: string } }).error?.message ?? `スタンプ ${index + 1} の生成に失敗しました`) }
    const data = await res.json() as { data: { b64_json: string }[] }
    return data.data[0].b64_json
  }
  const res = await fetch(`${OPENAI_BASE}/images/generations`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "gpt-image-1", prompt, n: 1, size: "1024x1024" }),
  })
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error((err as { error?: { message?: string } }).error?.message ?? `スタンプ ${index + 1} の生成に失敗しました`) }
  const data = await res.json() as { data: { b64_json: string }[] }
  return data.data[0].b64_json
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === "your_key_here") {
    return new Response(JSON.stringify({ error: "OpenAI API key が設定されていません。" }), { status: 500, headers: { "Content-Type": "application/json" } })
  }

  let photo: string, babyName: string, gender: string, features: string[], style: string, phrases: string[], trial: boolean, sessionId: string, startIndex: number, masterBlobUrl: string
  try {
    const body = await req.json()
    photo = body.photo
    babyName = body.babyName ?? ""
    gender = body.gender ?? "unspecified"
    features = Array.isArray(body.features) ? body.features : []
    style = body.style ?? "chibi"
    phrases = Array.isArray(body.phrases) ? body.phrases : []
    trial = body.trial === true
    sessionId = body.sessionId ?? ""
    startIndex = typeof body.startIndex === "number" ? body.startIndex : 0
    masterBlobUrl = body.masterBlobUrl ?? ""
    if (!photo && startIndex === 0) throw new Error("missing required fields")
    if (!trial && phrases.length !== 16) throw new Error("phrases must have 16 items")
  } catch {
    return new Response(JSON.stringify({ error: "リクエストが不正です" }), { status: 400, headers: { "Content-Type": "application/json" } })
  }

  const saveToBlob = async (pathname: string, b64: string) => {
    if (!sessionId) return
    try {
      await put(pathname, Buffer.from(b64, "base64"), { access: "public", contentType: "image/png", allowOverwrite: true })
    } catch { /* blob save failure does not break generation */ }
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => { controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)) }
      try {
        if (trial) {
          const masterB64 = await generateMaster(apiKey, photo, babyName, gender, features, style)
          send({ type: "master", dataUrl: `data:image/png;base64,${masterB64}` })
          const b64 = await generateStamp(apiKey, babyName, gender, features, style, phrases[2] ?? "お試し", 2, masterB64)
          send({ type: "stamp", index: 2, dataUrl: `data:image/png;base64,${b64}`, trial: true })
          send({ type: "done" })
        } else {
          let masterB64: string
          if (startIndex > 0 && masterBlobUrl) {
            // Resume: fetch existing master from blob storage
            const res = await fetch(masterBlobUrl)
            const buf = await res.arrayBuffer()
            masterB64 = Buffer.from(buf).toString("base64")
            send({ type: "master", dataUrl: masterBlobUrl })
          } else {
            masterB64 = await generateMaster(apiKey, photo, babyName, gender, features, style)
            await saveToBlob(`stamps/${sessionId}/master.png`, masterB64)
            send({ type: "master", dataUrl: `data:image/png;base64,${masterB64}` })
          }
          const BATCH = 4
          for (let i = startIndex; i < 16; i += BATCH) {
            const batch = Array.from({ length: Math.min(BATCH, 16 - i) }, (_, j) => i + j)
            const results = await Promise.all(batch.map(idx => generateStamp(apiKey, babyName, gender, features, style, phrases[idx], idx, masterB64)))
            for (let j = 0; j < results.length; j++) {
              const idx = i + j
              await saveToBlob(`stamps/${sessionId}/${idx}.png`, results[j])
              send({ type: "stamp", index: idx, dataUrl: `data:image/png;base64,${results[j]}` })
            }
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
