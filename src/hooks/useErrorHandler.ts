import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { parseError, getUserMessage, logError, type AppError } from '@/lib/client/errors';

/**
 * Hook for handling errors in components
 * Provides error state and helper functions
 */
export function useErrorHandler() {
  const [error, setError] = useState<AppError | null>(null);
  const [isError, setIsError] = useState(false);

  /**
   * Handle error with toast notification
   */
  const handleError = useCallback((err: unknown, context?: Record<string, unknown>) => {
    const appError = parseError(err);
    const userMessage = getUserMessage(appError);

    // Log error
    logError(appError, context);

    // Update state
    setError(appError);
    setIsError(true);

    // Show toast notification
    toast.error(userMessage);

    return appError;
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  /**
   * Handle error silently (no toast)
   */
  const handleErrorSilent = useCallback((err: unknown, context?: Record<string, unknown>) => {
    const appError = parseError(err);

    // Log error
    logError(appError, context);

    // Update state
    setError(appError);
    setIsError(true);

    return appError;
  }, []);

  return {
    error,
    isError,
    handleError,
    handleErrorSilent,
    clearError,
  };
}

/**
 * Hook for safe async operations with error handling
 */
export function useSafeAsync<T = unknown>() {
  const { handleError } = useErrorHandler();
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (asyncFn: () => Promise<T>, onSuccess?: (data: T) => void): Promise<T | null> => {
      setLoading(true);
      try {
        const result = await asyncFn();
        onSuccess?.(result);
        return result;
      } catch (err) {
        handleError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  return { execute, loading };
}
