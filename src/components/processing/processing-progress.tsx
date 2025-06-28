
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap,
  FileText,
  Download,
  X
} from 'lucide-react';
import { FigmaProcessingStatus } from '../../types/figma-api';
import { cn } from '../../lib/utils';

interface ProcessingProgressProps {
  status: FigmaProcessingStatus;
  onCancel?: () => void;
  className?: string;
}

export const ProcessingProgress: React.FC<ProcessingProgressProps> = ({
  status,
  onCancel,
  className
}) => {
  const getStageIcon = () => {
    switch (status.stage) {
      case 'connecting':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'fetching':
        return <Download className="h-4 w-4 text-blue-500" />;
      case 'parsing':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
  };

  const getStageTitle = () => {
    switch (status.stage) {
      case 'connecting': return 'Connecting to Figma';
      case 'fetching': return 'Fetching File Data';
      case 'parsing': return 'Processing Content';
      case 'complete': return 'Processing Complete';
      case 'error': return 'Processing Failed';
      default: return 'Processing...';
    }
  };

  const formatElapsedTime = () => {
    if (!status.startTime) return null;
    
    const elapsed = Date.now() - status.startTime.getTime();
    const seconds = Math.floor(elapsed / 1000);
    
    if (seconds < 60) {
      return `${seconds}s`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatEstimatedTime = () => {
    if (!status.estimatedTimeRemaining) return null;
    
    const seconds = Math.floor(status.estimatedTimeRemaining / 1000);
    
    if (seconds < 60) {
      return `~${seconds}s remaining`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `~${minutes}m ${remainingSeconds}s remaining`;
  };

  const isActive = status.isProcessing && status.stage !== 'complete' && status.stage !== 'error';

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStageIcon()}
            <CardTitle className="text-lg">{getStageTitle()}</CardTitle>
          </div>
          
          {isActive && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {status.message}
            </span>
            <span className="font-medium">
              {Math.round(status.progress)}%
            </span>
          </div>
          
          <div className="relative">
            <Progress 
              value={status.progress} 
              className="h-2"
            />
            {/* Custom progress color overlay */}
            <div 
              className={cn(
                "absolute top-0 left-0 h-2 rounded-full transition-all",
                status.stage === 'complete' && "bg-green-500",
                status.stage === 'error' && "bg-red-500",
                !['complete', 'error'].includes(status.stage) && "bg-blue-500"
              )}
              style={{ width: `${status.progress}%` }}
            />
          </div>
        </div>

        {/* Status Details */}
        {(status.startTime || status.estimatedTimeRemaining) && (
          <div className="flex items-center justify-between text-sm text-gray-500">
            {status.startTime && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Elapsed: {formatElapsedTime()}</span>
              </div>
            )}
            
            {status.estimatedTimeRemaining && (
              <div>{formatEstimatedTime()}</div>
            )}
          </div>
        )}

        {/* Stage Indicators */}
        <div className="flex items-center space-x-4 text-xs">
          {[
            { stage: 'connecting', label: 'Connect' },
            { stage: 'fetching', label: 'Fetch' },
            { stage: 'parsing', label: 'Parse' },
            { stage: 'complete', label: 'Done' }
          ].map((item, index) => {
            const isCurrentStage = status.stage === item.stage;
            const isPastStage = ['connecting', 'fetching', 'parsing', 'complete'].indexOf(status.stage) > index;
            const isCompleted = isPastStage || (isCurrentStage && status.stage === 'complete');
            
            return (
              <div
                key={item.stage}
                className={cn(
                  "flex items-center space-x-1 px-2 py-1 rounded-full",
                  isCompleted && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                  isCurrentStage && !isCompleted && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                  !isCurrentStage && !isCompleted && "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="h-3 w-3" />
                ) : isCurrentStage ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <div className="h-3 w-3 rounded-full border-2 border-current" />
                )}
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* Error Details */}
        {status.stage === 'error' && (
          <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
            <div className="flex items-start space-x-2 text-sm text-red-800 dark:text-red-200">
              <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Processing failed</div>
                <div className="mt-1">{status.message}</div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {status.stage === 'complete' && (
          <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
            <div className="flex items-center space-x-2 text-sm text-green-800 dark:text-green-200">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">{status.message}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
