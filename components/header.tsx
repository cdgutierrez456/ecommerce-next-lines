'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, User, LogOut, LayoutDashboard, Search, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const { data: session, status } = useSession() || {};
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchCartCount();

      const interval = setInterval(() => {
        fetchCartCount();
      }, 3000);

      return () => clearInterval(interval);
    } else {
      setCartCount(0);
    }
  }, [session]);

  const fetchCartCount = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        const totalItems = data?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;
        setCartCount(totalItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  if (!mounted) {
    return null;
  }

  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/products?category=gorras', label: 'Gorras' },
    { href: '/products?category=perfumeria', label: 'Perfumería' },
    { href: '/products?category=ofertas', label: 'Ofertas' },
    { href: '/contacto', label: 'Contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full header-gradient h-[100px] flex items-center">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Navigation Links - Left */}
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

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-200 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo - Center */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-extrabold text-white tracking-wider" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                LINE&apos;S <span className="text-red-500">ACTITUD</span>
              </span>
              <span className="text-xs text-red-400 italic -mt-1 font-medium" style={{ fontFamily: 'cursive' }}>
                Dale estilo a tu vida
              </span>
            </div>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-3 lg:gap-5">
            {isAdmin && (
              <Link href="/admin" className="text-gray-200 hover:text-white transition-colors" title="Admin">
                <LayoutDashboard className="h-5 w-5" />
              </Link>
            )}

            <button className="text-gray-200 hover:text-white transition-colors" title="Buscar">
              <Search className="h-5 w-5" />
            </button>

            {status === 'authenticated' && session ? (
              <>
                <Link href="/orders" className="text-gray-200 hover:text-white transition-colors" title={session.user?.name || 'Mi cuenta'}>
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
                <Link href="/cart" className="text-gray-200 hover:text-white transition-colors" title="Carrito">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10">
          <nav className="container mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-200 hover:text-white transition-colors py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {status === 'authenticated' && session && (
              <>
                <hr className="border-white/10" />
                <Link
                  href="/orders"
                  className="text-sm font-medium text-gray-200 hover:text-white transition-colors py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mis Órdenes
                </Link>
                <span className="text-sm text-gray-400">
                  {session.user?.name || session.user?.email}
                </span>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
