// src/hooks/useTableState.js

import { useState, useCallback } from 'react';
import { PAGINATION } from '../constants/appConstants';

/**
 * Custom hook for managing table pagination and visible columns
 * 
 * @param {number} initialRowsPerPage - Initial rows per page
 * @param {Array} defaultVisibleColumns - Default visible column keys
 * 
 * @returns {Object} Object containing:
 *   - currentPage: Current page number
 *   - setCurrentPage: Function to update current page
 *   - rowsPerPage: Current rows per page
 *   - setRowsPerPage: Function to update rows per page
 *   - visibleColumns: Array of visible column keys
 *   - toggleColumn: Function to toggle column visibility
 *   - setVisibleColumns: Function to set visible columns
 *   - resetToPage1: Function to reset to first page
 * 
 * @example
 * const { currentPage, rowsPerPage, setRowsPerPage, visibleColumns, toggleColumn } = 
 *   useTableState(10, ['id', 'name', 'email']);
 */
export const useTableState = (
  initialRowsPerPage = PAGINATION.DEFAULT_ROWS_PER_PAGE,
  defaultVisibleColumns = []
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);

  const toggleColumn = useCallback((columnKey) => {
    setVisibleColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(col => col !== columnKey)
        : [...prev, columnKey]
    );
  }, []);

  const resetToPage1 = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    visibleColumns,
    toggleColumn,
    setVisibleColumns,
    resetToPage1,
  };
};