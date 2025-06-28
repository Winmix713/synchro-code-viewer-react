
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiKeySchema, type ApiKeyFormData } from '../../types/form-schemas';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Eye, EyeOff, Key, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ApiKeyFormProps {
  onSubmit: (data: ApiKeyFormData) => Promise<boolean>;
  isLoading?: boolean;
  isConnected?: boolean;
  className?: string;
}

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  onSubmit,
  isLoading = false,
  isConnected = false,
  className
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [keyStrength, setKeyStrength] = useState<'weak' | 'medium' | 'strong'>('weak');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeySchema),
    mode: 'onChange',
  });

  const apiKeyValue = watch('apiKey', '');

  React.useEffect(() => {
    // Analyze API key strength
    if (apiKeyValue.length === 0) {
      setKeyStrength('weak');
    } else if (apiKeyValue.length < 40) {
      setKeyStrength('weak');
    } else if (apiKeyValue.startsWith('fig') && apiKeyValue.length >= 40) {
      setKeyStrength('strong');
    } else {
      setKeyStrength('medium');
    }
  }, [apiKeyValue]);

  const handleFormSubmit = async (data: ApiKeyFormData) => {
    const success = await onSubmit(data);
    if (!success) {
      // Form submission failed, focus on the input for retry
      document.getElementById('api-key-input')?.focus();
    }
  };

  const getStrengthColor = () => {
    switch (keyStrength) {
      case 'strong': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  const getStrengthText = () => {
    switch (keyStrength) {
      case 'strong': return 'Valid Figma API key format';
      case 'medium': return 'Key format needs verification';
      default: return 'Enter your Figma API key';
    }
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-xl">Figma API Key</CardTitle>
            <CardDescription>
              Connect securely to your Figma account
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isConnected && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Successfully connected to Figma API
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key-input" className="text-sm font-medium">
              API Key
            </Label>
            
            <div className="relative">
              <Input
                id="api-key-input"
                type={showApiKey ? 'text' : 'password'}
                placeholder="fig_xxxxxxxxxxxxxxxxxxxx"
                className={cn(
                  "pr-10 font-mono text-sm",
                  errors.apiKey && "border-red-500 focus-visible:ring-red-500"
                )}
                {...register('apiKey')}
                disabled={isSubmitting || isLoading}
                autoComplete="off"
                spellCheck={false}
              />
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
                disabled={isSubmitting || isLoading}
                tabIndex={-1}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>

            {/* Key strength indicator */}
            {apiKeyValue && (
              <div className="flex items-center space-x-2 text-xs">
                <div className={cn("font-medium", getStrengthColor())}>
                  {getStrengthText()}
                </div>
                {keyStrength === 'strong' && (
                  <Shield className="h-3 w-3 text-green-600" />
                )}
              </div>
            )}

            {errors.apiKey && (
              <div className="flex items-center space-x-1 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span>{errors.apiKey.message}</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isLoading || isConnected}
            size="lg"
          >
            {isSubmitting || isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                {isConnected ? 'Connected' : 'Connecting...'}
              </>
            ) : isConnected ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Connected
              </>
            ) : (
              'Connect to Figma'
            )}
          </Button>
        </form>

        <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
          <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-xs text-blue-800 dark:text-blue-200">
            Your API key is encrypted and stored securely using Web Crypto API. 
            Get your API key from{' '}
            <a 
              href="https://www.figma.com/developers/api#access-tokens" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:no-underline font-medium"
            >
              Figma Settings → API
            </a>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
