import { NextRequest } from 'next/server'
import { list } from '@vercel/blob'

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  if (!sessionId) {
    return Response.json({ error: 'session_idがありません' }, { status: 400 })
  }

  const { blobs } = await list({ prefix: `stamps/${sessionId}/` })

  let master: string | null = null
  const stamps: (string | null)[] = Array(16).fill(null)

  for (const blob of blobs) {
    const name = blob.pathname.split('/').pop() ?? ''
    if (name === 'master.png') {
      master = blob.url
    } else {
      const match = name.match(/^(\d+)\.png$/)
      if (match) {
        const idx = parseInt(match[1], 10)
        if (idx >= 0 && idx < 16) stamps[idx] = blob.url
      }
    }
  }

  return Response.json({ master, stamps })
}
