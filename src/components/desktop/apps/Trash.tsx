'use client'

import { useState } from 'react'

import { StatusBar, Sunken } from '@/components/desktop/apps/shared'
import { FileIcon } from '@/components/desktop/icons'

// Things the resume says were replaced along the way
const files = [
  { name: 'crontab.bak', note: 'Replaced by durable Temporal workflows at Smartrr.' },
  { name: 'gatsby-config.js', note: 'Migrated the Shopify app frontend to Next.js. Build times cut by 80%.' },
  { name: 'jest.config.js', note: 'Moved every suite to Vitest with SWC. Tests run 75% faster.' },
  { name: 'terminal-only-site.zip', note: 'The previous hpiaia.dev. It still runs: open the Terminal.' },
]

export function Trash() {
  const [selected, setSelected] = useState<string | null>(null)
  const file = files.find((f) => f.name === selected)
  return (
    <>
      <Sunken className="min-h-0 flex-1">
        <ul className="grid h-full grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] content-start gap-1 p-2">
          {files.map((f) => (
            <li key={f.name}>
              <button
                type="button"
                onClick={() => setSelected(f.name)}
                className="flex w-full flex-col items-center gap-1 p-1"
              >
                <FileIcon className="size-8" />
                <span
                  className={`px-0.5 text-center break-all ${selected === f.name ? 'bg-select text-select-ink' : ''}`}
                >
                  {f.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Sunken>
      <StatusBar cells={[file ? file.note : `${files.length} object(s)`]} />
    </>
  )
}
