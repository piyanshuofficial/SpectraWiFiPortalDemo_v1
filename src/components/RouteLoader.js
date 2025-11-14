// src/components/RouteLoader.js

import React from 'react';
import Spinner from '@components/Loading/Spinner';

/**
 * Loading component shown while route chunks are loading
 * Used as Suspense fallback
 */
const RouteLoader = ({ message = 'Loading page...' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9fafc'
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
    >
      <Spinner size="lg" color="primary" />
      <p
        style={{
          marginTop: '1.5rem',
          fontSize: '1rem',
          fontWeight: '500',
          color: '#555'
        }}
        aria-live="polite"
      >
        {message}
      </p>
    </div>
  );
};

export default RouteLoader;