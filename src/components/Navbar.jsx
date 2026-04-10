import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const location = useLocation();

  // Fonction pour scroller vers une section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-xl font-bold text-teal-700">SAYDALYATI</h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          
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
              onClick={() => setIsLoggedIn(false)}
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