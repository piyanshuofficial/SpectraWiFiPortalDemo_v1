// src/hooks/useFilter.js

import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for managing table filtering
 * 
 * @param {Array} data - Array of items to filter
 * @param {Function} filterFunction - Function that returns true if item should be included
 * 
 * @returns {Object} Object containing:
 *   - filteredData: Filtered array of items
 *   - searchTerm: Current search term
 *   - setSearchTerm: Function to update search term
 *   - filters: Object containing all active filters
 *   - setFilter: Function to set a specific filter
 *   - clearFilters: Function to clear all filters
 *   - activeFilterCount: Number of active filters
 * 
 * @example
 * const { filteredData, searchTerm, setSearchTerm, setFilter } = useFilter(
 *   users,
 *   (user, { searchTerm, statusFilter }) => {
 *     if (statusFilter && user.status !== statusFilter) return false;
 *     if (searchTerm && !user.name.includes(searchTerm)) return false;
 *     return true;
 *   }
 * );
 */
export const useFilter = (data, filterFunction) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({});
  }, []);

  const filteredData = useMemo(() => {
    if (!data) return [];
    
    return data.filter(item => 
      filterFunction(item, { searchTerm, ...filters })
    );
  }, [data, searchTerm, filters, filterFunction]);

  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length;
  }, [filters]);

  return {
    filteredData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilter,
    setFilters,
    clearFilters,
    activeFilterCount,
  };
};