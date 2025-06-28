import React, { useState } from 'react';
import { Upload, Link, Settings, Download, Play, Pause, X, Eye, Code, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFigmaProcessing } from '@/hooks/use-figma-processing';
import { CodeGenerationConfig } from '@/types/code-generation';

const GeneratorInterface = () => {
  const [figmaUrl, setFigmaUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [config, setConfig] = useState<CodeGenerationConfig>({
    framework: 'react',
    typescript: true,
    styling: 'tailwind',
    componentLibrary: 'custom',
    optimization: {
      treeshaking: true,
      bundleAnalysis: true,
      codesplitting: true,
      lazyLoading: true,
    },
    accessibility: {
      wcagLevel: 'AA',
      screenReader: true,
      keyboardNavigation: true,
      colorContrast: true,
    },
    testing: {
      unitTests: true,
      integrationTests: false,
      e2eTests: false,
      visualRegression: false,
    },
  });

  const {
    isProcessing,
    currentPhase,
    figmaFile,
    generatedCode,
    error,
    progress,
    validateUrl,
    startProcessing,
    cancelProcessing,
    resetProcessing,
  } = useFigmaProcessing();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!figmaUrl.trim()) {
      return;
    }

    // Validate URL first
    const validation = await validateUrl(figmaUrl);
    if (!validation.valid) {
      console.error('Invalid URL:', validation.error);
      return;
    }

    // Start processing
    await startProcessing(figmaUrl, config, accessToken || undefined);
  };

  const handleReset = () => {
    setFigmaUrl('');
    setAccessToken('');
    resetProcessing();
  };

  const handleDownloadCode = () => {
    if (!generatedCode) return;

    // Create a zip-like structure by downloading individual files
    generatedCode.files.forEach((file) => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    // Also download a summary file
    const summary = `# Generated Code Summary

Project: ${figmaFile?.name || 'Figma Project'}
Generated: ${generatedCode.timestamp.toLocaleString()}
Framework: ${generatedCode.config.framework}
TypeScript: ${generatedCode.config.typescript ? 'Yes' : 'No'}
Styling: ${generatedCode.config.styling}

## Files Generated:
${generatedCode.files.map(file => `- ${file.name} (${file.size} bytes)`).join('\n')}

## Quality Metrics:
- Overall Score: ${Math.round(generatedCode.quality.overall)}/100
- Lines of Code: ${generatedCode.metrics.linesOfCode}
- Components: ${generatedCode.structure.components.length}
- Bundle Size: ${Math.round(generatedCode.metrics.bundleSize / 1024)}KB
`;

    const summaryBlob = new Blob([summary], { type: 'text/markdown' });
    const summaryUrl = URL.createObjectURL(summaryBlob);
    const summaryLink = document.createElement('a');
    summaryLink.href = summaryUrl;
    summaryLink.download = 'README.md';
    document.body.appendChild(summaryLink);
    summaryLink.click();
    document.body.removeChild(summaryLink);
    URL.revokeObjectURL(summaryUrl);
  };

  const handleViewPreview = () => {
    if (!generatedCode) return;
    setShowPreview(true);
  };

  const handleViewQualityReport = () => {
    if (!generatedCode) return;

    const report = `# Quality Assessment Report

Generated: ${generatedCode.timestamp.toLocaleString()}
Overall Score: ${Math.round(generatedCode.quality.overall)}/100

## Category Scores:
- Visual Fidelity: ${Math.round(generatedCode.quality.categories.visual)}/100
- Code Quality: ${Math.round(generatedCode.quality.categories.code)}/100
- Performance: ${Math.round(generatedCode.quality.categories.performance)}/100
- Accessibility: ${Math.round(generatedCode.quality.categories.accessibility)}/100
- Maintainability: ${Math.round(generatedCode.quality.categories.maintainability)}/100
- Security: ${Math.round(generatedCode.quality.categories.security)}/100

## Metrics:
- Lines of Code: ${generatedCode.metrics.linesOfCode}
- Complexity Score: ${generatedCode.metrics.complexity}
- Maintainability Index: ${Math.round(generatedCode.metrics.maintainabilityIndex)}
- Test Coverage: ${Math.round(generatedCode.metrics.testCoverage)}%
- Bundle Size: ${Math.round(generatedCode.metrics.bundleSize / 1024)}KB
- Load Time: ${Math.round(generatedCode.metrics.loadTime)}ms
- Performance Score: ${Math.round(generatedCode.metrics.performanceScore)}

## Recommendations:
${generatedCode.quality.recommendations?.map(rec => `- ${rec}`).join('\n') || '- No specific recommendations at this time'}

## Issues Found:
${generatedCode.quality.issues?.map(issue => `- ${issue.level.toUpperCase()}: ${issue.message}`).join('\n') || '- No issues found'}
`;

    const reportBlob = new Blob([report], { type: 'text/markdown' });
    const reportUrl = URL.createObjectURL(reportBlob);
    const reportLink = document.createElement('a');
    reportLink.href = reportUrl;
    reportLink.download = 'quality-report.md';
    document.body.appendChild(reportLink);
    reportLink.click();
    document.body.removeChild(reportLink);
    URL.revokeObjectURL(reportUrl);
  };

  return (
    <section id="generator" className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Try the Generator
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of AI-driven Figma-to-code generation with real-time quality assessment
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <span>Code Generator</span>
              </CardTitle>
              <CardDescription>
                Transform your Figma designs into production-ready code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Input Section */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="figma-url">Figma URL</Label>
                    <div className="relative">
                      <Link className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="figma-url"
                        type="url"
                        placeholder="https://www.figma.com/file/..."
                        value={figmaUrl}
                        onChange={(e) => setFigmaUrl(e.target.value)}
                        className="pl-10"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="access-token">Access Token (Optional)</Label>
                    <Input
                      id="access-token"
                      type="password"
                      placeholder="Your Figma access token"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                {/* Configuration */}
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    <TabsTrigger value="quality">Quality</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Framework</Label>
                        <Select 
                          value={config.framework} 
                          onValueChange={(value: any) => setConfig(prev => ({ ...prev, framework: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select framework" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="react">React</SelectItem>
                            <SelectItem value="vue">Vue</SelectItem>
                            <SelectItem value="angular">Angular</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Styling</Label>
                        <Select 
                          value={config.styling} 
                          onValueChange={(value: any) => setConfig(prev => ({ ...prev, styling: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select styling" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                            <SelectItem value="css">CSS</SelectItem>
                            <SelectItem value="scss">SCSS</SelectItem>
                            <SelectItem value="styled-components">Styled Components</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 pt-8">
                        <Switch
                          id="typescript"
                          checked={config.typescript}
                          onCheckedChange={(checked) => setConfig(prev => ({ ...prev, typescript: checked }))}
                        />
                        <Label htmlFor="typescript">TypeScript</Label>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Optimization</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="treeshaking"
                              checked={config.optimization.treeshaking}
                              onCheckedChange={(checked) => setConfig(prev => ({
                                ...prev,
                                optimization: { ...prev.optimization, treeshaking: checked }
                              }))}
                            />
                            <Label htmlFor="treeshaking">Tree Shaking</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="codesplitting"
                              checked={config.optimization.codesplitting}
                              onCheckedChange={(checked) => setConfig(prev => ({
                                ...prev,
                                optimization: { ...prev.optimization, codesplitting: checked }
                              }))}
                            />
                            <Label htmlFor="codesplitting">Code Splitting</Label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-medium">Testing</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="unittests"
                              checked={config.testing.unitTests}
                              onCheckedChange={(checked) => setConfig(prev => ({
                                ...prev,
                                testing: { ...prev.testing, unitTests: checked }
                              }))}
                            />
                            <Label htmlFor="unittests">Unit Tests</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="integrationtests"
                              checked={config.testing.integrationTests}
                              onCheckedChange={(checked) => setConfig(prev => ({
                                ...prev,
                                testing: { ...prev.testing, integrationTests: checked }
                              }))}
                            />
                            <Label htmlFor="integrationtests">Integration Tests</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="quality" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>WCAG Compliance Level</Label>
                        <Select 
                          value={config.accessibility.wcagLevel} 
                          onValueChange={(value: any) => setConfig(prev => ({ 
                            ...prev, 
                            accessibility: { ...prev.accessibility, wcagLevel: value }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select WCAG level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">WCAG A</SelectItem>
                            <SelectItem value="AA">WCAG AA</SelectItem>
                            <SelectItem value="AAA">WCAG AAA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="screenreader"
                            checked={config.accessibility.screenReader}
                            onCheckedChange={(checked) => setConfig(prev => ({
                              ...prev,
                              accessibility: { ...prev.accessibility, screenReader: checked }
                            }))}
                          />
                          <Label htmlFor="screenreader">Screen Reader Support</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="keyboardnav"
                            checked={config.accessibility.keyboardNavigation}
                            onCheckedChange={(checked) => setConfig(prev => ({
                              ...prev,
                              accessibility: { ...prev.accessibility, keyboardNavigation: checked }
                            }))}
                          />
                          <Label htmlFor="keyboardnav">Keyboard Navigation</Label>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {!isProcessing ? (
                    <Button 
                      type="submit" 
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                      disabled={!figmaUrl.trim()}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Generate Code
                    </Button>
                  ) : (
                    <Button 
                      type="button" 
                      variant="destructive"
                      className="flex-1"
                      onClick={cancelProcessing}
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Cancel Processing
                    </Button>
                  )}
                  <Button type="button" variant="outline" onClick={handleReset}>
                    <X className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </form>

              {/* Processing Status */}
              {(isProcessing || currentPhase) && (
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          <span className="font-medium">
                            {currentPhase?.name || 'Processing...'}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {Math.round(progress)}%
                        </Badge>
                      </div>
                      <Progress value={progress} className="w-full" />
                      {currentPhase?.description && (
                        <p className="text-sm text-muted-foreground">
                          {currentPhase.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error Display */}
              {error && (
                <Card className="border-destructive/50 text-destructive">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-2">
                      <X className="w-5 h-5 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Generation Failed</h4>
                        <p className="text-sm mt-1">{error}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Success & Results */}
              {generatedCode && (
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-green-800">
                          Code Generated Successfully!
                        </h4>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Quality Score: {Math.round(generatedCode.quality.overall)}/100
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Files:</span>
                          <span className="ml-2 font-medium">{generatedCode.files.length}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Components:</span>
                          <span className="ml-2 font-medium">{generatedCode.structure.components.length}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Lines:</span>
                          <span className="ml-2 font-medium">{generatedCode.metrics.linesOfCode}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Bundle:</span>
                          <span className="ml-2 font-medium">{Math.round(generatedCode.metrics.bundleSize / 1024)}KB</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button size="sm" variant="outline" onClick={handleDownloadCode}>
                          <Download className="w-4 h-4 mr-2" />
                          Download Code
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleViewPreview}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Preview
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleViewQualityReport}>
                          <FileText className="w-4 h-4 mr-2" />
                          Quality Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Code Preview</DialogTitle>
              <DialogDescription>
                Preview of the generated code structure and content
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-auto max-h-[60vh]">
              {generatedCode && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="text-sm">
                      <strong>Framework:</strong> {generatedCode.config.framework}
                    </div>
                    <div className="text-sm">
                      <strong>TypeScript:</strong> {generatedCode.config.typescript ? 'Yes' : 'No'}
                    </div>
                    <div className="text-sm">
                      <strong>Styling:</strong> {generatedCode.config.styling}
                    </div>
                    <div className="text-sm">
                      <strong>Files:</strong> {generatedCode.files.length}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Generated Files:</h4>
                    {generatedCode.files.map((file, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4" />
                            <span className="font-medium">{file.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {file.language}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.round(file.size / 1024 * 100) / 100} KB
                          </span>
                        </div>
                        <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-32">
                          <code>{file.content.slice(0, 500)}{file.content.length > 500 ? '...' : ''}</code>
                        </pre>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GeneratorInterface;