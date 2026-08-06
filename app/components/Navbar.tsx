"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { brand } from "../data/products";

const links = [
  { label: "Wines", href: "#showcase-track" },
  { label: "Story", href: "#story" },
  { label: "Region", href: "#region" },
  { label: "Visit", href: "#visit" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-midnight/70 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#top"
          className="font-display text-xl font-medium tracking-mega text-cream"
        >
          {brand.name}
        </a>

        <ul className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[0.7rem] uppercase tracking-luxe text-cream/70 transition-colors duration-300 hover:text-gold"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#visit"
          className="border border-gold/60 px-5 py-2 text-[0.7rem] uppercase tracking-luxe text-gold transition-all duration-300 hover:bg-gold hover:text-midnight"
        >
          Acquire
        </a>
      </nav>
    </motion.header>
  );
}
