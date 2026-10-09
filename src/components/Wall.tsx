'use client'

import { useTexture } from '@react-three/drei'
import { useMemo } from 'react'

import { crinkleNormalMap, warpedPlane } from '@/lib/paper'

type PosterProps = {
  url: string
  position: [number, number, number]
  rotation?: number
  width?: number
  aspect?: number
  layer?: number
}

const wide = 9 / 16
const square = 1

const posters: PosterProps[] = [
  { url: '/posters/wow-1.jpg', position: [0, 3.55, 0], rotation: 0.01, width: 3.0, aspect: wide },
  { url: '/posters/wow-2.jpg', position: [-3.9, 1.5, 0], rotation: -0.02, width: 2.4, aspect: wide },
  { url: '/posters/wow-3.jpg', position: [2.9, 1.7, 0], rotation: 0.02, width: 2.1, aspect: wide },
  { url: '/posters/wow-4.jpg', position: [-4.6, 3.3, 0], rotation: 0.015, width: 2.2, aspect: wide },
  { url: '/posters/wow-5.jpg', position: [5.2, 3.3, 0], rotation: -0.01, width: 2.2, aspect: wide },
  { url: '/posters/kyuss.jpg', position: [-2.45, 3, 0], rotation: 0.03, width: 1.35, aspect: square, layer: 1 },
  {
    url: '/posters/alice-in-chains.jpg',
    position: [-1.8, 1.8, 0],
    rotation: -0.02,
    width: 1.25,
    aspect: square,
    layer: 1,
  },
  { url: '/posters/radiohead.jpg', position: [2.4, 3.3, 0], rotation: -0.025, width: 1.3, aspect: square },
  { url: '/posters/deftones.jpg', position: [3.9, 3.9, 0], rotation: 0.02, width: 1.3, aspect: square, layer: 1 },
  { url: '/posters/qotsa.jpg', position: [1.5, 2.25, 0], rotation: 0.015, width: 1.1, aspect: square, layer: 1 },
]

function Poster({
  url,
  position,
  rotation = 0,
  width = 1.2,
  aspect = square,
  layer = 0,
  index = 0,
}: PosterProps & { index: number }) {
  const texture = useTexture(url)
  const height = width * aspect
  const normalMap = useMemo(() => crinkleNormalMap(width, height), [width, height])
  const geometry = useMemo(() => warpedPlane(width, height, index + 1), [width, height, index])
  return (
    <group
      position={[position[0], position[1], position[2] + layer * 0.02 + index * 0.004]}
      rotation={[0, 0, rotation]}
    >
      <mesh position={[0, 0, 0.01]} geometry={geometry} castShadow>
        <meshStandardMaterial
          map={texture}
          normalMap={normalMap}
          normalScale={[0.35, 0.35]}
          roughness={0.65}
          metalness={0}
        />
      </mesh>
    </group>
  )
}

export function Wall({ z, floor, color }: { z: number; floor: number; color: string }) {
  return (
    <group position={[0, 0, z]}>
      <mesh position={[0, floor + 5, 0]} receiveShadow>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh position={[0, floor + 0.06, 0.02]}>
        <planeGeometry args={[30, 0.12]} />
        <meshStandardMaterial color="#2b2b2d" roughness={0.8} />
      </mesh>
      {posters.map((poster, index) => (
        <Poster key={poster.url} {...poster} index={index} />
      ))}
    </group>
  )
}
