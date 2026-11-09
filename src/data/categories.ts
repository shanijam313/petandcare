import { useEffect, useState } from 'react';
import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Cat Food', image: '/images/meomix-500.png' },
  { id: '2', name: 'Cat Accessories', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop' },
  { id: '3', name: 'Dog Food', image: '/images/dog-food-bigpaw-20kg.png' },
  { id: '4', name: 'Dog Accessories', image: '/images/dog-accessories.png' },
  { id: '5', name: 'Cat Medicine', image: '/images/cat-medicine.png' },
  { id: '6', name: 'Dog Medicine', image: '/images/dog-medicine.png' },
  { id: '7', name: 'General Pet Medicine', image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=800&auto=format&fit=crop' },
  { id: '8', name: 'Cat Grooming', image: '/images/cat-grooming.png' },
  { id: '9', name: 'Dog Grooming', image: '/images/dog-grooming.png' },
  { id: '10', name: 'Pets Sale', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop' },
  { id: '11', name: 'Aquariums', image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be1?q=80&w=800&auto=format&fit=crop' },
  { id: '12', name: 'Fish', image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=800&auto=format&fit=crop' },
  { id: '13', name: 'Aquarium Accessories', image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?q=80&w=800&auto=format&fit=crop' },
  { id: '14', name: 'Fish Food', image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=800&auto=format&fit=crop' },
  { id: '15', name: 'Fish Medicine', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=800&auto=format&fit=crop' }
];

type StoreSettingsRow = {
  payload?: {
    categories?: Category[];
  } | null;
};

let categoryCache: Category[] = DEFAULT_CATEGORIES;

function dispatchCategoriesChanged() {
  window.dispatchEvent(new Event('mp_categories_changed'));
}

export function readCategories(): Category[] {
  return categoryCache;
}

export function saveCategories(categories: Category[]) {
  categoryCache = categories;
  dispatchCategoriesChanged();
}

export function deleteCategory(categoryId: string) {
  saveCategories(readCategories().filter((category) => category.id !== categoryId));
}

export function updateCategory(category: Category) {
  saveCategories(readCategories().map((item) => (item.id === category.id ? category : item)));
}

export async function loadCategoriesFromSupabase() {
  const { supabase, hasSupabaseConfig } = await import('../lib/supabase');
  const { TABLES } = await import('./supabaseTables');
  if (!hasSupabaseConfig || !supabase) return null;

  const { data, error } = await supabase
    .from(TABLES.storeSettings)
    .select('payload')
    .eq('id', 'store-settings')
    .maybeSingle();
  if (error || !data) return null;

  const payload = (data as StoreSettingsRow).payload;
  if (payload?.categories && Array.isArray(payload.categories) && payload.categories.length > 0) {
    categoryCache = payload.categories;
    dispatchCategoriesChanged();
  }
  return categoryCache;
}

export async function syncCategoriesToSupabase(categories: Category[]) {
  const { supabase, hasSupabaseConfig } = await import('../lib/supabase');
  const { TABLES } = await import('./supabaseTables');
  if (!hasSupabaseConfig || !supabase) return;

  const { data: existing } = await supabase
    .from(TABLES.storeSettings)
    .select('payload')
    .eq('id', 'store-settings')
    .maybeSingle();

  const payload = {
    ...(existing && typeof existing === 'object' && 'payload' in existing ? (existing as StoreSettingsRow).payload : {}),
    categories
  };

  const { error } = await supabase
    .from(TABLES.storeSettings)
    .upsert({ id: 'store-settings', payload }, { onConflict: 'id' });

  if (error) {
    throw error;
  }
}

export async function uploadCategoryImage(file: File) {
  const { uploadProductImage } = await import('../lib/storage');
  return uploadProductImage(file);
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() => readCategories());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const remote = await loadCategoriesFromSupabase();
      if (!cancelled && remote) {
        setCategories(remote);
      }
    })();

    const refresh = () => setCategories(readCategories());
    window.addEventListener('mp_categories_changed', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      cancelled = true;
      window.removeEventListener('mp_categories_changed', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return categories;
}
