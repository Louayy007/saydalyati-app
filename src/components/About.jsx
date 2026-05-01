import React from 'react';

function About() {
  return (
    <section id="about1" className="py-24 px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* TEXTE */}
          <div>
            <div className="mb-6 inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full font-semibold text-sm">
              Notre Mission
            </div>

            <h2 className="text-5xl font-bold text-gray-900 mb-8">
              Connecter les professionnels de santé
            </h2>
            
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              SAYDALYATI est une plateforme digitale conçue pour simplifier l'échange de produits 
              pharmaceutiques entre pharmacies, hôpitaux et laboratoires. Nous résolvons le problème 
              des pénuries de médicaments en créant un réseau de confiance et d'efficacité.
            </p>

            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Notre plateforme permet aux professionnels de santé d'accéder rapidement aux produits 
              dont ils ont besoin, tout en maximisant leurs ventes et en réduisant les stocks dormants.
            </p>

            {/* 3 PILIERS */}
            <div className="space-y-6">
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
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl blur-xl opacity-40"></div>
              <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl overflow-hidden shadow-2xl p-2 relative">
                <div className="bg-white rounded-xl h-96 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-112fdf541310?w=500&h=400&fit=crop"
                    alt="À propos SAYDALYATI"
                    className="w-full h-full object-cover"
                    onError={(e) => {e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 500 400%22%3E%3Crect fill=%22%23f0f9ff%22 width=%22500%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23006d6d%22 text-anchor=%22middle%22 dy=%22.3em%22%3EPharmaceutical Professionals%3C/text%3E%3C/svg%3E';}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;