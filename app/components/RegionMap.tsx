"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "2,329", unit: "m", label: "Summit of Bromo" },
  { value: "1,200", unit: "m", label: "Our highest parcel" },
  { value: "12°", unit: "C", label: "Highland nights" },
];

/**
 * Section 4 — Region / Map (70%–85% scroll, spec §3).
 * Stylised Java outline, marker draws itself over Mount Bromo.
 */
export default function RegionMap() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from("[data-map-outline]", {
        opacity: 0,
        scale: 0.96,
        transformOrigin: "center",
        duration: 1.1,
        ease: "power3.out",
      })
        .from("[data-map-marker]", {
          scale: 0,
          transformOrigin: "center",
          duration: 0.5,
          ease: "back.out(2.5)",
        })
        .from(
          "[data-map-pulse]",
          { opacity: 0, duration: 0.3 },
          "<"
        )
        .from(
          "[data-stat]",
          { opacity: 0, y: 30, stagger: 0.12, duration: 0.8, ease: "power3.out" },
          "-=0.2"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="region"
      className="relative bg-midnight py-[16vh] text-cream"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:px-10">
        {/* Left — copy + stats */}
        <div>
          <p className="eyebrow mb-8">Origin</p>
          <h2 className="font-display text-5xl font-light leading-tight md:text-6xl">
            Mount Bromo,
            <br />
            <span className="italic text-gold">East Java</span>
          </h2>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-cream/70">
            On the highlands east of Surabaya, where the island climbs toward
            the Tengger massif, volcanic ash weathers into soil of rare
            generosity. Days are warm, nights fall to twelve degrees — the
            slow, even ripening that great wine asks for.
          </p>

          <dl className="mt-12 grid grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} data-stat>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-number text-3xl italic text-gold md:text-4xl">
                  {stat.value}
                  <span className="ml-1 align-super text-xs not-italic text-cream/60">
                    {stat.unit}
                  </span>
                </dd>
                <dd className="mt-2 text-[0.65rem] uppercase tracking-luxe text-cream/50">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right — stylised map */}
        <div className="relative flex items-center justify-center">
          <svg
            data-map-outline
            viewBox="0 0 400 260"
            className="w-full max-w-lg"
            role="img"
            aria-label="Stylised map of Java with Mount Bromo highlighted"
          >
            {/* Stylised Java silhouette — long island, west at left */}
            <path
              d="M 28 138 C 50 122 78 108 112 100 C 150 90 196 84 240 84 C 280 84 318 92 344 106 C 356 112 362 120 358 128 C 350 140 322 148 288 152 C 244 158 192 160 148 158 C 108 156 66 152 44 146 C 34 143 26 141 28 138 Z"
              fill="none"
              stroke="#c9a84c"
              strokeOpacity="0.4"
              strokeWidth="1.5"
            />
            {/* Internal texture — volcanic ridge down the spine */}
            <path
              d="M 90 128 C 150 118 230 116 320 126 M 130 140 C 190 134 260 132 330 138"
              fill="none"
              stroke="#c9a84c"
              strokeOpacity="0.12"
              strokeWidth="1"
            />
            {/* Bromo marker — far east of the island */}
            <g data-map-marker>
              <circle cx="330" cy="128" r="7" fill="#c9a84c" />
            </g>
            <circle
              data-map-pulse
              cx="330"
              cy="128"
              r="14"
              fill="none"
              stroke="#c9a84c"
              strokeWidth="1"
            >
              <animate
                attributeName="r"
                values="10;22"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.7;0"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <text
              x="330"
              y="112"
              textAnchor="middle"
              fill="#e8dcc8"
              fontSize="11"
              letterSpacing="2"
              style={{ textTransform: "uppercase" }}
            >
              Mt Bromo
            </text>
            <text
              x="96"
              y="176"
              textAnchor="middle"
              fill="#e8dcc8"
              fillOpacity="0.35"
              fontSize="9"
              letterSpacing="3"
              style={{ textTransform: "uppercase" }}
            >
              Java
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
