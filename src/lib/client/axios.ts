import axios, { AxiosError, AxiosResponse } from 'axios';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';
import NProgress from 'nprogress';
import axios, { AxiosError, AxiosResponse } from 'axios';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';
import NProgress from 'nprogress';

// library imports
import { HTTP_STATUS } from '@/constants';

const axiosInstance = axios.create({
  // Empty baseURL for same-origin requests to Next.js API routes
  // Next.js API routes (/app/api/*) will proxy to backend using BACKEND_URL
  baseURL: '',
  withCredentials: true, // Include httpOnly cookies
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  config => {
    if (config.headers?.showProgress) {
      NProgress.start();
      delete config.headers.showProgress;
    }

    // NOTE: Authentication is handled via httpOnly cookies
    // Token is automatically sent with every request via cookies
    // withCredentials: true ensures cookies are included
    // No need to manually add Authorization header

    // Return config for 'multipart/form-data' requests without further modification
    if (config.headers && config.headers['Content-Type'] === 'multipart/form-data') {
      return config;
    }

    // Convert params and data keys to snake_case if not forced to use camelCase
    if (config.params && !config.params.forceCamelKeys) {
      config.params = snakecaseKeys(config.params, {
        deep: true,
      });
    }
    if (config.data && !config.data.forceCamelKeys) {
      config.data = snakecaseKeys(config.data, {
        deep: true,
      });
    }
    return config;
  },
  error => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export const onResponseSuccess = async <T = unknown>(response: AxiosResponse<T>): Promise<AxiosResponse<T>> => {
  // Stop NProgress when the response is received
  NProgress.done();
  // Extract the status code from the response
  const status = response?.status || null;

  // Handle success (2xx) status codes by returning the response with camelCased data
  switch (status) {
    case HTTP_STATUS.OK:
    case HTTP_STATUS.CREATED:
    case HTTP_STATUS.NO_CONTENT:
      return Promise.resolve({
        ...response,
        data: response?.data ? (camelcaseKeys(response.data as Record<string, unknown>, { deep: true }) as T) : ({} as T),
      });
    default:
      return Promise.reject(response);
  }
};

const onResponseError = async (error: AxiosError): Promise<never> => {
  // Stop NProgress when an error occurs
  NProgress.done();
  // Extract the status code from the error response
  const status = (error as AxiosError)?.response?.status || error?.status || null;

  // Ignore canceled requests
  if (error?.name === 'CanceledError') {
    return Promise.reject(error);
  }

  // Create a new error object with camelCased data
  const camelErr = {
    ...error,
    response: {
      ...error?.response,
      data: camelcaseKeys(error?.response?.data as Record<string, unknown>, { deep: true }),
    },
  };

  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
    case HTTP_STATUS.FORBIDDEN:
      if (typeof window !== 'undefined') {
        // Clear the httpOnly cookie by calling logout endpoint
        fetch('/api/auth/logout', { method: 'POST' }).catch(() => {
          // Ignore errors, just redirect
        });

        // Redirect to login page
        window.location.href = '/login';
      }
      break;
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      break;
    default:
      break;
  }
  error => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export const onResponseSuccess = async (response: any) => {
  // Stop NProgress when the response is received
  NProgress.done();
  // Extract the status code from the response
  const status = (response as AxiosError)?.response?.status || response?.status || null;

  // Handle success (2xx) status codes by returning the response with camelCased data
  switch (status) {
    case HTTP_STATUS.OK:
    case HTTP_STATUS.CREATED:
    case HTTP_STATUS.NO_CONTENT:
      return Promise.resolve({
        ...response,
        data: response?.data ? camelcaseKeys(response.data, { deep: true }) : {},
      } as AxiosResponse);
    default:
      return Promise.reject(response);
  }
};

const onResponseError = async (error: any) => {
  // Stop NProgress when an error occurs
  NProgress.done();
  // Extract the status code from the error response
  const status = (error as AxiosError)?.response?.status || error?.status || null;

  // Ignore canceled requests
  if (error?.name === 'CanceledError') {
    return Promise.reject(error);
  }

  // Create a new error object with camelCased data
  const camelErr = {
    ...error,
    response: {
      ...error?.response,
      data: camelcaseKeys(error?.response?.data, { deep: true }),
    },
  };

  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
    case HTTP_STATUS.FORBIDDEN:
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      break;
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      break;
    default:
      break;
  }

  return Promise.reject(camelErr);
};

// Response Interceptor
axiosInstance.interceptors.response.use(onResponseSuccess, onResponseError);

export { axiosInstance };
  return Promise.reject(camelErr);
};

// Response Interceptor
axiosInstance.interceptors.response.use(onResponseSuccess, onResponseError);

export { axiosInstance };
