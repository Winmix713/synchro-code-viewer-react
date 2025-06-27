
/**
 * Constants, configuration, and messages for the CodePreview component
 * Centralized configuration for maintainability
 */

import { KeyboardShortcuts } from '../types/code-preview';

export const CODE_PREVIEW_CONSTANTS = {
  // Timing constants
  COPY_SUCCESS_TIMEOUT: 2000,
  DOWNLOAD_TIMEOUT: 1000,
  THEME_TRANSITION_DURATION: 150,
  
  // File extensions and MIME types
  FILE_EXTENSIONS: {
    jsx: '.jsx',
    css: '.css',
    types: '.d.ts',
  } as const,
  
  MIME_TYPES: {
    jsx: 'text/javascript',
    css: 'text/css',
    types: 'text/typescript',
  } as const,
  
  // Language mappings for syntax highlighting
  LANGUAGES: {
    jsx: 'javascript',
    css: 'css',
    types: 'typescript',
  } as const,
  
  // Default tab configuration
  DEFAULT_TAB_ORDER: ['jsx', 'css', 'types'] as const,
  
  // Accessibility constants
  ARIA_LABELS: {
    tabList: 'Code file tabs',
    tabPanel: 'Code content',
    copyButton: 'Copy code to clipboard',
    downloadButton: 'Download code file',
    themeToggle: 'Toggle theme',
  } as const,
  
  // Error messages
  ERROR_MESSAGES: {
    COPY_FAILED: 'Failed to copy code to clipboard',
    DOWNLOAD_FAILED: 'Failed to download file',
    EMPTY_CONTENT: 'No content available',
    UNSUPPORTED_BROWSER: 'This feature is not supported in your browser',
    GENERIC_ERROR: 'An unexpected error occurred',
  } as const,
  
  // Success messages
  SUCCESS_MESSAGES: {
    COPY_SUCCESS: 'Code copied to clipboard!',
    DOWNLOAD_SUCCESS: 'File downloaded successfully!',
  } as const,
  
  // Keyboard shortcuts
  KEYBOARD_SHORTCUTS: {
    'ctrl+c': 'copy',
    'cmd+c': 'copy',
    'ctrl+s': 'download',
    'cmd+s': 'download',
    'tab': 'tab-next',
    'shift+tab': 'tab-prev',
  } as KeyboardShortcuts,
  
  // CSS classes for themes
  THEME_CLASSES: {
    light: 'code-preview-light',
    dark: 'code-preview-dark',
  } as const,
  
  // Default props
  DEFAULT_TITLE: 'Code Preview',
  DEFAULT_THEME: 'auto' as const,
  DEFAULT_SHOW_LINE_NUMBERS: true,
  DEFAULT_ENABLE_COPY: true,
  DEFAULT_ENABLE_DOWNLOAD: true,
} as const;

export const TAB_LABELS = {
  jsx: 'Component',
  css: 'Styles',
  types: 'Types',
} as const;

// Media queries for responsive design
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

// Z-index values for layering
export const Z_INDEX = {
  dropdown: 10,
  modal: 20,
  tooltip: 30,
  notification: 40,
} as const;
