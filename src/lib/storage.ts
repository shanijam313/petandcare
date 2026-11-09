import { supabase } from './supabase';

export const PRODUCT_BUCKET = 'product';

function getFileExtension(file: File) {
  const match = file.name.match(/\.[a-z0-9]+$/i);
  if (match?.[0]) return match[0].toLowerCase();
  const fallback = file.type.split('/')[1];
  return fallback ? `.${fallback.toLowerCase()}` : '.jpg';
}

export function isSupabaseStorageReady() {
  return Boolean(supabase);
}

export async function uploadProductImage(file: File) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const extension = getFileExtension(file);
  const safeName = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safeName}${extension}`;

  const { error } = await supabase.storage.from(PRODUCT_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type || 'image/jpeg'
  });

  if (error) {
    throw error;
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to prepare image preview.'));
    reader.readAsDataURL(file);
  });

  return dataUrl || supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(path).data.publicUrl;
}
