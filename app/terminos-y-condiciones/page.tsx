'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TerminosCondicionesPage() {
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
            Términos y Condiciones
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl opacity-90"
          >
            Condiciones de uso de nuestra plataforma
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
                  1. Aceptación de los términos
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Al acceder y utilizar la plataforma de Line&apos;s Actitud, aceptas cumplir
                  con estos Términos y Condiciones. Si no estás de acuerdo con alguna parte
                  de estos términos, te recomendamos no utilizar nuestros servicios.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  2. Uso de la plataforma
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Al usar nuestra plataforma, te comprometes a:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Proporcionar información veraz y actualizada al registrarte.</li>
                  <li>Mantener la confidencialidad de tu cuenta y contraseña.</li>
                  <li>No utilizar la plataforma para fines ilegales o no autorizados.</li>
                  <li>No intentar acceder a áreas restringidas de la plataforma.</li>
                  <li>No reproducir, duplicar o revender ninguna parte del servicio.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  3. Registro de cuenta
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Para realizar compras, debes crear una cuenta proporcionando tu nombre,
                  correo electrónico, número de teléfono y una contraseña. Eres responsable
                  de toda la actividad que ocurra bajo tu cuenta. Debes notificarnos
                  inmediatamente sobre cualquier uso no autorizado.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  4. Productos y precios
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Nos esforzamos por mostrar información precisa sobre nuestros productos,
                  incluyendo descripciones, imágenes y precios. Sin embargo, no garantizamos
                  que la información esté libre de errores. Nos reservamos el derecho de
                  corregir errores de precio y cancelar pedidos afectados, notificándote
                  oportunamente. Los precios están expresados en pesos colombianos (COP) e
                  incluyen los impuestos aplicables.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  5. Proceso de compra y pago
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  El proceso de compra incluye:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Selección de productos y adición al carrito de compras.</li>
                  <li>Revisión del pedido y confirmación de datos de envío.</li>
                  <li>Pago seguro procesado a través de Stripe.</li>
                  <li>Confirmación del pedido por correo electrónico.</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  No almacenamos directamente los datos de tu tarjeta de crédito o débito.
                  Toda la información de pago es procesada de forma segura por Stripe.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  6. Envíos y entregas
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Los tiempos de entrega pueden variar según la ubicación y disponibilidad
                  del producto. Realizamos envíos a nivel nacional dentro de Colombia.
                  Te proporcionaremos información de seguimiento una vez tu pedido sea
                  despachado. No nos hacemos responsables por demoras causadas por el
                  transportador o por fuerza mayor.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  7. Devoluciones y garantías
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  De acuerdo con la legislación colombiana, tienes derecho a la devolución
                  del producto dentro de los 5 días hábiles siguientes a la entrega, siempre
                  que el producto se encuentre en su estado original, sin uso y con todas sus
                  etiquetas. Para iniciar una devolución, contáctanos a través de nuestra
                  página de contacto.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  8. Propiedad intelectual
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Todo el contenido de la plataforma (textos, imágenes, logotipos, diseños,
                  software) es propiedad de Line&apos;s Actitud o de sus licenciantes y está
                  protegido por las leyes de propiedad intelectual. Queda prohibida su
                  reproducción, distribución o uso sin autorización previa por escrito.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  9. Limitación de responsabilidad
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Line&apos;s Actitud no será responsable por daños indirectos, incidentales
                  o consecuentes que surjan del uso de la plataforma. Nuestra responsabilidad
                  máxima se limita al valor del pedido en cuestión.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  10. Modificaciones
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Nos reservamos el derecho de modificar estos Términos y Condiciones en
                  cualquier momento. Los cambios serán efectivos desde su publicación en la
                  plataforma. El uso continuado de nuestros servicios constituye la aceptación
                  de los términos modificados.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  11. Legislación aplicable
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Estos Términos y Condiciones se rigen por las leyes de la República de
                  Colombia. Cualquier controversia será resuelta ante los tribunales
                  competentes de la ciudad de Medellín.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  12. Contacto
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Para preguntas sobre estos términos, puedes contactarnos a través de
                  nuestra{' '}
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
