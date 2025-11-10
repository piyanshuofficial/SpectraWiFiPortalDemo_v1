// src/utils/notifications.js

import { toast } from "react-toastify";

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
 * Display a loading notification that returns a toast ID
 * Used for operations that need to update the notification later
 * @param {string} message - The loading message to display
 * @param {object} options - Optional toast configuration overrides
 * @returns {string|number} Toast ID for updating later
 */
export const showLoading = (message, options = {}) => {
  return toast.loading(message, { ...DEFAULT_CONFIG, ...options });
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
  return toast.promise(
    promise,
    {
      pending: pending || "Processing...",
      success: success || "Operation completed successfully",
      error: error || "Operation failed",
    },
    { ...DEFAULT_CONFIG, ...options }
  );
};

// Specialized notifications for common operations
export const notifications = {
  // User Management
  userAdded: () => showSuccess("User added successfully"),
  userUpdated: () => showSuccess("User updated successfully"),
  userDeleted: () => showSuccess("User deleted successfully"),
  userActivated: (userId) => showSuccess(`User ${userId} activated successfully`),
  userSuspended: (userId) => showWarning(`User ${userId} suspended`),
  userBlocked: (userId) => showError(`User ${userId} blocked`),
  
  // Device Management
  deviceRegistered: (deviceName) => showSuccess(`Device "${deviceName}" registered successfully`),
  deviceBlocked: (deviceName) => showWarning(`${deviceName} has been blocked`),
  deviceAlreadyBlocked: (deviceName) => showInfo(`${deviceName} is already blocked`),
  
  // Export Operations
  exportSuccess: (type = "file") => showSuccess(`${type} exported successfully`),
  exportFailed: (type = "file") => showError(`Failed to export ${type}`),
  
  // Permission Errors
  noPermission: (action) => showError(`You don't have permission to ${action}. Please contact your administrator.`),
  
  // License Warnings
  licenseFull: () => showError("Cannot add more users: all licenses are used. Please suspend or block an existing user or request additional licenses."),
  
  // Generic Operations
  operationSuccess: (operation) => showSuccess(`${operation} completed successfully`),
  operationFailed: (operation) => showError(`${operation} failed`),
  
  // Validation
  validationError: (message = "Please fix errors before submitting") => showError(message),
  
  // Loading
  loading: (message = "Processing...") => showLoading(message),
  
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