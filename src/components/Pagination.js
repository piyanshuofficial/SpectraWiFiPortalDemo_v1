// src/components/Pagination.js

import React from "react";
import PropTypes from "prop-types";
import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { PAGINATION, COMPONENT_SIZES } from "@constants/appConstants";

const Pagination = ({
  totalItems,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  currentPage,
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  if (totalPages === 0) return null;

  // ========================================
  // TODO: Backend Integration - Server-Side Pagination
  // ========================================
  // Current Implementation: Client-side pagination (all data loaded)
  // This works for small datasets but needs backend pagination for scale
  // 
  // For production with large user counts (>1000), implement:
  // 
  // When page changes:
  // const handlePageChange = async (newPage) => {
  //   try {
  //     const response = await fetch(
  //       `/api/users?page=${newPage}&limit=${rowsPerPage}&siteId=${siteId}&segment=${segment}&sort=${sortBy}&order=${sortOrder}`
  //     );
  //     const result = await response.json();
  //     
  //     if (result.success) {
  //       // Update parent component with new page data
  //       onPageDataReceived(result.data.users);
  //       onPageChange(newPage);
  //     }
  //   } catch (error) {
  //     console.error('Pagination error:', error);
  //     notifications.operationFailed('load page');
  //   }
  // };
  // 
  // Backend Endpoint: GET /api/users
  // Query Parameters:
  // - page: page number (1-based)
  // - limit: items per page
  // - siteId: current site
  // - segment: filter by segment
  // - sort: sort column
  // - order: asc/desc
  // - search: search term (optional)
  // - filters: JSON encoded filters (optional)
  // 
  // Response Format:
  // {
  //   success: true,
  //   data: {
  //     users: [...], // Current page items
  //     pagination: {
  //       currentPage: number,
  //       totalPages: number,
  //       totalItems: number,
  //       itemsPerPage: number,
  //       hasNextPage: boolean,
  //       hasPrevPage: boolean
  //     }
  //   }
  // }
  // 
  // Benefits:
  // - Reduced memory usage on client
  // - Faster initial load
  // - Better performance with large datasets
  // - Lower bandwidth usage
  // 
  // Implementation Notes:
  // - Use database LIMIT/OFFSET for efficient queries
  // - Cache recent pages in Redis for faster navigation
  // - Implement cursor-based pagination for real-time data
  // - Handle race conditions when data changes during navigation
  // ========================================

  const createPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          aria-current={currentPage === i ? "page" : undefined}
          aria-label={`${currentPage === i ? 'Current page, ' : ''}Page ${i}`}
          className={`pagination-btn ${currentPage === i ? "active" : ""}`}
          type="button"
          style={{
            border: "1px solid #c8d2e8",
            background: currentPage === i ? "#204094" : "#f6f8fb",
            color: currentPage === i ? "#fff" : "#17418f",
            fontSize: "0.8rem",
            borderRadius: "4px",
            width: `${COMPONENT_SIZES.PAGINATION_BUTTON_SIZE}px`,
            height: `${COMPONENT_SIZES.PAGINATION_BUTTON_HEIGHT}px`,
            cursor: "pointer",
            transition: "background 0.15s, color 0.15s, border-color 0.15s",
            lineHeight: "1.2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: currentPage === i ? "600" : "normal",
            margin: "0 2px"
          }}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <nav 
      className="pagination-bar" 
      role="navigation" 
      aria-label="Pagination Navigation"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        background: "transparent",
        padding: "6px 0 0 0",
        marginBottom: "8px",
        boxShadow: "none",
        borderRadius: "0",
        width: "100%"
      }}
    >
      <div className="pagination-left" style={{
        display: "flex",
        alignItems: "center",
        gap: "6px"
      }}>
        <label htmlFor="rows-per-page-select" className="rows-per-page-label" style={{
          fontWeight: "600",
          color: "#204094",
          fontSize: "0.8rem",
          marginRight: "6px",
          fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
        }}>
          Rows per page:
        </label>
        <select
          id="rows-per-page-select"
          className="rows-per-page-select"
          aria-label="Select number of rows per page"
          value={rowsPerPage}
          onChange={e => {
            const newRowsPerPage = Number(e.target.value);
            onRowsPerPageChange(newRowsPerPage);
            
            // ========================================
            // TODO: Backend Integration - Save Rows Per Page Preference
            // ========================================
            // Save user's rows per page preference to backend
            // 
            // Debounced save to avoid excessive API calls:
            // const savePreference = debounce(async (value) => {
            //   try {
            //     await fetch(`/api/users/${currentUserId}/preferences/pagination`, {
            //       method: 'PUT',
            //       headers: { 'Content-Type': 'application/json' },
            //       body: JSON.stringify({ rowsPerPage: value })
            //     });
            //   } catch (error) {
            //     console.error('Failed to save preference:', error);
            //   }
            // }, 1000);
            // 
            // savePreference(newRowsPerPage);
            // 
            // Also save to localStorage for immediate persistence:
            // localStorage.setItem('userListRowsPerPage', newRowsPerPage);
            // ========================================
          }}
          style={{
            borderRadius: "4px",
            border: "1px solid #cfd7ea",
            fontSize: "0.8rem",
            padding: "4px 8px",
            background: "#f8faff",
            outlineOffset: "2px",
            fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
            transition: "border-color 0.2s ease",
            marginRight: "4px",
            lineHeight: "1.2"
          }}
        >
          {PAGINATION.ROWS_PER_PAGE_OPTIONS.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
      <div className="pagination-right" style={{
        marginLeft: "auto",
        display: "flex",
        alignItems: "center"
      }}>
        <div 
          className="pagination-buttons" 
          role="group"
          aria-label="Pagination controls"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="pagination-btn"
            aria-label="Go to first page"
            type="button"
            style={{
              border: "1px solid #c8d2e8",
              background: currentPage === 1 ? "#f0f2f5" : "#f6f8fb",
              color: currentPage === 1 ? "#b5bacd" : "#17418f",
              fontSize: "0.8rem",
              borderRadius: "4px",
              width: `${COMPONENT_SIZES.PAGINATION_BUTTON_SIZE}px`,
              height: `${COMPONENT_SIZES.PAGINATION_BUTTON_HEIGHT}px`,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
              lineHeight: "1.2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FaAngleDoubleLeft aria-hidden="true" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
            aria-label="Go to previous page"
            type="button"
            style={{
              border: "1px solid #c8d2e8",
              background: currentPage === 1 ? "#f0f2f5" : "#f6f8fb",
              color: currentPage === 1 ? "#b5bacd" : "#17418f",
              fontSize: "0.8rem",
              borderRadius: "4px",
              width: `${COMPONENT_SIZES.PAGINATION_BUTTON_SIZE}px`,
              height: `${COMPONENT_SIZES.PAGINATION_BUTTON_HEIGHT}px`,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
              lineHeight: "1.2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FaAngleLeft aria-hidden="true" />
          </button>
          {createPageButtons()}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
            aria-label="Go to next page"
            type="button"
            style={{
              border: "1px solid #c8d2e8",
              background: currentPage === totalPages ? "#f0f2f5" : "#f6f8fb",
              color: currentPage === totalPages ? "#b5bacd" : "#17418f",
              fontSize: "0.8rem",
              borderRadius: "4px",
              width: `${COMPONENT_SIZES.PAGINATION_BUTTON_SIZE}px`,
              height: `${COMPONENT_SIZES.PAGINATION_BUTTON_HEIGHT}px`,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
              lineHeight: "1.2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FaAngleRight aria-hidden="true" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
            aria-label="Go to last page"
            type="button"
            style={{
              border: "1px solid #c8d2e8",
              background: currentPage === totalPages ? "#f0f2f5" : "#f6f8fb",
              color: currentPage === totalPages ? "#b5bacd" : "#17418f",
              fontSize: "0.8rem",
              borderRadius: "4px",
              width: `${COMPONENT_SIZES.PAGINATION_BUTTON_SIZE}px`,
              height: `${COMPONENT_SIZES.PAGINATION_BUTTON_HEIGHT}px`,
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              transition: "background 0.15s, color 0.15s, border-color 0.15s",
              lineHeight: "1.2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <FaAngleDoubleRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </nav>
  );
};

Pagination.propTypes = {
  /** Total number of items to paginate */
  totalItems: PropTypes.number.isRequired,
  /** Number of rows displayed per page */
  rowsPerPage: PropTypes.number.isRequired,
  /** Callback function when page changes, receives new page number */
  onPageChange: PropTypes.func.isRequired,
  /** Callback function when rows per page changes, receives new value */
  onRowsPerPageChange: PropTypes.func.isRequired,
  /** Current active page number (1-indexed) */
  currentPage: PropTypes.number.isRequired,
};

export default Pagination;