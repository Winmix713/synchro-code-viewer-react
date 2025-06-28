
import { ExportFormat } from '@/types/export-options';

export const EXPORT_FORMAT_CONFIGS = {
  [ExportFormat.CSS]: {
    name: 'CSS Variables',
    description: 'CSS custom properties with fallbacks',
    extension: '.css',
    mimeType: 'text/css',
    syntax: 'css',
    features: ['variables', 'fallbacks', 'media-queries'],
    template: ':root {\n  {{tokens}}\n}',
    tokenTemplate: '--{{name}}: {{value}};'
  },
  [ExportFormat.SCSS]: {
    name: 'Sass Variables',
    description: 'Sass/SCSS variables and mixins',
    extension: '.scss',
    mimeType: 'text/scss',
    syntax: 'scss',
    features: ['variables', 'mixins', 'functions', 'maps'],
    template: '// Design Tokens\n{{tokens}}\n\n// Token Maps\n{{maps}}',
    tokenTemplate: '${{name}}: {{value}};'
  },
  [ExportFormat.JS]: {
    name: 'JavaScript',
    description: 'JavaScript ES6 modules',
    extension: '.js',
    mimeType: 'application/javascript',
    syntax: 'javascript',
    features: ['modules', 'tree-shaking', 'typescript-support'],
    template: 'export const tokens = {\n{{tokens}}\n};',
    tokenTemplate: '  {{name}}: {{value}},'
  },
  [ExportFormat.TS]: {
    name: 'TypeScript',
    description: 'TypeScript with full type definitions',
    extension: '.ts',
    mimeType: 'application/typescript',
    syntax: 'typescript',
    features: ['types', 'interfaces', 'enums', 'modules'],
    template: 'export interface Tokens {\n{{types}}\n}\n\nexport const tokens: Tokens = {\n{{tokens}}\n};',
    tokenTemplate: '  {{name}}: {{value}},'
  },
  [ExportFormat.JSON]: {
    name: 'JSON',
    description: 'Standard JSON format',
    extension: '.json',
    mimeType: 'application/json',
    syntax: 'json',
    features: ['standard', 'lightweight', 'universal'],
    template: '{\n{{tokens}}\n}',
    tokenTemplate: '  "{{name}}": {{value}}'
  },
  [ExportFormat.TAILWIND]: {
    name: 'Tailwind CSS',
    description: 'Tailwind CSS configuration',
    extension: '.js',
    mimeType: 'application/javascript',
    syntax: 'javascript',
    features: ['utilities', 'components', 'theme-extension'],
    template: 'module.exports = {\n  theme: {\n    extend: {\n{{tokens}}\n    }\n  }\n};',
    tokenTemplate: '      {{category}}: {\n{{categoryTokens}}\n      },'
  }
} as const;

export const FORMAT_CATEGORIES = {
  'Web Development': [ExportFormat.CSS, ExportFormat.SCSS, ExportFormat.LESS],
  'JavaScript/TypeScript': [ExportFormat.JS, ExportFormat.TS, ExportFormat.JSON],
  'Frameworks': [ExportFormat.TAILWIND, ExportFormat.STYLE_DICTIONARY],
  'Design Tools': [ExportFormat.FIGMA_TOKENS],
  'Mobile Development': [ExportFormat.ANDROID_XML, ExportFormat.IOS_SWIFT, ExportFormat.FLUTTER_DART]
} as const;

export const POPULAR_FORMATS = [
  ExportFormat.CSS,
  ExportFormat.SCSS,
  ExportFormat.JS,
  ExportFormat.JSON,
  ExportFormat.TAILWIND
] as const;
