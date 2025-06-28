import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  Link, 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Code,
  Palette,
  Type,
  Layers,
  Zap,
  Shield,
  Eye,
  Settings
} from 'lucide-react';
import { useFigmaConnection } from '@/hooks/use-figma-connection';
import { ApiKeyForm } from '@/components/forms/api-key-form';
import { FigmaUrlForm } from '@/components/forms/figma-url-form';
import { ConnectionStatus } from '@/components/connection/connection-status';
import { ProcessingProgress } from '@/components/processing/processing-progress';
import { FigmaFileExplorer } from '@/components/data-display/figma-file-explorer';

const Index3: React.FC = () => {
  const {
    connectionStatus,
    processingStatus,
    figmaData,
    testConnection,
    fetchFigmaFile,
    disconnect,
    cancelProcessing,
    rateLimitStatus
  } = useFigmaConnection();

  const [activeTab, setActiveTab] = useState('connect');

  const handleApiKeySubmit = async (data: { apiKey: string }) => {
    const success = await testConnection(data.apiKey);
    if (success) {
      setActiveTab('upload');
    }
    return success;
  };

  const handleUrlSubmit = async (data: { url: string }) => {
    try {
      await fetchFigmaFile(data.url);
      setActiveTab('preview');
    } catch (error) {
      console.error('Failed to fetch Figma file:', error);
    }
  };

  const handleNodeSelect = (node: any) => {
    console.log('Selected node:', node);
  };

  const features = [
    {
      icon: <Shield className="w-5 h-5 text-green-500" />,
      title: 'Secure Connection',
      description: 'Enterprise-grade encryption for API keys'
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      title: 'Real-time Processing',
      description: 'Live updates during file processing'
    },
    {
      icon: <Eye className="w-5 h-5 text-blue-500" />,
      title: 'Interactive Preview',
      description: 'Explore your Figma file structure'
    },
    {
      icon: <Download className="w-5 h-5 text-purple-500" />,
      title: 'Multiple Exports',
      description: 'Export in various formats'
    }
  ];

  const stats = [
    { label: 'Files Processed', value: '10,000+' },
    { label: 'API Calls', value: '1M+' },
    { label: 'Success Rate', value: '99.9%' },
    { label: 'Avg Processing', value: '<30s' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Figma File Processor</h1>
                <p className="text-sm text-muted-foreground">
                  Connect, process, and explore your Figma files
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {connectionStatus.isConnected && (
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Connected
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-muted">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Connection & Upload */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="connect" className="gap-2">
                  <Link className="w-4 h-4" />
                  Connect
                </TabsTrigger>
                <TabsTrigger 
                  value="upload" 
                  disabled={!connectionStatus.isConnected}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  disabled={!figmaData}
                  className="gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="connect" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      API Connection
                    </CardTitle>
                    <CardDescription>
                      Connect securely to the Figma API to access your files
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ApiKeyForm
                      onSubmit={handleApiKeySubmit}
                      isLoading={connectionStatus.isConnecting}
                      isConnected={connectionStatus.isConnected}
                    />
                  </CardContent>
                </Card>

                {connectionStatus.isConnected && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Successfully connected to Figma API. You can now upload files.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="upload" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Figma File Upload
                    </CardTitle>
                    <CardDescription>
                      Enter your Figma file URL to start processing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FigmaUrlForm
                      onSubmit={handleUrlSubmit}
                      isLoading={processingStatus.isProcessing}
                      isConnected={connectionStatus.isConnected}
                    />
                  </CardContent>
                </Card>

                {processingStatus.isProcessing && (
                  <ProcessingProgress
                    status={processingStatus}
                    onCancel={cancelProcessing}
                  />
                )}
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                {figmaData ? (
                  <FigmaFileExplorer
                    figmaData={figmaData}
                    onNodeSelect={handleNodeSelect}
                  />
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No File Loaded</h3>
                        <p className="text-muted-foreground">
                          Upload a Figma file to see the preview here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Status & Info */}
          <div className="space-y-6">
            <ConnectionStatus
              status={connectionStatus}
              rateLimitStatus={rateLimitStatus}
              onDisconnect={disconnect}
            />

            {figmaData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    File Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">File Name</Label>
                    <p className="text-sm text-muted-foreground">{figmaData.name}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Last Modified</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(figmaData.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Version</Label>
                    <p className="text-sm text-muted-foreground">{figmaData.version}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">
                        {Object.keys(figmaData.components).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Components</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">
                        {Object.keys(figmaData.styles).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Styles</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  disabled={!figmaData}
                >
                  <Code className="w-4 h-4" />
                  Export as JSON
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  disabled={!figmaData}
                >
                  <Palette className="w-4 h-4" />
                  Export Colors
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  disabled={!figmaData}
                >
                  <Type className="w-4 h-4" />
                  Export Typography
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index3;