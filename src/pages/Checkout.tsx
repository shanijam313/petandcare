import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Ticket, X } from 'lucide-react';
import { findCouponByCode, saveAppliedCoupon } from '../data/coupons';
import { addOrder, syncOrdersToSupabase } from '../data/orders';
export function Checkout() {
  const { cart, cartTotal, appliedCoupon, clearCoupon, clearCart } = useStore();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [lastOrderId, setLastOrderId] = useState('');
  const tax = 0;
  const shipping = 0;
  const couponDiscount = (() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') {
      return (cartTotal * appliedCoupon.value) / 100;
    }
    return Math.min(appliedCoupon.value, cartTotal);
  })();
  const grandTotal = Math.max(0, cartTotal - couponDiscount);
  const applyCoupon = () => {
    const coupon = findCouponByCode(couponCode);
    if (!coupon) {
      setCouponError('Invalid coupon code.');
      setCouponMessage('');
      return;
    }
    if (!coupon.active) {
      setCouponError('This coupon is inactive.');
      setCouponMessage('');
      return;
    }
    saveAppliedCoupon({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value
    });
    setCouponError('');
    setCouponMessage(`${coupon.code} applied successfully.`);
  };
  const removeCoupon = () => {
    clearCoupon();
    setCouponCode('');
    setCouponError('');
    setCouponMessage('Coupon removed.');
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `ORD-${Date.now()}`;
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName,
      email,
      phone,
      whatsapp,
      streetAddress,
      area,
      landmark,
      city,
      postalCode,
      orderNote,
      couponCode: appliedCoupon?.code ?? '',
      subtotal: cartTotal,
      tax,
      shipping,
      discount: couponDiscount,
      total: grandTotal,
      paymentMethod: 'cod',
      status: 'Pending',
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        salePrice: item.salePrice,
        quantity: item.quantity,
        image: item.images[0]
      }))
    };
    addOrder(order);
    try {
      await syncOrdersToSupabase([order]);
    } catch (error) {
      console.error('Failed to sync order to Supabase:', error);
    }
    clearCart();
    clearCoupon();
    setLastOrderId(orderId);
    setIsSubmitted(true);
    // In a real app, we'd clear cart and redirect to success page
    setTimeout(() => {
      navigate('/order-success', { state: { orderId } });
    }, 3000);
  };
  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <CheckCircle className="w-20 h-20 text-secondary mb-6" />
        <h1 className="text-4xl font-serif font-bold mb-4">Order Confirmed!</h1>
        <p className="text-text-light max-w-md">
          Thank you for your premium purchase. We've sent a confirmation email
          with your order details.
        </p>
        <p className="mt-3 text-sm text-text-light">
          Order ID: <span className="font-medium text-text">{lastOrderId}</span>
        </p>
      </div>);

  }
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-serif font-bold mb-10">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white p-8 rounded-3xl shadow-soft border border-accent">
              <h2 className="text-xl font-serif font-semibold mb-6">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Customer Name
                  </label>
                  <input
                    required
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="03xx-xxxxxxx"
                    className="w-full px-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    required
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="03xx-xxxxxxx"
                    className="w-full px-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white p-8 rounded-3xl shadow-soft border border-accent">
              <h2 className="text-xl font-serif font-semibold mb-6">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Street Address
                  </label>
                  <input
                    required
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="House no, street, block"
                    className="w-full px-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Area / Colony
                  </label>
                  <input
                    required
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Gulberg"
                    className="w-full px-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Near market / mosque"
                    className="w-full px-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">
                    City
                  </label>
                  <input
                    required
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City name"
                    className="w-full px-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Postal Code
                  </label>
                  <input
                    required
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postal code"
                    className="w-full px-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Order Note
                  </label>
                  <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Any delivery instructions for admin/rider"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                  
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-soft border border-accent">
              <h2 className="text-xl font-serif font-semibold mb-6 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                Coupon Code
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 px-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="btn-outline px-5 py-3">
                  Apply
                </button>
              </div>
              {couponError ? (
                <p className="mt-3 text-sm text-red-500">{couponError}</p>
              ) : null}
              {couponMessage ? (
                <p className="mt-3 text-sm text-secondary">{couponMessage}</p>
              ) : null}
              {appliedCoupon ? (
                <div className="mt-4 flex items-center justify-between rounded-xl bg-green-50 border border-green-200 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-green-700">
                      {appliedCoupon.code}
                    </p>
                    <p className="text-xs text-green-600">
                      {appliedCoupon.type === 'percent'
                        ? `${appliedCoupon.value}% discount applied`
                        : `Rs ${appliedCoupon.value} discount applied`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-green-700 hover:text-red-500 transition-colors"
                    aria-label="Remove coupon">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : null}
            </div>

            <button type="submit" className="btn-premium w-full py-4 text-lg">
              Place Order (Rs {grandTotal.toFixed(2)})
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-white rounded-3xl shadow-soft border border-accent p-8 sticky top-24">
            <h2 className="text-xl font-serif font-semibold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar pr-2">
              {cart.map((item) =>
              <div key={item.id} className="flex gap-4">
                  <div className="relative">
                    <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border border-accent" />
                  
                    <span className="absolute -top-2 -right-2 bg-text text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium line-clamp-2">
                      {item.name}
                    </h4>
                    <span className="text-sm text-text-light">
                      Rs {item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-accent pt-6 space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-text-light">Subtotal</span>
                <span className="font-medium">Rs {cartTotal.toFixed(2)}</span>
              </div>
              {appliedCoupon ? (
                <div className="flex justify-between">
                  <span className="text-text-light">Coupon ({appliedCoupon.code})</span>
                  <span className="font-medium text-green-600">
                    -Rs {couponDiscount.toFixed(2)}
                  </span>
                </div>
              ) : null}
              <div className="border-t border-accent pt-4 flex justify-between items-end">
                <span className="font-serif font-semibold text-lg">Total</span>
                <span className="font-semibold text-2xl text-primary">
                  Rs {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
