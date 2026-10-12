// Open Food Facts — free, open database of packaged products (no API key).
// https://openfoodfacts.github.io/openfoodfacts-server/api/

const BASE = 'https://world.openfoodfacts.org';
const FIELDS = [
  'code',
  'product_name',
  'product_name_fr',
  'product_name_en',
  'brands',
  'nutriments',
  'serving_size',
  'serving_quantity',
  'image_front_small_url',
  'countries_tags',
].join(',');
// OFF asks apps to identify themselves (ignored by browsers in the web preview).
const HEADERS = { 'User-Agent': 'NutriLens/1.0 (personal Android app)' };

export interface PackagedFood {
  code: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  per100g: { kcal: number; protein: number; carbs: number; fat: number; fiber?: number };
  servingGrams?: number;
  servingLabel?: string;
  countries: string[];
}

interface OffProduct {
  code?: string;
  product_name?: string;
  product_name_fr?: string;
  product_name_en?: string;
  brands?: string;
  nutriments?: Record<string, number | string>;
  serving_size?: string;
  serving_quantity?: number | string;
  image_front_small_url?: string;
  countries_tags?: string[];
}

const num = (v: unknown) => {
  const n = typeof v === 'string' ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : undefined;
};

function toPackagedFood(p: OffProduct, language: 'en' | 'fr'): PackagedFood | null {
  const n = p.nutriments ?? {};
  let kcal = num(n['energy-kcal_100g']);
  if (kcal === undefined) {
    const kj = num(n['energy-kj_100g']) ?? num(n['energy_100g']);
    if (kj !== undefined) kcal = kj / 4.184;
  }
  if (kcal === undefined) return null;

  const name =
    (language === 'fr' ? p.product_name_fr : p.product_name_en) ||
    p.product_name ||
    p.product_name_fr ||
    p.product_name_en;
  if (!name || !p.code) return null;

  const servingGrams = num(p.serving_quantity);
  return {
    code: p.code,
    name: name.trim(),
    brand: p.brands?.split(',')[0]?.trim() || undefined,
    imageUrl: p.image_front_small_url,
    per100g: {
      kcal: Math.round(kcal),
      protein: num(n['proteins_100g']) ?? 0,
      carbs: num(n['carbohydrates_100g']) ?? 0,
      fat: num(n['fat_100g']) ?? 0,
      fiber: num(n['fiber_100g']),
    },
    servingGrams: servingGrams && servingGrams > 0 ? servingGrams : undefined,
    servingLabel: p.serving_size || undefined,
    countries: p.countries_tags ?? [],
  };
}

export async function lookupBarcode(
  barcode: string,
  language: 'en' | 'fr',
): Promise<PackagedFood | null> {
  const res = await fetch(
    `${BASE}/api/v2/product/${encodeURIComponent(barcode)}.json?fields=${FIELDS}`,
    { headers: HEADERS },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Open Food Facts error ${res.status}`);
  const json = await res.json();
  if (json.status === 0 || !json.product) return null;
  return toPackagedFood({ ...json.product, code: json.code ?? barcode }, language);
}

/** Text search. OFF allows ~10 searches/minute, so call this on submit, not per keystroke. */
export async function searchPackagedFoods(
  query: string,
  language: 'en' | 'fr',
): Promise<PackagedFood[]> {
  const params = new URLSearchParams({
    search_terms: query,
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '24',
    fields: FIELDS,
  });
  const res = await fetch(`${BASE}/cgi/search.pl?${params.toString()}`, {
    headers: HEADERS,
  });
  if (!res.ok) throw new Error(`Open Food Facts error ${res.status}`);
  const json = await res.json();
  const products: PackagedFood[] = (json.products ?? [])
    .map((p: OffProduct) => toPackagedFood(p, language))
    .filter(Boolean);

  // Products sold in Tunisia first, then France (common imports), then the rest.
  const rank = (f: PackagedFood) =>
    f.countries.includes('en:tunisia') ? 0 : f.countries.includes('en:france') ? 1 : 2;
  return products.sort((a, b) => rank(a) - rank(b));
}
