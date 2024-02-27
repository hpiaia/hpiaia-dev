"use client";

import { Center, ContactShadows, Environment, Float, Html, PresentationControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function Scene({ children }: React.PropsWithChildren) {
  const model = useGLTF("/models/tv.glb");

  return (
    <Canvas className="touch-none">
      <color attach="background" args={["#0a0a0a"]} />

      <PresentationControls global polar={[-0.2, 0.2]} azimuth={[-0.2, 0.2]}>
        <Float speed={0.1} rotation={[0, 0, 0]}>
          <Center>
            <primitive object={model.scene} scale={10} rotation={[0, Math.PI, 0]}>
              <Html transform scale={0.1} distanceFactor={1} position={[0, 0.271, -36.571]} rotation={[0, Math.PI, 0]}>
                <div className="w-[1610px] h-[1260px] rounded-lg">{children}</div>
              </Html>
            </primitive>
          </Center>
        </Float>
      </PresentationControls>

      <Environment preset="apartment" />
      <ContactShadows position-y={-3.4} scale={5} blur={3} />
    </Canvas>
  );
}
