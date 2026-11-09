import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSaleEndForProduct, useCatalogProducts } from '../data/catalog';
import { useStore } from '../context/StoreContext';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Minus,
  Plus } from
'lucide-react';
import { ProductCard } from '../components/ProductCard';
export function ProductDetails() {
  const { id } = useParams<{
    id: string;
  }>();
  const products = useCatalogProducts();
  const product = products.find((p) => p.id === id);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [now, setNow] = useState(() => Date.now());

  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif mb-4">Product not found</h2>
        <Link to="/shop" className="btn-outline">
          Return to Shop
        </Link>
      </div>);

  }
  const isWishlisted = isInWishlist(product.id);
  const saleEndsAt = product.salePrice ? getSaleEndForProduct(product.id) : null;
  const saleRemainingMs = saleEndsAt ? Math.max(0, saleEndsAt - now) : 0;
  const saleRemainingSeconds = Math.floor(saleRemainingMs / 1000);
  const saleHours = Math.floor(saleRemainingSeconds / 3600);
  const saleMins = Math.floor((saleRemainingSeconds % 3600) / 60);
  const saleSecs = saleRemainingSeconds % 60;
  const relatedProducts = products.filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 4);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-8 text-text-light flex items-center gap-2">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary transition-colors">
          Shop
        </Link>
        <span>/</span>
        <span className="text-text">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-accent/30 border border-accent">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover" />
            
          </div>
          {/* Thumbnails placeholder if multiple images existed */}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {product.badge &&
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider mb-4 w-max">
              {product.badge}
            </span>
          }
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-text mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) =>
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />

              )}
            </div>
            <span className="text-sm text-text-light">
              {product.reviews} Reviews
            </span>
          </div>

          <div className="flex items-end gap-4 mb-6">
            {product.salePrice ?
            <>
                <span className="text-4xl font-semibold text-red-500">
                  Rs {product.salePrice.toFixed(2)}
                </span>
                <span className="text-xl text-text-light line-through mb-1">
                  Rs {product.price.toFixed(2)}
                </span>
                {saleEndsAt &&
                <span className="text-sm font-medium px-3 py-1.5 rounded-full bg-red-50 text-red-600">
                    Sale ends in {String(saleHours).padStart(2, '0')}:{String(saleMins).padStart(2, '0')}:{String(saleSecs).padStart(2, '0')}
                  </span>
                }
              </> :

            <span className="text-4xl font-semibold text-text">
                Rs {product.price.toFixed(2)}
              </span>
            }
          </div>

          <p className="text-text-light mb-8 leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-6 mb-8">
            <div className="flex items-center gap-4">
              <span className="font-medium w-24">Status:</span>
              <span
                className={
                product.stock > 0 ?
                'text-secondary font-medium' :
                'text-red-500 font-medium'
                }>
                
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium w-24">SKU:</span>
              <span className="text-text-light">{product.sku}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-accent rounded-full bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center text-text-light hover:text-primary transition-colors">
                
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() =>
                setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="w-12 h-12 flex items-center justify-center text-text-light hover:text-primary transition-colors">
                
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock === 0}
              className="flex-1 btn-premium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              
              <ShoppingBag className="w-5 h-5" /> Add to Cart
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${isWishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-accent bg-white text-text hover:border-primary hover:text-primary'}`}>
              
              <Heart
                className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-accent">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">
                Free Shipping
                <br />
                <span className="text-xs text-text-light font-normal">
                  On orders over PKR 15000
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">
                30 Days Return
                <br />
                <span className="text-xs text-text-light font-normal">
                  Money back guarantee
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">
                Secure Payment
                <br />
                <span className="text-xs text-text-light font-normal">
                  100% safe checkout
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex border-b border-accent mb-8">
          {['description', 'specifications', 'reviews'].map((tab) =>
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-sm font-medium uppercase tracking-wider transition-colors border-b-2 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-text-light hover:text-text'}`}>
            
              {tab}
            </button>
          )}
        </div>
        <div className="prose max-w-none text-text-light">
          {activeTab === 'description' &&
          <div>
              <p>{product.description}</p>
              <h4 className="text-text font-serif font-semibold mt-6 mb-4">
                Key Features
              </h4>
              <ul className="list-disc pl-5 space-y-2">
                {product.features.map((f, i) =>
              <li key={i}>{f}</li>
              )}
              </ul>
            </div>
          }
          {activeTab === 'specifications' &&
          <div className="bg-white rounded-xl border border-accent overflow-hidden max-w-2xl">
              {Object.entries(product.specifications).map(([key, val], i) =>
            <div
              key={key}
              className={`flex px-6 py-4 ${i % 2 === 0 ? 'bg-accent/20' : 'bg-white'}`}>
              
                  <span className="w-1/3 font-medium text-text">{key}</span>
                  <span className="w-2/3">{val}</span>
                </div>
            )}
            </div>
          }
          {activeTab === 'reviews' &&
          <div>
              <p>Customer reviews coming soon.</p>
            </div>
          }
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 &&
      <section>
          <h2 className="text-2xl font-serif font-bold mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) =>
          <ProductCard key={p.id} product={p} />
          )}
          </div>
        </section>
      }
    </div>);

}
