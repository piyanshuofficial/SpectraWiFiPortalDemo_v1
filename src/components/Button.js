// src/components/Button.js

import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

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
      {loading ? (
        <span className="btn-loader" aria-hidden="true"></span>
      ) : null}
      <span className={loading ? 'btn-content-loading' : ''}>
        {children}
      </span>
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