const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const companies = (job: { companies: { name: string }[] }) => job.companies.map((c) => c.name).join(' & ')

// Resume dates are "YYYY-MM" or "now"
const month = (ym: string) => (ym === 'now' ? 'Present' : `${months[Number(ym.slice(5)) - 1]} ${ym.slice(0, 4)}`)
export const year = (ym: string) => (ym === 'now' ? 'now' : ym.slice(0, 4))
export const period = (from: string, to: string) => `${month(from)} – ${month(to)}`

export const clip = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function toBase64(url: string) {
  const buffer = await (await fetch(url)).arrayBuffer()
  let binary = ''
  for (const byte of new Uint8Array(buffer)) binary += String.fromCharCode(byte)
  return { base64: btoa(binary), bytes: buffer.byteLength }
}

// Breaks prose into lines of at most `width` columns for the prompt's text files; later lines get `indent`
export function wrap(text: string, width = 72, indent = '') {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/)) {
    if (line && line.length + word.length + 1 > width) {
      lines.push(line)
      line = indent + word
    } else line = line ? `${line} ${word}` : word
  }
  return [...lines, line]
}
