import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

export function Contact() {
  return (
    <div className="bg-white">
      <Seo
        title="Contact Us | Pet Store in Peshawar, Pakistan"
        description="Contact Modern Pet Care & Stylish Fish Palace in Peshawar, Pakistan for pet food, fish food, grooming, aquarium supplies, and online pet shop support."
        keywords={[
          'Pet Store',
          'Online Pet Shop',
          'Pet Food',
          'Dog Food',
          'Cat Food',
          'Pet Accessories',
          'Pet Medicine',
          'Fish Food',
          'Fish Tanks',
          'Aquarium Accessories',
          'Pet Supplies',
          'Pakistan Pet Store',
          'Pet Store Peshawar'
        ]}
        canonicalPath="/contact"
      />
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-secondary text-white">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=2000&auto=format&fit=crop"
            alt="Pet care contact background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
              Contact our pet store in Peshawar, Pakistan.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
              Whether you need help choosing pet food, fish food, grooming
              products, or aquarium supplies, we are here to help quickly.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-text">
              Contact Information
            </h2>
            <p className="text-text-light mt-3 max-w-2xl mx-auto">
              Reach us through email, phone, or live location. We are always happy to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-accent shadow-soft p-6"
              >
                <h2 className="text-2xl font-serif font-bold text-text mb-4 text-center">Store Details</h2>
                <p className="text-text-light leading-relaxed mb-6 text-center">
                  Modern Pet Care & Stylish Fish Palace, serving pet owners in Peshawar and across Pakistan.
                </p>

                <div className="space-y-4">
                  <InfoRow icon={Mail} title="Email" value="Mjdusmani@gmail.com" href="mailto:Mjdusmani@gmail.com" />
                  <InfoRow icon={Phone} title="Phone" value="03451020728" href="tel:03451020728" />
                  <InfoRow icon={Clock} title="Hours" value="Mon - Sat, 10:00 AM - 8:00 PM" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-primary to-secondary text-white rounded-3xl p-6 shadow-soft"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <MapPin className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">Live Location</h3>
                </div>
                <p className="text-white/85 text-sm leading-relaxed mb-4 text-center">
                  Find us on the map and visit our shop for premium pet food, fish food, pet accessories, and aquarium supplies in Peshawar.
                </p>
                <div className="text-center">
                  <a
                  href="https://www.google.com/maps/search/?api=1&query=Niaz%20Plaza%20near%20Police%20Public%20School%20Board%20University%20Rd%20Shaheen%20Town%20Peshawar%20Pakistan"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-primary px-4 py-3 rounded-full font-medium hover:bg-accent transition-colors"
                  >
                    Open Live Location <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-white rounded-3xl border border-accent shadow-soft p-6 md:p-8"
            >
              <h2 className="text-2xl font-serif font-bold text-text mb-2 text-center">Send Us a Message</h2>
              <p className="text-text-light text-sm mb-6 text-center">
                Tell us what you need and we will get back to you as soon as possible.
              </p>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Your Name" placeholder="Enter your name" />
                  <Field label="Phone Number" placeholder="Enter your number" />
                </div>
                <Field label="Email Address" type="email" placeholder="Enter your email" />
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Message</label>
                  <textarea
                    rows={6}
                    placeholder="Write your message here..."
                    className="w-full rounded-2xl border border-accent bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button type="button" className="btn-premium w-full md:w-auto px-6 py-3">
                  Send Message
                </button>
              </form>

              <div className="mt-8 rounded-3xl overflow-hidden border border-accent bg-accent/10">
                <div className="aspect-[16/9]">
                  <iframe
                    title="Live location"
                    src="https://www.google.com/maps?q=Niaz%20Plaza%2C%20near%20Police%20Public%20School%20Board%2C%20University%20Rd%2C%20Shaheen%20Town%2C%20Peshawar%2C%20Pakistan&z=15&output=embed"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  title,
  value,
  href
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3 rounded-2xl border border-accent bg-accent/10 p-4 hover:bg-accent/20 transition-colors">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-text-light mb-1">{title}</p>
        <p className="text-sm font-medium text-text break-all">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}

function Field({
  label,
  placeholder,
  type = 'text'
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-light mb-2">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-accent bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
