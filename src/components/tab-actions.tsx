
/**
 * Tab action buttons component for copy and download functionality
 * Includes loading states, keyboard shortcuts, and accessibility features
 */

import React, { memo, useCallback } from 'react';
import { Copy, Download, Check, Loader2 } from 'lucide-react';
import { TabActionsProps } from '../types/code-preview';
import { CODE_PREVIEW_CONSTANTS } from '../constants/code-preview';
import { useClipboard } from '../hooks/use-clipboard';
import { useFileDownload } from '../hooks/use-file-download';

const TabActions = memo<TabActionsProps>(({
  tabs,
  activeTabId,
  onCopy,
  onDownload,
  enableCopy = true,
  enableDownload = true,
}) => {
  const { copyToClipboard, isCopying, copySuccess } = useClipboard();
  const { downloadFile, isDownloading } = useFileDownload();

  const activeTab = tabs.find(tab => tab.id === activeTabId);

  const handleCopy = useCallback(async () => {
    if (!activeTab || activeTab.isEmpty || !enableCopy) return;

    const success = await copyToClipboard(activeTab.content);
    if (success) {
      onCopy(activeTab.content, activeTab.id);
    }
  }, [activeTab, enableCopy, copyToClipboard, onCopy]);

  const handleDownload = useCallback(() => {
    if (!activeTab || activeTab.isEmpty || !enableDownload) return;

    const filename = `code${activeTab.extension}`;
    downloadFile(activeTab.content, filename, activeTab.mimeType);
    onDownload(activeTab.content, activeTab.id);
  }, [activeTab, enableDownload, downloadFile, onDownload]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, action: 'copy' | 'download') => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (action === 'copy') {
        handleCopy();
      } else {
        handleDownload();
      }
    }
  }, [handleCopy, handleDownload]);

  if (!activeTab) return null;

  const isDisabled = activeTab.isEmpty;
  const copyButtonDisabled = isDisabled || !enableCopy || isCopying;
  const downloadButtonDisabled = isDisabled || !enableDownload || isDownloading;

  return (
    <div className="flex items-center gap-2" role="toolbar" aria-label="Code actions">
      {enableCopy && (
        <button
          onClick={handleCopy}
          onKeyDown={(e) => handleKeyDown(e, 'copy')}
          disabled={copyButtonDisabled}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={`${CODE_PREVIEW_CONSTANTS.ARIA_LABELS.copyButton} (Ctrl+C)`}
          title="Copy code (Ctrl+C)"
        >
          {isCopying ? (
            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
          ) : copySuccess ? (
            <Check className="w-4 h-4 mr-1.5 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 mr-1.5" />
          )}
          {isCopying ? 'Copying...' : copySuccess ? 'Copied!' : 'Copy'}
        </button>
      )}

      {enableDownload && (
        <button
          onClick={handleDownload}
          onKeyDown={(e) => handleKeyDown(e, 'download')}
          disabled={downloadButtonDisabled}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={`${CODE_PREVIEW_CONSTANTS.ARIA_LABELS.downloadButton} (Ctrl+S)`}
          title="Download file (Ctrl+S)"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-1.5" />
          )}
          {isDownloading ? 'Downloading...' : `Download ${activeTab.extension}`}
        </button>
      )}
    </div>
  );
});

TabActions.displayName = 'TabActions';

export { TabActions };
