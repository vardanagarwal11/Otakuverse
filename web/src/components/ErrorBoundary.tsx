import React from 'react';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Here you could send the error to your error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
              <Button
                variant="default"
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 