import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ShoppingBag, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScreenInit } from '../useScreenInit';
import { Seo } from '../components/Seo';
export function NotFound() {
  useScreenInit();
  return (
    <div className="min-h-[70vh] py-20 px-4 sm:px-6 lg:px-8">
      <Seo
        title="Page Not Found | Modern Pet Care & Stylish Fish Palace"
        description="The page you requested was not found. Return to our online pet shop in Pakistan for pet food, fish food, and accessories."
        keywords={['Pet Store', 'Online Pet Shop', 'Pet Food', 'Fish Food', 'Pet Supplies', 'Pakistan']}
        canonicalPath="/404"
        noindex
      />
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5
        }}
        className="max-w-5xl w-full mx-auto text-center">
        
        <div className="rounded-[2rem] bg-white shadow-soft border border-accent p-8 md:p-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Page not found
          </div>

          <h1 className="text-8xl md:text-9xl font-serif font-bold text-primary/20 mb-4">
            404
          </h1>

          <h2 className="text-3xl font-serif font-bold text-text mb-4">
            Page Not Found
          </h2>

          <p className="text-text-light mb-10 text-lg max-w-2xl mx-auto">
            We could not find the page you're looking for. It may have been moved, deleted,
            or perhaps never existed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="btn-premium flex items-center justify-center gap-2 w-full sm:w-auto">
              
              <Home className="w-5 h-5" /> Back to Home
            </Link>
            <Link
              to="/shop"
              className="btn-outline flex items-center justify-center gap-2 w-full sm:w-auto">
              
              <Search className="w-5 h-5" /> Browse Shop
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 text-left">
            <Link to="/shop" className="rounded-2xl border border-accent p-5 hover:bg-accent/20 transition-colors">
              <ShoppingBag className="w-5 h-5 text-primary mb-3" />
              <h3 className="font-semibold text-text mb-1">Explore products</h3>
              <p className="text-sm text-text-light">Browse premium pet and fish essentials.</p>
            </Link>
            <Link to="/wishlist" className="rounded-2xl border border-accent p-5 hover:bg-accent/20 transition-colors">
              <Heart className="w-5 h-5 text-primary mb-3" />
              <h3 className="font-semibold text-text mb-1">Check wishlist</h3>
              <p className="text-sm text-text-light">Review saved favorite items anytime.</p>
            </Link>
            <Link to="/contact" className="rounded-2xl border border-accent p-5 hover:bg-accent/20 transition-colors">
              <ArrowRight className="w-5 h-5 text-primary mb-3" />
              <h3 className="font-semibold text-text mb-1">Contact us</h3>
              <p className="text-sm text-text-light">Need help? We are here to guide you.</p>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>);

}
