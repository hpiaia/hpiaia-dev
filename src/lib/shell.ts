import { site } from '@/content/site'
import { bold, dim, link } from '@/lib/ansi'
import { completions, links, resolve } from '@/lib/fs'
import { fonts } from '@/lib/fonts'

export type Action =
  | { type: 'clear' }
  | { type: 'open'; href: string }
  | { type: 'font'; key: string }
  | { type: 'image'; url: string }
  | { type: 'copy'; text: string }
  | { type: 'sound'; on: boolean }
export type Result = { out: string[]; action?: Action }
export type Context = { origin: string }

type Command = { usage: string; run: (args: string[], ctx: Context) => Result }

const absolute = (href: string, ctx: Context) => (href.startsWith('/') ? `${ctx.origin}${href}` : href)

const commands: Record<string, Command> = {
  help: {
    usage: 'list commands',
    run: () => ({
      out: [
        dim('available commands:'),
        ...Object.entries(commands).map(([name, c]) => `  ${bold(name.padEnd(10))}${dim(c.usage)}`),
        '',
        dim('tab completes, arrows browse history. try: cat about.txt'),
      ],
    }),
  },
  whoami: { usage: 'who am i', run: () => ({ out: [bold(site.name.toLowerCase())] }) },
  ls: {
    usage: 'list files',
    run: ([path = ''], ctx) => {
      const target = resolve(path)
      if (!target) return { out: [`ls: ${path}: no such file or directory`] }
      const files = Array.isArray(target) ? target : [target]
      const names = files.map((f) => {
        if (!('href' in f)) return f.name
        return f.href ? link(absolute(f.href, ctx), f.name) : bold(`${f.name}/`)
      })
      return { out: [names.join('  ')] }
    },
  },
  cat: {
    usage: 'print a file',
    run: ([path], ctx) => {
      if (!path) return { out: ['cat: missing file'] }
      const target = resolve(path)
      if (!target || Array.isArray(target))
        return { out: [`cat: ${path}: ${target ? 'is a directory' : 'no such file'}`] }
      if ('lines' in target) return { out: target.lines }
      return { out: [link(absolute(target.href, ctx))] }
    },
  },
  open: {
    usage: 'open a link',
    run: ([name = ''], ctx) => {
      const link = links.find((l) => l.name === name.replace(/^links\//, ''))
      if (!link || !('href' in link)) return { out: [`open: ${name}: unknown link. try: ls links/`] }
      const href = absolute(link.href, ctx)
      return { out: [dim(`opening ${href}`)], action: { type: 'open', href } }
    },
  },
  links: {
    usage: 'show all links',
    run: (_, ctx) => ({
      out: links.map((l) => `${bold(l.name.padEnd(14))}${'href' in l ? link(absolute(l.href, ctx)) : ''}`),
    }),
  },
  resume: { usage: 'open resume', run: (_, ctx) => commands.open.run(['resume'], ctx) },
  copy: {
    usage: 'copy a link',
    run: ([name = ''], ctx) => {
      const target = links.find((l) => l.name === name.replace(/^links\//, ''))
      if (!target || !('href' in target)) return { out: [`copy: ${name}: unknown link. try: ls links/`] }
      const text = absolute(target.href, ctx).replace(/^mailto:/, '')
      return { out: [dim(`copied ${text}`)], action: { type: 'copy', text } }
    },
  },
  avatar: { usage: 'show my avatar', run: () => ({ out: [], action: { type: 'image', url: site.avatar } }) },
  uptime: {
    usage: 'years on the job',
    run: () => ({ out: [`up ${new Date().getFullYear() - site.since} years, shipping since ${site.since}`] }),
  },
  date: { usage: 'current date', run: () => ({ out: [new Date().toString().toLowerCase()] }) },
  fetch: {
    usage: 'system info',
    run: () => {
      const row = (k: string, v: string) => `${dim(k.padEnd(10))}${v}`
      return {
        out: [
          bold(`${site.user}@${site.host}`),
          dim('----------'),
          row('os', 'hpiaia.dev 3.0'),
          row('kernel', 'next 16 · react 19'),
          row('shell', 'hsh 1.0 on xterm.js'),
          row('display', 'crt monitor, 3d'),
          row('uptime', `${new Date().getFullYear() - site.since} years`),
          row('lang', 'typescript, go, rust'),
          row('location', 'brazil'),
        ],
      }
    },
  },
  font: {
    usage: 'font [name]',
    run: ([key]) => {
      if (!key) return { out: [dim('fonts:'), ...fonts.map((f) => `  ${f.key}`)] }
      const font = fonts.find((f) => f.key === key)
      if (!font) return { out: [`font: ${key}: not found. run font to list`] }
      return { out: [dim(`font set to ${font.label}`)], action: { type: 'font', key } }
    },
  },
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
  exit: { usage: 'logout', run: () => ({ out: [dim('logout'), '', dim('there is no escape. type help.')] }) },
}

const eggs: Record<string, string[]> = {
  sudo: ['hpiaia is not in the sudoers file. this incident will be reported.'],
  rm: ["rm: refusing to remove: it's my website"],
  vim: ['vim: use :q! to exit. just kidding, this is a browser'],
  nano: ['nano: no.'],
  music: [`${dim('sprnv4 on soundcloud → ')}${link('https://soundcloud.com/sprnv4')}`],
  hello: ['hi.'],
  pwd: ['/home/hpiaia'],
  cd: [dim('there is only home')],
}

export function run(input: string, ctx: Context): Result {
  const [name, ...args] = input.trim().split(/\s+/)
  if (!name) return { out: [] }
  const command = commands[name]
  if (command) return command.run(args, ctx)
  if (eggs[name]) return { out: eggs[name] }
  return { out: [`hsh: ${name}: command not found. type help`] }
}

export function complete(input: string): string[] {
  const parts = input.split(/\s+/)
  if (parts.length <= 1) return [...Object.keys(commands), ...Object.keys(eggs)].filter((n) => n.startsWith(parts[0]))
  const last = parts[parts.length - 1]
  const head = parts.slice(0, -1).join(' ')
  const candidates =
    parts[0] === 'font'
      ? fonts.map((f) => f.key).filter((k) => k.startsWith(last))
      : parts[0] === 'sound'
        ? ['on', 'off'].filter((k) => k.startsWith(last))
        : parts[0] === 'open' || parts[0] === 'copy'
          ? links.map((l) => l.name).filter((n) => n.startsWith(last))
          : completions(last)
  return candidates.map((c) => `${head} ${c}`)
}

export const prompt = `${dim(`${site.user}@${site.host}`)}:${dim('~')}$ `

export const bootLines = [
  dim('hpiaia bios · phosphor edition'),
  dim('loading kernel... ok'),
  dim('mounting /home/hpiaia... ok'),
]

export function loginLines() {
  return [
    dim(`last login: ${new Date().toString().slice(0, 24).toLowerCase()} on tty1`),
    `type ${bold('help')} for commands.`,
    '',
  ]
}
