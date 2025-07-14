import Link from 'next/link';

export default function Header() {
  return (
    <header className="backdrop-blur-sm bg-walmart-blue/95 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-between h-19">
          {/* Modern Logo Design */}
          <Link href="/" className="relative group -ml-20">
            <div className="flex items-center gap-2 ">
              <span className="bg-gradient-to-r from-walmart-yellow to-yellow-400 text-walmart-blue px-4 py-1.5 
                rounded-lg font-bold text-4xl tracking-tight ring-2 ring-walmart-yellow/50 ring-offset-2 
                ring-offset-walmart-blue group-hover:ring-offset-3 transition-all duration-100">
                Walmart
              </span>
              {/* <span className="hidden md:block text-sm font-medium bg-clip-text text-transparent 
                bg-gradient-to-r from-walmart-yellow to-white">
                Smart Cart
              </span> */}
            </div>
          </Link>

          {/* Glass-morphism Navigation */}
          <nav className="flex items-center">
            <div className="flex space-x-1 -mr-19 bg-white/10 backdrop-blur-md rounded-lg p-1">
              <Link 
                href="/" 
                className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                  hover:bg-walmart-yellow hover:text-walmart-blue active:scale-95"
              >
                Home
              </Link>
              
              <Link 
                href="/results" 
                className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                  hover:bg-walmart-yellow hover:text-walmart-blue active:scale-95"
              >
                Results
              </Link>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Shimmer effect line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-walmart-yellow to-transparent 
        animate-shimmer"></div>
    </header>
  );
}
