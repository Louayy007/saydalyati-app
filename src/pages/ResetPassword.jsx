import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Le lien de réinitialisation est invalide ou manquant.');
    }
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!password || password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
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

          <h2 className="text-4xl font-bold text-gray-900 mb-3">Réinitialiser votre mot de passe</h2>
          <p className="text-gray-600 text-base mb-10">
            Entrez votre nouveau mot de passe ci-dessous.
          </p>

          {success ? (
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-5">
              <p className="text-teal-800 font-semibold">Succès!</p>
              <p className="text-sm text-teal-700 mt-2">
                Votre mot de passe a été réinitialisé avec succès. Vous serez redirigé vers la page de connexion...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-gray-50 text-gray-700 placeholder-gray-400"
                  required
                  disabled={loading || !token}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-gray-50 text-gray-700 placeholder-gray-400"
                  required
                  disabled={loading || !token}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full bg-yellow-400 text-black py-3 rounded-lg font-bold hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Traitement...' : 'Réinitialiser le mot de passe'}
              </button>

              <Link
                to="/login"
                className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Retour à la connexion
              </Link>
            </form>
          )}
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-500 to-teal-700 text-white flex-col justify-center items-center px-12">
        <div className="text-center max-w-sm">
          <h3 className="text-4xl font-bold mb-8 leading-tight">Sécurisez votre compte</h3>
          <p className="text-teal-100 text-base leading-relaxed">
            Créez un nouveau mot de passe fort pour protéger votre compte SAYDALYATI.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
