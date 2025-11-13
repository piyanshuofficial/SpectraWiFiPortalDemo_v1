// src/context/LoadingContext.js

import React, { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({
    global: false,
    users: false,
    devices: false,
    reports: false,
    export: false,
    dashboard: false,
  });

  const setLoading = useCallback((key, value) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const startLoading = useCallback((key) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: true
    }));
  }, []);

  const stopLoading = useCallback((key) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: false
    }));
  }, []);

  const isLoading = useCallback((key) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(val => val === true);
  }, [loadingStates]);

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