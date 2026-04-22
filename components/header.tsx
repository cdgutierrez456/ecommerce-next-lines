'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGuestCart } from '@/store/cart-store';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { data: session, status } = useSession() || {};
  const guestCart = useGuestCart();
  const [apiCartCount, setApiCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchCartCount();

      // const interval = setInterval(() => {
      //   fetchCartCount();
      // }, 3000);

      // return () => clearInterval(interval);
    } else {
      setApiCartCount(0);
    }
  }, [session]);

  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        const totalItems = data?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;
        setApiCartCount(totalItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const cartCount = session?.user
    ? apiCartCount
    : guestCart.items.reduce((sum, item) => sum + item.quantity, 0);

  if (!mounted) {
    return null;
  }

  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/products?category=gorras', label: 'Gorras' },
    { href: '/products?category=camisetas', label: 'Camisetas' },
    { href: '/contacto', label: 'Contacto' },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full body-gradient">
      {/* Barra principal */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-18 items-center justify-between">

          {/* Nav izquierda — solo desktop */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-200 hover:text-white transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Botón burger — solo mobile */}
          <button
            className="md:hidden text-gray-200 hover:text-white p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo centrado */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center leading-none">
            <span className="text-2xl font-extrabold text-white tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              LINE&apos;S <span className="text-red-500">ACTITUD</span>
            </span>
            <span className="text-xs text-red-400 italic font-medium" style={{ fontFamily: 'cursive' }}>
              Dale estilo a tu vida
            </span>
          </Link>

          {/* Iconos derecha */}
          <div className="flex items-center gap-3 lg:gap-5">
            {isAdmin && (
              <Link href="/admin" className="text-gray-200 hover:text-white transition-colors" title="Admin">
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            )}
            {status === 'authenticated' && session ? (
              <>
                <Link href="/orders" className="text-gray-200 hover:text-white transition-colors" title={session.user?.name || 'Mi cuenta'}>
                  <User className="h-5 w-5" />
                </Link>
                <Link href="/cart" className="relative text-gray-200 hover:text-white transition-colors" title="Carrito">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text[9px] font-bold text-white">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="text-gray-200 hover:text-white transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-200 hover:text-white transition-colors" title="Iniciar sesión">
                  <User className="h-5 w-5" />
                </Link>
                <Link href="/cart" className="relative text-gray-200 hover:text-white transition-colors" title="Carrito">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menú móvil — dropdown absoluto */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay para cerrar al tocar fuera */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-18 z-40 bg-black/50 md:hidden"
              onClick={closeMenu}
            />

            {/* Panel del menú */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute top-full left-0 right-0 z-50 md:hidden body-gradient border-t border-white/10 shadow-2xl"
            >
              <nav className="container mx-auto max-w-7xl px-4 py-3 flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between py-3 px-2 text-base font-medium text-gray-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors border-b border-white/5 last:border-0"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Sección de usuario autenticado */}
                {status === 'authenticated' && session && (
                  <>
                    <div className="my-2 border-t border-white/10" />
                    <Link
                      href="/orders"
                      className="flex items-center justify-between py-3 px-2 text-base font-medium text-gray-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors border-b border-white/5"
                      onClick={closeMenu}
                    >
                      Mis Órdenes
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center justify-between py-3 px-2 text-base font-medium text-gray-200 hover:text-white hover:bg-white/5 rounded-lg transition-colors border-b border-white/5"
                        onClick={closeMenu}
                      >
                        Panel Admin
                      </Link>
                    )}
                    <div className="flex items-center justify-between py-3 px-2 mt-1">
                      <span className="text-sm text-gray-400 truncate">
                        {session.user?.name || session.user?.email}
                      </span>
                      <button
                        onClick={() => { closeMenu(); signOut({ callbackUrl: '/login' }); }}
                        className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors ml-4 shrink-0"
                      >
                        <LogOut className="h-4 w-4" />
                        Salir
                      </button>
                    </div>
                  </>
                )}

                {/* CTA login si no está autenticado */}
                {status !== 'authenticated' && (
                  <>
                    <div className="my-2 border-t border-white/10" />
                    <Link
                      href="/login"
                      className="flex items-center justify-center gap-2 py-2.5 px-4 mt-1 mb-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors"
                      onClick={closeMenu}
                    >
                      <User className="h-4 w-4" />
                      Iniciar sesión
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
