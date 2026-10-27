'use client'

import '@xterm/xterm/css/xterm.css'

import { ClipboardAddon } from '@xterm/addon-clipboard'
import { FitAddon } from '@xterm/addon-fit'
import { ImageAddon } from '@xterm/addon-image'
import { Unicode11Addon } from '@xterm/addon-unicode11'
import { Terminal as Xterm } from '@xterm/xterm'
import { useEffect, useRef } from 'react'
import { Readline } from 'xterm-readline'

import { games } from '@/content/games'
import type { AppKey } from '@/lib/apps'
import { CLEAR, CRLF, image } from '@/lib/ansi'
import { launchGame } from '@/lib/dialogs'
import { defaultFont, fonts } from '@/lib/fonts'
import { home } from '@/lib/fs'
import { remapPointer } from '@/lib/pointer'
import { getSetting, setSetting } from '@/lib/settings'
import { bootLines, complete, prompt, run, startup } from '@/lib/shell'
import { sleep, toBase64 } from '@/lib/utils'
import { terminalBackground, xtermTheme } from '@/lib/theme'

function fontFamily(key: string) {
  const font = fonts.find((f) => f.key === key) ?? fonts.find((f) => f.key === defaultFont) ?? fonts[0]
  const root = document.documentElement
  root.style.setProperty('--font-mono', `var(${font.variable})`)
  const family = getComputedStyle(root).getPropertyValue(font.variable).trim()
  return { family: family || 'monospace', weight: font.weight, bold: font.heroWeight }
}

type Props = { active?: boolean; onExit?: () => void; onApp?: (key: AppKey, sub?: string) => void }

export default function Terminal({ active = true, onExit, onApp }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const termRef = useRef<Xterm | null>(null)
  const handlers = useRef({ onExit, onApp })
  useEffect(() => {
    handlers.current = { onExit, onApp }
  })

  useEffect(() => {
    const host = hostRef.current as HTMLDivElement

    let fontKey = getSetting('font')
    const font = fontFamily(fontKey)
    const term = new Xterm({
      allowProposedApi: true,
      cursorBlink: true,
      cursorStyle: 'underline',
      cursorWidth: 2,
      convertEol: true,
      scrollback: 500,
      fontFamily: font.family,
      fontWeight: font.weight,
      fontWeightBold: font.bold,
      fontSize: 16,
      lineHeight: 1,
      theme: xtermTheme,
      linkHandler: { activate: (_, uri) => window.open(uri, '_blank', 'noreferrer'), allowNonHttpProtocols: true },
    })
    termRef.current = term
    const fit = new FitAddon()
    term.loadAddon(fit)
    term.loadAddon(new Unicode11Addon())
    term.loadAddon(new ImageAddon({ sixelSupport: false, showPlaceholder: false }))
    term.loadAddon(new ClipboardAddon())
    const readline = new Readline()
    term.loadAddon(readline)
    term.unicode.activeVersion = '11'

    let disposed = false
    let cwd = home
    // Tab cycles through matches in place, like cmd.exe; Shift+Tab goes back
    let cycle: { options: string[]; index: number; shown: string } | null = null

    const ctx = () => ({ origin: window.location.origin, cwd })

    function resize() {
      const width = host.clientWidth
      // The VGA bitmap font is only crisp at whole multiples of its 16px design size
      term.options.fontSize =
        fontKey === 'vga' ? (width >= 2200 ? 32 : 16) : Math.min(24, Math.max(15, Math.round(width / 38)))
      const dims = fit.proposeDimensions()
      if (dims && dims.cols > 0 && dims.rows > 1) term.resize(dims.cols, dims.rows - 1)
    }

    function writeLines(lines: string[]) {
      for (const line of lines) term.write(line + CRLF)
    }

    async function execute(input: string) {
      const result = run(input.trim(), ctx())
      if (result.action?.type === 'clear') term.write(CLEAR)
      else writeLines(result.out)

      const action = result.action
      if (!action) return
      if (action.type === 'cd') cwd = action.path
      if (action.type === 'open') window.open(action.href, '_blank', 'noreferrer')
      if (action.type === 'font') {
        const next = fontFamily(action.key)
        await document.fonts.load(`16px ${next.family}`)
        term.options.fontFamily = next.family
        term.options.fontWeight = next.weight
        term.options.fontWeightBold = next.bold
        setSetting('font', action.key)
        fontKey = action.key
        resize()
      }
      if (action.type === 'app') handlers.current.onApp?.(action.key, action.sub)
      if (action.type === 'game') {
        const game = games.find((g) => g.slug === action.slug)
        if (game) launchGame(game)
      }
      if (action.type === 'exit') {
        await sleep(300)
        handlers.current.onExit?.()
      }
      if (action.type === 'copy') term.write(`\x1b]52;c;${btoa(action.text)}\x07`)
      if (action.type === 'sound') setSetting('sound', action.on ? 'on' : 'off')
      if (action.type === 'image') {
        try {
          const { base64, bytes } = await toBase64(action.url)
          term.write(image(base64, bytes) + CRLF)
        } catch {
          term.write(`avatar: could not load image${CRLF}`)
        }
      }
    }

    function completeLine(back: boolean) {
      const line = readline.getLine()
      if (!cycle || cycle.shown !== line) {
        const options = complete(line, cwd)
        if (!options.length) return
        if (options.length === 1 && !/[\\/]$/.test(options[0])) options[0] += ' '
        cycle = { options, index: back ? 0 : -1, shown: '' }
      }
      const { options } = cycle
      cycle.index = (cycle.index + (back ? -1 : 1) + options.length) % options.length
      cycle.shown = options[cycle.index]
      readline.updateLine(cycle.shown)
    }

    async function loop() {
      while (!disposed) {
        const input = await readline.read(prompt(cwd))
        if (disposed) return
        cycle = null
        await execute(input)
      }
    }

    async function boot() {
      // The prompt font is only used inside xterm, so nothing loads it unless asked; cells are measured from it
      await Promise.all([document.fonts.load(`16px ${font.family}`), document.fonts.ready])
      if (disposed) return
      term.open(host)
      resize()
      term.focus()

      writeLines(bootLines())
      for (const command of startup) {
        await sleep(250)
        if (disposed) return
        term.write(prompt(cwd) + command + CRLF)
        await execute(command)
        term.write(CRLF)
      }
      void loop()
    }

    term.attachCustomKeyEventHandler((event) => {
      if (event.key === 'Tab') {
        // Keep the browser from moving focus out of the prompt
        event.preventDefault()
        if (event.type === 'keydown') completeLine(event.shiftKey)
        return false
      }
      return true
    })
    const selection = term.onSelectionChange(() => {
      if (term.hasSelection()) term.clearSelection()
    })
    const observer = new ResizeObserver(() => {
      if (term.element) resize()
    })
    observer.observe(host)
    const unmap = remapPointer(host)
    void boot()

    return () => {
      disposed = true
      termRef.current = null
      selection.dispose()
      observer.disconnect()
      unmap()
      term.dispose()
    }
  }, [])

  // Bringing the window to the front hands the keyboard back to the prompt
  useEffect(() => {
    if (active) termRef.current?.focus()
  }, [active])

  return (
    <div className="h-full px-2 py-1 select-none" style={{ background: terminalBackground }}>
      <div ref={hostRef} className="term h-full w-full" />
    </div>
  )
}
