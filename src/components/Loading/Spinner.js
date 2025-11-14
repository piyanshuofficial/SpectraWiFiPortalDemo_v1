// src/components/Loading/Spinner.js

import React from 'react';
import '@components/Loading/Spinner.css';

/**
 * Reusable Spinner component
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 * @param {string} color - Color variant: 'primary', 'white', 'secondary'
 * @param {string} className - Additional CSS classes
 */
const Spinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`spinner spinner-${size} spinner-${color} ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      {...props}
    >
      <span className="spinner-inner" aria-hidden="true" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;