import type WebampType from 'webamp'

import { getSetting, useSettings } from '@/lib/settings'
import { PlayerState, type YouTubePlayer } from '@/lib/youtube'

type Listener = (...args: unknown[]) => void

// Webamp constructs the media object itself, so the YouTube player reaches it through here.
// `player` is set only once YouTube is ready; until then loads are queued and the volume remembered.
// YouTube (~800 KB) loads on the first play, through `start`, not when Winamp first draws
export const bridge: {
  player: YouTubePlayer | null
  media: YouTubeMedia | null
  queued: { id: string; play: boolean } | null
  volume: number
  start: (() => void) | null
  webamp: WebampType | null
} = { player: null, media: null, queued: null, volume: 75, start: null, webamp: null }

// Turning the 3D monitor off cuts the music with it
export function pauseWinamp() {
  bridge.webamp?.pause()
}

// The tray's speaker mutes Winamp along with the rest of the system sounds
const applyMute = (player: YouTubePlayer, sound: 'on' | 'off') => (sound === 'off' ? player.mute() : player.unMute())

useSettings.subscribe((settings, previous) => {
  if (bridge.player && settings.sound !== previous.sound) applyMute(bridge.player, settings.sound)
})

export function playerReady(player: YouTubePlayer) {
  bridge.player = player
  player.setVolume(bridge.volume)
  applyMute(player, getSetting('sound'))
  const queued = bridge.queued
  bridge.queued = null
  if (queued?.play) player.loadVideoById(queued.id)
  else if (queued) player.cueVideoById(queued.id)
}

export const trackUrl = (videoId: string) => `youtube:${videoId}`

// Equalizer, balance and visualizer have no access to YouTube's audio, so they are no-ops
export class YouTubeMedia {
  private listeners = new Map<string, Set<Listener>>()
  private ticker: ReturnType<typeof setInterval> | null = null
  private loading = false
  private analyser: AnalyserNode | null = null

  constructor() {
    bridge.media = this
  }

  on(event: string, callback: Listener) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event)?.add(callback)
  }

  private emit(event: string, ...args: unknown[]) {
    this.listeners.get(event)?.forEach((fn) => fn(...args))
  }

  playerState(state: number) {
    if (state === PlayerState.playing) {
      this.emit('stopWaiting')
      this.emit('playing')
      this.startTicking()
    } else if (state === PlayerState.buffering) {
      this.emit('waiting')
    } else if (state === PlayerState.paused) {
      this.stopTicking()
      this.emit('timeupdate')
    } else if (state === PlayerState.ended) {
      this.stopTicking()
      this.emit('ended')
    }
  }

  playerError(code: number) {
    this.emit('error', code)
  }

  private startTicking() {
    this.stopTicking()
    this.ticker = setInterval(() => {
      // The duration is only known once the video is playing; that is when Winamp hears the file loaded
      if (this.loading && this.duration() > 0) {
        this.loading = false
        this.emit('fileLoaded')
      }
      this.emit('timeupdate')
    }, 250)
  }

  private stopTicking() {
    if (this.ticker) clearInterval(this.ticker)
    this.ticker = null
  }

  timeElapsed() {
    return bridge.player?.getCurrentTime() ?? 0
  }

  duration() {
    return bridge.player?.getDuration() ?? 0
  }

  async play() {
    if (bridge.player) return bridge.player.playVideo()
    if (bridge.queued) bridge.queued.play = true
    bridge.start?.()
  }

  pause() {
    bridge.player?.pauseVideo()
  }

  stop() {
    bridge.player?.pauseVideo()
    bridge.player?.seekTo(0, true)
    this.stopTicking()
    this.emit('timeupdate')
  }

  seekToPercentComplete(percent: number) {
    bridge.player?.seekTo((this.duration() * percent) / 100, true)
    this.emit('timeupdate')
  }

  async loadFromUrl(url: string, autoPlay: boolean) {
    const id = url.replace(/^youtube:/, '')
    this.loading = true
    if (!bridge.player) {
      bridge.queued = { id, play: autoPlay }
      if (autoPlay) bridge.start?.()
      return
    }
    if (autoPlay) bridge.player.loadVideoById(id)
    else bridge.player.cueVideoById(id)
  }

  setVolume(volume: number) {
    bridge.volume = volume
    bridge.player?.setVolume(volume)
  }

  setBalance() {}
  setPreamp() {}
  setEqBand() {}
  disableEq() {}
  enableEq() {}

  getAnalyser() {
    this.analyser ??= new AudioContext().createAnalyser()
    return this.analyser
  }

  dispose() {
    this.stopTicking()
    if (bridge.media === this) bridge.media = null
  }
}
