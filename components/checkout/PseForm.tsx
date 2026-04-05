'use client';

import { Controller } from 'react-hook-form';
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
import { motion, AnimatePresence } from 'framer-motion';
import { DOCUMENT_TYPES } from '@/lib/constants';
import {
  usePseForm,
  type CartItem,
  type ShippingData
} from '../hooks/usePseForm';

interface PseFormProps {
  show: boolean;
  shippingData: ShippingData | null;
  cartItems: CartItem[];
  submitting: boolean;
  setSubmitting: (value: boolean) => void;
}

export default function PseForm({ show, shippingData, cartItems, submitting, setSubmitting }: PseFormProps) {
  const {
    banks,
    loadingBanks,
    registerPse,
    handlePseSubmit,
    pseControl,
    pseErrors,
    onPseSubmit,
  } = usePseForm({ shippingData, cartItems, submitting, setSubmitting });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {loadingBanks ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-gray-600">Cargando información...</span>
            </div>
          ) : (
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

              {/* Tipo documento */}
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
                        {DOCUMENT_TYPES.map((doc) => (
                          <SelectItem key={doc.idDT} value={doc.value}>
                            {doc.nameDT}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {pseErrors.documentType && (
                  <p className="text-sm text-red-500 mt-1">{pseErrors.documentType.message}</p>
                )}
              </div>

              {/* Número documento */}
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
                        {banks.map((bank) => (
                          <SelectItem key={bank.bankCode} value={bank.bankCode}>
                            {bank.bankName}
                          </SelectItem>
                        ))}
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
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
