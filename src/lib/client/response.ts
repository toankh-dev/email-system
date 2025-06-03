import { NextResponse } from 'next/server';
import type { IApiErrorResponse } from '@/types/api';

/**
 * Safely parse JSON response
 */
export async function parseJSONResponse<T = unknown>(resp: Response): Promise<T | null> {
  try {
    return await resp.json();
  } catch {
    return null;
  }
}

/**
 * Create standardized error response
 */
export function errorResponse(message: string, status = 500, detail?: unknown): NextResponse<IApiErrorResponse> {
  const response: IApiErrorResponse = {
    success: false,
    error: message,
  };

  if (detail) {
    response.detail = detail as IApiErrorResponse['detail'];
  }

  return NextResponse.json(response, { status });
}

/**
 * Create standardized success response
 */
export function successResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Handle API route errors consistently
 */
export function handleApiError(error: unknown): NextResponse<IApiErrorResponse> {
  // Handle different error types
  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
      return errorResponse('Backend service unavailable', 503);
    }

    if (error.message.includes('timeout')) {
      return errorResponse('Request timeout', 504);
    }

    return errorResponse(error.message, 500);
  }

  return errorResponse('An unexpected error occurred', 500);
}

/**
 * Wrapper for API route handlers with automatic error handling
 */
export function withErrorHandler<T>(handler: () => Promise<NextResponse<T>>): Promise<NextResponse<T | IApiErrorResponse>> {
  return handler().catch((error: unknown) => {
    console.error('[API Error]', error);
    return handleApiError(error);
  });
}
