
import { CodePreview } from '../components/code-preview';

const Index = () => {
  const sampleCode = {
    jsx: `import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WelcomeCard = () => {
  const [count, setCount] = useState(0);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome to Your App</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          This is a sample component with a counter.
        </p>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setCount(count + 1)}
            variant="default"
          >
            Count: {count}
          </Button>
          <Button 
            onClick={() => setCount(0)}
            variant="outline"
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;`,
    css: `/* Welcome Card Styles */
.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.welcome-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.welcome-card .card-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.welcome-card .card-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.welcome-card .card-content {
  padding: 24px;
}

.welcome-card .button-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.welcome-card .count-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.welcome-card .count-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.welcome-card .reset-button {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.welcome-card .reset-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.7);
}`,
    types: `import { ReactNode } from 'react';

// Component Props Interface
export interface WelcomeCardProps {
  /** Optional title override */
  title?: string;
  /** Optional description text */
  description?: string;
  /** Initial counter value */
  initialCount?: number;
  /** Custom CSS classes */
  className?: string;
  /** Child components */
  children?: ReactNode;
  /** Callback when count changes */
  onCountChange?: (count: number) => void;
  /** Callback when reset is clicked */
  onReset?: () => void;
}

// Button Variant Types
export type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';

// Button Size Types
export type ButtonSize = 'sm' | 'md' | 'lg';

// Card Component Props
export interface CardProps {
  /** Card content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

// Card Header Props
export interface CardHeaderProps {
  /** Header content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// Card Title Props
export interface CardTitleProps {
  /** Title text */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Heading level */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

// Card Content Props
export interface CardContentProps {
  /** Content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// Theme Context Types
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Counter Hook Return Type
export interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (value: number) => void;
}`
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Production-Ready Code Preview
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            An enterprise-grade React component with syntax highlighting, copy/download functionality, 
            and full accessibility support. Built with TypeScript and modern React patterns.
          </p>
        </div>

        <div className="space-y-8">
          <CodePreview
            codeContent={sampleCode}
            title="Welcome Card Component"
            showLineNumbers={true}
            enableCopy={true}
            enableDownload={true}
            onTabChange={(tabId) => console.log('Tab changed to:', tabId)}
            onCopy={(content, tabId) => console.log('Copied from:', tabId)}
            onDownload={(content, tabId) => console.log('Downloaded from:', tabId)}
          />

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Features Showcase
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Syntax Highlighting",
                  description: "Professional code highlighting with theme support",
                  icon: "🎨"
                },
                {
                  title: "Copy to Clipboard",
                  description: "Modern clipboard API with fallback support",
                  icon: "📋"
                },
                {
                  title: "File Download",
                  description: "Download code files with proper extensions",
                  icon: "💾"
                },
                {
                  title: "Keyboard Shortcuts",
                  description: "Ctrl+C to copy, Ctrl+S to download",
                  icon: "⌨️"
                },
                {
                  title: "Accessibility",
                  description: "WCAG 2.1 AA compliant with screen reader support",
                  icon: "♿"
                },
                {
                  title: "Error Handling",
                  description: "Graceful error boundaries and fallbacks",
                  icon: "⚡"
                }
              ].map((feature, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
