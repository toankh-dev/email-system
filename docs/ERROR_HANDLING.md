# Error Handling Guide

This document describes the error handling strategy and best practices for the Email System Frontend.

## 📋 Table of Contents

- [Overview](#overview)
- [Error Classes](#error-classes)
- [Error Handling Utilities](#error-handling-utilities)
- [React Error Boundaries](#react-error-boundaries)
- [Hooks](#hooks)
- [API Routes](#api-routes)
- [Component Error Handling](#component-error-handling)
- [Best Practices](#best-practices)

---

## Overview

The Email System uses a **centralized, type-safe error handling system** with the following features:

✅ **Custom error classes** for different error types
✅ **Centralized error logging** with environment-aware behavior
✅ **React Error Boundaries** for graceful error recovery
✅ **Custom hooks** for component-level error handling
✅ **Standardized API error responses**
✅ **User-friendly error messages** with i18n support

---

## Error Classes

Located in `src/lib/errors.ts`, we provide the following error classes:

### `AppError` (Base Class)

```typescript
import { AppError } from '@/lib/client/errors';

throw new AppError('Something went wrong', 'CUSTOM_ERROR', 500, { detail: 'extra info' });
```

### Specialized Error Classes

```typescript
// Validation errors (400)
throw new ValidationError('Invalid email format', validationDetails);

// Authentication errors (401)
throw new AuthenticationError('Token expired');

// Authorization errors (403)
throw new AuthorizationError('Insufficient permissions');

// Not found errors (404)
throw new NotFoundError('User');

// Network errors
throw new NetworkError('Connection timeout');
```

---

## Error Handling Utilities

### `parseError(error: unknown): AppError`

Converts any error type into an `AppError`:

```typescript
import { parseError } from '@/lib/client/errors';

try {
  await someAsyncOperation();
} catch (err) {
  const appError = parseError(err);
  console.log(appError.code); // 'API_ERROR', 'VALIDATION_ERROR', etc.
}
```

### `getUserMessage(error: unknown): string`

Returns user-friendly error message:

```typescript
import { getUserMessage } from '@/lib/client/errors';

try {
  await someAsyncOperation();
} catch (err) {
  const message = getUserMessage(err); // "ログインセッションが期限切れです..."
  toast.error(message);
}
```

### `logError(error: unknown, context?: Record<string, unknown>): void`

Logs error with context:

```typescript
import { logError } from '@/lib/client/errors';

try {
  await fetchUserData(userId);
} catch (err) {
  logError(err, { userId, action: 'fetchUserData' });
}
```

**Behavior:**

- **Development**: Full error details logged to console
- **Production**: Minimal logging, sends to external service (TODO: integrate Sentry)

---

## React Error Boundaries

### `ErrorBoundary`

Catches React errors and displays fallback UI:

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary
  fallback={<CustomErrorUI />} // Optional custom fallback
  onError={(error, errorInfo) => {
    // Optional error handler
    logError(error, { componentStack: errorInfo.componentStack });
  }}
  resetKeys={[userId]} // Reset when these values change
>
  <YourComponent />
</ErrorBoundary>
```

**Features:**

- Automatic error logging
- User-friendly fallback UI
- Retry functionality
- Development mode shows stack trace

### `AsyncErrorBoundary`

Specialized for async operations (data fetching):

```typescript
import { AsyncErrorBoundary } from '@/components/AsyncErrorBoundary';

<AsyncErrorBoundary
  onRetry={() => refetchData()}
  resetKeys={[ticketId]}
>
  <TicketList />
</AsyncErrorBoundary>
```

### `withErrorBoundary` HOC

Wrap components with error boundary:

```typescript
import { withErrorBoundary } from '@/components/ErrorBoundary';

const TicketPage = () => {
  // Component code
};

export default withErrorBoundary(TicketPage, {
  onError: error => logError(error, { page: 'TicketPage' }),
});
```

---

## Hooks

### `useErrorHandler`

Handle errors in components:

```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler';

function MyComponent() {
  const { error, isError, handleError, clearError } = useErrorHandler();

  const fetchData = async () => {
    try {
      const data = await api.getData();
    } catch (err) {
      handleError(err, { context: 'fetchData' }); // Shows toast automatically
    }
  };

  return (
    <div>
      {isError && <ErrorMessage error={error} onClose={clearError} />}
      <button onClick={fetchData}>Fetch</button>
    </div>
  );
}
```

### `useSafeAsync`

Safe async operations with built-in error handling:

```typescript
import { useSafeAsync } from '@/hooks/useErrorHandler';

function MyComponent() {
  const { execute, loading } = useSafeAsync();

  const handleSubmit = async () => {
    const result = await execute(
      async () => {
        return await api.submitForm(data);
      },
      (result) => {
        toast.success('Success!');
        // Handle success
      }
    );
  };

  return (
    <button onClick={handleSubmit} disabled={loading}>
      {loading ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

---

## API Routes

### Standardized Error Responses

Use helper functions from `src/lib/response.ts`:

```typescript
import { errorResponse, successResponse, handleApiError } from '@/lib/client/response';

export async function GET(request: Request) {
  try {
    const resp = await fetch(`${process.env.BACKEND_URL}/api/resource`);
    const data = await parseJSONResponse(resp);

    if (!resp.ok) {
      return errorResponse(data?.error || 'Failed to fetch resource', resp.status, data?.detail);
    }

    return successResponse(data);
  } catch (error) {
    return handleApiError(error); // Automatically handles different error types
  }
}
```

### Response Formats

**Success Response:**

```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "User-friendly error message",
  "detail": [
    {
      "msg": "Validation error details",
      "type": "value_error",
      "loc": ["field", "name"]
    }
  ]
}
```

---

## Component Error Handling

### Pattern 1: Try-Catch with useErrorHandler

```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler';

function CommentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleError } = useErrorHandler();

  const handleSubmit = async (data: CommentData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(data);
      toast.success('Comment added!');
    } catch (error) {
      handleError(error, { context: 'addComment' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

### Pattern 2: React Query with Error Handling

```typescript
import { useQuery } from '@tanstack/react-query';
import { getUserMessage } from '@/lib/client/errors';

function UserProfile({ userId }: Props) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    onError: (error) => {
      const message = getUserMessage(error);
      toast.error(message);
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return <ProfileDetails data={data} />;
}
```

---

## Best Practices

### ✅ DO

1. **Always use try-catch for async operations**

   ```typescript
   try {
     await asyncOperation();
   } catch (error) {
     handleError(error);
   }
   ```

2. **Provide context when logging errors**

   ```typescript
   logError(error, {
     userId,
     ticketId,
     action: 'updateTicket',
   });
   ```

3. **Use proper loading and error states**

   ```typescript
   const [isSubmitting, setIsSubmitting] = useState(false);

   if (isSubmitting) return;
   setIsSubmitting(true);
   ```

4. **Show user-friendly messages**

   ```typescript
   const message = getUserMessage(error);
   toast.error(message);
   ```

5. **Wrap critical components with Error Boundaries**
   ```typescript
   <ErrorBoundary>
     <CriticalComponent />
   </ErrorBoundary>
   ```

### ❌ DON'T

1. **Don't expose raw error objects to users**

   ```typescript
   // ❌ Bad
   toast.error(error.message);

   // ✅ Good
   toast.error(getUserMessage(error));
   ```

2. **Don't use console.log/console.error in production**

   ```typescript
   // ❌ Bad
   console.error('Error:', error);

   // ✅ Good
   logError(error, context);
   ```

3. **Don't swallow errors silently**

   ```typescript
   // ❌ Bad
   try {
     await operation();
   } catch (error) {
     // Silent fail
   }

   // ✅ Good
   try {
     await operation();
   } catch (error) {
     handleError(error);
   }
   ```

4. **Don't create multiple error handling patterns**
   - Use the centralized utilities
   - Follow established patterns

5. **Don't forget to disable submit buttons during async operations**

   ```typescript
   // ❌ Bad
   <button onClick={handleSubmit}>Submit</button>

   // ✅ Good
   <button onClick={handleSubmit} disabled={isSubmitting}>
     {isSubmitting ? 'Submitting...' : 'Submit'}
   </button>
   ```

---

## Error Message Localization

Error messages support Japanese with English fallbacks:

```typescript
const messageMap: Record<string, string> = {
  AUTHENTICATION_ERROR: 'ログインセッションが期限切れです。再度ログインしてください。',
  AUTHORIZATION_ERROR: 'この操作を実行する権限がありません。',
  NOT_FOUND_ERROR: 'リクエストされたデータが見つかりませんでした。',
  NETWORK_ERROR: 'ネットワークエラーが発生しました。接続を確認してください。',
  VALIDATION_ERROR: '入力内容を確認してください。',
};
```

**TODO:** Integrate with next-intl for multi-language support.

---

## Integration Checklist

When adding error handling to a new component or feature:

- [ ] Wrap with `ErrorBoundary` or `AsyncErrorBoundary` if appropriate
- [ ] Use `useErrorHandler` hook for component-level errors
- [ ] Add try-catch blocks around async operations
- [ ] Provide loading states during async operations
- [ ] Show user-friendly error messages (use `getUserMessage`)
- [ ] Log errors with context (use `logError`)
- [ ] Handle validation errors gracefully
- [ ] Test error scenarios (network errors, validation errors, etc.)
- [ ] Remove any `console.log` or `console.error` statements
- [ ] Update error message translations if needed

---

## Examples

See the following files for implementation examples:

- **Error Boundary**: `src/components/ErrorBoundary.tsx`
- **Hooks**: `src/hooks/useErrorHandler.ts`
- **Component**: `src/components/ui/input/InputAddConmentTicket.tsx`
- **API Route**: `src/app/api/pop3/register/route.ts`
- **Error Utilities**: `src/lib/errors.ts`

---

**Last Updated:** 2025-01-21
**Maintained By:** Development Team
