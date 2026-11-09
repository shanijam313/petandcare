import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCategories } from '../data/categories';
import { useCatalogProducts } from '../data/catalog';
import { ProductCard } from '../components/ProductCard';
import { Filter, ChevronDown } from 'lucide-react';
import { Seo } from '../components/Seo';
export function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [searchParams] = useSearchParams();
  const products = useCatalogProducts();
  const categories = useCategories();
  React.useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);
  const filteredProducts = products.filter((p) =>
  selectedCategory ? p.categoryId === selectedCategory : true
  ).sort((a, b) => {
    if (sortBy === 'price-low')
    return (a.salePrice || a.price) - (b.salePrice || b.price);
    if (sortBy === 'price-high')
    return (b.salePrice || b.price) - (a.salePrice || a.price);
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured
  });
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Seo
        title="Shop Pet Food Online Pakistan | Cat Food, Dog Food & Fish Supplies"
        description="Browse premium pet supplies in Pakistan: dog food, cat food, pet medicine, fish food, aquarium fish, fish tanks, grooming products, and accessories."
        keywords={[
          'Online Pet Shop',
          'Pet Food',
          'Dog Food',
          'Cat Food',
          'Pet Accessories',
          'Pet Medicine',
          'Pet Grooming',
          'Fish Food',
          'Aquarium Fish',
          'Fish Tanks',
          'Aquarium Accessories',
          'Fish Medicine',
          'Pet Supplies',
          'Pakistan'
        ]}
        canonicalPath="/shop"
      />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text mb-3 sm:mb-4">
          Shop Pet Products Online
        </h1>
        <p className="text-sm sm:text-base text-text-light">
          Discover premium pet food, fish food, accessories, grooming items,
          litter, treats, and medicine delivered for pet owners in Pakistan.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-soft border border-accent lg:sticky lg:top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-accent">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="font-serif font-semibold text-lg">Filters</h2>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-4">Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 max-h-none lg:max-h-96 overflow-visible lg:overflow-y-auto pr-0 lg:pr-2 custom-scrollbar">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors ${selectedCategory === null ? 'bg-primary text-white' : 'hover:bg-accent text-text-light'}`}>
                  
                  All Categories
                </button>
                {categories.map((cat) =>
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors ${selectedCategory === cat.id ? 'bg-primary text-white' : 'hover:bg-accent text-text-light'}`}>
                  
                    {cat.name}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 bg-white p-4 rounded-xl shadow-soft border border-accent gap-4">
            <div className="text-sm text-text-light">
              Showing{' '}
              <span className="font-semibold text-text">
                {filteredProducts.length}
              </span>{' '}
              products
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-light">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-accent/50 border border-accent rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                  
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-text-light pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ?
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) =>
            <ProductCard key={product.id} product={product} />
            )}
            </div> :

          <div className="text-center py-20 bg-white rounded-2xl border border-accent">
              <h3 className="text-xl font-serif font-medium mb-2">
                No products found
              </h3>
              <p className="text-text-light">Try adjusting your filters.</p>
              <button
              onClick={() => setSelectedCategory(null)}
              className="mt-4 text-primary hover:underline">
              
                Clear all filters
              </button>
            </div>
          }
        </div>
      </div>
    </div>);

}
