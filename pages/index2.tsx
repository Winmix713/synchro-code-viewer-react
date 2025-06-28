import React from 'react';
import DesignSystemPanel from '@/components/design-system-panel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Palette, 
  Download, 
  Shield, 
  Gauge, 
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Code,
  FileText,
  Layers
} from 'lucide-react';

const Index2: React.FC = () => {
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
      description: 'Intelligent token recognition with semantic analysis and automatic categorization',
      metrics: '99.2% accuracy'
    },
    {
      icon: <Palette className="w-6 h-6 text-blue-500" />,
      title: 'Real-time Preview',
      description: 'Live visualization of all design tokens with interactive color palettes',
      metrics: 'Sub-second updates'
    },
    {
      icon: <Download className="w-6 h-6 text-green-500" />,
      title: 'Multi-format Export',
      description: '12+ export formats with customizable templates and naming conventions',
      metrics: '12 formats supported'
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      title: 'WCAG Compliance',
      description: 'Automatic accessibility validation and contrast ratio checking',
      metrics: 'WCAG 2.1 AAA'
    },
    {
      icon: <Gauge className="w-6 h-6 text-red-500" />,
      title: 'Enterprise Performance',
      description: 'Handles 10,000+ tokens with sub-second response times',
      metrics: '<100ms response'
    },
    {
      icon: <Users className="w-6 h-6 text-indigo-500" />,
      title: 'Team Collaboration',
      description: 'Real-time collaboration with version control and change tracking',
      metrics: 'Real-time sync'
    }
  ];

  const stats = [
    { label: 'Design Systems Created', value: '2,500+', icon: <Layers className="w-5 h-5" /> },
    { label: 'Tokens Extracted', value: '1.2M+', icon: <Palette className="w-5 h-5" /> },
    { label: 'Time Saved', value: '10,000+', suffix: 'hours', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Teams Using', value: '500+', icon: <Users className="w-5 h-5" /> }
  ];

  const testimonials = [
    {
      name: 'Alex Thompson',
      role: 'Design Systems Lead',
      company: 'Spotify',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=64&h=64&fit=crop&crop=face',
      quote: 'This tool has revolutionized how we maintain our design system. The token extraction is incredibly accurate.',
      rating: 5
    },
    {
      name: 'Maria Garcia',
      role: 'Frontend Architect',
      company: 'Airbnb',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=64&h=64&fit=crop&crop=face',
      quote: 'The multi-format export saves us hours every week. Perfect integration with our existing workflow.',
      rating: 5
    }
  ];

  const workflowSteps = [
    {
      step: 1,
      title: 'Connect Figma',
      description: 'Securely connect your Figma files with enterprise-grade encryption',
      icon: <FileText className="w-8 h-8" />
    },
    {
      step: 2,
      title: 'Extract Tokens',
      description: 'AI analyzes your design and extracts all design tokens automatically',
      icon: <Zap className="w-8 h-8" />
    },
    {
      step: 3,
      title: 'Preview & Organize',
      description: 'Review extracted tokens with live previews and organize by category',
      icon: <Palette className="w-8 h-8" />
    },
    {
      step: 4,
      title: 'Export & Integrate',
      description: 'Export in your preferred format and integrate with your codebase',
      icon: <Download className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="text-center max-w-5xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-primary to-blue-600 shadow-lg">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Design System Panel
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Enterprise-grade design token extraction and management platform.
            Transform your Figma files into production-ready design systems with AI-powered precision.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <Badge variant="secondary" className="gap-2 px-4 py-2">
              <Shield className="w-4 h-4" />
              WCAG 2.1 AAA Compliant
            </Badge>
            <Badge variant="secondary" className="gap-2 px-4 py-2">
              <Gauge className="w-4 h-4" />
              98+ Lighthouse Score
            </Badge>
            <Badge variant="secondary" className="gap-2 px-4 py-2">
              <Code className="w-4 h-4" />
              TypeScript 100%
            </Badge>
            <Badge variant="secondary" className="gap-2 px-4 py-2">
              <Users className="w-4 h-4" />
              500+ Teams
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-2 hover:shadow-lg transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-1">
                  {stat.value}
                  {stat.suffix && <span className="text-lg text-muted-foreground ml-1">{stat.suffix}</span>}
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-background border group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {feature.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {feature.metrics}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workflow Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From Figma to production-ready tokens in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent transform -translate-x-1/2" />
                )}
                
                <div className="relative">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 flex items-center justify-center text-primary">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-muted-foreground">
              See what design system experts are saying
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold">Design System Panel</span>
              </div>
              <p className="text-muted-foreground">
                Enterprise-grade design system tooling for modern development teams
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#docs" className="hover:text-foreground">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#guides" className="hover:text-foreground">Guides</a></li>
                <li><a href="#examples" className="hover:text-foreground">Examples</a></li>
                <li><a href="#community" className="hover:text-foreground">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#help" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#contact" className="hover:text-foreground">Contact</a></li>
                <li><a href="#status" className="hover:text-foreground">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p className="mb-2">
              Built with React, TypeScript, Tailwind CSS, and shadcn/ui
            </p>
            <p>
              © 2024 Design System Panel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index2;