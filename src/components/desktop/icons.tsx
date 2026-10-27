import type { AppKey } from '@/lib/apps'

type Props = { className?: string }

// 32px pixel-art icons in the 16-color palette, drawn on half-pixel lines so strokes stay crisp
function Icon({ className, children }: React.PropsWithChildren<Props>) {
  return (
    <svg viewBox="0 0 32 32" className={className} shapeRendering="crispEdges" aria-hidden>
      {children}
    </svg>
  )
}

const page = 'M6.5 2.5h13l6 6v21h-19z'
const fold = 'M19.5 2.5v6h6'

function Doc({ className }: Props) {
  return (
    <Icon className={className}>
      <path d={page} fill="#fff" stroke="#000" />
      <path d={fold} fill="#c0c0c0" stroke="#000" />
      {[12, 15, 18, 21, 24].map((y, i) => (
        <rect key={y} x="9" y={y} width={i === 4 ? 8 : 13} height="1" fill="#000080" />
      ))}
      <rect x="9" y="5" width="7" height="4" fill="#008080" />
    </Icon>
  )
}

function Briefcase({ className }: Props) {
  return (
    <Icon className={className}>
      <path d="M11.5 9.5v-4h9v4" fill="none" stroke="#000" />
      <rect x="12" y="6" width="8" height="1" fill="#808080" />
      <rect x="3.5" y="9.5" width="25" height="18" fill="#c68c3b" stroke="#000" />
      <rect x="4" y="10" width="24" height="2" fill="#e8b46a" />
      <rect x="4" y="17" width="24" height="1" fill="#7a4f1d" />
      <rect x="14.5" y="15.5" width="3" height="4" fill="#ffff00" stroke="#000" />
    </Icon>
  )
}

function Pdf({ className }: Props) {
  return (
    <Icon className={className}>
      <path d={page} fill="#fff" stroke="#000" />
      <path d={fold} fill="#c0c0c0" stroke="#000" />
      <rect x="9" y="6" width="8" height="1" fill="#808080" />
      <rect x="9" y="9" width="12" height="1" fill="#808080" />
      <rect x="2.5" y="15.5" width="19" height="9" fill="#c00000" stroke="#000" />
      <text
        x="12"
        y="22.5"
        textAnchor="middle"
        fontSize="7"
        fontWeight="700"
        fill="#fff"
        fontFamily="Tahoma, sans-serif"
      >
        PDF
      </text>
    </Icon>
  )
}

function Prompt({ className }: Props) {
  return (
    <Icon className={className}>
      <rect x="2.5" y="4.5" width="27" height="22" fill="#c0c0c0" stroke="#000" />
      <rect x="4" y="6" width="24" height="3" fill="#000080" />
      <rect x="4" y="10" width="24" height="15" fill="#000" />
      <text x="6" y="19" fontSize="6.5" fill="#c0c0c0" fontFamily="monospace" fontWeight="700">
        C:\&gt;
      </text>
      <rect x="20" y="18" width="4" height="1" fill="#c0c0c0" />
    </Icon>
  )
}

function Chart({ className }: Props) {
  return (
    <Icon className={className}>
      <rect x="3.5" y="4.5" width="25" height="23" fill="#fff" stroke="#000" />
      <rect x="4" y="5" width="24" height="3" fill="#000080" />
      <rect x="7" y="11" width="16" height="3" fill="#ff0000" />
      <rect x="7" y="15" width="12" height="3" fill="#008000" />
      <rect x="7" y="19" width="18" height="3" fill="#0000ff" />
      <rect x="7" y="23" width="9" height="2" fill="#808000" />
    </Icon>
  )
}

function Mail({ className }: Props) {
  return (
    <Icon className={className}>
      <rect x="3.5" y="8.5" width="25" height="16" fill="#fff" stroke="#000" />
      <path d="M3.5 8.5 16 18l12.5-9.5" fill="none" stroke="#000" shapeRendering="auto" />
      <path d="M3.5 24.5 13 16.5M28.5 24.5 19 16.5" fill="none" stroke="#808080" shapeRendering="auto" />
      <rect x="22.5" y="10.5" width="4" height="5" fill="#ff0000" stroke="#000" />
    </Icon>
  )
}

function Disc({ className }: Props) {
  return (
    <Icon className={className}>
      <g shapeRendering="auto">
        <circle cx="16" cy="16" r="13" fill="#d8d8d8" stroke="#000" />
        <path d="M16 3a13 13 0 0 1 13 13h-6a7 7 0 0 0-7-7Z" fill="#a0e0ff" />
        <path d="M16 29A13 13 0 0 1 3 16h6a7 7 0 0 0 7 7Z" fill="#ffc0f0" />
        <circle cx="16" cy="16" r="4" fill="#fff" stroke="#000" />
        <circle cx="16" cy="16" r="1.5" fill="#808080" />
      </g>
    </Icon>
  )
}

function Amp({ className }: Props) {
  return (
    <Icon className={className}>
      <rect x="2.5" y="5.5" width="27" height="21" fill="#2b2b3a" stroke="#000" />
      <rect x="4" y="7" width="24" height="3" fill="#4a4a6a" />
      <path d="M17 11 10 19h5l-3 7 9-10h-5l3-5z" fill="#ff9c00" stroke="#000" strokeLinejoin="round" />
      {[
        [22, 20, 4],
        [24, 17, 7],
        [26, 19, 5],
      ].map(([x, y, h]) => (
        <rect key={x} x={x} y={y} width="1" height={h} fill="#00e000" />
      ))}
      <rect x="5" y="23" width="9" height="1" fill="#00e000" />
    </Icon>
  )
}

function HelpBook({ className }: Props) {
  return (
    <Icon className={className}>
      <rect x="6.5" y="3.5" width="19" height="25" fill="#800080" stroke="#000" />
      <rect x="22" y="5" width="3" height="22" fill="#fff" />
      <rect x="7" y="4" width="2" height="24" fill="#a040a0" />
      <text
        x="15.5"
        y="22"
        textAnchor="middle"
        fontSize="15"
        fontWeight="700"
        fill="#ffff00"
        fontFamily="Tahoma, sans-serif"
      >
        ?
      </text>
    </Icon>
  )
}

function Monitor({ className }: Props) {
  return (
    <Icon className={className}>
      <rect x="3.5" y="3.5" width="25" height="19" fill="#c0c0c0" stroke="#000" />
      <rect x="6" y="6" width="20" height="14" fill="#008080" />
      <rect x="6" y="6" width="20" height="1" fill="#404040" />
      <rect x="8" y="14" width="6" height="4" fill="#ffffff" />
      <rect x="9" y="15" width="4" height="1" fill="#000080" />
      <rect x="12.5" y="22.5" width="7" height="3" fill="#808080" stroke="#000" />
      <rect x="7.5" y="25.5" width="17" height="3" fill="#c0c0c0" stroke="#000" />
      <rect x="24" y="20" width="2" height="1" fill="#00ff00" />
    </Icon>
  )
}

function Bin({ className }: Props) {
  return (
    <Icon className={className}>
      <path d="M7.5 9.5h17l-2 19h-13z" fill="#c0c0c0" stroke="#000" />
      {[11, 14, 17, 20].map((x) => (
        <rect key={x} x={x} y="11" width="1" height="16" fill="#808080" />
      ))}
      <rect x="5.5" y="6.5" width="21" height="3" fill="#dfdfdf" stroke="#000" />
      <rect x="13.5" y="4.5" width="5" height="2" fill="#808080" stroke="#000" />
      <path d="M14 18l2-3 2 3h-1.5v2h-1v-2z" fill="#008000" />
    </Icon>
  )
}

export function FolderIcon({ className }: Props) {
  return (
    <Icon className={className}>
      <path d="M2.5 7.5h10l2 2h14v18h-26z" fill="#f5d76e" stroke="#000" />
      <path d="M3 12h25" stroke="#c9a63a" />
      <rect x="3" y="8" width="9" height="1" fill="#fff6c0" />
    </Icon>
  )
}

export function FileIcon({ className }: Props) {
  return (
    <Icon className={className}>
      <path d={page} fill="#fff" stroke="#000" />
      <path d={fold} fill="#c0c0c0" stroke="#000" />
      <rect x="9" y="14" width="12" height="1" fill="#808080" />
      <rect x="9" y="17" width="9" height="1" fill="#808080" />
    </Icon>
  )
}

export const appIcons: Record<AppKey, (props: Props) => React.JSX.Element> = {
  about: Doc,
  work: Briefcase,
  cv: Pdf,
  terminal: Prompt,
  skills: Chart,
  contact: Mail,
  music: Disc,
  winamp: Amp,
  credits: HelpBook,
  display: Monitor,
  trash: Bin,
}

function Glyph({ className, children, box = '0 0 16 14' }: React.PropsWithChildren<Props & { box?: string }>) {
  return (
    <svg viewBox={box} className={className} shapeRendering="crispEdges" aria-hidden fill="currentColor">
      {children}
    </svg>
  )
}

function Caption({ children }: React.PropsWithChildren) {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" shapeRendering="crispEdges" aria-hidden fill="currentColor">
      {children}
    </svg>
  )
}

export const ui = {
  minimize: () => (
    <Caption>
      <path d="M4 9h6v2H4z" />
    </Caption>
  ),
  maximize: () => (
    <Caption>
      <path fillRule="evenodd" d="M3 2h9v9H3zM4 4h7v6H4z" />
    </Caption>
  ),
  restore: () => (
    <Caption>
      <path d="M6 2h6v2H6zM11 4h1v4h-1zM6 4h1v1H6zM10 7h1v1h-1zM4 5h6v2H4zM9 7h1v4H9zM4 7h1v4H4zM5 10h4v1H5z" />
    </Caption>
  ),
  close: () => (
    <Caption>
      <path d="M4 3h2v1h1v1h2V4h1V3h2v1h-1v1h-1v1H9v1h1v1h1v1h1v1h-2V9H9V8H7v1H6v1H4V9h1V8h1V7h1V6H6V5H5V4H4z" />
    </Caption>
  ),
  arrow: (p: Props) => (
    <Glyph className={p.className} box="0 0 8 8">
      <path d="M2 0h1v1h1v1h1v1h1v1H5v1H4v1H3v1H2z" />
    </Glyph>
  ),
  search: (p: Props) => (
    <svg viewBox="0 0 16 16" className={p.className} aria-hidden>
      <circle cx="6.5" cy="6.5" r="4.5" fill="#c0e8ff" stroke="#000" />
      <path d="m10 10 4.5 4.5" stroke="#000" strokeWidth="2" />
    </svg>
  ),
  cube: (p: Props) => (
    <svg viewBox="0 0 16 16" className={p.className} aria-hidden>
      <path d="M8 1.5 14 4.5v7L8 14.5 2 11.5v-7Z" fill="#dfdfdf" stroke="#000" />
      <path d="M2 4.5 8 7.5l6-3M8 7.5v7" fill="none" stroke="#000" />
      <path d="M8 7.5 14 4.5v7L8 14.5Z" fill="#808080" />
    </svg>
  ),
  sun: (p: Props) => (
    <svg viewBox="0 0 16 16" className={p.className} aria-hidden shapeRendering="crispEdges">
      <path
        d="M7 0h2v2H7zM7 14h2v2H7zM0 7h2v2H0zM14 7h2v2h-2zM2 2h2v2H2zM12 2h2v2h-2zM2 12h2v2H2zM12 12h2v2h-2z"
        fill="#808000"
      />
      <path d="M6 4h4v1h1v1h1v4h-1v1h-1v1H6v-1H5v-1H4V6h1V5h1z" fill="#ffff00" stroke="#000" strokeWidth="0.5" />
    </svg>
  ),
  moon: (p: Props) => (
    <svg viewBox="0 0 16 16" className={p.className} aria-hidden>
      <mask id="moon-cut">
        <rect width="16" height="16" fill="#fff" />
        <circle cx="10.5" cy="5.5" r="5" fill="#000" />
      </mask>
      <circle cx="8" cy="8.5" r="6.5" fill="#ffffc0" stroke="#000" strokeWidth="0.75" mask="url(#moon-cut)" />
      <path d="M12.5 10h1v1h-1zM14 6.5h1v1h-1z" fill="#ffff00" />
    </svg>
  ),
  speaker: (p: Props & { muted?: boolean }) => (
    <svg viewBox="0 0 16 16" className={p.className} aria-hidden shapeRendering="crispEdges">
      <path d="M2 6h3l4-3v10l-4-3H2z" fill="#ffff00" stroke="#000" />
      {p.muted ? (
        <path d="m11 6 4 4m0-4-4 4" stroke="#ff0000" strokeWidth="1.5" shapeRendering="auto" />
      ) : (
        <path d="M11 5c1.5 1.5 1.5 4.5 0 6M13 3c2.5 2.5 2.5 7.5 0 10" fill="none" stroke="#000" shapeRendering="auto" />
      )}
    </svg>
  ),
}

export function Logo({ className }: Props) {
  return (
    <svg viewBox="0 0 16 16" className={className} shapeRendering="crispEdges" aria-hidden>
      <rect x="1.5" y="1.5" width="13" height="10" fill="#c0c0c0" stroke="#000" />
      <rect x="3" y="3" width="10" height="7" fill="#000" />
      <rect x="4" y="5" width="1" height="1" fill="#00ff00" />
      <rect x="5" y="6" width="1" height="1" fill="#00ff00" />
      <rect x="4" y="7" width="1" height="1" fill="#00ff00" />
      <rect x="7" y="8" width="3" height="1" fill="#00ff00" />
      <rect x="5.5" y="11.5" width="5" height="3" fill="#808080" stroke="#000" />
    </svg>
  )
}
