// src/hooks/useSort.js

import { useState, useMemo, useCallback } from 'react';

/**
 * Custom hook for managing table sorting
 * 
 * @param {Array} data - Array of items to sort
 * @param {string|null} initialColumn - Initial column to sort by
 * @param {string} initialDirection - Initial sort direction ('asc' or 'desc')
 * 
 * @returns {Object} Object containing:
 *   - sortedData: Sorted array of items
 *   - sortColumn: Current sort column
 *   - sortDirection: Current sort direction
 *   - handleSort: Function to change sort column/direction
 *   - getSortIndicator: Function to get sort indicator component
 * 
 * @example
 * const { sortedData, handleSort, getSortIndicator } = useSort(users, 'id', 'asc');
 * <th onClick={() => handleSort('name')}>
 *   Name {getSortIndicator('name')}
 * </th>
 */
export const useSort = (data, initialColumn = null, initialDirection = 'asc') => {
  const [sortColumn, setSortColumn] = useState(initialColumn);
  const [sortDirection, setSortDirection] = useState(initialDirection);

  const handleSort = useCallback((column) => {
    setSortColumn(prevColumn => {
      if (prevColumn === column) {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        return column;
      } else {
        setSortDirection('asc');
        return column;
      }
    });
  }, []);

  const sortedData = useMemo(() => {
    if (!sortColumn || !data) return data;

    return [...data].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      
      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;
      
      const isNumber = typeof valA === 'number' && typeof valB === 'number';
      
      if (isNumber) {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      
      return sortDirection === 'asc'
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
    });
  }, [data, sortColumn, sortDirection]);

  const getSortIndicator = useCallback((column) => {
    if (sortColumn !== column) return null;
    return sortDirection;
  }, [sortColumn, sortDirection]);

  return {
    sortedData,
    sortColumn,
    sortDirection,
    handleSort,
    getSortIndicator,
  };
};