import React, { useMemo, useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Search, Filter, Eye, Printer, FileText, CheckCircle2, XCircle } from 'lucide-react';
import {
  Order,
  clearOrders,
  clearOrdersFromSupabase,
  deleteOrder,
  deleteOrderFromSupabase,
  loadOrdersFromSupabase,
  readOrders,
  saveOrders,
  syncOrdersToSupabase,
  updateOrderStatus
} from '../../data/orders';

const formatRs = (value: number) => `Rs ${value.toLocaleString('en-PK')}`;

export function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>(() => readOrders());

  useEffect(() => {
    const refresh = () => setOrders(readOrders());
    window.addEventListener('storage', refresh);
    window.addEventListener('mp_orders_changed', refresh);
    (async () => {
      const remote = await loadOrdersFromSupabase();
      if (remote) {
        saveOrders(remote);
        setOrders(remote);
      }
    })();
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('mp_orders_changed', refresh);
    };
  }, []);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        [order.id, order.customerName, order.phone, order.whatsapp, order.city]
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ),
    [orders, searchTerm]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Accepted':
        return 'bg-emerald-100 text-emerald-700';
      case 'Processing':
        return 'bg-blue-100 text-blue-700';
      case 'Shipped':
        return 'bg-purple-100 text-purple-700';
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      case 'Rejected':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const setStatus = (id: string, status: Order['status']) => {
    updateOrderStatus(id, status);
    setOrders(readOrders());
    syncOrdersToSupabase(readOrders());
  };

  const handleDeleteOrder = async (orderId: string) => {
    const confirmed = window.confirm('Delete this order permanently?');
    if (!confirmed) return;
    try {
      await deleteOrderFromSupabase(orderId);
      deleteOrder(orderId);
      setOrders(readOrders());
    } catch (error) {
      console.error('Failed to delete order from Supabase', error);
      window.alert('Delete failed. Please check Supabase delete policies and try again.');
    }
  };

  const handleClearAllOrders = async () => {
    const confirmed = window.confirm('Clear all orders from admin and Supabase?');
    if (!confirmed) return;
    try {
      await clearOrdersFromSupabase();
      clearOrders();
      setOrders([]);
    } catch (error) {
      console.error('Failed to clear orders from Supabase', error);
      window.alert('Clear all failed. Please check Supabase delete policies and try again.');
    }
  };

  const downloadOrderSummary = (order: Order) => {
    const rows = order.items
      .map(
        (item) => `
          <tr>
            <td>${item.name}</td>
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
            .sheet { max-width: 900px; margin: 24px auto; background: white; border: 1px solid #d7e3dd; border-radius: 20px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #0f6b53, #19a57f); color: white; padding: 28px; }
            .header h1 { margin: 0 0 6px; font-size: 26px; }
            .content { padding: 28px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px 24px; margin-bottom: 22px; }
            .field { padding: 12px 14px; background: #f8fbf9; border: 1px solid #e4eee8; border-radius: 14px; }
            .field .label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #6c7d75; margin-bottom: 4px; }
            .field .value { font-size: 14px; font-weight: 600; color: #102018; word-break: break-word; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { padding: 12px 10px; border-bottom: 1px solid #e6eee9; font-size: 14px; }
            th { text-align: left; color: #567064; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
            .totals { margin-top: 20px; display: grid; gap: 10px; }
            .total-row { display: flex; justify-content: space-between; padding: 10px 14px; border-radius: 12px; background: #f8fbf9; }
            .grand { background: #0f6b53; color: white; font-weight: 700; }
            @media print { body { background: white; } .sheet { margin: 0; border-radius: 0; border: 0; } }
          </style>
        </head>
        <body>
          <div class="sheet">
            <div class="header">
              <h1>Order Invoice</h1>
              <div>Modern Pet Care & Stylish Fish Palace</div>
            </div>
            <div class="content">
              <div class="grid">
                <div class="field"><span class="label">Order ID</span><span class="value">${order.id}</span></div>
                <div class="field"><span class="label">Status</span><span class="value">${order.status}</span></div>
                <div class="field"><span class="label">Customer</span><span class="value">${order.customerName}</span></div>
                <div class="field"><span class="label">Date</span><span class="value">${new Date(order.createdAt).toLocaleString()}</span></div>
                <div class="field"><span class="label">Phone</span><span class="value">${order.phone}</span></div>
                <div class="field"><span class="label">WhatsApp</span><span class="value">${order.whatsapp}</span></div>
                <div class="field" style="grid-column: 1 / -1;"><span class="label">Address</span><span class="value">${order.streetAddress}, ${order.area}, ${order.city}, ${order.postalCode}</span></div>
                <div class="field" style="grid-column: 1 / -1;"><span class="label">Landmark / Note</span><span class="value">${order.landmark || '-'} ${order.orderNote ? ` | ${order.orderNote}` : ''}</span></div>
              </div>
              <table>
                <thead><tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th></tr></thead>
                <tbody>${rows}</tbody>
              </table>
              <div class="totals">
                <div class="total-row"><span>Subtotal</span><strong>Rs ${order.subtotal.toFixed(2)}</strong></div>
                <div class="total-row"><span>Tax</span><strong>Rs ${order.tax.toFixed(2)}</strong></div>
                <div class="total-row"><span>Shipping</span><strong>Rs ${order.shipping.toFixed(2)}</strong></div>
                <div class="total-row"><span>Discount</span><strong>Rs ${order.discount.toFixed(2)}</strong></div>
                <div class="total-row grand"><span>Total</span><strong>Rs ${order.total.toFixed(2)}</strong></div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.id}-invoice.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printOrder = (order: Order) => {
    const popup = window.open('', '_blank', 'width=900,height=700');
    if (!popup) return;
    popup.document.write(`
      <html>
        <head>
          <title>${order.id} Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
            h1 { margin-bottom: 16px; }
            .row { display: flex; justify-content: space-between; margin: 6px 0; }
            .box { border: 1px solid #ddd; padding: 16px; border-radius: 12px; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border-bottom: 1px solid #eee; padding: 8px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Order Invoice</h1>
          <div class="box">
            <div class="row"><strong>Order ID</strong><span>${order.id}</span></div>
            <div class="row"><strong>Customer</strong><span>${order.customerName}</span></div>
            <div class="row"><strong>Phone</strong><span>${order.phone}</span></div>
            <div class="row"><strong>WhatsApp</strong><span>${order.whatsapp}</span></div>
            <div class="row"><strong>Status</strong><span>${order.status}</span></div>
          </div>
          <div class="box">
            <div class="row"><strong>Address</strong><span>${order.streetAddress}, ${order.area}, ${order.city}</span></div>
            <div class="row"><strong>Landmark</strong><span>${order.landmark || '-'}</span></div>
            <div class="row"><strong>Postal Code</strong><span>${order.postalCode}</span></div>
          </div>
          <table>
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) =>
                    `<tr><td>${item.name}</td><td>${item.quantity}</td><td>Rs ${(
                      item.salePrice ?? item.price
                    ).toFixed(2)}</td></tr>`
                )
                .join('')}
            </tbody>
          </table>
          <div class="box" style="margin-top:16px;">
            <div class="row"><span>Subtotal</span><strong>Rs ${order.subtotal.toFixed(2)}</strong></div>
            <div class="row"><span>Tax</span><strong>Rs ${order.tax.toFixed(2)}</strong></div>
            <div class="row"><span>Shipping</span><strong>Rs ${order.shipping.toFixed(2)}</strong></div>
            <div class="row"><span>Discount</span><strong>Rs ${order.discount.toFixed(2)}</strong></div>
            <div class="row"><span>Total</span><strong>Rs ${order.total.toFixed(2)}</strong></div>
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    popup.document.close();
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-text">Orders</h1>
          <p className="text-text-light text-sm mt-1">
            Manage and track customer orders.
          </p>
        </div>
        <button
          onClick={handleClearAllOrders}
          className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
          Clear All Orders
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-accent overflow-hidden">
        <div className="p-4 border-b border-accent flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              type="text"
              placeholder="Search by order ID, name, phone, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
          </div>
          <button className="btn-outline py-2 px-4 text-sm flex items-center gap-2 whitespace-nowrap">
            <Filter className="w-4 h-4" /> Filter Status
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-accent/30 text-xs uppercase tracking-wider text-text-light border-b border-accent">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Address</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-accent/10 transition-colors align-top">
                  <td className="p-4 font-medium text-sm text-primary">
                    <div>{order.id}</div>
                    <div className="text-xs text-text-light mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text">
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-xs text-text-light">Coupon: {order.couponCode || '-'}</div>
                    <div className="text-xs text-text-light">Items: {order.items.length}</div>
                  </td>
                  <td className="p-4 text-sm text-text-light">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover border border-accent bg-white"
                          />
                          <div className="min-w-0">
                            <div className="font-medium text-text truncate">{item.name}</div>
                            <div className="text-xs">
                              Qty {item.quantity} | Rs {(item.salePrice ?? item.price).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-text-light">
                    <div>{order.phone}</div>
                    <div>{order.whatsapp}</div>
                    <div>{order.email}</div>
                  </td>
                  <td className="p-4 text-sm text-text-light">
                    <div>{order.streetAddress}</div>
                    <div>{order.area}</div>
                    <div>{order.city} {order.postalCode}</div>
                    <div>{order.landmark || '-'}</div>
                  </td>
                  <td className="p-4 text-sm font-medium">
                    <div>{formatRs(order.total)}</div>
                    <div className="text-xs text-text-light">Discount: {formatRs(order.discount)}</div>
                  </td>
                  <td className="p-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      <button
                        onClick={() => setStatus(order.id, 'Accepted')}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Accept Order">
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setStatus(order.id, 'Rejected' as Order['status'])}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Reject Order">
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setStatus(order.id, 'Processing')}
                        className="px-3 py-1.5 text-xs rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        title="Mark Processing">
                        Processing
                      </button>
                      <button
                        onClick={() => setStatus(order.id, 'Delivered')}
                        className="px-3 py-1.5 text-xs rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                        title="Mark Delivered">
                        Delivered
                      </button>
                      <button
                        onClick={() => setStatus(order.id, 'Cancelled')}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancel Order">
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => printOrder(order)}
                        className="p-1 text-text-light hover:text-primary transition-colors"
                        title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => downloadOrderSummary(order)}
                        className="p-1 text-text-light hover:text-primary transition-colors"
                        title="Generate Invoice">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => printOrder(order)}
                        className="p-1 text-text-light hover:text-primary transition-colors"
                        title="Print Invoice">
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                        title="Delete Order">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-sm text-text-light">
                    No orders available yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
