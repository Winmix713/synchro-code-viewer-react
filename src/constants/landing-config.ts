
export const LANDING_PAGE_CONFIG = {
  brand: {
    name: 'FigmaForge',
    tagline: 'Transform Figma Designs into Production-Ready Code',
    description: 'Enterprise-grade Figma-to-code generation with AI-powered quality assessment and real-time collaboration.',
  },
  features: {
    primary: [
      {
        id: 'real-time-generation',
        title: 'Real-Time Code Generation',
        description: 'Watch your Figma designs transform into production-ready code in real-time with live preview.',
        icon: 'zap',
        gradient: 'from-blue-500 to-cyan-500',
      },
      {
        id: 'quality-assessment',
        title: 'AI-Powered Quality Assessment',
        description: 'Advanced quality scoring with accessibility, performance, and maintainability analysis.',
        icon: 'shield',
        gradient: 'from-green-500 to-emerald-500',
      },
      {
        id: 'multi-framework',
        title: 'Multi-Framework Support',
        description: 'Generate code for React, Vue, Angular, and vanilla HTML with TypeScript support.',
        icon: 'code',
        gradient: 'from-purple-500 to-pink-500',
      },
      {
        id: 'enterprise-ready',
        title: 'Enterprise-Grade Security',
        description: 'SOC 2, GDPR, and HIPAA compliant with advanced security features and audit logging.',
        icon: 'lock',
        gradient: 'from-orange-500 to-red-500',
      },
    ],
    secondary: [
      {
        id: 'collaboration',
        title: 'Real-Time Collaboration',
        description: 'Work together with your team in real-time with live updates and shared workspaces.',
        icon: 'users',
      },
      {
        id: 'version-control',
        title: 'Version Control Integration',
        description: 'Seamless Git integration with automated commit messages and branch management.',
        icon: 'git-branch',
      },
      {
        id: 'testing',
        title: 'Automated Testing',
        description: 'Generate unit, integration, and e2e tests automatically with high coverage.',
        icon: 'check-circle',
      },
      {
        id: 'optimization',
        title: 'Performance Optimization',
        description: 'Built-in performance optimization with bundle analysis and load time improvements.',
        icon: 'trending-up',
      },
    ],
  },
  metrics: {
    users: '50,000+',
    projects: '1M+',
    savings: '85%',
    satisfaction: '4.9/5',
  },
  testimonials: [
    {
      id: 'testimonial-1',
      quote: 'FigmaForge has revolutionized our design-to-development workflow. We\'ve reduced our development time by 80% while maintaining the highest quality standards.',
      author: 'Sarah Chen',
      role: 'Lead Developer',
      company: 'TechCorp',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e7?w=64',
      rating: 5,
    },
    {
      id: 'testimonial-2',
      quote: 'The quality assessment feature is incredible. It catches accessibility issues and performance problems before they make it to production.',
      author: 'Michael Rodriguez',
      role: 'Engineering Manager',
      company: 'StartupXYZ',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64',
      rating: 5,
    },
    {
      id: 'testimonial-3',
      quote: 'Enterprise-grade security and compliance made it easy for us to adopt FigmaForge across our entire organization.',
      author: 'Emily Johnson',
      role: 'CTO',
      company: 'Enterprise Inc',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64',
      rating: 5,
    },
  ],
  pricing: {
    plans: [
      {
        id: 'starter',
        name: 'Starter',
        price: 0,
        period: 'month',
        description: 'Perfect for individual designers and small projects',
        features: [
          '10 generations per month',
          'Basic quality assessment',
          'HTML/CSS export',
          'Community support',
        ],
        cta: 'Start Free',
        popular: false,
      },
      {
        id: 'professional',
        name: 'Professional',
        price: 29,
        period: 'month',
        description: 'Ideal for professional developers and small teams',
        features: [
          'Unlimited generations',
          'Advanced quality assessment',
          'Multi-framework support',
          'Real-time collaboration',
          'Version control integration',
          'Priority support',
        ],
        cta: 'Start Trial',
        popular: true,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        period: 'month',
        description: 'Complete solution for large teams and organizations',
        features: [
          'Everything in Professional',
          'Advanced security & compliance',
          'Custom integrations',
          'Dedicated account manager',
          'SLA guarantees',
          '24/7 premium support',
        ],
        cta: 'Contact Sales',
        popular: false,
      },
    ],
  },
  social: {
    github: 'https://github.com/figmaforge',
    twitter: 'https://twitter.com/figmaforge',
    discord: 'https://discord.gg/figmaforge',
    linkedin: 'https://linkedin.com/company/figmaforge',
  },
} as const;

export const ANIMATION_CONFIG = {
  duration: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.5s',
  },
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  },
  delays: {
    stagger: '0.1s',
    cascade: '0.05s',
  },
} as const;

export const PERFORMANCE_CONFIG = {
  budgets: {
    initialBundle: 300000, // 300KB
    totalBundle: 1000000, // 1MB
    firstPaint: 1500, // 1.5s
    firstContentfulPaint: 2000, // 2s
    largestContentfulPaint: 2500, // 2.5s
    firstInputDelay: 100, // 100ms
    cumulativeLayoutShift: 0.1,
  },
  optimization: {
    imageSizes: [320, 640, 768, 1024, 1280, 1920],
    imageFormats: ['avif', 'webp', 'jpg'],
    criticalCss: true,
    preloadFonts: true,
    prefetchResources: true,
  },
} as const;

export const ACCESSIBILITY_CONFIG = {
  wcag: {
    level: 'AAA',
    guidelines: [
      'perceivable',
      'operable',
      'understandable',
      'robust',
    ],
  },
  features: {
    keyboardNavigation: true,
    screenReader: true,
    highContrast: true,
    reducedMotion: true,
    colorBlindness: true,
    voiceControl: true,
  },
  testing: {
    automated: true,
    manual: true,
    userTesting: true,
  },
} as const;
