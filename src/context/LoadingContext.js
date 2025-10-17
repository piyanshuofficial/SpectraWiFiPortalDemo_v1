// src/context/LoadingContext.js

import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({
    global: false,
    users: false,
    devices: false,
    reports: false,
    export: false,
  });

  const setLoading = (key, value) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const startLoading = (key) => setLoading(key, true);
  const stopLoading = (key) => setLoading(key, false);

  const isLoading = (key) => loadingStates[key] || false;
  const isAnyLoading = () => Object.values(loadingStates).some(val => val === true);

  return (
    <LoadingContext.Provider value={{ 
      loadingStates, 
      setLoading, 
      startLoading, 
      stopLoading, 
      isLoading,
      isAnyLoading 
    }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};