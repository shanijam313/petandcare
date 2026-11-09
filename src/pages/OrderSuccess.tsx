import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScreenInit } from '../useScreenInit';
import { readOrders } from '../data/orders';
export function OrderSuccess() {
  useScreenInit();
  const location = useLocation();
  const orderId = (location.state as { orderId?: string } | undefined)?.orderId;
  const order = readOrders().find((item) => item.id === orderId) ?? readOrders()[0];
  const downloadReceipt = () => {
    if (!order) return;
    const rows = order.items
      .map(
        (item) => `
          <tr>
            <td style="display:flex;align-items:center;gap:10px;">
              <img src="${item.image}" alt="${item.name}" style="width:38px;height:38px;object-fit:cover;border-radius:10px;border:1px solid #d7e3dd;" />
              <span>${item.name}</span>
            </td>
            <td style="text-align:center;">${item.quantity}</td>
            <td style="text-align:right;">Rs ${(item.salePrice ?? item.price).toFixed(2)}</td>
          </tr>`
      )
      .join('');
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; margin: 0; background: #f4f7f5; color: #102018; }
            .sheet { max-width: 760px; margin: 24px auto; background: white; border: 1px solid #d7e3dd; border-radius: 20px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #0f6b53, #19a57f); color: white; padding: 28px; }
            .header h1 { margin: 0 0 6px; font-size: 26px; }
            .header p { margin: 0; opacity: 0.9; }
            .content { padding: 28px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 24px; margin-bottom: 22px; }
            .field { padding: 12px 14px; background: #f8fbf9; border: 1px solid #e4eee8; border-radius: 14px; }
            .field .label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #6c7d75; margin-bottom: 4px; }
            .field .value { font-size: 14px; font-weight: 600; color: #102018; word-break: break-word; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { padding: 12px 10px; border-bottom: 1px solid #e6eee9; font-size: 14px; }
            th { text-align: left; color: #567064; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
            .totals { margin-top: 20px; display: grid; gap: 10px; }
            .total-row { display: flex; justify-content: space-between; padding: 10px 14px; border-radius: 12px; background: #f8fbf9; }
            .grand { background: #0f6b53; color: white; font-weight: 700; }
            .footer { padding: 0 28px 28px; color: #6c7d75; font-size: 12px; }
            @media print { body { background: white; } .sheet { margin: 0; border-radius: 0; border: 0; } }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="header">
              <h1>Order Receipt</h1>
              <p>Modern Pet Care & Stylish Fish Palace</p>
            </div>
            <div class="content">
              <div class="grid">
                <div class="field"><span class="label">Order ID</span><span class="value">${order.id}</span></div>
                <div class="field"><span class="label">Date</span><span class="value">${new Date(order.createdAt).toLocaleString()}</span></div>
                <div class="field"><span class="label">Customer</span><span class="value">${order.customerName}</span></div>
                <div class="field"><span class="label">Phone</span><span class="value">${order.phone}</span></div>
                <div class="field"><span class="label">WhatsApp</span><span class="value">${order.whatsapp}</span></div>
                <div class="field"><span class="label">Coupon</span><span class="value">${order.couponCode || '-'}</span></div>
                <div class="field" style="grid-column: 1 / -1;"><span class="label">Address</span><span class="value">${order.streetAddress}, ${order.area}, ${order.city}, ${order.postalCode}</span></div>
                <div class="field" style="grid-column: 1 / -1;"><span class="label">Landmark / Note</span><span class="value">${order.landmark || '-'} ${order.orderNote ? ` | ${order.orderNote}` : ''}</span></div>
              </div>
              <table>
                <thead>
                  <tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th></tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
              <div class="totals">
                <div class="total-row"><span>Subtotal</span><strong>Rs ${order.subtotal.toFixed(2)}</strong></div>
                <div class="total-row"><span>Discount</span><strong>Rs ${order.discount.toFixed(2)}</strong></div>
                <div class="total-row grand"><span>Total</span><strong>Rs ${order.total.toFixed(2)}</strong></div>
              </div>
            </div>
            <div class="footer">
              Thank you for shopping with us.
            </div>
          </div>
        </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.id}-receipt.html`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95
        }}
        animate={{
          opacity: 1,
          scale: 1
        }}
        transition={{
          duration: 0.5
        }}
        className="max-w-md w-full bg-white rounded-3xl shadow-soft p-10 text-center border border-accent">
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-secondary" />
        </div>

        <h1 className="text-3xl font-serif font-bold text-text mb-4">
          Order Confirmed!
        </h1>

        <p className="text-text-light mb-8">
          Thank you for your purchase. Your order has been received and is
          currently being processed. We'll send you an email with tracking
          information shortly.
        </p>

        <div className="bg-accent/30 rounded-2xl p-6 mb-8 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-text-light text-sm">Order Number</span>
            <span className="font-medium text-text text-sm">
              #{order?.id ?? 'ORD-000000'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-light text-sm">Estimated Delivery</span>
            <span className="font-medium text-text text-sm">
              3-5 Business Days
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={downloadReceipt}
            className="btn-outline flex items-center justify-center gap-2">
            <Download className="w-5 h-5" /> Download Receipt
          </button>
          <Link
            to="/shop"
            className="btn-premium flex items-center justify-center gap-2">
            
            <ShoppingBag className="w-5 h-5" /> Continue Shopping
          </Link>
          <Link
            to="/"
            className="btn-outline flex items-center justify-center gap-2">
            
            Return to Home <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </div>);

}
