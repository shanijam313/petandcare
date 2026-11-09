import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useCategories } from '../../data/categories';
import {
  getCatalogProducts,
  saveCatalogProduct,
  syncCatalogProductsToSupabase,
  useCatalogProducts
} from '../../data/catalog';
import { ArrowLeft, Save, ImagePlus, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { isSupabaseStorageReady, uploadProductImage } from '../../lib/storage';

type Mode = 'create' | 'edit';

export function AdminProductForm({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const { productId } = useParams();
  const categories = useCategories();
  const catalog = useCatalogProducts();
  const product = useMemo(
    () => catalog.find((item) => item.id === productId),
    [catalog, productId]
  );
  const isEdit = mode === 'edit';
  const title = isEdit ? 'Edit Product' : 'Add Product';
  const subtitle = isEdit
    ? 'Update product details, pricing, and inventory.'
    : 'Create a new product for your catalog.';
  const [imagePreview, setImagePreview] = useState<string>(product?.images[0] ?? '');
  const [imageValue, setImageValue] = useState<string>(product?.images[0] ?? '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [saveError, setSaveError] = useState('');

  const handleImageFile = async (file?: File) => {
    if (!file) return;
    setUploadError('');
    setUploading(true);

    try {
      if (isSupabaseStorageReady()) {
        const publicUrl = await uploadProductImage(file);
        setImagePreview(publicUrl);
        setImageValue(publicUrl);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || '');
        setImagePreview(result);
        setImageValue(result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveError('');
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || '').trim();
    const sku = String(formData.get('sku') || '').trim();
    const brand = String(formData.get('brand') || '').trim();
    const stock = Number(formData.get('stock') || 0);
    const price = Number(formData.get('price') || 0);
    const categoryId = String(formData.get('categoryId') || '');
    const description = String(formData.get('description') || '').trim();
    const imageUrl = String(formData.get('imageUrl') || '').trim();
    const finalImage = imageValue || imageUrl || product?.images[0] || '';

    if (!name || !sku || !brand || !categoryId || !finalImage) {
      setSaveError('Please fill Product Name, SKU, Brand, Category, and Image before saving.');
      return;
    }

    const selectedCategory = categories.find((category) => category.id === categoryId);
    const catalog = getCatalogProducts();
    const nextProduct: Product = {
      id: product?.id ?? `p${Date.now()}`,
      name,
      categoryId,
      categoryName: selectedCategory?.name ?? 'Uncategorized',
      price,
      salePrice: product?.salePrice ?? null,
      images: [finalImage],
      description,
      features: product?.features ?? ['Premium quality', 'Daily feeding', 'Balanced nutrition'],
      specifications: {
        Brand: brand,
        Type: String(formData.get('type') || product?.specifications.Type || 'Product')
      },
      stock,
      sku,
      brand,
      rating: product?.rating ?? 4.8,
      reviews: product?.reviews ?? 0,
      badge: product?.badge ?? null
    };

    const existingIndex = catalog.findIndex((item) => item.id === nextProduct.id);
    const nextCatalog =
      existingIndex >= 0 ?
      catalog.map((item) => (item.id === nextProduct.id ? nextProduct : item)) :
      [nextProduct, ...catalog];
    saveCatalogProduct(nextProduct);
    window.dispatchEvent(new Event('mp_catalog_products_changed'));
    try {
      await syncCatalogProductsToSupabase(nextCatalog);
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to sync product to Supabase', error);
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Failed to sync product to Supabase. Please check Supabase policies.'
      );
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 rounded-lg border border-accent bg-white hover:bg-accent/20 transition-colors"
          aria-label="Go back to products"
        >
          <ArrowLeft className="w-4 h-4 text-text" />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-text">{title}</h1>
          <p className="text-text-light text-sm mt-1">{subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-[1.4fr_0.9fr] gap-6">
        <div className="bg-white rounded-2xl shadow-soft border border-accent p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field name="name" label="Product Name" defaultValue={product?.name ?? ''} />
            <Field name="sku" label="SKU" defaultValue={product?.sku ?? ''} />
            <Field name="brand" label="Brand" defaultValue={product?.brand ?? ''} />
            <Field name="stock" label="Stock" type="number" defaultValue={String(product?.stock ?? 0)} />
            <Field name="price" label="Price" type="number" defaultValue={String(product?.price ?? '')} />
            <Field name="type" label="Type" defaultValue={String(product?.specifications.Type ?? '')} />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-light mb-2">Category</label>
                <select
                  name="categoryId"
                  defaultValue={product?.categoryId ?? categories[0]?.id}
                  className="w-full rounded-xl border border-accent bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-light mb-2">Description</label>
              <textarea
                name="description"
                rows={6}
                defaultValue={product?.description ?? ''}
                className="w-full rounded-xl border border-accent bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-premium px-5 py-3 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Product
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-5 py-3 rounded-xl border border-accent text-text-light hover:text-text hover:bg-accent/20 transition-colors">
              Cancel
            </button>
          </div>

          {saveError ? (
            <p className="mt-4 text-sm text-red-600">{saveError}</p>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-soft border border-accent p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ImagePlus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-text">Product Images</h2>
                <p className="text-sm text-text-light">Upload an image or paste a direct image URL.</p>
              </div>
            </div>

            <label className="block text-sm font-medium text-text-light mb-2">Image URL</label>
            <input
              name="imageUrl"
              defaultValue={product?.images[0] ?? ''}
              onChange={(e) => {
                setImageValue(e.target.value);
                setImagePreview(e.target.value);
              }}
              placeholder="https://..."
              className="w-full rounded-xl border border-accent bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 mb-4"
            />

            <input
              type="file"
              accept="image/*"
              className="w-full rounded-xl border border-dashed border-accent bg-white px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white hover:file:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
              onChange={(e) => handleImageFile(e.target.files?.[0])}
            />

            {uploading ? (
              <p className="mt-2 text-xs text-text-light">Uploading image to Supabase bucket...</p>
            ) : null}
            {uploadError ? <p className="mt-2 text-xs text-red-600">{uploadError}</p> : null}

            <div className="mt-4 rounded-xl border-2 border-dashed border-accent bg-accent/10 p-4 text-sm text-text-light">
              {imagePreview ?
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-full h-48 object-cover rounded-xl border border-accent bg-white" /> :

              <div className="text-center py-10">
                  {isSupabaseStorageReady()
                    ? 'Image will be uploaded to Supabase Storage bucket product.'
                    : 'Supabase storage is not configured, so this will fall back to a local preview.'}
                </div>
              }
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white shadow-soft">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5" />
              <h2 className="font-semibold">Quick Tips</h2>
            </div>
            <ul className="space-y-2 text-sm text-white/90">
              <li>Keep SKU values unique.</li>
              <li>Set discounts from the Sale Manager page.</li>
              <li>Choose the correct category to fix storefront filters.</li>
              <li>Paste a direct image URL if you do not want to upload a file.</li>
            </ul>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

function Field({
  label,
  defaultValue,
  type = 'text',
  name
}: {
  label: string;
  defaultValue: string;
  type?: string;
  name: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-light mb-2">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-accent bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
