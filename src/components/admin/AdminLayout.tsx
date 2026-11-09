import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Ticket,
  BadgePercent,
  Settings,
  LogOut,
  Menu,
  X } from
'lucide-react';
import { LogoMark } from '../LogoMark';
import { isAdminAuthenticated, setAdminAuthenticated } from '../../lib/adminAuth';
import { loadCatalogProductsFromSupabase } from '../../data/catalog';
import { loadCouponsFromSupabase } from '../../data/coupons';
import { loadOrdersFromSupabase } from '../../data/orders';
export function AdminLayout({ children }: {children: React.ReactNode;}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isAdminAuthenticated()) return;
      try {
        await Promise.all([
          loadCatalogProductsFromSupabase(),
          loadOrdersFromSupabase(),
          loadCouponsFromSupabase()
        ]);
      } finally {
        if (cancelled) return;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);
  const handleLogout = () => {
    setAdminAuthenticated(false);
    navigate('/admin/login');
  };
  const menuItems = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin'
  },
  {
    name: 'Products',
    icon: Package,
    path: '/admin/products'
  },
  {
    name: 'Categories',
    icon: Tags,
    path: '/admin/categories'
  },
  {
    name: 'Orders',
    icon: ShoppingCart,
    path: '/admin/orders'
  },
  {
    name: 'Coupons',
    icon: Ticket,
    path: '/admin/coupons'
  },
  {
    name: 'Sale Manager',
    icon: BadgePercent,
    path: '/admin/sales'
  },
  {
    name: 'Settings',
    icon: Settings,
    path: '/admin/settings'
  }];

  return (
    <div className="min-h-screen bg-accent/30 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setIsMobileOpen(false)} />

      }

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-accent transform transition-transform duration-300 lg:translate-x-0 lg:static lg:flex-shrink-0 flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        <div className="p-6 border-b border-accent flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            <LogoMark size="sm" />
            <span className="font-serif font-bold text-lg text-primary">
              Admin
            </span>
          </Link>
          <button className="lg:hidden" onClick={() => setIsMobileOpen(false)}>
            <X className="w-5 h-5 text-text-light" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-text-light hover:bg-accent hover:text-text'}`}>
                
                <item.icon
                  className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                
                {item.name}
              </Link>);

          })}
        </nav>

        <div className="p-4 border-t border-accent">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
            
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-accent h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <button
            className="lg:hidden p-2 -ml-2 text-text-light hover:text-text"
            onClick={() => setIsMobileOpen(true)}>
            
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" /> {/* Spacer */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="text-sm text-primary hover:underline hidden sm:block">
              
              View Store
            </Link>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-text font-medium">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>);

}
