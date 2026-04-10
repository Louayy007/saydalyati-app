import React from 'react';
import { Link } from 'react-router-dom';

function CTA() {
  return (
    <section className="py-20 px-8 bg-teal-600 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">
          Prêt à rejoindre la communauté ?
        </h2>
        <p className="text-lg text-teal-100 mb-8">
          Commencez dès maintenant à optimiser votre gestion de médicaments
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/signup"
            className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-500 transition"
          >
            S'inscrire Gratuitement
          </Link>
          <Link 
            to="/login"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-teal-700 transition"
          >
            Se Connecter
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTA;