import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-walmart-blue text-white shadow-walmart">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-walmart-yellow text-walmart-blue px-4 py-2 rounded-walmart font-bold text-xl tracking-tight">
              Walmart
            </div>
            <span className="text-xl font-semibold">Smart Shopping</span>
          </Link>
          
          <nav className="flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-walmart-yellow transition-colors duration-200 font-medium">
              Home
            </Link>
            <Link href="/results" className="text-white hover:text-walmart-yellow transition-colors duration-200 font-medium">
              Results
            </Link>
            <Link href="/cart" className="text-white hover:text-walmart-yellow transition-colors duration-200 font-medium">
              Cart
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
