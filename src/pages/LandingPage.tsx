import React from 'react';
import Hero from '../components/Hero';
import ProblemSection from '../components/Landing/ProblemSection';
import SolutionSection from '../components/Landing/SolutionSection';
import FeaturesSection from '../components/Landing/FeaturesSection';

const LandingPage: React.FC = () => {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
    </>
  );
};

export default LandingPage;
