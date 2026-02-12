type UnitGroup = 'mass' | 'volume' | 'countable';

interface UnitDef {
  group: UnitGroup;
  toBase: number;
}

const UNIT_MAP: Record<string, UnitDef> = {
  grams: { group: 'mass', toBase: 1 },
  g: { group: 'mass', toBase: 1 },
  kg: { group: 'mass', toBase: 1000 },
  ml: { group: 'volume', toBase: 1 },
  liters: { group: 'volume', toBase: 1000 },
  l: { group: 'volume', toBase: 1000 },
  cups: { group: 'volume', toBase: 236.6 },
  tbsp: { group: 'volume', toBase: 14.8 },
  tsp: { group: 'volume', toBase: 4.9 },
  pcs: { group: 'countable', toBase: 1 },
};

const DISPLAY_RULES: { fromUnit: string; toUnit: string; threshold: number }[] = [
  { fromUnit: 'grams', toUnit: 'kg', threshold: 1000 },
  { fromUnit: 'ml', toUnit: 'liters', threshold: 1000 },
];

const CANONICAL: Record<string, string> = {
  grams: 'grams', g: 'grams', kg: 'kg',
  ml: 'ml', liters: 'liters', l: 'liters',
  cups: 'cups', tbsp: 'tbsp', tsp: 'tsp', pcs: 'pcs',
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function formatForDisplay(
  qty: number,
  unit: string,
): { quantity: number; unit: string } {
  const def = UNIT_MAP[unit.toLowerCase()];
  if (!def) return { quantity: round2(qty), unit };

  const canonicalUnit = CANONICAL[unit.toLowerCase()] ?? unit;

  for (const rule of DISPLAY_RULES) {
    if (canonicalUnit === rule.fromUnit && qty >= rule.threshold) {
      const toDef = UNIT_MAP[rule.toUnit]!;
      const converted = qty / (toDef.toBase / def.toBase);
      return { quantity: round2(converted), unit: rule.toUnit };
    }
  }

  return { quantity: round2(qty), unit: canonicalUnit };
}
