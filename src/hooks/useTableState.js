/**
 * ============================================================================
 * useTableState Hook
 * ============================================================================
 *
 * @file src/hooks/useTableState.js
 * @description Manages common table UI state including pagination and
 *              column visibility. Used by all data table components.
 *
 * @stateManaged
 * | State           | Description                               | Default              |
 * |-----------------|-------------------------------------------|----------------------|
 * | currentPage     | Current page number (1-indexed)           | 1                    |
 * | rowsPerPage     | Number of rows displayed per page         | From appConstants    |
 * | visibleColumns  | Array of column keys to display           | defaultVisibleColumns|
 *
 * @paginationCalculation
 * ```
 * Total items: 100
 * Rows per page: 10
 * Current page: 3
 *
 * Start index: (3-1) * 10 = 20
 * End index: 30
 * Displayed items: items[20..29]
 * ```
 *
 * @columnVisibility
 * Tables can have many columns but not all need to be shown at once.
 * Users can toggle columns on/off. Example:
 * ```
 * All columns: ['id', 'name', 'email', 'phone', 'role', 'status', 'created']
 * Visible:     ['name', 'email', 'role', 'status']
 * Hidden:      ['id', 'phone', 'created']
 * ```
 *
 * @usage
 * ```jsx
 * const UserTable = () => {
 *   const {
 *     currentPage,
 *     setCurrentPage,
 *     rowsPerPage,
 *     setRowsPerPage,
 *     visibleColumns,
 *     toggleColumn,
 *     resetToPage1
 *   } = useTableState(10, ['name', 'email', 'role']);
 *
 *   // When filter changes, reset to page 1
 *   const handleFilterChange = (filter) => {
 *     setFilter(filter);
 *     resetToPage1();
 *   };
 *
 *   // Paginate data
 *   const startIdx = (currentPage - 1) * rowsPerPage;
 *   const pageData = users.slice(startIdx, startIdx + rowsPerPage);
 *
 *   return (
 *     <Table>
 *       <thead>
 *         {visibleColumns.map(col => <th key={col}>{col}</th>)}
 *       </thead>
 *       ...
 *     </Table>
 *   );
 * };
 * ```
 *
 * @dependencies
 * - appConstants.js : PAGINATION.DEFAULT_ROWS_PER_PAGE
 *
 * @usedIn
 * - UserList.js      : User management table
 * - DeviceList.js    : Device management table
 * - ActivityLogs.js  : Activity log table
 * - GuestManagement.js : Guest user table
 *
 * ============================================================================
 */

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