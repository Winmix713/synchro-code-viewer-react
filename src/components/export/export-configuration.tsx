
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DesignToken } from '@/types/design-tokens';
import { ExportFormat, ExportConfiguration as ExportConfig } from '@/types/export-options';
import { EXPORT_FORMAT_CONFIGS, FORMAT_CATEGORIES } from '@/constants/export-formats';
import { designSystemExporter } from '@/services/design-system-exporter';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, Code, Loader2 } from 'lucide-react';

interface ExportConfigurationProps {
  tokens: DesignToken[];
  onExportComplete: (formats: string[]) => void;
}

export function ExportConfiguration({ tokens, onExportComplete }: ExportConfigurationProps) {
  const { toast } = useToast();
  const [selectedFormats, setSelectedFormats] = useState<ExportFormat[]>([ExportFormat.CSS]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportResults, setExportResults] = useState<any[]>([]);

  const handleFormatToggle = useCallback((format: ExportFormat) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  }, []);

  const handleExport = useCallback(async () => {
    if (selectedFormats.length === 0) {
      toast({
        title: 'No formats selected',
        description: 'Please select at least one export format',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const configuration: ExportConfig = {
        id: 'export-config',
        name: 'design-tokens',
        formats: selectedFormats,
        options: {
          includeMetadata: true,
          includeComments: true,
          usePrefixes: false,
          useNamespaces: false,
          sortTokens: true,
          sortBy: 'name',
          groupBy: 'type',
          includeDeprecated: false,
          resolveAliases: true,
          optimizeValues: true
        },
        filters: [],
        transformations: [],
        outputStructure: 'nested' as any,
        minification: false,
        compression: false,
        validation: true
      };

      const results = await designSystemExporter.exportTokens(tokens, configuration);
      setExportResults(results);
      onExportComplete(selectedFormats);
      
      // Trigger downloads
      results.forEach(result => {
        const blob = new Blob([result.content], { 
          type: EXPORT_FORMAT_CONFIGS[result.format].mimeType 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

    } catch (error) {
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  }, [selectedFormats, tokens, onExportComplete, toast]);

  if (tokens.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Download className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Tokens to Export</h3>
            <p className="text-muted-foreground">
              Extract design tokens first to enable export functionality
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Formats Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Export Formats
          </CardTitle>
          <CardDescription>
            Select the formats you want to export your design tokens to
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-6">
              {Object.entries(FORMAT_CATEGORIES).map(([category, formats]) => (
                <div key={category} className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formats.map((format) => {
                      const config = EXPORT_FORMAT_CONFIGS[format];
                      const isSelected = selectedFormats.includes(format);
                      
                      return (
                        <div
                          key={format}
                          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                            isSelected ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => handleFormatToggle(format)}
                        >
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleFormatToggle(format)}
                              className="mt-1"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Label className="font-medium cursor-pointer">
                                  {config.name}
                                </Label>
                                <Badge variant="outline" className="text-xs">
                                  {config.extension}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {config.description}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {config.features.map((feature) => (
                                  <Badge key={feature} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Export Summary */}
      {selectedFormats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Export Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tokens to export:</span>
                <Badge variant="secondary">{tokens.length}</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Selected formats:</span>
                <Badge variant="secondary">{selectedFormats.length}</Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <span className="text-sm font-medium">Export files:</span>
                {selectedFormats.map((format) => {
                  const config = EXPORT_FORMAT_CONFIGS[format];
                  return (
                    <div key={format} className="flex items-center justify-between text-sm">
                      <span className="font-mono">design-tokens{config.extension}</span>
                      <Badge variant="outline">{config.syntax}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Action */}
      <div className="flex justify-center">
        <Button
          onClick={handleExport}
          disabled={selectedFormats.length === 0 || isExporting}
          size="lg"
          className="gap-2"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export {selectedFormats.length} Format{selectedFormats.length > 1 ? 's' : ''}
            </>
          )}
        </Button>
      </div>

      {/* Export Results */}
      {exportResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Export Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exportResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <span className="font-medium">{result.filename}</span>
                    <div className="text-sm text-muted-foreground">
                      {result.tokenCount} tokens • {(result.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <Badge variant="secondary">{result.format.toUpperCase()}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
