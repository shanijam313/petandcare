import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Trash2, Ticket } from 'lucide-react';
import {
  Coupon,
  loadCouponsFromSupabase,
  readCoupons,
  saveCoupons,
  syncCouponsToSupabase
} from '../../data/coupons';

export function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(() => readCoupons());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Coupon, 'id'>>({
    code: '',
    type: 'percent',
    value: 10,
    active: true
  });

  React.useEffect(() => {
    (async () => {
      const remote = await loadCouponsFromSupabase();
      if (remote) {
        setCoupons(remote);
        saveCoupons(remote);
      }
    })();
  }, []);

  const addCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim()) return;

    const nextCoupons = [
      ...coupons,
      {
        ...form,
        id: `cp${Date.now()}`,
        code: form.code.trim().toUpperCase()
      }
    ];

    setCoupons(nextCoupons);
    saveCoupons(nextCoupons);
    try {
      await syncCouponsToSupabase(nextCoupons);
    } catch (error) {
      console.error('Failed to sync coupons to Supabase', error);
    }

    setForm({
      code: '',
      type: 'percent',
      value: 10,
      active: true
    });
    setShowForm(false);
  };

  const toggleActive = async (id: string) => {
    const nextCoupons = coupons.map((c) =>
      c.id === id
        ? {
            ...c,
            active: !c.active
          }
        : c
    );
    setCoupons(nextCoupons);
    saveCoupons(nextCoupons);
    try {
      await syncCouponsToSupabase(nextCoupons);
    } catch (error) {
      console.error('Failed to sync coupons to Supabase', error);
    }
  };

  const deleteCoupon = async (id: string) => {
    const nextCoupons = coupons.filter((x) => x.id !== id);
    setCoupons(nextCoupons);
    saveCoupons(nextCoupons);
    try {
      await syncCouponsToSupabase(nextCoupons);
    } catch (error) {
      console.error('Failed to sync coupons to Supabase', error);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-text mb-2">Coupons</h1>
          <p className="text-text-light">Create and manage discount codes.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-premium flex items-center gap-2">
          <Plus className="w-5 h-5" /> New Coupon
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={addCoupon}
          className="bg-white rounded-2xl shadow-soft border border-accent p-6 mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">Code</label>
            <input
              value={form.code}
              onChange={(e) =>
                setForm({
                  ...form,
                  code: e.target.value
                })
              }
              placeholder="SUMMER25"
              className="w-full px-4 py-2.5 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">Type</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value as 'percent' | 'fixed'
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="percent">Percentage (%)</option>
              <option value="fixed">Fixed (Rs)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">Value</label>
            <input
              type="number"
              value={form.value}
              onChange={(e) =>
                setForm({
                  ...form,
                  value: Number(e.target.value)
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button type="submit" className="btn-premium py-2.5">
            Add Coupon
          </button>
        </form>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl shadow-soft border border-accent p-6 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-secondary/5" />
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-primary" />
              </div>
              <button
                onClick={() => deleteCoupon(c.id)}
                className="text-text-light hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="font-serif font-bold text-xl text-text tracking-wider mb-1">
              {c.code}
            </div>
            <div className="text-text-light text-sm mb-4">
              {c.type === 'percent' ? `${c.value}% off` : `Rs ${c.value} off`}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleActive(c.id)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                  c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                {c.active ? 'Active' : 'Inactive'}
              </button>
              <button
                onClick={() => deleteCoupon(c.id)}
                className="text-text-light hover:text-red-500 transition-colors"
                aria-label={`Delete ${c.code}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
