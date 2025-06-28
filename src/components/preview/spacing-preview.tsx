
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DesignToken, SpacingToken } from '@/types/design-tokens';
import { Ruler } from 'lucide-react';

interface SpacingPreviewProps {
  tokens: DesignToken[];
}

export function SpacingPreview({ tokens }: SpacingPreviewProps) {
  const spacingTokens = tokens.filter(token => token.type === 'spacing') as SpacingToken[];

  if (spacingTokens.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Ruler className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Spacing Tokens</h3>
            <p className="text-muted-foreground">
              No spacing tokens were found in the extracted design system
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {spacingTokens.map((token) => (
        <Card key={token.id} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{token.name}</h3>
                <Badge variant="outline" className="mt-1">{token.category}</Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {token.value.px}px / {token.value.rem}rem
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div 
                className="bg-primary rounded"
                style={{ 
                  width: `${Math.min(token.value.px, 200)}px`, 
                  height: '24px' 
                }}
              />
              <span className="text-sm text-muted-foreground">
                {token.value.px}px
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
