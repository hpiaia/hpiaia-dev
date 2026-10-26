'use client'

import dynamic from 'next/dynamic'

import { About } from '@/components/desktop/apps/About'
import { Contact } from '@/components/desktop/apps/Contact'
import { Credits } from '@/components/desktop/apps/Credits'
import { Cv } from '@/components/desktop/apps/Cv'
import { Display } from '@/components/desktop/apps/Display'
import { Music } from '@/components/desktop/apps/Music'
import { companies, Sunken } from '@/components/desktop/apps/shared'
import { Skills } from '@/components/desktop/apps/Skills'
import { Trash } from '@/components/desktop/apps/Trash'
import { Work } from '@/components/desktop/apps/Work'
import { resume } from '@/content/resume'
import { app } from '@/lib/apps'
import { close, open, type Win } from '@/lib/windows'

const Terminal = dynamic(() => import('@/components/Terminal'), { ssr: false })

export function windowTitle(win: Win) {
  const job = win.key === 'work' && resume.jobs.find((j) => j.slug === win.sub)
  return job ? `Exploring - ${companies(job)}` : app(win.key).title
}

export function AppView({ win, focused }: { win: Win; focused: boolean }) {
  switch (win.key) {
    case 'about':
      return <About />
    case 'work':
      return <Work sub={win.sub} />
    case 'cv':
      return <Cv />
    case 'terminal':
      return (
        <Sunken className="min-h-0 flex-1 !bg-black">
          <Terminal active={focused} onExit={() => close('terminal')} onApp={open} />
        </Sunken>
      )
    case 'skills':
      return <Skills />
    case 'contact':
      return <Contact />
    case 'music':
      return <Music />
    case 'credits':
      return <Credits />
    case 'display':
      return <Display />
    case 'trash':
      return <Trash />
  }
}
