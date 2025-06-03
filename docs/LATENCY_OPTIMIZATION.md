# Latency Optimization Strategies

Guide to optimizing latency for Next.js Proxy Architecture.

## 🎯 Problem

The PROXY architecture adds one hop compared to Direct call:

```
Proxy:  Browser → Next.js → Backend  (2 hops, ~100-200ms)
Direct: Browser → Backend            (1 hop, ~50-100ms)
```

## 📊 Solutions Comparison

| Solution              | Latency    | Security | Complexity | Use Cases       |
| --------------------- | ---------- | -------- | ---------- | --------------- |
| 1. Hybrid Approach    | ⭐⭐⭐⭐   | ⭐⭐⭐⭐ | ⭐⭐⭐     | Recommended     |
| 2. Internal Network   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐   | Production      |
| 3. Caching Strategy   | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐     | Read-heavy      |
| 4. Edge Functions     | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Global scale    |
| 5. Direct Call + CORS | ⭐⭐⭐⭐⭐ | ⭐⭐     | ⭐⭐       | Not recommended |

---

## Solution 1: Hybrid Approach (Recommended) ⭐

### Idea

Split API calls into two types:

- **Critical/Sensitive**: Go through Next.js proxy (secure)
- **Public/Non-critical**: Call backend directly (faster)

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Browser                        │
└─────────────────────────────────────────────────────┘
           │                            │
           │ Critical                   │ Public
           │ (auth, user data)          │ (lists, stats)
           ↓                            ↓
    ┌──────────────┐              ┌──────────────┐
    │   Next.js    │              │   Backend    │
    │  API Routes  │              │  Public API  │
    └──────────────┘              └──────────────┘
           │
           ↓
    ┌──────────────┐
    │   Backend    │
    │ Secure API   │
    └──────────────┘
```

### Implementation

#### 1. Setup Direct Axios (Already created)

File: `src/lib/axios-direct.ts`

```typescript
// For public, non-critical endpoints
import { axiosDirectInstance } from '@/lib/client/axios-direct';

// Direct call to backend
const tickets = await axiosDirectInstance.get('/api/public/tickets');
```

#### 2. Setup API Classification

```typescript
// src/config/api-routing.ts
export const API_ROUTING = {
  // Critical - Use Proxy (via Next.js)
  proxy: {
    auth: '/api/auth/*',
    user: '/api/me',
    settings: '/api/settings/*',
    payment: '/api/payment/*',
  },

  // Public - Direct to Backend
  direct: {
    tickets: '/api/public/tickets',
    stats: '/api/public/stats',
    health: '/api/health',
  },
} as const;
```

#### 3. Usage Example

```typescript
// ✅ Critical: Use proxy (secure, slower)
import { axiosInstance } from '@/lib/client/axios';
await axiosInstance.post('/api/auth/login', { email, password });
await axiosInstance.get('/api/me');

// ✅ Public: Use direct (fast, public only)
import { axiosDirectInstance } from '@/lib/client/axios-direct';
await axiosDirectInstance.get('/api/public/tickets');
```

### Pros & Cons

**✅ Pros:**

- Best of both worlds
- Flexible
- Maintains security for critical endpoints
- Reduces latency for public endpoints

**❌ Cons:**

- Need to maintain 2 axios instances
- Backend must expose public endpoints with CORS
- Developer must decide which instance to use

---

## Solution 2: Internal Network (Production) ⭐⭐

### Idea

Deploy Next.js and Backend in the same private network

### Architecture

```
Internet → Load Balancer → Private Network
                              │
                    ┌─────────┴─────────┐
                    │                   │
              ┌──────────┐        ┌──────────┐
              │ Next.js  │───────→│ Backend  │
              │:3000     │  <1ms  │:8000     │
              └──────────┘        └──────────┘

Browser → Next.js (public) → Backend (internal, fast!)
```

### Implementation

#### Docker Compose Example

```yaml
# docker-compose.yml
version: '3.8'

services:
  nextjs:
    image: email-system:latest
    environment:
      - BACKEND_URL=http://backend:8000 # Internal network
    networks:
      - internal
    ports:
      - '3000:3000'

  backend:
    image: backend:latest
    networks:
      - internal
    # NO public port - only accessible from internal network

networks:
  internal:
    driver: bridge
```

#### Kubernetes Example

```yaml
# k8s-services.yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP # Internal only
  selector:
    app: backend
  ports:
    - port: 8000
---
apiVersion: v1
kind: Service
metadata:
  name: nextjs-service
spec:
  type: LoadBalancer # Public
  selector:
    app: nextjs
  ports:
    - port: 3000
```

### Configuration

```bash
# .env.production
BACKEND_URL=http://backend:8000          # Internal DNS
# or
BACKEND_URL=http://10.0.1.100:8000      # Internal IP
```

### Pros & Cons

**✅ Pros:**

- Very low latency (<5ms in the same network)
- Backend is completely private
- No need for CORS
- Production-ready

**❌ Cons:**

- Only applicable for production deployment
- Requires infrastructure setup
- Development is still slow

---

## Solution 3: Caching Strategy ⭐⭐⭐

### Idea

Cache responses to reduce backend calls

### Implementation

#### A. React Query with Stale-While-Revalidate

```typescript
// src/hooks/api/useTickets.ts
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/client/axios';

export function useTickets() {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/api/ticket');
      return data;
    },
    staleTime: 30 * 1000, // 30s: Consider data fresh
    cacheTime: 5 * 60 * 1000, // 5min: Keep in cache
    refetchOnMount: false, // Don't refetch on mount if cached
    refetchOnWindowFocus: false, // Don't refetch on focus
  });
}
```

#### B. Next.js API Route Caching

```typescript
// app/api/ticket/route.ts
import { proxyGet } from '@/lib/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.toString();

  const resp = await proxyGet(`/inbox?${query}`);
  const data = await resp.json();

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
    },
  });
}
```

#### C. Redis Caching (Advanced)

```typescript
// lib/redis-cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCached<T>(key: string, fetcher: () => Promise<T>, ttl: number = 60): Promise<T> {
  // Try cache first
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch and cache
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  return data;
}

// Usage in API route
export async function GET() {
  const data = await getCached(
    'tickets:all',
    async () => {
      const resp = await fetch(`${process.env.BACKEND_URL}/api/tickets`);
      return resp.json();
    },
    60 // Cache 60s
  );

  return NextResponse.json(data);
}
```

### Pros & Cons

**✅ Pros:**

- Dramatically reduces requests to backend
- Great user experience (instant loading)
- Easy to implement

**❌ Cons:**

- Data can be stale
- Complex for real-time data
- Requires invalidation strategy

---

## Solution 4: Edge Functions (Vercel/Cloudflare)

### Idea

Deploy Next.js API routes to Edge (closer to user)

### Implementation

```typescript
// app/api/ticket/route.ts
export const runtime = 'edge'; // Enable Edge Runtime

export async function GET(request: Request) {
  // Runs on Edge server closest to user
  const resp = await fetch(`${process.env.BACKEND_URL}/api/tickets`);
  return new Response(resp.body);
}
```

### Pros & Cons

**✅ Pros:**

- Extremely low latency (close to user)
- Automatic global scale
- No need to manage infrastructure

**❌ Cons:**

- Only supports some runtime APIs
- Vendor lock-in
- Higher cost

---

## Solution 5: Direct Call + CORS (Not Recommended)

### Idea

Remove proxy, call backend directly from client

```typescript
// axios.ts
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Direct to backend
  withCredentials: true,
});
```

### Pros & Cons

**✅ Pros:**

- Lowest latency
- Simplest

**❌ Cons:**

- Backend must be public
- Complex CORS configuration
- Security risks
- Backend URL exposed
- Cookie issues with cross-domain

---

## 🎯 Recommendation Matrix

### Development

```
Use: Solution 1 (Hybrid)
- Proxy for auth
- Direct for public APIs
- Easy to debug
```

### Production (Small-Medium Scale)

```
Use: Solution 2 (Internal Network) + Solution 3 (Caching)
- Deploy in same VPC/network
- Cache with React Query
- Best balance
```

### Production (Large Scale)

```
Use: Solution 4 (Edge) + Solution 3 (Caching) + Solution 2 (Internal)
- Edge Functions for global reach
- Redis for distributed cache
- Internal network for backend
- Maximum performance
```

---

## 📊 Performance Comparison

### Baseline (No Optimization)

```
Browser → Next.js (proxy) → Backend
Latency: ~150-200ms per request
```

### With Hybrid Approach

```
Critical: Browser → Next.js → Backend (~150ms)
Public:   Browser → Backend         (~80ms)
Average improvement: 35-40%
```

### With Internal Network

```
Browser → Next.js → Backend (internal)
Latency: ~60-80ms per request
Improvement: 60%
```

### With Caching

```
First load:  150ms
Cached load: 5-10ms (from memory/Redis)
Improvement: 95%+ for repeated requests
```

### With Edge + Cache + Internal

```
First load:  40-60ms (edge + internal)
Cached:      5-10ms
Improvement: 70-95%
```

---

## 🚀 Quick Start

### Step 1: Add Direct Axios (for Hybrid)

File already created: `src/lib/axios-direct.ts`

### Step 2: Update .env.example

Already updated to include `NEXT_PUBLIC_API_URL` for direct calls (if needed)

### Step 3: Choose Strategy

```typescript
// For auth, sensitive data
import { axiosInstance } from '@/lib/client/axios'; // Proxy

// For public, high-frequency data
import { axiosDirectInstance } from '@/lib/client/axios-direct'; // Direct
```

### Step 4: Add Caching

```bash
pnpm add ioredis @types/ioredis  # If using Redis
```

---

## 📝 Monitoring

Measure actual latency in production:

```typescript
// lib/performance.ts
export function measureLatency(name: string) {
  const start = performance.now();

  return () => {
    const duration = performance.now() - start;
    console.log(`[${name}] Latency: ${duration}ms`);

    // Send to monitoring service
    if (typeof window !== 'undefined') {
      // Analytics.track('api_latency', { name, duration });
    }
  };
}

// Usage
const done = measureLatency('fetch-tickets');
await axiosInstance.get('/api/ticket');
done(); // Logs: [fetch-tickets] Latency: 145ms
```

---

## 🎓 Best Practices

1. **Start Simple**: Begin with pure proxy, optimize when needed
2. **Measure First**: Use monitoring to find bottlenecks
3. **Cache Wisely**: Cache read-heavy, non-sensitive data
4. **Internal Network**: Always use for production
5. **Hybrid Approach**: Best balance for most cases
6. **Document**: Clearly document which endpoints are direct vs proxy
