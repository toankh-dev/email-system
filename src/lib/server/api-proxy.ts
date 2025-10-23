/**
 * API Proxy Utilities
 *
 * Helper functions for Next.js API routes that proxy requests to the backend.
 * Automatically forwards authentication token from httpOnly cookies to backend.
 */

import { cookies } from 'next/headers';

/**
 * Creates authenticated headers for backend API requests
 * Reads token from httpOnly cookie and adds Authorization header
 */
export async function getAuthHeaders(additionalHeaders?: Record<string, string>): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  // Forward authentication token to backend if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Proxy GET request to backend with authentication
 *
 * @param endpoint - Backend endpoint URL (without BACKEND_URL)
 * @param additionalHeaders - Optional additional headers
 * @returns Response from backend
 *
 * @example
 * ```ts
 * export async function GET() {
 *   return proxyGet('/api/tickets');
 * }
 * ```
 */
export async function proxyGet(endpoint: string, additionalHeaders?: Record<string, string>): Promise<Response> {
  const headers = await getAuthHeaders(additionalHeaders);

  return fetch(`${process.env.BACKEND_URL}${endpoint}`, {
    method: 'GET',
    headers,
  });
}

/**
 * Proxy POST request to backend with authentication
 *
 * @param endpoint - Backend endpoint URL (without BACKEND_URL)
 * @param body - Request body (will be JSON stringified)
 * @param additionalHeaders - Optional additional headers
 * @returns Response from backend
 *
 * @example
 * ```ts
 * export async function POST(request: Request) {
 *   const body = await request.json();
 *   return proxyPost('/api/tickets', body);
 * }
 * ```
 */
export async function proxyPost(endpoint: string, body?: unknown, additionalHeaders?: Record<string, string>): Promise<Response> {
  const headers = await getAuthHeaders(additionalHeaders);

  return fetch(`${process.env.BACKEND_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Proxy PUT request to backend with authentication
 */
export async function proxyPut(endpoint: string, body?: unknown, additionalHeaders?: Record<string, string>): Promise<Response> {
  const headers = await getAuthHeaders(additionalHeaders);

  return fetch(`${process.env.BACKEND_URL}${endpoint}`, {
    method: 'PUT',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Proxy DELETE request to backend with authentication
 */
export async function proxyDelete(endpoint: string, additionalHeaders?: Record<string, string>): Promise<Response> {
  const headers = await getAuthHeaders(additionalHeaders);

  return fetch(`${process.env.BACKEND_URL}${endpoint}`, {
    method: 'DELETE',
    headers,
  });
}
