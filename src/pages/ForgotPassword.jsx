import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
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

          <h2 className="text-4xl font-bold text-gray-900 mb-3">Mot de passe oublié</h2>
          <p className="text-gray-600 text-base mb-10">
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <button
                type="submit"
                className="w-full bg-yellow-400 text-black py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
              >
                Envoyer le lien
              </button>

              <Link
                to="/login"
                className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Retour à la connexion
              </Link>
            </form>
          ) : (
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-5">
              <p className="text-teal-800 font-semibold">Email envoyé</p>
              <p className="text-sm text-teal-700 mt-2">
                Si un compte existe avec <span className="font-semibold">{email}</span>, vous recevrez un lien de réinitialisation.
              </p>
              <Link
                to="/login"
                className="mt-5 inline-block text-teal-700 font-semibold hover:text-teal-800"
              >
                Retour à la connexion
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-500 to-teal-700 text-white flex-col justify-center items-center px-12">
        <div className="text-center max-w-sm">
          <h3 className="text-4xl font-bold mb-8 leading-tight">Récupérez l'accès à votre compte</h3>
          <p className="text-teal-100 text-base leading-relaxed">
            La sécurité de vos informations reste notre priorité. Réinitialisez votre mot de passe en quelques étapes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;