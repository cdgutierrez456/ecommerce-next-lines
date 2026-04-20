'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useFormCheckout, type CartItem } from '../hooks/useFormCheckout';

interface FormCheckoutProps {
  cartItems: CartItem[];
  defaultName?: string;
  defaultEmail?: string;
}

export const FormCheckout = ({ cartItems, defaultName, defaultEmail }: FormCheckoutProps) => {
  const { register, handleSubmit, errors, submitting, total, onSubmit } = useFormCheckout({
    cartItems,
    defaultName,
    defaultEmail,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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
                {...register('shippingName')}
              />
              {errors.shippingName && (
                <p className="text-sm text-red-500 mt-1">{errors.shippingName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="tu@email.com"
                {...register('shippingEmail')}
              />
              {errors.shippingEmail && (
                <p className="text-sm text-red-500 mt-1">{errors.shippingEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección de Envío
              </label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Calle, ciudad, código postal, país"
                {...register('shippingAddress')}
              />
              {errors.shippingAddress && (
                <p className="text-sm text-red-500 mt-1">{errors.shippingAddress.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Resumen del Pedido</h2>
          <div className="space-y-2">
            {cartItems?.map?.((item) => (
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

        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary hover:bg-primary-hover py-6 text-lg mt-6"
        >
          {submitting ? 'Procesando...' : 'Proceder al Pago'}
        </Button>
      </form>
    </motion.div>
  );
};
