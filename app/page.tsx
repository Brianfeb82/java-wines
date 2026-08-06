"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRenderTier, scrollStore } from "./hooks/useScrollProgress";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductShowcase from "./components/ProductShowcase";
import BrandStory from "./components/BrandStory";
import RegionMap from "./components/RegionMap";
import CTASection from "./components/CTASection";
import StaticBottle from "./canvas/StaticBottle";

gsap.registerPlugin(ScrollTrigger);

// R3F is heavy — never SSR it (spec §6)
const BottleScene = dynamic(() => import("./canvas/BottleScene"), {
  ssr: false,
});

export default function Page() {
  const tier = useRenderTier();

  const pageRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    // ── Single source of truth for scroll progress ──
    const st = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        scrollStore.progress = self.progress;
        scrollStore.pastHero = self.progress > 0.2;
      },
    });

    // ── Section 2: showcase beat → product index + backdrop colour ──
    const colors = ["#141311", "#d8cbb2", "#431010"];
    const showcaseST = ScrollTrigger.create({
      trigger: "#showcase-track",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = self.progress;
        scrollStore.showcase = p;
        const idx = Math.min(2, Math.floor(p * 3));
        if (idx !== scrollStore.productIndex) {
          scrollStore.productIndex = idx;
          gsap.to(backdrop, {
            backgroundColor: colors[idx],
            duration: 0.9,
            ease: "power2.out",
            overwrite: true,
          });
        }
      },
    });

    // Backdrop leaves showcase colours once the story beat arrives
    const storyST = ScrollTrigger.create({
      trigger: "#story",
      start: "top 70%",
      end: "bottom top",
      onEnter: () =>
        gsap.to(backdrop, { backgroundColor: "#f5f0e8", duration: 1, overwrite: true }),
      onLeaveBack: () =>
        gsap.to(backdrop, {
          backgroundColor: colors[scrollStore.productIndex],
          duration: 1,
          overwrite: true,
        }),
    });

    return () => {
      st.kill();
      showcaseST.kill();
      storyST.kill();
    };
  }, []);

  return (
    <div ref={pageRef} className="relative">
      {/* Shared colour-shifting backdrop behind everything */}
      <div
        ref={backdropRef}
        className="fixed inset-0 z-0"
        style={{ backgroundColor: "#0a0a0a" }}
        aria-hidden="true"
      />
      <div className="canvas-vignette" aria-hidden="true" />

      {/* Fixed 3D layer */}
      <div className="canvas-layer">
        {tier === "static" ? (
          <StaticBottle />
        ) : (
          <BottleScene lite={tier === "lite"} />
        )}
      </div>

      <Navbar />

      <main className="relative z-20">
        <Hero />
        <ProductShowcase />
        <BrandStory />
        <RegionMap />
        <CTASection />
      </main>
    </div>
  );
}
