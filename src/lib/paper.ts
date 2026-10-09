import { CanvasTexture, PlaneGeometry, RepeatWrapping } from 'three'

function random(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0xffffffff
  }
}

function heightField(size: number, seed: number) {
  const next = random(seed)
  const base = new Float32Array(size * size)
  for (let i = 0; i < base.length; i++) base[i] = next()
  const height = new Float32Array(size * size)
  const cell = 32
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let sum = 0
      let amp = 1
      let total = 0
      for (let octave = 0; octave < 4; octave++) {
        const step = cell >> octave
        const gx = Math.floor(x / step)
        const gy = Math.floor(y / step)
        const fx = (x % step) / step
        const fy = (y % step) / step
        const at = (ix: number, iy: number) => base[((iy * step) % size) * size + ((ix * step) % size)]
        const top = at(gx, gy) * (1 - fx) + at(gx + 1, gy) * fx
        const bottom = at(gx, gy + 1) * (1 - fx) + at(gx + 1, gy + 1) * fx
        sum += (top * (1 - fy) + bottom * fy) * amp
        total += amp
        amp *= 0.55
      }
      height[y * size + x] = sum / total
    }
  }
  return height
}

function buildNormalMap(size: number, strength: number, seed: number) {
  const height = heightField(size, seed)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const image = ctx.createImageData(size, size)
  const at = (x: number, y: number) => height[((y + size) % size) * size + ((x + size) % size)]
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength
      const length = Math.hypot(dx, dy, 1)
      const i = (y * size + x) * 4
      image.data[i] = ((-dx / length) * 0.5 + 0.5) * 255
      image.data[i + 1] = ((-dy / length) * 0.5 + 0.5) * 255
      image.data[i + 2] = (1 / length) * 0.5 * 255 + 127
      image.data[i + 3] = 255
    }
  }
  ctx.putImageData(image, 0, 0)
  const texture = new CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = RepeatWrapping
  return texture
}

let shared: CanvasTexture | undefined

export function crinkleNormalMap(repeatX = 1, repeatY = 1) {
  shared ??= buildNormalMap(512, 2.5, 7)
  const texture = shared.clone()
  texture.repeat.set(repeatX, repeatY)
  texture.needsUpdate = true
  return texture
}

export function warpedPlane(width: number, height: number, seed: number, amount = 0.0015) {
  const geometry = new PlaneGeometry(width, height, 24, 24)
  const next = random(seed)
  const phase = [next() * Math.PI * 2, next() * Math.PI * 2, next() * Math.PI * 2]
  const position = geometry.attributes.position
  for (let i = 0; i < position.count; i++) {
    const u = position.getX(i) / width
    const v = position.getY(i) / height
    const edge = Math.max(Math.abs(u), Math.abs(v)) * 2
    const curl = Math.pow(Math.max(0, edge - 0.7) / 0.3, 2) * amount
    const ripple =
      Math.sin(u * 7 + phase[0]) * Math.cos(v * 5 + phase[1]) * amount +
      Math.sin((u + v) * 11 + phase[2]) * amount * 0.4
    position.setZ(i, ripple + curl)
  }
  geometry.computeVertexNormals()
  return geometry
}
