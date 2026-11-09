import React from 'react';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
export function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useStore();
  const grandTotal = cartTotal;
  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-10 h-10 text-text-light" />
        </div>
        <h2 className="text-3xl font-serif font-bold mb-4">
          Your cart is empty
        </h2>
        <p className="text-text-light mb-8">
          Looks like you haven't added any premium items to your cart yet.
        </p>
        <Link to="/shop" className="btn-premium inline-block">
          Continue Shopping
        </Link>
      </div>);

  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold mb-10">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-soft border border-accent overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-6 bg-accent/30 border-b border-accent text-sm font-medium text-text-light uppercase tracking-wider">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            <div className="divide-y divide-accent">
              {cart.map((item) =>
              <div
                key={item.id}
                className="p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center">
                
                  <div className="col-span-6 flex items-center gap-4 w-full">
                    <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl border border-accent" />
                  
                    <div>
                      <Link
                      to={`/product/${item.id}`}
                      className="font-serif font-semibold text-text hover:text-primary transition-colors line-clamp-2">
                      
                        {item.name}
                      </Link>
                      <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 mt-2">
                      
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-center w-full sm:w-auto flex justify-between sm:block">
                    <span className="sm:hidden text-text-light">Price:</span>
                    <span className="font-medium">
                      Rs {(item.salePrice || item.price).toFixed(2)}
                    </span>
                  </div>

                  <div className="col-span-2 flex justify-center w-full sm:w-auto">
                    <div className="flex items-center border border-accent rounded-full bg-white">
                      <button
                      onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-text-light hover:text-primary">
                      
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                      onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-text-light hover:text-primary">
                      
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-right w-full sm:w-auto flex justify-between sm:block">
                    <span className="sm:hidden text-text-light">Total:</span>
                    <span className="font-semibold text-lg text-primary">
                      Rs {((item.salePrice || item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-soft border border-accent p-8 sticky top-24">
            <h2 className="text-2xl font-serif font-bold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-text-light">Subtotal</span>
                <span className="font-medium">Rs {cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-accent pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-serif font-semibold text-lg">Total</span>
                <span className="font-semibold text-2xl text-primary">
                  Rs {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="btn-premium w-full block text-center">
              
              Proceed to Checkout
            </Link>

            <div className="mt-6 text-center">
              <Link
                to="/shop"
                className="text-sm text-text-light hover:text-primary transition-colors">
                
                or Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
