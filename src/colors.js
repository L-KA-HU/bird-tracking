// src/colors.js
export const PALETTE = [
  [227, 26, 28],   // red
  [31, 120, 180],  // blue
  [51, 160, 44],   // green
  [255, 127, 0],   // orange
  [106, 61, 154],  // purple
  [166, 206, 227], // light blue
  [178, 223, 138], // light green
  [251, 154, 153], // pink
  [253, 191, 111], // apricot
  [202, 178, 214], // lavender
];

// Deterministic color map for a list of species
export function colorMapFor(speciesArray) {
  const sorted = [...speciesArray].sort((a, b) => a.localeCompare(b));
  const map = {};
  sorted.forEach((s, i) => { map[s] = PALETTE[i % PALETTE.length]; });
  return map;
}
