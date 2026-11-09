import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import {
  deleteCatalogProduct,
  deleteCatalogProductFromSupabase,
  useCatalogProducts
} from '../../data/catalog';
const formatRs = (value: number) => `Rs ${value.toLocaleString('en-PK')}`;
export function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const products = useCatalogProducts();
  const navigate = useNavigate();
  const filteredProducts = products.filter(
    (p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleDelete = async (productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    const confirmed = window.confirm(
      `Delete ${product.name} permanently?`
    );
    if (!confirmed) return;
    try {
      await deleteCatalogProductFromSupabase(productId);
      deleteCatalogProduct(productId);
    } catch (error) {
      console.error('Failed to delete product from Supabase', error);
      window.alert('Delete failed. Please check Supabase delete policies and try again.');
    }
  };
  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text">Products</h1>
          <p className="text-text-light text-sm mt-1">
            Manage your store's inventory and pricing.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
          className="btn-premium py-2 px-4 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-accent overflow-hidden">
        <div className="p-4 border-b border-accent flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
            
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-accent/30 text-xs uppercase tracking-wider text-text-light border-b border-accent">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent">
              {filteredProducts.map((product) =>
              <tr
                key={product.id}
                className="hover:bg-accent/10 transition-colors">
                
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover border border-accent" />
                    
                      <div>
                        <div className="font-medium text-sm text-text line-clamp-1">
                          {product.name}
                        </div>
                        <div className="text-xs text-text-light">
                          SKU: {product.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text-light">
                    {product.categoryName}
                  </td>
                  <td className="p-4 text-sm">
                    {product.salePrice ?
                  <div>
                        <span className="font-medium text-red-500">
                          {formatRs(product.salePrice)}
                        </span>
                        <span className="text-xs text-text-light line-through ml-2">
                          {formatRs(product.price)}
                        </span>
                      </div> :

                  <span className="font-medium">
                        {formatRs(product.price)}
                      </span>
                  }
                  </td>
                  <td className="p-4 text-sm">
                    <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                        className="p-1 text-text-light hover:text-primary transition-colors"
                        aria-label={`Edit ${product.name}`}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1 text-text-light hover:text-red-500 transition-colors"
                        aria-label={`Delete ${product.name}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>);

}
