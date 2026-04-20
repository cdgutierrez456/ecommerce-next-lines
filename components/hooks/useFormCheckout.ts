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

  const onSubmit = async (_data: ShippingFormData) => {
    setSubmitting(true);
    try {
      const body = { value_to_pay: total };

      const res = await fetch('/api/megapagos/webcheckout', {
        cache: 'no-store',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const { data } = await res.json();
        if (data.url_webcheckout) {
          await Promise.all(
            cartItems.map((item) =>
              fetch(`/api/cart?cartItemId=${item.id}`, { method: 'DELETE' })
            )
          );
          globalThis.open(data.url_webcheckout, '_self');
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
