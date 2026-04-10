import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import PowerfulFeatures from '../components/PowerfulFeatures';
import About from '../components/About';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <PowerfulFeatures />
      <About />
      <CTA />
      <Footer />
    </div>
  );
}

export default Landing;