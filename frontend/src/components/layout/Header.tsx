import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="XT Headlines Logo"
                width={200}
                height={60}
                priority
                className="h-16 w-auto"
              />
            </Link>
          </div>
          <nav className="flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Inicio
            </Link>
            <Link 
              href="/#categorias" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Categorías
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
