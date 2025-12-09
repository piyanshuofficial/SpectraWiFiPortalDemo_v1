// src/utils/notifications.js

import React from 'react';
import { toast } from "react-toastify";
import i18next from 'i18next';
import Spinner from '../components/Loading/Spinner';

// Helper to get translated message
const t = (key, options) => i18next.t(key, options);

/**
 * Centralized notification system for the application
 * Provides consistent toast notifications with standardized configuration
 */

// Default toast configuration
const DEFAULT_CONFIG = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Extended configurations for different notification types
const EXTENDED_CONFIG = {
  success: {
    ...DEFAULT_CONFIG,
    autoClose: 2500,
  },
  error: {
    ...DEFAULT_CONFIG,
    autoClose: 4000,
  },
  warning: {
    ...DEFAULT_CONFIG,
    autoClose: 3500,
  },
  info: {
    ...DEFAULT_CONFIG,
    autoClose: 3000,
  },
};

/**
 * Display a success notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast configuration overrides
 */
export const showSuccess = (message, options = {}) => {
  return toast.success(message, { ...EXTENDED_CONFIG.success, ...options });
};

/**
 * Display an error notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast configuration overrides
 */
export const showError = (message, options = {}) => {
  // ========================================
  // TODO: Backend Integration - Error Logging and Tracking
  // ========================================
  // When critical errors occur, log them to backend for monitoring
  // 
  // For error notifications, send to error tracking service:
  // if (options.critical || options.logToBackend) {
  //   fetch('/api/errors/log', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       level: 'error',
  //       message: message,
  //       context: options.context || {},
  //       userId: currentUser?.id,
  //       timestamp: new Date().toISOString(),
  //       userAgent: navigator.userAgent,
  //       url: window.location.href
  //     })
  //   }).catch(err => console.error('Error logging failed:', err));
  // }
  // 
  // Integration with monitoring tools:
  // - Sentry for error tracking
  // - DataDog for APM
  // - Custom analytics platform
  // 
  // Track error patterns:
  // - Frequency by error type
  // - User impact (which users affected)
  // - Time-based trends
  // - Correlation with deployments
  // ========================================
  
  return toast.error(message, { ...EXTENDED_CONFIG.error, ...options });
};

/**
 * Display a warning notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast configuration overrides
 */
export const showWarning = (message, options = {}) => {
  return toast.warn(message, { ...EXTENDED_CONFIG.warning, ...options });
};

/**
 * Display an info notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast configuration overrides
 */
export const showInfo = (message, options = {}) => {
  return toast.info(message, { ...EXTENDED_CONFIG.info, ...options });
};

/**
 * Custom loading content component
 * Ensures only the spinner rotates, not the text
 */
const LoadingContent = ({ message }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <Spinner size="sm" color="primary" />
    <span>{message}</span>
  </div>
);

/**
 * Display a loading notification that returns a toast ID
 * Used for operations that need to update the notification later
 * @param {string} message - The loading message to display
 * @param {object} options - Optional toast configuration overrides
 * @returns {string|number} Toast ID for updating later
 */
export const showLoading = (message, options = {}) => {
  return toast.info(<LoadingContent message={message} />, {
    ...DEFAULT_CONFIG,
    autoClose: false,
    closeButton: false,
    ...options
  });
};

/**
 * Update an existing toast notification
 * @param {string|number} toastId - The ID of the toast to update
 * @param {object} updateConfig - Configuration for the update
 * @param {string} updateConfig.render - New message to display
 * @param {string} updateConfig.type - New type (success, error, warning, info)
 * @param {boolean} updateConfig.isLoading - Whether still loading
 * @param {object} updateConfig.options - Additional toast options
 */
export const updateToast = (toastId, { render, type = "default", isLoading = false, ...options }) => {
  const config = {
    render,
    type,
    isLoading,
    ...DEFAULT_CONFIG,
    ...options,
  };
  return toast.update(toastId, config);
};

/**
 * Dismiss a specific toast or all toasts
 * @param {string|number} toastId - Optional toast ID to dismiss. If not provided, dismisses all
 */
export const dismissToast = (toastId) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

/**
 * Dismiss all active toasts before showing a new one
 * Useful for preventing old loading toasts from lingering
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};

/**
 * Promise-based notification for async operations
 * Automatically shows loading, success, or error states
 * @param {Promise} promise - The promise to track
 * @param {object} messages - Messages for different states
 * @param {string} messages.pending - Message while loading
 * @param {string} messages.success - Message on success
 * @param {string} messages.error - Message on error
 * @param {object} options - Optional toast configuration overrides
 */
export const showPromise = (promise, { pending, success, error }, options = {}) => {
  // ========================================
  // TODO: Backend Integration - Operation Status Tracking
  // ========================================
  // Track long-running operations in backend for better UX
  // 
  // For operations that take >3 seconds:
  // const operationId = generateUUID();
  // 
  // // Start operation on backend
  // fetch('/api/operations/start', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     operationId,
  //     type: 'bulk_user_import',
  //     userId: currentUser.id,
  //     startedAt: new Date().toISOString()
  //   })
  // });
  // 
  // // Poll for status
  // const pollInterval = setInterval(async () => {
  //   const response = await fetch(`/api/operations/${operationId}/status`);
  //   const result = await response.json();
  //   
  //   if (result.data.status === 'completed') {
  //     clearInterval(pollInterval);
  //     updateToast(toastId, { render: success, type: 'success' });
  //   } else if (result.data.status === 'failed') {
  //     clearInterval(pollInterval);
  //     updateToast(toastId, { render: error, type: 'error' });
  //   }
  //   // Show progress: "Processing 450/1000 users..."
  // }, 2000);
  // 
  // Benefits:
  // - Accurate progress tracking
  // - Resume capability after page reload
  // - Better error recovery
  // - User can navigate away and return
  // ========================================
  
  return toast.promise(
    promise,
    {
      pending: {
        render: () => <LoadingContent message={pending || "Processing..."} />,
      },
      success: success || "Operation completed successfully",
      error: error || "Operation failed",
    },
    { ...DEFAULT_CONFIG, ...options }
  );
};

// Specialized notifications for common operations
export const notifications = {
  // Direct access to show methods
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showLoading,
  updateToast,
  dismissToast,
  dismissAllToasts,
  showPromise,

  // User Management
  userAdded: () => showSuccess(t('notifications.userAdded')),
  userUpdated: () => showSuccess(t('notifications.userUpdated')),
  userDeleted: () => showSuccess(t('notifications.userDeleted')),
  userActivated: (userId) => showSuccess(t('notifications.userActivated', { userId })),
  userSuspended: (userId) => showWarning(t('notifications.userSuspended', { userId })),
  userBlocked: (userId) => showError(t('notifications.userBlocked', { userId })),

  // Device Management
  deviceRegistered: (deviceName) => showSuccess(t('notifications.deviceRegistered', { name: deviceName })),
  deviceBlocked: (deviceName) => showWarning(t('notifications.deviceBlocked', { name: deviceName })),
  deviceAlreadyBlocked: (deviceName) => showInfo(t('notifications.deviceAlreadyBlocked', { name: deviceName })),

  // Export Operations
  exportSuccess: (type = "file") => showSuccess(t('notifications.exportSuccess', { type })),
  exportFailed: (type = "file") => showError(t('notifications.exportFailed', { type })),

  // Permission Errors
  noPermission: (action) => showError(t('notifications.noPermission', { action })),

  // License Warnings
  licenseFull: () => showError(t('notifications.licenseFull')),

  // Generic Operations
  operationSuccess: (operation) => showSuccess(t('notifications.operationSuccess', { operation })),
  operationFailed: (operation) => showError(t('notifications.operationFailed', { operation })),

  // Validation
  validationError: (message) => showError(message || t('notifications.validationError')),

  // Loading
  loading: (message) => showLoading(message || t('common.processing')),

  // Simple pass-through for direct messages
  success: (message) => showSuccess(message),
  error: (message) => showError(message),
  warning: (message) => showWarning(message),
  info: (message) => showInfo(message),

  // Custom
  custom: {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
  }
};

// Export individual functions and the notifications object
export default notifications;