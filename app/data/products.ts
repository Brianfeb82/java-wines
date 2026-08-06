export interface Product {
  id: string;
  number: string;
  name: string;
  type: string;
  vintage: string;
  grape: string;
  notes: string[];
  /** Glass tint of the procedural bottle */
  glassColor: string;
  /** Accent used on the label + UI */
  labelAccent: string;
  /** Section backdrop while this product is active */
  backdrop: string;
  /** True when cream/dark text should be used on the backdrop */
  darkText: boolean;
}

export const products: Product[] = [
  {
    id: "gruner-veltliner",
    number: "01",
    name: "Grüner Veltliner",
    type: "White Wine",
    vintage: "2023",
    grape: "Grüner Veltliner",
    notes: [
      "White pepper, green apple, lime zest",
      "Crisp acidity with a mineral spine",
      "A long, saline finish",
    ],
    glassColor: "#6b7a2a",
    labelAccent: "#8a9a3a",
    backdrop: "#141311",
    darkText: false,
  },
  {
    id: "cuvee-blanc",
    number: "02",
    name: "Cuvée Blanc",
    type: "White Blend",
    vintage: "2022",
    grape: "Welschriesling · Chardonnay",
    notes: [
      "Ripe pear, acacia honey, chamomile",
      "Silken texture over wet stone",
      "Quiet power, impeccably balanced",
    ],
    glassColor: "#8a5f2a",
    labelAccent: "#6b4a20",
    backdrop: "#d8cbb2",
    darkText: true,
  },
  {
    id: "cuvee-noir",
    number: "03",
    name: "Cuvée Noir",
    type: "Red Blend · Reserve",
    vintage: "2021",
    grape: "Blaufränkisch · Zweigelt",
    notes: [
      "Black cherry, dark plum, dried herbs",
      "Cedar, tobacco leaf and clove",
      "Velvet tannins, an endless finish",
    ],
    glassColor: "#3d1216",
    labelAccent: "#5c1a1a",
    backdrop: "#431010",
    darkText: false,
  },
];

export const brand = {
  name: "JAVA",
  estate: "Java Estate",
  tagline: "Born of volcanic soil",
  region: "Mount Bromo Highlands",
  country: "East Java, Indonesia",
};
