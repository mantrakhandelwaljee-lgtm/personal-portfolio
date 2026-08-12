import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, Playfair_Display, Oswald, Crimson_Text, Benne } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
})
const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
})
const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-crimson',
  display: 'swap',
})
const benne = Benne({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-benne',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mantra Khandelwal — Designer & Developer',
  description:
    'Portfolio of Mantra Khandelwal — designer and developer crafting bold, playful digital experiences.',
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
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`light bg-background ${inter.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable} ${oswald.variable} ${crimsonText.variable} ${benne.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
