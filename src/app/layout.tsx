import './app.css'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'

import { site } from '@/content/site'
import { fontClassNames } from '@/lib/fonts'
import { settingsScript } from '@/lib/wallpapers'

export const metadata: Metadata = { title: site.title, description: site.description }
export const viewport: Viewport = { themeColor: '#eeefe9' }

export default function RootLayout({ children }: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en" className={fontClassNames} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: settingsScript }} />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
