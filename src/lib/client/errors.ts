/**
 * Centralized Error Handling Utilities
 * Provides consistent error handling across the application
 */

import type { AxiosError } from 'axios';
import type { IApiErrorResponse } from '@/types/api';

/**
 * Custom Application Error Classes
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTHENTICATION_ERROR', 401);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 'AUTHORIZATION_ERROR', 403);
    this.name = 'AuthorizationError';
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND_ERROR', 404);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Error Parser - Convert various error types to AppError
 */
export function parseError(error: unknown): AppError {
  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }

  // Axios Error
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<IApiErrorResponse>;
    const response = axiosError.response;
    const data = response?.data;

    // Map HTTP status codes to specific error types
    switch (response?.status) {
      case 401:
        return new AuthenticationError(data?.error || 'Authentication failed');
      case 403:
        return new AuthorizationError(data?.error || 'Access denied');
      case 404:
        return new NotFoundError(data?.error || 'Resource');
      case 400:
        return new ValidationError(data?.error || 'Validation failed', data?.detail);
      default:
        return new AppError(data?.error || axiosError.message || 'Request failed', 'API_ERROR', response?.status || 500, data?.detail);
    }
  }

  // Standard Error
  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', 500);
  }

  // Unknown error type
  return new AppError(typeof error === 'string' ? error : 'An unexpected error occurred', 'UNKNOWN_ERROR', 500);
}

/**
 * Type guard for Axios errors
 */
function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error && (error as AxiosError).isAxiosError === true;
}

/**
 * Get user-friendly error message
 */
export function getUserMessage(error: unknown): string {
  const appError = parseError(error);

  // Map error codes to user-friendly messages
  const messageMap: Record<string, string> = {
    AUTHENTICATION_ERROR: 'ログインセッションが期限切れです。再度ログインしてください。',
    AUTHORIZATION_ERROR: 'この操作を実行する権限がありません。',
    NOT_FOUND_ERROR: 'リクエストされたデータが見つかりませんでした。',
    NETWORK_ERROR: 'ネットワークエラーが発生しました。接続を確認してください。',
    VALIDATION_ERROR: '入力内容を確認してください。',
  };

  return messageMap[appError.code || ''] || appError.message || '予期しないエラーが発生しました。';
}

/**
 * Log error to console in development, send to logging service in production
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const appError = parseError(error);

  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', {
      name: appError.name,
      message: appError.message,
      code: appError.code,
      statusCode: appError.statusCode,
      details: appError.details,
      context,
      stack: appError.stack,
    });
  } else {
    // TODO: Send to logging service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(appError, { extra: context });

    // For now, log minimal info
    console.error('[Error]', {
      name: appError.name,
      message: appError.message,
      code: appError.code,
      context,
    });
  }
}

/**
 * Check if error should trigger a retry
 */
export function isRetryableError(error: unknown): boolean {
  const appError = parseError(error);

  // Retry on network errors and 5xx server errors
  return appError instanceof NetworkError || (appError.statusCode !== undefined && appError.statusCode >= 500);
}

/**
 * Extract validation errors from error details
 */
export function getValidationErrors(error: unknown): Record<string, string> | null {
  const appError = parseError(error);

  if (!(appError instanceof ValidationError)) {
    return null;
  }

  const details = appError.details;

  if (Array.isArray(details)) {
    // Convert array of error details to field -> message map
    return details.reduce(
      (acc, detail) => {
        if (detail && typeof detail === 'object' && 'loc' in detail && 'msg' in detail) {
          const field = Array.isArray(detail.loc) ? detail.loc.join('.') : String(detail.loc);
          acc[field] = String(detail.msg);
        }
        return acc;
      },
      {} as Record<string, string>
    );
  }

  return null;
}
