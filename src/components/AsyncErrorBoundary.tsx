'use client';

import React, { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  onRetry?: () => void;
  resetKeys?: Array<string | number>;
}

/**
 * Error Boundary for async operations (data fetching, etc.)
 * Provides a retry button for failed async operations
 */
export function AsyncErrorBoundary({ children, onRetry, resetKeys }: AsyncErrorBoundaryProps): React.ReactElement {
  return (
    <ErrorBoundary
      resetKeys={resetKeys}
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="max-w-md text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
            <h2 className="mb-2 text-xl font-semibold text-gray-900">データの読み込みに失敗しました</h2>
            <p className="mb-6 text-gray-600">データの取得中にエラーが発生しました。再度お試しください。</p>
            <Button
              onClick={() => {
                onRetry?.();
                window.location.reload();
              }}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              再読み込み
            </Button>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
