export type StoreSettings = {
  storeName: string;
  currency: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  announcementPrimary: string;
  announcementSecondary: string;
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'Modern Pet Care & Stylish Fish Palace',
  currency: 'PKR (Rs)',
  email: 'support@modernpetcareandstylishfishpalace.shop',
  phone: '+92 345 1020728',
  whatsapp: '+92 345 1020728',
  address: 'Niaz Plaza, near Police Public School Board, University Rd, Shaheen Town, Peshawar, Pakistan',
  announcementPrimary: 'Fast delivery on premium pet and fish products in Peshawar and across Pakistan',
  announcementSecondary: ''
};

type StoreSettingsRow = {
  payload?: Partial<StoreSettings> | null;
};

const STORE_SETTINGS_CACHE_KEY = 'mp_store_settings_cache';

function dispatchStoreSettingsChanged() {
  window.dispatchEvent(new Event('mp_store_settings_changed'));
}

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readStoreSettingsCache() {
  if (!canUseStorage()) return null;

  try {
    const raw = window.localStorage.getItem(STORE_SETTINGS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoreSettings>;
    return { ...DEFAULT_STORE_SETTINGS, ...parsed };
  } catch {
    return null;
  }
}

function writeStoreSettingsCache(settings: StoreSettings) {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(STORE_SETTINGS_CACHE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore cache write failures; Supabase remains the source of truth.
  }
}

export async function loadStoreSettingsFromSupabase() {
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
  if (!payload) return null;
  const settings = { ...DEFAULT_STORE_SETTINGS, ...payload };
  writeStoreSettingsCache(settings);
  return settings;
}

export async function saveStoreSettingsToSupabase(settings: StoreSettings) {
  const { supabase, hasSupabaseConfig } = await import('../lib/supabase');
  const { TABLES } = await import('./supabaseTables');
  if (!hasSupabaseConfig || !supabase) return;

  writeStoreSettingsCache(settings);
  const { error } = await supabase
    .from(TABLES.storeSettings)
    .upsert({ id: 'store-settings', payload: settings }, { onConflict: 'id' });

  if (error) throw error;
  dispatchStoreSettingsChanged();
}

export function notifyStoreSettingsChanged() {
  dispatchStoreSettingsChanged();
}
