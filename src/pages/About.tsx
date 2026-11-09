import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Seo } from '../components/Seo';

export function About() {
  return (
    <div className="bg-white">
      <Seo
        title="About Us | Online Pet Store in Pakistan"
        description="Learn about Modern Pet Care & Stylish Fish Palace, Pakistan's online pet store for pet food, fish food, aquarium products, pet accessories, and grooming."
        keywords={[
          'Pet Store',
          'Online Pet Shop',
          'Pet Food',
          'Dog Food',
          'Cat Food',
          'Pet Accessories',
          'Pet Medicine',
          'Pet Grooming',
          'Fish Food',
          'Aquarium Accessories',
          'Fish Tanks',
          'Pet Supplies',
          'Pakistan'
        ]}
        canonicalPath="/about"
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-secondary text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2000&auto=format&fit=crop"
            alt="Pet care background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide"
            >
              <span className="inline-flex w-4 h-4 rounded-full border border-white/70 items-center justify-center text-[10px] leading-none">
                i
              </span>
              About Modern Pet Care & Stylish Fish Palace
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-4xl md:text-6xl font-serif font-bold leading-tight"
            >
              A trusted online pet store for Pakistan's cat, dog, and fish lovers.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed"
            >
              We built this shop for pet lovers who want premium products, clean organization, and
              a simple way to find everything for cats, dogs, fish, aquariums, and daily pet care in one place.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link to="/shop" className="btn-premium bg-white text-primary hover:bg-accent">
                Explore Shop <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/admin/categories" className="btn-outline border-white text-white hover:bg-white hover:text-primary">
                Browse Categories
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
