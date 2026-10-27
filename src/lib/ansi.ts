const RESET = '\x1b[0m'
const BOLD = '\x1b[1m\x1b[97m'
const DIM = '\x1b[90m'
const UNDERLINE = '\x1b[4m'
export const CLEAR = '\x1b[2J\x1b[H'
export const CRLF = '\r\n'

export const bold = (s: string) => `${BOLD}${s}${RESET}`
export const dim = (s: string) => `${DIM}${s}${RESET}`
const underline = (s: string) => `${UNDERLINE}${s}${RESET}`
export const image = (base64: string, bytes: number, width = 24) =>
  `\x1b]1337;File=inline=1;size=${bytes};width=${width};preserveAspectRatio=1:${base64}\x07`
export const link = (href: string, text = href) => `\x1b]8;;${href}\x07${underline(text)}\x1b]8;;\x07`
