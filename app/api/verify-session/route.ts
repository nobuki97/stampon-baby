import { NextRequest } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'session_id縺梧欠螳壹＆繧後※縺・∪縺帙ｓ' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ error: '謾ｯ謇輔＞縺悟ｮ御ｺ・＠縺ｦ縺・∪縺帙ｓ' }), {
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
    return new Response(JSON.stringify({ error: '繧ｻ繝・す繝ｧ繝ｳ縺ｮ遒ｺ隱阪↓螟ｱ謨励＠縺ｾ縺励◆' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
