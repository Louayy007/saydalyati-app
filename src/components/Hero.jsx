import React from 'react';
import heroImg from '../images/hero.jpg';

function Hero() {
  return (
    <section id="hero" className="bg-gradient-to-r from-teal-600 via-teal-650 to-teal-700 text-white py-24 px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto flex items-center gap-16 relative z-10">
        <div className="flex-1">
          <h2 className="text-6xl font-black mb-8 leading-tight tracking-tight">
            Votre Plateforme de<br />Confiance pour<br />Coordonner les<br />Médicaments
          </h2>
          <p className="text-lg text-teal-50 mb-10 leading-relaxed max-w-xl">
            SAYDALYATI connecte pharmacies, hôpitaux et laboratoires pour optimiser l'échange de produits pharmaceutiques et résoudre les pénuries de médicaments.
          </p>
          <div className="flex gap-4 flex-wrap">
            <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              Commencer Maintenant
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              En Savoir Plus
            </button>
          </div>
        </div>
        <div className="flex-1 hidden lg:flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-white rounded-2xl opacity-20 blur-xl"></div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl relative">
              <img src={heroImg} alt="Pharmacien professionnel" className="w-full h-96 object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;