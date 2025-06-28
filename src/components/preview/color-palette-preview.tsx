
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DesignToken, ColorToken } from '@/types/design-tokens';
import { Copy, Palette, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ColorPalettePreviewProps {
  tokens: DesignToken[];
}

export function ColorPalettePreview({ tokens }: ColorPalettePreviewProps) {
  const { toast } = useToast();
  const [colorBlindnessMode, setColorBlindnessMode] = useState<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'>('none');

  const colorTokens = useMemo(() => {
    return tokens.filter(token => token.type === 'color') as ColorToken[];
  }, [tokens]);

  const paletteGroups = useMemo(() => {
    const groups: Record<string, ColorToken[]> = {};
    
    colorTokens.forEach(token => {
      const baseName = token.name.split('-')[0];
      if (!groups[baseName]) groups[baseName] = [];
      groups[baseName].push(token);
    });

    // Sort tokens within each group by name
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  }, [colorTokens]);

  const copyToClipboard = async (value: string, format: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: 'Copied to clipboard',
        description: `${format} value copied successfully`,
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const getContrastRatio = (color: ColorToken) => {
    // Simplified contrast calculation
    return color.metadata.accessibility.contrastRatio || 0;
  };

  const getWCAGLevel = (contrastRatio: number) => {
    if (contrastRatio >= 7) return 'AAA';
    if (contrastRatio >= 4.5) return 'AA';
    return 'Fail';
  };

  const ColorSwatch = ({ token }: { token: ColorToken }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="hover:shadow-md transition-all cursor-pointer group">
            <CardContent className="p-0">
              <div 
                className="w-full h-24 rounded-t"
                style={{ backgroundColor: token.value.hex }}
              />
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm truncate">{token.name}</h4>
                  <Badge 
                    variant={getWCAGLevel(getContrastRatio(token)) === 'AAA' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {getWCAGLevel(getContrastRatio(token))}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">HEX</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(token.value.hex, 'HEX')}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded block">
                    {token.value.hex}
                  </code>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">RGB</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(
                        `rgb(${token.value.rgb.r}, ${token.value.rgb.g}, ${token.value.rgb.b})`,
                        'RGB'
                      )}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded block">
                    {token.value.rgb.r}, {token.value.rgb.g}, {token.value.rgb.b}
                  </code>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">HSL</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(
                        `hsl(${token.value.hsl.h}, ${token.value.hsl.s}%, ${token.value.hsl.l}%)`,
                        'HSL'
                      )}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded block">
                    {token.value.hsl.h}°, {token.value.hsl.s}%, {token.value.hsl.l}%
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{token.name}</p>
            <p className="text-xs text-muted-foreground">
              Contrast: {getContrastRatio(token).toFixed(2)}:1
            </p>
            {token.description && (
              <p className="text-xs">{token.description}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  if (colorTokens.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Color Tokens</h3>
            <p className="text-muted-foreground">
              No color tokens were found in the extracted design system
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="gap-1">
            <Palette className="w-3 h-3" />
            {colorTokens.length} colors
          </Badge>
          <Badge variant="outline" className="gap-1">
            {Object.keys(paletteGroups).length} groups
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={colorBlindnessMode === 'none' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setColorBlindnessMode('none')}
          >
            <Eye className="w-4 h-4 mr-1" />
            Normal
          </Button>
          <Button
            variant={colorBlindnessMode !== 'none' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setColorBlindnessMode(colorBlindnessMode === 'none' ? 'protanopia' : 'none')}
          >
            <EyeOff className="w-4 h-4 mr-1" />
            Color Blind
          </Button>
        </div>
      </div>

      {/* Color Palette Groups */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-8">
          {Object.entries(paletteGroups).map(([groupName, groupTokens]) => (
            <div key={groupName} className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold capitalize">{groupName}</h3>
                <Badge variant="secondary">{groupTokens.length}</Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {groupTokens.map((token) => (
                  <ColorSwatch key={token.id} token={token} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
