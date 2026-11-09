import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { PRODUCTS } from '../../data/products';
import { AlertTriangle, Check } from 'lucide-react';
export function AdminInventory() {
  const [stock, setStock] = useState<Record<string, number>>(
    Object.fromEntries(PRODUCTS.map((p) => [p.id, p.stock]))
  );
  const updateStock = (id: string, value: number) => {
    setStock({
      ...stock,
      [id]: Math.max(0, value)
    });
  };
  const lowCount = Object.values(stock).filter((s) => s > 0 && s < 10).length;
  const outCount = Object.values(stock).filter((s) => s === 0).length;
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-text mb-2">
          Inventory
        </h1>
        <p className="text-text-light">
          Track and update product stock levels.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-soft border border-accent p-6">
          <div className="text-sm text-text-light mb-1">Total Products</div>
          <div className="text-3xl font-serif font-bold text-text">
            {PRODUCTS.length}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft border border-accent p-6">
          <div className="text-sm text-text-light mb-1">Low Stock</div>
          <div className="text-3xl font-serif font-bold text-yellow-600">
            {lowCount}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft border border-accent p-6">
          <div className="text-sm text-text-light mb-1">Out of Stock</div>
          <div className="text-3xl font-serif font-bold text-red-500">
            {outCount}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-accent overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-accent/30 text-text-light uppercase text-xs tracking-wider">
              <tr>
                <th className="text-left font-medium px-6 py-4">Product</th>
                <th className="text-left font-medium px-6 py-4">SKU</th>
                <th className="text-center font-medium px-6 py-4">Status</th>
                <th className="text-right font-medium px-6 py-4">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent">
              {PRODUCTS.map((p) => {
                const s = stock[p.id];
                const status = s === 0 ? 'out' : s < 10 ? 'low' : 'ok';
                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${status === 'out' ? 'bg-red-50/50' : status === 'low' ? 'bg-yellow-50/50' : 'hover:bg-accent/20'}`}>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover" />
                        
                        <span className="font-medium text-text">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-light">{p.sku}</td>
                    <td className="px-6 py-4 text-center">
                      {status === 'ok' &&
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                          <Check className="w-3 h-3" /> In Stock
                        </span>
                      }
                      {status === 'low' &&
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700">
                          <AlertTriangle className="w-3 h-3" /> Low
                        </span>
                      }
                      {status === 'out' &&
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                          <AlertTriangle className="w-3 h-3" /> Out
                        </span>
                      }
                    </td>
                    <td className="px-6 py-4 text-right">
                      <input
                        type="number"
                        value={s}
                        onChange={(e) =>
                        updateStock(p.id, Number(e.target.value))
                        }
                        className="w-20 px-3 py-1.5 rounded-lg border border-accent text-right focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>);

}