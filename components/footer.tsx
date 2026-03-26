import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t body-gradient py-8 mt-auto">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-white font-semibold">
            © 2024 Line's Actitud. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/" className="text-sm text-white hover:text-primary transition-colors font-semibold">
              Inicio
            </Link>
            <Link href="/cart" className="text-sm text-white hover:text-primary transition-colors font-semibold">
              Carrito
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
