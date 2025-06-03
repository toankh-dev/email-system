'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '@/lib/client/errors';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches React errors and displays fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error
    logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: 'ErrorBoundary',
    });

    // Update state
    this.setState({
      errorInfo,
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: Props): void {
    const { resetKeys } = this.props;
    const { hasError } = this.state;

    // Reset error state if reset keys changed
    if (hasError && resetKeys) {
      const prevResetKeys = prevProps.resetKeys;
      if (!prevResetKeys || resetKeys.some((key, i) => key !== prevResetKeys[i])) {
        this.resetErrorBoundary();
      }
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      return <DefaultErrorFallback error={error} errorInfo={errorInfo} onReset={this.resetErrorBoundary} />;
    }

    return children;
  }
}

/**
 * Default Error Fallback UI
 */
interface DefaultErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
}

function DefaultErrorFallback({ error, errorInfo, onReset }: DefaultErrorFallbackProps): React.ReactElement {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <div className="flex items-center gap-4 text-red-600">
          <AlertTriangle className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-bold">エラーが発生しました</h1>
            <p className="text-gray-600">予期しないエラーが発生しました。</p>
          </div>
        </div>

        {isDevelopment && error && (
          <div className="mt-6 rounded border border-red-200 bg-red-50 p-4">
            <h2 className="mb-2 font-semibold text-red-800">Error Details (Development Only)</h2>
            <pre className="overflow-auto text-sm text-red-700">
              <code>{error.toString()}</code>
            </pre>
            {errorInfo && (
              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-red-800">Component Stack</summary>
                <pre className="mt-2 overflow-auto text-xs text-red-600">
                  <code>{errorInfo.componentStack}</code>
                </pre>
              </details>
            )}
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <Button onClick={onReset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            再試行
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            ホームに戻る
          </Button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>問題が解決しない場合は、サポートチームにお問い合わせください。</p>
        </div>
      </div>
    </div>
  );
}

/**
 * HOC for wrapping components with Error Boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
): React.ComponentType<P> {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
