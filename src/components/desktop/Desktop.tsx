'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'

import { AppView, windowTitle } from '@/components/desktop/apps'
import { appIcons } from '@/components/desktop/icons'
import { Search } from '@/components/desktop/Search'
import { Taskbar } from '@/components/desktop/Taskbar'
import { Window } from '@/components/desktop/Window'
import { site } from '@/content/site'
import { type App, type AppKey, apps, pathOf } from '@/lib/apps'
import { open, setBounds, useWindows } from '@/lib/windows'

type Props = { initial: { key: AppKey; sub?: string } }

// Windows outlive a Desktop: switching between the screen and the 3D desk remounts it
let started = false

function DesktopIcon({ app, selected, onSelect }: { app: App; selected: boolean; onSelect: () => void }) {
  const Icon = appIcons[app.key]
  const pointer = useRef('mouse')
  return (
    <li className="w-[88px]">
      <button
        type="button"
        onPointerDown={(e) => {
          pointer.current = e.pointerType
        }}
        // Touch and keyboard open on a single activation; a mouse selects first, like the real thing
        onClick={(e) => (pointer.current === 'touch' || e.detail === 0 ? open(app.key) : onSelect())}
        onDoubleClick={() => open(app.key)}
        className="group flex w-full flex-col items-center gap-1 px-1 py-1.5 outline-none"
      >
        <Icon
          className={`size-10 ${selected ? '[filter:sepia(1)_hue-rotate(190deg)_saturate(5)_brightness(0.6)]' : ''}`}
        />
        <span
          className={`px-0.5 text-center leading-tight text-white ${
            selected ? 'bg-select outline-1 outline-white outline-dotted' : '[text-shadow:1px_1px_#000]'
          }`}
        >
          {app.label}
        </span>
      </button>
    </li>
  )
}

export function Desktop({ initial }: Props) {
  const layer = useRef<HTMLDivElement>(null)
  const { windows, focused, bounds } = useWindows()
  const [finding, setFinding] = useState(false)
  const [selected, setSelected] = useState<AppKey | null>(null)
  const [off, setOff] = useState(false)
  const compact = bounds.w > 0 && bounds.w < 640

  useLayoutEffect(() => {
    const el = layer.current as HTMLDivElement
    const measure = () => setBounds(el.clientWidth, el.clientHeight)
    measure()
    if (!started) {
      started = true
      open(initial.key, initial.sub)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [initial])

  const current = windows.find((w) => w.key === focused)
  const path = current ? pathOf(current.key, current.sub) : '/'
  const title = current && current.key !== 'about' ? `${windowTitle(current)} · ${site.name}` : site.title

  useEffect(() => {
    if (window.location.pathname !== path) window.history.replaceState(null, '', path)
    document.title = title
  }, [path, title])

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
    <div className="relative isolate flex h-full w-full flex-col overflow-hidden text-ink select-none">
      <div aria-hidden className="wallpaper absolute inset-0 -z-10" />
      <div
        ref={layer}
        className="relative isolate min-h-0 flex-1"
        onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}
      >
        <ul
          className={`flex h-full flex-col flex-wrap content-start gap-1 p-1 ${compact ? 'pointer-events-none [&>li]:pointer-events-auto' : ''}`}
          onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          {apps.map((a) => (
            <DesktopIcon key={a.key} app={a} selected={selected === a.key} onSelect={() => setSelected(a.key)} />
          ))}
        </ul>
        {windows.map((win) => (
          <Window
            key={win.key}
            win={win}
            title={windowTitle(win)}
            focused={focused === win.key}
            compact={compact}
            layer={layer}
          >
            <AppView win={win} focused={focused === win.key} />
          </Window>
        ))}
        {finding && <Search onClose={() => setFinding(false)} />}
      </div>
      <Taskbar compact={compact} onFind={() => setFinding(true)} onShutdown={() => setOff(true)} />
    </div>
  )
}
