
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { figmaUrlSchema, type FigmaUrlFormData } from '../../types/form-schemas';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Link, FileText, CheckCircle, AlertTriangle, Clock, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FigmaUrlFormProps {
  onSubmit: (data: FigmaUrlFormData) => Promise<void>;
  isLoading?: boolean;
  isConnected?: boolean;
  className?: string;
}

interface UrlPreview {
  fileId: string | null;
  isValid: boolean;
  fileName?: string;
  lastModified?: string;
}

export const FigmaUrlForm: React.FC<FigmaUrlFormProps> = ({
  onSubmit,
  isLoading = false,
  isConnected = false,
  className
}) => {
  const [urlPreview, setUrlPreview] = useState<UrlPreview | null>(null);
  const [recentUrls, setRecentUrls] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    setValue,
  } = useForm<FigmaUrlFormData>({
    resolver: zodResolver(figmaUrlSchema),
    mode: 'onChange',
  });

  const urlValue = watch('url', '');

  // Load recent URLs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('figma-recent-urls');
    if (saved) {
      try {
        setRecentUrls(JSON.parse(saved));
      } catch {
        // Ignore invalid JSON
      }
    }
  }, []);

  // Update URL preview when URL changes
  useEffect(() => {
    if (!urlValue) {
      setUrlPreview(null);
      return;
    }

    try {
      const url = new URL(urlValue);
      const fileIdMatch = url.pathname.match(/\/(?:file|design)\/([a-zA-Z0-9]{22,})/);
      const fileId = fileIdMatch ? fileIdMatch[1] : null;
      
      setUrlPreview({
        fileId,
        isValid: !!fileId && (url.hostname === 'www.figma.com'),
        fileName: url.searchParams.get('node-id') ? 'Specific Node' : 'Full File',
      });
    } catch {
      setUrlPreview({
        fileId: null,
        isValid: false,
      });
    }
  }, [urlValue]);

  const handleFormSubmit = async (data: FigmaUrlFormData) => {
    try {
      await onSubmit(data);
      
      // Save to recent URLs
      const newRecentUrls = [data.url, ...recentUrls.filter(url => url !== data.url)].slice(0, 5);
      setRecentUrls(newRecentUrls);
      localStorage.setItem('figma-recent-urls', JSON.stringify(newRecentUrls));
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Form submission error:', error);
    }
  };

  const selectRecentUrl = (url: string) => {
    setValue('url', url, { shouldValidate: true });
  };

  const clearRecentUrls = () => {
    setRecentUrls([]);
    localStorage.removeItem('figma-recent-urls');
  };

  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Link className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Figma File URL</CardTitle>
            <CardDescription>
              Enter the URL of the Figma file you want to process
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isConnected && (
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              Please connect your API key first before processing files
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="figma-url-input" className="text-sm font-medium">
              Figma File URL
            </Label>
            
            <div className="relative">
              <Input
                id="figma-url-input"
                type="url"
                placeholder="https://www.figma.com/file/..."
                className={cn(
                  "pl-10",
                  errors.url && "border-red-500 focus-visible:ring-red-500",
                  urlPreview?.isValid && "border-green-500 focus-visible:ring-green-500"
                )}
                {...register('url')}
                disabled={isSubmitting || isLoading || !isConnected}
              />
              
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>

            {/* URL Preview */}
            {urlPreview && urlValue && (
              <div className={cn(
                "p-3 rounded-lg border text-sm",
                urlPreview.isValid 
                  ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" 
                  : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
              )}>
                <div className="flex items-center space-x-2">
                  {urlPreview.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                  <span className={cn(
                    "font-medium",
                    urlPreview.isValid 
                      ? "text-green-800 dark:text-green-200" 
                      : "text-red-800 dark:text-red-200"
                  )}>
                    {urlPreview.isValid ? 'Valid Figma URL' : 'Invalid URL format'}
                  </span>
                </div>
                
                {urlPreview.isValid && urlPreview.fileId && (
                  <div className="mt-2 space-y-1 text-green-700 dark:text-green-300">
                    <div>File ID: <code className="bg-green-100 dark:bg-green-900 px-1 rounded text-xs">{urlPreview.fileId}</code></div>
                    <div>Type: {urlPreview.fileName}</div>
                  </div>
                )}
              </div>
            )}

            {errors.url && (
              <div className="flex items-center space-x-1 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>{errors.url.message}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isLoading || !isConnected || !isValid}
            size="lg"
          >
            {isSubmitting || isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                Processing File...
              </>
            ) : (
              'Load Figma File'
            )}
          </Button>
        </form>

        {/* Recent URLs */}
        {recentUrls.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Recent URLs
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearRecentUrls}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear
              </Button>
            </div>
            
            <div className="space-y-1">
              {recentUrls.map((url, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectRecentUrl(url)}
                  disabled={!isConnected}
                  className={cn(
                    "w-full text-left p-2 rounded-md text-sm border border-gray-200 dark:border-gray-700",
                    "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "flex items-center space-x-2"
                  )}
                >
                  <Clock className="h-3 w-3 text-gray-400 flex-shrink-0" />
                  <span className="truncate flex-1">{url}</span>
                  <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-xs text-blue-800 dark:text-blue-200">
            Support for both file URLs (full file) and specific node URLs. 
            Make sure the file is publicly accessible or you have the necessary permissions.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
