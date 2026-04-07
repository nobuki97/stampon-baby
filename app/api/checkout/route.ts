import { NextRequest } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-03-25.dahlia',
  })
  try {
    const body = await req.json()
    const { formData } = body as { formData: Record<string, unknown> }
    const metadata: Record<string, string> = {
      babyName: String(formData.babyName ?? ''),
      gender: String(formData.gender ?? 'unspecified'),
      features: JSON.stringify(formData.features ?? []),
      style: String(formData.style ?? 'chibi'),
      phrases: JSON.stringify(formData.phrases ?? []),
    }
    const origin = req.headers.get('origin') ?? 'https://baby.stampon.ai'
    const session = await stripe.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: 'jpy',
          product_data: { name: 'STAMPON for Baby - ベビーLINEスタンプ作成', description: 'うちの子のオリジナルLINEスタンプ16枚セット' },
          unit_amount: 480,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&openExternalBrowser=1`,
      cancel_url: `${origin}/`,
      metadata,
      locale: 'ja',
    })
    return new Response(JSON.stringify({ url: session.url }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return new Response(JSON.stringify({ error: '決済の準備に失敗しました' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
