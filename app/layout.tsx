import type { Metadata } from 'next'
import { M_PLUS_Rounded_1c } from 'next/font/google'
import './globals.css'

const mPlusRounded = M_PLUS_Rounded_1c({
  weight: ['400', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-rounded',
})

export const metadata: Metadata = {
  title: 'STAMPON - AIペットスタンプメーカー',
  description: '愛するペットの写真から、オリジナルLINEスタンプを簡単作成！',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${mPlusRounded.variable} h-full antialiased`}>
      <body className={`min-h-full flex flex-col ${mPlusRounded.className}`}>
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-white border-t border-pink-100 py-6 px-4 mt-8">
          <div className="max-w-sm mx-auto flex flex-col items-center gap-3">
            <p className="text-xs font-bold text-gray-500">SHIPS.LLC合同会社</p>
            <div className="flex gap-4 text-xs text-pink-400">
              <a href="/legal" className="hover:underline">特定商取引法に基づく表記</a>
              <a href="/privacy" className="hover:underline">プライバシーポリシー</a>
              <a href="/terms" className="hover:underline">利用規約</a>
            </div>
            <p className="text-xs text-gray-300">© 2026 SHIPS.LLC合同会社</p>
          </div>
        </footer>
      </body>
    </html>
  )
}