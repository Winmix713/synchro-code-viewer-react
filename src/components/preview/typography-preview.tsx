
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DesignToken, TypographyToken } from '@/types/design-tokens';
import { Type } from 'lucide-react';

interface TypographyPreviewProps {
  tokens: DesignToken[];
}

export function TypographyPreview({ tokens }: TypographyPreviewProps) {
  const typographyTokens = tokens.filter(token => token.type === 'typography') as TypographyToken[];

  if (typographyTokens.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Type className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Typography Tokens</h3>
            <p className="text-muted-foreground">
              No typography tokens were found in the extracted design system
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {typographyTokens.map((token) => (
        <Card key={token.id} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold">{token.name}</h3>
                <Badge variant="outline" className="mt-1">{token.category}</Badge>
              </div>
            </div>
            
            <div 
              className="text-lg leading-relaxed"
              style={{
                fontFamily: token.value.fontFamily,
                fontSize: token.value.fontSize,
                fontWeight: token.value.fontWeight,
                lineHeight: token.value.lineHeight,
                letterSpacing: token.value.letterSpacing
              }}
            >
              The quick brown fox jumps over the lazy dog
            </div>
            
            <div className="mt-4 p-3 bg-muted rounded text-sm font-mono">
              {JSON.stringify(token.value, null, 2)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
