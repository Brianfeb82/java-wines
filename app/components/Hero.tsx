"use client";

import { motion } from "framer-motion";
import { brand } from "../data/products";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden"
    >
      {/* Kicker */}
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease }}
        className="eyebrow mb-8"
      >
        {brand.estate} · {brand.region} · {brand.country}
      </motion.p>

      {/* Display headline — large serif, wide tracking */}
      <h1 className="sr-only">{brand.name} — {brand.tagline}</h1>
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.7, ease }}
        className="pointer-events-none select-none text-center"
      >
        <span className="font-display block text-[clamp(4.5rem,14vw,11rem)] font-light leading-none tracking-mega text-cream">
          JAVA
        </span>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.1, ease }}
        className="font-display mt-6 text-xl italic text-cream/70 md:text-2xl"
      >
        {brand.tagline}
      </motion.p>

      {/* Gold rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 1.3, ease }}
        className="mt-10 h-px w-24 origin-center bg-gold"
      />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
        className="absolute bottom-10 flex flex-col items-center gap-3"
      >
        <span className="text-[0.65rem] uppercase tracking-mega text-cream/50">
          Scroll to explore
        </span>
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-cream/25 p-1.5">
          <div className="scroll-hint-dot h-1.5 w-1.5 rounded-full bg-gold" />
        </div>
      </motion.div>
    </section>
  );
}
