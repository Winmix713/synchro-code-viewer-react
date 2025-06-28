import React, { useState } from 'react';
import { Upload, Search, Cog, CheckCircle, Download, ArrowRight, Play } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const ProcessFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps = [
    {
      id: 'upload',
      title: 'Upload Design',
      description: 'Import your Figma file or paste the URL to get started',
      icon: Upload,
      color: 'from-blue-500 to-cyan-500',
      details: [
        'Figma URL or file upload',
        'Automatic design analysis',
        'Component detection',
        'Style extraction',
      ],
      metrics: {
        time: '< 5 seconds',
        accuracy: '99.9%',
        support: 'All Figma features',
      },
    },
    {
      id: 'analyze',
      title: 'AI Analysis',
      description: 'Our AI analyzes the design structure and identifies components',
      icon: Search,
      color: 'from-green-500 to-emerald-500',
      details: [
        'Component hierarchy mapping',
        'Design token extraction',
        'Responsive breakpoint detection',
        'Interaction pattern analysis',
      ],
      metrics: {
        time: '10-30 seconds',
        accuracy: '95%+',
        support: '50+ component types',
      },
    },
    {
      id: 'generate',
      title: 'Code Generation',
      description: 'Generate clean, production-ready code in your preferred framework',
      icon: Cog,
      color: 'from-purple-500 to-pink-500',
      details: [
        'Multi-framework support',
        'TypeScript generation',
        'Modern best practices',
        'Optimized output',
      ],
      metrics: {
        time: '15-45 seconds',
        accuracy: '98%+',
        support: 'React, Vue, Angular, HTML',
      },
    },
    {
      id: 'quality',
      title: 'Quality Assessment',
      description: 'Comprehensive quality analysis with accessibility and performance checks',
      icon: CheckCircle,
      color: 'from-orange-500 to-red-500',
      details: [
        'WCAG compliance checking',
        'Performance optimization',
        'Code quality analysis',
        'Security vulnerability scan',
      ],
      metrics: {
        time: '5-15 seconds',
        accuracy: '100%',
        support: 'WCAG 2.1 AAA',
      },
    },
    {
      id: 'export',
      title: 'Export & Deploy',
      description: 'Download your code or deploy directly to your favorite platform',
      icon: Download,
      color: 'from-teal-500 to-blue-500',
      details: [
        'Multiple export formats',
        'Git integration',
        'One-click deployment',
        'Documentation generation',
      ],
      metrics: {
        time: 'Instant',
        accuracy: '100%',
        support: '20+ platforms',
      },
    },
  ];

  const animateProcess = async () => {
    setIsAnimating(true);
    for (let i = 0; i < steps.length; i++) {
      setActiveStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setIsAnimating(false);
  };

  return (
    <section id="process" className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            How It Works
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            From Design to Code in Minutes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Our advanced AI-powered pipeline transforms your Figma designs into production-ready code with unmatched quality and speed
          </p>
          <Button 
            onClick={animateProcess}
            disabled={isAnimating}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            <Play className="w-4 h-4 mr-2" />
            {isAnimating ? 'Processing...' : 'Watch Demo'}
          </Button>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-green-500 via-purple-500 via-orange-500 to-teal-500 opacity-20" />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              
              return (
                <div key={step.id} className="relative">
                  {/* Mobile Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden absolute left-1/2 top-full w-0.5 h-8 bg-gradient-to-b from-gray-300 to-gray-200 transform -translate-x-1/2" />
                  )}

                  <Card 
                    className={`relative overflow-hidden transition-all duration-500 hover:shadow-xl cursor-pointer ${
                      activeStep === index 
                        ? 'scale-105 shadow-xl ring-2 ring-blue-500/20' 
                        : 'hover:scale-102'
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    {/* Progress Indicator */}
                    {activeStep === index && isAnimating && (
                      <div className="absolute top-0 left-0 right-0 h-1">
                        <Progress value={100} className="h-1" />
                      </div>
                    )}

                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-5`} />
                    
                    <CardHeader className="relative text-center">
                      <div className="flex justify-center mb-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${step.color} shadow-lg`}>
                          <StepIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Badge variant="outline" className="text-xs">
                          Step {index + 1}
                        </Badge>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {step.description}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="relative">
                      {/* Metrics */}
                      <div className="grid grid-cols-1 gap-3 mb-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium">{step.metrics.time}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Accuracy:</span>
                          <span className="font-medium">{step.metrics.accuracy}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Support:</span>
                          <span className="font-medium text-right">{step.metrics.support}</span>
                        </div>
                      </div>

                      {/* Arrow for desktop */}
                      {index < steps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                          <div className="w-8 h-8 bg-background border rounded-full flex items-center justify-center shadow-sm">
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed View */}
        <div className="mt-16">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${steps[activeStep].color}`}>
                  {React.createElement(steps[activeStep].icon, { className: "w-6 h-6 text-white" })}
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {steps[activeStep].title}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {steps[activeStep].description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Key Features</h4>
                  <ul className="space-y-2">
                    {steps[activeStep].details.map((detail, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Performance Metrics</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Processing Speed</span>
                        <span className="text-sm font-medium">95%</span>
                      </div>
                      <Progress value={95} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Accuracy</span>
                        <span className="text-sm font-medium">98%</span>
                      </div>
                      <Progress value={98} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Quality Score</span>
                        <span className="text-sm font-medium">96%</span>
                      </div>
                      <Progress value={96} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;