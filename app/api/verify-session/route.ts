import { NextRequest } from 'next/server'
import Stripe from 'stripe'

export async function GET(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-03-25.dahlia',
  })
  const sessionId = req.nextUrl.searchParams.get('session_id')
  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'session_idがありません' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ error: '支払いが完了していません' }), { status: 402, headers: { 'Content-Type': 'application/json' } })
    }
    const metadata = session.metadata ?? {}
    const formData = {
      babyName: metadata.babyName ?? '',
      gender: metadata.gender ?? 'unspecified',
      features: JSON.parse(metadata.features ?? '[]'),
      style: metadata.style ?? 'chibi',
      phrases: JSON.parse(metadata.phrases ?? '[]'),
    }
    return new Response(JSON.stringify({ ok: true, formData }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('Stripe verify error:', err)
    return new Response(JSON.stringify({ error: 'セッション確認失敗' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
