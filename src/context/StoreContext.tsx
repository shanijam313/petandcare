import React, { useEffect, useState, createContext, useContext } from 'react';
import { CartItem, Product } from '../types';
import { loadCouponsFromSupabase, readAppliedCoupon, clearAppliedCoupon } from '../data/coupons';
interface StoreContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  isInCart: (productId: string) => boolean;
  appliedCoupon: ReturnType<typeof readAppliedCoupon>;
  clearCoupon: () => void;
}
const fallbackStore: StoreContextType = {
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartTotal: 0,
  cartCount: 0,
  wishlist: [],
  toggleWishlist: () => {},
  isInWishlist: () => false,
  isInCart: () => false,
  appliedCoupon: null,
  clearCoupon: () => {}
};

const StoreContext = createContext<StoreContextType>(fallbackStore);
export function StoreProvider({ children }: {children: React.ReactNode;}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState(() => readAppliedCoupon());
  useEffect(() => {
    (async () => {
      await loadCouponsFromSupabase();
    })();
    const refresh = () => setAppliedCoupon(readAppliedCoupon());
    window.addEventListener('storage', refresh);
    window.addEventListener('mp_applied_coupon_changed', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('mp_applied_coupon_changed', refresh);
    };
  }, []);
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
        item.id === product.id ?
        {
          ...item,
          quantity: item.quantity + quantity
        } :
        item
        );
      }
      return [
      ...prev,
      {
        ...product,
        quantity
      }];

    });
  };
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
    prev.map((item) =>
    item.id === productId ?
    {
      ...item,
      quantity
    } :
    item
    )
      );
  };
  const clearCart = () => {
    setCart([]);
  };
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };
  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };
  const isInCart = (productId: string) => {
    return cart.some((item) => item.id === productId);
  };
  const clearCoupon = () => clearAppliedCoupon();
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  return (
    <StoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isInCart,
        appliedCoupon,
        clearCoupon,
        clearCart
      }}>
      
      {children}
    </StoreContext.Provider>);

}
export function useStore() {
  const context = useContext(StoreContext);
  return context;
}
