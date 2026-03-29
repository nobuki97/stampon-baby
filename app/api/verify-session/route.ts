import { NextRequest } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'session_idが指定されてぁE��せん' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ error: '支払いが完亁E��てぁE��せん' }), {
        status: 402,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const metadata = session.metadata ?? {}
    const formData = {
      breed: metadata.breed ?? '',
      color: metadata.color ?? '',
      pattern: metadata.pattern ?? '',
      feature: metadata.feature ?? '',
      petName: metadata.petName ?? '',
      style: metadata.style ?? 'ghibli',
      phrases: JSON.parse(metadata.phrases ?? '[]') as string[],
    }

    return new Response(JSON.stringify({ ok: true, formData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Stripe verify error:', err)
    return new Response(JSON.stringify({ error: 'セチE��ョンの確認に失敗しました' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
