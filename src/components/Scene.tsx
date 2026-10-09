'use client'

import { Center, ContactShadows, Environment, Html, OrbitControls, useCursor, useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useState } from 'react'
import { type Group, type Mesh, MeshStandardMaterial, type PerspectiveCamera, Shape, type Texture } from 'three'

import { Wall } from '@/components/Wall'
import { useMobile, usePortrait } from '@/lib/media'
import { buttonClick, powerOff, powerOn } from '@/lib/power'
import { printedMaterial } from '@/lib/print'
import { applyTheme, setTheme, theme as themeOf, themes, useTheme } from '@/lib/theme'

const scene = {
  file: '/models/desk.glb',
  hdr: '/hdr/room.jpg',
  hdrRotation: 0,
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
  debug: false,
  power: {
    button: [0.7465, 0.856, 0.35] as [number, number, number],
    size: [0.099, 0.068] as [number, number],
    led: [0.683, 0.857, 0.35] as [number, number, number],
  },
  buttons: {
    first: [-0.722, 0.852, 0.35] as [number, number, number],
    step: 0.08,
    size: [0.075, 0.03] as [number, number],
    radius: 0.008,
    led: 0.032,
  },
  floor: -2.44,
  camera: { position: [0, 2.3, 5.4] as [number, number, number], fov: 32 },
  portrait: { fov: 46, zoom: 1.15 },
  target: [0, 1.45, 0] as [number, number, number],
  distance: { min: 3.5, max: 5.5 },
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

function roundedRect(width: number, height: number, radius: number) {
  const shape = new Shape()
  const x = -width / 2
  const y = -height / 2
  shape.moveTo(x + radius, y)
  shape.lineTo(x + width - radius, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + radius)
  shape.lineTo(x + width, y + height - radius)
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  shape.lineTo(x + radius, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - radius)
  shape.lineTo(x, y + radius)
  shape.quadraticCurveTo(x, y, x + radius, y)
  return shape
}

function Led({
  position,
  color,
  on,
  powered,
}: {
  position: [number, number, number]
  color: string
  on: boolean
  powered: boolean
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.008, 12, 12]} />
      <meshStandardMaterial
        color={powered ? color : '#141414'}
        emissive={powered ? color : '#000000'}
        emissiveIntensity={on ? 3 : powered ? 0.08 : 0}
        roughness={0.3}
      />
    </mesh>
  )
}

function ThemeButtons({ powered }: { powered: boolean }) {
  const active = useTheme()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  const shape = useMemo(() => roundedRect(scene.buttons.size[0], scene.buttons.size[1], scene.buttons.radius), [])
  const [x, y, z] = scene.buttons.first
  return (
    <group>
      {themes.map((t, i) => (
        <group key={t.key} position={[x + i * scene.buttons.step, y, z]}>
          <mesh
            onClick={(e) => {
              if (!powered) return
              e.stopPropagation()
              buttonClick()
              setTheme(t.key)
            }}
            onPointerOver={() => setHovered(powered)}
            onPointerOut={() => setHovered(false)}
          >
            <shapeGeometry args={[shape]} />
            <meshBasicMaterial color="#ff00ff" transparent opacity={scene.debug ? 0.6 : 0} depthWrite={false} />
          </mesh>
          <Led position={[0, scene.buttons.led, 0]} color={t.fg} on={powered && active === t.key} powered={powered} />
        </group>
      ))}
    </group>
  )
}

function Sharpen({ model }: { model: Group }) {
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    const max = gl.capabilities.getMaxAnisotropy()
    model.traverse((node) => {
      const mesh = node as Mesh
      if (!mesh.isMesh) return
      const material = mesh.material as MeshStandardMaterial
      const map = material.map as Texture | null
      if (map && map.anisotropy < max) {
        map.anisotropy = max
        map.needsUpdate = true
      }
    })
  }, [gl, model])
  return null
}

function PrintedArtwork({ model }: { model: Group }) {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    const restore: (() => void)[] = []
    model.traverse((node) => {
      const mesh = node as Mesh
      if (!mesh.isMesh || !/^(TR[1-9]|pCube[123]|CD)_/.test(mesh.name)) return
      const original = mesh.material
      const materials = Array.isArray(original) ? original : [original]
      const printed = materials.map((material) =>
        material instanceof MeshStandardMaterial ? printedMaterial(material) : material,
      )
      mesh.material = Array.isArray(original) ? printed : printed[0]
      restore.push(() => {
        mesh.material = original
        printed.forEach((material, index) => {
          if (material !== materials[index]) material.dispose()
        })
      })
    })
    invalidate()
    return () => restore.forEach((reset) => reset())
  }, [invalidate, model])
  return null
}

function ScreenGlass({ model }: { model: Group }) {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    let screen: Mesh | undefined
    model.traverse((node) => {
      const mesh = node as Mesh
      if (mesh.isMesh && mesh.name.includes('CRT_Screen')) screen = mesh
    })
    if (!screen) return
    const mesh = screen
    const previous = mesh.material
    mesh.material = new MeshStandardMaterial({ color: '#666666', metalness: 1, roughness: 0.04, envMapIntensity: 3 })
    invalidate()
    return () => {
      mesh.material = previous
    }
  }, [invalidate, model])
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
  const themeKey = useTheme()
  useEffect(() => applyTheme(themeKey), [themeKey])
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

      <ScreenGlass model={model.scene} />
      <PrintedArtwork model={model.scene} />
      <Sharpen model={model.scene} />
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

      <ThemeButtons powered={on} />
      <PowerButton
        on={on}
        toggle={() => {
          if (on) powerOff()
          else powerOn()
          setPower(on ? 'off' : 'on')
        }}
      />

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

      <Environment files={scene.hdr} environmentIntensity={0.35} environmentRotation={[0, scene.hdrRotation, 0]} />
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
      {on && <pointLight position={[0, 1.6, 1.4]} intensity={4} distance={4} color={themeOf(themeKey).fg} />}
      {!mobile && <ContactShadows position-y={scene.floor} scale={5} blur={3} />}
    </Canvas>
  )
}
