"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { WATER_LEVEL, scrollStore } from "../hooks/useScrollProgress";

/* ── Water shader ───────────────────────────────────────────────────
   Gentle overlapping swells + concentric ripples radiating from the
   bottle. Ripple amplitude is boosted by bottle speed (rising out of
   the water / plunging back in). */

const WAVE_GLSL = /* glsl */ `
float waveHeight(vec2 p, float t, float boost, float splashT) {
  float h = 0.0;
  h += sin(p.x * 1.4 + t * 0.8) * 0.05;
  h += sin(p.y * 1.9 - t * 0.6) * 0.045;
  h += sin((p.x + p.y) * 1.1 + t * 0.45) * 0.055;
  float d = length(p);
  float ring = sin(d * 9.0 - t * 2.2);
  h += ring * 0.035 * exp(-d * 0.45) * (0.6 + boost);

  // Splash shockwave: an expanding ring that decays over ~2.5s
  if (splashT > 0.0 && splashT < 2.5) {
    float front = splashT * 2.6;                    // ring travels outward
    float band = exp(-pow((d - front) * 4.0, 2.0));  // gaussian pulse
    float decay = exp(-splashT * 2.0);
    h += band * decay * 0.22;
  }
  return h;
}
`;

const VERT = /* glsl */ `
uniform float uTime;
uniform float uBoost;
uniform float uSplashT;
varying vec3 vWorldPos;
varying vec3 vNormal;

${WAVE_GLSL}

void main() {
  vec3 pos = position;
  vec2 p = pos.xz;
  float e = 0.08;
  float h  = waveHeight(p, uTime, uBoost, uSplashT);
  float hx = waveHeight(p + vec2(e, 0.0), uTime, uBoost, uSplashT);
  float hz = waveHeight(p + vec2(0.0, e), uTime, uBoost, uSplashT);
  pos.y += h;
  vNormal = normalize(vec3(-(hx - h) / e, 1.0, -(hz - h) / e));
  vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const FRAG = /* glsl */ `
uniform vec3 uCamPos;
varying vec3 vWorldPos;
varying vec3 vNormal;

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(uCamPos - vWorldPos);
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);

  // Near-black water with a hint of blue-green depth
  vec3 col = mix(vec3(0.012, 0.016, 0.02), vec3(0.05, 0.055, 0.06), N.y * 0.5);

  // Fake occlusion — darker beneath the bottle
  float d = length(vWorldPos.xz);
  col *= mix(0.35, 1.0, smoothstep(0.1, 1.0, d));

  // Gold rim where the surface grazes the eye
  col += vec3(0.79, 0.66, 0.30) * fresnel * 0.35;

  // Specular glints: warm key (above-left) + cool fill (below-right)
  vec3 L1 = normalize(vec3(-0.45, 0.8, 0.4));
  vec3 H1 = normalize(L1 + V);
  col += vec3(1.0, 0.93, 0.8) * pow(max(dot(N, H1), 0.0), 90.0) * 0.9;

  vec3 L2 = normalize(vec3(0.6, 0.35, 0.5));
  vec3 H2 = normalize(L2 + V);
  col += vec3(0.65, 0.75, 0.9) * pow(max(dot(N, H2), 0.0), 60.0) * 0.25;

  float alpha = (1.0 - smoothstep(4.5, 8.0, d)) * 0.96;
  gl_FragColor = vec4(col, alpha);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export default function WaterSurface({ lite = false }: { lite?: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const prevBottleY = useRef(0);
  const boost = useRef(0);
  const splashStart = useRef(-1);

  const geometry = useMemo(() => {
    const segments = lite ? 96 : 160;
    const g = new THREE.PlaneGeometry(16, 16, segments, segments);
    g.rotateX(-Math.PI / 2);
    return g;
  }, [lite]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBoost: { value: 0 },
      uSplashT: { value: -1 },
      uCamPos: { value: new THREE.Vector3() },
    }),
    []
  );

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  useFrame((state, delta) => {
    const m = matRef.current;
    if (!m) return;

    m.uniforms.uTime.value = state.clock.elapsedTime;
    state.camera.getWorldPosition(m.uniforms.uCamPos.value);

    // Ripple boost follows bottle speed, with smooth decay
    const y = scrollStore.bottleY;
    const speed = Math.abs(y - prevBottleY.current) / Math.max(delta, 1e-4);
    prevBottleY.current = y;
    const target = Math.min(speed * 0.9, 1.6);
    boost.current += (target - boost.current) * Math.min(1, delta * 3);
    m.uniforms.uBoost.value = boost.current;

    // Splash shockwave: fires once ~0.35s after mount (matches droplets)
    if (splashStart.current < 0) splashStart.current = state.clock.elapsedTime + 0.35;
    m.uniforms.uSplashT.value = state.clock.elapsedTime - splashStart.current;
  });

  return (
    <mesh
      geometry={geometry}
      position={[0, WATER_LEVEL, 0]}
      frustumCulled={false}
    >
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
