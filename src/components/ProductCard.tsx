import React from 'react';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { getSaleEndForProduct } from '../data/catalog';
export function ProductCard({ product }: {product: Product;}) {
  const { addToCart, toggleWishlist, isInWishlist, isInCart } = useStore();
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const saleEndsAt = product.salePrice ? getSaleEndForProduct(product.id) : null;
  const saleRemainingMs = saleEndsAt ? Math.max(0, saleEndsAt - now) : 0;
  const saleRemainingSeconds = Math.floor(saleRemainingMs / 1000);
  const saleHours = Math.floor(saleRemainingSeconds / 3600);
  const saleMins = Math.floor((saleRemainingSeconds % 3600) / 60);
  const saleSecs = saleRemainingSeconds % 60;
  const isWishlisted = isInWishlist(product.id);
  const isAddedToCart = isInCart(product.id);
  const discountPercent = product.salePrice && product.salePrice < product.price ?
  Math.round((1 - product.salePrice / product.price) * 100) :
  0;
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 border border-accent flex flex-col h-full">
      <div className="relative aspect-[4/3] sm:aspect-[4/5] overflow-hidden bg-accent/30">
        {/* Badges */}
        {product.badge &&
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
            <span
            className={`text-[10px] sm:text-[11px] md:text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full uppercase tracking-wider ${product.badge === 'Sale' ? 'bg-red-500 text-white' : product.badge === 'New Arrival' ? 'bg-secondary text-white' : 'bg-primary text-white'}`}>
            
              {product.badge}
            </span>
          </div>
        }

        {/* Discount Badge */}
        {product.salePrice &&
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
            <span className="bg-red-500 text-white text-[10px] sm:text-[11px] md:text-xs font-bold px-2 py-1.5 rounded-full">
              -{discountPercent}%
            </span>
          </div>
        }

        {/* Image */}
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          
        </Link>

        {/* Hover Actions */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-4 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300 flex justify-center gap-2 z-20">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white text-text hover:bg-primary hover:text-white'}`}>
            
            <Heart
              className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            
          </button>
          <Link
            to={`/product/${product.id}`}
            className="bg-white text-text hover:bg-primary hover:text-white w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-colors">
            
            <Eye className="w-5 h-5" />
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${isAddedToCart ? 'bg-emerald-500 text-white ring-2 ring-emerald-200' : 'bg-primary text-white hover:bg-primary-dark'}`}>
            
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="text-[10px] sm:text-[11px] md:text-xs text-text-light mb-2 uppercase tracking-wider font-medium">
          {product.categoryName}
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif font-semibold text-base sm:text-lg text-text mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-3 mt-auto">
          {[...Array(5)].map((_, i) =>
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />

          )}
          <span className="text-[10px] sm:text-[11px] md:text-xs text-text-light ml-1">
            ({product.reviews})
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {product.salePrice ?
          <>
            <span className="font-semibold text-base sm:text-lg text-red-500">
                Rs {product.salePrice.toFixed(2)}
              </span>
              <span className="text-sm sm:text-[15px] text-text-light line-through">
                Rs {product.price.toFixed(2)}
              </span>
              {saleEndsAt &&
              <span className="text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-red-600">
                  Ends in {String(saleHours).padStart(2, '0')}:{String(saleMins).padStart(2, '0')}:{String(saleSecs).padStart(2, '0')}
                </span>
              }
            </> :

          <span className="font-semibold text-base sm:text-lg text-text">
              Rs {product.price.toFixed(2)}
            </span>
          }
        </div>

        {/* Mobile Actions */}
        <div className="mt-4 flex items-center justify-between gap-2 sm:hidden">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className={`flex-1 h-11 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-colors ${isWishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-accent bg-white text-text'}`}>
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            <span>Wishlist</span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className={`flex-1 h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${isAddedToCart ? 'bg-emerald-500 text-white' : 'bg-primary text-white'}`}>
            <ShoppingBag className="w-4 h-4" />
            <span>{isAddedToCart ? 'Added' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>);

}
