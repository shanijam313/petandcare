const env = import.meta.env as Record<string, string | undefined>;

export const SUPABASE_URL =
  env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '';

export const SUPABASE_PUBLISHABLE_KEY =
  env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

export const ADMIN_EMAIL =
  env.VITE_ADMIN_EMAIL || env.NEXT_PUBLIC_ADMIN_EMAIL || 'Mjdusmani@gmail.com';

export const ADMIN_PASSWORD =
  env.VITE_ADMIN_PASSWORD || env.NEXT_PUBLIC_ADMIN_PASSWORD || 'aaazzzaaa123';

