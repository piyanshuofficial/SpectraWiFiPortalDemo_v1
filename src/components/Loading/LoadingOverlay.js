// src/components/Loading/LoadingOverlay.js

import React from 'react';
import Spinner from '@components/Loading/Spinner';
import '@components/Loading/LoadingOverlay.css';

/**
 * Full-page or container loading overlay
 * @param {boolean} active - Whether overlay is visible
 * @param {string} message - Optional loading message
 * @param {boolean} fullPage - Whether to cover full viewport
 */
const LoadingOverlay = ({ 
  active = false, 
  message = 'Loading...', 
  fullPage = false 
}) => {
  if (!active) return null;

  return (
    <div 
      className={`loading-overlay ${fullPage ? 'loading-overlay-fullpage' : ''}`}
      role="alert"
      aria-busy="true"
      aria-live="assertive"
      aria-label={message}
    >
      <div className="loading-overlay-content">
        <Spinner size="lg" color="primary" />
        {message && (
          <p className="loading-overlay-message" aria-live="polite">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;