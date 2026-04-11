import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { clearAuthSession, getAuthToken, getAuthUser } from '../lib/api';

function Navbar() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const authToken = getAuthToken();
  const authUser = getAuthUser();
  const isLoggedIn = Boolean(authToken && authUser);

  React.useEffect(() => {
    const query = new URLSearchParams(location.search).get('search') || '';
    setSearchQuery(query);
  }, [location.search]);

  // Fonction pour scroller vers une section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      navigate('/marketplace');
      return;
    }
    navigate(`/marketplace?search=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-xl font-bold text-teal-700">SAYDALYATI</h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden xl:flex items-center gap-6">
          
          {/* Accueil - scroll to hero */}
          {location.pathname === '/' ? (
            <button 
              onClick={() => scrollToSection('hero')}
              className="text-gray-600 hover:text-teal-700 font-medium transition cursor-pointer"
            >
              Accueil
            </button>
          ) : (
            <Link to="/" className="text-gray-600 hover:text-teal-700 font-medium transition">
              Accueil
            </Link>
          )}

          {/* Utilisateurs - scroll to features */}
          {location.pathname === '/' ? (
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-teal-700 font-medium transition cursor-pointer"
            >
              Utilisateurs
            </button>
          ) : (
            <Link to="/" className="text-gray-600 hover:text-teal-700 font-medium transition">
              Utilisateurs
            </Link>
          )}

          {/* Fonctionnalités - scroll to functionalities */}
          {location.pathname === '/' ? (
            <button 
              onClick={() => scrollToSection('functionalities')}
              className="text-gray-600 hover:text-teal-700 font-medium transition cursor-pointer"
            >
              Fonctionnalités
            </button>
          ) : (
            <Link to="/" className="text-gray-600 hover:text-teal-700 font-medium transition">
              Fonctionnalités
            </Link>
          )}

          {/* À Propos - scroll to about1 */}
          {location.pathname === '/' ? (
            <button 
              onClick={() => scrollToSection('about1')}
              className="text-gray-600 hover:text-teal-700 font-medium transition cursor-pointer"
            >
              À Propos
            </button>
          ) : (
            <Link to="/" className="text-gray-600 hover:text-teal-700 font-medium transition">
              À Propos
            </Link>
          )}

          {/* Marketplace (si connecté) */}
          {isLoggedIn && (
            <Link to="/marketplace" className="text-gray-600 hover:text-teal-700 font-medium transition">
              Marketplace
            </Link>
          )}

          {/* Tableau de bord (si connecté) */}
          {isLoggedIn && (
            <Link to="/dashboard" className="text-gray-600 hover:text-teal-700 font-medium transition">
              Tableau de bord
            </Link>
          )}
        </div>

        {/* Global Search */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md items-center gap-2">
          <div className="relative w-full">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un médicament..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button type="submit" className="px-3 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition">
            Chercher
          </button>
        </form>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="text-teal-700 px-4 py-2 rounded-lg hover:bg-teal-50 font-medium transition">
                Se connecter
              </Link>
              <Link to="/signup" className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 font-bold transition">
                S'inscrire
              </Link>
            </>
          ) : (
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium transition"
            >
              Déconnexion
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;