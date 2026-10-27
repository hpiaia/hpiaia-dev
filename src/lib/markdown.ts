// The resume content uses two bits of inline markdown: **bold** and [text](url)
export type Span = { text: string; bold?: boolean; href?: string }

export function spans(text: string): Span[] {
  return text
    .split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/)
    .filter(Boolean)
    .map((part) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (link) return { text: link[1], href: link[2] }
      if (part.startsWith('**') && part.endsWith('**')) return { text: part.slice(2, -2), bold: true }
      return { text: part }
    })
}

export const plain = (text: string) =>
  spans(text)
    .map((s) => s.text)
    .join('')
