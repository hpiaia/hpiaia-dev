'use client'

import * as Menu from '@radix-ui/react-dropdown-menu'
import { useState } from 'react'

import { appIcons, FolderIcon, Logo, ui } from '@/components/desktop/icons'
import { games } from '@/content/games'
import { resume } from '@/content/resume'
import { site } from '@/content/site'
import { app, type AppKey } from '@/lib/apps'
import { launchGame } from '@/lib/dialogs'
import { useClock } from '@/lib/hooks'
import { setSetting, useSetting } from '@/lib/settings'
import { companies } from '@/lib/utils'
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

const itemClass =
  'flex w-full cursor-default items-center gap-2 pr-3 pl-1.5 text-left outline-none data-[highlighted]:bg-select data-[highlighted]:text-select-ink data-[state=open]:bg-select data-[state=open]:text-select-ink'

function Row({ entry, size }: { entry: Exclude<Entry, 'separator'>; size: 'large' | 'small' }) {
  const height = size === 'large' ? 'h-9' : 'h-6'
  const body = (
    <>
      <span className={`grid shrink-0 place-items-center ${size === 'large' ? 'size-7' : 'size-5'}`}>{entry.icon}</span>
      <span className="flex-1 whitespace-nowrap">{entry.label}</span>
      {entry.children && <ui.arrow className="size-2" />}
    </>
  )
  if (entry.children)
    return (
      <div className="start-sub relative">
        <Menu.Sub>
          <Menu.SubTrigger className={`${itemClass} ${height}`}>{body}</Menu.SubTrigger>
          <Menu.SubContent className="min-w-48 bg-face p-[3px] outline-none bevel-window">
            <Entries entries={entry.children} size="small" />
          </Menu.SubContent>
        </Menu.Sub>
      </div>
    )
  if (entry.href)
    return (
      <Menu.Item asChild className={`${itemClass} ${height}`}>
        <a href={entry.href} target="_blank" rel="noreferrer">
          {body}
        </a>
      </Menu.Item>
    )
  return (
    <Menu.Item className={`${itemClass} ${height}`} onSelect={entry.run}>
      {body}
    </Menu.Item>
  )
}

function Entries({ entries, size }: { entries: Entry[]; size: 'large' | 'small' }) {
  return entries.map((entry, i) =>
    entry === 'separator' ? (
      <Menu.Separator key={i} className="mx-1 my-1 h-0.5 bevel-thin-in" />
    ) : (
      <Row key={entry.label} entry={entry} size={size} />
    ),
  )
}

type Props = { compact: boolean; onFind: () => void; onShutdown: () => void }

export function Taskbar({ compact, onFind, onShutdown }: Props) {
  const [start, setStart] = useState(false)
  const { windows, focused } = useWindows()
  const view = useSetting('view')
  const sound = useSetting('sound')
  const night = useSetting('appearance') === 'dark'
  const clock = useClock()
  const toDesk = view === 'screen'

  const program = (key: AppKey, label = app(key).label): Entry => ({ label, icon: small(key), run: () => open(key) })
  const entries: Entry[] = [
    {
      label: 'Programs',
      icon: <FolderIcon className="size-6" />,
      children: [
        ...(['about', 'work', 'cv', 'terminal', 'skills', 'contact', 'music', 'winamp'] as AppKey[]).map((k) =>
          program(k),
        ),
        'separator',
        {
          label: 'Games',
          icon: <FolderIcon className="size-4" />,
          children: games.map((g) => ({
            label: g.title,
            // eslint-disable-next-line @next/next/no-img-element
            icon: <img src={g.icon ?? g.cover} alt="" className={g.icon ? 'size-[16px]' : 'h-4 w-3 object-cover'} />,
            run: () => launchGame(g),
          })),
        },
      ],
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
    <div className="start-anchor relative z-20 flex h-[34px] shrink-0 items-center gap-1 bg-face px-[2px] shadow-[inset_0_1px_var(--w-light),inset_0_2px_var(--w-hilite)]">
      {/* No portal, so the menu stays inside the desktop and shows on the 3D monitor */}
      <Menu.Root open={start} onOpenChange={setStart} modal={false}>
        <Menu.Trigger
          className={`focus-dotted flex h-[26px] shrink-0 items-center gap-1 px-1.5 font-bold outline-none ${start ? 'bevel-in [&>*]:translate-x-px [&>*]:translate-y-px' : 'bevel'}`}
        >
          <span className="flex items-center gap-1">
            <Logo className="size-5" />
            Start
          </span>
        </Menu.Trigger>
        <Menu.Content loop className="flex bg-face p-[3px] outline-none bevel-window">
          <div className="flex w-7 items-end justify-center bg-gradient-to-t from-[#000080] to-[#1084d0] pb-2">
            <span className="rotate-180 text-lg leading-none whitespace-nowrap text-white [writing-mode:vertical-rl]">
              <b>hpiaia</b>
              <span className="font-normal">97</span>
            </span>
          </div>
          <div className="min-w-52 py-0.5">
            <Entries entries={entries} size="large" />
          </div>
        </Menu.Content>
      </Menu.Root>
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
              } ${active ? 'dither font-bold bevel-in [&>*]:translate-y-px' : 'bg-face bevel'}`}
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
          <ui.cube className="size-[16px]" />
          <span className="@max-[639px]/desk:hidden">{toDesk ? '3D' : 'Exit 3D'}</span>
        </button>
        <button
          type="button"
          title={night ? 'Standard scheme' : 'Night scheme'}
          aria-pressed={night}
          onClick={() => setSetting('appearance', night ? 'light' : 'dark')}
        >
          {night ? <ui.moon className="size-[16px]" /> : <ui.sun className="size-[16px]" />}
        </button>
        <button
          type="button"
          title={sound === 'on' ? 'Mute sounds' : 'Unmute sounds'}
          onClick={() => setSetting('sound', sound === 'on' ? 'off' : 'on')}
        >
          <ui.speaker className="size-[16px]" muted={sound === 'off'} />
        </button>
        <time className="min-w-14 text-center tabular-nums">{clock}</time>
      </div>
    </div>
  )
}
