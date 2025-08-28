import type { Metadata } from 'next'
import Script from 'next/script'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'


export const API = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAOJSKEY}&libraries=services,clusterer&autoload=false`

export const metadata: Metadata = {
  title: 'MediBot',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Script
        src={API}
        strategy="beforeInteractive" />
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
