'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, Star, ArrowRight, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' } }),
};

const values = [
  {
    icon: <Star className="h-7 w-7 text-red-400" />,
    title: 'Calidad real',
    desc: 'Cada prenda pasa por un proceso de selección riguroso. Nos importa que lo que uses dure, se vea bien y te haga sentir cómodo.',
  },
  {
    icon: <Heart className="h-7 w-7 text-red-400" />,
    title: 'Identidad colombiana',
    desc: 'Nacimos en un pequeño municipio del Caquetá y nos enorgullece llevar ese espíritu en cada diseño. Somos Colombia en cada hilo.',
  },
  {
    icon: <Shirt className="h-7 w-7 text-red-400" />,
    title: 'Precio justo',
    desc: 'Moda con carácter no tiene que ser cara. Ofrecemos prendas de calidad accesibles para que cualquier persona pueda vestir con actitud.',
  },
];

const timeline = [
  {
    year: '2015',
    title: 'El comienzo',
    desc: 'Line\'s Actitud nació en Belén de los Andaquíes, Caquetá — un sueño hecho realidad en el corazón del sur de Colombia.',
  },
  {
    year: 'Hoy',
    title: 'Una marca que crece',
    desc: 'Lo que empezó como una idea local se convirtió en una marca que llega a toda Colombia, representando el orgullo de los municipios pequeños.',
  },
  {
    year: 'Mañana',
    title: 'La diferencia',
    desc: 'Seguimos apostando por la calidad, la identidad y el precio justo. Queremos que te identifiques con nosotros y marques la diferencia.',
  },
];

export default function ConocenosPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 text-center overflow-hidden body-gradient">
        {/* Glow decorativo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-700/20 blur-[120px]" />
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="relative z-10 space-y-6 max-w-3xl"
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-red-400 uppercase">
            Belén de los Andaquíes · Caquetá · Colombia
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            LINE&apos;S{' '}
            <span className="text-red-500">ACTITUD</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-xl mx-auto leading-relaxed">
            Una marca nacida en un pequeño municipio colombiano con un propósito grande:
            hacer que te veas bien, te sientas bien y te identifiques con algo auténtico.
          </p>
          <motion.div variants={fadeUp} custom={1} className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-base gap-2">
              <Link href="/">
                Ver colección
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Línea decorativa abajo */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-700/60 to-transparent" />
      </section>

      {/* ── Nuestra historia ── */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-xs font-semibold tracking-[0.3em] text-red-400 uppercase mb-3">Nuestra historia</p>
            <h2 className="text-3xl sm:text-4xl font-bold">De un sueño a una marca</h2>
          </motion.div>

          <div className="relative">
            {/* Línea vertical de timeline */}
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-red-600/80 via-red-600/40 to-transparent -translate-x-px hidden sm:block" />

            <div className="space-y-12 sm:space-y-16">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i}
                  className={`relative flex flex-col sm:flex-row gap-6 sm:gap-12 ${i % 2 !== 0 ? 'sm:flex-row-reverse' : ''}`}
                >
                  {/* Contenido */}
                  <div className="sm:w-1/2">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-red-600/40 transition-colors">
                      <span className="inline-block text-red-400 font-bold text-sm tracking-widest uppercase mb-3">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Dot en el centro */}
                  <div className="hidden sm:flex sm:w-1/2 items-center justify-center relative">
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 border-4 border-[#0a0a0a] z-10" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Origen ── mapa/texto ── */}
      <section className="py-20 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={0}
            >
              <p className="text-xs font-semibold tracking-[0.3em] text-red-400 uppercase mb-3">Nuestro origen</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 leading-tight">
                Desde el Caquetá<br />
                <span className="text-red-400">para Colombia</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Belén de los Andaquíes es un municipio pequeño, pero con una cultura y una identidad enormes.
                Fue ahí, en 2015, donde nació Line&apos;s Actitud: con la convicción de que desde cualquier rincón
                del país se puede crear algo grande.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Queremos que cuando uses una prenda nuestra, sientas ese orgullo regional.
                Que sepas que hay personas reales detrás de cada diseño, trabajando con pasión
                desde un lugar que tal vez el mapa no destaca, pero que tiene todo el estilo del mundo.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={1}
              className="flex justify-center"
            >
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                {/* Círculo decorativo */}
                <div className="absolute inset-0 rounded-full bg-red-700/10 border border-red-600/20" />
                <div className="absolute inset-6 rounded-full bg-red-700/10 border border-red-600/15" />
                <div className="absolute inset-12 rounded-full bg-red-700/15 border border-red-600/20 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-10 w-10 text-red-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-white">Belén de los</p>
                    <p className="text-sm font-bold text-white">Andaquíes</p>
                    <p className="text-xs text-red-400 mt-1">Caquetá · Colombia</p>
                  </div>
                </div>
                {/* Punto pulsante */}
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-50" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Valores ── */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold tracking-[0.3em] text-red-400 uppercase mb-3">Lo que nos mueve</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Nuestros valores</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-red-600/40 hover:bg-white/[0.07] transition-all group"
              >
                <div className="mb-4 w-12 h-12 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center group-hover:bg-red-600/20 transition-colors">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-20 px-4">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="container mx-auto max-w-3xl text-center"
        >
          <div className="relative bg-gradient-to-br from-red-900/40 to-red-700/20 border border-red-700/30 rounded-3xl p-10 sm:p-16 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-red-600/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-red-600/10 blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Marca la diferencia
              </h2>
              <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed">
                Únete a quienes eligen vestir con identidad. Explora nuestra colección
                y lleva contigo un pedazo de Colombia.
              </p>
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white px-10 py-6 text-base gap-2">
                <Link href="/">
                  Ver colección completa
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Año fundación flotante */}
      <div className="py-8 text-center">
        <p className="text-xs text-gray-600 flex items-center justify-center gap-2">
          <Calendar className="h-3 w-3" />
          Fundada en 2015 · Belén de los Andaquíes, Caquetá
        </p>
      </div>
    </div>
  );
}
