'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DeclaracionPrivacidadPage() {
  return (
    <div className="min-h-screen body-gradient">
      {/* Hero */}
      <section className="text-white h-[20dvh] flex items-center">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Declaración de Privacidad
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl opacity-90"
          >
            Conoce cómo protegemos tu información personal
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-7">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            <p className="text-sm text-gray-500 mb-8">
              Última actualización: Abril 2026
            </p>

            <div className="prose prose-gray max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  1. Responsable del tratamiento
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Line&apos;s Actitud (en adelante, &ldquo;la Empresa&rdquo;), con domicilio en
                  Medellín, Colombia, es responsable del tratamiento de los datos personales
                  que recopilamos a través de nuestra plataforma de comercio electrónico.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  2. Datos que recopilamos
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Recopilamos los siguientes tipos de datos personales:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Datos de identificación: nombre completo, correo electrónico, número de teléfono.</li>
                  <li>Datos de acceso: contraseña cifrada, información de sesión.</li>
                  <li>Datos de compra: historial de pedidos, dirección de envío, información de pago (procesada por Stripe).</li>
                  <li>Datos de navegación: cookies, dirección IP, tipo de navegador y dispositivo.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  3. Finalidad del tratamiento
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Utilizamos tus datos personales para:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Gestionar tu cuenta de usuario y autenticación.</li>
                  <li>Procesar y entregar tus pedidos.</li>
                  <li>Enviar comunicaciones relacionadas con tus compras.</li>
                  <li>Enviarte información comercial y promociones (solo si aceptaste ser contactado).</li>
                  <li>Mejorar nuestros servicios y experiencia de usuario.</li>
                  <li>Cumplir con obligaciones legales y regulatorias.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  4. Compartición de datos
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  No vendemos ni compartimos tus datos personales con terceros, excepto con
                  proveedores de servicios esenciales para la operación de la plataforma
                  (procesamiento de pagos con Stripe, almacenamiento en la nube, servicios
                  de envío) y cuando sea requerido por la ley.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  5. Seguridad de los datos
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Implementamos medidas de seguridad técnicas y organizativas para proteger
                  tus datos personales contra acceso no autorizado, pérdida o alteración.
                  Las contraseñas se almacenan de forma cifrada y las transacciones de pago
                  se procesan de forma segura a través de Stripe.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  6. Derechos del titular
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  De acuerdo con la Ley 1581 de 2012 y el Decreto 1377 de 2013, tienes
                  derecho a:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Conocer, actualizar y rectificar tus datos personales.</li>
                  <li>Solicitar prueba de la autorización otorgada.</li>
                  <li>Ser informado sobre el uso que se le ha dado a tus datos.</li>
                  <li>Revocar la autorización y/o solicitar la supresión de tus datos.</li>
                  <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  7. Contacto
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Para ejercer tus derechos o resolver cualquier duda sobre esta declaración,
                  puedes contactarnos a través de nuestra{' '}
                  <Link href="/contacto" className="text-primary hover:text-primary-hover underline">
                    página de contacto
                  </Link>{' '}
                  o escribirnos a contacto@linesactitud.com.
                </p>
              </section>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al registro
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
