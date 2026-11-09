import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}
const TESTIMONIALS: Testimonial[] = [
{
  name: 'Eleanor Rigby',
  role: 'Golden Retriever Parent',
  text: 'The quality of the dog food is simply unmatched. My golden retriever has never been healthier, happier, or more radiant. Every order arrives beautifully packaged.',
  rating: 5
},
{
  name: 'James Thornton',
  role: 'Aquascaping Enthusiast',
  text: 'I purchased a custom rimless aquarium and it has become the breathtaking centerpiece of my living room. Truly a museum-grade work of art.',
  rating: 5
},
{
  name: 'Sophia Laurent',
  role: 'Cat Connoisseur',
  text: 'Exceptional service and genuinely premium products. The velvet cat tree is gorgeous and my two Persians absolutely adore it. Worth every penny.',
  rating: 5
},
{
  name: 'Marcus Chen',
  role: 'Koi Collector',
  text: 'Their color-enhancing koi food transformed my pond fish. The vibrancy is astonishing. This is the only store I trust for my aquatic family.',
  rating: 5
},
{
  name: 'Isabella Moreau',
  role: 'Loyal Customer',
  text: 'From grooming essentials to premium nutrition, everything feels curated with real care. The dark, elegant branding matches the luxury of the products.',
  rating: 5
}];

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const paginate = useCallback((dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);
  useEffect(() => {
    const timer = setInterval(() => paginate(1), 6000);
    return () => clearInterval(timer);
  }, [paginate]);
  const current = TESTIMONIALS[index];
  const variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 60 : -60
    }),
    center: {
      opacity: 1,
      x: 0
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -60 : 60
    })
  };
  return (
    <div className="relative max-w-3xl mx-auto">
      {/* Decorative animated shape */}
      <motion.div
        aria-hidden
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 8, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-secondary/10 blur-2xl" />
      

      <div className="relative bg-white rounded-3xl shadow-soft border border-accent px-8 py-12 md:px-16 md:py-16 overflow-hidden">
        <Quote className="w-12 h-12 text-secondary/30 mx-auto mb-6" />

        <div className="min-h-[180px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.5,
                ease: 'easeInOut'
              }}
              className="text-center">
              
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(current.rating)].map((_, j) =>
                <Star
                  key={j}
                  className="w-5 h-5 text-yellow-400 fill-yellow-400" />

                )}
              </div>

              <p className="font-serif italic text-2xl md:text-3xl leading-relaxed text-text mb-8">
                "{current.text}"
              </p>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-premium flex items-center justify-center text-white font-serif font-bold text-lg mb-3">
                  {current.name.charAt(0)}
                </div>
                <h4 className="font-serif font-semibold text-xl text-text">
                  {current.name}
                </h4>
                <span className="text-sm text-text-light uppercase tracking-widest font-sans">
                  {current.role}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Arrows */}
        <button
          onClick={() => paginate(-1)}
          aria-label="Previous testimonial"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-accent bg-white flex items-center justify-center text-text-light hover:text-primary hover:border-primary transition-colors">
          
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => paginate(1)}
          aria-label="Next testimonial"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-accent bg-white flex items-center justify-center text-text-light hover:text-primary hover:border-primary transition-colors">
          
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {TESTIMONIALS.map((_, i) =>
        <button
          key={i}
          onClick={() => {
            setDirection(i > index ? 1 : -1);
            setIndex(i);
          }}
          aria-label={`Go to testimonial ${i + 1}`}
          className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-primary' : 'w-2 bg-accent-dark hover:bg-secondary'}`} />

        )}
      </div>
    </div>);

}
