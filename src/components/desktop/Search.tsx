'use client'

import { Command, useCommandState } from 'cmdk'
import { useState } from 'react'

import { Button, Sunken } from '@/components/desktop/apps/shared'
import { appIcons, FileIcon, ui } from '@/components/desktop/icons'
import { albums } from '@/content/albums'
import { games } from '@/content/games'
import { resume } from '@/content/resume'
import { site } from '@/content/site'
import { type AppKey, apps } from '@/lib/apps'
import { launchGame } from '@/lib/dialogs'
import { companies, year } from '@/lib/utils'
import { open } from '@/lib/windows'

type Result = { label: string; detail: string; app?: AppKey; cover?: string; square?: boolean; run: () => void }

const results: Result[] = [
  ...apps.map((a) => ({ label: a.label, detail: a.title, app: a.key, run: () => open(a.key) })),
  ...resume.jobs.map((job) => ({
    label: companies(job),
    detail: `${job.title}, ${year(job.from)}`,
    app: 'work' as const,
    run: () => open('work', job.slug),
  })),
  ...albums.map((a) => ({
    label: a.title,
    detail: `${a.artist}, ${a.year}`,
    app: 'winamp' as const,
    run: () => open('winamp', a.slug),
  })),
  ...games.map((g) => ({
    label: g.title,
    detail: 'Game, needs its CD',
    cover: g.icon ?? g.cover,
    square: !!g.icon,
    run: () => launchGame(g),
  })),
  ...site.links.map((l) => ({
    label: l.label[0].toUpperCase() + l.label.slice(1),
    detail: l.href.replace(/^(mailto:|https?:\/\/)/, ''),
    run: () => window.open(l.href, '_blank', 'noreferrer'),
  })),
]

function match(value: string, search: string) {
  const text = value.toLowerCase()
  const query = search.trim().toLowerCase()
  if (!text.includes(query)) return 0
  return text.startsWith(query) || text.includes(` ${query}`) ? 1 : 0.5
}

function Found() {
  const count = useCommandState((state) => state.filtered.count)
  return <p className="mx-2.5 mb-1.5 text-muted">{count} file(s) found</p>
}

// Rendered into the desktop rather than the page body, so it also works on the 3D monitor
export function Search({ container, onClose }: { container: HTMLElement | null; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('')
  const pick = (result?: Result) => {
    if (!result) return
    result.run()
    onClose()
  }
  const current = () => results.find((r) => `${r.label} ${r.detail}` === selected)

  return (
    <Command.Dialog
      open
      onOpenChange={(open) => !open && onClose()}
      container={container ?? undefined}
      label="Find: Apps, jobs, music and games"
      value={selected}
      onValueChange={setSelected}
      loop
      filter={match}
      overlayClassName="absolute inset-0 z-[100000]"
      contentClassName="absolute top-[10%] left-1/2 z-[100001] flex w-[min(520px,94%)] -translate-x-1/2 flex-col bg-face p-[3px] outline-none bevel-window"
    >
      <header className="flex h-[22px] items-center gap-[3px] pr-[3px] pl-[3px] title-on">
        <ui.search className="size-[16px]" />
        <p className="flex-1 font-bold">Find: Apps, jobs, music and games</p>
        <button
          type="button"
          aria-label="Close"
          tabIndex={-1}
          onClick={onClose}
          className="group block h-[14px] w-[16px] bg-face text-ink bevel active:bevel-in"
        >
          <span className="block group-active:translate-x-px group-active:translate-y-px">
            <ui.close />
          </span>
        </button>
      </header>
      <div className="flex items-end gap-2 p-2.5">
        <label className="flex-1">
          <span className="mb-1 block">
            <u>N</u>amed:
          </span>
          <Command.Input
            autoFocus
            value={query}
            onValueChange={setQuery}
            className="w-full bg-window px-1.5 py-1 text-ink outline-none bevel-in"
          />
        </label>
        <Button primary onClick={() => pick(current())}>
          Find Now
        </Button>
      </div>
      <Sunken className="mx-2.5 mb-1 h-64">
        <Command.List className="scroll-98 h-full overflow-y-auto">
          {results.map((r) => {
            const Icon = r.app ? appIcons[r.app] : FileIcon
            const icon = r.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.cover} alt="" className={`h-[16px] shrink-0 object-cover ${r.square ? 'w-[16px]' : 'w-3'}`} />
            ) : (
              <Icon className="size-[16px] shrink-0" />
            )
            return (
              <Command.Item
                key={`${r.label} ${r.detail}`}
                value={`${r.label} ${r.detail}`}
                onSelect={() => pick(r)}
                className="group flex cursor-default items-center gap-2 px-1.5 py-1 data-[selected=true]:bg-select data-[selected=true]:text-select-ink"
              >
                {icon}
                <span className="w-40 shrink-0 truncate">{r.label}</span>
                <span className="truncate text-muted group-data-[selected=true]:text-select-ink">{r.detail}</span>
              </Command.Item>
            )
          })}
          <Command.Empty className="px-2 py-4 text-muted">No items match “{query}”.</Command.Empty>
        </Command.List>
      </Sunken>
      <Found />
    </Command.Dialog>
  )
}
