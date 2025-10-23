# Email System

<div align="center">
  <img src="public/file.svg" alt="Email System Logo" width="100" />
  <h3>A modern email client built with Next.js, React, and Zustand</h3>
</div>

## ✨ Features

- 🚀 **High Performance** - Optimized with lazy initialization and store preloading
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔄 **State Management** - Efficient state handling with Zustand
- 🌐 **App Router** - Modern routing with Next.js App Router
- 🎨 **Modular UI** - Component-based architecture for reusability
- 🔍 **Dev Tools** - TanStack Query DevTools for easier debugging

## Getting Started

First, run the development server:

```bash
pnpm install

pnpm dev
```

## 🌍 Environment Configuration

This project uses environment variables to manage different configurations across development, staging, and production environments.

### Available Environment Files

- `.env.development`: Development environment values (should be committed to git)
- `.env.staging`: Staging environment values (should be committed to git)
- `.env.production`: Production environment values (should be committed to git)
- `.env.local`: Local overrides for development (should NOT be committed to git)
- `.env.example`: Template for setting up local environments (should be committed to git)

### Running in Different Environments

```bash
# Development environment
pnpm dev

# Development with staging environment variables
pnpm dev:staging

# Build for staging
pnpm build:staging

# Start in staging mode
pnpm start:staging

# Build for production
pnpm build:prod

# Start in production mode
pnpm start:prod
```

For more detailed information about environment configuration, see [Environment Configuration Guide](docs/environment-config.md).

## 📁 Project Folder Structure

<details>
<summary><b>Click to expand folder structure</b></summary>

```
email-system/
│
├── 📂 public/                    # Static assets
│   ├── 📂 assets/
│   │   └── 📂 fonts/             # Custom fonts
│   └── 📄 *.svg                  # SVG files
│
├── 📂 src/                       # Main source code
│   │
│   ├── 📂 app/                   # App Router
│   │   ├── 📄 layout.tsx         # Root layout
│   │   ├── 📂 login/             # Login page
│   │   └── 📂 mail/              # Mail application
│   │       ├── 📂 components/    # Mail-specific components
│   │       ├── 📄 layout.tsx     # Mail layout
│   │       ├── 📄 loading.tsx    # Loading state
│   │       └── 📄 page.tsx       # Mail page
│   │
│   ├── 📂 components/            # Reusable UI components
│   │   ├── 📂 providers/         # Provider components
│   │   │   ├── 📄 ReactQueryProvider.tsx
│   │   │   ├── 📄 StorePreloader.tsx
│   │   │   ├── 📄 StoreProvider.tsx
│   │   │   └── 📄 TanStackQueryDevtools.tsx
│   │   │
│   │   ├── 📂 ui/                # UI components
│   │   │   ├── 📂 button/        # Button components
│   │   │   ├── 📂 checkbox/      # Checkbox components
│   │   │   ├── 📂 dialog/        # Dialog components
│   │   │   ├── 📂 input/         # Input components
│   │   │   └── 📂 tooltip/       # Tooltip components
│   │   │
│   │   └── 📂 layout/            # Layout components
│   │
│   ├── 📂 constants/             # Configuration constants
│   ├── 📂 data/                  # Mock data
│   ├── 📂 hooks/                 # Custom React hooks
│   │   └── 📄 useStore.ts        # Store access hooks
│   ├── 📂 lib/                   # Libraries and utilities
│   ├── 📂 styles/                # Global CSS files
│   ├── 📂 stores/                # State management (Zustand)
│   │   └── 📂 slices/            # Store slices
│   ├── 📂 types/                 # TypeScript types
│   └── 📄 middleware.ts          # Next.js middleware
│
├── 📂 docs/                      # Documentation
├── 📄 .env.local                 # Local environment variables
├── 📄 next.config.ts             # Next.js configuration
├── 📄 package.json               # Project metadata and scripts
├── 📄 tsconfig.json              # TypeScript configuration
└── 📄 eslint.config.mjs          # ESLint configuration
```

</details>

## 🧭 Explanation of Key Directories

<table>
  <tr>
    <th align="left">Directory</th>
    <th align="left">Description</th>
  </tr>
  <tr>
    <td><code>src/app/</code></td>
    <td>Next.js App Router implementation with route-based file structure for layouts and pages.</td>
  </tr>
  <tr>
    <td><code>src/components/providers/</code></td>
    <td>Application providers for state management, query caching, and context distribution:
      <ul>
        <li><code>StoreProvider</code>: Manages Zustand store with optimized hydration</li>
        <li><code>StorePreloader</code>: Background preloading of store state</li>
        <li><code>ReactQueryProvider</code>: TanStack Query configuration</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>src/components/ui/</code></td>
    <td>Reusable UI components organized by type, including buttons, inputs, dialogs, etc.</td>
  </tr>
  <tr>
    <td><code>src/hooks/</code></td>
    <td>Custom React hooks including optimized store access hooks with async initialization support.</td>
  </tr>
  <tr>
    <td><code>src/stores/</code></td>
    <td>Zustand store implementation with:
      <ul>
        <li>Optimized lazy initialization</li>
        <li>Modular slices for domain-specific state</li>
        <li>Persistence with hydration</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td><code>src/styles/</code></td>
    <td>Global and component-specific CSS styling.</td>
  </tr>
</table>

## 🔧 Technologies Used

<table>
  <tr>
    <td align="center"><img src="public/next.svg" width="40" height="40" alt="Next.js" /><br>Next.js</td>
    <td align="center"><img src="https://raw.githubusercontent.com/pmndrs/zustand/main/bear.jpg" width="40" height="40" alt="Zustand" /><br>Zustand</td>
    <td align="center"><img src="https://tanstack.com/favicon.ico" width="40" height="40" alt="TanStack Query" /><br>TanStack Query</td>
    <td align="center"><img src="https://raw.githubusercontent.com/tailwindlabs/tailwindcss/master/.github/logo-light.svg" width="40" height="40" alt="Tailwind CSS" /><br>Tailwind CSS</td>
    <td align="center"><img src="https://typescriptlang.org/favicon-32x32.png" width="40" height="40" alt="TypeScript" /><br>TypeScript</td>
  </tr>
</table>

## 📝 State Management

The application uses Zustand for state management with the following optimizations:

- **Lazy Initialization**: Store is only created when needed
- **Store Preloading**: Background initialization with `StorePreloader`
- **Async Support**: Full async/await support for store operations
- **Modular Slices**: Domain-specific state separated into slices
- **Persistence**: State persisted with optimized hydration
