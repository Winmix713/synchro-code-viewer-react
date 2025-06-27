
/**
 * Custom hook for managing tab configuration and state
 * Handles tab creation, filtering, and state management
 */

import { useState, useMemo, useCallback } from 'react';
import { CodeContent, TabConfig, UseTabConfigReturn } from '../types/code-preview';
import { CODE_PREVIEW_CONSTANTS, TAB_LABELS } from '../constants/code-preview';

export const useTabConfig = (
  codeContent: CodeContent,
  tabOrder?: Array<keyof CodeContent>
): UseTabConfigReturn => {
  const [activeTab, setActiveTab] = useState<keyof CodeContent>('jsx');

  const tabs = useMemo(() => {
    const order = tabOrder || CODE_PREVIEW_CONSTANTS.DEFAULT_TAB_ORDER;
    
    return order
      .filter(tabId => codeContent[tabId] && codeContent[tabId]!.trim().length > 0)
      .map((tabId): TabConfig => ({
        id: tabId,
        label: TAB_LABELS[tabId],
        language: CODE_PREVIEW_CONSTANTS.LANGUAGES[tabId],
        extension: CODE_PREVIEW_CONSTANTS.FILE_EXTENSIONS[tabId],
        mimeType: CODE_PREVIEW_CONSTANTS.MIME_TYPES[tabId],
        content: codeContent[tabId] || '',
        isEmpty: !codeContent[tabId] || codeContent[tabId]!.trim().length === 0,
      }));
  }, [codeContent, tabOrder]);

  // Ensure active tab is valid
  const validActiveTab = useMemo(() => {
    const hasActiveTab = tabs.some(tab => tab.id === activeTab);
    return hasActiveTab ? activeTab : tabs[0]?.id || 'jsx';
  }, [tabs, activeTab]);

  const handleSetActiveTab = useCallback((tabId: keyof CodeContent) => {
    const isValidTab = tabs.some(tab => tab.id === tabId);
    if (isValidTab) {
      setActiveTab(tabId);
    }
  }, [tabs]);

  const getTabById = useCallback((tabId: keyof CodeContent): TabConfig | undefined => {
    return tabs.find(tab => tab.id === tabId);
  }, [tabs]);

  return {
    tabs,
    activeTab: validActiveTab,
    setActiveTab: handleSetActiveTab,
    getTabById,
  };
};
