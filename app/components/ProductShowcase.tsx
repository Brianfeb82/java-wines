"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "../data/products";
import { scrollStore } from "../hooks/useScrollProgress";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section 2 — Product Showcase (20%–50% scroll, spec §3).
 * A 320vh track: each product owns ~100vh. The 3D bottle stays fixed
 * centre stage; text panels crossfade as the backdrop colour shifts.
 */
export default function ProductShowcase() {
  const trackRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      products.forEach((_, i) => {
        const panel = panelRefs.current[i];
        if (!panel) return;

        const lines = panel.querySelectorAll("[data-line]");

        gsap.set(panel, { autoAlpha: i === 0 ? 1 : 0 });
        gsap.set(lines, { y: 36, opacity: 0 });

        ScrollTrigger.create({
          trigger: trackRef.current,
          start: () => `${(i / products.length) * 100}% top`,
          end: () => `${((i + 1) / products.length) * 100}% top`,
          onEnter: () => showPanel(i),
          onEnterBack: () => showPanel(i),
        });
      });

      function showPanel(active: number) {
        products.forEach((_, i) => {
          const panel = panelRefs.current[i];
          if (!panel) return;
          const lines = panel.querySelectorAll("[data-line]");

          if (i === active) {
            gsap.to(panel, { autoAlpha: 1, duration: 0.5, overwrite: true });
            gsap.to(lines, {
              y: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.09,
              ease: "power3.out",
              overwrite: true,
            });
          } else {
            gsap.to(panel, { autoAlpha: 0, duration: 0.35, overwrite: true });
            gsap.set(lines, { y: 36, opacity: 0 });
          }
        });
      }

      // First panel enters with the section itself
      gsap.to(panelRefs.current[0]?.querySelectorAll("[data-line]") ?? [], {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.09,
        ease: "power3.out",
        scrollTrigger: {
          trigger: trackRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });

      // Panels are position:fixed — hide them once the track is fully
      // scrolled past, or the last one keeps overlaying later sections.
      ScrollTrigger.create({
        trigger: trackRef.current,
        start: "top top",
        end: "bottom top",
        onLeave: () => {
          panelRefs.current.forEach((panel) => {
            if (panel)
              gsap.to(panel, { autoAlpha: 0, duration: 0.4, overwrite: true });
          });
        },
        onEnterBack: () => showPanel(scrollStore.productIndex),
      });
    }, trackRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={trackRef} id="showcase-track" className="relative h-[320vh]">
      {products.map((product, i) => (
        <div
          key={product.id}
          ref={(el) => {
            panelRefs.current[i] = el;
          }}
          className={`fixed inset-0 z-20 flex items-center ${
            product.darkText ? "text-espresso" : "text-cream"
          }`}
          style={{ visibility: i === 0 ? "visible" : "hidden" }}
        >
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 md:px-10">
            {/* Left — number, name, type, vintage */}
            <div className="order-2 text-center md:order-1 md:text-left">
              <span
                data-line
                className="font-number block text-6xl italic text-gold md:text-7xl"
              >
                {product.number}
              </span>
              <h2
                data-line
                className="font-display mt-4 text-5xl font-light leading-tight md:text-6xl"
              >
                {product.name}
              </h2>
              <p
                data-line
                className="mt-4 text-[0.7rem] uppercase tracking-mega opacity-70"
              >
                {product.type} — Vintage {product.vintage}
              </p>
              <p data-line className="mt-2 text-sm italic opacity-60">
                {product.grape}
              </p>
            </div>

            {/* Right — tasting notes revealed line by line */}
            <div className="order-1 md:order-2 md:pl-16">
              <p data-line className="eyebrow mb-6">
                Tasting Notes
              </p>
              <ul className="space-y-5">
                {product.notes.map((note) => (
                  <li
                    key={note}
                    data-line
                    className="font-display border-l border-gold/50 pl-5 text-xl italic leading-snug md:text-2xl"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
