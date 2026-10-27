export type YouTubePlayer = {
  loadVideoById(id: string): void
  cueVideoById(id: string): void
  playVideo(): void
  pauseVideo(): void
  seekTo(seconds: number, allowSeekAhead: boolean): void
  setVolume(volume: number): void
  mute(): void
  unMute(): void
  getCurrentTime(): number
  getDuration(): number
  destroy(): void
}

type PlayerOptions = {
  host?: string
  width?: number | string
  height?: number | string
  playerVars?: Record<string, number | string>
  events?: {
    onReady?: () => void
    onStateChange?: (event: { data: number }) => void
    onError?: (event: { data: number }) => void
  }
}

export type YouTubeApi = { Player: new (element: HTMLElement, options: PlayerOptions) => YouTubePlayer }

declare global {
  interface Window {
    YT?: YouTubeApi
    onYouTubeIframeAPIReady?: () => void
  }
}

export const PlayerState = { ended: 0, playing: 1, paused: 2, buffering: 3, cued: 5 } as const

let loading: Promise<YouTubeApi> | null = null

export function loadYouTube(): Promise<YouTubeApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  loading ??= new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => resolve(window.YT as YouTubeApi)
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    document.head.appendChild(script)
  })
  return loading
}
