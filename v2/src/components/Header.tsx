import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Blocks', path: '/blocks' },
  { name: 'Transactions', path: '/transactions' },
  { name: 'Stats', path: '/transactions' },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 h-16">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/full_logo.png" alt="logo" className="h-8" />
          <span className="font-bold text-lg text-gray-800 hidden sm:inline">9cscan</span>
        </Link>
        <nav className="flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-bold font-sans hover:text-blue-600 transition-colors ${
                location.pathname.startsWith(item.path)
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
