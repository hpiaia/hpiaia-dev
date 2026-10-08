import {
  DotGothic16,
  Doto,
  Fira_Mono,
  Handjet,
  Nova_Mono,
  Pixelify_Sans,
  Share_Tech_Mono,
  Silkscreen,
  Sometype_Mono,
  Ubuntu_Mono,
  Workbench,
} from 'next/font/google'

const doto = Doto({ subsets: ['latin'], weight: ['700', '900'], variable: '--font-doto' })
const dotgothic16 = DotGothic16({ subsets: ['latin'], weight: '400', variable: '--font-dotgothic16' })
const shareTechMono = Share_Tech_Mono({ subsets: ['latin'], weight: '400', variable: '--font-share-tech-mono' })
const pixelifySans = Pixelify_Sans({ subsets: ['latin'], variable: '--font-pixelify-sans' })
const silkscreen = Silkscreen({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-silkscreen' })
const workbench = Workbench({ subsets: ['latin'], variable: '--font-workbench' })
const handjet = Handjet({ subsets: ['latin'], variable: '--font-handjet' })
const ubuntuMono = Ubuntu_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-ubuntu-mono' })
const firaMono = Fira_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-fira-mono' })
const novaMono = Nova_Mono({ subsets: ['latin'], weight: '400', variable: '--font-nova-mono' })
const sometypeMono = Sometype_Mono({ subsets: ['latin'], variable: '--font-sometype-mono' })

export const fonts = [
  { key: 'doto', label: 'Doto', variable: '--font-doto', weight: 700, heroWeight: 900 },
  { key: 'dotgothic16', label: 'DotGothic16', variable: '--font-dotgothic16', weight: 400, heroWeight: 400 },
  {
    key: 'share-tech-mono',
    label: 'Share Tech Mono',
    variable: '--font-share-tech-mono',
    weight: 400,
    heroWeight: 400,
  },
  { key: 'pixelify-sans', label: 'Pixelify Sans', variable: '--font-pixelify-sans', weight: 400, heroWeight: 600 },
  { key: 'silkscreen', label: 'Silkscreen', variable: '--font-silkscreen', weight: 400, heroWeight: 700 },
  { key: 'workbench', label: 'Workbench', variable: '--font-workbench', weight: 400, heroWeight: 400 },
  { key: 'handjet', label: 'Handjet', variable: '--font-handjet', weight: 500, heroWeight: 700 },
  { key: 'ubuntu-mono', label: 'Ubuntu Mono', variable: '--font-ubuntu-mono', weight: 400, heroWeight: 700 },
  { key: 'fira-mono', label: 'Fira Mono', variable: '--font-fira-mono', weight: 400, heroWeight: 700 },
  { key: 'nova-mono', label: 'Nova Mono', variable: '--font-nova-mono', weight: 400, heroWeight: 400 },
  { key: 'sometype-mono', label: 'Sometype Mono', variable: '--font-sometype-mono', weight: 400, heroWeight: 700 },
] as const

export type FontKey = (typeof fonts)[number]['key']

export const defaultFont: FontKey = 'ubuntu-mono'

export const fontClassNames = [
  doto,
  dotgothic16,
  shareTechMono,
  pixelifySans,
  silkscreen,
  workbench,
  handjet,
  ubuntuMono,
  firaMono,
  novaMono,
  sometypeMono,
]
  .map((font) => font.variable)
  .join(' ')
