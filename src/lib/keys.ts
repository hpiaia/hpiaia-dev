const base = '/sounds/keys'
const names = [
  'GENERIC_R0',
  'GENERIC_R1',
  'GENERIC_R2',
  'GENERIC_R3',
  'GENERIC_R4',
  'ENTER',
  'BACKSPACE',
  'SPACE',
  'GENERIC_UP',
  'ENTER_UP',
  'BACKSPACE_UP',
  'SPACE_UP',
] as const

type Name = (typeof names)[number]

let context: AudioContext | null = null
const buffers = new Map<Name, AudioBuffer>()
let loading: Promise<void> | null = null

function ensure() {
  if (!context) context = new AudioContext()
  if (context.state === 'suspended') void context.resume()
  if (!loading) {
    const ctx = context
    loading = Promise.all(
      names.map(async (name) => {
        const response = await fetch(`${base}/${name}.mp3`)
        buffers.set(name, await ctx.decodeAudioData(await response.arrayBuffer()))
      }),
    ).then(() => undefined)
  }
  return context
}

function play(name: Name, gain: number) {
  const ctx = ensure()
  const buffer = buffers.get(name)
  if (!buffer) return
  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.playbackRate.value = 0.96 + Math.random() * 0.08
  const volume = ctx.createGain()
  volume.gain.value = gain
  source.connect(volume).connect(ctx.destination)
  source.start()
}

function special(key: string) {
  if (key === 'Enter') return 'ENTER'
  if (key === 'Backspace') return 'BACKSPACE'
  if (key === ' ') return 'SPACE'
  return null
}

export function keyDown(key: string) {
  const name = special(key)
  play(name ?? (`GENERIC_R${Math.floor(Math.random() * 5)}` as Name), 0.7)
}

export function keyUp(key: string) {
  const name = special(key)
  play(name ? (`${name}_UP` as Name) : 'GENERIC_UP', 0.5)
}

export function warm() {
  ensure()
}

export const audio = ensure
