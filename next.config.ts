import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Determine current environment
const environment = process.env.NODE_ENV || 'development';
const isProduction = environment === 'production';
const isStaging = process.env.APP_ENV === 'staging';

// Phase 1: Base Configuration (Common for all environments)
const baseConfig: NextConfig = {
  distDir: '.next', // Default build directory
  output: 'standalone',
  poweredByHeader: false, // Remove X-Powered-By header
  productionBrowserSourceMaps: !isProduction, // Only enable source maps when not in production

  // Static assets configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '**',
      },
    ],
  },

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

// Phase 2: Performance Optimizations
const performanceConfig: NextConfig = {
  // Next.js 15 optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-checkbox', 'react-icons'],
  },
};

// Phase 3: Environment-specific Configuration
const environmentConfig: NextConfig = isProduction
  ? {
      // Production configuration
      compiler: {
        removeConsole: true,
      },
    }
  : isStaging
    ? {
        // Staging configuration
        compiler: {
          removeConsole: {
            exclude: ['error', 'warn'],
          },
        },
      }
    : {
        // Development configuration
        compiler: {
          removeConsole: false,
        },
      };

// Combine all phases into final configuration
const nextConfig: NextConfig = {
  ...baseConfig,
  ...performanceConfig,
  ...environmentConfig,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
