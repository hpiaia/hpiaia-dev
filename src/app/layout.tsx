import './app.css'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'

import { site } from '@/content/site'
import { fontClassNames } from '@/lib/fonts'

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
}

export default function RootLayout({ children }: Readonly<React.PropsWithChildren>) {
  return (
    <html lang="en" className={fontClassNames}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
