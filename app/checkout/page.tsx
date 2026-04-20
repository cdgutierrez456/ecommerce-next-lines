'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useGuestCart } from '@/store/cart-store';
import { FormCheckout } from '@/components/checkout/FormCheckout';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

export default function CheckoutPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const guestCart = useGuestCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
      return;
    }
    if (status === 'authenticated') {
      mergeGuestCartAndFetch();
    }
  }, [status, router]);

  const mergeGuestCartAndFetch = async () => {
    const localItems = guestCart.items;
    if (localItems.length > 0) {
      await Promise.all(
        localItems.map((item) =>
          fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: item.productId, quantity: item.quantity }),
          })
        )
      );
      guestCart.clearCart();
    }
    fetchCart();
  };

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setCartItems(data || []);
        if (data?.length === 0) {
          toast.error('Tu carrito está vacío');
          router.push('/cart');
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center body-gradient">
        <p className="text-white">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen body-gradient py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>
        </motion.div>

        <FormCheckout
          cartItems={cartItems}
          defaultName={session?.user?.name || ''}
          defaultEmail={session?.user?.email || ''}
        />
      </div>
    </div>
  );
}
