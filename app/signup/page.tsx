'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  acceptContact: boolean;
}

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<SignupFormData>({
    defaultValues: { acceptContact: true },
  });

  const acceptContact = watch('acceptContact');

  const onSubmit = async (data: SignupFormData) => {
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error || 'Error al registrarse');
        return;
      }

      toast.success('Cuenta creada exitosamente');

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Error al iniciar sesión');
        router.push('/login');
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Error al registrarse');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center body-gradient py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Crear Cuenta</h1>
            <p className="text-gray-600 mt-2">Regístrate en Line&apos;s Actitud</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* E-mail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
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
                  placeholder="ejemplo@correo.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="tel"
                  {...register('phone', {
                    required: 'El teléfono es requerido',
                    pattern: {
                      value: /^\+?[0-9\s\-()]{7,15}$/,
                      message: 'Teléfono inválido',
                    },
                  })}
                  className="pl-10"
                  placeholder="+57"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  {...register('name', { required: 'El nombre es requerido' })}
                  className="pl-10"
                  placeholder="Tu nombre"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'La contraseña es requerida',
                    minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                  })}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {/* Checkbox contacto */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="acceptContact"
                checked={acceptContact}
                onCheckedChange={(checked) =>
                  setValue('acceptContact', checked === true)
                }
              />
              <label
                htmlFor="acceptContact"
                className="text-sm text-gray-700 leading-tight cursor-pointer"
              >
                Acepto que me contacten por SMS y WhatsApp.
              </label>
            </div>

            {/* Texto legal */}
            <p className="text-sm text-gray-500 leading-relaxed">
              Al continuar, autorizo el uso de mis datos de acuerdo a la{' '}
              <Link
                href="/declaracion-de-privacidad"
                className="text-primary hover:text-primary-hover underline"
              >
                Declaración de privacidad
              </Link>{' '}
              y acepto los{' '}
              <Link
                href="/terminos-y-condiciones"
                className="text-primary hover:text-primary-hover underline"
              >
                Términos y condiciones
              </Link>{' '}
              y la{' '}
              <Link
                href="/autorizacion-tratamiento-datos"
                className="text-primary hover:text-primary-hover underline"
              >
                Autorización de tratamiento de datos
              </Link>
              .
            </p>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-hover py-6 text-lg"
            >
              {isSubmitting ? 'Creando cuenta...' : 'Continuar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-primary hover:text-primary-hover font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
