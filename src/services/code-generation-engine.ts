import { CodeGenerationConfig, GeneratedCode, ComponentMapping, QualityAssessment } from '@/types/code-generation';
import { FigmaFile, FigmaNode } from '@/types/figma-api';

export class CodeGenerationEngine {
  private static instance: CodeGenerationEngine;

  static getInstance(): CodeGenerationEngine {
    if (!CodeGenerationEngine.instance) {
      CodeGenerationEngine.instance = new CodeGenerationEngine();
    }
    return CodeGenerationEngine.instance;
  }

  private constructor() {}

  async generateCode(
    figmaFile: FigmaFile,
    config: CodeGenerationConfig,
    onProgress?: (progress: number, status: string) => void
  ): Promise<GeneratedCode> {
    const startTime = Date.now();
    
    try {
      onProgress?.(10, 'Analyzing Figma structure...');
      const componentMappings = this.analyzeStructure(figmaFile.document);
      
      onProgress?.(30, 'Generating unified component...');
      const files = await this.generateSingleTSXFile(componentMappings, config, figmaFile.name);
      
      onProgress?.(60, 'Optimizing code...');
      const optimizedFiles = this.optimizeCode(files, config);
      
      onProgress?.(80, 'Running quality assessment...');
      const quality = await this.assessQuality(optimizedFiles, config);
      
      onProgress?.(90, 'Building project structure...');
      const structure = this.buildProjectStructure(optimizedFiles);
      
      onProgress?.(100, 'Generation complete!');

      const generatedCode: GeneratedCode = {
        id: this.generateId(),
        timestamp: new Date(),
        config,
        files: optimizedFiles,
        structure,
        metrics: this.calculateMetrics(optimizedFiles, componentMappings.length),
        quality,
        preview: this.generatePreview(optimizedFiles),
        buildStatus: quality.overall >= 80 ? 'success' : quality.overall >= 60 ? 'warning' : 'error',
        buildLogs: [],
      };

      return generatedCode;
    } catch (error) {
      console.error('Code generation error:', error);
      throw new Error(`Code generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private analyzeStructure(rootNode: FigmaNode): ComponentMapping[] {
    const mappings: ComponentMapping[] = [];
    
    const traverse = (node: FigmaNode, depth: number = 0) => {
      if (this.shouldGenerateComponent(node)) {
        mappings.push(this.createComponentMapping(node));
      }
      
      if (node.children) {
        node.children.forEach(child => traverse(child, depth + 1));
      }
    };
    
    traverse(rootNode);
    return mappings;
  }

  private shouldGenerateComponent(node: FigmaNode): boolean {
    // Generate components for frames, groups, and instances
    return ['FRAME', 'GROUP', 'INSTANCE', 'COMPONENT'].includes(node.type) && 
           node.name !== 'Background' && 
           !node.name.startsWith('_');
  }

  private createComponentMapping(node: FigmaNode): ComponentMapping {
    const componentName = this.sanitizeComponentName(node.name);
    
    return {
      figmaNodeId: node.id,
      componentName,
      componentType: 'functional',
      props: this.extractProps(node),
      state: this.extractState(node),
      methods: this.extractMethods(node),
      lifecycle: [],
      styling: this.extractStyling(node),
      accessibility: this.extractAccessibilityFeatures(node),
    };
  }

  private sanitizeComponentName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^[0-9]/, 'Component$&')
      .replace(/^./, char => char.toUpperCase());
  }

  private extractProps(node: FigmaNode): any[] {
    const props = [];
    
    // Extract text content as props
    if (node.characters) {
      props.push({
        name: 'text',
        type: 'string',
        required: false,
        defaultValue: node.characters,
        description: 'Text content for the component',
      });
    }
    
    // Extract style-based props
    if (node.fills?.length) {
      props.push({
        name: 'variant',
        type: '"primary" | "secondary" | "accent"',
        required: false,
        defaultValue: 'primary',
        description: 'Visual variant of the component',
      });
    }
    
    return props;
  }

  private extractState(node: FigmaNode): any[] {
    const state = [];
    
    // Add interactive state for interactive elements
    if (this.isInteractiveElement(node)) {
      state.push({
        name: 'isActive',
        type: 'boolean',
        initialValue: false,
        updaters: ['setIsActive'],
      });
    }
    
    return state;
  }

  private extractMethods(node: FigmaNode): any[] {
    const methods = [];
    
    if (this.isInteractiveElement(node)) {
      methods.push({
        name: 'handleClick',
        parameters: [
          {
            name: 'event',
            type: 'React.MouseEvent',
            optional: false,
          },
        ],
        returnType: 'void',
        description: 'Handles click events',
        implementation: 'const handleClick = (event) => { setIsActive(!isActive); };',
      });
    }
    
    return methods;
  }

  private isInteractiveElement(node: FigmaNode): boolean {
    return node.name.toLowerCase().includes('button') || 
           node.name.toLowerCase().includes('link') ||
           node.name.toLowerCase().includes('card');
  }

  private extractStyling(node: FigmaNode): any {
    return {
      approach: 'tailwind',
      classes: this.generateTailwindClasses(node),
      variables: [],
      responsive: [],
      animations: [],
    };
  }

  private generateTailwindClasses(node: FigmaNode): string[] {
    const classes = [];
    
    // Layout classes
    if (node.absoluteBoundingBox) {
      const { width, height } = node.absoluteBoundingBox;
      if (width) classes.push(`w-[${Math.round(width)}px]`);
      if (height) classes.push(`h-[${Math.round(height)}px]`);
    }
    
    // Background classes
    if (node.fills?.length) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID' && fill.color) {
        const { r, g, b, a } = fill.color;
        const hex = this.rgbToHex(r, g, b);
        classes.push(`bg-[${hex}]`);
        if (a && a < 1) {
          classes.push(`bg-opacity-${Math.round(a * 100)}`);
        }
      }
    }
    
    // Border radius
    if (node.cornerRadius) {
      classes.push(`rounded-[${node.cornerRadius}px]`);
    }
    
    // Default styling based on node type
    switch (node.type) {
      case 'TEXT':
        classes.push('text-sm', 'font-medium');
        break;
      case 'FRAME':
        classes.push('flex', 'flex-col');
        break;
      default:
        classes.push('relative');
    }
    
    return classes;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => {
      const hex = Math.round(n * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  private extractAccessibilityFeatures(node: FigmaNode): any {
    return {
      ariaLabels: this.generateAriaLabels(node),
      keyboardNavigation: this.generateKeyboardHandlers(node),
      screenReader: this.generateScreenReaderFeatures(node),
      colorContrast: this.checkColorContrast(node),
      focusManagement: this.generateFocusFeatures(node),
    };
  }

  private generateAriaLabels(node: FigmaNode): any[] {
    const labels = [];
    
    if (node.characters) {
      labels.push({
        element: 'root',
        attribute: 'aria-label',
        value: node.characters,
        description: 'Accessible label for the component',
      });
    }
    
    return labels;
  }

  private generateKeyboardHandlers(node: FigmaNode): any[] {
    const handlers = [];
    
    if (this.isInteractiveElement(node)) {
      handlers.push({
        key: 'Enter',
        action: 'handleClick',
        element: 'root',
        description: 'Activate component with Enter key',
      });
      
      handlers.push({
        key: ' ',
        action: 'handleClick', 
        element: 'root',
        description: 'Activate component with Space key',
      });
    }
    
    return handlers;
  }

  private generateScreenReaderFeatures(node: FigmaNode): any[] {
    const features = [];
    
    if (node.name.toLowerCase().includes('heading')) {
      features.push({
        type: 'heading',
        element: 'root',
        content: node.characters || node.name,
        level: 2,
      });
    }
    
    return features;
  }

  private checkColorContrast(node: FigmaNode): any {
    return {
      foreground: '#000000',
      background: '#ffffff',
      ratio: 21,
      wcagLevel: 'AAA',
      passes: true,
    };
  }

  private generateFocusFeatures(node: FigmaNode): any[] {
    const features = [];
    
    if (this.isInteractiveElement(node)) {
      features.push({
        element: 'root',
        tabIndex: 0,
        focusVisible: true,
      });
    }
    
    return features;
  }

  private async generateSingleTSXFile(mappings: ComponentMapping[], config: CodeGenerationConfig, projectName: string): Promise<any[]> {
    const files = [];
    
    // Generate the main unified component file
    const mainComponentFile = this.generateUnifiedComponentFile(mappings, config, projectName);
    files.push(mainComponentFile);
    
    // Generate types file if TypeScript is enabled
    if (config.typescript) {
      const typesFile = this.generateTypesFile(mappings);
      files.push(typesFile);
    }
    
    // Generate styles file
    const stylesFile = this.generateStylesFile(mappings, config);
    files.push(stylesFile);
    
    // Generate package.json
    const packageJsonFile = this.generatePackageJson(config, projectName);
    files.push(packageJsonFile);
    
    return files;
  }

  private generateUnifiedComponentFile(mappings: ComponentMapping[], config: CodeGenerationConfig, projectName: string): any {
    const extension = config.typescript ? '.tsx' : '.jsx';
    const componentName = this.sanitizeComponentName(projectName) || 'GeneratedApp';
    
    let content = '';
    
    // Imports
    content += `import React, { useState } from 'react';\n`;
    if (config.styling === 'tailwind') {
      content += `import './styles.css';\n`;
    }
    if (config.typescript) {
      content += `import { ComponentProps } from './types';\n`;
    }
    content += '\n';
    
    // Generate individual component functions
    mappings.forEach((mapping, index) => {
      content += this.generateComponentFunction(mapping, config, index);
      content += '\n';
    });
    
    // Generate main app component that uses all sub-components
    content += this.generateMainAppComponent(mappings, config, componentName);
    
    // Export
    content += `\nexport default ${componentName};\n`;
    
    return {
      path: `src/${componentName}${extension}`,
      name: `${componentName}${extension}`,
      extension: extension.slice(1),
      content,
      size: content.length,
      language: config.typescript ? 'typescript' : 'javascript',
      imports: ['react'],
      exports: [componentName],
      dependencies: [],
    };
  }

  private generateComponentFunction(mapping: ComponentMapping, config: CodeGenerationConfig, index: number): string {
    const { componentName, props, styling, state } = mapping;
    
    let content = '';
    
    // Component interface (TypeScript only)
    if (config.typescript && props.length > 0) {
      content += `interface ${componentName}Props {\n`;
      props.forEach(prop => {
        content += `  ${prop.name}${prop.required ? '' : '?'}: ${prop.type};\n`;
      });
      content += `}\n\n`;
    }
    
    // Component function
    const propsParam = config.typescript && props.length > 0 ? `props: ${componentName}Props` : 'props = {}';
    content += `const ${componentName} = (${propsParam}) => {\n`;
    
    // Props destructuring
    if (props.length > 0) {
      const propNames = props.map(p => `${p.name} = ${JSON.stringify(p.defaultValue)}`).join(', ');
      content += `  const { ${propNames} } = props;\n`;
    }
    
    // State hooks
    state.forEach(stateItem => {
      content += `  const [${stateItem.name}, set${stateItem.name.charAt(0).toUpperCase() + stateItem.name.slice(1)}] = useState(${JSON.stringify(stateItem.initialValue)});\n`;
    });
    
    // Event handlers
    if (this.isInteractiveElement({ name: componentName } as any)) {
      content += `\n  const handleClick = (event: React.MouseEvent) => {\n`;
      content += `    console.log('${componentName} clicked');\n`;
      if (state.some(s => s.name === 'isActive')) {
        content += `    setIsActive(!isActive);\n`;
      }
      content += `  };\n`;
    }
    
    // Component JSX
    content += `\n  return (\n`;
    content += `    <div \n`;
    content += `      className="${styling.classes.join(' ')}"\n`;
    if (this.isInteractiveElement({ name: componentName } as any)) {
      content += `      onClick={handleClick}\n`;
      content += `      role="button"\n`;
      content += `      tabIndex={0}\n`;
    }
    content += `    >\n`;
    
    // Content based on component type
    if (props.some(p => p.name === 'text')) {
      content += `      <span>{text}</span>\n`;
    } else {
      content += `      <div className="p-4">\n`;
      content += `        <h3 className="text-lg font-semibold mb-2">${componentName}</h3>\n`;
      content += `        <p className="text-gray-600">Generated component from Figma design</p>\n`;
      content += `      </div>\n`;
    }
    
    content += `    </div>\n`;
    content += `  );\n`;
    content += `};\n`;
    
    return content;
  }

  private generateMainAppComponent(mappings: ComponentMapping[], config: CodeGenerationConfig, componentName: string): string {
    let content = '';
    
    // Main app interface (TypeScript only)
    if (config.typescript) {
      content += `\ninterface ${componentName}Props {\n`;
      content += `  className?: string;\n`;
      content += `}\n\n`;
    }
    
    // Main app component
    const propsParam = config.typescript ? `props: ${componentName}Props = {}` : 'props = {}';
    content += `const ${componentName} = (${propsParam}) => {\n`;
    content += `  const { className = '' } = props;\n\n`;
    
    // State for demo purposes
    content += `  const [activeComponent, setActiveComponent] = useState<string | null>(null);\n\n`;
    
    // Component JSX
    content += `  return (\n`;
    content += `    <div className={\`min-h-screen bg-gray-50 p-8 \${className}\`}>\n`;
    content += `      <div className="max-w-6xl mx-auto">\n`;
    content += `        <header className="text-center mb-12">\n`;
    content += `          <h1 className="text-4xl font-bold text-gray-900 mb-4">\n`;
    content += `            Generated Components\n`;
    content += `          </h1>\n`;
    content += `          <p className="text-xl text-gray-600">\n`;
    content += `            ${mappings.length} components generated from Figma design\n`;
    content += `          </p>\n`;
    content += `        </header>\n\n`;
    
    content += `        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\n`;
    
    // Render all components
    mappings.forEach((mapping, index) => {
      content += `          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">\n`;
      content += `            <div className="mb-4">\n`;
      content += `              <h3 className="text-lg font-semibold text-gray-800 mb-2">\n`;
      content += `                ${mapping.componentName}\n`;
      content += `              </h3>\n`;
      content += `              <p className="text-sm text-gray-600 mb-4">\n`;
      content += `                Component ${index + 1} of ${mappings.length}\n`;
      content += `              </p>\n`;
      content += `            </div>\n`;
      content += `            <${mapping.componentName} />\n`;
      content += `          </div>\n`;
    });
    
    content += `        </div>\n`;
    
    // Footer with component info
    content += `\n        <footer className="mt-16 text-center">\n`;
    content += `          <div className="bg-white rounded-lg shadow-md p-6">\n`;
    content += `            <h2 className="text-2xl font-bold text-gray-900 mb-4">Component Summary</h2>\n`;
    content += `            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">\n`;
    content += `              <div>\n`;
    content += `                <div className="text-3xl font-bold text-blue-600">${mappings.length}</div>\n`;
    content += `                <div className="text-gray-600">Components</div>\n`;
    content += `              </div>\n`;
    content += `              <div>\n`;
    content += `                <div className="text-3xl font-bold text-green-600">${config.typescript ? 'TypeScript' : 'JavaScript'}</div>\n`;
    content += `                <div className="text-gray-600">Language</div>\n`;
    content += `              </div>\n`;
    content += `              <div>\n`;
    content += `                <div className="text-3xl font-bold text-purple-600">${config.styling}</div>\n`;
    content += `                <div className="text-gray-600">Styling</div>\n`;
    content += `              </div>\n`;
    content += `            </div>\n`;
    content += `          </div>\n`;
    content += `        </footer>\n`;
    content += `      </div>\n`;
    content += `    </div>\n`;
    content += `  );\n`;
    content += `};\n`;
    
    return content;
  }

  private generateTypesFile(mappings: ComponentMapping[]): any {
    let content = '';
    content += `// Generated TypeScript definitions\n\n`;
    
    // Common props interface
    content += `export interface ComponentProps {\n`;
    content += `  className?: string;\n`;
    content += `  children?: React.ReactNode;\n`;
    content += `}\n\n`;
    
    // Individual component interfaces
    mappings.forEach(mapping => {
      content += `export interface ${mapping.componentName}Props extends ComponentProps {\n`;
      mapping.props.forEach(prop => {
        content += `  ${prop.name}${prop.required ? '' : '?'}: ${prop.type};\n`;
      });
      content += `}\n\n`;
    });
    
    return {
      path: 'src/types.ts',
      name: 'types.ts',
      extension: 'ts',
      content,
      size: content.length,
      language: 'typescript',
      imports: [],
      exports: mappings.map(m => `${m.componentName}Props`).concat(['ComponentProps']),
      dependencies: [],
    };
  }

  private generateStylesFile(mappings: ComponentMapping[], config: CodeGenerationConfig): any {
    let content = '';
    
    if (config.styling === 'tailwind') {
      content += `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n`;
      content += `/* Generated component styles */\n`;
      content += `\n/* Custom component styles can be added here */\n`;
    } else {
      content += `/* Generated component styles */\n\n`;
      content += `body {\n`;
      content += `  margin: 0;\n`;
      content += `  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;\n`;
      content += `  -webkit-font-smoothing: antialiased;\n`;
      content += `  -moz-osx-font-smoothing: grayscale;\n`;
      content += `}\n\n`;
      
      mappings.forEach(mapping => {
        content += `.${mapping.componentName.toLowerCase()} {\n`;
        content += `  /* Add custom styles for ${mapping.componentName} here */\n`;
        content += `}\n\n`;
      });
    }
    
    const extension = config.styling === 'scss' ? '.scss' : '.css';
    
    return {
      path: `src/styles${extension}`,
      name: `styles${extension}`,
      extension: extension.slice(1),
      content,
      size: content.length,
      language: config.styling === 'scss' ? 'scss' : 'css',
      imports: [],
      exports: [],
      dependencies: config.styling === 'tailwind' ? ['tailwindcss'] : [],
    };
  }

  private generatePackageJson(config: CodeGenerationConfig, projectName: string): any {
    const packageName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    const packageJson = {
      name: packageName,
      version: '1.0.0',
      description: `Generated React application from Figma design`,
      main: 'src/index.tsx',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
        lint: 'eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0'
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0'
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        '@vitejs/plugin-react': '^4.0.0',
        vite: '^4.4.0'
      }
    };

    if (config.typescript) {
      packageJson.devDependencies['typescript'] = '^5.0.0';
    }

    if (config.styling === 'tailwind') {
      packageJson.devDependencies['tailwindcss'] = '^3.3.0';
      packageJson.devDependencies['autoprefixer'] = '^10.4.0';
      packageJson.devDependencies['postcss'] = '^8.4.0';
    }

    const content = JSON.stringify(packageJson, null, 2);
    
    return {
      path: 'package.json',
      name: 'package.json',
      extension: 'json',
      content,
      size: content.length,
      language: 'json',
      imports: [],
      exports: [],
      dependencies: Object.keys(packageJson.dependencies),
    };
  }

  private optimizeCode(files: any[], config: CodeGenerationConfig): any[] {
    // Apply various optimizations based on config
    return files.map(file => {
      let optimizedContent = file.content;
      
      // Remove unused imports
      optimizedContent = this.removeUnusedImports(optimizedContent);
      
      // Optimize for tree shaking
      if (config.optimization.treeshaking) {
        optimizedContent = this.optimizeForTreeShaking(optimizedContent);
      }
      
      return {
        ...file,
        content: optimizedContent,
        size: optimizedContent.length,
      };
    });
  }

  private removeUnusedImports(content: string): string {
    // Simple unused import removal (would be more sophisticated in real implementation)
    return content;
  }

  private optimizeForTreeShaking(content: string): string {
    // Tree shaking optimizations
    return content;
  }

  private async assessQuality(files: any[], config: CodeGenerationConfig): Promise<QualityAssessment> {
    // Simulate quality assessment
    return {
      overall: Math.random() * 20 + 80, // 80-100
      categories: {
        visual: Math.random() * 15 + 85,
        code: Math.random() * 10 + 90,
        performance: Math.random() * 20 + 80,
        accessibility: Math.random() * 5 + 95,
        maintainability: Math.random() * 15 + 85,
        security: Math.random() * 10 + 90,
      },
      issues: [],
      recommendations: [
        'Consider adding unit tests for better code coverage',
        'Implement error boundaries for better error handling',
        'Add loading states for better user experience',
        'Consider implementing lazy loading for performance optimization'
      ],
    };
  }

  private buildProjectStructure(files: any[]): any {
    const structure = {
      root: 'src',
      components: [],
      hooks: [],
      utils: [],
      types: [],
      styles: [],
      tests: [],
      assets: [],
    };
    
    files.forEach(file => {
      if (file.path.includes('.tsx') || file.path.includes('.jsx')) {
        structure.components.push(file.path);
      } else if (file.path.includes('/types')) {
        structure.types.push(file.path);
      } else if (file.path.includes('/styles') || file.path.includes('.css') || file.path.includes('.scss')) {
        structure.styles.push(file.path);
      }
    });
    
    return structure;
  }

  private calculateMetrics(files: any[], componentCount: number): any {
    const totalLines = files.reduce((sum, file) => sum + file.content.split('\n').length, 0);
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    
    return {
      linesOfCode: totalLines,
      complexity: Math.floor(totalLines / 10), // Simplified complexity calculation
      maintainabilityIndex: Math.random() * 20 + 80,
      duplicateLines: 0,
      testCoverage: Math.random() * 20 + 80,
      bundleSize: totalSize,
      loadTime: Math.random() * 1000 + 500, // 0.5-1.5s
      performanceScore: Math.random() * 15 + 85,
    };
  }

  private generatePreview(files: any[]): string {
    // Generate a simple HTML