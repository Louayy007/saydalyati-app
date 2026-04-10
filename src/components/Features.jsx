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
    <section id="features" className="py-20 px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pour tous les professionnels de santé
          </h2>
          <p className="text-gray-600 text-lg">
            Pharmacies, Hôpitaux et Laboratoires
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