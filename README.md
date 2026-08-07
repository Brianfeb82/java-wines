# JAVA — Born of Volcanic Soil 

A cinematic, scroll-driven 3D product showcase for a fictional winery on the slopes of Mount Bromo, East Java, Indonesia — where volcanic soil meets the art of the vine.

**Live:** https://java-wines.vercel.app · **Source:** https://github.com/Brianfeb82/java-wines

---

##  Preview

> Best experienced live — scroll-driven 3D doesn't screenshot well.
> **→ https://java-wines.vercel.app**

<!--
  Optional: drop a hero screenshot at docs/screenshot-hero.png and uncomment:
  ![JAVA — Born of Volcanic Soil](docs/screenshot-hero.png)
-->

---

## The Experience

- **Procedural 3D Bordeaux bottle** — built with `LatheGeometry`, rendered in a physical glass transmission material, with canvas-painted labels that repaint per product.
- **Custom GLSL water shader** — a scroll-reactive water surface; the bottle rises out of the water as you scroll, with ripples that respond to scroll velocity.
- **Scroll-bound damped camera rig** — buttery camera motion tied directly to scroll progress.
- **Three products, three moods** — per-product glass tints and backdrop color shifts as you move between wines.
- **GSAP parallax brand-story plates** — layered storytelling driven by ScrollTrigger.
- **Stylised Java island SVG map** — situating the fictional winery in East Java.
- **Film grain overlay** — a cinematic finish across the whole experience.
- **Capability-based render tiers** — full 3D on capable devices, a lite experience on mobile, and a static SVG fallback when WebGL is unavailable.

---

##  Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) |
| 3D / WebGL | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei), [Three.js](https://threejs.org/) with a custom GLSL water shader |
| Animation | [GSAP](https://gsap.com/) + ScrollTrigger, [Framer Motion](https://www.framer.com/motion/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Deployment | [Vercel](https://vercel.com/) |

---

##  Run Locally

```bash
git clone https://github.com/Brianfeb82/java-wines.git
cd java-wines
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

> **Note:** 3D is now the default for any WebGL-capable browser — the old `?force3d` query param is no longer needed. Devices without WebGL automatically receive the static SVG fallback.

---

##  Project Structure

```
app/
├── canvas/        # R3F scene: bottle model, water shader, static fallback
├── components/    # Hero, product showcase, brand story, region map, nav, CTA
├── data/          # Product definitions (names, tints, label artwork)
└── hooks/         # Scroll progress + capability detection
```

---

##  Author

**Nedri Febrianto** — [github.com/Brianfeb82](https://github.com/Brianfeb82)

---

*JAVA is a fictional brand created for portfolio and design-exploration purposes. No actual wine was harmed (or produced) in the making of this site.* 
