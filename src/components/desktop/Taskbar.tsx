'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { companies } from '@/components/desktop/apps/shared'
import { appIcons, FolderIcon, Logo, ui } from '@/components/desktop/icons'
import { resume } from '@/content/resume'
import { site } from '@/content/site'
import { app, type AppKey } from '@/lib/apps'
import { setSetting, useSetting } from '@/lib/settings'
import { focus, minimize, open, useWindows } from '@/lib/windows'

type Entry = { label: string; icon: React.ReactNode; run?: () => void; href?: string; children?: Entry[] } | 'separator'

const small = (key: AppKey) => {
  const Icon = appIcons[key]
  return <Icon className="size-4" />
}
const large = (key: AppKey) => {
  const Icon = appIcons[key]
  return <Icon className="size-6" />
}

function useClock() {
  return useSyncExternalStore(
    (fn) => {
      const timer = setInterval(fn, 10_000)
      return () => clearInterval(timer)
    },
    () => new Date().toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' }),
    () => '',
  )
}

function Row({
  entry,
  size,
  onDone,
}: {
  entry: Exclude<Entry, 'separator'>
  size: 'large' | 'small'
  onDone: () => void
}) {
  const [sub, setSub] = useState(false)
  const cls = `flex w-full items-center gap-2 pr-3 pl-1.5 text-left hover:bg-select hover:text-select-ink focus-visible:bg-select focus-visible:text-select-ink focus-visible:outline-none ${
    size === 'large' ? 'h-9' : 'h-6'
  } ${sub ? 'bg-select text-select-ink' : ''}`
  const body = (
    <>
      <span className={`grid shrink-0 place-items-center ${size === 'large' ? 'size-7' : 'size-5'}`}>{entry.icon}</span>
      <span className="flex-1 whitespace-nowrap">{entry.label}</span>
      {entry.children && <ui.arrow className="size-2" />}
    </>
  )
  return (
    <li className="relative" onPointerEnter={() => setSub(true)} onPointerLeave={() => setSub(false)}>
      {entry.href ? (
        <a href={entry.href} target="_blank" rel="noreferrer" className={cls} onClick={onDone}>
          {body}
        </a>
      ) : (
        <button
          type="button"
          className={cls}
          onClick={() => {
            if (entry.children) return setSub((s) => !s)
            entry.run?.()
            onDone()
          }}
        >
          {body}
        </button>
      )}
      {sub && entry.children && (
        <ul className="absolute bottom-[-3px] left-full z-10 min-w-48 bg-face p-[3px] bevel-window">
          {entry.children.map((child, i) =>
            child === 'separator' ? (
              <li key={i} className="mx-1 my-1 h-0.5 bevel-thin-in" />
            ) : (
              <Row key={child.label} entry={child} size="small" onDone={onDone} />
            ),
          )}
        </ul>
      )}
    </li>
  )
}

type Props = { compact: boolean; onFind: () => void; onShutdown: () => void }

export function Taskbar({ compact, onFind, onShutdown }: Props) {
  const [start, setStart] = useState(false)
  const bar = useRef<HTMLDivElement>(null)
  const { windows, focused } = useWindows()
  const view = useSetting('view')
  const sound = useSetting('sound')
  const clock = useClock()
  const toDesk = view === 'screen'

  useEffect(() => {
    if (!start) return
    const outside = (e: PointerEvent) => {
      if (!bar.current?.contains(e.target as Node)) setStart(false)
    }
    const escape = (e: KeyboardEvent) => e.key === 'Escape' && setStart(false)
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [start])

  const program = (key: AppKey, label = app(key).label): Entry => ({ label, icon: small(key), run: () => open(key) })
  const entries: Entry[] = [
    {
      label: 'Programs',
      icon: <FolderIcon className="size-6" />,
      children: (['about', 'work', 'cv', 'terminal', 'skills', 'contact', 'music'] as AppKey[]).map((k) => program(k)),
    },
    {
      label: 'Work',
      icon: large('work'),
      children: resume.jobs.map((job) => ({
        label: companies(job),
        icon: <FolderIcon className="size-4" />,
        run: () => open('work', job.slug),
      })),
    },
    {
      label: 'Links',
      icon: <FolderIcon className="size-6" />,
      children: site.links.map((l) => ({
        label: l.label[0].toUpperCase() + l.label.slice(1),
        icon: small(l.label === 'resume' ? 'cv' : l.label === 'email' ? 'contact' : 'about'),
        href: l.href,
      })),
    },
    {
      label: 'Settings',
      icon: large('display'),
      children: [
        program('display', 'Display properties'),
        {
          label: toDesk ? 'Sit at the 3D desk' : 'Back to the screen',
          icon: <ui.cube className="size-4" />,
          run: () => setSetting('view', toDesk ? 'desk' : 'screen'),
        },
      ],
    },
    { label: 'Find...', icon: <ui.search className="size-6" />, run: onFind },
    { label: 'Help', icon: large('credits'), run: () => open('credits') },
    'separator',
    { label: 'Shut Down...', icon: <Logo className="size-6" />, run: onShutdown },
  ]

  return (
    <div
      ref={bar}
      className="relative z-20 flex h-[34px] shrink-0 items-center gap-1 bg-face px-[2px] shadow-[inset_0_1px_var(--w-light),inset_0_2px_var(--w-hilite)]"
    >
      {start && (
        <div className="absolute bottom-[calc(100%-2px)] left-[2px] flex bg-face p-[3px] bevel-window">
          <div className="flex w-7 items-end justify-center bg-gradient-to-t from-[#000080] to-[#1084d0] pb-2">
            <span className="text-lg leading-none whitespace-nowrap text-white [writing-mode:vertical-rl] rotate-180">
              <b>hpiaia</b>
              <span className="font-normal">97</span>
            </span>
          </div>
          <ul className="min-w-52 py-0.5">
            {entries.map((entry, i) =>
              entry === 'separator' ? (
                <li key={i} className="mx-1 my-1 h-0.5 bevel-thin-in" />
              ) : (
                <Row key={entry.label} entry={entry} size="large" onDone={() => setStart(false)} />
              ),
            )}
          </ul>
        </div>
      )}

      <button
        type="button"
        aria-expanded={start}
        onClick={() => setStart((s) => !s)}
        className={`focus-dotted flex h-[26px] shrink-0 items-center gap-1 px-1.5 font-bold ${start ? 'pt-px pl-[7px] bevel-in' : 'bevel'}`}
      >
        <Logo className="size-5" />
        Start
      </button>
      <span className="mx-0.5 h-[26px] w-0.5 bevel-thin" />

      <div className="flex min-w-0 flex-1 gap-1">
        {windows.map((w) => {
          const active = w.key === focused && !w.minimized
          return (
            <button
              key={w.key}
              type="button"
              title={app(w.key).title}
              onClick={() => (active ? minimize(w.key) : focus(w.key))}
              className={`focus-dotted flex h-[26px] min-w-0 items-center gap-1.5 px-1.5 text-left ${
                compact ? 'w-9 justify-center' : 'max-w-44 flex-1'
              } ${active ? 'dither pt-px font-bold bevel-in' : 'bg-face bevel'}`}
            >
              {small(w.key)}
              {!compact && <span className="truncate">{app(w.key).title}</span>}
            </button>
          )
        })}
      </div>

      <div className="flex h-[26px] shrink-0 items-center gap-1.5 px-2 bevel-thin-in">
        <button
          type="button"
          title={toDesk ? 'Sit at the 3D desk' : 'Back to the screen'}
          onClick={() => setSetting('view', toDesk ? 'desk' : 'screen')}
          className="flex items-center gap-1"
        >
          <ui.cube className="size-4" />
          {!compact && <span>{toDesk ? '3D' : 'Exit 3D'}</span>}
        </button>
        <button
          type="button"
          title={sound === 'on' ? 'Mute sounds' : 'Unmute sounds'}
          onClick={() => setSetting('sound', sound === 'on' ? 'off' : 'on')}
        >
          <ui.speaker className="size-4" muted={sound === 'off'} />
        </button>
        <time className="min-w-14 text-center tabular-nums">{clock}</time>
      </div>
    </div>
  )
}
