"use client";

import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import BottleModel from "./BottleModel";
import WaterSurface from "./WaterSurface";
import { BEATS, beatProgress, scrollStore } from "../hooks/useScrollProgress";

/**
 * Mouse parallax — the whole 3D group eases toward the cursor, making the
 * scene feel alive rather than a fixed video. Rotation only; cheap.
 */
function ParallaxRig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const { x, y } = state.pointer; // normalized -1..1
    const t = 1 - Math.exp(-delta * 3);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, x * 0.18, t);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -y * 0.08, t);
  });
  return <group ref={ref}>{children}</group>;
}

/**
 * Scroll-bound camera rig (spec §4):
 * dolly in z 4.4 → 3.0 across the hero beat while following the bottle
 * as it rises out of the water, hold through the showcase, gently pull
 * back as the bottle exits. Damped so motion stays buttery.
 */
function CameraRig() {
  const { camera } = useThree();
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const p = scrollStore.progress;
    const hero = beatProgress(p, BEATS.hero);
    const story = beatProgress(p, BEATS.story);
    const follow = scrollStore.bottleY * 0.55;

    const targetZ = THREE.MathUtils.lerp(4.4, 3.0, hero) + story * 0.6;
    const targetY = 1.42 - hero * 0.08 + follow;

    const t = 1 - Math.exp(-delta * 5);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, t);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, t);
    lookAt.set(0, 1.3 + follow, 0);
    camera.lookAt(lookAt);
  });

  return null;
}

export default function BottleScene({ lite = false }: { lite?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 1.55, 4.4], fov: 40 }}
      dpr={lite ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <CameraRig />

        {/* Luxury lighting (spec §4): warm key above-left, cool fill below-right */}
        <ambientLight intensity={0.18} />
        <pointLight position={[-3, 5, 2]} color="#ffecd2" intensity={30} />
        <pointLight position={[3, -1, 2]} color="#b0c4de" intensity={8} />
        <spotLight
          position={[0, 6, -4]}
          angle={0.5}
          penumbra={1}
          intensity={20}
          color="#fff5e0"
        />

        <ParallaxRig>
          <BottleModel />
          <WaterSurface lite={lite} />
        </ParallaxRig>

        {/* Studio reflections for the glass */}
        <Environment resolution={256}>
          <group>
            <Lightformer
              form="rect"
              intensity={4}
              position={[-3, 2, 3]}
              scale={[2, 4, 1]}
              color="#fff1d6"
            />
            <Lightformer
              form="rect"
              intensity={2}
              position={[3, 1, 2]}
              scale={[2, 3, 1]}
              color="#dfe8ff"
            />
            <Lightformer
              form="rect"
              intensity={1.5}
              position={[0, 4, -3]}
              scale={[4, 2, 1]}
              color="#ffffff"
            />
          </group>
        </Environment>
      </Suspense>
    </Canvas>
  );
}
