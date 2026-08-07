"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const plates = [
  {
    caption: "The Slopes",
    title: "Vines in volcanic ash",
    src: "/images/story-slopes.jpg",
    alt: "Misty mountain ridges at dawn on the slopes of Mount Bromo",
  },
  {
    caption: "The Caldera",
    title: "Mist over the Sea of Sand",
    src: "/images/story-caldera.jpg",
    alt: "Fog rolling over the volcanic hills of the Tengger caldera",
  },
  {
    caption: "The Ember",
    title: "First light over Bromo",
    src: "/images/story-ember.jpg",
    alt: "Golden first light breaking over the Bromo peak",
  },
];

/**
 * Section 3 — Brand Story (50%–70% scroll, spec §3).
 * Parallax editorial plates on the right, slow-moving blockquote left.
 */
export default function BrandStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || "0.15");
        gsap.fromTo(
          el,
          { y: 80 * (1 + speed * 4) },
          {
            y: -80 * (1 + speed * 4),
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      gsap.from("[data-quote]", {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-quote]",
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative overflow-hidden py-[18vh] text-espresso"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-2 md:px-10">
        {/* Left — slow blockquote */}
        <div data-parallax="0.05" className="relative z-10">
          <p className="eyebrow mb-8">The House</p>
          <blockquote
            data-quote
            className="font-display text-4xl font-light leading-snug md:text-5xl"
          >
            “From volcanic ash, we grow{" "}
            <em className="text-burgundy">patience</em> — vines that drink the
            mountain and answer with light.”
          </blockquote>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-espresso/70">
            At 1,200 metres on the slopes of Mount Bromo, cool highland nights
            and mineral-rich volcanic soil slow the ripening of every grape.
            We farm a handful of parcels by hand and intervene as little as
            the vintage allows. What the glass holds is the mountain,
            remembered.
          </p>
          <p className="font-number mt-10 text-lg italic text-espresso/60">
            — Java Estate, East Java
          </p>
        </div>

        {/* Right — parallax editorial plates */}
        <div className="relative grid gap-10">
          {plates.map((plate, i) => (
            <figure
              key={plate.caption}
              data-parallax={(0.12 + i * 0.07).toFixed(2)}
              className={`relative ${i % 2 === 1 ? "md:ml-16" : "md:mr-16"}`}
            >
              <div className="relative h-72 w-full overflow-hidden md:h-80">
                <Image
                  src={plate.src}
                  alt={plate.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                {/* Dark luxe overlay so captions stay readable */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(10,10,10,0.05) 40%, rgba(10,10,10,0.72) 100%)",
                  }}
                />
                <figcaption className="absolute bottom-0 left-0 p-6">
                  <p className="text-[0.65rem] uppercase tracking-mega text-white/70">
                    {plate.caption}
                  </p>
                  <p className="font-display mt-1 text-2xl italic text-white">
                    {plate.title}
                  </p>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
