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
        {children}
      </body>
    </html>
  )
}
