import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { LogoMark } from '../../components/LogoMark';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../lib/env';
import { setAdminAuthenticated } from '../../lib/adminAuth';
export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      email.trim().toLowerCase() !== ADMIN_EMAIL.trim().toLowerCase() ||
      password !== ADMIN_PASSWORD
    ) {
      setError('Invalid admin email or password.');
      return;
    }
    setError('');
    setAdminAuthenticated(true);
    navigate('/admin');
  };
  return (
    <div className="min-h-screen bg-accent/30 flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="max-w-md w-full bg-white rounded-3xl shadow-soft p-5 sm:p-8 border border-accent">
        
        <div className="flex justify-start mb-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <LogoMark size="lg" />
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-text">
            Admin Portal
          </h1>
          <p className="text-text-light text-sm mt-2">
            Sign in to manage your store
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
                placeholder="admin@modernpet.com" />
              
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm sm:text-base"
                placeholder="••••••••" />
              
            </div>
          </div>

          <button type="submit" className="btn-premium w-full py-3 text-sm sm:text-base">
            Sign In
          </button>

          {error ? (
            <p className="text-sm text-red-500 text-center">{error}</p>
          ) : null}

        </form>
      </motion.div>
    </div>);

}
