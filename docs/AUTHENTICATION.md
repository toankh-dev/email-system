# Authentication Guide

## Overview

This application uses **httpOnly cookie-based authentication** for secure token storage and management. This approach is more secure than localStorage-based authentication as it prevents XSS attacks from stealing authentication tokens.

## Architecture

### Authentication Flow

```
┌─────────────┐      1. Login      ┌──────────────┐
│   Client    │ ──────────────────> │   Next.js    │
│  (Browser)  │                     │  API Route   │
└─────────────┘                     └──────────────┘
                                           │
                                           │ 2. Authenticate
                                           ▼
                                    ┌──────────────┐
                                    │   Backend    │
                                    │    Server    │
                                    └──────────────┘
                                           │
                                           │ 3. Return token
                                           ▼
                                    ┌──────────────┐
                                    │  Set Cookie  │
                                    │  (httpOnly)  │
                                    └──────────────┘
                                           │
                                           │ 4. Cookie set
                                           ▼
┌─────────────┐   Auto-send cookie  ┌──────────────┐
│   Client    │ <──────────────────> │   Requests   │
│  (Browser)  │    on all requests   │              │
└─────────────┘                     └──────────────┘
```

### Key Components

1. **Login Route** ([src/app/api/auth/login/route.ts](../src/app/api/auth/login/route.ts))
   - Authenticates user with backend
   - Sets httpOnly cookie with token
   - Returns user information (NOT the token)

2. **Logout Route** ([src/app/api/auth/logout/route.ts](../src/app/api/auth/logout/route.ts))
   - Deletes the httpOnly cookie
   - Client redirects to login page

3. **Middleware** ([src/middleware.ts](../src/middleware.ts))
   - Reads token from cookies
   - Redirects unauthenticated users to login
   - Redirects authenticated users away from login page

4. **API Proxy Utilities** ([src/lib/api-proxy.ts](../src/lib/api-proxy.ts))
   - Helper functions for API routes
   - Automatically forwards token from cookies to backend
   - Simplifies API route implementation

5. **Auth Store** ([src/stores/authStore.ts](../src/stores/authStore.ts))
   - Stores user information only (NOT the token)
   - Persisted to localStorage safely
   - Token remains in httpOnly cookie

6. **Axios Configuration** ([src/lib/axios.ts](../src/lib/axios.ts))
   - Configured with `withCredentials: true`
   - Automatically sends cookies with requests
   - No manual Authorization header needed

## Security Features

### 1. httpOnly Cookies

```typescript
cookieStore.set('token', token, {
  httpOnly: true, // ✅ Cannot be accessed by JavaScript
  secure: true, // ✅ HTTPS only in production
  sameSite: 'lax', // ✅ CSRF protection
  maxAge: 60 * 60 * 24, // ✅ 24 hours expiration
});
```

**Benefits:**

- ✅ Immune to XSS attacks (JavaScript cannot read the cookie)
- ✅ Automatic expiration
- ✅ CSRF protection with SameSite attribute
- ✅ Secure transmission (HTTPS only in production)

### 2. No Token in Client-Side Storage

**What we DON'T do (insecure):**

```typescript
// ❌ INSECURE - Don't do this
localStorage.setItem('token', token);
sessionStorage.setItem('token', token);
```

**What we DO (secure):**

```typescript
// ✅ SECURE - Token stays in httpOnly cookie
// Only user info is stored client-side
authStore.setUser({ id: 1, name: 'John', email: 'john@example.com' });
```

### 3. Automatic Token Forwarding

API routes automatically forward the token from cookies to the backend:

```typescript
// src/app/api/some-route/route.ts
import { proxyPost } from '@/lib/client';

export async function POST(request: Request) {
  const body = await request.json();

  // Token is automatically read from cookies and added to headers
  const resp = await proxyPost('/backend-endpoint', body);

  return NextResponse.json(await resp.json());
}
```

## Implementation Guide

### Login Implementation

```typescript
// src/app/api/auth/login/route.ts
import { cookies } from 'next/headers';
import { successResponse, errorResponse } from '@/lib/client';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // 1. Authenticate with backend
  const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    return errorResponse('Invalid credentials', 401);
  }

  const { token, user } = await response.json();

  // 2. Set httpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  // 3. Return user info (NOT token)
  return successResponse({ message: 'Logged in successfully', user });
}
```

### Logout Implementation

```typescript
// src/app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('token');

  return NextResponse.json({ message: 'Logged out' });
}
```

### Client-Side Usage

```typescript
// Login
async function handleLogin(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include', // Important: send cookies
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const { user } = await response.json();
    authStore.setUser(user);
    router.push('/dashboard');
  }
}

// Logout
async function handleLogout() {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include', // Important: send cookies
  });

  authStore.clearAuth();
  router.push('/login');
}
```

### Using API Proxy Helpers

```typescript
// src/app/api/tickets/route.ts
import { proxyGet, errorResponse, successResponse, parseJSONResponse, handleApiError } from '@/lib/client';

export async function GET(request: Request) {
  try {
    // Automatically includes token from cookie in Authorization header
    const resp = await proxyGet('/tickets');
    const data = await parseJSONResponse(resp);

    if (!resp.ok) {
      return errorResponse(data?.error || 'Failed to fetch tickets', resp.status);
    }

    return successResponse(data);
  } catch (error) {
    return handleApiError(error);
  }
}
```

Available helper functions:

- `proxyGet(endpoint, headers?)` - GET request with auth
- `proxyPost(endpoint, body?, headers?)` - POST request with auth
- `proxyPut(endpoint, body?, headers?)` - PUT request with auth
- `proxyDelete(endpoint, headers?)` - DELETE request with auth
- `getAuthHeaders(headers?)` - Get headers with Authorization

## Middleware Configuration

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Redirect to login if not authenticated
  if (!token && request.nextUrl.pathname !== '/login') {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect away from login if authenticated
  if (token && request.nextUrl.pathname === '/login') {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

## Axios Configuration

```typescript
// src/lib/axios.ts
import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ✅ Automatically send cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// No need for request interceptor to add Authorization header
// Cookies are sent automatically with withCredentials: true
```

## Auth Store (Zustand)

```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,

      setUser: user =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      // Only persist user info, NOT the token
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

## Migration from localStorage

If you're migrating from localStorage-based auth:

### Before (Insecure)

```typescript
// ❌ Old approach - INSECURE
localStorage.setItem('token', token);
const token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### After (Secure)

```typescript
// ✅ New approach - SECURE
// 1. Login sets httpOnly cookie automatically
const response = await fetch('/api/auth/login', {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify({ email, password }),
});

// 2. Token is now in httpOnly cookie, inaccessible to JavaScript
// 3. All requests automatically include the cookie
const data = await fetch('/api/tickets', {
  credentials: 'include', // Axios does this automatically with withCredentials
});
```

## Troubleshooting

### Issue: Cookies not being sent

**Solution:** Ensure `credentials: 'include'` is set:

```typescript
// For fetch
fetch('/api/endpoint', {
  credentials: 'include',
});

// For axios
axios.create({
  withCredentials: true,
});
```

### Issue: CORS errors

**Solution:** Configure CORS on backend to allow credentials:

```typescript
// Express.js example
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
```

### Issue: Cookie not being set

**Solution:** Check these requirements:

1. ✅ Using HTTPS in production (or localhost in development)
2. ✅ `secure: true` only in production
3. ✅ Correct `sameSite` attribute
4. ✅ Cookie name matches between set and get

### Issue: 401 Unauthorized after login

**Solution:** Verify:

1. ✅ Cookie is being set (check browser DevTools → Application → Cookies)
2. ✅ Cookie is being sent with requests (check Network → Headers → Cookie)
3. ✅ API routes are using `proxyGet`/`proxyPost` helpers
4. ✅ Backend is correctly validating the token

## Best Practices

1. ✅ **Never expose tokens to client-side JavaScript**
   - Use httpOnly cookies only
   - Never send tokens in response bodies to the client

2. ✅ **Always use HTTPS in production**
   - Set `secure: true` for cookies
   - Prevents man-in-the-middle attacks

3. ✅ **Set appropriate cookie expiration**
   - Match your session timeout requirements
   - Consider refresh token rotation for long sessions

4. ✅ **Use SameSite attribute**
   - Prevents CSRF attacks
   - Use 'lax' for most applications
   - Use 'strict' for highly sensitive applications

5. ✅ **Validate tokens on every request**
   - Don't trust client-side authentication state
   - Always verify on the server

6. ✅ **Clear cookies on logout**
   - Explicitly delete the cookie
   - Don't rely on client-side state only

7. ✅ **Use proxy helpers for consistency**
   - Centralizes authentication logic
   - Reduces code duplication
   - Easier to maintain

## References

- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [OWASP: Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Next.js: Cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [Security Documentation](./SECURITY.md)
- [Error Handling Documentation](./ERROR_HANDLING.md)
