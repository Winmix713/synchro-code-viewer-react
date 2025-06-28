
import { DesignToken, TokenType } from './design-tokens';

export enum ExportFormat {
  CSS = 'css',
  SCSS = 'scss',
  LESS = 'less',
  JS = 'js',
  TS = 'ts',
  JSON = 'json',
  TAILWIND = 'tailwind',
  FIGMA_TOKENS = 'figma-tokens',
  STYLE_DICTIONARY = 'style-dictionary',
  ANDROID_XML = 'android-xml',
  IOS_SWIFT = 'ios-swift',
  FLUTTER_DART = 'flutter-dart'
}

export interface ExportConfiguration {
  id: string;
  name: string;
  formats: ExportFormat[];
  options: ExportOptions;
  filters: TokenFilter[];
  transformations: TokenTransformation[];
  template?: string;
  outputStructure: OutputStructure;
  minification: boolean;
  compression: boolean;
  validation: boolean;
}

export interface ExportOptions {
  includeMetadata: boolean;
  includeComments: boolean;
  usePrefixes: boolean;
  prefix?: string;
  useNamespaces: boolean;
  namespace?: string;
  sortTokens: boolean;
  sortBy: 'name' | 'type' | 'category' | 'usage';
  groupBy: 'type' | 'category' | 'none';
  includeDeprecated: boolean;
  resolveAliases: boolean;
  optimizeValues: boolean;
}

export interface TokenFilter {
  field: keyof DesignToken;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'notIn';
  value: string | string[] | number | boolean;
}

export interface TokenTransformation {
  type: 'rename' | 'prefix' | 'suffix' | 'replace' | 'scale' | 'convert';
  target: TokenType | 'all';
  parameters: Record<string, any>;
}

export enum OutputStructure {
  FLAT = 'flat',
  NESTED = 'nested',
  CATEGORIZED = 'categorized',
  MODULAR = 'modular'
}

export interface ExportResult {
  format: ExportFormat;
  content: string;
  filename: string;
  size: number;
  tokenCount: number;
  generatedAt: Date;
  warnings: string[];
  errors: string[];
  metadata: ExportMetadata;
}

export interface ExportMetadata {
  version: string;
  generator: string;
  exportedTokens: number;
  skippedTokens: number;
  transformationsApplied: string[];
  validationResults: ValidationResult[];
}

export interface ValidationResult {
  level: 'error' | 'warning' | 'info';
  message: string;
  tokenId?: string;
  suggestion?: string;
}
