import { z } from 'zod';

export const pseSchema = z.object({
  fullName: z.string().min(1, 'El nombre es requerido'),
  personType: z.string().min(1, 'Selecciona el tipo de persona'),
  documentType: z.string().min(1, 'Selecciona el tipo de documento'),
  documentNumber: z.string().min(1, 'El número de documento es requerido'),
  bank: z.string().min(1, 'Selecciona un banco'),
  email: z.email('Ingresa un email válido'),
  confirmEmail: z.email('Ingresa un email válido'),
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