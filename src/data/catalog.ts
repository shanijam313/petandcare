import { useEffect, useState } from 'react';
import { PRODUCTS } from './products';
import { readCategories as readStoredCategories } from './categories';
import { Category, Product } from '../types';

export const CATALOG_PRODUCTS_KEY = 'mp_catalog_products';
export const SALE_OVERRIDES_KEY = 'mp_sale_overrides';
export const SALE_ENDS_AT_KEY = 'mp_sale_ends_at';
let productCache: Product[] = PRODUCTS;
let saleOverridesCache: Record<string, SaleOverrideEntry> = {};

function readProducts(): Product[] {
  return productCache;
}

function writeProducts(products: Product[]) {
  productCache = products;
  window.dispatchEvent(new Event('mp_catalog_products_changed'));
}

type SaleOverrideEntry = {
  price: number;
  expiresAt: number | null;
};

type StoreSettingsRow = {
  payload?: {
    categories?: Category[];
    saleOverrides?: Record<string, SaleOverrideEntry>;
    sale_overrides?: Record<string, SaleOverrideEntry>;
  } | null;
};

type ProductRow = {
  id: string;
  payload?: Product | null;
  name?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  price?: number | string | null;
  sale_price?: number | string | null;
  images?: string[] | null;
  description?: string | null;
  features?: string[] | null;
  specifications?: Record<string, string> | null;
  stock?: number | string | null;
  sku?: string | null;
  brand?: string | null;
  rating?: number | string | null;
  reviews?: number | string | null;
  badge?: Product['badge'] | null;
  is_active?: boolean | null;
};

function toNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === 'string' ? Number(value) : Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function rowToProduct(row: ProductRow): Product | null {
  if (row.payload && typeof row.payload === 'object') {
    return row.payload;
  }

  if (!row.name || !row.category_name || !row.sku) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    categoryId:
      row.category_id ??
      readStoredCategories().find((category) => category.name === row.category_name)?.id ??
      '',
    categoryName: row.category_name,
    price: toNumber(row.price),
    salePrice: row.sale_price === null || row.sale_price === undefined ? null : toNumber(row.sale_price),
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description ?? '',
    features: Array.isArray(row.features) ? row.features : [],
    specifications: (row.specifications ?? {}) as Record<string, string>,
    stock: toNumber(row.stock),
    sku: row.sku,
    brand: row.brand ?? '',
    rating: toNumber(row.rating, 0),
    reviews: toNumber(row.reviews, 0),
    badge: row.badge ?? null
  };
}

function productToRow(product: Product) {
  return {
    id: product.id,
    payload: product,
    name: product.name,
    category_id: null,
    category_name: product.categoryName,
    price: product.price,
    sale_price: product.salePrice,
    images: product.images,
    description: product.description,
    features: product.features,
    specifications: product.specifications,
    stock: product.stock,
    sku: product.sku,
    brand: product.brand,
    rating: product.rating,
    reviews: product.reviews,
    badge: product.badge,
    is_active: true
  };
}

function readSaleOverrides(): Record<string, SaleOverrideEntry> {
  return saleOverridesCache;
}

export function getSaleOverrides() {
  return readSaleOverrides();
}

function writeSaleOverrides(entries: Record<string, SaleOverrideEntry>) {
  saleOverridesCache = entries;
  window.dispatchEvent(new Event('mp_sale_overrides_changed'));
}

function cleanupExpiredSales() {
  const overrides = readSaleOverrides();
  let changed = false;
  const now = Date.now();

  Object.entries(overrides).forEach(([productId, entry]) => {
    if (entry.expiresAt !== null && entry.expiresAt <= now) {
      delete overrides[productId];
      changed = true;
    } else {
      overrides[productId] = { ...entry };
    }
  });

  if (changed) {
    writeSaleOverrides({ ...overrides });
  }
}

export function writeSaleOverride(
  productId: string,
  salePrice: number | null,
  expiresAt: number | null = null
) {
  const overrides = readSaleOverrides();
  if (salePrice === null || Number.isNaN(salePrice)) {
    delete overrides[productId];
  } else {
    overrides[productId] = { price: salePrice, expiresAt };
  }
  writeSaleOverrides({ ...overrides });
}

export function getCatalogProducts(): Product[] {
  cleanupExpiredSales();
  const overrides = readSaleOverrides();
  return readProducts().map((product) => ({
    ...product,
    salePrice: overrides[product.id]?.price ?? product.salePrice
  }));
}

export function useCatalogProducts() {
  const [products, setProducts] = useState<Product[]>(() => getCatalogProducts());

  useEffect(() => {
    const refresh = () => setProducts(getCatalogProducts());
    let cancelled = false;

    const hydrateFromSupabase = async () => {
      const { supabase, hasSupabaseConfig } = await import('../lib/supabase');
      const { TABLES } = await import('./supabaseTables');
      if (!hasSupabaseConfig || !supabase) return;

      const [{ data: productsData, error: productsError }, { data: settingsData, error: settingsError }] = await Promise.all([
        supabase.from(TABLES.products).select('*').order('created_at', { ascending: false }),
        supabase.from(TABLES.storeSettings).select('payload').eq('id', 'store-settings').maybeSingle()
      ]);

      if (productsError || settingsError || cancelled) return;

      const remoteProducts = (productsData ?? [])
        .map((row) => rowToProduct(row as ProductRow))
        .filter((product): product is Product => Boolean(product));
      if (remoteProducts.length > 0) {
        productCache = remoteProducts;
      }

      const payload = (settingsData as StoreSettingsRow | null | undefined)?.payload;
      const remoteSaleOverrides = payload?.saleOverrides ?? payload?.sale_overrides ?? null;
      if (remoteSaleOverrides && typeof remoteSaleOverrides === 'object') {
        saleOverridesCache = remoteSaleOverrides as Record<string, SaleOverrideEntry>;
      }

      window.dispatchEvent(new Event('mp_catalog_products_changed'));
      window.dispatchEvent(new Event('mp_sale_overrides_changed'));
      setProducts(getCatalogProducts());
    };

    hydrateFromSupabase();
    window.addEventListener('storage', refresh);
    window.addEventListener('mp_catalog_products_changed', refresh);
    window.addEventListener('mp_sale_overrides_changed', refresh);
    return () => {
      cancelled = true;
      window.removeEventListener('storage', refresh);
      window.removeEventListener('mp_catalog_products_changed', refresh);
      window.removeEventListener('mp_sale_overrides_changed', refresh);
    };
  }, []);

  return products;
}

export function saveCatalogProduct(product: Product) {
  writeProducts([product, ...readProducts().filter((item) => item.id !== product.id)]);
}

export function deleteCatalogProduct(productId: string) {
  writeProducts(readProducts().filter((item) => item.id !== productId));
}

export async function syncCatalogProductsToSupabase(products: Product[]) {
  const { supabase, hasSupabaseConfig } = await import('../lib/supabase');
  const { TABLES } = await import('./supabaseTables');
  if (!hasSupabaseConfig || !supabase) return;

  const { error } = await supabase.from(TABLES.products).upsert(
    products.map((product) => productToRow(product)),
    { onConflict: 'id' }
  );

  if (error) {
    throw error;
  }
}

export async function deleteCatalogProductFromSupabase(productId: string) {
  const { supabase, hasSupabaseConfig } = await import('../lib/supabase');
  const { TABLES } = await import('./supabaseTables');
  if (!hasSupabaseConfig || !supabase) return;

  const { error } = await supabase.from(TABLES.products).delete().eq('id', productId);
  if (error) {
    throw error;
  }
}

export async function syncSaleOverridesToSupabase(overrides: Record<string, SaleOverrideEntry>) {
  const { supabase, hasSupabaseConfig } = await import('../lib/supabase');
  const { TABLES } = await import('./supabaseTables');
  if (!hasSupabaseConfig || !supabase) return;

  const { data: existing, error: readError } = await supabase
    .from(TABLES.storeSettings)
    .select('payload')
    .eq('id', 'store-settings')
    .maybeSingle();

  if (readError) {
    throw readError;
  }

  const payload = {
    ...(existing && typeof existing === 'object' && 'payload' in existing ? (existing as StoreSettingsRow).payload : {}),
    saleOverrides: overrides
  };

  const { error } = await supabase
    .from(TABLES.storeSettings)
    .upsert({ id: 'store-settings', payload }, { onConflict: 'id' });

  if (error) {
    throw error;
  }
}

export async function loadCatalogProductsFromSupabase() {
  const { supabase, hasSupabaseConfig } = await import('../lib/supabase');
  const { TABLES } = await import('./supabaseTables');
  if (!hasSupabaseConfig || !supabase) return null;

  const { data, error } = await supabase
    .from(TABLES.products)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return null;
  return (data ?? [])
    .map((row) => rowToProduct(row as ProductRow))
    .filter((product): product is Product => Boolean(product));
}

export function readCategories(): Category[] {
  return readStoredCategories();
}

export function getSaleCountdown() {
  cleanupExpiredSales();
  const overrides = readSaleOverrides();
  const active = Object.entries(overrides)
    .filter(([, entry]) => entry.expiresAt !== null)
    .map(([productId, entry]) => ({
      productId,
      expiresAt: entry.expiresAt as number
    }))
    .sort((a, b) => a.expiresAt - b.expiresAt);

  return active[0]?.expiresAt ?? null;
}

export function getSaleEndForProduct(productId: string) {
  cleanupExpiredSales();
  const overrides = readSaleOverrides();
  return overrides[productId]?.expiresAt ?? null;
}
