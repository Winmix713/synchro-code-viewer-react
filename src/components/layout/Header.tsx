
import React, { useState } from 'react';
import { Menu, X, Zap, Github, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Process', href: '#process' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Docs', href: '#docs' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold">FigmaForge</span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Figma to Code
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Social Links - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://github.com/figmaforge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://twitter.com/figmaforge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
            </div>

            {/* CTA Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="border-t bg-background px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-2 border-t space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Sign In
              </Button>
              <Button size="sm" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500">
                Get Started
              </Button>
            </div>
            {/* Mobile Social Links */}
            <div className="flex items-center space-x-2 pt-2">
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://github.com/figmaforge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://twitter.com/figmaforge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
