import { StatusBar, Sunken } from '@/components/desktop/apps/shared'

export function Trash() {
  return (
    <>
      <Sunken className="min-h-0 flex-1" />
      <StatusBar cells={['0 object(s)', '0 bytes']} />
    </>
  )
}
