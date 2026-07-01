"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

/** Central distorted object that drifts toward the pointer. */
function Blob() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.rotation.x = t * 0.1;
    m.rotation.y = t * 0.14;
    m.position.x = THREE.MathUtils.lerp(m.position.x, state.pointer.x * 0.6, 0.04);
    m.position.y = THREE.MathUtils.lerp(m.position.y, state.pointer.y * 0.5, 0.04);
  });
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.1}>
      <mesh ref={ref} scale={2.15}>
        <icosahedronGeometry args={[1, 24]} />
        <MeshDistortMaterial
          color="#7b5cff"
          emissive="#d8ff47"
          emissiveIntensity={0.06}
          roughness={0.35}
          metalness={0.35}
          distort={0.42}
          speed={2.2}
        />
      </mesh>
    </Float>
  );
}

function Starfield({ count = 700 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);
  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.02;
  });
  return (
    <Points ref={ref} positions={positions} stride={3}>
      {/* ink-toned dust so it reads against the light backdrop */}
      <PointMaterial
        transparent
        color="#5b4bd6"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.35}
      />
    </Points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 4]} intensity={2.4} color="#d8ff47" />
        <directionalLight position={[-4, -2, -2]} intensity={1.6} color="#7b5cff" />
        <pointLight position={[0, 0, 3]} intensity={12} color="#ffffff" distance={10} />
        <Blob />
        <Starfield />
      </Suspense>
    </Canvas>
  );
}
