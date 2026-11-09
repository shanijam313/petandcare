export type OrderStatus = 'Pending' | 'Accepted' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Rejected';

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  quantity: number;
  image: string;
};

export type Order = {
  id: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  whatsapp: string;
  streetAddress: string;
  area: string;
  landmark: string;
  city: string;
  postalCode: string;
  orderNote: string;
  couponCode: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: 'online' | 'cod';
  status: OrderStatus;
  items: OrderItem[];
};

let orderCache: Order[] = [];

export function readOrders(): Order[] {
  return orderCache;
}

export function saveOrders(orders: Order[]) {
  orderCache = orders;
  window.dispatchEvent(new Event('mp_orders_changed'));
}

export function addOrder(order: Order) {
  const orders = readOrders();
  const next = [order, ...orders];
  saveOrders(next);
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  const orders = readOrders().map((order) =>
    order.id === orderId ? { ...order, status } : order
  );
  saveOrders(orders);
}

export function deleteOrder(orderId: string) {
  saveOrders(readOrders().filter((order) => order.id !== orderId));
}

export function clearOrders() {
  saveOrders([]);
}

export function getOrderStats() {
  const orders = readOrders();
  const totals = {
    pending: 0,
    accepted: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
    ,rejected: 0
  };

  orders.forEach((order) => {
    switch (order.status) {
      case 'Pending':
        totals.pending += 1;
        break;
      case 'Accepted':
        totals.accepted += 1;
        break;
      case 'Processing':
        totals.processing += 1;
        break;
      case 'Shipped':
        totals.shipped += 1;
        break;
      case 'Delivered':
        totals.delivered += 1;
        break;
      case 'Cancelled':
        totals.cancelled += 1;
        break;
      case 'Rejected':
        totals.rejected += 1;
        break;
    }
  });

  const acceptedOrders = orders.filter((order) => order.status === 'Accepted');
  const revenue = acceptedOrders.reduce((sum, order) => sum + order.total, 0);
  const totalCustomers = new Set(orders.map((order) => order.email)).size;

  return { orders, totals, revenue, acceptedOrders, totalCustomers };
}

export async function syncOrdersToSupabase(orders: Order[]) {
  const { supabase, hasSupabaseConfig } = await import('../lib/supabase');
  const { TABLES } = await import('./supabaseTables');
  if (!hasSupabaseConfig || !supabase) return;

  await supabase.from(TABLES.orderItems).delete().in(
    'order_id',
    orders.map((order) => order.id)
  );

  await supabase.from(TABLES.orders).upsert(
    orders.map((order) => ({
      id: order.id,
      payload: order
    })),
    { onConflict: 'id' }
  );

  const flattenedItems = orders.flatMap((order) =>
    order.items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      name: item.name,
      price: item.price,
      sale_price: item.salePrice,
      quantity: item.quantity,
      image: item.image
    }))
  );

  if (flattenedItems.length > 0) {
    await supabase.from('order_items').insert(flattenedItems);
  }
}

export async function deleteOrderFromSupabase(orderId: string) {
  const { supabase, hasSupabaseConfig } = await import('../lib/supabase');
  const { TABLES } = await import('./supabaseTables');
  if (!hasSupabaseConfig || !supabase) return;

  const [itemsResult, orderResult] = await Promise.all([
    supabase.from(TABLES.orderItems).delete().eq('order_id', orderId),
    supabase.from(TABLES.orders).delete().eq('id', orderId)
  ]);

  if (itemsResult.error) throw itemsResult.error;
  if (orderResult.error) throw orderResult.error;
}

export async function clearOrdersFromSupabase() {
  const { supabase, hasSupabaseConfig } = await import('../lib/supabase');
  const { TABLES } = await import('./supabaseTables');
  if (!hasSupabaseConfig || !supabase) return;

  const [{ error: itemsError }, { error: ordersError }] = await Promise.all([
    supabase.from(TABLES.orderItems).delete(),
    supabase.from(TABLES.orders).delete()
  ]);

  if (itemsError) throw itemsError;
  if (ordersError) throw ordersError;
}

export async function loadOrdersFromSupabase() {
  const { supabase, hasSupabaseConfig } = await import('../lib/supabase');
  const { TABLES } = await import('./supabaseTables');
  if (!hasSupabaseConfig || !supabase) return null;

  const { data, error } = await supabase.from(TABLES.orders).select('payload').order('created_at', { ascending: false });
  if (error) return null;
  const orders = (data ?? []).map((row: { payload: Order }) => row.payload);
  saveOrders(orders);
  return orders;
}
