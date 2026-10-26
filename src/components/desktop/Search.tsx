'use client'

import { useMemo, useState } from 'react'

import { Button, companies, Sunken } from '@/components/desktop/apps/shared'
import { appIcons, FileIcon, ui } from '@/components/desktop/icons'
import { resume } from '@/content/resume'
import { site } from '@/content/site'
import { type AppKey, apps } from '@/lib/apps'
import { open } from '@/lib/windows'

type Result = { label: string; detail: string; app?: AppKey; run: () => void }

const results: Result[] = [
  ...apps.map((a) => ({ label: a.label, detail: a.title, app: a.key, run: () => open(a.key) })),
  ...resume.jobs.map((job) => ({
    label: companies(job),
    detail: `${job.title}, ${job.from.slice(0, 4)}`,
    app: 'work' as const,
    run: () => open('work', job.slug),
  })),
  ...site.links.map((l) => ({
    label: l.label[0].toUpperCase() + l.label.slice(1),
    detail: l.href.replace(/^(mailto:|https?:\/\/)/, ''),
    run: () => window.open(l.href, '_blank', 'noreferrer'),
  })),
]

export function Search({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? results.filter((r) => `${r.label} ${r.detail}`.toLowerCase().includes(q)) : results.slice(0, apps.length)
  }, [query])

  function pick(result?: Result) {
    if (!result) return
    result.run()
    onClose()
  }

  return (
    <div className="absolute inset-0 z-[100000] flex items-start justify-center pt-[10%]" onPointerDown={onClose}>
      <div
        role="dialog"
        aria-label="Find"
        className="flex w-[min(520px,94%)] flex-col bg-face p-[3px] bevel-window"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <header className="flex h-[22px] items-center gap-1 pr-[2px] pl-[3px] title-on">
          <ui.search className="size-4" />
          <p className="flex-1 font-bold">Find: Apps, jobs and links</p>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid h-4 w-[18px] place-items-center bg-face text-ink bevel active:bevel-in"
          >
            <ui.close className="h-3.5 w-4" />
          </button>
        </header>
        <div className="flex items-end gap-2 p-2.5">
          <label className="flex-1">
            <span className="mb-1 block">
              <u>N</u>amed:
            </span>
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setIndex(0)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') onClose()
                if (e.key === 'Enter') pick(matches[index])
                if (e.key === 'ArrowDown') setIndex((i) => Math.min(i + 1, matches.length - 1))
                if (e.key === 'ArrowUp') setIndex((i) => Math.max(i - 1, 0))
                if (e.key.startsWith('Arrow')) e.preventDefault()
              }}
              className="w-full bg-window px-1.5 py-1 text-ink outline-none bevel-in"
            />
          </label>
          <Button primary onClick={() => pick(matches[index])}>
            Find Now
          </Button>
        </div>
        <Sunken className="mx-2.5 mb-1 h-64">
          <ul className="scroll-98 h-full overflow-y-auto">
            {matches.map((r, i) => {
              const Icon = r.app ? appIcons[r.app] : FileIcon
              return (
                <li key={`${r.label}-${r.detail}`}>
                  <button
                    type="button"
                    onPointerEnter={() => setIndex(i)}
                    onClick={() => pick(r)}
                    className={`flex w-full items-center gap-2 px-1.5 py-1 text-left ${i === index ? 'bg-select text-select-ink' : ''}`}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="w-40 shrink-0 truncate">{r.label}</span>
                    <span className={`truncate ${i === index ? '' : 'text-muted'}`}>{r.detail}</span>
                  </button>
                </li>
              )
            })}
            {!matches.length && <li className="px-2 py-4 text-muted">No items match “{query}”.</li>}
          </ul>
        </Sunken>
        <p className="mx-2.5 mb-1.5 text-muted">{matches.length} file(s) found</p>
      </div>
    </div>
  )
}
