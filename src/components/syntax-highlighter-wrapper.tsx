
/**
 * Memoized syntax highlighter wrapper component
 * Optimized for performance with proper theme support
 */

import React, { memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SyntaxHighlighterProps } from '../types/code-preview';

const SyntaxHighlighterWrapper = memo<SyntaxHighlighterProps>(({
  language,
  children,
  showLineNumbers = true,
  theme,
  className = '',
}) => {
  const style = theme === 'dark' ? dark : tomorrow;

  return (
    <SyntaxHighlighter
      language={language}
      style={style}
      showLineNumbers={showLineNumbers}
      className={`rounded-md text-sm leading-relaxed ${className}`}
      customStyle={{
        margin: 0,
        background: 'transparent',
        fontSize: '0.875rem',
        lineHeight: '1.5',
      }}
      codeTagProps={{
        style: {
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        },
      }}
      lineNumberStyle={{
        minWidth: '3em',
        paddingRight: '1em',
        color: theme === 'dark' ? '#6b7280' : '#9ca3af',
        fontSize: '0.75rem',
        userSelect: 'none',
      }}
      wrapLines={true}
      wrapLongLines={true}
    >
      {children}
    </SyntaxHighlighter>
  );
});

SyntaxHighlighterWrapper.displayName = 'SyntaxHighlighterWrapper';

export { SyntaxHighlighterWrapper };
