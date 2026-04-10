import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: '거지맵 - 고물가 시대 극가성비 식당 모음',
  description: '가성비 좋은 식당을 지도에서 찾아보세요',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
