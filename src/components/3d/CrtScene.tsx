'use client'

import dynamic from 'next/dynamic'

import { Loading } from '@/components/3d/Loading'

const Scene = dynamic(() => import('@/components/3d/Scene'), { ssr: false, loading: () => <Loading /> })

export function CrtScene({ children }: React.PropsWithChildren) {
  return <Scene>{children}</Scene>
}
