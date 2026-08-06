"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { BEATS, WATER_LEVEL, beatProgress, scrollStore } from "../hooks/useScrollProgress";
import { products } from "../data/products";

/* ── Procedural Bordeaux bottle ─────────────────────────────────────
   A lathe profile: base → body → eased shoulder → neck → lip.
   Units are roughly decimetres; the bottle stands ~2.75 tall. */

function buildProfile(): THREE.Vector2[] {
  const pts: THREE.Vector2[] = [];
  const P = (r: number, y: number) => pts.push(new THREE.Vector2(r, y));

  P(0.001, 0); // base center
  P(0.3, 0.0);
  P(0.44, 0.03);
  P(0.465, 0.12);
  P(0.47, 0.3);
  P(0.47, 1.5); // cylindrical body

  // Shoulder — smoothstep from body radius to neck radius
  const steps = 16;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const eased = t * t * (3 - 2 * t);
    P(0.47 - (0.47 - 0.135) * eased, 1.5 + 0.65 * t);
  }

  P(0.135, 2.55); // neck
  P(0.148, 2.62); // lip flare
  P(0.148, 2.72);
  P(0.132, 2.75); // lip top
  P(0.001, 2.75); // close under the capsule

  return pts;
}

/* ── Label texture painted on a canvas ────────────────────────────── */

function makeLabelTexture(productIndex: number): THREE.CanvasTexture {
  const product = products[productIndex];
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Ivory paper stock
  ctx.fillStyle = "#f5f0e8";
  ctx.fillRect(0, 0, 1024, 512);

  // Subtle paper tooth
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(60, 50, 30, ${Math.random() * 0.035})`;
    ctx.fillRect(Math.random() * 1024, Math.random() * 512, 1.6, 1.6);
  }

  // Gold double keyline
  ctx.strokeStyle = "#c9a84c";
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, 968, 456);
  ctx.lineWidth = 1;
  ctx.strokeRect(42, 42, 940, 428);

  ctx.textAlign = "center";

  // House
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "300 46px Georgia, serif";
  ctx.fillText("J  A  V  A", 512, 118);
  ctx.font = "400 17px Georgia, serif";
  ctx.fillStyle = "#6a6258";
  ctx.fillText("E S T A T E", 512, 152);

  // Rule
  ctx.strokeStyle = "#c9a84c";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(362, 182);
  ctx.lineTo(662, 182);
  ctx.stroke();

  // Wine
  ctx.font = "italic 500 64px Georgia, serif";
  ctx.fillStyle = product.labelAccent;
  ctx.fillText(product.name, 512, 262);

  ctx.font = "400 25px Georgia, serif";
  ctx.fillStyle = "#3c3833";
  ctx.fillText(`${product.type}  ·  ${product.vintage}`, 512, 318);

  ctx.font = "400 19px Georgia, serif";
  ctx.fillStyle = "#6a6258";
  ctx.fillText(product.grape, 512, 360);
  ctx.fillText("M O U N T   B R O M O   ·   E A S T   J A V A", 512, 428);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.wrapS = THREE.RepeatWrapping;
  return tex;
}

/* ── Component ─────────────────────────────────────────────────────── */

export default function BottleModel() {
  const group = useRef<THREE.Group>(null);
  const glassMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const labelMat = useRef<THREE.MeshStandardMaterial>(null);
  const foilMat = useRef<THREE.MeshStandardMaterial>(null);

  const idleSpin = useRef(0);
  const activeIndex = useRef(0);
  const targetColor = useMemo(() => new THREE.Color(products[0].glassColor), []);

  const geometry = useMemo(() => new THREE.LatheGeometry(buildProfile(), 96), []);
  const labelTextures = useMemo(
    () => products.map((_, i) => makeLabelTexture(i)),
    []
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      labelTextures.forEach((t) => t.dispose());
    };
  }, [geometry, labelTextures]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    const t = state.clock.elapsedTime;
    const p = scrollStore.progress;
    const hero = beatProgress(p, BEATS.hero);
    const showcase = beatProgress(p, BEATS.showcase);

    // Rotation: continuous slow idle spin + one full scroll-driven turn.
    // Both terms accumulate monotonically, so motion never jumps.
    idleSpin.current += delta * 0.22;
    const scrollTurns = Math.min(showcase, 1) * Math.PI * 2;
    g.rotation.y = idleSpin.current + scrollTurns;

    // Gentle floating tilt, as if the bottle rests on water
    g.rotation.z = Math.sin(t * 0.7) * 0.025;
    g.rotation.x = Math.cos(t * 0.6) * 0.02;

    // Hero: bottle scales up slightly as camera dollies in
    const s = 1 + hero * 0.15;
    g.scale.setScalar(s);

    // ── Water choreography ──
    // Idle bob around the waterline, rise out of the water through the
    // hero beat, then plunge back through the surface when the story
    // beat takes over.
    const bob = Math.sin(t * 0.9) * 0.05;
    const rise = hero * 1.3;
    const exit = beatProgress(p, [0.5, 0.62]);
    g.position.y = bob + rise - exit * exit * 4.6;

    // Publish for WaterSurface (ripple boost) and CameraRig (follow)
    scrollStore.bottleY = g.position.y + WATER_LEVEL;

    // Product glass tint — eased colour transition
    const idx = scrollStore.productIndex;
    if (idx !== activeIndex.current) {
      activeIndex.current = idx;
      if (labelMat.current) {
        labelMat.current.map = labelTextures[idx];
        labelMat.current.needsUpdate = true;
      }
    }
    targetColor.set(products[idx].glassColor);
    if (glassMat.current) {
      glassMat.current.color.lerp(targetColor, 1 - Math.exp(-delta * 4));
    }
  });

  return (
    <group ref={group}>
      {/* Glass body */}
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          ref={glassMat}
          color={products[0].glassColor}
          transmission={0.92}
          thickness={0.6}
          roughness={0.08}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.08}
          attenuationColor="#ffffff"
          attenuationDistance={2.5}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* Paper label — faces +z at rest, wraps the body */}
      <mesh position={[0, 0.82, 0]} rotation={[0, Math.PI, 0]}>
        <cylinderGeometry args={[0.474, 0.474, 0.92, 64, 1, true]} />
        <meshStandardMaterial
          ref={labelMat}
          map={labelTextures[0]}
          roughness={0.85}
          metalness={0}
        />
      </mesh>

      {/* Neck capsule / foil */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.142, 0.15, 0.6, 48]} />
        <meshStandardMaterial
          ref={foilMat}
          color="#8a6d2f"
          metalness={0.95}
          roughness={0.28}
        />
      </mesh>
      {/* Capsule top */}
      <mesh position={[0, 2.8, 0]}>
        <cylinderGeometry args={[0.142, 0.142, 0.02, 48]} />
        <meshStandardMaterial color="#c9a84c" metalness={1} roughness={0.22} />
      </mesh>
      {/* Wax-drip ring under the lip */}
      <mesh position={[0, 2.2, 0]}>
        <torusGeometry args={[0.148, 0.012, 16, 48]} />
        <meshStandardMaterial color="#8a6d2f" metalness={0.9} roughness={0.35} />
      </mesh>
    </group>
  );
}
