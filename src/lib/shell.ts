import { site } from '@/content/site'
import { type AppKey, apps } from '@/lib/apps'
import { bold, dim, link } from '@/lib/ansi'
import { completions, contents, display, home, isDir, links, list, normalize, resolve, size } from '@/lib/fs'
import { fonts } from '@/lib/fonts'
import { themes } from '@/lib/theme'

export type Action =
  | { type: 'clear' }
  | { type: 'open'; href: string }
  | { type: 'font'; key: string }
  | { type: 'image'; url: string }
  | { type: 'copy'; text: string }
  | { type: 'sound'; on: boolean }
  | { type: 'cd'; path: string }
  | { type: 'theme'; key: string }
  | { type: 'app'; key: AppKey }
  | { type: 'exit' }
export type Result = { out: string[]; action?: Action }
export type Context = { origin: string; cwd: string }

type Command = { usage: string; dos?: boolean; run: (args: string[], ctx: Context) => Result }

const absolute = (href: string, ctx: Context) => (href.startsWith('/') ? `${ctx.origin}${href}` : href)
const years = () => new Date().getFullYear() - site.born
const unixPath = (path: string) => `/c/${path.replace(/\\/g, '/').toLowerCase()}`.replace(/\/$/, '')

function stamp() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const hour = d.getHours() % 12 || 12
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${String(d.getFullYear()).slice(2)}  ${String(hour).padStart(2)}:${pad(d.getMinutes())}${d.getHours() < 12 ? 'a' : 'p'}`
}

function start(name: string, ctx: Context, verb: string): Result {
  const key = name.toLowerCase()
  const target = apps.find((a) => a.key === key || a.label.toLowerCase() === key)
  if (target) return { out: [dim(`opening ${target.title}`)], action: { type: 'app', key: target.key } }
  const found = resolve(name.replace(/^links[\\/]/i, `~\\LINKS\\`), ctx.cwd) ?? resolve(`~\\LINKS\\${name}`, ctx.cwd)
  if (found?.entry?.kind !== 'link') return { out: [`${verb}: ${name}: unknown link or app. try: dir links, apps`] }
  const href = absolute(found.entry.href, ctx)
  return { out: [dim(`opening ${href}`)], action: { type: 'open', href } }
}

function changeDir(path: string, ctx: Context, dos: boolean): Result {
  const target = normalize(path, ctx.cwd)
  if (!isDir(target)) return { out: [dos ? 'Invalid directory' : `cd: ${path}: no such directory`] }
  return { out: [], action: { type: 'cd', path: target } }
}

function setColor(key = ''): Result {
  const found = themes.find((t) => t.key === key.toLowerCase() || t.code === key.toUpperCase())
  if (!found)
    return { out: [dim('color schemes:'), ...themes.map((t) => `  ${t.code}  ${t.key}`), dim('usage: color 0A')] }
  return { out: [], action: { type: 'theme', key: found.key } }
}

function systemInfo(): Result {
  const row = (k: string, v: string) => `${dim(k.padEnd(10))}${v}`
  return {
    out: [
      bold(`${site.user}@${site.host}`),
      dim('----------'),
      row('os', 'hpiaia97'),
      row('kernel', 'next 16 · react 19'),
      row('shell', 'command prompt on xterm.js'),
      row('display', 'hdb rg, crt display'),
      row('uptime', `${years()} years`),
    ],
  }
}

// DOS commands on top, the unix set kept as it was. Both work on the same drive
const commands: Record<string, Command> = {
  help: {
    usage: 'list commands',
    run: () => {
      const rows = (dos: boolean) =>
        Object.entries(commands)
          .filter(([, c]) => !!c.dos === dos)
          .map(([name, c]) => `  ${bold(name.padEnd(11))}${dim(c.usage)}`)
      return {
        out: [
          dim('dos commands:'),
          ...rows(true),
          '',
          dim('unix commands:'),
          ...rows(false),
          '',
          dim('tab completes, arrows browse history. try: type about.txt or cat about.txt'),
        ],
      }
    },
  },

  dir: {
    usage: 'list a directory',
    dos: true,
    run: ([path = '.'], ctx) => {
      const target = normalize(path, ctx.cwd)
      if (!isDir(target)) return { out: ['File Not Found'] }
      const entries = list(target)
      const files = entries.filter((e) => e.kind !== 'dir')
      const bytes = files.reduce((sum, e) => sum + size(e), 0)
      return {
        out: [
          ' Volume in drive C is HPIAIA97',
          ` Directory of ${display(target)}`,
          '',
          ...entries.map((e) => {
            const [name, ext = ''] = e.name.split('.')
            const column = e.kind === 'dir' ? '<DIR>'.padEnd(14) : size(e).toLocaleString('en').padStart(14)
            const label = `${name.padEnd(8)} ${ext.padEnd(3)}`
            const shown =
              e.kind === 'link' ? link(absolute(e.href, ctx), label) : e.kind === 'dir' ? bold(label) : label
            return `${shown}  ${column}  ${dim(stamp())}`
          }),
          `${String(files.length).padStart(8)} file(s) ${bytes.toLocaleString('en').padStart(14)} bytes`,
          `${String(entries.length - files.length).padStart(8)} dir(s)  ${'640,000'.padStart(14)} bytes free`,
        ],
      }
    },
  },
  type: {
    usage: 'print a file',
    dos: true,
    run: ([path], ctx) => {
      if (!path) return { out: ['Required parameter missing'] }
      const found = resolve(path, ctx.cwd)
      if (!found?.entry || found.entry.kind === 'dir') return { out: ['File not found'] }
      const entry = found.entry
      if (entry.kind === 'link') return { out: ['[InternetShortcut]', `URL=${link(absolute(entry.href, ctx))}`] }
      return { out: contents(entry) }
    },
  },
  chdir: {
    usage: 'show or change directory',
    dos: true,
    run: ([path], ctx) => (path ? changeDir(path, ctx, true) : { out: [display(ctx.cwd)] }),
  },
  tree: {
    usage: 'show the folder tree',
    dos: true,
    run: (_, ctx) => {
      const out = [`Folder PATH listing for volume HPIAIA97`, display(ctx.cwd)]
      const walk = (path: string, indent: string) => {
        const entries = list(path)
        entries.forEach((e, i) => {
          const last = i === entries.length - 1
          out.push(`${indent}${last ? '└───' : '├───'}${e.kind === 'dir' ? bold(e.name) : e.name}`)
          if (e.kind === 'dir') walk(path ? `${path}\\${e.name}` : e.name, `${indent}${last ? '    ' : '│   '}`)
        })
      }
      walk(ctx.cwd, '')
      return { out }
    },
  },
  start: { usage: 'open an app or link', dos: true, run: ([name = ''], ctx) => start(name, ctx, 'start') },
  cls: { usage: 'clear screen', dos: true, run: () => ({ out: [], action: { type: 'clear' } }) },
  color: { usage: 'color [scheme|code]', dos: true, run: ([key]) => setColor(key) },
  ver: { usage: 'show version', dos: true, run: () => ({ out: ['', `hpiaia97 [Version 4.10]`, ''] }) },
  time: {
    usage: 'current time',
    dos: true,
    run: () => ({ out: [`Current time is ${new Date().toLocaleTimeString('en')}`] }),
  },
  systeminfo: { usage: 'system info', dos: true, run: systemInfo },

  whoami: { usage: 'who am i', run: () => ({ out: [bold(site.name.toLowerCase())] }) },
  ls: {
    usage: 'list files',
    run: ([path = '.'], ctx) => {
      const found = resolve(path, ctx.cwd)
      if (!found) return { out: [`ls: ${path}: no such file or directory`] }
      const entries = found.entry ? [found.entry] : list(found.path)
      const names = entries.map((e) => {
        const name = e.name.toLowerCase()
        if (e.kind === 'dir') return bold(`${name}/`)
        return e.kind === 'link' ? link(absolute(e.href, ctx), name) : name
      })
      return { out: [names.join('  ')] }
    },
  },
  cat: {
    usage: 'print a file',
    run: ([path], ctx) => {
      if (!path) return { out: ['cat: missing file'] }
      const found = resolve(path, ctx.cwd)
      if (!found?.entry) return { out: [`cat: ${path}: ${found ? 'is a directory' : 'no such file'}`] }
      const entry = found.entry
      return { out: entry.kind === 'link' ? [link(absolute(entry.href, ctx))] : contents(entry) }
    },
  },
  cd: { usage: 'change directory', run: ([path = '~'], ctx) => changeDir(path, ctx, false) },
  pwd: { usage: 'print directory', run: (_, ctx) => ({ out: [unixPath(ctx.cwd)] }) },
  open: { usage: 'open an app or link', run: ([name = ''], ctx) => start(name, ctx, 'open') },
  links: {
    usage: 'show all links',
    run: (_, ctx) => ({ out: links.map((l) => `${bold(l.alias.padEnd(14))}${link(absolute(l.href, ctx))}`) }),
  },
  apps: {
    usage: 'list desktop apps',
    run: () => ({
      out: [...apps.map((a) => `  ${bold(a.key.padEnd(10))}${dim(a.title)}`), '', dim('open one with: start <app>')],
    }),
  },
  resume: { usage: 'open resume', run: (_, ctx) => start('resume', ctx, 'open') },
  copy: {
    usage: 'copy a link',
    run: ([name = ''], ctx) => {
      const target = links.find((l) => l.alias === name.toLowerCase() || l.name === name.toUpperCase())
      if (!target) return { out: [`copy: ${name}: unknown link. try: links`] }
      const text = absolute(target.href, ctx).replace(/^mailto:/, '')
      return { out: [dim(`copied ${text}`)], action: { type: 'copy', text } }
    },
  },
  avatar: { usage: 'show my avatar', run: () => ({ out: [], action: { type: 'image', url: site.avatar } }) },
  uptime: {
    usage: 'how long this has been running',
    run: () => ({ out: [`up ${years()} years, running since ${site.born}`] }),
  },
  date: { usage: 'current date', run: () => ({ out: [new Date().toString().toLowerCase()] }) },
  fetch: { usage: 'system info', run: systemInfo },
  font: {
    usage: 'font [name]',
    run: ([key]) => {
      if (!key) return { out: [dim('fonts:'), ...fonts.map((f) => `  ${f.key}`)] }
      const font = fonts.find((f) => f.key === key)
      if (!font) return { out: [`font: ${key}: not found. run font to list`] }
      return { out: [dim(`font set to ${font.label}`)], action: { type: 'font', key } }
    },
  },
  theme: { usage: 'theme [name]', run: ([key]) => setColor(key) },
  credits: {
    usage: 'who made what',
    run: () => {
      const col = (label: string) => dim(label.padEnd(12))
      return {
        out: [
          ...site.credits.map(
            (c) =>
              `${col(c.what)}${link(c.url, c.title)}${dim(' by ')}${link(c.byUrl, c.by)}${dim(' · ')}${link(c.licenseUrl, c.license)}`,
          ),
          `${col('posters')}${dim(site.posters)}`,
          `${col('built with')}${site.stack.join(' · ')}`,
          `${col('made by')}${site.name.toLowerCase()}${dim(' · ')}${link('https://github.com/hpiaia/hpiaia-dev', 'source')}`,
        ],
      }
    },
  },
  sound: {
    usage: 'sound on|off',
    run: ([state]) => {
      if (state !== 'on' && state !== 'off') return { out: [dim('usage: sound on|off')] }
      return { out: [dim(`keyboard sound ${state}`)], action: { type: 'sound', on: state === 'on' } }
    },
  },
  clear: { usage: 'clear screen', run: () => ({ out: [], action: { type: 'clear' } }) },
  echo: { usage: 'echo text', run: (args) => ({ out: [args.join(' ')] }) },
  exit: { usage: 'close the terminal', run: () => ({ out: [], action: { type: 'exit' } }) },
}

const eggs: Record<string, string[]> = {
  sudo: ['hpiaia is not in the sudoers file. this incident will be reported.'],
  rm: ["rm: refusing to remove: it's my website"],
  del: ['Access denied: it is my website'],
  deltree: ['Delete directory "C:\\HPIAIA" and all its subdirectories? [yn] n'],
  format: ['WARNING: ALL DATA ON NON-REMOVABLE DISK DRIVE C: WILL BE LOST!', 'Proceed with Format (Y/N)? n'],
  win: ['You are already running hpiaia97.'],
  edit: ['edit: try the WordPad window instead'],
  vim: ['vim: use :q! to exit. just kidding, this is a browser'],
  nano: ['nano: no.'],
  music: [`${dim('sprnv4 on soundcloud → ')}${link('https://soundcloud.com/sprnv4')}`],
  hello: ['hi.'],
}

export function run(input: string, ctx: Context): Result {
  const trimmed = input.trim()
  // `cd..` and `cd\` work without a space, as they did in DOS
  const [raw, ...args] = trimmed.replace(/^(cd|chdir)(?=[.\\])/i, '$1 ').split(/\s+/)
  if (!raw) return { out: [] }
  const name = raw.toLowerCase()
  if (/^[a-z]:$/.test(name)) return { out: [name === 'c:' ? '' : 'Invalid drive specification'] }
  const command = commands[name]
  if (command) return command.run(args, ctx)
  if (eggs[name]) return { out: eggs[name] }
  return { out: ['Bad command or file name'] }
}

const dosCommand = (name: string) => !!commands[name.toLowerCase()]?.dos

export function complete(input: string, cwd = home): string[] {
  const parts = input.split(/\s+/)
  const first = parts[0].toLowerCase()
  if (parts.length <= 1) return [...Object.keys(commands), ...Object.keys(eggs)].filter((n) => n.startsWith(first))
  const last = parts[parts.length - 1]
  const head = parts.slice(0, -1).join(' ')
  const match = (options: string[]) => options.filter((o) => o.startsWith(last.toLowerCase()))
  const candidates =
    first === 'font'
      ? match(fonts.map((f) => f.key))
      : first === 'color' || first === 'theme'
        ? match(themes.map((t) => t.key))
        : first === 'sound'
          ? match(['on', 'off'])
          : first === 'open' || first === 'start' || first === 'copy'
            ? match([...(first === 'copy' ? [] : apps.map((a) => a.key)), ...links.map((l) => l.alias)])
            : // Unix commands complete in lowercase, DOS ones keep the drive's uppercase
              completions(last, cwd).map((c) => (dosCommand(first) ? c : c.toLowerCase()))
  return candidates.map((c) => `${head} ${c}`)
}

export const prompt = (cwd = home) => `${display(cwd)}>`

export function bootLines() {
  return [
    '',
    `hpiaia97 [Version 4.10]`,
    `(C) Copyright ${site.born}-${new Date().getFullYear()} ${site.name}.`,
    '',
    dim(`Type ${bold('HELP')}${dim(' for commands, DIR to look around. Unix commands work too.')}`),
    '',
  ]
}

export const startup = ['type about.txt']
