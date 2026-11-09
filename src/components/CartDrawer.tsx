import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
export function CartDrawer({
  isOpen,
  onClose



}: {isOpen: boolean;onClose: () => void;}) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore();
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className="fixed inset-0 bg-black/50 z-50"
          onClick={onClose} />
        
          <motion.div
          initial={{
            x: '100%'
          }}
          animate={{
            x: 0
          }}
          exit={{
            x: '100%'
          }}
          transition={{
            type: 'spring',
            bounce: 0,
            duration: 0.4
          }}
          className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
          
            <div className="p-5 flex items-center justify-between border-b border-accent">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <span className="font-serif font-bold text-lg text-primary">
                  Your Cart
                </span>
              </div>
              <button
              onClick={onClose}
              className="p-2 text-text-light hover:text-primary transition-colors">
              
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ?
            <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-accent/50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-text-light" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-text mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-text-light mb-6">
                    Looks like you haven't added anything yet.
                  </p>
                  <button onClick={onClose} className="btn-premium">
                    Continue Shopping
                  </button>
                </div> :

            <div className="space-y-6">
                  {cart.map((item) =>
              <div key={item.id} className="flex gap-4">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-accent/30 flex-shrink-0">
                        <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover" />
                  
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-text text-sm line-clamp-2">
                            {item.name}
                          </h4>
                          <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-text-light hover:text-red-500 transition-colors p-1">
                      
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs text-text-light mb-2">
                          {item.categoryName}
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-accent rounded-full">
                            <button
                        onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-text hover:text-primary transition-colors">
                        
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                        onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-text hover:text-primary transition-colors">
                        
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="font-semibold text-text">
                            Rs {((item.salePrice || item.price) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
              )}
                </div>
            }
            </div>

            {cart.length > 0 &&
          <div className="p-5 border-t border-accent bg-accent/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-text-light">Subtotal</span>
                  <span className="font-serif font-bold text-xl text-text">
                    Rs {cartTotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-text-light mb-4 text-center">
                  Shipping, taxes, and discounts calculated at checkout.
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                to="/cart"
                onClick={onClose}
                className="btn-outline w-full text-center">
                
                    View Cart
                  </Link>
                  <Link
                to="/checkout"
                onClick={onClose}
                className="btn-premium w-full text-center">
                
                    Checkout
                  </Link>
                </div>
              </div>
          }
          </motion.div>
        </>
      }
    </AnimatePresence>);

}
