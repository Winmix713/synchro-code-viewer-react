
import { DesignToken, TokenType, TokenCategory, ColorToken, TypographyToken, SpacingToken } from '@/types/design-tokens';
import { FigmaFile, FigmaNode, FigmaPaint, FigmaColor, FigmaTypeStyle } from '@/types/figma-api';

export class DesignSystemExtractor {
  private tokenId = 0;

  async extractFromFigmaFile(figmaFile: FigmaFile): Promise<DesignToken[]> {
    const tokens: DesignToken[] = [];
    
    try {
      // Extract style-based tokens first
      const styleTokens = await this.extractStyleTokens(figmaFile);
      tokens.push(...styleTokens);

      // Extract component-based tokens
      const componentTokens = await this.extractComponentTokens(figmaFile);
      tokens.push(...componentTokens);

      // Extract semantic tokens from document structure
      const semanticTokens = await this.extractSemanticTokens(figmaFile.document);
      tokens.push(...semanticTokens);

      // Post-process tokens: deduplicate, categorize, and enhance
      return this.postProcessTokens(tokens);
    } catch (error) {
      console.error('Error extracting design tokens:', error);
      throw new Error(`Failed to extract design tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async extractStyleTokens(figmaFile: FigmaFile): Promise<DesignToken[]> {
    const tokens: DesignToken[] = [];

    for (const [styleId, style] of Object.entries(figmaFile.styles)) {
      switch (style.styleType) {
        case 'FILL':
          const colorToken = await this.createColorTokenFromStyle(styleId, style, figmaFile);
          if (colorToken) tokens.push(colorToken);
          break;
        case 'TEXT':
          const typographyToken = await this.createTypographyTokenFromStyle(styleId, style, figmaFile);
          if (typographyToken) tokens.push(typographyToken);
          break;
        case 'EFFECT':
          const effectToken = await this.createEffectTokenFromStyle(styleId, style, figmaFile);
          if (effectToken) tokens.push(effectToken);
          break;
      }
    }

    return tokens;
  }

  private async extractComponentTokens(figmaFile: FigmaFile): Promise<DesignToken[]> {
    const tokens: DesignToken[] = [];

    for (const [componentId, component] of Object.entries(figmaFile.components)) {
      // Extract tokens from component properties
      const componentTokens = await this.analyzeComponentForTokens(component, figmaFile);
      tokens.push(...componentTokens);
    }

    return tokens;
  }

  private async extractSemanticTokens(documentNode: FigmaNode): Promise<DesignToken[]> {
    const tokens: DesignToken[] = [];
    
    // Recursively traverse the document tree
    await this.traverseNodeForTokens(documentNode, tokens);
    
    return tokens;
  }

  private async traverseNodeForTokens(node: FigmaNode, tokens: DesignToken[]): Promise<void> {
    // Extract color tokens from fills
    if (node.fills) {
      for (const fill of node.fills) {
        const colorToken = this.createColorTokenFromPaint(fill, node);
        if (colorToken) tokens.push(colorToken);
      }
    }

    // Extract typography tokens from text styles
    if (node.style) {
      const typographyToken = await this.createTypographyTokenFromStyle(node.id, { 
        name: node.name, 
        styleType: 'TEXT',
        key: node.id,
        description: '',
        remote: false
      }, null, node.style);
      if (typographyToken) tokens.push(typographyToken);
    }

    // Extract spacing tokens from layout properties
    const spacingTokens = this.extractSpacingFromNode(node);
    tokens.push(...spacingTokens);

    // Recursively process children
    if (node.children) {
      for (const child of node.children) {
        await this.traverseNodeForTokens(child, tokens);
      }
    }
  }

  private createColorTokenFromPaint(paint: FigmaPaint, node: FigmaNode): ColorToken | null {
    if (paint.type !== 'SOLID' || !paint.color) return null;

    const color = paint.color;
    const name = this.generateTokenName(node.name, 'color');

    return {
      id: `color-${this.tokenId++}`,
      name,
      type: TokenType.COLOR,
      category: this.determineTokenCategory(name),
      value: {
        hex: this.rgbToHex(color),
        rgb: { r: Math.round(color.r * 255), g: Math.round(color.g * 255), b: Math.round(color.b * 255), a: color.a },
        hsl: this.rgbToHsl(color)
      },
      metadata: {
        createdBy: 'figma-extractor',
        createdAt: new Date(),
        modifiedBy: 'figma-extractor',
        modifiedAt: new Date(),
        tags: [node.type.toLowerCase()],
        usage: [],
        accessibility: this.calculateAccessibilityInfo(color)
      },
      figmaNodeId: node.id,
      lastModified: new Date(),
      version: 1
    };
  }

  private async createColorTokenFromStyle(styleId: string, style: any, figmaFile: FigmaFile | null): Promise<ColorToken | null> {
    // Implementation would fetch the actual style data from Figma API
    // For now, return a placeholder
    return null;
  }

  private async createTypographyTokenFromStyle(styleId: string, style: any, figmaFile: FigmaFile | null, typeStyle?: FigmaTypeStyle): Promise<TypographyToken | null> {
    if (!typeStyle) return null;

    const name = this.generateTokenName(style.name, 'typography');

    return {
      id: `typography-${this.tokenId++}`,
      name,
      type: TokenType.TYPOGRAPHY,
      category: this.determineTokenCategory(name),
      value: {
        fontFamily: typeStyle.fontFamily,
        fontSize: `${typeStyle.fontSize}px`,
        fontWeight: typeStyle.fontWeight,
        lineHeight: typeStyle.lineHeightPx ? `${typeStyle.lineHeightPx}px` : 'normal',
        letterSpacing: typeStyle.letterSpacing ? `${typeStyle.letterSpacing}px` : 'normal'
      },
      metadata: {
        createdBy: 'figma-extractor',
        createdAt: new Date(),
        modifiedBy: 'figma-extractor',
        modifiedAt: new Date(),
        tags: ['typography'],
        usage: [],
        accessibility: {
          readabilityScore: this.calculateReadabilityScore(typeStyle)
        }
      },
      figmaNodeId: styleId,
      lastModified: new Date(),
      version: 1
    };
  }

  private async createEffectTokenFromStyle(styleId: string, style: any, figmaFile: FigmaFile): Promise<DesignToken | null> {
    // Implementation for effect tokens (shadows, blurs, etc.)
    return null;
  }

  private async analyzeComponentForTokens(component: any, figmaFile: FigmaFile): Promise<DesignToken[]> {
    // Implementation for component-based token extraction
    return [];
  }

  private extractSpacingFromNode(node: FigmaNode): SpacingToken[] {
    const tokens: SpacingToken[] = [];
    
    // Extract padding, margin, gap values from layout properties
    // This would require additional Figma API data about layout properties
    
    return tokens;
  }

  private postProcessTokens(tokens: DesignToken[]): DesignToken[] {
    // Deduplicate tokens
    const uniqueTokens = this.deduplicateTokens(tokens);
    
    // Enhance tokens with additional metadata
    const enhancedTokens = this.enhanceTokensWithMetadata(uniqueTokens);
    
    // Sort tokens by category and name
    return enhancedTokens.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });
  }

  private deduplicateTokens(tokens: DesignToken[]): DesignToken[] {
    const seen = new Set<string>();
    return tokens.filter(token => {
      const key = `${token.type}-${JSON.stringify(token.value)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private enhanceTokensWithMetadata(tokens: DesignToken[]): DesignToken[] {
    return tokens.map(token => ({
      ...token,
      metadata: {
        ...token.metadata,
        tags: [...token.metadata.tags, ...this.inferAdditionalTags(token)]
      }
    }));
  }

  private inferAdditionalTags(token: DesignToken): string[] {
    const tags: string[] = [];
    
    if (token.name.includes('primary')) tags.push('brand');
    if (token.name.includes('secondary')) tags.push('secondary');
    if (token.name.includes('success')) tags.push('feedback', 'success');
    if (token.name.includes('error') || token.name.includes('danger')) tags.push('feedback', 'error');
    if (token.name.includes('warning')) tags.push('feedback', 'warning');
    if (token.name.includes('info')) tags.push('feedback', 'info');
    
    return tags;
  }

  private generateTokenName(figmaName: string, type: string): string {
    return figmaName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private determineTokenCategory(name: string): TokenCategory {
    if (name.includes('brand') || name.includes('primary')) return TokenCategory.SEMANTIC;
    if (name.includes('component')) return TokenCategory.COMPONENT;
    if (name.includes('system')) return TokenCategory.SYSTEM;
    return TokenCategory.PRIMITIVE;
  }

  private rgbToHex(color: FigmaColor): string {
    const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, '0');
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
  }

  private rgbToHsl(color: FigmaColor): { h: number; s: number; l: number; a?: number } {
    const r = color.r;
    const g = color.g;
    const b = color.b;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
      a: color.a
    };
  }

  private calculateAccessibilityInfo(color: FigmaColor): any {
    // Calculate contrast ratios and WCAG compliance
    const luminance = this.calculateLuminance(color);
    
    return {
      contrastRatio: this.calculateContrastRatio(luminance, 1), // Against white
      wcagLevel: luminance > 0.5 ? 'AA' : 'AAA',
      colorBlindnessCompliant: true // Simplified
    };
  }

  private calculateLuminance(color: FigmaColor): number {
    const { r, g, b } = color;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      return c;
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  private calculateContrastRatio(lum1: number, lum2: number): number {
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  private calculateReadabilityScore(typeStyle: FigmaTypeStyle): number {
    // Simple readability score based on font size and weight
    const sizeScore = Math.min(typeStyle.fontSize / 16, 2); // Normalize to 16px base
    const weightScore = typeStyle.fontWeight / 400; // Normalize to 400 weight
    return Math.min((sizeScore + weightScore) / 2 * 100, 100);
  }
}

export const designSystemExtractor = new DesignSystemExtractor();
