import { Button, StatusBar, Sunken } from '@/components/desktop/apps/shared'

const profile = 'https://soundcloud.com/sprnv4'
const player = `https://w.soundcloud.com/player/?${new URLSearchParams({
  url: profile,
  color: '#000080',
  auto_play: 'false',
  show_comments: 'false',
  visual: 'false',
})}`

export function Music() {
  return (
    <>
      <div className="flex shrink-0 items-center gap-2 pb-[3px]">
        <p className="flex-1">
          <b>sprnv4</b>: music production, on SoundCloud
        </p>
        <Button href={profile}>Open SoundCloud</Button>
      </div>
      <Sunken className="min-h-0 flex-1">
        <iframe src={player} title="sprnv4 on SoundCloud" allow="autoplay" className="h-full w-full" />
      </Sunken>
      <StatusBar cells={['Ready']} />
    </>
  )
}
