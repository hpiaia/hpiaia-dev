'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { AppView, windowTitle } from '@/components/desktop/apps'
import { appIcons } from '@/components/desktop/icons'
import { Winamp } from '@/components/desktop/apps/winamp/Winamp'
import { MessageBox } from '@/components/desktop/MessageBox'
import { Search } from '@/components/desktop/Search'
import { Taskbar } from '@/components/desktop/Taskbar'
import { Window } from '@/components/desktop/Window'
import { games } from '@/content/games'
import { site } from '@/content/site'
import { app, type AppKey, apps, pathOf } from '@/lib/apps'
import { launchGame } from '@/lib/dialogs'
import { useKeyboardSounds } from '@/lib/hooks'
import { documentTitle } from '@/lib/seo'
import { open, setBounds, useWindows, type Win } from '@/lib/windows'

type Props = { initial: { key: AppKey; sub?: string } }

// Windows outlive a Desktop: switching between the screen and the 3D desk remounts it
let started = false

type Shortcut = { id: string; label: string; icon: React.ReactNode; href?: string; run: () => void }

const selectedTint = '[filter:sepia(1)_hue-rotate(190deg)_saturate(5)_brightness(0.6)]'

const appShortcuts: Shortcut[] = apps.map((a) => {
  const Icon = appIcons[a.key]
  return { id: a.key, label: a.label, icon: <Icon className="size-10" />, href: pathOf(a.key), run: () => open(a.key) }
})

const gameShortcuts: Shortcut[] = games.map((g) => ({
  id: g.slug,
  label: g.label,
  icon: (
    // Low priority keeps React from preloading them ahead of the page's own content
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={g.icon ?? g.cover}
      alt=""
      fetchPriority="low"
      className={g.icon ? 'size-[32px]' : 'h-[40px] w-[30px] border border-black object-cover shadow-[1px_1px_0_#000]'}
    />
  ),
  run: () => launchGame(g),
}))

// Nothing is remembered between visits. The home page starts with About on top, the prompt
// below it and Winamp off to the right; a direct link to an app opens just that app
function boot(initial: Props['initial']) {
  if (initial.key !== 'about' || initial.sub) return open(initial.key, initial.sub)
  const { w, h } = useWindows.getState().bounds
  const at = (x: number, y: number) => ({ x: Math.round(w * x), y: Math.round(h * y) })
  open('winamp')
  open('terminal', undefined, { ...at(0.069, 0.444), w: 700, h: 400 })
  open('about', undefined, { ...at(0.209, 0.049), w: Math.round(w * 0.543), h: Math.round(h * 0.798) })
}

function DesktopIcon({
  shortcut,
  selected,
  onSelect,
}: {
  shortcut: Shortcut
  selected: boolean
  onSelect: () => void
}) {
  const pointer = useRef('mouse')
  const props = {
    onPointerDown: (e: React.PointerEvent) => {
      pointer.current = e.pointerType
    },
    // Touch and keyboard open on a single activation; a mouse selects first, like the real thing
    onClick: (e: React.MouseEvent) => {
      if (shortcut.href && (e.metaKey || e.ctrlKey || e.shiftKey)) return
      e.preventDefault()
      if (pointer.current === 'touch' || e.detail === 0) shortcut.run()
      else onSelect()
    },
    onDoubleClick: shortcut.run,
    className: 'group flex w-full flex-col items-center gap-1 px-1 py-1.5 outline-none',
  }
  const body = (
    <>
      <span className={`grid min-h-10 place-items-center ${selected ? selectedTint : ''}`}>{shortcut.icon}</span>
      <span
        className={`px-0.5 text-center leading-tight text-white ${
          selected ? 'bg-select outline-1 outline-white outline-dotted' : '[text-shadow:1px_1px_#000]'
        }`}
      >
        {shortcut.label}
      </span>
    </>
  )
  return (
    <li className="w-[88px]">
      {/* Apps are real links so crawlers find every page */}
      {shortcut.href ? (
        <a href={shortcut.href} {...props}>
          {body}
        </a>
      ) : (
        <button type="button" {...props}>
          {body}
        </button>
      )}
    </li>
  )
}

export function Desktop({ initial }: Props) {
  const layer = useRef<HTMLDivElement>(null)
  // Find renders into the desktop layer, so it needs the element itself during render
  const [layerElement, setLayerElement] = useState<HTMLDivElement | null>(null)
  const { windows, focused, bounds } = useWindows()
  const [finding, setFinding] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [off, setOff] = useState(false)
  const compact = bounds.w > 0 && bounds.w < 640
  useKeyboardSounds()

  useLayoutEffect(() => {
    const el = layer.current as HTMLDivElement
    const measure = () => setBounds(el.clientWidth, el.clientHeight)
    measure()
    if (!started) {
      started = true
      boot(initial)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [initial])

  // Until the desktop is measured (on the server and during hydration) the requested window renders centered
  const booting = !started && windows.length === 0
  const shown: Win[] = booting
    ? [
        {
          ...initial,
          x: 0,
          y: 0,
          w: app(initial.key).size[0],
          h: app(initial.key).size[1],
          z: 1,
          minimized: false,
          maximized: false,
        },
      ]
    : windows

  const current = windows.find((w) => w.key === focused)
  const title = current ? documentTitle(current.key, current.sub) : site.title

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setFinding((s) => !s)
      }
      if (e.key === 'F1') {
        e.preventDefault()
        open('credits')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (off)
    return (
      <button
        type="button"
        onClick={() => setOff(false)}
        className="flex h-full w-full flex-col items-center justify-center gap-6 bg-black px-6 text-center text-2xl font-bold text-[#ff8a00]"
      >
        It&apos;s now safe to turn off your computer.
        <span className="text-sm font-normal text-[#8a8a8a]">click anywhere to start it again</span>
      </button>
    )

  return (
    // The desktop is a size container: compact layouts switch in CSS, so the first paint already matches what
    // the window manager picks once it measures (on phones that used to shift every window after load)
    <div className="@container/desk relative isolate flex h-full w-full flex-col overflow-hidden text-ink select-none">
      <div aria-hidden className="wallpaper absolute inset-0 -z-10" />
      <div
        ref={(el) => {
          layer.current = el
          setLayerElement(el)
        }}
        className="relative isolate min-h-0 flex-1"
        onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}
      >
        {shown.map((win) =>
          win.key === 'winamp' ? (
            <Winamp key={win.key} win={win} compact={compact} />
          ) : (
            <Window
              key={win.key}
              win={win}
              title={windowTitle(win)}
              focused={booting || focused === win.key}
              compact={compact}
              layer={layer}
              pending={booting}
              primary={win.key === initial.key}
            >
              <AppView win={win} focused={booting || focused === win.key} />
            </Window>
          ),
        )}
        {/* After the windows in the source so the page's content comes first; the windows still paint on top */}
        <div
          className="flex h-full content-start items-start gap-1 p-1 @max-[639px]/desk:pointer-events-none @max-[639px]/desk:flex-wrap @max-[639px]/desk:[&_li]:pointer-events-auto"
          onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          {[appShortcuts, gameShortcuts].map((group, i) => (
            <ul
              key={i}
              className={`flex h-full flex-col gap-1 @max-[639px]/desk:contents ${i === 0 ? 'flex-wrap content-start' : 'ml-auto flex-wrap-reverse content-start'}`}
              onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}
            >
              {group.map((s) => (
                <DesktopIcon key={s.id} shortcut={s} selected={selected === s.id} onSelect={() => setSelected(s.id)} />
              ))}
            </ul>
          ))}
        </div>
        {finding && <Search container={layerElement} onClose={() => setFinding(false)} />}
        <MessageBox />
      </div>
      <Taskbar compact={compact} onFind={() => setFinding(true)} onShutdown={() => setOff(true)} />
    </div>
  )
}
