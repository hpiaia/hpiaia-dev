'use client'

import { appIcons, ui } from '@/components/desktop/icons'
import { localPoint } from '@/lib/pointer'
import { ownHeading } from '@/lib/seo'
import { close, focus, minimize, minSize, place, type Rect, toggleMaximize, type Win } from '@/lib/windows'

type Edge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

type Props = React.PropsWithChildren<{
  win: Win
  title: string
  focused: boolean
  compact: boolean
  layer: React.RefObject<HTMLDivElement | null>
  // Rendered before the desktop is measured: centered with CSS until the window manager takes over
  pending?: boolean
}>

const edges: [Edge, string][] = [
  ['n', '-top-1 inset-x-3 h-2 cursor-ns-resize'],
  ['s', '-bottom-1 inset-x-3 h-2 cursor-ns-resize'],
  ['e', '-right-1 inset-y-3 w-2 cursor-ew-resize'],
  ['w', '-left-1 inset-y-3 w-2 cursor-ew-resize'],
  ['nw', '-top-1 -left-1 size-4 cursor-nwse-resize'],
  ['se', '-bottom-1 -right-1 size-4 cursor-nwse-resize'],
  ['ne', '-top-1 -right-1 size-4 cursor-nesw-resize'],
  ['sw', '-bottom-1 -left-1 size-4 cursor-nesw-resize'],
]

function resized(start: Rect, edge: Edge, dx: number, dy: number): Rect {
  let { x, y, w, h } = start
  if (edge.includes('e')) w = Math.max(minSize.w, start.w + dx)
  if (edge.includes('w')) {
    w = Math.max(minSize.w, start.w - dx)
    x = start.x + start.w - w
  }
  if (edge.includes('s')) h = Math.max(minSize.h, start.h + dy)
  if (edge.includes('n')) {
    h = Math.max(minSize.h, start.h - dy)
    y = start.y + start.h - h
  }
  return { x, y, w, h }
}

function centered({ w, h }: Rect): React.CSSProperties {
  return {
    left: `max(16px, calc(50% - ${w / 2}px))`,
    top: `max(16px, calc(50% - ${h / 2}px))`,
    width: `min(${w}px, calc(100% - 32px))`,
    height: `min(${h}px, calc(100% - 32px))`,
  }
}

function Control({ label, onClick, children }: React.PropsWithChildren<{ label: string; onClick: () => void }>) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      // Title bar buttons never take keyboard focus away from the app inside, as on the real thing
      onPointerDown={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
      onClick={onClick}
      className="group block h-[14px] w-[16px] shrink-0 bg-face text-ink bevel active:bevel-in"
    >
      <span className="block group-active:translate-x-px group-active:translate-y-px">{children}</span>
    </button>
  )
}

export function Window({ win, title, focused, compact, layer, pending, children }: Props) {
  const full = compact || win.maximized
  const { key } = win

  function drag(e: React.PointerEvent<HTMLElement>, edge?: Edge) {
    const root = layer.current
    if (e.buttons !== 1 || !root || compact || pending) return
    e.preventDefault()
    e.stopPropagation()
    focus(key)
    const [sx, sy] = localPoint(root, e.clientX, e.clientY)
    const start = win.maximized ? { x: sx - win.w / 2, y: 0, w: win.w, h: win.h } : { ...win }
    const target = e.currentTarget
    target.setPointerCapture(e.pointerId)
    root.setAttribute('data-dragging', '')

    function move(event: PointerEvent) {
      const [px, py] = localPoint(root as HTMLDivElement, event.clientX, event.clientY)
      const dx = px - sx
      const dy = py - sy
      place(key, edge ? resized(start, edge, dx, dy) : { ...start, x: start.x + dx, y: start.y + dy })
    }
    function end() {
      root?.removeAttribute('data-dragging')
      target.removeEventListener('pointermove', move)
      target.removeEventListener('pointerup', end)
      target.removeEventListener('pointercancel', end)
    }
    target.addEventListener('pointermove', move)
    target.addEventListener('pointerup', end)
    target.addEventListener('pointercancel', end)
  }

  const Icon = appIcons[key]
  const Title = ownHeading.includes(key) ? 'p' : 'h1'

  return (
    <section
      role="dialog"
      aria-label={title}
      data-focused={focused || undefined}
      onPointerDownCapture={() => focus(key)}
      style={{
        zIndex: win.z,
        ...(full ? { inset: 0 } : pending ? centered(win) : { left: win.x, top: win.y, width: win.w, height: win.h }),
      }}
      className={`absolute flex-col bg-face p-[3px] bevel-window ${win.minimized ? 'hidden' : 'flex'}`}
    >
      <header
        onPointerDown={(e) => {
          if (!win.maximized) drag(e)
        }}
        onPointerMove={(e) => {
          // Pulling a maximized window down past a few pixels restores it, like a real window manager
          if (win.maximized && e.buttons === 1 && Math.abs(e.movementY) > 2) drag(e)
        }}
        onDoubleClick={(e) => {
          if (!compact && !(e.target as HTMLElement).closest('button')) toggleMaximize(key)
        }}
        className={`flex h-[22px] shrink-0 items-center gap-[3px] pr-[3px] pl-[3px] select-none ${focused ? 'title-on' : 'title-off'}`}
      >
        <Icon className="size-[16px] shrink-0" />
        <Title className="line-clamp-1 flex-1 font-bold tracking-wide">{title}</Title>
        {!compact && (
          <span className="flex">
            <Control label="Minimize" onClick={() => minimize(key)}>
              <ui.minimize />
            </Control>
            <Control label={win.maximized ? 'Restore' : 'Maximize'} onClick={() => toggleMaximize(key)}>
              {win.maximized ? <ui.restore /> : <ui.maximize />}
            </Control>
          </span>
        )}
        <span className="ml-[-1px] flex">
          <Control label="Close" onClick={() => close(key)}>
            <ui.close />
          </Control>
        </span>
      </header>
      <div className="@container relative flex min-h-0 flex-1 flex-col pt-[2px]">{children}</div>
      {!full &&
        edges.map(([edge, cls]) => (
          <div key={edge} className={`absolute ${cls}`} onPointerDown={(e) => drag(e, edge)} />
        ))}
    </section>
  )
}
