import { audio } from '@/lib/keys'

const enabled = () => localStorage.getItem('sound') !== 'off'

function tone(
  ctx: AudioContext,
  type: OscillatorType,
  from: number,
  to: number,
  start: number,
  length: number,
  gain: number,
  attack = 0.01,
) {
  const osc = ctx.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(from, start)
  osc.frequency.exponentialRampToValueAtTime(to, start + length)
  const volume = ctx.createGain()
  volume.gain.setValueAtTime(0.0001, start)
  volume.gain.exponentialRampToValueAtTime(gain, start + attack)
  volume.gain.exponentialRampToValueAtTime(0.0001, start + length)
  osc.connect(volume).connect(ctx.destination)
  osc.start(start)
  osc.stop(start + length + 0.05)
}

function noise(ctx: AudioContext, start: number, length: number, gain: number, frequency: number, q: number) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * length), ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2)
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = frequency
  filter.Q.value = q
  const volume = ctx.createGain()
  volume.gain.value = gain
  source.connect(filter).connect(volume).connect(ctx.destination)
  source.start(start)
}

const level = 0.55

export function buttonClick() {
  if (!enabled()) return
  const ctx = audio()
  const t = ctx.currentTime
  noise(ctx, t, 0.03, 0.9, 3200, 1)
  noise(ctx, t + 0.07, 0.025, 0.5, 2400, 1)
}

export function powerOn() {
  if (!enabled()) return
  const ctx = audio()
  const t = ctx.currentTime
  noise(ctx, t, 0.05, 1.2 * level, 2800, 0.7)
  tone(ctx, 'sine', 55, 32, t + 0.03, 0.35, 0.12 * level)
  noise(ctx, t + 0.05, 0.5, 0.12 * level, 5000, 0.5)
  tone(ctx, 'sine', 400, 12000, t + 0.12, 0.7, 0.05 * level, 0.2)
  tone(ctx, 'sine', 11500, 12500, t + 0.8, 1.6, 0.012 * level, 0.3)
}

export function powerOff() {
  if (!enabled()) return
  const ctx = audio()
  const t = ctx.currentTime
  noise(ctx, t, 0.045, 1.1 * level, 2200, 0.7)
  tone(ctx, 'sine', 12000, 120, t + 0.01, 0.3, 0.06 * level)
  tone(ctx, 'sine', 65, 24, t + 0.02, 0.3, 0.1 * level)
  noise(ctx, t + 0.05, 0.35, 0.08 * level, 1500, 0.4)
}
