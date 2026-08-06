"use client";

import { useEffect, useState } from "react";
import { products } from "../data/products";
import { scrollStore } from "../hooks/useScrollProgress";

/**
 * Mobile / reduced-motion fallback (spec §6):
 * a high-quality CSS render of the bottle standing in for WebGL.
 * Tracks the active product so colours stay in sync with the page.
 */
export default function StaticBottle() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev === scrollStore.productIndex ? prev : scrollStore.productIndex));
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  const glass = products[index].glassColor;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <svg
        width="220"
        height="440"
        viewBox="0 0 220 440"
        role="img"
        aria-label={`Bottle of ${products[index].name}`}
        style={{ filter: "drop-shadow(0 24px 32px rgba(0,0,0,0.45))" }}
      >
        <defs>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={glass} stopOpacity="0.95" />
            <stop offset="38%" stopColor={glass} stopOpacity="0.75" />
            <stop offset="52%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="66%" stopColor={glass} stopOpacity="0.75" />
            <stop offset="100%" stopColor={glass} stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="foil" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8a6d2f" />
            <stop offset="50%" stopColor="#c9a84c" />
            <stop offset="100%" stopColor="#8a6d2f" />
          </linearGradient>
        </defs>

        {/* Silhouette */}
        <path
          d="M 82 18 L 138 18 L 138 96 C 138 128 168 140 168 196 L 168 408 C 168 424 156 432 110 432 C 64 432 52 424 52 408 L 52 196 C 52 140 82 128 82 96 Z"
          fill="url(#glass)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
        />
        {/* Capsule */}
        <rect x="80" y="8" width="60" height="46" rx="4" fill="url(#foil)" />
        {/* Label */}
        <rect x="60" y="220" width="100" height="120" fill="#f5f0e8" />
        <rect x="66" y="226" width="88" height="108" fill="none" stroke="#c9a84c" strokeWidth="1.5" />
        <text x="110" y="262" textAnchor="middle" fontFamily="Georgia, serif" fontSize="15" fill="#1a1a1a">
          JAVA
        </text>
        <text x="110" y="292" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize="12" fill={products[index].labelAccent}>
          {products[index].name}
        </text>
        <text x="110" y="316" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fill="#6a6258">
          {products[index].vintage} · Mount Bromo
        </text>
      </svg>
    </div>
  );
}
