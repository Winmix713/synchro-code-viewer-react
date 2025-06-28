
import { useState, useCallback, useRef } from 'react';
import { figmaApiClient } from '../services/figma-api-client';
import { securityService } from '../services/security-service';
import { FigmaConnectionStatus, FigmaProcessingStatus, FigmaFile, FigmaApiResponse } from '../types/figma-api';
import { useToast } from '../hooks/use-toast';

interface FigmaComponentsResponse {
  meta: {
    components: Record<string, any>;
  };
}

interface FigmaStylesResponse {
  meta: {
    styles: Record<string, any>;
  };
}

export const useFigmaConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<FigmaConnectionStatus>({
    isConnected: false,
    isConnecting: false,
  });

  const [processingStatus, setProcessingStatus] = useState<FigmaProcessingStatus>({
    isProcessing: false,
    progress: 0,
    stage: 'connecting',
    message: 'Ready to connect',
  });

  const [figmaData, setFigmaData] = useState<FigmaFile | null>(null);
  const [encryptedApiKey, setEncryptedApiKey] = useState<string>('');
  
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  const updateProgress = useCallback((progress: number, stage: FigmaProcessingStatus['stage'], message: string) => {
    setProcessingStatus(prev => ({
      ...prev,
      progress,
      stage,
      message,
      startTime: prev.startTime || new Date(),
    }));
  }, []);

  const testConnection = useCallback(async (apiKey: string): Promise<boolean> => {
    if (!securityService.validateApiKey(apiKey)) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid Figma API key that starts with 'fig'",
        variant: "destructive",
      });
      return false;
    }

    setConnectionStatus(prev => ({ ...prev, isConnecting: true, error: undefined }));
    
    try {
      const isValid = await figmaApiClient.testConnection(apiKey);
      
      if (isValid) {
        const encrypted = await securityService.encryptApiKey(apiKey);
        setEncryptedApiKey(encrypted);
        
        setConnectionStatus({
          isConnected: true,
          isConnecting: false,
          lastConnected: new Date(),
          ...figmaApiClient.getRateLimitStatus(),
        });

        toast({
          title: "Connection Successful",
          description: "Successfully connected to Figma API",
        });
        
        return true;
      } else {
        throw new Error('Connection test failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      
      setConnectionStatus({
        isConnected: false,
        isConnecting: false,
        error: errorMessage,
      });

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  }, [toast]);

  const fetchFigmaFile = useCallback(async (figmaUrl: string): Promise<void> => {
    if (!encryptedApiKey) {
      throw new Error('No API key available. Please connect first.');
    }

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    try {
      setProcessingStatus({
        isProcessing: true,
        progress: 0,
        stage: 'connecting',
        message: 'Initializing connection...',
        startTime: new Date(),
      });

      // Extract file key from URL
      const fileKey = figmaApiClient.extractFileKeyFromUrl(figmaUrl);
      if (!fileKey) {
        throw new Error('Invalid Figma URL. Please check the URL format.');
      }

      updateProgress(20, 'connecting', 'Validating credentials...');

      // Decrypt API key
      const apiKey = await securityService.decryptApiKey(encryptedApiKey);
      
      updateProgress(40, 'fetching', 'Fetching file data...');

      // Fetch the main file
      const fileData = await figmaApiClient.getFile(fileKey, apiKey);
      
      updateProgress(60, 'fetching', 'Fetching components...');

      // Fetch additional data in parallel
      const [componentsResponse, stylesResponse] = await Promise.all([
        figmaApiClient.getFileComponents(fileKey, apiKey).catch(() => null) as Promise<FigmaComponentsResponse | null>,
        figmaApiClient.getFileStyles(fileKey, apiKey).catch(() => null) as Promise<FigmaStylesResponse | null>,
      ]);

      updateProgress(80, 'parsing', 'Processing file data...');

      // Enhance file data with components and styles
      const enhancedFileData: FigmaFile = {
        ...fileData,
        components: componentsResponse?.meta?.components || {},
        styles: stylesResponse?.meta?.styles || {},
      };

      updateProgress(100, 'complete', 'File loaded successfully!');

      setFigmaData(enhancedFileData);

      toast({
        title: "File Loaded",
        description: `Successfully loaded "${enhancedFileData.name}"`,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch file';
      
      setProcessingStatus({
        isProcessing: false,
        progress: 0,
        stage: 'error',
        message: errorMessage,
      });

      toast({
        title: "Failed to Load File",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    } finally {
      abortControllerRef.current = null;
    }
  }, [encryptedApiKey, toast, updateProgress]);

  const disconnect = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setConnectionStatus({
      isConnected: false,
      isConnecting: false,
    });
    
    setEncryptedApiKey('');
    setFigmaData(null);
    setProcessingStatus({
      isProcessing: false,
      progress: 0,
      stage: 'connecting',
      message: 'Ready to connect',
    });

    toast({
      title: "Disconnected",
      description: "Successfully disconnected from Figma API",
    });
  }, [toast]);

  const cancelProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setProcessingStatus({
      isProcessing: false,
      progress: 0,
      stage: 'connecting',
      message: 'Processing cancelled',
    });
  }, []);

  return {
    connectionStatus,
    processingStatus,
    figmaData,
    testConnection,
    fetchFigmaFile,
    disconnect,
    cancelProcessing,
    rateLimitStatus: figmaApiClient.getRateLimitStatus(),
  };
};
