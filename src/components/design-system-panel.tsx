import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useDesignTokens } from '@/hooks/use-design-tokens';
import { TokenExtractor } from './extraction/token-extractor';
import { TokenPreviewTabs } from './preview/token-preview-tabs';
import { ExportConfiguration } from './export/export-configuration';
import { TokenSearch } from './search-filter/token-search';
import { TokenStatistics } from './statistics/token-statistics';
import { LoadingStates } from '@/components/ui/loading-states';
import { ToastNotifications } from '@/components/ui/toast-notifications';
import { 
  Palette, 
  Type, 
  Ruler, 
  Download, 
  Upload, 
  Search, 
  Filter,
  BarChart3,
  Settings,
  Zap
} from 'lucide-react';

interface DesignSystemPanelProps {
  className?: string;
  onTokensExtracted?: (tokenCount: number) => void;
  onExportComplete?: (formats: string[]) => void;
}

export function DesignSystemPanel({ 
  className = '',
  onTokensExtracted,
  onExportComplete 
}: DesignSystemPanelProps) {
  const { toast } = useToast();
  const {
    tokens,
    filteredTokens,
    loading,
    error,
    searchQuery,
    tokenStats,
    extractFromFigma,
    setSearchQuery,
    clearFilters
  } = useDesignTokens();

  const [activeTab, setActiveTab] = useState('extract');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);

  const handleExtractionStart = useCallback(async () => {
    setIsExtracting(true);
    setExtractionProgress(0);

    try {
      // Simulate extraction process with progress updates
      const mockFigmaFile = {
        name: 'Design System',
        role: 'owner',
        lastModified: new Date().toISOString(),
        editorType: 'figma',
        thumbnailUrl: '',
        version: '1.0',
        document: {
          id: 'root',
          name: 'Document',
          type: 'DOCUMENT',
          children: []
        },
        components: {},
        componentSets: {},
        styles: {}
      };

      // Simulate progress updates
      for (let i = 0; i <= 100; i += 10) {
        setExtractionProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await extractFromFigma(mockFigmaFile);
      
      onTokensExtracted?.(tokenStats.total);
      
      toast({
        title: 'Extraction Complete',
        description: `Successfully extracted ${tokenStats.total} design tokens`,
      });

      setActiveTab('preview');
    } catch (error) {
      toast({
        title: 'Extraction Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsExtracting(false);
      setExtractionProgress(0);
    }
  }, [extractFromFigma, tokenStats.total, onTokensExtracted, toast]);

  const handleExportComplete = useCallback((formats: string[]) => {
    onExportComplete?.(formats);
    toast({
      title: 'Export Complete',
      description: `Successfully exported to ${formats.length} format${formats.length > 1 ? 's' : ''}`,
    });
  }, [onExportComplete, toast]);

  const tabsConfig = useMemo(() => [
    {
      id: 'extract',
      label: 'Extract',
      icon: <Upload className="w-4 h-4" />,
      description: 'Extract design tokens from Figma files'
    },
    {
      id: 'preview',
      label: 'Preview',
      icon: <Palette className="w-4 h-4" />,
      description: 'Preview and organize extracted tokens',
      disabled: tokens.length === 0
    },
    {
      id: 'export',
      label: 'Export',
      icon: <Download className="w-4 h-4" />,
      description: 'Export tokens in various formats',
      disabled: tokens.length === 0
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      description: 'View design system statistics',
      disabled: tokens.length === 0
    }
  ], [tokens.length]);

  return (
    <div className={`design-system-panel w-full max-w-7xl mx-auto p-6 space-y-6 ${className}`}>
      <ToastNotifications />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="w-8 h-8 text-primary" />
            Design System Panel
          </h1>
          <p className="text-muted-foreground">
            Extract, preview, and export design tokens from Figma files with enterprise-grade precision
          </p>
        </div>
        
        {tokens.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="font-mono">
                {tokens.length} tokens
              </Badge>
              <Badge variant="outline" className="font-mono">
                {Object.keys(tokenStats.byType).length} types
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Search Bar */}
      {tokens.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tokens by name, type, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <TokenSearch />
        </div>
      )}

      {/* Main Content */}
      <Card className="border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Design Token Management</CardTitle>
              <CardDescription>
                Professional-grade design system extraction and export tools
              </CardDescription>
            </div>
            {loading && <LoadingStates type="spinner" size="sm" />}
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
              {tabsConfig.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  disabled={tab.disabled}
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="extract" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Token Extraction</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload or connect to Figma files to extract design tokens automatically
                    </p>
                  </div>
                  
                  <TokenExtractor
                    onExtractionStart={handleExtractionStart}
                    isExtracting={isExtracting}
                    progress={extractionProgress}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Extraction Settings</h3>
                    <p className="text-sm text-muted-foreground">
                      Configure extraction parameters and token categorization
                    </p>
                  </div>
                  
                  <Card className="border border-muted">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Auto-categorization</span>
                          <Badge variant="secondary">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Semantic analysis</span>
                          <Badge variant="secondary">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Accessibility validation</span>
                          <Badge variant="secondary">Enabled</Badge>
                        </div>
                        <Separator />
                        <Button variant="outline" size="sm" className="w-full gap-2">
                          <Settings className="w-4 h-4" />
                          Advanced Settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <TokenPreviewTabs tokens={filteredTokens} />
            </TabsContent>

            <TabsContent value="export" className="space-y-6">
              <ExportConfiguration
                tokens={filteredTokens}
                onExportComplete={handleExportComplete}
              />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <TokenStatistics tokens={tokens} stats={tokenStats} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default DesignSystemPanel;