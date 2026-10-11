import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Merriweather_Sans } from 'next/font/google'
import './globals.css'

const merriweatherSans = Merriweather_Sans({
  subsets: ['latin'],
  variable: '--font-merriweather-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BuildMySkincare — Build, analyze, and share',
  description:
    'Build, analyze, and share your skincare routine with AI-powered ingredient compatibility insights.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#faf8f4',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`light bg-background ${merriweatherSans.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
