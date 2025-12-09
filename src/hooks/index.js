// src/hooks/index.js

/**
 * Central export file for all custom hooks
 * Import hooks from here for consistency across the application
 * 
 * @example
 * // Import individual hooks
 * import { usePermissions, useSort } from '../hooks';
 * 
 * // Or import all hooks
 * import * as hooks from '../hooks';
 */

export { usePermissions } from './usePermissions';
export { useSort } from './useSort';
export { useFilter } from './useFilter';
export { useTableState } from './useTableState';
export { useSiteConfig } from './useSiteConfig';
export { useBulkOperations } from './useBulkOperations';
export { useVideoDurations } from './useVideoDurations';
export { useDebounce, useDebouncedCallback, useDebouncedSearch } from './useDebounce';
export { useVirtualScroll, useInfiniteScroll } from './useVirtualScroll';

/**
 * Hook Usage Guide:
 * 
 * usePermissions - Manage user permissions
 * ===============================================
 * const { hasPermission, canEditUsers, canViewReports, canManageDevices } = usePermissions();
 * 
 * useSort - Handle table sorting
 * ===============================================
 * const { sortedData, sortColumn, sortDirection, handleSort, getSortIndicator } = 
 *   useSort(data, 'id', 'asc');
 * 
 * useFilter - Manage data filtering
 * ===============================================
 * const { 
 *   filteredData, 
 *   searchTerm, 
 *   setSearchTerm, 
 *   filters, 
 *   setFilter, 
 *   clearFilters, 
 *   activeFilterCount 
 * } = useFilter(data, filterFunction);
 * 
 * useTableState - Manage pagination and columns
 * ===============================================
 * const { 
 *   currentPage, 
 *   setCurrentPage, 
 *   rowsPerPage, 
 *   setRowsPerPage, 
 *   visibleColumns, 
 *   toggleColumn, 
 *   setVisibleColumns,
 *   resetToPage1 
 * } = useTableState(10, ['id', 'name', 'email']);
 */