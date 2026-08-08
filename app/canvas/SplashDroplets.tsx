"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { WATER_LEVEL, scrollStore } from "../hooks/useScrollProgress";

/**
 * Intro splash: a burst of droplets + a soft foam ring that fires when the
 * bottle breaches the surface on load, then fades. Cheap instanced points —
 * pure GPU, no per-frame React work.
 */
const COUNT = 240;
const LIFE = 1.6; // seconds

export default function SplashDroplets() {
  const points = useRef<THREE.Points>(null);
  const start = useRef(-1);
  const fired = useRef(false);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.18 + Math.random() * 0.22;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = WATER_LEVEL;
      positions[i * 3 + 2] = Math.sin(a) * r;
      // outward + upward spray, biased up
      const up = 1.6 + Math.random() * 2.6;
      const out = 0.4 + Math.random() * 1.2;
      velocities[i * 3] = Math.cos(a) * out;
      velocities[i * 3 + 1] = up;
      velocities[i * 3 + 2] = Math.sin(a) * out;
    }
    return { positions, velocities };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions.slice(), 3));
    return g;
  }, [positions]);

  useFrame((state, delta) => {
    const pts = points.current;
    if (!pts) return;

    // Fire once, shortly after mount, when the hero is at rest
    if (!fired.current) {
      fired.current = true;
      start.current = state.clock.elapsedTime + 0.35;
    }
    const t = state.clock.elapsedTime - start.current;
    if (t < 0) {
      pts.visible = false;
      return;
    }
    if (t > LIFE) {
      pts.visible = false;
      return;
    }
    pts.visible = true;

    const k = t;
    const g = -4.2; // gravity
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      const vx = velocities[i * 3];
      const vy = velocities[i * 3 + 1];
      const vz = velocities[i * 3 + 2];
      pos.array[i * 3] = positions[i * 3] + vx * k;
      pos.array[i * 3 + 1] = WATER_LEVEL + vy * k + 0.5 * g * k * k;
      pos.array[i * 3 + 2] = positions[i * 3 + 2] + vz * k;
    }
    pos.needsUpdate = true;

    // Fade out over lifetime
    const mat = pts.material as THREE.PointsMaterial;
    mat.opacity = Math.max(0, 1 - t / LIFE);
  });

  return (
    <points ref={points} geometry={geo} visible={false}>
      <pointsMaterial
        color="#dfe8f0"
        size={0.045}
        transparent
        opacity={1}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
