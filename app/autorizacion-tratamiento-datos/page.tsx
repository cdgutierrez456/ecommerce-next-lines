'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AutorizacionTratamientoDatosPage() {
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
            Autorización de Tratamiento de Datos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl opacity-90"
          >
            Autorización para el tratamiento de datos personales
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
                  Autorización
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Al registrarte en la plataforma de Line&apos;s Actitud y aceptar la
                  presente autorización, de manera libre, expresa, voluntaria e informada,
                  autorizas a Line&apos;s Actitud para que recolecte, almacene, use,
                  circule, suprima, procese y, en general, trate tus datos personales de
                  conformidad con lo establecido en la Ley 1581 de 2012, el Decreto 1377
                  de 2013 y demás normas concordantes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  1. Datos objeto de tratamiento
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Los datos personales que serán objeto de tratamiento incluyen, pero no
                  se limitan a:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Nombre completo.</li>
                  <li>Correo electrónico.</li>
                  <li>Número de teléfono celular.</li>
                  <li>Dirección de domicilio y/o de entrega.</li>
                  <li>Información de transacciones y compras realizadas.</li>
                  <li>Datos de navegación y uso de la plataforma.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  2. Finalidades del tratamiento
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Los datos personales serán tratados para las siguientes finalidades:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Ejecutar la relación contractual derivada de las compras realizadas.</li>
                  <li>Gestionar el registro y la cuenta de usuario en la plataforma.</li>
                  <li>Procesar pagos y gestionar pedidos.</li>
                  <li>Realizar envíos y entregas de productos.</li>
                  <li>Contactarte por SMS, WhatsApp, correo electrónico o llamada telefónica para informarte sobre el estado de tus pedidos.</li>
                  <li>Enviarte información comercial, promociones y novedades (previa autorización).</li>
                  <li>Realizar análisis estadísticos y de mejora del servicio.</li>
                  <li>Atender solicitudes, quejas y reclamos.</li>
                  <li>Cumplir con obligaciones legales y regulatorias.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  3. Derechos del titular
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Como titular de los datos personales, tienes los siguientes derechos:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Conocer, actualizar y rectificar tus datos personales frente a Line&apos;s Actitud.</li>
                  <li>Solicitar prueba de la autorización otorgada para el tratamiento.</li>
                  <li>Ser informado respecto del uso que se le ha dado a tus datos personales.</li>
                  <li>Presentar ante la Superintendencia de Industria y Comercio quejas por infracciones a la ley.</li>
                  <li>Revocar la autorización y/o solicitar la supresión de tus datos cuando lo consideres pertinente.</li>
                  <li>Acceder de forma gratuita a tus datos personales que hayan sido objeto de tratamiento.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  4. Vigencia
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  La presente autorización permanecerá vigente durante el tiempo que
                  Line&apos;s Actitud mantenga la relación comercial contigo y durante el
                  período adicional que sea necesario para cumplir con las obligaciones
                  legales aplicables. Podrás revocar esta autorización en cualquier momento,
                  siguiendo el procedimiento establecido.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  5. Canal de atención
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Para ejercer tus derechos como titular de datos personales, puedes
                  comunicarte con nosotros a través de nuestra{' '}
                  <Link href="/contacto" className="text-primary hover:text-primary-hover underline">
                    página de contacto
                  </Link>{' '}
                  o enviando un correo electrónico a contacto@linesactitud.com con el
                  asunto &ldquo;Tratamiento de datos personales&rdquo;.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  6. Aceptación
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Al hacer clic en &ldquo;Continuar&rdquo; en el formulario de registro,
                  declaras que has leído y comprendido esta autorización y que consientes
                  de manera libre y voluntaria el tratamiento de tus datos personales
                  conforme a lo aquí establecido y a la{' '}
                  <Link
                    href="/declaracion-de-privacidad"
                    className="text-primary hover:text-primary-hover underline"
                  >
                    Declaración de Privacidad
                  </Link>{' '}
                  de Line&apos;s Actitud.
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
