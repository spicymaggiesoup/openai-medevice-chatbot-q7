import type { Metadata } from 'next'
import Script from 'next/script'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
// import { SocketProvider } from "@/components/socket-provider";
// import { WSProvider } from "@/components/ws-provider";

export const metadata: Metadata = {
  title: 'MeDevise Seocho',
  description: '',
  generator: '',
}


const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAOJSKEY;
const KAKAO_API = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_KEY}&libraries=services,clusterer&autoload=false`;
const DAUM_POSTCODE = `//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head />
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* <WSProvider userId={userId} token={token}> */}
        {children}
        {/* </WSProvider > */}
        <Script src={KAKAO_API} strategy="beforeInteractive" />
        <Script src={DAUM_POSTCODE} strategy="beforeInteractive" />
      </body>
    </html>
  )
}
