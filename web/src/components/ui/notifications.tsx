import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface NotificationOptions {
  duration?: number;
  className?: string;
}

const defaultOptions: NotificationOptions = {
  duration: 5000,
  className: 'font-cyber',
};

export const notifications = {
  success: (message: string, options?: NotificationOptions) => {
    toast.success(message, {
      ...defaultOptions,
      ...options,
      className: cn(
        'bg-otaku-purple/90 text-white border-none',
        options?.className
      ),
    });
  },

  error: (message: string, options?: NotificationOptions) => {
    toast.error(message, {
      ...defaultOptions,
      ...options,
      className: cn(
        'bg-red-500/90 text-white border-none',
        options?.className
      ),
    });
  },

  warning: (message: string, options?: NotificationOptions) => {
    toast.warning(message, {
      ...defaultOptions,
      ...options,
      className: cn(
        'bg-yellow-500/90 text-white border-none',
        options?.className
      ),
    });
  },

  info: (message: string, options?: NotificationOptions) => {
    toast.info(message, {
      ...defaultOptions,
      ...options,
      className: cn(
        'bg-otaku-blue/90 text-white border-none',
        options?.className
      ),
    });
  },

  promise: <T>(
    promise: Promise<T>,
    {
      loading = 'Loading...',
      success = 'Success!',
      error = 'Something went wrong',
    }: {
      loading?: string;
      success?: string;
      error?: string;
    } = {}
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
      className: 'font-cyber',
    });
  },
};

// Export a custom Toaster component with proper styling
export const Toaster = () => {
  return (
    <div
      className="fixed top-0 right-0 z-50 p-4"
      role="region"
      aria-label="Notifications"
    >
      <div className="space-y-4">
        {/* Toaster content will be rendered here by Sonner */}
      </div>
    </div>
  );
}; 