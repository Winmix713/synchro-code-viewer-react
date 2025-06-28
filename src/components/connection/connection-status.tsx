
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Wifi, 
  WifiOff, 
  Clock,
  Activity,
  Zap
} from 'lucide-react';
import { FigmaConnectionStatus } from '../../types/figma-api';
import { cn } from '../../lib/utils';

interface ConnectionStatusProps {
  status: FigmaConnectionStatus;
  rateLimitStatus?: {
    remaining: number;
    reset: Date;
    queueLength: number;
  };
  onDisconnect?: () => void;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  status,
  rateLimitStatus,
  onDisconnect,
  className
}) => {
  const getStatusIcon = () => {
    if (status.isConnecting) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    
    if (status.isConnected) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = () => {
    if (status.isConnecting) return 'Connecting...';
    if (status.isConnected) return 'Connected';
    return 'Disconnected';
  };

  const getStatusColor = () => {
    if (status.isConnecting) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (status.isConnected) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getRateLimitColor = () => {
    if (!rateLimitStatus) return 'text-gray-500';
    
    const { remaining } = rateLimitStatus;
    if (remaining > 50) return 'text-green-600';
    if (remaining > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTimeRemaining = (resetTime: Date) => {
    const now = new Date();
    const diff = resetTime.getTime() - now.getTime();
    
    if (diff <= 0) return 'Now';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {status.isConnected ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-gray-400" />
              )}
              <div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <span className="font-medium text-sm">{getStatusText()}</span>
                  <Badge variant="secondary" className={getStatusColor()}>
                    Figma API
                  </Badge>
                </div>
                
                {status.isConnected && status.lastConnected && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3" />
                    <span>Connected {status.lastConnected.toLocaleTimeString()}</span>
                  </div>
                )}
                
                {status.error && (
                  <div className="text-xs text-red-600 mt-1">
                    Error: {status.error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {status.isConnected && onDisconnect && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDisconnect}
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              Disconnect
            </Button>
          )}
        </div>

        {/* Rate Limit Information */}
        {status.isConnected && rateLimitStatus && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Requests</div>
                  <div className={cn("font-medium", getRateLimitColor())}>
                    {rateLimitStatus.remaining}/100
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Reset</div>
                  <div className="font-medium">
                    {formatTimeRemaining(rateLimitStatus.reset)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-gray-600 dark:text-gray-400">Queue</div>
                  <div className="font-medium">
                    {rateLimitStatus.queueLength}
                  </div>
                </div>
              </div>
            </div>

            {/* Rate limit warning */}
            {rateLimitStatus.remaining < 20 && (
              <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <div className="flex items-center space-x-2 text-xs text-yellow-800 dark:text-yellow-200">
                  <Zap className="h-3 w-3" />
                  <span>
                    Rate limit approaching. Requests will be queued automatically.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
