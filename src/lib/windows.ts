import { create } from 'zustand'

import { app, type AppKey } from '@/lib/apps'
import { setSetting, type View } from '@/lib/settings'

export type Rect = { x: number; y: number; w: number; h: number }
export type Win = Rect & { key: AppKey; sub?: string; z: number; minimized: boolean; maximized: boolean }
type State = { windows: Win[]; focused: AppKey | null; bounds: { w: number; h: number } }

export const minSize = { w: 320, h: 220 }
const margin = 16
const cascade = 28
const header = 36

// Starts empty on the server and during hydration; the Desktop opens the first window once it is measured
export const useWindows = create<State>()(() => ({ windows: [], focused: null, bounds: { w: 0, h: 0 } }))

let top = 0
const state = () => useWindows.getState()
const commit = (next: Partial<State>) => useWindows.setState(next)

function update(key: AppKey, patch: Partial<Win>) {
  return state().windows.map((w) => (w.key === key ? { ...w, ...patch } : w))
}

function clamp(rect: Rect): Rect {
  const { w: bw, h: bh } = state().bounds
  const w = Math.max(minSize.w, Math.min(rect.w, bw))
  const h = Math.max(minSize.h, Math.min(rect.h, bh))
  // Keep enough of the header on screen to grab it again
  const x = Math.min(Math.max(rect.x, 80 - w), bw - 80)
  const y = Math.min(Math.max(rect.y, 0), bh - header)
  return { x, y, w, h }
}

function nextFocus(windows: Win[]) {
  const visible = windows.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)
  return visible[0]?.key ?? null
}

function placement(key: AppKey): Rect {
  const { w: bw, h: bh } = state().bounds
  const [dw, dh] = app(key).size
  const w = Math.min(dw, bw - margin * 2)
  const h = Math.min(dh, bh - margin * 2)
  const offset = (state().windows.length % 6) * cascade
  const x = Math.round((bw - w) / 2) + offset - cascade
  const y = Math.max(margin, Math.round((bh - h) / 2) + offset - cascade)
  return clamp({ x, y, w, h })
}

// When the desktop shrinks (a smaller browser, or the 3D monitor), windows are pulled back fully on screen
function fit(rect: Rect): Rect {
  const { w: bw, h: bh } = state().bounds
  const w = Math.min(rect.w, bw)
  const h = Math.min(rect.h, bh)
  return { w, h, x: Math.min(Math.max(rect.x, 0), bw - w), y: Math.min(Math.max(rect.y, 0), bh - h) }
}

export function setBounds(w: number, h: number) {
  if (w === state().bounds.w && h === state().bounds.h) return
  const shrunk = w < state().bounds.w || h < state().bounds.h
  commit({ bounds: { w, h } })
  commit({ windows: state().windows.map((win) => ({ ...win, ...(shrunk ? fit(win) : clamp(win)) })) })
}

export function open(key: AppKey, sub?: string, at?: Partial<Rect>) {
  const existing = state().windows.find((w) => w.key === key)
  const z = ++top
  if (existing) {
    commit({ windows: update(key, { z, minimized: false, ...(sub !== undefined && { sub }) }), focused: key })
    return
  }
  const win: Win = { key, sub, z, minimized: false, maximized: false, ...clamp({ ...placement(key), ...at }) }
  commit({ windows: [...state().windows, win], focused: key })
}

export function closeAll() {
  commit({ windows: [], focused: null })
}

// The screen and the 3D desk each start with their own windows. The new desktop lays them out once it is
// measured; a saved view arriving at load isn't a switch, so a direct link still opens its app
let switched = false

export function switchView(view: View) {
  switched = true
  setSetting('view', view)
}

export function takeSwitch() {
  const was = switched
  switched = false
  return was
}

export function close(key: AppKey) {
  const windows = state().windows.filter((w) => w.key !== key)
  commit({ windows, focused: nextFocus(windows) })
}

export function focus(key: AppKey) {
  if (state().focused === key && state().windows.find((w) => w.key === key)?.z === top) return
  commit({ windows: update(key, { z: ++top, minimized: false }), focused: key })
}

export function minimize(key: AppKey) {
  const windows = update(key, { minimized: true })
  commit({ windows, focused: nextFocus(windows) })
}

export function toggleMaximize(key: AppKey) {
  const win = state().windows.find((w) => w.key === key)
  if (win) commit({ windows: update(key, { maximized: !win.maximized, z: ++top }), focused: key })
}

export function place(key: AppKey, rect: Rect) {
  commit({ windows: update(key, { ...clamp(rect), maximized: false }) })
}

export function navigate(key: AppKey, sub?: string) {
  commit({ windows: update(key, { sub }) })
}
