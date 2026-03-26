'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Send, User, MessageSquare } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export default function ContactoPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Mensaje enviado correctamente. ¡Te contactaremos pronto!');
      reset();
    } catch {
      toast.error('Error al enviar el mensaje. Intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-screen body-gradient">
      {/* Hero */}
      <section className="text-white h-[25dvh] flex items-center">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Contáctanos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl opacity-90"
          >
            Estamos aquí para ayudarte. Escríbenos y te responderemos a la brevedad.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Información de contacto</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900 font-medium">contacto@linesactitud.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Teléfono</p>
                      <p className="text-gray-900 font-medium">+57 300 000 0000</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Dirección</p>
                      <p className="text-gray-900 font-medium">Medellin - Colombia</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Horario de atención</h2>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Lunes – Viernes</span>
                    <span className="font-medium">8:00 am – 6:00 pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado</span>
                    <span className="font-medium">9:00 am – 2:00 pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo</span>
                    <span className="font-medium text-gray-400">Cerrado</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un mensaje</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        {...register('name', { required: 'El nombre es requerido' })}
                        className="pl-10"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        {...register('email', {
                          required: 'El email es requerido',
                          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email inválido' },
                        })}
                        className="pl-10"
                        placeholder="tu@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono <span className="text-gray-400 font-normal">(opcional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="tel"
                        {...register('phone')}
                        className="pl-10"
                        placeholder="+57 300 000 0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mensaje
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        {...register('message', { required: 'El mensaje es requerido' })}
                        rows={5}
                        placeholder="Escribe tu mensaje aquí..."
                        className="w-full pl-10 pr-3 py-2 border border-input rounded-md text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                      />
                    </div>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-hover py-6 text-lg"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
