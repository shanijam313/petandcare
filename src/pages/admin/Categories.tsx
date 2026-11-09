import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  deleteCategory,
  syncCategoriesToSupabase,
  useCategories
} from '../../data/categories';
import { useCatalogProducts } from '../../data/catalog';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
const formatRs = (value: number) => `Rs ${value.toLocaleString('en-PK')}`;
export function AdminCategories() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const products = useCatalogProducts();
  const categories = useCategories();
  const navigate = useNavigate();
  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };
  const handleEdit = (categoryId: string) => {
    navigate(`/admin/categories/${categoryId}/edit`);
  };

  const handleDelete = async (categoryId: string) => {
    const category = categories.find((item) => item.id === categoryId);
    if (!category) return;
    const confirmed = window.confirm(`Delete ${category.name} permanently?`);
    if (!confirmed) return;
    try {
      const nextCategories = categories.filter((item) => item.id !== categoryId);
      await syncCategoriesToSupabase(nextCategories);
      deleteCategory(categoryId);
    } catch (error) {
      console.error('Failed to delete category from Supabase', error);
      window.alert('Delete failed. Please check Supabase policies and try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text">
            Categories
          </h1>
          <p className="text-text-light text-sm mt-1">
            Manage product categories and sub-categories.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/categories/new')}
          className="btn-premium py-2 px-4 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-accent overflow-hidden">
        <div className="divide-y divide-accent">
          {categories.map((category) => {
            const categoryProducts = products.filter(
              (p) => p.categoryId === category.id
            );
            const isExpanded = expandedCategory === category.id;
            return (
              <div key={category.id} className="flex flex-col">
                <div
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-accent/10 transition-colors ${isExpanded ? 'bg-accent/10' : ''}`}
                  onClick={() => toggleCategory(category.id)}>
                  
                  <div className="flex items-center gap-4">
                    {isExpanded ?
                    <ChevronDown className="w-5 h-5 text-text-light" /> :

                    <ChevronRight className="w-5 h-5 text-text-light" />
                    }
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-12 h-12 rounded-lg object-cover border border-accent" />
                    
                    <div>
                      <h3 className="font-medium text-text">{category.name}</h3>
                      <p className="text-xs text-text-light">
                        {categoryProducts.length} Products
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEdit(category.id)}
                      className="p-2 text-text-light hover:text-primary transition-colors rounded-lg hover:bg-white"
                      aria-label={`Edit ${category.name}`}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-text-light hover:text-red-500 transition-colors rounded-lg hover:bg-white"
                      aria-label={`Delete ${category.name}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Products List */}
                {isExpanded &&
                <div className="bg-accent/5 p-4 border-t border-accent">
                    {categoryProducts.length > 0 ?
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categoryProducts.map((product) =>
                    <div
                      key={product.id}
                      className="flex items-center gap-3 bg-white p-3 rounded-xl border border-accent">
                      
                            <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-10 rounded-md object-cover" />
                      
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-text-light">
                                {formatRs(product.price)}
                              </p>
                            </div>
                          </div>
                    )}
                      </div> :

                  <p className="text-sm text-text-light text-center py-4">
                        No products in this category.
                      </p>
                  }
                  </div>
                }
              </div>);

          })}
        </div>
      </div>
    </AdminLayout>);

}
