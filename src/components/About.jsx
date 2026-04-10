import React from 'react';

function About() {
  return (
    <section id="about1" className="py-20 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* TEXTE */}
          <div>
            <div className="mb-4 inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full font-semibold text-sm">
              Notre Mission
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Connecter les professionnels de santé
            </h2>
            
            <p className="text-gray-600 text-lg mb-4 leading-relaxed">
              SAYDALYATI est une plateforme digitale conçue pour simplifier l'échange de produits 
              pharmaceutiques entre pharmacies, hôpitaux et laboratoires. Nous résolvons le problème 
              des pénuries de médicaments en créant un réseau de confiance et d'efficacité.
            </p>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Notre plateforme permet aux professionnels de santé d'accéder rapidement aux produits 
              dont ils ont besoin, tout en maximisant leurs ventes et en réduisant les stocks dormants.
            </p>

            {/* 3 PILIERS */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎯</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Efficacité</h4>
                  <p className="text-gray-600 text-sm">
                    Trouvez et échangez les médicaments en quelques clics, pas en semaines
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-3xl">🔐</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Sécurité</h4>
                  <p className="text-gray-600 text-sm">
                    Vérification d'identité stricte et données protégées pour garantir la qualité
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="text-3xl">🌍</div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Accessibilité</h4>
                  <p className="text-gray-600 text-sm">
                    Ouverte à tous les professionnels de santé en Algérie, sans limitation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* IMAGE */}
          <div className="hidden lg:block">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg overflow-hidden shadow-2xl p-8">
              <div className="bg-white rounded-lg h-96 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-112fdf541310?w=500&h=400&fit=crop"
                  alt="À propos SAYDALYATI"
                  className="w-full h-full object-cover rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;