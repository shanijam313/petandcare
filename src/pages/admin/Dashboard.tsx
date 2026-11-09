import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight } from
'lucide-react';
import { useCategories } from '../../data/categories';
import { useCatalogProducts } from '../../data/catalog';
import { getOrderStats } from '../../data/orders';
export function AdminDashboard() {
  const products = useCatalogProducts();
  const categories = useCategories();
  const { totals, revenue, acceptedOrders, totalCustomers } = getOrderStats();
  const stats = [
  {
    title: "Today's Sales",
    value: `Rs ${revenue.toLocaleString('en-PK')}`,
    icon: DollarSign,
    trend: `${acceptedOrders.length} accepted`,
    isPositive: true
  },
  {
    title: 'Monthly Sales',
    value: `Rs ${revenue.toLocaleString('en-PK')}`,
    icon: TrendingUp,
    trend: 'Accepted orders only',
    isPositive: true
  },
  {
    title: 'Total Orders',
    value: String(acceptedOrders.length),
    icon: ShoppingBag,
    trend: `${totals.rejected} rejected excluded`,
    isPositive: true
  },
  {
    title: 'Total Customers',
    value: String(totalCustomers),
    icon: Users,
    trend: `${totals.delivered} delivered`,
    isPositive: true
  },
  {
    title: 'Total Products',
    value: String(products.length),
    icon: Package,
    trend: `${categories.length} categories`,
    isPositive: true
  }];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-text">
          Dashboard Overview
        </h1>
        <p className="text-text-light text-sm mt-1">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, i) =>
        <div
          key={i}
          className="bg-white p-5 rounded-2xl shadow-soft border border-accent">
          
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span
              className={`flex items-center text-xs font-medium ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              
                {stat.isPositive ?
              <ArrowUpRight className="w-3 h-3 mr-1" /> :

              <ArrowDownRight className="w-3 h-3 mr-1" />
              }
                {stat.trend}
              </span>
            </div>
            <h3 className="text-text-light text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold text-text">{stat.value}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-soft border border-accent">
          <h3 className="font-serif font-bold text-lg mb-6">
            Revenue Overview
          </h3>
          <div className="h-64 flex items-end gap-2 sm:gap-4">
            {[40, 70, 45, 90, 65, 85, 100, 60, 75, 50, 80, 95].map(
              (height, i) =>
              <div key={i} className="flex-1 flex flex-col justify-end group">
                  <div
                  className="w-full bg-primary/20 group-hover:bg-primary rounded-t-sm transition-colors relative"
                  style={{
                    height: `${height}%`
                  }}>
                  
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      Rs {height * 100}
                    </div>
                  </div>
                </div>

            )}
          </div>
          <div className="flex justify-between mt-4 text-xs text-text-light">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 rounded-2xl shadow-soft border border-accent">
          <h3 className="font-serif font-bold text-lg mb-6">Order Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <span className="font-bold">{totals.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium">Accepted</span>
              </div>
              <span className="font-bold">{totals.accepted}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-sm font-medium">Processing</span>
              </div>
              <span className="font-bold">{totals.processing}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm font-medium">Shipped</span>
              </div>
              <span className="font-bold">{totals.shipped}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <span className="font-bold">{totals.delivered}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm font-medium">Cancelled</span>
              </div>
              <span className="font-bold">{totals.cancelled}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-sm font-medium">Rejected</span>
              </div>
              <span className="font-bold">{totals.rejected}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>);

}
