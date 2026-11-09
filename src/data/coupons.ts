export type CouponType = 'percent' | 'fixed';

export type Coupon = {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  active: boolean;
};

export type AppliedCoupon = {
  code: string;
  type: CouponType;
  value: number;
};

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'cp1',
    code: 'LUXURY20',
    type: 'percent',
    value: 20,
    active: true
  },
  {
    id: 'cp2',
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    active: true
  },
  {
    id: 'cp3',
    code: 'FREESHIP',
    type: 'fixed',
    value: 500,
    active: true
  },
  {
    id: 'cp4',
    code: 'FLASH50',
    type: 'fixed',
    value: 50,
    active: false
  }
];

let couponCache: Coupon[] = DEFAULT_COUPONS;
let appliedCouponCache: AppliedCoupon | null = null;

type CouponRow = {
  id: string;
  payload?: Coupon | null;
  code?: string | null;
  type?: CouponType | null;
  value?: number | string | null;
  active?: boolean | null;
};

function rowToCoupon(row: CouponRow): Coupon | null {
  if (row.payload && typeof row.payload === 'object') {
    return row.payload;
  }

  if (!row.code || !row.type) {
    return null;
  }

  return {
    id: row.id,
    code: row.code,
    type: row.type,
    value: Number(row.value ?? 0),
    active: row.active ?? true
  };
}

function couponToRow(coupon: Coupon) {
  return {
    id: coupon.id,
    payload: coupon,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    active: coupon.active
  };
}

function dispatchCouponsChanged() {
  window.dispatchEvent(new Event('mp_coupons_changed'));
}

function dispatchAppliedCouponChanged() {
  window.dispatchEvent(new Event('mp_applied_coupon_changed'));
}

export function readCoupons(): Coupon[] {
  return couponCache;
}

export function saveCoupons(coupons: Coupon[]) {
  couponCache = coupons;
  dispatchCouponsChanged();
}

export function readAppliedCoupon(): AppliedCoupon | null {
  return appliedCouponCache;
}

export function saveAppliedCoupon(coupon: AppliedCoupon | null) {
  appliedCouponCache = coupon;
  dispatchAppliedCouponChanged();
}

export function clearAppliedCoupon() {
  saveAppliedCoupon(null);
}

export function findCouponByCode(code: string) {
  const normalized = code.trim().toUpperCase();
  return readCoupons().find((coupon) => coupon.code.toUpperCase() === normalized) ?? null;
}

export async function syncCouponsToSupabase(coupons: Coupon[]) {
  const { supabase, hasSupabaseConfig } = await import('../lib/supabase');
  const { TABLES } = await import('./supabaseTables');
  if (!hasSupabaseConfig || !supabase) return;

  const { error } = await supabase.from(TABLES.coupons).upsert(
    coupons.map((coupon) => couponToRow(coupon)),
    { onConflict: 'id' }
  );

  if (error) {
    throw error;
  }
}

export async function loadCouponsFromSupabase() {
  const { supabase, hasSupabaseConfig } = await import('../lib/supabase');
  const { TABLES } = await import('./supabaseTables');
  if (!hasSupabaseConfig || !supabase) return null;

  const { data, error } = await supabase.from(TABLES.coupons).select('*').order('created_at', { ascending: false });
  if (error) return null;
  couponCache = (data ?? [])
    .map((row) => rowToCoupon(row as CouponRow))
    .filter((coupon): coupon is Coupon => Boolean(coupon));
  return couponCache;
}
