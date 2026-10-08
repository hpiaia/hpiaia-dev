'use client'

import dynamic from 'next/dynamic'

import { Loading } from '@/components/Loading'

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => <Loading />,
})

export function CrtScene({ children }: React.PropsWithChildren) {
  return <Scene>{children}</Scene>
}
