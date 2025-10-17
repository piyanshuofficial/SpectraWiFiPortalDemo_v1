// src/components/Loading/Spinner.js

import React from 'react';
import './Spinner.css';

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
      <span className="spinner-inner" />
    </div>
  );
};

export default Spinner;