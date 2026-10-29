'use client'

import type WebampType from 'webamp'
import { useEffect, useRef } from 'react'

import { bridge, playerReady, trackUrl, YouTubeMedia } from '@/components/desktop/apps/winamp/media'
import { albums, findAlbum } from '@/content/albums'
import { close, focus, minimize, type Win } from '@/lib/windows'
import { loadYouTube, type YouTubePlayer } from '@/lib/youtube'

const playlist = albums.flatMap((album) =>
  album.tracks.map((t) => ({
    url: trackUrl(t.youtube),
    duration: t.seconds,
    metaData: { artist: album.artist, title: t.title, album: album.title },
  })),
)

// Opens with this track selected and paused
const defaultTrack = playlist.findIndex((t) => t.metaData.album === 'Dirt' && t.metaData.title === 'Down In A Hole')

const firstTrack = (slug?: string) => {
  const album = findAlbum(slug)
  if (!album) return 0
  return albums.slice(0, albums.indexOf(album)).reduce((n, a) => n + a.tracks.length, 0)
}

// The playlist grows 29px per step: a tall list on desktop, a shorter one on phones.
// On desktop Winamp opens on the right, through Webamp's store (it would center itself)
const layout = (compact: boolean) => ({
  main: { position: { top: 0, left: 0 } },
  playlist: { position: { top: 116, left: 0 }, size: { extraWidth: 0, extraHeight: compact ? 4 : 10 } },
})

// Frameless: Webamp draws onto the desktop, while the window store still tracks it for the taskbar
export function Winamp({ win, compact }: { win: Win; compact: boolean }) {
  const stage = useRef<HTMLDivElement>(null)
  const player = useRef<HTMLDivElement>(null)
  const webamp = useRef<WebampType | null>(null)
  const sub = useRef(win.sub)
  const small = useRef(compact)

  useEffect(() => {
    let disposed = false
    let instance: WebampType | null = null
    let youtube: YouTubePlayer | null = null

    async function start() {
      const { default: Webamp } = await import('webamp')
      if (disposed || !stage.current || !player.current) return

      bridge.start = () => {
        bridge.start = null
        void loadYouTube().then((YT) => {
          if (disposed || !player.current) return
          const host = document.createElement('div')
          player.current.replaceChildren(host)
          const created = new YT.Player(host, {
            host: 'https://www.youtube-nocookie.com',
            width: 200,
            height: 200,
            playerVars: { playsinline: 1, rel: 0 },
            events: {
              onReady: () => {
                if (!disposed) playerReady(created)
              },
              onStateChange: (e) => bridge.media?.playerState(e.data),
              onError: (e) => bridge.media?.playerError(e.data),
            },
          })
          youtube = created
        })
      }

      instance = new Webamp({
        initialTracks: playlist,
        windowLayout: layout(small.current),
        zIndex: 1,
        __customMediaClass: YouTubeMedia,
      })
      if (!small.current) {
        const x = stage.current.clientWidth - 430
        const y = Math.round(stage.current.clientHeight * 0.177)
        instance.store.dispatch({
          type: 'UPDATE_WINDOW_POSITIONS',
          positions: { main: { x, y }, playlist: { x, y: y + 116 } },
          absolute: true,
        })
      }
      instance.onClose(() => close('winamp'))
      instance.onMinimize(() => minimize('winamp'))
      await instance.renderInto(stage.current)
      if (disposed) return instance.dispose()
      webamp.current = instance
      bridge.webamp = instance
      instance.setCurrentTrack(sub.current ? firstTrack(sub.current) : defaultTrack)
    }
    void start()

    return () => {
      disposed = true
      webamp.current = null
      bridge.webamp = null
      instance?.dispose()
      youtube?.destroy()
      bridge.player = null
      bridge.queued = null
      bridge.start = null
    }
  }, [])

  useEffect(() => {
    if (!webamp.current || sub.current === win.sub) return
    sub.current = win.sub
    webamp.current.setCurrentTrack(firstTrack(win.sub))
  }, [win.sub])

  return (
    <div
      role="application"
      aria-label="Winamp"
      onPointerDownCapture={() => focus('winamp')}
      style={{ zIndex: win.z }}
      className={`pointer-events-none absolute inset-0 ${win.minimized ? 'hidden' : ''}`}
    >
      <div ref={stage} className="winamp-stage absolute inset-0" />
      <div ref={player} aria-hidden className="absolute -left-[10000px] size-[200px] opacity-0" />
    </div>
  )
}
