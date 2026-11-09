import React, { useMemo, useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  saveCatalogProduct,
  getSaleOverrides,
  syncCatalogProductsToSupabase,
  syncSaleOverridesToSupabase,
  useCatalogProducts,
  writeSaleOverride
} from '../../data/catalog';
import { Trash2 } from 'lucide-react';

const formatRs = (value: number) => `Rs ${value.toLocaleString('en-PK')}`;
const formatDateTime = (value: number | null) => {
  if (value === null) return 'No expiry set';
  return new Date(value).toLocaleString();
};

const formatRemaining = (value: number | null) => {
  if (value === null) return 'Until manually removed';
  const diff = Math.max(0, value - Date.now());
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}h ${minutes}m left`;
};

export function AdminSales() {
  const catalog = useCatalogProducts();
  const saleProducts = catalog.filter((product) => product.salePrice !== null);
  const [productId, setProductId] = useState(catalog[0]?.id ?? '');
  const [durationHours, setDurationHours] = useState('12');
  const selectedProduct = useMemo(
    () => catalog.find((product) => product.id === productId),
    [catalog, productId]
  );
  const [salePrice, setSalePrice] = useState(
    selectedProduct?.salePrice?.toString() ?? ''
  );
  const saleOverrides = getSaleOverrides();

  React.useEffect(() => {
    setSalePrice(selectedProduct?.salePrice?.toString() ?? '');
  }, [selectedProduct?.id]);

  const handleProductChange = (id: string) => {
    setProductId(id);
    const product = catalog.find((item) => item.id === id);
    setSalePrice(product?.salePrice?.toString() ?? '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = salePrice.trim() === '' ? null : Number(salePrice);
    if (parsed !== null && Number.isNaN(parsed)) return;
    const hours = Number(durationHours);
    const expiresAt =
      parsed !== null && !Number.isNaN(hours) && hours > 0
        ? Date.now() + hours * 60 * 60 * 1000
        : null;
    writeSaleOverride(productId, parsed, expiresAt);
    if (selectedProduct) {
      const updatedProduct = { ...selectedProduct, salePrice: parsed };
      saveCatalogProduct(updatedProduct);
      await syncCatalogProductsToSupabase(
        catalog.map((item) => (item.id === updatedProduct.id ? updatedProduct : item))
      );
    }
    await syncSaleOverridesToSupabase(getSaleOverrides());
  };

  const handleClear = async () => {
    writeSaleOverride(productId, null);
    if (selectedProduct) {
      const updatedProduct = { ...selectedProduct, salePrice: null };
      saveCatalogProduct(updatedProduct);
      await syncCatalogProductsToSupabase(
        catalog.map((item) => (item.id === updatedProduct.id ? updatedProduct : item))
      );
    }
    await syncSaleOverridesToSupabase(getSaleOverrides());
    setSalePrice('');
  };

  const handleRemoveSale = async (id: string) => {
    writeSaleOverride(id, null);
    const product = catalog.find((item) => item.id === id);
    if (product) {
      const updatedProduct = { ...product, salePrice: null };
      saveCatalogProduct(updatedProduct);
      await syncCatalogProductsToSupabase(
        catalog.map((item) => (item.id === updatedProduct.id ? updatedProduct : item))
      );
    }
    await syncSaleOverridesToSupabase(getSaleOverrides());
    if (id === productId) {
      setSalePrice('');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-text">Sale Manager</h1>
        <p className="text-text-light text-sm mt-1">
          Select a product, set a sale price, and it will appear in the home sale section.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-soft border border-accent p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-light mb-2">Product</label>
              <select
                value={productId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full rounded-xl border border-accent bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                {catalog.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Current Price</label>
              <input
                value={selectedProduct ? formatRs(selectedProduct.price) : ''}
                readOnly
                className="w-full rounded-xl border border-accent bg-accent/20 px-4 py-3 text-sm text-text-light"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Category</label>
              <input
                value={selectedProduct?.categoryName ?? ''}
                readOnly
                className="w-full rounded-xl border border-accent bg-accent/20 px-4 py-3 text-sm text-text-light"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Sale Price (PKR)</label>
              <input
                type="number"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="e.g. 999"
                className="w-full rounded-xl border border-accent bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Sale Duration (Hours)</label>
              <input
                type="number"
                min="1"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                placeholder="12"
                className="w-full rounded-xl border border-accent bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {selectedProduct &&
          <div className="mt-6 grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 items-center rounded-2xl border border-accent bg-accent/10 p-4">
              <img
              src={selectedProduct.images[0]}
              alt={selectedProduct.name}
              className="w-full h-32 object-cover rounded-xl border border-accent bg-white" />
              
              <div>
                <p className="text-xs uppercase tracking-wider text-text-light mb-1">
                  Product Preview
                </p>
                <h3 className="font-serif font-semibold text-lg text-text mb-1">
                  {selectedProduct.name}
                </h3>
                <p className="text-sm text-text-light mb-2">
                  {selectedProduct.categoryName} · {formatRs(selectedProduct.price)}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                    SKU: {selectedProduct.sku}
                  </span>
                  {selectedProduct.salePrice !== null &&
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-red-100 text-red-700">
                      Sale Active
                    </span>
                  }
                </div>
                {saleOverrides[selectedProduct.id] ? (
                  <div className="mt-3 grid gap-1 text-xs text-text-light">
                    <span>
                      Ends at: {formatDateTime(saleOverrides[selectedProduct.id].expiresAt)}
                    </span>
                    <span>
                      Remaining: {formatRemaining(saleOverrides[selectedProduct.id].expiresAt)}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          }

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="btn-premium px-5 py-3 text-sm">
              Save Sale
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-5 py-3 rounded-xl border border-accent text-text-light hover:text-text hover:bg-accent/20 transition-colors text-sm">
              Remove Sale
            </button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-soft border border-accent p-6">
            <h2 className="font-serif font-bold text-lg mb-4">Active Sale Products</h2>
            <div className="space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
              {saleProducts.length > 0 ? saleProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-accent">
                  <div className="min-w-0">
                    <p className="font-medium text-text truncate">{product.name}</p>
                    <p className="text-xs text-text-light">
                      {formatRs(product.price)} → {formatRs(product.salePrice!)}
                    </p>
                    <p className="text-xs text-text-light mt-1">
                      {saleOverrides[product.id]?.expiresAt
                        ? `Ends: ${formatDateTime(saleOverrides[product.id].expiresAt)}`
                        : 'No expiry set'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-red-100 text-red-700">
                      On Sale
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSale(product.id)}
                      className="w-8 h-8 rounded-full border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                      aria-label={`Remove sale for ${product.name}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-text-light">No products are on sale right now.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
