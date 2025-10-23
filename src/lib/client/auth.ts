/**
 * Authentication Utilities
 *
 * IMPORTANT: Authentication is now handled via httpOnly cookies.
 * Tokens are stored server-side in cookies and automatically sent with requests.
 *
 * For security reasons:
 * - ✅ Tokens are stored in httpOnly cookies (not localStorage)
 * - ✅ Cookies are automatically sent with every request
 * - ✅ XSS attacks cannot access the token
 * - ✅ CSRF protection via SameSite=lax
 *
 * See: src/app/api/auth/login/route.ts for login implementation
 */

/**
 * Logout user by clearing the httpOnly cookie
 * This calls the logout API endpoint which clears the cookie server-side
 *
 * @example
 * await logout();
 * // User is logged out, cookie is cleared
 * // Redirect happens automatically on next API call (401)
 */
export async function logout(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // Important: send cookies
    });

    // Redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
    // Still redirect even if API call fails
    window.location.href = '/login';
  }
}

/**
 * Check if user is authenticated
 * Note: This only checks if we're on a protected route
 * Actual authentication is verified server-side via cookie
 *
 * @returns true if on a page that's not the login page
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.pathname !== '/login';
}
