'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: {
    name: string;
  };
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = categorySlug
      ? `/api/products?category=${encodeURIComponent(categorySlug)}`
      : '/api/products';

    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categorySlug]);

  const title = activeCategory ? activeCategory.name : 'Todos los productos';

  return (
    <div className="min-h-screen body-gradient py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>

          {/* Filtros de categoría */}
          <div className="flex flex-wrap gap-2">
            <a
              href="/products"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !categorySlug
                  ? 'bg-white text-gray-900'
                  : 'bg-white/10 text-gray-200 hover:bg-white/20'
              }`}
            >
              Todos
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  categorySlug === cat.slug
                    ? 'bg-white text-gray-900'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-white">Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-300">No se encontraron productos en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
