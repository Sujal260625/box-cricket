import { User } from '../../App';
import { Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  navigateTo: (page: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export function Navigation({ navigateTo, currentUser, onLogout }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicLinks = [
    { name: 'Home', page: 'home' },
    { name: 'Turfs', page: 'turfs' },
    { name: 'Live Scores', page: 'live-scores' },
    { name: 'Tournaments', page: 'tournaments' },
    { name: 'Reviews', page: 'reviews' },
  ];

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => navigateTo('home')}
          >
            <div className="text-2xl font-bold">TurfFlow</div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {publicLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => navigateTo(link.page)}
                className="hover:text-green-200 transition-colors text-sm lg:text-base whitespace-nowrap"
              >
                {link.name}
              </button>
            ))}
            
            {currentUser ? (
              <div className="flex items-center space-x-2 sm:space-x-4 ml-4 pl-4 border-l border-green-600">
                <button
                  onClick={() => {
                    const dashboardPage = `${currentUser.role}-dashboard`;
                    navigateTo(dashboardPage);
                  }}
                  className="bg-green-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-green-500 transition-colors text-sm"
                >
                  Dashboard
                </button>
                <span className="text-sm hidden sm:inline">{currentUser.name}</span>
                <button
                  onClick={onLogout}
                  className="hover:text-green-200 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="bg-white text-green-700 px-4 py-1.5 sm:px-6 sm:py-2 rounded-lg hover:bg-green-50 transition-colors text-sm"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-green-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {publicLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  navigateTo(link.page);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 hover:bg-green-600 rounded-lg transition-colors text-base"
              >
                {link.name}
              </button>
            ))}
            
            {currentUser ? (
              <>
                <div className="px-4 pt-2">
                  <div className="text-sm text-green-200 mb-2">Logged in as: {currentUser.name}</div>
                </div>
                <button
                  onClick={() => {
                    const dashboardPage = `${currentUser.role}-dashboard`;
                    navigateTo(dashboardPage);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 bg-green-600 rounded-lg hover:bg-green-500 text-base"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 hover:bg-green-600 rounded-lg text-base flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigateTo('login');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 bg-white text-green-700 rounded-lg hover:bg-green-50 text-base"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
