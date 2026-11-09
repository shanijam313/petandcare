import React, { useState } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
const formatRs = (value: number) => `Rs ${value.toLocaleString('en-PK')}`;
import { Search, Mail, Phone } from 'lucide-react';
const MOCK_CUSTOMERS = [
{
  id: 'C-1001',
  name: 'Eleanor Rigby',
  email: 'eleanor@example.com',
  phone: '+1 202 555 0111',
  orders: 12,
  spent: 2450.0,
  joined: '2025-01-14'
},
{
  id: 'C-1002',
  name: 'James Thornton',
  email: 'james.t@example.com',
  phone: '+1 202 555 0122',
  orders: 5,
  spent: 3120.5,
  joined: '2025-03-02'
},
{
  id: 'C-1003',
  name: 'Sophia Laurent',
  email: 'sophia.l@example.com',
  phone: '+1 202 555 0133',
  orders: 8,
  spent: 1899.99,
  joined: '2025-04-21'
},
{
  id: 'C-1004',
  name: 'Marcus Chen',
  email: 'marcus.c@example.com',
  phone: '+1 202 555 0144',
  orders: 3,
  spent: 640.0,
  joined: '2025-06-10'
},
{
  id: 'C-1005',
  name: 'Isabella Moreau',
  email: 'bella.m@example.com',
  phone: '+1 202 555 0155',
  orders: 21,
  spent: 5420.75,
  joined: '2024-11-30'
},
{
  id: 'C-1006',
  name: 'Oliver Bennett',
  email: 'oliver.b@example.com',
  phone: '+1 202 555 0166',
  orders: 2,
  spent: 210.0,
  joined: '2026-02-18'
}];

export function AdminCustomers() {
  const [search, setSearch] = useState('');
  const filtered = MOCK_CUSTOMERS.filter(
    (c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-text mb-2">
          Customers
        </h1>
        <p className="text-text-light">Manage and review your customer base.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-soft border border-accent overflow-hidden">
        <div className="p-4 border-b border-accent">
          <div className="relative max-w-sm">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
            
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-accent/30 text-text-light uppercase text-xs tracking-wider">
              <tr>
                <th className="text-left font-medium px-6 py-4">Customer</th>
                <th className="text-left font-medium px-6 py-4">Contact</th>
                <th className="text-center font-medium px-6 py-4">Orders</th>
                <th className="text-right font-medium px-6 py-4">
                  Total Spent
                </th>
                <th className="text-right font-medium px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent">
              {filtered.map((c) =>
              <tr key={c.id} className="hover:bg-accent/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-premium flex items-center justify-center text-white font-serif font-semibold">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-text">{c.name}</div>
                        <div className="text-xs text-text-light">{c.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-light">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {c.email}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4" /> {c.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-medium">
                    {c.orders}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-primary">
                    {formatRs(c.spent)}
                  </td>
                  <td className="px-6 py-4 text-right text-text-light">
                    {c.joined}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>);

}
