import React from 'react';
import { Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingStatesProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingStates: React.FC<LoadingStatesProps> = ({
  type = 'spinner',
  size = 'md',
  className,
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const renderSpinner = () => (
    <div className={cn('flex items-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && (
        <span className={cn('text-muted-foreground', textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  );

  const renderDots = () => (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'bg-primary rounded-full animate-pulse',
              size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
      {text && (
        <span className={cn('text-muted-foreground', textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  );

  const renderPulse = () => (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        'bg-primary rounded-full animate-pulse',
        sizeClasses[size]
      )} />
      {text && (
        <span className={cn('text-muted-foreground', textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  );

  const renderSkeleton = () => (
    <div className={cn('animate-pulse', className)}>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
    </div>
  );

  switch (type) {
    case 'dots':
      return renderDots();
    case 'pulse':
      return renderPulse();
    case 'skeleton':
      return renderSkeleton();
    default:
      return renderSpinner();
  }
};

// Status indicators for different states
export interface StatusIndicatorProps {
  status: 'loading' | 'success' | 'error' | 'pending';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  className,
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className={cn('animate-spin text-blue-500', sizeClasses[size])} />;
      case 'success':
        return <CheckCircle className={cn('text-green-500', sizeClasses[size])} />;
      case 'error':
        return <AlertCircle className={cn('text-red-500', sizeClasses[size])} />;
      case 'pending':
        return <Clock className={cn('text-yellow-500', sizeClasses[size])} />;
      default:
        return null;
    }
  };

  const getTextColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {getIcon()}
      {text && (
        <span className={cn('text-sm font-medium', getTextColor())}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingStates;