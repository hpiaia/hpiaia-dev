import * as RadixTabs from '@radix-ui/react-tabs'

import { spans } from '@/lib/markdown'

export function Rich({ text }: { text: string }) {
  return spans(text).map((span, i) => {
    if (span.href)
      return (
        <a
          key={i}
          href={span.href}
          target="_blank"
          rel="noreferrer"
          className="text-[#0000ee] underline dark:text-[#8ab4ff]"
        >
          {span.text}
        </a>
      )
    if (span.bold) return <strong key={i}>{span.text}</strong>
    return span.text
  })
}

const buttonClass =
  'group focus-dotted inline-flex min-w-[75px] items-center justify-center bg-face px-3 py-1 text-ink bevel active:bevel-in disabled:text-muted'

export function Button({
  children,
  href,
  download,
  onClick,
  primary,
  autoFocus,
}: React.PropsWithChildren<{
  href?: string
  download?: string
  onClick?: () => void
  primary?: boolean
  autoFocus?: boolean
}>) {
  const cls = `${buttonClass} ${primary ? 'outline outline-1 outline-ink' : ''}`
  const label = (
    <span className="flex items-center gap-1.5 group-active:translate-x-px group-active:translate-y-px">
      {children}
    </span>
  )
  if (href)
    return (
      <a href={href} download={download} target={download ? undefined : '_blank'} rel="noreferrer" className={cls}>
        {label}
      </a>
    )
  return (
    <button type="button" onClick={onClick} autoFocus={autoFocus} className={cls}>
      {label}
    </button>
  )
}

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
      {/* The face color masks the etched line behind the label, like a real group box */}
      <legend className="relative bg-face px-1">{label}</legend>
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
}: {
  tabs: { key: T; label: string; content: React.ReactNode }[]
  active: T
  onChange: (key: T) => void
}) {
  return (
    <RadixTabs.Root value={active} onValueChange={(v) => onChange(v as T)} className="flex min-h-0 flex-1 flex-col">
      <RadixTabs.List className="relative z-10 flex items-end pl-[2px]">
        {tabs.map((t) => (
          <RadixTabs.Trigger
            key={t.key}
            value={t.key}
            className="group relative h-[23px] bg-face px-[9px] text-ink/85 outline-none tab hover:text-ink data-[state=active]:z-10 data-[state=active]:-mx-[2px] data-[state=active]:-mb-[2px] data-[state=active]:h-[27px] data-[state=active]:px-[11px] data-[state=active]:pt-px data-[state=active]:text-ink"
          >
            <span className="px-0.5 group-focus-visible:outline-1 group-focus-visible:outline-ink group-focus-visible:outline-dotted">
              {t.label}
            </span>
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
      {tabs.map((t) => (
        <RadixTabs.Content
          key={t.key}
          value={t.key}
          className="scroll-98 min-h-0 flex-1 overflow-auto bg-face p-3 outline-none bevel-window"
        >
          {t.content}
        </RadixTabs.Content>
      ))}
    </RadixTabs.Root>
  )
}
