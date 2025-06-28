
import React from 'react';
import { Zap, Shield, Code, Users, GitBranch, CheckCircle, TrendingUp, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const FeaturesGrid = () => {
  const primaryFeatures = [
    {
      id: 'real-time-generation',
      title: 'Real-Time Code Generation',
      description: 'Watch your Figma designs transform into production-ready code in real-time with live preview and instant feedback.',
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-500',
      benefits: ['Instant Preview', 'Live Updates', 'Real-time Feedback'],
    },
    {
      id: 'quality-assessment',
      title: 'AI-Powered Quality Assessment',
      description: 'Advanced quality scoring with accessibility, performance, and maintainability analysis using machine learning.',
      icon: Shield,
      gradient: 'from-green-500 to-emerald-500',
      benefits: ['WCAG Compliance', 'Performance Metrics', 'Code Quality'],
    },
    {
      id: 'multi-framework',
      title: 'Multi-Framework Support',
      description: 'Generate code for React, Vue, Angular, and vanilla HTML with TypeScript support and modern best practices.',
      icon: Code,
      gradient: 'from-purple-500 to-pink-500',
      benefits: ['React/Vue/Angular', 'TypeScript', 'Modern Patterns'],
    },
    {
      id: 'enterprise-security',
      title: 'Enterprise-Grade Security',
      description: 'SOC 2, GDPR, and HIPAA compliant with advanced security features, audit logging, and data protection.',
      icon: Shield,
      gradient: 'from-orange-500 to-red-500',
      benefits: ['SOC 2 Compliant', 'Data Protection', 'Audit Logging'],
    },
  ];

  const secondaryFeatures = [
    {
      id: 'collaboration',
      title: 'Real-Time Collaboration',
      description: 'Work together with your team in real-time with live updates and shared workspaces.',
      icon: Users,
    },
    {
      id: 'version-control',
      title: 'Version Control Integration',
      description: 'Seamless Git integration with automated commit messages and branch management.',
      icon: GitBranch,
    },
    {
      id: 'testing',
      title: 'Automated Testing',
      description: 'Generate unit, integration, and e2e tests automatically with high coverage.',
      icon: CheckCircle,
    },
    {
      id: 'optimization',
      title: 'Performance Optimization',
      description: 'Built-in performance optimization with bundle analysis and load time improvements.',
      icon: TrendingUp,
    },
    {
      id: 'deployment',
      title: 'One-Click Deployment',
      description: 'Deploy your generated code to popular platforms with a single click.',
      icon: Globe,
    },
    {
      id: 'customization',
      title: 'Advanced Customization',
      description: 'Customize code generation with plugins, templates, and configuration options.',
      icon: Code,
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to ship faster
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and features designed to streamline your design-to-development workflow
          </p>
        </div>

        {/* Primary Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {primaryFeatures.map((feature) => (
            <Card 
              key={feature.id} 
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
              
              <CardHeader className="relative">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <CardDescription className="text-base mb-6 leading-relaxed">
                  {feature.description}
                </CardDescription>
                <div className="flex flex-wrap gap-2">
                  {feature.benefits.map((benefit, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs"
                    >
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Secondary Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {secondaryFeatures.map((feature) => (
            <Card 
              key={feature.id} 
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                    <feature.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison CTA */}
        <div className="text-center mt-16">
          <Card className="inline-block p-8 border-dashed border-2 hover:border-solid transition-all duration-300">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-2">Need more details?</h3>
              <p className="text-muted-foreground mb-4">
                Compare all features and see detailed specifications
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  View Full Comparison
                </button>
                <button className="px-6 py-2 border rounded-lg hover:bg-muted transition-colors">
                  Download Spec Sheet
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
