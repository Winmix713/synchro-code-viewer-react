import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export interface ToastNotificationsProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  className?: string;
}

export const ToastNotifications: React.FC<ToastNotificationsProps> = ({
  position = 'bottom-right',
  className
}) => {
  return <Toaster />;
};

// Hook for easy toast usage throughout the app
export const useNotifications = () => {
  const { toast } = useToast();

  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'default',
    });
  };

  const showError = (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'destructive',
    });
  };

  const showInfo = (title: string, description?: string) => {
    toast({
      title,
      description,
    });
  };

  const showWarning = (title: string, description?: string) => {
    toast({
      title,
      description,
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    toast, // Raw toast function for custom usage
  };
};

export default ToastNotifications;