'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useGuestCart } from '@/store/cart-store';
import { formatCOP } from '@/lib/utils';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    category: {
      name: string;
    };
  };
}

export default function CartPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const guestCart = useGuestCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const isGuest = status === 'unauthenticated';

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCart();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setCartItems(data || []);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId, quantity: newQuantity }),
      });
      if (res.ok) {
        fetchCart();
      } else {
        toast.error('Error al actualizar cantidad');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar cantidad');
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      const res = await fetch(`/api/cart?cartItemId=${cartItemId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Producto eliminado');
        fetchCart();
      } else {
        toast.error('Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al eliminar producto');
    }
  };

  const guestItems = guestCart.items;
  const displayItems: CartItem[] = isGuest
    ? guestItems.map((i) => ({ id: i.productId, quantity: i.quantity, product: i.product }))
    : cartItems;

  const total = displayItems.reduce(
    (sum, item) => sum + (item?.product?.price ?? 0) * (item?.quantity ?? 0),
    0
  );

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center body-gradient">
        <p className="text-white">Cargando carrito...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen body-gradient py-12">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Mi Carrito</h1>
        </motion.div>

        {displayItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg"
          >
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-6">Tu carrito está vacío</p>
            <Button
              onClick={() => router.push('/')}
              className="bg-primary hover:bg-primary-hover"
            >
              Ir a comprar
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {displayItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                      {item?.product?.images?.[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item?.product?.name ?? ''}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400 text-xs">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item?.product?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item?.product?.category?.name}
                      </p>
                      <p className="text-lg font-bold text-primary mt-2">
                        {formatCOP(item?.product?.price ?? 0)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          isGuest
                            ? guestCart.removeItem(item.id)
                            : removeItem(item.id)
                        }
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            isGuest
                              ? guestCart.updateQuantity(item.id, item.quantity - 1)
                              : updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span className="text-lg font-semibold px-3">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            isGuest
                              ? guestCart.updateQuantity(item.id, item.quantity + 1)
                              : updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Resumen
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatCOP(total)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatCOP(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {isGuest ? (
                  <div className="space-y-3">
                    <Button
                      onClick={() => router.push('/login?callbackUrl=/checkout')}
                      className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
                    >
                      Iniciar sesión para pagar
                    </Button>
                    <p className="text-xs text-gray-500 text-center">
                      Tu carrito se conservará al iniciar sesión
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={() => router.push('/checkout')}
                    className="w-full bg-primary hover:bg-primary/90 py-6 text-lg"
                  >
                    Proceder al Pago
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
