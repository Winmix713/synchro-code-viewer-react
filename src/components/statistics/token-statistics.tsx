
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DesignToken, TokenType, TokenCategory } from '@/types/design-tokens';
import { BarChart3, TrendingUp, Palette, Type } from 'lucide-react';

interface TokenStatisticsProps {
  tokens: DesignToken[];
  stats: {
    total: number;
    byType: Record<TokenType, number>;
    byCategory: Record<TokenCategory, number>;
  };
}

export function TokenStatistics({ tokens, stats }: TokenStatisticsProps) {
  const typeEntries = Object.entries(stats.byType).sort(([,a], [,b]) => b - a);
  const categoryEntries = Object.entries(stats.byCategory).sort(([,a], [,b]) => b - a);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'color': return <Palette className="w-4 h-4" />;
      case 'typography': return <Type className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  if (stats.total === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Statistics Available</h3>
            <p className="text-muted-foreground">
              Extract design tokens to view detailed statistics and analytics
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Tokens</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{Object.keys(stats.byType).length}</p>
                <p className="text-sm text-muted-foreground">Token Types</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{Object.keys(stats.byCategory).length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
              <Palette className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {Math.round((stats.byType[TokenType.COLOR] || 0) / stats.total * 100)}%
                </p>
                <p className="text-sm text-muted-foreground">Color Tokens</p>
              </div>
              <Type className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Token Distribution by Type</CardTitle>
          <CardDescription>
            Breakdown of your design tokens by type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {typeEntries.map(([type, count]) => {
              const percentage = (count / stats.total) * 100;
              return (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(type)}
                      <span className="font-medium capitalize">
                        {type.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{count}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Token Distribution by Category</CardTitle>
          <CardDescription>
            How your tokens are categorized by usage and purpose
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryEntries.map(([category, count]) => {
              const percentage = (count / stats.total) * 100;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">{category}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{count}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
