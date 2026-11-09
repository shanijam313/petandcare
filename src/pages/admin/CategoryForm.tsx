import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  DEFAULT_CATEGORIES,
  readCategories,
  saveCategories,
  syncCategoriesToSupabase,
  uploadCategoryImage,
  useCategories
} from '../../data/categories';
import { ArrowLeft, ImagePlus, Save, Tags } from 'lucide-react';
import { Category } from '../../types';

type Mode = 'create' | 'edit';

export function AdminCategoryForm({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const categories = useCategories();
  const category = useMemo(
    () => categories.find((item) => item.id === categoryId),
    [categories, categoryId]
  );
  const isEdit = mode === 'edit';
  const [imagePreview, setImagePreview] = useState(category?.image ?? '');
  const [imageValue, setImageValue] = useState(category?.image ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadCategoryImage(file);
      setImagePreview(url);
      setImageValue(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get('name') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const image = imageValue || String(formData.get('imageUrl') || '').trim();

    if (!name || !image) {
      setError('Category name and image are required.');
      return;
    }

    const nextCategory: Category = {
      id: category?.id ?? `cat-${Date.now()}`,
      name,
      image
    };

    const nextCategories = category
      ? categories.map((item) => (item.id === category.id ? nextCategory : item))
      : [nextCategory, ...categories];

    saveCategories(nextCategories);
    try {
      await syncCategoriesToSupabase(nextCategories);
      navigate('/admin/categories');
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : 'Failed to save category.');
    }
    void description;
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/categories')}
          className="p-2 rounded-lg border border-accent bg-white hover:bg-accent/20 transition-colors"
          aria-label="Go back to categories">
          <ArrowLeft className="w-4 h-4 text-text" />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-text">
            {isEdit ? 'Edit Category' : 'Add Category'}
          </h1>
          <p className="text-text-light text-sm mt-1">
            {isEdit
              ? 'Update the category name and image used across the store.'
              : 'Create a new category for your products and filters.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="bg-white rounded-2xl shadow-soft border border-accent p-6">
          <div className="grid grid-cols-1 gap-4">
            <Field name="name" label="Category Name" defaultValue={category?.name ?? ''} />
            <label className="block text-sm font-medium text-text-light mb-2">Image URL</label>
            <input
              name="imageUrl"
              defaultValue={category?.image ?? ''}
              onChange={(e) => {
                setImageValue(e.target.value);
                setImagePreview(e.target.value);
              }}
              placeholder="https://..."
              className="w-full rounded-xl border border-accent bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0])}
              className="w-full rounded-xl border border-dashed border-accent bg-white px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white hover:file:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {uploading ? <p className="text-xs text-text-light">Uploading image...</p> : null}
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Description</label>
              <textarea
                rows={5}
                name="description"
                defaultValue=""
                placeholder="Optional short description for your team..."
                className="w-full rounded-xl border border-accent bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-premium px-5 py-3 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Category
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/categories')}
              className="px-5 py-3 rounded-xl border border-accent text-text-light hover:text-text hover:bg-accent/20 transition-colors">
              Cancel
            </button>
          </div>
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-soft border border-accent p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ImagePlus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-text">Category Preview</h2>
                <p className="text-sm text-text-light">This is how the category will be represented.</p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-accent">
              <div className="aspect-[16/10] bg-accent/15">
                {imagePreview ? (
                  <img src={imagePreview} alt={category?.name ?? 'New Category'} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-text">{category?.name ?? 'New Category'}</h3>
                <p className="text-sm text-text-light mt-1">
                  Products assigned here will appear in admin filters and storefront sections.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white shadow-soft">
            <div className="flex items-center gap-3 mb-3">
              <Tags className="w-5 h-5" />
              <h2 className="font-semibold">Tips</h2>
            </div>
            <ul className="space-y-2 text-sm text-white/90">
              <li>Upload a category image directly from gallery.</li>
              <li>New categories are saved to Supabase settings.</li>
              <li>Selected categories will appear in product form immediately.</li>
            </ul>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

function Field({ label, defaultValue, name }: { label: string; defaultValue: string; name: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-light mb-2">{label}</label>
      <input
        name={name}
        type="text"
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-accent bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
