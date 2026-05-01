import React from 'react';

function PowerfulFeatures() {
  const features = [
    {
      id: 1,
      icon: '📝',
      title: 'Inscription Sécurisée',
      description: 'Créez votre compte de manière sécurisée avec vérification d\'identité pour garantir la confiance entre professionnels.'
    },
    {
      id: 2,
      icon: '📢',
      title: 'Dépôt d\'Annonces',
      description: 'Publiez facilement vos offres ou demandes de médicaments avec tous les détails : quantité, prix, délai de livraison.'
    },
    {
      id: 3,
      icon: '🔍',
      title: 'Recherche & Filtrage',
      description: 'Trouvez rapidement les médicaments dont vous avez besoin avec des filtres avancés par type, quantité, localisation.'
    }
  ];

  return (
    <section id="functionalities" className="py-24 px-8 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block mb-4 bg-teal-100 text-teal-700 px-4 py-2 rounded-full font-semibold text-sm">
            Fonctionnalités
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Fonctionnalités Principales
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tous les outils dont vous avez besoin pour échanger vos produits pharmaceutiques de manière sécurisée et efficace
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map(feature => (
            <div key={feature.id} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-teal-200 group hover:translate-y-[-4px]">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 inline-block">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
              <div className="mt-6 h-1 w-12 bg-gradient-to-r from-teal-500 to-transparent group-hover:w-24 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PowerfulFeatures;