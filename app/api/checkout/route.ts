import { NextRequest } from 'next/server'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { formData } = body as { formData: Record<string, unknown> }
    const metadata: Record<string, string> = {
      breed: String(formData.breed ?? ''),
      color: String(formData.color ?? ''),
      pattern: String(formData.pattern ?? ''),
      feature: String(formData.feature ?? ''),
      petName: String(formData.petName ?? ''),
      style: String(formData.style ?? 'ghibli'),
      phrases: JSON.stringify(formData.phrases ?? []),
    }
    const origin = req.headers.get('origin') ?? 'https://stampon-two.vercel.app'
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'jpy',
          product_data: { name: 'STAMPON - ペットLINEスタンプ作成', description: '愛するペットのオリジナルLINEスタンプ16枚セット' },
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
