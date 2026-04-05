'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { pseSchema } from '../schemas/pse';
import type { Bank } from '../interfaces/bank';
import type { CartItem } from '../interfaces/cart';
import type { ShippingData } from '../interfaces/shipping';

export type { Bank, CartItem, ShippingData };
export type PseFormData = z.infer<typeof pseSchema>;

interface UsePseFormParams {
  shippingData: ShippingData | null;
  cartItems: CartItem[];
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
}

export function usePseForm({ shippingData, cartItems, submitting, setSubmitting }: UsePseFormParams) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const res = await fetch('/api/megapagos/banks');
        if (res.ok) {
          const data = await res.json();
          setBanks(data.data || []);
        } else {
          toast.error('Error al cargar los bancos');
        }
      } catch (error) {
        console.error('Error fetching banks:', error);
        toast.error('Error al cargar los bancos');
      } finally {
        setLoadingBanks(false);
      }
    };

    fetchBanks();
  }, []);

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

  const buildPseBody = (pseData: PseFormData) => {
    const totalAmount = cartItems?.reduce?.(
      (sum, item) => sum + (item?.product?.price ?? 0) * (item?.quantity ?? 0),
      0
    ) ?? 0;

    const totalUnits = cartItems?.reduce?.(
      (sum, item) => sum + (item?.quantity ?? 0),
      0
    ) ?? 0;

    return {
      data: {
        extraData: {
          idtiposolicitud: 5,
          idtipooperacion: 5,
          linkcode: '-1',
          idusuario: '',
          solicitudenvio: 'N',
          externalurl: '',
        },
        step1: {
          name: '',
          description: '',
          value: totalAmount,
          in_stock: true,
          idimpuesto: 21,
          shipping_cost: 0,
          requested_units: totalUnits,
          total_amount: totalAmount,
          payment_amount: 0,
        },
        step3: {
          terms_and_conditions: true,
          payment_method: 'pse',
          biller_name: pseData.fullName,
          biller_email: pseData.email,
          biller_address: pseData.address,
          payment_info: {
            pse_bank: pseData.bank,
            pse_person_type: pseData.personType,
            pse_document: pseData.documentNumber,
            pse_name: pseData.fullName,
            pse_phone: pseData.phone,
            pse_document_type: pseData.documentType,
          },
        },
      },
    };
  };

  const onPseSubmit = async (pseData: PseFormData) => {
    if (!shippingData) return;
    setSubmitting(true);

    try {
      const body = buildPseBody(pseData);

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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

  return {
    banks,
    loadingBanks,
    registerPse,
    handlePseSubmit,
    pseControl,
    pseErrors,
    onPseSubmit,
    submitting,
  };
}
