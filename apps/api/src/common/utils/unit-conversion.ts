type UnitGroup = 'mass' | 'volume' | 'countable';

interface UnitDef {
  group: UnitGroup;
  toBase: number; // multiplier to convert to the base unit of the group
}

// Base units: grams (mass), ml (volume), pcs (countable)
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

function lookupUnit(unit: string): UnitDef | null {
  return UNIT_MAP[unit.toLowerCase()] ?? null;
}

export function getUnitGroup(unit: string): UnitGroup | null {
  return lookupUnit(unit)?.group ?? null;
}

export function areUnitsCompatible(unitA: string, unitB: string): boolean {
  const groupA = getUnitGroup(unitA);
  const groupB = getUnitGroup(unitB);
  if (!groupA || !groupB) return false;
  return groupA === groupB;
}

export function convertQuantity(
  qty: number,
  fromUnit: string,
  toUnit: string,
): number | null {
  const from = lookupUnit(fromUnit);
  const to = lookupUnit(toUnit);
  if (!from || !to || from.group !== to.group) return null;
  const baseValue = qty * from.toBase;
  return baseValue / to.toBase;
}

// Display scaling rules per group
const DISPLAY_RULES: Record<
  UnitGroup,
  { threshold: number; fromUnit: string; toUnit: string }[]
> = {
  mass: [{ threshold: 1000, fromUnit: 'grams', toUnit: 'kg' }],
  volume: [{ threshold: 1000, fromUnit: 'ml', toUnit: 'liters' }],
  countable: [],
};

// Canonical display unit names (what we store/show)
const CANONICAL_DISPLAY: Record<string, string> = {
  grams: 'grams',
  g: 'grams',
  kg: 'kg',
  ml: 'ml',
  liters: 'liters',
  l: 'liters',
  cups: 'cups',
  tbsp: 'tbsp',
  tsp: 'tsp',
  pcs: 'pcs',
};

export function formatForDisplay(
  qty: number,
  unit: string,
): { quantity: number; unit: string } {
  const def = lookupUnit(unit);
  if (!def) return { quantity: round2(qty), unit };

  const canonicalUnit = CANONICAL_DISPLAY[unit.toLowerCase()] ?? unit;
  const rules = DISPLAY_RULES[def.group];

  for (const rule of rules) {
    if (canonicalUnit === rule.fromUnit && qty >= rule.threshold) {
      const converted = qty / (lookupUnit(rule.toUnit)!.toBase / def.toBase);
      return { quantity: round2(converted), unit: rule.toUnit };
    }
  }

  return { quantity: round2(qty), unit: canonicalUnit };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
