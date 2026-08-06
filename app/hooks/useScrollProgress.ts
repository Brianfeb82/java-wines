"use client";

import { useEffect, useState } from "react";

/**
 * Scroll beat map (spec §3) — overall page scroll is divided into beats:
 * Hero 0–20% · Showcase 20–50% · Story 50–70% · Map 70–85% · CTA 85–100%
 */
export const BEATS = {
  hero: [0, 0.2],
  showcase: [0.2, 0.5],
  story: [0.5, 0.7],
  map: [0.7, 0.85],
  cta: [0.85, 1],
} as const;

export type Beat = keyof typeof BEATS;

/** Normalized 0→1 progress of `p` within a beat. */
export function beatProgress(p: number, beat: readonly [number, number]): number {
  const [start, end] = beat;
  return Math.min(1, Math.max(0, (p - start) / (end - start)));
}

/** Height of the water surface in the 3D scene (world units). */
export const WATER_LEVEL = 0.42;

/**
 * Mutable, render-free scroll store. Written by a single ScrollTrigger in
 * page.tsx, read inside useFrame / GSAP callbacks — no React re-renders.
 */
export const scrollStore = {
  /** Overall page progress 0 → 1 */
  progress: 0,
  /** Active product index 0..2 (driven by showcase scroll) */
  productIndex: 0,
  /** Progress within the showcase beat 0 → 1 */
  showcase: 0,
  /** True once the user has scrolled past the hero beat */
  pastHero: false,
  /** Bottle origin world Y — written by BottleModel each frame, read by
   *  WaterSurface (ripple boost) and CameraRig (rise follow). */
  bottleY: 0,
};

export type RenderTier = "full" | "lite" | "static";

/**
 * Decides how the bottle renders. Capability-based, not device-based:
 * any browser with WebGL gets the real 3D scene — narrow screens get a
 * lighter tier (lower DPR, coarser water mesh); reduced-motion users
 * and WebGL-less browsers get the static SVG fallback.
 *
 * `?force3d` in the URL bypasses the motion/size gates — WebGL is still
 * required, otherwise the canvas would fail hard.
 */
export function useRenderTier(): RenderTier {
  const [tier, setTier] = useState<RenderTier>("full");

  useEffect(() => {
    const hasWebGL = (() => {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    })();

    // Static fallback ONLY when WebGL truly isn't available. Reduced-motion
    // users still get the scene — GSAP/Framer already respect their setting —
    // so the site no longer silently swaps to the flat SVG on machines that
    // report reduced motion (which was forcing the fallback even on desktop).
    if (!hasWebGL) {
      setTier("static");
      return;
    }

    setTier(window.matchMedia("(max-width: 767px)").matches ? "lite" : "full");
  }, []);

  return tier;
}
