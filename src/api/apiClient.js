// src/api/apiClient.js
// Core API Client with interceptors, retry logic, and request cancellation

import { API_CONFIG } from './apiConfig';
import tokenService from './tokenService';

// Store for active request controllers (for cancellation)
const activeRequests = new Map();

// Request ID generator
let requestIdCounter = 0;
const generateRequestId = () => `req_${++requestIdCounter}_${Date.now()}`;

// Sleep utility for retry delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Request interceptors
const requestInterceptors = [];

// Response interceptors
const responseInterceptors = [];

/**
 * Add a request interceptor
 * @param {Function} interceptor - Function that receives and returns config
 */
export const addRequestInterceptor = (interceptor) => {
  requestInterceptors.push(interceptor);
  return () => {
    const index = requestInterceptors.indexOf(interceptor);
    if (index !== -1) requestInterceptors.splice(index, 1);
  };
};

/**
 * Add a response interceptor
 * @param {Function} onSuccess - Function for successful responses
 * @param {Function} onError - Function for error responses
 */
export const addResponseInterceptor = (onSuccess, onError) => {
  const interceptor = { onSuccess, onError };
  responseInterceptors.push(interceptor);
  return () => {
    const index = responseInterceptors.indexOf(interceptor);
    if (index !== -1) responseInterceptors.splice(index, 1);
  };
};

/**
 * Apply request interceptors
 */
const applyRequestInterceptors = async (config) => {
  let modifiedConfig = { ...config };
  for (const interceptor of requestInterceptors) {
    modifiedConfig = await interceptor(modifiedConfig);
  }
  return modifiedConfig;
};

/**
 * Apply response interceptors for success
 */
const applyResponseInterceptorsSuccess = async (response) => {
  let modifiedResponse = response;
  for (const interceptor of responseInterceptors) {
    if (interceptor.onSuccess) {
      modifiedResponse = await interceptor.onSuccess(modifiedResponse);
    }
  }
  return modifiedResponse;
};

/**
 * Apply response interceptors for error
 */
const applyResponseInterceptorsError = async (error) => {
  let modifiedError = error;
  for (const interceptor of responseInterceptors) {
    if (interceptor.onError) {
      try {
        modifiedError = await interceptor.onError(modifiedError);
      } catch (e) {
        modifiedError = e;
      }
    }
  }
  throw modifiedError;
};

/**
 * Create AbortController for request cancellation
 */
const createAbortController = (requestId) => {
  const controller = new AbortController();
  activeRequests.set(requestId, controller);
  return controller;
};

/**
 * Cancel a specific request
 */
export const cancelRequest = (requestId) => {
  const controller = activeRequests.get(requestId);
  if (controller) {
    controller.abort();
    activeRequests.delete(requestId);
  }
};

/**
 * Cancel all active requests
 */
export const cancelAllRequests = () => {
  activeRequests.forEach((controller) => controller.abort());
  activeRequests.clear();
};

/**
 * Check if error is retriable
 */
const isRetriableError = (error, response) => {
  if (error.name === 'AbortError') return false;

  if (response && API_CONFIG.RETRY.RETRY_STATUS_CODES.includes(response.status)) {
    return true;
  }

  // Network errors are retriable
  if (!response && error.message === 'Failed to fetch') {
    return true;
  }

  return false;
};

/**
 * Calculate retry delay with exponential backoff
 */
const getRetryDelay = (attempt) => {
  const { RETRY_DELAY, RETRY_MULTIPLIER } = API_CONFIG.RETRY;
  return RETRY_DELAY * Math.pow(RETRY_MULTIPLIER, attempt);
};

/**
 * Main API request function
 */
const apiRequest = async (endpoint, options = {}, retryCount = 0) => {
  const requestId = options.requestId || generateRequestId();
  const controller = createAbortController(requestId);

  // Default config
  let config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...tokenService.getAuthHeader()
    },
    signal: controller.signal,
    ...options
  };

  // Apply request interceptors
  config = await applyRequestInterceptors(config);

  // Build full URL
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_CONFIG.BASE_URL}${endpoint}`;

  // Add timeout
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, options.timeout || API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, config);

    clearTimeout(timeoutId);
    activeRequests.delete(requestId);

    // Handle non-OK responses
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.response = response;
      error.status = response.status;

      // Try to parse error body
      try {
        error.data = await response.json();
      } catch {
        error.data = null;
      }

      // Check for retry
      if (isRetriableError(error, response) && retryCount < API_CONFIG.RETRY.MAX_RETRIES) {
        await sleep(getRetryDelay(retryCount));
        return apiRequest(endpoint, { ...options, requestId }, retryCount + 1);
      }

      throw error;
    }

    // Parse response
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    const result = {
      data,
      status: response.status,
      headers: response.headers,
      requestId
    };

    // Apply response interceptors
    return applyResponseInterceptorsSuccess(result);

  } catch (error) {
    clearTimeout(timeoutId);
    activeRequests.delete(requestId);

    // Check for retry on network errors
    if (isRetriableError(error, null) && retryCount < API_CONFIG.RETRY.MAX_RETRIES) {
      await sleep(getRetryDelay(retryCount));
      return apiRequest(endpoint, { ...options, requestId }, retryCount + 1);
    }

    return applyResponseInterceptorsError(error);
  }
};

/**
 * API client methods
 */
const apiClient = {
  get: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),

  post: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    }),

  put: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  patch: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    }),

  delete: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),

  // Upload file(s)
  upload: (endpoint, formData, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        ...tokenService.getAuthHeader()
        // Don't set Content-Type - browser will set it with boundary
      }
    }),

  // Utility methods
  cancelRequest,
  cancelAllRequests
};

export default apiClient;

// Setup default interceptors

// Auth token refresh interceptor
addResponseInterceptor(
  (response) => response,
  async (error) => {
    // If 401 and not already retrying, try to refresh token
    if (error.status === 401 && !error.config?._retry) {
      // For now, just redirect to login since we don't have real auth
      // In production, this would attempt token refresh
      console.warn('Authentication required - would redirect to login');
    }
    throw error;
  }
);

// Logging interceptor (development only)
if (process.env.NODE_ENV === 'development') {
  addRequestInterceptor((config) => {
    console.log(`[API] ${config.method} ${config.url || 'request'}`, config);
    return config;
  });

  addResponseInterceptor(
    (response) => {
      console.log(`[API] Response:`, response.status, response.data);
      return response;
    },
    (error) => {
      console.error(`[API] Error:`, error.status, error.message);
      throw error;
    }
  );
}
