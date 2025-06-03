import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatString(
  template: string,
  params?:
    | {
        params?: Record<string, string>;
        query?: Record<string, string>;
      }
    | string
): string {
  if (!params) return template;
  if (typeof template !== 'string') return '';

  let pathParams: Record<string, string> = {};
  let queryParams: Record<string, string> = {};

  if (typeof params === 'string') {
    queryParams = Object.fromEntries(new URLSearchParams(params));
  } else if (typeof params === 'object') {
    pathParams = params.params || {};
    queryParams = params.query || {};
  }

  const [rawPath, rawQuery] = template.split('?');

  const path = rawPath.replace(/\{(\w+)\}/g, (_, key) => pathParams[key] ?? '');

  let query = rawQuery;
  if (rawQuery) {
    query = rawQuery.replace(/\{(\w+)\}/g, (_, key) => queryParams[key] ?? '');
  }

  return query ? `${path}?${query}` : path;
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options,
  });
}
