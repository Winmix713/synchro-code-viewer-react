
import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, Zap, Star, Clock, Shield, Code, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const primaryStats = [
    {
      id: 'users',
      label: 'Active Users',
      value: 50000,
      suffix: '+',
      icon: Users,
      description: 'Developers and designers worldwide',
      color: 'from-blue-500 to-cyan-500',
      trend: '+25% this month',
    },
    {
      id: 'projects',
      label: 'Projects Generated',
      value: 1000000,
      suffix: '+',
      icon: Code,
      description: 'Production-ready projects created',
      color: 'from-green-500 to-emerald-500',
      trend: '+40% this quarter',
    },
    {
      id: 'time-saved',
      label: 'Time Saved',
      value: 85,
      suffix: '%',
      icon: Clock,
      description: 'Average development time reduction',
      color: 'from-purple-500 to-pink-500',
      trend: 'Industry leading',
    },
    {
      id: 'satisfaction',
      label: 'Satisfaction Score',
      value: 4.9,
      suffix: '/5',
      icon: Star,
      description: 'Based on 10,000+ reviews',
      color: 'from-orange-500 to-red-500',
      trend: '98% would recommend',
    },
  ];

  const secondaryStats = [
    {
      label: 'Code Quality Score',
      value: '96%',
      description: 'Average quality assessment',
      icon: Shield,
    },
    {
      label: 'Frameworks Supported',
      value: '4+',
      description: 'React, Vue, Angular, HTML',
      icon: Code,
    },
    {
      label: 'Countries',
      value: '150+',
      description: 'Global user base',
      icon: Globe,
    },
    {
      label: 'Uptime',
      value: '99.9%',
      description: 'Service reliability',
      icon: TrendingUp,
    },
  ];

  const AnimatedNumber = ({ 
    value, 
    suffix = '', 
    duration = 2000 
  }: { 
    value: number; 
    suffix?: string; 
    duration?: number; 
  }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      const startTime = Date.now();
      const startValue = 0;
      const endValue = value;

      const updateValue = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(updateValue);
        }
      };

      requestAnimationFrame(updateValue);
    }, [isVisible, value, duration]);

    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
      }
      return num.toFixed(num < 10 ? 1 : 0);
    };

    return (
      <span className="tabular-nums">
        {formatNumber(displayValue)}
        {suffix}
      </span>
    );
  };

  return (
    <section id="stats-section" className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Trusted Worldwide
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Powering the Future of Development
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers and designers who trust FigmaForge to streamline their workflow
          </p>
        </div>

        {/* Primary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {primaryStats.map((stat, index) => (
            <Card 
              key={stat.id}
              className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 ${
                isVisible ? 'animate-fade-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`} />
              
              <CardContent className="relative p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl sm:text-4xl font-bold text-foreground">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {secondaryStats.map((stat, index) => (
            <Card 
              key={index}
              className={`group hover:shadow-md transition-all duration-300 ${
                isVisible ? 'animate-fade-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
            >
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <h3 className="text-lg font-semibold mb-6">
            Trusted by teams at leading companies
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Company logos placeholder */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i}
                className="w-32 h-12 bg-muted rounded-lg flex items-center justify-center hover:opacity-100 transition-opacity"
              >
                <span className="text-sm font-medium text-muted-foreground">
                  Company {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
