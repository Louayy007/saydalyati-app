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
  const isMarketplace = location.pathname === '/marketplace';

  React.useEffect(() => {
    const query = new URLSearchParams(location.search).get('search') || '';
    setSearchQuery(query);
  }, [location.search]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) { navigate('/marketplace'); return; }
    navigate(`/marketplace?search=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center gap-4">

        {/* Logo - toujours visible */}
        <Link to={isLoggedIn ? '/dashboard' : '/'} className="flex items-center gap-2 cursor-pointer shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-xl font-bold text-teal-700">SAYDALYATI</h1>
        </Link>

        {/* Liens landing — visibles uniquement si NON connecté */}
        {!isLoggedIn && (
          <div className="hidden xl:flex items-center gap-6 ml-4">
            {location.pathname === '/' ? (
              <>
                <button onClick={() => scrollToSection('hero')} className="text-gray-600 hover:text-teal-700 font-medium transition cursor-pointer">Accueil</button>
                <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-teal-700 font-medium transition cursor-pointer">Utilisateurs</button>
                <button onClick={() => scrollToSection('functionalities')} className="text-gray-600 hover:text-teal-700 font-medium transition cursor-pointer">Fonctionnalités</button>
                <button onClick={() => scrollToSection('about1')} className="text-gray-600 hover:text-teal-700 font-medium transition cursor-pointer">À Propos</button>
              </>
            ) : (
              <>
                <Link to="/" className="text-gray-600 hover:text-teal-700 font-medium transition">Accueil</Link>
                <Link to="/" className="text-gray-600 hover:text-teal-700 font-medium transition">Utilisateurs</Link>
                <Link to="/" className="text-gray-600 hover:text-teal-700 font-medium transition">Fonctionnalités</Link>
                <Link to="/" className="text-gray-600 hover:text-teal-700 font-medium transition">À Propos</Link>
              </>
            )}
          </div>
        )}

        {/* Barre de recherche — uniquement sur /marketplace et si connecté */}
        {isLoggedIn && isMarketplace && (
          <form onSubmit={handleSearchSubmit} className="flex flex-1 max-w-lg items-center gap-2 mx-4">
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
            <button type="submit" className="px-3 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition whitespace-nowrap">
              Chercher
            </button>
          </form>
        )}

        {/* Spacer pour pousser les boutons auth à droite */}
        <div className="flex-1" />

        {/* Auth Buttons */}
        <div className="flex items-center gap-3 shrink-0">
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
