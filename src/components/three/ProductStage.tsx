"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Loads the texture through Next's image optimizer so it is served same-origin
 * (avoids WebGL cross-origin taint from the placeholder/Sanity CDN).
 */
function optimized(src: string, w = 1200, q = 75) {
  if (src.startsWith("/")) return src;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${q}`;
}

function Garment({ src, tint }: { src: string; tint: string }) {
  const texture = useLoader(THREE.TextureLoader, optimized(src));
  texture.colorSpace = THREE.SRGBColorSpace;
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.pointer.x * 0.5, 0.06);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.4, 0.06);
  });

  return (
    <Float speed={2} rotationIntensity={0.12} floatIntensity={0.5}>
      <group ref={group}>
        {/* the print */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[3, 3.75, 1, 1]} />
          <meshStandardMaterial map={texture} roughness={0.75} metalness={0.05} toneMapped={false} />
        </mesh>
        {/* colored rim / backlight for the active colorway */}
        <mesh position={[0, 0, -0.04]} scale={1.05}>
          <planeGeometry args={[3, 3.75]} />
          <meshBasicMaterial color={tint} />
        </mesh>
      </group>
    </Float>
  );
}

export default function ProductStage({ src, tint }: { src: string; tint: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 42 }} dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 3, 4]} intensity={2.2} color="#ffffff" />
        <pointLight position={[-3, -2, 2]} intensity={10} color="#7b5cff" distance={12} />
        <pointLight position={[3, 2, 2]} intensity={8} color="#d8ff47" distance={12} />
        <Garment src={src} tint={tint} />
      </Suspense>
    </Canvas>
  );
}
