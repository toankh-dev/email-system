# Security Guide

This document describes the security measures and best practices implemented in the Email System Frontend.

## 📋 Table of Contents

- [Overview](#overview)
- [XSS Protection](#xss-protection)
- [Authentication & Authorization](#authentication--authorization)
- [CSRF Protection](#csrf-protection)
- [Security Headers](#security-headers)
- [Input Validation](#input-validation)
- [Sensitive Data Protection](#sensitive-data-protection)
- [Security Utilities](#security-utilities)
- [Best Practices](#best-practices)
- [Security Checklist](#security-checklist)

> **📖 For detailed authentication implementation guide, see [AUTHENTICATION.md](./AUTHENTICATION.md)**

---

## Overview

The Email System implements **defense-in-depth** security with multiple layers of protection:

✅ **XSS Protection** - HTML sanitization with DOMPurify
✅ **CSRF Protection** - SameSite cookies + token validation
✅ **Secure Authentication** - httpOnly cookies instead of localStorage
✅ **Security Headers** - CSP, X-Frame-Options, etc.
✅ **Input Validation** - Client and server-side validation
✅ **Secure Communication** - HTTPS in production

---

## XSS Protection

### Problem

Cross-Site Scripting (XSS) attacks occur when untrusted data is rendered as HTML without sanitization.

### Solution

**1. HTML Sanitization**

All HTML content from emails is sanitized before rendering:

```typescript
import { sanitizeEmailHtml } from '@/lib/client/security';

// Sanitize email HTML content
const sanitizedMessages = useMemo(() => {
  return messages.map((message) => ({
    ...message,
    bodyHtml: sanitizeEmailHtml(message.bodyHtml || ''),
  }));
}, [messages]);

// Safe to render
<div dangerouslySetInnerHTML={{ __html: sanitizedMessage.bodyHtml }} />
```

**2. Available Sanitization Functions**

```typescript
import {
  sanitizeHtml, // General HTML sanitization
  sanitizeEmailHtml, // Email-specific sanitization
  sanitizeText, // Strip all HTML tags
  sanitizeUrl, // Validate and clean URLs
  escapeHtml, // Escape HTML special characters
} from '@/lib/client/security';
```

**3. Allowed Tags for Email HTML**

The sanitizer allows these safe tags:

- Text: `p`, `br`, `strong`, `em`, `u`, `h1-h6`
- Lists: `ul`, `ol`, `li`
- Links: `a` (with safe href validation)
- Images: `img` (with safe src validation)
- Tables: `table`, `tr`, `td`, `th`
- Formatting: `div`, `span`, `code`, `pre`

**Forbidden Tags:**

- `<script>` - Prevents JavaScript execution
- `<iframe>` - Prevents embedding
- `<object>`, `<embed>` - Prevents plugin execution
- Event handlers: `onclick`, `onerror`, etc.

---

## Authentication & Authorization

### Secure Token Storage

**❌ OLD (Insecure):**

```typescript
// INSECURE: Vulnerable to XSS attacks
localStorage.setItem('token', token);
```

**✅ NEW (Secure):**

```typescript
// SECURE: httpOnly cookie cannot be accessed by JavaScript
cookieStore.set('token', token, {
  httpOnly: true, // Cannot be accessed by JavaScript
  secure: true, // HTTPS only in production
  sameSite: 'lax', // CSRF protection
  path: '/',
  maxAge: 60 * 60 * 24, // 24 hours
});
```

### Login Flow (Secure)

```typescript
// src/app/api/auth/login/route.ts
export async function POST(request: Request) {
  const { email, password } = await request.json();

  // 1. Validate inputs
  if (!email || !password) {
    return errorResponse('Email and password are required', 400);
  }

  // 2. Authenticate with backend
  const resp = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  // 3. Set httpOnly cookie
  const { token } = await resp.json();
  const cookieStore = await cookies();

  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
  });

  return successResponse({ message: 'Logged in successfully' });
}
```

### Automatic Token Handling

With httpOnly cookies, tokens are automatically:

- ✅ Sent with every request (via `withCredentials: true`)
- ✅ Protected from XSS (cannot be read by JavaScript)
- ✅ Protected from CSRF (SameSite=lax)
- ✅ Encrypted in transit (HTTPS)

```typescript
// src/lib/axios.ts
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Send cookies automatically
});
```

### Logout Flow

```typescript
// src/app/api/auth/logout/route.ts
export async function POST() {
  const cookieStore = await cookies();

  // Clear the httpOnly cookie
  cookieStore.delete('token');

  return successResponse({ message: 'Logged out successfully' });
}
```

---

## CSRF Protection

### What is CSRF?

Cross-Site Request Forgery tricks a user's browser into making unwanted requests to a site where they're authenticated.

### Protection Layers

**1. SameSite Cookies**

```typescript
cookieStore.set('token', token, {
  sameSite: 'lax', // Cookies only sent for same-site requests
});
```

**2. Origin Validation**

The backend should validate the `Origin` header:

```typescript
// Backend example (not in this repo)
const origin = request.headers.get('origin');
const allowedOrigins = [process.env.FRONTEND_URL];

if (!allowedOrigins.includes(origin)) {
  return new Response('Invalid origin', { status: 403 });
}
```

**3. CSRF Token (Optional)**

For state-changing operations, implement CSRF token validation:

```typescript
import { generateSecureToken } from '@/lib/client/security';

// Generate CSRF token
const csrfToken = generateSecureToken();

// Include in form
<input type="hidden" name="csrf_token" value={csrfToken} />
```

---

## Security Headers

Security headers are added via middleware:

```typescript
// src/middleware.security.ts
import { addSecurityHeaders } from './middleware.security';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}
```

### Headers Added

**1. Content-Security-Policy (CSP)**

```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
connect-src 'self' ${API_URL};
frame-src 'none';
object-src 'none';
```

**2. X-Frame-Options**

```
X-Frame-Options: DENY
```

Prevents clickjacking attacks.

**3. X-Content-Type-Options**

```
X-Content-Type-Options: nosniff
```

Prevents MIME type sniffing.

**4. Strict-Transport-Security (HSTS)**

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Forces HTTPS connections (production only).

**5. Referrer-Policy**

```
Referrer-Policy: strict-origin-when-cross-origin
```

Controls referrer information leakage.

**6. Permissions-Policy**

```
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Disables unnecessary browser features.

---

## Input Validation

### Client-Side Validation

```typescript
import { isValidEmail, validatePassword } from '@/lib/client/security';

// Email validation
if (!isValidEmail(email)) {
  setError('Invalid email format');
}

// Password validation
const { isValid, errors } = validatePassword(password);
if (!isValid) {
  setErrors(errors);
}
```

### Server-Side Validation

```typescript
// API route example
export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Validate inputs
  if (!email || !isValidEmail(email)) {
    return errorResponse('Invalid email', 400);
  }

  if (!password || password.length < 8) {
    return errorResponse('Password too short', 400);
  }

  // Continue...
}
```

### Sanitize User Input

```typescript
import { sanitizeText, sanitizeObject } from '@/lib/client/security';

// Sanitize single value
const cleanName = sanitizeText(userInput);

// Sanitize entire object
const cleanData = sanitizeObject(formData);
```

---

## Sensitive Data Protection

### Environment Variables

**Never commit these to git:**

```bash
# .env.local (gitignored)
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DEV_MOCK_TOKEN=dev_token_for_testing_only
```

**Use different values per environment:**

```bash
# .env.production
BACKEND_URL=https://api.production.com
NEXT_PUBLIC_API_URL=https://app.production.com/api
```

### Secrets Management

**DO:**

- ✅ Use environment variables
- ✅ Use `.env.local` for local development
- ✅ Use CI/CD secrets for production
- ✅ Rotate tokens regularly

**DON'T:**

- ❌ Hardcode tokens in source code
- ❌ Commit `.env` files to git
- ❌ Log sensitive data
- ❌ Expose tokens in URLs

---

## Security Utilities

### Location

`src/lib/security.ts`

### Functions

**HTML Sanitization:**

```typescript
sanitizeHtml(html: string, options?: SanitizeOptions): string
sanitizeEmailHtml(html: string): string
sanitizeText(input: string): string
```

**URL Validation:**

```typescript
sanitizeUrl(url: string): string
// Blocks: javascript:, data:, vbscript:, file:
```

**Input Validation:**

```typescript
isValidEmail(email: string): boolean
validatePassword(password: string): { isValid: boolean; errors: string[] }
```

**Security Checks:**

```typescript
containsXssPayload(input: string): boolean
```

**Token Generation:**

```typescript
generateSecureToken(length?: number): string
```

**Object Sanitization:**

```typescript
sanitizeObject<T>(obj: T): T
```

---

## Best Practices

### ✅ DO

1. **Sanitize all user-generated HTML**

   ```typescript
   const clean = sanitizeEmailHtml(untrustedHtml);
   <div dangerouslySetInnerHTML={{ __html: clean }} />
   ```

2. **Use httpOnly cookies for tokens**

   ```typescript
   cookieStore.set('token', token, { httpOnly: true });
   ```

3. **Validate input on both client and server**

   ```typescript
   // Client
   if (!isValidEmail(email)) return;

   // Server
   if (!email || !isValidEmail(email)) {
     return errorResponse('Invalid email', 400);
   }
   ```

4. **Use HTTPS in production**

   ```typescript
   secure: process.env.NODE_ENV === 'production';
   ```

5. **Implement rate limiting** (TODO)

   ```typescript
   // Limit login attempts
   // Limit API requests per IP
   ```

6. **Log security events**
   ```typescript
   logError(error, {
     type: 'security',
     event: 'failed_login',
     ip: request.headers.get('x-forwarded-for'),
   });
   ```

### ❌ DON'T

1. **Don't store tokens in localStorage**

   ```typescript
   // ❌ BAD
   localStorage.setItem('token', token);

   // ✅ GOOD
   cookieStore.set('token', token, { httpOnly: true });
   ```

2. **Don't trust user input**

   ```typescript
   // ❌ BAD
   <div dangerouslySetInnerHTML={{ __html: userInput }} />

   // ✅ GOOD
   <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userInput) }} />
   ```

3. **Don't expose sensitive data in logs**

   ```typescript
   // ❌ BAD
   console.log('User logged in:', { password });

   // ✅ GOOD
   logError(error, { userId, action: 'login' });
   ```

4. **Don't use inline event handlers**

   ```typescript
   // ❌ BAD
   <button onclick="handleClick()">Click</button>

   // ✅ GOOD
   <button onClick={handleClick}>Click</button>
   ```

5. **Don't allow arbitrary URLs**

   ```typescript
   // ❌ BAD
   <a href={userProvidedUrl}>Link</a>

   // ✅ GOOD
   <a href={sanitizeUrl(userProvidedUrl)}>Link</a>
   ```

---

## Security Checklist

Use this checklist when implementing new features:

### Authentication

- [ ] Tokens stored in httpOnly cookies (NOT localStorage)
- [ ] Secure flag enabled in production
- [ ] SameSite=lax for CSRF protection
- [ ] Token expiration implemented
- [ ] Logout clears cookies properly

### Input Handling

- [ ] All user input validated (client + server)
- [ ] HTML content sanitized before rendering
- [ ] URLs validated before use
- [ ] Form data sanitized
- [ ] File uploads validated (type, size)

### API Routes

- [ ] Input validation on all endpoints
- [ ] Error responses don't leak sensitive data
- [ ] Rate limiting implemented (TODO)
- [ ] CORS configured correctly
- [ ] Authentication required where needed

### Headers

- [ ] CSP headers configured
- [ ] X-Frame-Options set
- [ ] HSTS enabled in production
- [ ] X-Content-Type-Options set

### Data Protection

- [ ] Sensitive data not logged
- [ ] Environment variables used for secrets
- [ ] No hardcoded credentials
- [ ] HTTPS enforced in production

### Dependencies

- [ ] DOMPurify installed for HTML sanitization
- [ ] Regular dependency updates
- [ ] Security audits (`npm audit`)

---

## Installation

Required security dependencies:

```bash
# Install DOMPurify for XSS protection
pnpm add isomorphic-dompurify
pnpm add -D @types/dompurify
```

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)

---

## Reporting Security Issues

If you discover a security vulnerability, please email:
**security@example.com** (TODO: Update with actual email)

**Do NOT open public GitHub issues for security vulnerabilities.**

---

**Last Updated:** 2025-01-21
**Maintained By:** Development Team
**Security Level:** ⭐⭐⭐⭐⭐ (High)
