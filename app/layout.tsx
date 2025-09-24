import type { Metadata } from 'next'
import Script from 'next/script'
import { Noto_Sans_KR } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
// import { SocketProvider } from "@/components/socket-provider";
// import { WSProvider } from "@/components/ws-provider";

export const metadata: Metadata = {
  title: 'MeDeviSe Seocho',
  description: '',
  generator: '',
}

const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAOJSKEY;
const KAKAO_API = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services,clusterer&autoload=false`;
const DAUM_POSTCODE = `//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js`;

const noto = Noto_Sans_KR({
  weight: '400',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={noto.className}>
      <head />
      <body className={`${noto.className}`}>
        {children}
        <Script src={KAKAO_API} strategy="beforeInteractive" />
        <Script src={DAUM_POSTCODE} strategy="beforeInteractive" />
      </body>
    </html>
  )
}
