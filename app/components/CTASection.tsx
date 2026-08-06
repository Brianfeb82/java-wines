"use client";

import { motion } from "framer-motion";
import { brand } from "../data/products";

const footerLinks = [
  { label: "Wines", href: "#showcase-track" },
  { label: "Story", href: "#story" },
  { label: "Region", href: "#region" },
  { label: "Contact", href: "mailto:estate@java.example" },
];

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Section 5 — CTA / Buy (85%–100% scroll, spec §3).
 */
export default function CTASection() {
  return (
    <section id="visit" className="relative bg-ivory text-espresso">
      <div className="mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.9, ease }}
          className="eyebrow"
        >
          The Current Release
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1.1, delay: 0.1, ease }}
          className="font-display mt-8 max-w-3xl text-5xl font-light leading-tight md:text-7xl"
        >
          Begin your <span className="italic text-burgundy">collection</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          className="mt-8 max-w-md text-sm leading-relaxed text-espresso/70"
        >
          Allocation is limited to six bottles per collector. The {brand.region}{" "}
          release ships each harvest, with the estate’s compliments on first
          orders.
        </motion.p>

        <motion.a
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.9, delay: 0.4, ease }}
          href="mailto:estate@java.example?subject=Allocation%20Request"
          className="group mt-12 inline-flex items-center gap-4 border border-espresso px-12 py-5 text-[0.75rem] uppercase tracking-mega transition-all duration-500 hover:border-gold hover:bg-gold hover:text-midnight"
        >
          Request Allocation
          <span className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">
            →
          </span>
        </motion.a>
      </div>

      {/* Footer */}
      <footer className="border-t border-espresso/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-10 md:flex-row md:px-10">
          <p className="font-display text-lg tracking-mega">{brand.name}</p>

          <nav>
            <ul className="flex items-center gap-8">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[0.65rem] uppercase tracking-luxe text-espresso/60 transition-colors hover:text-burgundy"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-[0.65rem] uppercase tracking-luxe text-espresso/40">
            © {new Date().getFullYear()} {brand.estate} · {brand.region}
          </p>
        </div>
      </footer>
    </section>
  );
}
