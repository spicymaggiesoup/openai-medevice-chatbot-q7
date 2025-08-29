import type { Metadata } from 'next'
import Script from 'next/script'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'MediBot',
  description: 'Created with v0',
  generator: 'v0.app',
}

const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAOJSKEY;
const KAKAO_API = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services,clusterer&autoload=false`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head />
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        {/* App Router에서는 NextScript/Main 사용 X */}
        <Script src={KAKAO_API} strategy="beforeInteractive" />
      </body>
    </html>
  )
}
