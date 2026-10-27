'use client'

import { useState } from 'react'

import { Button, GroupBox, Sunken, Tabs } from '@/components/desktop/apps/shared'
import { setSetting, useSetting, type Wallpaper } from '@/lib/settings'
import { wallpaperNames } from '@/lib/settings-script'
import { close } from '@/lib/windows'

function Radio({ checked, onChange, children }: React.PropsWithChildren<{ checked: boolean; onChange: () => void }>) {
  return (
    <label className="flex items-center gap-1.5 py-0.5">
      <input type="radio" checked={checked} onChange={onChange} className="accent-select" />
      {children}
    </label>
  )
}

function Background() {
  const wallpaper = useSetting('wallpaper')
  return (
    <>
      <div className="mx-auto mb-3 w-44 bg-face p-2 pb-3 bevel">
        <div className="relative h-24 overflow-hidden bevel-in">
          <div className="wallpaper absolute inset-[2px]" />
        </div>
      </div>
      <p className="mb-1">Wallpaper</p>
      <Sunken>
        <ul>
          {(Object.keys(wallpaperNames) as Wallpaper[]).map((w) => (
            <li key={w}>
              <button
                type="button"
                onClick={() => setSetting('wallpaper', w)}
                className={`w-full px-1.5 py-0.5 text-left ${w === wallpaper ? 'bg-select text-select-ink' : ''}`}
              >
                {wallpaperNames[w]}
              </button>
            </li>
          ))}
        </ul>
      </Sunken>
    </>
  )
}

function Appearance() {
  const appearance = useSetting('appearance')
  return (
    <>
      <div className="mb-3 bg-desktop p-3 bevel-in">
        <div className="bg-face p-[3px] bevel-window">
          <p className="title-on px-1 font-bold">Active Window</p>
          <p className="bg-window px-2 py-2 text-ink">Window Text</p>
        </div>
      </div>
      <GroupBox label="Scheme">
        <Radio checked={appearance === 'light'} onChange={() => setSetting('appearance', 'light')}>
          Standard
        </Radio>
        <Radio checked={appearance === 'dark'} onChange={() => setSetting('appearance', 'dark')}>
          Night
        </Radio>
      </GroupBox>
    </>
  )
}

function Settings() {
  const view = useSetting('view')
  const sound = useSetting('sound')
  return (
    <>
      <GroupBox label="Where this computer lives">
        <Radio checked={view === 'screen'} onChange={() => setSetting('view', 'screen')}>
          Just the screen
        </Radio>
        <Radio checked={view === 'desk'} onChange={() => setSetting('view', 'desk')}>
          On a desk, in 3D
        </Radio>
      </GroupBox>
      <label className="mt-3 flex items-center gap-1.5">
        <input
          type="checkbox"
          checked={sound === 'on'}
          onChange={(e) => setSetting('sound', e.target.checked ? 'on' : 'off')}
          className="accent-select"
        />
        Keyboard and button sounds
      </label>
    </>
  )
}

type Tab = 'background' | 'appearance' | 'settings'

export function Display() {
  const [tab, setTab] = useState<Tab>('background')
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 p-1.5">
      <Tabs<Tab>
        tabs={[
          { key: 'background', label: 'Background', content: <Background /> },
          { key: 'appearance', label: 'Appearance', content: <Appearance /> },
          { key: 'settings', label: 'Settings', content: <Settings /> },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div className="flex justify-end">
        <Button primary onClick={() => close('display')}>
          OK
        </Button>
      </div>
    </div>
  )
}
