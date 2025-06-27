
/**
 * Error Boundary component for graceful error handling
 * Provides fallback UI and error logging
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorBoundaryState } from '../types/code-preview';
import { CODE_PREVIEW_CONSTANTS } from '../constants/code-preview';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class CodePreviewErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CodePreview Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      errorInfo: {
        componentStack: errorInfo.componentStack,
        errorBoundary: 'CodePreviewErrorBoundary',
      },
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="text-center max-w-md">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Something went wrong
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-4">
              {this.state.error?.message || CODE_PREVIEW_CONSTANTS.ERROR_MESSAGES.GENERIC_ERROR}
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              aria-label="Retry loading code preview"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-red-700 dark:text-red-300">
                  Show Error Details
                </summary>
                <pre className="mt-2 text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 p-2 rounded overflow-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
