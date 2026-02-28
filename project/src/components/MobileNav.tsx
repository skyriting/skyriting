import { Link, useLocation } from 'react-router-dom';
import { Home, Plane, Calculator, TrendingDown, User } from 'lucide-react';

export default function MobileNav() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 md:hidden">
      <div className="grid grid-cols-5 h-16">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center space-y-1 transition ${
            isActive('/') ? 'text-sky-600' : 'text-slate-600'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium">Home</span>
        </Link>

        <Link
          to="/fleet"
          className={`flex flex-col items-center justify-center space-y-1 transition ${
            isActive('/fleet') ? 'text-sky-600' : 'text-slate-600'
          }`}
        >
          <Plane className="h-5 w-5" />
          <span className="text-xs font-medium">Fleet</span>
        </Link>

        <Link
          to="/pricing"
          className={`flex flex-col items-center justify-center space-y-1 transition ${
            isActive('/pricing') ? 'text-sky-600' : 'text-slate-600'
          }`}
        >
          <Calculator className="h-5 w-5" />
          <span className="text-xs font-medium">Pricing</span>
        </Link>

        <Link
          to="/packages"
          className={`flex flex-col items-center justify-center space-y-1 transition ${
            isActive('/packages') ? 'text-sky-600' : 'text-slate-600'
          }`}
        >
          <TrendingDown className="h-5 w-5" />
          <span className="text-xs font-medium">Packages</span>
        </Link>

        <Link
          to="/account"
          className={`flex flex-col items-center justify-center space-y-1 transition ${
            isActive('/account') ? 'text-sky-600' : 'text-slate-600'
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs font-medium">Account</span>
        </Link>
      </div>
    </nav>
  );
}
