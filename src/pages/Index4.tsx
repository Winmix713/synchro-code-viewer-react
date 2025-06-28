
import React from 'react';
import Header from '@/components/layout/Header';
import HeroSection from '@/components/hero/HeroSection';
import FeaturesGrid from '@/components/features/FeaturesGrid';
import ProcessFlow from '@/components/process/ProcessFlow';
import GeneratorInterface from '@/components/generator/GeneratorInterface';
import StatsSection from '@/components/stats/StatsSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesGrid />
        <ProcessFlow />
        <GeneratorInterface />
      </main>
    </div>
  );
};

export default Index;
