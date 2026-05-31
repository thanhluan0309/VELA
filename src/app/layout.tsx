import type { Metadata, Viewport } from 'next'
import { Fraunces } from 'next/font/google'
import { LenisProvider } from '@/providers/LenisProvider'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['300', '400', '700', '900'],
})

export const metadata: Metadata = {
  title: 'VELA — Wear the light.',
  description: 'Editorial fashion for the modern woman. Crafted with intention. Worn with ease.',
  openGraph: {
    title: 'VELA',
    description: 'Wear the light.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAF7F2',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fraunces.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap"
        />
      </head>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
