/**
 * Custom hook for file download functionality
 * Handles blob creation, URL management, and cleanup
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { UseFileDownloadReturn } from '../types/code-preview';
import { CODE_PREVIEW_CONSTANTS } from '../constants/code-preview';

export const useFileDownload = (): UseFileDownloadReturn => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const urlsRef = useRef<string[]>([]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      urlsRef.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch (error) {
          console.warn('Failed to revoke object URL:', error);
        }
      });
    };
  }, []);

  const downloadFile = useCallback((content: string, filename: string, mimeType: string): void => {
    if (!content.trim()) {
      setDownloadError(CODE_PREVIEW_CONSTANTS.ERROR_MESSAGES.EMPTY_CONTENT);
      return;
    }

    setIsDownloading(true);
    setDownloadError(null);

    try {
      // Create blob with proper MIME type
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      // Keep track of URLs for cleanup
      urlsRef.current.push(url);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      // Add to DOM, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up URL after a short delay
      setTimeout(() => {
        try {
          URL.revokeObjectURL(url);
          urlsRef.current = urlsRef.current.filter(u => u !== url);
        } catch (error) {
          console.warn('Failed to revoke object URL:', error);
        }
      }, CODE_PREVIEW_CONSTANTS.DOWNLOAD_TIMEOUT);

    } catch (error) {
      console.error('Failed to download file:', error);
      setDownloadError(CODE_PREVIEW_CONSTANTS.ERROR_MESSAGES.DOWNLOAD_FAILED);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return {
    downloadFile,
    isDownloading,
    downloadError,
  };
};
