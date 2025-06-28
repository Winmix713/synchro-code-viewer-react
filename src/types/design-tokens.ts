
export interface DesignToken {
  id: string;
  name: string;
  type: TokenType;
  value: string | number | object;
  category: TokenCategory;
  description?: string;
  alias?: string;
  metadata: TokenMetadata;
  figmaNodeId?: string;
  lastModified: Date;
  version: number;
}

export enum TokenType {
  COLOR = 'color',
  TYPOGRAPHY = 'typography',
  SPACING = 'spacing',
  BORDER_RADIUS = 'borderRadius',
  SHADOW = 'shadow',
  OPACITY = 'opacity',
  BORDER_WIDTH = 'borderWidth',
  FONT_FAMILY = 'fontFamily',
  FONT_SIZE = 'fontSize',
  FONT_WEIGHT = 'fontWeight',
  LINE_HEIGHT = 'lineHeight',
  LETTER_SPACING = 'letterSpacing'
}

export enum TokenCategory {
  PRIMITIVE = 'primitive',
  SEMANTIC = 'semantic',
  COMPONENT = 'component',
  SYSTEM = 'system'
}

export interface TokenMetadata {
  createdBy: string;
  createdAt: Date;
  modifiedBy: string;
  modifiedAt: Date;
  tags: string[];
  usage: TokenUsage[];
  accessibility: AccessibilityInfo;
}

export interface TokenUsage {
  component: string;
  property: string;
  frequency: number;
}

export interface AccessibilityInfo {
  contrastRatio?: number;
  wcagLevel?: 'AA' | 'AAA';
  colorBlindnessCompliant?: boolean;
  readabilityScore?: number;
}

export interface ColorToken extends DesignToken {
  type: TokenType.COLOR;
  value: {
    hex: string;
    rgb: { r: number; g: number; b: number; a?: number };
    hsl: { h: number; s: number; l: number; a?: number };
    oklch?: { l: number; c: number; h: number; a?: number };
  };
}

export interface TypographyToken extends DesignToken {
  type: TokenType.TYPOGRAPHY;
  value: {
    fontFamily: string;
    fontSize: string;
    fontWeight: number | string;
    lineHeight: string | number;
    letterSpacing?: string;
    textTransform?: string;
  };
}

export interface SpacingToken extends DesignToken {
  type: TokenType.SPACING;
  value: {
    px: number;
    rem: number;
    em: number;
  };
}
