import { NextRequest, NextResponse } from 'next/server'
import { STAMP_TEXTS, POSES } from '@/app/lib/constants'

interface GenerateRequest {
  type: 'master' | 'stamp'
  breed: string
  color: string
  pattern: string
  feature: string
  stampIndex?: number
}

function buildMasterPrompt(breed: string, color: string, pattern: string, feature: string): string {
  return `Create a LINE sticker character. CHARACTER: ${breed}, ${color} colored fur, ${pattern} markings, ${feature}. STYLE: Studio Ghibli anime illustration style, soft warm earthy palette, painterly brushwork, large luminous eyes. Neutral standing pose, full body, centered, square format, soft pastel background. CRITICAL: fur color and markings must be EXACTLY as specified.`
}

function buildStampPrompt(
  breed: string, color: string, pattern: string, feature: string,
  stampIndex: number
): string {
  const masterDescription = `${breed}, ${color} colored fur, ${pattern} markings, ${feature}`
  const phrase = STAMP_TEXTS[stampIndex]
  const pose = POSES[stampIndex]
  return `Create a LINE sticker. CHARACTER: ${masterDescription} - same character as established. STYLE: Studio Ghibli anime. POSE: ${pose}. TEXT: Add Japanese "${phrase}" at bottom in bold rounded white font with dark outline. Square format, cute border frame.`
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === 'your_key_here') {
    return NextResponse.json({ error: 'OpenAI API key が設定されていません。.env.local を確認してください。' }, { status: 500 })
  }

  let body: GenerateRequest
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { type, breed, color, pattern, feature, stampIndex } = body

  const prompt =
    type === 'master'
      ? buildMasterPrompt(breed, color, pattern, feature)
      : buildStampPrompt(breed, color, pattern, feature, stampIndex ?? 0)

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
    }),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    const message = (errData as { error?: { message?: string } }).error?.message ?? 'Image generation failed'
    return NextResponse.json({ error: message }, { status: response.status })
  }

  const data = await response.json() as { data: { b64_json: string }[] }
  const b64 = data.data[0].b64_json
  const dataUrl = `data:image/png;base64,${b64}`

  return NextResponse.json({ dataUrl })
}
