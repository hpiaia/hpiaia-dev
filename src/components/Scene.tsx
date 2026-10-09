'use client'

import { Center, ContactShadows, Html, OrbitControls, useCursor, useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import type { Mesh, PerspectiveCamera } from 'three'

import { Wall } from '@/components/Wall'
import { useMobile, usePortrait } from '@/lib/media'

const scene = {
  file: '/models/desk.glb',
  mobileFile: '/models/desk-mobile.glb',
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
  power: {
    button: [0.7465, 0.856, 0.35] as [number, number, number],
    size: [0.099, 0.068] as [number, number],
    led: [0.683, 0.857, 0.35] as [number, number, number],
  },
  floor: -2.44,
  camera: { position: [0, 2.3, 5.4] as [number, number, number], fov: 32 },
  portrait: { fov: 46, zoom: 1.15 },
  target: [0, 1.45, 0] as [number, number, number],
  distance: { min: 3.5, max: 5 },
  polar: { min: Math.PI / 2 - 0.35, max: Math.PI / 2 + 0.05 },
  azimuth: 0.3,
}

function Frame({ portrait }: { portrait: boolean }) {
  const get = useThree((state) => state.get)
  useEffect(() => {
    const { invalidate } = get()
    const camera = get().camera as PerspectiveCamera
    const [x, y, z] = scene.camera.position
    camera.fov = portrait ? scene.portrait.fov : scene.camera.fov
    camera.position.set(x, y, portrait ? z * scene.portrait.zoom : z)
    camera.updateProjectionMatrix()
    invalidate()
  }, [get, portrait])
  return null
}

function PowerButton({ on, toggle }: { on: boolean; toggle: () => void }) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  return (
    <group>
      <mesh
        position={scene.power.button}
        scale={[...scene.power.size, 1]}
        onClick={(e) => {
          e.stopPropagation()
          toggle()
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <circleGeometry args={[0.5, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={scene.power.led}>
        <sphereGeometry args={[0.009, 12, 12]} />
        <meshStandardMaterial
          color={on ? '#9dff9f' : '#1a1f1a'}
          emissive={on ? '#39ff14' : '#000000'}
          emissiveIntensity={on ? 3 : 0}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
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
  const mobile = useMobile()
  const portrait = usePortrait()
  const zoom = portrait ? scene.portrait.zoom : 1
  const [overScreen, setOverScreen] = useState(false)
  const [power, setPower] = useState<'boot' | 'on' | 'off'>('boot')
  const on = power !== 'off'
  const model = useGLTF(mobile ? scene.mobileFile : scene.file)

  useEffect(() => {
    model.scene.traverse((node) => {
      const mesh = node as Mesh
      if (mesh.isMesh) {
        mesh.castShadow = !mobile
        mesh.receiveShadow = !mobile
      }
    })
  }, [model, mobile])

  return (
    <Canvas
      className="touch-none"
      camera={scene.camera}
      shadows={!mobile}
      frameloop="demand"
      dpr={mobile ? 1 : [1, 1.5]}
      gl={{ powerPreference: mobile ? 'low-power' : 'high-performance', antialias: !mobile }}
    >
      <color attach="background" args={[scene.background]} />

      <Kick />
      <Frame portrait={portrait} />
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
            <div
              className={`rounded-lg power-${power}`}
              style={{ width: scene.screen.width, height: scene.screen.height }}
              onPointerEnter={() => setOverScreen(true)}
              onPointerLeave={() => setOverScreen(false)}
            >
              {children}
            </div>
          </Html>
        </primitive>
      </Center>

      <PowerButton on={on} toggle={() => setPower(on ? 'off' : 'on')} />

      <OrbitControls
        target={scene.target}
        enablePan={false}
        enableZoom={!overScreen}
        enableDamping
        minDistance={scene.distance.min * zoom}
        maxDistance={scene.distance.max * zoom}
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
        castShadow={!mobile}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <pointLight position={[-4, 2.2, 1.5]} intensity={18} distance={9} color="#ffffff" />
      <pointLight position={[4.5, 2.6, 1.8]} intensity={16} distance={9} color="#ffffff" />
      {on && <pointLight position={[0, 1.6, 1.4]} intensity={4} distance={4} color="#9dff9f" />}
      {!mobile && <ContactShadows position-y={scene.floor} scale={5} blur={3} />}
    </Canvas>
  )
}
