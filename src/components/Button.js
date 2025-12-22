/**
 * ============================================================================
 * Button Component
 * ============================================================================
 *
 * @file src/components/Button.js
 * @description Reusable button component used throughout the portal for all
 *              user interactions. Provides consistent styling and behavior
 *              across both Customer Portal and Internal Portal.
 *
 * @usage
 * ```jsx
 * // Basic usage
 * <Button onClick={handleClick}>Click Me</Button>
 *
 * // With variant and loading state
 * <Button variant="danger" loading={isDeleting} onClick={handleDelete}>
 *   Delete User
 * </Button>
 *
 * // Submit button in forms
 * <Button type="submit" variant="success" disabled={!isValid}>
 *   Save Changes
 * </Button>
 * ```
 *
 * @variants
 * - primary   : Blue - Default action buttons (Add, Submit, Confirm)
 * - secondary : Gray - Cancel, Back, or alternative actions
 * - danger    : Red - Delete, Remove, Revoke actions
 * - success   : Green - Success confirmations, Activate actions
 * - warning   : Orange - Suspend, Block, or caution actions
 * - info      : Light blue - Information or help actions
 *
 * @accessibility
 * - Supports aria-label for screen readers
 * - Shows loading spinner with aria-busy attribute
 * - Disabled state prevents interaction and shows visual feedback
 *
 * @dependencies
 * - Button.css : Styles for all button variants and states
 *
 * @usedIn
 * - All form modals (UserFormModal, DeviceFormModal, etc.)
 * - Toolbar actions in list pages
 * - Confirmation modals
 * - Card action buttons
 *
 * ============================================================================
 */

import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

/**
 * Button - Primary interactive element for user actions
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content (text, icon, etc.)
 * @param {Function} props.onClick - Click event handler
 * @param {string} props.variant - Visual style variant
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {boolean} props.loading - Shows loading spinner when true
 * @param {string} props.type - HTML button type (button, submit, reset)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.title - Tooltip text on hover
 * @param {Object} props.style - Inline style object
 * @param {string} props.aria-label - Accessibility label
 * @returns {JSX.Element} Rendered button element
 */
const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  type = 'button',
  className = '',
  title,
  style,
  'aria-label': ariaLabel,
  ...rest 
}) => {
  const buttonClass = `btn btn-${variant} ${loading ? 'btn-loading' : ''} ${className}`.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      aria-label={ariaLabel || title}
      aria-busy={loading}
      style={style}
      {...rest}
    >
      {loading && (
        <span className="btn-loader" aria-hidden="true"></span>
      )}
      {children}
    </button>
  );
};

Button.propTypes = {
  /** Content to be rendered inside the button */
  children: PropTypes.node.isRequired,
  
  /** Click handler function */
  onClick: PropTypes.func,
  
  /** Visual style variant of the button */
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'warning', 'info']),
  
  /** Whether the button is disabled */
  disabled: PropTypes.bool,
  
  /** Whether the button is in loading state */
  loading: PropTypes.bool,
  
  /** HTML button type attribute */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  
  /** Additional CSS classes */
  className: PropTypes.string,
  
  /** Tooltip text */
  title: PropTypes.string,
  
  /** Inline styles object */
  style: PropTypes.object,
  
  /** Accessibility label */
  'aria-label': PropTypes.string,
};

Button.defaultProps = {
  variant: 'primary',
  disabled: false,
  loading: false,
  type: 'button',
  className: '',
  onClick: undefined,
  title: undefined,
  style: undefined,
  'aria-label': undefined,
};

export default Button;