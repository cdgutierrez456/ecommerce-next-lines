'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useGuestCart } from '@/store/cart-store';
import PseForm from '@/components/checkout/PseForm';

const shippingSchema = z.object({
  shippingName: z.string().min(1, 'El nombre es requerido'),
  shippingEmail: z.string().email('Ingresa un email válido'),
  shippingAddress: z.string().min(1, 'La dirección es requerida'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

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
  const [submitting, setSubmitting] = useState(false);
  const [showPseForm, setShowPseForm] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);

  const {
    register: registerShipping,
    handleSubmit: handleShippingSubmit,
    setValue: setShippingValue,
    formState: { errors: shippingErrors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      shippingName: '',
      shippingEmail: '',
      shippingAddress: '',
    },
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/checkout');
      return;
    }
    if (status === 'authenticated') {
      setShippingValue('shippingEmail', session?.user?.email || '');
      setShippingValue('shippingName', session?.user?.name || '');
      mergeGuestCartAndFetch();
    }
  }, [status, router, session, setShippingValue]);

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

  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setShowPseForm(true);
  };

  const total = cartItems?.reduce?.(
    (sum, item) => sum + (item?.product?.price ?? 0) * (item?.quantity ?? 0),
    0
  ) ?? 0;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center body-gradient">
        <p className="text-white">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen body-gradient py-12">
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${showPseForm ? 'max-w-6xl' : 'max-w-2xl'}`}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>
        </motion.div>

        <div className={`grid gap-8 ${showPseForm ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Columna izquierda: Información de envío + Resumen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
          >
            <form onSubmit={handleShippingSubmit(onShippingSubmit)}>
              <div>
                <h2 className="text-2xl font-semibold mb-6">Información de Envío</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo
                    </label>
                    <Input
                      type="text"
                      placeholder="Tu nombre"
                      disabled={showPseForm}
                      {...registerShipping('shippingName')}
                    />
                    {shippingErrors.shippingName && (
                      <p className="text-sm text-red-500 mt-1">{shippingErrors.shippingName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      disabled={showPseForm}
                      {...registerShipping('shippingEmail')}
                    />
                    {shippingErrors.shippingEmail && (
                      <p className="text-sm text-red-500 mt-1">{shippingErrors.shippingEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección de Envío
                    </label>
                    <textarea
                      rows={3}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Calle, ciudad, código postal, país"
                      disabled={showPseForm}
                      {...registerShipping('shippingAddress')}
                    />
                    {shippingErrors.shippingAddress && (
                      <p className="text-sm text-red-500 mt-1">{shippingErrors.shippingAddress.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <h2 className="text-2xl font-semibold mb-4">Resumen del Pedido</h2>
                <div className="space-y-2">
                  {cartItems?.map?.(item => (
                    <div key={item.id} className="flex justify-between text-gray-700">
                      <span>
                        {item?.product?.name} x {item?.quantity}
                      </span>
                      <span>
                        ${((item?.product?.price ?? 0) * (item?.quantity ?? 0)).toFixed(2)}
                      </span>
                    </div>
                  )) || null}
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        ${total?.toFixed?.(2) ?? '0.00'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {!showPseForm && (
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover py-6 text-lg mt-6"
                >
                  Proceder al Pago
                </Button>
              )}

              {showPseForm && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-6 text-lg mt-6"
                  onClick={() => {
                    setShowPseForm(false);
                    setShippingData(null);
                  }}
                >
                  Editar información de envío
                </Button>
              )}
            </form>
          </motion.div>

          {/* Columna derecha: Formulario PSE */}
          <PseForm
            show={showPseForm}
            shippingData={shippingData}
            cartItems={cartItems}
            submitting={submitting}
            setSubmitting={setSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
