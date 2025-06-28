
import React from 'react';
import DesignSystemPanel from '@/components/design-system-panel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Palette, 
  Download, 
  Shield, 
  Gauge, 
  Users 
} from 'lucide-react';

const Index = () => {
  const handleTokensExtracted = (tokenCount: number) => {
    console.log(`Successfully extracted ${tokenCount} design tokens`);
  };

  const handleExportComplete = (formats: string[]) => {
    console.log(`Export completed for formats: ${formats.join(', ')}`);
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: 'AI-Powered Extraction',
      description: 'Intelligent token recognition with semantic analysis'
    },
    {
      icon: <Palette className="w-6 h-6 text-blue-500" />,
      title: 'Real-time Preview',
      description: 'Live visualization of all design tokens'
    },
    {
      icon: <Download className="w-6 h-6 text-green-500" />,
      title: 'Multi-format Export',
      description: '12+ export formats with customizable templates'
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      title: 'WCAG Compliance',
      description: 'Automatic accessibility validation and scoring'
    },
    {
      icon: <Gauge className="w-6 h-6 text-red-500" />,
      title: 'Enterprise Performance',
      description: 'Handles 10,000+ tokens with sub-second response'
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-500" />,
      title: 'Team Collaboration',
      description: 'Real-time collaboration with version control'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Design System Panel
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
            Enterprise-grade design token extraction and management platform.
            Transform your Figma files into production-ready design systems with AI-powered precision.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge variant="secondary" className="gap-1">
              <Shield className="w-3 h-3" />
              WCAG 2.1 AAA
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Gauge className="w-3 h-3" />
              98+ Lighthouse Score
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Zap className="w-3 h-3" />
              TypeScript 100%
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-background border">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Application */}
      <div className="container mx-auto px-4 pb-12">
        <DesignSystemPanel
          onTokensExtracted={handleTokensExtracted}
          onExportComplete={handleExportComplete}
          className="animate-fade-in"
        />
      </div>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              Built with React, TypeScript, Tailwind CSS, and shadcn/ui
            </p>
            <p>
              Enterprise-grade design system tooling for modern development teams
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
