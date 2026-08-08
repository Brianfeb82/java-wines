# JAVA — Hackathon Submission Kit

Everything you need to submit. Live site: **https://java-wines.vercel.app**

---

## 1. Project description (paste into Devpost "About" / description)

> ### JAVA — Born of Volcanic Soil
>
> A cinematic, scroll-driven 3D product showcase for a fictional winery on the slopes of **Mount Bromo, East Java, Indonesia**. A procedurally-built glass wine bottle floats in dark, rippling water — and as you scroll, it rises out of the surface while the camera follows, the lighting shifts, and the story of the estate unfolds around it.
>
> **Inspiration.** I wanted to take the "luxury product site" pattern and push it somewhere more personal — rooting it in Indonesia. Volcanic soil is one of the world's most prized winemaking terroirs (think Etna and Santorini), so a fictional highland estate on Bromo felt both beautiful and strangely believable. The whole piece is built around one idea: *the bottle is born from the water, and the scroll is the act of drawing it out.*
>
> **What makes it immersive.**
> - On load, the bottle breaches the surface with a **droplet splash and an expanding shockwave ring** in the water.
> - The water is a **custom GLSL shader** — vertex-displaced waves with ripple pulses that *react to the bottle's speed*, plus a splash shockwave.
> - The **camera is bound to scroll** with damped easing; the whole scene also **tilts toward your cursor** (mouse parallax).
> - Three products, each with its own **glass tint, label texture (painted at runtime on a canvas), and backdrop color** — the entire mood shifts per wine.
> - A scroll-choreographed brand story, a stylised **Java island map** with the Bromo marker, and a film-grain editorial finish.
> - **Capability-based rendering:** any WebGL browser gets the full 3D scene; lower-power phones get a lighter tier; browsers without WebGL get a static SVG fallback.
>
> **Built with** Next.js 15 (App Router), React 19, React Three Fiber + drei, Three.js (custom GLSL), GSAP + ScrollTrigger, Framer Motion, Tailwind CSS v4, TypeScript. Deployed on Vercel.
>
> JAVA is a fictional brand created for this hackathon — a design and creative-coding showpiece.

---

## 2. Technologies / tools (Devpost "Built with" tags)

`Next.js` · `React Three Fiber` · `Three.js` · `GLSL` · `GSAP` · `Framer Motion` · `Tailwind CSS` · `TypeScript` · `Vercel`

---

## 3. Screenshots (need 3+ — capture on YOUR machine)

Open **https://java-wines.vercel.app** in a full-window browser (hide bookmarks bar, `F11` for fullscreen). Take these:

1. **Hero** — bottle floating in water right after the splash (the money shot).
2. **Mid-scroll** — bottle risen, one of the product panels (e.g. Cuvée Noir) visible beside it.
3. **Brand story** — the parallax photo plates + the big quote.
4. **Java map** — the island outline with the glowing Bromo marker.

Save as `docs/screenshot-hero.png`, `docs/screenshot-product.png`, `docs/screenshot-story.png`, `docs/screenshot-map.png` — then I can wire them into the README automatically.

> Tip: Windows `Win+Shift+S` or the browser's built-in full-page capture.

---

## 4. Demo video (optional but strongly recommended, 1–5 min)

A simple screen recording of the full scroll journey is your single best selling tool.

**Easiest:** Windows built-in recorder — `Win+G` (Xbox Game Bar) → record, or `Win+Alt+R`. Or free: **OBS Studio**.

**Suggested 60–90s script (narrate or add text overlays):**
1. *(0:00)* Load the page — let the splash play. *"JAVA — a fictional winery on the slopes of Mount Bromo."*
2. *(0:10)* Move the mouse — show the parallax. *"The whole scene reacts to the cursor."*
3. *(0:20)* Scroll slowly — bottle rises out of the water. *"The bottle is born from the water — the scroll draws it out."*
4. *(0:40)* Through the 3 products — show glass tint + backdrop shifting. *"Three wines, each with its own glass, label, and mood."*
5. *(1:00)* Brand story + Java map. *"A story rooted in volcanic soil."*
6. *(1:15)* End on the footer/CTA. *"Built with Next.js, React Three Fiber, and a custom GLSL water shader."*

Keep it smooth — slow, deliberate scrolls read as more premium than fast ones.

---

## 5. Links

- **Live site:** https://java-wines.vercel.app
- **Source code:** https://github.com/Brianfeb82/java-wines
