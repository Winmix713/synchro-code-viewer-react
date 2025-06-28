
import { useState, useCallback, useEffect, useMemo } from 'react';
import { DesignToken, TokenType, TokenCategory } from '@/types/design-tokens';
import { designSystemExtractor } from '@/services/design-system-extractor';
import { FigmaFile } from '@/types/figma-api';

interface UseDesignTokensState {
  tokens: DesignToken[];
  filteredTokens: DesignToken[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedTypes: TokenType[];
  selectedCategories: TokenCategory[];
  sortBy: 'name' | 'type' | 'category' | 'lastModified';
  sortOrder: 'asc' | 'desc';
}

interface UseDesignTokensActions {
  extractFromFigma: (figmaFile: FigmaFile) => Promise<void>;
  addToken: (token: DesignToken) => void;
  updateToken: (id: string, updates: Partial<DesignToken>) => void;
  deleteToken: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTypes: (types: TokenType[]) => void;
  setSelectedCategories: (categories: TokenCategory[]) => void;
  setSortBy: (sortBy: UseDesignTokensState['sortBy']) => void;
  setSortOrder: (order: UseDesignTokensState['sortOrder']) => void;
  clearFilters: () => void;
  exportTokens: () => DesignToken[];
  importTokens: (tokens: DesignToken[]) => void;
}

interface UseDesignTokensReturn extends UseDesignTokensState, UseDesignTokensActions {
  tokenStats: {
    total: number;
    byType: Record<TokenType, number>;
    byCategory: Record<TokenCategory, number>;
  };
}

export function useDesignTokens(): UseDesignTokensReturn {
  const [state, setState] = useState<UseDesignTokensState>({
    tokens: [],
    filteredTokens: [],
    loading: false,
    error: null,
    searchQuery: '',
    selectedTypes: [],
    selectedCategories: [],
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const updateState = useCallback((updates: Partial<UseDesignTokensState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const extractFromFigma = useCallback(async (figmaFile: FigmaFile) => {
    updateState({ loading: true, error: null });
    
    try {
      const extractedTokens = await designSystemExtractor.extractFromFigmaFile(figmaFile);
      updateState({ 
        tokens: extractedTokens, 
        loading: false,
        error: null 
      });
    } catch (error) {
      updateState({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to extract tokens' 
      });
    }
  }, [updateState]);

  const addToken = useCallback((token: DesignToken) => {
    setState(prev => ({
      ...prev,
      tokens: [...prev.tokens, { ...token, id: `${Date.now()}-${Math.random()}` }]
    }));
  }, []);

  const updateToken = useCallback((id: string, updates: Partial<DesignToken>) => {
    setState(prev => ({
      ...prev,
      tokens: prev.tokens.map(token => 
        token.id === id 
          ? { 
              ...token, 
              ...updates, 
              lastModified: new Date(),
              version: token.version + 1 
            }
          : token
      )
    }));
  }, []);

  const deleteToken = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      tokens: prev.tokens.filter(token => token.id !== id)
    }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    updateState({ searchQuery });
  }, [updateState]);

  const setSelectedTypes = useCallback((selectedTypes: TokenType[]) => {
    updateState({ selectedTypes });
  }, [updateState]);

  const setSelectedCategories = useCallback((selectedCategories: TokenCategory[]) => {
    updateState({ selectedCategories });
  }, [updateState]);

  const setSortBy = useCallback((sortBy: UseDesignTokensState['sortBy']) => {
    updateState({ sortBy });
  }, [updateState]);

  const setSortOrder = useCallback((sortOrder: UseDesignTokensState['sortOrder']) => {
    updateState({ sortOrder });
  }, [updateState]);

  const clearFilters = useCallback(() => {
    updateState({
      searchQuery: '',
      selectedTypes: [],
      selectedCategories: []
    });
  }, [updateState]);

  const exportTokens = useCallback(() => {
    return [...state.tokens];
  }, [state.tokens]);

  const importTokens = useCallback((tokens: DesignToken[]) => {
    updateState({ tokens: [...tokens] });
  }, [updateState]);

  // Memoized filtered and sorted tokens
  const filteredTokens = useMemo(() => {
    let filtered = [...state.tokens];

    // Apply search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(token =>
        token.name.toLowerCase().includes(query) ||
        token.type.toLowerCase().includes(query) ||
        token.category.toLowerCase().includes(query) ||
        (token.description && token.description.toLowerCase().includes(query))
      );
    }

    // Apply type filter
    if (state.selectedTypes.length > 0) {
      filtered = filtered.filter(token => state.selectedTypes.includes(token.type));
    }

    // Apply category filter
    if (state.selectedCategories.length > 0) {
      filtered = filtered.filter(token => state.selectedCategories.includes(token.category));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (state.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'lastModified':
          comparison = new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
          break;
        default:
          comparison = 0;
      }

      return state.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [state.tokens, state.searchQuery, state.selectedTypes, state.selectedCategories, state.sortBy, state.sortOrder]);

  // Memoized token statistics
  const tokenStats = useMemo(() => {
    const byType = {} as Record<TokenType, number>;
    const byCategory = {} as Record<TokenCategory, number>;

    state.tokens.forEach(token => {
      byType[token.type] = (byType[token.type] || 0) + 1;
      byCategory[token.category] = (byCategory[token.category] || 0) + 1;
    });

    return {
      total: state.tokens.length,
      byType,
      byCategory
    };
  }, [state.tokens]);

  // Update filtered tokens when dependencies change
  useEffect(() => {
    updateState({ filteredTokens });
  }, [filteredTokens, updateState]);

  return {
    ...state,
    filteredTokens,
    tokenStats,
    extractFromFigma,
    addToken,
    updateToken,
    deleteToken,
    setSearchQuery,
    setSelectedTypes,
    setSelectedCategories,
    setSortBy,
    setSortOrder,
    clearFilters,
    exportTokens,
    importTokens
  };
}
