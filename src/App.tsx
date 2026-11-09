import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Wishlist } from './pages/Wishlist';
import { OrderSuccess } from './pages/OrderSuccess';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { StoreProvider } from './context/StoreContext';
// Admin Pages
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/Products';
import { AdminCategories } from './pages/admin/Categories';
import { AdminOrders } from './pages/admin/Orders';
import { AdminCoupons } from './pages/admin/Coupons';
import { AdminSales } from './pages/admin/Sales';
import { AdminSettings } from './pages/admin/Settings';
import { AdminProductForm } from './pages/admin/ProductForm';
import { AdminCategoryForm } from './pages/admin/CategoryForm';
export function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes (No Main Layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/new" element={<AdminProductForm mode="create" />} />
          <Route path="/admin/products/:productId/edit" element={<AdminProductForm mode="edit" />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/categories/new" element={<AdminCategoryForm mode="create" />} />
          <Route path="/admin/categories/:categoryId/edit" element={<AdminCategoryForm mode="edit" />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/sales" element={<AdminSales />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* Storefront Routes (With Main Layout) */}
          <Route
            path="*"
            element={
            <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/categories" element={<Shop />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/order-success" element={<OrderSuccess />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            } />
          
        </Routes>
      </BrowserRouter>
    </StoreProvider>);

}
