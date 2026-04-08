import { z } from 'zod';
import { patterns } from '@/lib/patterns';

export const pseSchema = z.object({
  fullName: z
    .string()
    .min(4, 'El nombre debe tener al menos 4 caracteres')
    .max(64, 'El nombre no puede superar 64 caracteres')
    .regex(new RegExp(patterns.ONLY_LETTERS_AND_SPACE), 'El nombre solo puede contener letras y espacios'),

  personType: z
    .string()
    .min(1, 'Selecciona el tipo de persona'),

  documentType: z
    .string()
    .min(1, 'Selecciona el tipo de documento'),

  documentNumber: z
    .string()
    .min(1, 'El número de documento es requerido')
    .max(15, 'El número de documento no puede superar 15 caracteres')
    .regex(new RegExp(patterns.ONLY_NUMBERS), 'El número de documento solo puede contener dígitos'),

  bank: z
    .string()
    .min(1, 'Selecciona un banco'),

  email: z
    .string()
    .regex(new RegExp(patterns.EMAIL), 'Ingresa un email válido'),

  confirmEmail: z
    .string()
    .regex(new RegExp(patterns.EMAIL), 'Ingresa un email válido'),

  phone: z
    .string()
    .length(10, 'El celular debe tener exactamente 10 dígitos')
    .regex(new RegExp(patterns.ONLY_NUMBERS), 'El celular solo puede contener dígitos'),

  address: z
    .string()
    .min(4, 'La dirección debe tener al menos 4 caracteres')
    .max(64, 'La dirección no puede superar 64 caracteres')
    .regex(new RegExp(patterns.ALL_VALID_CHARACTERES), 'La dirección contiene caracteres no permitidos'),

  acceptTerms: z.literal(true, {
    error: 'Debes aceptar los términos y condiciones',
  }),

  acceptCommunications: z.boolean().optional(),

}).refine((data) => data.email === data.confirmEmail, {
  message: 'Los correos no coinciden',
  path: ['confirmEmail'],
});
