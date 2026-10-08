const events = ['mousemove', 'mousedown', 'mouseup', 'click', 'dblclick', 'contextmenu'] as const
const marker = Symbol('remapped')

type Marked = MouseEvent & { [marker]?: true }
type Point = [number, number]

function solve(a: number[][], b: number[]) {
  const n = b.length
  const m = a.map((row, i) => [...row, b[i]])
  for (let col = 0; col < n; col++) {
    let pivot = col
    for (let row = col + 1; row < n; row++) if (Math.abs(m[row][col]) > Math.abs(m[pivot][col])) pivot = row
    ;[m[col], m[pivot]] = [m[pivot], m[col]]
    if (Math.abs(m[col][col]) < 1e-12) return null
    for (let row = 0; row < n; row++) {
      if (row === col) continue
      const factor = m[row][col] / m[col][col]
      for (let k = col; k <= n; k++) m[row][k] -= factor * m[col][k]
    }
  }
  return m.map((row, i) => row[n] / row[i])
}

function homography(from: Point[], to: Point[]) {
  const a: number[][] = []
  const b: number[] = []
  for (let i = 0; i < 4; i++) {
    const [x, y] = from[i]
    const [u, v] = to[i]
    a.push([x, y, 1, 0, 0, 0, -u * x, -u * y])
    b.push(u)
    a.push([0, 0, 0, x, y, 1, -v * x, -v * y])
    b.push(v)
  }
  const h = solve(a, b)
  if (!h) return null
  return ([x, y]: Point): Point => {
    const w = h[6] * x + h[7] * y + 1
    return [(h[0] * x + h[1] * y + h[2]) / w, (h[3] * x + h[4] * y + h[5]) / w]
  }
}

function probes(screen: HTMLElement) {
  const existing = screen.querySelectorAll<HTMLElement>('[data-probe]')
  if (existing.length === 4) return [...existing]
  return (['0 0', '100% 0', '0 100%', '100% 100%'] as const).map((pos) => {
    const [left, top] = pos.split(' ')
    const el = document.createElement('div')
    el.dataset.probe = ''
    el.style.cssText = `position:absolute;width:0;height:0;pointer-events:none;left:${left};top:${top}`
    screen.appendChild(el)
    return el
  })
}

export function remapPointer(host: HTMLElement) {
  function remap(event: Marked) {
    if (event[marker]) return
    const screen = host.querySelector<HTMLElement>('.xterm-screen')
    const target = event.target as HTMLElement | null
    if (!screen || !target || !screen.contains(target)) return

    const rect = screen.getBoundingClientRect()
    const scaled = Math.abs(rect.width - screen.offsetWidth) > 1 || Math.abs(rect.height - screen.offsetHeight) > 1
    if (!scaled) return

    const w = screen.offsetWidth
    const h = screen.offsetHeight
    const projected = probes(screen).map((p) => {
      const r = p.getBoundingClientRect()
      return [r.left, r.top] as Point
    })
    const toLocal = homography(projected, [
      [0, 0],
      [w, 0],
      [0, h],
      [w, h],
    ])
    if (!toLocal) return
    const [lx, ly] = toLocal([event.clientX, event.clientY])

    event.stopImmediatePropagation()
    const copy = new MouseEvent(event.type, {
      bubbles: true,
      cancelable: true,
      composed: true,
      button: event.button,
      buttons: event.buttons,
      shiftKey: event.shiftKey,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
      clientX: rect.left + lx,
      clientY: rect.top + ly,
    }) as Marked
    copy[marker] = true
    target.dispatchEvent(copy)
    if (copy.defaultPrevented) event.preventDefault()
  }

  for (const type of events) host.addEventListener(type, remap, true)
  return () => {
    for (const type of events) host.removeEventListener(type, remap, true)
  }
}
