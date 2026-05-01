import React from 'react';
import FeatureCard from './FeatureCard';
import pharmacyImg from '../images/pharmacy.jpg';
import hospitalImg from '../images/hospital.jpg';
import laboImg from '../images/labo.jpg';

function Features() {
  const features = [
    {
      id: 1,
      image: pharmacyImg,
      title: 'Pharmacies',
      description: 'Trouvez régulièrement les médicaments manquants et optimisez votre gestion de stock.'
    },
    {
      id: 2,
      image: hospitalImg,
      title: 'Hôpitaux',
      description: 'Accédez à la ressource disponible sur le marché et gagnez du temps.'
    },
    {
      id: 3,
      image: laboImg,
      title: 'Laboratoires',
      description: 'Distribuez efficacement vos produits dans le réseau et suivez la demande en temps réel.'
    }
  ];

  return (
    <section id="features" className="py-24 px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block mb-4 bg-teal-100 text-teal-700 px-4 py-2 rounded-full font-semibold text-sm">
            Notre Plateforme
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Pour tous les professionnels de santé
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Pharmacies, Hôpitaux et Laboratoires trouvent leurs solutions en un seul endroit
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map(feature => (
            <FeatureCard
              key={feature.id}
              image={feature.image}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;