import React from 'react';
import heroImg from '../images/hero.jpg';

function Hero() {
  return (
    <section id="hero" className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-20 px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-12">
        <div className="flex-1">
          <h2 className="text-5xl font-black mb-6 leading-tight">
            Votre Plateforme de<br />Confiance pour<br />Coordonner les<br />Médicaments
          </h2>
          <p className="text-lg text-teal-100 mb-8 leading-relaxed">
            SAYDALYATI connecte pharmacies, hôpitaux et laboratoires pour optimiser l'échange de produits pharmaceutiques et résoudre les pénuries de médicaments.
          </p>
          <div className="flex gap-4">
            <button className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-500 transition">
              Commencer Maintenant
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-teal-700 transition">
              En Savoir Plus
            </button>
          </div>
        </div>
        <div className="flex-1 hidden lg:block">
          <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
            <img src={heroImg} alt="Pharmacien professionnel" className="w-full h-96 object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;