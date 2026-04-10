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
    <section id="functionalities" className="py-20 px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Fonctionnalités Principales
          </h2>
          <p className="text-gray-600 text-lg">
            Tous les outils dont vous avez besoin pour échanger vos produits pharmaceutiques
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map(feature => (
            <div key={feature.id} className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-shadow border-t-4 border-teal-600">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PowerfulFeatures;