/**
 * Security Utilities
 * Provides security functions for input sanitization, XSS prevention, and more
 */

import DOMPurify, { Config } from 'isomorphic-dompurify';
import crypto from 'crypto';

/**
 * Sanitize HTML content to prevent XSS attacks
 * Uses DOMPurify to clean potentially dangerous HTML
 *
 * @param dirty - Untrusted HTML string
 * @param options - DOMPurify configuration options
 * @returns Sanitized HTML string safe for rendering
 *
 * @example
 * const cleanHtml = sanitizeHtml(userInput);
 * <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
 */
export function sanitizeHtml(
  dirty: string,
  options?: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    removeScripts?: boolean;
  }
): string {
  const defaultConfig: Config = {
    // Allow common safe tags
    ALLOWED_TAGS: options?.allowedTags || [
      'p',
      'br',
      'strong',
      'em',
      'u',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'td',
      'th',
      'blockquote',
      'code',
      'pre',
      'div',
      'span',
    ],
    // Allow common safe attributes
    ALLOWED_ATTR: options?.allowedAttributes
      ? Object.keys(options.allowedAttributes).reduce((acc, tag) => {
          return [...acc, ...options.allowedAttributes![tag]];
        }, [] as string[])
      : ['href', 'src', 'alt', 'title', 'class', 'id', 'style'],
    // Force target="_blank" on all links
    ALLOW_UNKNOWN_PROTOCOLS: false,
    // Remove scripts by default
    FORBID_TAGS: options?.removeScripts !== false ? ['script', 'style', 'iframe', 'object', 'embed'] : undefined,
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  };

  return DOMPurify.sanitize(dirty, defaultConfig) as string;
}

/**
 * Sanitize email HTML content specifically
 * More permissive than general HTML but still safe
 */
export function sanitizeEmailHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'strike',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'ul',
      'ol',
      'li',
      'a',
      'img',
      'table',
      'thead',
      'tbody',
      'tfoot',
      'tr',
      'td',
      'th',
      'blockquote',
      'code',
      'pre',
      'div',
      'span',
      'font',
      'hr',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      table: ['border', 'cellpadding', 'cellspacing', 'width'],
      td: ['colspan', 'rowspan', 'width'],
      th: ['colspan', 'rowspan', 'width'],
      '*': ['class', 'style'],
    },
  });
}

/**
 * Sanitize user input text (remove HTML tags completely)
 * Use for plain text fields that should not contain any HTML
 */
export function sanitizeText(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Validate and sanitize URL to prevent javascript: and data: URLs
 */
export function sanitizeUrl(url: string): string {
  const trimmed = url.trim();

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = trimmed.toLowerCase();

  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return '#'; // Return safe fallback
    }
  }

  // Ensure URL is properly encoded
  try {
    const parsed = new URL(trimmed);
    // Only allow http, https, mailto
    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      return '#';
    }
    return parsed.toString();
  } catch {
    // If URL parsing fails, it might be a relative URL
    // Only allow if it starts with / or #
    if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
      return trimmed;
    }
    return '#';
  }
}

/**
 * Escape HTML special characters to prevent XSS
 * Use when you need to display user input as text (not HTML)
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, char => map[char]);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * Returns object with validation results
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate a secure random token
 * Use for CSRF tokens, session IDs, etc.
 */
export function generateSecureToken(length: number = 32): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for server-side (Node.js)
  if (typeof require !== 'undefined') {
    try {
      return crypto.randomBytes(length).toString('hex');
    } catch {
      // Fallback to Math.random (less secure, should not be used in production)
      console.warn('Using insecure random number generator. Install crypto module.');
      return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }
  }

  throw new Error('No secure random number generator available');
}

/**
 * Check if content contains potential XSS payloads
 * Returns true if suspicious content detected
 */
export function containsXssPayload(input: string): boolean {
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onerror, etc.
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Sanitize object by escaping all string values
 * Useful for sanitizing form data before processing
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => (typeof item === 'string' ? sanitizeText(item) : item));
    } else if (value && typeof value === 'object') {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}
