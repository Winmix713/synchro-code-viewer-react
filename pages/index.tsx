import React from 'react';
import GeneratorInterface from '@/components/generator/GeneratorInterface';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <GeneratorInterface />
      </main>
    </div>
  );
};

export default Index;