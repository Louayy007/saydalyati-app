import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
  const [userType, setUserType] = useState('pharmacy');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    certificate: null
  });
  const navigate = useNavigate();

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setFormData(f => ({ ...f, certificate: file }));
  }

  function handleSignUp(e) {
    e.preventDefault();
    console.log('SignUp:', { userType, ...formData });
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen bg-white flex">
      
      {/* LEFT SIDE - Form */}
      <div className="w-full lg:w-1/2 px-12 py-12 flex flex-col justify-center overflow-y-auto">
        <div className="max-w-md w-full">
          
          {/* Logo - CLICKABLE */}
          <Link to="/" className="flex items-center gap-3 mb-12 w-fit">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center hover:bg-teal-700 transition">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 hover:text-teal-700 transition">SAYDALYATI</h1>
          </Link>

          {/* Title */}
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Créer un compte</h2>
          <p className="text-gray-600 text-base mb-8">Rejoignez la plateforme de coordination de médicaments</p>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-6">
            
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-4">
                Sélectionnez votre type d'établissement
              </label>
              <div className="flex gap-4">
                
                {/* Pharmacy */}
                <button
                  type="button"
                  onClick={() => setUserType('pharmacy')}
                  className={`flex-1 py-4 border-2 rounded-lg transition text-center ${
                    userType === 'pharmacy' 
                      ? 'border-teal-600 bg-teal-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-3xl mb-2">🏪</div>
                  <p className="text-sm font-medium text-gray-900">Pharmacie</p>
                </button>

                {/* Hospital */}
                <button
                  type="button"
                  onClick={() => setUserType('hospital')}
                  className={`flex-1 py-4 border-2 rounded-lg transition text-center ${
                    userType === 'hospital' 
                      ? 'border-teal-600 bg-teal-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-3xl mb-2">🏥</div>
                  <p className="text-sm font-medium text-gray-900">Hôpital</p>
                </button>

                {/* Laboratory */}
                <button
                  type="button"
                  onClick={() => setUserType('laboratory')}
                  className={`flex-1 py-4 border-2 rounded-lg transition text-center ${
                    userType === 'laboratory' 
                      ? 'border-teal-600 bg-teal-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-3xl mb-2">🧪</div>
                  <p className="text-sm font-medium text-gray-900">Laboratoire</p>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Nom de l'établissement</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Pharmacie Centrale"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-gray-50 text-gray-700 placeholder-gray-400"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="votre@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-gray-50 text-gray-700 placeholder-gray-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Mot de passe</label>
              <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-gray-50 text-gray-700 placeholder-gray-400"
                required
              />
            </div>

            {/* Certificate Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                {userType === 'pharmacy' && 'Certificat d\'inscription à l\'Ordre des Pharmaciens'}
                {userType === 'hospital' && 'Agrément du Ministère de la Santé'}
                {userType === 'laboratory' && 'Licence d\'exploitation du Laboratoire'}
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition cursor-pointer">
                <input 
                  type="file"
                  onChange={handleFileChange}
                  className="w-full cursor-pointer"
                  accept=".pdf,.jpg,.png"
                  id="certificate-upload"
                />
                <label htmlFor="certificate-upload" className="cursor-pointer">
                  <p className="text-2xl mb-2">📎</p>
                  <p className="text-sm text-gray-600">Cliquez pour télécharger un fichier</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG - Max 5MB</p>
                </label>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input 
                type="checkbox"
                className="w-4 h-4 mt-1 accent-teal-600 cursor-pointer"
                required
              />
              <p className="text-xs text-gray-600 leading-relaxed">
                J'accepte les Conditions d'utilisation et la Politique de confidentialité
              </p>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-yellow-400 text-black py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
            >
              Créer mon compte
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Déjà inscrit ? <Link to="/login" className="text-teal-600 font-bold hover:text-teal-700">Se connecter</Link>
          </p>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-10 leading-relaxed">
            En vous inscrivant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Teal Stats */}
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

export default SignUp;