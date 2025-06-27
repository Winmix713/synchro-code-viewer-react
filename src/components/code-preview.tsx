
/**
 * Main CodePreview component - Enterprise-grade code preview with tabs
 * Includes syntax highlighting, copy/download functionality, and full accessibility
 */

import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { CodePreviewProps } from '../types/code-preview';
import { useTabConfig } from '../hooks/use-tab-config';
import { useTheme } from '../hooks/use-theme';
import { SyntaxHighlighterWrapper } from './syntax-highlighter-wrapper';
import { TabActions } from './tab-actions';
import { CodePreviewErrorBoundary } from './error-boundary';
import { CODE_PREVIEW_CONSTANTS } from '../constants/code-preview';

const CodePreviewComponent = memo<CodePreviewProps>(({
  codeContent,
  title = CODE_PREVIEW_CONSTANTS.DEFAULT_TITLE,
  className = '',
  theme: themeOverride = CODE_PREVIEW_CONSTANTS.DEFAULT_THEME,
  showLineNumbers = CODE_PREVIEW_CONSTANTS.DEFAULT_SHOW_LINE_NUMBERS,
  enableDownload = CODE_PREVIEW_CONSTANTS.DEFAULT_ENABLE_DOWNLOAD,
  enableCopy = CODE_PREVIEW_CONSTANTS.DEFAULT_ENABLE_COPY,
  tabOrder,
  onTabChange,
  onCopy,
  onDownload,
}) => {
  const { theme } = useTheme(themeOverride);
  const { tabs, activeTab, setActiveTab, getTabById } = useTabConfig(codeContent, tabOrder);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, key, shiftKey } = event;
      const isModifierPressed = ctrlKey || metaKey;

      if (isModifierPressed) {
        switch (key.toLowerCase()) {
          case 'c':
            if (enableCopy) {
              event.preventDefault();
              // Copy action is handled by TabActions component
            }
            break;
          case 's':
            if (enableDownload) {
              event.preventDefault();
              // Download action is handled by TabActions component
            }
            break;
        }
      }

      // Tab navigation
      if (key === 'Tab' && !isModifierPressed) {
        const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
        if (currentIndex !== -1) {
          const nextIndex = shiftKey
            ? (currentIndex - 1 + tabs.length) % tabs.length
            : (currentIndex + 1) % tabs.length;
          
          if (tabs[nextIndex]) {
            setActiveTab(tabs[nextIndex].id);
            onTabChange?.(tabs[nextIndex].id);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [tabs, activeTab, setActiveTab, enableCopy, enableDownload, onTabChange]);

  const handleTabClick = useCallback((tabId: keyof typeof codeContent) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  }, [setActiveTab, onTabChange]);

  const handleCopy = useCallback((content: string, tabId: keyof typeof codeContent) => {
    onCopy?.(content, tabId);
    console.log(`Code copied from ${tabId} tab`);
  }, [onCopy]);

  const handleDownload = useCallback((content: string, tabId: keyof typeof codeContent) => {
    onDownload?.(content, tabId);
    console.log(`Code downloaded from ${tabId} tab`);
  }, [onDownload]);

  const activeTabData = useMemo(() => getTabById(activeTab), [getTabById, activeTab]);

  if (tabs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p>No code content available</p>
      </div>
    );
  }

  return (
    <div className={`code-preview ${CODE_PREVIEW_CONSTANTS.THEME_CLASSES[theme]} ${className}`}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <TabActions
            tabs={tabs}
            activeTabId={activeTab}
            onCopy={handleCopy}
            onDownload={handleDownload}
            enableCopy={enableCopy}
            enableDownload={enableDownload}
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav
            role="tablist"
            aria-label={CODE_PREVIEW_CONSTANTS.ARIA_LABELS.tabList}
            className="flex"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => handleTabClick(tab.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          aria-label={CODE_PREVIEW_CONSTANTS.ARIA_LABELS.tabPanel}
          className="relative"
        >
          {activeTabData && (
            <div className="max-h-96 overflow-auto bg-gray-50 dark:bg-gray-900">
              <SyntaxHighlighterWrapper
                language={activeTabData.language}
                showLineNumbers={showLineNumbers}
                theme={theme}
                className="p-4"
              >
                {activeTabData.content}
              </SyntaxHighlighterWrapper>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

CodePreviewComponent.displayName = 'CodePreview';

// Export with Error Boundary wrapper
export const CodePreview = memo<CodePreviewProps>((props) => (
  <CodePreviewErrorBoundary>
    <CodePreviewComponent {...props} />
  </CodePreviewErrorBoundary>
));

CodePreview.displayName = 'CodePreviewWithErrorBoundary';
