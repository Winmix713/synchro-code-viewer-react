import { DesignToken, TokenType, ColorToken, TypographyToken, SpacingToken } from '@/types/design-tokens';
import { ExportConfiguration, ExportFormat, ExportResult, ExportMetadata } from '@/types/export-options';
import { EXPORT_FORMAT_CONFIGS } from '@/constants/export-formats';

export class DesignSystemExporter {
  async exportTokens(tokens: DesignToken[], configuration: ExportConfiguration): Promise<ExportResult[]> {
    const results: ExportResult[] = [];

    try {
      // Filter tokens based on configuration
      const filteredTokens = this.applyFilters(tokens, configuration);
      
      // Apply transformations
      const transformedTokens = this.applyTransformations(filteredTokens, configuration);

      // Generate exports for each format
      for (const format of configuration.formats) {
        const exportResult = await this.generateExport(transformedTokens, format, configuration);
        results.push(exportResult);
      }

      return results;
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private applyFilters(tokens: DesignToken[], configuration: ExportConfiguration): DesignToken[] {
    let filteredTokens = [...tokens];

    for (const filter of configuration.filters) {
      filteredTokens = filteredTokens.filter(token => {
        const fieldValue = token[filter.field as keyof DesignToken];
        
        switch (filter.operator) {
          case 'equals':
            return fieldValue === filter.value;
          case 'contains':
            return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'startsWith':
            return String(fieldValue).toLowerCase().startsWith(String(filter.value).toLowerCase());
          case 'endsWith':
            return String(fieldValue).toLowerCase().endsWith(String(filter.value).toLowerCase());
          case 'in':
            return Array.isArray(filter.value) && filter.value.includes(String(fieldValue));
          case 'notIn':
            return Array.isArray(filter.value) && !filter.value.includes(String(fieldValue));
          default:
            return true;
        }
      });
    }

    return filteredTokens;
  }

  private applyTransformations(tokens: DesignToken[], configuration: ExportConfiguration): DesignToken[] {
    let transformedTokens = [...tokens];

    for (const transformation of configuration.transformations) {
      transformedTokens = transformedTokens.map(token => {
        if (transformation.target !== 'all' && token.type !== transformation.target) {
          return token;
        }

        switch (transformation.type) {
          case 'rename':
            return { ...token, name: this.applyNameTransformation(token.name, transformation.parameters) };
          case 'prefix':
            return { ...token, name: `${transformation.parameters.prefix}${token.name}` };
          case 'suffix':
            return { ...token, name: `${token.name}${transformation.parameters.suffix}` };
          case 'replace':
            return { 
              ...token, 
              name: token.name.replace(
                new RegExp(transformation.parameters.from, 'g'), 
                transformation.parameters.to
              ) 
            };
          default:
            return token;
        }
      });
    }

    return transformedTokens;
  }

  private async generateExport(tokens: DesignToken[], format: ExportFormat, configuration: ExportConfiguration): Promise<ExportResult> {
    const formatConfig = EXPORT_FORMAT_CONFIGS[format];
    const startTime = Date.now();

    try {
      let content: string;
      let warnings: string[] = [];
      let errors: string[] = [];

      switch (format) {
        case ExportFormat.CSS:
          content = this.generateCSSExport(tokens, configuration);
          break;
        case ExportFormat.SCSS:
          content = this.generateSCSSExport(tokens, configuration);
          break;
        case ExportFormat.JS:
          content = this.generateJSExport(tokens, configuration);
          break;
        case ExportFormat.TS:
          content = this.generateTSExport(tokens, configuration);
          break;
        case ExportFormat.JSON:
          content = this.generateJSONExport(tokens, configuration);
          break;
        case ExportFormat.TAILWIND:
          content = this.generateTailwindExport(tokens, configuration);
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      // Apply post-processing
      if (configuration.minification) {
        content = this.minifyContent(content, format);
      }

      const filename = this.generateFilename(configuration.name, format);
      const size = new Blob([content]).size;

      return {
        format,
        content,
        filename,
        size,
        tokenCount: tokens.length,
        generatedAt: new Date(),
        warnings,
        errors,
        metadata: {
          version: '1.0.0',
          generator: 'design-system-exporter',
          exportedTokens: tokens.length,
          skippedTokens: 0,
          transformationsApplied: configuration.transformations.map(t => t.type),
          validationResults: []
        }
      };
    } catch (error) {
      throw new Error(`Failed to generate ${format} export: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateCSSExport(tokens: DesignToken[], configuration: ExportConfiguration): string {
    const tokenDeclarations = tokens.map(token => {
      const cssName = this.tokenNameToCSSVariable(token.name, configuration);
      const cssValue = this.tokenValueToCSSValue(token);
      return `  ${cssName}: ${cssValue};`;
    }).join('\n');

    return `:root {\n${tokenDeclarations}\n}`;
  }

  private generateSCSSExport(tokens: DesignToken[], configuration: ExportConfiguration): string {
    const variableDeclarations = tokens.map(token => {
      const scssName = this.tokenNameToSCSSVariable(token.name, configuration);
      const scssValue = this.tokenValueToSCSSValue(token);
      return `$${scssName}: ${scssValue};`;
    }).join('\n');

    const tokenMap = this.generateSCSSTokenMap(tokens, configuration);

    return `// Variables\n${variableDeclarations}\n\n// Token Map\n${tokenMap}`;
  }

  private generateJSExport(tokens: DesignToken[], configuration: ExportConfiguration): string {
    const tokenObject = this.generateTokenObject(tokens, configuration);
    return `export const tokens = ${JSON.stringify(tokenObject, null, 2)};`;
  }

  private generateTSExport(tokens: DesignToken[], configuration: ExportConfiguration): string {
    const tokenObject = this.generateTokenObject(tokens, configuration);
    const tokenTypes = this.generateTypeDefinitions(tokens);
    
    return `${tokenTypes}\n\nexport const tokens: Tokens = ${JSON.stringify(tokenObject, null, 2)};`;
  }

  private generateJSONExport(tokens: DesignToken[], configuration: ExportConfiguration): string {
    const tokenObject = this.generateTokenObject(tokens, configuration);
    return JSON.stringify(tokenObject, null, 2);
  }

  private generateTailwindExport(tokens: DesignToken[], configuration: ExportConfiguration): string {
    const themeExtensions = this.generateTailwindTheme(tokens, configuration);
    
    return `module.exports = {\n  theme: {\n    extend: {\n${themeExtensions}\n    }\n  }\n};`;
  }

  private tokenNameToCSSVariable(name: string, configuration: ExportConfiguration): string {
    const prefix = configuration.options.prefix || '';
    const cssName = name.replace(/([A-Z])/g, '-$1').toLowerCase();
    return `--${prefix}${cssName}`;
  }

  private tokenNameToSCSSVariable(name: string, configuration: ExportConfiguration): string {
    const prefix = configuration.options.prefix || '';
    return `${prefix}${name.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
  }

  private tokenValueToCSSValue(token: DesignToken): string {
    switch (token.type) {
      case TokenType.COLOR:
        const colorToken = token as ColorToken;
        return colorToken.value.hex;
      case TokenType.TYPOGRAPHY:
        const typographyToken = token as TypographyToken;
        return `${typographyToken.value.fontSize} ${typographyToken.value.fontFamily}`;
      case TokenType.SPACING:
        const spacingToken = token as SpacingToken;
        return `${spacingToken.value.rem}rem`;
      default:
        return String(token.value);
    }
  }

  private tokenValueToSCSSValue(token: DesignToken): string {
    return this.tokenValueToCSSValue(token);
  }

  private generateTokenObject(tokens: DesignToken[], configuration: ExportConfiguration): Record<string, any> {
    const tokenObject: Record<string, any> = {};

    for (const token of tokens) {
      const path = this.getTokenPath(token, configuration);
      this.setNestedValue(tokenObject, path, this.getTokenExportValue(token));
    }

    return tokenObject;
  }

  private generateTypeDefinitions(tokens: DesignToken[]): string {
    const tokenTypes = tokens.map(token => {
      const jsName = this.tokenNameToJSProperty(token.name);
      const typeValue = this.getTokenTypeValue(token);
      return `  ${jsName}: ${typeValue};`;
    }).join('\n');

    return `export interface Tokens {\n${tokenTypes}\n}`;
  }

  private generateSCSSTokenMap(tokens: DesignToken[], configuration: ExportConfiguration): string {
    const mapEntries = tokens.map(token => {
      const key = token.name;
      const variable = this.tokenNameToSCSSVariable(token.name, configuration);
      return `  '${key}': $${variable}`;
    }).join(',\n');

    return `$tokens: (\n${mapEntries}\n);`;
  }

  private generateTailwindTheme(tokens: DesignToken[], configuration: ExportConfiguration): string {
    const categories: Record<string, string[]> = {};

    for (const token of tokens) {
      const category = this.getTailwindCategory(token);
      if (!categories[category]) categories[category] = [];
      
      const key = this.tokenNameToTailwindKey(token.name);
      const value = this.tokenValueToTailwindValue(token);
      categories[category].push(`        '${key}': '${value}'`);
    }

    return Object.entries(categories)
      .map(([category, entries]) => `      ${category}: {\n${entries.join(',\n')}\n      }`)
      .join(',\n');
  }

  private getTokenPath(token: DesignToken, configuration: ExportConfiguration): string[] {
    switch (configuration.outputStructure) {
      case 'nested':
        return token.name.split('-');
      case 'categorized':
        return [token.category, ...token.name.split('-')];
      case 'modular':
        return [token.type, token.category, ...token.name.split('-')];
      default:
        return [token.name];
    }
  }

  private getTokenExportValue(token: DesignToken): any {
    switch (token.type) {
      case TokenType.COLOR:
        const colorToken = token as ColorToken;
        return colorToken.value.hex;
      case TokenType.TYPOGRAPHY:
        const typographyToken = token as TypographyToken;
        return typographyToken.value;
      case TokenType.SPACING:
        const spacingToken = token as SpacingToken;
        return `${spacingToken.value.rem}rem`;
      default:
        return token.value;
    }
  }

  private tokenNameToJSProperty(name: string): string {
    return name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  private getTokenTypeValue(token: DesignToken): string {
    switch (token.type) {
      case TokenType.COLOR:
        return 'string';
      case TokenType.TYPOGRAPHY:
        return 'TypographyValue';
      case TokenType.SPACING:
        return 'string';
      default:
        return 'string | number';
    }
  }

  private getTailwindCategory(token: DesignToken): string {
    switch (token.type) {
      case TokenType.COLOR:
        return 'colors';
      case TokenType.SPACING:
        return 'spacing';
      case TokenType.FONT_SIZE:
        return 'fontSize';
      case TokenType.FONT_FAMILY:
        return 'fontFamily';
      case TokenType.BORDER_RADIUS:
        return 'borderRadius';
      case TokenType.SHADOW:
        return 'boxShadow';
      default:
        return 'extend';
    }
  }

  private tokenNameToTailwindKey(name: string): string {
    return name.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  private tokenValueToTailwindValue(token: DesignToken): string {
    return this.tokenValueToCSSValue(token);
  }

  private setNestedValue(obj: Record<string, any>, path: string[], value: any): void {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      if (!(path[i] in current)) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
  }

  private applyNameTransformation(name: string, parameters: Record<string, any>): string {
    // Apply naming transformation based on parameters
    return name;
  }

  private minifyContent(content: string, format: ExportFormat): string {
    switch (format) {
      case ExportFormat.CSS:
      case ExportFormat.SCSS:
        return content.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').trim();
      case ExportFormat.JSON:
        return JSON.stringify(JSON.parse(content));
      default:
        return content;
    }
  }

  private generateFilename(baseName: string, format: ExportFormat): string {
    const extension = EXPORT_FORMAT_CONFIGS[format].extension;
    return `${baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}${extension}`;
  }
}

export const designSystemExporter = new DesignSystemExporter();
