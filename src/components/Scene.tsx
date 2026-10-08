'use client'

import { Center, ContactShadows, Html, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import type { Mesh } from 'three'

import { Wall } from '@/components/Wall'

const scene = {
  file: '/models/desk.glb',
  background: '#151516',
  wall: { z: -1.8, color: '#4a4a4d' },
  scale: 5,
  rotation: [0, -Math.PI / 2, 0] as [number, number, number],
  screen: {
    position: [0.028, 0.9395, 0] as [number, number, number],
    rotation: [0, Math.PI / 2, 0] as [number, number, number],
    scale: 0.076,
    width: 1610,
    height: 1300,
  },
  floor: -2.44,
  camera: { position: [0, 2.3, 5.4] as [number, number, number], fov: 32 },
  target: [0, 1.45, 0] as [number, number, number],
  distance: { min: 3.5, max: 5 },
  polar: { min: Math.PI / 2 - 0.35, max: Math.PI / 2 + 0.05 },
  azimuth: 0.3,
}

function Kick() {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    const timers = [0, 100, 400, 1000, 2000, 4000].map((ms) => setTimeout(invalidate, ms))
    return () => timers.forEach(clearTimeout)
  }, [invalidate])
  return null
}

export default function Scene({ children }: React.PropsWithChildren) {
  const model = useGLTF(scene.file)

  useEffect(() => {
    model.scene.traverse((node) => {
      const mesh = node as Mesh
      if (mesh.isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
  }, [model])

  return (
    <Canvas className="touch-none" camera={scene.camera} shadows frameloop="demand" dpr={[1, 1.5]}>
      <color attach="background" args={[scene.background]} />

      <Kick />
      <Wall z={scene.wall.z} floor={scene.floor} color={scene.wall.color} />

      <Center>
        <primitive object={model.scene} scale={scene.scale} rotation={scene.rotation}>
          <Html
            transform
            scale={scene.screen.scale}
            distanceFactor={1}
            position={scene.screen.position}
            rotation={scene.screen.rotation}
          >
            <div className="rounded-lg" style={{ width: scene.screen.width, height: scene.screen.height }}>
              {children}
            </div>
          </Html>
        </primitive>
      </Center>

      <OrbitControls
        target={scene.target}
        enablePan={false}
        enableDamping
        minDistance={scene.distance.min}
        maxDistance={scene.distance.max}
        minPolarAngle={scene.polar.min}
        maxPolarAngle={scene.polar.max}
        minAzimuthAngle={-scene.azimuth}
        maxAzimuthAngle={scene.azimuth}
      />

      <ambientLight intensity={0.45} color="#ffffff" />
      <spotLight
        position={[1.5, 6, 4]}
        angle={0.55}
        penumbra={0.9}
        intensity={90}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <pointLight position={[-4, 2.2, 1.5]} intensity={18} distance={9} color="#ffffff" />
      <pointLight position={[4.5, 2.6, 1.8]} intensity={16} distance={9} color="#ffffff" />
      <pointLight position={[0, 1.6, 1.4]} intensity={4} distance={4} color="#9dff9f" />
      <ContactShadows position-y={scene.floor} scale={5} blur={3} />
    </Canvas>
  )
}
