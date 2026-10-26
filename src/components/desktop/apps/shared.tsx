// Renders the **bold** and [text](url) markup used in resume content
export function Rich({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/).map((part, i) => {
    const md = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (md)
      return (
        <a
          key={i}
          href={md[2]}
          target="_blank"
          rel="noreferrer"
          className="text-[#0000ee] underline dark:text-[#8ab4ff]"
        >
          {md[1]}
        </a>
      )
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    return part
  })
}

const buttonClass =
  'focus-dotted inline-flex min-w-[75px] items-center justify-center gap-1.5 bg-face px-3 py-1 text-ink bevel active:bevel-in active:pt-[5px] active:pr-[11px] active:pb-[3px] active:pl-[13px] disabled:text-muted'

export function Button({
  children,
  href,
  download,
  onClick,
  primary,
}: React.PropsWithChildren<{ href?: string; download?: string; onClick?: () => void; primary?: boolean }>) {
  // The default button of a dialog carries an extra black ring
  const cls = `${buttonClass} ${primary ? 'outline outline-1 outline-ink' : ''}`
  if (href)
    return (
      <a href={href} download={download} target={download ? undefined : '_blank'} rel="noreferrer" className={cls}>
        {children}
      </a>
    )
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  )
}

// White well with an inset bevel, used for documents, lists and fields
export function Sunken({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`bg-window p-[2px] text-ink bevel-in ${className}`}>{children}</div>
}

export function Scroll({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`scroll-98 h-full overflow-auto select-text ${className}`}>{children}</div>
}

export function GroupBox({
  label,
  className = '',
  children,
}: React.PropsWithChildren<{ label: string; className?: string }>) {
  return (
    <fieldset className={`etched mt-2 px-3 pt-2 pb-3 ${className}`}>
      <legend className="px-1">{label}</legend>
      {children}
    </fieldset>
  )
}

export function StatusBar({ cells }: { cells: React.ReactNode[] }) {
  return (
    <div className="flex shrink-0 gap-[2px] pt-[2px]">
      {cells.map((cell, i) => (
        <p key={i} className={`truncate px-1.5 py-0.5 bevel-thin-in ${i === 0 ? 'flex-1' : ''}`}>
          {cell}
        </p>
      ))}
    </div>
  )
}

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
  children,
}: React.PropsWithChildren<{ tabs: { key: T; label: string }[]; active: T; onChange: (key: T) => void }>) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div role="tablist" className="relative z-10 flex pl-[2px]">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={t.key === active}
            onClick={() => onChange(t.key)}
            className={`focus-dotted relative bg-face px-3 ${
              t.key === active ? '-mx-[2px] -mb-[2px] pt-1.5 pb-1.5 tab-on' : 'mt-[2px] py-1 tab-off'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 bg-face p-3 bevel-window">{children}</div>
    </div>
  )
}

export const companies = (job: { companies: { name: string }[] }) => job.companies.map((c) => c.name).join(' & ')

export function period(from: string, to: string) {
  const fmt = (d: string) =>
    d === 'now' ? 'Present' : new Date(`${d}-02`).toLocaleDateString('en', { month: 'short', year: 'numeric' })
  return `${fmt(from)} – ${fmt(to)}`
}
