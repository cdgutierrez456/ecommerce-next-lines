'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useGuestCart } from '@/store/cart-store';

const shippingSchema = z.object({
  shippingName: z.string().min(1, 'El nombre es requerido'),
  shippingEmail: z.string().email('Ingresa un email válido'),
  shippingAddress: z.string().min(1, 'La dirección es requerida'),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const pseSchema = z.object({
  fullName: z.string().min(1, 'El nombre es requerido'),
  personType: z.string().min(1, 'Selecciona el tipo de persona'),
  documentType: z.string().min(1, 'Selecciona el tipo de documento'),
  documentNumber: z.string().min(1, 'El número de documento es requerido'),
  bank: z.string().min(1, 'Selecciona un banco'),
  email: z.string().email('Ingresa un email válido'),
  confirmEmail: z.string().email('Ingresa un email válido'),
  phone: z.string().min(7, 'El celular debe tener al menos 7 dígitos'),
  address: z.string().min(1, 'La dirección es requerida'),
  acceptTerms: z.literal(true, {
    error: 'Debes aceptar los términos y condiciones',
  }),
  acceptCommunications: z.boolean().optional(),
}).refine((data) => data.email === data.confirmEmail, {
  message: 'Los correos no coinciden',
  path: ['confirmEmail'],
});

type PseFormData = z.infer<typeof pseSchema>;

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

  const {
    register: registerPse,
    handleSubmit: handlePseSubmit,
    control: pseControl,
    formState: { errors: pseErrors },
  } = useForm<PseFormData>({
    resolver: zodResolver(pseSchema),
    defaultValues: {
      fullName: '',
      personType: '',
      documentType: '',
      documentNumber: '',
      bank: '',
      email: '',
      confirmEmail: '',
      phone: '',
      address: '',
      acceptCommunications: true,
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

  const onPseSubmit = async (pseData: PseFormData) => {
    if (!shippingData) return;
    setSubmitting(true);

    try {
      const items = cartItems?.map?.(item => ({
        name: item?.product?.name ?? 'Producto',
        description: (item?.product as any)?.description ?? '',
        price: item?.product?.price ?? 0,
        quantity: item?.quantity ?? 1,
        images: (item?.product as any)?.images ?? [],
      })) ?? [];

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingName: shippingData.shippingName,
          shippingEmail: shippingData.shippingEmail,
          shippingAddress: shippingData.shippingAddress,
          pse: {
            fullName: pseData.fullName,
            personType: pseData.personType,
            documentType: pseData.documentType,
            documentNumber: pseData.documentNumber,
            bank: pseData.bank,
            email: pseData.email,
            phone: pseData.phone,
            address: pseData.address,
          },
        }),
      });

      if (res.ok) {
        const { url } = await res.json();
        if (url) {
          window.location.href = url;
        } else {
          toast.error('Error al crear sesión de pago');
        }
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al crear sesión de pago');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar el pago');
    } finally {
      setSubmitting(false);
    }
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
          <AnimatePresence>
            {showPseForm && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <form onSubmit={handlePseSubmit(onPseSubmit)}>
                  <h2 className="text-2xl font-bold text-primary text-center mb-6">PSE</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nombre completo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre completo *
                      </label>
                      <Input
                        type="text"
                        placeholder="Tu nombre completo"
                        {...registerPse('fullName')}
                      />
                      {pseErrors.fullName && (
                        <p className="text-sm text-red-500 mt-1">{pseErrors.fullName.message}</p>
                      )}
                    </div>

                    {/* Tipo de persona */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de persona *
                      </label>
                      <Controller
                        control={pseControl}
                        name="personType"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="natural">Natural</SelectItem>
                              <SelectItem value="juridica">Jurídica</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {pseErrors.personType && (
                        <p className="text-sm text-red-500 mt-1">{pseErrors.personType.message}</p>
                      )}
                    </div>

                    {/* Tipo documento + Número documento */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo documento *
                      </label>
                      <Controller
                        control={pseControl}
                        name="documentType"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cc">Cédula de ciudadanía</SelectItem>
                              <SelectItem value="ce">Cédula de extranjería</SelectItem>
                              <SelectItem value="nit">NIT</SelectItem>
                              <SelectItem value="pasaporte">Pasaporte</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {pseErrors.documentType && (
                        <p className="text-sm text-red-500 mt-1">{pseErrors.documentType.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número documento *
                      </label>
                      <Input
                        type="text"
                        placeholder="Número de documento"
                        {...registerPse('documentNumber')}
                      />
                      {pseErrors.documentNumber && (
                        <p className="text-sm text-red-500 mt-1">{pseErrors.documentNumber.message}</p>
                      )}
                    </div>

                    {/* Banco */}
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Banco *
                      </label>
                      <Controller
                        control={pseControl}
                        name="bank"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bancolombia">Bancolombia</SelectItem>
                              <SelectItem value="davivienda">Davivienda</SelectItem>
                              <SelectItem value="bbva">BBVA</SelectItem>
                              <SelectItem value="banco-bogota">Banco de Bogotá</SelectItem>
                              <SelectItem value="banco-occidente">Banco de Occidente</SelectItem>
                              <SelectItem value="banco-popular">Banco Popular</SelectItem>
                              <SelectItem value="banco-agrario">Banco Agrario</SelectItem>
                              <SelectItem value="nequi">Nequi</SelectItem>
                              <SelectItem value="daviplata">Daviplata</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {pseErrors.bank && (
                        <p className="text-sm text-red-500 mt-1">{pseErrors.bank.message}</p>
                      )}
                    </div>

                    {/* Correo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correo al que llegará el certificado *
                      </label>
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        {...registerPse('email')}
                      />
                      {pseErrors.email && (
                        <p className="text-sm text-red-500 mt-1">{pseErrors.email.message}</p>
                      )}
                    </div>

                    {/* Confirmar correo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirmar correo *
                      </label>
                      <Input
                        type="email"
                        placeholder="Confirma tu email"
                        {...registerPse('confirmEmail')}
                      />
                      {pseErrors.confirmEmail && (
                        <p className="text-sm text-red-500 mt-1">{pseErrors.confirmEmail.message}</p>
                      )}
                    </div>

                    {/* Celular */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Celular *
                      </label>
                      <Input
                        type="tel"
                        placeholder="Tu número de celular"
                        {...registerPse('phone')}
                      />
                      {pseErrors.phone && (
                        <p className="text-sm text-red-500 mt-1">{pseErrors.phone.message}</p>
                      )}
                    </div>

                    {/* Dirección */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección *
                      </label>
                      <Input
                        type="text"
                        placeholder="Tu dirección"
                        {...registerPse('address')}
                      />
                      {pseErrors.address && (
                        <p className="text-sm text-red-500 mt-1">{pseErrors.address.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3 mt-6">
                    <div className="flex items-start gap-2">
                      <Controller
                        control={pseControl}
                        name="acceptCommunications"
                        render={({ field }) => (
                          <Checkbox
                            id="acceptCommunications"
                            checked={field.value === true}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                      <label htmlFor="acceptCommunications" className="text-sm text-gray-700 leading-tight">
                        Acepto recibir comunicaciones comerciales y promocionales de la empresa.
                      </label>
                    </div>
                  </div>

                  {/* Total + Botón Pagar */}
                  <div className="flex items-center justify-between mt-8 pt-4 border-t">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-primary hover:bg-primary-hover text-white px-8 py-3 text-lg tracking-wide"
                    >
                      {submitting ? 'Procesando...' : 'Pagar'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
