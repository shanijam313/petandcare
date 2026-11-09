import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScreenInit } from '../useScreenInit';
import { useCategories } from '../data/categories';
import { getSaleCountdown, useCatalogProducts } from '../data/catalog';
import { ProductCard } from '../components/ProductCard';
import { TestimonialsCarousel } from '../components/TestimonialsCarousel';
import { Seo, seoSiteUrl } from '../components/Seo';
// Mock Data
const MOCK_CATEGORIES = [
{
  id: 1,
  name: 'Premium Dog Food',
  image:
  'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=800&auto=format&fit=crop'
},
{
  id: 2,
  name: 'Luxury Cat Accessories',
  image:
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop'
},
{
  id: 3,
  name: 'Designer Aquariums',
  image:
  'https://images.unsplash.com/photo-1522069169874-c58ec4b76be1?q=80&w=800&auto=format&fit=crop'
},
{
  id: 4,
  name: 'Exotic Fish',
  image:
  'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=800&auto=format&fit=crop'
},
{
  id: 5,
  name: 'Grooming Essentials',
  image:
  'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&auto=format&fit=crop'
}];

const FEATURED_PRODUCTS = [
{
  id: 1,
  name: 'Royal Canin Premium Adult',
  category: 'Dog Food',
  price: 89.99,
  salePrice: null,
  rating: 4.8,
  reviews: 124,
  image:
  'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=800&auto=format&fit=crop',
  badge: 'Best Seller'
},
{
  id: 2,
  name: 'Velvet Cat Tree Tower',
  category: 'Cat Accessories',
  price: 249.99,
  salePrice: 199.99,
  rating: 4.9,
  reviews: 86,
  image:
  'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=800&auto=format&fit=crop',
  badge: 'Sale'
},
{
  id: 3,
  name: 'Rimless Crystal Aquarium 50G',
  category: 'Aquariums',
  price: 599.99,
  salePrice: null,
  rating: 5.0,
  reviews: 42,
  image:
  'https://images.unsplash.com/photo-1522069169874-c58ec4b76be1?q=80&w=800&auto=format&fit=crop',
  badge: 'New Arrival'
},
{
  id: 4,
  name: 'Premium Koi Fish Food',
  category: 'Fish Food',
  price: 45.0,
  salePrice: null,
  rating: 4.7,
  reviews: 215,
  image:
  'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=800&auto=format&fit=crop',
  badge: null
}];

export function Home() {
  useScreenInit();
  const products = useCatalogProducts();
  const categories = useCategories();
  const [now, setNow] = React.useState(Date.now());
  const trendingProducts = products.filter((product) =>
    ['p1', 'p5', 'p6', 'p7'].includes(product.id)
  );
  const saleEndsAt = getSaleCountdown();

  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const remainingMs = saleEndsAt ? Math.max(0, saleEndsAt - now) : 0;
  const remainingSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(remainingSeconds / 3600);
  const mins = Math.floor((remainingSeconds % 3600) / 60);
  const secs = remainingSeconds % 60;
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Do you sell pet food online in Pakistan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we offer pet food, dog food, cat food, fish food, and pet supplies for customers in Pakistan.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do you have aquarium fish and fish tank products?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we stock aquarium accessories, fish tanks, fish food, and fish care essentials.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I order pet supplies online for delivery in Pakistan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, you can place online orders for pet supplies, and our store is optimized for customers in Pakistan.'
        }
      }
    ]
  };
  return (
    <div className="w-full">
      <Seo
        title="Pet Store in Peshawar, Pakistan | Online Pet Shop & Fish Palace"
        description="Modern Pet Care & Stylish Fish Palace is a trusted pet store in Peshawar, Pakistan for pet food, dog food, cat food, fish food, fish tanks, pet medicine, and accessories."
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
          'Aquarium Fish',
          'Fish Tanks',
          'Aquarium Accessories',
          'Fish Medicine',
          'Pet Supplies',
          'Pakistan Pet Store',
          'Pet Store Peshawar',
          'Buy Dog Food Online Pakistan'
        ]}
        canonicalPath="/"
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'PetStore',
            name: 'Modern Pet Care & Stylish Fish Palace',
            url: seoSiteUrl,
            areaServed: ['Peshawar', 'Pakistan'],
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Niaz Plaza, near Police Public School Board, University Rd, Shaheen Town',
              addressLocality: 'Peshawar',
              addressRegion: 'Khyber Pakhtunkhwa',
              addressCountry: 'PK'
            },
            telephone: '+92 345 1020728',
            description:
              'Online pet shop in Pakistan for premium pet food, cat accessories, dog supplies, fish food, aquarium products, grooming items, and pet medicine.'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Modern Pet Care & Stylish Fish Palace',
            url: seoSiteUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${seoSiteUrl}/shop?search={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          }
          ,faqStructuredData
        ]}
      />
      {/* Hero Section */}
      <section className="relative min-h-[560px] lg:min-h-[85vh] flex items-center overflow-hidden bg-[#111]">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/cat-hero-section.jpg"
            alt="Cat hero section"
            className="w-full h-full object-cover object-center" />
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{
              opacity: 0,
              y: 30
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8,
              delay: 0.2
            }}
            className="max-w-2xl text-white pt-10 sm:pt-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold leading-tight mb-4 sm:mb-6 max-w-xl">
              Online Pet Shop in Pakistan for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                Pet Food, Fish Care & Accessories
              </span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-100 mb-6 sm:mb-10 max-w-lg font-medium leading-relaxed">
              Discover premium pet food, cat and dog accessories, fish food,
              aquarium essentials, grooming items, and pet medicine with easy online ordering in Pakistan.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link to="/shop" className="btn-premium flex items-center gap-2">
                Shop Collection <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/aquariums"
                className="btn-outline border-emerald-500 bg-emerald-500/90 text-white hover:bg-emerald-600 hover:border-emerald-600 shadow-lg backdrop-blur-md">
                
                Explore Aquariums
              </Link>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-text mb-3 sm:mb-4">
                Curated Categories
              </h2>
              <p className="text-text-light max-w-2xl text-[15px] md:text-base leading-7">
                Explore premium categories for cats, dogs, fish, aquariums,
                grooming, litter, treats, medicine, and daily pet care supplies.
              </p>
            </div>
            <Link
              to="/categories"
              className="hidden md:flex items-center gap-2 text-primary font-medium hover:text-secondary transition-colors">
              
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {categories.slice(0, 10).map((category, index) =>
            <Link to="/shop" key={category.id}>
                <motion.div
                initial={{
                  opacity: 0,
                  y: 20
                }}
                whileInView={{
                  opacity: 1,
                  y: 0
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1
                }}
                className="group cursor-pointer">
                
                  <div className="relative aspect-square rounded-full overflow-hidden mb-3 sm:mb-4 border-4 border-accent group-hover:border-primary transition-colors duration-300">
                    <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  
                    <div className="absolute inset-0 bg-transparent" />
                  </div>
                  <h3 className="text-center font-medium text-sm sm:text-base text-text group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                </motion.div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-text mb-3 sm:mb-4">
              Trending Now
            </h2>
            <p className="text-text-light max-w-2xl mx-auto text-[15px] md:text-base leading-7">
              Popular pet food, fish food, cat accessories, dog accessories,
              and grooming essentials trusted by Pakistani pet owners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {trendingProducts.map((product, index) =>
            <motion.div
              key={product.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1
              }}>
              
                <ProductCard product={product} />
              </motion.div>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center btn-outline">
              
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      <section className="py-20 bg-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 sm:mb-12 gap-4 sm:gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-text mb-2 flex items-center gap-3">
                Flash Sale{' '}
                <span className="inline-block w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              </h2>
            <p className="text-text-light">Hurry up! Offers end soon.</p>
            </div>
            <div className="flex gap-2 sm:gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="flex flex-col items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                <span className="text-lg sm:text-xl font-bold text-primary">{String(hours).padStart(2, '0')}</span>
                <span className="text-[11px] md:text-xs text-text-light uppercase tracking-wider">Hours</span>
              </div>
              <div className="flex flex-col items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                <span className="text-lg sm:text-xl font-bold text-primary">{String(mins).padStart(2, '0')}</span>
                <span className="text-[11px] md:text-xs text-text-light uppercase tracking-wider">Mins</span>
              </div>
              <div className="flex flex-col items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                <span className="text-lg sm:text-xl font-bold text-primary">{String(secs).padStart(2, '0')}</span>
                <span className="text-[11px] md:text-xs text-text-light uppercase tracking-wider">Secs</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {products.filter((p) => p.salePrice).
            slice(0, 4).
            map((product, index) =>
            <motion.div
              key={product.id}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1
              }}>
              
                  <ProductCard product={product} />
                </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-primary">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be1?q=80&w=2000&auto=format&fit=crop"
                alt="Aquarium Banner"
                className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
              
            </div>
            <div className="relative z-10 p-10 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl text-white">
                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
                  Shop Pet Food and Fish Supplies Online in Pakistan
                </h2>
                <p className="text-lg text-white/80 mb-8">
                  Order pet products online in Pakistan, including dog food,
                  cat food, fish food, aquarium supplies, and grooming essentials.
                </p>
                <Link
                  to="/shop?category=Aquariums"
                  className="btn-premium bg-white text-primary hover:bg-accent hover:shadow-white/20">
                  
                  Explore Aquatics
                </Link>
              </div>
              <div className="hidden md:block w-64 h-64 rounded-full border-8 border-white/20 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=800&auto=format&fit=crop"
                  alt="Fish"
                  className="w-full h-full object-cover" />
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-text mb-3 sm:mb-4">
            What Our Clients Say
          </h2>
          <p className="text-text-light max-w-2xl mx-auto mb-12">
            Trusted by discerning pet lovers and aquascaping connoisseurs around
            the world.
          </p>
          <TestimonialsCarousel />
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-text mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-text-light max-w-2xl mx-auto">
              Quick answers for people searching for an online pet shop in Pakistan.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              {
                q: 'What products do you sell?',
                a: 'We sell pet food, dog food, cat food, fish food, pet accessories, pet medicine, grooming products, aquarium accessories, fish tanks, and more.'
              },
              {
                q: 'Is this store for Pakistan customers?',
                a: 'Yes, the store is positioned for Pakistan-based search intent and local pet owners.'
              },
              {
                q: 'Can I find fish and aquarium items here?',
                a: 'Yes, you can browse fish food, aquarium accessories, and fish-related supplies in the shop.'
              }
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-accent bg-accent/10 p-5 text-left">
                <h3 className="font-semibold text-text mb-2">{item.q}</h3>
                <p className="text-text-light leading-7">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>);

}
