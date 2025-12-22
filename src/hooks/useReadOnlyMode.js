/**
 * ============================================================================
 * useReadOnlyMode Hook
 * ============================================================================
 *
 * @file src/hooks/useReadOnlyMode.js
 * @description Provides utilities for handling read-only mode throughout the
 *              portal. Read-only mode is activated when internal staff are
 *              impersonating a customer (customer view mode).
 *
 * @concept
 * When internal staff "View as Customer", they can see what customers see
 * but CANNOT make changes. This hook provides utilities to:
 * - Check if currently in read-only mode
 * - Disable buttons and show tooltips
 * - Block actions with warning notifications
 *
 * @readOnlyTriggers
 * Read-only mode is active when:
 * - Internal staff is impersonating a customer
 * - Customer-level user is in company view (aggregated view)
 *
 * @utilitiesProvided
 * | Function         | Description                                     |
 * |------------------|-------------------------------------------------|
 * | isReadOnly       | Boolean - Is read-only mode active?             |
 * | wrapAction()     | Wraps handler to show warning when read-only    |
 * | getDisabledProps()| Returns props to disable button                |
 * | blockAction()    | Shows warning and returns true if should block  |
 *
 * @usage
 * ```jsx
 * import { useReadOnlyMode } from '@hooks/useReadOnlyMode';
 *
 * const EditButton = ({ onEdit }) => {
 *   const { isReadOnly, wrapAction, getDisabledProps } = useReadOnlyMode();
 *
 *   // Method 1: Wrap the click handler
 *   const handleEdit = wrapAction(onEdit, "Edit user");
 *
 *   // Method 2: Spread disabled props
 *   return (
 *     <Button
 *       onClick={handleEdit}
 *       {...getDisabledProps("Edit user")}
 *     >
 *       Edit
 *     </Button>
 *   );
 * };
 *
 * // Method 3: Manual check before action
 * const handleSave = () => {
 *   const { blockAction } = useReadOnlyMode();
 *   if (blockAction("Save changes")) return;
 *
 *   // Proceed with save...
 * };
 * ```
 *
 * @disabledPropsReturned
 * When read-only:
 * ```javascript
 * {
 *   disabled: true,
 *   title: "Edit user is disabled while viewing as customer",
 *   style: { opacity: 0.5, cursor: "not-allowed" }
 * }
 * ```
 *
 * @notifications
 * When an action is blocked, shows a warning toast:
 * "Edit user is disabled in customer view mode. You are viewing as 'Acme Corp'."
 *
 * @dependencies
 * - CustomerViewContext : Provides isReadOnlyMode state
 * - notifications.js    : For showing warning toasts
 *
 * @relatedFiles
 * - CustomerViewContext.js : Source of read-only state
 * - UserFormModal.js       : Uses this to disable save
 * - DeviceFormModal.js     : Uses this to disable actions
 *
 * ============================================================================
 */

import { useCustomerView } from "@context/CustomerViewContext";
import notifications from "@utils/notifications";

/**
 * Hook to check and handle read-only mode for customer impersonation
 * @returns {Object} Read-only mode utilities
 */
export const useReadOnlyMode = () => {
  const { isReadOnlyMode, isImpersonating, impersonatedCustomer } = useCustomerView();

  /**
   * Check if currently in read-only mode
   */
  const isReadOnly = isReadOnlyMode;

  /**
   * Wrap a click handler to show warning when in read-only mode
   * @param {Function} handler - Original click handler
   * @param {string} actionName - Name of the action for the warning message
   * @returns {Function} Wrapped handler that blocks when read-only
   */
  const wrapAction = (handler, actionName = "This action") => {
    return (...args) => {
      if (isReadOnly) {
        notifications.showWarning(
          `${actionName} is disabled in customer view mode. You are viewing as "${impersonatedCustomer?.name}".`
        );
        return;
      }
      return handler(...args);
    };
  };

  /**
   * Get props to disable a button in read-only mode
   * @param {string} actionName - Name of the action for tooltip
   * @returns {Object} Props to spread on button element
   */
  const getDisabledProps = (actionName = "This action") => {
    if (!isReadOnly) return {};

    return {
      disabled: true,
      title: `${actionName} is disabled while viewing as customer`,
      style: { opacity: 0.5, cursor: "not-allowed" },
    };
  };

  /**
   * Check if an action should be blocked and show notification
   * @param {string} actionName - Name of the action
   * @returns {boolean} True if action should be blocked
   */
  const blockAction = (actionName = "This action") => {
    if (isReadOnly) {
      notifications.showWarning(
        `${actionName} is disabled in customer view mode. You are viewing as "${impersonatedCustomer?.name}".`
      );
      return true;
    }
    return false;
  };

  return {
    isReadOnly,
    isImpersonating,
    impersonatedCustomer,
    wrapAction,
    getDisabledProps,
    blockAction,
  };
};

export default useReadOnlyMode;
