export const RESET = '\x1b[0m'
export const BOLD = '\x1b[1m\x1b[38;2;216;255;217m'
export const DIM = '\x1b[38;2;79;154;87m'
export const UNDERLINE = '\x1b[4m'
export const CLEAR = '\x1b[2J\x1b[H'
export const CRLF = '\r\n'

export const bold = (s: string) => `${BOLD}${s}${RESET}`
export const dim = (s: string) => `${DIM}${s}${RESET}`
export const underline = (s: string) => `${UNDERLINE}${s}${RESET}`
export const progress = (value: number) => `\x1b]9;4;${value >= 100 ? 0 : 1};${Math.round(value)}\x07`
export const copy = (text: string) => `\x1b]52;c;${btoa(text)}\x07`
export const image = (base64: string, bytes: number, width = 24) =>
  `\x1b]1337;File=inline=1;size=${bytes};width=${width};preserveAspectRatio=1:${base64}\x07`
export const link = (href: string, text = href) => `\x1b]8;;${href}\x07${underline(text)}\x1b]8;;\x07`
