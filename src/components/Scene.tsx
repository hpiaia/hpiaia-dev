import { Center, ContactShadows, Environment, Float, Html, PresentationControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

type Props = {
  children: React.ReactNode;
};

export default function Scene({ children }: Props) {
  const model = useGLTF("/models/tv.glb");

  return (
    <Canvas className="touch-none">
      <color attach="background" args={["#0a0a0a"]} />

      <PresentationControls global polar={[-0.4, 0.4]} azimuth={[-1, 1]}>
        <Float>
          <Center>
            <primitive object={model.scene} scale={10} rotation={[0, Math.PI, 0]}>
              <Html transform scale={0.1} distanceFactor={1} position={[0, 0.27, -36.571]} rotation={[0, Math.PI, 0]}>
                <div className="w-[1610px] h-[1250px] border-none">{children}</div>
              </Html>
            </primitive>
          </Center>
        </Float>
      </PresentationControls>

      <Environment preset="warehouse" />
      <ContactShadows position-y={-3.4} scale={5} blur={3} />
    </Canvas>
  );
}
