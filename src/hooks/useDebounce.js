// src/hooks/useDebounce.js
// Debounce hook for search optimization

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Debounce a value - delays updating until specified time has passed
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {any} - The debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Debounce a callback function
 * @param {Function} callback - The function to debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {Function} - The debounced function
 */
export const useDebouncedCallback = (callback, delay = 300) => {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Debounced search hook with loading state
 * @param {Function} searchFn - The search function to call
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {Object} - { searchTerm, setSearchTerm, isSearching, debouncedTerm }
 */
export const useDebouncedSearch = (searchFn, delay = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedTerm = useDebounce(searchTerm, delay);
  const previousTermRef = useRef('');

  useEffect(() => {
    // Only search if term actually changed
    if (debouncedTerm !== previousTermRef.current) {
      previousTermRef.current = debouncedTerm;

      if (debouncedTerm || previousTermRef.current) {
        setIsSearching(true);
        Promise.resolve(searchFn(debouncedTerm))
          .finally(() => setIsSearching(false));
      }
    }
  }, [debouncedTerm, searchFn]);

  // Set searching state immediately when user types
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    if (value !== debouncedTerm) {
      setIsSearching(true);
    }
  }, [debouncedTerm]);

  return {
    searchTerm,
    setSearchTerm: handleSearchChange,
    isSearching,
    debouncedTerm
  };
};

export default useDebounce;
