import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

import { resume } from '@/content/resume'
import { site } from '@/content/site'

export const alt = `${site.name}, ${resume.role}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const file = (path: string) => readFile(join(process.cwd(), 'public', path))

const raised = 'inset -2px -2px #0a0a0a, inset 2px 2px #ffffff, inset -4px -4px #808080, inset 4px 4px #dfdfdf'

export default async function Image() {
  const [regular, bold, avatar] = await Promise.all([
    file('fonts/Inter-Regular.ttf'),
    file('fonts/Inter-Bold.ttf'),
    file('avatar.jpg'),
  ])
  const photo = `data:image/jpeg;base64,${avatar.toString('base64')}`

  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#008080', padding: 56 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          background: '#c0c0c0',
          padding: 6,
          boxShadow: raised,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: 44,
            padding: '0 14px',
            color: '#fff',
            fontSize: 24,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #000080, #1084d0)',
          }}
        >
          About Me - hpiaia97
        </div>
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            gap: 48,
            background: '#fff',
            marginTop: 6,
            padding: 48,
          }}
        >
          <img src={photo} width={280} height={280} style={{ border: '3px solid #000' }} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 68, fontWeight: 700, color: '#000' }}>{site.name}</div>
            <div style={{ fontSize: 34, color: '#000080', fontWeight: 700 }}>{resume.role}</div>
            <div style={{ fontSize: 26, color: '#404040', maxWidth: 640, lineHeight: 1.35 }}>
              TypeScript · React · Node.js · Go · AWS
            </div>
            <div style={{ fontSize: 26, color: '#808080' }}>hpiaia.dev</div>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Inter', data: regular, weight: 400, style: 'normal' },
        { name: 'Inter', data: bold, weight: 700, style: 'normal' },
      ],
    },
  )
}
