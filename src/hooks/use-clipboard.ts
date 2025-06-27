
/**
 * Custom hook for clipboard operations with fallback support
 * Handles modern Clipboard API with graceful degradation
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { UseClipboardReturn } from '../types/code-preview';
import { CODE_PREVIEW_CONSTANTS } from '../constants/code-preview';

export const useClipboard = (): UseClipboardReturn => {
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    if (!text.trim()) {
      setCopyError(CODE_PREVIEW_CONSTANTS.ERROR_MESSAGES.EMPTY_CONTENT);
      return false;
    }

    setIsCopying(true);
    setCopyError(null);
    setCopySuccess(false);

    try {
      // Try modern Clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback to execCommand for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        textArea.setAttribute('readonly', '');
        textArea.setAttribute('aria-hidden', 'true');
        
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999); // For mobile devices
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (!successful) {
          throw new Error('execCommand failed');
        }
      }

      setCopySuccess(true);
      
      // Clear success state after timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCopySuccess(false);
      }, CODE_PREVIEW_CONSTANTS.COPY_SUCCESS_TIMEOUT);

      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      setCopyError(CODE_PREVIEW_CONSTANTS.ERROR_MESSAGES.COPY_FAILED);
      return false;
    } finally {
      setIsCopying(false);
    }
  }, []);

  return {
    copyToClipboard,
    isCopying,
    copySuccess,
    copyError,
  };
};
