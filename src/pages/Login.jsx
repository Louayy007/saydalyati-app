import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { apiRequest, setAuthSession } from '../lib/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state?.message) {
      setInfo(location.state.message);
    }
  }, [location.state]);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuthSession(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Connexion échouée');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      
    
      <div className="w-full lg:w-1/2 px-12 py-12 flex flex-col justify-center">
        <div className="max-w-md w-full">
          
         
          <Link to="/" className="flex items-center gap-3 mb-12 w-fit">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center hover:bg-teal-700 transition">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 hover:text-teal-700 transition">SAYDALYATI</h1>
          </Link>

         
          <h2 className="text-5xl font-bold text-gray-900 mb-3">Bienvenue</h2>
          <p className="text-gray-600 text-base mb-10">Connectez-vous pour accéder à votre tableau de bord</p>

          
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            {info && (
              <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                {info}
              </div>
            )}
            
            
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-gray-50 text-gray-700 placeholder-gray-400"
                required
              />
            </div>

          
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Mot de passe</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-gray-50 text-gray-700 placeholder-gray-400"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-teal-600"
                />
                <span className="text-gray-600 text-sm">Se souvenir de moi</span>
              </label>
              <Link to="/forgot-password" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                Mot de passe oublié ?
              </Link>
            </div>

            
            <button 
              type="submit"
              disabled={loading}
              className={`w-full bg-yellow-400 text-black py-3 rounded-lg font-bold hover:bg-yellow-500 transition mt-8 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

       
          <p className="text-center text-sm text-gray-600 mt-8">
            Pas encore de compte ? <Link to="/signup" className="text-teal-600 font-bold hover:text-teal-700">Créer un compte</Link>
          </p>

       
          <p className="text-xs text-gray-500 text-center mt-12 leading-relaxed">
            En vous connectant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité
          </p>
        </div>
      </div>

    
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-500 to-teal-700 text-white flex-col justify-center items-center px-12">
        <div className="text-center max-w-sm">
          <h3 className="text-4xl font-bold mb-8 leading-tight">
            Rejoignez 2,400+ Établissements de Santé
          </h3>
          <p className="text-teal-100 text-base mb-16 leading-relaxed">
            Coordonnez vos médicaments efficacement et contribuez à améliorer l'accès aux soins.
          </p>
          
          <div className="flex justify-around">
            <div>
              <p className="text-5xl font-bold mb-2">1,200+</p>
              <p className="text-teal-100 text-sm">Pharmacies</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">800+</p>
              <p className="text-teal-100 text-sm">Hôpitaux</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">400+</p>
              <p className="text-teal-100 text-sm">Laboratoires</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;