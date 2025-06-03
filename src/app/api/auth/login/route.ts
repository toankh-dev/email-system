import { cookies } from 'next/headers';
import { errorResponse, successResponse } from '@/lib/client/response';

/**
 * Login API Route
 * Handles user authentication and sets httpOnly cookie for security
 *
 * Security Features:
 * - Token stored in httpOnly cookie (NOT localStorage)
 * - Secure flag in production
 * - SameSite=lax for CSRF protection
 * - 24-hour expiration
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate inputs
    if (!email || !password) {
      return errorResponse('Email and password are required', 400);
    }

    // TODO: Replace with actual backend call
    // const resp = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // });
    // const data = await parseJSONResponse(resp);

    // TEMPORARY: Mock response for development
    // TODO: Remove this mock and uncomment backend call above
    const resp = {
      ok: true,
      status: 200,
    };
    const data = {
      token: process.env.DEV_MOCK_TOKEN || 'dev_token_replace_with_backend',
      user: {
        id: 1,
        email,
        name: 'Demo User',
      },
    };

    if (!resp.ok) {
      return errorResponse('error' in data ? (data.error as string) : 'Invalid credentials', resp.status || 401);
    }

    const { token, user } = data;

    // Set httpOnly cookie for security
    const cookieStore = await cookies();

    cookieStore.set('token', token, {
      httpOnly: true, // Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax', // CSRF protection
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return successResponse({
      message: 'Logged in successfully',
      user,
    });
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : 'Login failed', 500);
  }
}
