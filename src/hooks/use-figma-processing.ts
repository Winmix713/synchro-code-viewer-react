
import { useState, useCallback, useRef } from 'react';
import { figmaApiService } from '@/services/figma-api-service';
import { codeGenerationEngine } from '@/services/code-generation-engine';
import { FigmaFile, ProcessingPhase } from '@/types/figma-api';
import { CodeGenerationConfig, GeneratedCode } from '@/types/code-generation';

interface UseFigmaProcessingReturn {
  isProcessing: boolean;
  currentPhase: ProcessingPhase | null;
  figmaFile: FigmaFile | null;
  generatedCode: GeneratedCode | null;
  error: string | null;
  progress: number;
  validateUrl: (url: string) => Promise<{ valid: boolean; fileId?: string; error?: string }>;
  startProcessing: (url: string, config: CodeGenerationConfig, accessToken?: string) => Promise<void>;
  cancelProcessing: () => void;
  resetProcessing: () => void;
}

export const useFigmaProcessing = (): UseFigmaProcessingReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<ProcessingPhase | null>(null);
  const [figmaFile, setFigmaFile] = useState<FigmaFile | null>(null);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  const cancelRef = useRef(false);

  const validateUrl = useCallback(async (url: string) => {
    try {
      return await figmaApiService.validateFigmaUrl(url);
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Validation failed',
      };
    }
  }, []);

  const startProcessing = useCallback(async (
    url: string,
    config: CodeGenerationConfig,
    accessToken?: string
  ) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      setError(null);
      setProgress(0);
      cancelRef.current = false;

      // Validate URL first
      const validation = await validateUrl(url);
      if (!validation.valid || !validation.fileId) {
        throw new Error(validation.error || 'Invalid Figma URL');
      }

      // Fetch Figma file
      console.log('Fetching Figma file...');
      const file = await figmaApiService.fetchFigmaFile(validation.fileId, accessToken);
      setFigmaFile(file);

      if (cancelRef.current) return;

      // Simulate processing phases
      await figmaApiService.simulateProcessing(validation.fileId, (phase) => {
        if (cancelRef.current) return;
        
        setCurrentPhase(phase);
        setProgress(phase.progress);
        console.log(`Phase: ${phase.name} - ${phase.progress}%`);
      });

      if (cancelRef.current) return;

      // Generate code
      console.log('Generating code...');
      const code = await codeGenerationEngine.generateCode(
        file,
        config,
        (progress, status) => {
          if (cancelRef.current) return;
          
          setProgress(progress);
          setCurrentPhase(prev => prev ? {
            ...prev,
            status: 'running',
            progress,
            description: status,
          } : null);
        }
      );

      if (cancelRef.current) return;

      setGeneratedCode(code);
      console.log('Code generation completed successfully');
      
    } catch (err) {
      console.error('Processing error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
      setCurrentPhase(null);
    }
  }, [isProcessing, validateUrl]);

  const cancelProcessing = useCallback(() => {
    cancelRef.current = true;
    setIsProcessing(false);
    setCurrentPhase(null);
    setProgress(0);
    console.log('Processing cancelled');
  }, []);

  const resetProcessing = useCallback(() => {
    setIsProcessing(false);
    setCurrentPhase(null);
    setFigmaFile(null);
    setGeneratedCode(null);
    setError(null);
    setProgress(0);
    cancelRef.current = false;
  }, []);

  return {
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
  };
};
