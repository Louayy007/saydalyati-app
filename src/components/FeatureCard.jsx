import React from 'react';

function FeatureCard({ image, title, description }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-teal-200 group cursor-pointer hover:translate-y-[-4px]">
      <div className="relative overflow-hidden h-56">
        <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        <a href="#" className="inline-flex items-center text-teal-600 font-semibold hover:text-teal-700 text-sm group-hover:gap-2 transition-all gap-1">
          En savoir plus 
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
    </div>
  );
}

export default FeatureCard;