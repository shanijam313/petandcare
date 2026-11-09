import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  User,
  Menu,
  X,
  Heart,
  Moon,
  Sun,
  MessageCircle } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { CartDrawer } from './CartDrawer';
import { LogoMark } from './LogoMark';
import {
  DEFAULT_STORE_SETTINGS,
  loadStoreSettingsFromSupabase,
  readStoreSettingsCache
} from '../data/storeSettings';

export function Layout({ children }: {children: React.ReactNode;}) {
  const { cartCount, wishlist } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const initialStoreSettings = readStoreSettingsCache();
  const [storeSettings, setStoreSettings] = useState(() => initialStoreSettings || DEFAULT_STORE_SETTINGS);
  const [storeSettingsReady, setStoreSettingsReady] = useState(() => Boolean(initialStoreSettings));
  const location = useLocation();
  useEffect(() => {
    setIsDarkMode(false);
  }, []);
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      const remote = await loadStoreSettingsFromSupabase();
      if (!cancelled) {
        if (remote) setStoreSettings(remote);
        setStoreSettingsReady(true);
      }
    };

    void hydrate();
    const refresh = () => void hydrate();
    window.addEventListener('mp_store_settings_changed', refresh);
    return () => {
      cancelled = true;
      window.removeEventListener('mp_store_settings_changed', refresh);
    };
  }, []);

  const navLinks = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'Shop',
    path: '/shop'
  },
  {
    name: 'Contact',
    path: '/contact'
  }];

  return (
    <div className="min-h-screen flex flex-col bg-accent/30 dark:bg-[#07120f] transition-colors duration-300">
      {/* Top Announcement Bar */}
      {storeSettingsReady ? (
        <div className="space-y-0.5">
          <div className="bg-primary text-white text-[11px] sm:text-sm md:text-[15px] font-medium py-2 text-center tracking-wide px-3">
            {storeSettings.announcementPrimary?.trim() || DEFAULT_STORE_SETTINGS.announcementPrimary}
          </div>
          {storeSettings.announcementSecondary?.trim() ? (
            <div className="bg-secondary text-white text-[11px] sm:text-sm md:text-[15px] font-medium py-2 text-center tracking-wide px-3">
              {storeSettings.announcementSecondary.trim()}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="min-h-[42px]" />
      )}

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3 dark:bg-[#0c1714]/90' : 'bg-white py-5 dark:bg-[#0c1714]'}`}>
        
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -ml-2 text-text shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}>
              
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 z-10 min-w-0">
              <LogoMark />
              <div className="hidden sm:flex flex-col min-w-0">
                <span className="font-serif font-bold text-xl leading-none text-primary">
                  {storeSettings.storeName}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) =>
              <Link
                key={link.name}
                to={link.path}
                className={`group relative text-sm font-semibold tracking-wide px-2 py-1 transition-all duration-200 hover:-translate-y-0.5 hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-text-light'}`}>
                
                  {link.name}
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 rounded-full bg-primary transition-all duration-200 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}
                  />
                </Link>
              )}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-6 shrink-0">
              <button className="w-9 h-9 sm:w-auto sm:h-auto rounded-full flex items-center justify-center text-text hover:text-secondary hover:bg-accent/60 dark:hover:bg-white/10 transition-colors">
                <Search className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
              </button>
              <Link
                to="/wishlist"
                className={`relative w-9 h-9 sm:w-auto sm:h-auto rounded-full flex items-center justify-center transition-colors ${wishlist.length > 0 ? 'text-rose-600 bg-rose-50 hover:bg-rose-100' : 'text-text hover:text-secondary hover:bg-accent/60 dark:hover:bg-white/10'}`}>
                
                <Heart className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                {wishlist.length > 0 &&
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                }
              </Link>
              <button
                onClick={() => setIsCartOpen(true)}
                className={`relative w-9 h-9 sm:w-auto sm:h-auto rounded-full flex items-center justify-center transition-colors ${cartCount > 0 ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-text hover:text-secondary hover:bg-accent/60 dark:hover:bg-white/10'}`}>
                
                <ShoppingBag className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                {cartCount > 0 &&
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                }
              </button>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-9 h-9 sm:w-auto sm:h-auto rounded-full inline-flex items-center justify-center text-text hover:text-secondary hover:bg-accent/60 dark:hover:bg-white/10 transition-colors">
                
                {isDarkMode ?
                <Sun className="w-[18px] h-[18px] sm:w-5 sm:h-5" /> :

                <Moon className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                }
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen &&
        <>
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)} />
          
            <motion.div
            initial={{
              x: '-100%'
            }}
            animate={{
              x: 0
            }}
            exit={{
              x: '-100%'
            }}
            transition={{
              type: 'spring',
              bounce: 0,
              duration: 0.4
            }}
            className="fixed inset-y-0 left-0 w-[86vw] max-w-sm bg-white z-50 shadow-2xl flex flex-col">
            
              <div className="p-5 flex items-center justify-between border-b border-accent">
              <div className="flex items-center gap-2">
                  <LogoMark size="sm" />
                  <span className="font-serif font-bold text-lg text-primary">
                    Menu
                  </span>
                </div>
                <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-text-light hover:text-primary">
                
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <nav className="flex flex-col px-4 space-y-2">
                  {navLinks.map((link) =>
                <Link
                  key={link.name}
                  to={link.path}
                  className="px-4 py-3 text-base font-semibold text-text hover:bg-accent/70 rounded-xl transition-colors">
                  
                      {link.name}
                    </Link>
                )}
                </nav>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary-dark text-white pt-16 pb-8 dark:bg-[#04100d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <LogoMark />
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-xl leading-none text-white">
                    {storeSettings.storeName}
                  </span>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Redefining luxury pet care and aquatic elegance. We provide
                premium products for your beloved companions, ensuring they live
                their best lives.
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholders */}
                {[1, 2, 3, 4].map((i) =>
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer">
                  
                    <div className="w-4 h-4 bg-white/80 rounded-sm" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-serif font-semibold text-lg mb-6">
                Quick Links
              </h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <Link
                    to="/shop"
                    className="hover:text-white transition-colors">
                    
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors">
                    
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    className="hover:text-white transition-colors">
                    
                    Premium Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="hover:text-white transition-colors">
                    
                    Journal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors">
                    
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-semibold text-lg mb-6">
                Customer Care
              </h4>
              <ul className="space-y-3 text-sm text-gray-300">
                <li>
                  <Link
                    to="/faq"
                    className="hover:text-white transition-colors">
                    
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping"
                    className="hover:text-white transition-colors">
                    
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link
                    to="/track"
                    className="hover:text-white transition-colors">
                    
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-white transition-colors">
                    
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-white transition-colors">
                    
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-semibold text-lg mb-6">
                Newsletter
              </h4>
              <p className="text-gray-300 text-[15px] leading-7 mb-4">
                Subscribe to receive updates, access to exclusive deals, and
                more.
              </p>
              <form className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-white/10 border border-white/20 rounded-full px-4 py-3 text-[15px] text-white placeholder:text-gray-400 focus:outline-none focus:border-secondary transition-colors" />
                
                <button
                  type="button"
                  className="bg-secondary hover:bg-secondary-light text-white rounded-full px-4 py-3 text-[15px] font-medium transition-colors">
                  
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-gray-400 text-[15px]">
              © {new Date().getFullYear()} Modern Pet Care & Stylish Fish Palace. All rights reserved.
            </p>
            <div className="flex gap-4 text-gray-400 text-[15px]">
              <span>PKR (Rs)</span>
              <span>English</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/923451020728?text=Hello%20Modern%20Pet%20Care%20and%20Stylish%20Fish%20Palace%2C%20I%20want%20to%20contact%20you%20through%20your%20website."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center">
        
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>);

}
