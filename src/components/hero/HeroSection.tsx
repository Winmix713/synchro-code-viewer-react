import React, { useState } from 'react';
import { Play, ArrowRight, Sparkles, Zap, Shield, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const HeroSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const stats = [
    { label: 'Active Users', value: '50,000+', icon: '👥' },
    { label: 'Code Generated', value: '1M+', icon: '⚡' },
    { label: 'Time Saved', value: '85%', icon: '⏰' },
    { label: 'Quality Score', value: '4.9/5', icon: '⭐' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent">
                Code Generator
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A powerful tool for generating code from your designs.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Real-time Generation</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Code className="w-4 h-4 text-purple-500" />
              <span>Multi-Framework</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Generating Code
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="group"
              onClick={() => setIsVideoPlaying(true)}
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 sm:mt-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-background to-muted/50 border border-border/40 hover:border-border/60 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Modal Placeholder */}
        {isVideoPlaying && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setIsVideoPlaying(false)}
          >
            <div className="relative w-full max-w-4xl mx-4 aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 mx-auto mb-4 text-white" />
                <p className="text-white">Demo video would play here</p>
                <Button 
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsVideoPlaying(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;