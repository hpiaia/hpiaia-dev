'use client'

import { Crt } from '@/components/Crt'
import { CrtScene } from '@/components/CrtScene'
import { Desktop } from '@/components/desktop/Desktop'
import { ui } from '@/components/desktop/icons'
import type { AppKey } from '@/lib/apps'
import { setSetting, useSetting } from '@/lib/settings'

type Props = { initial: { key: AppKey; sub?: string } }

// The monitor screen is 1610x1300 css px; the desktop renders at a lower size and is scaled up so text stays legible
const zoom = 2.1

export function Computer({ initial }: Props) {
  const view = useSetting('view')

  if (view === 'screen')
    return (
      <main className="h-dvh w-full">
        <Desktop initial={initial} />
      </main>
    )

  return (
    <main className="relative h-dvh w-full bg-[#151516]">
      <CrtScene>
        <Crt className="crt--desk h-full rounded-lg">
          <div
            style={{ width: `${100 / zoom}%`, height: `${100 / zoom}%`, transform: `scale(${zoom})` }}
            className="origin-top-left"
          >
            <Desktop initial={initial} />
          </div>
        </Crt>
      </CrtScene>
      <button
        type="button"
        onClick={() => setSetting('view', 'screen')}
        className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-face px-3 py-1.5 text-ink bevel active:bevel-in"
      >
        <ui.cube className="size-4" />
        Back to the screen
      </button>
    </main>
  )
}
