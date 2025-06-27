
/**
 * TypeScript type definitions for the CodePreview component
 * Comprehensive interfaces for all component props, state, and utilities
 */

export interface CodeContent {
  jsx?: string;
  css?: string;
  types?: string;
}

export interface TabConfig {
  id: keyof CodeContent;
  label: string;
  language: string;
  extension: string;
  mimeType: string;
  content: string;
  isEmpty: boolean;
}

export interface CodePreviewProps {
  /** Code content for different file types */
  codeContent: CodeContent;
  /** Optional title for the preview */
  title?: string;
  /** Custom CSS classes */
  className?: string;
  /** Theme override (auto-detects system theme by default) */
  theme?: 'light' | 'dark' | 'auto';
  /** Show line numbers in code blocks */
  showLineNumbers?: boolean;
  /** Enable download functionality */
  enableDownload?: boolean;
  /** Enable copy functionality */
  enableCopy?: boolean;
  /** Custom tab order */
  tabOrder?: Array<keyof CodeContent>;
  /** Callback when tab changes */
  onTabChange?: (tabId: keyof CodeContent) => void;
  /** Callback when copy action is performed */
  onCopy?: (content: string, tabId: keyof CodeContent) => void;
  /** Callback when download action is performed */
  onDownload?: (content: string, tabId: keyof CodeContent) => void;
}

export interface UseClipboardReturn {
  copyToClipboard: (text: string) => Promise<boolean>;
  isCopying: boolean;
  copySuccess: boolean;
  copyError: string | null;
}

export interface UseFileDownloadReturn {
  downloadFile: (content: string, filename: string, mimeType: string) => void;
  isDownloading: boolean;
  downloadError: string | null;
}

export interface UseTabConfigReturn {
  tabs: TabConfig[];
  activeTab: keyof CodeContent;
  setActiveTab: (tabId: keyof CodeContent) => void;
  getTabById: (tabId: keyof CodeContent) => TabConfig | undefined;
}

export interface UseThemeReturn {
  theme: 'light' | 'dark';
  systemTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export interface SyntaxHighlighterProps {
  language: string;
  children: string;
  showLineNumbers?: boolean;
  theme: 'light' | 'dark';
  className?: string;
}

export interface TabActionsProps {
  tabs: TabConfig[];
  activeTabId: keyof CodeContent;
  onCopy: (content: string, tabId: keyof CodeContent) => void;
  onDownload: (content: string, tabId: keyof CodeContent) => void;
  enableCopy?: boolean;
  enableDownload?: boolean;
}

export type KeyboardShortcut = 'copy' | 'download' | 'tab-next' | 'tab-prev';

export interface KeyboardShortcuts {
  [key: string]: KeyboardShortcut;
}
