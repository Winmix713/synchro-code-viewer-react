
import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Link, 
  FileText, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface TokenExtractorProps {
  onExtractionStart: () => Promise<void>;
  isExtracting: boolean;
  progress: number;
}

export function TokenExtractor({ 
  onExtractionStart, 
  isExtracting, 
  progress 
}: TokenExtractorProps) {
  const [figmaUrl, setFigmaUrl] = useState('');
  const [figmaToken, setFigmaToken] = useState('');
  const [extractionMethod, setExtractionMethod] = useState<'url' | 'upload'>('url');

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic
      console.log('File uploaded:', file.name);
    }
  }, []);

  const isValidFigmaUrl = useCallback((url: string) => {
    return url.includes('figma.com') && (url.includes('/file/') || url.includes('/design/'));
  }, []);

  const canStartExtraction = () => {
    if (extractionMethod === 'url') {
      return isValidFigmaUrl(figmaUrl) && figmaToken.length > 0;
    }
    return true; // For file upload
  };

  return (
    <div className="space-y-6">
      {/* Extraction Method Selection */}
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            extractionMethod === 'url' 
              ? 'ring-2 ring-primary bg-primary/5' 
              : 'hover:bg-muted/50'
          }`}
          onClick={() => setExtractionMethod('url')}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <Link className="w-8 h-8 text-primary" />
              <h3 className="font-semibold">Figma URL</h3>
              <p className="text-sm text-muted-foreground">
                Extract directly from Figma using file URL
              </p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            extractionMethod === 'upload' 
              ? 'ring-2 ring-primary bg-primary/5' 
              : 'hover:bg-muted/50'
          }`}
          onClick={() => setExtractionMethod('upload')}
        >
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <Upload className="w-8 h-8 text-primary" />
              <h3 className="font-semibold">File Upload</h3>
              <p className="text-sm text-muted-foreground">
                Upload exported Figma or JSON files
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Extraction Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Extraction Configuration
          </CardTitle>
          <CardDescription>
            Configure how design tokens should be extracted and processed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {extractionMethod === 'url' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="figma-url">Figma File URL</Label>
                <Input
                  id="figma-url"
                  placeholder="https://www.figma.com/file/..."
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                  className={isValidFigmaUrl(figmaUrl) && figmaUrl ? 'border-green-500' : ''}
                />
                {figmaUrl && !isValidFigmaUrl(figmaUrl) && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Please enter a valid Figma file URL
                  </p>
                )}
                {isValidFigmaUrl(figmaUrl) && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Valid Figma URL detected
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="figma-token">Figma Access Token</Label>
                <Input
                  id="figma-token"
                  type="password"
                  placeholder="figd_..."
                  value={figmaToken}
                  onChange={(e) => setFigmaToken(e.target.value)}
                  className={figmaToken.length > 0 ? 'border-green-500' : ''}
                />
                <p className="text-xs text-muted-foreground">
                  Generate a personal access token in your Figma account settings
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground rounded-lg p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <FileText className="w-12 h-12 text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold">Upload Design Files</h3>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop files or click to browse
                    </p>
                  </div>
                  <Input
                    type="file"
                    accept=".fig,.json,.sketch"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Choose Files
                    </label>
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Extraction Options */}
          <div className="space-y-3">
            <h4 className="font-medium">Extraction Options</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Color tokens</span>
                <Badge variant="secondary">Auto</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Typography</span>
                <Badge variant="secondary">Auto</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Spacing</span>
                <Badge variant="secondary">Auto</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">Effects</span>
                <Badge variant="secondary">Auto</Badge>
              </div>
            </div>
          </div>

          {/* Progress Display */}
          {isExtracting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Extraction Progress</Label>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {progress < 30 && 'Analyzing Figma file structure...'}
                {progress >= 30 && progress < 60 && 'Extracting design tokens...'}
                {progress >= 60 && progress < 90 && 'Processing and categorizing tokens...'}
                {progress >= 90 && 'Finalizing extraction...'}
              </p>
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={onExtractionStart}
            disabled={!canStartExtraction() || isExtracting}
            className="w-full"
            size="lg"
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Extracting Tokens...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Start Extraction
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
