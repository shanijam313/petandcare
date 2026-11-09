import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
export function Wishlist() {
  const { wishlist } = useStore();
  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-text-light" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-text-light mb-8 text-lg">
            Save your favorite premium items here to review them later.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/shop" className="btn-premium inline-flex items-center gap-2">
              Explore Collection <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/cart" className="btn-outline inline-flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> View Cart
            </Link>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-serif font-bold text-text">Popular picks to save</h3>
              <p className="text-text-light text-sm mt-1">
                A few favorites from the store to get your wishlist started.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>);

  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-10">
        <Heart className="w-8 h-8 text-primary fill-primary/20" />
        <h1 className="text-4xl font-serif font-bold">My Wishlist</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) =>
        <ProductCard key={product.id} product={product} />
        )}
      </div>
    </div>);

}
