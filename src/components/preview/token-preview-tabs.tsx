import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DesignToken, TokenType } from '@/types/design-tokens';
import { ColorPalettePreview } from './color-palette-preview';
import { TypographyPreview } from './typography-preview';
import { SpacingPreview } from './spacing-preview';
import { 
  Palette, 
  Type, 
  Ruler, 
  Circle, 
  Square, 
  Triangle 
} from 'lucide-react';

interface TokenPreviewTabsProps {
  tokens: DesignToken[];
}

export function TokenPreviewTabs({ tokens }: TokenPreviewTabsProps) {
  const [activeTab, setActiveTab] = useState('all');

  const tokensByType = useMemo(() => {
    const grouped = tokens.reduce((acc, token) => {
      if (!acc[token.type]) acc[token.type] = [];
      acc[token.type].push(token);
      return acc;
    }, {} as Record<TokenType, DesignToken[]>);

    return grouped;
  }, [tokens]);

  const tabsConfig = [
    {
      id: 'all',
      label: 'All Tokens',
      icon: <Square className="w-4 h-4" />,
      count: tokens.length
    },
    {
      id: TokenType.COLOR,
      label: 'Colors',
      icon: <Palette className="w-4 h-4" />,
      count: tokensByType[TokenType.COLOR]?.length || 0
    },
    {
      id: TokenType.TYPOGRAPHY,
      label: 'Typography',
      icon: <Type className="w-4 h-4" />,
      count: tokensByType[TokenType.TYPOGRAPHY]?.length || 0
    },
    {
      id: TokenType.SPACING,
      label: 'Spacing',
      icon: <Ruler className="w-4 h-4" />,
      count: tokensByType[TokenType.SPACING]?.length || 0
    }
  ];

  const renderTokenGrid = (tokens: DesignToken[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tokens.map((token) => (
        <Card key={token.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium truncate">
                {token.name}
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {token.type}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              {token.category} • v{token.version}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Token preview based on type */}
              {token.type === TokenType.COLOR && (
                <div 
                  className="w-full h-12 rounded border"
                  style={{ backgroundColor: String(token.value) }}
                />
              )}
              
              {token.type === TokenType.TYPOGRAPHY && (
                <div 
                  className="text-sm"
                  style={typeof token.value === 'object' ? token.value as any : {}}
                >
                  Sample Text
                </div>
              )}
              
              {/* Token value display */}
              <div className="bg-muted p-2 rounded text-xs font-mono">
                {typeof token.value === 'object' 
                  ? JSON.stringify(token.value, null, 2)
                  : String(token.value)
                }
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (tokens.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Circle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Tokens Found</h3>
            <p className="text-muted-foreground">
              Extract design tokens from a Figma file to see them here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        {tabsConfig.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            disabled={tab.count === 0}
            className="flex items-center gap-2"
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <Badge variant="secondary" className="ml-auto">
              {tab.count}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">All Design Tokens</h3>
          <Badge variant="outline">{tokens.length} tokens</Badge>
        </div>
        <ScrollArea className="h-[600px]">
          {renderTokenGrid(tokens)}
        </ScrollArea>
      </TabsContent>

      <TabsContent value={TokenType.COLOR} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Color Tokens</h3>
          <Badge variant="outline">{tokensByType[TokenType.COLOR]?.length || 0} colors</Badge>
        </div>
        <ColorPalettePreview tokens={tokensByType[TokenType.COLOR] || []} />
      </TabsContent>

      <TabsContent value={TokenType.TYPOGRAPHY} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Typography Tokens</h3>
          <Badge variant="outline">{tokensByType[TokenType.TYPOGRAPHY]?.length || 0} styles</Badge>
        </div>
        <TypographyPreview tokens={tokensByType[TokenType.TYPOGRAPHY] || []} />
      </TabsContent>

      <TabsContent value={TokenType.SPACING} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Spacing Tokens</h3>
          <Badge variant="outline">{tokensByType[TokenType.SPACING]?.length || 0} values</Badge>
        </div>
        <SpacingPreview tokens={tokensByType[TokenType.SPACING] || []} />
      </TabsContent>
    </Tabs>
  );
}
