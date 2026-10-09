'use client'

import '@xterm/xterm/css/xterm.css'

import { ClipboardAddon } from '@xterm/addon-clipboard'
import { FitAddon } from '@xterm/addon-fit'
import { ImageAddon } from '@xterm/addon-image'
import { ProgressAddon } from '@xterm/addon-progress'
import { Unicode11Addon } from '@xterm/addon-unicode11'
import { Terminal as Xterm } from '@xterm/xterm'
import { useEffect, useRef } from 'react'

import { CLEAR, CRLF, dim, image, progress } from '@/lib/ansi'
import { defaultFont, fonts } from '@/lib/fonts'
import { keyDown, keyUp, warm } from '@/lib/keys'
import { remapPointer } from '@/lib/pointer'
import { bootLines, complete, loginLines, prompt, run } from '@/lib/shell'
import { Crt } from '@/components/Crt'

const theme = {
  background: '#00000000',
  foreground: '#9dff9f',
  cursor: '#9dff9f',
  cursorAccent: '#040a06',
  selectionBackground: '#9dff9f',
  selectionForeground: '#040a06',
}

function fontFamily(key: string | null) {
  const font = fonts.find((f) => f.key === key) ?? fonts.find((f) => f.key === defaultFont) ?? fonts[0]
  const root = document.documentElement
  root.style.setProperty('--font-mono', `var(${font.variable})`)
  const family = getComputedStyle(root).getPropertyValue(font.variable).trim()
  return { family: family || 'monospace', weight: font.weight, bold: font.heroWeight }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function bar(value: number, width = 30) {
  const filled = Math.round((value / 100) * width)
  return `${dim('[')}${'#'.repeat(filled)}${dim('.'.repeat(width - filled))}${dim(']')} ${String(Math.round(value)).padStart(3)}%`
}

async function toBase64(url: string) {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  let binary = ''
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte)
  return { base64: btoa(binary), bytes: buffer.byteLength }
}

export default function Terminal() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current as HTMLDivElement

    const font = fontFamily(localStorage.getItem('font'))
    const term = new Xterm({
      allowProposedApi: true,
      allowTransparency: true,
      cursorBlink: true,
      cursorStyle: 'block',
      convertEol: true,
      scrollback: 500,
      fontFamily: font.family,
      fontWeight: font.weight,
      fontWeightBold: font.bold,
      fontSize: 16,
      lineHeight: 1.5,
      letterSpacing: 1,
      theme,
      linkHandler: { activate: (_, uri) => window.open(uri, '_blank', 'noreferrer'), allowNonHttpProtocols: true },
    })
    const fit = new FitAddon()
    const progressAddon = new ProgressAddon()
    term.loadAddon(fit)
    term.loadAddon(new Unicode11Addon())
    term.loadAddon(new ImageAddon({ sixelSupport: false, showPlaceholder: false }))
    term.loadAddon(new ClipboardAddon())
    term.loadAddon(progressAddon)
    term.unicode.activeVersion = '11'

    let disposed = false
    let busy = true
    let sound = localStorage.getItem('sound') !== 'off'
    let buffer = ''
    let cursor = 0
    let history: string[] = []
    let historyIndex = -1
    let cwd = ''

    const ctx = () => ({ origin: window.location.origin, cwd })

    function resize() {
      const width = host.clientWidth
      term.options.fontSize = Math.round(width / 42)
      const dims = fit.proposeDimensions()
      if (dims && dims.cols > 0 && dims.rows > 1) term.resize(dims.cols, dims.rows - 1)
    }

    function redraw() {
      term.write(`\r\x1b[K${prompt(cwd)}${buffer}`)
      const back = buffer.length - cursor
      if (back > 0) term.write(`\x1b[${back}D`)
    }

    function writeLines(lines: string[]) {
      for (const line of lines) term.write(line + CRLF)
    }

    async function execute(input: string) {
      const command = input.trim()
      if (command && history[history.length - 1] !== command) history = [...history, command]
      historyIndex = -1
      const result = run(command, ctx())
      if (result.action?.type === 'clear') term.write(CLEAR)
      else writeLines(result.out)

      const action = result.action
      if (!action) return
      if (action.type === 'cd') cwd = action.path
      if (action.type === 'open') window.open(action.href, '_blank', 'noreferrer')
      if (action.type === 'font') {
        const next = fontFamily(action.key)
        term.options.fontFamily = next.family
        term.options.fontWeight = next.weight
        term.options.fontWeightBold = next.bold
        localStorage.setItem('font', action.key)
        resize()
      }
      if (action.type === 'copy') term.write(`\x1b]52;c;${btoa(action.text)}\x07`)
      if (action.type === 'sound') {
        sound = action.on
        localStorage.setItem('sound', sound ? 'on' : 'off')
      }
      if (action.type === 'image') {
        try {
          const { base64, bytes } = await toBase64(action.url)
          term.write(image(base64, bytes) + CRLF)
        } catch {
          term.write(`avatar: could not load image${CRLF}`)
        }
      }
    }

    function onData(data: string) {
      if (busy) return
      for (const key of data.match(/\x1b\[[A-Z~0-9;]*|[\s\S]/g) ?? []) handleKey(key)
    }

    async function submit() {
      term.write(CRLF)
      const input = buffer
      buffer = ''
      cursor = 0
      busy = true
      await execute(input)
      if (disposed) return
      term.write(prompt(cwd))
      busy = false
    }

    function handleKey(key: string) {
      switch (key) {
        case '\r':
          void submit()
          return
        case '\x7f':
          if (cursor > 0) {
            buffer = buffer.slice(0, cursor - 1) + buffer.slice(cursor)
            cursor--
            redraw()
          }
          return
        case '\t': {
          const options = complete(buffer, cwd)
          if (options.length === 1) {
            buffer = options[0] + (options[0].endsWith('/') ? '' : ' ')
            cursor = buffer.length
            redraw()
          } else if (options.length > 1) {
            term.write(CRLF + options.map((o) => o.trim().split(' ').pop()).join('  ') + CRLF)
            redraw()
          }
          return
        }
        case '\x03':
          term.write(`^C${CRLF}${prompt(cwd)}`)
          buffer = ''
          cursor = 0
          return
        case '\x0c':
          term.write(CLEAR)
          redraw()
          return
        case '\x15':
          buffer = buffer.slice(cursor)
          cursor = 0
          redraw()
          return
        case '\x1b[A':
          if (history.length) {
            historyIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
            buffer = history[historyIndex]
            cursor = buffer.length
            redraw()
          }
          return
        case '\x1b[B':
          if (historyIndex !== -1) {
            historyIndex = historyIndex + 1 >= history.length ? -1 : historyIndex + 1
            buffer = historyIndex === -1 ? '' : history[historyIndex]
            cursor = buffer.length
            redraw()
          }
          return
        case '\x1b[C':
          if (cursor < buffer.length) {
            cursor++
            term.write('\x1b[C')
          }
          return
        case '\x1b[D':
          if (cursor > 0) {
            cursor--
            term.write('\x1b[D')
          }
          return
        case '\x1b[H':
        case '\x01':
          cursor = 0
          redraw()
          return
        case '\x1b[F':
        case '\x05':
          cursor = buffer.length
          redraw()
          return
      }
      if (key.length === 1 && key >= ' ') {
        buffer = buffer.slice(0, cursor) + key + buffer.slice(cursor)
        cursor++
        redraw()
      }
    }

    async function boot() {
      await document.fonts.ready
      if (disposed) return
      term.open(host)
      resize()
      term.focus()
      host.addEventListener('pointerdown', warm, { once: true })

      if (!sessionStorage.getItem('booted')) {
        const change = progressAddon.onChange(({ state, value }) => {
          if (state === 1) term.write(`\r${bar(value)}`)
        })
        for (const [i, line] of bootLines.entries()) {
          await sleep(200)
          if (disposed) return
          term.write(`\r\x1b[K${line}${CRLF}`)
          term.write(progress(((i + 1) / bootLines.length) * 95))
        }
        await sleep(300)
        term.write(progress(100) + `\r${bar(100)}` + CRLF + CRLF)
        change.dispose()
        await sleep(300)
        sessionStorage.setItem('booted', '1')
      }
      if (disposed) return
      writeLines(loginLines())
      for (const command of ['whoami', 'cat about.txt', 'ls links/']) {
        term.write(prompt(cwd) + command + CRLF)
        await execute(command)
        await sleep(150)
        if (disposed) return
      }
      term.write(prompt(cwd))
      busy = false
    }

    term.attachCustomKeyEventHandler((event) => {
      if (sound && !event.metaKey && !event.ctrlKey && !event.repeat) {
        if (event.type === 'keydown') keyDown(event.key)
        else if (event.type === 'keyup') keyUp(event.key)
      }
      return true
    })
    const data = term.onData(onData)
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
      data.dispose()
      selection.dispose()
      observer.disconnect()
      unmap()
      term.dispose()
    }
  }, [])

  return (
    <Crt className="crt--monitor h-full select-none rounded-lg">
      <div ref={hostRef} className="term h-full w-full px-6 py-6 md:px-10 md:py-8" />
    </Crt>
  )
}
