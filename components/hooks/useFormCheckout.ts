'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

export const shippingSchema = z.object({
  shippingName: z.string().min(1, 'El nombre es requerido'),
  shippingEmail: z.email('Ingresa un email válido'),
  shippingAddress: z.string().min(1, 'La dirección es requerida'),
});

export type ShippingFormData = z.infer<typeof shippingSchema>;

export interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

interface UseFormCheckoutParams {
  cartItems: CartItem[];
  defaultName?: string;
  defaultEmail?: string;
}

export function useFormCheckout({ cartItems, defaultName = '', defaultEmail = '' }: UseFormCheckoutParams) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      shippingName: defaultName,
      shippingEmail: defaultEmail,
      shippingAddress: '',
    },
  });

  const total = cartItems?.reduce?.(
    (sum, item) => sum + (item?.product?.price ?? 0) * (item?.quantity ?? 0),
    0
  ) ?? 0;

  const onSubmit = async (data: ShippingFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/megapagos/webcheckout', {
        cache: 'no-store',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value_to_pay: total }),
      });

      if (res.ok) {
        const { data: webcheckoutData } = await res.json();
        if (webcheckoutData.url_webcheckout) {
          // Persiste datos del pedido para registrarlo al volver del pago
          sessionStorage.setItem('pendingOrder', JSON.stringify({
            shippingName: data.shippingName,
            shippingEmail: data.shippingEmail,
            shippingAddress: data.shippingAddress,
            items: cartItems.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
            })),
            total,
          }));

          await Promise.all(
            cartItems.map((item) =>
              fetch(`/api/cart?cartItemId=${item.id}`, { method: 'DELETE' })
            )
          );
          globalThis.open(webcheckoutData.url_webcheckout, '_self');
        } else {
          toast.error('Error al crear proceso de pago');
        }
      } else {
        const error = await res.json();
        toast.error(error.message || 'Error al crear sesión de pago');
      }
    } catch {
      toast.error('Error al procesar el pago');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    submitting,
    total,
    onSubmit,
  };
}
