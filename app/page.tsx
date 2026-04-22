'use client';

import { useEffect, useState, useCallback } from 'react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

const SLIDES = [
  { src: '/couples.png', alt: 'Pareja con estilo Line\'s Actitud' },
  { src: '/FocalPerson.png', alt: 'Persona con estilo Line\'s Actitud' },
  { src: '/playaGorra.jpeg', alt: 'Gorra en la playa estilo Line\'s Actitud' },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((next: number) => {
    setDirection(next > slideIndex ? 1 : -1);
    setSlideIndex(next);
  }, [slideIndex]);

  const prev = useCallback(() => {
    goTo((slideIndex - 1 + SLIDES.length) % SLIDES.length);
  }, [slideIndex, goTo]);

  const next = useCallback(() => {
    goTo((slideIndex + 1) % SLIDES.length);
  }, [slideIndex, goTo]);

  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setSlideIndex((i) => (i + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen from-white to-gray-50 body-gradient">
      {/* Hero Section */}
      <section className="text-white min-h-[70dvh] flex items-center overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-10 lg:py-0">

            {/* Left — texto */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="mb-6 flex justify-center lg:justify-start"
              >
                <Image
                  src="/IconSinFondo.png"
                  alt="Line's Actitud"
                  width={120}
                  height={120}
                  priority
                />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl xl:text-6xl font-bold mb-4 leading-tight"
              >
                Bienvenido a<br />Line&apos;s <span className="text-primary">Actitud</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl mb-8 opacity-80"
              >
                Descubre productos increíbles a los mejores precios
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-8"
                  onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver colección
                </Button>
              </motion.div>
            </div>

            {/* Right — slider */}
            <div className="flex-1 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
              <div className="relative h-80 sm:h-100 lg:h-120 rounded-2xl overflow-hidden shadow-2xl">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={slideIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.55, ease: 'easeInOut' }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={SLIDES[slideIndex].src}
                      alt={SLIDES[slideIndex].alt}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                      priority={slideIndex === 0}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Overlay degradado inferior */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />

                {/* Flechas */}
                <button
                  onClick={prev}
                  aria-label="Slide anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  aria-label="Slide siguiente"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Ir a slide ${i + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === slideIndex ? 'w-6 bg-primary' : 'w-2 bg-white/60 hover:bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="productos" className="py-7">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="h-5 w-5 text-white" />
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
                className={selectedCategory === '' ? 'bg-primary hover:body-gradient' : ''}
              >
                Todos
              </Button>
              {categories?.map?.((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? 'bg-primary hover:body-gradient' : ''}
                >
                  {category.name}
                </Button>
              )) || null}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Cargando productos...</p>
            </div>
          ) : products?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No se encontraron productos</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
